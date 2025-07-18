import { create } from 'zustand'

type CameraTypes = 1 | 2

type DebugStoreType = {
    showCollisions: boolean,
    showRenderBox: boolean,
    showGrid: boolean,
    showAxis: boolean,
    showClimaticZones: boolean,
    fps: number,
    latency: number,
    position: [ number, number, number ],
    cameraType: CameraTypes,
    setShowCollisions: ( shouldShow: boolean ) => void,
    setShowRenderBox: ( shouldShow: boolean ) => void,
    setShowGrid: ( shouldShow: boolean ) => void,
    setShowAxis: ( shouldShow: boolean ) => void,
    setShowClimaticZones: ( shouldShow: boolean ) => void,
    setFps: ( fps: number ) => void,
    setLatency: ( latency: number ) => void,
    setPosition: ( position: [ number, number, number ] ) => void,
    setCameraType: ( camera: CameraTypes ) => void
}

export const useDebugStore = create<DebugStoreType> ( ( set ) => ( {
    showCollisions: false,
    showRenderBox: false,
    showGrid: false,
    showAxis: false,
    showClimaticZones: false,
    fps: 0,
    latency: 0,
    position: [ 0, 0, 0 ],
    cameraType: 1,
    setShowCollisions: ( shouldShow: boolean ) => set( { showCollisions: shouldShow }),
    setShowRenderBox: ( shouldShow: boolean ) => set( { showRenderBox: shouldShow } ),
    setShowGrid: ( shouldShow: boolean) => set( { showGrid: shouldShow } ),
    setShowAxis: ( shouldShow: boolean) => set( { showAxis: shouldShow } ),
    setShowClimaticZones: ( shouldShow: boolean ) => set( { showClimaticZones: shouldShow } ),
    setFps: ( fps: number ) => set( { fps: fps } ),
    setLatency: ( latency: number ) => set( { latency: latency } ),
    setPosition: ( position: [ number, number, number ] ) => set( { position: position } ),
    setCameraType: ( camera: CameraTypes ) => set( { cameraType: camera } )
} ) )


export function updateLatency( latency: number ) {
    useDebugStore.getState().setLatency( latency )
}