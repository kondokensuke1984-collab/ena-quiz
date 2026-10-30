// ゲームのセーブデータ。rpg.html:237-250 と同じ「版で弾く」方式に、入れ子のマージを足したもの。

import { readJSON, writeJSON } from './storage';
import { loadSpent } from './spend';
import { ALL_BUILDINGS, BUILD_ORDER, ITEM_BY_ID, isConsumable, WHEEL_TITLE, withBonus } from './items';
import type { PlayerKey, SaveV1 } from '../types';
import { FARM_PLOTS } from './farm';
import { isSchool, resolveSchool } from './school';

const PLAYERS: PlayerKey[] = ['anri', 'rino', 'mitsuki', 'kensuke', 'yusei'];

const SAVE_KEY = 'ena_island_save_v1';

export function freshSave(now = Date.now()): SaveV1 {
  return {
    v: 1,
    rev: 0,
    createdAt: now,
    player: null,
    school: null,
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
    playerWear: null,
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
    farm: { plots: Array.from({ length: FARM_PLOTS }, () => null), dex: [], flowers: [] },
    treats: { day: '', got: [] },
    stars: { dex: [] },
    moon: { lastOffer: '' },
    openingSeen: false,
    detective: { solved: [], found: {}, hint: {} },
    organ: { played: [] },
    micro: { dex: [], day: '', today: 0, ready: false },
    imo: { dex: [], day: '', served: 0 },
    forestry: { cleared: [], plays: 0 },
    zukei: { cleared: [], plays: 0 },
    suisan: { cleared: [], plays: 0, coin: 8, pond: [], sea: [], dex: [], scoopBest: 0, portDex: [] },
    arbor: { dex: [], day: '', gathered: 0, rested: false, tea: false, talked: 0 },
    space: { dex: [], day: '', trips: 0, moonStone: '', marsStone: '', sunStone: '', sunSeen: [] },
    usagi: { talked: '', home: false },
    talk: { day: '', talked: [], req: null, done: false },
  };
}

// 将来 v:2 を作るときにここだけ直す。いまは未知の版＝作り直し。
function migrate(_raw: unknown): SaveV1 | null {
  return null;
}

/** この画面より あたらしい 版の セーブが 入っている（古い画面の キャッシュ）。消さないように 書きこまない */
function isNewerSave(raw: unknown): boolean {
  const v = raw && typeof raw === 'object' ? (raw as { v?: unknown }).v : undefined;
  return typeof v === 'number' && v > 1;
}
export let newerSaveFound = false;

function obj<T extends object>(value: unknown, fallback: T): T {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as T) : fallback;
}

export function loadSave(): SaveV1 {
  const raw = readJSON<unknown>(SAVE_KEY, null);
  if (!raw || typeof raw !== 'object') return freshSave();

  const s = raw as Partial<SaveV1>;
  if (isNewerSave(raw)) { newerSaveFound = true; return freshSave(); }   // 画面の 中だけ。persist が 書かない
  if (s.v !== 1) return migrate(raw) ?? freshSave();

  // 浅いマージだと、あとから増やしたフィールドが undefined のまま残るので入れ子も混ぜる
  const f = freshSave();
  return withBonusSave(restorePaid({
    ...f,
    ...s,
    v: 1,
    rev: typeof s.rev === 'number' && Number.isFinite(s.rev) ? s.rev : 0,
    player: s.player && PLAYERS.includes(s.player) ? s.player : null,
    school: resolveSchool(s.player && PLAYERS.includes(s.player) ? s.player : null, isSchool(s.school) ? s.school : null),
    pos: { ...f.pos, ...obj(s.pos, {}) },
    monster: {
      ...f.monster,
      ...obj(s.monster, {}),
      pos: { ...f.monster.pos, ...obj(s.monster?.pos, {}) },
      wander: { ...f.monster.wander, ...obj(s.monster?.wander, {}) },
    },
    equipped: { ...f.equipped, ...obj(s.equipped, {}) },
    playerWear: typeof s.playerWear === 'string' ? s.playerWear : null,
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
    organ: { played: Array.isArray(s.organ?.played) ? s.organ!.played.filter((x) => typeof x === 'string') : [] },
    micro: {
      dex: Array.isArray(s.micro?.dex) ? s.micro!.dex.filter((x) => typeof x === 'string') : [],
      day: typeof s.micro?.day === 'string' ? s.micro!.day : '',
      today: typeof s.micro?.today === 'number' ? s.micro!.today : 0,
      ready: s.micro?.ready === true,
    },
    area: s.area === 'east' || s.area === 'house' || s.area === 'school' || s.area === 'moon' || s.area === 'mars' || s.area === 'sun' ? s.area : 'main',
    room: { ...f.room, ...obj(s.room, {}) },
    fish: {
      ...f.fish,
      ...obj(s.fish, {}),
      caught: obj(s.fish?.caught, {}),
      big: obj(s.fish?.big, {}),
    },
    farm: {
      plots: Array.from({ length: FARM_PLOTS }, (_, i) => {
        const p = Array.isArray(s.farm?.plots) ? s.farm!.plots[i] : null;
        return p && typeof p === 'object' && typeof p.seed === 'string' ? p : null;
      }),
      dex: Array.isArray(s.farm?.dex) ? s.farm!.dex : [],
      flowers: Array.isArray(s.farm?.flowers) ? s.farm!.flowers : [],
    },
    treats: { ...f.treats, ...obj(s.treats, {}), got: Array.isArray(s.treats?.got) ? s.treats!.got : [] },
    stars: { ...f.stars, ...obj(s.stars, {}), dex: Array.isArray(s.stars?.dex) ? s.stars!.dex : [] },
    moon: { ...f.moon, ...obj(s.moon, {}) },
    imo: {
      dex: Array.isArray(s.imo?.dex) ? s.imo!.dex.filter((x) => typeof x === 'string') : [],
      day: typeof s.imo?.day === 'string' ? s.imo!.day : '',
      served: typeof s.imo?.served === 'number' ? s.imo!.served : 0,
    },
    forestry: {
      cleared: Array.isArray(s.forestry?.cleared) ? s.forestry!.cleared.filter((x) => typeof x === 'string') : [],
      plays: typeof s.forestry?.plays === 'number' ? s.forestry!.plays : 0,
    },
    zukei: {
      cleared: Array.isArray(s.zukei?.cleared) ? s.zukei!.cleared.filter((x) => typeof x === 'string') : [],
      plays: typeof s.zukei?.plays === 'number' ? s.zukei!.plays : 0,
    },
    suisan: {
      cleared: Array.isArray(s.suisan?.cleared) ? s.suisan!.cleared.filter((x) => typeof x === 'string') : [],
      plays: typeof s.suisan?.plays === 'number' ? s.suisan!.plays : 0,
      coin: typeof s.suisan?.coin === 'number' && s.suisan!.coin >= 0 ? Math.floor(s.suisan!.coin) : 8,
      pond: Array.isArray(s.suisan?.pond)
        ? s.suisan!.pond.filter((f) => f && typeof f.sp === 'string' && typeof f.g === 'number' && typeof f.t === 'number').slice(0, 4)
          .map((f) => ({
            sp: f.sp, g: f.g, t: f.t, sick: typeof f.sick === 'number' ? f.sick : 0, fed: typeof f.fed === 'number' ? f.fed : 0,
            ...(f.md === 'farm' || f.md === 'stock' ? { md: f.md } : {}), ...(typeof f.pl === 'string' ? { pl: f.pl } : {}),
          }))
        : [],
      sea: Array.isArray(s.suisan?.sea)
        ? s.suisan!.sea.filter((f) => f && typeof f.sp === 'string' && typeof f.t === 'number').slice(0, 3)
          .map((f) => ({ sp: f.sp, t: f.t, ...(typeof f.pl === 'string' ? { pl: f.pl } : {}) }))
        : [],
      dex: Array.isArray(s.suisan?.dex) ? s.suisan!.dex.filter((x) => typeof x === 'string') : [],
      scoopBest: typeof s.suisan?.scoopBest === 'number' ? s.suisan!.scoopBest : 0,
      portDex: Array.isArray(s.suisan?.portDex) ? s.suisan!.portDex.filter((x) => typeof x === 'string') : [],
    },
    arbor: {
      dex: Array.isArray(s.arbor?.dex) ? s.arbor!.dex.filter((x) => typeof x === 'string') : [],
      day: typeof s.arbor?.day === 'string' ? s.arbor!.day : '',
      gathered: typeof s.arbor?.gathered === 'number' ? s.arbor!.gathered : 0,
      rested: s.arbor?.rested === true,
      tea: s.arbor?.tea === true,
      talked: typeof s.arbor?.talked === 'number' ? s.arbor!.talked : 0,
    },
    space: {
      dex: Array.isArray(s.space?.dex) ? s.space!.dex.filter((x) => typeof x === 'string') : [],
      day: typeof s.space?.day === 'string' ? s.space!.day : '',
      trips: typeof s.space?.trips === 'number' ? s.space!.trips : 0,
      moonStone: typeof s.space?.moonStone === 'string' ? s.space!.moonStone : '',
      marsStone: typeof s.space?.marsStone === 'string' ? s.space!.marsStone : '',
      sunStone: typeof s.space?.sunStone === 'string' ? s.space!.sunStone : '',
      sunSeen: Array.isArray(s.space?.sunSeen) ? s.space!.sunSeen.filter((x) => typeof x === 'string') : [],
    },
    usagi: {
      talked: typeof s.usagi?.talked === 'string' ? s.usagi!.talked : '',
      home: s.usagi?.home === true,
    },
    talk: {
      day: typeof s.talk?.day === 'string' ? s.talk!.day : '',
      talked: Array.isArray(s.talk?.talked) ? s.talk!.talked.filter((x) => typeof x === 'string') : [],
      req: s.talk?.req && typeof s.talk.req === 'object' && typeof (s.talk.req as { char?: unknown }).char === 'string' ? s.talk.req : null,
      done: s.talk?.done === true,
    },
  }));
}

/** うちゅうきち → ロケット などの おまけを つける */
function withBonusSave(save: SaveV1): SaveV1 {
  if (save.player === 'kensuke') {   // けんすけは ぜんぶ たっている
    const all = [...save.buildings, ...ALL_BUILDINGS.filter((id) => !save.buildings.includes(id))];
    return all.length === save.buildings.length ? save : { ...save, buildings: all };
  }
  const b = withBonus(save.buildings);
  return b === save.buildings ? save : { ...save, buildings: b };
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
  if (isNewerSave(readJSON<unknown>(SAVE_KEY, null))) { newerSaveFound = true; return false; }
  return writeJSON(SAVE_KEY, save);
}

export function isSaveKey(key: string | null): boolean {
  return key === SAVE_KEY;
}
