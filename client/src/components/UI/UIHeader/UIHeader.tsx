import { useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

import classNames from 'classnames'

import { useWebSocketStore } from '../../../stores/WebsocketStore'
import { useDebugStore } from '../../../stores/DebugStore'
import { usePlayersStore, getPlayerByConnectionId, updatePlayerByConnectionId } from '../../../stores/PlayersStore'

import { sendRequest } from '../../../websocket/WsClient'

import SimpleSlider from './../SimpleSlider/SimpleSlider'

import { PlayerType } from '../../../../../shared/playerType'

// @ts-ignore
import styles from './styles.module.css'
// @ts-ignore
import uiStyles from './../styles.module.css'



export default function UIHeader () {
    const isConnected = useWebSocketStore( ( state ) => state.isConnected )
    const connectionId = useWebSocketStore( ( state ) => state.connectionId )

    const setShowCollisions = useDebugStore( ( state ) => state.setShowCollisions )
    const showCollisions = useDebugStore( ( state ) => state.showCollisions )
    const setShowRenderBox = useDebugStore( ( state ) => state.setShowRenderBox )
    const showRenderBox = useDebugStore( ( state ) => state.showRenderBox )
    const fps = useDebugStore( ( state ) => state.fps )
    const latency = useDebugStore( ( state ) => state.latency )
    const position = useDebugStore( ( state ) => state.position )

    const playerData = usePlayersStore( ( state ) => connectionId ? state.playerList?.find( p => p.connectionId === connectionId ) || null : null )
    
 
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


    function handleCollision( event: React.ChangeEvent<HTMLInputElement> ) {
        setShowCollisions( event.target.checked )
    }


    function handleRenderBox( event: React.ChangeEvent<HTMLInputElement> ) {
        setShowRenderBox( event.target.checked )
    }


    function handleRenderBoxChange ( value: number ) {
        if ( !connectionId || !playerData || !playerData.connectionId) return

        const updatedPlayer: PlayerType = { ...playerData, renderBox: [ value, value ] }

        sendRequest({
            header: 'REQ_PLAYER_UPDATE',
            payload: { 
                player: updatedPlayer,
                callerId: 'UIHeader.tsx - handleRenderBoxChange'
            }
         })
        sendRequest( {
            header: 'REQ_PLAYERLIST_GET',
            payload: null
        })
    }


     return (
        <div className={ styles.uiheaderContainer } >
            <div className={ styles.connectionContainer } >
                { getConnectionStatus() }
                { getConnectionId() }
            </div>

            <div className={ uiStyles.separator } />

            <div className={ styles.toggleContainer }>
                <label className={ uiStyles.switch } >
                    <input type="checkbox" onChange={ handleCollision } checked={ showCollisions }/>
                    <span className={ uiStyles.slider }></span>
                </label>
                <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) }>
                    Collision Box
                </div>
            </div>

            <div className={ uiStyles.separator } />

            <div className={ styles.toggleContainer }>
                <label className={ uiStyles.switch } >
                    <input type="checkbox" onChange={ handleRenderBox } checked={ showRenderBox }/>
                    <span className={ uiStyles.slider }></span>
                </label>
                <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) }>
                    Render Box
                </div>
            </div>

            <div className={ uiStyles.separator } />

            <div className={ styles.sliderContainer } >
                <SimpleSlider 
                    min={ 10 } 
                    max={ 60 } 
                    value={ playerData?.renderBox?.[0]! ?? 0 } 
                    onChange={ handleRenderBoxChange } 
                    isDisabled= { !playerData }
                />
                <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) }>
                    { playerData?.renderBox?.[0] ?? "N/A" }
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