import { WebSocketServer } from 'ws'
import { startTimeSimulator } from './modules/timeSimulator.js'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
  console.log('Client connected')
  ws.on('close', () => console.log('Client disconnected'))
})

console.log('WebSocket server running on ws://localhost:8080')

// Start simulator with custom config
startTimeSimulator(wss, {
  simulatedDayLengthMs: 1000 * 60 * 60, // 1 real hour = 1 sim day
  // You can reduce this for faster dev/testing
})