// types/ws.d.ts
import 'ws'

declare module 'ws' {
  interface WebSocket {
    connectionId?: string
  }
}