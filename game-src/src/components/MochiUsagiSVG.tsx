import React from 'react';

// 🐰 もちつきうさぎ（月に すんでいる。なかよく なると ちきゅうに ついてくる）。
// 原点＝足もと。たかさ やく 110px（なかまの 絵と おなじくらい）。
const S = { stroke: '#4c1d95', strokeWidth: 2.6, strokeLinejoin: 'round' as const };

/** うさぎ。pound＝きねを もって ぺったん（うすの よこで）。そうでなければ きねを かついで あるく */
function MochiUsagiBase({ pound = false }: { pound?: boolean }) {
  return (
    <g>
      <ellipse cx="0" cy="2" rx="30" ry="7" fill="rgba(0,0,0,0.18)" />
      {/* きね（ぺったんの ときは うでごと うごく） */}
      <g className={pound ? 'mochi-pound' : undefined} style={{ transformOrigin: '0% 100%', transformBox: 'fill-box' }}>
        <path d={pound ? 'M14 -46 L44 -78' : 'M10 -50 L30 -96'} stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
        <rect x={pound ? 34 : 18} y={pound ? -98 : -116} width="30" height="16" rx="6" fill="#d97706" {...S}
          transform={pound ? 'rotate(-40 49 -90)' : 'rotate(-20 33 -108)'} />
      </g>
      {/* からだ（はっぴ） */}
      <path d="M-24 -6 Q-28 -50 0 -54 Q28 -50 24 -6 Z" fill="#fff" {...S} />
      <path d="M-20 -46 L0 -20 L20 -46 L22 -10 L-22 -10 Z" fill="#f43f5e" {...S} />
      <path d="M-10 -40 L0 -26 L10 -40" fill="none" stroke="#fde68a" strokeWidth="3" />
      <ellipse cx="-12" cy="-2" rx="10" ry="6" fill="#fff" {...S} />
      <ellipse cx="12" cy="-2" rx="10" ry="6" fill="#fff" {...S} />
      {/* みみ */}
      <path d="M-14 -84 Q-24 -130 -10 -134 Q2 -128 -4 -86 Z" fill="#fff" {...S} />
      <path d="M-11 -90 Q-17 -122 -9 -125 Q-3 -120 -7 -92 Z" fill="#fda4af" />
      <path d="M6 -86 Q8 -132 22 -128 Q30 -120 14 -84 Z" fill="#fff" {...S} />
      <path d="M9 -92 Q12 -122 20 -120 Q23 -114 13 -90 Z" fill="#fda4af" />
      {/* かお */}
      <ellipse cx="0" cy="-70" rx="26" ry="22" fill="#fff" {...S} />
      <circle cx="-9" cy="-73" r="4" fill="#e11d48" />
      <circle cx="9" cy="-73" r="4" fill="#e11d48" />
      <circle cx="-8" cy="-74.5" r="1.4" fill="#fff" />
      <circle cx="10" cy="-74.5" r="1.4" fill="#fff" />
      <ellipse cx="-17" cy="-63" rx="5" ry="3" fill="#fecdd3" />
      <ellipse cx="17" cy="-63" rx="5" ry="3" fill="#fecdd3" />
      <path d="M-3 -65 L0 -62 L3 -65" fill="none" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" />
      <path d="M0 -62 Q-4 -57 -7 -59 M0 -62 Q4 -57 7 -59" fill="none" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" />
      {/* はちまき */}
      <path d="M-25 -80 Q0 -90 25 -80" fill="none" stroke="#f43f5e" strokeWidth="5" />
    </g>
  );
}
export const MochiUsagi = React.memo(MochiUsagiBase);

/** うすと おもち（月に おいたまま） */
function UsuBase() {
  return (
    <g>
      <ellipse cx="0" cy="2" rx="38" ry="8" fill="rgba(0,0,0,0.18)" />
      <path d="M-30 -2 L-26 -36 L26 -36 L30 -2 Z" fill="#b45309" {...S} />
      <path d="M-26 -22 L26 -22" stroke="#78350f" strokeWidth="2.5" />
      <ellipse cx="0" cy="-36" rx="30" ry="9" fill="#92400e" {...S} />
      <ellipse cx="0" cy="-40" rx="20" ry="8" fill="#fff" stroke="#cbd5e1" strokeWidth="2" className="mochi-squish" />
    </g>
  );
}
export const Usu = React.memo(UsuBase);
