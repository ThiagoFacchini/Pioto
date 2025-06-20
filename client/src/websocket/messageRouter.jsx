import { useTimeStore } from '../stores/timeStore.jsx'

export function routeMessage(msg) {
  switch (msg.type) {
    case 'TICK':
      useTimeStore.getState().updateTick(msg)
      break

    // future cases:
    // case 'PLAYER_UPDATE':
    // case 'CHAT':
    // case 'ALERT':
    //   ...

    default:
      console.warn(`Unhandled message type: ${msg.type}`)
  }
}