import { useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import { sfx } from '../lib/sound';
import { CharSVG } from './CharSVG';
import {
  STAGES, STAGE_BY_ID, QUESTIONS_PER_STAGE, HEARTS, kindsOf, makePlay,
  type Block, type Fig, type Puzzle, type Question, type StageId,
} from '../lib/zukei';

// ずけいこうぼう：11月の算数（多角形／円とおうぎ1・2）を、ステージを すすめながら れんしゅうする。
// 積み木（ブロック）を ドラッグして はめて 形を つくり、できあがったら 1問こたえる。数は まいかい ランダム。
// まちがえると ❤️が へって、かいせつを みて べつの 数で もういちど。
// メダルは つかわない・ふやさない。ごほうびは ステージごとの 家具。

const W = 300;
const H = 190;

interface Play {
  stage: StageId;
  kinds: string[];
  qi: number;
  q: Question;
  pz?: Puzzle;
  /** トレイに のこっている ブロックID */
  tray: string[];
  placed: number;
  msg: string;
  hearts: number;
  phase: 'build' | 'cut' | 'ask' | 'right' | 'wrong' | 'over' | 'clear';
  picked: string | null;
  slider: number;
  hint: boolean;
  miss: number;
}

const startQ = (pl: { q: Question; pz?: Puzzle }): Pick<Play, 'q' | 'pz' | 'tray' | 'placed' | 'msg' | 'phase' | 'picked' | 'slider' | 'hint'> => ({
  q: pl.q, pz: pl.pz, tray: pl.pz ? pl.pz.blocks.map((b) => b.id) : [], placed: 0, msg: '',
  phase: pl.pz ? 'build' : pl.q.cut ? 'cut' : 'ask', picked: null, slider: pl.q.cut ? 20 : 0, hint: false,
});

// ───────── 図 ─────────
const rad = (d: number) => (d * Math.PI) / 180;
const jit = (i: number, k: number) => Math.sin(i * 12.9898 + k * 78.233) * 0.5;   // -0.5〜0.5 の きまった ゆらぎ

function polyPts(n: number, regular: boolean) {
  const cx = 150;
  const cy = 98;
  return Array.from({ length: n }, (_, i) => {
    const ang = -90 + (360 * i) / n + (regular ? 0 : jit(i, 1) * 18);
    const r = 76 * (regular ? 1 : 0.8 + jit(i, 2) * 0.35);
    return { x: cx + r * Math.cos(rad(ang)), y: cy + r * Math.sin(rad(ang)) };
  });
}

const FAN_COLORS = ['#fde68a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#ddd6fe', '#fed7aa', '#a7f3d0', '#fecaca', '#e9d5ff'];

function PolyFig({ fig, hint }: { fig: Extract<Fig, { t: 'poly' }>; hint: boolean }) {
  const pts = polyPts(fig.n, fig.regular);
  const poly = pts.map((p) => `${p.x},${p.y}`).join(' ');
  const cx = 150;
  const cy = 98;
  return (
    <g>
      <polygon points={poly} fill="#fef3c7" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
      {hint && pts.slice(1, -1).map((_, i) => {
        const a = pts[i + 1];
        const b = pts[i + 2] ?? pts[0];
        return <polygon key={i} points={`${pts[0].x},${pts[0].y} ${a.x},${a.y} ${b.x},${b.y}`} fill={FAN_COLORS[i % FAN_COLORS.length]} stroke="#b45309" strokeWidth="2" strokeLinejoin="round" opacity="0.95" />;
      })}
      {hint && <circle cx={pts[0].x} cy={pts[0].y} r="5" fill="#ef4444" />}
      {fig.angles && pts.map((pt, i) => {
        const v = fig.angles![i];
        if (v === undefined) return null;
        const dx = pt.x - cx;
        const dy = pt.y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const tx = pt.x - (dx / len) * 20;
        const ty = pt.y - (dy / len) * 20 + 4;
        return <text key={i} x={tx} y={ty} textAnchor="middle" fontSize={v < 0 ? 18 : 12} fontWeight="900" fill={v < 0 ? '#dc2626' : '#1e3a8a'}>{v < 0 ? '？' : `${v}°`}</text>;
      })}
      {!fig.angles && !fig.ask && <text x={cx} y={cy + 5} textAnchor="middle" fontSize="15" fontWeight="900" fill="#92400e">{fig.n}かくけい</text>}
      {!fig.angles && fig.ask && <text x={cx} y={cy + 6} textAnchor="middle" fontSize="20" fontWeight="900" fill="#dc2626">？</text>}
    </g>
  );
}

function SectorFig({ r, a, angle, ask }: { r: number; a: number; angle: number; ask?: 'a' }) {
  const cx = 105;
  const cy = 98;
  const R = 78;
  const ang = Math.min(angle, 359.99);
  const x2 = cx + R * Math.cos(rad(ang));
  const y2 = cy - R * Math.sin(rad(ang));
  const big = ang > 180 ? 1 : 0;
  const mid = rad(ang / 2);
  const dots = [[0.55, 0.3], [0.5, 0.65], [0.75, 0.5], [0.3, 0.5]].map(([d, f]) => ({ x: cx + R * d * Math.cos(rad(ang * f)), y: cy - R * d * Math.sin(rad(ang * f)) }));
  return (
    <g>
      <circle cx={cx} cy={cy} r={R} fill="#fffbeb" stroke="#d6a85f" strokeWidth="2" strokeDasharray="4 4" />
      {ang > 0.5 && (
        <>
          <path d={`M${cx} ${cy} L${cx + R} ${cy} A${R} ${R} 0 ${big} 0 ${x2} ${y2} Z`} fill="#fbbf24" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
          {ang > 40 && dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="5" fill="#dc2626" opacity="0.9" />)}
          <path d={`M${cx + 24} ${cy} A24 24 0 ${big} 0 ${cx + 24 * Math.cos(rad(ang))} ${cy - 24 * Math.sin(rad(ang))}`} fill="none" stroke="#1e3a8a" strokeWidth="2" />
        </>
      )}
      <text x={cx + (ang > 90 ? 46 : 44) * Math.cos(mid)} y={cy - (ang > 90 ? 46 : 44) * Math.sin(mid) + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill="#78350f">{ask === 'a' ? '？°' : `${Math.round(angle)}°`}</text>
      <text x={cx + R / 2} y={cy + 14} textAnchor="middle" fontSize="12" fontWeight="900" fill="#1e3a8a">{r}cm</text>
      <circle cx={cx} cy={cy} r="3" fill="#1e3a8a" />
      <g transform="translate(222 60)">
        <rect x="-4" y="-14" width="74" height="42" rx="8" fill="#fff" stroke="#d6a85f" />
        <text x="33" y="2" textAnchor="middle" fontSize="10" fontWeight="900" fill="#78350f">{ask === 'a' ? 'ちゅうもんの' : 'ちゅうもんの'}</text>
        <text x="33" y="18" textAnchor="middle" fontSize="11" fontWeight="900" fill="#78350f">{ask === 'a' ? 'かくどは？' : `${a}どだよ`}</text>
      </g>
    </g>
  );
}

function CircleFig({ r }: { r: number }) {
  return (
    <g>
      <circle cx="150" cy="98" r="76" fill="#bae6fd" stroke="#0369a1" strokeWidth="3" />
      <path d="M150 98 L226 98" stroke="#1e3a8a" strokeWidth="2.5" />
      <circle cx="150" cy="98" r="3" fill="#1e3a8a" />
      <text x="188" y="92" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1e3a8a">{r}cm</text>
    </g>
  );
}

const SHADE = '#f9a8d4';
function SqFig({ fig }: { fig: Extract<Fig, { t: 'sqQuarter' | 'sqCircle' | 'petal' }> }) {
  const S = 130;
  const x0 = 85;
  const y0 = 28;
  const side = fig.t === 'petal' ? fig.r : fig.s;
  const lab = (x: number, y: number, t: string) => <text x={x} y={y} textAnchor="middle" fontSize="12" fontWeight="900" fill="#1e3a8a">{t}</text>;
  return (
    <g>
      {fig.t === 'sqQuarter' && (
        <>
          <rect x={x0} y={y0} width={S} height={S} fill={SHADE} stroke="#9d174d" strokeWidth="3" />
          <path d={`M${x0} ${y0} L${x0 + S} ${y0} A${S} ${S} 0 0 1 ${x0} ${y0 + S} Z`} fill="#fff" stroke="#9d174d" strokeWidth="3" />
        </>
      )}
      {fig.t === 'sqCircle' && (
        <>
          <rect x={x0} y={y0} width={S} height={S} fill={SHADE} stroke="#9d174d" strokeWidth="3" />
          <circle cx={x0 + S / 2} cy={y0 + S / 2} r={S / 2} fill="#fff" stroke="#9d174d" strokeWidth="3" />
        </>
      )}
      {fig.t === 'petal' && (
        <>
          <clipPath id="zk-qa"><path d={`M${x0} ${y0 + S} L${x0} ${y0} A${S} ${S} 0 0 1 ${x0 + S} ${y0 + S} Z`} /></clipPath>
          <rect x={x0} y={y0} width={S} height={S} fill="#fff" stroke="#9d174d" strokeWidth="3" />
          <path d={`M${x0} ${y0 + S} L${x0} ${y0} A${S} ${S} 0 0 1 ${x0 + S} ${y0 + S} Z`} fill="#fef3c7" stroke="#9d174d" strokeWidth="2" />
          <g clipPath="url(#zk-qa)">
            <path d={`M${x0 + S} ${y0} L${x0} ${y0} A${S} ${S} 0 0 0 ${x0 + S} ${y0 + S} Z`} fill={SHADE} stroke="#9d174d" strokeWidth="2" />
          </g>
          <path d={`M${x0} ${y0} A${S} ${S} 0 0 1 ${x0 + S} ${y0 + S}`} fill="none" stroke="#9d174d" strokeWidth="3" />
        </>
      )}
      {lab(x0 + S / 2, y0 + S + 16, `${side}cm`)}
    </g>
  );
}

function RingFig({ R: Rv, r: rv, a }: { R: number; r: number; a: number }) {
  const cx = 80;
  const cy = 108;
  const R = 82;
  const r = (R * rv) / Rv;
  const wedge = (rr: number) => {
    const x2 = cx + rr * Math.cos(rad(a));
    const y2 = cy - rr * Math.sin(rad(a));
    return `M${cx} ${cy} L${cx + rr} ${cy} A${rr} ${rr} 0 ${a > 180 ? 1 : 0} 0 ${x2} ${y2} Z`;
  };
  return (
    <g>
      <path d={wedge(R)} fill={SHADE} stroke="#9d174d" strokeWidth="3" strokeLinejoin="round" />
      <path d={wedge(r)} fill="#fff" stroke="#9d174d" strokeWidth="3" strokeLinejoin="round" />
      <text x={cx + (r + R) / 2} y={cy + 14} textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e3a8a">{Rv - rv}cm</text>
      <text x={cx + r / 2} y={cy + 14} textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e3a8a">{rv}cm</text>
      <path d={`M${cx} ${cy + 24} L${cx + R} ${cy + 24}`} stroke="#1e3a8a" strokeWidth="1.5" />
      <text x={cx + R / 2} y={cy + 38} textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e3a8a">ぜんぶで {Rv}cm</text>
      <text x={cx + 26} y={cy - 12} fontSize="12" fontWeight="900" fill="#1e3a8a">{a}°</text>
      <circle cx={cx} cy={cy} r="3" fill="#1e3a8a" />
    </g>
  );
}

function Figure({ q, slider, hint }: { q: Question; slider: number; hint: boolean }) {
  const f = q.fig;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mb-2 w-full select-none rounded-2xl bg-white shadow ring-1 ring-black/10">
      {f.t === 'poly' && <PolyFig fig={f} hint={hint} />}
      {f.t === 'sector' && <SectorFig r={f.r} a={f.a} ask={f.ask} angle={q.cut && slider !== -1 ? slider : f.a} />}
      {f.t === 'circle' && <CircleFig r={f.r} />}
      {(f.t === 'sqQuarter' || f.t === 'sqCircle' || f.t === 'petal') && <SqFig fig={f} />}
      {f.t === 'ring' && <RingFig R={f.R} r={f.r} a={f.a} />}
    </svg>
  );
}

// ───────── 積み木ボード ─────────
const BW = 300;
const BH = 292;

const wedgeD = (cx: number, cy: number, R: number, a0: number, a1: number) => {
  const x0 = cx + R * Math.cos(rad(a0));
  const y0 = cy + R * Math.sin(rad(a0));
  const x1 = cx + R * Math.cos(rad(a1));
  const y1 = cy + R * Math.sin(rad(a1));
  return `M${cx} ${cy} L${x0} ${y0} A${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`;
};
const PIZZA_COLORS = ['#fbbf24', '#fb923c', '#f59e0b', '#f97316'];

function BlockShape({ b }: { b: Block }) {
  const st = { stroke: '#4c1d95', strokeWidth: 2, strokeLinejoin: 'round' as const };
  const a = b.a ?? 60;
  return (
    <g>
      {b.shape === 'tri' && <path d="M0 -17 L19 14 L-19 14 Z" fill="#fcd34d" {...st} />}
      {b.shape === 'sqr' && <rect x="-14" y="-14" width="28" height="28" rx="2" fill="#cbd5e1" {...st} />}
      {(b.shape === 'wedge' || b.shape === 'slice') && (
        <g transform={`translate(${a > 150 ? 0 : -8} 0)`}>
          <path d={wedgeD(0, 0, 22, -a / 2, a / 2)} fill={b.shape === 'slice' ? '#fbbf24' : '#a7f3d0'} {...st} />
        </g>
      )}
      {b.shape === 'q' && <path d="M-12 12 L-12 -12 A24 24 0 0 1 12 12 Z" fill="#fff" {...st} />}
      {b.shape === 'h' && <path d="M-20 8 A20 20 0 0 1 20 8 Z" fill="#fff" {...st} />}
      {b.shape === 'c' && <circle r="17" fill="#fff" {...st} />}
      {b.shape === 's' && <path d="M-14 12 L10 12 A24 24 0 0 0 -5.8 -10.6 Z" fill="#fff" {...st} />}
      {b.label && <text x="0" y="29" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#1e3a8a">{b.label}</text>}
    </g>
  );
}

function SlotFig({ pz, placed }: { pz: Puzzle; placed: number }) {
  const f = pz.fig;
  const cx = 150;
  const cy = 98;
  if (f.t === 'tri') {
    const pts = polyPts(f.n, true);
    return (
      <g>
        {pts.slice(1, -1).map((_, i) => {
          const a = pts[i + 1];
          const b = pts[i + 2] ?? pts[0];
          const on = i < placed;
          return <polygon key={i} points={`${pts[0].x},${pts[0].y} ${a.x},${a.y} ${b.x},${b.y}`} fill={on ? FAN_COLORS[i % FAN_COLORS.length] : '#fff'} stroke="#b45309" strokeWidth={on ? 2.5 : 2} strokeDasharray={on ? undefined : '5 4'} strokeLinejoin="round" />;
        })}
        <text x={cx} y="186" textAnchor="middle" fontSize="11" fontWeight="900" fill="#78350f">{nameOfN(f.n)}</text>
      </g>
    );
  }
  if (f.t === 'wedge' || f.t === 'slice') {
    const n = f.t === 'wedge' ? f.n : f.k;
    const ang = 360 / n;
    return (
      <g>
        <circle cx={cx} cy={cy} r="78" fill="#fffbeb" stroke="#d6a85f" strokeWidth="2" strokeDasharray="4 4" />
        {Array.from({ length: n }, (_, j) => {
          const on = j < placed;
          return <path key={j} d={wedgeD(cx, cy, 76, -90 + j * ang, -90 + (j + 1) * ang)} fill={on ? (f.t === 'wedge' ? FAN_COLORS[j % FAN_COLORS.length] : PIZZA_COLORS[j % 4]) : 'none'} stroke={on ? '#b45309' : '#d6a85f'} strokeWidth={on ? 2.5 : 1.5} strokeDasharray={on ? undefined : '4 4'} strokeLinejoin="round" />;
        })}
        {f.t === 'slice' && Array.from({ length: placed }, (_, j) => {
          const m = rad(-90 + (j + 0.5) * ang);
          return <circle key={`d${j}`} cx={cx + 46 * Math.cos(m)} cy={cy + 46 * Math.sin(m)} r="5" fill="#dc2626" opacity="0.9" />;
        })}
      </g>
    );
  }
  if (f.t === 'sq') {
    const S = 130;
    const fig: Fig = f.kind === 'petal' ? { t: 'petal', r: f.s } : f.kind === 'sqCircle' ? { t: 'sqCircle', s: f.s } : { t: 'sqQuarter', s: f.s };
    const x0 = 85;
    const y0 = 28;
    if (f.kind === 'petal') {
      if (placed >= 2) return <SqFig fig={fig as Extract<Fig, { t: 'petal' }>} />;
      return (
        <g>
          <rect x={x0} y={y0} width={S} height={S} fill="#fff" stroke="#9d174d" strokeWidth="3" />
          {placed === 1 && <path d={`M${x0} ${y0 + S} L${x0} ${y0} A${S} ${S} 0 0 1 ${x0 + S} ${y0 + S} Z`} fill="#fef3c7" stroke="#9d174d" strokeWidth="2" />}
          <text x={x0 + S / 2} y={y0 + S + 16} textAnchor="middle" fontSize="12" fontWeight="900" fill="#1e3a8a">{f.s}cm</text>
        </g>
      );
    }
    if (placed >= 1) return <SqFig fig={fig as Extract<Fig, { t: 'sqQuarter' | 'sqCircle' }>} />;
    return (
      <g>
        <rect x={x0} y={y0} width={S} height={S} fill={SHADE} stroke="#9d174d" strokeWidth="3" />
        <text x={x0 + S / 2} y={y0 + S + 16} textAnchor="middle" fontSize="12" fontWeight="900" fill="#1e3a8a">{f.s}cm</text>
      </g>
    );
  }
  // ring
  if (placed >= 1) return <RingFig R={f.R} r={f.r} a={f.a} />;
  const R = 82;
  const rx = 80;
  const ry = 108;
  return (
    <g>
      <path d={`M${rx} ${ry} L${rx + R} ${ry} A${R} ${R} 0 ${f.a > 180 ? 1 : 0} 0 ${rx + R * Math.cos(rad(f.a))} ${ry - R * Math.sin(rad(f.a))} Z`} fill={SHADE} stroke="#9d174d" strokeWidth="3" strokeLinejoin="round" />
      <text x={rx + R / 2} y={ry + 14} textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e3a8a">{f.R}cm</text>
      <text x={rx + 26} y={ry - 12} fontSize="12" fontWeight="900" fill="#1e3a8a">{f.a}°</text>
    </g>
  );
}

const nameOfN = (n: number) => `${n}かくけい`;

function BuildBoard({ pz, tray, placed, onDrop }: { pz: Puzzle; tray: string[]; placed: number; onDrop(id: string): void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const blocks = tray.map((id) => pz.blocks.find((b) => b.id === id)!).filter(Boolean);
  const m = blocks.length;
  const cols = m <= 5 ? Math.max(m, 1) : Math.ceil(m / 2);
  const rows = m <= 5 ? 1 : 2;
  const cell = BW / cols;
  const scale = rows === 1 ? 1.15 : 0.9;
  const posOf = (i: number) => ({ x: cell * (i % cols) + cell / 2, y: rows === 1 ? 236 : 218 + Math.floor(i / cols) * 38 });

  const toSvg = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const r = pt.matrixTransform(ctm.inverse());
    return { x: r.x, y: r.y };
  };

  const dragged = drag ? pz.blocks.find((b) => b.id === drag.id) : null;
  return (
    <svg ref={svgRef} viewBox={`0 0 ${BW} ${BH}`} className="mb-2 w-full select-none rounded-2xl bg-white shadow ring-1 ring-black/10" style={{ touchAction: 'none' }}
      onPointerMove={(e) => { if (drag) { const pt = toSvg(e); setDrag({ ...drag, x: pt.x, y: pt.y }); } }}
      onPointerUp={(e) => { if (!drag) return; const pt = toSvg(e); const id = drag.id; setDrag(null); if (pt.y < 192) onDrop(id); }}
      onPointerCancel={() => setDrag(null)}>
      <SlotFig pz={pz} placed={placed} />
      <rect x="0" y="194" width={BW} height={BH - 194} fill="#fef3c7" />
      <line x1="0" y1="194" x2={BW} y2="194" stroke="#d6a85f" strokeWidth="2" strokeDasharray="5 4" />
      <text x="6" y="206" fontSize="9" fontWeight="900" fill="#92400e">▼ ブロックを うえの ずに ドラッグ！</text>
      {blocks.map((b, i) => {
        const pos = posOf(i);
        const isDrag = drag?.id === b.id;
        return (
          <g key={b.id} transform={`translate(${pos.x} ${pos.y}) scale(${scale})`} opacity={isDrag ? 0.25 : 1} style={{ cursor: 'grab' }}
            onPointerDown={(e) => { e.preventDefault(); try { svgRef.current?.setPointerCapture(e.pointerId); } catch { /* そのまま */ } const pt = toSvg(e); setDrag({ id: b.id, x: pt.x, y: pt.y }); }}>
            <rect x="-24" y="-24" width="48" height={b.label ? 58 : 48} fill="transparent" />
            <BlockShape b={b} />
          </g>
        );
      })}
      {drag && dragged && (
        <g transform={`translate(${drag.x} ${drag.y - 14}) scale(1.35)`} pointerEvents="none" style={{ filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.35))' }}>
          <BlockShape b={dragged} />
        </g>
      )}
    </svg>
  );
}

// ───────── 本体 ─────────
export function ZukeiModal({ onClose }: { onClose: () => void }) {
  const g = useGame();
  const [p, setP] = useState<Play | null>(null);
  const [res, setRes] = useState<{ isNew: boolean; reward: string | null } | null>(null);
  const cleared = g.save.zukei.cleared;

  const start = (stage: StageId) => {
    const kinds = kindsOf(stage);
    g.zukeiPlay();
    setRes(null);
    setP({ stage, kinds, qi: 0, hearts: HEARTS, miss: 0, ...startQ(makePlay(stage, kinds[0])) });
  };

  const choose = (c: string) => {
    if (!p || p.phase !== 'ask') return;
    if (c === p.q.answer) {
      sfx('star');
      if (p.qi + 1 >= p.kinds.length) {
        setRes(g.zukeiClear(p.stage));
        setP({ ...p, picked: c, phase: 'clear' });
      } else {
        setP({ ...p, picked: c, phase: 'right' });
      }
    } else {
      sfx('gift');
      const hearts = p.hearts - 1;
      setP({ ...p, picked: c, hearts, miss: p.miss + 1, phase: hearts <= 0 ? 'over' : 'wrong' });
    }
  };

  const dropBlock = (id: string) => {
    if (!p || p.phase !== 'build' || !p.pz) return;
    const b = p.pz.blocks.find((x) => x.id === id);
    if (!b) return;
    if (b.good && p.placed < p.pz.need) {
      const placed = p.placed + 1;
      const done = placed >= p.pz.need;
      sfx(done ? 'star' : 'gift');
      setP({ ...p, tray: p.tray.filter((t) => t !== id), placed, msg: '', phase: done ? 'ask' : 'build' });
    } else {
      setP({ ...p, msg: 'それは ぴったり はまらないよ。ほかの ブロックを ためしてみよう' });
    }
  };

  const next = () => {
    if (!p) return;
    const qi = p.qi + 1;
    setP({ ...p, qi, ...startQ(makePlay(p.stage, p.kinds[qi])) });
  };
  const retry = () => {
    if (!p) return;
    setP({ ...p, ...startQ(makePlay(p.stage, p.kinds[p.qi])) });
  };

  // ───────── えらぶ画面 ─────────
  if (!p) {
    return (
      <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
        <div className="panel max-h-[90vh] w-full max-w-[460px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[15px] font-black text-ink">📐 ずけいこうぼう</div>
            <button className="rounded-full bg-gray-100 px-3 py-1 text-[12px] font-black text-ink" onClick={onClose}>とじる</button>
          </div>
          <div className="mb-2 flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2">
            <CharSVG charKey="bee" level={6} fillPct={100} size={52} label="ハニー" />
            <div className="text-[12px] font-bold leading-relaxed text-ink">
              11月の テストの れんしゅうだよ！ 3つの ステージを クリアすると 家具が もらえるよ。ブロックを ドラッグして 形を つくってから 問題に こたえよう。まちがえると ❤️が へるけど、かいせつを よんで もういちど ちょうせんしよう！
            </div>
          </div>
          {STAGES.map((s, i) => {
            const done = cleared.includes(s.id);
            return (
              <button key={s.id} className="mb-2 flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-3 text-left shadow ring-1 ring-black/5 active:scale-[0.99]" onClick={() => start(s.id)}>
                <div className="text-[34px]">{s.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black text-indigo-900/60">ステージ{i + 1}　{s.title}</div>
                  <div className="text-[15px] font-black text-ink">{s.game}</div>
                  <div className="text-[11px] font-black text-violet-700">
                    ごほうび：{ITEM_BY_ID[s.reward].emoji} {ITEM_BY_ID[s.reward].name}{done ? '（もらったよ）' : ''}
                  </div>
                </div>
                <div className="text-[20px]">{done ? '✅' : '▶'}</div>
              </button>
            );
          })}
          <div className="rounded-2xl bg-amber-50 px-3 py-2 text-center text-[11px] font-bold text-ink">
            クリアした ステージ {cleared.length} / {STAGES.length}　問題は ぜんぶ 毎回 かわるよ（円周率は 3.14）
          </div>
        </div>
      </div>
    );
  }

  const st = STAGE_BY_ID[p.stage];
  const q = p.q;
  const sliderOk = !!q.cut && Math.abs(p.slider - q.cut) <= 2;
  const cutHelp = q.cut ? (sliderOk ? 'ぴったり！ 切ってみよう' : p.slider < q.cut ? `あと ${Math.abs(q.cut - p.slider)}度 ひろげよう` : `${Math.abs(p.slider - q.cut)}度 せまくしよう`) : '';

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[94vh] w-full max-w-[460px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <div className="text-[14px] font-black text-ink">{st.emoji} {st.game}　<span className="text-[12px] text-indigo-900/60">{p.phase === 'clear' ? 'クリア！' : `${p.qi + 1} / ${QUESTIONS_PER_STAGE}`}</span></div>
          <div className="flex items-center gap-1.5">
            <span className="text-[13px]">{'❤️'.repeat(Math.max(0, p.hearts))}{'🤍'.repeat(Math.max(0, HEARTS - p.hearts))}</span>
            <button className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-black text-ink" onClick={() => { setP(null); setRes(null); }}>やめる</button>
          </div>
        </div>

        <div className="mb-2 flex gap-1">
          {p.kinds.map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i < p.qi || p.phase === 'clear' ? 'bg-emerald-500' : i === p.qi ? 'bg-amber-400' : 'bg-gray-200'}`} />
          ))}
        </div>

        {p.phase !== 'clear' && (
          <>
            {p.phase === 'build' && p.pz
              ? <BuildBoard pz={p.pz} tray={p.tray} placed={p.placed} onDrop={dropBlock} />
              : <Figure q={q} slider={p.slider} hint={p.hint || !!p.pz} />}

            <div className="mb-2 flex items-start gap-2 rounded-2xl bg-amber-50 px-2 py-2">
              <div className="shrink-0"><CharSVG charKey="bee" level={6} fillPct={100} size={44} label="ハニー" /></div>
              <div className="whitespace-pre-line text-[12.5px] font-bold leading-relaxed text-ink">
                {q.boss && <span className="mr-1 rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-black text-white">ボス</span>}
                {p.phase === 'build' && p.pz
                  ? `${p.pz.say}${p.msg ? `\n👉 ${p.msg}` : ''}`
                  : p.phase === 'cut' ? `ちゅうもんは「中心角 ${q.cut}度」！ スライダーで 角度を あわせて ピザを 切ろう` : q.text}
              </div>
            </div>
          </>
        )}

        {p.phase === 'build' && p.pz && (
          <>
            <div className="mb-2 text-center text-[11.5px] font-black text-amber-700">はめた ブロック {p.placed} / {p.pz.need}</div>
            <button className="w-full rounded-2xl bg-gray-100 py-2 text-[12px] font-black text-ink" onClick={() => setP({ ...p, hint: true })}>💡 ヒント</button>
            {p.hint && <div className="mt-2 rounded-2xl bg-sky-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-sky-900">💡 {p.pz.hint}</div>}
          </>
        )}

        {p.phase === 'cut' && (
          <div className="mb-2 rounded-2xl bg-white px-3 py-2 shadow ring-1 ring-black/5">
            <input type="range" min={5} max={355} step={1} value={p.slider} className="w-full" onChange={(e) => setP({ ...p, slider: Number(e.target.value) })} aria-label="角度" />
            <div className="mb-1 flex justify-between text-[12px] font-black">
              <span className="text-indigo-900/70">いまの 角度 {p.slider}度</span>
              <span className={sliderOk ? 'text-emerald-600' : 'text-rose-500'}>{cutHelp}</span>
            </div>
            <button className="btn-main" disabled={!sliderOk} style={{ opacity: sliderOk ? 1 : 0.45 }} onClick={() => { sfx('gift'); setP({ ...p, slider: q.cut!, phase: 'ask' }); }}>✂️ 切る！</button>
          </div>
        )}

        {p.phase === 'ask' && (
          <>
            <div className="mb-2 grid grid-cols-2 gap-2">
              {q.choices.map((c) => (
                <button key={c} className="rounded-2xl bg-white px-2 py-3 text-[14px] font-black text-ink shadow ring-1 ring-black/5 active:scale-[0.98]" onClick={() => choose(c)}>{c}</button>
              ))}
            </div>
            <button className="w-full rounded-2xl bg-gray-100 py-2 text-[12px] font-black text-ink" onClick={() => setP({ ...p, hint: true })}>💡 ヒント</button>
            {p.hint && <div className="mt-2 rounded-2xl bg-sky-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-sky-900">💡 {q.hint}</div>}
          </>
        )}

        {p.phase === 'right' && (
          <div className="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
            <div className="bubble-pop mb-1 text-3xl">⭕</div>
            <div className="mb-1 text-[14px] font-black text-emerald-800">せいかい！　{q.answer}</div>
            <div className="mb-2 whitespace-pre-line text-left text-[11.5px] font-bold leading-relaxed text-ink">{q.explain}</div>
            <button className="btn-main" onClick={next}>つぎの もんだいへ ▶</button>
          </div>
        )}

        {(p.phase === 'wrong' || p.phase === 'over') && (
          <div className="rounded-2xl bg-rose-50 px-3 py-3">
            <div className="mb-1 text-center text-[14px] font-black text-rose-700">ざんねん！ こたえは {q.answer}</div>
            <div className="mb-2 whitespace-pre-line rounded-xl bg-white px-2 py-2 text-[11.5px] font-bold leading-relaxed text-ink">{q.explain}</div>
            {p.phase === 'wrong' ? (
              <button className="btn-main" onClick={retry}>もういちど（ちがう 数で）</button>
            ) : (
              <>
                <div className="mb-2 text-center text-[12px] font-black text-rose-700">❤️が なくなっちゃった…。さいしょから やりなおそう</div>
                <button className="btn-main" onClick={() => start(p.stage)}>さいしょから ちょうせん</button>
              </>
            )}
          </div>
        )}

        {p.phase === 'clear' && (
          <div className="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
            <div className="bubble-pop mb-1 text-4xl">🎉</div>
            <div className="mb-1 text-[14px] font-black text-emerald-800">{st.game}　クリア！</div>
            <div className="mb-2 text-[11.5px] font-bold text-ink">まちがえた かいすう：{p.miss}かい</div>
            {res?.reward ? (
              <div className="mb-2 text-[12px] font-black text-violet-700">🎁 ごほうび：{ITEM_BY_ID[res.reward].emoji} {ITEM_BY_ID[res.reward].name}（「かぐ」から おけるよ）</div>
            ) : (
              <div className="mb-2 text-[11px] font-bold text-indigo-900/60">この ステージの ごほうびは もう もらってるよ</div>
            )}
            <button className="btn-main mb-1.5" onClick={() => { setP(null); setRes(null); }}>ほかの ステージも やる</button>
            <button className="w-full rounded-2xl bg-gray-100 py-2 text-[12px] font-black text-ink" onClick={onClose}>とじる</button>
          </div>
        )}
      </div>
    </div>
  );
}
