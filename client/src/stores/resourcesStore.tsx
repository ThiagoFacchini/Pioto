import { create } from 'zustand'
import { Resource } from './../../../shared/resourcesType'

type ResourcesStoreType = {
  resources: Array< Resource >,
  areResourcesLoaded: boolean,
  updateResources: ( serverResources: Array<Resource> ) => void,
  setAreResourcesLoaded: ( isLoaded: boolean ) => void
}


export const useResourcesStore = create< ResourcesStoreType >( ( set ) => ( {
  resources: [],
  areResourcesLoaded: false,
  updateResources: ( serverResources: Array<Resource> ) => set( { resources: serverResources } ),
  setAreResourcesLoaded: ( isLoaded: boolean ) => set( { areResourcesLoaded: isLoaded } )
}))