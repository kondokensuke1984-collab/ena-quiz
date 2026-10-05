import React from 'react';

// けんせつで建つ建物。原点＝建物の足もと中央（Yソートの基準点）。
// 家具（FurnitureSVG）と同じ線の太さ・色づかいにそろえてある。

const S = { stroke: '#4c1d95', strokeWidth: 2.6, strokeLinejoin: 'round' as const };
const shadow = (rx: number) => <ellipse cx="0" cy="3" rx={rx} ry={rx * 0.22} fill="rgba(0,0,0,0.18)" />;

function House() {
  return (
    <g>
      {shadow(62)}
      <rect x="-50" y="-70" width="100" height="70" rx="4" fill="#fef3c7" {...S} />
      <path d="M-62 -66 L0 -118 L62 -66 Z" fill="#f87171" {...S} />
      <rect x="-14" y="-38" width="28" height="38" rx="3" fill="#a16207" {...S} />
      <circle cx="8" cy="-19" r="2.4" fill="#fde68a" />
      <rect x="-42" y="-58" width="22" height="18" rx="2" fill="#bae6fd" {...S} />
      <rect x="20" y="-58" width="22" height="18" rx="2" fill="#bae6fd" {...S} />
      <rect x="26" y="-112" width="14" height="26" fill="#fca5a5" {...S} />
    </g>
  );
}

function Lighthouse() {
  return (
    <g>
      {shadow(40)}
      <path d="M-30 0 L-18 -140 L18 -140 L30 0 Z" fill="#fff" {...S} />
      <path d="M-27 -35 L27 -35 L25 -60 L-25 -60 Z" fill="#ef4444" />
      <path d="M-22 -90 L22 -90 L20 -112 L-20 -112 Z" fill="#ef4444" />
      <path d="M-30 0 L-18 -140 L18 -140 L30 0 Z" fill="none" {...S} />
      <rect x="-22" y="-162" width="44" height="22" rx="3" fill="#fde68a" {...S} />
      <path d="M-26 -162 L0 -184 L26 -162 Z" fill="#ef4444" {...S} />
      {/* くるくる回る光 */}
      <g transform="translate(0 -151)">
        <path d="M0 0 L160 -26 L160 26 Z" fill="rgba(253,230,138,0.45)">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
        </path>
      </g>
      <rect x="-8" y="-24" width="16" height="24" rx="2" fill="#a16207" {...S} />
    </g>
  );
}

function School() {
  return (
    <g>
      {shadow(86)}
      <rect x="-80" y="-72" width="160" height="72" rx="4" fill="#fde68a" {...S} />
      <rect x="-26" y="-112" width="52" height="46" fill="#fcd34d" {...S} />
      <path d="M-34 -110 L0 -138 L34 -110 Z" fill="#60a5fa" {...S} />
      <circle cx="0" cy="-90" r="12" fill="#fff" {...S} />
      <path d="M0 -90 L0 -98 M0 -90 L6 -87" stroke="#4c1d95" strokeWidth="2.2" strokeLinecap="round" />
      {[-62, -38, 26, 50].map((x) => (
        <rect key={x} x={x} y="-58" width="18" height="18" rx="2" fill="#bae6fd" {...S} />
      ))}
      <rect x="-13" y="-36" width="26" height="36" rx="2" fill="#a16207" {...S} />
      <path d="M40 -140 L40 -112" stroke="#4c1d95" strokeWidth="2.4" />
      <path d="M40 -140 L62 -133 L40 -126 Z" fill="#f87171" {...S} />
    </g>
  );
}

function Wheel() {
  const R = 74;
  const cars = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
  const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa'];
  return (
    <g>
      {shadow(56)}
      <path d="M-46 0 L0 -96 L46 0" fill="none" {...S} strokeWidth={5} />
      <g transform="translate(0 -96)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="24s" repeatCount="indefinite" />
          <circle cx="0" cy="0" r={R} fill="none" stroke="#a78bfa" strokeWidth="6" />
          {cars.map((a, i) => (
            <line key={i} x1="0" y1="0" x2={Math.cos(a) * R} y2={Math.sin(a) * R} stroke="#c4b5fd" strokeWidth="3" />
          ))}
          {cars.map((a, i) => (
            <circle key={'c' + i} cx={Math.cos(a) * R} cy={Math.sin(a) * R} r="11" fill={colors[i % 4]} {...S} />
          ))}
        </g>
        <circle cx="0" cy="0" r="9" fill="#fde68a" {...S} />
      </g>
    </g>
  );
}

function Observatory() {
  return (
    <g>
      {shadow(58)}
      <rect x="-48" y="-56" width="96" height="56" rx="4" fill="#e0e7ff" {...S} />
      <path d="M-54 -56 A54 54 0 0 1 54 -56 Z" fill="#c7d2fe" {...S} />
      <path d="M-8 -108 L8 -108 L8 -58 L-8 -58 Z" fill="#312e81" />
      <g transform="rotate(-28 0 -86)">
        <rect x="-7" y="-128" width="14" height="44" rx="4" fill="#6366f1" {...S} />
      </g>
      <rect x="-12" y="-32" width="24" height="32" rx="3" fill="#a16207" {...S} />
      <circle cx="-30" cy="-30" r="7" fill="#fde68a" {...S} />
      <circle cx="30" cy="-30" r="7" fill="#fde68a" {...S} />
    </g>
  );
}

function MoonStand() {
  return (
    <g>
      {shadow(46)}
      <rect x="-40" y="-26" width="80" height="12" rx="3" fill="#b45309" {...S} />
      <path d="M-32 -14 L-32 0 M32 -14 L32 0" stroke="#4c1d95" strokeWidth="5" strokeLinecap="round" />
      <path d="M-18 -26 L18 -26 L12 -36 L-12 -36 Z" fill="#fef3c7" {...S} />
      {[[-8, -42], [8, -42], [0, -54], [-16, -30], [16, -30]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="7" fill="#fff" {...S} strokeWidth={1.8} />
      ))}
      {[-44, -52, -36].map((x, i) => (
        <path key={i} d={`M${x} -12 Q ${x - 6} -60 ${x + 6 - i * 4} -96`} fill="none" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
      ))}
      <circle cx="46" cy="-110" r="20" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
    </g>
  );
}

// ── 11月（となりの しまに たつ。単元が きまったら 名前と絵を さしかえる）──
function ImoCart() {
  return (
    <g>
      {shadow(48)}
      <rect x="-40" y="-40" width="80" height="34" rx="4" fill="#b45309" {...S} />
      <circle cx="-24" cy="-4" r="10" fill="#78350f" {...S} />
      <circle cx="24" cy="-4" r="10" fill="#78350f" {...S} />
      <rect x="-34" y="-52" width="68" height="14" rx="3" fill="#57534e" {...S} />
      {[-20, -4, 12].map((x) => <ellipse key={x} cx={x} cy="-54" rx="7" ry="4" fill="#9f1239" {...S} strokeWidth={1.6} />)}
      <path d="M-44 -66 L44 -66 L38 -86 L-38 -86 Z" fill="#f97316" {...S} />
      <path d="M-30 -86 L-30 -66 M-10 -86 L-10 -66 M10 -86 L10 -66 M30 -86 L30 -66" stroke="#fff7ed" strokeWidth="5" />
      <path d="M-34 -66 L-34 -40 M34 -66 L34 -40" stroke="#4c1d95" strokeWidth="3" />
      <circle cx="40" cy="-58" r="7" fill="#fde047" {...S} strokeWidth={1.6} />
      <text x="0" y="-18" fontSize="14" fontWeight="900" textAnchor="middle" fill="#fff7ed">やきいも</text>
      <path d="M-6 -66 q-4 -10 2 -18 M6 -66 q4 -12 -2 -20" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

function Arbor() {
  return (
    <g>
      {shadow(60)}
      <rect x="-46" y="-14" width="92" height="12" rx="3" fill="#d6d3d1" {...S} />
      <path d="M-38 -14 L-38 -70 M38 -14 L38 -70" stroke="#92400e" strokeWidth="7" strokeLinecap="round" />
      <path d="M-30 -30 L30 -30" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
      <path d="M-62 -68 L0 -108 L62 -68 Z" fill="#b91c1c" {...S} />
      <path d="M-62 -68 Q0 -60 62 -68" fill="none" {...S} />
      {[[-66, -100, '#ef4444'], [66, -94, '#f97316'], [-54, -40, '#f59e0b'], [58, -36, '#dc2626']].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="16" fill={c as string} {...S} strokeWidth={1.8} />
          <circle cx="-8" cy="6" r="10" fill={c as string} />
        </g>
      ))}
    </g>
  );
}

function SpaceBase() {
  return (
    <g>
      {shadow(64)}
      <rect x="-56" y="-46" width="76" height="46" rx="4" fill="#e2e8f0" {...S} />
      <path d="M-56 -46 a38 30 0 0 1 76 0 Z" fill="#cbd5e1" {...S} />
      <rect x="-44" y="-30" width="18" height="14" rx="2" fill="#7dd3fc" {...S} />
      <rect x="-18" y="-30" width="18" height="14" rx="2" fill="#7dd3fc" {...S} />
      <rect x="-30" y="-14" width="16" height="14" rx="2" fill="#475569" {...S} />
      <text x="-18" y="-54" fontSize="13" fontWeight="900" textAnchor="middle" fill="#4c1d95">うちゅうきち</text>
      {/* パラボラアンテナ */}
      <path d="M40 0 L40 -40" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
      <g transform="translate(40 -46) rotate(-30)">
        <path d="M-22 0 Q0 22 22 0 Z" fill="#f8fafc" {...S} />
        <path d="M0 6 L0 -14" stroke="#4c1d95" strokeWidth="2.4" />
        <circle cx="0" cy="-16" r="3.5" fill="#ef4444" {...S} strokeWidth={1.6} />
      </g>
    </g>
  );
}

function Planetarium() {
  return (
    <g>
      {shadow(62)}
      <rect x="-56" y="-30" width="112" height="30" rx="4" fill="#ede9fe" {...S} />
      <path d="M-50 -30 a50 46 0 0 1 100 0 Z" fill="#f8fafc" {...S} />
      <path d="M-34 -62 Q0 -50 34 -62" fill="none" stroke="#c4b5fd" strokeWidth="2" />
      <rect x="-12" y="-24" width="24" height="24" rx="3" fill="#4338ca" {...S} />
      {[[-38, -18], [30, -18]].map(([x, y], i) => <rect key={i} x={x} y={y} width="10" height="10" rx="2" fill="#a5b4fc" {...S} strokeWidth={1.8} />)}
      {/* どせいの かんばん */}
      <g transform="translate(0 -88)">
        <circle r="13" fill="#fde68a" {...S} />
        <ellipse rx="24" ry="6" fill="none" stroke="#f59e0b" strokeWidth="3.4" transform="rotate(-18)" />
      </g>
      <circle cx="-30" cy="-58" r="2" fill="#fde047" className="twinkle" />
      <circle cx="34" cy="-50" r="2" fill="#fde047" className="twinkle" style={{ animationDelay: '-0.8s' }} />
    </g>
  );
}

function Rocket() {
  return (
    <g>
      {shadow(52)}
      {/* はっしゃだい */}
      <rect x="-44" y="-10" width="88" height="10" rx="2" fill="#64748b" {...S} />
      <path d="M30 -10 L30 -150 M44 -10 L44 -150" stroke="#f59e0b" strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M30 ${-20 - i * 22} L44 ${-34 - i * 22}`} stroke="#f59e0b" strokeWidth="3" />)}
      <path d="M44 -120 L18 -120" stroke="#f59e0b" strokeWidth="4" />
      {/* はね */}
      <path d="M-14 -20 L-34 -4 L-34 -34 L-14 -56 Z" fill="#ef4444" {...S} />
      <path d="M14 -20 L34 -4 L34 -34 L14 -56 Z" fill="#ef4444" {...S} />
      {/* どう */}
      <path d="M-16 -14 L-16 -120 Q0 -176 16 -120 L16 -14 Z" fill="#f8fafc" {...S} />
      <path d="M-15 -128 Q0 -176 15 -128 Z" fill="#ef4444" {...S} />
      <circle cx="0" cy="-96" r="9" fill="#7dd3fc" {...S} />
      <circle cx="-3" cy="-99" r="3" fill="#e0f2fe" />
      <rect x="-16" y="-58" width="32" height="8" fill="#1d4ed8" />
      <path d="M-10 -14 L-12 -4 L12 -4 L10 -14 Z" fill="#475569" {...S} />
    </g>
  );
}

const DRAW: Record<string, () => React.ReactNode> = {
  bd_base: SpaceBase,
  bd_planet: Planetarium,
  bd_rocket: Rocket,
  bd_imo: ImoCart,
  bd_arbor: Arbor,
  bd_house: House,
  bd_light: Lighthouse,
  bd_school: School,
  bd_wheel: Wheel,
  bd_observ: Observatory,
  bd_moon: MoonStand,
};

/** 建物の置き場所（割合）。さんばしは地面の絵として IslandStage で描く */
/** area＝建つ場所（なし＝main）。glow＝夜に光る ところ（足もとから dy、半径 r） */
export interface BuildingSpot { x: number; y: number; area?: 'main' | 'east'; glow?: { dy: number; r: number } }
export const BUILDING_SPOTS: Record<string, BuildingSpot> = {
  bd_house: { x: 0.2, y: 0.42 },
  bd_light: { x: 0.87, y: 0.43 },
  bd_school: { x: 0.64, y: 0.36 },
  bd_wheel: { x: 0.12, y: 0.66 },
  bd_observ: { x: 0.44, y: 0.32 },
  bd_moon: { x: 0.80, y: 0.80 },
  // となりの しま（east）。池（0.70,0.75）と 左の はしを よける
  bd_imo: { x: 0.36, y: 0.46, area: 'east', glow: { dy: -0.08, r: 55 } },
  bd_arbor: { x: 0.64, y: 0.42, area: 'east' },
  // うちゅうセット（east の した半分と みぎ。池・はしを よける）
  bd_base: { x: 0.26, y: 0.74, area: 'east', glow: { dy: -0.04, r: 50 } },
  bd_planet: { x: 0.48, y: 0.8, area: 'east', glow: { dy: -0.03, r: 55 } },
  bd_rocket: { x: 0.85, y: 0.5, area: 'east', glow: { dy: -0.13, r: 40 } },
};
/** その場所に建つ 建物か */
export function spotInArea(id: string, area: string): boolean {
  const b = BUILDING_SPOTS[id];
  return !!b && (b.area ?? 'main') === area;
}

/** がっこうの前（教科キャラが集まる場所） */
export const SCHOOL_FRONT = { x: 0.64, y: 0.44 };

function BuildingSVGBase({ id }: { id: string }) {
  const D = DRAW[id];
  return D ? <>{D()}</> : null;
}

export const BuildingSVG = React.memo(BuildingSVGBase);
