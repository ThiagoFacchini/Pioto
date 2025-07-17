// @ts-ignore
import { PlayerType } from './playerType.ts'
// @ts-ignore
import { Resource } from './resourceType.ts'
// @ts-ignore
import { Configurations } from './configurationsType.ts'
// @ts-ignore
import { MapType } from './mapType.ts'
// @ts-ignore
import { Environment } from './environmentType.ts'


// ==================================================================================================================================
// COMMON TYPES
// ==================================================================================================================================
export type TickPayload = {
    gameTime: Date,
    lastKnowTick: Date
}
// ==================================================================================================================================


// ==================================================================================================================================
// REQUESTS
// ==================================================================================================================================
export type RequestConnectionIdPayloadType = null
export type RequestAuthenticatePayloadType = { username: string, password: string }
export type RequestCharacterSelectPayloadType = { characterName: string }
export type RequestPlayerGetPayloadType = { cid: string }
export type RequestPlayerListGetPayloadType = null
export type RequestPlayerUpdatePayloadType = { player: PlayerType, callerId: string }
export type RequestPingPayloadType = null
export type RequestMapResourcesGetPayloadType = null
export type RequestMapResourceUpdatePayloadType = { resource: Resource }
export type RequestGameConfigurationsPayloadType = null
export type RequestMapDefinitionsPayloadType = null
export type RequestEnvironmentPayloadType = null

export type RequestPayloadMap = {
    REQ_CONNECTION_ID : RequestConnectionIdPayloadType
    REQ_AUTHENTICATE: RequestAuthenticatePayloadType
    REQ_CHARACTER_SELECT: RequestCharacterSelectPayloadType
    REQ_PLAYER_GET: RequestPlayerGetPayloadType
    REQ_PLAYERLIST_GET: RequestPlayerListGetPayloadType
    REQ_PLAYER_UPDATE: RequestPlayerUpdatePayloadType
    REQ_PING: RequestPingPayloadType
    REQ_MAP_RESOURCES_GET: RequestMapResourcesGetPayloadType
    REQ_MAP_RESOURCE_UPDATE: RequestMapResourceUpdatePayloadType
    REQ_GAME_CONFIGURATIONS: RequestGameConfigurationsPayloadType
    REQ_MAP_DEFINITIONS: RequestMapDefinitionsPayloadType,
    REQ_ENVIRONMENT: RequestEnvironmentPayloadType
} 

export type RequestType = {
    [K in keyof RequestPayloadMap ]: {
        header: K
        payload: RequestPayloadMap[K]
    }
} [keyof RequestPayloadMap]
// ==================================================================================================================================



// ==================================================================================================================================
// RESPONSES
// ==================================================================================================================================
export type ResponseConnectionIdPayloadType = { connectionId: string }
export type ResponseCharacterSelectPayloadType = null
export type ResponsePlayerListGetPayloadType = { playerList: Array<PlayerType> }
export type ResponseCharacterListPayloadType = { username: string, charactersList: Array<string> }
export type ResponsePongPayloadType = null
export type ResponseMapResourcesGetPayloadType = { resources: Array<Resource> }
export type ResponseGameConfigurationsPayloadType = { configurations: Configurations }
export type ResponseMapDefinitionsPayloadType = { map: MapType }
export type ResponseEnviromentPayloadType = { environment: Environment }

export type ResponsePayloadMap = {
    RES_CONNECTION_ID: ResponseConnectionIdPayloadType
    RES_CHARACTER_SELECT: ResponseCharacterSelectPayloadType
    RES_PLAYERLIST_GET: ResponsePlayerListGetPayloadType
    RES_CHARACTER_LIST: ResponseCharacterListPayloadType
    RES_PONG: ResponsePongPayloadType
    RES_MAP_RESOURCES_GET: ResponseMapResourcesGetPayloadType,
    RES_TICK: TickPayload,
    RES_GAME_CONFIGURATIONS: ResponseGameConfigurationsPayloadType
    RES_MAP_DEFINITIONS: ResponseMapDefinitionsPayloadType,
    RES_ENVIRONMENT: ResponseEnviromentPayloadType
}

export type ResponseType = {
    [K in keyof ResponsePayloadMap]: {
        header: K,
        payload: ResponsePayloadMap[K]
    }
} [keyof ResponsePayloadMap]
// ==================================================================================================================================