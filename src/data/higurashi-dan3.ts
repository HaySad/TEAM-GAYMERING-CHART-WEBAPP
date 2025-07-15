export interface Song {
  id: string;
  name: string;
  level: number;
  image: string;
  artist: string;
  chartDesigner: string;
  downloadUrl: string;
}

export const higurashiDan3Songs: Song[] = [
  {
    id: 'dan3-1',
    name: 'Higurashi Final Song',
    level: 14.5,
    image: '/public/songs/all/extra/bg.jpg',
    artist: 'Artist Z',
    chartDesigner: 'Designer Final',
    downloadUrl: 'https://example.com/song7.mp3',
  },
]; 