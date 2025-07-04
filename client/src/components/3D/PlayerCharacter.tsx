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


// ==================================================================================================================================
// [ ENTITY CONFIGURAATION ]
// ==================================================================================================================================
// Defines which keys will have a rection on this entity
type ControlKeys = 'forward' | 'backward' | 'left' | 'right' | 'jump'
// Defines how often it sends updates to the server
const updateRate = 100 // ms
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
// ==================================================================================================================================


type PropsType = {
    forwardedRef: RefObject<THREE.Object3D | null>,
}

export default function PlayerCharacter(props: PropsType) {
    const serverAddress = useConfigsStore( ( state ) => state.serverAddress )

    const shouldShowCollisions = useDebugStore( ( state ) => state.showCollisions )
    const setPosition = useDebugStore( ( state ) => state.setPosition )

    const player = usePlayersStore( ( state ) => state.player )

    const connectionId = useWebSocketStore( ( state ) => state.connectionId )

    
    let gltf = useGLTF(`http://${serverAddress}:8081/models/BaseCharacter-v2.glb`)
    

    const clonedInstance = useMemo(() => {
        const instance = clone( gltf.scene )
        instance.position.set( 0, 0, 0 )
        instance.rotation.set( 0, 0, 0 )
        return instance
    }, [gltf.scene] )

    
    const characterRef = useRef<THREE.Group>( null )
    const nameTagRef = useRef<THREE.Object3D>( null )
    const collisionBoxRef = useRef (new THREE.Box3() )
    const boxHelperRef = useRef<THREE.Box3Helper>( null )
    const isMovingRef = useRef( false )

    const { actions } = useAnimations( gltf.animations, clonedInstance )

    const forward = useKeyboardControls<ControlKeys>( ( state ) => state.forward )
    const backward = useKeyboardControls<ControlKeys>( ( state ) => state.backward )
    const left = useKeyboardControls<ControlKeys>( ( state ) => state.left )
    const right = useKeyboardControls<ControlKeys>( ( state ) => state.right )

    let lastUpdateTime = 0
    const characterSize = new THREE.Vector3( 0.8, 1.7, 0.8 )


    // 1 - Send request to get player information
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


    // 2 - With the player information the characterRef assigned, sets prop.forwardRef (Map.tsx)
    useEffect( () => {
        if ( props.forwardedRef && characterRef.current && player !== null) {
            props.forwardedRef.current = characterRef.current
            characterRef.current.userData.currentAnimation = 'Idle'
        }
    }, [ props.forwardedRef, player ] )


    // Put the player character into IDLE animation
    useEffect( () => {
        actions['Idle']?.reset().fadeIn( 0.2 ).play()
    }, [ actions ] )


    useEffect( () => {
        const helper = new THREE.Box3Helper( collisionBoxRef.current, "red" )

        if ( characterRef.current ) {
            console.log('there is a characterRef.current')
            collisionBoxRef.current.copy( computeCollisionBox( characterRef.current.position ) )

            boxHelperRef.current = helper
            characterRef.current?.parent?.add( helper )
        }

        return () => {
            characterRef.current?.parent?.remove( helper )
        }
    }, [ player ])


    // Show or hide the collision helper based on DebugStore flags
    useEffect( () => {
        if ( boxHelperRef.current ) {
            boxHelperRef.current.visible = shouldShowCollisions
        }
    }, [ shouldShowCollisions ] )



    function computeCollisionBox( basePos: THREE.Vector3, offset: THREE.Vector3 = new THREE.Vector3() ) {
        const center = basePos.clone().add( new THREE.Vector3(0, characterSize.y / 2, 0 ) ).add( offset )
        return new THREE.Box3().setFromCenterAndSize( center, characterSize )
    }


    function getDirection() {
        const dir = { x: 0, z: 0 }
        if ( forward ) dir.z -= 1
        if ( backward ) dir.z += 1
        if ( left ) dir.x -= 1
        if ( right ) dir.x += 1
        return dir
    }


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


    function checkCollisions( moveVec: THREE.Vector3 ): boolean {
        if ( !characterRef.current ) return true
        
        const collisionBox = computeCollisionBox( characterRef.current.position, moveVec )

        collisionBoxRef.current.copy( collisionBox )
        boxHelperRef.current?.updateMatrixWorld( true )

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

        if ( performance.now() - lastUpdateTime > updateRate ) {
            lastUpdateTime = performance.now()
            updatePlayer( characterRef.current!, player, setPosition )
        }
    } )




    // Positioning nameTag
    useFrame( ( { camera } ) => {
        if ( characterRef.current && nameTagRef.current ) {
            nameTagRef.current.lookAt( camera.position )
        }
    })

    
    return (
        player ? (
            <group ref={characterRef} position={player.position} rotation={player.rotation}>
                <primitive object={clonedInstance} />
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
                    {player.name ?? 'unknown'}
                </Text>
            </group>
        ) : (
            <group position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="blue" />
            </group>
        )
    )
}
