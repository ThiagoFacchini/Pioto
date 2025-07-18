import { create } from 'zustand'
import isEqual from 'lodash/isEqual'

import type { PlayerType } from '../../../shared/playerType'
import type { ResponsePlayerListGetPayloadType, ClimaticZonesType } from '../../../shared/messageTypes'


type PlayerDataType = {
    currentTemperature: number
    currentClimaticZone: ClimaticZonesType
}

type PlayerStoreType = {
    playerData: PlayerDataType
    playerList: PlayerType[] | null,
    setPlayerList: ( players: PlayerType[] ) => void,
    setPlayerData: ( playerData: PlayerDataType ) => void
    clearStore: () => void
}

// @ts-ignore
export const usePlayersStore = create<PlayerStoreType>( ( set ) => ( {
    playerData: {
        currentTemperature: 0,
        currentClimaticZone: 'TROPICAL'
    },
    playerList: null,
    setPlayerList: ( players ) => set( { playerList: players }),
    setPlayerData: ( playerData: PlayerDataType ) => {
        console.log( 'playerData ', playerData )
        set( { playerData: playerData } )
    },
    clearStore: () => {
        set({ playerList: null })
    }
} ) )


// TO be removed
export function getPlayerByConnectionId ( connectionId: string ): PlayerType | null {
    const list = usePlayersStore.getState().playerList
    if ( !list ) return null
    return list.find( player => player.connectionId === connectionId ) || null
}


export function updatePlayerByConnectionId( connectionId: string, updatedPlayer: Partial<PlayerType> ): void {
    const list = usePlayersStore.getState().playerList

    if ( !list ) return

    const updatedList = list.map( player => player.connectionId === connectionId ? { ...player, ...updatedPlayer } : player )

    usePlayersStore.getState().setPlayerList( updatedList )
}


export function setPlayerList( payload: ResponsePlayerListGetPayloadType ) {
    const currentList = usePlayersStore.getState().playerList
    const newList = payload.playerList

    if ( !isEqual( currentList, newList ) ) {
        usePlayersStore.getState().setPlayerList( newList )
        // console.log( "Playerlist updated." )
    } else {
        // console.log( "Playerlist update avoided.")
    }
}