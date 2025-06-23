import { MessageCreator } from "../classes/MessageCreator.js"

import { Resource } from '../../../shared/resourcesType.js'

const resources: Array<Resource> = [
        {
            id: 1,
            type: "rock",
            meshFile: "rock 1.glb",
            position: [ 3, -0.2, 3 ],
            size: [ 0.8, 0.9, 0.8 ],
            collidable: true
        },
        {
            id: 2,
            type: "rock",
            meshFile: "rock 1.glb",
            position: [ 6, -0.4, 8 ],
            size: [ 0.9, 0.9, 1 ],
            collidable: false
        },
]


export function getResources ( message, socket, socketServer ) {
    const resourcesMessage = new MessageCreator( 'RESOURCES_LIST', resources )
    socket.send( resourcesMessage.toJSON() )
}


export function updateResources ( message, socket, socketServer ) {
    resources.forEach( ( resource ) => {
        if ( resource.id === message.messagePayload.id ) {
            Object.assign( resource, message.messagePayload )
            broadcastResourcesUpdate( message, socket, socketServer )
        }
    })
}


export function broadcastResourcesUpdate ( message, socket, socketServer ) {
    const resourcesUpdatedMessage = new MessageCreator( 'RESOURCES_LIST', resources )
    socketServer.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send( resourcesUpdatedMessage.toJSON() )
      }
    })
}