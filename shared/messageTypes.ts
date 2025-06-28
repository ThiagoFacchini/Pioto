// @ts-ignore
import { Player } from './playerType.ts'
// @ts-ignore
import { Resource } from './resourceType.ts'


export type RequestHeaderType = 
    'REQ_CONNECTION_ID' | 
    'REQ_AUTHENTICATE' | 
    'REQ_CHARACTER_SELECT' |
    'REQ_PLAYER_GET' | 
    'REQ_PLAYERLIST_GET' | 
    'REQ_PLAYER_UPDATE' |
    'REQ_PING'

export type RequestConnectionIdPayloadType = null
export type RequestAuthenticatePayloadType = { username: string, password: string }
export type RequestCharacterSelectPayloadType = { characterName: string }
export type RequestPlayerGetPayloadType = { cid: string }
export type RequestPlayerListGetPayloadType = null
export type RequestPlayerUpdatePayloadType = Player
export type RequestPingPayloadType = null

export type RequestPayloadType = 
    RequestConnectionIdPayloadType | 
    RequestAuthenticatePayloadType |
    RequestCharacterSelectPayloadType |
    RequestPlayerGetPayloadType | 
    RequestPlayerListGetPayloadType | 
    RequestPlayerUpdatePayloadType |
    RequestPingPayloadType



export type ResponseHeaderType = 
    'RES_CONNECTION_ID' | 
    'RES_AUTHENTICATE' | 
    'RES_CHARACTER_SELECT' |
    'RES_PLAYER_GET' | 
    'RES_PLAYERLIST_GET' | 
    'RES_CHARACTER_LIST' |
    'RES_PONG'

export type ResponseConnectionIdPayloadType = { cid: string }
export type ResponseAuthenticatePayloadType = { characters: string[] }
export type ResponseCharacterSelectPayloadType = null
export type ResponsePlayerGetPayloadType = { player: Player }
export type ResponsePlayerListGetPayloadType = { playerList: Array<Player> }
export type ResponseCharacterListPayloadType = { username: string, charactersList: Array<string> }
export type ResponsePongPayloadType = null

export type ResponsePayloadType = 
    ResponseConnectionIdPayloadType | 
    ResponseAuthenticatePayloadType |
    ResponseCharacterSelectPayloadType |
    ResponsePlayerGetPayloadType | 
    ResponsePlayerListGetPayloadType |
    ResponseCharacterListPayloadType |
    ResponsePongPayloadType

    

export type RequestType = {
    header: RequestHeaderType,
    payload: RequestPayloadType
}

export type ResponseType = {
    header: ResponseHeaderType,
    payload: ResponsePayloadType
}