import React from 'react';
import { ISLAND_H, ISLAND_W } from '../lib/island';

// 島の地面。買った家具が増えるまでは、ここだけの「更地」。
function IslandGroundBase() {
  return (
    <>
      <defs>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <radialGradient id="grass" cx="50%" cy="55%" r="62%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="70%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </radialGradient>
        <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={ISLAND_W} height={ISLAND_H} fill="url(#sea)" />

      {/* 波 */}
      {[0.12, 0.2, 0.28].map((t, i) => (
        <path
          key={t}
          d={`M0 ${ISLAND_H * t} q 60 -10 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0`}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={3 - i * 0.6}
        />
      ))}

      {/* 砂浜と芝。歩ける範囲（BOUNDS）よりひとまわり大きくしてある */}
      <ellipse cx={ISLAND_W / 2} cy={ISLAND_H * 0.62} rx={ISLAND_W * 0.47} ry={ISLAND_H * 0.40} fill="url(#sand)" />
      <ellipse cx={ISLAND_W / 2} cy={ISLAND_H * 0.62} rx={ISLAND_W * 0.415} ry={ISLAND_H * 0.335} fill="url(#grass)" />

      {/* 草のぽつぽつ（更地でもさみしくしすぎない） */}
      {[
        [220, 330], [790, 350], [160, 520], [860, 540], [330, 620], [690, 640], [500, 300], [420, 680], [600, 690],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} opacity="0.55">
          <path d={`M${x} ${y} q -4 -10 -1 -16`} stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d={`M${x + 4} ${y} q 3 -12 8 -16`} stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      ))}
    </>
  );
}

export const IslandGround = React.memo(IslandGroundBase);
