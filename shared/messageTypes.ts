// @ts-ignore
import { Player } from './playerType.ts'
// @ts-ignore
import { Resource } from './resourceType.ts'


export type RequestHeaderType = 'REQ_CONNECTION_ID' | 'REQ_PLAYER_GET' | 'REQ_PLAYERLIST_GET' | 'REQ_PLAYER_UPDATE'

export type RequestConnectionIdPayloadType = null
export type RequestPlayerGetPayloadType = { cid: string }
export type RequestPlayerListGetPayloadType = null
export type RequestPlayerUpdatePayloadType = Player

export type RequestPayloadType = 
    RequestConnectionIdPayloadType | 
    RequestPlayerGetPayloadType | 
    RequestPlayerListGetPayloadType | 
    RequestPlayerUpdatePayloadType



export type ResponseHeaderType = 'RES_CONNECTION_ID' | 'RES_PLAYER_GET' | 'RES_PLAYERLIST_GET'

export type ResponseConnectionIdPayloadType = { cid: string }
export type ResponsePlayerGetPayloadType = { player: Player }
export type ResponsePlayerListGetPayloadType = { playerList: Array<Player> }

export type ResponsePayloadType = ResponseConnectionIdPayloadType | ResponsePlayerGetPayloadType | ResponsePlayerListGetPayloadType





export type RequestType = {
    header: RequestHeaderType,
    payload: RequestPayloadType
}

export type ResponseType = {
    header: ResponseHeaderType,
    payload: ResponsePayloadType
}