import React, {
  createContext, useCallback, useEffect, useMemo, useReducer, useRef, useState,
} from 'react';
import type { Area, Item, Letter, LetterMarks, PlayerKey, Pos, SaveV1, Screen, Slot } from '../types';
import { sfx, unlockAudio } from '../lib/sound';
import { freshSave, isSaveKey, loadSave, persist } from '../lib/save';
import { earnedTotal, isMedalKey } from '../lib/medals';
import { isSpentKey, loadSpent, spend, type SpendLedger, type SpendResult } from '../lib/spend';
import { feed } from '../lib/monster';
import {
  isConsumable, ITEM_BY_ID, WHEEL_TITLE,
  FAVORITE, GIFTS_PER_DAY, heartsOf, STAMP_REWARDS, EVERYDAY_GIFTS, nextBuildId,
} from '../lib/items';
import { FISH_PER_DAY, FISH_REWARDS, FISH_STUDY_BONUS } from '../lib/fish';
import { CROP_COUNT, GROW_DAYS, grownDays } from '../lib/farm';
import { dateKey } from '../lib/study';
import { type Constellation, STAR_REWARDS, tonightConstellation } from '../lib/stars';
import { isNearFull, moonAge, moonName } from '../lib/sky';
import { LUNA, mk as mkLetter } from '../lib/letters';
import { seasonNow } from '../lib/items';

/** プレゼントの結果。IslandScreen がハートとふきだしを出すのに使う */
export interface GiftResult {
  favorite: boolean;
  gained: number;
  heartsBefore: number;
  heartsAfter: number;
}

function todayStr(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export interface Toast {
  id: number;
  text: string;
  tone: 'ok' | 'ng';
}

interface State {
  save: SaveV1;
  earned: number;
  spent: SpendLedger;
  screen: Screen;
  now: number;
  toast: Toast | null;
}

type Action =
  | { type: 'REFRESH_MEDALS' }
  | { type: 'RELOAD_SAVE' }
  | { type: 'SET_SAVE'; save: SaveV1 }
  | { type: 'UPDATE_SAVE'; fn: (s: SaveV1) => SaveV1 }
  | { type: 'GO'; screen: Screen }
  | { type: 'TICK'; now: number }
  | { type: 'TOAST'; text: string; tone?: 'ok' | 'ng' }
  | { type: 'CLEAR_TOAST' };

function initialState(): State {
  return {
    save: loadSave(),
    earned: earnedTotal(),
    spent: loadSpent(),
    screen: (location.hash.replace('#', '') as Screen) || 'island',
    now: Date.now(),
    toast: null,
  };
}

// ★reducer のなかで localStorage に書かないこと。
//   StrictMode では reducer が二重に呼ばれうるので、書き込むと二重消費になる。
function reducer(state: State, action: Action): State {
  switch (action.type) {
    // メダルの残高だけ読み直す。★セーブは読み直さない
    //   （保存前の変更を localStorage の古い内容で上書きしてしまうため）
    case 'REFRESH_MEDALS':
      return { ...state, earned: earnedTotal(), spent: loadSpent() };
    // ほかのタブがセーブを書きかえたときだけ読み直す
    case 'RELOAD_SAVE':
      return { ...state, save: loadSave() };
    case 'SET_SAVE':
      return { ...state, save: action.save };
    // ★同じタイミングで2回以上セーブを更新しても打ち消し合わないよう、関数で渡して順に適用する
    case 'UPDATE_SAVE':
      return { ...state, save: action.fn(state.save) };
    case 'GO':
      return { ...state, screen: action.screen };
    case 'TICK':
      return { ...state, now: action.now };
    case 'TOAST':
      return { ...state, toast: { id: Date.now(), text: action.text, tone: action.tone ?? 'ok' } };
    case 'CLEAR_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

export interface GameApi {
  save: SaveV1;
  balance: number;
  earned: number;
  spentTotal: number;
  screen: Screen;
  now: number;
  toast: Toast | null;
  go(screen: Screen): void;
  pickPlayer(player: PlayerKey): void;
  setPos(pos: Pos): void;
  setMonsterPos(pos: Pos, wander?: Pos): void;
  buy(item: Item): void;
  feedMonster(itemId: string): void;
  equip(slot: Slot, itemId: string | null): void;
  placeFurniture(itemId: string, x: number, y: number, area?: Area): void;
  /** 場所を移る。pos は移った先での立ち位置 */
  goArea(area: Area, pos: Pos): void;
  setRoom(part: 'wall' | 'floor', id: string): void;
  moveFurniture(uid: string, x: number, y: number): void;
  storeFurniture(uid: string): void;
  resetAll(): void;
  showToast(text: string, tone?: 'ok' | 'ng'): void;
  build(itemId: string): void;
  /** その日にあと何回プレゼントをあげられるか */
  giftsLeft(charKey: string): number;
  giveGift(charKey: string, friendName: string, itemId: string): GiftResult | null;
  dressFriend(charKey: string, wearId: string | null): void;
  /** ついてくる／ついてこないを切りかえる（♥3いじょうの子だけ意味がある） */
  toggleFollow(charKey: string): void;
  /** まいにちスタンプの ごほうびを うけとる。うけとったものの説明を返す */
  claimStamp(ym: string, days: number): string | null;
  /** たからばこを あける（その日1回）。出たプレゼントのID */
  openChest(day: string): string | null;
  deliverLetters(letters: Letter[], marks: LetterMarks): void;
  readLetter(id: string): void;
  /** きょう あと何回 つれるか（studied＝きょう クイズを5もん やった） */
  fishLeft(studied: boolean): number;
  /** つれた さかなを きろくする。ずかんの ごほうびが あれば その家具ID */
  landFish(fishId: string, cm: number, studied: boolean): { isNew: boolean; best: boolean; reward: string | null } | null;
  plantSeed(plot: number, seedId: string): void;
  /** みずやり（1日1回・見た目だけ）。あげられたら true */
  waterPlot(plot: number): boolean;
  /** しゅうかく。とれた プレゼントの ID */
  harvest(plot: number): string | null;
  /** ハロウィンの おかし（その日 その子から1回）。もらえたら true */
  trickOrTreat(charKey: string): boolean;
  /** てんもんだいで 今夜の星座を見る。ずかんの ごほうびが あれば その家具ID */
  viewStars(): { constellation: Constellation; isNew: boolean; reward: string | null } | null;
  /** おつきみだいで おだんごを おそなえする（その日1回） */
  offerDango(): { age: number; name: string; isFull: boolean; got: string[]; reward: string | null } | null;
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export const GameContext = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [booted, setBooted] = useState(false);
  const saveRef = useRef(state.save);
  saveRef.current = state.save;

  // ── 保存は effect でだけ行う（reducer では書かない）──
  useEffect(() => {
    if (!booted) { setBooted(true); return; }
    persist(state.save);
  }, [state.save, booted]);

  // ── 画面とURLのハッシュを同期。戻るボタンとリロードが効くようにする ──
  useEffect(() => {
    const want = `#${state.screen}`;
    if (location.hash !== want) history.replaceState(null, '', want);
  }, [state.screen]);

  useEffect(() => {
    const onHash = () => {
      const s = location.hash.replace('#', '') as Screen;
      if (s === 'island' || s === 'shop' || s === 'battle') dispatch({ type: 'GO', screen: s });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // ── クエストの まよいの森で もりのぬしを たおしたら、トロフィーを とどける（rpg.html は しるしを書くだけ）──
  const trophyDone = useRef(false);
  useEffect(() => {
    const check = () => {
      if (trophyDone.current || saveRef.current.owned.includes('fn_forest')) return;
      let flag: string | null = null;
      try { flag = localStorage.getItem('ena_forest_trophy'); } catch { /* 読めなければ なし */ }
      if (flag !== '1') return;
      trophyDone.current = true;
      dispatch({ type: 'UPDATE_SAVE', fn: (s) => (s.owned.includes('fn_forest') ? s : { ...s, owned: [...s.owned, 'fn_forest'] }) });
      dispatch({ type: 'TOAST', text: '🏆 もりの トロフィーが とどいたよ！「かぐ」から おけるよ' });
    };
    check();
    window.addEventListener('focus', check);
    return () => window.removeEventListener('focus', check);
  }, []);

  // ── 音は最初のタップで起こす（iPhone はユーザー操作の中でしか鳴らせない）──
  useEffect(() => {
    const on = () => unlockAudio();
    document.addEventListener('pointerdown', on, { passive: true });
    return () => document.removeEventListener('pointerdown', on);
  }, []);

  // ── ほかのタブ（クイズアプリ）がメダルを増やしたら拾う ──
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (isMedalKey(e.key) || isSpentKey(e.key)) dispatch({ type: 'REFRESH_MEDALS' });
      if (isSaveKey(e.key)) dispatch({ type: 'RELOAD_SAVE' });
    };
    // 同じタブでクイズ→ゲームと移動した場合は storage が飛ばないので、戻ってきたときにも読み直す
    const onWake = () => { if (!document.hidden) dispatch({ type: 'REFRESH_MEDALS' }); };

    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onWake);
    window.addEventListener('focus', onWake);
    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onWake);
      window.removeEventListener('focus', onWake);
    };
  }, []);

  // ── 開きっぱなしのタブでも空腹・ダウンが更新されるように1分ごとに時刻を進める ──
  useEffect(() => {
    const id = window.setInterval(() => dispatch({ type: 'TICK', now: Date.now() }), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!state.toast) return;
    const id = window.setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 2600);
    return () => window.clearTimeout(id);
  }, [state.toast]);

  const setSave = useCallback((fn: (s: SaveV1) => SaveV1) => {
    dispatch({ type: 'UPDATE_SAVE', fn });
  }, []);

  const showToast = useCallback((text: string, tone: 'ok' | 'ng' = 'ok') => {
    dispatch({ type: 'TOAST', text, tone });
  }, []);

  const api: GameApi = useMemo(() => ({
    save: state.save,
    balance: Math.max(0, state.earned - state.spent.total),
    earned: state.earned,
    spentTotal: state.spent.total,
    screen: state.screen,
    now: state.now,
    toast: state.toast,

    go: (screen) => dispatch({ type: 'GO', screen }),

    pickPlayer: (player) => setSave((s) => ({ ...s, player })),

    setPos: (pos) => setSave((s) => ({ ...s, pos })),

    setMonsterPos: (pos, wander) =>
      setSave((s) => ({ ...s, monster: { ...s.monster, pos, wander: wander ?? s.monster.wander } })),

    // ★買い物は必ず spend() を先に通す。spend() は書き込む直前に残高を読み直す。
    buy: (item) => {
      if (item.once && saveRef.current.owned.includes(item.id)) {
        showToast('もう もっているよ', 'ng');
        return;
      }
      const res: SpendResult = spend(item.price, `buy:${item.id}`);
      if (!res.ok) {
        showToast(
          res.code === 'insufficient' ? 'メダルが たりないよ'
            : res.code === 'write_failed' ? 'ほぞんに しっぱいしたよ'
            : 'かえなかったよ',
          'ng',
        );
        dispatch({ type: 'REFRESH_MEDALS' });
        return;
      }
      setSave((s) => (isConsumable(item)
        ? { ...s, inventory: { ...s.inventory, [item.id]: (s.inventory[item.id] ?? 0) + 1 } }
        : { ...s, owned: s.owned.includes(item.id) ? s.owned : [...s.owned, item.id] }));
      dispatch({ type: 'REFRESH_MEDALS' });
      sfx('coin');
      showToast(`${item.emoji} ${item.name} を かった！`);
    },

    feedMonster: (itemId) => {
      const item = ITEM_BY_ID[itemId];
      if (!item) return;
      const cur = saveRef.current;
      if ((cur.inventory[itemId] ?? 0) <= 0) { showToast('もっていないよ', 'ng'); return; }

      const out = feed(cur, item);
      setSave((s) => {
        const left = (s.inventory[itemId] ?? 0) - 1;
        const inventory = { ...s.inventory };
        if (left > 0) inventory[itemId] = left; else delete inventory[itemId];
        return { ...s, inventory, monster: out.monster };
      });
      showToast(out.hatched ? '🎉 たまごが かえった！' : `${item.emoji} おいしそうに たべた！`);
    },

    equip: (slot, itemId) => setSave((s) => ({ ...s, equipped: { ...s.equipped, [slot]: itemId } })),

    placeFurniture: (itemId, x, y, area = 'main') =>
      setSave((s) => ({
        ...s,
        placed: [...s.placed, { uid: `${itemId}-${Date.now().toString(36)}`, id: itemId, x, y, area }],
      })),

    goArea: (area, pos) => setSave((s) => ({ ...s, area, pos })),

    setRoom: (part, id) => setSave((s) => ({ ...s, room: { ...s.room, [part]: id } })),

    moveFurniture: (uid, x, y) =>
      setSave((s) => ({ ...s, placed: s.placed.map((p) => (p.uid === uid ? { ...p, x, y } : p)) })),

    storeFurniture: (uid) => setSave((s) => ({ ...s, placed: s.placed.filter((p) => p.uid !== uid) })),

    resetAll: () => {
      const f = freshSave();
      dispatch({ type: 'SET_SAVE', save: f });
      showToast('しまを さいしょから はじめたよ');
    },

    showToast,

    // ── けんせつ：順番どおりにしか建てられない。買い物と同じく spend() を先に通す ──
    build: (itemId) => {
      const item = ITEM_BY_ID[itemId];
      const cur = saveRef.current;
      if (!item || item.kind !== 'building') return;
      if (cur.buildings.includes(itemId)) { showToast('もう たてたよ', 'ng'); return; }
      if (nextBuildId(cur.buildings) !== itemId) { showToast('まえの たてものを さきに たてよう', 'ng'); return; }
      const res: SpendResult = spend(item.price, `build:${itemId}`);
      if (!res.ok) {
        showToast(res.code === 'insufficient' ? 'メダルが たりないよ' : 'たてられなかったよ', 'ng');
        dispatch({ type: 'REFRESH_MEDALS' });
        return;
      }
      setSave((s) => ({
        ...s,
        buildings: s.buildings.includes(itemId) ? s.buildings : [...s.buildings, itemId],
        titles: itemId === 'bd_wheel' && !s.titles.includes(WHEEL_TITLE) ? [...s.titles, WHEEL_TITLE] : s.titles,
      }));
      dispatch({ type: 'REFRESH_MEDALS' });
      dispatch({ type: 'GO', screen: 'island' });
      sfx('build');
      showToast(`🎉 ${item.emoji} ${item.name} が できた！`);
    },

    giftsLeft: (charKey) => {
      const p = saveRef.current.friendsPlay[charKey];
      if (!p || p.day !== todayStr()) return GIFTS_PER_DAY;
      return Math.max(0, GIFTS_PER_DAY - p.today);
    },

    // ── プレゼント：1体1日3回まで。だいすきなものは2倍 ──
    giveGift: (charKey, friendName, itemId) => {
      const item = ITEM_BY_ID[itemId];
      const cur = saveRef.current;
      if (!item || item.kind !== 'gift') return null;
      if ((cur.inventory[itemId] ?? 0) <= 0) { showToast('もっていないよ', 'ng'); return null; }
      const day = todayStr();
      const prev = cur.friendsPlay[charKey] ?? { pts: 0, day, today: 0, wear: null };
      const today = prev.day === day ? prev.today : 0;
      if (today >= GIFTS_PER_DAY) { showToast(`${friendName}は きょうは もう おなかいっぱい`, 'ng'); return null; }

      const favorite = FAVORITE[charKey] === itemId;
      const gained = (item.love ?? 1) * (favorite ? 2 : 1);
      const pts = prev.pts + gained;
      const heartsBefore = heartsOf(prev.pts);
      const heartsAfter = heartsOf(pts);
      const title = `${friendName}の なかよし`;

      setSave((s) => {
        const left = (s.inventory[itemId] ?? 0) - 1;
        const inventory = { ...s.inventory };
        if (left > 0) inventory[itemId] = left; else delete inventory[itemId];
        return {
          ...s,
          inventory,
          friendsPlay: { ...s.friendsPlay, [charKey]: { ...prev, pts, day, today: today + 1 } },
          titles: heartsAfter >= 5 && !s.titles.includes(title) ? [...s.titles, title] : s.titles,
        };
      });
      sfx(heartsAfter > heartsBefore ? 'heart' : 'gift');
      return { favorite, gained, heartsBefore, heartsAfter };
    },

    // 1つのきせかえは1体だけ。ほかのキャラがつけていたら外してからつける
    dressFriend: (charKey, wearId) =>
      setSave((s) => {
        const fp: typeof s.friendsPlay = {};
        for (const [k, v] of Object.entries(s.friendsPlay)) {
          fp[k] = wearId && v.wear === wearId ? { ...v, wear: null } : v;
        }
        const prev = fp[charKey] ?? { pts: 0, day: '', today: 0, wear: null };
        fp[charKey] = { ...prev, wear: wearId };
        return { ...s, friendsPlay: fp };
      }),

    toggleFollow: (charKey) =>
      setSave((s) => {
        const prev = s.friendsPlay[charKey] ?? { pts: 0, day: '', today: 0, wear: null };
        return { ...s, friendsPlay: { ...s.friendsPlay, [charKey]: { ...prev, followOff: !prev.followOff } } };
      }),

    claimStamp: (ym, days) => {
      const r = STAMP_REWARDS.find((x) => x.days === days);
      const key = `${ym}:${days}`;
      const cur = saveRef.current;
      if (!r || cur.stampClaims.includes(key)) return null;
      // 持っているごほうびは、かわりにプレゼント3つ
      const giveItem = r.item && !cur.owned.includes(r.item) ? r.item : null;
      const gifts = giveItem ? [] : [pick(EVERYDAY_GIFTS), pick(EVERYDAY_GIFTS), pick(EVERYDAY_GIFTS)];
      setSave((s) => {
        const inventory = { ...s.inventory };
        gifts.forEach((id) => { inventory[id] = (inventory[id] ?? 0) + 1; });
        return {
          ...s,
          inventory,
          owned: giveItem && !s.owned.includes(giveItem) ? [...s.owned, giveItem] : s.owned,
          stampClaims: s.stampClaims.includes(key) ? s.stampClaims : [...s.stampClaims, key],
        };
      });
      sfx('stamp');
      return giveItem
        ? `${ITEM_BY_ID[giveItem].emoji} ${ITEM_BY_ID[giveItem].name}`
        : gifts.map((id) => ITEM_BY_ID[id].emoji).join('') + ' プレゼント 3つ';
    },

    openChest: (day) => {
      if (saveRef.current.lastChest === day) return null;
      const id = pick(EVERYDAY_GIFTS);
      setSave((s) => (s.lastChest === day ? s : {
        ...s,
        lastChest: day,
        inventory: { ...s.inventory, [id]: (s.inventory[id] ?? 0) + 1 },
      }));
      sfx('chest');
      return id;
    },

    deliverLetters: (letters, marks) => {
      setSave((s) => ({ ...s, letters: [...letters, ...s.letters].slice(0, 30), letterMarks: marks }));
      if (letters.length) sfx('letter');
    },

    fishLeft: (studied) => {
      const f = saveRef.current.fish;
      const max = FISH_PER_DAY + (studied ? FISH_STUDY_BONUS : 0);
      return Math.max(0, max - (f.day === dateKey() ? f.today : 0));
    },

    landFish: (fishId, cm, studied) => {
      const cur = saveRef.current;
      const day = dateKey();
      const used = cur.fish.day === day ? cur.fish.today : 0;
      if (used >= FISH_PER_DAY + (studied ? FISH_STUDY_BONUS : 0)) return null;
      const isNew = !cur.fish.caught[fishId];
      const best = !isNew && cm > (cur.fish.big[fishId] ?? 0);
      const kinds = Object.keys(cur.fish.caught).length + (isNew ? 1 : 0);
      const reward = FISH_REWARDS.find((r) => r.kinds <= kinds && !cur.owned.includes(r.item))?.item ?? null;
      setSave((s) => {
        const today = s.fish.day === day ? s.fish.today : 0;
        return {
          ...s,
          fish: {
            day,
            today: today + 1,
            caught: { ...s.fish.caught, [fishId]: (s.fish.caught[fishId] ?? 0) + 1 },
            big: { ...s.fish.big, [fishId]: Math.max(s.fish.big[fishId] ?? 0, cm) },
          },
          owned: reward && !s.owned.includes(reward) ? [...s.owned, reward] : s.owned,
        };
      });
      sfx('catch');
      return { isNew, best, reward };
    },

    plantSeed: (plot, seedId) => {
      const cur = saveRef.current;
      if ((cur.inventory[seedId] ?? 0) <= 0 || cur.farm.plots[plot]) return;
      setSave((s) => {
        if (s.farm.plots[plot]) return s;
        const left = (s.inventory[seedId] ?? 0) - 1;
        const inventory = { ...s.inventory };
        if (left > 0) inventory[seedId] = left; else delete inventory[seedId];
        const plots = [...s.farm.plots];
        plots[plot] = { seed: seedId, at: dateKey(), watered: '' };
        return { ...s, inventory, farm: { plots } };
      });
      sfx('stamp');
    },

    waterPlot: (plot) => {
      const p = saveRef.current.farm.plots[plot];
      const day = dateKey();
      if (!p || p.watered === day) return false;
      setSave((s) => {
        const plots = [...s.farm.plots];
        const q = plots[plot];
        if (q) plots[plot] = { ...q, watered: day };
        return { ...s, farm: { plots } };
      });
      sfx('water');
      return true;
    },

    harvest: (plot) => {
      const p = saveRef.current.farm.plots[plot];
      const crop = p ? ITEM_BY_ID[p.seed]?.crop : undefined;
      if (!p || !crop || grownDays(p) < GROW_DAYS) return null;
      setSave((s) => {
        if (!s.farm.plots[plot]) return s;
        const plots = [...s.farm.plots];
        plots[plot] = null;
        return { ...s, farm: { plots }, inventory: { ...s.inventory, [crop]: (s.inventory[crop] ?? 0) + CROP_COUNT } };
      });
      sfx('chest');
      return crop;
    },

    trickOrTreat: (charKey) => {
      const day = dateKey();
      const t = saveRef.current.treats;
      if (t.day === day && t.got.includes(charKey)) return false;
      setSave((s) => {
        const got = s.treats.day === day ? s.treats.got : [];
        if (got.includes(charKey)) return s;
        return {
          ...s,
          treats: { day, got: [...got, charKey] },
          inventory: { ...s.inventory, gf_candy: (s.inventory.gf_candy ?? 0) + 1 },
        };
      });
      sfx('gift');
      return true;
    },

    readLetter: (id) =>
      setSave((s) => ({ ...s, letters: s.letters.map((l) => (l.id === id ? { ...l, read: true } : l)) })),

    viewStars: () => {
      const cur = saveRef.current;
      const c = tonightConstellation(dateKey(), seasonNow());
      const isNew = !cur.stars.dex.includes(c.id);
      const kinds = cur.stars.dex.length + (isNew ? 1 : 0);
      const reward = STAR_REWARDS.find((r) => r.kinds <= kinds && !cur.owned.includes(r.item))?.item ?? null;
      const firstEver = isNew && cur.stars.dex.length === 0;
      setSave((s) => ({
        ...s,
        stars: { dex: s.stars.dex.includes(c.id) ? s.stars.dex : [...s.stars.dex, c.id] },
        owned: reward && !s.owned.includes(reward) ? [...s.owned, reward] : s.owned,
        letters: firstEver
          ? [mkLetter(LUNA.from, LUNA.fromName, '🔭 はじめての星座', 'てんもんだいで はじめて 星座を みつけたね！\nまいばん ちがう星座が みえるかもよ。ぜんぶ あつめてみてね。\n\nルナより'), ...s.letters].slice(0, 30)
          : s.letters,
      }));
      if (isNew) sfx('star');
      return { constellation: c, isNew, reward };
    },

    offerDango: () => {
      const cur = saveRef.current;
      if ((cur.inventory.gf_dango ?? 0) <= 0) { showToast('おだんごが ないよ', 'ng'); return null; }
      const day = dateKey();
      if (cur.moon.lastOffer === day) { showToast('きょうは もう おそなえしたよ', 'ng'); return null; }
      const age = moonAge();
      const isFull = isNearFull(age);
      const got = isFull ? [pick(EVERYDAY_GIFTS), pick(EVERYDAY_GIFTS)] : [pick(EVERYDAY_GIFTS)];
      const reward = isFull && !cur.owned.includes('fn_moonrabbit') ? 'fn_moonrabbit' : null;
      setSave((s) => {
        const left = (s.inventory.gf_dango ?? 0) - 1;
        const inventory = { ...s.inventory };
        if (left > 0) inventory.gf_dango = left; else delete inventory.gf_dango;
        got.forEach((id) => { inventory[id] = (inventory[id] ?? 0) + 1; });
        return {
          ...s,
          inventory,
          moon: { lastOffer: day },
          owned: reward ? [...s.owned, reward] : s.owned,
          letters: reward
            ? [mkLetter(LUNA.from, LUNA.fromName, '🎑 まんげつの おくりもの', 'こんやは まんげつだったね！\nおだんごを おそなえしてくれて ありがとう。\nすてきな ごほうびを とどけたよ。\n\nルナより'), ...s.letters].slice(0, 30)
            : s.letters,
        };
      });
      sfx('gift');
      return { age, name: moonName(age), isFull, got, reward };
    },
  }), [state, setSave, showToast]);

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
}
