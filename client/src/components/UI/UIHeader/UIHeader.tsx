import { useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

import { useWebSocketStore } from '../../../stores/WebsocketStore'
import { useDebugStore } from '../../../stores/DebugStore'
import { usePlayersStore } from '../../../stores/PlayersStore'

import classNames from 'classnames'

// @ts-ignore
import styles from './styles.module.css'
// @ts-ignore
import uiStyles from './../styles.module.css'



export default function UIHeader () {
    const isConnected = useWebSocketStore( ( state ) => state.isConnected )
    const connectionId = useWebSocketStore( ( state ) => state.connectionId )
    const setShowCollisions = useDebugStore( ( state ) => state.setShowCollisions )
    const showCollisions = useDebugStore( ( state ) => state.showCollisions )

    const fps = useDebugStore( ( state ) => state.fps )
    const latency = useDebugStore( ( state ) => state.latency )
    const position = useDebugStore( ( state ) => state.position )


    function getConnectionStatus () {
        if ( isConnected ) {
            return (
                <div className={ styles.connected } />
            )
        } 

        return (
            <div className={ styles.disconnected } />
        )
    }


    function getConnectionId () {
        if ( connectionId !== null ) {
            return (
                <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) } >
                    ({ connectionId })
                </div>
            )
        }

        return null
    }


    function handleCollision( event: React.ChangeEvent<HTMLInputElement>) {
        setShowCollisions( event.target.checked )
    }


     return (
        <div className={ styles.uiheaderContainer } >
            <div className={ styles.connectionContainer } >
                { getConnectionStatus() }
                { getConnectionId() }
            </div>

            <div className={ uiStyles.separator } />

            <div className={ styles.collisionToggleContainer }>
                <label className={ uiStyles.switch } >
                    <input type="checkbox" onChange={ handleCollision } checked={ showCollisions }/>
                    <span className={ uiStyles.slider }></span>
                </label>
                <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) }>
                    Show Collision Box
                </div>
            </div>

            <div className={ uiStyles.separator } />

            <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) }>
                FPS: { fps }
            </div>

            <div className={ uiStyles.separator } />

            <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) }>
                Latency: { latency }
            </div>

            <div className={ uiStyles.separator } />

            <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) }>
                Player Position: <b>{ position[0] }, { position[1] }, { position[2] }</b>
            </div>            
        </div>
    )
}