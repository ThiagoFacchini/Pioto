import { EventEmitter } from 'events'


export interface GameTimeSystemInterface {
    startDate?: string | Date
    realMsPerGameHour?: number
}


export class GameTimeSystem extends EventEmitter {
    private gameDate: Date
    private tickTimeStamp: number
    private intervalId: NodeJS.Timeout | null = null
    private realMsPerGameHour: number 

    constructor( config: GameTimeSystemInterface) {
        super()
        this.gameDate = config.startDate ? new Date( config.startDate ) : new Date()
        this.tickTimeStamp = 0
        this.realMsPerGameHour = config.realMsPerGameHour ?? 60000
        console.log( 'Game date is: ', this.gameDate )
    }

    public start(): void {
        if ( this.intervalId ) clearInterval( this.intervalId )

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
        this.tickTimeStamp = Date.now()
        this.emit('tick', { gameTime: this.getCurrentTime(), tickTimeStamp: this.tickTimeStamp } )
    }

    public getCurrentTime() {
        return new Date( this.gameDate )
    }

    public getTickTimeStamp() {
        return this.tickTimeStamp
    }

}



