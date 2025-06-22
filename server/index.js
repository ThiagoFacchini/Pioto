import { WebSocketServer } from 'ws'
import { startTimeSimulator } from './modules/timeSimulator.js'
import { routeMessage } from './modules/messageRouter.js'

const socketServer = new WebSocketServer( { port: 8080 } )

socketServer.on( 'connection', ( socket ) => {
  console.log( 'Client connected' )

  socket.on( 'close', () => console.log( 'Client disconnected' ) )

  socket.on('message', ( data ) => {
    try {
      const message = JSON.parse( data.toString() )

      if (!message.messageType) {
        console.warn( 'Received message withtout messageType: ', message )
        return
      }

      routeMessage( message.messageType, message, socket, socketServer )
    
    } catch ( err ) {
      console.error( 'Failed to parse message: ', err )
    }
  } )
} )

console.log( 'WebSocket server running on ws://localhost:8080' )

// Start simulator with custom config
startTimeSimulator( socketServer, {
  simulatedDayLengthMs: 1000 * 60 * 60, // 1 real hour = 1 sim day
  // You can reduce this for faster dev/testing
} )