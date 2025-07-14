// 📦 - IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// [ CORE IMPORTS ]
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useMemo, Suspense } from "react"
import { useNavigate  } from "react-router-dom"
import { Canvas} from '@react-three/fiber'
import { useGLTF, KeyboardControls, OrbitControls, Stars } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
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
import WaterBody from "../../components/3D/Water"

import Tree from '../../resources/Tree'

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
    const serverAddress = useConfigsStore( ( state ) => state.serverAddress )

    const clearPlayerStore = usePlayersStore( ( state ) => state.clearStore  )

    // Internal References
    const playerRef = useRef<RapierRigidBody>(null)



    // Load terrain oly after player data is available
    // TODO - There's no server port stored for loading assets, props.port maps back to the socket
    // port which is currently 8080
    let gltf = useGLTF(`http://${ serverAddress }:8081/models/MEPPF.glb`)
    
    // Clone the scene ( mesh ) to make it safe for use and memoize it since it's very unlikely
    // to change
    const clonedTerrain = useMemo(() => {
        const instance = clone( gltf.scene )
        instance.position.set( 0, 0, 0 )
        instance.rotation.set( 0, 0, 0 )
        return instance
    }, [gltf.scene] )


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
            <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000000'}}>
                <GameClock />

                <Canvas>
                    <KeyboardControls map={ controls } >

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <ambientLight intensity={0.5} />w
                    <SunLight />

                    <Physics gravity={ [ 0, -9.81, 9 ] } debug={ shouldShowCollions }>
                        <Suspense fallback={ null } >

                            {/* Terrain */}
                            <RigidBody type="fixed" colliders="trimesh" restitution={ 0.2 } friction={ 1 } position={ [ 0, 0, 0 ] }>
                                <primitive object={ clonedTerrain } flatShading />
                            </RigidBody>

                            {/* Water */}
                            <WaterBody width={ 54 } height={ 46 } position={ [ 1, -1, 48 ] } waveStrength={ 0.05 } resolution={ 32 } opacity={ 0.5 } />

                            <PlayerCharacter forwardedRef={ playerRef } />
                            {/* <Camera targetRef={ playerRef } /> */}
                            <OrbitControls />
                            <Characters />

                            <Resources />

                            <Tree />
                            
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