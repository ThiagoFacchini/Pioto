import { WebSocketServer } from 'ws';
import { RequestType, ResponseType } from '../../../shared/messageTypes.ts'

export function requestPing ( request: RequestType, socket: WebSocket, socketServer: WebSocketServer) {

    const response: ResponseType = {
        header: 'RES_PONG',
        payload: null
    }
    
    socket.send( JSON.stringify( response ) )
}