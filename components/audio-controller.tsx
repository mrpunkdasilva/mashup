"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'

interface AudioControllerProps {
  className?: string
}

export default function AudioController({ className }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/party-music.mp3') // Certifique-se de adicionar esta música na pasta public
    audioRef.current.loop = true
    audioRef.current.volume = volume

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className={`flex items-center gap-4 bg-black/20 backdrop-blur-sm rounded-lg p-3 ${className}`}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center bg-pink-600 hover:bg-pink-700 rounded-full text-white"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleMute}
        className="w-8 h-8 flex items-center justify-center text-white hover:text-pink-400"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  )
}