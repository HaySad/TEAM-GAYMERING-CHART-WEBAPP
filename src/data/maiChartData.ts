export interface DifficultyLevel {
  level: string;
  levelValue: number;
  levelType: 'Re:MASTER' | 'MASTER' | 'EXPERT' | 'ADVANCED' | 'BASIC';
}

export interface Song {
  id: string;
  name: string;
  difficulties: DifficultyLevel[];
  image: string;
  downloadUrl: string;
  chartDesigner: string;
  artist: string;
  requirements?: {
    description: string;
    conditions: string[];
    isLocked: boolean;
  };
}

// id: "1",
// name: "Daytime EP",
// difficulties: [
//   {
//     level: "14+",
//     levelValue: 14.9,
//     levelType: "Re:MASTER"
//   },
//   {
//     level: "13.5",
//     levelValue: 13.5,
//     levelType: "MASTER"
//   },
//   {
//     level: "12.0",
//     levelValue: 12.0,
//     levelType: "EXPERT"
//   }
// ],
// image: "/songs/all/daytime/bg.jpg",
// downloadUrl: "https://drive.google.com/uc?export=download&id=1cfPeNNBG69UpLGVqpgLb-hpjkfm6yVLE",
// chartDesigner: "H&S",
// artist: "Seatrus",
// },

export const maiChartData: Song[] = [
  {
    id: "1",
    name: "Daytime EP",
    difficulties: [
      {
        level: "14+",
        levelValue: 14.9,
        levelType: "MASTER"
      },
    ],
    image: "/songs/all/daytime/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1cfPeNNBG69UpLGVqpgLb-hpjkfm6yVLE",
    chartDesigner: "H&S",
    artist: "Seatrus",
  },
  {
    id: "2",
    name: "メクルメ",
    difficulties: [
      {
        level: "14",
        levelValue: 14.4,
        levelType: "Re:MASTER"
      }
    ],
    image: "/songs/all/mekuru/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1TbL6UV0L1KOhwH1DJsUrEloVERNKFc4w",
    chartDesigner: "Happy VS H&S VS 8bit ft. The doop",
    artist: "初星学園"
  },
  {
    id: "3",
    name: "DiSANiMATE",
    difficulties: [
      {
        level: "15+",
        levelValue: 15.6,
        levelType: "Re:MASTER"
      },
      {
        level: "15",
        levelValue: 15.1,
        levelType: "MASTER"
      }

    ],
    image: "/songs/all/DiSANiMATE/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1SREIp3OaxcZC6QVOdisIF2XUxen9elea",
    chartDesigner: "Happy & Sad",
    artist: "Seatrus"
  },
  {
    id: "4",
    name: "刹那の誓い",
    difficulties: [
      {
        level: "13+",
        levelValue: 13.8,
        levelType: "MASTER"
      }
    ],
    image: "/songs/all/chikai/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1l1s9u742XDG5nl43stQ2wCIqXqwI79iQ",
    chartDesigner: "Happy And Sad!!",
    artist: "ネコハッカー feat.由崎司"
  },
  {
    id: "5",
    name: "STIGMA",
    difficulties: [
      {
        level: "14",
        levelValue: 14.1,
        levelType: "MASTER"
      }
    ],
    image: "/songs/all/stigma/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1oNP12jv0SbJ7IxsP589XplYGvKDUsvRl",
    chartDesigner: "HaySad Vs S0Time",
    artist: "U-ske feat. 棗いつき"
  },
  {
    id: "6",
    name: "SUPERNOVA",
    difficulties: [
      {
        level: "14+",
        levelValue: 14.9,
        levelType: "MASTER"
      }
    ],
    image: "/songs/all/supernova/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1_mkivuAdyWRfaZsV4xTzj0YYVqC1Ynz6",
    chartDesigner: "8 bit",
    artist: "Kyotsugyon"
  },
  {
    id: "7",
    name: "Aether Crest: Celestial",
    difficulties: [
      {
        level: "14+",
        levelValue: 14.8,
        levelType: "MASTER"
      }
    ],
    image: "/songs/all/aether/bg.png",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1UGZATTON26LO3xF7dQuo_iGyw4u--RpQ",
    chartDesigner: "HaySad vs Levelast [ChuniMai]",
    artist: "void (Mournfinale) x 水野健治"
  },
  {
    id: "8",
    name: "Designant.",
    difficulties: [
      {
        level: "15",
        levelValue: 15.3,
        levelType: "MASTER"
      }
    ],
    image: "/songs/all/designant/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1R7un6B-RTF_VdIlar3AwyoOZCZIyyKM_",
    chartDesigner: "Happy To THE GoD VS LevelMAX",
    artist: "Designant."
  },
  {
    id: "9",
    name: "EXXTRA JUDGEMENT",
    difficulties: [
      {
        level: "14+",
        levelValue: 14.8,
        levelType: "MASTER"
      }
    ],
    image: "/songs/all/extra/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1tKdMcXKzu05L4-TGqEKf-FDKRiMeZpoj",
    chartDesigner: "Happy&Sad",
    artist: "seatrus"
  },
  {
    id: "10",
    name: "Inverted World",
    difficulties: [
      {
        level: "14+",
        levelValue: 14.8,
        levelType: "MASTER"
      }
    ],
    image: "/songs/all/inverted/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1iThGdfHu6aEaKO4gyykKWjR26I8H4jOt",
    chartDesigner: "1V MELT",
    artist: "ARForest"
  },
  {
    id: "11",
    name: "MEGALOVANIA (Camellia Remix)",
    difficulties: [
      {
        level: "15",
        levelValue: 15.0,
        levelType: "MASTER"
      }
    ],
    image: "/songs/all/megalovania/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1igC1s2f3kjNTwCwx9tr8-LeR1OSjOLYI",
    chartDesigner: "P4P1N002 Vs Levelast",
    artist: "Toby Fox (Remixed by Camellia)"
  },
  {
    id: "12",
    name: "KOCMOC UNLEASHED",
    difficulties: [
      {
        level: "16.0",
        levelValue: 16.0,
        levelType: "MASTER"
      }
    ],
    image: "/songs/all/kocmoc-unleashed/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1xuELQh3erQF5M1Sd-IgUCaUAeGkmo2JV",
    chartDesigner: "Levelast the NULL",
    artist: "G2961 (SLEEPING HUMMINGBIRD - LONDON REMIX)"
  },
  {
    id: "13",
    name: "The Daybreak Will Never Come Again.",
    difficulties: [
      {
        level: "??",
        levelValue: 0,
        levelType: "MASTER"
      }
    ],
    image: "/songs/all/daybreak/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1jKLe2wUEwYBVZh2S4eWixMAvN4SnrVde",
    chartDesigner: "HaySad VS ???",
    artist: "seatrus",
    requirements: {
      description: "Boss Song Requirements:",
      conditions: [
        "Find the Daybreak Before The End of Daytime",
        "Clear Discord Compilation IV more than 5 times or Play Discord Compilation IV all tire",
      ],
      isLocked: true
    }
  },
  {
    id: "14",
    name: "Moonlight Sonata 3rd Movement (Cut Ver.)",
    difficulties: [
      {
        level: "14+",
        levelValue: 14.7,
        levelType: "MASTER"
      }
    ],
    image: "/songs/all/moonlight-sonata/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1cfPeNNBG69UpLGVqpgLb-hpjkfm6yVLE",
    chartDesigner: "Beamthoven",
    artist: "Beethoven"
  },
  {
    id: "15",
    name: "SuddeNDeath",
    difficulties: [
      {
        level: "15",
        levelValue: 15.0,
        levelType: "MASTER"
      }
    ],
    image: "/songs/all/sudden-death/bg.jpg",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1jKLe2wUEwYBVZh2S4eWixMAvN4SnrVde",
    chartDesigner: "HaySad",
    artist: "xi vs. モリモリあつし",
  },
    

  // เพิ่มเพลงอื่นๆ ตามต้องการ
]; 