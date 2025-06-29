import { WebSocket, WebSocketServer } from "ws";
import { serverBroadcast } from './Broadcast.ts'

import type { Resource } from '../../../shared/resourceType.ts'
import type { RequestPayloadType, ResponseType } from './../../../shared/messageTypes.ts'


const Resources: Array<Resource> = [
        {
            id: '1',
            type: "rock",
            meshFile: "rock 1.glb",
            position: [ 3, -0.2, 3 ],
            size: [ 0.86, 0.98, 0.91 ],
            collidable: true
        },
        {
            id: '2',
            type: "rock",
            meshFile: "rock 1.glb",
            position: [ 6, -0.4, 8 ],
            size: [ 0.86, 0.98, 0.91 ],
            collidable: false
        },
]



// ==================================================================================================================================
// PRIVATE METHODS
// ==================================================================================================================================
function findResourceById ( rid: string ) {
    const index = Resources.findIndex( resource => resource.id === rid )

    if ( index !== -1 ) {
        return index
    } else {
        return false
    }
}
// ==================================================================================================================================


// ==================================================================================================================================
// PUBLIC METHODS
// ==================================================================================================================================
function requestMapResourceUpdate ( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const resourceIndex = findResourceById( request.resource.id )

    
    if ( resourceIndex !== false ) {
            console.log('Before Update: ', Resources[ resourceIndex ].position )
            Resources[ resourceIndex ] = request.resource
            console.log('After Update: ', Resources[ resourceIndex ].position )

        let broadcastResponse: ResponseType = {
            header: 'RES_MAP_RESOURCES_GET',
            payload: {
                resources: Resources
            }
        }

        serverBroadcast( broadcastResponse )
    }
}


function requestMapResourcesGet( request: RequestPayloadType, socket: WebSocket, socketServer: WebSocketServer ) {
    const response: ResponseType = {
        header: 'RES_MAP_RESOURCES_GET',
        payload: {
            resources: Resources
        }
    }
    
    socket.send( JSON.stringify( response ) )
}
// ==================================================================================================================================



export default {
    requestMapResourceUpdate: requestMapResourceUpdate,
    requestMapResourcesGet: requestMapResourcesGet 
}