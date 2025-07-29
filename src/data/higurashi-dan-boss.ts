export interface Song {
  id: string;
  name: string;
  level: number;
  image: string;
  artist: string;
  chartDesigner: string;
  downloadUrl: string;
}

export const higurashiDanBossSongs: Song[] = [
  {
    id: 'boss-1',
    name: 'Lament Rain',
    level: 0,
    image: 'public/songs/all/lament-rain/bg.jpg',
    artist: 'Ashrount vs. 打打だいず',
    chartDesigner: '??????? Vs ???',
    downloadUrl: 'https://example.com/boss-song.mp3',
  },
]; 