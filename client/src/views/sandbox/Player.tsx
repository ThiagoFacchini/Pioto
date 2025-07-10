import { useRef, useMemo, useEffect } from 'react'
import { RigidBody } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { useGLTF, useKeyboardControls, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
import * as THREE from 'three'

export default function PlayerCharacter({ onFire }) {
    const characterRef = useRef<RapierRigidBody>( null )
    const isMovingRef = useRef( false )
    const canJumpRef = useRef( true )

    const [ , getKeys ] = useKeyboardControls()

    const gltf = useGLTF( '/BaseCharacter-v2.glb' )

    const cloned = useMemo( () => {
        const scene = clone( gltf.scene )
        scene.traverse( ( child ) => {
            if ( child instanceof THREE.Mesh ) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        return scene
    }, [ gltf.scene ] )

    const { actions, mixer } = useAnimations( gltf.animations, cloned )


    // Starts animation on IDLE
    useEffect(() => {
        actions["Idle"]?.reset().fadeIn(0.2).play()
    }, [actions])

    useFrame( ( _, delta ) => { 
        const body = characterRef.current

        if ( !body ) return

        const keys = getKeys()

        const move = new THREE.Vector3()

        if ( keys.forward ) move.z -= 1
        if ( keys.backward ) move.z += 1
        if ( keys.left ) move.x -= 1
        if ( keys.right ) move.x += 1

        const isMoving = move.lengthSq() > 0

        // Handle Animations
        if ( isMoving !== isMovingRef.current ) {
            isMovingRef.current = isMoving

            if ( isMoving ) {
                actions[ 'Idle' ]?.fadeOut( 0.2 )
                actions[ 'Walk' ]?.reset().fadeIn( 0.2 ).play()
            } else {
                actions[ 'Walk' ]?.fadeOut( 0.2 )
                actions[ 'Idle' ]?.reset().fadeIn( 0.2 ).play()
            }
        }

        const v = body.linvel()

        if ( move.lengthSq() > 0 ) {
            move.normalize().multiplyScalar( 4 )
            body.setLinvel( { x: move.x, y: v.y, z: move.z }, true )

            const lookingAngle = Math.atan2( -move.x, -move.z )
            cloned.rotation.y = lookingAngle

        } else {
            body.setLinvel({ x: 0, y: v.y, z: 0 }, true )
        }

        if ( keys.jump && canJumpRef.current ) {
            console.log( keys.forward )
            const velocity = body.linvel()
            const isGrounded = Math.abs( velocity.y ) < 0.65

            if ( isGrounded ) {
                body.setLinvel({ x: velocity.x, y: 3, z: velocity.z }, true )
                canJumpRef.current = false
            }
        }

        if ( !keys.jump ) {
            canJumpRef.current = true
        }


        if ( getKeys().fire ) {
            const pos = body.translation()
            const forward = new THREE.Vector3( 0, 0, -1 )
                .applyEuler( new THREE.Euler( 0, cloned.rotation.y , 0 ) )
                .normalize()
                .multiplyScalar( 5 )

            onFire?.(
                [ pos.x, pos.y + 1, pos.z ],
                [ forward.x, forward.y, forward.z ]
            )
        }

        // console.log("Position: ", body.translation() )
        // console.log("Rotation: ", body.rotation() )

    } )

    return (
        <RigidBody
            ref={ characterRef }
            position={ [ 0, 1.1, 0 ] }
            colliders="cuboid"
            mass={ 1 }
            restitution={ 0.1 }
            friction={ 1 }
            lockRotations
        >
            <primitive object={ cloned } />
        </RigidBody>
    )
}