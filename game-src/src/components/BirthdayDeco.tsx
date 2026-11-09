import { BIRTHDAY_BALLOONS_EAST, BIRTHDAY_BALLOONS_MAIN } from '../lib/events';

// おたんじょうびの 日の かざり。2D の 地面（SVG）と、2D・3D 共通の 重ねた 画面（HTML）。

const COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

/** ふうせんの たば。位置は 外の g、ゆれは 内の g（CSS が transform を うわがきするため） */
function Balloons({ x, y, i }: { x: number; y: number; i: number }) {
  const b: [number, number, string][] = [[-20, -96, COLORS[i % 6]], [0, -116, COLORS[(i + 2) % 6]], [20, -96, COLORS[(i + 4) % 6]]];
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="2" rx="12" ry="4" fill="rgba(0,0,0,0.18)" />
      <g className="bd-float" style={{ animationDelay: `${i * -0.8}s`, transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        {b.map(([bx, by], k) => <path key={k} d={`M0 0 Q${bx / 2} ${by / 2 + 10} ${bx} ${by + 22}`} stroke="#78716c" strokeWidth="1.5" fill="none" />)}
        {b.map(([bx, by, c], k) => (
          <g key={'b' + k}>
            <ellipse cx={bx} cy={by} rx="17" ry="21" fill={c} stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
            <ellipse cx={bx - 6} cy={by - 8} rx="4" ry="6" fill="#fff" opacity="0.55" />
          </g>
        ))}
      </g>
    </g>
  );
}

/** はたの ガーランド。2本の ぼうの あいだに つるす */
function Garland({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const n = Math.max(5, Math.round(Math.hypot(x2 - x1, y2 - y1) / 26));
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + 32;
  const at = (t: number) => [
    (1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t ** 2 * x2,
    (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t ** 2 * y2,
  ];
  return (
    <g>
      <rect x={x1 - 3} y={y1 - 4} width="6" height="70" rx="3" fill="#92400e" />
      <rect x={x2 - 3} y={y2 - 4} width="6" height="70" rx="3" fill="#92400e" />
      <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} stroke="#57534e" strokeWidth="2" fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = at((i + 0.5) / n);
        return <path key={i} d={`M${x - 9} ${y} h18 l-9 18 z`} fill={COLORS[i % 6]} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />;
      })}
    </g>
  );
}

function BigCake({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(0.7)`}>
      <ellipse cx="0" cy="4" rx="74" ry="20" fill="rgba(0,0,0,0.2)" />
      <path d="M-66 -34 V0 C-66 18 66 18 66 0 V-34 Z" fill="#fde68a" stroke="#92400e" strokeWidth="2.5" />
      <path d="M-44 -74 V-40 C-44 -28 44 -28 44 -40 V-74 Z" fill="#fbcfe8" stroke="#9d174d" strokeWidth="2.5" />
      <ellipse cx="0" cy="-34" rx="66" ry="17" fill="#fff" stroke="#92400e" strokeWidth="2" opacity="0.92" />
      <path d="M-44 -74 V-40 C-44 -28 44 -28 44 -40 V-74 Z" fill="#fbcfe8" stroke="#9d174d" strokeWidth="2.5" />
      <ellipse cx="0" cy="-74" rx="44" ry="13" fill="#fff" stroke="#9d174d" strokeWidth="2" />
      {[-30, -15, 0, 15, 30].map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 3} y={-106 + Math.abs(cx) / 6} width="6" height="28" rx="2" fill={COLORS[i]} />
          <path className="lantern-flicker" d={`M${cx} ${-122 + Math.abs(cx) / 6} q8 8 0 15 q-8 -7 0 -15`} fill="#f59e0b" />
        </g>
      ))}
      {[-48, -24, 0, 24, 48].map((cx) => <circle key={cx} cx={cx} cy={-22 + Math.abs(cx) / 6} r="6" fill="#ef4444" />)}
    </g>
  );
}

export function BirthdayMain() {
  return (
    <g pointerEvents="none">
      <Garland x1={300} y1={395} x2={455} y2={385} />
      <Garland x1={585} y1={385} x2={745} y2={395} />
      <g transform="translate(520 345)">
        <rect x="-150" y="20" width="7" height="72" fill="#92400e" />
        <rect x="143" y="20" width="7" height="72" fill="#92400e" />
        <rect x="-195" y="-10" width="390" height="46" rx="12" fill="#fff7ed" stroke="#ea580c" strokeWidth="3" />
        <text x="0" y="22" fontSize="20" fontWeight="900" textAnchor="middle" fill="#c2410c">ゆうせい おたんじょうび おめでとう</text>
      </g>
      <BigCake x={520} y={472} />
      {BIRTHDAY_BALLOONS_MAIN.map(([x, y], i) => <Balloons key={i} x={x} y={y} i={i} />)}
    </g>
  );
}

export function BirthdayEast() {
  return (
    <g pointerEvents="none">
      <Garland x1={420} y1={560} x2={590} y2={555} />
      {BIRTHDAY_BALLOONS_EAST.map(([x, y], i) => <Balloons key={i} x={x} y={y} i={i + 3} />)}
    </g>
  );
}

const BURSTS: [number, number, string, number][] = [
  [20, 18, '#f472b6', 0], [72, 14, '#fde047', 0.9], [48, 28, '#60a5fa', 1.7], [86, 32, '#4ade80', 0.5], [10, 36, '#c084fc', 1.3],
];

/** 島の うえに かさねる 画面：かみふぶきは いつも、はなびは 夕方と 夜だけ（2D・3D どちらでも） */
export function BirthdayOverlay({ night }: { night: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {Array.from({ length: 16 }, (_, i) => (
        <span key={i} className="bd-fall" style={{ left: `${(i * 37 + 4) % 100}%`, background: COLORS[i % 6], animationDelay: `${(i * -0.47).toFixed(2)}s` }} />
      ))}
      {night && BURSTS.map(([l, t, c, d], i) => (
        <div key={i} className="absolute" style={{ left: `${l}%`, top: `${t}%` }}>
          {Array.from({ length: 14 }, (_, k) => (
            <span key={k} className="bd-spark" style={{ background: c, boxShadow: `0 0 8px ${c}`, animationDelay: `${d}s`, ['--a' as string]: `${(k * 360) / 14}deg` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** ひらいたときの おいわい */
export function BirthdayModal({ name, mine, onClose }: { name: string; mine: boolean; onClose(): void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {Array.from({ length: 36 }, (_, i) => (
          <span key={i} className="dt-confetti" style={{ left: `${(i * 29) % 100}%`, background: COLORS[i % 6], animationDelay: `${(i % 9) * 0.12}s` }} />
        ))}
      </div>
      <div className="panel relative w-full max-w-[400px] text-center" onClick={(e) => e.stopPropagation()}>
        <div className="text-[56px] leading-none">🎂</div>
        <div className="mt-2 text-[18px] font-black text-ink">
          {mine ? `${name}、おたんじょうび おめでとう！` : `きょうは ${name}の おたんじょうび！`}
        </div>
        <p className="mt-2 text-[12px] font-bold leading-relaxed text-indigo-900/70">
          {mine
            ? <>しまの みんなで かざりつけを したよ。<br />きょうは べんきょう しなくても はいれるよ。<br />📮 ポストに プレゼントの おてがみが あるよ。</>
            : <>きょうは しまじゅう おまつりだよ！<br />{name}に「おめでとう」って いってあげてね。</>}
        </p>
        <button className="btn-main mt-3" onClick={onClose}>{mine ? 'ありがとう！' : 'おめでとう！'}</button>
      </div>
    </div>
  );
}
