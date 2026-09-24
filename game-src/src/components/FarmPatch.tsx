import React from 'react';
import { ISLAND_H, ISLAND_W } from '../lib/island';
import { FARM_POS, GROW_DAYS, PLOT_DX } from '../lib/farm';
import { ITEM_BY_ID } from '../lib/items';
import type { FarmPlot } from '../types';

// はたけ（3つの うね）。地面の上・キャラの下に かく。stage＝そだった日数（0..GROW_DAYS）
const S = { stroke: '#4c1d95', strokeWidth: 2.2 };

function Sprout({ stage, seed }: { stage: number; seed: string }) {
  if (stage >= GROW_DAYS) {
    return (
      <g className="crop-bob">
        <text x="0" y="-12" fontSize="34" textAnchor="middle">{ITEM_BY_ID[seed]?.emoji ?? '🌱'}</text>
        <text x="20" y="-38" fontSize="16" className="twinkle">✨</text>
      </g>
    );
  }
  if (stage === 2) {
    return (
      <g>
        <path d="M0 -4 L0 -34" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M0 -16 q-14 -4 -16 -14 q12 0 16 10 M0 -20 q14 -4 16 -14 q-12 0 -16 10" fill="#22c55e" {...S} strokeWidth={1.6} />
        <circle cx="0" cy="-38" r="6" fill="#f9a8d4" {...S} strokeWidth={1.6} />
      </g>
    );
  }
  if (stage === 1) {
    return (
      <g>
        <path d="M0 -4 L0 -16" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
        <path d="M0 -14 q-10 -2 -12 -10 q9 0 12 8 M0 -14 q10 -2 12 -10 q-9 0 -12 8" fill="#4ade80" {...S} strokeWidth={1.4} />
      </g>
    );
  }
  return (
    <g fill="#78350f">
      <circle cx="-6" cy="-6" r="2" /><circle cx="2" cy="-8" r="2" /><circle cx="7" cy="-5" r="2" />
    </g>
  );
}

function FarmPatchBase({ plots, stages, today }: { plots: (FarmPlot | null)[]; stages: number[]; today: string }) {
  const cx = FARM_POS.x * ISLAND_W;
  const cy = FARM_POS.y * ISLAND_H;
  return (
    <g style={{ pointerEvents: 'none' }}>
      {/* さく */}
      <rect x={cx - PLOT_DX * ISLAND_W * 1.75} y={cy - 22} width={PLOT_DX * ISLAND_W * 3.5} height={40} rx="14" fill="#a16207" opacity="0.35" />
      {plots.map((p, i) => {
        const x = cx + (i - 1) * PLOT_DX * ISLAND_W;
        const wet = p && p.watered === today;
        return (
          <g key={i} transform={`translate(${x} ${cy})`}>
            <ellipse cx="0" cy="0" rx="32" ry="13" fill={wet ? '#57300f' : '#92400e'} {...S} />
            <path d="M-22 -2 q22 -8 44 0" stroke="#78350f" strokeWidth="2" fill="none" opacity="0.6" />
            {p && <Sprout stage={stages[i]} seed={p.seed} />}
            {wet && stages[i] < GROW_DAYS && <text x="22" y="-16" fontSize="14">💧</text>}
          </g>
        );
      })}
      <g transform={`translate(${cx + PLOT_DX * ISLAND_W * 1.85} ${cy + 4})`}>
        <rect x="-3" y="-34" width="6" height="34" fill="#92400e" />
        <rect x="-24" y="-50" width="48" height="20" rx="4" fill="#fef3c7" {...S} />
        <text x="0" y="-35" fontSize="13" fontWeight="900" textAnchor="middle" fill="#78350f">はたけ</text>
      </g>
    </g>
  );
}

export const FarmPatch = React.memo(FarmPatchBase);
