import { WebSocketServer } from 'ws';
import { RequestType, ResponseType, RequestGameConfigurationsPayloadType } from '../../../shared/messageTypes.ts'
import { Map } from './../gameState.ts'

export function requestMapDefinitions ( request: RequestGameConfigurationsPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const response: ResponseType = {
        header: 'RES_MAP_DEFINITIONS',
        payload: {
            map: Map
        }
    }
    
    socket.send( JSON.stringify( response ) )
}

export default {
    requestMapDefinitions: requestMapDefinitions
}