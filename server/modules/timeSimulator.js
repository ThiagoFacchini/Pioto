import { MessageCreator } from "../classes/messageCreator"

export function startTimeSimulator(wss, config = {}) {
  const {
    simulatedDayLengthMs = 60 * 60 * 1000,
    simulatedMinutesPerDay = 24 * 60,
  } = config

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

    const tickMessage = new MessageCreator('TICK', payload)

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(tickMessage.toJSON())
      }
    })
  }, tickInterval)
}