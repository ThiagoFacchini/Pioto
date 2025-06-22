import { useTimeStore } from '../stores/timeStore.jsx'
import { useResourcesStore } from '../stores/resourcesStore.jsx'

export function routeMessage(msg) {
  switch (msg.messageType) {
    case 'TICK':
      useTimeStore.getState().updateTick(msg)
      break
      
    case 'RESOURCES_LIST':
      useResourcesStore.getState().updateResources( msg.messagePayload )
      useResourcesStore.getState().setAreResourcesLoaded( true )
      break

    default:
      console.warn(`Unhandled message type: ${msg.messageType}`)
      console.warn( msg )
  }
}