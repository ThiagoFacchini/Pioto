// 📦 - IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// [ CORE ]
// ─────────────────────────────────────────────────────────────────────────────
import { useRef, RefObject, useState } from 'react'
import { DirectionalLightHelper } from 'three'
import { useHelper } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// [ STORES ]
// ─────────────────────────────────────────────────────────────────────────────
import { useGameStore } from '../../stores/GameStore'
import { useConfigsStore } from '../..//stores/ConfigsStore'
// =============================================================================

// 🧩 - COMPONENTS
export default function SunLight() {
    const hoursPassed = useGameStore( ( state ) => state.hoursPassed )
    const realMillisecondsPerHour = useConfigsStore((state) => state.realMillisecondsPerHour)

    const lightRef = useRef<THREE.DirectionalLight>( null )
    useHelper( lightRef as RefObject<THREE.DirectionalLight>, DirectionalLightHelper, 1, 'hotpink' )

    const [smoothedHour, setSmoothedHour ] = useState( hoursPassed )

    // Sun orbit parameters
    const sunRadius = 200
    const center = new THREE.Vector3( 0, -1, 0 )

     useFrame( ( _, delta ) => {
        if ( !lightRef.current ) return

        //  delta = seconds since last frame
        const hourDelta = ( delta * 1000 ) / realMillisecondsPerHour
        setSmoothedHour( ( prev ) => ( prev + hourDelta ) % 24 )

        const hourInDay = smoothedHour % 24

        // Sun position in orbit ( sunrise = east, noon = top, sunset = west )
        let angle: number
        let visible: boolean = true

        if (hourInDay >= 6 && hourInDay <= 18) {
                // Map 6–18 to 0–π radians (sunrise to sunset)
                const t = (hourInDay - 6) / 12                      // normalized [0, 1]
                angle = t * Math.PI

        } else {
            // Night time: keep sun below
            const t = hourInDay < 6
                ? (hourInDay + 6) / 12                          // 0–6 → 6–12 (just for orbit math)
                : (hourInDay - 18) / 12                         // 18–24 → 0–6

                angle = Math.PI + t * Math.PI                   // π → 2π (sun is behind the map)
            visible = false
        }

        const x = Math.cos( angle ) * sunRadius
        const y = Math.sin( angle ) * sunRadius
        const z = 0

        lightRef.current.position.set( x ,y ,z )
        lightRef.current.lookAt( center )

    } )
   


    return (
        <directionalLight
        ref={ lightRef }
        position={ [0, sunRadius, 0] }
        intensity={ 1 }
        castShadow
        />
    )
}