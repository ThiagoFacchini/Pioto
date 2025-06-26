export type ConnectionIdType = string

export type PlayerType = {
    connectionId: ConnectionIdType,
    name?: string
    position: [ number, number, number ],
    rotation: [ number, number, number ]
}