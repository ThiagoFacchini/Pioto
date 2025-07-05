import { create } from 'zustand'
import { Resource } from '../../../shared/resourceType'

import { ResponseMapResourcesGetPayloadType } from '../../../shared/messageTypes'

type ResourcesStoreType = {
  resources: Array< Resource> | null,
  areResourcesLoaded: boolean,
  setResources: ( serverResources: Array<Resource> ) => void,
  setAreResourcesLoaded: ( isLoaded: boolean ) => void
}


export const useResourcesStore = create< ResourcesStoreType >( ( set ) => ( {
  resources: null,
  areResourcesLoaded: false,
  setResources: ( serverResources: Array<Resource> ) => set( { resources: serverResources } ),
  setAreResourcesLoaded: ( isLoaded: boolean ) => set( { areResourcesLoaded: isLoaded } )
}))


export function setResources( payload: ResponseMapResourcesGetPayloadType ) {
  useResourcesStore.getState().setResources( payload.resources )
}