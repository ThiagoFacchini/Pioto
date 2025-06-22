import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, TransformControls } from '@react-three/drei'
import * as THREE from 'three'

import { useSelectionStore } from '../stores/selectionStore'

export default function Rock({ id, position = [0, 0, 0] }) {
    const { scene } = useGLTF('./Rock 1.glb')
    const rock = scene.clone( true )

    const meshRef = useRef()
    const controlsRef = useRef()
    const helperRef = useRef()

    const { selectedResourceId, selectResource, clearSelection } = useSelectionStore()
    const isSelected = selectedResourceId === id


    useEffect(() => {
        const handleKeyDown = ( e ) => {
            if (e.key === 'Escape') clearSelection()
        }

        window.addEventListener( 'keydown', handleKeyDown )
        return () => window.removeEventListener( 'keydown', handleKeyDown )
    }, [ clearSelection ] )


    useEffect(() => {
        if ( !isSelected || !meshRef.current ) return

        const helper = new THREE.BoxHelper(meshRef.current, 0xffff00)
        helperRef.current = helper
        meshRef.current.add( helper )

        return () => {
            meshRef.current.remove( helper )
        }
    }, [ isSelected ] )
    

    return (
        isSelected ? (
            <TransformControls ref={ controlsRef } mode="translate" position={ position }>
                <group
                    ref={meshRef}
                    onClick={ ( e ) => {
                        e.stopPropagation()
                        selectResource( id )
                    } }
                >
                    <primitive object={ rock } castShadow receiveShadow />
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
            </group>
        )
    )
}