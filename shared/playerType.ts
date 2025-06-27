export type ConnectionIdType = string

export type PlayerType = {
    connectionId: ConnectionIdType,
    username?: string,
    name?: string,
    position: [ number, number, number ],
    rotation: [ number, number, number ]
}