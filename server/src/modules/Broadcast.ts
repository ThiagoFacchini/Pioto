import { WebSocket, WebSocketServer } from "ws"
// @ts-ignore
import { ResponseType } from './../../../shared/messageTypes.ts'

let socketServer: WebSocketServer

export function attachSocketServer ( server: WebSocketServer ) {
    socketServer = server
    console.log( 'Socketserver attached' )
}

export function serverBroadcast( response: ResponseType ) {
    if ( socketServer ) {
        socketServer.clients.forEach(( client ) => {
            if ( client.readyState === 1 ) {
                client.send( JSON.stringify( response ) )
            }
        })
    }
}