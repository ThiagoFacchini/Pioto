import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect, RefObject } from 'react'
import * as THREE from 'three'
import type { RapierRigidBody } from '@react-three/rapier'

type PropsType = {
    targetRef: RefObject<RapierRigidBody | null>
}

export default function FollowCamera( { targetRef } : PropsType ) {
    const camRef = useRef<THREE.PerspectiveCamera>( null )

    const [ distance, setDistance ] = useState( 10 )
    const [ theta, setTheta ] = useState( 0 )

    const fixedPhi = Math.PI / 3 
    const minDistance = 5
    const maxDistance = 15


    useEffect( () => {
        const handleWheel = ( e: WheelEvent ) => {
            setDistance( (prev) =>
                Math.min( maxDistance, Math.max( minDistance, prev + e.deltaY * 0.01 ) )
            )
        }

        let dragging = false
        let lastX = 0

        const onMouseDown = ( e: MouseEvent ) => {
            if ( e.button === 2 ) {
                dragging = true
                lastX = e.clientX
            }
        }

        const onMouseMove = ( e: MouseEvent ) => {
            if ( !dragging ) return
            const deltaX = e.clientX - lastX
            lastX = e.clientX
            setTheta( ( prev ) => prev - deltaX * 0.005 )
        }

        const onMouseUp = () => ( dragging = false )

        window.addEventListener( "wheel", handleWheel )
        window.addEventListener( "mousedown", onMouseDown )
        window.addEventListener( "mousemove", onMouseMove )
        window.addEventListener( "mouseup", onMouseUp )
        window.addEventListener( "contextmenu", ( e ) => e.preventDefault() )

        return () => {
            window.removeEventListener( "wheel", handleWheel )
            window.removeEventListener( "mousedown", onMouseDown )
            window.removeEventListener( "mousemove", onMouseMove )
            window.removeEventListener( "mouseup", onMouseUp )
            window.removeEventListener( "contextmenu", (e) => e.preventDefault() )
        }
    }, [] )

    useFrame( ( _, delta ) => {
        const camera = camRef.current
        const target = targetRef?.current
        if ( !camera || !target ) return

        const targetPos = target.translation()

        const x = targetPos.x + distance * Math.sin( fixedPhi ) * Math.sin( theta )
        const y = targetPos.y + distance * Math.cos( fixedPhi )
        const z = targetPos.z + distance * Math.sin( fixedPhi ) * Math.cos( theta )

        camera.position.set( x, y, z )
        camera.lookAt(targetPos.x, targetPos.y, targetPos.z)
    } )

    return (
        <PerspectiveCamera
            ref={ camRef }
            makeDefault
            fov={ 60 }
            position={ [ 5, 10, 5 ] }
        />
    )
}