import { Resource } from './resourcesType'

export type TickPayload = {
    simMinute: number,
    simTime: string,
    timestamp: number
}


export interface TypedMessage<T = unknown> {
    messageType: MessageType,
    messagePayload: T
}

export interface MessagePayloads {
    TICK: TickPayload,
    RESOURCES_LIST: Array<Resource>
}

export type MessageType = keyof MessagePayloads