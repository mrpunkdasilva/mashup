import { ChunkedAudio } from '@/hooks/use-chunked-audio';

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  isChunked?: boolean;
  chunks?: string[];
}

export const playlist: Song[] = [
  {
    id: "1",
    title: "Shiruzen",
    artist: "Nome do Artista",
    url: "/sounds/sound.mp3", // Kept for backward compatibility
    isChunked: true,
    chunks: [
      "/sounds/chunks/sound_000.mp3",
      "/sounds/chunks/sound_001.mp3",
      "/sounds/chunks/sound_002.mp3",
      "/sounds/chunks/sound_003.mp3"
    ]
  }
  // Você pode adicionar mais músicas aqui
]

export const getChunkedAudio = (song: Song): ChunkedAudio => {
  return {
    title: song.title,
    artist: song.artist,
    chunks: song.chunks || [song.url]
  };
}