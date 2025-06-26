import { create } from 'zustand'

import type { KeyboardControlsEntry } from '@react-three/drei'

type ControlsStoreType = {
    controls: KeyboardControlsEntry[],
    setControls: ( controls: KeyboardControlsEntry[] ) => void
}


export const useControlsStore = create<ControlsStoreType>( ( set ) => ( {
  controls: [
    { name: 'forward', keys: [ 'w' ] },
    { name: 'backward', keys: [ 's' ] },
    { name: 'left', keys: [ 'a' ] },
    { name: 'right', keys: [ 'd' ] },
    { name: 'jump', keys: [ 'space' ] }
  ],
  setControls: ( controls ) => set( { controls: controls })
} ) )
