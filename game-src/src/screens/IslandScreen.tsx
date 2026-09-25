import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Shell, HpBar } from '../components/Shell';
import { DPad, type Axis } from '../components/DPad';
import { IslandGround, FOREST_ISLET } from '../components/IslandStage';
import { KidSVG, PALETTES } from '../components/KidSVG';
import { CharSVG } from '../components/CharSVG';
import { EggSVG } from '../components/EggSVG';
import { FurnitureSVG } from '../components/FurnitureSVG';
import { PhotoFrame } from '../components/PhotoFrame';
import { OpeningScreen } from './OpeningScreen';
import { BuildingSVG, BUILDING_SPOTS, SCHOOL_FRONT, spotInArea } from '../components/BuildingSVG';
import { useGame } from '../state/useGame';
import { CHAR_NAMES } from '../lib/chars';
import {
  ITEM_BY_ID, ITEMS, FAVORITE, FOLLOW_HEARTS, GIFTS_PER_DAY, expansionOf, heartsOf, seasonNow, nextBuildId, placeableIn,
} from '../lib/items';
import {
  BOUNDS, ISLAND_H, ISLAND_W, MONSTER_SPEED, PLAYER_SPEED,
  clampToIsland, dist, isNear, setArea, stepByAxis, stepToward, wanderTarget, DOORS, ENTRY, WORLD, isWideArea, MAIN_WALK_ELLIPSE,
} from '../lib/island';
import { displayFullness, levelOf, mood, moodLine } from '../lib/monster';
import { isFriendsKey, readFriends, readSeenLevels, visitorsFor, writeSeenLevels, type Friend } from '../lib/friends';
import { SkyLayer } from '../components/SkyLayer';
import { starInfo } from '../lib/starsky';
import { moonAge as calcMoonAge, moonName, timeOfDay, weatherFor } from '../lib/sky';
import { cycleSoundMode, setBgmNight, sfx, soundMode, voice, type SoundMode } from '../lib/sound';
import { answeredByDate, daysThisWeek, stampDays, studiedToday } from '../lib/study';
import { buildLetters } from '../lib/letters';
import { photoMonthOf, stampRewardsFor } from '../lib/items';
import type { Area, Letter, Pos } from '../types';
import { EastGround, RoomGround } from '../components/AreaStages';
import { FishingModal } from '../components/FishingModal';
import { FarmPatch } from '../components/FarmPatch';
import { FarmModal } from '../components/FarmModal';
import { StarsModal } from '../components/StarsModal';
import { MoonViewModal } from '../components/MoonViewModal';
import { costumeOf, halloweenNight, isHalloween } from '../lib/events';
import { FARM_POS, isRipe, stageOf } from '../lib/farm';

const SAVE_DEBOUNCE = 600;
const MAX_DT = 0.05; // タブ復帰で瞬間移動しないように、1フレームの進みを上限で止める

// 教科キャラの最初の立ち位置（島の中にばらけさせる）
const FRIEND_SPAWNS: Pos[] = [
  { x: 0.24, y: 0.46 }, { x: 0.76, y: 0.48 }, { x: 0.30, y: 0.80 }, { x: 0.72, y: 0.80 },
  { x: 0.50, y: 0.74 }, { x: 0.40, y: 0.52 }, { x: 0.60, y: 0.58 },
];
const FRIEND_NEAR = 0.1;
const FOLLOW_RANGE = 0.35;   // ♥3いじょうの子は、この距離より近いと ついてくる

// 教科キャラの きせかえを頭のあたりに重ねる位置（キャラの足もとが原点）
const WEAR_POS: Record<string, { y: number; size: number }> = {
  fw_silk: { y: -44, size: 34 },
  fw_flower: { y: -42, size: 28 },
  fw_glass: { y: -24, size: 26 },
  fw_scarf: { y: -4, size: 28 },
  fw_pumpkin: { y: -44, size: 30 },
  fw_leaf: { y: -40, size: 24 },
  fw_gold: { y: -44, size: 30 },
  fw_moon: { y: -46, size: 28 },
  fw_acorn: { y: -42, size: 26 },
  fw_santa: { y: -44, size: 32 },
};

const GREET = [
  'はじめまして！ よろしくね',
  'また きてくれたの？ うれしい',
  'きみと あそぶの たのしい！',
  'いっしょに おさんぽ しよう！',
  'きみは だいじな ともだち！',
  'ずっと なかよしだよ💖',
];

type Bubble = { char: string; text: string; heart: boolean; key: number };

// たからばこ と ポストの場所（割合）
const CHEST_POS = { x: 0.30, y: 0.86 };
const MAIL_POS = { x: 0.58, y: 0.72 };
// さんばしの さき（つりが できる所）
const PIER_POS = { x: 0.36, y: -0.05 };   // 広げた島の 上の海岸
// ハロウィンの ランタン（IslandStage の 10月の かぼちゃと おなじ場所。夜に光らせる）
const LANTERNS: [number, number][] = [[520, 725], [760, 690], [430, 330], [690, 590], [870, 470]];
const TAP_LINES = ['なあに？', 'えへへ', 'ぴょん！', 'くすぐったいよ〜', 'いっしょに あそぼ！'];
const WISHES = ['テストで 100てん とれますように', 'みんなと ずっと なかよし', 'しまが もっと にぎやかに なりますように', 'あしたも いい ひに なりますように'];
const SOUND_LABEL: Record<SoundMode, string> = { sfx: '🔊 こうかおん', all: '🎵 おんがく', off: '🔇 おとなし' };

const MAX_ON_ISLAND = 7;
// おうちの中に ついてきた子の 立ち位置
const HOUSE_SPAWNS: Pos[] = [{ x: 0.32, y: 0.72 }, { x: 0.42, y: 0.8 }, { x: 0.3, y: 0.86 }, { x: 0.5, y: 0.74 }];
const AREA_TITLE: Record<Area, string> = { main: '🏝 アンリノ島', east: '🌸 はなばたけの しま', house: '🏠 おうちの なか' };   // 教科キャラを一度に出す数のめやす（主役＋あそびに来る住人）

/** カメラ（main だけ）：主人公を まんなかに、世界の はしで とめる。px */
function camTarget(p: Pos): Pos {
  if (!isWideArea()) return { x: 0, y: 0 };
  const cx = Math.max(WORLD.x, Math.min(WORLD.x + WORLD.w - ISLAND_W, p.x * ISLAND_W - ISLAND_W / 2));
  const cy = Math.max(WORLD.y, Math.min(WORLD.y + WORLD.h - ISLAND_H, p.y * ISLAND_H - ISLAND_H / 2));
  return { x: cx, y: cy };
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

type Mode = { kind: 'walk' } | { kind: 'place'; itemId: string } | { kind: 'move'; uid: string };

export function IslandScreen() {
  const g = useGame();
  const { save, now } = g;
  const monster = save.monster;

  const stageRef = useRef<SVGSVGElement | null>(null);
  const playerNodeRef = useRef<SVGGElement | null>(null);
  const monsterNodeRef = useRef<SVGGElement | null>(null);
  const skyRef = useRef<SVGGElement | null>(null);   // 空は 画面に くっつける（カメラぶん ずらす）
  const cam = useRef<Pos | null>(null);

  const playerPos = useRef<Pos>(save.pos);
  const monsterPos = useRef<Pos>(monster.pos);
  const monsterTarget = useRef<Pos>(monster.wander);
  const axis = useRef<Axis>({ x: 0, y: 0 });
  const tapTarget = useRef<Pos | null>(null);
  const flip = useRef(false);
  const walkPhase = useRef(0);
  const dirtyAt = useRef(0);

  const [mode, setMode] = useState<Mode>({ kind: 'walk' });
  const [feedOpen, setFeedOpen] = useState(false);
  const [order, setOrder] = useState('');
  const [walking, setWalking] = useState(false);
  const [giftFor, setGiftFor] = useState<Friend | null>(null);
  const [wearFor, setWearFor] = useState<Friend | null>(null);
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [rosterOpen, setRosterOpen] = useState(false);
  const [jump, setJump] = useState<{ id: string; key: number } | null>(null);
  const [stampOpen, setStampOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [reading, setReading] = useState<Letter | null>(null);
  const [snd, setSnd] = useState<SoundMode>(soundMode());
  const [studyTick, setStudyTick] = useState(0);
  const [fishOpen, setFishOpen] = useState(false);
  const [farmOpen, setFarmOpen] = useState(false);
  const [starsOpen, setStarsOpen] = useState(false);
  const [moonViewOpen, setMoonViewOpen] = useState(false);
  // 夜空の 星を うごかす（1分ごと）
  const [skyMin, setSkyMin] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setSkyMin((n) => n + 1), 60000);
    return () => window.clearInterval(t);
  }, []);
  // タップで えらんだ子（ついてくる子が そばに いても、ほかの子を えらべるように）
  const [picked, setPicked] = useState<string | null>(null);
  const [forestAsk, setForestAsk] = useState(false);

  // いる場所（main／east／house）と、建てたもので島が広がる。clampToIsland などが見る BOUNDS をここで切りかえる
  const area: Area = save.area === 'house' && !save.buildings.includes('bd_house') ? 'main'
    : save.area === 'east' && !save.buildings.includes('bd_bridge') ? 'main' : save.area;
  const expansion = expansionOf(save.buildings);
  setArea(area, expansion);
  const hasBridge = save.buildings.includes('bd_bridge');
  const builtSpots = area === 'house' ? [] : save.buildings.filter((id) => spotInArea(id, area));
  const nextBuild = ITEM_BY_ID[nextBuildId(save.buildings) ?? ''];
  const [fade, setFade] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [deskOpen, setDeskOpen] = useState(false);

  // ── クイズで育てている教科キャラ（その月の主役と前の月の住人）。クイズ側の書き出しを読むだけ ──
  const [snap, setSnap] = useState(() => readFriends());
  // 主役＝いまの月の子。住人（前の月の子）は毎日何体かだけ あそびに来る（画面がいっぱいにならないように）
  const day = todayKey();
  // 場所ごとに だれが いるか：main＝主役（はしが ないうちは住人も）、east＝あそびに来た住人、house＝♥3いじょうの ついてくる子
  const friends = useMemo(() => {
    const cur = snap.friends.filter((f) => f.month === snap.currentMonth);
    const residents = snap.friends.filter((f) =>
      f.month !== snap.currentMonth && (f.month < snap.currentMonth || f.level > 1));
    const vis = visitorsFor(residents, Math.max(3, MAX_ON_ISLAND - cur.length), day);
    if (area === 'house') {
      return [...cur, ...vis].filter((f) =>
        f.level > 1 && heartsOf(save.friendsPlay[f.char]?.pts ?? 0) >= FOLLOW_HEARTS && !save.friendsPlay[f.char]?.followOff);
    }
    if (area === 'east') return vis;
    return hasBridge ? cur : [...cur, ...vis];
  }, [snap, day, area, hasBridge, save.friendsPlay]);
  const isCurrent = (f: Friend) => f.month === snap.currentMonth;
  const snapRef = useRef(snap);
  snapRef.current = snap;
  const friendsRef = useRef(friends);
  friendsRef.current = friends;
  const friendPos = useRef<Record<string, Pos>>({});
  const friendTarget = useRef<Record<string, Pos>>({});
  const friendNodes = useRef<Record<string, SVGGElement | null>>({});
  // 場所を移ったら、キャラの立ち位置は その場所で あたらしく決める
  const lastArea = useRef(area);
  if (lastArea.current !== area) {
    friendPos.current = {};
    friendTarget.current = {};
    lastArea.current = area;
    cam.current = null;
  }
  if (!cam.current) cam.current = camTarget(playerPos.current);
  if (!isWideArea()) cam.current = { x: 0, y: 0 };
  const camNow = cam.current;
  friends.forEach((f, i) => {
    if (!friendPos.current[f.id]) {
      const spawns = area === 'house' ? HOUSE_SPAWNS : FRIEND_SPAWNS;
      const p = spawns[i % spawns.length];
      friendPos.current[f.id] = p;
      friendTarget.current[f.id] = wanderTarget(p);
    }
  });

  // クイズから戻ってきたとき・別タブで⭐が増えたときに読み直す
  useEffect(() => {
    const reload = () => { setSnap(readFriends()); setStudyTick((n) => n + 1); };
    const onStorage = (e: StorageEvent) => { if (isFriendsKey(e.key)) reload(); };
    const onVis = () => { if (document.visibilityState === 'visible') reload(); };
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', reload);
    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', reload);
    };
  }, []);

  // ── 空（本当の時刻・その日のおてんき・月の形）──
  const tod = timeOfDay();
  const weather = weatherFor(day);
  const moonAge = calcMoonAge();
  setBgmNight(tod === 'night');

  // ── まいにちスタンプ（クイズの記録を読むだけ）──
  const byDate = useMemo(() => answeredByDate(), [day, studyTick]);
  const nowD = new Date();
  const ym = `${nowD.getFullYear()}-${nowD.getMonth() + 1}`;
  const stamps = stampDays(nowD.getFullYear(), nowD.getMonth() + 1, byDate);
  const studied = studiedToday(byDate);
  const showChest = studied && save.lastChest !== day;
  // はたけの そだち（クイズの記録から計算）と ハロウィン
  const farmStages = save.farm.plots.map((p) => (p ? stageOf(p, byDate) : 0));
  const hw = isHalloween();
  const hwNight = halloweenNight();
  const hasPier = save.buildings.includes('bd_pier');
  const unread = save.letters.filter((l) => !l.read).length;

  // ── おてがみ：島を開いたとき・クイズから戻ったときに、前回からの変化を見て届ける ──
  const saveRef2 = useRef(save);
  saveRef2.current = save;
  const lastMarks = useRef<unknown>(null);
  const [monthBanner, setMonthBanner] = useState<string | null>(null);
  const [openingOpen, setOpeningOpen] = useState(false);
  useEffect(() => {
    const cur = saveRef2.current;
    // 同じ記録から2回 手紙を作らない（開発中の二重実行・すばやい再描画でも1回だけ）
    const sig = JSON.stringify([cur.letterMarks, snap.currentMonth, snap.friends.map((f) => [f.id, f.level, f.n]), stamps.length, ym]);
    if (lastMarks.current === sig) return;
    lastMarks.current = sig;
    const r = buildLetters(cur.letterMarks, {
      friends: snap.friends,
      playerName: cur.player ? PALETTES[cur.player].name : '',
      stampCount: stamps.length,
      ym,
      weekDays: daysThisWeek(new Date(), byDate),
      halloween: isHalloween(),
      currentMonth: snap.currentMonth,
      stampDaysOf: (m) => stampDays(Number(m.slice(0, 4)), Number(m.slice(4)), byDate).length,
    });
    if (r.newMonth) setMonthBanner(r.newMonth);
    if (r.letters.length || JSON.stringify(r.marks) !== JSON.stringify(cur.letterMarks)) {
      gRef.current.deliverLetters(r.letters, r.marks, r.gifts);
      if (r.letters.length) gRef.current.showToast(`💌 おてがみが ${r.letters.length}つう とどいたよ！`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap, stamps.length, ym]);

  // 前に島で見たときより育っていたら知らせる（はじめて会ったときは覚えるだけ）
  useEffect(() => {
    const all = snap.friends;
    if (!all.length) return;
    const seen = readSeenLevels();
    const grown = all.filter((f) => seen[f.char] && f.level > seen[f.char]);
    all.forEach((f) => { seen[f.char] = Math.max(seen[f.char] || 0, f.level); });
    writeSeenLevels(seen);
    if (grown.length) {
      gRef.current.showToast(grown.map((f) => `🎉 ${f.name}が Lv.${f.level} に そだった！`).join('　'));
    }
  }, [snap]);

  const fullness = displayFullness(monster, now);
  const mo = mood(monster, now);
  const level = levelOf(monster.exp);
  const monsterName = monster.charKey ? CHAR_NAMES[monster.charKey] : 'たまご';
  const playerName = save.player ? PALETTES[save.player].name : '';

  const foods = useMemo(
    () => ITEMS.filter((i) => (i.kind === 'food' || i.kind === 'snack') && (save.inventory[i.id] ?? 0) > 0),
    [save.inventory],
  );
  // いまの場所に置ける かぐ（へやのかぐは おうちの中だけ、そとのかぐは そとだけ。トロフィーは どこでも）
  const unplaced = useMemo(
    () => save.owned.filter((id) => placeableIn(ITEM_BY_ID[id], area) && !save.placed.some((p) => p.id === id)),
    [save.owned, save.placed, area],
  );
  const placedHere = useMemo(() => save.placed.filter((p) => (p.area ?? 'main') === area), [save.placed, area]);

  // ★ループから参照するものは ref に逃がす。
  //   これらを useEffect の依存に入れると、保存→再レンダー→ループ再起動→保存… の無限ループになる。
  const gRef = useRef(g);
  gRef.current = g;
  const stageRefState = useRef({
    eggStage: monster.stage === 'egg', placed: placedHere, play: save.friendsPlay,
    school: area === 'main' && save.buildings.includes('bd_school'), built: builtSpots,
  });
  stageRefState.current = {
    eggStage: monster.stage === 'egg', placed: placedHere, play: save.friendsPlay,
    school: area === 'main' && save.buildings.includes('bd_school'), built: builtSpots,
  };
  const committed = useRef<{ p: Pos; m: Pos } | null>(null);

  // セーブ中の位置が外から変わった場合（他タブ・リセット）だけ追従する。
  // 自分で保存した値なら何もしない（ループと取り合いにならないように）
  useEffect(() => {
    if (committed.current && committed.current.p === save.pos) return;
    playerPos.current = clampToIsland(save.pos);
  }, [save.pos]);
  useEffect(() => {
    if (committed.current && committed.current.m === monster.pos) return;
    monsterPos.current = clampToIsland(monster.pos);
    monsterTarget.current = clampToIsland(monster.wander);
  }, [monster.pos, monster.wander]);

  const commit = useCallback(() => {
    const p = playerPos.current;
    const m = monsterPos.current;
    committed.current = { p, m };
    gRef.current.setPos(p);
    gRef.current.setMonsterPos(m, monsterTarget.current);
  }, []);

  // ── メインループ。座標は ref のまま DOM に直接書くので、毎フレームの再レンダーはしない ──
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastOrder = '';

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, MAX_DT);
      last = t;

      // 主人公
      const a = axis.current;
      let moved = false;
      if (a.x || a.y) {
        tapTarget.current = null;
        const next = stepByAxis(playerPos.current, a.x, a.y, PLAYER_SPEED, dt);
        moved = next.x !== playerPos.current.x || next.y !== playerPos.current.y;
        if (a.x !== 0) flip.current = a.x < 0;
        playerPos.current = next;
      } else if (tapTarget.current) {
        const before = playerPos.current;
        const { pos, arrived } = stepToward(before, tapTarget.current, PLAYER_SPEED, dt);
        if (pos.x !== before.x) flip.current = pos.x < before.x;
        moved = pos.x !== before.x || pos.y !== before.y;
        playerPos.current = pos;
        if (arrived) tapTarget.current = null;
      }

      // モンスターは数秒おきに近くをうろうろする
      if (!stageRefState.current.eggStage) {
        const { pos, arrived } = stepToward(monsterPos.current, monsterTarget.current, MONSTER_SPEED, dt);
        monsterPos.current = pos;
        if (arrived && Math.random() < 0.012) monsterTarget.current = wanderTarget(pos);
      }

      // 教科キャラもうろうろする。Lv.1（たまご）はその場でじっとしている。
      // ♥3いじょうの子は近くにいると主人公についてくる。がっこうがあると、ときどき学校の前に集まる
      friendsRef.current.forEach((f, i) => {
        const cur = friendPos.current[f.id];
        if (!cur) return;
        if (f.level > 1) {
          const hearts = heartsOf(stageRefState.current.play[f.char]?.pts ?? 0);
          const pp = playerPos.current;
          if (hearts >= FOLLOW_HEARTS && !stageRefState.current.play[f.char]?.followOff && dist(cur, pp) < FOLLOW_RANGE) {
            const spot = clampToIsland({ x: pp.x + (i % 2 ? 0.07 : -0.07), y: pp.y + 0.015 * (i - 1.5) });
            if (dist(cur, spot) > 0.02) {
              friendPos.current[f.id] = clampToIsland(stepToward(cur, spot, MONSTER_SPEED * 3, dt).pos);
            }
            friendTarget.current[f.id] = friendPos.current[f.id];
          } else {
            const { pos, arrived } = stepToward(cur, friendTarget.current[f.id] ?? cur, MONSTER_SPEED, dt);
            friendPos.current[f.id] = clampToIsland(pos);
            if (arrived && Math.random() < 0.01) {
              friendTarget.current[f.id] = stageRefState.current.school && Math.random() < 0.35
                ? clampToIsland({ x: SCHOOL_FRONT.x + (i - 1.5) * 0.05, y: SCHOOL_FRONT.y + 0.02 })
                : wanderTarget(pos);
            }
          }
        }
        const node = friendNodes.current[f.id];
        const fp = friendPos.current[f.id];
        if (node) node.setAttribute('transform', `translate(${fp.x * ISLAND_W} ${fp.y * ISLAND_H})`);
      });

      // 安全網。なにがあっても島の外には出さない
      playerPos.current = clampToIsland(playerPos.current);
      monsterPos.current = clampToIsland(monsterPos.current);

      if (moved) {
        walkPhase.current += dt * 11;
        dirtyAt.current = t;
      }

      // カメラ（main）：主人公に ついていく
      if (isWideArea() && cam.current) {
        const tg = camTarget(playerPos.current);
        const k = Math.min(1, dt * 6);
        const nx = cam.current.x + (tg.x - cam.current.x) * k;
        const ny = cam.current.y + (tg.y - cam.current.y) * k;
        if (Math.abs(nx - cam.current.x) > 0.05 || Math.abs(ny - cam.current.y) > 0.05) {
          cam.current = { x: nx, y: ny };
          stageRef.current?.setAttribute('viewBox', `${nx} ${ny} ${ISLAND_W} ${ISLAND_H}`);
          skyRef.current?.setAttribute('transform', `translate(${nx} ${ny})`);
        }
      }

      // DOM に反映
      const bob = moved ? Math.abs(Math.sin(walkPhase.current)) * 7 : 0;
      if (playerNodeRef.current) {
        playerNodeRef.current.setAttribute(
          'transform',
          `translate(${playerPos.current.x * ISLAND_W} ${playerPos.current.y * ISLAND_H - bob}) scale(${flip.current ? -1 : 1} 1)`,
        );
      }
      if (monsterNodeRef.current) {
        monsterNodeRef.current.setAttribute(
          'transform',
          `translate(${monsterPos.current.x * ISLAND_W} ${monsterPos.current.y * ISLAND_H})`,
        );
      }

      // 前後関係（Yソート）は、並び順が変わったときだけ React に作り直させる
      const key = [
        ...stageRefState.current.placed.map((p) => [p.y, p.uid] as const),
        ...stageRefState.current.built.map((id) => [BUILDING_SPOTS[id].y, '@b:' + id] as const),
        [monsterPos.current.y, '@monster'] as const,
        [MAIL_POS.y, '@mail'] as const,
        ...friendsRef.current.map((f) => [friendPos.current[f.id]?.y ?? 0, '@f:' + f.id] as const),
        [playerPos.current.y, '@player'] as const,
      ].sort((x, y) => x[0] - y[0]).map(([, id]) => id).join(',');
      if (key !== lastOrder) { lastOrder = key; setOrder(key); }

      setWalking((w) => (w === moved ? w : moved));

      // 止まってしばらくしたら、まとめて保存する
      if (dirtyAt.current && t - dirtyAt.current > SAVE_DEBOUNCE) {
        dirtyAt.current = 0;
        commit();
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      commit();
    };
    // ★依存は空。中で使う可変な値はすべて ref から読む
  }, [commit]);

  // 島のタップ。歩く／置く／動かす のモードで意味が変わる
  const onStagePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = stageRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;   // 見えていないとき（大きさ0）は 位置が NaN に なるので なにもしない
    // 画面の中の位置 → 島の位置（main は カメラぶん たす）
    const c = cam.current ?? { x: 0, y: 0 };
    const raw = {
      x: (c.x + ((e.clientX - r.left) / r.width) * ISLAND_W) / ISLAND_W,
      y: (c.y + ((e.clientY - r.top) / r.height) * ISLAND_H) / ISLAND_H,
    };
    const p = clampToIsland(raw);

    if (mode.kind === 'place') {
      g.placeFurniture(mode.itemId, p.x, p.y, area);
      setMode({ kind: 'walk' });
      g.showToast(`${ITEM_BY_ID[mode.itemId]?.emoji ?? ''} おいたよ！`);
      return;
    }
    if (mode.kind === 'move') {
      g.moveFurniture(mode.uid, p.x, p.y);
      setMode({ kind: 'walk' });
      g.showToast('うごかしたよ！');
      return;
    }
    // キャラ・たからばこ・ポストの上を タップしたら、歩かずに反応する
    if (area === 'main' && showChest && dist(raw, { x: CHEST_POS.x, y: CHEST_POS.y - 0.03 }) < 0.06) { openChest(); return; }
    if (area === 'main' && dist(raw, { x: MAIL_POS.x, y: MAIL_POS.y - 0.05 }) < 0.06) { setMailOpen(true); return; }
    if (area === 'house') {
      const hit = placedHere.find((q) => (q.id === 'in_desk' || q.id === 'in_bed') && dist(raw, { x: q.x, y: q.y - 0.04 }) < 0.08);
      if (hit?.id === 'in_desk') { setDeskOpen(true); return; }
      if (hit?.id === 'in_bed') { goToBed(); return; }
    }
    for (const f of friends) {
      const fp = friendPos.current[f.id];
      if (fp && dist(raw, { x: fp.x, y: fp.y - 0.07 }) < 0.065) {
        tapFriend(f);
        return;
      }
    }
    if (area === 'main' && dist(raw, { x: monsterPos.current.x, y: monsterPos.current.y - 0.07 }) < 0.065) {
      setJump({ id: '@monster', key: Date.now() });
      voice(monster.charKey ?? 'egg');
      return;
    }
    if (area === 'main' && dist(raw, FOREST_ISLET) < 0.11) { setForestAsk(true); return; }
    if (area === 'main' && hasPier && Math.abs(raw.x - PIER_POS.x) < 0.04 && raw.y < PIER_POS.y - 0.03) { setFishOpen(true); return; }
    if (area === 'main' && Math.abs(raw.x - FARM_POS.x) < 0.13 && Math.abs(raw.y - (FARM_POS.y - 0.02)) < 0.05) { setFarmOpen(true); return; }
    if (area === 'main' && save.buildings.includes('bd_observ') && dist(raw, BUILDING_SPOTS.bd_observ) < 0.09) { openObserv(); return; }
    if (area === 'main' && save.buildings.includes('bd_moon') && dist(raw, BUILDING_SPOTS.bd_moon) < 0.09) { openMoonView(); return; }
    tapTarget.current = p;
  };

  const tapFriend = (f: Friend) => {
    setPicked(f.id);
    setJump({ id: f.id, key: Date.now() });
    voice(f.char);
    if (hwNight && f.level > 1) {
      const got = g.trickOrTreat(f.char);
      setBubble({ char: f.char, text: got ? 'トリック・オア・トリート！ 🍬どうぞ' : 'ハッピー ハロウィン！🎃', heart: got, key: Date.now() });
      if (got) g.showToast(`🍬 ${f.name}から ハロウィンの おかしを もらった！`);
      return;
    }
    const lines = weather === 'rain' ? [...TAP_LINES, 'あめだね〜', 'かさ もってる？'] : TAP_LINES;
    setBubble({ char: f.char, text: f.level > 1 ? lines[Math.floor(Math.random() * lines.length)] : '…コトコト', heart: false, key: Date.now() });
  };

  // 場所を移る：ふわっと暗くしてから切りかえる
  const travel = (to: Area, pos: Pos) => {
    if (fade) return;
    setFade(true);
    window.setTimeout(() => {
      playerPos.current = pos;
      tapTarget.current = null;
      committed.current = { p: pos, m: monsterPos.current };
      g.goArea(to, pos);
      window.setTimeout(() => setFade(false), 60);
    }, 280);
  };

  const goToBed = () => {
    if (tod !== 'night') { g.showToast('よるに なったら ねられるよ 🌙'); return; }
    setSleeping(true);
    g.showToast('おやすみ〜 💤');
    window.setTimeout(() => setSleeping(false), 5000);
  };

  const openChest = () => {
    const id = g.openChest(day);
    if (id) g.showToast(`🎁 たからばこから ${ITEM_BY_ID[id].emoji} ${ITEM_BY_ID[id].name} が でてきた！`);
  };

  const openObserv = () => {
    if (tod === 'day') { g.showToast('よるに なったら みえるよ 🔭'); return; }
    setStarsOpen(true);
  };
  const openMoonView = () => {
    if (tod === 'day') { g.showToast('よるに なったら おそなえ できるよ 🎑'); return; }
    setMoonViewOpen(true);
  };

  const nearMonster = area === 'main' && isNear(playerPos.current, monsterPos.current);
  const pp = playerPos.current;
  const nearDoorIn = area === 'main' && save.buildings.includes('bd_house') && dist(pp, DOORS.mainToHouse) <= 0.09;
  const nearDoorOut = area === 'house' && dist(pp, DOORS.houseToMain) <= 0.12;
  const nearBridgeGo = area === 'main' && hasBridge && dist(pp, DOORS.mainToEast) <= 0.1;
  const nearBridgeBack = area === 'east' && dist(pp, DOORS.eastToMain) <= 0.1;
  const heartsFor = (f: Friend) => heartsOf(save.friendsPlay[f.char]?.pts ?? 0);
  const followOffFor = (f: Friend) => !!save.friendsPlay[f.char]?.followOff;
  // ♥3いじょうの子は いつも となりに いるので、そばの子を えらぶときは あとまわしにする。
  // じゅんばん：タップで えらんだ子（すこし はなれていても）→ いちばん近い ほかの子 →（なにもなければ）ついてくる子
  const isFollower = (f: Friend) => f.level > 1 && heartsFor(f) >= FOLLOW_HEARTS && !followOffFor(f);
  const distTo = (f: Friend) => (friendPos.current[f.id] ? dist(playerPos.current, friendPos.current[f.id]) : 9);
  const nearList = friends.filter((f) => distTo(f) <= FRIEND_NEAR).sort((a, b) => distTo(a) - distTo(b));
  const pickedFriend = friends.find((f) => f.id === picked && distTo(f) <= 0.25);
  const nearOther = pickedFriend ?? nearList.find((f) => !isFollower(f));
  const nearFollower = nearList.find(isFollower);
  const nearFriend = nearOther ?? nearFollower;
  // ちかくの子が かわったら、タップで えらんだのは おしまい（その子に きりかえる）
  const autoNearId = nearList.find((f) => !isFollower(f))?.id ?? '';
  useEffect(() => { setPicked(null); }, [autoNearId]);
  const nearFurniture = placedHere.find((p) => dist(playerPos.current, { x: p.x, y: p.y }) <= 0.1);
  const house = BUILDING_SPOTS.bd_house;
  const nearHouse = (area === 'main' && save.buildings.includes('bd_house') && dist(playerPos.current, house) <= 0.13) || area === 'house';
  const nearChest = area === 'main' && showChest && dist(playerPos.current, CHEST_POS) <= 0.1;
  const nearMail = area === 'main' && dist(playerPos.current, MAIL_POS) <= 0.1;
  const nearPier = area === 'main' && hasPier && dist(playerPos.current, PIER_POS) <= 0.1;
  const nearFarm = area === 'main' && Math.abs(playerPos.current.x - FARM_POS.x) <= 0.15 && Math.abs(playerPos.current.y - FARM_POS.y) <= 0.08;
  const nearObserv = area === 'main' && save.buildings.includes('bd_observ') && dist(playerPos.current, BUILDING_SPOTS.bd_observ) <= 0.1;
  const nearMoonPlat = area === 'main' && save.buildings.includes('bd_moon') && dist(playerPos.current, BUILDING_SPOTS.bd_moon) <= 0.1;

  // 近づいたら ひとこと（なかよし度に合わせたあいさつか、勉強の声かけ）
  const nearChar = nearFriend?.char ?? '';
  useEffect(() => {
    const f = friendsRef.current.find((x) => x.char === nearChar);
    if (!f || f.level <= 1) return;
    const h = heartsOf(stageRefState.current.play[f.char]?.pts ?? 0);
    const cur = f.month === snapRef.current.currentMonth;
    const study = f.total > 0 && f.n < f.total && Math.random() < 0.5;
    const text = study
      ? `${cur ? '' : f.monthLabel + 'の '}⭐ ${f.n}/${f.total}こ！ もっと そだちたいな`
      : !cur && Math.random() < 0.5 ? `${f.monthLabel}から あそびに きたよ！` : GREET[h];
    setBubble({ char: f.char, text, heart: false, key: Date.now() });
  }, [nearChar]);

  useEffect(() => {
    if (!bubble) return;
    const id = window.setTimeout(() => setBubble(null), 2800);
    return () => window.clearTimeout(id);
  }, [bubble]);

  const gifts = useMemo(
    () => ITEMS.filter((i) => i.kind === 'gift' && (save.inventory[i.id] ?? 0) > 0),
    [save.inventory],
  );
  const wears = useMemo(() => ITEMS.filter((i) => i.kind === 'fwear' && save.owned.includes(i.id)), [save.owned]);

  const give = (f: Friend, itemId: string) => {
    const r = g.giveGift(f.char, f.name, itemId);
    if (!r) return;
    setGiftFor(null);
    setBubble({
      char: f.char,
      text: r.favorite ? 'わあ！ これ だいすき！' : 'ありがとう！ うれしいな',
      heart: true,
      key: Date.now(),
    });
    if (r.heartsAfter > r.heartsBefore) {
      g.showToast(`💗 ${f.name}との なかよしが ♥${r.heartsAfter} に なった！` +
        (r.heartsAfter === FOLLOW_HEARTS ? '　ついてくるように なったよ' : '') +
        (r.heartsAfter === 5 ? '　しょうごうを もらったよ' : ''));
    }
  };

  const toggleFollow = (f: Friend) => {
    const willFollow = followOffFor(f);   // 今 followOff=true なら、切りかえ後は「ついてくる」になる
    g.toggleFollow(f.char);
    g.showToast(willFollow ? `${f.name}が また ついてくるよ` : `${f.name}は ついてこなく なったよ`);
  };

  const entities = useMemo(() => {
    const list: { id: string; y: number; node: React.ReactNode }[] = placedHere.map((p) => ({
      id: p.uid,
      y: p.y,
      node: (
        <g key={p.uid} transform={`translate(${p.x * ISLAND_W} ${p.y * ISLAND_H})`}>
          {photoMonthOf(p.id)
            ? <PhotoFrame month={photoMonthOf(p.id)!} friends={snap.friends} />
            : <FurnitureSVG id={p.id} scale={1.9} />}
        </g>
      ),
    }));

    for (const id of builtSpots) {
      const b = BUILDING_SPOTS[id];
      list.push({
        id: '@b:' + id,
        y: b.y,
        node: (
          <g key={'@b:' + id} transform={`translate(${b.x * ISLAND_W} ${b.y * ISLAND_H})`} style={{ pointerEvents: 'none' }}>
            <BuildingSVG id={id} />
          </g>
        ),
      });
    }

    // ポスト（てがみが あると 旗が立つ）
    if (area === 'main') list.push({
      id: '@mail',
      y: MAIL_POS.y,
      node: (
        <g key="@mail" transform={`translate(${MAIL_POS.x * ISLAND_W} ${MAIL_POS.y * ISLAND_H})`} style={{ pointerEvents: 'none' }}>
          <ellipse cx="0" cy="2" rx="16" ry="5" fill="rgba(0,0,0,0.2)" />
          <rect x="-4" y="-40" width="8" height="40" fill="#92400e" stroke="#4c1d95" strokeWidth="2" />
          <rect x="-20" y="-66" width="40" height="30" rx="8" fill="#ef4444" stroke="#4c1d95" strokeWidth="2.4" />
          <rect x="-12" y="-54" width="24" height="4" rx="2" fill="#7f1d1d" />
          {unread > 0 ? (
            <g>
              <path d="M20 -62 L20 -92 L38 -84 L20 -76" fill="#fde047" stroke="#4c1d95" strokeWidth="2" />
              <circle cx="0" cy="-80" r="13" fill="#f43f5e" stroke="#fff" strokeWidth="3" />
              <text x="0" y="-75" fontSize="15" fontWeight="900" textAnchor="middle" fill="#fff">{unread}</text>
            </g>
          ) : (
            <path d="M20 -62 L34 -56 L20 -50" fill="#94a3b8" stroke="#4c1d95" strokeWidth="2" />
          )}
        </g>
      ),
    });

    // たからばこ（クイズを やった日だけ 浜に ながれつく）
    if (area === 'main' && showChest) {
      list.push({
        id: '@chest',
        y: CHEST_POS.y,
        node: (
          <g key="@chest" transform={`translate(${CHEST_POS.x * ISLAND_W} ${CHEST_POS.y * ISLAND_H})`} style={{ pointerEvents: 'none' }}>
            <g className="chest-bob">
              <ellipse cx="0" cy="2" rx="26" ry="7" fill="rgba(0,0,0,0.2)" />
              <rect x="-24" y="-30" width="48" height="30" rx="5" fill="#b45309" stroke="#4c1d95" strokeWidth="2.4" />
              <path d="M-24 -30 Q0 -52 24 -30 Z" fill="#d97706" stroke="#4c1d95" strokeWidth="2.4" />
              <rect x="-5" y="-34" width="10" height="14" rx="2" fill="#fde047" stroke="#4c1d95" strokeWidth="2" />
              <text x="30" y="-40" fontSize="22" className="twinkle">✨</text>
            </g>
          </g>
        ),
      });
    }

    if (area === 'main') list.push({
      id: '@monster',
      y: monsterPos.current.y,
      node: (
        <g key="@monster" ref={monsterNodeRef} transform={`translate(${monsterPos.current.x * ISLAND_W} ${monsterPos.current.y * ISLAND_H})`}>
          <g key={'j' + (jump?.id === '@monster' ? jump.key : 0)} className={jump?.id === '@monster' ? 'char-jump' : ''}>
          <foreignObject x={-64} y={-128} width={128} height={150} style={{ overflow: 'visible', pointerEvents: 'none' }}>
            <div className="flex h-full w-full items-end justify-center">
              {monster.charKey ? (
                <CharSVG
                  charKey={monster.charKey}
                  level={level}
                  fillPct={fullness / 100}
                  size={112}
                  silhouette={mo === 'down'}
                  stars={save.titles.length}
                  label={monsterName}
                />
              ) : (
                <EggSVG size={96} />
              )}
            </div>
          </foreignObject>
          </g>
          {(mo === 'hungry' || mo === 'down') && (
            <text x="34" y="-104" fontSize="34" textAnchor="middle">{mo === 'down' ? '💤' : '💭'}</text>
          )}
        </g>
      ),
    });

    for (const f of friends) {
      const fp = friendPos.current[f.id];
      if (!fp) continue;
      list.push({
        id: '@f:' + f.id,
        y: fp.y,
        node: (
          <g
            key={'@f:' + f.id}
            ref={(el) => { friendNodes.current[f.id] = el; }}
            transform={`translate(${fp.x * ISLAND_W} ${fp.y * ISLAND_H})`}
          >
            <g key={'j' + (jump?.id === f.id ? jump.key : 0)} className={jump?.id === f.id ? 'char-jump' : ''}>
            <foreignObject x={-60} y={-124} width={120} height={144} style={{ overflow: 'visible', pointerEvents: 'none' }}>
              <div className="flex h-full w-full items-end justify-center">
                <CharSVG charKey={f.char} level={f.level} fillPct={f.fill} size={108} stars={f.stars} label={f.name} />
              </div>
            </foreignObject>
            </g>
            {(() => {
              const w = save.friendsPlay[f.char]?.wear;
              const pos = w ? WEAR_POS[w] : null;
              if (!pos && hwNight && f.level > 1) {
                return (
                  <text x="0" y="-46" fontSize="30" textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: 'none' }}>
                    {costumeOf(f.char)}
                  </text>
                );
              }
              return pos && f.level > 1 ? (
                <text x="0" y={pos.y} fontSize={pos.size} textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: 'none' }}>
                  {ITEM_BY_ID[w!]?.emoji}
                </text>
              ) : null;
            })()}
            <text
              x="0" y="-116" fontSize="24" fontWeight="900" textAnchor="middle"
              fill="#fff" stroke="rgba(30,27,75,0.85)" strokeWidth="6" paintOrder="stroke"
            >
              {(f.level > 1 ? `${f.name} Lv.${f.level}` : `${f.name}（たまご）`) +
                (heartsFor(f) > 0 ? ' ' + '♥'.repeat(heartsFor(f)) : '')}
            </text>
            {bubble && bubble.char === f.char && (() => {
              // 島の はしでも ふきだしが切れないように、横にずらす（しっぽの位置は そのまま）
              const half = bubble.text.length * 12 + 20;
              const bx = fp.x * ISLAND_W - (cam.current?.x ?? 0);   // 画面の窓の中での位置
              const sx = Math.max(half + 6 - bx, Math.min(0, ISLAND_W - half - 6 - bx));
              return (
              <g key={'b' + bubble.key} className="bubble-pop">
                <rect
                  x={sx - half} y={-196} width={half * 2} height={50} rx={22}
                  fill="#fff" stroke="#4c1d95" strokeWidth="3"
                />
                <path d="M-10 -147 L0 -132 L10 -147 Z" fill="#fff" stroke="#4c1d95" strokeWidth="3" strokeLinejoin="round" />
                <rect x={-12} y={-150} width={24} height={6} fill="#fff" />
                <text x={sx} y="-164" fontSize="23" fontWeight="900" textAnchor="middle" fill="#312e81">{bubble.text}</text>
                {bubble.heart && (
                  <text x="46" y="-60" fontSize="40" textAnchor="middle" className="heart-float">💗</text>
                )}
              </g>
              );
            })()}
          </g>
        ),
      });
    }

    list.push({
      id: '@player',
      y: playerPos.current.y,
      node: (
        <g key="@player" ref={playerNodeRef} transform={`translate(${playerPos.current.x * ISLAND_W} ${playerPos.current.y * ISLAND_H})`}>
          <foreignObject x={-60} y={-132} width={120} height={144} style={{ overflow: 'visible', pointerEvents: 'none' }}>
            <div className="flex h-full w-full items-end justify-center">
              {save.player && (
                <KidSVG
                  who={save.player}
                  size={104}
                  walking={walking}
                  hat={save.equipped.hat === 'ht_crown' ? 'crown' : save.equipped.hat === 'ht_cap' ? 'cap' : null}
                  ribbon={save.equipped.costume === 'cs_ribbon'}
                />
              )}
            </div>
          </foreignObject>
        </g>
      ),
    });

    return list.sort((a, b) => a.y - b.y).map((e) => e.node);
    // order が変わったときに並べ直す
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, placedHere, area, save.player, save.equipped, save.titles.length, monster.charKey, level, fullness, mo, monsterName, walking, friends, save.buildings, save.friendsPlay, bubble, jump, unread, showChest, hwNight, snap.friends]);

  const friendPanel = (f: Friend) => (
            <div className="flex max-w-[230px] flex-col items-end gap-2">
              <div className="rounded-2xl bg-white/90 px-3 py-2 text-right text-[11px] font-bold leading-snug text-ink shadow-lg">
                <div className="text-[13px] font-black">
                  {f.name}（{f.catLabel}）{f.level > 1 ? ` Lv.${f.level}` : ''}
                </div>
                {f.levelName && <div className="text-indigo-900/70">{f.levelName}{f.stars > 0 ? ` ★${f.stars}` : ''}</div>}
                <div className="text-rose-500">なかよし {'♥'.repeat(heartsFor(f))}{'♡'.repeat(5 - heartsFor(f))}</div>
                <div className="mt-0.5 text-indigo-900/60">
                  {isCurrent(f) ? '' : `${f.monthLabel}から あそびに きたよ。`}
                  {f.monthLabel}の{f.catLabel}の もんだいを ⭐かんぺきに すると そだつよ
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <button className="btn !w-auto whitespace-nowrap !px-3 !py-2 text-[12px]" onClick={() => setGiftFor(f)}>🎁 あげる</button>
                <button className="btn !w-auto whitespace-nowrap !px-3 !py-2 text-[12px]" onClick={() => setWearFor(f)}>👒 きせかえ</button>
                {heartsFor(f) >= FOLLOW_HEARTS && (
                  <button className="btn !w-auto whitespace-nowrap !px-3 !py-2 text-[12px]" onClick={() => toggleFollow(f)}>
                    {followOffFor(f) ? '👣 ついてきて' : '🚫 ついてこないで'}
                  </button>
                )}
              </div>
            </div>
  );

  return (
    <Shell
      title={AREA_TITLE[area]}
      sub={playerName ? `${playerName}の しま` : undefined}
      extra={
        <button
          className="shrink-0 rounded-xl border-2 border-indigo-300/40 px-2 py-1.5 text-[11px] font-extrabold text-indigo-100 active:scale-95"
          onClick={() => setOpeningOpen(true)}
          aria-label="はじまりの ものがたり"
        >
          📜<span className="ml-0.5 hidden sm:inline">はじまり</span>
        </button>
      }
    >
      {/* iPad よこ向き：左に島を大きく、右に 300px の列（ステータス・ボタン・十字キー・家具）。
          スマホ・たて向きは 上から じゅんに ならぶ（いままでどおり） */}
      <div className="lg:landscape:grid lg:landscape:grid-cols-[minmax(0,1fr)_300px] lg:landscape:items-start lg:landscape:gap-x-4">
      {/* ── ステータス ── */}
      <div className="panel mb-2.5 !py-3 lg:landscape:col-start-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-black text-ink">
              {monster.stage === 'egg' ? '🥚 たまご' : `${monsterName}　Lv.${level}`}
            </div>
            <div className="truncate text-[11px] font-bold text-indigo-900/60">{moodLine(monster, monsterName, now)}</div>
            <button
              className="mt-0.5 block max-w-full text-left text-[11px] font-extrabold leading-snug text-amber-700"
              onClick={() => g.go('shop')}
            >
              {nextBuild
                ? `🏗️ つぎは ${nextBuild.emoji}${nextBuild.name}` + (g.balance >= nextBuild.price ? '（たてられるよ！）' : `（あと ${nextBuild.price - g.balance}枚）`)
                : '🏗️ しまが かんせいしたよ！'}
            </button>
          </div>
          <div className="w-28 shrink-0">
            <div className="mb-1 text-right text-[10px] font-extrabold text-amber-600">まんぷく {fullness}%</div>
            <HpBar value={fullness} max={100} tone="food" />
          </div>
        </div>
      </div>

      {/* ── スタンプ・てがみ・おと ── */}
      <div className="mb-2.5 flex gap-1.5 lg:landscape:col-start-2">
        <button className="flex-1 whitespace-nowrap rounded-2xl bg-white/90 px-2 py-2 text-[12px] font-black text-ink shadow active:scale-95" onClick={() => setStampOpen(true)}>
          🗓️ こんげつ {stamps.length}にち
        </button>
        <button className="relative flex-1 whitespace-nowrap rounded-2xl bg-white/90 px-2 py-2 text-[12px] font-black text-ink shadow active:scale-95" onClick={() => setMailOpen(true)}>
          💌 てがみ
          {unread > 0 && <span className="ml-1 rounded-full bg-rose-500 px-1.5 text-[11px] text-white">{unread}</span>}
        </button>
        <button className="flex-1 whitespace-nowrap rounded-2xl bg-white/20 px-2 py-2 text-[12px] font-black text-white active:scale-95" onClick={() => setSnd(cycleSoundMode())}>
          {SOUND_LABEL[snd]}
        </button>
      </div>

      {/* ── 島 ── */}
      <div className="relative overflow-hidden rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,.3)] lg:landscape:col-start-1 lg:landscape:row-span-6 lg:landscape:row-start-1 lg:landscape:mx-auto lg:landscape:w-full lg:landscape:max-w-[calc((100vh-150px)*4/3)]">
        <svg
          ref={stageRef}
          className="island-stage block w-full"
          viewBox={`${camNow.x} ${camNow.y} ${ISLAND_W} ${ISLAND_H}`}
          onPointerDown={onStagePointerDown}
        >
          {area === 'main' && (
            <IslandGround expansion={expansion} pier={hasPier} season={seasonNow()} bridge={hasBridge} halloween={hw} />
          )}
          {area === 'main' && <FarmPatch plots={save.farm.plots} stages={farmStages} today={day} />}
          {area === 'east' && <EastGround tod={tod} />}
          {area === 'house' && (
            <RoomGround wall={save.room.wall} floor={save.room.floor} tod={tod} moonAge={moonAge} sleeping={sleeping} />
          )}
          {mode.kind !== 'walk' && isWideArea() && (
            <ellipse
              cx={MAIN_WALK_ELLIPSE.cx * ISLAND_W} cy={MAIN_WALK_ELLIPSE.cy * ISLAND_H}
              rx={MAIN_WALK_ELLIPSE.rx * ISLAND_W} ry={MAIN_WALK_ELLIPSE.ry * ISLAND_H}
              fill="rgba(255,255,255,0.18)" stroke="#fff" strokeDasharray="12 10" strokeWidth="4"
            />
          )}
          {mode.kind !== 'walk' && !isWideArea() && (
            <rect
              x={BOUNDS.minX * ISLAND_W}
              y={BOUNDS.minY * ISLAND_H}
              width={(BOUNDS.maxX - BOUNDS.minX) * ISLAND_W}
              height={(BOUNDS.maxY - BOUNDS.minY) * ISLAND_H}
              fill="rgba(255,255,255,0.22)"
              stroke="#fff"
              strokeDasharray="12 10"
              strokeWidth="4"
              rx="40"
            />
          )}
          {entities}
          {/* 空（画面に くっつける）。夜のあかりは 下で 島の上に かく */}
          <g ref={skyRef} transform={`translate(${camNow.x} ${camNow.y})`}>
            {area !== 'house' && <SkyLayer
              tod={tod}
              weather={weather}
              moonAge={moonAge}
              glows={[]}
              onMoon={() => g.showToast(`🌙 きょうの月は ${moonName(moonAge)}（月齢 やく${Math.round(moonAge)}）`)}
              onStar={() => { sfx('star'); g.showToast(`🌠 ねがいごと：「${WISHES[Math.floor(Math.random() * WISHES.length)]}」`); }}
              skyTime={skyMin}
              onStarTap={(id) => g.showToast(starInfo(id))}
            />}
            {hwNight && area !== 'house' && [[120, 90], [520, 60], [760, 130]].map(([x, y], i) => (
              <g key={'bat' + i} transform={`translate(${x} ${y})`} style={{ pointerEvents: 'none' }}>
                <g className="bat-fly" style={{ animationDelay: `${-i * 2.3}s` }}>
                  <text fontSize="30" textAnchor="middle">🦇</text>
                </g>
              </g>
            ))}
          </g>
          {/* 夜の あかり（窓・ランプ・ランタン）。島の位置に かく */}
          {area !== 'house' && tod === 'night' && [

              ...(area === 'main' && save.buildings.includes('bd_house') ? [{ x: 0.2, y: 0.36, r: 60 }] : []),
              ...(area === 'main' && save.buildings.includes('bd_school') ? [{ x: 0.64, y: 0.31, r: 80 }] : []),
              ...(area === 'main' && save.buildings.includes('bd_light') ? [{ x: 0.87, y: 0.23, r: 70 }] : []),
              ...(area === 'main' && save.buildings.includes('bd_observ') ? [{ x: 0.44, y: 0.27, r: 55 }] : []),
              ...builtSpots.filter((id) => BUILDING_SPOTS[id].area && BUILDING_SPOTS[id].glow).map((id) => {
                const b = BUILDING_SPOTS[id];
                return { x: b.x, y: b.y + b.glow!.dy, r: b.glow!.r };
              }),
              ...placedHere.filter((p) => p.id === 'fn_lamp' || p.id === 'fn_fire').map((p) => ({ x: p.x, y: p.y - 0.07, r: 55 })),
              ...(area === 'main' && hw && seasonNow() === 10 ? LANTERNS.map(([x, y]) => ({ x: x / ISLAND_W, y: (y - 14) / ISLAND_H, r: 45 })) : []),
          ].map((gl, i) => (
            <circle key={'gl' + i} cx={gl.x * ISLAND_W} cy={gl.y * ISLAND_H} r={gl.r} fill="url(#warmGlow)" pointerEvents="none" />
          ))}
          {sleeping && <rect x="0" y="0" width={ISLAND_W} height={ISLAND_H} fill="rgba(15,23,72,0.6)" pointerEvents="none" />}
          {sleeping && <text x={ISLAND_W / 2} y={ISLAND_H * 0.4} fontSize="64" textAnchor="middle" className="twinkle">💤</text>}
        </svg>

        <div className={`pointer-events-none absolute inset-0 bg-indigo-950 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`} />
        {mode.kind !== 'walk' && (
          <div className="pointer-events-none absolute inset-x-0 top-2 text-center text-[12px] font-black text-white drop-shadow">
            {mode.kind === 'place' ? 'おきたい ばしょを タップ' : 'うごかす さきを タップ'}
          </div>
        )}
      </div>

      {/* ── そうさ ── */}
      <div className="mt-3 flex items-start justify-between gap-3 lg:landscape:col-start-2 lg:landscape:mt-0">
        <DPad axisRef={axis} onInput={() => { tapTarget.current = null; }} />

        <div className="flex min-w-0 flex-1 flex-col items-end gap-2">
          {/* おうちの そばでは いつでも なかま一覧を ひらける */}
          {mode.kind === 'walk' && nearHouse && snap.friends.length > 0 && (
            <button className="btn !w-auto whitespace-nowrap !py-2 text-[12px]" onClick={() => setRosterOpen(true)}>
              📖 なかま いちらん
            </button>
          )}
          {mode.kind !== 'walk' ? (
            <button className="btn !w-auto !py-2 text-[12px]" onClick={() => setMode({ kind: 'walk' })}>
              ✕ やめる
            </button>
          ) : nearDoorIn ? (
            <button className="btn-main !w-auto whitespace-nowrap !px-4 !py-2.5 text-[13px]" onClick={() => travel('house', ENTRY.house)}>🏠 おうちに はいる</button>
          ) : nearDoorOut ? (
            <button className="btn-main !w-auto whitespace-nowrap !px-4 !py-2.5 text-[13px]" onClick={() => travel('main', ENTRY.mainFromHouse)}>🚪 そとに でる</button>
          ) : nearBridgeGo ? (
            <button className="btn-main !w-auto whitespace-nowrap !px-4 !py-2.5 text-[13px]" onClick={() => travel('east', ENTRY.east)}>🌉 となりの しまへ</button>
          ) : nearBridgeBack ? (
            <button className="btn-main !w-auto whitespace-nowrap !px-4 !py-2.5 text-[13px]" onClick={() => travel('main', ENTRY.mainFromEast)}>🌉 もとの しまへ</button>
          ) : nearMonster ? (
            <button
              className="flex h-[84px] w-[84px] flex-col items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[12px] font-black text-white shadow-xl active:scale-95"
              onClick={() => (monster.stage === 'egg' || foods.length ? setFeedOpen(true) : g.showToast('ごはんが ないよ。ショップで かおう', 'ng'))}
            >
              <span className="text-2xl">🍚</span>
              ごはん
            </button>
          ) : nearChest ? (
            <button className="btn !w-auto whitespace-nowrap !py-2 text-[12px]" onClick={openChest}>🎁 たからばこを あける</button>
          ) : nearMail ? (
            <button className="btn !w-auto whitespace-nowrap !py-2 text-[12px]" onClick={() => setMailOpen(true)}>
              💌 てがみを よむ{unread > 0 ? `（${unread}）` : ''}
            </button>
          ) : nearPier ? (
            <button className="btn-main !w-auto whitespace-nowrap !px-4 !py-2.5 text-[13px]" onClick={() => setFishOpen(true)}>🎣 つりを する</button>
          ) : nearFarm && !nearOther ? (
            <button className="btn-main !w-auto whitespace-nowrap !px-4 !py-2.5 text-[13px]" onClick={() => setFarmOpen(true)}>
              🌱 はたけ{farmStages.some((n, i) => isRipe(save.farm.plots[i], n)) ? '（しゅうかく できるよ！）' : ''}
            </button>
          ) : nearObserv ? (
            <button className="btn-main !w-auto whitespace-nowrap !px-4 !py-2.5 text-[13px]" onClick={openObserv}>🔭 星座を みる</button>
          ) : nearMoonPlat ? (
            <button className="btn-main !w-auto whitespace-nowrap !px-4 !py-2.5 text-[13px]" onClick={openMoonView}>🎑 おだんごを おそなえ</button>
          ) : nearOther ? (
            friendPanel(nearOther)
          ) : nearFurniture ? (
            <div className="flex gap-2">
              <button className="btn !w-auto !py-2 text-[12px]" onClick={() => setMode({ kind: 'move', uid: nearFurniture.uid })}>
                ↔️ うごかす
              </button>
              <button className="btn !w-auto !py-2 text-[12px]" onClick={() => { g.storeFurniture(nearFurniture.uid); g.showToast('しまったよ'); }}>
                📦 しまう
              </button>
            </div>
          ) : nearFollower ? (
            friendPanel(nearFollower)
          ) : (
            <div className="max-w-[190px] rounded-2xl bg-white/10 px-3 py-2 text-right text-[11px] font-bold leading-snug text-indigo-100/70">
              {area === 'house'
                ? 'へやの かぐを おいて かざろう。ドアの まえで そとに でられるよ'
                : area === 'east'
                ? 'はなばたけの しまだよ。ひだりの はしで もとの しまに もどれるよ'
                : monster.stage === 'egg'
                ? 'たまごに ちかづいて ごはんを あげよう'
                : `${monsterName}に ちかづくと なにかできるよ`}
            </div>
          )}
        </div>
      </div>

      {/* ── 置ける家具のトレイ ── */}
      {unplaced.length > 0 && (
        <div className="panel mt-3 !py-3 lg:landscape:col-start-2">
          <div className="mb-2 text-[12px] font-black text-ink">{area === 'house' ? '🛋️ へやに おける かぐ' : '🌴 しまに おける かぐ'}</div>
          <div className="flex flex-wrap gap-2">
            {unplaced.map((id) => {
              const it = ITEM_BY_ID[id];
              return (
                <button
                  key={id}
                  onClick={() => setMode({ kind: 'place', itemId: id })}
                  className="flex items-center gap-1.5 rounded-xl border-2 border-line px-3 py-2 text-[12px] font-extrabold text-ink active:scale-95"
                >
                  <span>{it.emoji}</span>
                  {it.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {save.titles.length > 0 && (
        <div className="panel mt-3 !py-3 lg:landscape:col-start-2">
          <div className="mb-1.5 text-[12px] font-black text-ink">🏅 しょうごう</div>
          <div className="flex flex-wrap gap-1.5">
            {save.titles.map((t) => (
              <span key={t} className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-extrabold text-amber-800">{t}</span>
            ))}
          </div>
        </div>
      )}

      </div>

      {/* ── ごはんを えらぶ ── */}
      {feedOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setFeedOpen(false)}>
          <div className="panel w-full max-w-[440px]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 text-[14px] font-black text-ink">🍚 なにを あげる？</div>
            {foods.length === 0 ? (
              <p className="py-3 text-center text-[12px] font-bold text-indigo-900/60">
                ごはんが ないよ。ショップで かってきてね
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {foods.map((it) => (
                  <button
                    key={it.id}
                    className="btn flex items-center gap-2"
                    onClick={() => { g.feedMonster(it.id); setFeedOpen(false); }}
                  >
                    <span className="text-xl">{it.emoji}</span>
                    <span className="flex-1 text-left">
                      {it.name}
                      <span className="ml-1 text-[11px] font-bold text-indigo-900/50">{it.desc}</span>
                    </span>
                    <span className="text-[12px] font-black text-indigo-500">×{save.inventory[it.id]}</span>
                  </button>
                ))}
              </div>
            )}
            <button className="btn-main mt-3" onClick={() => setFeedOpen(false)}>とじる</button>
          </div>
        </div>
      )}

      {/* ── プレゼントを えらぶ ── */}
      {giftFor && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setGiftFor(null)}>
          <div className="panel w-full max-w-[440px]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-1 text-[14px] font-black text-ink">🎁 {giftFor.name}に なにを あげる？</div>
            <div className="mb-2 text-[11px] font-bold text-indigo-900/55">
              きょう あと {g.giftsLeft(giftFor.char)}かい あげられるよ（1にち {GIFTS_PER_DAY}かいまで）
            </div>
            {gifts.length === 0 ? (
              <p className="py-3 text-center text-[12px] font-bold text-indigo-900/60">
                プレゼントが ないよ。ショップの「🎁 プレゼント」で かってきてね
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {gifts.map((it) => (
                  <button key={it.id} className="btn flex items-center gap-2" onClick={() => give(giftFor, it.id)}>
                    <span className="text-xl">{it.emoji}</span>
                    <span className="flex-1 text-left">
                      {it.name}
                      <span className="ml-1 text-[11px] font-bold text-indigo-900/50">{it.desc}</span>
                      {(save.friendsPlay[giftFor.char]?.pts ?? 0) > 0 && FAVORITE[giftFor.char] === it.id && (
                        <span className="ml-1 text-[11px] font-black text-rose-500">💖だいすき</span>
                      )}
                    </span>
                    <span className="text-[12px] font-black text-indigo-500">×{save.inventory[it.id]}</span>
                  </button>
                ))}
              </div>
            )}
            <button className="btn-main mt-3" onClick={() => setGiftFor(null)}>とじる</button>
          </div>
        </div>
      )}

      {fishOpen && (
        <FishingModal ctx={{ tod, weather, month: seasonNow() }} studied={studied} onClose={() => setFishOpen(false)} />
      )}
      {farmOpen && <FarmModal stages={farmStages} studied={studied} onClose={() => setFarmOpen(false)} />}
      {starsOpen && <StarsModal onClose={() => setStarsOpen(false)} />}
      {moonViewOpen && <MoonViewModal onClose={() => setMoonViewOpen(false)} />}

      {/* ── 🌲 まよいの森へ（クエストの ページに うつる）── */}
      {forestAsk && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setForestAsk(false)}>
          <div className="panel w-full max-w-[440px] text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl">🌲</div>
            <div className="mt-1 text-[16px] font-black text-ink">まよいの森へ いく？</div>
            <div className="mt-1 text-[12px] font-bold leading-relaxed text-indigo-900/60">
              まいにち かたちが かわる めいろ。<br />モンスターと もんだいで たたかって、もりのぬしを めざそう！
            </div>
            <a className="btn-main mt-3 block text-center no-underline" href="/rpg.html#forest">🌲 いく</a>
            <button className="btn mt-2" onClick={() => setForestAsk(false)}>やめる</button>
          </div>
        </div>
      )}

      {/* ── べんきょうづくえ ── */}
      {deskOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setDeskOpen(false)}>
          <div className="panel w-full max-w-[440px]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 text-[14px] font-black text-ink">📚 べんきょうづくえ</div>
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-[13px] font-bold leading-relaxed text-ink">
              きょうは <b className="text-[16px] text-violet-700">{byDate[day] || 0}もん</b> といたよ。<br />
              こんげつの スタンプは <b className="text-[16px] text-amber-600">{stamps.length}にち</b>。<br />
              {(byDate[day] || 0) >= 5 ? 'きょうの スタンプ ゲット！ すごい！' : `あと ${5 - (byDate[day] || 0)}もんで きょうの スタンプだよ`}
            </div>
            <a className="btn-main mt-3 block text-center no-underline" href="/">📚 クイズを する</a>
            <button className="btn mt-2" onClick={() => setDeskOpen(false)}>とじる</button>
          </div>
        </div>
      )}

      {/* ── はじまりの ものがたり（見なおし）── */}
      {openingOpen && <OpeningScreen onDone={() => setOpeningOpen(false)} />}

      {/* ── 月がわり：あたらしい しゅやくが きた（1回だけ）── */}
      {monthBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setMonthBanner(null)}>
          <div className="panel w-full max-w-[400px] text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-[18px] font-black text-ink">🎉 {Number(monthBanner.slice(4))}がつの なかまが やってきた！</div>
            <div className="my-3 flex flex-wrap items-end justify-center gap-2">
              {snap.friends.filter((f) => f.month === monthBanner).map((f) => (
                <div key={f.id} className="flex flex-col items-center">
                  <CharSVG charKey={f.char} level={f.level} fillPct={f.fill} size={72} stars={f.stars} label={f.name} />
                  <span className="text-[12px] font-black text-ink">{f.name}</span>
                  <span className="text-[10px] font-bold text-indigo-900/55">{f.catLabel}</span>
                </div>
              ))}
            </div>
            <p className="text-[12px] font-bold leading-relaxed text-indigo-900/70">
              きょうから この しまの しゅやくだよ。<br />まえの なかまも あそびに くるよ。<br />📮 おてがみも みてね。
            </p>
            <button className="btn-main mt-3" onClick={() => setMonthBanner(null)}>よろしくね！</button>
          </div>
        </div>
      )}

      {/* ── まいにちスタンプ ── */}
      {stampOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setStampOpen(false)}>
          <div className="panel max-h-[85vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="mb-1 text-[14px] font-black text-ink">🗓️ {nowD.getMonth() + 1}がつの スタンプ</div>
            <div className="mb-2 text-[11px] font-bold text-indigo-900/55">クイズで 5もん いじょう こたえた日に 🌟が つくよ</div>
            <div className="mb-3 grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-indigo-900/50">
              {['げつ', 'か', 'すい', 'もく', 'きん', 'ど', 'にち'].map((w) => <div key={w}>{w}</div>)}
              {Array.from({ length: (new Date(nowD.getFullYear(), nowD.getMonth(), 1).getDay() + 6) % 7 }, (_, i) => <div key={'b' + i} />)}
              {Array.from({ length: new Date(nowD.getFullYear(), nowD.getMonth() + 1, 0).getDate() }, (_, i) => {
                const d = i + 1;
                const got = stamps.includes(d);
                const isToday = d === nowD.getDate();
                return (
                  <div key={d} className={`flex aspect-square flex-col items-center justify-center rounded-lg ${got ? 'bg-amber-100' : 'bg-indigo-50'} ${isToday ? 'ring-2 ring-violet-400' : ''}`}>
                    <span className="text-[10px] text-indigo-900/60">{d}</span>
                    <span className="text-[15px] leading-none">{got ? '🌟' : ''}</span>
                  </div>
                );
              })}
            </div>
            <div className="mb-1.5 text-[12px] font-black text-ink">🎁 ごほうび（こんげつ {stamps.length}にち）</div>
            <div className="flex flex-col gap-1.5">
              {stampRewardsFor(nowD.getMonth() + 1).map((rw) => {
                const key = `${ym}:${rw.days}`;
                const claimed = save.stampClaims.includes(key);
                const can = stamps.length >= rw.days && !claimed;
                return (
                  <div key={rw.days} className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2">
                    <span className="w-12 shrink-0 text-[12px] font-black text-amber-600">{rw.days}にち</span>
                    <span className="flex-1 text-[12px] font-extrabold text-ink">{rw.label}</span>
                    {claimed ? (
                      <span className="text-[11px] font-extrabold text-emerald-600">✓ もらった</span>
                    ) : (
                      <button
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-black ${can ? 'bg-gradient-to-br from-amber-500 to-amber-400 text-white shadow active:scale-95' : 'bg-gray-100 text-gray-400'}`}
                        disabled={!can}
                        onClick={() => { const got = g.claimStamp(ym, rw.days); if (got) g.showToast(`🎉 ${got} を もらった！`); }}
                      >
                        {can ? 'うけとる' : `あと${rw.days - stamps.length}にち`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[10.5px] font-bold text-indigo-900/50">かぐは 🏝しまの「しまに おける かぐ」から おけるよ。まいつき また あつめられるよ。</p>
            <button className="btn-main mt-3" onClick={() => setStampOpen(false)}>とじる</button>
          </div>
        </div>
      )}

      {/* ── てがみばこ ── */}
      {mailOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => { setMailOpen(false); setReading(null); }}>
          <div className="panel max-h-[85vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {reading ? (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <CharSVG charKey={reading.from as never} level={6} fillPct={1} size={56} label={reading.fromName} />
                  <div className="text-[14px] font-black text-ink">{reading.title}</div>
                </div>
                <div className="whitespace-pre-line rounded-2xl bg-amber-50 px-4 py-3 text-[13px] font-bold leading-relaxed text-ink">{reading.body}</div>
                <button className="btn mt-3" onClick={() => setReading(null)}>← てがみばこに もどる</button>
              </div>
            ) : (
              <div>
                <div className="mb-2 text-[14px] font-black text-ink">💌 てがみばこ</div>
                {save.letters.length === 0 ? (
                  <p className="py-3 text-center text-[12px] font-bold text-indigo-900/60">まだ てがみは ないよ</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {save.letters.map((l) => (
                      <button
                        key={l.id}
                        className={`btn flex items-center gap-2 text-left ${l.read ? 'opacity-70' : ''}`}
                        onClick={() => { setReading(l); if (!l.read) g.readLetter(l.id); }}
                      >
                        <span className="text-lg">{l.read ? '📭' : '💌'}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12.5px] font-black">{l.title}</span>
                          <span className="block text-[10.5px] font-bold text-indigo-900/50">{l.fromName}より・{new Date(l.at).getMonth() + 1}/{new Date(l.at).getDate()}</span>
                        </span>
                        {!l.read && <span className="rounded-full bg-rose-500 px-2 text-[10px] font-black text-white">NEW</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button className="btn-main mt-3" onClick={() => { setMailOpen(false); setReading(null); }}>とじる</button>
          </div>
        </div>
      )}

      {/* ── なかま いちらん（おうちで見られる）── */}
      {rosterOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setRosterOpen(false)}>
          <div className="panel max-h-[80vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 text-[14px] font-black text-ink">📖 しまの なかま</div>
            {[...new Set(snap.friends.map((f) => f.month))].sort().reverse().map((m) => (
              <div key={m} className="mb-3">
                <div className="mb-1.5 text-[12px] font-black text-indigo-700">
                  {snap.friends.find((f) => f.month === m)?.monthLabel}の なかま{m === snap.currentMonth ? '（いまの しゅやく）' : ''}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {snap.friends.filter((f) => f.month === m).map((f) => (
                    <div key={f.id} className="flex items-center gap-2 rounded-2xl bg-indigo-50 px-2 py-1.5">
                      <div className="shrink-0">
                        <CharSVG charKey={f.char} level={f.level} fillPct={f.fill} size={52} stars={f.stars} label={f.name} />
                      </div>
                      <div className="min-w-0 text-[11px] font-bold leading-snug text-ink">
                        <div className="truncate text-[12px] font-black">{f.name}</div>
                        <div className="text-indigo-900/60">{f.catLabel} Lv.{f.level}</div>
                        <div className="text-rose-500">{'♥'.repeat(heartsFor(f)) || '♡'}</div>
                        {friends.some((x) => x.id === f.id) && <div className="text-emerald-600">きょう しまに いるよ</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className="btn-main mt-1" onClick={() => setRosterOpen(false)}>とじる</button>
          </div>
        </div>
      )}

      {/* ── 教科キャラの きせかえ ── */}
      {wearFor && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setWearFor(null)}>
          <div className="panel w-full max-w-[440px]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 text-[14px] font-black text-ink">👒 {wearFor.name}の きせかえ</div>
            {wearFor.level <= 1 ? (
              <p className="py-3 text-center text-[12px] font-bold text-indigo-900/60">たまごから うまれたら きせかえ できるよ</p>
            ) : wears.length === 0 ? (
              <p className="py-3 text-center text-[12px] font-bold text-indigo-900/60">
                きせかえが ないよ。ショップの「🎀 きせかえ」で かってきてね
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {wears.map((it) => {
                  const on = save.friendsPlay[wearFor.char]?.wear === it.id;
                  const other = friends.find((f) => f.char !== wearFor.char && save.friendsPlay[f.char]?.wear === it.id);
                  return (
                    <button
                      key={it.id}
                      className="btn flex items-center gap-2"
                      onClick={() => { g.dressFriend(wearFor.char, on ? null : it.id); setWearFor(null); }}
                    >
                      <span className="text-xl">{it.emoji}</span>
                      <span className="flex-1 text-left">
                        {it.name}
                        {other && <span className="ml-1 text-[11px] font-bold text-indigo-900/50">（いまは {other.name}が つけてる）</span>}
                      </span>
                      <span className={`text-[12px] font-black ${on ? 'text-emerald-600' : 'text-indigo-500'}`}>{on ? '✓ はずす' : 'つける'}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <button className="btn-main mt-3" onClick={() => setWearFor(null)}>とじる</button>
          </div>
        </div>
      )}
    </Shell>
  );
}
