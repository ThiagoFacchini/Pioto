import { useRef } from 'react'
import { DirectionalLightHelper } from 'three'
import { useHelper } from '@react-three/drei'

export default function SunLight() {
  const lightRef = useRef()

  // Attach the helper to this light
  useHelper(lightRef, DirectionalLightHelper, 1, 'hotpink')

  return (
    <directionalLight
      ref={lightRef}
      position={[5, 10, 5]}
      intensity={1}
      castShadow
    />
  )
}