// 📦 - IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// [ CORE ]
// ─────────────────────────────────────────────────────────────────────────────
import { useRef, RefObject, useEffect } from 'react'
import { DirectionalLightHelper, DirectionalLight } from 'three'
import { useHelper } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// [ STORES ]
// ─────────────────────────────────────────────────────────────────────────────
import { useGameStore } from '../../stores/GameStore'
import { useConfigsStore } from '../..//stores/ConfigsStore'
import { useDebugStore } from '../../stores/DebugStore'
// =============================================================================

// 🧩 - COMPONENTS
export default function SunLight() {
    const gameDate = useGameStore( ( state ) => state.gameTime )
    const realMillisecondsPerHour = useConfigsStore(( state ) => state.realMillisecondsPerHour )
    const showCollisions = useDebugStore( ( state ) => state.showCollisions )

    const lightRef = useRef< DirectionalLight >( null )
    const helperRef = useRef< DirectionalLightHelper | null >( null )
    const scene = useThree( state => state.scene )

    const sunRadius = 200
    const center = new THREE.Vector3(0, -1, 0)

    // Store last full hour received from server
    const lastHourRef = useRef( gameDate.getHours() )
    const elapsedMsRef = useRef( 0 )

    useEffect( () => {
        if ( !lightRef.current ) return

        if ( showCollisions && !helperRef.current ) {
            const helper = new DirectionalLightHelper( lightRef.current, 1, 'hotpink' )
            scene.add( helper )
            helperRef.current = helper
        }

        if ( !showCollisions && helperRef.current ) {
            scene.remove ( helperRef.current )
            helperRef.current.dispose()
            helperRef.current = null
        }
    }, [ showCollisions, scene ])

    useEffect( () => {
        // On server tick, update hour and reset interpolation
        const newHour = gameDate.getHours()
        const lastHour = lastHourRef.current

        if ( newHour !== lastHour ) {
            lastHourRef.current = newHour
            elapsedMsRef.current = 0

        } else {
            elapsedMsRef.current = Math.min( elapsedMsRef.current, realMillisecondsPerHour )
        }
    }, [ gameDate ] )


    useFrame( ( _, delta ) => {
        if ( !lightRef.current ) return

        // Advance smooth time
        elapsedMsRef.current += delta * 1000
        const progress = Math.min( elapsedMsRef.current / realMillisecondsPerHour, 1 )
        const smoothHour = ( lastHourRef.current + progress ) % 24

        // Convert to sun angle
        let angle: number
        let visible = true

        if ( smoothHour >= 6 && smoothHour <= 18 ) {
            const t = ( smoothHour - 6 ) / 12
            angle = t * Math.PI

        } else {
            const t = smoothHour < 6
                ? ( smoothHour + 6 ) / 12
                : ( smoothHour - 18 ) / 12
            angle = Math.PI + t * Math.PI
            visible = false
        }

        const x = Math.cos( angle ) * sunRadius
        const y = Math.sin( angle ) * sunRadius
        const z = 0

        lightRef.current.position.set( x, y, z )
        lightRef.current.lookAt( center )
        lightRef.current.intensity = visible ? 1 : 0

        // Updating the helper
        if ( helperRef.current )  {
            helperRef.current.update()
        }
    })

    return (
        <directionalLight
            ref={ lightRef }
            position={ [ 0, sunRadius, 0 ] }
            intensity={ 1 }
            castShadow
        />
    )
}