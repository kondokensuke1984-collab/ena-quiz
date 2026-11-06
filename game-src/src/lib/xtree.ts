// クリスマスツリー ひろば（bd_xtree）：🎁プレゼントくばり／🎄かざりつけ（XmasModal）／📘ずかん。
// なかまが ヒントを いうので、サンタの ふくろの 3つから ぴったりの プレゼントを えらんで わたす。
// 1日の かいすうは いつも「きょう」の分だけ。メダルは ふやさない・もちものも へらさない。

import type { SaveV1 } from '../types';

export interface Present {
  id: string;
  name: string;
  emoji: string;
  hints: string[];   // なかまが いう ヒント（ぴったりの プレゼントが わかるように）
}

export const PRESENTS: Present[] = [
  { id: 'glove',   name: 'てぶくろ',   emoji: '🧤', hints: ['さむくて 手が つめたいの…', 'ゆきがっせんを したいけど、手が かじかんじゃう'] },
  { id: 'scarf',   name: 'マフラー',   emoji: '🧣', hints: ['くびの まわりが すーすー するんだ', 'かぜが つめたくて、くびを すくめちゃう'] },
  { id: 'book',    name: 'えほん',     emoji: '📚', hints: ['よる ねる まえに、おはなしが よみたいな', 'しらない せかいの ものがたりに であいたい'] },
  { id: 'cake',    name: 'ケーキ',     emoji: '🎂', hints: ['いちごの のった あまい ものが たべたい！', 'クリスマスの おやつと いえば…あれ だよね'] },
  { id: 'sock',    name: 'くつした',   emoji: '🧦', hints: ['あしの ゆびが つめたくて ねむれないよ', 'サンタさんが プレゼントを いれてくれる あれ、もってないの'] },
  { id: 'snowman', name: 'ゆきだるまの にんぎょう', emoji: '⛄', hints: ['ゆきが ふらなくても、ゆきだるまと あそびたい', 'まどべに かざる、しろくて まるい おともだちが ほしい'] },
  { id: 'musicbox', name: 'オルゴール', emoji: '🎶', hints: ['ふたを あけると、きれいな きょくが ながれる ものが ほしいな', 'ねむる まえに やさしい おとを ききたい'] },
  { id: 'star',    name: 'ほしの かざり', emoji: '⭐', hints: ['ツリーの いちばん うえに のせる ものが ないの', 'きらきら ひかる おほしさまを かざりたい'] },
];

export const PRESENT_BY_ID: Record<string, Present> = Object.fromEntries(PRESENTS.map((p) => [p.id, p]));

/** ずかんの ごほうび */
export const XTREE_REWARDS: { kinds: number; item: string }[] = [
  { kinds: 4, item: 'fn_giftpile' },
  { kinds: 8, item: 'fn_snowdome' },
];

export const GIVE_PER_DAY = 3;

/** きょうの かいすう（きょうの 記録でなければ 0） */
export function xtreeToday(x: SaveV1['xtree'], day: string): { given: number } {
  return x.day === day ? { given: x.given } : { given: 0 };
}

const shuffle = <T,>(list: T[], rand = Math.random): T[] => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export interface Round { want: Present; hint: string; choices: Present[] }

/** 1かいぶん：ほしい もの・ヒント・3つの こうほ（まだ ずかんに ない ものを 少し えらばれやすく） */
export function makeRound(dex: string[], rand = Math.random): Round {
  const fresh = PRESENTS.filter((p) => !dex.includes(p.id));
  const pool = fresh.length && rand() < 0.7 ? fresh : PRESENTS;
  const want = pool[Math.floor(rand() * pool.length)];
  const others = shuffle(PRESENTS.filter((p) => p.id !== want.id), rand).slice(0, 2);
  return { want, hint: want.hints[Math.floor(rand() * want.hints.length)], choices: shuffle([want, ...others], rand) };
}

export const THANKS_LINES = {
  day: ['わあ、これ ほしかったんだ！ ありがとう！', 'ぴったり！ どうして わかったの？', 'うれしい！ だいじに するね'],
  night: ['ツリーの ひかりの したで もらえるなんて、ゆめみたい！', 'よるの ひろばで プレゼント…すてきな クリスマスだね'],
  miss: ['ありがとう！ でも ほんとうは {want} が ほしかったんだ', 'うれしいな。こんどは {want} だと もっと うれしいかも'],
};
