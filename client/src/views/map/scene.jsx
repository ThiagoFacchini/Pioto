import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'

import SunLight from '../../components/sunLight'
import Camera from '../../components/camera'
import Character from '../../components/character'

export default function Scene() {
  const playerRef = useRef()

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

          <Character forwardedRef={ playerRef } scale={ 1 } position={ [ 0, 0, 0 ]} />

          <Camera targetRef={ playerRef } />
        </Canvas>
    </KeyboardControls>
  )
}