import { create } from 'zustand'
import { TickPayload } from './../../../shared/messageTypes'

type TimeStoreType = {
    simMinute: number,
    simTime: string,
    timestamp: number,
    updateTick: ( payload: TickPayload ) => void
}

export const useTimeStore = create<TimeStoreType>((set) => ({
  simTime: '00:00',
  simMinute: 0,
  timestamp: 0,
  updateTick: ( payload: TickPayload ) => {
    const { simTime, simMinute, timestamp } = payload
    set({ simTime, simMinute, timestamp })
  },
}))