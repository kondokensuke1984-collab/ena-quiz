import React from 'react';
import type { PlayerKey } from '../types';

// 主人公「あんり」「りの」「みつき」「けんすけ」。リポジトリに人物の絵がないので新規に描いたもの。
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
  mitsuki: { hair: '#6b3f2a', hairDark: '#4a2a1c', cloth: '#fcd34d', clothDark: '#f59e0b', accent: '#fde047', name: 'みつき' },
  kensuke: { hair: '#2e2a3a', hairDark: '#15121d', cloth: '#7dd3fc', clothDark: '#0284c7', accent: '#1e3a8a', name: 'けんすけ' },
};

const SKIN = '#ffe8d6';
const SKIN_LINE = '#f0c9a8';
const INK = '#3d2b5e';

interface Props {
  who: PlayerKey;
  size?: number;
  walking?: boolean;
  flip?: boolean;
  hat?: 'cap' | 'crown' | 'detective' | null;
  ribbon?: boolean;
  magnifier?: boolean;
}

function KidSVGBase({ who, size = 110, walking = false, flip = false, hat = null, ribbon = false, magnifier = false }: Props) {
  const p = PALETTES[who];

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
        {who === 'rino' ? (
          /* りの：パーカーのひも */
          <>
            <path d="M44 66 L43 78" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M56 66 L57 78" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
          </>
        ) : who === 'mitsuki' ? (
          /* みつき：しろい えりと こしの リボン */
          <>
            <path d="M42 64 Q50 71 58 64 Q56 69 50 71 Q44 69 42 64 Z" fill="#fff" stroke={p.clothDark} strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M33 84 Q50 88 67 84" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="86.5" r="2.4" fill={p.accent} stroke={p.clothDark} strokeWidth="1.2" />
          </>
        ) : who === 'kensuke' ? (
          /* けんすけ：Tシャツの ボールもよう＋こんの はんズボン */
          <>
            <path d="M31 88 C30 93 31 98 34 99 L66 99 C69 98 70 93 69 88 Z" fill={p.accent} stroke="#172554" strokeWidth="2" strokeLinejoin="round" />
            <path d="M50 89 L50 99" stroke="#172554" strokeWidth="1.6" />
            <circle cx="50" cy="76" r="5.5" fill="#fff" stroke="#172554" strokeWidth="1.4" />
            <path d="M50 72.5 l2.8 2 -1 3.3 h-3.6 l-1-3.3 z" fill="#172554" />
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

        {who === 'mitsuki' ? (
          /* みつき：ポニーテール＋ほしの ヘアピン */
          <>
            <path d="M72 30 C88 30 92 48 86 64 C84 70 78 72 76 66 C82 54 80 40 70 36 Z" fill={p.hair} stroke={p.hairDark} strokeWidth="2.2" strokeLinejoin="round" />
            <circle cx="73" cy="33" r="3.6" fill="#f472b6" stroke="#db2777" strokeWidth="1.3" />
            <path
              d="M24 46 C22 26 34 15 50 15 C66 15 78 26 76 46 C73 35 64 29 52 31 C44 32 38 29 34 26 C30 32 26 38 24 46 Z"
              fill={p.hair}
              stroke={p.hairDark}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M31 22 l1.6 3.4 3.7 .5 -2.7 2.6 .7 3.7 -3.3 -1.8 -3.3 1.8 .7 -3.7 -2.7 -2.6 3.7 -.5 z" fill={p.accent} stroke="#ca8a04" strokeWidth="1.1" strokeLinejoin="round" />
          </>
        ) : who === 'kensuke' ? (
          /* けんすけ：みじかい ツンツンあたま */
          <>
            <path
              d="M25 44 C23 30 30 22 34 20 L36 10 L42 18 L48 7 L54 17 L61 9 L64 20 C71 24 77 32 75 44 C72 35 64 31 50 31 C36 31 28 35 25 44 Z"
              fill={p.hair}
              stroke={p.hairDark}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          </>
        ) : who === 'rino' ? (
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
        {who === 'kensuke' && (
          <g transform="rotate(-20 67 51)">
            <rect x="61" y="48.5" width="12" height="5" rx="2.5" fill="#fcd9b6" stroke="#d6a77a" strokeWidth="1" />
            <rect x="65" y="48.5" width="4" height="5" fill="#f5c79e" />
          </g>
        )}
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
        {hat === 'detective' && (
          /* めいたんていの ぼうし（ハンチング） */
          <g>
            <path d="M22 27 C24 22 28 21 30 22 L30 27 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M70 22 C74 21 78 23 80 27 L70 27 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M28 27 C28 12 40 6 50 6 C60 6 72 12 72 27 Z" fill="#b45309" stroke="#78350f" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M36 11 L36 27 M50 6 L50 27 M64 11 L64 27 M30 17 H70 M29 22 H71" stroke="#78350f" strokeWidth="1" opacity="0.45" />
            <path d="M44 6 Q50 1 56 6 Q50 4 44 6 Z" fill="#78350f" />
          </g>
        )}
        {magnifier && (
          /* むしめがね（みぎてに もつ） */
          <g>
            <path d="M76 86 L71 95" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
            <circle cx="81" cy="77" r="9" fill="#e0f2fe" fillOpacity="0.75" stroke="#b45309" strokeWidth="3" />
            <path d="M77 72 Q79 70 82 70" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
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
