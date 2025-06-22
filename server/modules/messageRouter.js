import { getResources, updateResources } from "./resources.js"


const messageHandler = { 
    RESOURCES_REQUEST: getResources,
    RESOURCES_UPDATE: updateResources
}

export function routeMessage ( type, message, socket, socketServer ) {
    const handler = messageHandler[ type ]

    if ( !handler ) {
        console.warn( `Unhandled messageType: ${type}` )
        return
    }

    handler( message, socket, socketServer )
}