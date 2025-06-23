import { useEffect, useRef, RefObject } from 'react'
import { useGLTF, useAnimations, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { LAYER_COLLISION } from '../views/map/scene'

type PropsType = {
    forwardedRef: RefObject<THREE.Object3D | null>,
    showEyes: boolean,
    scale: number,
    position: [ number, number, number]
}

type ControlKeys = 'forward' | 'backward' | 'left' | 'right' | 'jump'


export default function Character( props: PropsType ) {
    const gltf = useGLTF( "http://10.0.1.184:8081/models/BaseCharacter-v2.glb" )
    const { animations } = gltf
    const { ref, actions } = useAnimations( animations, gltf.scene )

    const forward = useKeyboardControls< ControlKeys >( ( state ) => state.forward )
    const backward = useKeyboardControls< ControlKeys >( ( state ) => state.backward )
    const left = useKeyboardControls< ControlKeys >( ( state ) => state.left )
    const right = useKeyboardControls< ControlKeys >( ( state ) => state.right )

    const characterRef = ref 

    const isMovingRef = useRef( false )
    const eyesRef = useRef<THREE.Object3D>( null)
    const collisionBoxRef = useRef( new THREE.Box3() )
    const boxHelperRef = useRef<THREE.Box3Helper>( null )

    useEffect( () => { 
        const eyesMesh = gltf.scene.getObjectByName( "Eye_1" )
        if ( eyesMesh ) eyesRef.current =  eyesMesh
        if ( eyesRef.current ) eyesRef.current.visible = props.showEyes
    }, [ gltf, props.showEyes ] )


    useEffect( () => {
        if ( props.forwardedRef && characterRef.current ) {
            props.forwardedRef!.current = characterRef.current
        }
    }, [ characterRef, props.forwardedRef ] )


    useEffect(() => {
        actions['Idle']?.reset().fadeIn(0.2).play()
    }, [actions])


    // Helper
    useEffect( () => {
        const helper = new THREE.Box3Helper(collisionBoxRef.current, 0xffff00)
        boxHelperRef.current = helper
        
        if ( characterRef.current?.parent ) characterRef.current.parent.add(helper)

        return () => {
            if ( characterRef.current?.parent ) characterRef.current.parent.add(helper)
        }
    }, [])

    
    useFrame( ( _, delta ) => {
        const dir = { x: 0, z: 0 }

        if ( forward ) dir.z -= 1
        if ( backward ) dir.z += 1
        if ( left ) dir.x -= 1
        if ( right ) dir.x += 1

        const len = Math.hypot( dir.x, dir.z )
        const isMoving = len > 0

        if ( characterRef.current ) characterRef.current.userData.isMoving = isMoving

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

            if ( characterRef.current ) characterRef.current.updateMatrixWorld( true )
            const moveVec = new THREE.Vector3( dir.x * speed * delta, 0, dir.z * speed * delta )
            
            const width = 0.8
            const depth = 0.8
            const height = 1.7

            if (!characterRef.current) return

            const center = characterRef.current.position.clone().add( new THREE.Vector3( 0, height / 2, 0 ) ).add( moveVec )
            const collisionBox = new THREE.Box3().setFromCenterAndSize(center, new THREE.Vector3(width, height, depth))
            
            collisionBoxRef.current.copy( collisionBox )
            boxHelperRef.current?.updateMatrixWorld( true )

            let collided = false

            LAYER_COLLISION.traverse( ( obj ) => {
                if ( 
                    obj instanceof THREE.Mesh && 
                    obj.userData.collidable === true && 
                    obj !== characterRef.current && 
                    obj.geometry?.boundingBox 
                ) {
                    const objBox = obj.geometry.boundingBox.clone()
                    objBox.applyMatrix4( obj.matrixWorld )
                    
                    if ( collisionBox.intersectsBox( objBox ) ) {
                        collided = true
                    }
                }
            } )

            if ( !collided ) {
                characterRef.current.position.add( moveVec )

                const angle = Math.atan2( dir.x, dir.z )
                characterRef.current.rotation.y = angle + Math.PI
            }

        }
    } )


    return <primitive object={ gltf.scene } ref={ ref } { ...props } />
}