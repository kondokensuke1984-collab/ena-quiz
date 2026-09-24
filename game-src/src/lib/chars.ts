// 既存の /js/chars.js（22体のキャラSVG描画関数）を、React から使うための橋渡し。
//
// なぜ index.html に <script src="/js/chars.js"> と静的に書かないか：
// Vite はエントリHTMLの src 属性を publicDir 基準で解決しようとするが、
// chars.js は Vite ルートの外（リポジトリ直下の js/）にあるのでビルドが落ちる。
// 実行時に <script> を挿せばHTML処理を素通りでき、サイト上の chars.js は1個のまま保てる。

export type CharKey =
  | 'luna' | 'kabu' | 'tanuki' | 'parrot' | 'owl' | 'neko' | 'penguin'
  | 'sheep' | 'frog' | 'snail' | 'duck' | 'squirrel' | 'turtle' | 'fox'
  | 'dolphin' | 'elephant' | 'hedgehog' | 'panda' | 'hamster' | 'rabbit' | 'bear'
  | 'cow';

export interface CharOpts {
  silhouette?: boolean;
  stars?: number;
}

/** chars.js の render*SVG。SVG文字列を返す */
export type CharRenderer = (level: number, fillPct: number, size: number, opts?: CharOpts) => string;

export type CharMap = Partial<Record<CharKey, CharRenderer>>;

declare global {
  interface Window {
    CHARS?: CharMap;
  }
}

/** モンスターとして孵化しうるキャラ。ルナとカブたろうはクイズ側の主役なので除く。
 *  ミミ（rabbit）は島に「教科キャラ」として住んでいるので、重複しないよう入れない */
export const HATCHABLE: CharKey[] = [
  'tanuki', 'parrot', 'owl', 'neko', 'penguin', 'sheep', 'frog', 'snail',
  'duck', 'squirrel', 'turtle', 'fox', 'dolphin', 'elephant', 'hedgehog', 'panda', 'hamster',
];

export const CHAR_NAMES: Record<CharKey, string> = {
  luna: 'ルナ', kabu: 'カブたろう', tanuki: 'ぽんた', parrot: 'ピコ', owl: 'ホウ',
  neko: 'ミケ', penguin: 'ペンタ', sheep: 'メイ', frog: 'ケロ', snail: 'マイマイ',
  duck: 'アヒ', squirrel: 'リスまる', turtle: 'カメきち', fox: 'コンタ', dolphin: 'ドルル',
  elephant: 'ゾウまる', hedgehog: 'ハリー', panda: 'パンコ', hamster: 'ハムタ', rabbit: 'ミミ', bear: 'ツキミ',
  cow: 'モモ',
};

const SCRIPT_URL = '/js/chars.js';
const TIMEOUT_MS = 8000;

let cached: Promise<CharMap> | null = null;

export function loadChars(): Promise<CharMap> {
  if (cached) return cached;

  cached = new Promise<CharMap>((resolve, reject) => {
    if (window.CHARS) return resolve(window.CHARS);

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_URL}"]`);
    const el = existing ?? document.createElement('script');

    const timer = window.setTimeout(() => reject(new Error('chars.js timeout')), TIMEOUT_MS);
    const done = () => {
      window.clearTimeout(timer);
      if (window.CHARS) resolve(window.CHARS);
      else reject(new Error('chars.js loaded but window.CHARS is missing'));
    };

    el.addEventListener('load', done, { once: true });
    el.addEventListener('error', () => {
      window.clearTimeout(timer);
      reject(new Error('chars.js failed to load'));
    }, { once: true });

    if (!existing) {
      el.src = SCRIPT_URL;
      el.async = true;
      document.head.appendChild(el);
    }
  }).catch((err) => {
    // 失敗を握りつぶして空マップを返す。呼び出し側はたまごの絵にフォールバックする。
    console.warn('[anrino-island]', err);
    return {} as CharMap;
  });

  return cached;
}
