import { create } from 'zustand'

type BuildStoreType = {
    selectedResourceId: number | null,
    selectResource: ( id: number ) => void,
    clearSelection: () => void 
}

export const useBuildStore = create<BuildStoreType> ( ( set ) => ( {
    selectedResourceId: null,
    selectResource: ( id: number ) => set( { selectedResourceId: id } ),
    clearSelection: () => set({ selectedResourceId: null } )
} ) )