// モンスターの状態。
// ★保存するのは「最後にごはんをあげた時刻」だけ。
//   空腹・ダウン・いまの満腹度は、そこから毎回計算して出す。
//   状態そのものを保存すると、時計とずれたときに表示が矛盾するため。

import type { Item, Mood, MonsterState, SaveV1, Stage } from '../types';
import { HATCHABLE, type CharKey } from './chars';

export const DAY = 86_400_000;
export const HUNGRY_DAYS = 3;
export const DOWN_DAYS = 5;
export const DECAY_PER_DAY = 20;
export const HATCH_FEEDS = 3;

const STAGE_EXP: { stage: Stage; exp: number }[] = [
  { stage: 'adult', exp: 180 },
  { stage: 'teen', exp: 60 },
  { stage: 'baby', exp: 0 },
];

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** 最後のごはんからの経過日数。時計が巻き戻されていたら 0 扱いにして、隠れた罰を作らない */
export function elapsedDays(lastFedAt: number, now = Date.now()): number {
  if (!lastFedAt) return 0; // まだ一度もあげていない＝たまご。腐らない
  const d = (now - lastFedAt) / DAY;
  return d > 0 ? d : 0;
}

/** いまの満腹度（表示用）。1日ごとに DECAY_PER_DAY ずつ減る */
export function displayFullness(m: MonsterState, now = Date.now()): number {
  const lost = Math.floor(elapsedDays(m.lastFedAt, now)) * DECAY_PER_DAY;
  return clamp(m.fullness - lost, 0, 100);
}

export function mood(m: MonsterState, now = Date.now()): Mood {
  if (m.stage === 'egg') return 'egg';
  const d = elapsedDays(m.lastFedAt, now);
  if (d >= DOWN_DAYS) return 'down';
  if (d >= HUNGRY_DAYS) return 'hungry';
  return 'happy';
}

export function moodLine(m: MonsterState, name: string, now = Date.now()): string {
  switch (mood(m, now)) {
    case 'egg':
      return `ごはんを ${Math.max(0, HATCH_FEEDS - m.hatchFeeds)}かい あげると うまれそう…`;
    case 'down':
      return `${name}の げんきが ないよ… ごはんを あげて！`;
    case 'hungry':
      return `${name}は おなかが すいたみたい`;
    default:
      return `${name}は ごきげん！`;
  }
}

export function stageOf(exp: number): Stage {
  return STAGE_EXP.find((s) => exp >= s.exp)?.stage ?? 'baby';
}

/** chars.js は Lv4以上で★、Lv6以上でオーラを描くので、レベルはそのまま見た目に出る */
export function levelOf(exp: number): number {
  return clamp(1 + Math.floor(exp / 40), 1, 8);
}

/** 孵化するキャラは createdAt から決定的に選ぶ（書き込みに失敗しても引き直しが起きないように） */
export function pickCharKey(createdAt: number): CharKey {
  const i = Math.abs(Math.floor(createdAt)) % HATCHABLE.length;
  return HATCHABLE[i];
}

export interface FeedOutcome {
  monster: MonsterState;
  hatched: boolean;
  leveledUp: boolean;
}

/** ごはん／おやつをあげる。ダウンからでも1回で元気になる（子ども向けなので罰を重くしない） */
export function feed(save: SaveV1, item: Item, now = Date.now()): FeedOutcome {
  const m = save.monster;
  const before = levelOf(m.exp);

  // 時計が未来にぶっ飛んでいる値は壊れているとみなし、ここで now に丸めて自己修復させる
  const lastFedAt = m.lastFedAt > now + DAY ? now : m.lastFedAt;

  const fullness = clamp(displayFullness({ ...m, lastFedAt }, now) + (item.fullness ?? 0), 0, 100);
  const exp = m.exp + (item.exp ?? 0);
  const hatchFeeds = m.hatchFeeds + 1;

  const wasEgg = m.stage === 'egg';
  const hatched = wasEgg && hatchFeeds >= HATCH_FEEDS;

  const next: MonsterState = {
    ...m,
    fullness,
    lastFedAt: now,
    hatchFeeds,
    exp: wasEgg && !hatched ? 0 : exp,
    stage: wasEgg ? (hatched ? 'baby' : 'egg') : stageOf(exp),
    charKey: hatched ? pickCharKey(save.createdAt) : m.charKey,
  };

  return { monster: next, hatched, leveledUp: !wasEgg && levelOf(next.exp) > before };
}
