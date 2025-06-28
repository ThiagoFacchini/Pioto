import { useEffect, useRef } from "react"
import { useNavigate  } from "react-router-dom"
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

import FPSCounter from '../../components/3D/FPSCounter'
import SunLight from '../../components/3D/SunLight'
import Camera from '../../components/3D/Camera'
import PlayerCharacter from '../../components/3D/PlayerCharacter'
import Character from '../../components/3D/Character'

import { ping as sendPing } from './../../websocket/LatencyCounter'
import { sendRequest } from "../../websocket/WsClient"

import { useDebugStore } from "../../stores/DebugStore"
import { useWebSocketStore } from "../../stores/WebsocketStore"
import { useControlsStore } from '../../stores/controlsStore'
import { usePlayersStore } from "../../stores/PlayersStore"
import { useResourcesStore } from "../../stores/resourcesStore"


// Map Logical Components
export const LAYER_COLLISION = new THREE.Group()
LAYER_COLLISION.name = "LAYER_COLLISIOIN"


function Map() {
    const playerRef = useRef<THREE.Object3D>(null)

    const navigate = useNavigate()

    const setPosition = useDebugStore( ( state ) => state.setPosition )

    const isConnected = useWebSocketStore( ( state ) => state.isConnected )
    const isAuthenticated = useWebSocketStore( ( state ) => state.isAuthenticated )
    const isCharacterSelected = useWebSocketStore( ( state ) => state.isCharacterSelected )
    const connectionId = useWebSocketStore( ( state ) => state.connectionId )
    const clearWebsocketStore = useWebSocketStore( ( state ) => state.clearStore )    

    const controls = useControlsStore( ( state ) => state.controls )
    
    const player = usePlayersStore( ( state ) => state.player )
    const playerList = usePlayersStore( ( state ) => state.playerList )
    const clearPlayerStore = usePlayersStore( ( state ) => state.clearStore  )


    // Send user back to login
    useEffect( () => {
        if ( !isConnected || !isAuthenticated || !isCharacterSelected ) {
            navigate("/", { replace: true } ) 
            clearPlayerStore()
            clearWebsocketStore()
        }
    }, [ isConnected ] )


    // Load player
    useEffect( () => {
        if ( player === null ) {
            console.log( 'Requesting Player...' )

            sendRequest( {
                header: 'REQ_PLAYER_GET',
                payload: {
                    cid: connectionId!
                }
            } )
        }
    }, [ player ])


    // Load playerList
    useEffect( () => { 
        if ( playerList === null ) {
            console.log( 'Requesting PlayerList...' )

            sendRequest( {
                header: 'REQ_PLAYERLIST_GET',
                payload: null
            } )
        }
    }, [ playerList ] )


    // Tracks Latency
    useEffect( () => {
        const interval = setInterval( () => {
            sendPing()
        }, 5000)

    }, [] )


    function updatePlayer () {
        if (player !== null && playerRef.current != null ) {
            sendRequest( {
                header: 'REQ_PLAYER_UPDATE',
                payload: { 
                    ...player,
                    animationName: playerRef.current.userData.currentAnimation,
                    position: [
                        playerRef.current.position.x,
                        playerRef.current.position.y,
                        playerRef.current.position.z
                    ],
                    rotation: [
                        playerRef.current.rotation.x,
                        playerRef.current.rotation.y,
                        playerRef.current.rotation.z
                    ]
                }
            })

            // Debug - Update Player Position
            setPosition( [ 
                parseFloat( playerRef.current.position.x.toFixed( 1 ) ), 
                parseFloat( playerRef.current.position.y.toFixed( 1 ) ), 
                parseFloat( playerRef.current.position.z.toFixed( 1 ) ), 
            ] )
        }
    }    
    

    function renderPlayerCharacter () {
        if ( player !== null ) {
            return (
                <PlayerCharacter 
                    forwardedRef={ playerRef } 
                    name={ player.name }
                    position={ player.position }
                    rotation={ player.rotation }
                    updateCallback={ updatePlayer }
                    showEyes={ true } 
                    scale={ 1 }  
                />
            )
        }
    }


    function renderPlayers() {
        if ( !playerList ) return null

        return playerList
            .filter(( player ) => player.connectionId !== connectionId )
            .map( ( player ) => {
                return  (
                    <Character
                        key={ player.connectionId } 
                        position={ player.position } 
                        rotation={ player.rotation }  
                        animationName={ player.animationName } 
                        name={ player.name! }
                    />
                )
            })
    }


    return (
        <>
            <div style={{ width: '100vw', height: '100vh' }}>
                <KeyboardControls map={ controls } >
                    <Canvas>
                        {/* Layers */}
                        <primitive object={ LAYER_COLLISION } />

                        <ambientLight intensity={0.5} />
                        <SunLight />

                        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                            <planeGeometry args={[20, 20]} />
                            <meshStandardMaterial color="green" />
                        </mesh>

                        { renderPlayerCharacter() }
                        { renderPlayers() }
            
                        <Camera targetRef={ playerRef } />

                        {/* Debug tools */}
                        <FPSCounter />
                    </Canvas>
                </KeyboardControls>
            </div>
        </>
    )
}

export default Map