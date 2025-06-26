import { updateConnectionId  } from './../stores/WebsocketStore'
import { setPlayer, setPlayerList } from './../stores/PlayersStore'

import { ResponseType } from './../../../shared/messageTypes.js'


const responseHandler = {
  RES_CONNECTION_ID: updateConnectionId,
  RES_PLAYER_GET: setPlayer,
  RES_PLAYERLIST_GET: setPlayerList
}


export function routeMessage( response: ResponseType ) {

  const handler = responseHandler[ response.header ]
  // @ts-ignore - Not sure how to workaround this Typescript error
  handler ( response.payload )
}