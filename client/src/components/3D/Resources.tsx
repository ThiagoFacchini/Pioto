import { useEffect } from 'react'
import { useResourcesStore  } from "../../stores/ResourcesStore"

import { sendRequest } from "../../websocket/WsClient"
import Rock from '../../resources/Rock'


export default function Resources() {
    const resources = useResourcesStore( ( state ) => state.resources )

     // Load resources
     useEffect( () => {
         if ( resources == null ) {
             sendRequest( {
                 header: 'REQ_MAP_RESOURCES_GET',
                 payload: null
             })
         }
     }, [ resources ] )

     if ( !resources ) return null

    return resources
        .filter(( resource ) => resource.type === 'rock' )
        .map( ( resource ) => {
            return (
                <Rock
                    key={ resource.id }
                    resource={ resource }
                />
            )
        })
}