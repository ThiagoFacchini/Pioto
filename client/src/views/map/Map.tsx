// 📦 - IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// [ CORE IMPORTS ]
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, Suspense } from "react"
import { useNavigate  } from "react-router-dom"
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, OrbitControls } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import type { RapierRigidBody } from '@react-three/rapier'

// ─────────────────────────────────────────────────────────────────────────────
// [ STORES ]
// ─────────────────────────────────────────────────────────────────────────────
import { useWebSocketStore } from "../../stores/WebsocketStore"
import { useConfigsStore } from '../../stores/ConfigsStore'
import { usePlayersStore } from "../../stores/PlayersStore"
import { useDebugStore } from "../../stores/DebugStore"

// ─────────────────────────────────────────────────────────────────────────────
// [ 3D COMPONENTS ]
// ─────────────────────────────────────────────────────────────────────────────
import FPSCounter from '../../components/3D/FPSCounter'
import SunLight from '../../components/3D/SunLight'
import Camera from '../../components/3D/Camera'
import PlayerCharacter from '../../components/3D/PlayerCharacter'
import Characters from '../../components/3D/Characters'
import Resources from '../../components/3D/Resources'

// ─────────────────────────────────────────────────────────────────────────────
// [ UI COMPONENTS ]
// ─────────────────────────────────────────────────────────────────────────────
import GameClock from "../../components/UI/GameClock/GameClock"

// ─────────────────────────────────────────────────────────────────────────────
// [ SERVICES & UTILITIES ]
// ─────────────────────────────────────────────────────────────────────────────
import { ping as sendPing } from './../../websocket/LatencyCounter'
// =============================================================================


// 🧩 - COMPONENTS
/**
 * Main Game component
 */
function Map() {
    const navigate = useNavigate()

    // Store Connections
    const isConnected = useWebSocketStore( ( state ) => state.isConnected )
    const isAuthenticated = useWebSocketStore( ( state ) => state.isAuthenticated )
    const isCharacterSelected = useWebSocketStore( ( state ) => state.isCharacterSelected )
    const clearWebsocketStore = useWebSocketStore( ( state ) => state.clearStore )    

    const shouldShowCollions = useDebugStore( ( state ) => state.showCollisions )

    const controls = useConfigsStore( ( state ) => state.controls )

    const clearPlayerStore = usePlayersStore( ( state ) => state.clearStore  )

    // Internal References
    const playerRef = useRef<RapierRigidBody>(null)


    /**
     * This effect monitors the connection status, if the connectio drops
     * the user is sent back to login. Before the redirection we are clearing
     * the WebsocketStore.
     */
    useEffect( () => {
        if ( !isConnected || !isAuthenticated || !isCharacterSelected ) {
            navigate("/", { replace: true } ) 
            clearPlayerStore()
            clearWebsocketStore()
        }
    }, [ isConnected ] )


    /**
     * Effect used to track the connection latency
     */
    useEffect( () => {
        const interval = setInterval( () => {
            sendPing()
        }, 5000)

    }, [] )

   
    return (
        <>
            <div style={{ width: '100vw', height: '100vh' }}>
                <GameClock />

                <Canvas>
                    <KeyboardControls map={ controls } >

                    <ambientLight intensity={0.5} />
                    <SunLight />

                    <Physics gravity={ [ 0, -9.81, 9 ] } debug={ shouldShowCollions }>
                        <Suspense fallback={ null } >
                            <RigidBody type="fixed" colliders="trimesh" restitution={ 0.2 } friction={ 1 }>
                                <mesh rotation={ [-Math.PI / 2, 0, 0] } receiveShadow>
                                    <planeGeometry args={ [60, 60] } />
                                    <meshStandardMaterial color="green" />
                                </mesh>
                            </RigidBody>

                            <PlayerCharacter forwardedRef={ playerRef } />
                            <Camera targetRef={ playerRef } />
                            {/* <OrbitControls /> */}
                            <Characters />

                            <Resources />
                            
                        </Suspense>   
                    </Physics>

                    {/* Debug tools */}
                    <FPSCounter />

                    </KeyboardControls>
                </Canvas>

            </div>
        </>
    )
}

export default Map