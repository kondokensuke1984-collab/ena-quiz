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

const DRAW: Record<string, () => React.ReactNode> = {
  bd_house: House,
  bd_light: Lighthouse,
  bd_school: School,
  bd_wheel: Wheel,
  bd_observ: Observatory,
  bd_moon: MoonStand,
};

/** 建物の置き場所（割合）。さんばしは地面の絵として IslandStage で描く */
export const BUILDING_SPOTS: Record<string, { x: number; y: number }> = {
  bd_house: { x: 0.2, y: 0.42 },
  bd_light: { x: 0.87, y: 0.43 },
  bd_school: { x: 0.64, y: 0.36 },
  bd_wheel: { x: 0.12, y: 0.66 },
  bd_observ: { x: 0.44, y: 0.32 },
  bd_moon: { x: 0.80, y: 0.80 },
};

/** がっこうの前（教科キャラが集まる場所） */
export const SCHOOL_FRONT = { x: 0.64, y: 0.44 };

function BuildingSVGBase({ id }: { id: string }) {
  const D = DRAW[id];
  return D ? <>{D()}</> : null;
}

export const BuildingSVG = React.memo(BuildingSVGBase);
