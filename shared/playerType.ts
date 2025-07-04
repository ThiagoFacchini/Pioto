export type ConnectionIdType = string

export type AnimationNameType = 'Idle' | 'Walking'

export type PlayerType = {
    connectionId: ConnectionIdType,
    username?: string,
    name?: string,
    meshName: string,
    animationName: AnimationNameType,
    position: [ number, number, number ],
    rotation: [ number, number, number ]
}