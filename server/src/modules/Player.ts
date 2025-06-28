import { WebSocket, WebSocketServer } from 'ws'


//  @ts-ignore
import type { PlayerType, ConnectionIdType } from '../../../shared/playerType.ts'
// @ts-ignore
import { RequestPayloadType, ResponsePayloadType, ResponseType, RequestPlayerGetPayloadType } from './../../../shared/messageTypes.ts'


const Players: Array<PlayerType> = []



export function addPlayer ( cid: ConnectionIdType ) {
    if ( findPlayerByConnectionID( cid ) === false ) {
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

export function removePlayer ( cid: ConnectionIdType ) {
    console.log( `Removing player ${cid}...` )

    const playerIndex = findPlayerByConnectionID( cid )
    if (  playerIndex !== false ) {
        Players.splice( playerIndex, 1 )
        console.log( `Player ${cid} removed!` )
        console.log(  Players.length , ' players left.' )
    }
}


export function updatePlayer ( index: number, player: PlayerType ) {
    if ( Players[ index ] ) {
        Players[ index ] = player
    } else {
        console.log( `Player index ${index} not found.` )
    }
}


export function findPlayerByConnectionID ( cid: ConnectionIdType ) {
    const index = Players.findIndex( player => player.connectionId === cid )

    if ( index !== -1 ) {
        return index
    } else {
        return false
    }
}


export function getPlayerByIndex( index: number ) {
    if ( Players[ index ] ) {
        return Players[ index ] 
    }

    return false
}


export function getPlayerCount () {
    return Players.length
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


export function requestCharacterSelect( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const playerIndex = findPlayerByConnectionID( socket.connectionId! )

    if ( playerIndex !== false ) {
        Players[ playerIndex ].name = request.characterName
        console.log( `Character: ${request.characterName} selected for account ${Players[ playerIndex ].username} (${socket.connectionId})` )

        const response: ResponseType = {
            header: 'RES_CHARACTER_SELECT',
            payload: null
        }

        // Confirm selection with the player
        socket.send( JSON.stringify( response ) )

        // Broadcast to player the new player
        socketServer.clients.forEach(( client ) => {
            if ( client.readyState === 1 ) {

                const response: ResponseType = {
                    header: 'RES_PLAYERLIST_GET',
                    payload: {
                        playerList: Players
                    }
                }
                
                client.send( JSON.stringify( response ) )
            }
        })
    }
}


export function requestPlayerGet ( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const playerIndex = findPlayerByConnectionID( request!.cid )
    
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


export function requestPlayerUpdate ( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const index = Players.findIndex( player => player.connectionId === request!.connectionId )

    if ( index !== -1 ) {
        Players[ index ] = request
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
    updatePlayer: updatePlayer,
    getPlayerByIndex: getPlayerByIndex,
    findPlayerByConnectionID: findPlayerByConnectionID,
    requestConnectionId: requestConnectionId,
    requestCharacterSelect: requestCharacterSelect,
    requestPlayerGet: requestPlayerGet,
    requestPlayerListGet: requestPlayerListGet,
    requestPlayerUpdate: requestPlayerUpdate
}