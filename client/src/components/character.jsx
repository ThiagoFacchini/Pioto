import { useEffect, useRef } from 'react'
import { useGLTF, useAnimations, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function Character( { forwardedRef, showEyes = true, ...props } ) {
    const gltf = useGLTF( "./BaseCharacter-v2.glb" )
    const { animations } = gltf
    const { ref, actions } = useAnimations( animations, gltf.scene )

    const keys = useKeyboardControls( ( state ) => state )
    const characterRef = ref 

    const isMovingRef = useRef( false )
    const eyesRef = useRef()

    // Prints model meshes and components
    // useEffect(() => {
    //     gltf.scene.traverse((obj) => {
    //         console.log(obj.name)
    //     })
    // }, [gltf])

    useEffect( () => { 
        eyesRef.current = gltf.scene.getObjectByName( "Eye_1" )
        if ( eyesRef.current ) eyesRef.current.visible = showEyes
    }, [ gltf, showEyes ] )


    useEffect( () => {
        if ( forwardedRef ) {
            forwardedRef.current = characterRef.current
        }
    }, [ characterRef, forwardedRef ] )


    useEffect(() => {
        actions['Idle']?.reset().fadeIn(0.2).play()
    }, [actions])


    useFrame( ( _, delta ) => {
        const dir = { x: 0, z: 0 }

        if ( keys.forward ) dir.z -= 1
        if ( keys.backward ) dir.z += 1
        if ( keys.left ) dir.x -= 1
        if ( keys.right ) dir.x += 1

        const len = Math.hypot( dir.x, dir.z )
        const isMoving = len > 0

        characterRef.current.userData.isMoving = isMoving

        if ( isMoving !== isMovingRef.current ) {
            isMovingRef.current = isMoving

            if ( isMoving ) {
                actions['Idle']?.fadeOut( 0.2 )
                actions['Walk']?.reset().fadeIn( 0.2 ).play()

            } else {
                actions['Walk']?.fadeOut( 0.2 )
                actions['Idle']?.reset().fadeIn( 0.2 ).play()
            }
        }

        if ( len > 0 ) {
            dir.x /= len
            dir.z /= len

            const speed = 3
            characterRef.current.position.x += dir.x * speed * delta
            characterRef.current.position.z += dir.z * speed * delta

            // Calculate facing angle and rotate character
            const angle = Math.atan2( dir.x, dir.z )
            characterRef.current.rotation.y = angle + Math.PI
        }
    } )


    return <primitive object={ gltf.scene } ref={ ref } { ...props } />
}