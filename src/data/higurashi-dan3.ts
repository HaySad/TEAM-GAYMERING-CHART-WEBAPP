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
    name: 'Analogy',
    level: 14.7,
    image: '/songs/higurashi/Analogy/bg.jpg',
    artist: 'Ayane',
    chartDesigner: 'Rika vs Satoko',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1FUYWjhTbp6AY79EnleBgIYjx4f2XQ2i7',
  },
]; 