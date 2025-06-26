import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import './websocket/WsClient'

import UIHeader from './components/UI/UIHeader/UIHeader'
import Home from './views/home/Home'
import Map from './views/map/Map'
import NotFound from './views/notFound/NotFound'

function App() {
  return (
    <>
    <UIHeader />
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="/map" element={ <Map/> } />
        <Route path="*" element={ <NotFound/> } />
      </Routes>
    </>
  )
}

export default App


