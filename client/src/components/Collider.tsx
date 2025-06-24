import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { LAYER_COLLISION } from '../views/map/Scene'

type PropsType = {
    type: 'CUBE' | 'CYLINDER' | 'SPHERE',
    size: [ number, number, number ],
    position: [ number, number, number ],
    isCollidable: boolean
}

export default function Collider( props: PropsType ) {
    const ref = useRef<THREE.Mesh>( null )
    let geometry = null


    useEffect( () => {
        const mesh = ref.current

        if ( mesh && LAYER_COLLISION ) {
            LAYER_COLLISION.add( mesh )
        
            return () => LAYER_COLLISION.remove( mesh )
        } 

        return () => {}
    }, [] )

    
    switch ( props.type ) {
        case 'CUBE':
            geometry = new THREE.BoxGeometry( ...props.size )
            break
        case 'CYLINDER':
            geometry = new THREE.CylinderGeometry( ...props.size )
            break
        case 'SPHERE':
            geometry = new THREE.SphereGeometry( props.size[0] )
            break
        default:
            throw new Error( `Unsupported collider type: ${ props.type }` )
    }


    geometry.computeBoundingBox()

    const adjustedPosition = new THREE.Vector3( ...props.position )
    adjustedPosition.y = adjustedPosition.y + props.size[1] / 2

    
    return (
        <mesh
            ref={ ref }
            position={ new THREE.Vector3( ...adjustedPosition ) }
            userData={ { collidable: props.isCollidable } }
            visible={ true }
        >
            { geometry && <primitive object={ geometry } attach="geometry" /> }
            <meshBasicMaterial color="red" wireframe transparent opacity={ 1 } />
        </mesh>
    )
}