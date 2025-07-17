// 📦 - IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// [ CORE ]
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState, useMemo } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// [ STORES ]
// ─────────────────────────────────────────────────────────────────────────────
import { useGameStore } from '../../../stores/GameStore'
import { useConfigsStore } from '../../../stores/ConfigsStore'

// ─────────────────────────────────────────────────────────────────────────────
// [ ASSETS ]
// @ts-ignore
import clockImage from './assets/clock.png'
// @ts-ignore
import outterRing from './assets/outterRing.png'
// @ts-ignore
import innerRing from './assets/innerRing.png'
// @ts-ignore
import lens from './assets/lens.png'
// @ts-ignore
import background from './assets/background.png'
// @ts-ignore
import seasonHolder from './assets/seasonHolder.png'
// @ts-ignore
import dateHolder from './assets/dateHolder.png'
// @ts-ignore
import styles from './styles.module.css'
// =============================================================================



// 🧩 - COMPONENTS
export default function GameClock() {
    const gameTimeStamp = useGameStore( ( state ) => state.gameTimeStamp )
    const lastTickTimeStamp = useGameStore( ( state ) => state.tickTimeStamp )
    const hasTicked = useGameStore( ( state ) => state.hasTicked )

    const realMillisecondsPerHour = useConfigsStore( ( state ) => state.realMillisecondsPerHour )

    // Converts gameTimeStamp into a Date Object
    const gameDate = new Date( gameTimeStamp )

    const [rotation, setRotation] = useState(0)
    const [isTransitionEnabled, setIsTransitionEnabled] = useState(false)

    const prevHours = useRef(gameDate.getHours() + 1)
    const hasInitiallyRotated = useRef(false)

    const rawHour = gameDate.getHours() + 1


    const clockUpdateInterval = useMemo( () => { 
        if ( !hasTicked ) {
            const delta = Date.now() - lastTickTimeStamp;
            return Math.max(0, realMillisecondsPerHour - delta);
        } 
        return realMillisecondsPerHour;

    }, [ hasTicked, lastTickTimeStamp, realMillisecondsPerHour ] )


    const hoursToDegrees =  ( hour: number ) : number => {
        const normalized = (hour % 24 + 24) % 24;
        switch ( normalized ) {
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
        const targetDeg = hoursToDegrees(rawHour);
        let initialDeg = targetDeg;

        console.log('hasTicked ', hasTicked )

        if ( !hasTicked ) {
            const delta = Date.now() - lastTickTimeStamp;
            const remaining = Math.max( 0, realMillisecondsPerHour - delta )
            const fractionRemaining = remaining / realMillisecondsPerHour

            console.log( 'fractionRemaining ', fractionRemaining )
            initialDeg = targetDeg - ( 15 * fractionRemaining )
            if (initialDeg < 0) initialDeg += 360

            setRotation( initialDeg )

        } else {
            setRotation( targetDeg )
            setIsTransitionEnabled( true )
        }

        prevHours.current = rawHour
        hasInitiallyRotated.current = true
    }, [] );


    // Separate effect to trigger animation after initial render
    useEffect( () => {
        if ( !hasTicked && !isTransitionEnabled && hasInitiallyRotated.current ) {
            setIsTransitionEnabled( true )
            setTimeout( () => {
                setRotation( hoursToDegrees( rawHour ) )
            }, 16 )
            
        }
    }, [isTransitionEnabled, hasTicked, rawHour] )


    useEffect( () => { 
        const prev = prevHours.current
        const next = rawHour 

        const prevDeg = hoursToDegrees( prev )
        const nextDeg = hoursToDegrees( next )

        const delta = (next - prev + 24) % 24

         if ( delta > 0 ) {
            const clockwise = ( nextDeg - prevDeg + 360 ) % 360
            setRotation( ( prevRotation ) => prevRotation + clockwise )
            prevHours.current = next
        }
    }, [ rawHour ] );


    function getFormattedDate( date: Date ): string {
        const day = date.getDate()
        const month = date.toLocaleDateString( 'en-US', { month: 'short' } )
        let suffix

        if ( day >= 11 && day <= 13 ) suffix = 'th'

        switch ( day % 10 ) {
            case 1:
                suffix = 'st'
                break
            case 2:
                suffix = 'nd'
                break
            case 3:
                suffix = 'rd'
                break
            default:
                suffix = 'th'
                break
        }

        return `${ day}${ suffix } - ${ month }`
    }


    if ( !hasInitiallyRotated.current ) return null
    const transitionDuration = isTransitionEnabled ? `${clockUpdateInterval}ms` : '0ms';


    return (
        <div className={ styles.gameclockContainer }>
            <div className={ styles.innerRing } >
                <img src={ innerRing } />
            </div>
            <div className={ styles.lens } >
                <img src={ lens } />
            </div>
            
            <div className={ styles.imageContainer }>
                <img
                    src={ clockImage }
                    className={ styles.withTransition }
                    style={ {
                        transform: `rotate(${ rotation }deg)`,
                        transformOrigin: 'center center',
                        width: '100%',
                        display: 'block',
                        '--clock-transition-duration': transitionDuration,
                    } as React.CSSProperties }
                />
            </div>
            <div className={ styles.background } >
                <img 
                    src={ background } 
                    className={ styles.withTransition }
                    style={ { 
                        transform: `rotate( ${ rotation }deg)`,
                        transformOrigin: 'center center',
                        width: '100%',
                        display: 'block',
                        '--clock-transition-duration': transitionDuration
                    } as React.CSSProperties }
                />
            </div>
            <div className={ styles.outterRing } >
                <img src={ outterRing } />
            </div>
            <div className={ styles.seasonHolder }>
                <div className={ styles.content }>
                    SUMMER - 16°C
                </div>
                <img src={ seasonHolder } />
            </div>
            <div className={ styles.dateHolder }>
                <div className={ styles.content } >
                    { getFormattedDate( gameDate ) }
                </div>
                <img src={ dateHolder } />                
            </div> 
        </div>
    )
}