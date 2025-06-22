import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'

import SunLight from '../../components/sunLight'
import Camera from '../../components/camera'
import Character from '../../components/character'

import { useResourcesStore } from '../../stores/resourcesStore'

import Rock from './../../resources/rock'

export default function Scene() {
  const playerRef = useRef()

  const { resources, areResourcesLoaded } = useResourcesStore.getState( ( state ) => ({ 
    resources: state.resources,
    areResourcesLoaded: state.areResourcesLoaded
  }))

  function getResources() {

    return resources.map( ( res, i ) => {
      if ( res.type === "rock" && res.variant == "rock 1.glb" ) {
        return <Rock id={ res.id } position={ res.position } key={ `rock_${i}` }/>
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