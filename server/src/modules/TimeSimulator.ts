import { WebSocketServer } from "ws"

import { TickPayload } from '../../../shared/messageTypes.ts'

import { MessageCreator } from "../classes/MessageCreator.js"

type TimeSimulatorConfigType = {
  simulatedDayLengthMs: number,
  simulatedMinutesPerDay: number

}

const defaultConfig: TimeSimulatorConfigType = {
  simulatedDayLengthMs: 60 * 60 * 1000,
  simulatedMinutesPerDay: 24 * 60,
}


export function startTimeSimulator( wss: WebSocketServer, config: Partial<TimeSimulatorConfigType> = {} ): void {
  const { simulatedDayLengthMs, simulatedMinutesPerDay } = { ...defaultConfig, ...config }

  const tickInterval = simulatedDayLengthMs / simulatedMinutesPerDay
  let currentSimMinute = 0

  console.log(`Simulating 1 day in ${simulatedDayLengthMs / 60000} minutes`)
  console.log(`Broadcasting a tick every ${tickInterval} ms`)

  setInterval(() => {
    currentSimMinute = (currentSimMinute + 1) % simulatedMinutesPerDay

    const hours = Math.floor(currentSimMinute / 60)
    const minutes = currentSimMinute % 60
    const simTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    const payload = {
      simMinute: currentSimMinute,
      simTime,
      timestamp: Date.now(),
    }

    const tickMessage = new MessageCreator<'TICK'>('TICK', payload)

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(tickMessage.toJSON())
      }
    })
  }, tickInterval)
}