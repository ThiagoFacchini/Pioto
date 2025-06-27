import { WebSocket, WebSocketServer } from 'ws'

import Player from './Player.ts'

import { RequestPayloadType } from './../../../shared/messageTypes.ts'



export function authenticate( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    console.log( 'Trying to authenticate connectionId: ',  socket.connectionId! )
    const playerIndex = Player.findPlayerByConnectionID( socket.connectionId! )
    console.log( playerIndex )
    
    if ( playerIndex === false ) {
        console.log( "Couldn't find a matching connection Id " )
    } else {
        console.log( "Connection ID found, authenticating..." )
        console.log( 'Authenticated, assigning data' )

        const player = Player.getPlayerByIndex( playerIndex )
        
        if ( player ) {
            Player.updatePlayer( playerIndex, { ...player, username: request.username! } )
            const charList = getCharacterList()

            const response = {
                header: "RES_CHARACTER_LIST",
                payload: {
                    username: request.username,
                    charactersList: charList
                }
            }
            socket.send( JSON.stringify( response ) )


        } else {
            console.log( 'Could not assign data' )
        }
    }
}


export function getCharacterList() {
    const fakeCharList = [
        'Kael',
        'Zira',
        'Thron',
        'Lira',
        'Drex',
        'Nyra',
        'Vorn',
        'Kynn',
        'Reth',
        'Sova'
    ]

    const shuffledNames = [...fakeCharList].sort( () => 0.5 - Math.random() )
    return shuffledNames.slice( 0, 3 )


}

export default {
    authenticate: authenticate
}