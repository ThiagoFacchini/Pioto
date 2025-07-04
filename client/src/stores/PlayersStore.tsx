import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import isEqual from 'lodash/isEqual'

import type { PlayerType } from '../../../shared/playerType'
import type { ResponsePlayerGetPayloadType, ResponsePlayerListGetPayloadType, ResponseCharacterSelectPayloadType } from '../../../shared/messageTypes'


type PlayerStoreType = {
    player: PlayerType | null,
    playerList: PlayerType[] | null,
    setPlayer: ( player: PlayerType ) => void,
    setPlayerList: ( players: PlayerType[] ) => void,
    clearStore: () => void
}

// @ts-ignore
export const usePlayersStore = create<PlayerStoreType>( devtools( ( set ) => ( {
    player: null,
    playerList: null,
    setPlayer: ( player ) => set( { player: player } ),
    setPlayerList: ( players ) => set( { playerList: players }),
    clearStore: () => {
        console.log( "Clearing PlayersStore..." )
        set({
            player: null,
            playerList: null
        })
    }
} ), { name: 'PlayerStore' } ) )


export function setPlayer( payload: ResponsePlayerGetPayloadType ) {
    usePlayersStore.getState().setPlayer( payload.player )
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