import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import isEqual from 'lodash/isEqual'

import type { PlayerType } from '../../../shared/playerType'
import type { ResponsePlayerListGetPayloadType } from '../../../shared/messageTypes'


type PlayerStoreType = {
    playerList: PlayerType[] | null,
    setPlayerList: ( players: PlayerType[] ) => void,
    clearStore: () => void
}

// @ts-ignore
export const usePlayersStore = create<PlayerStoreType>( devtools( ( set ) => ( {
    // player: null,
    playerList: null,
    // setPlayer: ( player ) => set( { player: player } ),
    setPlayerList: ( players ) => set( { playerList: players }),
    clearStore: () => {
        console.log( "Clearing PlayersStore..." )
        set({
            playerList: null
        })
    }
} ), { name: 'PlayerStore' } ) )


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