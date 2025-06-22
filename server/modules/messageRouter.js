import { getResources } from "./resources.js"

const messageHandler = { 
    REQUEST_RESOURCES: getResources
}

export function routeMessage ( type, message, socket, socketServer ) {
    const handler = messageHandler[ type ]

    if ( !handler ) {
        console.warn( `Unhandled messageType: ${type}` )
        return
    }

    handler( message, socket, socketServer )
}