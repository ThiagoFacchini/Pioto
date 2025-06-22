import { create } from 'zustand'

export const useWebSocketStore = create( ( set ) => ( {
  isConnected: false,
  setConnected: ( connected ) => set( { isConnected: connected } )
} ) )