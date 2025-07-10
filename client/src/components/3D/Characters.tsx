// 📦 - IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// [ CORE ]
// ─────────────────────────────────────────────────────────────────────────────
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, Text } from '@react-three/drei'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
import React, { useRef, useEffect, useMemo, memo } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// [ STORES ]
// ─────────────────────────────────────────────────────────────────────────────
import { useConfigsStore } from '../../stores/ConfigsStore'
import { usePlayersStore } from '../../stores/PlayersStore'
import { useWebSocketStore } from '../../stores/WebsocketStore'

// ─────────────────────────────────────────────────────────────────────────────
// [ SERVICES & UTILITIES ]
// ─────────────────────────────────────────────────────────────────────────────
import { sendRequest } from "../../websocket/WsClient"

// ─────────────────────────────────────────────────────────────────────────────
// [ SHARED TYPES & ENUMS ]
// ─────────────────────────────────────────────────────────────────────────────
import { AnimationNameType } from '../../../../shared/playerType'

type GLTFCharacterType = {
    name?: string,
    meshName: string,
    animationName: AnimationNameType,
    position: [ number, number, number ],
    rotation: [ number, number, number ],
}
// =============================================================================



// ⚙️ - INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────
// [ CONSTANTS & TYPES ]
// ─────────────────────────────────────────────────────────────────────────────
const updateRate = 100                                                                              // Defines how often GLTFCharacter will update
// =============================================================================



//  🧠 - HELPER FUNCTIONS 
/**
 * This function check if GLTFCharacter properties (key ones) changed and it return true or false preventing unnecessary rerendering.
 */
function areEqual(prev: GLTFCharacterType, next: GLTFCharacterType): boolean {
  return (
    prev.name === next.name &&
    prev.meshName === next.meshName &&
    prev.animationName === next.animationName &&
    prev.position[0] === next.position[0] &&
    prev.position[1] === next.position[1] &&
    prev.position[2] === next.position[2] &&
    prev.rotation[0] === next.rotation[0] &&
    prev.rotation[1] === next.rotation[1] &&
    prev.rotation[2] === next.rotation[2]
  )
}
// =============================================================================



// 🧩 - COMPONENTS
/**
 * This component makes sure all the characters data are loaded before instantiate the
 * GLTFCharacter component in the Scene Graph.
 */
export default function Characters() {
    const playerList = usePlayersStore( ( state ) => state.playerList )
    const connectionId = useWebSocketStore( ( state ) => state.connectionId )

    // Request Players
    useEffect( () => { 
        if ( playerList === null ) {
            console.log( 'Requesting PlayerList...' )

            sendRequest( {
                header: 'REQ_PLAYERLIST_GET',
                payload: null
            } )
        }
    }, [ playerList ] )

    if ( !playerList ) return null

    return playerList
        .filter(( player ) => player.connectionId !== connectionId )
        .map( ( player ) => {
            return  (
                <GLTFCharacter
                    key={ player.connectionId } 
                    name={ player.name! }
                    meshName={ player.meshName }
                    animationName={ player.animationName } 
                    position={ player.position } 
                    rotation={ player.rotation }  
                />
            )
        })    
}






const GLTFCharacter = React.memo( function GLTFCharacter( props: GLTFCharacterType ) {
    // Internal References
    const characterRef = useRef<THREE.Group>( null )                                            // Reference to the Character Group 
    const nameTagRef = useRef<THREE.Object3D>( null )                                           // Reference to the Character NameTag
    const currentAnimationRef = useRef<string | null>( null )                                   // Reference to the Character current animation
    
    // Store Connections
    const serverAddress = useConfigsStore( ( state ) => state.serverAddress )
    
    console.log("Rendering character", props.name)

    // Load model oly after player data is available
    // TODO - There's no server port stored for loading assets, props.port maps back to the socket
    // port which is currently 8080    
    const gltf = useGLTF( `http://${serverAddress}:8081/models/${props.meshName}` )

    // Clone the gltf to make it safe for use and memoize it since it's very unlikely to change
    const clonedInstance = useMemo(() => {
        const instance = clone( gltf.scene )
        instance.position.set( 0, 0, 0 )
        instance.rotation.set( 0, 0, 0 )
        return instance
    }, [ gltf.scene ] )

    // Animation Actions
    const { actions } = useAnimations( gltf.animations, clonedInstance )


    // React will re-render this component if `position` or `rotation` props are new array instances,
    // even if their values are identical. To prevent unnecessary re-renders, we memoize these arrays
    // so they remain referentially stable unless their contents actually change.
    const memoizedPosition = useMemo( () => {
        return [ ...props.position ] as [ number, number, number ]
    }, [ props.position[ 0 ], props.position[ 1 ], props.position[ 2 ] ] )

    const memoizedRotation = useMemo( () => {
        return [ ...props.rotation ] as [ number, number, number ]
    }, [ props.rotation[ 0 ], props.rotation[ 1 ], props.rotation[ 2 ] ] )

    // These positioning variables are necessary for lerping
    const previousPos = useRef( new THREE.Vector3( ...memoizedPosition ) )
    const targetPos = useRef( new THREE.Vector3( ...memoizedPosition ) )
    const lastUpdate = useRef( performance.now() )


    // Initially set position and rotation of the Character
    useEffect( () => { 
        if ( characterRef.current ) {
            characterRef.current.position.set( ...memoizedPosition )
            characterRef.current.rotation.set( ...memoizedRotation )
            previousPos.current.set( ...memoizedPosition )
            targetPos.current.set( ...memoizedPosition )
        }
    }, [])


    // Controlling animations
    useEffect( () => { 
        if ( !actions || !props.animationName ) return

        // Skip if the request animation is already playing
        if ( currentAnimationRef.current == props.animationName ) return

        const newAction = actions[ props.animationName ]

        if ( newAction ) {
            // Fade out previous action
            if ( currentAnimationRef.current ) {
                const prevAction = actions[ currentAnimationRef.current ]
                prevAction?.fadeOut( 0.2 )
            }

            // Start new action
            newAction.reset().fadeIn(0.2).play()
            currentAnimationRef.current = props.animationName
        }
   }, [ actions, props.animationName ] )


   // Define the next known position for lerp
   useEffect( () => {
    const newTarget = new THREE.Vector3 (...memoizedPosition )

    if ( !targetPos.current.equals( newTarget ) ) {
        previousPos.current.copy( targetPos.current )
        targetPos.current.copy( newTarget )
        lastUpdate.current = performance.now()
    }
   }, [ memoizedPosition ] )


   // Lerp the Character movement and positioning nameTag
   useFrame( ( { camera } ) => {
        if ( characterRef.current && nameTagRef.current ) {
            nameTagRef.current.lookAt( camera.position )


            // Lerp
            const now = performance.now()
            const t = Math.min( ( now - lastUpdate.current ) / updateRate, 1 )

            characterRef.current.position.lerpVectors(
                previousPos.current,
                targetPos.current,
                t
            )

            characterRef.current.rotation.set( ...memoizedRotation )
        }
    })


    return (
        <group ref={ characterRef } >
            <primitive object={ clonedInstance } />

           <Text
                ref={ nameTagRef }
                position={ [ 0, 2, 0 ] }
                fontSize={ 0.15 }
                color="white"
                anchorX="center"
                anchorY="bottom"
                outlineWidth={ 0.01 }
                outlineColor="black"
            >
                { props.name ? props.name : 'unknown' }
            </Text>
        </group>
    )
}, areEqual )