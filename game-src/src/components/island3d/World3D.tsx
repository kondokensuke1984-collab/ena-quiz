// 3Dの島（main）の React の 入れもの。IslandScreen から 島の ようすを うけとって engine に わたす。
// three.js は 大きいので、この ファイルごと あとから 読みこむ（React.lazy）。

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactNode } from 'react';
import type { Pos, FarmPlot, PlacedFurniture, PlayerKey } from '../../types';
import type { Friend } from '../../lib/friends';
import type { CharKey, CharMap } from '../../lib/chars';
import type { TimeOfDay, Weather } from '../../lib/sky';
import { hourNow } from '../../lib/sky';
import { plantOf } from '../../lib/farm';
import { photoMonthOf, ITEM_BY_ID } from '../../lib/items';
import { KidSVG, type KidDir } from '../KidSVG';
import { EggSVG } from '../EggSVG';
import { FurnitureSVG } from '../FurnitureSVG';
import { PhotoFrame } from '../PhotoFrame';
import { PlotPlant } from '../FarmPatch';
import { IslandEngine, type ActorSpec, type LiveRefs, type FarmSpec, type PlacedSpec } from './engine';
import type { ArtSpec } from './sprites';

export interface World3DHandle { pick(clientX: number, clientY: number): Pos | null }

export interface World3DProps {
  live: LiveRefs;
  chars: CharMap | null;
  built: string[];
  pier: boolean;
  bridge: boolean;
  moshi: boolean;
  soccerCups: number;
  expansion: number;
  season: number;
  halloween: boolean;
  tod: TimeOfDay;
  weather: Weather;
  farm: { plots: (FarmPlot | null)[]; stages: number[]; today: string };
  placed: PlacedFurniture[];
  photoFriends: Friend[];
  player: { who: PlayerKey | null; hat: 'cap' | 'crown' | 'detective' | null; ribbon: boolean; magnifier: boolean };
  monster: { charKey: CharKey | null; level: number; fill: number; silhouette: boolean; stars: number; emote?: string };
  friends: { f: Friend; label: string; wear: string | null; costume: string | null; emote?: string }[];
  bubble: { id: string; text: string; heart: boolean; key: number } | null;
  jump: { id: string; key: number } | null;
  unread: number;
  chest: boolean;
  walking: boolean;
  showWalk: boolean;
  onReady(): void;
}

// 2D の きせかえの 位置（なかまの 足もとが 原点・108px の 絵）
const WEAR_POS: Record<string, { y: number; size: number }> = {
  fw_silk: { y: -44, size: 34 }, fw_flower: { y: -42, size: 28 }, fw_glass: { y: -24, size: 26 }, fw_scarf: { y: -4, size: 28 },
  fw_pumpkin: { y: -44, size: 30 }, fw_leaf: { y: -40, size: 24 }, fw_gold: { y: -44, size: 30 }, fw_moon: { y: -46, size: 28 },
  fw_acorn: { y: -42, size: 26 }, fw_santa: { y: -44, size: 32 }, fw_saturn: { y: -44, size: 28 },
};
const CHAR_PX = 108;

function svgOf(node: ReactNode): string {
  return renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="-200 -300 400 400">{node}</svg>);
}

/** なかまの 絵（chars.js）。emoji は 頭の あたりに かさねる きせかえ */
function charArt(chars: CharMap | null, key: CharKey, level: number, fill: number, stars: number, silhouette: boolean, emoji: { ch: string; y: number; size: number } | null): ArtSpec | null {
  const fn = chars?.[key];
  if (!fn) return null;
  let svg: string;
  try { svg = fn(level | 0, fill, CHAR_PX, { silhouette, stars }); } catch { return null; }
  const vb = 200, k = CHAR_PX / vb;
  // 2D では 絵の 下はしが 足もとより 20px 下（foreignObject の 置きかた）
  const originY = vb - 20 / k;
  return {
    key: `c:${key}:${level}:${fill.toFixed(2)}:${stars}:${silhouette ? 1 : 0}:${emoji ? emoji.ch : ''}`,
    svg,
    unit: k,
    anchorX: 100,
    extra: emoji ? (ctx, toPx, ppu) => {
      const [x, y] = toPx(100, originY + emoji.y / k);
      ctx.font = `${emoji.size / k * ppu}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(emoji.ch, x, y);
    } : undefined,
  };
}

const World3D = forwardRef<World3DHandle, World3DProps>(function World3D(props, ref) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const engine = useRef<IslandEngine | null>(null);
  const readyRef = useRef(props.onReady);
  readyRef.current = props.onReady;

  useImperativeHandle(ref, () => ({ pick: (x, y) => engine.current?.pick(x, y) ?? null }), []);

  useEffect(() => {
    const e = new IslandEngine(hostRef.current!, overlayRef.current!, props.live);
    e.onFirstFrame = () => readyRef.current();
    engine.current = e;
    return () => { e.dispose(); engine.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { built, pier, bridge, moshi, expansion, season, halloween, soccerCups } = props;
  const builtKey = built.join(',');
  useEffect(() => {
    engine.current?.setWorld({ built, pier, bridge, moshi, expansion, season, halloween, soccerCups });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builtKey, pier, bridge, moshi, expansion, season, halloween, soccerCups]);

  useEffect(() => { engine.current?.setSky(props.tod, props.weather); }, [props.tod, props.weather]);

  const { plots, stages, today } = props.farm;
  useEffect(() => {
    const hour = hourNow();
    const list: FarmSpec[] = plots.map((p, i) => ({
      i,
      wet: !!p && p.watered === today,
      paddy: !!plantOf(p)?.paddy,
      art: p ? { key: `farm:${i}:${p.seed}:${stages[i]}:${p.watered === today}:${p.box ? 1 : 0}:${hour}`, svg: svgOf(<PlotPlant p={p} stage={stages[i]} today={today} hour={hour} />), unit: 1, anchorX: 0 } : null,
    }));
    engine.current?.setFarm(list);
  }, [plots, stages, today]);

  const { placed, photoFriends } = props;
  useEffect(() => {
    const list: PlacedSpec[] = placed.map((p) => {
      const month = photoMonthOf(p.id);
      const node = month ? <PhotoFrame month={month} friends={photoFriends} /> : <FurnitureSVG id={p.id} scale={1.9} />;
      return { uid: p.uid, x: p.x, y: p.y, lamp: p.id === 'fn_lamp' || p.id === 'fn_fire', art: { key: `fn:${p.id}:${month ? photoFriends.length : ''}`, svg: svgOf(node), unit: 1, anchorX: 0 } };
    });
    engine.current?.setPlaced(list);
  }, [placed, photoFriends]);

  const { chars, player, monster, friends } = props;
  const actorKey = JSON.stringify([!!chars, player, monster, friends.map((x) => [x.f.id, x.f.char, x.f.level, x.f.fill, x.f.stars, x.label, x.wear, x.costume, x.emote])]);
  useEffect(() => {
    const list: ActorSpec[] = [];
    if (player.who) {
      const kidArt = (dir: KidDir, step: 0 | 1 | 2): ArtSpec => ({
        key: `kid:${player.who}:${player.hat}:${player.ribbon}:${player.magnifier}:${dir}${step}`,
        svg: renderToStaticMarkup(<KidSVG who={player.who!} size={104} hat={player.hat} ribbon={player.ribbon} magnifier={player.magnifier} dir={dir} step={step} />),
        unit: 104 / 100, anchorX: 50,
      });
      const poses: Record<string, ArtSpec> = {};
      for (const d of ['down', 'up', 'side'] as KidDir[]) for (const st of [0, 1, 2] as const) poses[d + '_' + st] = kidArt(d, st);
      list.push({ id: '@player', art: poses.down_0, poses, tapDy: 0 });
    }
    const mArt: ArtSpec | null = monster.charKey
      ? charArt(chars, monster.charKey, monster.level, monster.fill, monster.stars, monster.silhouette, null)
      : { key: 'egg', svg: renderToStaticMarkup(<EggSVG size={96} wobble={false} />), unit: 96 / 100, anchorX: 50 };
    if (mArt && monster.charKey) mArt.unit = 112 / 200;
    list.push({ id: '@monster', art: mArt, tapDy: -0.07, emote: monster.emote });
    for (const { f, label, wear, costume, emote } of friends) {
      const wp = wear ? WEAR_POS[wear] : null;
      const emoji = wp && f.level > 1 ? { ch: ITEM_BY_ID[wear!]?.emoji ?? '', y: wp.y, size: wp.size }
        : costume ? { ch: costume, y: -46, size: 30 } : null;
      list.push({ id: f.id, art: charArt(chars, f.char, f.level, f.fill, f.stars, false, emoji), label, tapDy: -0.07, emote });
    }
    engine.current?.setActors(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actorKey]);

  const { bubble, jump, unread, chest, walking, showWalk } = props;
  useEffect(() => {
    engine.current?.setUI({ bubble, jump, unread, chest, walking, showWalk });
  }, [bubble, jump, unread, chest, walking, showWalk]);

  const gray = props.weather === 'cloudy' || props.weather === 'rain';
  const sky = props.tod === 'night' ? 'linear-gradient(#0b1033, #1b2560 45%, #27306b)'
    : props.tod === 'evening' ? 'linear-gradient(#6b5ca5, #f59e8b 30%, #f6c9a8 45%)'
    : gray ? 'linear-gradient(#9fb1c2, #c9d3dd 45%)'
    : 'linear-gradient(#5fb8f2, #a9dcfb 30%, #cfeeff 45%)';
  return (
    <div className="absolute inset-0" style={{ background: sky }}>
      <div ref={hostRef} className="absolute inset-0" />
      <div ref={overlayRef} className="i3d-overlay pointer-events-none absolute inset-0 overflow-hidden" />
    </div>
  );
});

export default World3D;
