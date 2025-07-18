export type ConfigurationsType = {
    startDate: string,
    realMillisecondsPerHour: number,
    seasonTemperatureRanges: Record<string, { min: number; max: number }>
}
