import { updateConnectionId, updateAuthentication, updateCharacterSelected  } from './../stores/WebsocketStore'
import { setPlayer, setPlayerList } from './../stores/PlayersStore'

import { ResponseType } from './../../../shared/messageTypes.js'


const responseHandler = {
  RES_CONNECTION_ID: updateConnectionId,
  RES_CHARACTER_SELECT: updateCharacterSelected,
  RES_PLAYERLIST_GET: setPlayerList,
  RES_PLAYER_GET: setPlayer,
  RES_CHARACTER_LIST: updateAuthentication
}



export function routeMessage( response: ResponseType ) {

  // @ts-ignore - Not sure how to workaround this Typescript error
  const handler = responseHandler[ response.header ]
  
  handler ( response.payload )
}