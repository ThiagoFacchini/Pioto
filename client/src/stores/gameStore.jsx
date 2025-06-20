import { create } from 'zustand'

export const useGameStore = create((set) => ({
  health: 100,
  gold: 0,
  takeDamage: (amount) => set((state) => ({ health: state.health - amount })),
  earnGold: (amount) => set((state) => ({ gold: state.gold + amount })),
}))