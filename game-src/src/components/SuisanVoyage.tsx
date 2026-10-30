import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { sfx } from '../lib/sound';
import { STAGE_BY_ID } from '../lib/suisan';
import {
  PORT_X, SPOT_RADIUS, WORLD_H, WORLD_W, ZONES, boatFor, makeSpots, pickFish, zoneAt, zoneOpen,
  type Spot, type VoyFish,
} from '../lib/suisanVoyage';
import { CharSVG } from './CharSVG';
import { DPad, type Axis } from './DPad';
import type { SeaCtl } from './SuisanSea3D';

const Sea3D = lazy(() => import('./SuisanSea3D'));

// しゅっこう：船を うごかして、海域ごとに 漁を する（2D）。
// 沿岸（領海・日帰り）→ 沖合（経済水域・数日）→ 遠洋（公海・数か月）。ステージを クリアすると 船が 大きくなって 遠くへ 行ける。
// あわの 漁場で「つる！」→ ゲージが あたりに きた ときに「いま！」。つんだ 魚は 漁港で 水あげ（万円）に なる。

const VW = 340;      // 見える はば
const VH = WORLD_H;
const RATE: Record<string, number> = { near: 3.0, eez: 3.8, high: 4.6 };

interface State {
  x: number; y: number; face: 1 | -1;
  spots: Spot[];
  hold: VoyFish[];
  phase: 'sail' | 'fish';
  spot: number | null;     // つっている 漁場 id
  ct: number; cur: number; center: number; win: number; zoneId: string;
  msg: string; msgUntil: number;
  tipped: string[];
  total: number;           // この しゅっこうで 水あげした 合計
  trips: number;
}

const fresh = (): State => ({
  x: PORT_X + 30, y: WORLD_H / 2, face: 1, spots: makeSpots(), hold: [], phase: 'sail', spot: null,
  ct: 0, cur: 0, center: 0.5, win: 0.3, zoneId: 'near', msg: '', msgUntil: 0, tipped: [], total: 0, trips: 0,
});

export function SuisanVoyage({ onBack }: { onBack(): void }) {
  const g = useGame();
  const cleared = g.save.suisan.cleared;
  const all = typeof location !== 'undefined' && new URLSearchParams(location.search).get('voyage') === 'all';
  const boat = boatFor(all ? ['oki', 'enyo'] : cleared);
  const boatRef = useRef(boat);
  boatRef.current = boat;
  const openRef = useRef({ cleared, all });
  openRef.current = { cleared, all };

  const axis = useRef<Axis>({ x: 0, y: 0 });
  const S = useRef<State>(fresh());
  const [view3d, setView3d] = useState<boolean>(() => {
    try { return localStorage.getItem('suisanVoyage3d') !== '0'; } catch { return true; }
  });
  const toggle3d = (on: boolean) => { setView3d(on); try { localStorage.setItem('suisanVoyage3d', on ? '1' : '0'); } catch { /* 保存できなくても あそべる */ } };
  const fail3d = useCallback(() => toggle3d(false), []);
  const ctl = useRef<SeaCtl>({ isOpen: () => true, nearId: null, boat: 'small' });
  const [, force] = useState(0);

  const say = (m: string, ms = 3600) => { S.current.msg = m; S.current.msgUntil = performance.now() + ms; };

  useEffect(() => {
    g.suisanPlay();
    say('船を うごかして、あわの ある 漁場へ 行こう！ はじめは 領海（沿岸漁業）の 海だよ。', 5200);
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = S.current;
      if (s.phase === 'sail') {
        const a = axis.current;
        if (a.x || a.y) {
          const len = Math.hypot(a.x, a.y) || 1;
          const sp = boatRef.current.speed;
          let nx = Math.min(WORLD_W - 18, Math.max(PORT_X - 6, s.x + (a.x / len) * sp * dt));
          const ny = Math.min(WORLD_H - 22, Math.max(30, s.y + (a.y / len) * sp * dt));
          if (a.x) s.face = a.x > 0 ? 1 : -1;
          // まだ 出られない 海域には はいれない
          const z = zoneAt(nx);
          if (!zoneOpen(z, openRef.current.cleared, openRef.current.all)) {
            nx = Math.min(nx, z.x0 - 8);
            if (now > s.msgUntil) say(`🔒 この船では まだ ここまで。${z.hint}`, 3200);
          }
          s.x = nx; s.y = ny;
        }
      } else {
        s.ct += dt;
        s.cur = 0.5 - 0.5 * Math.cos(s.ct * (RATE[s.zoneId] ?? 3));
      }
      force((n) => n + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const s = S.current;
  const zone = zoneAt(s.x);
  const nearSpot = s.phase === 'sail'
    ? s.spots.find((p) => p.left > 0 && Math.hypot(p.x - s.x, p.y - s.y) < SPOT_RADIUS && zoneOpen(zoneAt(p.x), cleared, all)) ?? null
    : null;
  ctl.current = {
    isOpen: (id) => { const z = ZONES.find((q) => q.id === id); return !z || zoneOpen(z, cleared, all); },
    nearId: nearSpot ? nearSpot.id : null,
    boat: boat.cap >= 12 ? 'big' : boat.cap >= 8 ? 'mid' : 'small',
  };
  const atPort = s.x <= PORT_X + 38;
  const full = s.hold.length >= boat.cap;
  const worth = s.hold.reduce((a, f) => a + f.price, 0);
  const left = s.spots.filter((p) => p.left > 0 && zoneOpen(zoneAt(p.x), cleared, all)).length;

  const startFish = () => {
    if (!nearSpot) return;
    if (full) { say('つみ荷が いっぱい！ 漁港へ もどって 水あげしよう。', 3200); sfx('ng'); return; }
    const z = zoneAt(nearSpot.x);
    s.phase = 'fish'; s.spot = nearSpot.id; s.ct = 0; s.zoneId = z.id; s.win = z.window;
    s.center = 0.3 + Math.random() * 0.4;
    sfx('splash');
  };

  const hit = () => {
    if (s.phase !== 'fish') return;
    const spot = s.spots.find((p) => p.id === s.spot);
    const z = zoneAt(spot ? spot.x : s.x);
    const ok = Math.abs(s.cur - s.center) <= s.win / 2;
    s.phase = 'sail';
    s.spot = null;
    if (ok && spot) {
      const f = pickFish(z, Math.random());
      spot.left--;
      s.hold = [...s.hold, f];
      sfx('catch');
      let m = `${f.emoji} ${f.name}を つった！（${s.hold.length} / ${boat.cap}）`;
      if (spot.left <= 0) m += '　この 漁場の 魚は とりつくしたよ';
      if (!s.tipped.includes(z.id)) { s.tipped = [...s.tipped, z.id]; m += `\n${z.tip}`; }
      say(m, 4800);
    } else {
      sfx('ng');
      say('あっ、にげられた…！ もういちど ねらおう', 2400);
    }
  };

  const sell = () => {
    if (!s.hold.length) return;
    const money = worth;
    g.suisanUpdate((x) => ({ ...x, coin: x.coin + money }));
    sfx('coin');
    s.total += money; s.trips++;
    const names = Array.from(new Set(s.hold.map((f) => f.name))).join('・');
    s.hold = [];
    say(`水あげ！ ${names}で +${money}万円。船が 大きいほど たくさん つめて、遠くの 高い 魚も とれるよ。`, 5200);
  };

  const reset = () => {
    const keep = { total: s.total, trips: s.trips, tipped: s.tipped, hold: s.hold };
    S.current = { ...fresh(), ...keep, x: PORT_X + 30 };
    say('あたらしい 漁場に なったよ！ 魚を とりすぎないのが 漁業の 未来を まもるんだ。', 4200);
  };

  // ── 絵 ──
  const cam = Math.min(Math.max(0, s.x - VW / 2), WORLD_W - VW);
  const sellBtn = atPort && s.phase === 'sail' && s.hold.length > 0;
  const resetBtn = atPort && s.phase === 'sail' && s.hold.length === 0 && left === 0;
  const msg = performance.now() < s.msgUntil && s.msg ? s.msg : zone.id === 'near' && !nearSpot
    ? '🫧 あわの ところで「つる！」。つんだ 魚は 漁港で 水あげ。'
    : `いまは ${zone.name} ＝ ${zone.gyogyo}（${zone.trip}）`;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-[14px] font-black text-ink">{boat.emoji} しゅっこう</div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-black text-amber-800">💰 {g.save.suisan.coin}万円</span>
          <button className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-black text-sky-800" onClick={() => toggle3d(!view3d)}>{view3d ? '2Dで みる' : '3Dで みる'}</button>
          <button className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-black text-ink" onClick={onBack}>もどる</button>
        </div>
      </div>

      <div className="mb-1.5 flex items-center justify-between rounded-xl bg-sky-50 px-3 py-1.5 text-[11.5px] font-black text-sky-900">
        <span>{boat.emoji} {boat.name}</span>
        <span>{zone.gyogyo}（{zone.trip}）</span>
        <span>つみ荷 {s.hold.length}/{boat.cap}</span>
      </div>

      {view3d && (
        <Suspense fallback={<div className="mb-1.5 flex w-full items-center justify-center rounded-2xl bg-sky-100 text-[12px] font-black text-sky-800" style={{ aspectRatio: '340 / 270' }}>うみを よういしているよ…</div>}>
          <Sea3D sRef={S} ctl={ctl} onFail={fail3d} />
        </Suspense>
      )}
      {!view3d && <svg viewBox={`0 0 ${VW} ${VH}`} className="mb-1.5 w-full select-none rounded-2xl shadow ring-1 ring-black/10">
        <rect width={VW} height={VH} fill="#bae6fd" />
        <g transform={`translate(${-cam},0)`}>
          {ZONES.map((z) => {
            const open = zoneOpen(z, cleared, all);
            return (
              <g key={z.id}>
                <rect x={z.x0} y="0" width={z.x1 - z.x0} height={VH} fill={z.fill} />
                {!open && <rect x={z.x0} y="0" width={z.x1 - z.x0} height={VH} fill="#0f172a" opacity="0.45" />}
                <text x={(z.x0 + z.x1) / 2} y="18" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0c4a6e">{z.gyogyo}</text>
                <text x={(z.x0 + z.x1) / 2} y="31" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#0c4a6e" opacity="0.85">{z.name}</text>
                {!open && (
                  <g>
                    <text x={(z.x0 + z.x1) / 2} y={VH / 2 - 6} textAnchor="middle" fontSize="26">🔒</text>
                    <text x={(z.x0 + z.x1) / 2} y={VH / 2 + 14} textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#fef3c7">ステージ「{z.needs ? STAGE_BY_ID[z.needs]?.name : ''}」を</text>
                    <text x={(z.x0 + z.x1) / 2} y={VH / 2 + 27} textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#fef3c7">クリアすると 行けるよ</text>
                  </g>
                )}
                <path d={`M${z.x1} 0 V${VH}`} stroke="#fff" strokeWidth="1.6" strokeDasharray="5 4" />
              </g>
            );
          })}
          {/* 陸と 漁港 */}
          <path d={`M0 0 H${PORT_X - 14} Q${PORT_X - 30} ${VH / 2} ${PORT_X - 14} ${VH} H0 Z`} fill="#a3e635" stroke="#4d7c0f" strokeWidth="1.4" />
          <rect x="8" y={VH / 2 - 26} width="34" height="26" rx="2" fill="#fde68a" stroke="#92400e" strokeWidth="1.4" />
          <path d={`M4 ${VH / 2 - 26} L25 ${VH / 2 - 44} L46 ${VH / 2 - 26} Z`} fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.4" />
          <text x="28" y={VH / 2 + 16} textAnchor="middle" fontSize="11" fontWeight="900" fill="#14532d">漁港</text>
          <rect x={PORT_X - 32} y={VH / 2 - 5} width="30" height="8" fill="#a16207" stroke="#713f12" strokeWidth="1" />
          {/* 漁場 */}
          {s.spots.map((p) => {
            const open = zoneOpen(zoneAt(p.x), cleared, all);
            if (!open) return null;
            const empty = p.left <= 0;
            const near = nearSpot?.id === p.id || s.spot === p.id;
            return (
              <g key={p.id} opacity={empty ? 0.35 : 1}>
                <circle cx={p.x} cy={p.y} r={SPOT_RADIUS - 6} fill="#fff" opacity={near ? 0.5 : 0.22} stroke={near ? '#f59e0b' : '#fff'} strokeWidth={near ? 2.4 : 1} strokeDasharray="4 3" />
                <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="16">{empty ? '〰️' : '🫧'}</text>
                {!empty && [...Array(p.left)].map((_, i) => <circle key={i} cx={p.x - (p.left - 1) * 4 + i * 8} cy={p.y + 17} r="2.4" fill="#0c4a6e" />)}
              </g>
            );
          })}
          {/* 船 */}
          <ellipse cx={s.x - s.face * 20} cy={s.y + 8} rx="14" ry="3.5" fill="#fff" opacity="0.55" />
          <text x={s.x} y={s.y + 9} textAnchor="middle" fontSize="28" transform={`translate(${s.x} 0) scale(${-s.face} 1) translate(${-s.x} 0)`}>{boat.emoji}</text>
        </g>
      </svg>}

      <div className="mb-1.5 flex items-start gap-2 rounded-2xl bg-sky-50 px-2 py-1.5">
        <div className="shrink-0"><CharSVG charKey="beaver" level={6} fillPct={100} size={40} label="モクタ" /></div>
        <div className="min-h-[34px] whitespace-pre-line text-[12px] font-bold leading-relaxed text-ink">{msg}</div>
      </div>

      {s.hold.length > 0 && (
        <div className="mb-1.5 flex flex-wrap items-center gap-1 rounded-xl bg-amber-50 px-2 py-1 text-[11px] font-black text-amber-900">
          <span>つんだ：</span>
          {s.hold.map((f, i) => <span key={i} className="text-[16px]" style={f.hue ? { filter: `hue-rotate(${f.hue}deg) saturate(1.5)` } : undefined}>{f.emoji}</span>)}
          <span className="ml-auto">約 {worth}万円</span>
        </div>
      )}

      {s.phase === 'fish' ? (
        <div className="rounded-2xl bg-sky-900 px-3 py-3 text-white">
          <div className="mb-1 text-center text-[12px] font-black">ゲージが 🟩みどりに きたら「いま！」</div>
          <div className="relative mb-2 h-7 overflow-hidden rounded-full bg-sky-950 ring-2 ring-white/30">
            <div className="absolute top-0 h-full bg-emerald-400/90" style={{ left: `${(s.center - s.win / 2) * 100}%`, width: `${s.win * 100}%` }} />
            <div className="absolute top-0 h-full w-1.5 rounded bg-white" style={{ left: `calc(${s.cur * 100}% - 3px)` }} />
          </div>
          <button className="btn-main" onPointerDown={(e) => { e.preventDefault(); hit(); }}>🎣 いま！</button>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl bg-sky-900 px-3 py-2.5">
          <DPad axisRef={axis} />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <button disabled={!nearSpot} onClick={startFish}
              className={`rounded-2xl px-2 py-3 text-[14px] font-black shadow ${nearSpot ? 'bg-amber-400 text-amber-950 active:scale-[0.97]' : 'bg-white/15 text-white/50'}`}>
              🎣 つる！
            </button>
            {sellBtn && <button onClick={sell} className="rounded-2xl bg-emerald-400 px-2 py-2.5 text-[13px] font-black text-emerald-950 shadow active:scale-[0.97]">💰 水あげする（約{worth}万円）</button>}
            {resetBtn && <button onClick={reset} className="rounded-2xl bg-white px-2 py-2.5 text-[12px] font-black text-sky-900 shadow active:scale-[0.97]">🫧 あたらしい 漁場へ</button>}
            {!sellBtn && !resetBtn && <div className="px-1 text-center text-[10.5px] font-bold leading-snug text-white/70">{atPort ? '漁港だよ。魚を つんだら 水あげできるよ' : left === 0 ? '漁場が ぜんぶ なくなった！ 漁港へ もどろう' : `のこりの 漁場 ${left}か所`}</div>}
          </div>
        </div>
      )}

      {s.total > 0 && <div className="mt-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-center text-[11.5px] font-black text-emerald-800">きょうの 水あげ {s.total}万円（{s.trips}かい）</div>}
    </div>
  );
}
