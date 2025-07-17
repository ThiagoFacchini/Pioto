import express from 'express'
import cors from 'cors'
import http from 'http'
import path from 'path'
import { WebSocketServer } from 'ws'
import { fileURLToPath } from 'url'
import { v4 as uuid } from 'uuid'

import Player from './modules/Player.ts'
import { Environment } from './gameState.ts'

// Modules
import { RequestType } from './../../shared/messageTypes.ts'
import { receiveRequest } from './modules/MessageRouter.ts'
import { attachSocketServer, serverBroadcast } from './modules/Broadcast.ts'

// Systems
import { startTimeSimulation, subscribe as subscribeTimeSimulation, getCurrentTimeStamp, getTickTimeStamp } from './modules/TimeModule.ts'
import { TickPayload } from './../../shared/messageTypes.ts'


// Resolve __dirname for ES modules
const __filename = fileURLToPath( import.meta.url )
const __dirname = path.dirname( __filename )

const app = express()
app.use( cors() )

app.use('/models', express.static( path.join( __dirname, '..', 'public', 'models' ) ) )

const server = http.createServer( app )
const HTTP_PORT = 8081
const socketServer = new WebSocketServer( { port: 8080 } )
console.log( 'WebSocket server running on ws://localhost:8080' )

attachSocketServer( socketServer )

socketServer.on( 'connection', ( socket ) => {
  console.log( 'Client connected!' )

  socket.connectionId = uuid()
  Player.requestAddPlayer( socket.connectionId )


  socket.on( 'close', () => {
    console.log( 'Client disconnected!' )
    Player.requestRemovePlayer( socket.connectionId! )
  })


  socket.on('message', ( request: MessageEvent ) => {
    receiveRequest ( request, socket, socketServer )
  })

})




server.listen( HTTP_PORT, () => {
  console.log( `HTTP Server running at http:L//localhost:${HTTP_PORT}` )
  console.log( `Models served at http://localhost:${HTTP_PORT}/models` )
} )


// Time System and Subscriptions

startTimeSimulation()
console.log( 'Time Simulation Started' )

//  Populate date and tickTimeStamp as soon as server starts
Environment.gameTimeStamp = getCurrentTimeStamp()
Environment.tickTimeStamp = getTickTimeStamp()


// Updates environment on every single tick
subscribeTimeSimulation( '[gameState.ts]',( tickPayload: TickPayload ) => {
    console.log( 'Tick: ' , tickPayload )
    Environment.gameTimeStamp = tickPayload.gameTimeStamp
    Environment.tickTimeStamp = tickPayload.tickTimeStamp

})

// Broadcast tick event to all connected clients
subscribeTimeSimulation( 'TICK[index.ts]', ( tickPayload: any ) => {
    serverBroadcast({
        header: 'RES_TICK',
        payload: tickPayload
    })
})