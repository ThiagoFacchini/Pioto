import { updateConnectionId, setCharacterList, updateCharacterSelected  } from './../stores/WebsocketStore'
import { pong } from './LatencyCounter'

import { setPlayerList } from '../stores/PlayersStore'
import { setResources } from '../stores/ResourcesStore'
import { setGameTime, setMap, setEnvironment } from '../stores/GameStore'
import { setConfigurations } from '../stores/ConfigsStore'

import { ResponseType, ResponsePayloadMap } from './../../../shared/messageTypes.js'



const responseHandler: { [ K in keyof ResponsePayloadMap ]: ( payload: ResponsePayloadMap[ K ] ) => void } = {
  RES_CONNECTION_ID: updateConnectionId,
  RES_CHARACTER_SELECT: updateCharacterSelected,
  RES_PLAYERLIST_GET: setPlayerList,
  RES_CHARACTER_LIST: setCharacterList,
  RES_PONG: pong,
  RES_MAP_RESOURCES_GET: setResources,
  RES_TICK: setGameTime,
  RES_GAME_CONFIGURATIONS: setConfigurations,
  RES_MAP_DEFINITIONS: setMap,
  RES_ENVIRONMENT: setEnvironment
}



export function routeMessage< K extends keyof ResponsePayloadMap > ( response: { header: K; payload: ResponsePayloadMap[K] } ) {
  const handler = responseHandler[ response.header ]

  try { 
    handler ( response.payload )

  } catch ( e ) {
    console.error( 'Failed to parseRequest ', response.header )
  }
}
