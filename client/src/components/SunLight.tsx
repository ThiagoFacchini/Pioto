import { useRef, RefObject } from 'react'
import { DirectionalLightHelper } from 'three'
import { useHelper } from '@react-three/drei'
import * as THREE from 'three'

export default function SunLight() {
  const lightRef = useRef<THREE.DirectionalLight>( null )

  // Attach the helper to this light
  useHelper( lightRef as RefObject<THREE.DirectionalLight>, DirectionalLightHelper, 1, 'hotpink' )

  return (
    <directionalLight
      ref={lightRef}
      position={[0, 10, 0]}
      intensity={1}
      castShadow
    />
  )
}