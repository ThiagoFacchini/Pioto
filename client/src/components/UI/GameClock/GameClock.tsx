import React, { useEffect, useState } from 'react'

import { useGameStore } from '../../../stores/GameStore'
import { useConfigsStore } from '../../../stores/ConfigsStore'

// @ts-ignore
import clockImage from './assets/clock.png'

// @ts-ignore
import styles from './styles.module.css'

export default function GameClock() {
    const [ hasRendered, setHasRendered ] = useState( false )

    const hoursPassed = useGameStore( ( state ) => state.hoursPassed )
    const realMillisecondsPerHour = useConfigsStore( ( state ) => state.realMillisecondsPerHour )
    const degrees = ( hoursPassed % 24 ) * 15

    useEffect( () => {
        // Using requestAnimation frame to delay the state change, just so the clock can adjust
        const id = setTimeout(() => setHasRendered(true), 0)
        return () => clearTimeout(id)
    })    

    const imageClass = hasRendered ? styles.withTransition : ''

    return (
        <div className={ styles.gameclockContainer } >
            <div className={ styles.imageContainer } >
                <img 
                    src={ clockImage }
                    className={ imageClass }
                    style={{
                        transform: `rotate(${degrees}deg)`,
                        transformOrigin: 'center center',
                        width: '100%',
                        display: 'block',
                        '--clock-transition-duration' : `${realMillisecondsPerHour}ms`
                    } as React.CSSProperties } 
                />
            </div>
            <div className={ styles.temporary } >
                { hoursPassed % 24 }
            </div>
        </div>
    )
}