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


// ======================================================================================
// GAME STATE
// ======================================================================================
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
    size: [ 200, 200 ]
}


export const Environment: EnvinronmentType = {
    gameTimeStamp: null,
    tickTimeStamp: null,
    season: null,
    temperature: null,
    isSnowing: false,
    isRaining: false
}


// ======================================================================================
// CONFIGURATIONS
// ======================================================================================

// TODO: It should be probably moved somewhere else
export const Configurations: ConfigurationsType = {
    startDate: '2025-01-01T08:00:00.000',
    realMillisecondsPerHour: 1000,
    seasonTemperatureRanges: {
        SUMMER: { min: 26, max: 33 },
        AUTUMN: { min: 19, max: 26 },
        WINTER: { min: 15, max: 22 },
        SPRING: { min: 23, max: 30 }
    },
    climaticZonesTemperatureVariation: {
        POLAR: -15,
        TEMPERATE: -7,
        TROPICAL: 0
    }
}

