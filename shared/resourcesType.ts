export type Resource = {
    id: number,
    type: string,
    meshFile: string,
    position: Array<number>,
    size: Array<number>,
    collidable: boolean
}