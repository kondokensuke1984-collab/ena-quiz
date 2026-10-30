import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Shell, HpBar } from '../components/Shell';
import { DPad, type Axis } from '../components/DPad';
import { IslandGround, FOREST_ISLET, MOSHI_ISLET } from '../components/IslandStage';
import { useMoshis, moshiRewards, SHELF_MOSHI } from '../lib/moshi';
import { KidSVG, PALETTES, type KidDir } from '../components/KidSVG';
import { FIXED_SCHOOL, SCHOOLS, SCHOOL_LABEL } from '../lib/school';
import { CharSVG, useChars } from '../components/CharSVG';
import type { World3DHandle } from '../components/island3d/World3D';
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
import { hourNow, isNearFull, moonAge as calcMoonAge, moonName, SYNODIC, timeOfDay, weatherFor } from '../lib/sky';
import { pairTalk, requestLine, talkLine, thanksLine, type TalkCtx } from '../lib/talk';
import { EVERYDAY_GIFTS } from '../lib/items';
import { dateKey } from '../lib/study';
import { cycleSoundMode, setBgmNight, setSpaceBgm, sfx, soundMode, voice, type SoundMode } from '../lib/sound';
import { answeredByDate, daysThisWeek, marsQuota, MARS_CATS, stampDays, studiedToday, todayUnits, UNLOCK_CATS } from '../lib/study';
import { earnedTotal } from '../lib/medals';
import { pickLesson, type Lesson } from '../lib/lesson';
import { buildLetters } from '../lib/letters';
import { photoMonthOf } from '../lib/items';
import type { Area, Planet, Pos } from '../types';
import { EastGround, earthAge, MarsGround, MoonGround, SunGround, SUN_HITS, PLANET_CFG, RoomGround, SchoolGround, SCHOOL_DESKS, SCHOOL_HITS, trophyAt, certAt, gameAt, GAME_SPOT, moshiShelfAt, MOSHI_SHELF_SPOT } from '../components/AreaStages';
import { planetStoneSpot, STONE_FOOD, SUN_TITLE } from '../lib/space';
import { MochiUsagi, Usu } from '../components/MochiUsagiSVG';
import { USAGI_AREAS, USAGI_KEY, USAGI_NAME, USAGI_SPOT, USU_SPOT, usagiLine } from '../lib/usagi';
import type { CharKey } from '../lib/chars';
import { FishingModal } from '../components/FishingModal';
import { FarmPatch } from '../components/FarmPatch';
import { FarmModal } from '../components/FarmModal';
import { StarsModal } from '../components/StarsModal';
import { DetectiveScreen } from '../components/DetectiveTheater';
import { caseOpen, CASES, eventActive } from '../lib/detective';
import { MoonViewModal } from '../components/MoonViewModal';
import { YakiimoModal } from '../components/YakiimoModal';
import { ArborModal } from '../components/ArborModal';
import { ForestryModal } from '../components/ForestryModal';
import { FORESTS, forestryOpen } from '../lib/forestry';
import { SuisanModal } from '../components/SuisanModal';
import { suisanOpen } from '../lib/suisan';
import { SpaceTripModal } from '../components/SpaceTripModal';
import { OrganModal } from '../components/OrganModal';
import { MicroscopeModal } from '../components/MicroscopeModal';
import { LibraryModal, type BookId } from '../components/LibraryModal';
import { TreeDexModal } from '../components/TreeDexModal';
import { TransferModal } from '../components/TransferModal';
import { StampModal } from './island/StampModal';
import { MailModal } from './island/MailModal';
import { IkenModal } from './island/IkenModal';
import { IKEN_POS } from '../lib/iken';
import { costumeOf, halloweenNight, isHalloween } from '../lib/events';
import { FARM_BOX, isRipe, stageOf } from '../lib/farm';
import { soccerCups } from '../lib/soccer';

// 3Dの島（main だけ）。three.js が大きいので あとから 読む。2D と きりかえられる（端末ごとに おぼえる）
const World3D = lazy(() => import('../components/island3d/World3D'));
const PREF_3D = 'anrino-island-3d';
function webglOK(): boolean {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}
const HAS_WEBGL = typeof document !== 'undefined' && webglOK();

const IMO_SPOT = BUILDING_SPOTS.bd_imo;
const ARBOR_SPOT = BUILDING_SPOTS.bd_arbor;

const SAVE_DEBOUNCE = 600;
const MAX_DT = 0.05; // タブ復帰で瞬間移動しないように、1フレームの進みを上限で止める

// 教科キャラの最初の立ち位置（島の中にばらけさせる）
const FRIEND_SPAWNS: Pos[] = [
  { x: 0.24, y: 0.46 }, { x: 0.76, y: 0.48 }, { x: 0.30, y: 0.80 }, { x: 0.72, y: 0.80 },
  { x: 0.50, y: 0.74 }, { x: 0.40, y: 0.52 }, { x: 0.60, y: 0.58 },
];
const FRIEND_NEAR = 0.1;
const LABEL_Y = -116;   // なまえの ラベルの 高さ（キャラの 足もとから）
const LABEL_H = 34;     // かさなったときに 上へ ずらす はば
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
  fw_saturn: { y: -44, size: 28 },
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
const PIER_POS = {   // 広げた島の 上の海岸（歩ける楕円の ふちの すこし 内がわ）
  x: 0.36,
  y: MAIN_WALK_ELLIPSE.cy - MAIN_WALK_ELLIPSE.ry * Math.sqrt(1 - ((0.36 - MAIN_WALK_ELLIPSE.cx) / MAIN_WALK_ELLIPSE.rx) ** 2) + 0.014,
};
// ハロウィンの ランタン（IslandStage の 10月の かぼちゃと おなじ場所。夜に光らせる）
const LANTERNS: [number, number][] = [[520, 725], [760, 690], [430, 330], [690, 590], [870, 470]];
const WISHES = ['テストで 100てん とれますように', 'みんなと ずっと なかよし', 'しまが もっと にぎやかに なりますように', 'あしたも いい ひに なりますように'];
const SOUND_LABEL: Record<SoundMode, string> = { sfx: '🔊 こうかおん', all: '🎵 おんがく', off: '🔇 おとなし' };

const MAX_ON_ISLAND = 7;
// おうちの中に ついてきた子の 立ち位置
const HOUSE_SPAWNS: Pos[] = [{ x: 0.32, y: 0.72 }, { x: 0.42, y: 0.8 }, { x: 0.3, y: 0.86 }, { x: 0.5, y: 0.74 }];
const AREA_TITLE: Record<Area, string> = { main: '🏝 アンリノ島', east: '🌸 はなばたけの しま', house: '🏠 おうちの なか', school: '🏫 しまの がっこう', moon: PLANET_CFG.moon.title, mars: PLANET_CFG.mars.title, sun: PLANET_CFG.sun.title };   // 教科キャラを一度に出す数のめやす（主役＋あそびに来る住人）

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

type ModalKind =
  | 'feed' | 'roster' | 'stamp' | 'mail' | 'fish' | 'farm' | 'stars' | 'detective' | 'moonView'
  | 'imo' | 'arbor' | 'spaceGo' | 'spaceDex' | 'library' | 'desk' | 'organ' | 'micro' | 'transfer' | 'board' | 'opening' | 'iken' | 'forestry' | 'suisan' | 'suisanVoyage';

/** むきと あしだけ かわる しゅじんこう（島の 画面ぜんぶを かきなおさない） */
function PosedKid({ poseRef, subRef, ...rest }: {
  poseRef: { current: string }; subRef: { current: ((pose: string) => void) | null };
} & Omit<React.ComponentProps<typeof KidSVG>, 'dir' | 'step'>) {
  const [pose, setPose] = useState(poseRef.current);
  useEffect(() => {
    subRef.current = setPose;
    return () => { if (subRef.current === setPose) subRef.current = null; };
  }, [subRef]);
  const [d, st] = pose.split('_');
  return <KidSVG {...rest} dir={d as KidDir} step={Number(st) as 0 | 1 | 2} />;
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
  // しゅじんこうの むきと あし（'down_0' など。KidSVG の dir_step）。2D は PosedKid だけが よみなおす
  const kidPose = useRef('down_0');
  const kidPoseSub = useRef<((pose: string) => void) | null>(null);
  const dirtyAt = useRef(0);

  const [mode, setMode] = useState<Mode>({ kind: 'walk' });
  // ひらいている まど（同時に 2つは ひらかない）
  const [modal, setModal] = useState<ModalKind | null>(null);
  /** としょかんで ひらいている ずかん */
  const [book, setBook] = useState<BookId | null>(null);
  const [order, setOrder] = useState('');
  const [walking, setWalking] = useState(false);
  const [pref3d, setPref3d] = useState(() => { try { return localStorage.getItem(PREF_3D) !== '0'; } catch { return true; } });
  const [ready3d, setReady3d] = useState(false);
  const w3d = useRef<World3DHandle | null>(null);
  const on3dRef = useRef(false);
  const chars = useChars();
  const [giftFor, setGiftFor] = useState<Friend | null>(null);
  const [wearFor, setWearFor] = useState<Friend | null>(null);
  const [bubble, setBubble] = useState<Bubble | null>(null);
  // 🤫 けいじばんの すみの 📌 → ひみつの あいことば（lib/secret.ts）
  const [secretOpen, setSecretOpen] = useState(false);
  const [secretText, setSecretText] = useState('');
  const submitSecret = async () => {
    const r = await g.claimSecret(secretText);
    if (r.r === 'ok') { sfx('chest'); g.showToast(`🤫 ひみつの メダル 🪙${r.n}まい ゲット！`); }
    else if (r.r === 'already') { sfx('ng'); g.showToast('この ひみつは もう つかったよ', 'ng'); }
    else { sfx('ng'); g.showToast('あれ？ なにも おきなかった…', 'ng'); }
    setSecretText('');
    setSecretOpen(false);
  };
  const [jump, setJump] = useState<{ id: string; key: number } | null>(null);
  const [snd, setSnd] = useState<SoundMode>(soundMode());
  const [studyTick, setStudyTick] = useState(0);
  const detectiveNew = eventActive() && CASES.some((c) => caseOpen(c) && !save.detective.solved.includes(c.no));
  // 夜空の 星を うごかす（1分ごと）
  const [skyMin, setSkyMin] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setSkyMin((n) => n + 1), 60000);
    return () => window.clearInterval(t);
  }, []);
  // タップで えらんだ子（ついてくる子が そばに いても、ほかの子を えらべるように）
  const [picked, setPicked] = useState<string | null>(null);
  const [forestAsk, setForestAsk] = useState(false);
  const [moshiAsk, setMoshiAsk] = useState(false);
  const moshis = useMoshis();
  const moshi = moshis[0] ?? null;

  // 🔴 火星の ノルマ（その日 3教科クリア）。クイズから もどったときに よみなおす
  const [marsOk, setMarsOk] = useState(() => marsQuota().open);
  useEffect(() => {
    const re = () => setMarsOk(marsQuota().open);
    window.addEventListener('focus', re);
    document.addEventListener('visibilitychange', re);
    return () => { window.removeEventListener('focus', re); document.removeEventListener('visibilitychange', re); };
  }, []);
  // いる場所（main／east／house）と、建てたもので島が広がる。clampToIsland などが見る BOUNDS をここで切りかえる
  const area: Area = save.area === 'house' && !save.buildings.includes('bd_house') ? 'main'
    : save.area === 'school' && !save.buildings.includes('bd_school') ? 'main'
    : save.area === 'east' && !save.buildings.includes('bd_bridge') ? 'main'
    : save.area === 'moon' && !(save.buildings.includes('bd_rocket') && save.space.dex.includes('moon')) ? 'main'
    : save.area === 'mars' && !(save.buildings.includes('bd_rocket') && save.space.dex.includes('mars') && marsOk) ? 'east'
    : save.area === 'sun' && !(save.buildings.includes('bd_rocket') && save.space.dex.includes('sun')) ? 'east' : save.area;
  /** 月・火星・たいよう（ロケットで いって あるける ところ。たいようは せいれいに へんしんして あるく） */
  const planet: Planet | null = area === 'moon' || area === 'mars' || area === 'sun' ? area : null;
  const pcfg = planet ? PLANET_CFG[planet] : null;
  const indoor = area === 'house' || area === 'school';
  const want3d = area === 'main' && pref3d && HAS_WEBGL;
  const on3d = want3d && ready3d;
  // 3D の よみこみ中は 2D を 見せずに 「よみこみちゅう」を かぶせる（2D→3D と きりかわって ちらつかないように）。
  // 8びょう たっても できなければ 2D の まま あそべるように はずす
  const [slow3d, setSlow3d] = useState(false);
  useEffect(() => {
    if (!want3d || ready3d) return;
    setSlow3d(false);
    const t = window.setTimeout(() => setSlow3d(true), 8000);
    return () => window.clearTimeout(t);
  }, [want3d, ready3d]);
  on3dRef.current = on3d;
  const expansion = expansionOf(save.buildings);
  setArea(area, expansion);
  const hasBridge = save.buildings.includes('bd_bridge');
  const builtSpots = indoor ? [] : save.buildings.filter((id) => spotInArea(id, area));
  const nextBuild = ITEM_BY_ID[nextBuildId(save.buildings) ?? ''];
  const [fade, setFade] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  // 🏫 がっこう：こくばん・じゅぎょう・テレビ
  const [tvAsk, setTvAsk] = useState(false);
  const [lesson, setLesson] = useState<{ f: Friend; l: (Lesson & { id: string }) | null; show: boolean; loading: boolean } | null>(null);

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
    // たいよう：へんしん できるのは じぶんだけ（なかまは しまで おるすばん）
    if (area === 'sun') return [];
    // 月：ついてくる子（♥3）と 主役が いっしょに のってくる（たまごは おるすばん）
    if (area === 'moon' || area === 'mars') {
      const fol = [...cur, ...vis].filter((f) => f.level > 1 && heartsOf(save.friendsPlay[f.char]?.pts ?? 0) >= FOLLOW_HEARTS && !save.friendsPlay[f.char]?.followOff);
      return [...fol, ...cur.filter((f) => f.level > 1 && !fol.includes(f))].slice(0, 4);
    }
    // がっこう：主役と きょう あそびに来た子が つくえに すわる（たまごは こない）
    if (area === 'school') return [...cur, ...vis].filter((f) => f.level > 1).slice(0, SCHOOL_DESKS.length);
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
  // なまえの ラベル（2D）。かさならない・はしで きれない 位置を ループで きめる。はばは 文字が かわったときだけ はかる
  const friendLabels = useRef<Record<string, SVGTextElement | null>>({});
  const labelW = useRef<Record<string, { t: string; w: number }>>({});
  // 場所を移ったら、キャラの立ち位置は その場所で あたらしく決める
  const lastArea = useRef(area);
  const areaRef = useRef(area);
  areaRef.current = area;
  // 🌕 月：ふわっと ジャンプ（はじめた時刻）と あしあと（セーブしない）
  const moonJumpAt = useRef(0);
  const pcfgRef = useRef<(typeof PLANET_CFG)[Planet] | null>(null);
  // 🐰 もちつきうさぎ：月では うすの よこ、ちきゅうに きたら ついてくる
  const usagiHome = save.usagi.home;
  const usagiFollow = usagiHome && USAGI_AREAS.includes(area);
  const usagiHere = (area === 'moon' && save.buildings.includes('bd_rocket')) || usagiFollow;
  const usagiPos = useRef<Pos>(USAGI_SPOT);
  const usagiNode = useRef<SVGGElement | null>(null);
  const usagiMode = useRef({ here: false, follow: false });
  usagiMode.current = { here: usagiHere, follow: usagiFollow };
  const footRef = useRef<SVGGElement | null>(null);
  const lastFoot = useRef<Pos | null>(null);
  if (lastArea.current !== area) {
    usagiPos.current = usagiFollow ? clampToIsland({ x: playerPos.current.x - 0.09, y: playerPos.current.y + 0.01 }) : USAGI_SPOT;
    footRef.current?.replaceChildren();
    lastFoot.current = null;
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
      const spawns = area === 'house' ? HOUSE_SPAWNS : area === 'school' ? SCHOOL_DESKS : FRIEND_SPAWNS;
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
  // しゅじんこうの きせかえ（もっている fwear だけ）
  const playerWear = save.playerWear && save.owned.includes(save.playerWear) && ITEM_BY_ID[save.playerWear]?.kind === 'fwear' ? save.playerWear : null;
  const unread = save.letters.filter((l) => !l.read).length;

  // ── おてがみ：島を開いたとき・クイズから戻ったときに、前回からの変化を見て届ける ──
  const saveRef2 = useRef(save);
  saveRef2.current = save;
  const lastMarks = useRef<unknown>(null);
  const [monthBanner, setMonthBanner] = useState<string | null>(null);
  useEffect(() => {
    const cur = saveRef2.current;
    // 同じ記録から2回 手紙を作らない（開発中の二重実行・すばやい再描画でも1回だけ）
    const openCases = CASES.filter((c) => caseOpen(c)).map((c) => c.no);
    const sig = JSON.stringify([cur.letterMarks, snap.currentMonth, snap.friends.map((f) => [f.id, f.level, f.n]), stamps.length, ym, openCases, moshis.map((m) => m.test.key).join(',')]);
    if (lastMarks.current === sig) return;
    lastMarks.current = sig;
    const r = buildLetters(cur.letterMarks, {
      friends: snap.friends,
      playerName: cur.player ? PALETTES[cur.player].name : '',
      stampCount: stamps.length,
      ym,
      weekDays: daysThisWeek(new Date(), byDate),
      halloween: isHalloween(),
      detectiveOpen: openCases,
      moshiOpen: moshis.map((m) => ({ key: m.test.key, name: m.test.name, diff: m.diff, extra: !!m.test.extra, rewards: moshiRewards(m.test).map((r) => r.reward) })),
      currentMonth: snap.currentMonth,
      stampDaysOf: (m) => stampDays(Number(m.slice(0, 4)), Number(m.slice(4)), byDate).length,
    });
    if (r.newMonth) setMonthBanner(r.newMonth);
    if (r.letters.length || JSON.stringify(r.marks) !== JSON.stringify(cur.letterMarks)) {
      gRef.current.deliverLetters(r.letters, r.marks, r.gifts);
      if (r.letters.length) gRef.current.showToast(`💌 おてがみが ${r.letters.length}つう とどいたよ！`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap, stamps.length, ym, moshis]);

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

  // サッカー（/soccer/）から もどったら、しあいの ごほうびを うけとる。ゆうしょうの 数だけ ピッチに トロフィー
  const [cups, setCups] = useState(soccerCups);
  useEffect(() => {
    const r = gRef.current.claimSoccer();
    if (!r) return;
    setCups(soccerCups());
    sfx('chest');
    const parts: string[] = [];
    if (r.cups) parts.push(`🏆 ゆうしょう おめでとう！`);
    if (r.medals) parts.push(`⚽ サッカーの ごほうび メダル 🪙${r.medals}まい！`);
    if (r.items.length) parts.push(r.items.map((id) => `${ITEM_BY_ID[id]?.emoji ?? ''}${ITEM_BY_ID[id]?.name ?? ''}`).join('・') + ' を もらったよ（もちものから おけるよ）');
    if (!r.medals && r.capped) parts.push('⚽ きょうの かちの メダルは もう もらったよ。また あした！');
    gRef.current.showToast(parts.join('　'));
  }, []);
  const stageRefState = useRef({
    eggStage: monster.stage === 'egg', placed: placedHere, play: save.friendsPlay,
    school: area === 'main' && save.buildings.includes('bd_school'), built: builtSpots, inSchool: area === 'school',
  });
  stageRefState.current = {
    eggStage: monster.stage === 'egg', placed: placedHere, play: save.friendsPlay,
    school: area === 'main' && save.buildings.includes('bd_school'), built: builtSpots, inSchool: area === 'school',
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

  // たまごは うごかないので、主人公と かさなっていると ずっと かくれて しまう。ひらいたときに となりへ ずらす
  useEffect(() => {
    if (monster.stage !== 'egg' || area !== 'main') return;
    const p = playerPos.current;
    if (dist(p, monsterPos.current) >= 0.05) return;   // ほぼ まうえに いるときだけ（となりで とまっても うごかさない）
    const spot = clampToIsland({ x: p.x + (p.x < 0.5 ? 0.13 : -0.13), y: p.y - 0.03 });
    monsterPos.current = spot;
    monsterTarget.current = spot;
    commit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area]);

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
      let mdx = 0, mdy = 0;   // うごいた むき（がめんの ピクセル）
      if (a.x || a.y) {
        tapTarget.current = null;
        const next = stepByAxis(playerPos.current, a.x, a.y, PLAYER_SPEED, dt);
        moved = next.x !== playerPos.current.x || next.y !== playerPos.current.y;
        if (a.x !== 0) flip.current = a.x < 0;
        mdx = a.x; mdy = a.y;
        playerPos.current = next;
      } else if (tapTarget.current) {
        const before = playerPos.current;
        const { pos, arrived } = stepToward(before, tapTarget.current, PLAYER_SPEED, dt);
        if (pos.x !== before.x) flip.current = pos.x < before.x;
        moved = pos.x !== before.x || pos.y !== before.y;
        mdx = (pos.x - before.x) * ISLAND_W; mdy = (pos.y - before.y) * ISLAND_H;
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
        if (f.level > 1 && !stageRefState.current.inSchool) {   // がっこうでは つくえに すわったまま
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
                ? clampToIsland({ x: SCHOOL_FRONT.x + (i - 1.5) * 0.08, y: SCHOOL_FRONT.y + 0.02 + (i % 2) * 0.05 })   // くっつきすぎないように ばらす
                : wanderTarget(pos);
            }
          }
        }
        const node = friendNodes.current[f.id];
        const fp = friendPos.current[f.id];
        if (node) node.setAttribute('transform', `translate(${fp.x * ISLAND_W} ${fp.y * ISLAND_H})`);
      });

      // なまえ（2D）：手前の子から 場所を きめ、かさなる子は 上へ。画面の はしでは よこへ ずらす
      if (!on3dRef.current) {
        const cx = cam.current?.x ?? 0;
        const tags: { el: SVGTextElement; ox: number; oy: number; x: number; y: number; w: number }[] = [];
        for (const f of friendsRef.current) {
          const el = friendLabels.current[f.id];
          const fp = friendPos.current[f.id];
          if (!el || !fp) continue;
          const txt = el.textContent ?? '';
          let m = labelW.current[f.id];
          if (!m || m.t !== txt) { m = { t: txt, w: el.getComputedTextLength() }; labelW.current[f.id] = m; }
          const ox = fp.x * ISLAND_W, oy = fp.y * ISLAND_H;
          tags.push({ el, ox, oy, x: ox, y: oy + LABEL_Y, w: m.w });
        }
        tags.sort((a, b) => b.y - a.y);
        const done: typeof tags = [];
        for (const t of tags) {
          t.x = Math.max(cx + t.w / 2 + 6, Math.min(cx + ISLAND_W - t.w / 2 - 6, t.x));
          for (let n = 0; n < 6; n++) {
            const hit = done.find((d) => Math.abs(d.x - t.x) < (d.w + t.w) / 2 + 4 && Math.abs(d.y - t.y) < LABEL_H);
            if (!hit) break;
            t.y = hit.y - LABEL_H;
          }
          done.push(t);
          const lx = String(Math.round(t.x - t.ox)), ly = String(Math.round(t.y - t.oy));
          if (t.el.getAttribute('x') !== lx) t.el.setAttribute('x', lx);
          if (t.el.getAttribute('y') !== ly) t.el.setAttribute('y', ly);
        }
      }

      // 🐰 うさぎ：ついてくる ときは 主人公の ひだりうしろへ
      if (usagiMode.current.here) {
        if (usagiMode.current.follow) {
          const pp = playerPos.current;
          const spot = clampToIsland({ x: pp.x - 0.09, y: pp.y + 0.01 });
          if (dist(usagiPos.current, spot) > 0.03) usagiPos.current = clampToIsland(stepToward(usagiPos.current, spot, MONSTER_SPEED * 3.2, dt).pos);
        }
        friendPos.current['@usagi'] = usagiPos.current;   // 3D も おなじ いち
        usagiNode.current?.setAttribute('transform', `translate(${usagiPos.current.x * ISLAND_W} ${usagiPos.current.y * ISLAND_H})`);
      }

      // 安全網。なにがあっても島の外には出さない
      playerPos.current = clampToIsland(playerPos.current);
      monsterPos.current = clampToIsland(monsterPos.current);

      if (moved) {
        walkPhase.current += dt * 11;
        dirtyAt.current = t;
      }
      // むき（よこが つよければ よこ、そうでなければ うえ／した）と あし
      {
        const [d0] = kidPose.current.split('_');
        const dir: KidDir = !moved ? (d0 as KidDir) : Math.abs(mdx) > Math.abs(mdy) ? 'side' : mdy < 0 ? 'up' : 'down';
        const step = moved ? (Math.floor(walkPhase.current / Math.PI) % 2 ? 1 : 2) : 0;
        const pose = dir + '_' + step;
        if (pose !== kidPose.current) { kidPose.current = pose; kidPoseSub.current?.(pose); }
      }

      // カメラ（main）：主人公に ついていく
      if (isWideArea() && cam.current) {
        const tg = camTarget(playerPos.current);
        const k = Math.min(1, dt * 6);
        const nx = cam.current.x + (tg.x - cam.current.x) * k;
        const ny = cam.current.y + (tg.y - cam.current.y) * k;
        if (Math.abs(nx - cam.current.x) > 0.05 || Math.abs(ny - cam.current.y) > 0.05) {
          cam.current = { x: nx, y: ny };
          if (!on3dRef.current) {
            stageRef.current?.setAttribute('viewBox', `${nx} ${ny} ${ISLAND_W} ${ISLAND_H}`);
            skyRef.current?.setAttribute('transform', `translate(${nx} ${ny})`);
          }
        }
      }

      // DOM に反映
      let bob = moved ? Math.abs(Math.sin(walkPhase.current)) * 7 : 0;
      const pc = pcfgRef.current;
      if (pc) {
        // じゅうりょくが 月は 6ぶんの1・火星は 3ぶんの1：あるくと ゆっくり 大きく はねる。ジャンプは ふわーっと
        bob = moved ? Math.abs(Math.sin(walkPhase.current * 0.45)) * pc.hop : 0;
        const jt = (t - moonJumpAt.current) / pc.jumpMs;
        if (jt >= 0 && jt < 1) bob += Math.sin(Math.PI * jt) * pc.jump;
        // あしあと：すこし すすむごとに 1つ（さいごの 40こ）
        const pp0 = playerPos.current;
        const lf = lastFoot.current;
        if (moved && footRef.current && (!lf || Math.hypot(pp0.x - lf.x, pp0.y - lf.y) > 0.035)) {
          lastFoot.current = pp0;
          const n = footRef.current.childElementCount;
          const el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
          el.setAttribute('cx', String(pp0.x * ISLAND_W + (n % 2 ? 9 : -9)));
          el.setAttribute('cy', String(pp0.y * ISLAND_H - 2));
          el.setAttribute('rx', '7'); el.setAttribute('ry', '4');
          el.setAttribute('fill', pc.foot);
          footRef.current.appendChild(el);
          if (n >= 40) footRef.current.firstElementChild?.remove();
        }
      }
      if (playerNodeRef.current) {
        playerNodeRef.current.setAttribute(
          'transform',
          `translate(${playerPos.current.x * ISLAND_W} ${playerPos.current.y * ISLAND_H - bob}) scale(${flip.current && kidPose.current.startsWith('side') ? -1 : 1} 1)`,
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
        ...(usagiMode.current.here ? [[usagiPos.current.y, '@usagi'] as const] : []),
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
    // 画面の中の位置 → 島の位置（main は カメラぶん たす。3D は 地面との 交わりを 計算する）
    const c = cam.current ?? { x: 0, y: 0 };
    const picked = on3dRef.current ? w3d.current?.pick(e.clientX, e.clientY) : null;
    if (on3dRef.current && !picked) return;   // 空を タップした
    const raw = picked ?? {
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
    if (area === 'main' && dist(raw, { x: MAIL_POS.x, y: MAIL_POS.y - 0.05 }) < 0.06) { setModal('mail'); return; }
    if (area === 'main' && dist(raw, { x: IKEN_POS.x, y: IKEN_POS.y - 0.045 }) < 0.05) { sfx('letter'); setModal('iken'); return; }
    if (area === 'house' && gameAt(raw)) { sfx('letter'); location.href = '/sora/?from=island'; return; }
    if (area === 'house' && moshiShelfAt(raw)) { sfx('letter'); location.href = '/rpg.html#moshi=' + SHELF_MOSHI.key; return; }
    const trophy = area === 'house' ? (trophyAt(raw) ?? certAt(raw)) : undefined;
    if (trophy) { sfx('letter'); g.showToast(trophy.toast); return; }
    if (area === 'house') {
      const hit = placedHere.find((q) => (q.id === 'in_desk' || q.id === 'in_bed') && dist(raw, { x: q.x, y: q.y - 0.04 }) < 0.08);
      if (hit?.id === 'in_desk') { setModal('desk'); return; }
      if (hit?.id === 'in_bed') { goToBed(); return; }
    }
    if (area === 'house' || area === 'school') {
      const organ = placedHere.find((q) => q.id === 'sc_organ' && dist(raw, { x: q.x, y: q.y - 0.04 }) < 0.08);
      if (organ) { setModal('organ'); return; }
      const micro = placedHere.find((q) => q.id === 'sc_micro' && dist(raw, { x: q.x, y: q.y - 0.04 }) < 0.08);
      if (micro) { setModal('micro'); return; }
    }
    if (area === 'school') {
      const inBox = (b: { x0: number; x1: number; y0: number; y1: number }) => raw.x >= b.x0 && raw.x <= b.x1 && raw.y >= b.y0 && raw.y <= b.y1;
      if (inBox(SCHOOL_HITS.board)) { sfx('letter'); setModal('board'); return; }
      if (inBox(SCHOOL_HITS.tv)) { sfx('letter'); setTvAsk(true); return; }
      if (inBox(SCHOOL_HITS.notice)) { sfx('letter'); setModal('roster'); return; }
    }
    if (pcfg) {
      if (moonStone && dist(raw, { x: moonStone.x, y: moonStone.y - 0.02 }) < 0.06) { pickStone(); return; }
      if (dist(raw, { x: DOORS.moonRocket.x + 0.03, y: DOORS.moonRocket.y - 0.2 }) < 0.1) { goHomeFromMoon(); return; }
      const hit = (pcfg.hits as readonly { id: string; x: number; y: number; r: number; text: string }[]).find((h) => dist(raw, h) < h.r);
      if (hit && planet === 'sun') { tapSunHit(hit); return; }
      if (hit) { sfx('letter'); g.showToast(planet === 'moon' && hit.id === 'earth' ? earthText() : hit.text); return; }
    }
    if (usagiHere && dist(raw, { x: usagiPos.current.x, y: usagiPos.current.y - 0.07 }) < 0.07) { tapUsagi(); return; }
    if (area === 'moon' && dist(raw, { x: USU_SPOT.x, y: USU_SPOT.y - 0.04 }) < 0.05) {
      sfx('letter'); g.showToast('🍡 うすと きねで おもちを つくよ。にっぽんでは、つきの もようが この すがたに みえるんだって'); return;
    }
    for (const f of friends) {
      const fp = friendPos.current[f.id];
      if (fp && dist(raw, { x: fp.x, y: fp.y - 0.07 }) < 0.065) {
        tapFriend(f);
        if (area === 'school') openLesson(f);
        return;
      }
    }
    if (area === 'main' && dist(raw, { x: monsterPos.current.x, y: monsterPos.current.y - 0.07 }) < 0.065) {
      setJump({ id: '@monster', key: Date.now() });
      voice(monster.charKey ?? 'egg');
      return;
    }
    if (area === 'main' && dist(raw, FOREST_ISLET) < 0.11) { setForestAsk(true); return; }
    if (area === 'main' && moshi && dist(raw, MOSHI_ISLET) < 0.12) { sfx('letter'); setMoshiAsk(true); return; }
    if (area === 'main' && hasPier && Math.abs(raw.x - PIER_POS.x) < 0.04 && raw.y < PIER_POS.y - 0.03) { setModal('fish'); return; }
    if (area === 'main' && raw.x >= FARM_BOX.x0 && raw.x <= FARM_BOX.x1 && raw.y >= FARM_BOX.y0 && raw.y <= FARM_BOX.y1) { setModal('farm'); return; }
    if (area === 'main' && save.buildings.includes('bd_observ') && dist(raw, BUILDING_SPOTS.bd_observ) < 0.09) { openObserv(); return; }
    if (area === 'main' && save.buildings.includes('bd_moon') && dist(raw, BUILDING_SPOTS.bd_moon) < 0.09) { openMoonView(); return; }
    if (area === 'east' && save.buildings.includes('bd_imo') && dist(raw, { x: IMO_SPOT.x, y: IMO_SPOT.y - 0.06 }) < 0.09) { setModal('imo'); return; }
    if (area === 'east' && save.buildings.includes('bd_arbor') && dist(raw, { x: ARBOR_SPOT.x, y: ARBOR_SPOT.y - 0.05 }) < 0.09) { setModal('arbor'); return; }
    if (area === 'east' && save.buildings.includes('bd_rocket') && dist(raw, { x: BUILDING_SPOTS.bd_rocket.x, y: BUILDING_SPOTS.bd_rocket.y - 0.1 }) < 0.09) { setModal('spaceGo'); return; }
    if (area === 'east' && save.buildings.includes('bd_base') && dist(raw, { x: BUILDING_SPOTS.bd_base.x, y: BUILDING_SPOTS.bd_base.y - 0.05 }) < 0.08) { setModal('spaceDex'); return; }
    if (area === 'east' && save.buildings.includes('bd_planet') && dist(raw, { x: BUILDING_SPOTS.bd_planet.x, y: BUILDING_SPOTS.bd_planet.y - 0.05 }) < 0.08) { setModal('library'); return; }
    tapTarget.current = p;
  };

  // 🌕🔴 きょうの いし（ほしごとに 1日1こ。ひろったら きえる）
  pcfgRef.current = pcfg;
  const moonStone = planet && save.space[planet === 'moon' ? 'moonStone' : planet === 'mars' ? 'marsStone' : 'sunStone'] !== day ? planetStoneSpot(planet, day) : null;
  // 月・火星に いる あいだは うちゅうの BGM（音の設定が off なら 鳴らない）
  useEffect(() => {
    if (!planet) return;
    setSpaceBgm('space');
    return () => setSpaceBgm(null);
  }, [planet]);
  // ノルマの 日が おわったのに 火星に いたら、となりの しまの ロケットの まえに もどす
  useEffect(() => {
    if (save.area === 'mars' && area === 'east') {
      playerPos.current = ENTRY.eastFromMoon;
      g.goArea('east', ENTRY.eastFromMoon);
      g.showToast('🚀 かせいから かえってきたよ。また ノルマを クリアしたら いこうね');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save.area, area]);
  const pickStone = () => { if (planet && g.pickPlanetStone(planet, day)) g.showToast(`${pcfg!.stone}を みつけた！ うちゅうしょく +${STONE_FOOD[planet]}`); };
  // ☀️ たいようで みつけた もの（ぜんぶで しょうごう）
  const sunSeen = save.space.sunSeen.filter((id) => SUN_HITS.some((h) => h.id === id)).length;
  const tapSunHit = (hit: { id: string; text: string }) => {
    const r = g.seeSun(hit.id, SUN_HITS.length);
    sfx(r.isNew ? 'chest' : 'letter');
    g.showToast(r.done
      ? `${hit.text}　🎉 ぜんぶ みつけた！ しょうごう「${SUN_TITLE}」`
      : r.isNew ? `${hit.text}（みつけた ${sunSeen + 1}/${SUN_HITS.length}）` : hit.text);
  };
  // ☀️ たいように ついたら へんしんの ひかり
  const [henshin, setHenshin] = useState(false);
  useEffect(() => {
    if (area !== 'sun') return;
    setHenshin(true);
    g.showToast('✨ へんしん！ たいようの せいれいに なった！ ほんとうの たいようは あつすぎて だれも ちかづけないよ');
    const t = window.setTimeout(() => setHenshin(false), 1800);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area]);
  const goHomeFromMoon = () => { sfx('launch'); travel('east', ENTRY.eastFromMoon); };
  const moonJump = () => { moonJumpAt.current = performance.now(); friends.forEach((f, i) => window.setTimeout(() => setJump({ id: f.id, key: Date.now() + i }), 120 + i * 150)); };
  const earthText = () => {
    // ひかって いる わりあい（0＝まっくら、1＝まんまる）
    const lit = (1 - Math.cos((2 * Math.PI * earthAge(moonAge)) / SYNODIC)) / 2;
    const look = lit > 0.85 ? 'まんまるに ひかって' : lit > 0.62 ? 'ほとんど まるく ひかって' : lit > 0.38 ? 'はんぶん ひかって' : lit > 0.12 ? 'ほそく ひかって' : 'ほとんど くらく なって';
    return `🌍 いまの ちきゅうは ${look} いるよ。月から みた ちきゅうは、ちきゅうから みた 月と ぎゃくに みちかけ するんだ（いまの 月は ${moonName(moonAge).replace(/（.*?）/, '')}）。`;
  };

  // 🐰 もちつきうさぎ
  const usagiHearts = heartsOf(save.friendsPlay[USAGI_KEY]?.pts ?? 0);
  const usagiTalkN = useRef(0);
  const usagiFriend: Friend = {
    id: '@usagi', month: '', monthLabel: '', cat: '', catLabel: 'つき', char: USAGI_KEY as CharKey, name: USAGI_NAME,
    level: 2, stars: 0, fill: 0, levelName: '', n: 0, total: 0,
  };
  const tapUsagi = () => {
    setJump({ id: '@usagi', key: Date.now() });
    const text = usagiLine(area, usagiHome, usagiHearts, day.length + usagiTalkN.current++);
    const r = g.talkUsagi(day);
    setBubble({ char: USAGI_KEY, text, heart: !!r, key: Date.now() });
    if (r && r.heartsAfter > r.heartsBefore) {
      g.showToast(`💗 ${USAGI_NAME}との なかよしが ♥${r.heartsAfter} に なった！` + (r.heartsAfter === FOLLOW_HEARTS && !usagiHome ? '　ちきゅうに さそえるように なったよ' : ''));
    } else if (r) g.showToast(`💗 ${USAGI_NAME}と おはなし（なかよし +1）`);
  };
  const inviteUsagi = () => {
    g.setUsagiHome(true);
    setJump({ id: '@usagi', key: Date.now() });
    setBubble({ char: USAGI_KEY, text: 'やったー！ ちきゅうに いける！', heart: true, key: Date.now() });
    sfx('heart');
    g.showToast(`🐰 ${USAGI_NAME}が なかまに なった！ ちきゅうでも ついてくるよ`);
  };
  const leaveUsagi = () => {
    g.setUsagiHome(false);
    usagiPos.current = USAGI_SPOT;
    setBubble({ char: USAGI_KEY, text: 'また むかえに きてね！ ぺったん ぺったん', heart: false, key: Date.now() });
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
    if (f.level <= 1) { setBubble({ char: f.char, text: '…コトコト', heart: false, key: Date.now() }); return; }
    const c = talkCtx(f);
    const say = (text: string, heart = false) => setBubble({ char: f.char, text, heart, key: Date.now() });
    // きょうの おねがい
    const req = todayReq;
    if (req && req.kind === 'talk' && req.to === f.char) {
      const from = friends.find((x) => x.char === req.char)?.name ?? CHAR_NAMES[req.char as keyof typeof CHAR_NAMES] ?? 'なかま';
      say(`${from}から？ うれしい！ ありがとう`, true);
      finishReq();
      return;
    }
    if (req && req.char === f.char) {
      const ok = (req.kind === 'quiz' && studied) || (req.kind === 'water' && save.farm.plots.some((q) => q && q.watered === day));
      if (ok) { say(thanksLine(c), true); finishReq(); return; }
      const to = req.kind === 'talk' ? friends.find((x) => x.char === req.to)?.name ?? CHAR_NAMES[req.to as keyof typeof CHAR_NAMES] : undefined;
      say(requestLine(req, c, { item: req.kind === 'gift' ? `${ITEM_BY_ID[req.item]?.emoji ?? ''}${ITEM_BY_ID[req.item]?.name ?? ''}` : undefined, to }));
      if (req.kind === 'gift' && !(save.inventory[req.item] > 0)) g.showToast(`${ITEM_BY_ID[req.item]?.emoji ?? ''} ${ITEM_BY_ID[req.item]?.name ?? ''}は ショップで かえるよ`);
      return;
    }
    // ふつうの おしゃべり：つづけて タップすると はなしが つづく
    const cv = convo.current;
    const n = cv && cv.id === f.id && Date.now() - cv.at < 9000 ? cv.n + 1 : 0;
    const line = talkLine(c, n);
    convo.current = line.end ? null : { id: f.id, n, at: Date.now() };
    const daily = g.talkDaily(f.char);
    say(line.text, daily.first);
    if (daily.heartsAfter > daily.heartsBefore) g.showToast(`💗 ${f.name}との なかよしが ♥${daily.heartsAfter} に なった！`);
  };

  // おねがいを かなえた
  const finishReq = () => {
    const r = g.finishRequest();
    if (!r) return;
    const fr = snap.friends.find((x) => x.char === r.char);
    const nm = fr?.name ?? CHAR_NAMES[r.char as keyof typeof CHAR_NAMES] ?? 'なかま';
    g.showToast(`✨ ${nm}の おねがいを かなえた！ おれいに ${ITEM_BY_ID[r.gift]?.emoji ?? ''}${ITEM_BY_ID[r.gift]?.name ?? ''} を もらったよ` +
      (r.heartsAfter > r.heartsBefore ? `　なかよし ♥${r.heartsAfter}` : ''));
  };

  // 🏫 じゅぎょう：その子の 月・教科の もんだいを 1もん
  const openLesson = (f: Friend, notId?: string) => {
    setLesson({ f, l: null, show: false, loading: true });
    pickLesson(f.month, f.cat, notId).then((l) => {
      setLesson((cur) => (cur && cur.f.id === f.id ? { f, l, show: false, loading: false } : cur));
    });
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
    setModal('stars');
  };
  const openMoonView = () => {
    if (tod === 'day') { g.showToast('よるに なったら おそなえ できるよ 🎑'); return; }
    setModal('moonView');
  };

  const nearMonster = area === 'main' && isNear(playerPos.current, monsterPos.current);
  const pp = playerPos.current;
  const nearDoorIn = area === 'main' && save.buildings.includes('bd_house') && dist(pp, DOORS.mainToHouse) <= 0.09;
  const nearDoorOut = area === 'house' && dist(pp, DOORS.houseToMain) <= 0.12;
  const nearGame = area === 'house' && dist(pp, GAME_SPOT) <= 0.1;
  const nearShelf = area === 'house' && dist(pp, MOSHI_SHELF_SPOT) <= 0.09;
  const nearSchoolIn = area === 'main' && save.buildings.includes('bd_school') && dist(pp, DOORS.mainToSchool) <= 0.09;
  const nearSchoolOut = area === 'school' && dist(pp, DOORS.schoolToMain) <= 0.12;
  const nearBridgeGo = area === 'main' && hasBridge && dist(pp, DOORS.mainToEast) <= 0.1;
  const nearBridgeBack = area === 'east' && dist(pp, DOORS.eastToMain) <= 0.1;
  const nearSoccer = area === 'main' && dist(pp, DOORS.mainToSoccer) <= 0.11;
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
  const nearFarm = area === 'main' && pp.x >= FARM_BOX.x0 - 0.02 && pp.x <= FARM_BOX.x1 + 0.02 && pp.y >= FARM_BOX.y0 - 0.01 && pp.y <= FARM_BOX.y1 + 0.05;
  const nearObserv = area === 'main' && save.buildings.includes('bd_observ') && dist(playerPos.current, BUILDING_SPOTS.bd_observ) <= 0.1;
  const nearMoonPlat = area === 'main' && save.buildings.includes('bd_moon') && dist(playerPos.current, BUILDING_SPOTS.bd_moon) <= 0.1;
  const nearImo = area === 'east' && save.buildings.includes('bd_imo') && dist(playerPos.current, IMO_SPOT) <= 0.1;
  const nearEastBd = (id: string) => area === 'east' && save.buildings.includes(id) && dist(playerPos.current, BUILDING_SPOTS[id]) <= 0.1;
  const nearArbor = nearEastBd('bd_arbor');
  const nearRocket = nearEastBd('bd_rocket');
  const nearBase = nearEastBd('bd_base');
  const nearLibrary = nearEastBd('bd_planet');   // としょかん（もと プラネタリウム）
  // やきいもやさんの おきゃくさん：となりの しまに いる子（いなければ たまごでない なかま）
  const imoCustomers = useMemo(() => {
    const here = friends.filter((f) => f.level > 1);
    return here.length ? here : snap.friends.filter((f) => f.level > 1);
  }, [friends, snap.friends]);

  // 近づいたら ひとこと（なかよし度に合わせたあいさつか、勉強の声かけ）
  const nearChar = nearFriend?.char ?? '';
  useEffect(() => {
    const f = friendsRef.current.find((x) => x.char === nearChar);
    if (!f || f.level <= 1) return;
    // ついてくる子が いれかわるたびに あいさつすると うるさいので、おなじ子は 1ぷんに 1回まで
    const last = greetAt.current[f.char] ?? 0;
    if (Date.now() - last < 60000) return;
    greetAt.current[f.char] = Date.now();
    const h = heartsOf(stageRefState.current.play[f.char]?.pts ?? 0);
    const cur = f.month === snapRef.current.currentMonth;
    const study = f.total > 0 && f.n < f.total && Math.random() < 0.5;
    const text = study
      ? `${cur ? '' : f.monthLabel + 'の '}⭐ ${f.n}/${f.total}こ！ もっと そだちたいな`
      : !cur && Math.random() < 0.5 ? `${f.monthLabel}から あそびに きたよ！` : h >= 4 && Math.random() < 0.3 ? GREET[h] : talkLine(talkCtxRef.current(f), 0).text;
    setBubble({ char: f.char, text, heart: false, key: Date.now() });
    convo.current = { id: f.id, n: 0, at: Date.now() };   // つぎに タップしたら はなしの つづき
  }, [nearChar]);

  useEffect(() => {
    if (!bubble) return;
    const id = window.setTimeout(() => setBubble(null), Math.max(2800, bubble.text.length * 130));
    return () => window.clearTimeout(id);
  }, [bubble]);

  // ── なかまの おしゃべり ──
  const greetAt = useRef<Record<string, number>>({});
  const convo = useRef<{ id: string; n: number; at: number } | null>(null);
  const todayReq = save.talk.day === day && !save.talk.done ? save.talk.req : null;
  const talkCtx = (f: Friend): TalkCtx => {
    const y = new Date(); y.setDate(y.getDate() - 1);
    return {
      char: f.char, me: f.name, cat: f.cat, catLabel: f.catLabel, hearts: heartsFor(f), name: playerName,
      hour: hourNow(), tod, weather, month: seasonNow(),
      studiedToday: studied, answeredToday: byDate[day] || 0, studiedYesterday: (byDate[dateKey(y)] || 0) >= 5, weekDays: daysThisWeek(new Date(), byDate),
      moonFull: isNearFull(moonAge), halloween: hw, ripe: farmStages.some((n, i) => isRipe(save.farm.plots[i], n)),
      unread, chest: showChest, monHungry: mo === 'hungry', mon: monsterName, buildings: save.buildings,
      others: friends.filter((x) => x.id !== f.id).map((x) => ({ name: x.name, catLabel: x.catLabel })),
    };
  };
  // きょうの おねがいを きめる（島に いる なかまから 1人）
  const reqKey = area === 'main' ? friends.filter((f) => f.level > 1).map((f) => f.char).join(',') : '';
  useEffect(() => {
    if (!reqKey) return;
    const owned = ITEMS.filter((i) => i.kind === 'gift' && (save.inventory[i.id] ?? 0) > 0).map((i) => i.id);
    g.ensureRequest(reqKey.split(','), {
      giftItems: owned.length ? owned : EVERYDAY_GIFTS,
      canWater: save.farm.plots.some((q) => q && q.watered !== day),
      studied,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqKey, day]);
  // ちかくに いる なかまどうしが ときどき おしゃべり する
  const bubbleRef = useRef(bubble);
  bubbleRef.current = bubble;
  const talkCtxRef = useRef(talkCtx);
  talkCtxRef.current = talkCtx;
  useEffect(() => {
    if (indoor) return;
    let t2 = 0;
    const iv = window.setInterval(() => {
      if (bubbleRef.current || document.hidden) return;
      const list = friendsRef.current.filter((f) => f.level > 1 && friendPos.current[f.id]);
      const pairs: [Friend, Friend][] = [];
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
        if (dist(friendPos.current[list[i].id], friendPos.current[list[j].id]) < 0.2) pairs.push([list[i], list[j]]);
      }
      if (!pairs.length || Math.random() < 0.35) return;
      const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
      const [x, y] = pairTalk(talkCtxRef.current(a), { name: b.name, catLabel: b.catLabel, char: b.char });
      setBubble({ char: a.char, text: x, heart: false, key: Date.now() });
      t2 = window.setTimeout(() => setBubble({ char: b.char, text: y, heart: false, key: Date.now() + 1 }), Math.max(2600, x.length * 120));
    }, 11000);
    return () => { window.clearInterval(iv); window.clearTimeout(t2); };
  }, [indoor]);

  const gifts = useMemo(
    () => ITEMS.filter((i) => i.kind === 'gift' && (save.inventory[i.id] ?? 0) > 0),
    [save.inventory],
  );
  const wears = useMemo(() => ITEMS.filter((i) => i.kind === 'fwear' && save.owned.includes(i.id)), [save.owned]);

  const give = (f: Friend, itemId: string) => {
    const r = g.giveGift(f.char, f.name, itemId);
    if (!r) return;
    setGiftFor(null);
    if (todayReq && todayReq.kind === 'gift' && todayReq.char === f.char && todayReq.item === itemId) {
      setBubble({ char: f.char, text: thanksLine(talkCtx(f)), heart: true, key: Date.now() });
      finishReq();
      return;
    }
    setBubble({
      char: f.char,
      text: r.favorite ? 'わあ！ これ だいすき！' : 'ありがとう！ うれしいな',
      heart: true,
      key: Date.now(),
    });
    if (r.heartsAfter > r.heartsBefore) {
      g.showToast(`💗 ${f.name}との なかよしが ♥${r.heartsAfter} に なった！` +
        (r.heartsAfter === FOLLOW_HEARTS ? ((f.char as string) === USAGI_KEY ? (usagiHome ? '' : '　ちきゅうに さそえるように なったよ') : '　ついてくるように なったよ') : '') +
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

    // 🗳️ いけんばこ（ポストの となり）
    if (area === 'main') list.push({
      id: '@iken',
      y: IKEN_POS.y,
      node: (
        <g key="@iken" transform={`translate(${IKEN_POS.x * ISLAND_W} ${IKEN_POS.y * ISLAND_H})`} style={{ pointerEvents: 'none' }}>
          <ellipse cx="0" cy="2" rx="18" ry="5" fill="rgba(0,0,0,0.2)" />
          <rect x="-3" y="-30" width="6" height="30" fill="#92400e" stroke="#4c1d95" strokeWidth="2" />
          <rect x="-19" y="-58" width="38" height="30" rx="4" fill="#38bdf8" stroke="#4c1d95" strokeWidth="2.4" />
          <path d="M-22 -58 L0 -70 L22 -58 Z" fill="#0369a1" stroke="#4c1d95" strokeWidth="2.2" strokeLinejoin="round" />
          <rect x="-10" y="-52" width="20" height="4" rx="2" fill="#0c4a6e" />
          <text x="0" y="-34" fontSize="10" fontWeight="900" textAnchor="middle" fill="#fff">いけん</text>
          <path d="M8 -66 l10 -12 l3 2 l-10 12 z" fill="#fde047" stroke="#4c1d95" strokeWidth="1.6" />
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
            <g key={'j' + (jump?.id === f.id ? jump.key : 0)} className={jump?.id === f.id ? (pcfg ? pcfg.jumpClass : 'char-jump') : ''}>
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
              ref={(el) => { friendLabels.current[f.id] = el; }}
              x="0" y={LABEL_Y} fontSize="24" fontWeight="900" textAnchor="middle"
              fill="#fff" stroke="rgba(30,27,75,0.85)" strokeWidth="6" paintOrder="stroke"
            >
              {(f.level > 1 ? `${f.name} Lv.${f.level}` : `${f.name}（たまご）`) +
                (heartsFor(f) > 0 ? ' ' + '♥'.repeat(heartsFor(f)) : '')}
            </text>
            {todayReq?.char === f.char && (
              <text x="46" y="-84" fontSize="34" textAnchor="middle" className="twinkle" style={{ pointerEvents: 'none' }}>❗</text>
            )}
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

    if (area === 'moon') list.push({
      id: '@usu', y: USU_SPOT.y,
      node: <g key="@usu" transform={`translate(${USU_SPOT.x * ISLAND_W} ${USU_SPOT.y * ISLAND_H})`} style={{ pointerEvents: 'none' }}><Usu /></g>,
    });
    if (usagiHere) {
      const up = usagiPos.current;
      const h = heartsOf(save.friendsPlay[USAGI_KEY]?.pts ?? 0);
      list.push({
        id: '@usagi', y: up.y,
        node: (
          <g key="@usagi" ref={usagiNode} transform={`translate(${up.x * ISLAND_W} ${up.y * ISLAND_H})`} style={{ pointerEvents: 'none' }}>
            <g key={'j' + (jump?.id === '@usagi' ? jump.key : 0)} className={jump?.id === '@usagi' ? (pcfg ? pcfg.jumpClass : 'char-jump') : ''}>
              <MochiUsagi pound={!usagiFollow && area === 'moon'} />
            </g>
            <text x="0" y={LABEL_Y + 6} fontSize="24" fontWeight="900" textAnchor="middle" fill="#fff" stroke="rgba(30,27,75,0.85)" strokeWidth="6" paintOrder="stroke">
              {USAGI_NAME + (h > 0 ? ' ' + '♥'.repeat(h) : '')}
            </text>
            {bubble && bubble.char === USAGI_KEY && (() => {
              const half = bubble.text.length * 12 + 20;
              const bx = up.x * ISLAND_W - (cam.current?.x ?? 0);
              const sx = Math.max(half + 6 - bx, Math.min(0, ISLAND_W - half - 6 - bx));
              return (
                <g key={'b' + bubble.key} className="bubble-pop">
                  <rect x={sx - half} y={-196} width={half * 2} height={50} rx={22} fill="#fff" stroke="#4c1d95" strokeWidth="3" />
                  <path d="M-10 -147 L0 -132 L10 -147 Z" fill="#fff" stroke="#4c1d95" strokeWidth="3" strokeLinejoin="round" />
                  <rect x={-12} y={-150} width={24} height={6} fill="#fff" />
                  <text x={sx} y="-164" fontSize="23" fontWeight="900" textAnchor="middle" fill="#312e81">{bubble.text}</text>
                  {bubble.heart && <text x="46" y="-60" fontSize="40" textAnchor="middle" className="heart-float">💗</text>}
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
          {area === 'sun' && (
            // ☀️ たいようの せいれい：うしろの ひかりの わ・ほのおの ぎざぎざ
            <g pointerEvents="none" transform="translate(0 -62)">
              <circle r="80" fill="rgba(254,240,138,0.4)" className="twinkle" />
              <g className="sun-aura">
                {Array.from({ length: 12 }, (_, i) => (
                  <path key={i} d={i % 2 ? 'M-10 -64 Q0 -84 0 -98 Q4 -82 10 -64 Z' : 'M-8 -64 L0 -84 L8 -64 Z'} fill={i % 2 ? '#f97316' : '#fbbf24'} stroke="#c2410c" strokeWidth="1.6" transform={`rotate(${i * 30})`} />
                ))}
              </g>
              <circle r="62" fill="none" stroke="#fef3c7" strokeWidth="4" opacity="0.85" />
            </g>
          )}
          <foreignObject x={-60} y={-132} width={120} height={144} style={{ overflow: 'visible', pointerEvents: 'none' }}>
            <div className="flex h-full w-full items-end justify-center" style={area === 'sun' ? { filter: 'sepia(0.85) saturate(2.6) hue-rotate(-14deg) brightness(1.12) drop-shadow(0 0 10px #fde047)' } : undefined}>
              {save.player && (
                <PosedKid
                  poseRef={kidPose}
                  subRef={kidPoseSub}
                  who={save.player}
                  size={104}
                  walking={walking}
                  hat={save.equipped.hat === 'ht_crown' ? 'crown' : save.equipped.hat === 'ht_cap' ? 'cap' : save.equipped.hat === 'ht_detective' ? 'detective' : null}
                  ribbon={save.equipped.costume === 'cs_ribbon'}
                  magnifier={save.equipped.costume === 'cs_magnifier'}
                  wear={playerWear}
                />
              )}
            </div>
          </foreignObject>
          {area === 'sun' && (
            // ほのおの かんむり と ひかりの つぶ
            <g pointerEvents="none">
              <g transform="translate(0 -122)" className="twinkle">
                {[-24, -12, 0, 12, 24].map((x, i) => (
                  <path key={x} d={`M${x - 8} 0 Q${x - 6} ${-14 - (i % 2 ? 0 : 8)} ${x} ${-26 - (i === 2 ? 10 : 0)} Q${x + 6} ${-14 - (i % 2 ? 0 : 8)} ${x + 8} 0 Z`} fill={i === 2 ? '#fde047' : '#fb923c'} stroke="#c2410c" strokeWidth="2" />
                ))}
              </g>
              {[[-52, -100], [50, -84], [-44, -30], [56, -20]].map(([x, y], i) => (
                <text key={i} x={x} y={y} fontSize="16" textAnchor="middle" className="twinkle" style={{ animationDelay: `${-i * 0.4}s` }}>✨</text>
              ))}
            </g>
          )}
        </g>
      ),
    });

    return list.sort((a, b) => a.y - b.y).map((e) => e.node);
    // order が変わったときに並べ直す
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, placedHere, area, save.player, save.equipped, playerWear, save.titles.length, monster.charKey, level, fullness, mo, monsterName, walking, friends, save.buildings, save.friendsPlay, bubble, jump, unread, showChest, hwNight, snap.friends, todayReq, usagiHere, usagiFollow, pcfg]);

  // 3D に わたす ようす（かわったときだけ 作りなおす）
  const farm3d = useMemo(() => ({ plots: save.farm.plots, stages: farmStages, today: day }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [save.farm.plots, farmStages.join(','), day]);
  const player3d = useMemo(() => ({
    who: save.player,
    hat: (save.equipped.hat === 'ht_crown' ? 'crown' : save.equipped.hat === 'ht_cap' ? 'cap' : save.equipped.hat === 'ht_detective' ? 'detective' : null) as 'cap' | 'crown' | 'detective' | null,
    ribbon: save.equipped.costume === 'cs_ribbon',
    magnifier: save.equipped.costume === 'cs_magnifier',
    wear: playerWear,
  }), [save.player, save.equipped, playerWear]);
  const friends3d = friends.map((f) => {
    const w = save.friendsPlay[f.char]?.wear ?? null;
    return {
      f,
      label: (f.level > 1 ? `${f.name} Lv.${f.level}` : `${f.name}（たまご）`) + (heartsFor(f) > 0 ? ' ' + '♥'.repeat(heartsFor(f)) : ''),
      wear: w && WEAR_POS[w] ? w : null,
      costume: !w && hwNight && f.level > 1 ? costumeOf(f.char) : null,
      emote: todayReq?.char === f.char ? '❗' : undefined,
    };
  });
  const bubble3d = useMemo(() => {
    if (!bubble) return null;
    if (bubble.char === USAGI_KEY) return { id: '@usagi', text: bubble.text, heart: bubble.heart, key: bubble.key };
    const f = friends.find((x) => x.char === bubble.char);
    return f ? { id: f.id, text: bubble.text, heart: bubble.heart, key: bubble.key } : null;
  }, [bubble, friends]);

  // ── ちかくで できること（ならべる じゅん＝だいじな じゅん）──
  type NearAct = { key: string; label: string; onClick: () => void; main?: boolean };
  const nearActs: NearAct[] = [];
  const act = (on: boolean, key: string, label: string, onClick: () => void, main = true) => { if (on) nearActs.push({ key, label, onClick, main }); };
  act(nearDoorIn, 'houseIn', '🏠 おうちに はいる', () => travel('house', ENTRY.house));
  act(nearSchoolIn, 'schoolIn', '🏫 がっこうに はいる', () => travel('school', ENTRY.school));
  act(nearSchoolOut, 'schoolOut', '🚪 そとに でる', () => travel('main', ENTRY.mainFromSchool));
  act(nearDoorOut, 'houseOut', '🚪 そとに でる', () => travel('main', ENTRY.mainFromHouse));
  act(nearBridgeGo, 'eastGo', '🌉 となりの しまへ', () => travel('east', ENTRY.east));
  act(nearBridgeBack, 'eastBack', '🌉 もとの しまへ', () => travel('main', ENTRY.mainFromEast));
  act(nearSoccer, 'soccer', '⚽ サッカーを する', () => { location.href = '/soccer/'; });
  act(nearGame, 'sora', '🎮 ゲームを する', () => { location.href = '/sora/?from=island'; });
  act(nearShelf, 'moshiShelf', SHELF_MOSHI.label, () => { location.href = '/rpg.html#moshi=' + SHELF_MOSHI.key; });
  act(nearMonster, 'feed', '🍚 ごはん', () => (monster.stage === 'egg' || foods.length ? setModal('feed') : g.showToast('ごはんが ないよ。ショップで かおう', 'ng')));
  act(nearChest, 'chest', '🎁 たからばこを あける', openChest, false);
  act(nearMail, 'mail', `💌 てがみを よむ${unread > 0 ? `（${unread}）` : ''}`, () => setModal('mail'), false);
  act(nearPier, 'fish', '🎣 つりを する', () => setModal('fish'));
  act(nearPier && suisanOpen(), 'voyage', '🚤 ふねで 海へ しゅっこう', () => setModal('suisanVoyage'));
  act(nearFarm, 'farm', `🌱 はたけ${farmStages.some((n, i) => isRipe(save.farm.plots[i], n)) ? '（とれるよ！）' : ''}`, () => setModal('farm'));
  act(nearObserv, 'observ', '🔭 星座を みる', openObserv);
  act(nearMoonPlat, 'moon', '🎑 おだんごを おそなえ', openMoonView);
  act(nearImo, 'imo', '🍠 やきいもやさん', () => setModal('imo'));
  act(nearArbor, 'arbor', '🍁 あずまやで ひとやすみ', () => setModal('arbor'));
  act(nearRocket, 'rocket', '🚀 うちゅうへ いく', () => setModal('spaceGo'));
  act(nearBase, 'base', '🛰️ うちゅうずかん', () => setModal('spaceDex'));
  act(nearLibrary, 'library', '📚 としょかんに はいる', () => setModal('library'));
  act(!!planet && dist(pp, DOORS.moonRocket) <= 0.12, 'moonHome', '🚀 しまに かえる', goHomeFromMoon);
  act(!!moonStone && dist(pp, moonStone) <= 0.08, 'moonStone', `${pcfg?.stone}を ひろう`, pickStone);
  act(!!planet, 'moonJump', planet === 'sun' ? '✨ ふわっと とぶ' : '🦘 ジャンプ', moonJump, false);
  const nearUsagi = usagiHere && dist(pp, usagiPos.current) <= 0.13;
  act(nearUsagi, 'usagiTalk', '🐰 うさぎと はなす', tapUsagi);
  act(nearUsagi, 'usagiGift', '🎁 うさぎに あげる', () => setGiftFor(usagiFriend), false);
  act(nearUsagi && area === 'moon' && !usagiHome && usagiHearts >= FOLLOW_HEARTS, 'usagiInvite', '🌍 いっしょに ちきゅうへ いこう', inviteUsagi);
  act(nearUsagi && area === 'moon' && usagiHome, 'usagiStay', '🌙 つきで まってて', leaveUsagi, false);
  if (nearFurniture) {
    const nf = nearFurniture;
    act(nf.id === 'sc_organ', 'organ', '🎹 ひく', () => setModal('organ'));
    act(nf.id === 'sc_micro', 'micro', '🔬 のぞく', () => setModal('micro'));
    act(true, 'fmove', '↔️ うごかす', () => setMode({ kind: 'move', uid: nf.uid }), false);
    act(true, 'fstore', '📦 しまう', () => { g.storeFurniture(nf.uid); g.showToast('しまったよ'); }, false);
  }

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
          onClick={() => setModal('opening')}
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

      {/* ── イベント：名探偵あんり ── */}
      {eventActive() && (
        <button
          className="mb-2.5 flex w-full items-center gap-2 rounded-2xl bg-gradient-to-r from-[#312e81] to-[#7c3aed] px-3 py-2 text-left shadow active:scale-[0.98] lg:landscape:col-start-2"
          onClick={() => setModal('detective')}
        >
          <span className={`text-xl ${detectiveNew ? 'dt-new' : ''}`}>🔍</span>
          <span className="min-w-0 flex-1 truncate text-[13.5px] font-black text-white">
            <span className="mr-1.5 text-[10.5px] text-amber-300">イベント</span>名探偵あんりの じけんぼ
          </span>
          <span className="text-[12px] font-black text-indigo-100">{save.detective.solved.length}/{CASES.length}</span>
          {detectiveNew && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white">NEW</span>}
        </button>
      )}

      {/* ── 林業ゲーム：モクタの もりづくり（10/31から。メダルは つかわない） ── */}
      {forestryOpen(undefined, undefined, save.player) && (
        <button
          className="mb-2.5 flex w-full items-center gap-2 rounded-2xl bg-gradient-to-r from-[#3f6212] to-[#65a30d] px-3 py-2 text-left shadow active:scale-[0.98] lg:landscape:col-start-2"
          onClick={() => setModal('forestry')}
        >
          <span className="text-xl">🌲</span>
          <span className="min-w-0 flex-1 truncate text-[13.5px] font-black text-white">
            <span className="mr-1.5 text-[10.5px] text-lime-200">あそぶ</span>モクタの もりづくり
          </span>
          <span className="text-[12px] font-black text-lime-100">{save.forestry.cleared.length}/{FORESTS.length}</span>
        </button>
      )}

      {/* ── スタンプ・てがみ・おと ── */}
      <div className="mb-2.5 flex gap-1.5 lg:landscape:col-start-2">
        <button className="min-w-0 flex-1 whitespace-nowrap rounded-2xl leading-tight bg-white/90 px-2 py-2 text-[12px] font-black text-ink shadow active:scale-95" onClick={() => setModal('stamp')}>
          🗓️ <span className="max-[400px]:hidden">こんげつ </span>{stamps.length}にち
        </button>
        <button className="relative min-w-0 flex-1 rounded-2xl leading-tight bg-white/90 px-2 py-2 text-[12px] font-black text-ink shadow active:scale-95" onClick={() => setModal('mail')}>
          💌 てがみ
          {unread > 0 && <span className="ml-1 rounded-full bg-rose-500 px-1.5 text-[11px] text-white">{unread}</span>}
        </button>
        <button className="min-w-0 flex-1 rounded-2xl leading-tight bg-white/20 px-2 py-2 text-[12px] font-black text-white active:scale-95" onClick={() => setSnd(cycleSoundMode())}>
          {SOUND_LABEL[snd]}
        </button>
      </div>

      {/* ── 島 ── */}
      <div className="relative overflow-hidden rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,.3)] lg:landscape:col-start-1 lg:landscape:row-span-6 lg:landscape:row-start-1 lg:landscape:mx-auto lg:landscape:w-full lg:landscape:max-w-[calc((100vh-150px)*4/3)]">
        {want3d && (
          <Suspense fallback={null}>
            <World3D
              ref={w3d}
              live={{ playerPos, monsterPos, friendPos, flip, walkPhase, tapTarget, pose: kidPose }}
              chars={chars}
              built={builtSpots}
              pier={hasPier}
              bridge={hasBridge}
              moshi={!!moshi}
              expansion={expansion}
              season={seasonNow()}
              halloween={hw}
              soccerCups={cups}
              tod={tod}
              weather={weather}
              farm={farm3d}
              placed={placedHere}
              photoFriends={snap.friends}
              player={player3d}
              monster={{
                charKey: monster.charKey ?? null, level, fill: fullness / 100, silhouette: mo === 'down', stars: save.titles.length,
                emote: mo === 'down' ? '💤' : mo === 'hungry' ? '💭' : undefined,
              }}
              friends={friends3d}
              usagi={usagiHere ? { label: USAGI_NAME + (usagiHearts > 0 ? ' ' + '♥'.repeat(usagiHearts) : '') } : null}
              bubble={bubble3d}
              jump={jump}
              unread={unread}
              chest={showChest}
              walking={walking}
              showWalk={mode.kind !== 'walk'}
              onReady={() => setReady3d(true)}
            />
          </Suspense>
        )}
        <svg
          ref={stageRef}
          className={`island-stage block w-full ${on3d ? 'relative' : ''}`}
          viewBox={on3d ? `0 0 ${ISLAND_W} ${ISLAND_H}` : `${camNow.x} ${camNow.y} ${ISLAND_W} ${ISLAND_H}`}
          onPointerDown={onStagePointerDown}
        >
          {!on3d && area === 'main' && (
            <IslandGround expansion={expansion} pier={hasPier} season={seasonNow()} bridge={hasBridge} halloween={hw} moshi={!!moshi} soccerCups={cups} />
          )}
          {!on3d && area === 'main' && <FarmPatch plots={save.farm.plots} stages={farmStages} today={day} />}
          {area === 'east' && <EastGround tod={tod} />}
          {area === 'moon' && <MoonGround moonAge={moonAge} />}
          {area === 'mars' && <MarsGround />}
          {area === 'sun' && <SunGround />}
          {planet && <g ref={footRef} pointerEvents="none" />}
          {moonStone && (
            <g transform={`translate(${moonStone.x * ISLAND_W} ${moonStone.y * ISLAND_H})`} pointerEvents="none">
              <circle r="26" fill={planet === 'mars' ? 'rgba(254,215,170,0.5)' : planet === 'sun' ? 'rgba(255,255,255,0.55)' : 'rgba(253,224,71,0.35)'} className="twinkle" />
              {planet === 'sun'
                ? <circle r="11" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2.5" />
                : <path d="M-14 4 L-8 -10 L6 -13 L15 -2 L9 9 L-6 10 Z" fill={planet === 'mars' ? '#ef4444' : '#fde68a'} stroke={planet === 'mars' ? '#7f1d1d' : '#a16207'} strokeWidth="2.5" />}
              <text y="-20" fontSize="16" textAnchor="middle">✨</text>
            </g>
          )}
          {area === 'school' && (
            <SchoolGround tod={tod} moonAge={moonAge} medals={earnedTotal()} stamps={stamps.length} friends={snap.friends.length} today={byDate[day] || 0} />
          )}
          {area === 'house' && (
            <RoomGround wall={save.room.wall} floor={save.room.floor} tod={tod} moonAge={moonAge} sleeping={sleeping} />
          )}
          {!on3d && mode.kind !== 'walk' && isWideArea() && (
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
          {!on3d && entities}
          {/* 空（画面に くっつける）。夜のあかりは 下で 島の上に かく。3D では 色の膜は 3D がわで つける */}
          <g ref={skyRef} transform={on3d ? undefined : `translate(${camNow.x} ${camNow.y})`}>
            {!indoor && !planet && <SkyLayer
              noTint={on3d}
              tod={tod}
              weather={weather}
              moonAge={moonAge}
              glows={[]}
              onMoon={() => g.showToast(`🌙 きょうの月は ${moonName(moonAge)}（月齢 やく${Math.round(moonAge)}）`)}
              onStar={() => { sfx('star'); g.showToast(`🌠 ねがいごと：「${WISHES[Math.floor(Math.random() * WISHES.length)]}」`); }}
              skyTime={skyMin}
              onStarTap={(id) => g.showToast(starInfo(id))}
            />}
            {hwNight && !indoor && !planet && [[120, 90], [520, 60], [760, 130]].map(([x, y], i) => (
              <g key={'bat' + i} transform={`translate(${x} ${y})`} style={{ pointerEvents: 'none' }}>
                <g className="bat-fly" style={{ animationDelay: `${-i * 2.3}s` }}>
                  <text fontSize="30" textAnchor="middle">🦇</text>
                </g>
              </g>
            ))}
          </g>
          {/* 夜の あかり（窓・ランプ・ランタン）。島の位置に かく */}
          {!on3d && !indoor && !planet && tod === 'night' && [

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

        {area === 'main' && HAS_WEBGL && (
          <button
            className="i3d-toggle rounded-xl bg-white/85 px-2.5 py-1 text-[12px] font-black text-indigo-900 shadow active:scale-95"
            onClick={() => {
              const v = !pref3d;
              setPref3d(v);
              if (!v) setReady3d(false);
              try { localStorage.setItem(PREF_3D, v ? '1' : '0'); } catch { /* 保存できなくても 今は きりかわる */ }
            }}
          >
            {pref3d ? '🗺 2Dで みる' : '🧊 3Dで みる'}
          </button>
        )}
        {want3d && !ready3d && !slow3d && (
          <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-sky-300 to-emerald-300 text-[13px] font-black text-indigo-900">
            <span className="chest-bob text-4xl">🏝️</span>
            しまを よみこみちゅう…
          </div>
        )}
        <div className={`pointer-events-none absolute inset-0 bg-indigo-950 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`} />
        {henshin && <div className="sun-henshin pointer-events-none absolute inset-0" />}
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
            <button className="btn !w-auto whitespace-nowrap !py-2 text-[12px]" onClick={() => setModal('roster')}>
              📖 なかま いちらん
            </button>
          )}
          {mode.kind !== 'walk' ? (
            <button className="btn !w-auto !py-2 text-[12px]" onClick={() => setMode({ kind: 'walk' })}>
              ✕ やめる
            </button>
          ) : (() => {
            // ちかくで できること（いくつでも ならべる）＋ そばの なかま。ついてくる子は ほかに なにも ないときだけ
            const friend = nearOther ?? (nearActs.length ? null : nearFollower);
            if (!nearActs.length && !friend) return (
            <div className="max-w-[190px] rounded-2xl bg-white/10 px-3 py-2 text-right text-[11px] font-bold leading-snug text-indigo-100/70">
              {area === 'house'
                ? 'へやの かぐを おいて かざろう。ドアの まえで そとに でられるよ'
                : area === 'school'
                ? 'こくばん・テレビ・けいじばん・おともだちを タップしてみよう'
                : pcfg
                ? planet === 'sun' ? `${pcfg.hint}（みつけた ${sunSeen}/${SUN_HITS.length}）` : pcfg.hint
                : area === 'east'
                ? save.buildings.includes('bd_rocket')
                  ? 'ロケットを タップすると うちゅうりょこうに いけるよ。ひだりの はしで もとの しまに もどれるよ'
                  : save.buildings.includes('bd_arbor')
                  ? 'あずまやを タップすると ひとやすみ・おちばひろい・おはなしが できるよ。ひだりの はしで もとの しまに もどれるよ'
                  : save.buildings.includes('bd_imo')
                  ? 'やきいも やたいを タップすると いもを やけるよ。ひだりの はしで もとの しまに もどれるよ'
                  : 'はなばたけの しまだよ。ひだりの はしで もとの しまに もどれるよ'
                : monster.stage === 'egg'
                ? 'たまごに ちかづいて ごはんを あげよう'
                : `${monsterName}に ちかづくと なにかできるよ`}
            </div>
            );
            // たまご・モンスターだけの ときは 大きい まるボタン
            if (nearActs.length === 1 && nearActs[0].key === 'feed' && !friend) return (
              <button
                className="flex h-[84px] w-[84px] flex-col items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[12px] font-black text-white shadow-xl active:scale-95"
                onClick={nearActs[0].onClick}
              >
                <span className="text-2xl">🍚</span>
                ごはん
              </button>
            );
            return (
              <>
                {nearActs.length > 0 && (
                  <div className="flex flex-wrap justify-end gap-2">
                    {nearActs.map((a) => (
                      <button
                        key={a.key}
                        className={(a.main ? 'btn-main !px-3.5 text-[13px]' : 'btn !px-3 text-[12px]') + ' !w-auto max-w-full !py-2 leading-tight'}
                        onClick={a.onClick}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
                {friend && friendPanel(friend)}
              </>
            );
          })()}
        </div>
      </div>

      {/* ── おうちの中：がっこうを かえる（しゅじんこうは さいしょに えらんだら かえられない）── */}
      {area === 'house' && save.player && !FIXED_SCHOOL[save.player] && (
        <div className="panel mt-3 !py-3 lg:landscape:col-start-2">
          <div>
            <div className="mb-1.5 text-[11px] font-black text-ink">🏫 がっこう（クイズアプリで ひらく がっこう）</div>
            <div className="grid grid-cols-4 gap-1.5">
              {SCHOOLS.map((sc) => {
                const on = save.school === sc;
                return (
                  <button
                    key={sc}
                    onClick={() => { if (!on) { g.setSchool(sc); g.showToast(`🏫 がっこう：${SCHOOL_LABEL[sc]}に したよ`); } }}
                    className={`rounded-xl px-1 py-1.5 text-[12px] font-black active:scale-95 ${on ? 'bg-amber-100 text-ink ring-2 ring-amber-400' : 'bg-indigo-50 text-indigo-900/70'}`}
                  >
                    {on ? '✓ ' : ''}{SCHOOL_LABEL[sc]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── おうちの中：ひきつぎ（べつの iPad へ きろくを うつす）── */}
      {area === 'house' && (
        <div className="mt-3 lg:landscape:col-start-2">
          <button className="w-full rounded-2xl bg-white/20 px-3 py-2 text-[12px] font-black text-white active:scale-95" onClick={() => setModal('transfer')}>
            📦 ひきつぎ（べつの iPad へ うつす）
          </button>
        </div>
      )}
      {modal === 'transfer' && <TransferModal onClose={() => setModal(null)} />}

      {/* ── 置ける家具のトレイ ── */}
      {unplaced.length > 0 && (
        <div className="panel mt-3 !py-3 lg:landscape:col-start-2">
          <div className="mb-2 text-[12px] font-black text-ink">{area === 'house' ? '🛋️ へやに おける かぐ' : area === 'school' ? '🏫 きょうしつに おける かぐ' : '🌴 しまに おける かぐ'}</div>
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
      {modal === 'feed' && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setModal(null)}>
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
                    onClick={() => { g.feedMonster(it.id); setModal(null); }}
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
            <button className="btn-main mt-3" onClick={() => setModal(null)}>とじる</button>
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

      {modal === 'fish' && (
        <FishingModal ctx={{ tod, weather, month: seasonNow() }} studied={studied} onClose={() => setModal(null)} onVoyage={suisanOpen() ? () => setModal('suisanVoyage') : undefined} />
      )}
      {modal === 'farm' && <FarmModal stages={farmStages} studied={studied} onClose={() => setModal(null)} />}
      {modal === 'stars' && <StarsModal onClose={() => setModal(null)} />}
      {modal === 'detective' && <DetectiveScreen onClose={() => setModal(null)} />}
      {modal === 'moonView' && <MoonViewModal onClose={() => setModal(null)} />}
      {modal === 'imo' && <YakiimoModal customers={imoCustomers} onClose={() => setModal(null)} />}
      {modal === 'forestry' && <ForestryModal onClose={() => setModal(null)} />}
      {modal === 'suisan' && <SuisanModal onClose={() => setModal(null)} />}
      {modal === 'suisanVoyage' && <SuisanModal startView="ports" onClose={() => setModal(null)} />}
      {modal === 'arbor' && <ArborModal friends={imoCustomers} studied={studied} onClose={() => setModal(null)} />}
      {modal === 'library' && <LibraryModal onOpen={setBook} onClose={() => { setBook(null); setModal(null); }} />}
      {modal === 'library' && book && (() => {
        const close = () => setBook(null);
        return book === 'stars' ? <StarsModal dexOnly onClose={close} />
          : book === 'fish' ? <FishingModal dexOnly ctx={{ tod, weather, month: seasonNow() }} studied={studied} onClose={close} />
          : book === 'farm' ? <FarmModal dexOnly stages={farmStages} studied={studied} onClose={close} />
          : book === 'micro' ? <MicroscopeModal dexOnly studied={studied} onClose={close} />
          : book === 'space' ? <SpaceTripModal dexOnly tab="dex" studied={studied} crew={imoCustomers} onClose={close} />
          : book === 'arbor' ? <ArborModal dexOnly friends={imoCustomers} studied={studied} onClose={close} />
          : book === 'tree' ? <TreeDexModal onClose={close} />
          : <YakiimoModal dexOnly customers={imoCustomers} onClose={close} />;
      })()}
      {(modal === 'spaceGo' || modal === 'spaceDex') && <SpaceTripModal tab={modal === 'spaceGo' ? 'go' : 'dex'} studied={studied} crew={imoCustomers} onClose={() => setModal(null)} marsOk={marsOk} onWalk={(to) => { setModal(null); travel(to, ENTRY[to]); }} />}

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

      {/* ── 📝 もしの しまへ（クエストの ページで 模試）── */}
      {moshiAsk && moshi && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setMoshiAsk(false)}>
          <div className="panel w-full max-w-[440px] text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl">🏝️📝</div>
            <div className="mt-1 text-[16px] font-black text-ink">もしの しまへ いく？</div>
            {moshis.map((m) => (
              <div key={m.test.key} className="mt-2 rounded-2xl bg-violet-50 px-3 py-2 text-[13px] font-black text-violet-800">
                {m.test.extra ? '🎯 ' : '📝 '}{m.test.name}（{m.date.getMonth() + 1}/{m.date.getDate()}{m.test.extra ? ' まで' : ''}）・
                {m.test.extra ? `あと ${m.diff}にち` : m.diff === 0 ? '🎯 きょうが テスト！' : `あと ${m.diff}にち`}
                <div className="text-[11.5px] font-bold text-indigo-900/60">
                  {moshiRewards(m.test).map((r) => (r.lv === 'kako' ? `🔥 チャレンジ（かこもん いり）🪙${r.reward}` : `📘 ふつう 🪙${r.reward}`)).join('　')}
                </div>
              </div>
            ))}
            <div className="mt-2 text-[12px] font-bold leading-relaxed text-indigo-900/60">
              8わり こえるたびに メダル！<br />
              かいて こたえる もんだいは おうちの ひとが まるつけ するよ。
            </div>
            <a className="btn-main mt-3 block text-center no-underline" href="/rpg.html#moshi">📝 いく</a>
            <button className="btn mt-2" onClick={() => setMoshiAsk(false)}>やめる</button>
          </div>
        </div>
      )}

      {/* ── 🏫 こくばん：きょうの べんきょう ── */}
      {modal === 'board' && (() => {
        const tu = todayUnits();
        return (
          <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setModal(null)}>
            <div className="panel w-full max-w-[440px]" onClick={(e) => e.stopPropagation()}>
              <div className="mb-2 text-[14px] font-black text-ink">🏫 こくばん：きょうの べんきょう</div>
              <div className="rounded-2xl bg-emerald-800 px-4 py-3 text-[13px] font-bold leading-relaxed text-emerald-50">
                きょうは <b className="text-[18px] text-yellow-200">{byDate[day] || 0}もん</b> といたよ。<br />
                {(byDate[day] || 0) >= 5 ? '🗓️ きょうの スタンプ ゲット！' : `🗓️ あと ${5 - (byDate[day] || 0)}もんで きょうの スタンプ`}<br />
                🔑 さいごまで といた きょうか <b className="text-[16px] text-yellow-200">{Math.min(tu.cats.length, UNLOCK_CATS)} / {UNLOCK_CATS}</b>
                {tu.cats.length >= UNLOCK_CATS ? '　しまの かぎ OK！' : ''}<br />
                🔴 かせいの ノルマ <b className="text-[16px] text-yellow-200">{Math.min(tu.cats.length, MARS_CATS)} / {MARS_CATS}</b>
                {tu.cats.length >= MARS_CATS ? '　きょうは かせいに いけるよ！' : ''}<br />
                こんげつの スタンプは <b className="text-[16px] text-yellow-200">{stamps.length}にち</b>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a className="btn-main block text-center no-underline" href="/">📚 クイズへ</a>
                <a className="btn-main block text-center no-underline" href="/rpg.html">⚔️ クエストへ</a>
              </div>
              <button className="btn mt-2" onClick={() => setModal(null)}>とじる</button>
            </div>
          </div>
        );
      })()}

      {/* ── 🏫 じゅぎょう：キャラが もんだいを だす（メダルは でない）── */}
      {lesson && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setLesson(null)}>
          <div className="panel max-h-[85vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <CharSVG charKey={lesson.f.char} level={lesson.f.level} fillPct={lesson.f.fill} size={56} stars={lesson.f.stars} label={lesson.f.name} />
              <div className="min-w-0">
                <div className="text-[14px] font-black text-ink">{lesson.f.name}せんせいの じゅぎょう</div>
                <div className="text-[11px] font-bold text-indigo-900/55">{lesson.f.monthLabel}・{lesson.f.catLabel}</div>
              </div>
            </div>
            {lesson.loading ? (
              <div className="mt-3 rounded-2xl bg-indigo-50 px-4 py-3 text-[13px] font-bold text-ink">もんだいを えらんでいるよ…</div>
            ) : !lesson.l ? (
              <div className="mt-3 rounded-2xl bg-indigo-50 px-4 py-3 text-[13px] font-bold text-ink">
                きょうは おやすみ だよ。クイズで いっしょに べんきょうしよう！
              </div>
            ) : (
              <>
                <div className="mt-3 whitespace-pre-line rounded-2xl bg-emerald-800 px-4 py-3 text-[14px] font-bold leading-relaxed text-emerald-50">
                  {lesson.l.q}
                  {lesson.l.options.length > 0 && (
                    <div className="mt-2 text-[13px] text-emerald-100">{lesson.l.options.map((o) => <div key={o}>{o}</div>)}</div>
                  )}
                </div>
                {lesson.show ? (
                  <div className="mt-2 whitespace-pre-line rounded-2xl bg-amber-50 px-4 py-3 text-[13px] font-bold leading-relaxed text-ink">
                    <div className="text-[14px] font-black text-rose-600">こたえ：{lesson.l.answer}</div>
                    {lesson.l.explanation && <div className="mt-1 text-indigo-900/75">{lesson.l.explanation}</div>}
                  </div>
                ) : (
                  <button className="btn-main mt-3" onClick={() => { sfx('letter'); setLesson({ ...lesson, show: true }); }}>💡 こたえを みる</button>
                )}
                {lesson.show && (
                  <button className="btn-main mt-2" onClick={() => openLesson(lesson.f, lesson.l?.id)}>✏️ もう1もん</button>
                )}
              </>
            )}
            <button className="btn mt-2" onClick={() => setLesson(null)}>とじる</button>
          </div>
        </div>
      )}

      {/* ── 📺 ずんだもん どうが（クイズの 安全プレーヤーで みる）── */}
      {tvAsk && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setTvAsk(false)}>
          <div className="panel w-full max-w-[440px] text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl">📺</div>
            <div className="mt-1 text-[16px] font-black text-ink">ずんだもん どうがを みる？</div>
            <div className="mt-1 text-[12px] font-bold leading-relaxed text-indigo-900/60">
              「ずんだもんと まなぶ ちゅうがくじゅけん」の どうがだよ。<br />みおわったら「🏝 しまに もどる」で がっこうに もどれるよ。
            </div>
            <a className="btn-main mt-3 block text-center no-underline" href="/?videos=1">📺 みる</a>
            <button className="btn mt-2" onClick={() => setTvAsk(false)}>やめる</button>
          </div>
        </div>
      )}

      {modal === 'micro' && <MicroscopeModal studied={studied} onClose={() => setModal(null)} />}

      {/* ── オルガン（ひけたら その場の なかまが じゅんばんに ジャンプ）── */}
      {modal === 'organ' && (
        <OrganModal
          onClose={() => setModal(null)}
          onClear={() => friends.forEach((f, i) => window.setTimeout(() => { setJump({ id: f.id, key: Date.now() }); voice(f.char); }, 500 + i * 320))}
        />
      )}

      {/* ── べんきょうづくえ ── */}
      {modal === 'desk' && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setModal(null)}>
          <div className="panel w-full max-w-[440px]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 text-[14px] font-black text-ink">📚 べんきょうづくえ</div>
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-[13px] font-bold leading-relaxed text-ink">
              きょうは <b className="text-[16px] text-violet-700">{byDate[day] || 0}もん</b> といたよ。<br />
              こんげつの スタンプは <b className="text-[16px] text-amber-600">{stamps.length}にち</b>。<br />
              {(byDate[day] || 0) >= 5 ? 'きょうの スタンプ ゲット！ すごい！' : `あと ${5 - (byDate[day] || 0)}もんで きょうの スタンプだよ`}
            </div>
            <a className="btn-main mt-3 block text-center no-underline" href="/">📚 クイズを する</a>
            <button className="btn mt-2" onClick={() => setModal(null)}>とじる</button>
          </div>
        </div>
      )}

      {/* ── はじまりの ものがたり（見なおし）── */}
      {modal === 'opening' && <OpeningScreen onDone={() => setModal(null)} />}

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

      {modal === 'stamp' && <StampModal nowD={nowD} ym={ym} stamps={stamps} onClose={() => setModal(null)} />}
      {modal === 'mail' && <MailModal friends={snap.friends} onClose={() => setModal(null)} />}
      {modal === 'iken' && <IkenModal onClose={() => setModal(null)} />}

      {modal === 'roster' && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => { setModal(null); setSecretOpen(false); }}>
          <div className="panel max-h-[80vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center text-[14px] font-black text-ink">
              <span className="flex-1">📖 しまの なかま</span>
              {area === 'school' && <button aria-label="ピン" className="-my-1 rounded-full px-2 py-1 text-[22px] leading-none opacity-70 active:scale-90" onClick={() => setSecretOpen((v) => !v)}>📌</button>}
            </div>
            {secretOpen && area === 'school' && (
              <form className="mb-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); void submitSecret(); }}>
                <input
                  className="min-w-0 flex-1 rounded-xl border-2 border-amber-300 bg-amber-50 px-3 py-2 text-[14px] font-bold text-ink"
                  placeholder="ひみつの ことば"
                  value={secretText}
                  onChange={(e) => setSecretText(e.target.value)}
                  autoFocus
                  autoComplete="off"
                />
                <button type="submit" className="btn !w-auto !py-2 text-[13px]" disabled={!secretText.trim()}>OK</button>
              </form>
            )}
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
            <button className="btn-main mt-1" onClick={() => { setModal(null); setSecretOpen(false); }}>とじる</button>
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
                  return (
                    <button
                      key={it.id}
                      className="btn flex items-center gap-2"
                      onClick={() => { g.dressFriend(wearFor.char, on ? null : it.id); setWearFor(null); }}
                    >
                      <span className="text-xl">{it.emoji}</span>
                      <span className="flex-1 text-left">
                        {it.name}
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
