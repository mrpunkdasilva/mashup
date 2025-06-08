"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import { playlist, getChunkedAudio } from '@/lib/playlist'
import { useAudioStore } from '@/hooks/use-audio-store'
import { useChunkedAudio } from '@/hooks/use-chunked-audio'

interface AudioControllerProps {
  className?: string
}

export default function AudioController({ className }: AudioControllerProps) {
  const audioStore = useAudioStore()
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  
  const currentSong = playlist[currentSongIndex]
  const chunkedAudio = getChunkedAudio(currentSong)
  
  const { isLoaded, currentChunkIndex } = useChunkedAudio({
    audio: chunkedAudio,
    volume: audioStore.volume,
    isMuted: audioStore.isMuted,
    isPlaying: audioStore.isPlaying
  })

  const togglePlay = () => {
    if (isLoaded) {
      audioStore.setPlaying(!audioStore.isPlaying)
    }
  }

  const toggleMute = () => {
    audioStore.setMuted(!audioStore.isMuted)
  }

  const nextSong = () => {
    const newIndex = (currentSongIndex + 1) % playlist.length
    setCurrentSongIndex(newIndex)
  }

  const previousSong = () => {
    const newIndex = (currentSongIndex - 1 + playlist.length) % playlist.length
    setCurrentSongIndex(newIndex)
  }

  return (
    <div className={`flex items-center gap-4 bg-black/20 backdrop-blur-sm rounded-lg p-3 ${className}`}>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate">
          {currentSong.title}
          {currentSong.isChunked && ` (Part ${currentChunkIndex + 1}/${chunkedAudio.chunks.length})`}
        </p>
        <p className="text-white/60 text-xs truncate">
          {currentSong.artist}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={previousSong}
          className="w-8 h-8 flex items-center justify-center text-white hover:text-pink-400"
        >
          <SkipBack size={20} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-pink-600 hover:bg-pink-700 rounded-full text-white"
        >
          {audioStore.isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={nextSong}
          className="w-8 h-8 flex items-center justify-center text-white hover:text-pink-400"
        >
          <SkipForward size={20} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleMute}
          className="w-8 h-8 flex items-center justify-center text-white hover:text-pink-400"
        >
          {audioStore.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={audioStore.volume}
          onChange={(e) => audioStore.setVolume(parseFloat(e.target.value))}
          className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>
  )
}