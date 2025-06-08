import { useState, useEffect, useRef } from 'react';

export interface ChunkedAudio {
  chunks: string[];
  title: string;
  artist: string;
}

interface UseChunkedAudioProps {
  audio: ChunkedAudio;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
}

export const useChunkedAudio = ({ 
  audio, 
  volume, 
  isMuted, 
  isPlaying 
}: UseChunkedAudioProps) => {
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize audio element
  useEffect(() => {
    if (!audio.chunks.length) return;
    
    audioRef.current = new Audio(audio.chunks[currentChunkIndex]);
    audioRef.current.volume = isMuted ? 0 : volume;
    
    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      if (isPlaying) {
        audioRef.current?.play();
      }
    };
    
    audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
    
    return () => {
      audioRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough);
      audioRef.current?.pause();
      audioRef.current = null;
      setIsLoaded(false);
    };
  }, [audio.chunks, currentChunkIndex]);

  // Handle volume and mute changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;
    
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isLoaded]);

  // Handle chunk transitions
  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleEnded = () => {
      // Move to the next chunk
      if (currentChunkIndex < audio.chunks.length - 1) {
        setCurrentChunkIndex(prevIndex => prevIndex + 1);
      } else {
        // We've reached the end of all chunks
        // You might want to implement a callback for this
        console.log("End of audio reached");
      }
    };
    
    audioRef.current.addEventListener('ended', handleEnded);
    return () => audioRef.current?.removeEventListener('ended', handleEnded);
  }, [currentChunkIndex, audio.chunks.length]);

  const seek = (time: number) => {
    if (!audioRef.current) return;
    
    // Calculate which chunk this time belongs to
    // This assumes all chunks except possibly the last one are the same length
    if (audioRef.current.duration) {
      const chunkDuration = audioRef.current.duration;
      const targetChunk = Math.floor(time / chunkDuration);
      
      if (targetChunk !== currentChunkIndex && targetChunk < audio.chunks.length) {
        setCurrentChunkIndex(targetChunk);
        
        // Set the time within the new chunk
        const timeWithinChunk = time % chunkDuration;
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = timeWithinChunk;
          }
        }, 100); // Small delay to ensure the new audio is loaded
      } else {
        // Seek within the current chunk
        audioRef.current.currentTime = time % chunkDuration;
      }
    }
  };

  const getCurrentTime = () => {
    if (!audioRef.current) return 0;
    
    // Calculate the total time including previous chunks
    const previousChunksDuration = currentChunkIndex * (audioRef.current.duration || 0);
    return previousChunksDuration + (audioRef.current.currentTime || 0);
  };

  const getTotalDuration = () => {
    if (!audioRef.current || !audioRef.current.duration) return 0;
    
    // Estimate total duration based on current chunk's duration
    // This assumes all chunks except possibly the last one are the same length
    return (audio.chunks.length - 1) * audioRef.current.duration + audioRef.current.duration;
  };

  return {
    isLoaded,
    currentChunkIndex,
    seek,
    getCurrentTime,
    getTotalDuration
  };
};