// ミニバトル。React も localStorage も触らない純粋な関数だけ。
// 乱数は BattleState の中にシードとして持つので、毎ターンが (state, command) の純関数になる。

import type { SaveV1 } from '../types';
import { HATCHABLE, CHAR_NAMES, type CharKey } from './chars';
import { ITEM_BY_ID } from './items';
import { levelOf } from './monster';

export type Command = 'shoot' | 'guard' | 'slash';
export type EnemyMove = 'attack' | 'charge' | 'rest';

export interface BattleState {
  enemy: { key: CharKey; name: string; hp: number; maxHp: number; next: EnemyMove; charged: boolean };
  playerHp: number;
  playerMaxHp: number;
  guard: number;   // このターンの軽減率（0..0.95）
  turn: number;
  log: string[];
  phase: 'input' | 'win' | 'lose';
  seed: number;
}

const ENEMY_HP = 30;
const LOG_LIMIT = 6;

function nextSeed(seed: number): number {
  return (Math.imul(seed, 1664525) + 1013904223) >>> 0;
}

/** 0..1 の乱数と、次のシードを返す */
function rand(seed: number): [number, number] {
  const s = nextSeed(seed);
  return [s / 4294967296, s];
}

function randInt(seed: number, lo: number, hi: number): [number, number] {
  const [r, s] = rand(seed);
  return [lo + Math.floor(r * (hi - lo + 1)), s];
}

export const COMMAND_LABEL: Record<Command, string> = {
  shoot: '🔫 うつ',
  guard: '🛡️ まもる',
  slash: '⚔️ きりさく',
};

export const ENEMY_MOVE_LABEL: Record<EnemyMove, string> = {
  attack: '⚡ こうげきしてきそう',
  charge: '💢 ちからを ためている',
  rest: '💤 ゆだんしている',
};

export function playerMaxHp(save: SaveV1): number {
  return 40 + (levelOf(save.monster.exp) - 1) * 5;
}

export function gunOf(save: SaveV1) {
  const id = save.equipped.weapon;
  return id ? ITEM_BY_ID[id] : undefined;
}

export function shieldOf(save: SaveV1) {
  const id = save.equipped.shield;
  return id ? ITEM_BY_ID[id] : undefined;
}

export function startBattle(save: SaveV1, seed = Date.now()): BattleState {
  const [i, s1] = randInt(seed >>> 0, 0, HATCHABLE.length - 1);
  const [m, s2] = randInt(s1, 0, 2);
  const key = HATCHABLE[i];
  const maxHp = playerMaxHp(save);

  return {
    enemy: {
      key,
      name: `かげの ${CHAR_NAMES[key]}`,
      hp: ENEMY_HP,
      maxHp: ENEMY_HP,
      next: (['attack', 'charge', 'rest'] as EnemyMove[])[m],
      charged: false,
    },
    playerHp: maxHp,
    playerMaxHp: maxHp,
    guard: 0,
    turn: 1,
    log: ['かげモンスターが あらわれた！'],
    phase: 'input',
    seed: s2,
  };
}

function push(log: string[], line: string): string[] {
  return [...log, line].slice(-LOG_LIMIT);
}

export function step(b: BattleState, cmd: Command, save: SaveV1): BattleState {
  if (b.phase !== 'input') return b;

  let seed = b.seed;
  let log = b.log;
  let enemyHp = b.enemy.hp;
  let playerHp = b.playerHp;
  let guard = 0;

  // ── プレイヤーの手番 ──
  if (cmd === 'shoot') {
    const gun = gunOf(save);
    if (!gun) {
      log = push(log, 'じゅうを もっていない！');
    } else {
      const [r, s] = rand(seed);
      seed = s;
      const crit = r < 0.25;
      const dmg = Math.round((gun.power ?? 4) * (crit ? 1.5 : 1));
      enemyHp = Math.max(0, enemyHp - dmg);
      log = push(log, crit ? `かいしんの いちげき！ ${dmg}の ダメージ` : `${gun.name}で うった！ ${dmg}の ダメージ`);
    }
  } else if (cmd === 'slash') {
    const [dmg, s] = randInt(seed, 4, 8);
    seed = s;
    enemyHp = Math.max(0, enemyHp - dmg);
    log = push(log, `きりさいた！ ${dmg}の ダメージ`);
  } else {
    const shield = shieldOf(save);
    guard = Math.min(0.95, 0.5 + (shield?.reduce ?? 0));
    const heal = 3 + (shield?.heal ?? 0);
    playerHp = Math.min(b.playerMaxHp, playerHp + heal);
    log = push(log, shield ? `${shield.name}で みをまもった！ ${heal} かいふく` : `みをまもった！ ${heal} かいふく`);
  }

  if (enemyHp <= 0) {
    return { ...b, enemy: { ...b.enemy, hp: 0 }, playerHp, guard, seed, phase: 'win', log: push(log, 'かげモンスターを たおした！') };
  }

  // ── 敵の手番（予告どおりに動く）──
  const move = b.enemy.next;
  let charged = b.enemy.charged;

  if (move === 'attack' || (move !== 'charge' && charged)) {
    const base = charged ? 12 : 6;
    charged = false;
    const dmg = Math.max(0, Math.round(base * (1 - guard)));
    playerHp = Math.max(0, playerHp - dmg);
    log = push(log, guard > 0 ? `こうげきを うけた！ ${dmg}の ダメージ（かるくした）` : `こうげきを うけた！ ${dmg}の ダメージ`);
  } else if (move === 'charge') {
    charged = true;
    log = push(log, 'かげモンスターは ちからを ためている…');
  } else {
    log = push(log, 'かげモンスターは ゆだんしている');
  }

  if (playerHp <= 0) {
    return { ...b, enemy: { ...b.enemy, hp: enemyHp, charged }, playerHp: 0, guard, seed, phase: 'lose', log: push(log, 'たおれてしまった…') };
  }

  // ── 次の手を決めて予告する ──
  const [mi, s3] = randInt(seed, 0, charged ? 1 : 5);
  seed = s3;
  const next: EnemyMove = charged ? 'attack' : mi <= 2 ? 'attack' : mi <= 4 ? 'charge' : 'rest';

  return {
    ...b,
    enemy: { ...b.enemy, hp: enemyHp, next, charged },
    playerHp,
    guard,
    turn: b.turn + 1,
    log,
    seed,
    phase: 'input',
  };
}
