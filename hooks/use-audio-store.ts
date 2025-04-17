import { create } from 'zustand'

interface AudioStore {
  isPlaying: boolean
  volume: number
  isMuted: boolean
  setPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
}

export const useAudioStore = create<AudioStore>((set) => ({
  isPlaying: false,
  volume: 0.5,
  isMuted: false,
  setPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setMuted: (muted) => set({ isMuted: muted }),
}))