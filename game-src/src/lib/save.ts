// ゲームのセーブデータ。rpg.html:237-250 と同じ「版で弾く」方式に、入れ子のマージを足したもの。

import { readJSON, writeJSON } from './storage';
import { loadSpent } from './spend';
import { BUILD_ORDER, ITEM_BY_ID, isConsumable, WHEEL_TITLE } from './items';
import type { PlayerKey, SaveV1 } from '../types';

const PLAYERS: PlayerKey[] = ['anri', 'rino', 'mitsuki', 'kensuke'];

const SAVE_KEY = 'ena_island_save_v1';

export function freshSave(now = Date.now()): SaveV1 {
  return {
    v: 1,
    rev: 0,
    createdAt: now,
    player: null,
    pos: { x: 0.5, y: 0.62 },
    monster: {
      charKey: null,
      stage: 'egg',
      exp: 0,
      fullness: 60,
      lastFedAt: 0,
      hatchFeeds: 0,
      pos: { x: 0.5, y: 0.42 },
      wander: { x: 0.5, y: 0.42 },
    },
    inventory: {},
    owned: [],
    equipped: { weapon: null, shield: null, costume: null, hat: null },
    placed: [],
    titles: [],
    battle: { wins: 0, losses: 0, lastAt: 0 },
    buildings: [],
    friendsPlay: {},
    stampClaims: [],
    letters: [],
    letterMarks: { init: false, lv: {}, full: {}, stamp: [], weekly: '' },
    lastChest: '',
    area: 'main',
    room: { wall: 'wl_beige', floor: 'fl_wood' },
    fish: { day: '', today: 0, caught: {}, big: {} },
    farm: { plots: [null, null, null], dex: [], flowers: [] },
    treats: { day: '', got: [] },
    stars: { dex: [] },
    moon: { lastOffer: '' },
    openingSeen: false,
    detective: { solved: [], found: {}, hint: {} },
  };
}

// 将来 v:2 を作るときにここだけ直す。いまは未知の版＝作り直し。
function migrate(_raw: unknown): SaveV1 | null {
  return null;
}

function obj<T extends object>(value: unknown, fallback: T): T {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as T) : fallback;
}

export function loadSave(): SaveV1 {
  const raw = readJSON<unknown>(SAVE_KEY, null);
  if (!raw || typeof raw !== 'object') return freshSave();

  const s = raw as Partial<SaveV1>;
  if (s.v !== 1) return migrate(raw) ?? freshSave();

  // 浅いマージだと、あとから増やしたフィールドが undefined のまま残るので入れ子も混ぜる
  const f = freshSave();
  return restorePaid({
    ...f,
    ...s,
    v: 1,
    rev: typeof s.rev === 'number' && Number.isFinite(s.rev) ? s.rev : 0,
    player: s.player && PLAYERS.includes(s.player) ? s.player : null,
    pos: { ...f.pos, ...obj(s.pos, {}) },
    monster: {
      ...f.monster,
      ...obj(s.monster, {}),
      pos: { ...f.monster.pos, ...obj(s.monster?.pos, {}) },
      wander: { ...f.monster.wander, ...obj(s.monster?.wander, {}) },
    },
    equipped: { ...f.equipped, ...obj(s.equipped, {}) },
    battle: { ...f.battle, ...obj(s.battle, {}) },
    inventory: obj(s.inventory, {}),
    owned: Array.isArray(s.owned) ? s.owned : [],
    titles: Array.isArray(s.titles) ? s.titles : [],
    placed: Array.isArray(s.placed) ? s.placed : [],
    buildings: Array.isArray(s.buildings) ? s.buildings : [],
    friendsPlay: obj(s.friendsPlay, {}),
    stampClaims: Array.isArray(s.stampClaims) ? s.stampClaims : [],
    letters: Array.isArray(s.letters) ? s.letters.slice(0, 30) : [],
    letterMarks: { ...f.letterMarks, ...obj(s.letterMarks, {}) },
    lastChest: typeof s.lastChest === 'string' ? s.lastChest : '',
    openingSeen: s.openingSeen === true,
    detective: {
      solved: Array.isArray(s.detective?.solved) ? s.detective!.solved : [],
      found: obj(s.detective?.found, {}),
      hint: obj(s.detective?.hint, {}),
    },
    area: s.area === 'east' || s.area === 'house' ? s.area : 'main',
    room: { ...f.room, ...obj(s.room, {}) },
    fish: {
      ...f.fish,
      ...obj(s.fish, {}),
      caught: obj(s.fish?.caught, {}),
      big: obj(s.fish?.big, {}),
    },
    farm: {
      plots: [0, 1, 2].map((i) => {
        const p = Array.isArray(s.farm?.plots) ? s.farm!.plots[i] : null;
        return p && typeof p === 'object' && typeof p.seed === 'string' ? p : null;
      }),
      dex: Array.isArray(s.farm?.dex) ? s.farm!.dex : [],
      flowers: Array.isArray(s.farm?.flowers) ? s.farm!.flowers : [],
    },
    treats: { ...f.treats, ...obj(s.treats, {}), got: Array.isArray(s.treats?.got) ? s.treats!.got : [] },
    stars: { ...f.stars, ...obj(s.stars, {}), dex: Array.isArray(s.stars?.dex) ? s.stars!.dex : [] },
    moon: { ...f.moon, ...obj(s.moon, {}) },
  });
}

/** さいごの loadSave() で メダルの記録から もどした品（トーストに出す） */
export let lastRestored: string[] = [];

/**
 * メダルを はらったのに セーブに ない 建物・品を もどす。
 * 古い画面が 古いセーブで 上書きすると 消えてしまうことがあったため（2026-09-26）。
 * owned と buildings は ふつうの操作では へらないので、足すだけで こまることはない。
 * 消費品（えさ・プレゼント・たね など）は つかって へるので もどさない。
 */
function restorePaid(save: SaveV1): SaveV1 {
  lastRestored = [];
  let { buildings, owned } = save;
  for (const e of loadSpent().log) {
    const m = /^(build|buy):(.+)$/.exec(typeof e?.reason === 'string' ? e.reason : '');
    const item = m ? ITEM_BY_ID[m[2]] : undefined;
    if (!m || !item) continue;
    if (m[1] === 'build') {
      if (item.kind !== 'building' || buildings.includes(item.id)) continue;
      buildings = [...buildings, item.id];
    } else {
      if (item.kind === 'building' || isConsumable(item) || owned.includes(item.id)) continue;
      owned = [...owned, item.id];
    }
    lastRestored.push(item.id);
  }
  if (!lastRestored.length) return save;
  const at = (id: string) => { const i = BUILD_ORDER.indexOf(id); return i < 0 ? 999 : i; };
  const titles = buildings.includes('bd_wheel') && !save.titles.includes(WHEEL_TITLE) ? [...save.titles, WHEEL_TITLE] : save.titles;
  return { ...save, buildings: [...buildings].sort((x, y) => at(x) - at(y)), owned, titles };
}

/** localStorage に いま はいっている セーブの rev（なければ 0） */
export function storedRev(): number {
  const raw = readJSON<{ rev?: unknown } | null>(SAVE_KEY, null);
  return raw && typeof raw.rev === 'number' && Number.isFinite(raw.rev) ? raw.rev : 0;
}

export function persist(save: SaveV1): boolean {
  return writeJSON(SAVE_KEY, save);
}

export function isSaveKey(key: string | null): boolean {
  return key === SAVE_KEY;
}
