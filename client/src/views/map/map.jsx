import { useTimeStore } from "../../stores/timeStore"

import Scene from "./scene"

function Map() {
    const time = useTimeStore( ( state ) => state.simTime )

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