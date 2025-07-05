import { WebSocket, WebSocketServer } from "ws";
import { serverBroadcast } from './Broadcast.ts'

import type { Resource } from '../../../shared/resourceType.ts'
import type { RequestPayloadType, ResponseType } from './../../../shared/messageTypes.ts'

import { Resources, Players } from './../gameState.ts'



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

    const player = Players.find( player => player.connectionId === socket.connectionId! )
    
    if ( !player ) return

    const [ boxWidth, boxDepth ] = player.renderBox
    const halfWidth = boxWidth / 2
    const halfDepth = boxDepth / 2

    const playerPosition = player.position
    const px = playerPosition[ 0 ]
    const pz = playerPosition[ 2 ]

    const filteredResources = Resources.filter( resource => {
        const [rx, ry, rz] = resource.position
        return ( 
            rx >= px - halfWidth && 
            rx <= px + halfWidth &&
            rz >= pz - halfDepth &&
            rz <= pz + halfDepth
        )
    } )

    console.log( `${player?.name} requested map resources`)

    const response: ResponseType = {
        header: 'RES_MAP_RESOURCES_GET',
        payload: {
            resources: filteredResources
        }
    }
    
    socket.send( JSON.stringify( response ) )
}
// ==================================================================================================================================



export default {
    requestMapResourceUpdate: requestMapResourceUpdate,
    requestMapResourcesGet: requestMapResourcesGet 
}