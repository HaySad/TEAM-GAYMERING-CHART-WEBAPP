export interface Song {
  id: string;
  name: string;
  level: number;
  image: string;
  artist: string;
  chartDesigner: string;
  downloadUrl: string;
}

export const higurashiDan1Songs: Song[] = [
  {
    id: 'dan1-1',
    name: 'Higurashi First Song',
    level: 12.5,
    image: '/public/songs/all/extra/bg.jpg',
    artist: 'Artist A',
    chartDesigner: 'Designer X',
    downloadUrl: "https://drive.google.com/uc?export=download&id=13bN_MPZGjzZq-dO0OblLoZlYTipMwhJf",
  },
  {
    id: 'dan1-2',
    name: 'Higurashi Second Song',
    level: 13.0,
    image: '/public/songs/all/heinous/bg.jpg',
    artist: 'Artist B',
    chartDesigner: 'Designer Y',
    downloadUrl: 'https://example.com/song2.mp3',
  },
  {
    id: 'dan1-3',
    name: 'Higurashi Third Song',
    level: 13.5,
    image: '/public/songs/all/arcahv/bg.jpg',
    artist: 'Artist C',
    chartDesigner: 'Designer Z',
    downloadUrl: 'https://example.com/song3.mp3',
  },
]; 