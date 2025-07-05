// @ts-ignore
import { PlayerType } from './playerType.ts'
// @ts-ignore
import { Resource } from './resourceType.ts'


// ==================================================================================================================================
// REQUESTS
// ==================================================================================================================================
type RequestConnectionIdPayloadType = null
type RequestAuthenticatePayloadType = { username: string, password: string }
type RequestCharacterSelectPayloadType = { characterName: string }
type RequestPlayerGetPayloadType = { cid: string }
type RequestPlayerListGetPayloadType = null
type RequestPlayerUpdatePayloadType = { player: PlayerType, callerId: string }
type RequestPingPayloadType = null
type RequestMapResourcesGetPayloadType = null
type RequestMapResourceUpdatePayloadType = { resource: Resource }

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
export type ResponseConnectionIdPayloadType = { cid: string }
export type ResponseAuthenticatePayloadType = { characters: string[] }
export type ResponseCharacterSelectPayloadType = null
export type ResponsePlayerGetPayloadType = { player: PlayerType }
export type ResponsePlayerListGetPayloadType = { playerList: Array<PlayerType> }
export type ResponseCharacterListPayloadType = { username: string, charactersList: Array<string> }
export type ResponsePongPayloadType = null
export type ResponseMapResourcesGetPayloadType = { resources: Array<Resource> }

export type ResponsePayloadMap = {
    RES_CONNECTION_ID: ResponseConnectionIdPayloadType
    RES_AUTHENTICATE: ResponseAuthenticatePayloadType
    RES_CHARACTER_SELECT: ResponseCharacterSelectPayloadType
    RES_PLAYER_GET: ResponsePlayerGetPayloadType
    RES_PLAYERLIST_GET: ResponsePlayerListGetPayloadType
    RES_CHARACTER_LIST: ResponseCharacterListPayloadType
    RES_PONG: ResponsePongPayloadType
    RES_MAP_RESOURCES_GET: ResponseMapResourcesGetPayloadType
}

export type ResponseType = {
    [K in keyof ResponsePayloadMap]: {
        header: K,
        payload: ResponsePayloadMap[K]
    }
} [keyof ResponsePayloadMap]
// ==================================================================================================================================