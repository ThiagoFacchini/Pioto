import { create } from 'zustand'

import type { KeyboardControlsEntry } from '@react-three/drei'

type ConfigsStoreType = {
    serverAddress: string,
    serverPort: number,
    controls: KeyboardControlsEntry[],
    setServerAddress: ( serverAddress: string ) => void,
    setServerPort: ( serverPort: number ) => void,
    setControls: ( controls: KeyboardControlsEntry[] ) => void
}


export const useConfigsStore = create<ConfigsStoreType>( ( set ) => ( {
    serverAddress: 'localhost',
    serverPort: 8080,
    controls: [
        { name: 'forward', keys: [ 'w' ] },
        { name: 'backward', keys: [ 's' ] },
        { name: 'left', keys: [ 'a' ] },
        { name: 'right', keys: [ 'd' ] },
        { name: 'jump', keys: [ 'space' ] }
    ],
    setServerAddress: ( serverAddress ) => set( { serverAddress: serverAddress } ),
    setServerPort: ( serverPort ) => set( { serverPort: serverPort } ),
    setControls: ( controls ) => set( { controls: controls })
} ) )
