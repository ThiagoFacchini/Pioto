import { useEffect } from 'react'
import { RigidBody } from '@react-three/rapier'

export default function Projectile({ position, direction }: {
  position: [number, number, number],
  direction: [number, number, number]
}) {
  return (
    <RigidBody
      position={position}
      linearVelocity={direction}
      colliders="ball"
      restitution={0.1}
      mass={0.1}
    >
      <mesh>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  )
}