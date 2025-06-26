import { useEffect, useRef, RefObject } from 'react'
import { useGLTF, useAnimations, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { LAYER_COLLISION } from '../../views/map/Scene'


type PropsType = {
    forwardedRef: RefObject<THREE.Object3D | null>,
    position: [ number, number, number ],
    rotation: [ number, number, number ],
    updateCallback: () => void,
    showEyes: boolean,
    scale: number,
}

type ControlKeys = 'forward' | 'backward' | 'left' | 'right' | 'jump'


const updateRate = 100 // ( HZ = 1000 / hz)


export default function PlayerCharacter( props: PropsType ) {
    const gltf = useGLTF( "http://10.0.1.184:8081/models/BaseCharacter-v2.glb" )
    const { animations } = gltf
    const { ref, actions } = useAnimations( animations, gltf.scene )

    const forward = useKeyboardControls< ControlKeys >( ( state ) => state.forward )
    const backward = useKeyboardControls< ControlKeys >( ( state ) => state.backward )
    const left = useKeyboardControls< ControlKeys >( ( state ) => state.left )
    const right = useKeyboardControls< ControlKeys >( ( state ) => state.right )

    const isMovingRef = useRef( false )
    const collisionBoxRef = useRef( new THREE.Box3() )
    const boxHelperRef = useRef<THREE.Box3Helper>( null )

    let lastUpdateTime = 0

    // const eyesRef = useRef<THREE.Object3D>( null)

    // useEffect( () => { 
    //     const eyesMesh = gltf.scene.getObjectByName( "Eye_1" )
    //     if ( eyesMesh ) eyesRef.current =  eyesMesh
    //     if ( eyesRef.current ) eyesRef.current.visible = props.showEyes
    // }, [ gltf, props.showEyes ] )


    useEffect( () => {
        if ( props.forwardedRef && ref.current ) {
            props.forwardedRef!.current = ref.current
        }
    }, [ ref, props.forwardedRef ] )


    useEffect(() => {
        actions['Idle']?.reset().fadeIn(0.2).play()
    }, [actions])


    // Helper
    useEffect( () => {
        const helper = new THREE.Box3Helper( collisionBoxRef.current, 0xffff00 )
        boxHelperRef.current = helper
        
        if ( ref.current?.parent ) ref.current.parent.add(helper)

        return () => {
            if ( ref.current?.parent ) ref.current.parent.add(helper)
        }
    }, [])


    function getDirection() {
        const dir = { x: 0, z: 0 }

        if ( forward ) dir.z -= 1
        if ( backward ) dir.z += 1
        if ( left ) dir.x -= 1
        if ( right ) dir.x += 1

        return dir
    }

    
    function updateAnimationState( isMoving: boolean ) {
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
    }


    function checkCollisions (moveVec: THREE.Vector3 ): boolean {
        if ( !ref.current ) return true

        const width = 0.8
        const depth = 0.8
        const height = 1.7

        const center = ref.current.position.clone().add( new THREE.Vector3( 0, height / 2, 0 ) ).add( moveVec )
        const collisionBox = new THREE.Box3().setFromCenterAndSize(center, new THREE.Vector3(width, height, depth))
        
        collisionBoxRef.current.copy( collisionBox )
        boxHelperRef.current?.updateMatrixWorld( true )

        let collided = false

        LAYER_COLLISION.traverse( ( obj ) => {
            if ( 
                obj instanceof THREE.Mesh && 
                obj.userData.collidable === true && 
                obj !== ref.current && 
                obj.geometry?.boundingBox 
            ) {
                const objBox = obj.geometry.boundingBox.clone()
                objBox.applyMatrix4( obj.matrixWorld )
                
                if ( collisionBox.intersectsBox( objBox ) ) {
                    collided = true
                }
            }
        } )

        return collided
    }

    
    useFrame( ( _, delta ) => {
        const dir = getDirection()
        const len = Math.hypot( dir.x, dir.z )
        const isMoving = len > 0

        if ( ref.current ) ref.current.userData.isMoving = isMoving
        updateAnimationState( isMoving )

        if ( len > 0 && ref.current) {
            dir.x /= len
            dir.z /= len

            const speed = 3
            if ( ref.current ) ref.current.updateMatrixWorld( true )
            const moveVec = new THREE.Vector3( dir.x * speed * delta, 0, dir.z * speed * delta )
            
             if ( !checkCollisions( moveVec ) ) {
                ref.current.position.add( moveVec )

                const angle = Math.atan2( dir.x, dir.z )
                ref.current.rotation.y = angle + Math.PI

                const yRotation = THREE.MathUtils.radToDeg( ref.current.rotation.y )
            }
        }

        // Updating server
        const deltaSince = performance.now() - lastUpdateTime

        if ( deltaSince > updateRate ) {
            lastUpdateTime = performance.now()
            props.updateCallback()
        }
    } )


    return <primitive object={ gltf.scene } ref={ ref } position={ props.position } rotation={ props.rotation } />
}