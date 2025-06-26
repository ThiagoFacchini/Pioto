import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import { connectWebSocket, sendRequest } from "./../../websocket/WsClient"
import { useWebSocketStore  } from "./../../stores/WebsocketStore"


import classNames from 'classnames'
// @ts-ignore
import style from "./styles.module.css"
// @ts-ignore
import uiStyles from './../../components/UI/styles.module.css'


function Home() {
    const navigate = useNavigate()
    const isConnected = useWebSocketStore( ( state ) => state.isConnected )

    const [serverAddr, setServerAddr ] = useState( 'localhost' )
    const [serverPort, setServerPort ] = useState( 8080 )


    // Request Connection ID
    useEffect( () => { 
        if ( isConnected ) {
            sendRequest({
                header: 'REQ_CONNECTION_ID',
                payload: null
            })
        }
    }, [ isConnected ] )


    function getCommandButtons() {
        if ( isConnected ) {
            return (
                <>
                    <div onClick={ () => navigate( '/map', { replace: true } ) } className={ classNames( [ uiStyles.button, uiStyles.sm ] ) }>
                        Go to Map
                    </div>
                </>
            )
        } else {
            return (
                <div className={ style.loginContainer } >
                    <div>
                        <div className={ classNames([ uiStyles.label, uiStyles.sm ]) }>
                            Server Address:
                        </div>
                        <input
                            type="text"
                            className={ classNames( [ uiStyles.inputText, uiStyles.sm ] ) }
                            value={ serverAddr }
                            onChange={ ( e ) => setServerAddr( e.target.value ) }
                            placeholder={ serverAddr }
                        />
                    </div>
                    <div>
                        <div className={ classNames( [ uiStyles.label, uiStyles.sm ] ) } >
                            Server Port:
                        </div>
                        <input
                            type="number"
                            className={ classNames( [ uiStyles.inputText, uiStyles.sm ] ) }
                            value={ serverPort }
                            onChange={ ( e ) => setServerPort( parseInt( e.target.value ) ) }
                            placeholder={ serverPort.toString() }
                        />
                    </div>
                    <div onClick={ () => connectWebSocket( serverAddr, serverPort ) } className={ classNames( [ uiStyles.button, uiStyles.sm ] ) } >
                        Connect
                    </div>
                </div>
            )
        }
    }
    
    return (
        <>
        <div> Home </div>
        { getCommandButtons() }
        </>
    )
}

export default Home