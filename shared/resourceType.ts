export type Resource = {
    id: string,
    type: string,
    meshFile: string,
    position: [ number, number, number ],
    size: [ number, number, number ],
    collidable: boolean
}