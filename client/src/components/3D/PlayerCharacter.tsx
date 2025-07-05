import { useEffect, useRef, useMemo, RefObject } from 'react'
import { useGLTF, useAnimations, useKeyboardControls, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'


import { LAYER_COLLISION } from '../../views/map/Map'
import { sendRequest } from "../../websocket/WsClient"


import { useDebugStore } from '../../stores/DebugStore'
import { useConfigsStore } from '../../stores/ConfigsStore'
import { usePlayersStore } from '../../stores/PlayersStore'
import { useWebSocketStore } from '../../stores/WebsocketStore'


import { PlayerType } from './../../../../shared/playerType'


// ==================================================================================================================================
// [ ENTITY CONFIGURAATION ]
// ==================================================================================================================================
// Defines which keys will have a rection on this entity
type ControlKeys = 'forward' | 'backward' | 'left' | 'right' | 'jump'


// Defines how often it sends updates to the server
const updateRate = 100 // ms

// Define the size of the character which is use to compute collision and collision boxes
const characterSize = new THREE.Vector3( 0.8, 1.7, 0.8 )
// ==================================================================================================================================


// ==================================================================================================================================
// [ HELPER FUNCTIONS ]
// ==================================================================================================================================

// Send Player updates to server
// This functions gets called depending on the update rate, that means from time to time it will be called to update the server
// about the player position, animationName and so on
const updatePlayer = function ( character: THREE.Group, playerData: any, setPosition: ( position: [ number, number, number ] ) => void ) {
    
    if ( character != null ) {
        sendRequest( {
            header: 'REQ_PLAYER_UPDATE',
            payload: { 
                ...playerData,
                animationName: character.userData.currentAnimation,
                position: [
                    character.position.x,
                    character.position.y,
                    character.position.z
                ],
                rotation: [
                    character.rotation.x,
                    character.rotation.y,
                    character.rotation.z
                ]
            }
        })

        // Debug - Update Player Position
        setPosition( [ 
            parseFloat( character.position.x.toFixed( 1 ) ), 
            parseFloat( character.position.y.toFixed( 1 ) ), 
            parseFloat( character.position.z.toFixed( 1 ) ), 
        ] )
    }
}


type RenderBoxType = {
    size: [ number, number ],
    height?: number,
    color?: string,
    opacity?: number
}

// Creates a helper renderBox around the player, this renderBox represents everything the player can see and it's tighted with
// the serverResponse. e.g: the server will only send what the client can see.
function CreateRenderBox ( props: RenderBoxType ) {
    const [ width, depth ] = props.size
    const height = props.height || 3
    const color = props.color || "lightblue"
    const opacity = props.opacity || 0.2
    const halfWidth = width / 2
    const halfDepth = depth / 2
    const midHeight = height / 2
    
    const createWall = ( position: [ number, number, number ], rotation: [ number, number, number ], size: [ number, number ] ) => {
        const geometry = new THREE.PlaneGeometry( size[ 0 ], size[ 1 ] )
        const material = new THREE.MeshBasicMaterial( { color, transparent: true, opacity, side: THREE.DoubleSide } )
        
        const edgeGeometry = new THREE.EdgesGeometry( geometry )
        const edgeMaterial = new THREE.LineBasicMaterial( { color: "blue" } )
        
        return (
            <group position={ position } rotation={ rotation } >
                <mesh geometry={ geometry } material={ material } />
                <lineSegments geometry={ edgeGeometry } material={ edgeMaterial } />
            </group>
        )
    }
    
    
    return (
        <group>
            {/* Front wall */}
            { createWall( [ 0, midHeight, -halfDepth ], [ 0, 0, 0 ], [ width, height ] ) }

            {/* Back wall */}
            { createWall( [ 0, midHeight, halfDepth ], [ 0, Math.PI, 0 ], [ width, height ] ) }

            {/* Left wall */}
            { createWall( [ -halfWidth, midHeight, 0 ], [ 0, Math.PI / 2, 0 ], [ depth, height ] ) }

            {/* Right wall */}
            { createWall( [ halfWidth, midHeight, 0 ], [ 0, -Math.PI / 2, 0 ], [ depth, height ] ) }
        </group>
    )
}


type RequestResourceType = {
    playerData: PlayerType
}

const MIN_DISTANCE = 1
const lastRequestPosition = new THREE.Vector3(Infinity, Infinity, Infinity )

// Function used to request an updated resource list to the server
function requestResources( props: RequestResourceType ) {

    const currentPosition = new THREE.Vector3( ...props.playerData.position )

    if ( currentPosition.distanceTo( lastRequestPosition ) >= MIN_DISTANCE ) {
        lastRequestPosition.copy( currentPosition )

        sendRequest( {
            header: 'REQ_MAP_RESOURCES_GET',
            payload: null
        } )
    }

}
// ==================================================================================================================================



type PlayerCharacterType = {
    forwardedRef: RefObject<THREE.Object3D | null>,
}

//  This functions be sure that all the Player Data gets properly loaded.
export default function PlayerCharacter( props: PlayerCharacterType ) {
    const player = usePlayersStore( ( state ) => state.player )
    const connectionId = useWebSocketStore( ( state ) => state.connectionId )
    

    // Request PlayerCharacter data
    useEffect( () => {
        if ( player === null ) {
            sendRequest( {
                header: 'REQ_PLAYER_GET',
                payload: {
                    cid: connectionId
                }
            } )
        }
    }, [ player ])


    if ( !player ) return null

    return <GLTFPlayer playerData={ player } {...props } />
}


type GLTFPlayerType = {
    playerData: PlayerType,
    forwardedRef: RefObject<THREE.Object3D | null>
}

function GLTFPlayer(props: GLTFPlayerType) {
    
    // State Selectors from Stores
    const serverAddress = useConfigsStore( ( state ) => state.serverAddress )                       // Get server IP from ConfigsStore
    const shouldShowCollisions = useDebugStore( ( state ) => state.showCollisions )                 // Debug show / hide Colissions toggle
    const setPosition = useDebugStore( ( state ) => state.setPosition )                             // Debug position setter

    const characterRef = useRef<THREE.Group>( null )                                                // Reference to the group where character & nameTag will be
    const nameTagRef = useRef<THREE.Object3D>( null )                                               // Reference to the character nameTag
    const collisionBoxRef = useRef (new THREE.Box3() )                                              // Collision Box
    const collisionBoxHelperRef = useRef<THREE.Box3Helper>( null )                                  // Collision Box Helper (debug purposes)
    const isMovingRef = useRef( false )                                                             // Tracker for Character Movement

    const forward = useKeyboardControls<ControlKeys>( ( state ) => state.forward )                  
    const backward = useKeyboardControls<ControlKeys>( ( state ) => state.backward )
    const left = useKeyboardControls<ControlKeys>( ( state ) => state.left )
    const right = useKeyboardControls<ControlKeys>( ( state ) => state.right )

    let lastUpdateTime = 0                                                                          // Used to throttle Character updates to server

    // Load model oly after player data is available
    let gltf = useGLTF(`http://${serverAddress}:8081/models/${props.playerData.meshName}`)
    
    // Clone the scene ( mesh ) to make it safe for use
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
        if ( props.forwardedRef && characterRef.current ) {
            props.forwardedRef.current = characterRef.current
            characterRef.current.userData.currentAnimation = 'Idle'
        }
    }, [ props.forwardedRef ] )


    // Set the Character to start on IDLE animation
    useEffect( () => {
        actions['Idle']?.reset().fadeIn( 0.2 ).play()
    }, [ actions ] )


    // Creates the collisionBoxHelper and assigned characterRef as its parent
    useEffect( () => {
        const helper = new THREE.Box3Helper( collisionBoxRef.current, "red" )
        collisionBoxRef.current.copy( computeCollisionBox( characterRef.current!.position ) )

        collisionBoxHelperRef.current = helper
        collisionBoxHelperRef.current.visible = shouldShowCollisions
        characterRef.current?.parent?.add( helper )

        return () => {
            characterRef.current?.parent?.remove( helper )
        }
    }, [])


    // Show or hide the collision helper based on show / hide Collisions toggle (debugStore)
    useEffect( () => {
        if ( collisionBoxHelperRef.current ) {
            collisionBoxHelperRef.current.visible = shouldShowCollisions
        }
    }, [ shouldShowCollisions ] )


    // Computes a box centered on character position (optionally offset)
    function computeCollisionBox( basePos: THREE.Vector3, offset: THREE.Vector3 = new THREE.Vector3() ) {
        const center = basePos.clone().add( new THREE.Vector3(0, characterSize.y / 2, 0 ) ).add( offset )
        return new THREE.Box3().setFromCenterAndSize( center, characterSize )
    }


    // Normalise the input direction
    function getDirection() {
        const dir = { x: 0, z: 0 }
        if ( forward ) dir.z -= 1
        if ( backward ) dir.z += 1
        if ( left ) dir.x -= 1
        if ( right ) dir.x += 1
        return dir
    }

    // Swap animation baed on movement state
    function updateAnimationState( isMoving: boolean ) {
        if ( isMoving !== isMovingRef.current ) {
            isMovingRef.current = isMoving

            if ( isMoving ) {
                actions[ 'Idle' ]?.fadeOut( 0.2 )
                actions[ 'Walk' ]?.reset().fadeIn( 0.2 ).play()
                characterRef.current!.userData.currentAnimation = 'Walk'
            } else {
                actions[ 'Walk' ]?.fadeOut(0.2)
                actions[ 'Idle' ]?.reset().fadeIn( 0.2 ).play()
                characterRef.current!.userData.currentAnimation = 'Idle'
            }
        }
    }


    // Detects intersection between character and static objects ( with colliders )
    function checkCollisions( moveVec: THREE.Vector3 ): boolean {
        if ( !characterRef.current ) return true
        
        const collisionBox = computeCollisionBox( characterRef.current.position, moveVec )

        collisionBoxRef.current.copy( collisionBox )
        collisionBoxHelperRef.current?.updateMatrixWorld( true )

        let collided = false
        LAYER_COLLISION.traverse( ( obj ) => {
            if (
                obj instanceof THREE.Mesh &&
                obj.userData.collidable &&
                obj !== characterRef.current as THREE.Object3D &&
                obj.geometry?.boundingBox
            ) {
                const objBox = obj.geometry.boundingBox.clone().applyMatrix4( obj.matrixWorld )
                if ( collisionBox.intersectsBox( objBox ) ) collided = true
            }
        } )

        return collided
    }


    useFrame(( _, delta ) => {
        const dir = getDirection()
        const len = Math.hypot( dir.x, dir.z )
        const isMoving = len > 0

        if ( characterRef.current ) characterRef.current.userData.isMoving = isMoving
        updateAnimationState( isMoving )

        if ( len > 0 && characterRef.current ) {
            dir.x /= len
            dir.z /= len

            const speed = 3
            characterRef.current.updateMatrixWorld( true )

            const moveVec = new THREE.Vector3( dir.x * speed * delta, 0, dir.z * speed * delta )

            if ( !checkCollisions( moveVec ) ) {
                characterRef.current.position.add( moveVec )
                const angle = Math.atan2( dir.x, dir.z )
                characterRef.current.rotation.y = angle + Math.PI
            }
        }

        // Throttled server update
        if ( performance.now() - lastUpdateTime > updateRate ) {
            lastUpdateTime = performance.now()
            updatePlayer( characterRef.current!, props.playerData, setPosition )
            
            const updatedPlayerData = {
                ...props.playerData,
                position: characterRef!.current!.position.toArray()
            }
            requestResources( { playerData: updatedPlayerData } )
        }
    } )




    // Make the nameTag always face player camera
    useFrame( ( { camera } ) => {
        if ( characterRef.current && nameTagRef.current ) {
            nameTagRef.current.lookAt( camera.position )
        }
    })

    
    return (
        <group ref={ characterRef } position={props.playerData.position} rotation={props.playerData.rotation}>
            <primitive object={ clonedInstance } />
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
                {props.playerData.name ?? 'unknown'}
            </Text>
            <CreateRenderBox size={ props.playerData.renderBox } />
        </group>
    )
}
