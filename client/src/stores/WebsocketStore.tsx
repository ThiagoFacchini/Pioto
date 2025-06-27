import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { ResponseConnectionIdPayloadType, ResponseCharacterListPayloadType } from './../../../shared/messageTypes'
import { isOrthographicCamera } from '@react-three/fiber/dist/declarations/src/core/utils'


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

// @ts-ignore
export const useWebSocketStore = create<WebSocketStore>( devtools ( ( set ) => ( {
  isConnected: false,
  isAuthenticated: false,
  isCharacterSelected: false,
  connectionId: null,
  username: null,
  charactersList: [],
  setConnected: ( connected ) => set( { isConnected: connected } ),
  setAuthenticated: ( authenticated ) => set( { isAuthenticated: authenticated } ),
  setCharacterSelected: ( selected ) => set({ isCharacterSelected: selected } ),
  setConnectionId: ( cid ) => set( { connectionId: cid }),
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
} ), { name: 'WebsocketStore' }  ) )

 

export function updateConnectionId( payload: ResponseConnectionIdPayloadType ) {
  console.log( "Updating CID..." )
  useWebSocketStore.getState().setConnectionId( payload.cid )
}


export function updateCharacterSelected() {
  useWebSocketStore.getState().setCharacterSelected( true )
}


export function updateAuthentication( payload: ResponseCharacterListPayloadType ) {
  console.log( "Updating Authentication..." )
  useWebSocketStore.getState().setAuthenticated( true )
  useWebSocketStore.getState().setUserName( payload.username )
  useWebSocketStore.getState().setCharactersList( payload.charactersList )
}
