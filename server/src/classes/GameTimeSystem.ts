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

export type EventTickType = {
    gameTimeStamp: number,
    tickTimeStamp: number
}

export type EventDayChangeType = {
    newDay: Date,
    gameTimeStamp: number
}

export type EventSunriseType = {
    gameTimeStamp: number
}

export type EventSunsetType = {
    gameTimeStamp: number
}

export type EventWeekChangeType = {
    newWeek: number,
    gameTimeStamp: number
}

export type EventMonthChangeType = {
    newMonth: number,
    gameTimeStamp: number
}

export type EventNewYearType = {
    newYear: number,
    gameTimeStamp: number
}


export class GameTimeSystem extends EventEmitter {
    private gameDate: Date
    private gameTimeStamp: number
    private tickTimeStamp: number
    private intervalId: NodeJS.Timeout | null = null
    private realMsPerGameHour: number 
    private previousDate: Date | null = null

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
        this.previousDate = new Date( this.gameTimeStamp )

        this.intervalId = setInterval( () => {
            this.advanceTime()
        }, this.realMsPerGameHour )
    }


    public stop(): void {
        if ( this.intervalId ) clearInterval( this.intervalId )
        this.intervalId = null
    }


    private advanceTime(): void {
        // Store previous date before advancing.
        this.previousDate = new Date( this.gameTimeStamp )

        this.gameDate.setHours( this.gameDate.getHours() + 1 )
        this.gameTimeStamp = dateToUTC( this.gameDate )
        this.tickTimeStamp = Date.now()

        // Emit the standard 'tick'
        this.emit( 'TICK', { gameTimeStamp: this.gameTimeStamp, tickTimeStamp: this.tickTimeStamp } )

        // Check for day change (midnight: hour === 0 )
        if ( this.gameDate.getHours() === 0 ) {
            this.emit( 'DAYCHANGE', { newDay: this.gameDate.getDate(), gameTimeStamp: this.gameTimeStamp } )
        }

        // Check for sunrise ( 6:00 ) and sunset ( 18:00 )
        if ( this.gameDate.getHours() === 6 ) {
            this.emit( 'SUNRISE', { gameTimeStamp: this.gameTimeStamp } )
        } else if ( this .gameDate.getHours() === 18 ) {
            this.emit( 'SUNSET', { gameTimeStamp: this.gameTimeStamp } )
        }

        // Check for week change (assuming weeeks start on Sunday; emit emit if day of week resets to 0)
        if ( this.previousDate && this.gameDate.getDay() === 0 && this.previousDate.getDay() !== 0 ) {
            this.emit( 'WEEKCHANGE', { newWeek: this.gameDate.getDate(), gameTimeStamp: this.gameTimeStamp } )
        }

        // Check for month change
        if ( this.previousDate && this.gameDate.getMonth() !== this.previousDate.getMonth() ) {
            this.emit( 'MONTHCHANGE', { newMonth: this.gameDate.getMonth() + 1, gameTimeStamp: this.gameTimeStamp } )
        }

        // Check for year change
        if ( this.previousDate && this.gameDate.getFullYear() !== this.previousDate.getFullYear() ) {
            this.emit( 'YEARCHANGE', { newYear: this.gameDate.getFullYear(), gameTimeStamp: this.gameTimeStamp } )
        }
    }


    public getCurrentTimeStamp() {
        return this.gameTimeStamp
    }


    public getTickTimeStamp() {
        return this.tickTimeStamp
    }

}



