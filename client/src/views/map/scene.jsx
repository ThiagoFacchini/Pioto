import { Canvas } from '@react-three/fiber'
import { KeyboardControls, OrbitControls } from '@react-three/drei'
import SunLight from './sunLight'

export default function Scene() {
  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'w'] },
        { name: 'backward', keys: ['ArrowDown', 's'] },
        { name: 'left', keys: ['ArrowLeft', 'a'] },
        { name: 'right', keys: ['ArrowRight', 'd'] },
        { name: 'jump', keys: ['Space'] },
      ]}
    >
        <Canvas camera={{ position: [5, 1, 0], fov: 60 }}>
        {/* Ambient light: soft global lighting */}
        <ambientLight intensity={0.5} />
        
        {/* Directional light: like a sun */}
        <SunLight />

        {/* A simple green plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="green" />
        </mesh>
        </Canvas>
    </KeyboardControls>
  )
}