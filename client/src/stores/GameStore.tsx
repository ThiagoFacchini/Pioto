import { create } from 'zustand'

import { GameTime } from 'shared/messageTypes'
import { MapType } from 'shared/mapType'
import { ResponseMapDefinitionsPayloadType } from 'shared/messageTypes'

type GameStoreType = {
    date: Date,
    hoursPassed: number,
    mapName: string | null,
    mapSize: [ number, number ],
    setDate: ( gameTime: GameTime ) => void,
    setMap: ( map: MapType ) => void
}

export const useGameStore = create< GameStoreType >( ( set ) => ( {
  date: new Date('2025-01-01T06:00:00Z'),
  hoursPassed: 0,
  mapName: null,
  mapSize: [ 100, 100 ],
  setDate: ( gameTime: GameTime) => { set({ date: new Date( gameTime.date ), hoursPassed: gameTime.hoursPassed }) },
  setMap: ( map: MapType ) => set( { mapName: map.name, mapSize: map.size } )
} ) )


export function setGameTime( gameTime: GameTime ) {
  useGameStore.getState().setDate( gameTime ) 
}

export function setMap( payload: ResponseMapDefinitionsPayloadType ) {
  useGameStore.getState().setMap( payload.map )
}