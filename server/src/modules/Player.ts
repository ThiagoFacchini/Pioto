import { WebSocket, WebSocketServer } from 'ws'
import { serverBroadcast } from './Broadcast.ts'


//  @ts-ignore
import type { PlayerType, ConnectionIdType } from '../../../shared/playerType.ts'
// @ts-ignore
import { RequestPlayerGetPayloadType, RequestPayloadType, ResponseType } from './../../../shared/messageTypes.ts'


import { Players } from './../gameState.ts'





// ==================================================================================================================================
// PRIVATE METHODS
// ==================================================================================================================================
function findPlayerIndexByConnectionID ( cid: ConnectionIdType ) {
    const index = Players.findIndex( player => player.connectionId === cid )

    if ( index !== -1 ) {
        return index
    } else {
        return false
    }
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
                meshName: 'BaseCharacter-v2.glb',
                position: [ 0, 0, 0 ],
                rotation: [ 0, 0, 0 ],
                renderBox: [ 20, 20 ]
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
            connectionId: socket.connectionId!
        }
    }
    
    socket.send( JSON.stringify( response ) )
}


function requestCharacterSelect( request: RequestPayloadType['RES_CHARACTER_SELECT'], socket: WebSocket, socketServer: WebSocketServer ) {
    const playerIndex = findPlayerIndexByConnectionID( socket.connectionId! )

    if ( playerIndex !== false ) {
        Players[ playerIndex ].name = request.characterName

        const response: ResponseType = {
            header: 'RES_CHARACTER_SELECT',
            payload: null
        }

        // Confirm selection with client
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


// TODO - Review
function requestPlayerGet ( request: RequestPlayerGetPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
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
    const playerIndex = findPlayerIndexByConnectionID( request.player.connectionId )

    if ( playerIndex !== false ) {
        Players[ playerIndex ] = request.player
    }
}


function requestPlayerListGet( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const player = Players.find( player => player.connectionId === socket.connectionId! )
    
    if ( !player ) return

    const [ boxWidth, boxDepth ] = player.renderBox
    const halfWidth = boxWidth / 2
    const halfDepth = boxDepth / 2

    const playerPosition = player.position
    const px = playerPosition[ 0 ]
    const pz = playerPosition[ 2 ]

    const filteredPlayers = Players.filter( player => {
        const [rx, ry, rz] = player.position
        return ( 
            rx >= px - halfWidth && 
            rx <= px + halfWidth &&
            rz >= pz - halfDepth &&
            rz <= pz + halfDepth
        )
    } )

    const response: ResponseType = {
        header: 'RES_PLAYERLIST_GET',
        payload: {
            playerList: filteredPlayers
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