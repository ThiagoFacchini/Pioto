import { create } from 'zustand'

import { GameTime } from 'shared/messageTypes'
import { MapType } from 'shared/mapType'
import { ResponseMapDefinitionsPayloadType, ResponseEnviromentPayloadType } from 'shared/messageTypes'

type GameStoreType = {
    date: Date,
    mapName: string | null,
    mapSize: [ number, number ],
    setDate: ( gameTime: GameTime ) => void,
    setMap: ( map: MapType ) => void
}

export const useGameStore = create< GameStoreType >( ( set ) => ( {
  date: new Date(Date.UTC(30000, 0, 1, 6, 0, 0)),
  mapName: null,
  mapSize: [ 100, 100 ],
  setDate: ( gameTime: GameTime) => { 
    set( { date: new Date( gameTime.date ) } ) 
  },
  setMap: ( map: MapType ) => set( { mapName: map.name, mapSize: map.size } )
} ) )


export function setGameTime( gameTime: GameTime ) {
  useGameStore.getState().setDate( gameTime ) 
}

export function setMap( payload: ResponseMapDefinitionsPayloadType ) {
  useGameStore.getState().setMap( payload.map )
}

export function setEnvironment( payload: ResponseEnviromentPayloadType ) {
  console.log('res environment ' , payload )
  useGameStore.getState().setDate ( { date: payload.environment.date } )
}