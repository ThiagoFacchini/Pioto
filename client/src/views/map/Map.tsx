import { useEffect, useRef } from "react"
import { useNavigate  } from "react-router-dom"
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

import SunLight from '../../components/3D/SunLight'
import Camera from '../../components/3D/Camera'
import PlayerCharacter from '../../components/3D/PlayerCharacter'

import { sendRequest } from "../../websocket/WsClient"

import { useWebSocketStore } from "../../stores/WebsocketStore"
import { useControlsStore } from '../../stores/controlsStore'
import { usePlayersStore } from "../../stores/PlayersStore"
import { useResourcesStore } from "../../stores/resourcesStore"

import Scene from "./Scene"


// Map Logical Components
export const LAYER_COLLISION = new THREE.Group()
LAYER_COLLISION.name = "LAYER_COLLISIOIN"


function Map() {
    const playerRef = useRef<THREE.Object3D>(null)

    const navigate = useNavigate()

    const isConnected = useWebSocketStore( ( state ) => state.isConnected )
    const connectionId = useWebSocketStore( ( state ) => state.connectionId )
    

    const controls = useControlsStore( ( state ) => state.controls )
    
    const player = usePlayersStore( ( state ) => state.player )
    const playerList = usePlayersStore( ( state ) => state.playerList )

    const clearPlayerStore = usePlayersStore( ( state ) => state.clearStore  )


    // Send user back to login
    useEffect( () => {
        if ( !isConnected ) {
            navigate("/", { replace: true } ) 
            clearPlayerStore()
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


    function updatePlayer () {
        if (player !== null && playerRef.current != null ) {
            sendRequest( {
                header: 'REQ_PLAYER_UPDATE',
                payload: { 
                    ...player,
                    position: playerRef.current.position,
                    rotation: [
                        playerRef.current.rotation.x,
                        playerRef.current.rotation.y,
                        playerRef.current.rotation.z
                    ]
                }
            })
        }
    }    
    

    function renderPlayer () {
        if ( player !== null ) {
            return (
                <PlayerCharacter 
                    forwardedRef={ playerRef } 
                    position={ player.position }
                    rotation={ player.rotation }
                    updateCallback={ updatePlayer }
                    showEyes={ true } 
                    scale={ 1 }  
                />
            )
        }
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

                        { renderPlayer() }
            
                        <Camera targetRef={ playerRef } />
                    </Canvas>
                </KeyboardControls>
            </div>
        </>
    )
}

export default Map