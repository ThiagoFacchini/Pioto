// 📦 - IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// [ CORE ]
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// [ STORES ]
// ─────────────────────────────────────────────────────────────────────────────
import { useGameStore } from '../../../stores/GameStore'
import { useConfigsStore } from '../../../stores/ConfigsStore'

// ─────────────────────────────────────────────────────────────────────────────
// [ ASSETS ]
// ─────────────────────────────────────────────────────────────────────────────
// @ts-ignore
import clockImage from './assets/clock.png'
// @ts-ignore
import styles from './styles.module.css'
// =============================================================================



// 🧩 - COMPONENTS
export default function GameClock() {
    const gameDate = useGameStore( ( state ) => state.date )
    const realMillisecondsPerHour = useConfigsStore( ( state ) => state.realMillisecondsPerHour )

    const rotationRef = useRef( 0 )
    const prevHours = useRef( gameDate.getHours() )

    const rawHour = gameDate.getHours() + 1

    const hoursToDegrees =  ( hour: number ) : number => {
        switch ( hour ) {
            case 0: return 0
            case 1: return 15
            case 2: return 30
            case 3: return 45
            case 4: return 60
            case 5: return 75
            case 6: return 90
            case 7: return 105
            case 8: return 120
            case 9: return 135
            case 10: return 150
            case 11: return 165
            case 12: return 180
            case 13: return 195
            case 14: return 210
            case 15: return 225
            case 16: return 240
            case 17: return 255
            case 18: return 270
            case 19: return 285
            case 20: return 300
            case 21: return 315
            case 22: return 330
            case 23: return 345
            default: return 0
        }
    }

    useEffect( () => { 
        rotationRef.current = hoursToDegrees( rawHour )
        prevHours.current = rawHour
    }, [] )


    useEffect( () => { 
        const prev = prevHours.current
        const next = rawHour

        const prevDeg = hoursToDegrees( prev )
        const nextDeg = hoursToDegrees( next )

        const delta = (next - prev + 24) % 24

         if ( delta > 0 ) {
            const clockwise = ( nextDeg - prevDeg + 360 ) % 360
            rotationRef.current += clockwise
            prevHours.current = next
        }

    }, [ rawHour ] )


    return (
        <div className={ styles.gameclockContainer }>
            <div className={ styles.imageContainer }>
                <img
                    src={ clockImage }
                    className={ styles.withTransition }
                    style={ {
                        transform: `rotate(${ rotationRef.current + 15 }deg)`,
                        transformOrigin: 'center center',
                        width: '100%',
                        display: 'block',
                        '--clock-transition-duration': `${ realMillisecondsPerHour }ms`
                    } as React.CSSProperties }
                />
            </div>
            <div className={ styles.temporary }>
                { gameDate.getHours() }
            </div>
        </div>
    )
}