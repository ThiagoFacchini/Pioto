import React, { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, KeyboardControls, useGLTF } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'

import PlayerCharacter from './Player'
import Projectile from './Projectile'


type ProjectileData = {
  id: number
  position: [number, number, number]
  direction: [number, number, number]
}


export default function Sandbox() {
    const [ projecttiles, setProjectiles ] = useState< ProjectileData[] >( [] )
    const { scene } = useGLTF('/Test Terrain 01.glb')

    const handleFire = ( position: [ number, number, number], direction: [ number, number, number ] ) => {
        setProjectiles( ( prev ) => [
            ...prev,
            { id: Date.now(), position, direction }
        ] )
    }

    return (
        <>
            <div style={{ width: '100vw', height: '100vh' }}>
                <Canvas camera={{ position: [ 0 , 10, 20 ], fov: 50 }}>
                    <KeyboardControls
                        map={ [
                            { name: 'forward', keys: [ 'KeyW' ] },
                            { name: 'backward', keys: [ 'KeyS' ] },
                            { name: 'left', keys: [ 'KeyA' ] },
                            { name: 'right', keys: [ 'KeyD' ] },
                            { name: 'jump', keys: [ 'Space' ] },
                            { name: 'fire', keys: [ 'KeyP' ] }
                        ] }
                    >
                        <ambientLight intensity={ 0.5 } />
                        <directionalLight position={ [ 10, 10 ,10 ] } intensity={ 1 } />
                        <OrbitControls />

                        <Physics gravity={ [ 0, -9.81, 0 ] } debug>
                            {/* Terrain */}
                            <RigidBody type="fixed" colliders="trimesh" restitution={ 0.2 } friction={ 1 } >
                                <primitive object={ scene } />
                            </RigidBody>

                            <PlayerCharacter onFire={ handleFire }/>

                            { 
                                projecttiles.map( ( p ) => (
                                    <Projectile key={ p.id } position={ p.position } direction={ p.direction } />
                                ) ) 
                            }
                        </Physics>
                    </KeyboardControls>
                </Canvas>
            </div>
        </>
    )
}