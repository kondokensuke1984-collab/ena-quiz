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

// ── 🏫 がっこうの きょうしつ ──
/** つくえ（2れつ × 3）。キャラは その うしろに すわる */
export const SCHOOL_DESKS = [
  { x: 0.3, y: 0.7 }, { x: 0.5, y: 0.7 }, { x: 0.7, y: 0.7 },
  { x: 0.3, y: 0.87 }, { x: 0.5, y: 0.87 }, { x: 0.7, y: 0.87 },
];
/** タップで ひらくもの（割合の四角） */
export const SCHOOL_HITS = {
  board: { x0: 0.26, x1: 0.6, y0: 0.1, y1: 0.37 },
  tv: { x0: 0.62, x1: 0.78, y0: 0.18, y1: 0.4 },
  notice: { x0: 0.03, x1: 0.21, y0: 0.28, y1: 0.52 },
};

function SchoolGroundBase({ tod, moonAge, medals, stamps, friends, today }: {
  tod: TimeOfDay; moonAge: number; medals: number; stamps: number; friends: number; today: number;
}) {
  return (
    <>
      <rect x="0" y="0" width={ISLAND_W} height="400" fill="#e0f2fe" />
      <rect x="0" y="300" width={ISLAND_W} height="100" fill="#bae6fd" />
      <rect x="0" y="400" width={ISLAND_W} height="350" fill="#e7c28f" />
      {Array.from({ length: 7 }, (_, i) => <line key={i} x1="0" x2={ISLAND_W} y1={440 + i * 48} y2={440 + i * 48} stroke="#c9a06a" strokeWidth="3" />)}
      <rect x="0" y="392" width={ISLAND_W} height="12" fill="#92400e" />
      {/* まど：外は本当の時間の空 */}
      <g transform="translate(30 50)">
        <rect x="0" y="0" width="175" height="130" rx="6" fill={WINDOW_SKY[tod]} stroke="#78350f" strokeWidth="8" />
        {tod === 'night' && [[25, 25], [70, 50], [140, 30], [110, 95]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill="#fef9c3" className="twinkle" />)}
        {tod !== 'day' && (
          <g transform="translate(125 45)">
            <circle r="18" fill="rgba(30,41,59,0.5)" />
            <path d={moonLitPath(moonAge, 18)} fill="#fef08a" />
          </g>
        )}
        {tod === 'day' && <circle cx="135" cy="40" r="20" fill="#fde047" />}
        <path d="M87 0 L87 130" stroke="#78350f" strokeWidth="6" />
      </g>
      {/* けいじばん（あつめた もの） */}
      <g transform="translate(30 215)">
        <rect x="0" y="0" width="175" height="165" rx="6" fill="#fcd9a8" stroke="#92400e" strokeWidth="6" />
        <text x="87" y="26" fontSize="19" fontWeight="900" textAnchor="middle" fill="#7c2d12">けいじばん</text>
        {[['🪙', `${medals}まい`], ['🗓️', `${stamps}にち`], ['🐾', `${friends}たい`]].map(([e, t], i) => (
          <g key={i} transform={`translate(${i % 2 ? 92 : 10} ${40 + i * 38})`}>
            <rect width="75" height="32" rx="4" fill={['#fef9c3', '#dcfce7', '#fce7f3'][i]} stroke="#4c1d95" strokeWidth="1.5" transform={`rotate(${i % 2 ? 3 : -3} 37 16)`} />
            <text x="37" y="22" fontSize="15" fontWeight="900" textAnchor="middle" fill="#1e1b4b">{e}{t}</text>
          </g>
        ))}
        {[[12, 8], [160, 8], [12, 152], [160, 152]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#ef4444" />)}
      </g>
      {/* こくばん */}
      <g transform="translate(265 80)">
        <rect x="0" y="0" width="330" height="190" rx="6" fill="#166534" stroke="#78350f" strokeWidth="10" />
        <rect x="10" y="190" width="310" height="10" fill="#a16207" />
        <rect x="40" y="184" width="22" height="6" fill="#fff" />
        <rect x="70" y="184" width="16" height="6" fill="#fde047" />
        <text x="165" y="50" fontSize="26" fontWeight="900" textAnchor="middle" fill="#f0fdf4">きょうの べんきょう</text>
        <text x="165" y="100" fontSize="34" fontWeight="900" textAnchor="middle" fill="#fef08a">{today}もん</text>
        <text x="165" y="145" fontSize="17" fontWeight="800" textAnchor="middle" fill="#bbf7d0">タップして みてね</text>
      </g>
      {/* 📺 テレビ（ずんだもん どうが） */}
      <g transform="translate(628 150)">
        <rect x="46" y="112" width="44" height="12" fill="#475569" />
        <rect x="20" y="124" width="96" height="10" rx="3" fill="#334155" />
        <rect x="0" y="0" width="140" height="112" rx="10" fill="#1e293b" stroke="#0f172a" strokeWidth="4" />
        <rect x="10" y="10" width="120" height="84" rx="4" fill="#84cc16" />
        <circle cx="70" cy="52" r="24" fill="#fff" opacity="0.9" />
        <path d="M62 38 L86 52 L62 66 Z" fill="#16a34a" />
        <text x="70" y="108" fontSize="11" fontWeight="900" textAnchor="middle" fill="#e2e8f0">ずんだもん どうが</text>
      </g>
      {/* ドア（ここから そとへ） */}
      <g transform="translate(805 170)">
        <rect x="0" y="0" width="120" height="232" rx="10" fill="#b45309" stroke="#4c1d95" strokeWidth="4" />
        <rect x="14" y="16" width="92" height="90" rx="6" fill="#bae6fd" stroke="#78350f" strokeWidth="3" />
        <circle cx="22" cy="130" r="7" fill="#fde047" stroke="#4c1d95" strokeWidth="2" />
        <text x="60" y="-12" fontSize="26" textAnchor="middle">🚪</text>
      </g>
      {/* きょうたく */}
      <g transform="translate(430 420)">
        <ellipse cx="0" cy="36" rx="60" ry="8" fill="rgba(0,0,0,0.15)" />
        <rect x="-55" y="-10" width="110" height="46" rx="4" fill="#a16207" stroke="#4c1d95" strokeWidth="3" />
        <rect x="-60" y="-16" width="120" height="10" rx="3" fill="#ca8a04" stroke="#4c1d95" strokeWidth="3" />
      </g>
      {/* つくえ */}
      {SCHOOL_DESKS.map((d, i) => (
        <g key={i} transform={`translate(${d.x * ISLAND_W} ${d.y * ISLAND_H + 18})`}>
          <ellipse cx="0" cy="26" rx="48" ry="8" fill="rgba(0,0,0,0.15)" />
          <path d="M-38 6 L-38 26 M38 6 L38 26" stroke="#4c1d95" strokeWidth="4" strokeLinecap="round" />
          <rect x="-44" y="-4" width="88" height="12" rx="3" fill="#fbbf24" stroke="#4c1d95" strokeWidth="2.5" />
        </g>
      ))}
      {tod === 'night' && <rect x="0" y="0" width={ISLAND_W} height={ISLAND_H} fill="rgba(15,23,72,0.18)" pointerEvents="none" />}
    </>
  );
}
export const SchoolGround = React.memo(SchoolGroundBase);
