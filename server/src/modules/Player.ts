import { WebSocket, WebSocketServer } from 'ws'


//  @ts-ignore
import type { PlayerType, ConnectionIdType } from '../../../shared/playerType.ts'
// @ts-ignore
import { RequestPayloadType, ResponsePayloadType, ResponseType, RequestPlayerGetPayloadType } from './../../../shared/messageTypes.ts'


const Players: Array<PlayerType> = []



export function addPlayer ( cid: ConnectionIdType ) {
    if ( !findPlayerByConnectionID( cid ) ) {
        console.log( "Adding new player..." )

        // Check the database for login / password and retrieve player

        Players.push(
            { 
                connectionId: cid,
                position: [ 0, 0, 0 ],
                rotation: [ 0, 0, 0 ]
            } 
        )
        console.log( `Player ${cid} added!` )
    }
}

export function removePlayer ( cid: ConnectionIdType ) {
    console.log( `Removing player ${cid}...` )
    const index = Players.findIndex( player => player.connectionId === cid )

    if ( index !== -1 ) {
        Players.splice( index, 1 )
        console.log( `Player ${cid} removed!` )
    }
}


export function findPlayerByConnectionID ( cid: ConnectionIdType ) {
    return Players.find( player => player.connectionId = cid )
}


export function requestConnectionId ( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const response: ResponseType = {
        header: 'RES_CONNECTION_ID',
        payload: {
            cid: socket.connectionId!
        }
    }
    
    socket.send( JSON.stringify( response ) )
}


export function requestPlayerGet ( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const player = findPlayerByConnectionID( request!.cid )
    
    const response: ResponseType = {
        header: 'RES_PLAYER_GET',
        payload: {
            player: player
        }
    }

    socket.send( JSON.stringify( response ) )
}


export function requestPlayerUpdate ( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer) {
    const index = Players.findIndex( player => player.connectionId === request!.connectionId )

    if ( index !== -1 ) {
        Players[ index ] = request
        console.log( Players[ index ] )
    }
}


export function requestPlayerListGet( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const response: ResponseType = {
        header: 'RES_PLAYERLIST_GET',
        payload: {
            playerList: Players
        }
    }

    socket.send( JSON.stringify( response ) )
}


export default {
    addPlayer: addPlayer,
    removePlayer: removePlayer,
    findPlayerByConnectionID: findPlayerByConnectionID,
    requestConnectionId: requestConnectionId,
    requestPlayerGet: requestPlayerGet,
    requestPlayerListGet: requestPlayerListGet,
    requestPlayerUpdate: requestPlayerUpdate
}