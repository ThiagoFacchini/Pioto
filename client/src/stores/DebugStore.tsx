import { create } from 'zustand'

type DebugStoreType = {
    showCollisions: boolean,
    fps: number,
    latency: number,
    position: [ number, number, number ],
    setShowCollisions: ( shouldShow: boolean ) => void,
    setFps: ( fps: number ) => void,
    setLatency: ( latency: number ) => void,
    setPosition: ( position: [ number, number, number ] ) => void
}

export const useDebugStore = create<DebugStoreType> ( ( set ) => ( {
    showCollisions: false,
    fps: 0,
    latency: 0,
    position: [ 0, 0, 0 ],
    setShowCollisions: ( shouldShow ) => set( { showCollisions: shouldShow }),
    setFps: ( fps ) => set( { fps: fps } ),
    setLatency: ( latency ) => set( { latency: latency } ),
    setPosition: ( position ) => set( { position: position } )
} ) )


export function updateLatency( latency: number ) {
    useDebugStore.getState().setLatency( latency )
}