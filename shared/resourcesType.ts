export type Resource = {
    id: number,
    type: string,
    meshFile: string,
    position: [ number, number, number ],
    size: [ number, number, number ],
    collidable: boolean
}