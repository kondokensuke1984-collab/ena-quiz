// もみじの あずまや：🍵ひとやすみ／🍁おちばあつめ／💬かいぎ／📮おちゃと おてがみ。
// 1日の かいすうは いつも「きょう」の分だけ（日が かわると 0 にもどる）。メダルは ふやさない。

import type { SaveV1 } from '../types';

export interface Leaf {
  id: string;
  name: string;
  emoji: string;
  rare?: boolean;
  fact: string;   // ひろったときの ひとこと（理科の ちしき）
}

export const LEAVES: Leaf[] = [
  { id: 'maple',   name: 'もみじ',            emoji: '🍁', fact: 'さむくなると、はっぱに あかい いろ（アントシアニン）が つくられて まっかに なるよ' },
  { id: 'ginkgo',  name: 'いちょう',          emoji: '🍂', fact: 'みどりが きえて、もともと あった きいろい いろ（カロテノイド）が めだつんだ' },
  { id: 'acorn',   name: 'どんぐり',          emoji: '🌰', fact: 'ブナの なかまの き（コナラや クヌギ）の「み」だよ' },
  { id: 'pine',    name: 'まつぼっくり',      emoji: '🌲', fact: 'かわくと かさが ひらいて、たねを かぜで とばすよ' },
  { id: 'sakura',  name: 'さくらの はっぱ',   emoji: '🍃', fact: 'さくらも あきには あかや きいろに いろづくんだ' },
  { id: 'gold',    name: 'きんいろの もみじ', emoji: '✨', rare: true, fact: 'ひかりに あたって きらきら！ めったに みつからない おたからだよ' },
];

export const LEAF_BY_ID: Record<string, Leaf> = Object.fromEntries(LEAVES.map((x) => [x.id, x]));

const GOLD_RATE = 0.08;

/** おちばを 1まい ひろう（きんいろは ひくい かくりつ） */
export function rollLeaf(rand = Math.random): Leaf {
  if (rand() < GOLD_RATE) return LEAF_BY_ID.gold;
  const common = LEAVES.filter((x) => !x.rare);
  return common[Math.floor(rand() * common.length)];
}

/** ずかんの ごほうび */
export const ARBOR_REWARDS: { kinds: number; item: string }[] = [
  { kinds: 3, item: 'fn_leafpile' },
  { kinds: 6, item: 'fn_teaset' },
];

export const GATHER_PER_DAY = 5;
export const TALK_PER_DAY = 3;

export interface ArborToday { gathered: number; rested: boolean; tea: boolean; talked: number }

/** きょうの かいすう（きょうの 記録でなければ ぜんぶ 0） */
export function arborToday(a: SaveV1['arbor'], day: string): ArborToday {
  return a.day === day
    ? { gathered: a.gathered, rested: a.rested, tea: a.tea, talked: a.talked }
    : { gathered: 0, rested: false, tea: false, talked: 0 };
}

/** 夜の あずまや（つきみの じかん） */
export const isNight = (d = new Date()) => d.getHours() >= 18 || d.getHours() < 5;

export const REST_LINES = {
  studied: ['きょうは がんばったね。ベンチで ゆっくり やすもう', 'もみじを みながら ひとやすみ。あたまも すっきり！', 'いっぱい かんがえたから、ちからを ためる じかんだよ'],
  plain: ['ベンチに すわって ふかこきゅう。もみじが ひらひら おちてくる', 'ひとやすみも だいじな べんきょうの うち', 'かぜが きもちいい。ちょっと のんびりしよう'],
};

/** おちゃの じかんに とどく おてがみ */
export function teaLetter(playerName: string, friendName: string, catLabel: string, studied: boolean, night: boolean): { title: string; body: string } {
  const to = playerName ? `${playerName}へ\n` : '';
  const mid = studied
    ? `きょうも ${catLabel}を がんばったね！\nおちゃを のんで ゆっくり やすんでね。`
    : `${catLabel}の おはなしも また しようね。\nきょうは おちゃを のんで ひとやすみ。`;
  const end = night ? 'よるの あずまやは ほんのり あったかくて、おつきさまが きれいだったよ。' : 'あずまやで みた もみじが、とっても きれいだったよ。';
  return { title: '🍵 あずまやの おちゃかい', body: `${to}${friendName}だよ。\n${mid}\n${end}\n\n${friendName}より` };
}
