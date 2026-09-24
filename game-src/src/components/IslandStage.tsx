import React from 'react';
import { MAIN_GROUND, WORLD } from '../lib/island';

// 島の地面（main）。2026-09-22 に土地を広げた：1000x750 の枠の外まで 大きな楕円の島。
// pier＝さんばしとボート（上の海岸）、右上の小島（がっこうで できる）、左上の もりのこじま、右の海岸の はし。
// 季節の飾り（今月＝実際の日付の月）。建物とぶつからない芝のふちに置く
/** 左上の海の「もりの こじま」（タップで クエストの まよいの森へ）。割合 */
export const FOREST_ISLET = { x: -0.15, y: -0.227 };

export const SEASON_SPOTS: [number, number][] = [[330, 575], [905, 560], [250, 690], [640, 705], [520, 725], [760, 690]];

function SeasonDeco({ season, halloween = false }: { season: number; halloween?: boolean }) {
  if (season === 10) {
    return (
      <g>
        {SEASON_SPOTS.slice(0, 4).map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse cx="0" cy="2" rx="16" ry="5" fill="rgba(0,0,0,0.18)" />
            <rect x="-4" y="-34" width="8" height="34" rx="3" fill="#92400e" />
            <circle cx="0" cy="-48" r="24" fill={i % 2 ? '#f97316' : '#dc2626'} stroke="#7c2d12" strokeWidth="2" />
            <circle cx="-12" cy="-40" r="12" fill={i % 2 ? '#fb923c' : '#ef4444'} />
          </g>
        ))}
        {SEASON_SPOTS.slice(4).map(([x, y], i) => (
          <g key={'p' + i} transform={`translate(${x} ${y})`}>
            <ellipse cx="0" cy="-10" rx="18" ry="13" fill="#f97316" stroke="#7c2d12" strokeWidth="2" />
            <path d="M0 -23 q2 -8 7 -9" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" />
            {halloween && (
              <g className="lantern-flicker" fill="#fde047">
                <path d="M-10 -15 l4 -6 l4 6 z M2 -15 l4 -6 l4 6 z" />
                <path d="M-10 -7 l3 3 l3 -3 l4 3 l4 -3 l3 3 l3 -3 q-10 8 -20 0 z" />
              </g>
            )}
          </g>
        ))}
        {halloween && [[430, 330], [690, 590], [870, 470]].map(([x, y], i) => (
          <g key={'h' + i} transform={`translate(${x} ${y})`}>
            <ellipse cx="0" cy="2" rx="20" ry="5" fill="rgba(0,0,0,0.18)" />
            <ellipse cx="0" cy="-13" rx="22" ry="16" fill="#f97316" stroke="#7c2d12" strokeWidth="2" />
            <path d="M0 -29 q2 -8 7 -9" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" />
            <g className="lantern-flicker" fill="#fde047">
              <path d="M-12 -18 l5 -7 l5 7 z M2 -18 l5 -7 l5 7 z" />
              <path d="M-12 -9 l3 3 l3 -3 l4 3 l4 -3 l4 3 l3 -3 l3 3 q-12 10 -24 0 z" />
            </g>
          </g>
        ))}
      </g>
    );
  }
  if (season === 11) {
    const leaves = Array.from({ length: 16 }, (_, i) => [140 + ((i * 97) % 720), 330 + ((i * 53) % 380)]);
    return (
      <g>
        {leaves.map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} l6 -8 l6 8 l-6 4 z`} fill={['#dc2626', '#f97316', '#eab308'][i % 3]} opacity="0.85" />
        ))}
        {SEASON_SPOTS.slice(0, 3).map(([x, y], i) => (
          <g key={'a' + i} transform={`translate(${x} ${y})`}>
            <ellipse cx="0" cy="-8" rx="8" ry="10" fill="#a16207" stroke="#78350f" strokeWidth="2" />
            <path d="M-9 -14 q9 -8 18 0 z" fill="#78350f" />
          </g>
        ))}
      </g>
    );
  }
  if (season === 12 || season === 1 || season === 2) {
    const flakes = Array.from({ length: 22 }, (_, i) => [120 + ((i * 89) % 760), 300 + ((i * 61) % 420)]);
    return (
      <g>
        {flakes.map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="14" ry="5" fill="#fff" opacity="0.8" />)}
        {season === 12 && (
          <g transform="translate(860 560)">
            <path d="M0 -90 L28 -40 L14 -40 L34 -8 L-34 -8 L-14 -40 L-28 -40 Z" fill="#16a34a" stroke="#14532d" strokeWidth="2.4" />
            <rect x="-6" y="-8" width="12" height="12" fill="#92400e" />
            <circle cx="0" cy="-92" r="6" fill="#fde047" />
          </g>
        )}
        {season === 1 && (
          <g transform="translate(860 560)">
            {[-12, 0, 12].map((dx, i) => (
              <path key={i} d={`M${dx - 5} 0 L${dx - 5} ${-60 + i * 10} L${dx + 5} ${-66 + i * 10} L${dx + 5} 0 Z`} fill="#65a30d" stroke="#365314" strokeWidth="2" />
            ))}
            <rect x="-24" y="-18" width="48" height="18" rx="4" fill="#d97706" stroke="#78350f" strokeWidth="2" />
          </g>
        )}
      </g>
    );
  }
  return null;
}

// となりの島への はし（main の右の海岸から 世界の右はしへ）
function BridgeRight() {
  return (
    <g>
      <rect x="1180" y="436" width="130" height="30" fill="#b45309" stroke="#4c1d95" strokeWidth="2.4" />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={1190 + i * 16} x2={1190 + i * 16} y1="436" y2="466" stroke="#78350f" strokeWidth="2" />
      ))}
      <path d="M1180 432 L1300 432 M1180 470 L1300 470" stroke="#92400e" strokeWidth="4" />
      <text x="1250" y="422" fontSize="22" textAnchor="middle">🌸</text>
    </g>
  );
}

// 広げた土地の 木・しげみ・花・岩（今の島の まわりを ぐるっと）。歩きの じゃまは しない
const G0 = MAIN_GROUND;
const OUTER_DECO = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 + 0.2;
  const k = i % 2 ? 0.86 : 0.78;
  return { x: G0.cx + Math.cos(a) * G0.grassRx * k, y: G0.cy + Math.sin(a) * G0.grassRy * k, kind: i % 4, a };
}).filter((d) => Math.abs(d.x - 360) > 90 || d.y > 100)          // さんばしの前は あける
  .filter((d) => !(d.x > 1050 && Math.abs(d.y - 450) < 90));      // はしの前も あける

function OuterDeco() {
  return (
    <g>
      {OUTER_DECO.map((d, i) => (
        <g key={'od' + i} transform={`translate(${Math.round(d.x)} ${Math.round(d.y)})`}>
          <ellipse cx="0" cy="2" rx="22" ry="6" fill="rgba(0,0,0,0.15)" />
          {d.kind === 0 && (
            <g>
              <rect x="-5" y="-12" width="10" height="14" fill="#78350f" />
              <path d="M0 -70 L22 -32 L11 -32 L26 -8 L-26 -8 L-11 -32 L-22 -32 Z" fill="#15803d" stroke="#14532d" strokeWidth="2.4" />
            </g>
          )}
          {d.kind === 1 && (
            <g>
              <circle cx="-12" cy="-12" r="14" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
              <circle cx="10" cy="-14" r="16" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
              <circle cx="-2" cy="-24" r="12" fill="#4ade80" stroke="#14532d" strokeWidth="2" />
            </g>
          )}
          {d.kind === 2 && (
            <g>
              {[-14, 0, 14].map((dx, j) => (
                <g key={j} transform={`translate(${dx} ${j === 1 ? -4 : 0})`}>
                  <path d="M0 0 L0 -16" stroke="#16a34a" strokeWidth="3" />
                  <circle cx="0" cy="-19" r="6" fill={['#f472b6', '#facc15', '#a78bfa'][j]} stroke="#4c1d95" strokeWidth="1.5" />
                </g>
              ))}
            </g>
          )}
          {d.kind === 3 && (
            <path d="M-22 0 Q-24 -18 -6 -24 Q12 -28 22 -12 Q26 0 -22 0 Z" fill="#a8a29e" stroke="#57534e" strokeWidth="2.4" />
          )}
        </g>
      ))}
      {/* 草のぽつぽつ（外がわ） */}
      {[[-60, 300], [1040, 250], [60, 780], [940, 800], [250, 950], [760, 960], [500, 1000], [150, 120], [860, 90], [-120, 520], [1120, 620]].map(([x, y]) => (
        <g key={`og${x}-${y}`} opacity="0.55">
          <path d={`M${x} ${y} q -4 -10 -1 -16`} stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d={`M${x + 4} ${y} q 3 -12 8 -16`} stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      ))}
    </g>
  );
}

function IslandGroundBase({ expansion = 0, pier = false, season = 0, bridge = false, halloween = false }: { expansion?: number; pier?: boolean; season?: number; bridge?: boolean; halloween?: boolean }) {
  const G = MAIN_GROUND;
  // さんばしの ねもと（x=360 の 砂浜の上のはし）
  const sandTop = Math.round(G.cy - G.sandRy * Math.sqrt(1 - ((360 - G.cx) / G.sandRx) ** 2));
  const wave = (y: number) => `M${WORLD.x} ${y}` + ' q 60 -10 120 0'.repeat(1) + ' t 120 0'.repeat(13);
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

      <rect x={WORLD.x} y={WORLD.y} width={WORLD.w} height={WORLD.h} fill="url(#sea)" />

      {/* 波（上と下の海） */}
      {[-235, -200, -170, 1050, 1080].map((y, i) => (
        <path key={y} d={wave(y)} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3 - (i % 3) * 0.6} />
      ))}

      {/* 🌲 左上の海の もりの こじま（いつも ある。タップで まよいの森へ） */}
      <g transform="translate(-300 -277) scale(1.3)">
        <ellipse cx="115" cy="86" rx="98" ry="36" fill="url(#sand)" />
        <ellipse cx="115" cy="82" rx="78" ry="25" fill="#15803d" />
        {[[62, 88, 0.5], [148, 90, 0.5], [88, 74, 0.62], [128, 72, 0.66], [108, 94, 0.55]].map(([x, y, k], i) => (
          <g key={'ft' + i} transform={`translate(${x} ${y}) scale(${k})`}>
            <rect x="-5" y="-10" width="10" height="12" fill="#78350f" />
            <path d="M0 -90 L28 -40 L14 -40 L34 -8 L-34 -8 L-14 -40 L-28 -40 Z" fill={i % 2 ? '#166534' : '#15803d'} stroke="#052e16" strokeWidth="3" />
          </g>
        ))}
        <g transform="translate(176 104)">
          <rect x="-2" y="-18" width="4" height="18" fill="#78350f" />
          <rect x="-34" y="-34" width="68" height="18" rx="4" fill="#fef3c7" stroke="#4c1d95" strokeWidth="2" />
          <text x="0" y="-21" fontSize="12" fontWeight="900" textAnchor="middle" fill="#14532d">まよいの森</text>
        </g>
        <text x="40" y="44" fontSize="20" className="twinkle">✨</text>
      </g>

      {/* 右上の海の 小島と はし（がっこうを建てると できる） */}
      {expansion >= 2 && (
        <g>
          <path d="M1010 20 Q 1060 -60 1100 -128" fill="none" stroke="#92400e" strokeWidth="16" strokeLinecap="round" />
          <path d="M1010 20 Q 1060 -60 1100 -128" fill="none" stroke="#d97706" strokeWidth="10" strokeDasharray="4 7" strokeLinecap="round" />
          <ellipse cx="1150" cy="-165" rx="86" ry="34" fill="url(#sand)" />
          <ellipse cx="1152" cy="-169" rx="62" ry="22" fill="url(#grass)" />
          <path d="M1165 -169 C1163 -187 1166 -205 1172 -217" stroke="#a16207" strokeWidth="6" fill="none" strokeLinecap="round" />
          <g fill="#4ade80" stroke="#4c1d95" strokeWidth="2">
            <ellipse cx="1158" cy="-217" rx="18" ry="6" transform="rotate(-20 1158 -217)" />
            <ellipse cx="1186" cy="-217" rx="18" ry="6" transform="rotate(20 1186 -217)" />
          </g>
        </g>
      )}

      {/* さんばし と ボート（上の海へのびる） */}
      {pier && (
        <g>
          <rect x="342" y={sandTop - 110} width="36" height="140" rx="4" fill="#b45309" stroke="#4c1d95" strokeWidth="2.4" />
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} x1="342" x2="378" y1={sandTop - 96 + i * 18} y2={sandTop - 96 + i * 18} stroke="#78350f" strokeWidth="2" />
          ))}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 5; 0 0" dur="2.6s" repeatCount="indefinite" />
            <path d={`M396 ${sandTop - 84} L460 ${sandTop - 84} L450 ${sandTop - 66} L404 ${sandTop - 66} Z`} fill="#f87171" stroke="#4c1d95" strokeWidth="2.4" />
            <line x1="428" x2="428" y1={sandTop - 84} y2={sandTop - 124} stroke="#4c1d95" strokeWidth="3" />
            <path d={`M430 ${sandTop - 122} L456 ${sandTop - 90} L430 ${sandTop - 90} Z`} fill="#fff" stroke="#4c1d95" strokeWidth="2" />
          </g>
        </g>
      )}

      <ellipse cx={G.cx} cy={G.cy} rx={G.sandRx} ry={G.sandRy} fill="url(#sand)" />
      <ellipse cx={G.cx} cy={G.cy} rx={G.grassRx} ry={G.grassRy} fill="url(#grass)" />
      <OuterDeco />

      {/* 草のぽつぽつ（更地でもさみしくしすぎない） */}
      {[
        [220, 330], [790, 350], [160, 520], [860, 540], [330, 620], [690, 640], [500, 300], [420, 680], [600, 690],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} opacity="0.55">
          <path d={`M${x} ${y} q -4 -10 -1 -16`} stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d={`M${x + 4} ${y} q 3 -12 8 -16`} stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      ))}
      <SeasonDeco season={season} halloween={halloween} />
      {/* となりの島への はし（右の海岸） */}
      {bridge && <BridgeRight />}
    </>
  );
}

export const IslandGround = React.memo(IslandGroundBase);
