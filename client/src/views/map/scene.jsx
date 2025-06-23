import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

import SunLight from '../../components/sunLight'
import Camera from '../../components/camera'
import Character from '../../components/character'

import { useResourcesStore } from '../../stores/resourcesStore'

import Rock from './../../resources/rock'


//  Layers
export const LAYER_COLLISION = new THREE.Group()
LAYER_COLLISION.name = "LAYER_COLLISIOIN"


export default function Scene() {
  const playerRef = useRef()

  const resources = useResourcesStore( ( state ) => state.resources )
  const areResourcesLoaded = useResourcesStore( ( state ) => state.areResourcesLoaded )

   function getResources() {
    return resources.map( ( res, i ) => {
      if ( res.type === "rock" && res.meshFile == "rock 1.glb" ) {
        return <Rock 
          id={ res.id } 
          position={ res.position } 
          collidable={ res.collidable }
          key={ `rock_${i}` }
        />
      }
      return null
    })
  }

  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: [ 'w' ] },
        { name: 'backward', keys: [ 's' ] },
        { name: 'left', keys: [ 'a' ] },
        { name: 'right', keys: [ 'd' ] },
        { name: 'jump', keys: [ 'space' ] }
      ]}
    >
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