import { create } from 'zustand'

export const useTimeStore = create((set) => ({
  simTime: '00:00',
  simMinute: 0,
  updateTick: ({ simTime, simMinute }) => set({ simTime, simMinute }),
}))