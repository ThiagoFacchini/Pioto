import { create } from 'zustand'

import type { PlayerType } from '../../../shared/playerType'
import type { ResponsePlayerGetPayloadType, ResponsePlayerListGetPayloadType } from '../../../shared/messageTypes'


type PlayerStoreType = {
    player: PlayerType | null,
    playerList: PlayerType[] | null,
    setPlayer: ( player: PlayerType ) => void,
    setPlayerList: ( players: PlayerType[] ) => void,
    clearStore: () => void
}


export const usePlayersStore = create<PlayerStoreType>( ( set ) => ( {
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
} ) )


export function setPlayer( payload: ResponsePlayerGetPayloadType ) {
    console.log( "Updating Player..." )
    usePlayersStore.getState().setPlayer( payload.player )
}

export function setPlayerList( payload: ResponsePlayerListGetPayloadType ) {
    console.log( 'Updating Playerlist...' )
    usePlayersStore.getState().setPlayerList( payload.playerList )
}