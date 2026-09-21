import React, {
  createContext, useCallback, useEffect, useMemo, useReducer, useRef, useState,
} from 'react';
import type { Item, PlayerKey, Pos, SaveV1, Screen, Slot } from '../types';
import { freshSave, isSaveKey, loadSave, persist } from '../lib/save';
import { earnedTotal, isMedalKey } from '../lib/medals';
import { isSpentKey, loadSpent, spend, type SpendLedger, type SpendResult } from '../lib/spend';
import { feed } from '../lib/monster';
import { isConsumable, ITEM_BY_ID, BATTLE_REWARDS } from '../lib/items';

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
  placeFurniture(itemId: string, x: number, y: number): void;
  moveFurniture(uid: string, x: number, y: number): void;
  storeFurniture(uid: string): void;
  winBattle(): { furniture: string[]; titles: string[] };
  loseBattle(): void;
  spendFullness(n: number): void;
  resetAll(): void;
  showToast(text: string, tone?: 'ok' | 'ng'): void;
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

    placeFurniture: (itemId, x, y) =>
      setSave((s) => ({
        ...s,
        placed: [...s.placed, { uid: `${itemId}-${Date.now().toString(36)}`, id: itemId, x, y }],
      })),

    moveFurniture: (uid, x, y) =>
      setSave((s) => ({ ...s, placed: s.placed.map((p) => (p.uid === uid ? { ...p, x, y } : p)) })),

    storeFurniture: (uid) => setSave((s) => ({ ...s, placed: s.placed.filter((p) => p.uid !== uid) })),

    winBattle: () => {
      const cur = saveRef.current;
      const wins = cur.battle.wins + 1;
      const hit = BATTLE_REWARDS.filter((r) => r.wins === wins);
      const furniture = hit.map((r) => r.furniture).filter((id) => !cur.owned.includes(id));
      const titles = hit.map((r) => r.title).filter((t) => !cur.titles.includes(t));

      setSave((s) => ({
        ...s,
        battle: { ...s.battle, wins, lastAt: Date.now() },
        monster: { ...s.monster, exp: s.monster.exp + 30 },
        owned: [...s.owned, ...furniture],
        titles: [...s.titles, ...titles],
      }));
      return { furniture, titles };
    },

    loseBattle: () =>
      setSave((s) => ({ ...s, battle: { ...s.battle, losses: s.battle.losses + 1, lastAt: Date.now() } })),

    // バトル1回ぶんの満腹度を減らす。lastFedAt は動かさない（空腹判定は時刻ベースのまま）
    spendFullness: (n) =>
      setSave((s) => ({ ...s, monster: { ...s.monster, fullness: Math.max(0, s.monster.fullness - n) } })),

    resetAll: () => {
      const f = freshSave();
      dispatch({ type: 'SET_SAVE', save: f });
      showToast('しまを さいしょから はじめたよ');
    },

    showToast,
  }), [state, setSave, showToast]);

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
}
