import { create } from 'zustand'

export const useResourcesStore = create((set) => ({
  resources: [],
  areResourcesLoaded: false,
  updateResources: ( serverResources ) => set( { resources: serverResources } ),
  setAreResourcesLoaded: ( isLoaded ) => set( { areResourcesLoaded: isLoaded } )
}))