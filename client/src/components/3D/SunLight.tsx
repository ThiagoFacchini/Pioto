import { useRef, RefObject } from 'react'
import { DirectionalLightHelper } from 'three'
import { useHelper } from '@react-three/drei'
import * as THREE from 'three'

import { useGameStore } from '../../stores/GameStore'

export default function SunLight() {
  const lightRef = useRef<THREE.DirectionalLight>( null )

  const hoursPassed = useGameStore( ( state ) => state.hoursPassed )
  const hourInDay = hoursPassed % 24

  const lightIntensity = Math.max( 0, Math.cos( ( Math.PI * ( hourInDay - 12 ) ) / 12 ) )

  // Attach the helper to this light
  useHelper( lightRef as RefObject<THREE.DirectionalLight>, DirectionalLightHelper, 1, 'hotpink' )

  console.log( 'light intensity is: ' ,lightIntensity )
  return (
    <directionalLight
      ref={ lightRef }
      position={ [0, 10, 0] }
      intensity={ lightIntensity }
      castShadow
    />
  )
}