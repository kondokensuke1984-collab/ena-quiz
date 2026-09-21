import React from 'react';
import type { PlayerKey } from '../types';

// 主人公「あんり」「りの」。リポジトリに人物の絵がないので新規に描いたもの。
// js/chars.js と同じ丸っこい絵柄（太い線・#3d2b5e の目・頬の赤み）に寄せている。
//
// 正面向き1ポーズだけを用意し、歩きは「上下のぴょこぴょこ＋左右反転」で表現する。
// 横向き・後ろ向きの絵は作らない。

export interface Palette {
  hair: string;
  hairDark: string;
  cloth: string;
  clothDark: string;
  accent: string;
  name: string;
}

export const PALETTES: Record<PlayerKey, Palette> = {
  anri: { hair: '#8b5a3c', hairDark: '#6b4430', cloth: '#f9a8d4', clothDark: '#f472b6', accent: '#fb7185', name: 'あんり' },
  rino: { hair: '#c4b5fd', hairDark: '#a78bfa', cloth: '#a5b4fc', clothDark: '#818cf8', accent: '#67e8f9', name: 'りの' },
};

const SKIN = '#ffe8d6';
const SKIN_LINE = '#f0c9a8';
const INK = '#3d2b5e';

interface Props {
  who: PlayerKey;
  size?: number;
  walking?: boolean;
  flip?: boolean;
  hat?: 'cap' | 'crown' | null;
  ribbon?: boolean;
}

function KidSVGBase({ who, size = 110, walking = false, flip = false, hat = null, ribbon = false }: Props) {
  const p = PALETTES[who];
  const isRino = who === 'rino';

  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible' }}
      aria-hidden="true"
    >
      {/* 足もとの影。歩いているときは少し縮めて跳ねている感じを出す */}
      <ellipse cx="50" cy="114" rx={walking ? 17 : 20} ry={walking ? 4 : 5} fill="rgba(0,0,0,0.22)" />

      <g>
        {/* あし */}
        <rect x="38" y="96" width="9" height="14" rx="4.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
        <rect x="53" y="96" width="9" height="14" rx="4.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
        <ellipse cx="42.5" cy="110" rx="6.5" ry="4" fill="#fff" stroke={p.clothDark} strokeWidth="1.6" />
        <ellipse cx="57.5" cy="110" rx="6.5" ry="4" fill="#fff" stroke={p.clothDark} strokeWidth="1.6" />

        {/* からだ（ワンピース／パーカー） */}
        <path
          d="M50 62 C38 62 32 70 30 84 C29 92 30 98 34 99 L66 99 C70 98 71 92 70 84 C68 70 62 62 50 62 Z"
          fill={p.cloth}
          stroke={p.clothDark}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        {isRino ? (
          /* りの：パーカーのひも */
          <>
            <path d="M44 66 L43 78" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M56 66 L57 78" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
          </>
        ) : (
          /* あんり：エプロンのポケット */
          <>
            <rect x="42" y="78" width="16" height="12" rx="4" fill="#fff" opacity="0.85" />
            <path d="M46 84 h8" stroke={p.clothDark} strokeWidth="1.8" strokeLinecap="round" />
          </>
        )}

        {/* うで */}
        <ellipse cx="27" cy="76" rx="6" ry="8.5" fill={p.cloth} stroke={p.clothDark} strokeWidth="2.2" transform="rotate(-14 27 76)" />
        <ellipse cx="73" cy="76" rx="6" ry="8.5" fill={p.cloth} stroke={p.clothDark} strokeWidth="2.2" transform="rotate(14 73 76)" />
        <circle cx="25" cy="85" r="5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
        <circle cx="75" cy="85" r="5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />

        {/* あたま */}
        <circle cx="50" cy="42" r="25" fill={SKIN} stroke={SKIN_LINE} strokeWidth="2" />

        {isRino ? (
          /* りの：うさ耳フード */
          <>
            <ellipse cx="33" cy="12" rx="7" ry="16" fill={p.hair} stroke={p.hairDark} strokeWidth="2.2" transform="rotate(-12 33 12)" />
            <ellipse cx="67" cy="12" rx="7" ry="16" fill={p.hair} stroke={p.hairDark} strokeWidth="2.2" transform="rotate(12 67 12)" />
            <ellipse cx="33" cy="13" rx="3" ry="10" fill="#fde7f3" transform="rotate(-12 33 13)" />
            <ellipse cx="67" cy="13" rx="3" ry="10" fill="#fde7f3" transform="rotate(12 67 13)" />
            <path
              d="M25 44 C25 26 35 17 50 17 C65 17 75 26 75 44 C75 38 68 32 50 32 C32 32 25 38 25 44 Z"
              fill={p.hair}
              stroke={p.hairDark}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          </>
        ) : (
          /* あんり：ボブヘア＋おだんご */
          <>
            <path
              d="M24 46 C22 26 34 15 50 15 C66 15 78 26 76 46 C74 36 70 30 50 30 C30 30 26 36 24 46 Z"
              fill={p.hair}
              stroke={p.hairDark}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <circle cx="22" cy="42" r="8.5" fill={p.hair} stroke={p.hairDark} strokeWidth="2.2" />
            <circle cx="78" cy="42" r="8.5" fill={p.hair} stroke={p.hairDark} strokeWidth="2.2" />
            {/* 🌸 のかみかざり */}
            <g transform="translate(70,22)">
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse key={deg} cx="0" cy="-4.5" rx="3" ry="4.5" fill={p.accent} transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="2.4" fill="#fde68a" />
            </g>
          </>
        )}

        {/* かお */}
        <ellipse cx="41" cy="45" rx="3.6" ry="4.6" fill={INK} />
        <ellipse cx="59" cy="45" rx="3.6" ry="4.6" fill={INK} />
        <circle cx="42.3" cy="43.2" r="1.4" fill="#fff" />
        <circle cx="60.3" cy="43.2" r="1.4" fill="#fff" />
        <ellipse cx="33" cy="52" rx="4.2" ry="2.6" fill="#fda4af" opacity="0.75" />
        <ellipse cx="67" cy="52" rx="4.2" ry="2.6" fill="#fda4af" opacity="0.75" />
        <path
          d={walking ? 'M44.5 53 Q50 60.5 55.5 53' : 'M45 53 Q50 58.5 55 53'}
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* きせかえ（帽子・リボン）は絵のうえに重ねる */}
        {ribbon && (
          <g transform="translate(30,20)">
            <path d="M0 0 L-9 -5 L-9 6 Z" fill="#fb7185" stroke="#e11d48" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M0 0 L9 -5 L9 6 Z" fill="#fb7185" stroke="#e11d48" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="0" cy="0.5" r="3" fill="#f43f5e" stroke="#e11d48" strokeWidth="1.4" />
          </g>
        )}
        {hat === 'cap' && (
          <g>
            <path d="M28 26 C28 13 40 7 50 7 C60 7 72 13 72 26 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M72 26 C82 26 86 29 86 32 L70 32 Z" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2.2" strokeLinejoin="round" />
          </g>
        )}
        {hat === 'crown' && (
          <g>
            <path d="M31 22 L31 8 L40 15 L50 5 L60 15 L69 8 L69 22 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2.2" strokeLinejoin="round" />
            <circle cx="50" cy="13" r="2.6" fill="#f472b6" />
          </g>
        )}
      </g>
    </svg>
  );
}

export const KidSVG = React.memo(KidSVGBase);
