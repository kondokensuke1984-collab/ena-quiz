import React from 'react';
import type { PlayerKey } from '../types';
import { ITEM_BY_ID } from '../lib/items';

// 主人公「あんり」「りの」「みつき」「けんすけ」「ゆうせい」。リポジトリに人物の絵がないので新規に描いたもの。
// js/chars.js と同じ丸っこい絵柄（太い線・#3d2b5e の目・頬の赤み）に寄せている。
//
// むき（dir）：down＝まえ、up＝うしろ、side＝みぎむき（ひだりは flip で かがみに）。
// あし（step）：0＝そろえる、1／2＝こうごに だす（あるく ときに 1→2→1… と かえる）。2026-10-10 に うしろ・よこを 追加。

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
  yusei: { hair: '#3b2a20', hairDark: '#241810', cloth: '#86efac', clothDark: '#16a34a', accent: '#15803d', name: 'ゆうせい' },
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
  dir?: KidDir;
  step?: 0 | 1 | 2;
  wear?: string | null;   // なかまと おなじ きせかえ（fwear のID）。絵文字を 頭・顔・首に かさねる
}

// きせかえの 絵文字を おく ところ（viewBox 0 0 100 120。あたまの まるは 中心 50,42・はんけい 25）
const WEAR_SPOT: Record<string, 'face' | 'neck'> = { fw_glass: 'face', fw_scarf: 'neck' };
function KidWear({ id, dir }: { id: string; dir: KidDir }) {
  const ch = ITEM_BY_ID[id]?.emoji;
  if (!ch) return null;
  const spot = WEAR_SPOT[id] ?? 'head';
  if (spot === 'face' && dir === 'up') return null;   // うしろむきでは めがねは 見えない
  const [y, size] = spot === 'face' ? [45, 24] : spot === 'neck' ? [68, 22] : [12, 30];
  return <text x={dir === 'side' && spot === 'face' ? 56 : 50} y={y} fontSize={size} textAnchor="middle" dominantBaseline="central">{ch}</text>;
}
const wearOnHead = (id: string | null | undefined) => !!id && !!ITEM_BY_ID[id] && !WEAR_SPOT[id];

export type KidDir = 'down' | 'up' | 'side';

function KidSVGBase(props: Props) {
  const { who, size = 110, walking = false, flip = false, ribbon = false, magnifier = false, dir = 'down', step = 0, wear = null } = props;
  const hat = wearOnHead(wear) ? null : (props.hat ?? null);   // あたまの きせかえを つけたら ぼうしは かくす
  const p = PALETTES[who];
  if (dir === 'up' || dir === 'side') {
    return (
      <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible' }} aria-hidden="true">
        <ellipse cx="50" cy="114" rx={walking ? 17 : 20} ry={walking ? 4 : 5} fill="rgba(0,0,0,0.22)" />
        {dir === 'up' ? <KidBack who={who} p={p} hat={hat} ribbon={ribbon} step={step} /> : <KidSide who={who} p={p} hat={hat} ribbon={ribbon} magnifier={magnifier} step={step} />}
        {wear && <KidWear id={wear} dir={dir} />}
      </svg>
    );
  }
  const up1 = step === 1 ? -3 : 0, up2 = step === 2 ? -3 : 0;   // まえむきで あるく：かたあしずつ あげる
  const sw = step === 1 ? 10 : step === 2 ? -10 : 0;             // うでを ふる

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
        <rect x="38" y={96 + up1} width="9" height="14" rx="4.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
        <rect x="53" y={96 + up2} width="9" height="14" rx="4.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
        <ellipse cx="42.5" cy={110 + up1} rx="6.5" ry="4" fill="#fff" stroke={p.clothDark} strokeWidth="1.6" />
        <ellipse cx="57.5" cy={110 + up2} rx="6.5" ry="4" fill="#fff" stroke={p.clothDark} strokeWidth="1.6" />

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
        ) : who === 'yusei' ? (
          /* ゆうせい：ランドセルの かたひも＋ベージュの はんズボン */
          <>
            <path d="M31 88 C30 93 31 98 34 99 L66 99 C69 98 70 93 69 88 Z" fill="#e7d3a8" stroke="#a8875a" strokeWidth="2" strokeLinejoin="round" />
            <path d="M50 89 L50 99" stroke="#a8875a" strokeWidth="1.6" />
            <path d="M39 64 C37 72 36 80 35 88" stroke="#b91c1c" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M61 64 C63 72 64 80 65 88" stroke="#b91c1c" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M44 65 L50 70 L56 65" stroke={p.clothDark} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          /* あんり：エプロンのポケット */
          <>
            <rect x="42" y="78" width="16" height="12" rx="4" fill="#fff" opacity="0.85" />
            <path d="M46 84 h8" stroke={p.clothDark} strokeWidth="1.8" strokeLinecap="round" />
          </>
        )}

        {/* うで */}
        <g transform={`rotate(${sw} 30 68)`}>
          <ellipse cx="27" cy="76" rx="6" ry="8.5" fill={p.cloth} stroke={p.clothDark} strokeWidth="2.2" transform="rotate(-14 27 76)" />
          <circle cx="25" cy="85" r="5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
        </g>
        <g transform={`rotate(${sw} 70 68)`}>
          <ellipse cx="73" cy="76" rx="6" ry="8.5" fill={p.cloth} stroke={p.clothDark} strokeWidth="2.2" transform="rotate(14 73 76)" />
          <circle cx="75" cy="85" r="5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
        </g>

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
        ) : who === 'yusei' ? (
          /* ゆうせい：7:3 わけの さらっとした みじかい かみ（まえがみは みぎへ ながれる） */
          <>
            <path
              d="M25 45 C22 28 33 16 50 16 C67 16 78 27 75 45 C73 38 69 33 63 31 C58 36 48 36 40 32 C44 30 46 28 46 25 C40 29 32 34 25 45 Z"
              fill={p.hair}
              stroke={p.hairDark}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M46 25 C52 22 60 22 66 26" stroke={p.hairDark} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.6" />
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
        {who === 'yusei' && (
          /* ゆうせい：はじめから かけている まるい メガネ */
          <g>
            <path d="M33.5 44 L26 42.5 M66.5 44 L74 42.5" stroke="#1e3a8a" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M48 44.5 Q50 42.5 52 44.5" stroke="#1e3a8a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <circle cx="41" cy="45" r="7.3" fill="#fff" fillOpacity="0.25" stroke="#1e3a8a" strokeWidth="2" />
            <circle cx="59" cy="45" r="7.3" fill="#fff" fillOpacity="0.25" stroke="#1e3a8a" strokeWidth="2" />
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
      {wear && <KidWear id={wear} dir="down" />}
    </svg>
  );
}

// ── うしろむき・よこむき ──
type PartProps = { who: PlayerKey; p: Palette; hat: Props['hat']; ribbon: boolean; step: 0 | 1 | 2; magnifier?: boolean };
const HAIR_W = 2.2;

/** うしろむき：かおは かかず、かみで あたまを おおう。ランドセル・リボン・しっぽ（りののフード）など せなかの もの */
function KidBack({ who, p, hat, ribbon, step }: PartProps) {
  const up1 = step === 1 ? -3 : 0, up2 = step === 2 ? -3 : 0;
  const sw = step === 1 ? -10 : step === 2 ? 10 : 0;
  const lower = who === 'kensuke' ? { fill: p.accent, line: '#172554' } : who === 'yusei' ? { fill: '#e7d3a8', line: '#a8875a' } : null;
  return (
    <g>
      <rect x="38" y={96 + up1} width="9" height="14" rx="4.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
      <rect x="53" y={96 + up2} width="9" height="14" rx="4.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
      <ellipse cx="42.5" cy={110 + up1} rx="6.5" ry="4" fill="#fff" stroke={p.clothDark} strokeWidth="1.6" />
      <ellipse cx="57.5" cy={110 + up2} rx="6.5" ry="4" fill="#fff" stroke={p.clothDark} strokeWidth="1.6" />
      <path d="M50 62 C38 62 32 70 30 84 C29 92 30 98 34 99 L66 99 C70 98 71 92 70 84 C68 70 62 62 50 62 Z" fill={p.cloth} stroke={p.clothDark} strokeWidth="2.4" strokeLinejoin="round" />
      {lower && (
        <>
          <path d="M31 88 C30 93 31 98 34 99 L66 99 C69 98 70 93 69 88 Z" fill={lower.fill} stroke={lower.line} strokeWidth="2" strokeLinejoin="round" />
          <path d="M50 89 L50 99" stroke={lower.line} strokeWidth="1.6" />
        </>
      )}
      {who === 'anri' && (
        /* エプロンの うしろの ちょうちょむすび */
        <g transform="translate(50,84)">
          <path d="M0 0 L-8 -5 L-8 5 Z M0 0 L8 -5 L8 5 Z" fill="#fff" stroke={p.clothDark} strokeWidth="1.4" strokeLinejoin="round" />
          <circle r="2.4" fill="#fff" stroke={p.clothDark} strokeWidth="1.2" />
        </g>
      )}
      {who === 'mitsuki' && <path d="M33 84 Q50 88 67 84" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />}
      <g transform={`rotate(${sw} 30 68)`}>
        <ellipse cx="27" cy="76" rx="6" ry="8.5" fill={p.cloth} stroke={p.clothDark} strokeWidth="2.2" transform="rotate(-14 27 76)" />
        <circle cx="25" cy="85" r="5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
      </g>
      <g transform={`rotate(${-sw} 70 68)`}>
        <ellipse cx="73" cy="76" rx="6" ry="8.5" fill={p.cloth} stroke={p.clothDark} strokeWidth="2.2" transform="rotate(14 73 76)" />
        <circle cx="75" cy="85" r="5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
      </g>
      {who === 'yusei' && (
        /* ランドセル */
        <g>
          <rect x="35" y="64" width="30" height="28" rx="6" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
          <path d="M35 74 Q50 80 65 74 L65 70 C65 66 62 64 58 64 L42 64 C38 64 35 66 35 70 Z" fill="#b91c1c" stroke="#991b1b" strokeWidth="1.6" />
          <rect x="47" y="76" width="6" height="5" rx="1.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
        </g>
      )}
      {/* あたま（うしろは ぜんぶ かみ） */}
      <circle cx="50" cy="42" r="25" fill={SKIN} stroke={SKIN_LINE} strokeWidth="2" />
      {who === 'rino' ? (
        <>
          <ellipse cx="33" cy="12" rx="7" ry="16" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} transform="rotate(-12 33 12)" />
          <ellipse cx="67" cy="12" rx="7" ry="16" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} transform="rotate(12 67 12)" />
          <circle cx="50" cy="42" r="26" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} />
          <path d="M50 18 L50 66" stroke={p.hairDark} strokeWidth="1.4" opacity="0.5" />
        </>
      ) : (
        <>
          {who === 'anri' && (
            <>
              <circle cx="22" cy="42" r="8.5" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} />
              <circle cx="78" cy="42" r="8.5" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} />
            </>
          )}
          {who === 'kensuke' && (
            <path d="M30 26 L34 12 L42 20 L48 7 L54 19 L62 10 L68 24 Z" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} strokeLinejoin="round" />
          )}
          <path d="M25 46 C23 26 35 16 50 16 C65 16 77 26 75 46 C74 58 66 66 50 66 C34 66 26 58 25 46 Z" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} strokeLinejoin="round" />
          <path d="M38 58 Q50 62 62 58" stroke={p.hairDark} strokeWidth="1.4" fill="none" opacity="0.5" />
          {who === 'mitsuki' && (
            /* ポニーテール（まんなかに たれる） */
            <>
              <path d="M44 30 C40 44 42 62 48 72 C52 76 58 74 58 68 C60 56 58 42 56 30 Z" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} strokeLinejoin="round" />
              <circle cx="50" cy="30" r="4" fill="#f472b6" stroke="#db2777" strokeWidth="1.3" />
            </>
          )}
          {who === 'anri' && (
            <g transform="translate(30,22)">
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse key={deg} cx="0" cy="-4.5" rx="3" ry="4.5" fill={p.accent} transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="2.4" fill="#fde68a" />
            </g>
          )}
        </>
      )}
      {ribbon && (
        <g transform="translate(70,20)">
          <path d="M0 0 L-9 -5 L-9 6 Z" fill="#fb7185" stroke="#e11d48" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M0 0 L9 -5 L9 6 Z" fill="#fb7185" stroke="#e11d48" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="0" cy="0.5" r="3" fill="#f43f5e" stroke="#e11d48" strokeWidth="1.4" />
        </g>
      )}
      {hat === 'cap' && <path d="M28 26 C28 13 40 7 50 7 C60 7 72 13 72 26 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.2" strokeLinejoin="round" />}
      {hat === 'detective' && (
        <g>
          <path d="M28 27 C28 12 40 6 50 6 C60 6 72 12 72 27 Z" fill="#b45309" stroke="#78350f" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M36 11 L36 27 M50 6 L50 27 M64 11 L64 27 M30 17 H70 M29 22 H71" stroke="#78350f" strokeWidth="1" opacity="0.45" />
        </g>
      )}
      {hat === 'crown' && (
        <path d="M31 22 L31 8 L40 15 L50 5 L60 15 L69 8 L69 22 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2.2" strokeLinejoin="round" />
      )}
    </g>
  );
}

/** みぎむき：かおは みぎがわ。あしと うでを まえうしろに ふる */
function KidSide({ who, p, hat, ribbon, magnifier, step }: PartProps) {
  const sw = step === 1 ? 22 : step === 2 ? -22 : 0;   // まえあしの かくど
  const leg = (rot: number, back: boolean) => (
    <g transform={`rotate(${rot} 50 96)`}>
      <rect x="45.5" y="96" width="9" height="14" rx="4.5" fill={back ? '#f6dcc6' : SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
      <ellipse cx="52.5" cy="110" rx="7.5" ry="4" fill={back ? '#f1f5f9' : '#fff'} stroke={p.clothDark} strokeWidth="1.6" />
    </g>
  );
  const arm = (rot: number, back: boolean) => (
    <g transform={`rotate(${rot} 50 68)`}>
      <ellipse cx="50" cy="77" rx="5.5" ry="9" fill={back ? p.clothDark : p.cloth} stroke={p.clothDark} strokeWidth="2.2" />
      <circle cx="50" cy="87" r="4.8" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
    </g>
  );
  const lower = who === 'kensuke' ? { fill: p.accent, line: '#172554' } : who === 'yusei' ? { fill: '#e7d3a8', line: '#a8875a' } : null;
  return (
    <g>
      {leg(-sw, true)}
      {arm(sw * 0.9, true)}
      {who === 'yusei' && <rect x="31" y="64" width="12" height="27" rx="4" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />}
      <path d="M50 62 C42 62 37 70 36 84 C35 92 36 98 39 99 L62 99 C65 98 66 92 65 84 C63 70 58 62 50 62 Z" fill={p.cloth} stroke={p.clothDark} strokeWidth="2.4" strokeLinejoin="round" />
      {lower && <path d="M37 88 C36 93 36 98 39 99 L62 99 C65 98 65 93 64 88 Z" fill={lower.fill} stroke={lower.line} strokeWidth="2" strokeLinejoin="round" />}
      {who === 'anri' && <rect x="52" y="78" width="10" height="11" rx="3" fill="#fff" opacity="0.85" />}
      {who === 'mitsuki' && <path d="M37 84 Q50 88 64 84" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {who === 'rino' && <path d="M58 66 L59 77" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />}
      {leg(sw, false)}
      {/* あたま */}
      <circle cx="52" cy="42" r="24.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="2" />
      {who === 'rino' ? (
        <>
          <ellipse cx="38" cy="14" rx="7" ry="16" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} transform="rotate(-30 38 14)" />
          <ellipse cx="38" cy="15" rx="3" ry="10" fill="#fde7f3" transform="rotate(-30 38 15)" />
          <ellipse cx="48" cy="12" rx="7" ry="16" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} transform="rotate(-18 48 12)" />
          <path d="M27 50 C24 28 36 17 52 17 C66 17 76 26 76 40 C70 32 60 30 54 32 C52 42 46 52 40 62 C33 60 28 56 27 50 Z" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} strokeLinejoin="round" />
        </>
      ) : (
        <>
          {who === 'mitsuki' && (
            <path d="M32 28 C18 30 14 48 20 62 C22 68 28 68 28 62 C24 52 26 40 34 34 Z" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} strokeLinejoin="round" />
          )}
          {who === 'anri' && <circle cx="28" cy="40" r="8.5" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} />}
          {who === 'kensuke' && (
            <path d="M28 34 L24 22 L34 24 L34 12 L42 19 L46 8 L52 17 L60 10 L62 20 L72 22 Z" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} strokeLinejoin="round" />
          )}
          <path d="M28 52 C24 30 36 16 52 16 C66 16 77 25 76 38 C70 31 62 29 56 30 C54 36 50 40 46 42 C44 50 40 58 36 62 C31 60 28 56 28 52 Z" fill={p.hair} stroke={p.hairDark} strokeWidth={HAIR_W} strokeLinejoin="round" />
          {who === 'yusei' && <path d="M56 30 C62 27 70 28 75 33" stroke={p.hairDark} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.6" />}
          {who === 'mitsuki' && <circle cx="34" cy="28" r="3.6" fill="#f472b6" stroke="#db2777" strokeWidth="1.3" />}
          {who === 'anri' && (
            <g transform="translate(58,20)">
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse key={deg} cx="0" cy="-4.5" rx="3" ry="4.5" fill={p.accent} transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="2.4" fill="#fde68a" />
            </g>
          )}
        </>
      )}
      {/* かお（みぎがわ） */}
      <ellipse cx="64" cy="45" rx="3.4" ry="4.6" fill={INK} />
      <circle cx="65.3" cy="43.2" r="1.4" fill="#fff" />
      <ellipse cx="68" cy="52.5" rx="4" ry="2.5" fill="#fda4af" opacity="0.75" />
      <path d="M64 54.5 Q68 57.5 72 54" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
      {who === 'kensuke' && (
        <g transform="rotate(-20 68 50)">
          <rect x="63" y="47.5" width="10" height="5" rx="2.5" fill="#fcd9b6" stroke="#d6a77a" strokeWidth="1" />
        </g>
      )}
      {who === 'yusei' && (
        <g>
          <path d="M56.5 44 L42 41.5" stroke="#1e3a8a" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="64" cy="45" r="7.3" fill="#fff" fillOpacity="0.25" stroke="#1e3a8a" strokeWidth="2" />
        </g>
      )}
      {arm(-sw * 0.9, false)}
      {magnifier && (
        <g transform={`rotate(${-sw * 0.9} 50 68)`}>
          <path d="M52 88 L58 96" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <circle cx="62" cy="82" r="8" fill="#e0f2fe" fillOpacity="0.75" stroke="#b45309" strokeWidth="3" />
        </g>
      )}
      {ribbon && (
        <g transform="translate(32,22)">
          <path d="M0 0 L-9 -5 L-9 6 Z" fill="#fb7185" stroke="#e11d48" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M0 0 L9 -5 L9 6 Z" fill="#fb7185" stroke="#e11d48" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="0" cy="0.5" r="3" fill="#f43f5e" stroke="#e11d48" strokeWidth="1.4" />
        </g>
      )}
      {hat === 'cap' && (
        <g>
          <path d="M30 26 C30 13 42 7 52 7 C62 7 74 13 74 26 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M72 26 C84 26 88 29 88 32 L70 32 Z" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2.2" strokeLinejoin="round" />
        </g>
      )}
      {hat === 'detective' && (
        <g>
          <path d="M70 22 C76 21 80 23 82 27 L70 27 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M30 27 C30 12 42 6 52 6 C62 6 74 12 74 27 Z" fill="#b45309" stroke="#78350f" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M38 11 L38 27 M52 6 L52 27 M66 11 L66 27 M32 17 H72 M31 22 H73" stroke="#78350f" strokeWidth="1" opacity="0.45" />
        </g>
      )}
      {hat === 'crown' && (
        <path d="M34 22 L34 8 L43 15 L52 5 L61 15 L70 8 L70 22 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2.2" strokeLinejoin="round" />
      )}
    </g>
  );
}

export const KidSVG = React.memo(KidSVGBase);
