import React, { useState, useEffect, useMemo } from 'react'
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

    const showCollisions = useDebugStore( ( state ) => state.showCollisions )
    const setShowCollisions = useDebugStore( ( state ) => state.setShowCollisions )
    const showRenderBox = useDebugStore( ( state ) => state.showRenderBox )
    const setShowRenderBox = useDebugStore( ( state ) => state.setShowRenderBox )
    const showGrid = useDebugStore( ( state ) => state.showGrid )
    const setShowGrid = useDebugStore( ( state ) => state.setShowGrid )
    const showAxis = useDebugStore( ( state ) => state.showAxis )
    const setShowAxis = useDebugStore( ( state ) => state.setShowAxis )
    const showClimaticZones = useDebugStore( ( state ) => state.showClimaticZones )
    const setShowClimaticZones = useDebugStore( ( state ) => state.setShowClimaticZones )
    const camera = useDebugStore( ( state ) => state.cameraType )
    const setCamera = useDebugStore( ( state ) => state.setCameraType )

    const fps = useDebugStore( ( state ) => state.fps )
    const latency = useDebugStore( ( state ) => state.latency )
    const position = useDebugStore( ( state ) => state.position )

    const playerData = usePlayersStore( ( state ) => connectionId ? state.playerList?.find( p => p.connectionId === connectionId ) || null : null )
    
    const [ shouldShow, setShouldShown ] = useState( false )

    
    useEffect( () => { 
        const handleKeyDown = ( e: KeyboardEvent ) => {
            if (e.key == 'Tab' ) {
                e.preventDefault()
                setShouldShown( prev => !prev )
            }
        }

        window.addEventListener( 'keydown', handleKeyDown )
        return () => window.removeEventListener( 'keydown', handleKeyDown )
     }, [])


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


    function handleGrid( event: React.ChangeEvent<HTMLInputElement> ) {
        setShowGrid( event.target.checked )
    }


    function handleAxis( event: React.ChangeEvent<HTMLInputElement> ) {
        setShowAxis( event.target.checked )
    }


    function handleClimaticZones( event: React.ChangeEvent<HTMLInputElement> ) {
        setShowClimaticZones( event.target.checked )
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

    
    if ( !shouldShow ) return null


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

            <div className={ uiStyles.separator } />

            <div className={ styles.cameraContainer }>
                <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) } >
                    Camera:
                </div>
                <div className={ styles.buttonsContainer }>
                    <div 
                        className={ classNames( [ uiStyles.button, uiStyles.xs, camera === 1 && uiStyles.selected ] ) } 
                        onClick={ () => { setCamera( 1 ) } }
                    >
                        1
                    </div>
                    <div 
                        className={ classNames( [ uiStyles.button, uiStyles.xs, camera === 2 && uiStyles.selected ] ) } 
                        onClick={ () => { setCamera( 2 ) } }
                    >
                        2
                    </div>
                </div>
            </div>

            <div className={ uiStyles.separator } />

            <div className={ styles.toggleContainer }>
                <label className={ uiStyles.switch } >
                    <input type="checkbox" onChange={ handleGrid } checked={ showGrid }/>
                    <span className={ uiStyles.slider }></span>
                </label>
                <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) }>
                    Grid
                </div>
            </div>

            <div className={ uiStyles.separator } />

            <div className={ styles.toggleContainer }>
                <label className={ uiStyles.switch } >
                    <input type="checkbox" onChange={ handleAxis } checked={ showAxis }/>
                    <span className={ uiStyles.slider }></span>
                </label>
                <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) }>
                    Axis
                </div>
            </div>

            <div className={ uiStyles.separator } />

            <div className={ styles.toggleContainer }>
                <label className={ uiStyles.switch } >
                    <input type="checkbox" onChange={ handleClimaticZones } checked={ showClimaticZones }/>
                    <span className={ uiStyles.slider }></span>
                </label>
                <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) }>
                    Climatic Zones
                </div>
            </div>

        </div>
    )
}