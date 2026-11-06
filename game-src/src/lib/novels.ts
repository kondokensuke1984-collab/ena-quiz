import { WAGO11 } from './novels/wago11';

// としょかんの「よみもの」：よむと ことばが おぼえられる 小説。あたらしい 本は NOVELS に 1さつ たすだけ（絵は components/novel/NovelArt.tsx）。
// 本文の かきかた：{灯台|とうだい}＝ふりがな、[[またたく]]＝タップで 意味が でる 語、[[とがめる|とがめた]]＝語の もとの形｜本文での 形。
// 1つの 文字列が 1だんらく。'@art:id' の 行は イラスト。

export interface NovelQuiz { q: string; options: string[]; answer: number; why: string }
export interface NovelEpisode { title: string; paras: string[]; words: string[]; quiz: NovelQuiz[] }
export interface Novel {
  id: string;
  title: string;
  emoji: string;
  color: string;
  cover: string;      // イラストの id
  about: string;      // もくじの せつめい
  words: Record<string, string>;  // 語 → 意味
  episodes: NovelEpisode[];
}

export const NOVELS: Novel[] = [WAGO11];

/** ふりがなの しるしを はずした 文（おてがみ用） */
export function novelPlainTitle(n: Novel): string {
  return n.title.replace(/\{([^|{}]+)\|[^{}]+\}/g, '$1');
}

export type NovelPiece =
  | { t: 'text'; s: string }
  | { t: 'ruby'; s: string; r: string }
  | { t: 'word'; word: string; body: NovelPiece[] };

function parseRuby(src: string): NovelPiece[] {
  const out: NovelPiece[] = [];
  const re = /\{([^|{}]+)\|([^{}]+)\}/g;
  let at = 0;
  for (let m = re.exec(src); m; m = re.exec(src)) {
    if (m.index > at) out.push({ t: 'text', s: src.slice(at, m.index) });
    out.push({ t: 'ruby', s: m[1], r: m[2] });
    at = m.index + m[0].length;
  }
  if (at < src.length) out.push({ t: 'text', s: src.slice(at) });
  return out;
}

/** 本文の 1だんらくを ふりがな・語に わける */
export function parseNovelText(src: string): NovelPiece[] {
  const out: NovelPiece[] = [];
  const re = /\[\[([^\]|]+)(?:\|((?:[^\]])+))?\]\]/g;
  let at = 0;
  for (let m = re.exec(src); m; m = re.exec(src)) {
    if (m.index > at) out.push(...parseRuby(src.slice(at, m.index)));
    out.push({ t: 'word', word: m[1], body: parseRuby(m[2] ?? m[1]) });
    at = m.index + m[0].length;
  }
  if (at < src.length) out.push(...parseRuby(src.slice(at)));
  return out;
}
