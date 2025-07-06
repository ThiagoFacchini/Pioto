import type { WebSocket, WebSocketServer } from 'ws'

import Resources from "./Resources.ts"
import Player from './Player.ts'
import Authentication from './Authentication.ts'
import Configurations from './Configurations.ts'
import Map from './Map.ts'
import Network from './Networks.ts'
import Environment from './Environment.ts'

import { RequestType } from './../../../shared/messageTypes.ts'


const requestHandler = {
    REQ_CONNECTION_ID: Player.requestConnectionId,
    REQ_AUTHENTICATE: Authentication.authenticate,
    REQ_CHARACTER_SELECT: Player.requestCharacterSelect,
    REQ_PLAYER_GET: Player.requestPlayerGet,
    REQ_PLAYERLIST_GET: Player.requestPlayerListGet,
    REQ_PLAYER_UPDATE: Player.requestPlayerUpdate,
    REQ_PING: Network.requestPing,
    REQ_MAP_RESOURCES_GET: Resources.requestMapResourcesGet,
    REQ_MAP_RESOURCE_UPDATE: Resources.requestMapResourceUpdate,
    REQ_GAME_CONFIGURATIONS: Configurations.requestGameConfigurations,
    REQ_MAP_DEFINITIONS: Map.requestMapDefinitions,
    REQ_ENVIRONMENT: Environment.requestEnvironment
}

export function receiveRequest( request: MessageEvent, socket: WebSocket, socketServer: WebSocketServer) {
    const parsedRequest: RequestType = JSON.parse( request.toString() )

    try {
        const handler = requestHandler[ parsedRequest.header ]
        // @ts-ignore
        handler( parsedRequest.payload, socket, socketServer )

    } catch ( e ) {
        console.error('Failed to parseRequest ', parsedRequest)
    }
}

