import React from 'react';
import { ISLAND_H, ISLAND_W } from '../lib/island';
import { moonLitPath, type TimeOfDay } from '../lib/sky';

// となりの島（はなばたけ）と、おうちの中 の地面。座標は島と同じ 1000 x 750。

const FLOWERS = Array.from({ length: 26 }, (_, i) => [
  170 + ((i * 131) % 660), 300 + ((i * 67) % 380), ['#f472b6', '#fde047', '#f87171', '#c084fc', '#fff'][i % 5],
] as const);

function EastGroundBase({ tod }: { tod: TimeOfDay }) {
  return (
    <>
      <defs>
        <linearGradient id="sea2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <radialGradient id="meadow" cx="50%" cy="55%" r="62%">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="75%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#4ade80" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={ISLAND_W} height={ISLAND_H} fill="url(#sea2)" />
      {[0.12, 0.2].map((t, i) => (
        <path key={t} d={`M0 ${ISLAND_H * t} q 60 -10 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3 - i} />
      ))}
      <ellipse cx="520" cy={ISLAND_H * 0.6} rx="470" ry="300" fill="#fde68a" />
      <ellipse cx="520" cy={ISLAND_H * 0.6} rx="430" ry="265" fill="url(#meadow)" />
      {/* はし（左はし） */}
      <rect x="-5" y="436" width="110" height="30" fill="#b45309" stroke="#4c1d95" strokeWidth="2.4" />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={10 + i * 16} x2={10 + i * 16} y1="436" y2="466" stroke="#78350f" strokeWidth="2" />)}
      {/* 池 */}
      <ellipse cx="700" cy="560" rx="90" ry="38" fill="#7dd3fc" stroke="#0284c7" strokeWidth="3" />
      <ellipse cx="680" cy="552" rx="20" ry="7" fill="#bae6fd" />
      <ellipse cx="730" cy="566" rx="14" ry="8" fill="#4ade80" stroke="#15803d" strokeWidth="1.5" />
      {/* 花 */}
      {FLOWERS.map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(1.7)`}>
          <path d="M0 0 L0 14" stroke="#16a34a" strokeWidth="2.5" />
          {[0, 72, 144, 216, 288].map((d) => <circle key={d} cx={Math.cos((d * Math.PI) / 180) * 5} cy={Math.sin((d * Math.PI) / 180) * 5} r="4" fill={c} />)}
          <circle r="3" fill="#f59e0b" />
        </g>
      ))}
      {/* ちょうちょ（昼だけ） */}
      {tod !== 'night' && [[300, 360], [560, 420], [820, 380]].map(([x, y], i) => (
        <g key={'b' + i} transform={`translate(${x} ${y})`} pointerEvents="none">
          <g className="butterfly" style={{ animationDelay: `${i * -1.3}s` }}>
            <ellipse cx="-6" cy="0" rx="7" ry="9" fill={['#f9a8d4', '#fde047', '#a5b4fc'][i]} />
            <ellipse cx="6" cy="0" rx="7" ry="9" fill={['#f9a8d4', '#fde047', '#a5b4fc'][i]} />
            <rect x="-1" y="-6" width="2" height="12" fill="#4c1d95" />
          </g>
        </g>
      ))}
    </>
  );
}
export const EastGround = React.memo(EastGroundBase);

const WALL: Record<string, (id: string) => React.ReactNode> = {
  wl_beige: () => <rect x="0" y="0" width={ISLAND_W} height="400" fill="#fef3c7" />,
  wl_star: () => (
    <g>
      <rect x="0" y="0" width={ISLAND_W} height="400" fill="#c7d2fe" />
      {Array.from({ length: 40 }, (_, i) => <text key={i} x={(i * 97) % 1000} y={30 + ((i * 53) % 350)} fontSize="20" fill="#fde047">★</text>)}
    </g>
  ),
  wl_flower: () => (
    <g>
      <rect x="0" y="0" width={ISLAND_W} height="400" fill="#fce7f3" />
      {Array.from({ length: 36 }, (_, i) => <text key={i} x={(i * 113) % 1000} y={30 + ((i * 71) % 350)} fontSize="22">🌸</text>)}
    </g>
  ),
};
const FLOOR: Record<string, () => React.ReactNode> = {
  fl_wood: () => (
    <g>
      <rect x="0" y="400" width={ISLAND_W} height="350" fill="#d6a56b" />
      {Array.from({ length: 7 }, (_, i) => <line key={i} x1="0" x2={ISLAND_W} y1={440 + i * 48} y2={440 + i * 48} stroke="#b7834a" strokeWidth="3" />)}
    </g>
  ),
  fl_check: () => (
    <g>
      <rect x="0" y="400" width={ISLAND_W} height="350" fill="#fff" />
      {Array.from({ length: 10 * 7 }, (_, i) => {
        const cx = i % 10, cy = Math.floor(i / 10);
        return (cx + cy) % 2 ? <rect key={i} x={cx * 100} y={400 + cy * 50} width="100" height="50" fill="#bae6fd" /> : null;
      })}
    </g>
  ),
  fl_grass: () => (
    <g>
      <rect x="0" y="400" width={ISLAND_W} height="350" fill="#86efac" />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${(i * 71) % 1000} ${430 + ((i * 37) % 300)} q -3 -10 0 -16 M${(i * 71) % 1000 + 5} ${430 + ((i * 37) % 300)} q 3 -10 8 -14`} stroke="#16a34a" strokeWidth="3" fill="none" />)}
    </g>
  ),
};

const WINDOW_SKY: Record<TimeOfDay, string> = { day: '#7dd3fc', evening: '#fdba74', night: '#1e1b4b' };

function RoomGroundBase({ wall, floor, tod, moonAge, sleeping }: {
  wall: string; floor: string; tod: TimeOfDay; moonAge: number; sleeping: boolean;
}) {
  return (
    <>
      {(WALL[wall] ?? WALL.wl_beige)(wall)}
      {(FLOOR[floor] ?? FLOOR.fl_wood)()}
      <rect x="0" y="392" width={ISLAND_W} height="12" fill="#92400e" />
      {/* まど：外は本当の時間の空 */}
      <g transform="translate(600 70)">
        <rect x="0" y="0" width="240" height="170" rx="8" fill={WINDOW_SKY[tod]} stroke="#78350f" strokeWidth="10" />
        {tod === 'night' && [[30, 30], [80, 60], [200, 40], [150, 110], [50, 130]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill="#fef9c3" className="twinkle" />)}
        {tod !== 'day' && (
          <g transform="translate(170 60)">
            <circle r="22" fill="rgba(30,41,59,0.5)" />
            <path d={moonLitPath(moonAge, 22)} fill="#fef08a" />
          </g>
        )}
        {tod === 'day' && <circle cx="185" cy="50" r="24" fill="#fde047" />}
        <path d="M120 0 L120 170 M0 85 L240 85" stroke="#78350f" strokeWidth="8" />
        <path d="M-14 -8 Q 60 60 -10 180 L-24 180 L-24 -8 Z M254 -8 Q 180 60 250 180 L264 180 L264 -8 Z" fill="#f472b6" opacity="0.85" />
      </g>
      {/* ドア（ここから そとへ） */}
      <g transform="translate(80 170)">
        <rect x="0" y="0" width="120" height="232" rx="10" fill="#b45309" stroke="#4c1d95" strokeWidth="4" />
        <rect x="14" y="16" width="92" height="90" rx="6" fill="#d97706" />
        <circle cx="98" cy="130" r="7" fill="#fde047" stroke="#4c1d95" strokeWidth="2" />
        <text x="60" y="-12" fontSize="26" textAnchor="middle">🚪</text>
      </g>
      {/* ねむっているとき */}
      {tod === 'night' && !sleeping && <rect x="0" y="0" width={ISLAND_W} height={ISLAND_H} fill="rgba(15,23,72,0.18)" pointerEvents="none" />}
    </>
  );
}
export const RoomGround = React.memo(RoomGroundBase);
