export interface Song {
  id: string;
  name: string;
  level: number;
  image: string;
  artist: string;
  chartDesigner: string;
  downloadUrl: string;
}

export const higurashiDan2Songs: Song[] = [
  {
    id: 'dan2-1',
    name: 'Higurashi Dan2 Song 1',
    level: 13.7,
    image: '/public/songs/all/supernova/bg.jpg',
    artist: 'Artist D',
    chartDesigner: 'Designer W',
    downloadUrl: 'https://example.com/song4.mp3',
  },
  {
    id: 'dan2-2',
    name: 'Higurashi Dan2 Song 2',
    level: 14.0,
    image: '/public/songs/all/stigma/bg.jpg',
    artist: 'Artist E',
    chartDesigner: 'Designer V',
    downloadUrl: 'https://example.com/song5.mp3',
  },
  {
    id: 'dan2-3',
    name: 'Higurashi Dan2 Song 3',
    level: 14.2,
    image: '/public/songs/all/heinous/bg.jpg',
    artist: 'Artist F',
    chartDesigner: 'Designer U',
    downloadUrl: 'https://example.com/song6.mp3',
  },
]; 