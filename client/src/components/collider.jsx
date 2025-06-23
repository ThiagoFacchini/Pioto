import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { LAYER_COLLISION } from '../views/map/scene'

export default function Collider( { type, size, position } ) {
    const ref = useRef()

    useEffect( () => {
        const mesh = ref.current
        if ( mesh && LAYER_COLLISION ) {
            LAYER_COLLISION.add( mesh )

            return () => LAYER_COLLISION.remove( mesh )
        } 
    }, [] )

    let geometry = null
    
    switch ( type ) {
        case 'CUBE':
            geometry = new THREE.BoxGeometry( ...size )
            break
        case 'CYLINDER':
            geometry = new THREE.CylinderGeometry( ...size )
            break
        case 'SPHERE':
            geometry = new THREE.SphereGeometry( size[0] )
            break
        default:
            throw new Error( `Unsupported collider type: ${type}` )
    }

    geometry.computeBoundingBox()

    const adjustedPosition = new THREE.Vector3( ...position )
    adjustedPosition.y = adjustedPosition.y + size[1] / 2

    return (
        <mesh
            ref={ ref }
            position={ new THREE.Vector3( ...adjustedPosition ) }
            userData={ { collidable: true } }
            visible={ true }
        >
            { geometry && <primitive object={ geometry } attach="geometry" /> }
            <meshBasicMaterial color="red" wireframe transparent opacity={ 0.4 } />
        </mesh>
    )
}