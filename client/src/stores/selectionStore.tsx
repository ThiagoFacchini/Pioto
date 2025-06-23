import { create } from 'zustand'

export const useSelectionStore = create( ( set ) => ( {
    selectedResourceId: null,
    selectResource: ( id: number ) => set( { selectedResourceId: id } ),
    clearSelection: () => set({ selectedResourceId: null } )
} ) )