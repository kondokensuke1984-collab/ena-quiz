import React from 'react';

// 島に置ける家具。絵文字ではなくSVGにしてあるのは、影と奥行き（Yソート）を統一するため。

type Draw = (k: string) => React.ReactNode;

const S = { stroke: '#4c1d95', strokeWidth: 2.2, strokeLinejoin: 'round' as const };

const DRAWINGS: Record<string, Draw> = {
  fn_rug: () => (
    <g>
      <ellipse cx="0" cy="0" rx="34" ry="16" fill="#fca5a5" {...S} />
      <ellipse cx="0" cy="0" rx="22" ry="10" fill="#fecaca" />
      <ellipse cx="0" cy="0" rx="10" ry="4.5" fill="#fca5a5" />
    </g>
  ),
  fn_lamp: () => (
    <g>
      <ellipse cx="0" cy="2" rx="12" ry="5" fill="rgba(0,0,0,0.2)" />
      <rect x="-2.5" y="-30" width="5" height="30" rx="2.5" fill="#a16207" {...S} />
      <path d="M-13 -30 L13 -30 L9 -46 L-9 -46 Z" fill="#fca5a5" {...S} />
      <circle cx="0" cy="-38" r="3" fill="#fde68a" />
    </g>
  ),
  fn_tree: () => (
    <g>
      <ellipse cx="0" cy="2" rx="14" ry="5" fill="rgba(0,0,0,0.2)" />
      <path d="M-4 0 C-6 -20 -3 -40 2 -54 L7 -53 C2 -38 1 -19 3 0 Z" fill="#a16207" {...S} />
      <g fill="#4ade80" {...S}>
        <ellipse cx="-16" cy="-56" rx="18" ry="7" transform="rotate(-18 -16 -56)" />
        <ellipse cx="18" cy="-58" rx="18" ry="7" transform="rotate(16 18 -58)" />
        <ellipse cx="-8" cy="-66" rx="15" ry="6.5" transform="rotate(-48 -8 -66)" />
        <ellipse cx="12" cy="-68" rx="15" ry="6.5" transform="rotate(46 12 -68)" />
      </g>
      <circle cx="2" cy="-54" r="4.5" fill="#f59e0b" {...S} />
    </g>
  ),
  fn_bench: () => (
    <g>
      <ellipse cx="0" cy="2" rx="24" ry="6" fill="rgba(0,0,0,0.2)" />
      <rect x="-22" y="-16" width="44" height="7" rx="3" fill="#d97706" {...S} />
      <rect x="-22" y="-28" width="44" height="6" rx="3" fill="#d97706" {...S} />
      <rect x="-19" y="-9" width="5" height="9" rx="2" fill="#92400e" {...S} />
      <rect x="14" y="-9" width="5" height="9" rx="2" fill="#92400e" {...S} />
    </g>
  ),
  fn_flower: () => (
    <g>
      <ellipse cx="0" cy="2" rx="20" ry="7" fill="rgba(0,0,0,0.2)" />
      <path d="M-20 0 L-16 -12 L16 -12 L20 0 Z" fill="#a16207" {...S} />
      {[-10, 0, 10].map((x, i) => (
        <g key={x} transform={`translate(${x},${-18 - (i % 2) * 4})`}>
          {[0, 72, 144, 216, 288].map((d) => (
            <ellipse key={d} cx="0" cy="-4" rx="2.6" ry="4" fill={['#fb7185', '#fbbf24', '#f472b6'][i]} transform={`rotate(${d})`} />
          ))}
          <circle cx="0" cy="0" r="2" fill="#fef3c7" />
        </g>
      ))}
    </g>
  ),
  fn_tent: () => (
    <g>
      <ellipse cx="0" cy="2" rx="28" ry="7" fill="rgba(0,0,0,0.2)" />
      <path d="M0 -42 L26 0 L-26 0 Z" fill="#60a5fa" {...S} />
      <path d="M0 -42 L10 0 L-10 0 Z" fill="#1e3a8a" {...S} />
      <path d="M-4 0 L0 -18 L4 0 Z" fill="#bfdbfe" />
    </g>
  ),
  fn_fire: () => (
    <g>
      <ellipse cx="0" cy="2" rx="18" ry="6" fill="rgba(0,0,0,0.2)" />
      <path d="M-16 0 L16 -6 M-16 -6 L16 0" stroke="#92400e" strokeWidth="5" strokeLinecap="round" />
      <path d="M0 -34 C8 -24 12 -16 8 -8 C5 -2 -5 -2 -8 -8 C-12 -16 -8 -24 0 -34 Z" fill="#fb923c" {...S} />
      <path d="M0 -22 C4 -16 5 -12 3 -8 C1 -5 -1 -5 -3 -8 C-5 -12 -4 -16 0 -22 Z" fill="#fde047" />
    </g>
  ),
  fn_swing: () => (
    <g>
      <ellipse cx="0" cy="2" rx="26" ry="6" fill="rgba(0,0,0,0.2)" />
      <path d="M-22 0 L-8 -40 L8 -40 L22 0" fill="none" stroke="#92400e" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M-8 -40 L8 -40" stroke="#92400e" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M-7 -40 L-7 -16 M7 -40 L7 -16" stroke="#a16207" strokeWidth="2.4" />
      <rect x="-11" y="-17" width="22" height="5" rx="2.5" fill="#f59e0b" {...S} />
    </g>
  ),
  fn_sign: () => (
    <g>
      <ellipse cx="0" cy="2" rx="12" ry="5" fill="rgba(0,0,0,0.2)" />
      <rect x="-2.5" y="-26" width="5" height="26" rx="2" fill="#92400e" {...S} />
      <rect x="-20" y="-40" width="40" height="18" rx="4" fill="#fde68a" {...S} />
      <path d="M-13 -33 h26 M-13 -28 h18" stroke="#92400e" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  ),
  fn_mill: () => (
    <g>
      <ellipse cx="0" cy="2" rx="22" ry="7" fill="rgba(0,0,0,0.2)" />
      <path d="M-15 0 L-10 -40 L10 -40 L15 0 Z" fill="#fef3c7" {...S} />
      <rect x="-5" y="-14" width="10" height="14" rx="2" fill="#92400e" {...S} />
      <g style={{ animation: 'mill-spin 6s linear infinite', transformOrigin: '0px -44px' }}>
        {[0, 90, 180, 270].map((d) => (
          <path key={d} d="M0 -44 L5 -62 L-5 -62 Z" fill="#f87171" {...S} transform={`rotate(${d} 0 -44)`} />
        ))}
      </g>
      <circle cx="0" cy="-44" r="3.5" fill="#fbbf24" {...S} />
    </g>
  ),
};

function FurnitureSVGBase({ id, scale = 1 }: { id: string; scale?: number }) {
  const draw = DRAWINGS[id];
  if (!draw) return null;
  return <g transform={`scale(${scale})`}>{draw(id)}</g>;
}

export const FurnitureSVG = React.memo(FurnitureSVGBase);
export const HAS_DRAWING = (id: string) => id in DRAWINGS;
