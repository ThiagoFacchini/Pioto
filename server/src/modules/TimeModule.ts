import { GameTimeSystem } from "src/classes/GameTimeSystem.ts"
import { GameTime } from "shared/messageTypes.ts"
import { Configurations } from "src/gameState.ts"

type SubscriberCallback = ( time: GameTime ) => void 

const subscribers = new Map< string, SubscriberCallback >()

const timeSystem = new GameTimeSystem( {
    startDate: Configurations.startDate,
    realMsPerGameHour: Configurations.realMillisecondsPerHour
} )

timeSystem.on( 'tick', ( time: GameTime ) => {
    for (const [ name, callback ] of subscribers ) {
        try {
            callback( time )
        
        } catch ( error ) {
            console.log( `[TimeModule] Error in subscriber "${name}": `, error )
        }
    }
} )


export function startTimeSimulation(): void {
    timeSystem.start()
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

export function getCurrentTime(): GameTime {
    return timeSystem.getCurrentTime()
}

export function stopTimeSimulation(): void {
    timeSystem.stop()
}