import { create } from 'zustand'

type BuildStoreType = {
    selectedResourceId: string | null,
    selectResource: ( id: string ) => void,
    clearSelection: () => void 
}

export const useBuildStore = create<BuildStoreType> ( ( set ) => ( {
    selectedResourceId: null,
    selectResource: ( id ) => set( { selectedResourceId: id } ),
    clearSelection: () => set({ selectedResourceId: null } )
} ) )