import { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import { connectWebSocket } from './websocket/WsClient'

import Home from './views/home/Home'
import Map from './views/map/Map'
import NotFound from './views/notFound/NotFound'

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


