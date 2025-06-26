import { create } from 'zustand'

import { ResponseConnectionIdPayloadType } from './../../../shared/messageTypes'

type WebSocketStore = {
  isConnected: boolean,
  connectionId: string | null,
  setConnected: ( status: boolean ) => void,
  setConnectionId: ( cid: string ) => void
}

export const useWebSocketStore = create<WebSocketStore>( ( set ) => ( {
  isConnected: false,
  connectionId: null,
  setConnected: ( connected ) => set( { isConnected: connected } ),
  setConnectionId: ( cid ) => set( { connectionId: cid })
} ) )

 

export function updateConnectionId( payload: ResponseConnectionIdPayloadType ) {
  console.log( "Updating CID..." )
  useWebSocketStore.getState().setConnectionId( payload.cid )
}