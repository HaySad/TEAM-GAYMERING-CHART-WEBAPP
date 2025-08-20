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
    name: 'ひぐらしのなく頃に Fukisokusei Entropy (TV_SIZE)',
    level: 13.7,
    image: '/songs/higurashi/Fukisokusei Entropy/bg.jpg',
    artist: 'Ayane',
    chartDesigner: 'Oyashiro Sama (Lev)',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1FUYWjhTbp6AY79EnleBgIYjx4f2XQ2i7',
  },
  {
    id: 'dan2-2',
    name: 'ひぐらしのなく頃に /  I believe what you said (TV_SIZE)',
    level: 14,
    image: '/songs/higurashi/I believe what you said/bg.jpg',
    artist: 'ASAKA',
    chartDesigner: 'Oyashiro Sama (Lev)',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1fiYEqFC2jJP0W9q9BRxd9D7bpFd9yGL3',
  },
  {
    id: 'dan2-3',
    name: 'ひぐらしのなく頃に Kamisama no Syndrome (TV_SIZE)',
    level: 13,
    image: '/songs/higurashi/Kamisama no Syndrome/bg.jpg',
    artist: 'Ayane',
    chartDesigner: 'Oyashiro Sama (Lev)',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1_eUwzsTzlR-N6WqzPcj4-jWv8GCXPjUI',
  },
  {
    id: 'dan2-4',
    name: 'ひぐらしのなく頃に Missing Promise (TV_SIZE)',
    level: 13.7,
    image: '/songs/higurashi/Missing Promise/bg.jpg',
    artist: 'Konomi Suzuki',
    chartDesigner: 'Oyashiro Sama (Lev)',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1uY8mwlJ6hyrfnBl8RIHeJMoDLU8xfPKg',
  },
]; 