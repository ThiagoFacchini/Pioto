import { EventEmitter } from 'events'


export interface GameTimeSystemInterface {
    startDate?: string | Date
    realMsPerGameHour?: number
}


function dateToUTC ( date: Date ): number {
    return Date.UTC(
            date.getUTCFullYear(), 
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
            date.getUTCMilliseconds() 
    )
}

export class GameTimeSystem extends EventEmitter {
    private gameDate: Date
    private gameTimeStamp: number
    private tickTimeStamp: number
    private intervalId: NodeJS.Timeout | null = null
    private realMsPerGameHour: number 

    constructor( config: GameTimeSystemInterface) {
        super()
        this.gameDate = config.startDate ? new Date( config.startDate ) : new Date()
        this.gameTimeStamp = dateToUTC( this.gameDate )
        this.tickTimeStamp = 0
        this.realMsPerGameHour = config.realMsPerGameHour ?? 60000
        console.log( 'Game date is: ', this.gameDate )
    }

    public start(): void {
        if ( this.intervalId ) clearInterval( this.intervalId )
        this.tickTimeStamp = Date.now()

        this.intervalId = setInterval( () => {
            this.advanceTime()
        }, this.realMsPerGameHour )
    }

    public stop(): void {
        if ( this.intervalId ) clearInterval( this.intervalId )
        this.intervalId = null
    }

    private advanceTime(): void {
        this.gameDate.setHours( this.gameDate.getHours() + 1 )
        this.gameTimeStamp = dateToUTC( this.gameDate )
        this.tickTimeStamp = Date.now()
        this.emit('tick', { gameTimeStamp: this.gameTimeStamp, tickTimeStamp: this.tickTimeStamp } )
    }

    public getCurrentTimeStamp() {
        return this.gameTimeStamp
    }

    public getTickTimeStamp() {
        return this.tickTimeStamp
    }

}



