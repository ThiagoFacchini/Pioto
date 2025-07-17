import { GameTimeSystem } from "src/classes/GameTimeSystem.ts"
import { TickPayload } from "shared/messageTypes.ts"
import { Configurations } from "src/gameState.ts"

type SubscriberCallback = ( tickPayload: TickPayload ) => void 

const subscribers = new Map< string, SubscriberCallback >()

let lastKnownTick: Date

const timeSystem = new GameTimeSystem( {
    startDate: Configurations.startDate,
    realMsPerGameHour: Configurations.realMillisecondsPerHour
} )

timeSystem.on( 'tick', ( gameTime: Date ) => {
    for (const [ name, callback ] of subscribers ) {
        try {
            callback( {
                gameTime: gameTime,
                lastKnowTick: lastKnownTick
            } )
        
        } catch ( error ) {
            console.log( `[TimeModule] Error in subscriber "${name}": `, error )
        }
    }

    lastKnownTick = gameTime
} )


export function startTimeSimulation(): void {
    timeSystem.start()

    // Upoon start it gets the gameTime and substracts on hour just so
    // lastKnowTick is never empty
    const currentTime = getCurrentTime()
    currentTime.setHours( currentTime.getHours() - 1 )
    
    lastKnownTick = currentTime
}

export function subscribe( name: string, callback: SubscriberCallback ) : void {
    if ( subscribers.has( name ) ) {
        console.warn( `[TimeModule] Subscriber "${name} is already susbcribed. Overwritting...` )
    }
    subscribers.set( name, callback )
}

export function unsubscribe( name: string ) {
    subscribers.delete( name )
}

export function getCurrentTime(): Date {
    return timeSystem.getCurrentTime()
}

export function stopTimeSimulation(): void {
    timeSystem.stop()
}