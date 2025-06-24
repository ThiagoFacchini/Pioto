import { create } from 'zustand'

type SelectionStoreType = {
    selectedResourceId: number | null,
    selectResource: ( id: number ) => void,
    clearSelection: () => void 
}

export const useSelectionStore = create<SelectionStoreType> ( ( set ) => ( {
    selectedResourceId: null,
    selectResource: ( id: number ) => set( { selectedResourceId: id } ),
    clearSelection: () => set({ selectedResourceId: null } )
} ) )