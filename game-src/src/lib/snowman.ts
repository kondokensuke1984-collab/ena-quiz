// ゆきの こや（bd_kotatsu）：⛄ゆきだるまづくり／📘ずかん。
// なかまが「こんな ゆきだるまが ほしい」と なぞなぞで いうので、ぼうし・はな・マフラー・うで を 1つずつ えらんで つくる。
// 4つ ぜんぶ あうと「ぴったり」で ずかんに のる。1日の かいすうは いつも「きょう」の分だけ。メダルは ふやさない・もちものも へらさない。

import type { SaveV1 } from '../types';

export type PartKind = 'hat' | 'nose' | 'scarf' | 'arms';

export interface Part {
  id: string;
  name: string;
  emoji: string;
  clue: string;   // なぞなぞの ことば（なかまが いう）
}

export const PART_KINDS: { kind: PartKind; label: string; emoji: string }[] = [
  { kind: 'hat', label: 'ぼうし', emoji: '🎩' },
  { kind: 'nose', label: 'はな', emoji: '👃' },
  { kind: 'scarf', label: 'マフラー', emoji: '🧣' },
  { kind: 'arms', label: 'うで', emoji: '🙌' },
];

export const PARTS: Record<PartKind, Part[]> = {
  hat: [
    { id: 'bucket', name: 'バケツ', emoji: '🪣', clue: 'みずを くむ いれもの' },
    { id: 'knit', name: 'ニットぼう', emoji: '🧶', clue: 'けいとで あんだ あったかい もの' },
    { id: 'silk', name: 'シルクハット', emoji: '🎩', clue: 'しんしが かぶる くろくて たかい もの' },
    { id: 'santa', name: 'サンタぼうし', emoji: '🎅', clue: 'サンタさんと おなじ あかい もの' },
    { id: 'crown', name: 'おうかん', emoji: '👑', clue: 'おうさまが かぶる キラキラの もの' },
  ],
  nose: [
    { id: 'carrot', name: 'にんじん', emoji: '🥕', clue: 'オレンジいろの やさい' },
    { id: 'button', name: 'ボタン', emoji: '🔘', clue: 'ふくに ついてる まるい もの' },
    { id: 'pine', name: 'まつぼっくり', emoji: '🌰', clue: 'もりで ひろえる きの み' },
    { id: 'cherry', name: 'さくらんぼ', emoji: '🍒', clue: 'あかくて ちいさい くだもの' },
  ],
  scarf: [
    { id: 'red', name: 'あかい マフラー', emoji: '🟥', clue: 'りんごと おなじ いろ' },
    { id: 'blue', name: 'あおい マフラー', emoji: '🟦', clue: 'そらと おなじ いろ' },
    { id: 'green', name: 'みどりの マフラー', emoji: '🟩', clue: 'はっぱと おなじ いろ' },
    { id: 'stripe', name: 'しましまの マフラー', emoji: '🦓', clue: 'シマウマみたいな もよう' },
  ],
  arms: [
    { id: 'branch', name: 'きの えだ', emoji: '🌿', clue: 'きから おちた ほそい もの' },
    { id: 'glove', name: 'てぶくろ', emoji: '🧤', clue: 'てを あたためる もの' },
    { id: 'broom', name: 'ほうき', emoji: '🧹', clue: 'ゆかを はく どうぐ' },
    { id: 'flag', name: 'はた', emoji: '🚩', clue: 'うんどうかいで ふる もの' },
  ],
};

export const PART_BY_ID: Record<PartKind, Record<string, Part>> = {
  hat: Object.fromEntries(PARTS.hat.map((p) => [p.id, p])),
  nose: Object.fromEntries(PARTS.nose.map((p) => [p.id, p])),
  scarf: Object.fromEntries(PARTS.scarf.map((p) => [p.id, p])),
  arms: Object.fromEntries(PARTS.arms.map((p) => [p.id, p])),
};

export type Build = Record<PartKind, string>;

export interface Snowman {
  id: string;
  name: string;
  emoji: string;
  build: Build;
  wish: string;   // なかまの ひとこと（さいしょ）
}

export const SNOWMEN: Snowman[] = [
  { id: 'classic', name: 'いつもの ゆきだるま', emoji: '⛄', build: { hat: 'bucket', nose: 'carrot', scarf: 'red', arms: 'branch' }, wish: 'えほんに でてくるような ゆきだるまが いいな' },
  { id: 'santa', name: 'サンタだるま', emoji: '🎅', build: { hat: 'santa', nose: 'carrot', scarf: 'red', arms: 'glove' }, wish: 'クリスマスに ぴったりの ゆきだるまが ほしい！' },
  { id: 'mori', name: 'もりの ゆきだるま', emoji: '🌲', build: { hat: 'knit', nose: 'pine', scarf: 'green', arms: 'branch' }, wish: 'もりに すんでいそうな ゆきだるまを つくって' },
  { id: 'shinshi', name: 'しんしだるま', emoji: '🎩', build: { hat: 'silk', nose: 'button', scarf: 'blue', arms: 'glove' }, wish: 'きちんとした しんしの ゆきだるまが みたいな' },
  { id: 'king', name: 'おうさまだるま', emoji: '👑', build: { hat: 'crown', nose: 'cherry', scarf: 'red', arms: 'flag' }, wish: 'えらそうな おうさまの ゆきだるまが いい！' },
  { id: 'souji', name: 'おそうじだるま', emoji: '🧹', build: { hat: 'bucket', nose: 'button', scarf: 'stripe', arms: 'broom' }, wish: 'おそうじが とくいな ゆきだるまを つくって' },
  { id: 'undokai', name: 'おうえんだるま', emoji: '🚩', build: { hat: 'knit', nose: 'cherry', scarf: 'blue', arms: 'flag' }, wish: 'みんなを おうえんする ゆきだるまが ほしいな' },
  { id: 'oshare', name: 'おしゃれだるま', emoji: '💃', build: { hat: 'silk', nose: 'cherry', scarf: 'stripe', arms: 'glove' }, wish: 'まちで いちばん おしゃれな ゆきだるまに して！' },
];

export const SNOWMAN_BY_ID: Record<string, Snowman> = Object.fromEntries(SNOWMEN.map((s) => [s.id, s]));

/** ずかんの ごほうび */
export const SNOW_REWARDS: { kinds: number; item: string }[] = [
  { kinds: 4, item: 'fn_snowfamily' },
  { kinds: 8, item: 'fn_kamakura' },
];

export const SNOW_PER_DAY = 3;

/** きょうの かいすう（きょうの 記録でなければ 0） */
export function snowToday(x: SaveV1['snow'], day: string): { made: number } {
  return x.day === day ? { made: x.made } : { made: 0 };
}

const shuffle = <T,>(list: T[], rand = Math.random): T[] => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export interface SnowRound { want: Snowman; choices: Record<PartKind, Part[]> }

/** 1かいぶん：つくる ゆきだるま（まだ ずかんに ない ものを えらばれやすく）と、ぶひんごとの 3つの こうほ */
export function makeSnowRound(dex: string[], rand = Math.random): SnowRound {
  const fresh = SNOWMEN.filter((s) => !dex.includes(s.id));
  const pool = fresh.length && rand() < 0.7 ? fresh : SNOWMEN;
  const want = pool[Math.floor(rand() * pool.length)];
  const choices = {} as Record<PartKind, Part[]>;
  for (const { kind } of PART_KINDS) {
    const right = PART_BY_ID[kind][want.build[kind]];
    const others = shuffle(PARTS[kind].filter((p) => p.id !== right.id), rand).slice(0, 2);
    choices[kind] = shuffle([right, ...others], rand);
  }
  return { want, choices };
}

/** なかまの なぞなぞ（ぶひんごと 1ぎょう） */
export function clueLines(s: Snowman): { kind: PartKind; label: string; text: string }[] {
  return PART_KINDS.map(({ kind, label }) => ({ kind, label, text: PART_BY_ID[kind][s.build[kind]].clue }));
}

export const SNOW_THANKS = {
  hit: ['わあ、おもった とおりの ゆきだるま！ ありがとう！', 'ぴったり！ なぞなぞ、ぜんぶ とけたね', 'かわいい！ ずっと とけないで ほしいな'],
  miss: ['ありがとう！ ちょっと ちがうけど、これも すてき', 'うれしいな。つぎは {want} に チャレンジしてね'],
};
