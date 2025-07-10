import React, { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../../stores/GameStore'
import { useConfigsStore } from '../../../stores/ConfigsStore'

// @ts-ignore
import clockImage from './assets/clock.png'
// @ts-ignore
import styles from './styles.module.css'

export default function GameClock() {
    const [visible, setVisible] = useState(false)
    const [withTransition, setWithTransition] = useState(false)

    const prevHour = useRef<number>(0)
    const rotation = useRef<number>(0)

    const hoursPassed = useGameStore((state) => state.hoursPassed)
    const realMillisecondsPerHour = useConfigsStore((state) => state.realMillisecondsPerHour)

    // Initial static render
    useEffect(() => {
        const currentHour = hoursPassed % 24
        rotation.current = currentHour * 15
        prevHour.current = hoursPassed

        // Wait one frame to ensure DOM has painted
        requestAnimationFrame(() => {
            setVisible(true)
            // Then wait another frame before enabling transition
            requestAnimationFrame(() => {
                setWithTransition(true)
            })
        })
    }, [])

    // Update on tick
    useEffect(() => {
        if ( !withTransition ) return

        const currentHour = hoursPassed % 24
        const previousHour = prevHour.current % 24
        const diff = (currentHour - previousHour + 24) % 24

        rotation.current += diff * 15
        prevHour.current = hoursPassed
    }, [hoursPassed, withTransition] )

    if ( !visible ) return null

    const imageClass = withTransition ? styles.withTransition : styles.noTransition

    return (
        <div className={styles.gameclockContainer}>
            <div className={styles.imageContainer}>
                <img
                    src={clockImage}
                    className={imageClass}
                    style={{
                        transform: `rotate(${ rotation.current + 30 }deg)`,
                        transformOrigin: 'center center',
                        width: '100%',
                        display: 'block',
                        '--clock-transition-duration': `${realMillisecondsPerHour}ms`
                    } as React.CSSProperties}
                />
            </div>
            <div className={styles.temporary}>
                {hoursPassed % 24}
            </div>
        </div>
    )
}