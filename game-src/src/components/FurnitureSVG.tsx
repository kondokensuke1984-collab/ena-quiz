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
  // ── おうちの中の かぐ ──
  in_bed: () => (
    <g>
      <ellipse cx="0" cy="2" rx="34" ry="7" fill="rgba(0,0,0,0.18)" />
      <rect x="-32" y="-26" width="64" height="24" rx="4" fill="#93c5fd" {...S} />
      <rect x="-34" y="-42" width="10" height="42" rx="3" fill="#b45309" {...S} />
      <rect x="24" y="-32" width="10" height="32" rx="3" fill="#b45309" {...S} />
      <rect x="-24" y="-32" width="18" height="10" rx="4" fill="#fff" {...S} />
      <path d="M-4 -26 L24 -26 L24 -8 L-4 -8 Z" fill="#fca5a5" {...S} />
    </g>
  ),
  in_desk: () => (
    <g>
      <ellipse cx="0" cy="2" rx="28" ry="6" fill="rgba(0,0,0,0.18)" />
      <rect x="-28" y="-30" width="56" height="8" rx="2" fill="#d97706" {...S} />
      <path d="M-24 -22 L-24 0 M24 -22 L24 0" stroke="#4c1d95" strokeWidth="4" strokeLinecap="round" />
      <rect x="-18" y="-40" width="14" height="10" fill="#60a5fa" {...S} />
      <rect x="-2" y="-44" width="12" height="14" fill="#f87171" {...S} />
      <circle cx="18" cy="-38" r="7" fill="#fde047" {...S} />
    </g>
  ),
  in_shelf: () => (
    <g>
      <ellipse cx="0" cy="2" rx="22" ry="5" fill="rgba(0,0,0,0.18)" />
      <rect x="-20" y="-56" width="40" height="56" rx="3" fill="#b45309" {...S} />
      <path d="M-20 -38 L20 -38 M-20 -20 L20 -20" stroke="#4c1d95" strokeWidth="2" />
      {[[-16, -54, '#f87171'], [-9, -54, '#60a5fa'], [-2, -54, '#34d399'], [6, -36, '#fbbf24'], [-14, -36, '#a78bfa'], [-6, -18, '#f472b6'], [4, -18, '#60a5fa']].map(([x, y, c], i) => (
        <rect key={i} x={x as number} y={y as number} width="6" height="15" fill={c as string} />
      ))}
    </g>
  ),
  in_bear: () => (
    <g>
      <ellipse cx="0" cy="2" rx="14" ry="4" fill="rgba(0,0,0,0.18)" />
      <circle cx="-8" cy="-26" r="5" fill="#d97706" {...S} />
      <circle cx="8" cy="-26" r="5" fill="#d97706" {...S} />
      <ellipse cx="0" cy="-8" rx="12" ry="10" fill="#d97706" {...S} />
      <circle cx="0" cy="-20" r="10" fill="#f59e0b" {...S} />
      <circle cx="-3" cy="-21" r="1.5" fill="#4c1d95" />
      <circle cx="3" cy="-21" r="1.5" fill="#4c1d95" />
      <path d="M-6 -12 L6 -12 L0 -8 Z" fill="#f43f5e" />
    </g>
  ),
  in_plant: () => (
    <g>
      <ellipse cx="0" cy="2" rx="12" ry="4" fill="rgba(0,0,0,0.18)" />
      <path d="M-10 -14 L10 -14 L7 0 L-7 0 Z" fill="#fb923c" {...S} />
      <g fill="#4ade80" {...S}>
        <ellipse cx="-7" cy="-24" rx="5" ry="11" transform="rotate(-25 -7 -24)" />
        <ellipse cx="7" cy="-24" rx="5" ry="11" transform="rotate(25 7 -24)" />
        <ellipse cx="0" cy="-30" rx="5" ry="13" />
      </g>
    </g>
  ),
  in_carpet: () => (
    <g>
      <ellipse cx="0" cy="0" rx="40" ry="14" fill="#c4b5fd" {...S} />
      <ellipse cx="0" cy="0" rx="28" ry="9" fill="#ddd6fe" />
      <ellipse cx="0" cy="0" rx="14" ry="4.5" fill="#c4b5fd" />
    </g>
  ),

  // ── まよいの森の ごほうび ──
  fn_forest: () => (
    <g>
      <ellipse cx="0" cy="2" rx="18" ry="5" fill="rgba(0,0,0,0.2)" />
      <rect x="-14" y="-10" width="28" height="10" rx="2" fill="#78350f" {...S} />
      <path d="M0 -58 L14 -34 L7 -34 L17 -18 L-17 -18 L-7 -34 L-14 -34 Z" fill="#22c55e" {...S} />
      <rect x="-3" y="-18" width="6" height="8" fill="#92400e" />
      <path d="M0 -66 l2.5 5 5.5 0.5 -4 3.5 1.2 5.5 -5.2 -3 -5.2 3 1.2 -5.5 -4 -3.5 5.5 -0.5 z" fill="#fde047" {...S} strokeWidth={1.4} />
    </g>
  ),

  // ── 名探偵あんりの ごほうび ──
  fn_detective: () => (
    <g>
      <ellipse cx="0" cy="2" rx="26" ry="5" fill="rgba(0,0,0,0.2)" />
      <rect x="-3" y="-30" width="6" height="30" fill="#78350f" {...S} strokeWidth={1.4} />
      <rect x="-28" y="-62" width="56" height="34" rx="5" fill="#1e1b4b" {...S} />
      <text x="0" y="-48" fontSize="9" fontWeight="900" textAnchor="middle" fill="#fde68a">たんてい</text>
      <text x="0" y="-36" fontSize="9" fontWeight="900" textAnchor="middle" fill="#fde68a">じむしょ</text>
      <g transform="translate(20 -66)">
        <circle r="8" fill="#e0f2fe" fillOpacity="0.85" stroke="#b45309" strokeWidth="2.6" />
        <path d="M5 6 L11 13" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </g>
  ),

  // ── しょくぶつ ずかんの ごほうび ──
  fn_planter: () => (
    <g>
      <ellipse cx="0" cy="2" rx="26" ry="5" fill="rgba(0,0,0,0.2)" />
      <rect x="-26" y="-22" width="52" height="5" rx="2" fill="#a16207" {...S} />
      <rect x="-22" y="-17" width="4" height="17" fill="#92400e" />
      <rect x="18" y="-17" width="4" height="17" fill="#92400e" />
      {[-15, 0, 15].map((x, i) => (
        <g key={x} transform={`translate(${x} -22)`}>
          <path d="M-7 0 L-5 -12 L5 -12 L7 0 Z" fill="#c2410c" {...S} strokeWidth={1.4} />
          <path d={i === 1 ? 'M0 -12 L0 -26' : 'M0 -12 L0 -20'} stroke="#15803d" strokeWidth="2.4" />
          <ellipse cx="-4" cy={i === 1 ? -22 : -18} rx="4" ry="2.4" fill="#22c55e" />
          <ellipse cx="4" cy={i === 1 ? -24 : -19} rx="4" ry="2.4" fill="#22c55e" />
          {i === 1 && <circle cx="0" cy="-28" r="3.5" fill="#f472b6" {...S} strokeWidth={1.2} />}
        </g>
      ))}
    </g>
  ),
  fn_greenhouse: () => (
    <g>
      <ellipse cx="0" cy="2" rx="34" ry="6" fill="rgba(0,0,0,0.2)" />
      <path d="M-32 0 L-32 -30 Q0 -58 32 -30 L32 0 Z" fill="#e0f2fe" fillOpacity="0.8" {...S} />
      <path d="M-16 0 L-16 -44 M0 0 L0 -48 M16 0 L16 -44 M-32 -18 L32 -18" stroke="#94a3b8" strokeWidth="1.6" fill="none" />
      <path d="M-26 -4 q2 -12 6 -14 M-8 -4 q-2 -10 2 -16 M10 -4 q3 -10 8 -12" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="-20" cy="-18" r="3" fill="#f43f5e" />
      <circle cx="18" cy="-16" r="3" fill="#facc15" />
      <path d="M-24 -34 l10 -8" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </g>
  ),

  // ── つりの ずかんの ごほうび ──
  fn_fishsign: () => (
    <g>
      <ellipse cx="0" cy="2" rx="18" ry="5" fill="rgba(0,0,0,0.2)" />
      <rect x="-3" y="-34" width="6" height="34" fill="#92400e" {...S} />
      <path d="M-24 -52 Q-4 -66 14 -52 L26 -60 L26 -40 L14 -48 Q-4 -34 -24 -48 Z" fill="#38bdf8" {...S} />
      <circle cx="-14" cy="-51" r="2.5" fill="#1e1b4b" />
    </g>
  ),
  fn_aquarium: () => (
    <g>
      <ellipse cx="0" cy="2" rx="28" ry="6" fill="rgba(0,0,0,0.2)" />
      <rect x="-26" y="-8" width="52" height="8" rx="2" fill="#78350f" {...S} />
      <rect x="-24" y="-44" width="48" height="36" rx="4" fill="#7dd3fc" fillOpacity="0.85" {...S} />
      <path d="M-20 -10 q4 -10 0 -18 M18 -10 q-4 -8 0 -14" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className="crop-bob">
        <path d="M-8 -28 q8 -8 14 0 q-6 8 -14 0 z M6 -28 l6 -5 l0 10 z" fill="#fb923c" />
        <circle cx="-4" cy="-29" r="1.4" fill="#1e1b4b" />
      </g>
      <circle cx="10" cy="-36" r="2" fill="#fff" opacity="0.8" />
    </g>
  ),

  // ── 星座ずかん・おだんごお供えの ごほうび ──
  fn_starsign: () => (
    <g>
      <ellipse cx="0" cy="2" rx="18" ry="5" fill="rgba(0,0,0,0.2)" />
      <rect x="-3" y="-34" width="6" height="34" fill="#92400e" {...S} />
      <rect x="-22" y="-58" width="44" height="26" rx="4" fill="#312e81" {...S} />
      <path d="M0 -55 l3 7 7 0.7 -5.3 4.6 1.6 7.2 -6.3 -4 -6.3 4 1.6 -7.2 -5.3 -4.6 7 -0.7 z" fill="#fde047" {...S} strokeWidth={1.4} />
    </g>
  ),
  fn_stardome: () => (
    <g>
      <ellipse cx="0" cy="2" rx="30" ry="7" fill="rgba(0,0,0,0.2)" />
      <rect x="-28" y="-10" width="56" height="10" rx="2" fill="#78350f" {...S} />
      <path d="M-26 -10 a26 26 0 0 1 52 0 Z" fill="#312e81" fillOpacity="0.9" {...S} />
      <circle cx="-10" cy="-24" r="1.6" fill="#fff" />
      <circle cx="8" cy="-30" r="1.6" fill="#fff" />
      <circle cx="2" cy="-18" r="1.2" fill="#fff" opacity="0.8" />
      <circle cx="14" cy="-14" r="1.2" fill="#fff" opacity="0.8" />
    </g>
  ),
  fn_moonrabbit: () => (
    <g>
      <ellipse cx="0" cy="2" rx="16" ry="5" fill="rgba(0,0,0,0.2)" />
      <ellipse cx="0" cy="-4" rx="10" ry="4" fill="#a16207" {...S} />
      <ellipse cx="0" cy="-16" rx="11" ry="12" fill="#fff" {...S} />
      <ellipse cx="-5" cy="-34" rx="3" ry="10" fill="#fff" {...S} transform="rotate(-12 -5 -34)" />
      <ellipse cx="5" cy="-34" rx="3" ry="10" fill="#fff" {...S} transform="rotate(12 5 -34)" />
      <circle cx="-4" cy="-17" r="1.4" fill="#1e1b4b" />
      <circle cx="4" cy="-17" r="1.4" fill="#1e1b4b" />
      <ellipse cx="0" cy="-13" rx="2" ry="1.3" fill="#f9a8d4" />
    </g>
  ),

  // ── まいにちスタンプの ごほうび ──
  fn_trophy: () => (
    <g>
      <ellipse cx="0" cy="2" rx="16" ry="5" fill="rgba(0,0,0,0.2)" />
      <rect x="-12" y="-10" width="24" height="10" rx="2" fill="#7c3aed" {...S} />
      <rect x="-3" y="-20" width="6" height="10" fill="#fbbf24" {...S} />
      <path d="M-13 -44 L13 -44 Q13 -20 0 -20 Q-13 -20 -13 -44 Z" fill="#fbbf24" {...S} />
      <path d="M-13 -40 Q-22 -40 -20 -32 Q-18 -26 -11 -28 M13 -40 Q22 -40 20 -32 Q18 -26 11 -28" fill="none" {...S} />
      <path d="M0 -38 l2 5 5 0 -4 3 2 5 -5 -3 -5 3 2 -5 -4 -3 5 0 z" fill="#fff7ed" />
    </g>
  ),
  fn_fountain: () => (
    <g>
      <ellipse cx="0" cy="2" rx="30" ry="8" fill="rgba(0,0,0,0.2)" />
      <ellipse cx="0" cy="-4" rx="28" ry="9" fill="#cbd5e1" {...S} />
      <ellipse cx="0" cy="-6" rx="22" ry="6" fill="#7dd3fc" />
      <rect x="-4" y="-30" width="8" height="24" fill="#e2e8f0" {...S} />
      <ellipse cx="0" cy="-30" rx="12" ry="4" fill="#cbd5e1" {...S} />
      <g style={{ animation: 'fountain-jet 1.2s ease-in-out infinite', transformOrigin: '0px -30px' }}>
        <path d="M0 -32 Q-8 -52 -16 -34 M0 -32 Q8 -52 16 -34 M0 -32 L0 -54" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
      </g>
    </g>
  ),

  // ── 月ごとの スタンプの ごほうび（10〜12月）──
  fn_lantern: () => (
    <g>
      <ellipse cx="0" cy="2" rx="16" ry="5" fill="rgba(0,0,0,0.2)" />
      <ellipse cx="0" cy="-13" rx="17" ry="14" fill="#fb923c" {...S} />
      <path d="M-6 -26 Q0 -30 6 -26 M-9 -24 Q-10 -13 -8 -1 M9 -24 Q10 -13 8 -1" fill="none" stroke="#c2410c" strokeWidth="1.6" />
      <rect x="-2" y="-33" width="4" height="7" rx="1.5" fill="#65a30d" {...S} />
      <path d="M-9 -17 l4 -5 4 5 z M1 -17 l4 -5 4 5 z" fill="#fde047" />
      <path d="M-9 -9 Q0 -3 9 -9 L6 -7 L3 -9 L0 -6 L-3 -9 L-6 -7 Z" fill="#fde047" />
    </g>
  ),
  fn_scarecrow: () => (
    <g>
      <ellipse cx="0" cy="2" rx="12" ry="4" fill="rgba(0,0,0,0.2)" />
      <rect x="-2" y="-50" width="4" height="52" fill="#a16207" {...S} />
      <rect x="-22" y="-36" width="44" height="4" rx="2" fill="#a16207" {...S} />
      <path d="M-12 -34 L12 -34 L9 -14 L-9 -14 Z" fill="#60a5fa" {...S} />
      <path d="M-22 -34 l-4 5 M-22 -34 l-5 0 M22 -34 l4 5 M22 -34 l5 0" stroke="#eab308" strokeWidth="2" />
      <circle cx="0" cy="-44" r="8" fill="#fef3c7" {...S} />
      <path d="M-13 -48 L13 -48 L7 -52 Q0 -60 -7 -52 Z" fill="#fbbf24" {...S} />
      <circle cx="-3" cy="-44" r="1.3" fill="#1e1b4b" />
      <circle cx="3" cy="-44" r="1.3" fill="#1e1b4b" />
      <path d="M-3 -40 Q0 -38 3 -40" fill="none" stroke="#1e1b4b" strokeWidth="1.2" />
    </g>
  ),
  fn_maple: () => (
    <g>
      <ellipse cx="0" cy="2" rx="18" ry="6" fill="rgba(0,0,0,0.2)" />
      <path d="M-4 0 L-3 -30 L3 -30 L4 0 Z" fill="#92400e" {...S} />
      <g {...S}>
        <circle cx="0" cy="-44" r="18" fill="#ef4444" />
        <circle cx="-15" cy="-34" r="12" fill="#f97316" />
        <circle cx="15" cy="-34" r="12" fill="#dc2626" />
        <circle cx="0" cy="-58" r="10" fill="#f59e0b" />
      </g>
      <path d="M-24 -4 l3 -3 1 4 z M20 -2 l3 -3 1 4 z" fill="#ef4444" />
    </g>
  ),
  fn_mushroom: () => (
    <g>
      <ellipse cx="0" cy="2" rx="16" ry="5" fill="rgba(0,0,0,0.2)" />
      <path d="M-7 0 Q-8 -12 -6 -18 L6 -18 Q8 -12 7 0 Z" fill="#fef3c7" {...S} />
      <path d="M-20 -17 Q-18 -38 0 -38 Q18 -38 20 -17 Z" fill="#ef4444" {...S} />
      <circle cx="-9" cy="-27" r="3.5" fill="#fff" />
      <circle cx="6" cy="-31" r="3" fill="#fff" />
      <circle cx="11" cy="-22" r="2.5" fill="#fff" />
    </g>
  ),
  fn_snowman: () => (
    <g>
      <ellipse cx="0" cy="2" rx="16" ry="5" fill="rgba(0,0,0,0.2)" />
      <circle cx="0" cy="-12" r="14" fill="#f8fafc" {...S} />
      <circle cx="0" cy="-34" r="10" fill="#f8fafc" {...S} />
      <path d="M-9 -41 L9 -41 L6 -52 L-6 -52 Z" fill="#dc2626" {...S} />
      <circle cx="-3.5" cy="-36" r="1.4" fill="#1e1b4b" />
      <circle cx="3.5" cy="-36" r="1.4" fill="#1e1b4b" />
      <path d="M0 -33 l6 1.5 -6 1.5 z" fill="#fb923c" />
      <path d="M-10 -26 Q0 -21 10 -26" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="0" cy="-15" r="1.6" fill="#1e1b4b" />
      <circle cx="0" cy="-8" r="1.6" fill="#1e1b4b" />
    </g>
  ),
  fn_xtree: () => (
    <g>
      <ellipse cx="0" cy="2" rx="18" ry="6" fill="rgba(0,0,0,0.2)" />
      <rect x="-4" y="-8" width="8" height="9" fill="#92400e" {...S} />
      <path d="M0 -62 L20 -8 L-20 -8 Z" fill="#16a34a" {...S} />
      <path d="M-11 -30 Q0 -24 11 -32 M-15 -18 Q0 -12 16 -20" fill="none" stroke="#fde047" strokeWidth="2" />
      <circle cx="-6" cy="-40" r="2.4" fill="#ef4444" />
      <circle cx="7" cy="-24" r="2.4" fill="#60a5fa" />
      <circle cx="-9" cy="-14" r="2.4" fill="#f472b6" />
      <path d="M0 -70 l2 5 5 0 -4 3 2 5 -5 -3 -5 3 2 -5 -4 -3 5 0 z" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
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
