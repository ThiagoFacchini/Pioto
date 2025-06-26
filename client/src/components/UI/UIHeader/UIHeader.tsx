import { useWireframeUniforms } from '@react-three/drei/materials/WireframeMaterial'
import { useWebSocketStore } from '../../../stores/WebsocketStore'

import classNames from 'classnames'

// @ts-ignore
import styles from './styles.module.css'
// @ts-ignore
import uiStyles from './../styles.module.css'



export default function UIHeader () {
    const isConnected = useWebSocketStore( ( state ) => state.isConnected )
    const connectionId = useWebSocketStore( ( state ) => state.connectionId )


    function getConnectionStatus () {
        if ( isConnected ) {
            return (
                <div className={ styles.connected } />
            )
        } 

        return (
            <div className={ styles.disconnected } />
        )
    }


    function getConnectionId () {
        if ( connectionId !== null ) {
            return (
                <div className={ classNames( [ uiStyles.label, uiStyles.xs ] ) } >
                    ({ connectionId })
                </div>
            )
        }

        return null
    }


    return (
        <div className={ styles.uiheaderContainer } >
            <div className={ styles.connectionContainer } >
                { getConnectionStatus() }
                { getConnectionId() }
            </div>
        </div>
    )
}