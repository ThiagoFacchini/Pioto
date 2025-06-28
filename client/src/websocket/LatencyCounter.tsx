import { useDebugStore } from '../stores/DebugStore';
import { sendRequest } from './WsClient';

let pingStartTime = 0


export function ping() {
    pingStartTime = performance.now()

    sendRequest( {
        header: 'REQ_PING',
        payload: null
    } )
}


export function pong() {
    const latency: number = performance.now() - pingStartTime
    useDebugStore.getState().setLatency( parseFloat( latency.toFixed( 1 ) ) )
}