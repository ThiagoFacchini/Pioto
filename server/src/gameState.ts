// @ts-ignore
import type { Resource } from '../../shared/resourceType.ts'
// @ts-ignore
import type { PlayerType, ConnectionIdType } from '../../shared/playerType.ts'

export const Players: PlayerType[] = []
export const Resources:Resource[] = [
        {
            id: '1',
            type: "rock",
            meshFile: "rock 1.glb",
            position: [ 3, -0.2, 3 ],
            size: [ 0.86, 0.98, 0.91 ],
            collidable: true
        },
        {
            id: '2',
            type: "rock",
            meshFile: "rock 1.glb",
            position: [ 6, -0.4, 8 ],
            size: [ 0.86, 0.98, 0.91 ],
            collidable: false
        },
]