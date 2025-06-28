import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, Text } from '@react-three/drei'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'

import { AnimationNameType } from './../../../../shared/playerType'

import { useRef, useEffect, useMemo } from 'react'


type PropsType = {
    name?: string,
    animationName: AnimationNameType,
    position: [ number, number, number ],
    rotation: [ number, number, number ],
}


function Character ( props: PropsType ) {
    const gltf = useGLTF( "http://10.0.1.184:8081/models/BaseCharacter-v2.glb" )
    const clonedInstance = useMemo(() => {
        const instance = clone( gltf.scene )
        instance.position.set( 0, 0, 0 )
        instance.rotation.set( 0, 0, 0 )
        return instance
    }, [gltf.scene] )

    const { animations } = gltf
    const characterRef = useRef<THREE.Group>( null )
    const { actions } = useAnimations( animations, clonedInstance )

   const nameTagRef = useRef<THREE.Object3D>( null )

   useEffect( () => { 
    if ( actions && props.animationName ) {
        actions[ props.animationName ]?.reset().fadeIn( 0.2 ).play()
    }
   }, [ actions, props.animationName ] )


   useFrame( ( { camera } ) => {
        // Positioning nameTag
        if ( characterRef.current && nameTagRef.current ) {
            nameTagRef.current.lookAt( camera.position )
        }
    })


    return (
        <group 
            ref={ characterRef } 
            position={ props.position } 
            rotation={ props.rotation }
        >
            <primitive object={ clonedInstance } />

           <Text
                ref={ nameTagRef }
                position={ [ 0, 2, 0 ] }
                fontSize={ 0.15 }
                color="white"
                anchorX="center"
                anchorY="bottom"
                outlineWidth={ 0.01 }
                outlineColor="black"
            >
                { props.name ? props.name : 'unknown' }
            </Text>

        </group>
    )
}


export default Character