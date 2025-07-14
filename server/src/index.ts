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
import { startTimeSimulation, subscribe as subscribeTimeSimulation, getCurrentTime } from './modules/TimeModule.ts'
import { GameTime } from './../../shared/messageTypes.ts'


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


const currentGameTime = getCurrentTime()
Environment.date = currentGameTime.date

subscribeTimeSimulation( '[gameState.ts]',( gameTime: GameTime ) => {
    Environment.date = gameTime.date
})

subscribeTimeSimulation( 'TICK[index.ts]', ( gameTime: GameTime ) => {
    console.log( 'ticking... ', gameTime.date.toLocaleString() )
    serverBroadcast({
        header: 'RES_TICK',
        payload: gameTime
    })
})