import React, {
  createContext, useCallback, useEffect, useMemo, useReducer, useRef, useState,
} from 'react';
import type { Area, Item, Letter, LetterMarks, PlayerKey, Pos, SaveV1, School, Screen, Slot } from '../types';
import { publishSchool, resolveSchool } from '../lib/school';
import { sfx, unlockAudio } from '../lib/sound';
import { freshSave, isSaveKey, lastRestored, loadSave, persist, storedRev } from '../lib/save';
import { earnedTotal, grantBonus, isMedalKey } from '../lib/medals';
import { findSecret } from '../lib/secret';
import { isSpentKey, loadSpent, spend, type SpendLedger, type SpendResult } from '../lib/spend';
import { feed } from '../lib/monster';
import {
  isConsumable, ITEM_BY_ID, WHEEL_TITLE,
  FAVORITE, GIFTS_PER_DAY, heartsOf, stampRewardsFor, EVERYDAY_GIFTS, nextBuildId,
} from '../lib/items';
import { FISH_PER_DAY, FISH_REWARDS, FISH_STUDY_BONUS } from '../lib/fish';
import { harvestOf, isRipe, plantOf, stageOf } from '../lib/farm';
import { FERT_OF, PLANT_BY_SEED, PLANT_REWARDS } from '../lib/plants';
import { dateKey } from '../lib/study';
import { type Constellation, STAR_REWARDS, tonightConstellation } from '../lib/stars';
import { isNearFull, moonAge, moonName } from '../lib/sky';
import { LUNA, mk as mkLetter } from '../lib/letters';
import { CASES, DETECTIVE_REWARDS, DETECTIVE_TITLE } from '../lib/detective';
import { seasonNow } from '../lib/items';
import { ORGAN_TITLE, SONGS } from '../lib/songs';
import { IMO_BY_ID, IMO_PER_DAY, IMO_REWARDS } from '../lib/yakiimo';
import { MICRO_TITLE, PLANKTON, PLANKTON_PER_DAY, PLANKTON_REWARDS, PLANKTON_STUDY_BONUS } from '../lib/plankton';

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
  /** school はけんすけ・みつきのときだけ使う（ほかはキャラで きまる） */
  pickPlayer(player: PlayerKey, school?: School): void;
  setSchool(school: School): void;
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
  /** オープニングを 見おわった */
  markOpeningSeen(): void;
  /** 名探偵あんり：しょうこを みつけた */
  detectiveFound(no: number, id: string): void;
  /** 名探偵あんり：ヒントを 1つ ひらく */
  detectiveHint(no: number): void;
  /** 名探偵あんり：じけん かいけつ。もらえた プレゼント・ごほうび・しょうごう */
  solveCase(no: number): { gift: string; reward: string | null; title: string | null } | null;
  /** オルガンの れんしゅうで 1きょく ひけた。はじめての曲なら true、ぜんぶ そろったら title も */
  markSongPlayed(id: string): { first: boolean; title: string | null };
  /** けんびきょう：きょう あと何回 ずかんに のせられるか */
  microLeft(studied: boolean): number;
  /** けんびきょう：プランクトンを ずかんに のせる（はじめての ものだけ 回数を つかう）。null＝きょうは もう のせられない */
  markPlankton(id: string, studied: boolean): { isNew: boolean; reward: string | null; title: string | null } | null;
  /** けんびきょう：じゅんびの てじゅんを 1回 できた */
  setMicroReady(): void;
  /** まいにちスタンプの ごほうびを うけとる。うけとったものの説明を返す */
  claimStamp(ym: string, days: number): string | null;
  /** がっこうの けいじばんの ひみつの あいことば。ok＝もらえた（n枚）／already＝もう もらった／ng＝ちがう */
  claimSecret(input: string): Promise<{ r: 'ok' | 'already' | 'ng'; n: number }>;
  /** たからばこを あける（その日1回）。出たプレゼントのID */
  openChest(day: string): string | null;
  /** gifts＝いっしょに とどく 家具（月の きねんしゃしん など） */
  deliverLetters(letters: Letter[], marks: LetterMarks, gifts?: string[]): void;
  readLetter(id: string): void;
  /** きょう あと何回 つれるか（studied＝きょう クイズを5もん やった） */
  fishLeft(studied: boolean): number;
  /** つれた さかなを きろくする。ずかんの ごほうびが あれば その家具ID */
  landFish(fishId: string, cm: number, studied: boolean): { isNew: boolean; best: boolean; reward: string | null } | null;
  plantSeed(plot: number, seedId: string): void;
  /** みずやり（1日1回）。はつがの スタートと 成長の 水の日数。あげられたら true */
  waterPlot(plot: number): boolean;
  /** ひりょうを あげる（はつがの あとだけ）。'early'＝まだ はつが していない */
  fertilize(plot: number, fertId: string): 'ok' | 'early' | 'same' | 'none';
  /** はこを かぶせる／はずす（日光の じっけん） */
  toggleBox(plot: number): void;
  /** はなを しらべた */
  markFlower(seedId: string): void;
  /** しゅうかく。quizOk＝まめクイズに せいかい（+1） */
  harvest(plot: number, quizOk?: boolean): HarvestResult | null;
  /** ハロウィンの おかし（その日 その子から1回）。もらえたら true */
  trickOrTreat(charKey: string): boolean;
  /** てんもんだいで 今夜の星座を見る。ずかんの ごほうびが あれば その家具ID */
  viewStars(): { constellation: Constellation; isNew: boolean; reward: string | null } | null;
  /** おつきみだいで おだんごを おそなえする（その日1回） */
  offerDango(): { age: number; name: string; isFull: boolean; got: string[]; reward: string | null } | null;
  /** やきいも やたい：なまの サツマイモを 1こ やく。gradeId＝できあがり（lib/yakiimo.ts） */
  bakeImo(gradeId: string): { count: number; isNew: boolean; reward: string | null } | null;
  /** やきいも やたい：きょう あと なん人 おきゃくさんが くるか */
  imoCustomersLeft(): number;
  /** やきいも やたい：おきゃくさんに やきいもを n こ わたす（なかよし +3・おれいの品 1つ） */
  serveImo(charKey: string, n: number): { thanks: string; heartsBefore: number; heartsAfter: number } | null;
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export const GameContext = createContext<GameApi | null>(null);

export interface HarvestResult { crop: string; count: number; seedBack: string | null; isNew: boolean; reward: string | null }

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [booted, setBooted] = useState(false);
  const saveRef = useRef(state.save);
  saveRef.current = state.save;

  // ── 保存は effect でだけ行う（reducer では書かない）──
  // ★古い画面（「もどる」で よみがえった ページ・止まっていた べつの タブ）が
  //   古いセーブで 上書きして、買った家が 消えたことがある（2026-09-26）。
  //   そこで 書くたびに rev を 1つ ふやし、localStorage の rev が 自分の知っている rev と ちがえば
  //   （＝ほかの画面が あとから書いた）上書きせずに 読み直す。
  const baseRev = useRef(state.save.rev);
  const fromDisk = useRef<SaveV1 | null>(state.save);
  const reloadSave = useCallback(() => {
    const s = loadSave();
    baseRev.current = s.rev;
    fromDisk.current = s;
    dispatch({ type: 'SET_SAVE', save: s });
  }, []);
  useEffect(() => {
    if (!booted) { setBooted(true); return; }
    if (fromDisk.current === state.save) return;   // 読んだ ばかりで かわっていない
    if (storedRev() !== baseRev.current) { reloadSave(); return; }
    const rev = baseRev.current + 1;
    if (persist({ ...state.save, rev })) baseRev.current = rev;
  }, [state.save, booted, reloadSave]);

  // クイズアプリが がっこう選びを とばせるように、しゅじんこうの がっこうを 共有キーへ写す
  useEffect(() => {
    publishSchool(state.save.player, state.save.school);
  }, [state.save.player, state.save.school]);

  // メダルの記録から もどした品が あれば しらせる（はじめの1回）
  useEffect(() => {
    if (!lastRestored.length) return;
    const names = lastRestored.map((id) => ITEM_BY_ID[id]?.emoji ?? '').join('');
    lastRestored.length = 0;
    dispatch({ type: 'TOAST', text: `${names} きえていた ものを もどしたよ` });
  }, []);

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
      if (isSaveKey(e.key) && storedRev() !== baseRev.current) reloadSave();
    };
    // 同じタブでクイズ→ゲームと移動した場合は storage が飛ばないので、戻ってきたときにも読み直す。
    // 止まっていた タブ・「もどる」で よみがえった ページ（pageshow persisted）では
    // storage が とどかないことがあるので、セーブも ここで 読み直す
    const onWake = () => {
      if (document.hidden) return;
      dispatch({ type: 'REFRESH_MEDALS' });
      if (storedRev() !== baseRev.current) reloadSave();
    };
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) onWake(); };

    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onWake);
    window.addEventListener('focus', onWake);
    window.addEventListener('pageshow', onShow);
    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onWake);
      window.removeEventListener('focus', onWake);
      window.removeEventListener('pageshow', onShow);
    };
  }, [reloadSave]);

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

    pickPlayer: (player, school) => setSave((s) => ({ ...s, player, school: resolveSchool(player, school ?? s.school ?? 'ena') })),

    setSchool: (school) => setSave((s) => ({ ...s, school: resolveSchool(s.player, school) })),

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

    markOpeningSeen: () => setSave((s) => (s.openingSeen ? s : { ...s, openingSeen: true })),

    detectiveFound: (no, id) =>
      setSave((s) => {
        const cur = s.detective.found[no] ?? [];
        if (cur.includes(id)) return s;
        return { ...s, detective: { ...s.detective, found: { ...s.detective.found, [no]: [...cur, id] } } };
      }),

    detectiveHint: (no) =>
      setSave((s) => ({ ...s, detective: { ...s.detective, hint: { ...s.detective.hint, [no]: (s.detective.hint[no] ?? 0) + 1 } } })),

    solveCase: (no) => {
      const cur = saveRef.current;
      if (cur.detective.solved.includes(no)) return null;
      const n = cur.detective.solved.length + 1;
      const gift = pick(EVERYDAY_GIFTS);
      const reward = DETECTIVE_REWARDS.find((r) => r.solved === n && !cur.owned.includes(r.item))?.item ?? null;
      const title = n >= CASES.length && !cur.titles.includes(DETECTIVE_TITLE) ? DETECTIVE_TITLE : null;
      setSave((s) => {
        if (s.detective.solved.includes(no)) return s;
        return {
          ...s,
          detective: { ...s.detective, solved: [...s.detective.solved, no] },
          inventory: { ...s.inventory, [gift]: (s.inventory[gift] ?? 0) + 1 },
          owned: reward && !s.owned.includes(reward) ? [...s.owned, reward] : s.owned,
          titles: title && !s.titles.includes(title) ? [...s.titles, title] : s.titles,
        };
      });
      sfx('reveal');
      return { gift, reward, title };
    },

    markSongPlayed: (id) => {
      const cur = saveRef.current;
      if (cur.organ.played.includes(id)) return { first: false, title: null };
      const all = SONGS.every((x) => x.id === id || cur.organ.played.includes(x.id));
      const title = all && !cur.titles.includes(ORGAN_TITLE) ? ORGAN_TITLE : null;
      setSave((s) => {
        if (s.organ.played.includes(id)) return s;
        return {
          ...s,
          organ: { played: [...s.organ.played, id] },
          titles: title && !s.titles.includes(title) ? [...s.titles, title] : s.titles,
        };
      });
      return { first: true, title };
    },

    microLeft: (studied) => {
      const m = saveRef.current.micro;
      const max = PLANKTON_PER_DAY + (studied ? PLANKTON_STUDY_BONUS : 0);
      return Math.max(0, max - (m.day === dateKey() ? m.today : 0));
    },

    markPlankton: (id, studied) => {
      const cur = saveRef.current;
      if (cur.micro.dex.includes(id)) return { isNew: false, reward: null, title: null };
      const day = dateKey();
      const used = cur.micro.day === day ? cur.micro.today : 0;
      if (used >= PLANKTON_PER_DAY + (studied ? PLANKTON_STUDY_BONUS : 0)) return null;
      const kinds = cur.micro.dex.length + 1;
      const reward = PLANKTON_REWARDS.find((r) => r.kinds <= kinds && !cur.owned.includes(r.item))?.item ?? null;
      const title = kinds >= PLANKTON.length && !cur.titles.includes(MICRO_TITLE) ? MICRO_TITLE : null;
      setSave((s) => {
        if (s.micro.dex.includes(id)) return s;
        const today = s.micro.day === day ? s.micro.today : 0;
        return {
          ...s,
          micro: { ...s.micro, dex: [...s.micro.dex, id], day, today: today + 1 },
          owned: reward && !s.owned.includes(reward) ? [...s.owned, reward] : s.owned,
          titles: title && !s.titles.includes(title) ? [...s.titles, title] : s.titles,
        };
      });
      sfx('catch');
      return { isNew: true, reward, title };
    },

    setMicroReady: () => setSave((s) => (s.micro.ready ? s : { ...s, micro: { ...s.micro, ready: true } })),

    toggleFollow: (charKey) =>
      setSave((s) => {
        const prev = s.friendsPlay[charKey] ?? { pts: 0, day: '', today: 0, wear: null };
        return { ...s, friendsPlay: { ...s.friendsPlay, [charKey]: { ...prev, followOff: !prev.followOff } } };
      }),

    claimSecret: async (input) => {
      const b = await findSecret(input);
      if (!b) return { r: 'ng', n: 0 };
      const r = grantBonus(b.id, b.month, b.n);
      dispatch({ type: 'REFRESH_MEDALS' });
      return { r: r === 'ok' ? 'ok' : r === 'already' ? 'already' : 'ng', n: b.n };
    },

    claimStamp: (ym, days) => {
      const r = stampRewardsFor(Number(ym.split('-')[1])).find((x) => x.days === days);
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

    deliverLetters: (letters, marks, gifts = []) => {
      setSave((s) => ({
        ...s,
        letters: [...letters, ...s.letters].slice(0, 30),
        letterMarks: marks,
        owned: [...s.owned, ...gifts.filter((id) => !s.owned.includes(id))],
      }));
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
        const day = dateKey();
        // イネは 田んぼ（はじめから 水の中）
        plots[plot] = PLANT_BY_SEED[seedId]?.paddy ? { seed: seedId, at: day, watered: day, wetAt: day, wetDays: 1 } : { seed: seedId, at: day, watered: '' };
        return { ...s, inventory, farm: { ...s.farm, plots } };
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
        if (q) plots[plot] = { ...q, watered: day, wetAt: q.wetAt || day, wetDays: (q.wetDays ?? 0) + 1 };
        return { ...s, farm: { ...s.farm, plots } };
      });
      sfx('water');
      return true;
    },

    fertilize: (plot, fertId) => {
      const cur = saveRef.current;
      const p = cur.farm.plots[plot];
      const f = FERT_OF[fertId];
      if (!p || !f || (cur.inventory[fertId] ?? 0) <= 0) return 'none';
      if (stageOf(p) < 1) return 'early';
      if ((p.fert ?? []).includes(f)) return 'same';
      setSave((s) => {
        const q = s.farm.plots[plot];
        if (!q) return s;
        const left = (s.inventory[fertId] ?? 0) - 1;
        const inventory = { ...s.inventory };
        if (left > 0) inventory[fertId] = left; else delete inventory[fertId];
        const plots = [...s.farm.plots];
        plots[plot] = { ...q, fert: [...(q.fert ?? []), f] };
        return { ...s, inventory, farm: { ...s.farm, plots } };
      });
      sfx('water');
      return 'ok';
    },

    toggleBox: (plot) => {
      setSave((s) => {
        const q = s.farm.plots[plot];
        if (!q) return s;
        const plots = [...s.farm.plots];
        plots[plot] = { ...q, box: !q.box };
        return { ...s, farm: { ...s.farm, plots } };
      });
    },

    markFlower: (seedId) => {
      if (saveRef.current.farm.flowers.includes(seedId)) return;
      setSave((s) => (s.farm.flowers.includes(seedId) ? s : { ...s, farm: { ...s.farm, flowers: [...s.farm.flowers, seedId] } }));
    },

    harvest: (plot, quizOk) => {
      const cur = saveRef.current;
      const p = cur.farm.plots[plot];
      const crop = p ? ITEM_BY_ID[p.seed]?.crop : undefined;
      if (!p || !crop || !isRipe(p, stageOf(p))) return null;
      const { count: base, seedBack } = harvestOf(p);
      const count = base + (quizOk ? 1 : 0);
      const plant = plantOf(p);
      const isNew = !!plant && !cur.farm.dex.includes(p.seed);
      const kinds = cur.farm.dex.length + (isNew ? 1 : 0);
      const reward = plant ? PLANT_REWARDS.find((r) => r.kinds <= kinds && !cur.owned.includes(r.item))?.item ?? null : null;
      setSave((s) => {
        if (!s.farm.plots[plot]) return s;
        const plots = [...s.farm.plots];
        plots[plot] = null;
        const inventory = { ...s.inventory, [crop]: (s.inventory[crop] ?? 0) + count };
        if (seedBack) inventory[p.seed] = (inventory[p.seed] ?? 0) + 1;
        return {
          ...s,
          farm: { ...s.farm, plots, dex: isNew && !s.farm.dex.includes(p.seed) ? [...s.farm.dex, p.seed] : s.farm.dex },
          inventory,
          owned: reward && !s.owned.includes(reward) ? [...s.owned, reward] : s.owned,
        };
      });
      sfx('chest');
      return { crop, count, seedBack: seedBack ? p.seed : null, isNew, reward };
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

    bakeImo: (gradeId) => {
      const cur = saveRef.current;
      const grade = IMO_BY_ID[gradeId];
      if (!grade) return null;
      if ((cur.inventory.gf_rawimo ?? 0) <= 0) { showToast('なまの サツマイモが ないよ', 'ng'); return null; }
      const isNew = !cur.imo.dex.includes(gradeId);
      const kinds = cur.imo.dex.length + (isNew ? 1 : 0);
      const reward = IMO_REWARDS.find((r) => r.kinds <= kinds && !cur.owned.includes(r.item))?.item ?? null;
      setSave((s) => {
        const inventory = { ...s.inventory };
        const left = (inventory.gf_rawimo ?? 0) - 1;
        if (left > 0) inventory.gf_rawimo = left; else delete inventory.gf_rawimo;
        if (grade.count > 0) inventory.gf_imo = (inventory.gf_imo ?? 0) + grade.count;
        const all = reward === 'fn_imokama';
        return {
          ...s,
          inventory,
          imo: { ...s.imo, dex: s.imo.dex.includes(gradeId) ? s.imo.dex : [...s.imo.dex, gradeId] },
          owned: reward && !s.owned.includes(reward) ? [...s.owned, reward] : s.owned,
          letters: all
            ? [mkLetter(LUNA.from, LUNA.fromName, '🍠 やきいも めいじん', 'やきいもを 5しゅるい ぜんぶ やけたね！\nこげいもも、きんいろも、ぜんぶ たいせつな きろくだよ。\nいしやきがまを とどけたから、しまに おいてね。\n\nルナより'), ...s.letters].slice(0, 30)
            : s.letters,
        };
      });
      sfx(grade.count > 0 ? (isNew ? 'star' : 'gift') : 'ng');
      return { count: grade.count, isNew, reward };
    },

    imoCustomersLeft: () => {
      const m = saveRef.current.imo;
      return Math.max(0, IMO_PER_DAY - (m.day === dateKey() ? m.served : 0));
    },

    serveImo: (charKey, n) => {
      const cur = saveRef.current;
      const day = dateKey();
      const served = cur.imo.day === day ? cur.imo.served : 0;
      if (served >= IMO_PER_DAY) { showToast('きょうの おみせは おしまい', 'ng'); return null; }
      if ((cur.inventory.gf_imo ?? 0) < n) { showToast('やきいもが たりないよ', 'ng'); return null; }
      const thanks = pick(EVERYDAY_GIFTS);
      const prev = cur.friendsPlay[charKey] ?? { pts: 0, day: todayStr(), today: 0, wear: null };
      const pts = prev.pts + 3;
      setSave((s) => {
        const inventory = { ...s.inventory };
        const left = (inventory.gf_imo ?? 0) - n;
        if (left > 0) inventory.gf_imo = left; else delete inventory.gf_imo;
        inventory[thanks] = (inventory[thanks] ?? 0) + 1;
        const fp = s.friendsPlay[charKey] ?? prev;
        return {
          ...s,
          inventory,
          imo: { ...s.imo, day, served: (s.imo.day === day ? s.imo.served : 0) + 1 },
          friendsPlay: { ...s.friendsPlay, [charKey]: { ...fp, pts: fp.pts + 3 } },
        };
      });
      const heartsBefore = heartsOf(prev.pts);
      const heartsAfter = heartsOf(pts);
      sfx(heartsAfter > heartsBefore ? 'heart' : 'gift');
      return { thanks, heartsBefore, heartsAfter };
    },
  }), [state, setSave, showToast]);

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
}
