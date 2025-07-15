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
    name: 'Higurashi Boss Song',
    level: 15.0,
    image: '/public/songs/all/extra/bg.jpg',
    artist: 'Boss Artist',
    chartDesigner: 'Boss Designer',
    downloadUrl: 'https://example.com/boss-song.mp3',
  },
]; 