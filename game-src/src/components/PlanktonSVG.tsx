// 🔬 プランクトンの え。どれも よこ（+x）むき・ながさ 100 くらい（-50〜50）で かく。
// けんびきょうでは 大きさに あわせて scale する。

import type { ReactElement } from 'react';

const LINE = { strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

const ART: Record<string, () => ReactElement> = {
  mikazukimo: () => (
    <g {...LINE}>
      <path d="M-50 4 Q0 -46 50 4 Q0 -22 -50 4 Z" fill="#4ade80" stroke="#166534" strokeWidth="2.5" />
      <path d="M-34 -4 Q0 -32 34 -4" fill="none" stroke="#15803d" strokeWidth="5" opacity="0.7" />
      <circle cx="-42" cy="0" r="3" fill="#dcfce7" />
      <circle cx="42" cy="0" r="3" fill="#dcfce7" />
      <circle cx="0" cy="-20" r="3.5" fill="#bbf7d0" stroke="#166534" strokeWidth="1" />
    </g>
  ),
  ikadamo: () => (
    <g {...LINE}>
      {[-27, -9, 9, 27].map((y) => (
        <ellipse key={y} cx="0" cy={y} rx="36" ry="9" fill="#86efac" stroke="#166534" strokeWidth="2" />
      ))}
      <path d="M-34 -30 q-14 -8 -18 -20 M34 -30 q14 -8 18 -20 M-34 30 q-14 8 -18 20 M34 30 q14 8 18 20" fill="none" stroke="#166534" strokeWidth="2" />
      {[-27, -9, 9, 27].map((y) => <circle key={y} cx="0" cy={y} r="3" fill="#15803d" />)}
    </g>
  ),
  keiso: () => (
    <g {...LINE}>
      <path d="M-50 0 Q-25 -18 0 -18 Q25 -18 50 0 Q25 18 0 18 Q-25 18 -50 0 Z" fill="#fcd34d" fillOpacity="0.85" stroke="#92400e" strokeWidth="2.5" />
      {[-36, -26, -16, -6, 6, 16, 26, 36].map((x) => (
        <line key={x} x1={x} y1={-15 + Math.abs(x) * 0.2} x2={x} y2={15 - Math.abs(x) * 0.2} stroke="#b45309" strokeWidth="1.3" />
      ))}
      <line x1="-44" y1="0" x2="44" y2="0" stroke="#92400e" strokeWidth="1.5" />
    </g>
  ),
  mijinko: () => (
    <g {...LINE}>
      {/* しょっかく（ぴょこぴょこ） */}
      <g>
        <path d="M22 -18 Q30 -44 10 -50 M22 -18 Q44 -38 40 -54" fill="none" stroke="#475569" strokeWidth="2.5" />
        <animateTransform attributeName="transform" type="rotate" values="0 22 -18;-14 22 -18;0 22 -18" dur="0.9s" repeatCount="indefinite" />
      </g>
      <path d="M26 -16 Q10 -34 -20 -26 Q-46 -14 -44 12 L-50 28 L-38 18 Q-20 34 6 28 Q30 20 32 0 Z" fill="#e0f2fe" fillOpacity="0.75" stroke="#334155" strokeWidth="2.5" />
      <path d="M-26 -8 Q-10 -2 -6 14" fill="none" stroke="#fb923c" strokeWidth="5" opacity="0.8" />
      <ellipse cx="-12" cy="-4" rx="6" ry="4" fill="#f87171" opacity="0.8" />
      <circle cx="24" cy="-4" r="5.5" fill="#1e1b4b" />
      <circle cx="-26" cy="12" r="3" fill="#86efac" />
      <circle cx="-18" cy="16" r="3" fill="#86efac" />
    </g>
  ),
  zourimushi: () => (
    <g {...LINE}>
      <g stroke="#64748b" strokeWidth="1.2">
        {Array.from({ length: 22 }, (_, i) => {
          const a = (i / 22) * Math.PI * 2;
          const x = Math.cos(a) * 48, y = Math.sin(a) * 20;
          return <line key={i} x1={x} y1={y} x2={x * 1.12} y2={y * 1.3} />;
        })}
        <animateTransform attributeName="transform" type="scale" values="1 1;1.02 1.06;1 1" dur="0.5s" repeatCount="indefinite" />
      </g>
      <path d="M-48 0 Q-46 -20 -10 -20 Q30 -22 48 -6 Q52 6 40 14 Q10 18 0 10 Q-10 22 -30 18 Q-48 14 -48 0 Z" fill="#fef9c3" fillOpacity="0.85" stroke="#854d0e" strokeWidth="2.2" />
      <path d="M-4 10 Q4 2 16 6" fill="none" stroke="#854d0e" strokeWidth="1.5" />
      <ellipse cx="-6" cy="-4" rx="9" ry="6" fill="#fde68a" stroke="#a16207" strokeWidth="1" />
      <circle cx="-30" cy="-2" r="4" fill="#bae6fd" stroke="#0369a1" strokeWidth="1" />
      <circle cx="26" cy="-6" r="4" fill="#bae6fd" stroke="#0369a1" strokeWidth="1" />
    </g>
  ),
  wamushi: () => (
    <g {...LINE}>
      {/* あしの ほう（ひだり）から あたまの ほう（みぎ）へ */}
      <path d="M-50 0 L-38 -3 L-38 3 Z" fill="#fecaca" stroke="#9f1239" strokeWidth="1.8" />
      <path d="M-38 -6 Q-10 -18 20 -14 L30 -18 L30 18 L20 14 Q-10 18 -38 6 Z" fill="#fee2e2" fillOpacity="0.85" stroke="#9f1239" strokeWidth="2.2" />
      <ellipse cx="0" cy="0" rx="10" ry="6" fill="#fda4af" opacity="0.8" />
      {[-12, 12].map((y) => (
        <g key={y}>
          <circle cx="36" cy={y} r="10" fill="#fff1f2" stroke="#9f1239" strokeWidth="1.8" />
          <g>
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return <line key={i} x1={36 + Math.cos(a) * 10} y1={y + Math.sin(a) * 10} x2={36 + Math.cos(a) * 15} y2={y + Math.sin(a) * 15} stroke="#be123c" strokeWidth="1.3" />;
            })}
            <animateTransform attributeName="transform" type="rotate" values={`0 36 ${y};360 36 ${y}`} dur="1.2s" repeatCount="indefinite" />
          </g>
        </g>
      ))}
    </g>
  ),
  amoeba: () => (
    <g {...LINE}>
      <path fill="#e9d5ff" fillOpacity="0.85" stroke="#6b21a8" strokeWidth="2.2">
        <animate
          attributeName="d"
          dur="4s"
          repeatCount="indefinite"
          values="M-40 -6 Q-44 -34 -12 -30 Q10 -46 26 -26 Q50 -20 44 4 Q52 30 20 30 Q0 44 -20 30 Q-50 24 -40 -6 Z;
                  M-46 4 Q-30 -30 -4 -24 Q20 -30 34 -40 Q46 -10 36 10 Q40 36 10 26 Q-10 40 -28 24 Q-56 20 -46 4 Z;
                  M-40 -6 Q-44 -34 -12 -30 Q10 -46 26 -26 Q50 -20 44 4 Q52 30 20 30 Q0 44 -20 30 Q-50 24 -40 -6 Z"
        />
      </path>
      <circle cx="0" cy="0" r="8" fill="#c084fc" stroke="#6b21a8" strokeWidth="1.2" />
      <circle cx="-18" cy="10" r="3" fill="#f5f3ff" stroke="#7e22ce" strokeWidth="1" />
      <circle cx="16" cy="-8" r="2.5" fill="#f5f3ff" stroke="#7e22ce" strokeWidth="1" />
    </g>
  ),
};

/** 1ぴき。size＝ながさ（px）、rot＝むき（度） */
export function PlanktonArt({ id, size, rot = 0 }: { id: string; size: number; rot?: number }) {
  const Draw = ART[id];
  if (!Draw) return null;
  return <g transform={`rotate(${rot}) scale(${size / 100})`}>{Draw()}</g>;
}

/** ずかん用の 小さな え */
export function PlanktonIcon({ id, px = 44, gray = false }: { id: string; px?: number; gray?: boolean }) {
  return (
    <svg viewBox="-60 -60 120 120" width={px} height={px} style={gray ? { filter: 'grayscale(1) brightness(0.4)', opacity: 0.5 } : undefined}>
      <PlanktonArt id={id} size={100} />
    </svg>
  );
}
