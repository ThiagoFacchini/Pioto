import { WebSocket, WebSocketServer } from "ws";
import { MessageCreator } from "../classes/MessageCreator.ts"

import type { Resource } from '../../../shared/resourceType.ts'
import type { MessagePayloads, TypedMessage } from './../../../shared/messageTypes.ts'



const resources: Array<Resource> = [
        {
            id: 1,
            type: "rock",
            meshFile: "rock 1.glb",
            position: [ 3, -0.2, 3 ],
            size: [ 0.86, 0.98, 0.91 ],
            collidable: true
        },
        {
            id: 2,
            type: "rock",
            meshFile: "rock 1.glb",
            position: [ 6, -0.4, 8 ],
            size: [ 0.86, 0.98, 0.91 ],
            collidable: false
        },
]


export function getResources ( 
    _: null, 
    client: WebSocket, 
    socketServer: WebSocketServer 
) {
    const resourcesMessage = new MessageCreator( 'RESOURCES_LIST', resources )
    client.send( resourcesMessage.toJSON() )
}


export function updateResources ( 
    payload: TypedMessage<MessagePayloads['RESOURCES_UPDATE']>, 
    socket: WebSocket, 
    socketServer: WebSocketServer 
) {
    resources.forEach( ( resource ) => {
        if ( resource.id === message.messagePayload.id ) {
            Object.assign( resource, message.messagePayload )
            broadcastResourcesUpdate( message, socket, socketServer )
        }
    })
}


export function broadcastResourcesUpdate ( 
    message: TypedMessage<MessagePayloads['RESOURCES_UPDATE']>, 
    socket: WebSocket, 
    socketServer: WebSocketServer 
) {
    const resourcesUpdatedMessage = new MessageCreator( 'RESOURCES_LIST', resources )
    socketServer.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send( resourcesUpdatedMessage.toJSON() )
      }
    })
}