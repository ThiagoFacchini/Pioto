import type { WebSocket, WebSocketServer } from 'ws'
// import type { MessageType, MessagePayloads } from './../../../shared/messageTypes.ts'

import { getResources, updateResources } from "./Resources.ts"
import Player from './Player.ts'
import Authentication from './Authentication.ts'
import { requestPing } from './Networks.ts'

import { ConnectionIdType  } from 'shared/playerType.ts'
import { RequestType, ResponseType } from './../../../shared/messageTypes.ts'


const requestHandler = {
    REQ_CONNECTION_ID: Player.requestConnectionId,
    REQ_AUTHENTICATE: Authentication.authenticate,
    REQ_CHARACTER_SELECT: Player.requestCharacterSelect,
    REQ_PLAYER_GET: Player.requestPlayerGet,
    REQ_PLAYERLIST_GET: Player.requestPlayerListGet,
    REQ_PLAYER_UPDATE: Player.requestPlayerUpdate,
    REQ_PING: requestPing
}

export function receiveRequest( request: MessageEvent, socket: WebSocket, socketServer: WebSocketServer) {
    const parsedRequest: RequestType = JSON.parse( request.toString() )

    try {
        const handler = requestHandler[ parsedRequest.header ]
        handler( parsedRequest.payload, socket, socketServer )

    } catch ( e ) {
        console.error('Failed to parseRequest ', parsedRequest)
    }
}

