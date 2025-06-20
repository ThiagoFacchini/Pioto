import { routeMessage } from './messageRouter.jsx'

let socket = null

export function connectWebSocket() {
  socket = new WebSocket('ws://localhost:8080')

  socket.onopen = () => {
    console.log('[WS] Connected')
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
    // Optionally reconnect logic here
  }

  socket.onerror = ( err ) => {
    console.error( '[WS] Error:', err )
  }
}