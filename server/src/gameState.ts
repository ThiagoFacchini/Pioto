// @ts-ignore
import type { Resource } from '../../shared/resourceType.ts'
// @ts-ignore
import type { PlayerType, ConnectionIdType } from '../../shared/playerType.ts'
// @ts-ignore
import type { ConfigurationsType } from 'shared/configurationsType.ts'
// @ts-ignore
import type { MapType } from 'shared/mapType.ts'
// @ts-ignore
import type { EnvinronmentType } from 'shared/environmentType.ts'



export const Players: PlayerType[] = []

export const Resources: Resource[] = [
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


export const Map: MapType = {
    name: 'Isla de Valtoria',
    size: [ 100, 100 ]
}


export const Environment: EnvinronmentType = {
    date: null,
    season: null,
    temperature: null,
    isSnowing: false,
    isRaining: false
}


// TODO: It should be probably moved somewhere else
export const Configurations: ConfigurationsType = {
    startDate: '2025-01-01T08:00:00.000Z',
    realMillisecondsPerHour: 5000
}

