import { WebSocketServer } from 'ws';
import { ResponseType, RequestEnvironmentPayloadType } from '../../../shared/messageTypes.ts'
import { Environment } from './../gameState.ts'

export function requestEnvironment ( request: RequestEnvironmentPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const response: ResponseType = {
        header: 'RES_ENVIRONMENT',
        payload: Environment
    }

    socket.send( JSON.stringify( response ) )
}

export default {
    requestEnvironment: requestEnvironment
}