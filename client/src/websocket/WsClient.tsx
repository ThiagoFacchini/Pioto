import { routeMessage } from './MessageRouter'
import { useWebSocketStore } from '../stores/WebsocketStore'

import { RequestType } from './../../../shared/messageTypes'

let socket: WebSocket | null = null


function getSocket() {
  return socket
}


export function connectWebSocket( addr: string, port: number ) {
  if  (socket && socket.readyState == WebSocket.OPEN ) {
    console.warn( '[WS] Already Connected' )
    return
  }

  console.log(`[WS] Trying to connect to ws://${addr}:${port}...`)
  socket = new WebSocket( `ws://${addr}:${port}` )
  
  socket.onopen = function() {
    console.log('[WS] Connected')
    useWebSocketStore.getState().setConnected( true )
  }

  socket.onmessage = ( event ) => {
    // console.log( '[WS] Parsing Response...' )
    parseResponse( event )
  }

  socket.onclose = () => {
    console.log( '[WS] Disconnected' )
    useWebSocketStore.getState().setConnected( false )
  }

  socket.onerror = ( err ) => {
    console.error( '[WS] Error:', err )
    useWebSocketStore.getState().setConnected( false )
  }
}


export function disconnectWebSocket() {
  const ws = getSocket()
  if ( ws instanceof WebSocket && ws?.readyState === WebSocket.OPEN ) {
    console.log( '[WS] Trying to disconnect...' )
    ws.close()
    useWebSocketStore.getState().setConnected( false )
  }
}


export function parseResponse( event: MessageEvent ) {
    try {
      const response = JSON.parse( event.data )
      routeMessage( response )

    } catch ( err ) {
      console.error( '[WS] Failed to parse message:', event.data )
      console.error( 'Error: ', err )
    }
}


export function sendRequest( request: RequestType ) {
  const ws = getSocket()

  if ( ws instanceof WebSocket && ws?.readyState === WebSocket.OPEN ) {
    // console.log( 'Sending request: ', request )
    ws.send( JSON.stringify( request ) )

  } else {
    console.warn( "[WS] Socket not ready:", request )
  }
}

