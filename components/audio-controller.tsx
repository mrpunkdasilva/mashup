"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import { playlist, type Song } from '@/lib/playlist'
import { useAudioStore } from '@/hooks/use-audio-store'

interface AudioControllerProps {
  className?: string
}

export default function AudioController({ className }: AudioControllerProps) {
  const audioStore = useAudioStore()
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(playlist[currentSongIndex].url)
    audioRef.current.loop = false
    audioRef.current.volume = audioStore.volume

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [currentSongIndex])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioStore.isMuted ? 0 : audioStore.volume
    }
  }, [audioStore.volume, audioStore.isMuted])

  useEffect(() => {
    if (!audioRef.current) return

    const handleEnded = () => {
      nextSong()
    }

    audioRef.current.addEventListener('ended', handleEnded)
    return () => audioRef.current?.removeEventListener('ended', handleEnded)
  }, [currentSongIndex])

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioStore.isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      audioStore.setPlaying(!audioStore.isPlaying)
    }
  }

  const toggleMute = () => {
    audioStore.setMuted(!audioStore.isMuted)
  }

  const nextSong = () => {
    const newIndex = (currentSongIndex + 1) % playlist.length
    setCurrentSongIndex(newIndex)
    if (audioStore.isPlaying && audioRef.current) {
      audioRef.current.play()
    }
  }

  const previousSong = () => {
    const newIndex = (currentSongIndex - 1 + playlist.length) % playlist.length
    setCurrentSongIndex(newIndex)
    if (audioStore.isPlaying && audioRef.current) {
      audioRef.current.play()
    }
  }

  return (
    <div className={`flex items-center gap-4 bg-black/20 backdrop-blur-sm rounded-lg p-3 ${className}`}>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate">
          {playlist[currentSongIndex].title}
        </p>
        <p className="text-white/60 text-xs truncate">
          {playlist[currentSongIndex].artist}
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