import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, TransformControls } from '@react-three/drei'
import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'

// @ts-ignore
import { TransformControls as ThreeTransformControls } from 'three/examples/jsm/controls/TransformControls'
import { Resource } from '../../../shared/resourceType'

import Collider from './../components/3D/Collider'

import { sendRequest } from '../websocket/WsClient'

import { useBuildStore } from '../stores/BuildStore'



type PropsType = {
    resource: Resource,
}

export default function Rock( props: PropsType ) {
    const gltf = useGLTF('http://10.0.1.184:8081/models/Rock 1.glb')
    
    const rock = useMemo(() => {
        const instance = clone( gltf.scene )
        instance.position.set( 0, 0, 0 )
        instance.rotation.set( 0, 0, 0 )
        return instance
    }, [gltf.scene] )

    const meshRef = useRef< THREE.Group >( null )
    const controlsRef = useRef<ThreeTransformControls<Camera> | null>( null )

    const { selectedResourceId, selectResource, clearSelection } = useBuildStore()
    const isSelected = selectedResourceId === props.resource.id

    
    // Unselect
    useEffect( () => {
        const handleKeyDown = ( e: KeyboardEvent ) => {
            if (e.key === 'Escape') clearSelection()
        }

        window.addEventListener( 'keydown', handleKeyDown )
        return () => window.removeEventListener( 'keydown', handleKeyDown )
    }, [ clearSelection ] )


    useEffect( () => {
        if ( !controlsRef.current || !isSelected ) return

        const handleMouseUp = () => {
            if ( controlsRef.current ) {
                const newPos = controlsRef.current?.object?.position.toArray()

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

    if (controlsRef.current) console.log('TransformControls attached to:', controlsRef.current.object);


    return (
        isSelected ? (
            <TransformControls ref={ controlsRef } mode="translate" position={ props.resource.position }>
                <group
                    ref={ meshRef }
                    onClick={ ( e ) => {
                        e.stopPropagation()
                        selectResource( props.resource.id )
                    } }
                >
                    <primitive object={ rock } castShadow receiveShadow />
                </group>
            </TransformControls>
        ) : (
            <group
                ref={ meshRef }
                position={ props.resource.position }
                onClick={ ( e ) => {
                e.stopPropagation()
                    selectResource( props.resource.id )
                } }
            >
                <primitive object={ rock } castShadow receiveShadow />
                 <Collider 
                    type="CUBE" 
                    size={ props.resource.size } 
                    position={ props.resource.position } 
                    isCollidable={ props.resource.collidable } 
                    offset={ [ 0, props.resource.size[1] / 2, 0.03 ] }
                />
            </group>
        )
    )
}