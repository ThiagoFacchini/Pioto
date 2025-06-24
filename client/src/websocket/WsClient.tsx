import { routeMessage } from './MessageRouter'
import { useWebSocketStore } from '../stores/WebsocketStore'

import { MessageType, TypedMessage, MessagePayloads } from './../../../shared/messageTypes'

let socket: WebSocket | null = null

export function connectWebSocket() {
  console.log("Calling connectWebSocket")
  socket = new WebSocket('ws://localhost:8080')
  
  socket.onopen = function() {
    console.log('[WS] Connected')
    useWebSocketStore.getState().setConnected(true)
  }

  socket.onmessage = ( event ) => {
    try {
      const message = JSON.parse( event.data )
      routeMessage(message)

    } catch ( err ) {
      console.error( '[WS] Failed to parse message:', event.data )
      console.error( 'Error: ', err )
    }
  }

  
  socket.onclose = () => {
    console.log( '[WS] Disconnected' )
    useWebSocketStore.getState().setConnected( false )
    // Optionally reconnect logic here
  }

  socket.onerror = ( err ) => {
    console.error( '[WS] Error:', err )
    useWebSocketStore.getState().setConnected( false )
  }
}


function getSocket() {
  return socket
}


export function sendRequest( request: string ) {
  const ws = getSocket()

  if ( ws instanceof WebSocket && ws?.readyState === WebSocket.OPEN ) {
    ws.send( JSON.stringify( request ) )
  } else {
    console.warn( "[WS] Socket not ready:", request )
  }
}

export function sendUpdate<T extends MessageType> ( message: TypedMessage<MessagePayloads[T]> ) {
  const ws = getSocket()

  if ( ws instanceof WebSocket && ws?.readyState === WebSocket.OPEN ) {
    ws.send( JSON.stringify( message ) )
  } else {
    console.warn( "[WS] Socket not ready:", message )
  }
}