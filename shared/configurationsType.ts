// @ts-ignore
import { ClimaticZonesVariationType } from './../shared/messageTypes.ts'

export type ConfigurationsType = {
    startDate: string,
    realMillisecondsPerHour: number,
    seasonTemperatureRanges: Record<string, { min: number; max: number }>
    climaticZonesTemperatureVariation: ClimaticZonesVariationType
}
