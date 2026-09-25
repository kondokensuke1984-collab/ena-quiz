import React from 'react';
import type { Friend } from '../lib/friends';
import { CharSVG } from './CharSVG';

// 月の きねんしゃしん（fn_photo_YYYYMM）。その月の しゅやくが ならんだ 額を、イーゼルに のせて かざる。
// 家具の絵（FurnitureSVG）と同じく、足もと＝(0,0) で上に のびる。

const S = { stroke: '#4c1d95', strokeWidth: 2.2, strokeLinejoin: 'round' as const };

function PhotoFrameBase({ month, friends }: { month: string; friends: Friend[] }) {
  const kids = friends.filter((f) => f.month === month).slice(0, 4);
  const W = 104;
  const H = 70;
  const top = -118;
  const size = kids.length > 2 ? 40 : 52;
  return (
    <g>
      <ellipse cx="0" cy="2" rx="30" ry="7" fill="rgba(0,0,0,0.2)" />
      {/* イーゼル */}
      <path d="M-24 2 L-10 -60 M24 2 L10 -60 M0 -40 L0 2" fill="none" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
      <rect x={-W / 2} y={top} width={W} height={H} rx="4" fill="#fbbf24" {...S} />
      <rect x={-W / 2 + 6} y={top + 6} width={W - 12} height={H - 12} rx="2" fill="#e0f2fe" />
      <foreignObject x={-W / 2 + 6} y={top + 6} width={W - 12} height={H - 12} style={{ pointerEvents: 'none' }}>
        <div className="flex h-full w-full items-end justify-center overflow-hidden">
          {kids.map((f) => (
            <div key={f.id} style={{ margin: '0 -4px' }}>
              <CharSVG charKey={f.char} level={f.level} fillPct={f.fill} size={size} label={f.name} />
            </div>
          ))}
        </div>
      </foreignObject>
      <rect x="-20" y={top + H - 4} width="40" height="13" rx="3" fill="#fff7ed" {...S} strokeWidth={1.4} />
      <text x="0" y={top + H + 6} fontSize="9" fontWeight="900" textAnchor="middle" fill="#4c1d95">{Number(month.slice(4))}がつ</text>
    </g>
  );
}

export const PhotoFrame = React.memo(PhotoFrameBase);
