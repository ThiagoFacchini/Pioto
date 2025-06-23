import { useRef, useEffect } from 'react'
import { useGLTF, TransformControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { sendUpdate } from '../websocket/WsClient'

import { useSelectionStore } from '../stores/selectionStore'


import Collider from './../components/Collider'

export default function Rock({ id, position = [0, 0, 0], size = [ 1, 1, 1 ], collidable } ) {
    const { scene } = useGLTF('http://10.0.1.184:8081/models/Rock 1.glb')
    const rock = scene.clone( true )

    rock.userData.collidable = collidable
    console.log('rock userdata -> ' , rock.userData.collidable)

    const meshRef = useRef()
    const controlsRef = useRef()
    const colliderRef = useRef()

    const { selectedResourceId, selectResource, clearSelection } = useSelectionStore()
    const isSelected = selectedResourceId === id

    useEffect( () => {
        const handleKeyDown = ( e ) => {
            if (e.key === 'Escape') clearSelection()
        }

        window.addEventListener( 'keydown', handleKeyDown )
        return () => window.removeEventListener( 'keydown', handleKeyDown )
    }, [ clearSelection ] )


    useEffect( () => {
        const controls = controlsRef.current
        if ( !controls || !isSelected ) return

        const handleMouseUp = () => {
            if ( controlsRef.current ) {
                const newPos = controlsRef.current.object.position.toArray()
                sendUpdate( { 
                    messageType: 'RESOURCES_UPDATE',
                    messagePayload: {
                        id: id,
                        position: newPos
                    }
                } )
            }
        }

        window.addEventListener( 'mouseup', handleMouseUp )
        return () => window.removeEventListener( 'mouseup', handleMouseUp )
    } )
   

    useFrame( () => { 
        if (colliderRef.current && meshRef.current) {
            colliderRef.current.position.copy(meshRef.current.position)
        }
    } )


    return (
        isSelected ? (
            <TransformControls ref={ controlsRef } mode="translate" position={ position }>
                <group
                    ref={ meshRef }
                    onClick={ ( e ) => {
                        e.stopPropagation()
                        selectResource( id )
                    } }
                >
                    <primitive object={ rock } castShadow receiveShadow />
                    <Collider ref={ colliderRef } type="CUBE" size={ size } position={ position } />
                </group>
            </TransformControls>
        ) : (
            <group
                ref={ meshRef }
                position={ position }
                onClick={ ( e ) => {
                e.stopPropagation()
                    selectResource( id )
                } }
            >
                <primitive object={ rock } castShadow receiveShadow />
                 <Collider type="CUBE" size={ size } position={ position } />
            </group>
        )
    )
}