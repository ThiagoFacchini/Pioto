import { create } from 'zustand'

import { TickPayload } from 'shared/messageTypes'
import { MapType } from 'shared/mapType'
import { ResponseMapDefinitionsPayloadType, ResponseEnviromentPayloadType } from 'shared/messageTypes'

type GameStoreType = {
    gameTime: Date,
    tickTimeStamp: number,
    mapName: string | null,
    mapSize: [ number, number ],
    setGameTime: ( date: Date ) => void,
    setTickTimeStamp: ( timeStamp: number ) => void,
    setMap: ( map: MapType ) => void
}

export const useGameStore = create< GameStoreType >( ( set ) => ( {
  gameTime: new Date( Date.UTC( 30000, 0, 1, 6, 0, 0 ) ),
  tickTimeStamp: 0,
  mapName: null,
  mapSize: [ 100, 100 ],
  setGameTime: ( date: Date ) => { 
    set( { gameTime: new Date( date ) } ) 
  },
  setTickTimeStamp: ( timeStamp: number ) => {
    set( { tickTimeStamp: timeStamp } )
  },
  setMap: ( map: MapType ) => set( { mapName: map.name, mapSize: map.size } )
} ) )


export function setTick( payload: TickPayload ) {
  useGameStore.getState().setGameTime( payload.gameTime ) 
  useGameStore.getState().setTickTimeStamp( payload.tickTimeStamp )
}

export function setMap( payload: ResponseMapDefinitionsPayloadType ) {
  useGameStore.getState().setMap( payload.map )
}

export function setEnvironment( payload: ResponseEnviromentPayloadType ) {
  console.log('date: ' , payload.gameTime )
  console.log('lastTick: ' , payload.tickTimeStamp )
  useGameStore.getState().setGameTime( payload.gameTime  )
  useGameStore.getState().setTickTimeStamp( payload.tickTimeStamp )
}