import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

import { Resource } from './../../../../shared/resourcesType'

import SunLight from '../../components/sunLight'
import Camera from '../../components/camera'
import Character from '../../components/Character'

import { useResourcesStore } from '../../stores/resourcesStore'

import Rock from '../../resources/rock'



//  Layers
export const LAYER_COLLISION = new THREE.Group()
LAYER_COLLISION.name = "LAYER_COLLISIOIN"


// Keyboard Controls Configuration
export const CONTROLS = [
  { name: 'forward', keys: [ 'w' ] },
  { name: 'backward', keys: [ 's' ] },
  { name: 'left', keys: [ 'a' ] },
  { name: 'right', keys: [ 'd' ] },
  { name: 'jump', keys: [ 'space' ] }
]


export default function Scene() {
  const playerRef = useRef<THREE.Object3D>(null)

  const resources = useResourcesStore( ( state ) => state.resources )
  const areResourcesLoaded = useResourcesStore( ( state ) => state.areResourcesLoaded )

   function getResources() {
    return resources.map( ( res: Resource, i: number ) => {
      if ( res.type === "rock" && res.meshFile == "rock 1.glb" ) {
        return <Rock 
          id={ res.id } 
          position={ res.position } 
          size={ res.size }
          collidable={ res.collidable }
          key={ `rock_${i}` }
        />
      }
      return null
    })
  }

  return (
    <KeyboardControls map={ CONTROLS } >
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