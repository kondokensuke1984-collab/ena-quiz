// オルガンで ひける曲。著作権の きれた メロディだけ（歌詞は入れない）。
// すべて ハ長調・白けんだけ（C4〜E5）で ひける形。長い曲は 前半だけ。

export type NoteName = 'C4' | 'D4' | 'E4' | 'F4' | 'G4' | 'A4' | 'B4' | 'C5' | 'D5' | 'E5';
export type AnyNote = NoteName | 'C#4' | 'D#4' | 'F#4' | 'G#4' | 'A#4' | 'C#5' | 'D#5';

export interface Song {
  id: string;
  title: string;
  emoji: string;
  bpm: number;
  notes: [NoteName, number][];   // [音, 拍]
}

const SEMI: Record<string, number> = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };

export function noteFreq(n: AnyNote): number {
  const oct = Number(n.slice(-1));
  const semi = SEMI[n.slice(0, -1)] + (oct - 4) * 12 - 9;   // A4 からの半音
  return 440 * Math.pow(2, semi / 12);
}

/** けんばん（左から）。白けん10＋黒けん7 */
export const WHITE_KEYS: { n: NoteName; label: string }[] = [
  { n: 'C4', label: 'ド' }, { n: 'D4', label: 'レ' }, { n: 'E4', label: 'ミ' }, { n: 'F4', label: 'ファ' }, { n: 'G4', label: 'ソ' },
  { n: 'A4', label: 'ラ' }, { n: 'B4', label: 'シ' }, { n: 'C5', label: 'ド' }, { n: 'D5', label: 'レ' }, { n: 'E5', label: 'ミ' },
];
/** 黒けん：after＝この白けん（番号）の 右がわ */
export const BLACK_KEYS: { n: AnyNote; after: number }[] = [
  { n: 'C#4', after: 0 }, { n: 'D#4', after: 1 }, { n: 'F#4', after: 3 }, { n: 'G#4', after: 4 },
  { n: 'A#4', after: 5 }, { n: 'C#5', after: 7 }, { n: 'D#5', after: 8 },
];

const s = (str: string): [NoteName, number][] =>
  str.trim().split(/\s+/).map((t) => {
    const [n, b] = t.split(':');
    return [n as NoteName, b ? Number(b) : 1];
  });

export const SONGS: Song[] = [
  {
    id: 'twinkle', title: 'きらきらぼし', emoji: '⭐', bpm: 104,
    notes: s('C4 C4 G4 G4 A4 A4 G4:2 F4 F4 E4 E4 D4 D4 C4:2 G4 G4 F4 F4 E4 E4 D4:2 G4 G4 F4 F4 E4 E4 D4:2'),
  },
  {
    id: 'frog', title: 'かえるの がっしょう', emoji: '🐸', bpm: 112,
    notes: s('C4 D4 E4 F4 E4 D4 C4:2 E4 F4 G4 A4 G4 F4 E4:2 C4:2 C4:2 C4:2 C4:2'),
  },
  {
    id: 'mary', title: 'メリーさんの ひつじ', emoji: '🐑', bpm: 116,
    notes: s('E4 D4 C4 D4 E4 E4 E4:2 D4 D4 D4:2 E4 G4 G4:2 E4 D4 C4 D4 E4 E4 E4 E4 D4 D4 E4 D4 C4:3'),
  },
  {
    id: 'london', title: 'ロンドンばし', emoji: '🌉', bpm: 112,
    notes: s('G4:1.5 A4:0.5 G4 F4 E4 F4 G4:2 D4 E4 F4:2 E4 F4 G4:2 G4:1.5 A4:0.5 G4 F4 E4 F4 G4:2 D4:2 G4 E4 C4:2'),
  },
  {
    id: 'butterfly', title: 'ちょうちょう', emoji: '🦋', bpm: 116,
    notes: s('G4 E4 E4:2 F4 D4 D4:2 C4 D4 E4 F4 G4 G4 G4:2 G4 E4 E4 E4 F4 D4 D4 D4 C4 E4 G4 G4 E4 E4 E4:2'),
  },
  {
    id: 'bell', title: 'かねが なる', emoji: '🔔', bpm: 120,
    notes: s('C4 D4 E4 C4 C4 D4 E4 C4 E4 F4 G4:2 E4 F4 G4:2 G4:0.5 A4:0.5 G4:0.5 F4:0.5 E4 C4 G4:0.5 A4:0.5 G4:0.5 F4:0.5 E4 C4'),
  },
  {
    id: 'joy', title: 'よろこびの うた', emoji: '🎉', bpm: 120,
    notes: s('E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4:1.5 D4:0.5 D4:2 E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4:1.5 C4:0.5 C4:2'),
  },
];

export const ORGAN_TITLE = 'オルガン めいじん';
