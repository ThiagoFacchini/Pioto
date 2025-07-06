import { WebSocketServer } from 'ws';
import { RequestType, ResponseType, RequestGameConfigurationsPayloadType } from '../../../shared/messageTypes.ts'
import { Configurations } from './../gameState.ts'

export function requestGameConfigurations ( request: RequestGameConfigurationsPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const response: ResponseType = {
        header: 'RES_GAME_CONFIGURATIONS',
        payload: {
            configurations: Configurations
        }
    }
    
    socket.send( JSON.stringify( response ) )
}

export default {
    requestGameConfigurations: requestGameConfigurations
}