import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

import { Resource } from '../../../../shared/resourceType'

import SunLight from '../../components/3D/SunLight'
import Camera from '../../components/3D/Camera'
import Character from '../../components/3D/PlayerCharacter'

import { useResourcesStore } from '../../stores/resourcesStore'
import { useControlsStore } from '../..//stores/controlsStore'

import Rock from '../../resources/Rock'



//  Layers
export const LAYER_COLLISION = new THREE.Group()
LAYER_COLLISION.name = "LAYER_COLLISIOIN"



export default function Scene() {
  const playerRef = useRef<THREE.Object3D>(null)
  
  const controls = useControlsStore( ( state ) => state.controls )
  const resources = useResourcesStore( ( state ) => state.resources )
  const areResourcesLoaded = useResourcesStore( ( state ) => state.areResourcesLoaded )

   function getResources() {
    return resources.map( ( res: Resource, i: number ) => {
      if ( res.type === "rock" && res.meshFile == "rock 1.glb" ) {
        return <Rock resource={ res } key={ res.id } />
      }
      return null
    })
  }

  return (
    <KeyboardControls map={ controls } >
        <Canvas>
          {/* Layers */}
          <primitive object={ LAYER_COLLISION } />
          {/* End of Layer */}
          <ambientLight intensity={0.5} />
          <SunLight />

          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="green" />
          </mesh>

          <Character forwardedRef={ playerRef } showEyes={ true } scale={ 1 } position={ [ 0, 0, 0 ]} />

          <Camera targetRef={ playerRef } />

          {areResourcesLoaded && getResources()}
        </Canvas>
    </KeyboardControls>
  )
}