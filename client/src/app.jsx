import { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { connectWebSocket } from './websocket/wsClient.jsx'

import Home from './views/home/home.jsx'
import Map from './views/map/map.jsx'
import NotFound from './views/notFound/notFound.jsx'

function App() {
  useEffect( () => {
    connectWebSocket()
  }, [] )

  return (
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="/map" element={ <Map/> } />
      <Route path="*" element={ <NotFound/> } />
    </Routes>
  )
}

export default App

// import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// import { useGameStore } from './stores/gameStore'
// import { useTimeStore } from './stores/timeStore'

// function App() {
//   const [count, setCount] = useState(0)
//   const health = useGameStore( ( state ) => state.health )
//   const gold = useGameStore( ( state ) => state.gold )
//   const time = useTimeStore( ( state ) => state.simTime )

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <div>
//         Health: { health } | Gold: { gold }
//         <br/>
//         Time: { time }
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }


