// 📦 - IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// [ CORE ]
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useMemo, RefObject } from 'react'
import { useGLTF, useAnimations, useKeyboardControls, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'

// ─────────────────────────────────────────────────────────────────────────────
// [ STORES ]
// ─────────────────────────────────────────────────────────────────────────────
import { useDebugStore } from '../../stores/DebugStore'
import { useGameStore } from '../../stores/GameStore'
import { useConfigsStore } from '../../stores/ConfigsStore'
import { usePlayersStore } from '../../stores/PlayersStore'
import { useWebSocketStore } from '../../stores/WebsocketStore'

// ─────────────────────────────────────────────────────────────────────────────
// [ SERVICES & UTILITIES ]
// ─────────────────────────────────────────────────────────────────────────────
import { sendRequest } from "../../websocket/WsClient"
import { getClimaticZone } from './ClimaticZones'

// ─────────────────────────────────────────────────────────────────────────────
// [ SHARED TYPES & ENUMS ]
// ─────────────────────────────────────────────────────────────────────────────
import { PlayerType, AnimationNameType } from './../../../../shared/playerType'
// =============================================================================



// ⚙️ - INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────
// [ CONSTANTS & TYPES ]
// ─────────────────────────────────────────────────────────────────────────────
const UPDATE_RATE = 50                                                              // Defines how often it sends updates to the server
const MIN_UPDATE_DISTANCE = 1                                                       // Defines how much the Player has to move for the resouces to be requested
const LAST_RESOURCE_REQUEST_POSITION = new THREE.Vector3( Infinity )                // Stores in which position the player was when the last request for resources was made
const LAST_CLIMATIC_ZONE_REQUEST_POSITION = new THREE.Vector3( Infinity )           // Stores in which position the player was when the last climatic zone check happend
type ControlKeys = 'forward' | 'backward' | 'left' | 'right' | 'jump'               // Defines which keys will have a rection on this entity

type PlayerCharacterType = {
    forwardedRef: RefObject<RapierRigidBody | null>,
}

type GLTFPlayerType = {
    playerData: PlayerType,
    serverAddress: string,
    serverPort: number,
    forwardedRef: RefObject<RapierRigidBody | null>
}

type RenderBoxType = {
    width: number,
    depth: number,
    height: number
}
// =============================================================================



//  🧠 - HELPER FUNCTIONS 
/** 
* Send Player updates to server* 
* This functions gets called depending on the update rate, that means from time to time it will be called to update the server
* about the player position, animationName and so on
*/
const updatePlayer = function ( character: RapierRigidBody, playerData: PlayerType, currentAnimation: AnimationNameType ) {
    const setPosition = useDebugStore.getState().setPosition

    if ( character != null ) {
        const position = character.translation()
        const rawQuat = character.rotation()
        const rotationQuaternion = new THREE.Quaternion( rawQuat.x, rawQuat.y, rawQuat.z, rawQuat.w )
        const eulerRotation = new THREE.Euler().setFromQuaternion( rotationQuaternion )

        sendRequest( {
            header: 'REQ_PLAYER_UPDATE',
            payload: { 
                player: {
                    ...playerData,
                    animationName: currentAnimation,
                    position: [ 
                        parseFloat( position.x.toFixed( 1 ) ),
                        parseFloat( position.y.toFixed( 1 ) ),
                        parseFloat( position.z.toFixed( 1 ) )
                    ],
                    rotation: [ 
                        parseFloat( eulerRotation.x.toFixed( 1 ) ),
                        parseFloat( eulerRotation.y.toFixed( 1 ) ),
                        parseFloat( eulerRotation.z.toFixed( 1 ) )
                    ]
                },
                callerId: 'PlayerCharacter.tsx - updatePlayer'
            }
        })

        // Debug - Update Player Position
        setPosition( [ 
            parseFloat( position.x.toFixed( 1 ) ), 
            parseFloat( eulerRotation.y.toFixed( 1 ) ), 
            parseFloat( eulerRotation.z.toFixed( 1 ) ), 
        ] )
    }
}


/**
 * Function used to request an updated resource list from the server
 */
function requestResources( playerPosition: THREE.Vector3 ) {

    if ( playerPosition.distanceTo( LAST_RESOURCE_REQUEST_POSITION ) >= MIN_UPDATE_DISTANCE ) {
        LAST_RESOURCE_REQUEST_POSITION.copy( playerPosition )

        sendRequest( {
            header: 'REQ_MAP_RESOURCES_GET',
            payload: null
        } )
    }

}


/**
 * Function used to request an updates player list from the server
 */
function requestPlayers() {
    sendRequest( {
        header: 'REQ_PLAYERLIST_GET',
        payload: null
    } )
}


/**
 * Returns the player current renderbox
 */
function RenderBox( props: RenderBoxType ) {
    const height = props.height
    const halfW = props.width / 2
    const halfD = props.depth / 2
    return (
        <group>
            {/* Front Wall */}
            <mesh position={[0, props.height / 2, -halfD]}>
                <planeGeometry args={[props.width, height]} />
                <meshBasicMaterial color="lightblue" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>

            {/* Back Wall */}
            <mesh position={[0, height / 2, halfD]}>
                <planeGeometry args={[props.width, height]} />
                <meshBasicMaterial color="lightblue" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-halfW, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[props.depth, height]} />
                <meshBasicMaterial color="lightblue" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>

            {/* Right Wall */}
            <mesh position={[halfW, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[props.depth, height]} />
                <meshBasicMaterial color="lightblue" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>
        </group>
    )
}


/**
 * Gets the player climaticZone and store it on PlayersStore
 */
function updateClimaticZone( playerPosition: THREE.Vector3 ) {
    const mapSize = useGameStore.getState().mapSize
    const climaticZones = useGameStore.getState().climaticZonesVariation
    const currentTemperature = useGameStore.getState().gameCurrentTemperature

    const playerData = usePlayersStore.getState().playerData
    const setPlayerData = usePlayersStore.getState().setPlayerData

    if ( playerPosition.distanceTo( LAST_CLIMATIC_ZONE_REQUEST_POSITION ) >= MIN_UPDATE_DISTANCE ) {
        LAST_CLIMATIC_ZONE_REQUEST_POSITION.copy( playerPosition )

        const currentClimaticZone = getClimaticZone( playerPosition.z, mapSize )
        const bodyTemperature = currentTemperature + climaticZones[ currentClimaticZone ]
        
        const newPlayerData = { ...playerData, ...{ currentTemperature: bodyTemperature, currentClimaticZone: currentClimaticZone } }
        setPlayerData( newPlayerData )
    }

}
// =============================================================================



// 🧩 - COMPONENTS
/**
 * This component makes sure all the player data is loaded before instantiate the
 * GTLFPlayer component in the Scene Graph.
 */
export default function PlayerCharacter( props: PlayerCharacterType ) {
    const connectionId = useWebSocketStore( ( state ) => state.connectionId )
    const player = usePlayersStore(( state ) =>  state.playerList?.find( p => p.connectionId === connectionId ) || null )

    const serverAddress = useConfigsStore( ( state ) => state.serverAddress )
    const serverPort = useConfigsStore( ( state ) => state.serverPort )

    useEffect( () => {
        if ( player === null ) {
            sendRequest({
                header: 'REQ_PLAYER_GET',
                payload: {
                    cid: connectionId!
                }
            } )
        }
    }, [ player ] )


    if ( !player ) return null

    return <GLTFPlayer playerData={ player } serverAddress={ serverAddress } serverPort={ serverPort } {...props } />
}


/**
 * Component responsible for rendering the PlayerCharacter in the Scene Graph.
 */
function GLTFPlayer(props: GLTFPlayerType) {
    // Stores
    const showRenderBox = useDebugStore( ( state ) => state.showRenderBox )

    // Internal References
    const rigidBodyRef = useRef<RapierRigidBody>( null )                                            // Reference to the RigidBody
    const nameTagRef = useRef<THREE.Object3D>( null )                                               // Reference to the character nameTag
    const isMovingRef = useRef( false )                                                             // Tracker for Character Movement
    const currentAnimationRef = useRef<AnimationNameType>( null )                                   // Tracker for Character Current Animation

    // Keystrokes the character should listen to
    const forward = useKeyboardControls<ControlKeys>( ( state ) => state.forward )                  // Up || Forward
    const backward = useKeyboardControls<ControlKeys>( ( state ) => state.backward )                // Down || Backwards
    const left = useKeyboardControls<ControlKeys>( ( state ) => state.left )                        // Left
    const right = useKeyboardControls<ControlKeys>( ( state ) => state.right )                      // Right
    
    let lastUpdateTime = 0                                                                          // Used to throttle Character updates to server


    // Load model oly after player data is available
    // TODO - There's no server port stored for loading assets, props.port maps back to the socket
    // port which is currently 8080
    let gltf = useGLTF(`http://${ props.serverAddress }:8081/models/${ props.playerData.meshName }`)
    
    // Clone the scene ( mesh ) to make it safe for use and memoize it since it's very unlikely
    // to change
    const clonedInstance = useMemo(() => {
        const instance = clone( gltf.scene )
        instance.position.set( 0, 0, 0 )
        instance.rotation.set( 0, 0, 0 )
        return instance
    }, [gltf.scene] )

    // Animation actions
    const { actions } = useAnimations( gltf.animations, clonedInstance )


    // Assign the forwardedRef ( from parent ) to Character and set inital animation
    useEffect( () => {
        if ( props.forwardedRef && rigidBodyRef.current ) {
            props.forwardedRef.current = rigidBodyRef.current
        }
    }, [ props.forwardedRef ] )


    // Set the Character to start on IDLE animation
    useEffect( () => {
        actions['Idle']?.reset().fadeIn( 0.2 ).play()
        currentAnimationRef.current = 'Idle'
    }, [ actions ] )


    // Normalise the input direction
    function getDirection() {
        const moveDirection = new THREE.Vector3()

        if ( forward ) moveDirection.z -= 1
        if ( backward ) moveDirection.z += 1
        if ( left ) moveDirection.x -= 1
        if ( right ) moveDirection.x += 1

        return moveDirection
    }


    // Swap animation baed on movement state
    function updateAnimationState( isMoving: boolean ) {
        if ( isMoving !== isMovingRef.current ) {
            isMovingRef.current = isMoving

            if ( isMoving ) {
                actions[ 'Idle' ]?.fadeOut( 0.2 )
                actions[ 'Walk' ]?.reset().fadeIn( 0.2 ).play()
                currentAnimationRef.current = 'Walk'
            } else {
                actions[ 'Walk' ]?.fadeOut(0.2)
                actions[ 'Idle' ]?.reset().fadeIn( 0.2 ).play()
                currentAnimationRef.current = 'Idle'
            }
        }
    }


    useFrame(( state ) => {
        const body = rigidBodyRef.current
        if ( !body ) return

        const move = getDirection()
        const isMoving = move.lengthSq() > 0
        const velocity = body.linvel()

        updateAnimationState( isMoving )


        // Movement & Rotation
        if ( move.lengthSq() > 0 ) {
            // Moves the rigidBody
            move.normalize().multiplyScalar( 3 )
            body.setLinvel( { x: move.x, y: velocity.y, z: move.z }, true )

            // Rotates the rigidBody
            const lookingAngle = Math.atan2( -move.x, -move.z )
            const quaternion = new THREE.Quaternion().setFromEuler( new THREE.Euler(0, lookingAngle, 0 ) )
            body.setRotation( quaternion, true )
            // clonedInstance.rotation.y = lookingAngle

        } else {
            body.setLinvel( { x: 0, y: velocity.y, z: 0 }, true )
        }

        
        // Throttled update requests
        if ( performance.now() - lastUpdateTime > UPDATE_RATE ) {
            lastUpdateTime = performance.now()

            updatePlayer( rigidBodyRef.current!, props.playerData, currentAnimationRef.current! )
            
            const bodyPosition = body.translation()
            requestResources( new THREE.Vector3( bodyPosition.x, bodyPosition.y, bodyPosition.z ) )

            requestPlayers()

            updateClimaticZone( new THREE.Vector3(bodyPosition.x, bodyPosition.y, bodyPosition.z) )
        }


        // Making the nameTag always look to the Camera
        if ( rigidBodyRef.current && nameTagRef.current ) {
            nameTagRef.current.lookAt( state.camera.position )
        }
    } )


    return (
        <RigidBody
            ref={ rigidBodyRef }
            colliders={ false }
            mass={ 1 }
            restitution={ 0.1 }
            friction={ 1 }
            lockRotations
            onIntersectionEnter={ ( e ) => {
                if ( e.colliderObject?.name === "water" ) {
                    console.log("💧 Player entered water")
                }
            } }
        >
            {/* Character Mesh */}
             <primitive object={ clonedInstance } />
             {/* Character Collider */}
             <CapsuleCollider args={ [ 0.4, 0.5 ] } position={ [ 0, 0.8, 0] }/>

            {/* Name Tag */}
            <Text
                ref={nameTagRef}
                position={[0, 2, 0]}
                fontSize={0.15}
                color="white"
                anchorX="center"
                anchorY="bottom"
                outlineWidth={0.01}
                outlineColor="black"
                >
                    { props.playerData.name ?? 'unknown' }
            </Text>

            {/* Renderbox */}
            { showRenderBox && 
                <RenderBox 
                    width={ props.playerData.renderBox[0] }
                    depth={ props.playerData.renderBox[0] }
                    height={ 10 }
                /> 
            }
        </RigidBody>
    )
}
