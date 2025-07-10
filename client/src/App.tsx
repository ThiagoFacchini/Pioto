import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import './websocket/WsClient'

import UIHeader from './components/UI/UIHeader/UIHeader'
import Login from './views/login/Login'
import CharacterSelection from './views/characterSelection/CharacterSelection'
import Map from './views/map/Map'
import Sandbox from './views/sandbox/Sandbox'
import NotFound from './views/notFound/NotFound'

function App() {
  return (
    <>
    <UIHeader />
      <Routes>
        <Route path="/" element={ <Login/> } />
        <Route path="/characterSelection" element={ <CharacterSelection /> } />
        <Route path="/map" element={ <Map/> } />
        <Route path="/sandbox" element={ <Sandbox /> } />
        <Route path="*" element={ <NotFound/> } />
      </Routes>
    </>
  )
}

export default App


