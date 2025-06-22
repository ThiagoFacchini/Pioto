import { create } from 'zustand'

export const useSelectionStore = create( ( set ) => ( {
    selectedResourceId: null,
    selectResource: ( id ) => set( { selectedResourceId: id } ),
    clearSelection: () => set({ selectedResourceId: null } )
} ) )