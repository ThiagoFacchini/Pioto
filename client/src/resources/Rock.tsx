// 📦 - IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// [ CORE ]
// ─────────────────────────────────────────────────────────────────────────────
import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, TransformControls } from '@react-three/drei'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
import * as THREE from 'three'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import { RapierRigidBody } from '@react-three/rapier'

// ─────────────────────────────────────────────────────────────────────────────
// [ STORES ]
// ─────────────────────────────────────────────────────────────────────────────
import { useBuildStore } from '../stores/BuildStore'
import { useConfigsStore } from '../stores/ConfigsStore'

// ─────────────────────────────────────────────────────────────────────────────
// [ SERVICES & UTILITIES ]
// ─────────────────────────────────────────────────────────────────────────────
import { sendRequest } from '../websocket/WsClient'


// ─────────────────────────────────────────────────────────────────────────────
// [ SHARED TYPES & ENUMS ]
// ─────────────────────────────────────────────────────────────────────────────
import { Resource } from '../../../shared/resourceType'

type PropsType = {
    resource: Resource,
}
// =============================================================================



// 🧩 - COMPONENTS
/**
 * This component renders a resource of type Rock
 */
export default function Rock( props: PropsType ) {
    // Internal References
    const editControlsRef = useRef<any>( null )                                                 // Reference to TransformControls
    const rigidBodyRef = useRef< RapierRigidBody >( null )                                      // Reference to the RigidBody

    // Store Connections
    const serverAddress = useConfigsStore( ( state ) => state.serverAddress )
    const { selectedResourceId, selectResource, clearSelection } = useBuildStore()


    const isSelected = selectedResourceId === props.resource.id
    // Load model oly after player data is available
    // TODO - There's no server port stored for loading assets, props.port maps back to the socket
    // port which is currently 8080
    const { scene } = useGLTF(`http://${serverAddress}:8081/models/Rock 1.glb`)

    // Clone the scene ( mesh ) to make it safe for use and memoize it since it's very unlikely
    // to change
    const rockMesh = useMemo( () => ( 
        scene.clone( true )
    ), [ scene ] )

    
    /**
     * This effect unselect the resource if selected.
     */
    useEffect( () => {
        const handleKeyDown = ( e: KeyboardEvent ) => {
            if (e.key === 'Escape') clearSelection()
        }

        window.addEventListener( 'keydown', handleKeyDown )
        return () => window.removeEventListener( 'keydown', handleKeyDown )
    }, [ clearSelection ] )


    /**
     * This effect attach mouse events to the object
     */
    useEffect( () => {
        if ( !editControlsRef.current || !isSelected ) return

        const handleMouseUp = () => {
            if ( editControlsRef.current ) {
                const newPos = editControlsRef.current?.object?.position.toArray()

                // @TODO - Check how can the position of the rigid body be updated
                // once the drag is over without offset the grup.
                // Update Rigid Body Position
                // rigidBodyRef.current?.setTranslation(
                //     { x: newPos[ 0 ], y: newPos[ 1 ], z: newPos[ 2 ] },
                //     false
                // )


                if ( !newPos ) return

                sendRequest( { 
                    header: 'REQ_MAP_RESOURCE_UPDATE',
                    payload: { resource: { ...props.resource, position: newPos } }
                } )
            }
        }

        window.addEventListener( 'mouseup', handleMouseUp )
        return () => window.removeEventListener( 'mouseup', handleMouseUp )
    } )


    const rigidBody = useMemo( () => (
        <RigidBody
            ref={ rigidBodyRef }
            type={ "fixed" }
            colliders={ props.resource.collidable ? "cuboid" : false }
        >
             <group
                onClick={ ( e ) => {
                    e.stopPropagation()
                    selectResource(props.resource.id)
                }}
             >
                { rockMesh && <primitive object={rockMesh} castShadow receiveShadow /> }
            </group>
        </RigidBody>

        ), [ props.resource.collidable, props.resource.position, props.resource.id, isSelected, rockMesh ] 
    )


    return isSelected ? (
        <TransformControls
            ref={editControlsRef}
            mode="translate"
            position={props.resource.position}
        >
            { rigidBody }
        </TransformControls>
    ) : (
        <RigidBody
            ref={rigidBodyRef}
            type="fixed"
            colliders={ props.resource.collidable ? "cuboid" : false }
            position={ props.resource.position }
        >
            { rigidBody }
        </RigidBody>
    )
}