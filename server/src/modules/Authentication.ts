import { WebSocket, WebSocketServer } from 'ws'

import Player from './Player.ts'

import { RequestPayloadType } from './../../../shared/messageTypes.ts'
import { PlayerType } from './../../../shared/playerType.ts'



export function authenticate( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    console.log( 'Trying to authenticate connectionId: ',  socket.connectionId! )
    const player = Player.getPlayerByConnectionId( socket.connectionId! )
    
    if ( player === false ) {
        console.log( "Couldn't find a matching connection Id " )
    } else {
        console.log( "Connection ID found, authenticating..." )
        console.log( 'Authenticated, assigning data' )

     
        const updatedPlayer: PlayerType = {
            ...player, username: request!.username!
        }

        Player.requestPlayerUpdate( { player: updatedPlayer, callerId: 'Server - Authenticate' }, socket, socketServer )
        
        const charList = getCharacterList()

        const response = {
            header: "RES_CHARACTER_LIST",
            payload: {
                username: request.username,
                charactersList: charList
            }
        }
        socket.send( JSON.stringify( response ) )
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