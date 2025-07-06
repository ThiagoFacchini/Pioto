import { create } from 'zustand'
import type { KeyboardControlsEntry } from '@react-three/drei'

import { ResponseGameConfigurationsPayloadType } from 'shared/messageTypes'

type ConfigsStoreType = {
    serverAddress: string,
    serverPort: number,
    controls: KeyboardControlsEntry[],
    realMillisecondsPerHour: number,
    setServerAddress: ( serverAddress: string ) => void,
    setServerPort: ( serverPort: number ) => void,
    setControls: ( controls: KeyboardControlsEntry[] ) => void
    setRealMillisecondsPerHour: ( millisecondsPerHour: number ) => void
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
    realMillisecondsPerHour: 0,
    setServerAddress: ( serverAddress ) => set( { serverAddress: serverAddress } ),
    setServerPort: ( serverPort ) => set( { serverPort: serverPort } ),
    setControls: ( controls ) => set( { controls: controls }),
    setRealMillisecondsPerHour: ( millisecondsPerHour ) => set( { realMillisecondsPerHour: millisecondsPerHour } )
} ) )


export function setConfigurations ( payload: ResponseGameConfigurationsPayloadType ) {
    useConfigsStore.getState().setRealMillisecondsPerHour( payload.configurations.realMillisecondsPerHour )
}
