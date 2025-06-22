import { routeMessage } from './messageRouter.jsx'
import { useWebSocketStore } from '../stores/websocketStore.jsx'

let socket = null

export function connectWebSocket() {
  console.log("Calling connectWebSocket")
  socket = new WebSocket('ws://10.0.1.184:8080')
  
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


export function sendRequest( request ) {
  if ( getSocket()?.readyState === WebSocket.OPEN ) {
    socket.send( JSON.stringify( request ) )
  } else {
    console.warn( "[WS] Socket not ready:", request )
  }
}

export function sendUpdate( message ) {
  if ( getSocket()?.readyState === WebSocket.OPEN ) {
    socket.send( JSON.stringify( message ) )
  } else {
    console.warn( "[WS] Socket not ready:", message )
  }
}