import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import { sfx, sawStart, sawLevel, sawStop } from '../lib/sound';
import {
  FORESTS, SLOTS, WEED_TUFTS, WORK_LABEL, SPECIES_LABEL, clearLine, stepsOf, treeScale,
  type Checkpoint, type Forest, type Species, type Work,
} from '../lib/forestry';
import { CharSVG } from './CharSVG';

// モクタの もりづくり：林業の作業（植栽→下刈り→除伐→間伐→主伐）を、道具をえらんで 森を タップ／なぞって まなぶ。
// メダルは つかわない・ふやさない。ごほうびは 森ごとの 家具。

const VW = 360;
const VH = 230;
const slotPos = (i: number) => ({ x: 30 + (i % 6) * 60, y: i < 6 ? 150 : 206 });
const TUFTS = [[48, 128], [108, 172], [168, 128], [228, 172], [288, 128], [78, 226 - 6], [198, 226 - 6], [318, 172]].map(([x, y]) => ({ x, y }));

type TreeState = 'empty' | 'alive' | 'bad' | 'cut';
interface Play {
  forest: Forest;
  hint: boolean;
  steps: Checkpoint[];
  ci: number;
  age: number;
  trees: TreeState[];
  weeds: boolean[];
  need: number;
  done: number;
  hearts: number;
  logs: number;
  msg: string;
  tool: Work | null;
  over: null | 'dead' | 'clear';
}

const pickN = (idx: number[], n: number): number[] => {
  const a = [...idx];
  const out: number[] = [];
  while (out.length < n && a.length) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
  return out;
};

/** そのチェックポイントに 入る（草を はやす・形の悪い木を きめる など） */
function enter(p: Play, ci: number): Play {
  const cp = p.steps[ci];
  let trees = p.trees;
  let weeds = p.weeds;
  let need = cp.need;
  if (cp.work === 'weed') weeds = Array(WEED_TUFTS).fill(true);
  if (cp.work === 'cull') {
    const alive = trees.map((t, i) => (t === 'alive' ? i : -1)).filter((i) => i >= 0);
    const bad = pickN(alive, 2);
    trees = trees.map((t, i) => (bad.includes(i) ? 'bad' : t));
  }
  if (cp.work === 'fell') need = trees.filter((t) => t === 'alive').length;
  const how = (cp.work === 'cull' || cp.work === 'thin' || cp.work === 'fell') ? '\n👆 森を タップ・なぞって モクタを うごかそう。木に ちかづくと じどうで 切るよ（⚙️チェーンソーは はやい！）' : '';
  return { ...p, ci, age: cp.age, trees, weeds, need, done: 0, msg: cp.say + how, tool: p.hint && cp.work !== 'watch' ? cp.work : p.tool };
}

function newPlay(forest: Forest, hint: boolean): Play {
  const steps = stepsOf(forest);
  const base: Play = {
    forest, hint, steps, ci: 0, age: steps[0].age,
    trees: Array(SLOTS).fill(forest.kind === 'tennen' ? 'alive' : 'empty'),
    weeds: Array(WEED_TUFTS).fill(false), need: 0, done: 0, hearts: 3, logs: 0, msg: '', tool: null, over: null,
  };
  return enter(base, 0);
}

const SPECIES_COLOR: Record<Species, { a: string; b: string; trunk: string }> = {
  sugi:   { a: '#2f6f3e', b: '#43914f', trunk: '#7c4a1d' },
  hinoki: { a: '#6fa83a', b: '#8cc152', trunk: '#8b5a2b' },
  hiba:   { a: '#1f5f5b', b: '#2f7f78', trunk: '#6b4423' },
};

function TreeSVG({ x, y, scale, species, bad, cut }: { x: number; y: number; scale: number; species: Species; bad: boolean; cut: boolean }) {
  const c = SPECIES_COLOR[species];
  const fa = bad ? '#a08457' : c.a;
  const fb = bad ? '#b79a68' : c.b;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={`fo-tree ${cut ? 'fo-cut' : ''}`}>
        <g transform={bad ? 'rotate(13)' : undefined}>
          <rect x="-4" y="-22" width="8" height="24" rx="2" fill={c.trunk} stroke="#3b2410" strokeWidth="1.4" />
          <polygon points="0,-90 -15,-56 15,-56" fill={fb} stroke="#14341c" strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="0,-74 -20,-38 20,-38" fill={fa} stroke="#14341c" strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="0,-56 -25,-18 25,-18" fill={fb} stroke="#14341c" strokeWidth="1.4" strokeLinejoin="round" />
          {species === 'hiba' && <polygon points="0,-40 -28,-8 28,-8" fill={fa} stroke="#14341c" strokeWidth="1.4" strokeLinejoin="round" />}
          {bad && <path d="M-9 -44 l6 6 M-3 -44 l-6 6 M10 -30 l6 6 M16 -30 l-6 6" stroke="#6b4423" strokeWidth="1.8" strokeLinecap="round" />}
        </g>
      </g>
    </g>
  );
}

function Sprout({ x, y, cut }: { x: number; y: number; cut?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} className={`fo-tree ${cut ? 'fo-cut' : ''}`}>
      <path d="M0 0 v-12" stroke="#4d7c0f" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M0 -10 q-9 -2 -9 -9 q9 0 9 9 M0 -12 q9 -2 9 -9 q-9 0 -9 9" fill="#65a30d" stroke="#3f6212" strokeWidth="1.2" strokeLinejoin="round" />
    </g>
  );
}

function Tuft({ x, y, gone }: { x: number; y: number; gone: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} className={`fo-weed ${gone ? 'fo-weed-cut' : ''}`}>
      <path d="M-10 0 q-2 -14 -6 -18 M-5 0 q-1 -18 -2 -24 M0 0 q1 -20 4 -26 M6 0 q3 -16 8 -20 M11 0 q3 -10 9 -12" fill="none" stroke="#4d9e2a" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** 林齢の ものさし（いまの 年・作業の 目安） */
function AgeBar({ p }: { p: Play }) {
  const jinko = p.forest.kind === 'jinko';
  const segs: { from: number; to: number; color: string; label: string }[] = jinko
    ? [
        { from: 1, to: 5, color: '#22c55e', label: '下刈り' },
        { from: 10, to: 15, color: '#f59e0b', label: '除伐' },
        { from: 20, to: 45, color: '#3b82f6', label: '間伐 3回' },
        { from: 50, to: 100, color: '#ef4444', label: '主伐' },
      ]
    : [
        { from: 60, to: 70, color: '#f59e0b', label: '手入れ' },
        { from: 80, to: 90, color: '#3b82f6', label: '手入れ' },
      ];
  const max = 100;
  return (
    <div className="mb-2">
      <div className="relative h-5 rounded-full bg-amber-900/15">
        {segs.map((s) => (
          <div key={s.label + s.from} className="absolute top-0 flex h-5 items-center justify-center overflow-hidden whitespace-nowrap text-[9px] font-black text-white"
            style={{ left: `${(s.from / max) * 100}%`, width: `${((s.to - s.from) / max) * 100}%`, background: s.color, minWidth: 6, borderRadius: 6 }}>
            {s.to - s.from >= 15 ? s.label : ''}
          </div>
        ))}
        {p.steps.map((s, i) => (
          <div key={i} className={`absolute top-[-3px] h-[26px] w-[3px] rounded ${i < p.ci ? 'bg-emerald-700' : 'bg-amber-900/40'}`} style={{ left: `calc(${(s.age / max) * 100}% - 1px)` }} />
        ))}
        <div className="absolute top-[-7px] text-[16px] leading-none transition-all duration-500" style={{ left: `calc(${Math.min(100, (p.age / max) * 100)}% - 8px)` }}>📍</div>
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-1 text-[10px] font-bold text-indigo-900/70">
        <span>0年</span>
        {jinko ? <span>🌿下刈り 1〜5年｜🪚除伐 10年ごろ｜🌲間伐 20〜45年に3回｜🪓主伐 50〜100年</span> : <span>樹齢100年をこえる 天然の森</span>}
        <span>100年〜</span>
      </div>
    </div>
  );
}

function wrongMsg(tool: Work, p: Play): string {
  const cp = p.steps[p.ci];
  const jinko = p.forest.kind === 'jinko';
  if (tool === 'fell' && jinko && cp.age < 50) return 'まだ はやいよ！ 木が 大きく育つのに 50年いじょう かかるんだ（主伐は 50〜100年ごろ）';
  if (tool === 'thin' && cp.work === 'cull') return '間伐は もっと あと（20〜45年ごろ）。いまは 形の悪い木を切る「除伐」の じきだよ';
  if (tool === 'cull' && cp.work === 'thin') return '除伐は 10年ごろに おわってるよ。いまは「間伐」で 木の本数を ととのえよう';
  if (tool === 'weed' && cp.work !== 'weed') return jinko && cp.age > 5 ? '木が 草より 高くなったから、もう 下刈りは いらないよ（下刈りは 5年ぐらいまで）' : '草かりは いまの じきじゃないよ';
  if (tool === 'plant' && cp.work !== 'plant') return 'なえ木は もう 植えおわったよ（植栽は 林齢1年）';
  if (tool === 'plant' || tool === 'weed') return `${WORK_LABEL[tool].name}は まだ はやいよ。いまは「${cp.title}」だよ`;
  return `${WORK_LABEL[tool].name}は いまの じきじゃないよ。いまは「${cp.title}」だよ`;
}

const TOOLS: Work[] = ['plant', 'weed', 'cull', 'thin', 'fell'];

// 木を切る作業：モクタを うごかして 木に ちかづくと、どうぐが じどうで 木を 切る。チェーンソーは はやい。
const CUT_WORKS: Work[] = ['cull', 'thin', 'fell'];
const TREE_HP: Partial<Record<Work, number>> = { cull: 3, thin: 4, fell: 6 };
const HAND_NAME: Partial<Record<Work, string>> = { cull: 'のこぎり', thin: 'のこぎり', fell: 'おの' };
const REACH = 30;            // 木の ねもとに この きょりまで ちかづくと 切りはじめる
const WALK = 95;             // モクタの あるく はやさ
const LOG_TO = { x: 300, y: 212 };
interface Chip { x: number; y: number; vx: number; vy: number; life: number; log: boolean; sx: number; sy: number }
const clampMk = (x: number, y: number) => ({ x: Math.max(12, Math.min(VW - 12, x)), y: Math.max(154, Math.min(224, y)) });

function MokutaSprite({ x, y, face, swing, saw, work }: { x: number; y: number; face: number; swing: number; saw: boolean; work: Work }) {
  const tool = saw ? '🪚' : work === 'fell' ? '🪓' : '🪚';
  return (
    <g transform={`translate(${x} ${y}) scale(1.25)`}>
      <ellipse cx="0" cy="1" rx="11" ry="3.5" fill="#000" opacity="0.18" />
      <g transform={`scale(${face} 1)`}>
        <ellipse cx="-11" cy="-5" rx="8" ry="3.5" fill="#6b4423" stroke="#3b2410" strokeWidth="1.2" />
        <ellipse cx="0" cy="-12" rx="9" ry="10" fill="#9a6a3a" stroke="#3b2410" strokeWidth="1.4" />
        <ellipse cx="1" cy="-9" rx="5.5" ry="6" fill="#e9c996" />
        <circle cx="0" cy="-27" r="8" fill="#9a6a3a" stroke="#3b2410" strokeWidth="1.4" />
        <circle cx="-5.5" cy="-33" r="2.8" fill="#9a6a3a" stroke="#3b2410" strokeWidth="1.2" />
        <circle cx="5.5" cy="-33" r="2.8" fill="#9a6a3a" stroke="#3b2410" strokeWidth="1.2" />
        <circle cx="3" cy="-28" r="1.5" fill="#222" />
        <rect x="2" y="-24" width="4" height="3.4" rx="1" fill="#fff" stroke="#3b2410" strokeWidth="0.8" />
        <rect x="-8" y="-37" width="16" height="4" rx="2" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
        <g transform={`translate(12 -14) rotate(${swing})`}>
          <text x="0" y="0" fontSize="16" textAnchor="middle" dominantBaseline="central">{tool}</text>
        </g>
      </g>
    </g>
  );
}

export function ForestryModal({ onClose }: { onClose(): void }) {
  const g = useGame();
  const cleared = g.save.forestry.cleared;
  const [pick, setPick] = useState<Forest | null>(null);
  const [p, setP] = useState<Play | null>(null);
  const pRef = useRef<Play | null>(null);
  const [res, setRes] = useState<{ isNew: boolean; reward: string | null } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const down = useRef(false);
  const [, setTick] = useState(0);
  const [sawOn, setSawOn] = useState(false);
  const sawRef = useRef(false);
  const mkRef = useRef({ x: 180, y: 190, tx: 180, ty: 190, face: 1, cool: 0, swing: 0, attacking: false });
  const hpRef = useRef<Record<number, number>>({});
  const warned = useRef<Set<number>>(new Set());
  const hitAt = useRef<Record<number, number>>({});
  const chips = useRef<Chip[]>([]);
  const doneMsg = useRef(false);
  const tickRef = useRef<(cur: Play, m: typeof mkRef.current, dt: number, now: number) => void>(() => {});
  const pickSaw = (v: boolean) => { sawRef.current = v; setSawOn(v); };

  // 切る作業の あいだ：モクタが あるいて、ちかい 木を じどうで 切る
  const cutWork = !!p && !p.over && CUT_WORKS.includes(p.steps[p.ci].work);
  const stepKey = p ? `${p.forest.id}:${p.ci}:${p.over ?? ''}` : '';
  useEffect(() => {
    if (!cutWork) return;
    const m = mkRef.current;
    Object.assign(m, { x: 180, y: 190, tx: 180, ty: 190, face: 1, cool: 0, swing: 0, attacking: false });
    hpRef.current = {}; warned.current = new Set(); hitAt.current = {}; chips.current = []; doneMsg.current = false;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const cur = pRef.current;
      if (cur && !cur.over) tickRef.current(cur, m, dt, now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); sawStop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cutWork, stepKey]);
  useEffect(() => () => sawStop(), []);

  const commit = (fn: (cur: Play) => Play) => {
    if (!pRef.current) return;
    const next = fn(pRef.current);
    pRef.current = next;
    setP(next);
  };
  const start = (f: Forest, hint: boolean) => {
    g.forestryPlay();
    const n = newPlay(f, hint);
    pRef.current = n;
    setP(n);
    setRes(null);
    setPick(null);
  };
  const miss = (cur: Play, msg: string): Play => {
    sfx('ng');
    if (cur.hint) return { ...cur, msg };
    const hearts = cur.hearts - 1;
    return { ...cur, msg: hearts <= 0 ? '木の 元気が なくなっちゃった…。もういちど やってみよう' : `${msg}（木の 元気 −1）`, hearts, over: hearts <= 0 ? 'dead' : cur.over };
  };
  const finish = (cur: Play): Play => {
    const r = g.forestryClear(cur.forest.id);
    setRes(r);
    return { ...cur, over: 'clear' };
  };

  const toXY = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * VW) / r.width, y: ((e.clientY - r.top) * VH) / r.height };
  };

  const onDown = (e: React.PointerEvent) => {
    const cur = pRef.current;
    if (!cur || cur.over) return;
    down.current = true;
    try { (e.currentTarget as Element).setPointerCapture?.(e.pointerId); } catch { /* ひろえない ポインタは むし */ }
    const { x, y } = toXY(e);
    if (!cur.tool) { commit((c) => ({ ...c, msg: '① 下の どうぐを えらんでね' })); return; }
    const cp = cur.steps[cur.ci];
    if (cur.tool !== cp.work) { commit((c) => miss(c, wrongMsg(c.tool as Work, c))); return; }
    if (cur.tool === 'cull' || cur.tool === 'thin' || cur.tool === 'fell') { const c = clampMk(x, y); mkRef.current.tx = c.x; mkRef.current.ty = c.y; return; }
    use(x, y);
  };
  const onMove = (e: React.PointerEvent) => {
    const cur = pRef.current;
    if (!down.current || !cur || cur.over) return;
    const { x, y } = toXY(e);
    if (cur.tool !== cur.steps[cur.ci].work) return;
    if (cur.tool === 'plant' || cur.tool === 'weed') use(x, y);
    else if (CUT_WORKS.includes(cur.tool as Work)) { const c = clampMk(x, y); mkRef.current.tx = c.x; mkRef.current.ty = c.y; }
  };
  const onUp = () => { down.current = false; };

  /** どうぐを つかう（x,y は 絵の中の 場所） */
  const use = (x: number, y: number) => {
    commit((cur) => {
      const tool = cur.tool;
      if (!tool) return cur;
      if (tool === 'plant') {
        const i = cur.trees.findIndex((t, k) => t === 'empty' && Math.hypot(slotPos(k).x - x, slotPos(k).y - y) < 22);
        if (i < 0) return cur;
        const trees = cur.trees.map((t, k) => (k === i ? 'alive' : t)) as TreeState[];
        const done = cur.done + 1;
        sfx('catch');
        return { ...cur, trees, done, msg: done >= cur.need ? 'ぜんぶ 植えたよ！ ▶ 年を進めよう' : cur.msg };
      }
      if (tool === 'weed') {
        const i = cur.weeds.findIndex((w, k) => w && Math.hypot(TUFTS[k].x - x, TUFTS[k].y - 10 - y) < 26);
        if (i < 0) return cur;
        const weeds = cur.weeds.map((w, k) => (k === i ? false : w));
        const done = cur.done + 1;
        sfx('water');
        return { ...cur, weeds, done, msg: done >= cur.need ? '草を ぜんぶ かったよ！ ▶ 年を進めよう' : cur.msg };
      }
      return cur;
    });
  };

  /** 1フレーム：あるく → ちかい木を 切る → 木くず・丸太を うごかす */
  const tickCut = (cur: Play, m: typeof mkRef.current, dt: number, now: number) => {
    const cp = cur.steps[cur.ci];
    const saw = sawRef.current;
    const dx = m.tx - m.x, dy = m.ty - m.y, d = Math.hypot(dx, dy);
    if (d > 2) {
      const st = Math.min(d, WALK * dt);
      m.x += (dx / d) * st; m.y += (dy / d) * st;
      if (Math.abs(dx) > 1) m.face = dx > 0 ? 1 : -1;
    }
    // いちばん ちかい 木
    let best = -1, bd = 1e9;
    if (cur.tool === cp.work) {
      cur.trees.forEach((t, k) => {
        if (t !== 'alive' && t !== 'bad') return;
        const s = slotPos(k);
        const dist = Math.hypot(s.x - m.x, s.y - m.y) + (cp.work === 'cull' && t !== 'bad' ? REACH : 0);   // 除伐は 形の悪い木を ゆうせん
        if (dist < bd) { bd = dist; best = k; }
      });
    }
    let attacking = false;
    if (best >= 0 && Math.hypot(slotPos(best).x - m.x, slotPos(best).y - m.y) < REACH) {
      const bad = cur.trees[best] === 'bad';
      if (m.x !== slotPos(best).x) m.face = slotPos(best).x >= m.x ? 1 : -1;
      if (cp.work === 'cull' && !bad) {
        if (d <= 2 && !warned.current.has(best)) { warned.current.add(best); commit((c) => miss(c, 'いい木は のこそう！ 形の悪い木だけ 切るよ')); }
      } else if ((cp.work === 'cull' || cp.work === 'thin') && cur.done >= cur.need) {
        if (d <= 2 && !doneMsg.current) { doneMsg.current = true; commit((c) => ({ ...c, msg: 'もう じゅうぶん！ これいじょう 切ると 木が 足りなくなるよ。▶ 年を進めよう' })); }
      } else {
        attacking = true;
        m.cool -= dt;
        if (m.cool <= 0) {
          m.cool = saw ? 0.2 : 0.6;
          const maxHp = TREE_HP[cp.work] ?? 3;
          const hp = (hpRef.current[best] ?? maxHp) - 1;
          hpRef.current[best] = hp;
          hitAt.current[best] = now;
          const s = slotPos(best);
          for (let i = 0; i < 3; i++) chips.current.push({ x: s.x + (m.face > 0 ? -4 : 4), y: s.y - 14, vx: (Math.random() - 0.5) * 70 - m.face * 20, vy: -40 - Math.random() * 40, life: 0.5, log: false, sx: 0, sy: 0 });
          if (!saw) sfx('chop');
          if (hp <= 0) {
            const nLogs = cp.work === 'fell' ? (saw ? 2 : 1) : 1;
            for (let i = 0; i < nLogs; i++) chips.current.push({ x: s.x, y: s.y - 18, vx: 0, vy: 0, life: 0.9 + i * 0.12, log: true, sx: s.x, sy: s.y - 18 });
            delete hpRef.current[best];
            m.cool = 0.25;
            fellTree(best, saw ? 2 : 1);
          }
        }
      }
    }
    // チェーンソーの エンジン音は 切っている あいだ だけ
    if (attacking && saw) { sawStart(); sawLevel(0.5 + Math.random() * 0.4); } else sawStop();
    m.attacking = attacking;
    m.swing = attacking ? Math.sin(now * (saw ? 0.06 : 0.018)) * (saw ? 6 : 38) - 10 : 0;
    // 木くず・丸太
    chips.current = chips.current.filter((c) => {
      c.life -= dt;
      if (c.log) {
        const k = Math.max(0, Math.min(1, 1 - c.life / 0.9));
        c.x = c.sx + (LOG_TO.x - c.sx) * k; c.y = c.sy + (LOG_TO.y - c.sy) * k - Math.sin(k * Math.PI) * 30;
        return c.life > 0;
      }
      c.vy += 260 * dt; c.x += c.vx * dt; c.y += c.vy * dt;
      return c.life > 0;
    });
    setTick((n) => (n + 1) % 1e6);
  };

  tickRef.current = tickCut;

  /** 木が 切りおわった：たおす */
  const fellTree = (idx: number, logN: number) => {
    const isFell = pRef.current?.steps[pRef.current.ci].work === 'fell';
    sfx(isFell ? 'timber' : 'chop');
    commit((cur) => {
      const cp = cur.steps[cur.ci];
      const trees = cur.trees.map((v, k) => (k === idx ? 'cut' : v)) as TreeState[];
      const done = cur.done + 1;
      const next: Play = { ...cur, trees, done, logs: cp.work === 'fell' ? cur.logs + logN : cur.logs };
      if (cp.work === 'fell') {
        if (done >= cur.need) { setTimeout(() => sfx('chest'), 1000); return finish({ ...next, msg: '' }); }
        return { ...next, msg: `あと ${cur.need - done}本！` };
      }
      return { ...next, msg: done >= cur.need ? `${cp.title}は おわり！ ▶ 年を進めよう` : `スパッ！ あと ${cur.need - done}本 切ろう` };
    });
  };

  const advance = () => {
    commit((cur) => {
      if (cur.over) return cur;
      const cp = cur.steps[cur.ci];
      if (cp.work === 'watch') { sfx('star'); return finish(cur); }
      if (cur.done < cur.need) {
        if (cp.work === 'plant' || cp.work === 'fell' || cur.hint) {
          sfx('ng');
          return { ...cur, msg: `まだ やることが のこってるよ（あと ${cur.need - cur.done}）。「${cp.title}」を すませよう` };
        }
        const why: Record<string, string> = {
          weed: '草を かりのこして、なえ木が 草に まけちゃった…',
          cull: '形の悪い木を のこして、ほかの木の 光が うばわれた…',
          thin: '間伐を さぼって、木が こみあって 細くなった…',
        };
        const hearts = cur.hearts - 1;
        sfx('ng');
        const base: Play = { ...cur, hearts, over: hearts <= 0 ? 'dead' : null, msg: hearts <= 0 ? '木の 元気が なくなっちゃった…。もういちど やってみよう' : `${why[cp.work]}（木の 元気 −1）` };
        if (base.over) return base;
        const cleaned = cp.work === 'cull' ? { ...base, trees: base.trees.map((t) => (t === 'bad' ? 'cut' : t)) as TreeState[] } : base;
        const nxt = enter(cleaned, cur.ci + 1);
        return { ...nxt, msg: `${why[cp.work]}（木の 元気 −1）\n${nxt.msg}` };
      }
      if (cur.ci + 1 >= cur.steps.length) return finish(cur);
      sfx('gift');
      return enter(cur, cur.ci + 1);
    });
  };

  const setTool = (t: Work) => commit((cur) => ({ ...cur, tool: t }));

  // ───────── えらぶ画面 ─────────
  if (!p) {
    return (
      <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
        <div className="panel max-h-[90vh] w-full max-w-[460px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[15px] font-black text-ink">🌲 モクタの もりづくり</div>
            <button className="rounded-full bg-gray-100 px-3 py-1 text-[12px] font-black text-ink" onClick={onClose}>とじる</button>
          </div>
          <div className="mb-2 flex items-center gap-2 rounded-2xl bg-lime-50 px-3 py-2">
            <CharSVG charKey="beaver" level={6} fillPct={100} size={52} label="モクタ" />
            <div className="text-[12px] font-bold leading-relaxed text-ink">
              どの森を 育てる？ 林業の しごとは<b className="text-emerald-700"> 植栽 → 下刈り → 除伐 → 間伐 → 主伐 </b>の じゅんばんだよ。年を すすめながら、どうぐで 手入れしよう！
            </div>
          </div>
          {!pick ? (
            <>
              {(['jinko', 'tennen'] as const).map((kind) => (
                <div key={kind} className="mb-2">
                  <div className="mb-1 text-[12px] font-black text-indigo-900/70">{kind === 'jinko' ? '🌱 人工の三大美林（植えて 育てる）' : '🌳 天然の三大美林（守り 育てる）'}</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {FORESTS.filter((f) => f.kind === kind).map((f) => (
                      <button key={f.id} className="relative rounded-2xl bg-white px-1 py-2 text-center shadow ring-1 ring-black/5 active:scale-95" onClick={() => setPick(f)}>
                        <svg viewBox="-30 -100 60 110" className="mx-auto h-14"><TreeSVG x={0} y={0} scale={0.9} species={f.species} bad={false} cut={false} /></svg>
                        <div className="text-[12px] font-black text-ink">{f.name}</div>
                        <div className="text-[10px] font-bold text-indigo-900/60">{f.pref}</div>
                        {cleared.includes(f.id) && <span className="absolute right-1 top-1 rounded-full bg-emerald-500 px-1.5 text-[10px] font-black text-white">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="rounded-2xl bg-amber-50 px-3 py-2 text-center text-[11px] font-bold text-ink">
                クリアした 森 {cleared.length} / {FORESTS.length}　森を クリアすると 家具が もらえるよ
              </div>
            </>
          ) : (
            <div>
              <div className="mb-2 rounded-2xl bg-white px-3 py-3 text-center shadow ring-1 ring-black/5">
                <svg viewBox="-30 -100 60 110" className="mx-auto h-20"><TreeSVG x={0} y={0} scale={0.95} species={pick.species} bad={false} cut={false} /></svg>
                <div className="text-[15px] font-black text-ink">{pick.name}（{pick.pref}・{SPECIES_LABEL[pick.species]}）</div>
                <div className="mt-1 text-[11.5px] font-bold leading-relaxed text-indigo-900/70">{pick.fact}</div>
                <div className="mt-1 text-[11px] font-black text-emerald-700">ごほうび：{ITEM_BY_ID[pick.reward].emoji} {ITEM_BY_ID[pick.reward].name}{cleared.includes(pick.id) ? '（もらったよ）' : ''}</div>
              </div>
              <button className="btn-main mb-1.5" onClick={() => start(pick, true)}>🌱 ヒントありで はじめる</button>
              <button className="btn mb-1.5 w-full" onClick={() => start(pick, false)}>💪 ヒントなしで ちょうせん（まちがえると 木が 弱るよ）</button>
              <button className="w-full rounded-2xl bg-gray-100 py-2 text-[12px] font-black text-ink" onClick={() => setPick(null)}>← 森を えらびなおす</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ───────── あそぶ画面 ─────────
  const cp = p.steps[p.ci];
  const jinko = p.forest.kind === 'jinko';
  const sc = treeScale(p.age, p.forest.kind);
  const need = (w: Work) => p.hint && cp.work === w && !p.over;
  const showSlots = jinko && cp.work === 'plant';
  const advLabel = cp.work === 'watch' ? '🎉 森を まもりきった！' : p.ci + 1 >= p.steps.length ? '🪓 主伐を すませよう' : '▶ 年を すすめる';

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[94vh] w-full max-w-[460px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <div className="text-[14px] font-black text-ink">🌲 {p.forest.name}の 森　<span className="text-[12px] text-emerald-700">林齢 {p.age}年</span></div>
          <div className="flex items-center gap-1.5">
            <span className="text-[13px]">{'❤️'.repeat(Math.max(0, p.hearts))}{'🤍'.repeat(Math.max(0, 3 - p.hearts))}</span>
            <button className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-black text-ink" onClick={() => { pRef.current = null; setP(null); setRes(null); }}>やめる</button>
          </div>
        </div>

        <AgeBar p={p} />

        <div className="mb-1 text-center text-[12px] font-black text-emerald-800">いまの 作業：{WORK_LABEL[cp.work].emoji} {cp.title}</div>

        <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} className="mb-2 w-full select-none rounded-2xl shadow ring-1 ring-black/10" style={{ touchAction: 'none' }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <defs>
            <linearGradient id="fo-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bae6fd" /><stop offset="1" stopColor="#ecfccb" /></linearGradient>
          </defs>
          <rect width={VW} height={VH} fill="url(#fo-sky)" />
          <path d="M0 110 Q60 70 130 100 T260 90 T360 100 V130 H0 Z" fill="#86c46a" opacity="0.7" />
          <rect y="118" width={VW} height={VH - 118} fill="#9ccc65" />
          <rect y="150" width={VW} height={VH - 150} fill="#a5d36a" />
          <path d="M0 150 Q90 142 180 150 T360 148" fill="none" stroke="#7fb046" strokeWidth="2" />
          {showSlots && p.trees.map((t, i) => t === 'empty' && (
            <ellipse key={`h${i}`} cx={slotPos(i).x} cy={slotPos(i).y} rx="14" ry="5" fill="#7c4a1d" stroke="#4a2c0f" strokeWidth="1.4" />
          ))}
          {p.weeds.map((w, k) => (w || cp.work === 'weed') && <Tuft key={`w${k}`} x={TUFTS[k].x} y={TUFTS[k].y} gone={!w} />)}
          {(() => {
            const nowT = performance.now();
            const items: { y: number; node: JSX.Element }[] = [];
            p.trees.forEach((t, i) => {
              if (t === 'empty') return;
              const s = slotPos(i);
              if (jinko && p.age <= 1 && t !== 'cut') { items.push({ y: s.y, node: <Sprout key={i} x={s.x} y={s.y} /> }); return; }
              const hit = nowT - (hitAt.current[i] ?? -1e9) < 140;
              items.push({ y: s.y, node: (
                <g key={i} className={hit ? 'fo-shake' : undefined}>
                  <TreeSVG x={s.x} y={s.y} scale={sc} species={p.forest.species} bad={t === 'bad'} cut={t === 'cut'} />
                </g>
              ) });
            });
            if (cutWork && p.tool === cp.work) {
              const m = mkRef.current;
              items.push({ y: m.y + 0.5, node: <MokutaSprite key="mk" x={m.x} y={m.y} face={m.face} swing={m.swing} saw={sawOn} work={cp.work} /> });
            }
            return items.sort((a, b) => a.y - b.y).map((it) => it.node);
          })()}
          {cutWork && p.trees.map((t, i) => {
            const maxHp = TREE_HP[cp.work] ?? 3;
            const hp = hpRef.current[i];
            if ((t !== 'alive' && t !== 'bad') || hp === undefined || hp >= maxHp) return null;
            const s = slotPos(i);
            const top = s.y - 88 * sc - 8;
            return (
              <g key={`hp${i}`}>
                <rect x={s.x - 15} y={top} width="30" height="6" rx="3" fill="#1f2937" opacity="0.8" />
                <rect x={s.x - 14} y={top + 1} width={28 * Math.max(0, hp / maxHp)} height="4" rx="2" fill="#ef4444" />
              </g>
            );
          })}
          {chips.current.map((c, i) => c.log
            ? <text key={`c${i}`} x={c.x} y={c.y} fontSize="14" textAnchor="middle">🪵</text>
            : <rect key={`c${i}`} x={c.x - 1.5} y={c.y - 1.5} width="3" height="3" fill="#d6a66b" stroke="#7c4a1d" strokeWidth="0.5" />)}
          {p.logs > 0 && (
            <g transform="translate(300 222)">
              <rect x="-26" y="-14" width="52" height="14" rx="7" fill="#c08457" stroke="#5b3a1d" strokeWidth="1.6" />
              <text x="0" y="-3" textAnchor="middle" fontSize="11" fontWeight="900" fill="#3b2410">🪵 ×{p.logs}</text>
            </g>
          )}
        </svg>

        <div className="mb-2 flex items-start gap-2 rounded-2xl bg-lime-50 px-2 py-2">
          <div className="shrink-0"><CharSVG charKey="beaver" level={6} fillPct={100} size={48} label="モクタ" /></div>
          <div className="whitespace-pre-line text-[12px] font-bold leading-relaxed text-ink">{p.msg || '…'}</div>
        </div>

        {!p.over && (
          <>
            {cutWork && p.tool === cp.work && (
              <div className="mb-2 grid grid-cols-2 gap-1">
                <button className={`rounded-xl py-1.5 text-[11px] font-black shadow ${!sawOn ? 'bg-emerald-600 text-white' : 'bg-white text-ink'}`} onClick={() => pickSaw(false)}>
                  {cp.work === 'fell' ? '🪓' : '🪚'} {HAND_NAME[cp.work]}（ゆっくり）
                </button>
                <button className={`rounded-xl py-1.5 text-[11px] font-black shadow ${sawOn ? 'bg-emerald-600 text-white' : 'bg-white text-ink'}`} onClick={() => pickSaw(true)}>
                  ⚙️ チェーンソー（はやい）
                </button>
              </div>
            )}
            <div className="mb-2 grid grid-cols-5 gap-1">
              {TOOLS.map((w) => (
                <button key={w} className={`rounded-xl px-0.5 py-2 text-center text-[10.5px] font-black leading-tight shadow ${p.tool === w ? 'bg-emerald-600 text-white' : 'bg-white text-ink'} ${need(w) ? 'animate-pulse ring-2 ring-amber-400' : ''}`} onClick={() => setTool(w)}>
                  <div className="text-[18px]">{WORK_LABEL[w].emoji}</div>
                  {WORK_LABEL[w].name}
                  <div className="text-[9px] opacity-70">{WORK_LABEL[w].tool}</div>
                </button>
              ))}
            </div>
            <button className="btn-main" onClick={advance}>{advLabel}</button>
          </>
        )}

        {p.over === 'dead' && (
          <div className="rounded-2xl bg-rose-50 px-3 py-3 text-center">
            <div className="mb-2 text-[13px] font-black text-rose-700">木の 元気が なくなっちゃった…</div>
            <button className="btn-main" onClick={() => start(p.forest, p.hint)}>もういちど！</button>
          </div>
        )}

        {p.over === 'clear' && (
          <div className="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
            <div className="bubble-pop mb-1 text-4xl">🎉</div>
            <div className="mb-1 text-[13px] font-black text-emerald-800">{clearLine(p.forest, p.age)}</div>
            {jinko && (
              <div className="mb-1 text-[11.5px] font-bold leading-relaxed text-ink">
                植栽(1年)→下刈り(〜5年)→除伐(10年ごろ)→間伐(20〜45年に3回)→主伐(50年〜)。{p.logs}本の 丸太が とれたよ🪵
              </div>
            )}
            {res?.reward ? (
              <div className="mb-2 text-[12px] font-black text-violet-700">🎁 ごほうび：{ITEM_BY_ID[res.reward].emoji} {ITEM_BY_ID[res.reward].name}（「かぐ」から おけるよ）</div>
            ) : (
              <div className="mb-2 text-[11px] font-bold text-indigo-900/60">この森の ごほうびは もう もらってるよ</div>
            )}
            <button className="btn-main mb-1.5" onClick={() => { pRef.current = null; setP(null); setRes(null); }}>ほかの 森も そだてる</button>
            <button className="w-full rounded-2xl bg-gray-100 py-2 text-[12px] font-black text-ink" onClick={onClose}>とじる</button>
          </div>
        )}
      </div>
    </div>
  );
}
