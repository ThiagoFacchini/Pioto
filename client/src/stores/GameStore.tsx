import { create } from 'zustand'

import { TickPayload } from 'shared/messageTypes'
import { MapType } from 'shared/mapType'
import { ResponseMapDefinitionsPayloadType, ResponseEnviromentPayloadType } from 'shared/messageTypes'

import { useWebSocketStore } from './WebsocketStore'


type GameStoreType = {
    hasTicked: boolean,
    gameTimeStamp: number,
    tickTimeStamp: number,
    mapName: string | null,
    mapSize: [ number, number ],
    setHasTicked: ( hasTicked: boolean ) => void,
    setGameTimeStamp: ( timeStamp: number ) => void,
    setTickTimeStamp: ( timeStamp: number ) => void,
    setMap: ( map: MapType ) => void
}

export const useGameStore = create< GameStoreType >( ( set ) => ( {
    hasTicked: false,
    gameTimeStamp: 0,
    tickTimeStamp: 0,
    mapName: null,
    mapSize: [ 100, 100 ],
    setHasTicked: ( hasTicked: boolean ) => {
        set( { hasTicked: hasTicked } )
    },
    setGameTimeStamp: ( timeStamp: number ) => { 
        set( { gameTimeStamp: timeStamp } ) 
    },
    setTickTimeStamp: ( timeStamp: number ) => {
        set( { tickTimeStamp: timeStamp } )
    },
    setMap: ( map: MapType ) => set( { mapName: map.name, mapSize: map.size } )
} ) )


export function setTick( payload: TickPayload ) {
    console.log( 'setTick called' )

    useGameStore.getState().setGameTimeStamp( payload.gameTimeStamp ) 
    useGameStore.getState().setTickTimeStamp( payload.tickTimeStamp )
    
    if ( useWebSocketStore.getState().isCharacterSelected ) {
        if ( useGameStore.getState().hasTicked === false ) {
            useGameStore.getState().setHasTicked( true )
            console.log('hasTicked is now true')
        }
    
    } else {
        console.log('setTick partially discard as player did pick a character yet.')
    }
}

export function setMap( payload: ResponseMapDefinitionsPayloadType ) {
    useGameStore.getState().setMap( payload.map )
}

export function setEnvironment( payload: ResponseEnviromentPayloadType ) {
    useGameStore.getState().setGameTimeStamp( payload.gameTimeStamp  )
    useGameStore.getState().setTickTimeStamp( payload.tickTimeStamp )
}