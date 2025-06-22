import { MessageCreator } from "../classes/messageCreator.js"

export function getResources ( message, socket, socketServer) {
    const payload = [
        {
            id: 1,
            type: "rock",
            variant: "rock 1.glb",
            position: [ 3, -0.2, 3 ]
        },
        {
            id: 2,
            type: "rock",
            variant: "rock 1.glb",
            position: [ 6, -0.4, 8 ]
        },
    ]

    const resourcesMessage = new MessageCreator('RESOURCES_LIST', payload)

    socket.send( resourcesMessage.toJSON() )
}