import { 
    GameTimeSystem, 
    EventTickType, 
    EventDayChangeType ,
    EventSunriseType,
    EventSunsetType,
    EventWeekChangeType,
    EventMonthChangeType,
    EventNewYearType
} from "src/classes/GameTimeSystem.ts"
import { 
    GameSeasonType,
    TimeEventTypes,
    TickPayload, 
    DayChangePayload,
    SunsetPayload,
    SunrisePayload,
    WeekChangePayload,
    MonthChangePayload,
    YearChangePayload,
    EventPayloadMap, 
 } from "shared/messageTypes.ts"
import { Configurations } from "src/gameState.ts"


// ======================================================================================
// DECLARATIONS
// ======================================================================================
// Type for subscriber callbacks that receive tick payloads.
type SubscriberCallback = ( payload: any ) => void 

// Type alias for the inner Map: subscriber name -> callback.
type NamedSubscribers = Map<string, SubscriberCallback>;

// The subscribers variable: eventName -> NamedSubscribers Map.
const subscribers: Map<string, NamedSubscribers> = new Map();


// Variable to store the current daily base temperature (recalculated each game day).
let dailyBaseTemperature: number | null = null

// Initialize the time system with start date and real ms per game hour from configs.
const timeSystem = new GameTimeSystem( {
    startDate: Configurations.startDate,
    realMsPerGameHour: Configurations.realMillisecondsPerHour
} )


// ======================================================================================
// SYSTEM EVENTS
// ======================================================================================
// TICK
timeSystem.on( 'TICK', ( timeModuleData: EventTickType ) => {
   
    const tickPayload: TickPayload = {
        gameTimeStamp: timeModuleData.gameTimeStamp,
        gameSeason: getCurrentSeason(),
        gameCurrentTemperature: getCurrentTemperature(),
        tickTimeStamp: timeModuleData.tickTimeStamp
    }

    const eventSubs = getEventSubscribers('TICK')
    executeEventCallbacks( eventSubs, tickPayload, 'TICK' )
} )

// DAYCHANGE
timeSystem.on( 'DAYCHANGE', ( timeModuleData: EventDayChangeType ) => {
   
    const dayChangePayload: DayChangePayload = {
        newDay: timeModuleData.newDay,
        gameTimeStamp: timeModuleData.gameTimeStamp
    }

    const eventSubs = getEventSubscribers('DAYCHANGE')
    executeEventCallbacks( eventSubs, dayChangePayload, 'DAYCHANGE' )
} )

// SUNSET
timeSystem.on( 'SUNSET', ( timeModuleData: EventSunsetType ) => {
   
    const sunsetPayload: SunsetPayload = {
        gameTimeStamp: timeModuleData.gameTimeStamp
    }

    const eventSubs = getEventSubscribers('SUNSET')
    executeEventCallbacks( eventSubs, sunsetPayload, 'SUNSET' )
} )

// SUNRISE
timeSystem.on( 'SUNRISE', ( timeModuleData: EventSunriseType ) => {
   
    const sunsetPayload: SunrisePayload = {
        gameTimeStamp: timeModuleData.gameTimeStamp
    }

    const eventSubs = getEventSubscribers('SUNRISE')
    executeEventCallbacks( eventSubs, sunsetPayload, 'SUNRISE' )
} )

// WEEKCHANGE
timeSystem.on( 'WEEKCHANGE', ( timeModuleData: EventWeekChangeType ) => {
   
    const weekChangePayload: WeekChangePayload = {
        newWeek: timeModuleData.newWeek,
        gameTimeStamp: timeModuleData.gameTimeStamp
    }

    const eventSubs = getEventSubscribers('WEEKCHANGE')
    executeEventCallbacks( eventSubs, weekChangePayload, 'WEEKCHANGE' )
} )

// MONTHCHANGE
timeSystem.on( 'MONTHCHANGE', ( timeModuleData: EventMonthChangeType ) => {
   
    const monthChangePayload: MonthChangePayload = {
        newMonth: timeModuleData.newMonth,
        gameTimeStamp: timeModuleData.gameTimeStamp
    }

    const eventSubs = getEventSubscribers('MONTHCHANGE')
    executeEventCallbacks( eventSubs, monthChangePayload, 'MONTHCHANGE' )
} )

// YEARCHANGE
timeSystem.on( 'YEARCHANGE', ( timeModuleData: EventNewYearType ) => {
   
    const yearChangePayload: YearChangePayload = {
        newYear: timeModuleData.newYear,
        gameTimeStamp: timeModuleData.gameTimeStamp
    }

    const eventSubs = getEventSubscribers('YEARCHANGE')
    executeEventCallbacks( eventSubs, yearChangePayload, 'YEARCHANGE' )
} )
// ======================================================================================


function executeEventCallbacks<K extends TimeEventTypes> ( eventSubs: Map<string, SubscriberCallback>, payload: EventPayloadMap[K], eventName: TimeEventTypes ): void {
    for ( const [ name, callback ] of eventSubs ) {
        try {
            callback( payload )
        } catch ( error ) {
            console.log( `[TimeModule] Error in subscriber "${name}" for event "${eventName}": `, error )
        }
    }    
}


// Helper to get or create inner Map for an event.
function getEventSubscribers( eventName: TimeEventTypes ): Map<string, SubscriberCallback> {
    if ( !subscribers.has( eventName ) ) {
        subscribers.set( eventName, new Map() ) 
    }

    return subscribers.get( eventName )!
}



// Subscribe a callback to receive event updates (overwrites if name exists).
export function subscribe( eventName: TimeEventTypes, name: string, callback: SubscriberCallback ) : void {
    const eventSubs = getEventSubscribers( eventName )

    if ( eventSubs.has( name ) ) {
        console.warn( `[TimeModule] Subscriber "${name}" for event "${eventName}" is already subscribed. Overwriting...` )
    }

    eventSubs.set( name, callback )
}


// Unsubscribe a callback by name.
export function unsubscribe( eventName: TimeEventTypes, name: string ) {
    const eventSubs = getEventSubscribers( eventName )
    eventSubs.delete( name )
}


// Start the time simulation (begins the interval for ticking).
export function startTimeSimulation(): void {
    timeSystem.start()
}


// Get the current game timestamp.
export function getCurrentTimeStamp(): number {
    return timeSystem.getCurrentTimeStamp()
}


// Get the real-world timestamp of the last tick.
export function getTickTimeStamp(): number {
    return timeSystem.getTickTimeStamp()
}


/** 
 * Get the current season based on the game date's month.
 * Seasons are defined as:
 * - Summer: Jan-Mar (months 0-2)
 * - Autumn: Apr-Jun (months 3-5)
 * - Winter: Jul-Sep (months 6-8)
 * - Spring: Oct-Dec (months 9-11)
 * Uses Date.getMonth() which is 0-based
 */
export function getCurrentSeason(): GameSeasonType {
    const currentDate = new Date( getCurrentTimeStamp() )
    const month = currentDate.getMonth()

    if (month >= 0 && month <= 2 ) {
        return 'SUMMER'
    } else if ( month >= 3 && month <= 5 ) {
        return 'AUTUMUN'
    } else if ( month >= 6 && month <= 8 ) {
        return 'WINTER'
    } else  {
        return 'SPRING'
    }
}


// Function to calculate the daily base temperature.
// Called at midnight tick or on simulation start.
// Picks a random value between the current season's min and max (with 0.1 precision for realism).
// Suggestion: Random for daily variety, but could be deterministic (e.g., seeded by date) if needed for reproducibility.
function calculateDailyBaseTemperature() : void {
    const season = getCurrentSeason()
    const { min, max } = Configurations.seasonTemperatureRanges[ season ]

    dailyBaseTemperature = Math.round( ( min + Math.random() * ( max - min ) ) * 10 ) / 10
    console.log(`[TimeModule] New day: Season=${season}, Base Temperature=${dailyBaseTemperature}°C`);
}


// Get the current temperature, including daily oscillation.
// Oscillation: Uses a sine wave for natural day-night cycle.
// - Amplitude: ±3°C (warmer midday, cooler night).
// - Peak at 14:00 (2 PM), trough at 02:00 (2 AM).
// Formula: base + amplitude * sin(2π * (hour + phase) / 24)
// Phase adjusted so sin peaks at hour 14.
export function getCurrentTemperature(): number {
    if (dailyBaseTemperature === null) {
        // Fallback if not initialized
        calculateDailyBaseTemperature()
    }

    const currentDate = new Date( getCurrentTimeStamp() )
    const hour = currentDate.getHours() + currentDate.getMinutes() / 60

    const amplitude = 3         // ~3C variation
    const phaseShift = 14       // Peak at 14:00
    const oscillation = amplitude * Math.sin( 2 * Math.PI * ( hour - phaseShift + 12 ) / 24 )

    return Math.round( ( dailyBaseTemperature! + oscillation ) * 10 ) / 10
}
 

// Stop the time simulation (clears the interval).
export function stopTimeSimulation(): void {
    timeSystem.stop()
}




