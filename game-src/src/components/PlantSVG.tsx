import type { ReactElement } from 'react';
import type { PlantDef } from '../lib/plants';
import type { Health } from '../lib/farm';

// はたけの しょくぶつの 絵。原点＝うねの まんなか（土の おもて）、上が マイナス。
// stage：0 たね／1 はつが／2 ほんば／3 はな／4 み
// health：日光なし＝せが たかく ほそく 黄いろ／ひりょうなし＝葉が 小さく すくない／水なし＝しおれる
// hour：くきが 太陽の ほうへ かたむく（正の光屈性）・はなが ひらく／とじる（傾性）

const INK = '#4c1d95';

function leafPath(len: number, wide: number): string {
  // 付け根(0,0)から +x へ のびる 葉
  return `M0 0 Q${len * 0.45} ${-wide} ${len} 0 Q${len * 0.45} ${wide} 0 0 Z`;
}

function flowerOpen(p: PlantDef, hour: number): boolean {
  const night = hour < 5 || hour >= 18;
  if (p.closes === 'noon') return hour >= 5 && hour < 12;
  if (p.closes === 'cold') return hour >= 9 && hour < 17;
  return !night;
}

function Flower({ color, open, r = 7 }: { color: string; open: boolean; r?: number }) {
  if (!open) {
    return <path d={`M0 2 Q${-r * 0.7} ${-r} 0 ${-r * 1.8} Q${r * 0.7} ${-r} 0 2 Z`} fill={color} stroke={INK} strokeWidth={1.2} />;
  }
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r * 0.75} rx={r * 0.55} ry={r * 0.8} fill={color} stroke={INK} strokeWidth={1} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.38} fill="#facc15" stroke={INK} strokeWidth={1} />
    </g>
  );
}

export function PlantSVG({ p, stage, health, hour, boxed }: { p: PlantDef; stage: number; health: Health; hour: number; boxed?: boolean }) {
  if (stage <= 0) {
    // たね：つちの 上に 見える つぶ（いも・きゅうこんは 土の中）
    if (p.type === 'tuber') return <ellipse cx="0" cy="3" rx="9" ry="5" fill={p.seed === 'sd_imo' ? '#be185d' : '#a16207'} stroke={INK} strokeWidth={1.4} />;
    if (p.type === 'bulb') return <path d="M-7 5 Q-8 -4 0 -9 Q8 -4 7 5 Z" fill="#c2410c" stroke={INK} strokeWidth={1.4} />;
    return (
      <g fill="#78350f">
        <circle cx="-6" cy="-3" r="2.2" /><circle cx="2" cy="-4" r="2.2" /><circle cx="7" cy="-2" r="2.2" />
      </g>
    );
  }

  const sun = health.sun;
  const fertN = health.fert;
  // 日光なし：ひょろ長く 黄いろ／ひりょうなし：小さい葉
  const hMul = sun ? 1 : 1.35;
  const leafMul = (fertN ? 1 : 0.62) * (sun ? 1 : 0.8);
  const leafColor = !sun ? '#d9f99d' : fertN ? '#16a34a' : '#4ade80';
  const stemColor = !sun ? '#bef264' : '#15803d';
  const stemW = sun ? 3.4 : 2;
  const droop = health.water ? 0 : 28;              // しおれ：葉が 下を むく
  const day = hour >= 5 && hour < 18;
  const tilt = boxed || !day ? 0 : Math.max(-8, Math.min(8, (hour - 12) * 1.4));
  const open = flowerOpen(p, hour);

  const H = [0, 14, 32, 46, 50][Math.min(stage, 4)] * hMul;
  const leaves: ReactElement[] = [];
  const top = -H;

  // 子葉
  const cotY = -Math.min(H, 16 * hMul);
  if (p.epigeal && p.cotyledons === 2 && stage <= 3) {
    const cl = (stage === 1 ? 12 : 9) * (stage >= 3 ? 0.8 : 1);
    leaves.push(
      <g key="cot" transform={`translate(0 ${cotY})`}>
        <path d={leafPath(cl, 6)} fill="#a3e635" stroke={INK} strokeWidth={1.2} transform={`rotate(${-12 + droop})`} />
        <path d={leafPath(cl, 6)} fill="#a3e635" stroke={INK} strokeWidth={1.2} transform={`scale(-1 1) rotate(${-12 + droop})`} />
      </g>,
    );
  }

  const isMono = p.type === 'monocot';
  const isBulb = p.type === 'bulb';

  if (stage === 1) {
    if (isMono) {
      leaves.push(<path key="c1" d={`M0 0 Q2 ${-H * 0.6} ${1 + droop * 0.2} ${-H}`} stroke="#65a30d" strokeWidth="3" fill="none" strokeLinecap="round" />);
    } else if (isBulb) {
      leaves.push(<path key="b1" d={`M-2 0 Q-3 ${-H * 0.6} 0 ${-H} Q3 ${-H * 0.6} 2 0 Z`} fill="#4ade80" stroke={INK} strokeWidth={1.2} />);
    } else if (!p.epigeal || p.type === 'tuber') {
      leaves.push(
        <g key="s1" transform={`translate(0 ${top})`}>
          <path d={leafPath(7 * leafMul, 4)} fill={leafColor} stroke={INK} strokeWidth={1.1} transform={`rotate(${-30 + droop})`} />
          <path d={leafPath(7 * leafMul, 4)} fill={leafColor} stroke={INK} strokeWidth={1.1} transform={`scale(-1 1) rotate(${-30 + droop})`} />
        </g>,
      );
    }
  }

  if (stage >= 2) {
    if (isMono) {
      // ほそながい 葉（すじが へいこう）
      const n = fertN ? 4 : 2;
      for (let i = 0; i < n; i++) {
        const side = i % 2 ? -1 : 1;
        const y = -H * (0.25 + i * 0.18);
        const len = (26 - i * 3) * leafMul;
        leaves.push(
          <path key={`m${i}`} d={`M0 ${y} q${side * len * 0.5} ${-len * 0.5 + droop * 0.6} ${side * len} ${-len * 0.1 + droop}`}
            stroke={leafColor} strokeWidth={4 * (fertN ? 1 : 0.7)} fill="none" strokeLinecap="round" />,
        );
      }
    } else if (isBulb) {
      leaves.push(
        <g key="bl">
          <path d={`M-2 0 Q-18 ${-H * 0.4} -10 ${-H * 0.8} Q-6 ${-H * 0.4} 0 -2 Z`} fill={leafColor} stroke={INK} strokeWidth={1.1} />
          <path d={`M2 0 Q18 ${-H * 0.45} 11 ${-H * 0.85} Q6 ${-H * 0.45} 0 -2 Z`} fill={leafColor} stroke={INK} strokeWidth={1.1} />
        </g>,
      );
    } else {
      // ほんば（そうしようるい・いも）：ふしごとに 左右
      const n = (fertN ? 3 : 2) + (stage >= 3 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        const side = i % 2 ? -1 : 1;
        const y = -H * (0.35 + i * (0.5 / n));
        const len = (18 - i * 1.5) * leafMul;
        leaves.push(
          <g key={`d${i}`} transform={`translate(0 ${y}) scale(${side} 1)`}>
            <path d={leafPath(len, len * 0.42)} fill={leafColor} stroke={INK} strokeWidth={1.1} transform={`rotate(${-25 + droop})`} />
          </g>,
        );
      }
    }
  }

  // はな・み
  let head: ReactElement | null = null;
  if (stage === 3) {
    if (p.pollen === 'wind' || p.seed === 'sd_ine') {
      head = p.seed === 'sd_ine'
        ? <path d={`M0 0 q6 -6 10 4`} stroke="#fde68a" strokeWidth="4" fill="none" strokeLinecap="round" />
        : <g>{[-5, 0, 5].map((x) => <path key={x} d={`M0 0 l${x} -9`} stroke="#fcd34d" strokeWidth="2.4" strokeLinecap="round" />)}</g>;
    } else {
      head = <Flower color={p.flower} open={open} r={p.seed === 'sd_himawari' ? 10 : 7} />;
    }
  }

  return (
    <g>
      {/* 土の中（いも・きゅうこん・ソラマメの 子葉） */}
      {p.type === 'tuber' && <ellipse cx="0" cy="4" rx={stage >= 4 ? 12 : 8} ry={stage >= 4 ? 6 : 4} fill={p.seed === 'sd_imo' ? '#be185d' : '#a16207'} stroke={INK} strokeWidth={1.2} opacity="0.85" />}
      {isBulb && <path d="M-6 6 Q-7 -2 0 -5 Q7 -2 6 6 Z" fill="#c2410c" stroke={INK} strokeWidth={1.2} opacity="0.85" />}
      {!p.epigeal && p.type === 'dicot' && <ellipse cx="4" cy="4" rx="6" ry="3.5" fill="#65a30d" stroke={INK} strokeWidth={1} opacity="0.9" />}
      <g transform={`rotate(${tilt})`}>
        {!isMono && !isBulb && (
          <path d={`M0 0 Q${droop * 0.12} ${-H * 0.5} ${droop * 0.2} ${-H}`} stroke={stemColor} strokeWidth={stemW} fill="none" strokeLinecap="round" />
        )}
        {isMono && stage >= 2 && <path d={`M0 0 L0 ${-H}`} stroke={stemColor} strokeWidth={stemW} strokeLinecap="round" />}
        {leaves}
        {head && <g transform={`translate(${droop * 0.2} ${top})`}>{head}</g>}
        {stage >= 4 && (
          <g className="crop-bob">
            <text x="0" y={top + 4} fontSize="30" textAnchor="middle">{p.emoji}</text>
            <text x="18" y={top - 16} fontSize="14" className="twinkle">✨</text>
          </g>
        )}
      </g>
      {stage === 3 && open && p.pollen === 'insect' && (
        <text x="14" y={top - 8} fontSize="13" className="crop-bob">🐝</text>
      )}
      {stage === 3 && p.pollen === 'wind' && (
        <text x="-20" y={top} fontSize="12" className="crop-bob">🍃</text>
      )}
    </g>
  );
}
