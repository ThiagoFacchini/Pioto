import { useEffect } from "react"
import { sendRequest } from "../../websocket/WsClient"

import { useWebSocketStore } from "../../stores/WebsocketStore"
import { useTimeStore } from "../../stores/timeStore"
import { useResourcesStore } from "../../stores/resourcesStore"

import Scene from "./scene"

function Map() {
    const time = useTimeStore( ( state ) => state.simTime )
    const areResourcesLoaded = useResourcesStore( ( state ) => state.areResourcesLoaded )
    const isConnected = useWebSocketStore( ( state ) => state.isConnected )

    useEffect( () => {
        if ( isConnected && areResourcesLoaded === false ) {
            sendRequest( { messageType: 'RESOURCES_REQUEST' } )
        }
    }, [ isConnected, areResourcesLoaded ])

    

    return (
        <>
            {/* <div> Map </div>
            <div> Time: { time } </div> */}
            <div style={{ width: '100vw', height: '100vh' }}>
                <Scene />
            </div>
        </>
    )
}

export default Map