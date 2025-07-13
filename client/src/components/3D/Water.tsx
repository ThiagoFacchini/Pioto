// 📦 - IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// [ CORE ]
// ─────────────────────────────────────────────────────────────────────────────
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'


// ─────────────────────────────────────────────────────────────────────────────
// [ SHARED TYPES & ENUMS ]
// ─────────────────────────────────────────────────────────────────────────────
export type WaterBodyType = {
    width: number,
    height: number,
    position: [ number, number, number ],
    waveStrength: number,
    resolution: number,
    opacity: number
}
// =============================================================================



// 🧩 - COMPONENTS
export default function WaterBody( props: WaterBodyType ) {
    const waterRef = useRef< THREE.Mesh >(null)

    const geometry = useMemo(() => {
        const base = new THREE.PlaneGeometry(props.width, props.height, props.resolution, props.resolution)
        base.deleteAttribute('normal') // we're going to recalculate flat normals
        
        const geom = base.toNonIndexed()     // THIS makes it low poly: unshares vertices between faces
        const count = geom.attributes.position.count
        const colors = new Float32Array(count * 3)
        const color = new THREE.Color()

        // Assign a single color per triangle (3 vertices at a time)
        for (let i = 0; i < count; i += 3) {
            const y = geom.attributes.position.getY(i)
            const mix = (y + props.height / 2) / props.height
            color.setHSL(0.55, 1, 0.4 + Math.random() * 0.1 - mix * 0.2) // variation

            for (let j = 0; j < 3; j++) {
                color.toArray(colors, (i + j) * 3)
            }
        }

        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geom.computeVertexNormals() // for lighting
    return geom
    }, [ props.width, props.height ] )

    useFrame( ( { clock } ) => {
        const t = clock.getElapsedTime()

        const geom = waterRef.current!.geometry as THREE.PlaneGeometry
        const pos = geom.attributes.position

        for ( let i = 0; i < pos.count; i++ ) {
            const x = pos.getX( i )
            const y = pos.getY( i )
            const wave = Math.sin(x * 0.5 + t) * Math.cos(y * 0.5 + t) * (props.waveStrength ?? 0.2)
            pos.setZ(i, wave)
        }

        pos.needsUpdate = true
        geom.computeVertexNormals()
    } )

  const position = new THREE.Vector3( props.position[0], props.position[1], props.position[2] )

  return (
    <RigidBody type={ "fixed" } colliders={ false } position={ position }>
        <mesh ref={ waterRef } rotation-x={ -Math.PI / 2 } geometry={ geometry }>
            <meshStandardMaterial color={ undefined } vertexColors flatShading transparent depthWrite={ false } opacity={ 0.5 } />
        </mesh>
        <CuboidCollider name={ "water" } args={ [ props.width / 2, 1, props.height / 2 ] } position={ [ 0, -0.5, 0 ] } sensor />
    </RigidBody>
  )
}