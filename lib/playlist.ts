export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export const playlist: Song[] = [
  {
    id: "1",
    title: "Shiruzen",
    artist: "Nome do Artista",
    url: "/sounds/sound.mp3" // O caminho começa com / pois é relativo à pasta public
  }
  // Você pode adicionar mais músicas aqui
]