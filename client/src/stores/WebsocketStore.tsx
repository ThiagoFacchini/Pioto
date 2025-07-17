import { create } from 'zustand'

import { ResponseConnectionIdPayloadType, ResponseCharacterListPayloadType } from '../../../shared/messageTypes'

type WebSocketStore = {
    isConnected: boolean,
    isAuthenticated: boolean,
    isCharacterSelected: boolean,
    connectionId: string | null,
    username: string | null,
    charactersList: Array< string >, 
    setConnected: ( status: boolean ) => void,
    setAuthenticated: ( status: boolean ) => void,
    setCharacterSelected: ( status: boolean ) => void,
    setConnectionId: ( cid: string ) => void,
    setUserName: ( username: string ) => void,
    setCharactersList: ( charactersList: Array< string> ) => void,
    clearStore: () => void
}


export const useWebSocketStore = create<WebSocketStore>( ( set ) => ( {
    isConnected: false,
    isAuthenticated: false,
    isCharacterSelected: false,
    connectionId: null,
    username: null,
    charactersList: [],
    setConnected: ( connected ) => set( { isConnected: connected } ),
    setAuthenticated: ( authenticated ) => set( { isAuthenticated: authenticated } ),
    setCharacterSelected: ( selected ) => set({ isCharacterSelected: selected } ),
    setConnectionId: ( connectionId ) => set( { connectionId: connectionId }),
    setUserName: ( username ) => set( { username: username } ),
    setCharactersList: ( charactersList ) => set( { charactersList: charactersList } ),
    clearStore: () => {
        console.log( "Clearing WebsocketStore..." )
        set({
            isConnected: false,
            isAuthenticated: false,
            isCharacterSelected: false,
            connectionId: null,
            username: null,
        })
    }
} ) )

 

export function updateConnectionId( payload: ResponseConnectionIdPayloadType ) {
    console.log( "Updating CID..." )
    useWebSocketStore.getState().setConnectionId( payload.connectionId )
}


export function updateCharacterSelected() {
    useWebSocketStore.getState().setCharacterSelected( true )
}


export function setCharacterList( payload: ResponseCharacterListPayloadType ) {
    console.log( "Updating Authentication..." )
     useWebSocketStore.getState().setAuthenticated( true )
    useWebSocketStore.getState().setUserName( payload.username )
    useWebSocketStore.getState().setCharactersList( payload.charactersList )
}
