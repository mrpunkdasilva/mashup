export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export const playlist: Song[] = [
  {
    id: "1",
    title: "Happy Birthday Jazz",
    artist: "Free Music",
    url: "https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3"
  },
  {
    id: "2",
    title: "Happy Fun Kids",
    artist: "Free Music",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3"
  },
  {
    id: "3",
    title: "Happy Children",
    artist: "Free Music",
    url: "https://cdn.pixabay.com/download/audio/2021/08/08/audio_88447e769f.mp3"
  }
]