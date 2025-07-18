import { OrbitControls } from "@react-three/drei";
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect, RefObject } from 'react'
import * as THREE from 'three'
import type { RapierRigidBody } from '@react-three/rapier'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

type PropsType = {
    targetRef: RefObject<RapierRigidBody | null>
}

export default function OrbitCamera( { targetRef } : PropsType ) {
    const camRef = useRef<THREE.PerspectiveCamera>( null )
    const orbitControlsRef = useRef<OrbitControlsImpl>( null )


useEffect(() => {
    const timeout = setTimeout(() => {
        if ( !orbitControlsRef.current || !targetRef.current ) return

        const pos = targetRef.current.translation()

        // Set the new target
        orbitControlsRef.current.target.set( pos.x, pos.y, pos.z )

        // Force the camera to move near it (so it doesn't look like it stayed put)
        const camera = orbitControlsRef.current.object as THREE.PerspectiveCamera
        const offset = new THREE.Vector3( 5, 5, 5 ) // camera offset from target
        camera.position.copy( pos ).add( offset )

        // Look at the target and update controls
        camera.lookAt( pos.x, pos.y, pos.z )
        orbitControlsRef.current.update()
    }, 0);

    return () => clearTimeout( timeout )
}, [targetRef.current]);


    return (
        <OrbitControls
            ref={ orbitControlsRef }
            target={ 
                new THREE.Vector3(
                    targetRef.current!.translation().x,
                    targetRef.current!.translation().y,
                    targetRef.current!.translation().z,
                )
             }
        />
    )
}