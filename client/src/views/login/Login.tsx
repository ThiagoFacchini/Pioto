import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import { connectWebSocket, sendRequest } from "../../websocket/WsClient"
import { useWebSocketStore } from "../../stores/WebsocketStore"
import { useConfigsStore } from "../../stores/ConfigsStore"
import { useGameStore } from "../../stores/GameStore"


import classNames from 'classnames'
// @ts-ignore
import style from "./styles.module.css"
// @ts-ignore
import uiStyles from './../../components/UI/styles.module.css'


function Login() {
    const navigate = useNavigate()
    const isConnected = useWebSocketStore( ( state ) => state.isConnected )
    const connectionId = useWebSocketStore( ( state ) => state.connectionId )
    const isAuthenticated = useWebSocketStore( ( state ) => state.isAuthenticated )
    const charactersList = useWebSocketStore( ( state ) => state.charactersList )
    const isCharacterSelected = useWebSocketStore( ( state ) => state.isCharacterSelected )


    const serverAddress = useConfigsStore( ( state ) => state.serverAddress )
    const serverPort = useConfigsStore( ( state ) => state.serverPort )
    const setServerAddress = useConfigsStore( ( state ) => state.setServerAddress )
    const setServerPort = useConfigsStore( ( state ) => state.setServerPort )
    const realMillisecondsPerHour = useConfigsStore( ( state ) => state.realMillisecondsPerHour )

    const mapName = useGameStore( ( state ) => state.mapName )
    const gameTimeStamp = useGameStore( ( state ) => state.gameTimeStamp )

    const [ formState, setFormState ] = useState( '' )
    const [ username, setUsername ] = useState( '' )
    const [ password, setPassword ] = useState( '' )


    // Request Connection ID
    useEffect( () => { 
        if ( isConnected ) {
            sendRequest({
                header: 'REQ_CONNECTION_ID',
                payload: null
            })
        }
    }, [ isConnected ] )


    // Try to authenticate
    useEffect( () => {
        if ( connectionId !== null ) {
            sendRequest({
                header: 'REQ_AUTHENTICATE',
                payload: {
                    username: username,
                    password: password
                }
            })
        }
    }, [ connectionId ] )


    // Onoce characters is defined, then request Configurations and Map definitions
    useEffect( () => {
        if ( isCharacterSelected ) {
            console.log( 'Requesting Game Configurations...' )
            sendRequest( {
                header: 'REQ_GAME_CONFIGURATIONS',
                payload: null
            } )

            console.log( 'Requesting Map Definitions...' )
            sendRequest( {
                header: 'REQ_MAP_DEFINITIONS',
                payload: null
            } )

            console.log( 'Requesting Environment...' ) 
            sendRequest( {
                header: 'REQ_ENVIRONMENT',
                payload: null
            } )
        }
    }, [ isCharacterSelected ] )


    // Wait till Character, Configurations and Map definitions are loaded
    useEffect( () => {
        if ( isCharacterSelected && realMillisecondsPerHour !== 0 && mapName !== null && gameTimeStamp !== 0 ) {
            navigate( '/map', { replace: true } )
        }

    }, [ isCharacterSelected, realMillisecondsPerHour, mapName, gameTimeStamp ] )


    function tryLogin() {
        if ( serverAddress && serverPort && username && password ) {
            connectWebSocket( serverAddress, serverPort )
        } else {
            setFormState( "error" )
        }
    }


    function renderLoginForm() {
        return (
            <div className={ classNames( [ style.viewContainer, style[ formState ] ] ) } >
                <div className={ style.connectionContainer } >
                    <div>
                        <div className={ classNames([ uiStyles.label, uiStyles.sm ]) }>
                            Server Address:
                        </div>
                        <input
                            type="text"
                            className={ classNames( [ uiStyles.inputText, uiStyles.sm ] ) }
                            value={ serverAddress }
                            onChange={ ( e ) => setServerAddress( e.target.value ) }
                            placeholder={ serverAddress }
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
                </div>
                <div className={ style.loginContainer } >
                    <div>
                        <div className={ classNames([ uiStyles.label, uiStyles.sm ]) }>
                            Username:
                        </div>
                        <input
                            type="text"
                            className={ classNames( [ uiStyles.inputText, uiStyles.sm ] ) }
                            value={ username }
                            onChange={ ( e ) => setUsername( e.target.value ) }
                            placeholder={ 'username' }
                        />
                    </div>
                    <div>
                        <div className={ classNames( [ uiStyles.label, uiStyles.sm ] ) } >
                            Password:
                        </div>
                        <input
                            type="password"
                            className={ classNames( [ uiStyles.inputText, uiStyles.sm ] ) }
                            value={ password }
                            onChange={ ( e ) => setPassword( e.target.value ) }
                        />
                    </div>
                </div>
                <div 
                    onClick={ tryLogin } 
                    className={ classNames( [ uiStyles.button, uiStyles.sm ] ) } 
                >
                    Connect
                </div>
            </div>
        )
    }


    function renderCharactersList() {
        return charactersList.map( ( characterName, index ) => (
            <div 
                key={ index } 
                className={ style.character }
                onClick={ () => selectCharacter( characterName ) }
            >
                { characterName }
            </div>
        ))
    }


    function selectCharacter( characterName: string ) {
        sendRequest({
            header: "REQ_CHARACTER_SELECT",
            payload: { characterName : characterName

            }
        })
    }




    function getViewComponents() {
        if ( isAuthenticated && charactersList != null ) {
            return (
                <div className={ style.characterList } >
                    <div className={ classNames( [ uiStyles.label, uiStyles.sm ] ) }>
                        Select the Character:
                    </div>
                    { renderCharactersList() }
                </div>
            )

        } else {
            if ( isConnected ) {
                return (
                    <>
                        <div className={ classNames( [ uiStyles.label, uiStyles.sm ] ) } >
                            Authenticating...
                        </div>
                    </>
                )

            } else {
                return renderLoginForm()
            }

        }
    }
    
    return (
        <>
        <div>
            { getViewComponents() }
        </div>
        </>
    )
}

export default Login