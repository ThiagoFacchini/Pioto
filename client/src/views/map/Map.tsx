import { useEffect, useRef, Suspense } from "react"
import { useNavigate  } from "react-router-dom"
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

import FPSCounter from '../../components/3D/FPSCounter'
import SunLight from '../../components/3D/SunLight'
import Camera from '../../components/3D/Camera'
import PlayerCharacter from '../../components/3D/PlayerCharacter'
import Characters from '../../components/3D/Characters'

import { ping as sendPing } from './../../websocket/LatencyCounter'
import { sendRequest } from "../../websocket/WsClient"

import { useWebSocketStore } from "../../stores/WebsocketStore"
import { useConfigsStore } from '../../stores/ConfigsStore'
import { usePlayersStore } from "../../stores/PlayersStore"
import { useResourcesStore } from "../../stores/ResourcesStore"
import Rock from './../../resources/Rock'


// Map Logical Components
export const LAYER_COLLISION = new THREE.Group()
LAYER_COLLISION.name = "LAYER_COLLISIOIN"


function Map() {
    console.log('map re rendering')
    const navigate = useNavigate()

    
    const isConnected = useWebSocketStore( ( state ) => state.isConnected )
    const isAuthenticated = useWebSocketStore( ( state ) => state.isAuthenticated )
    const isCharacterSelected = useWebSocketStore( ( state ) => state.isCharacterSelected )
    const connectionId = useWebSocketStore( ( state ) => state.connectionId )
    const clearWebsocketStore = useWebSocketStore( ( state ) => state.clearStore )    
    
    const controls = useConfigsStore( ( state ) => state.controls )
    
    const areResourcesLoaded = useResourcesStore( ( state ) => state.areResourcesLoaded )
    const resources = useResourcesStore( ( state ) => state.resources )
        
    const clearPlayerStore = usePlayersStore( ( state ) => state.clearStore  )


    const playerRef = useRef<THREE.Object3D>(null)


    // Send user back to login
    useEffect( () => {
        if ( !isConnected || !isAuthenticated || !isCharacterSelected ) {
            navigate("/", { replace: true } ) 
            clearPlayerStore()
            clearWebsocketStore()
        }
    }, [ isConnected ] )


    // Load resources
    useEffect( () => {
        if ( !areResourcesLoaded ) {
            console.log( 'Requesting Resources...' )

            sendRequest( {
                header: 'REQ_MAP_RESOURCES_GET',
                payload: null
            })
        }
    }, [ areResourcesLoaded ] )



    // Tracks Latency
    useEffect( () => {
        const interval = setInterval( () => {
            sendPing()
        }, 5000)

    }, [] )


    // Render map resources
    function renderMapResources () {
        if ( !resources ) return null

        return resources
            .filter(( resource ) => resource.type === 'rock' )
            .map( ( resource ) => {
                return (
                    <Rock
                        key={ resource.id }
                        resource={ resource }
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

                        <mesh rotation={ [-Math.PI / 2, 0, 0] } receiveShadow>
                            <planeGeometry args={ [20, 20] } />
                            <meshStandardMaterial color="green" />
                        </mesh>

                        {/* <Suspense fallback={ null } > */}
                            <PlayerCharacter forwardedRef={ playerRef } />
                            <Characters />
                        {/* </Suspense> */}
                        
                        { renderMapResources() }
                        
                        
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