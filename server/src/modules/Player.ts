import { WebSocket, WebSocketServer } from 'ws'
import { serverBroadcast } from './Broadcast.ts'


//  @ts-ignore
import type { PlayerType, ConnectionIdType } from '../../../shared/playerType.ts'
// @ts-ignore
import { RequestPayloadType, ResponseType } from './../../../shared/messageTypes.ts'


const Players: Array<PlayerType> = []





// ==================================================================================================================================
// PRIVATE METHODS
// ==================================================================================================================================
function updatePlayer ( index: number, player: PlayerType ) {
    if ( Players[ index ] ) {
        Players[ index ] = player
    } else {
        console.log( `Player index ${index} not found.` )
    }
}


function findPlayerIndexByConnectionID ( cid: ConnectionIdType ) {
    const index = Players.findIndex( player => player.connectionId === cid )

    if ( index !== -1 ) {
        return index
    } else {
        return false
    }
}


function getPlayerByIndex( index: number ) {
    if ( Players[ index ] ) {
        return Players[ index ] 
    }

    return false
}


function getPlayerCount () {
    return Players.length
}
// ==================================================================================================================================



// ==================================================================================================================================
// PUBLIC METHODS
// ==================================================================================================================================
function getPlayerByConnectionId ( cid: ConnectionIdType ) {
    const playerIndex = findPlayerIndexByConnectionID( cid )

    if ( playerIndex !== false ) {
        return Players[ playerIndex ]
    }

    return false
}


function requestAddPlayer ( cid: ConnectionIdType ) {
    if ( findPlayerIndexByConnectionID( cid ) === false ) {
        console.log( "Adding new player..." )

        Players.push(
            { 
                connectionId: cid,
                animationName: 'Idle',
                position: [ 0, 0, 0 ],
                rotation: [ 0, 0, 0 ]
            } 
        )
        console.log( `Player ${cid} added!` )
    }
}


function requestRemovePlayer ( cid: ConnectionIdType ) {
    console.log( `Removing player ${cid}...` )

    const playerIndex = findPlayerIndexByConnectionID( cid )
    if (  playerIndex !== false ) {
        Players.splice( playerIndex, 1 )
        console.log( `Player ${cid} removed!` )
        console.log(  Players.length , ' players left.' )

        let broadcastResponse: ResponseType = {
            header: 'RES_PLAYERLIST_GET',
            payload: {
                playerList: Players
            }
        }

        serverBroadcast( broadcastResponse )
    }
}


function requestConnectionId ( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const response: ResponseType = {
        header: 'RES_CONNECTION_ID',
        payload: {
            cid: socket.connectionId!
        }
    }
    
    socket.send( JSON.stringify( response ) )
}


function requestCharacterSelect( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const playerIndex = findPlayerIndexByConnectionID( socket.connectionId! )

    if ( playerIndex !== false ) {
        Players[ playerIndex ].name = request.characterName
        console.log( `Character: ${request.characterName} selected for account ${Players[ playerIndex ].username} (${socket.connectionId})` )

        const response: ResponseType = {
            header: 'RES_CHARACTER_SELECT',
            payload: null
        }

        // Confirm selection with the player
        socket.send( JSON.stringify( response ) )

        let broadcastResponse: ResponseType = {
            header: 'RES_PLAYERLIST_GET',
            payload: {
                playerList: Players
            }
        }

        // Broadcast the new player
        serverBroadcast( broadcastResponse )
    }
}


function requestPlayerGet ( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const playerIndex = findPlayerIndexByConnectionID( request!.cid )
    
    if ( playerIndex !== false ) {
        const response: ResponseType = {
            header: 'RES_PLAYER_GET',
            payload: {
                player: Players[ playerIndex ]
            }
        }

        socket.send( JSON.stringify( response ) )
    }
}


function requestPlayerUpdate ( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const playerIndex = findPlayerIndexByConnectionID( request.connectionId )

    if ( playerIndex !== false ) {
        Players[ playerIndex ] = request

        let broadcastResponse: ResponseType = {
            header: 'RES_PLAYERLIST_GET',
            payload: {
                playerList: Players
            }
        }

        serverBroadcast( broadcastResponse )
    }
}


function requestPlayerListGet( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const response: ResponseType = {
        header: 'RES_PLAYERLIST_GET',
        payload: {
            playerList: Players
        }
    }
    
    socket.send( JSON.stringify( response ) )
}
// ==================================================================================================================================

export default {
    getPlayerByConnectionId: getPlayerByConnectionId, 
    requestAddPlayer: requestAddPlayer,
    requestRemovePlayer: requestRemovePlayer,
    requestConnectionId: requestConnectionId,
    requestCharacterSelect: requestCharacterSelect,
    requestPlayerGet: requestPlayerGet,
    requestPlayerUpdate: requestPlayerUpdate,
    requestPlayerListGet: requestPlayerListGet
}