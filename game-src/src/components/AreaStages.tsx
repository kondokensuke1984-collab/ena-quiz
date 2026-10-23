import React from 'react';
import { ISLAND_H, ISLAND_W } from '../lib/island';
import { moonLitPath, SYNODIC, type TimeOfDay } from '../lib/sky';
import { BuildingSVG } from './BuildingSVG';

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

// 🏆 ほんものの ゆうしょう トロフィー（緑ヶ丘SC・2026-10-18）。おうちの かべの かざりだな。タップで せつめい
// ゆうしょう するたびに ここへ 1つ たす（かべに ならぶ。6こまで）。banner＝たれまく、l1〜l3＝きんの プレート、toast＝タップの ことば
export const TROPHIES = [
  { id: '20261018', banner: '初優勝！', l1: 'サッカーがもっと好きになる', l2: '少年少女大会2026', l3: '2026.10.18　緑ヶ丘SC 優勝',
    toast: '🏆 しゅく はつゆうしょう！ 10がつ 18にちの たいかいで、みどりがおか SC が ゆうしょうしたよ！' },
];
// 1つの たなは 1000×750 の (272〜528, 58〜388) の 絵を 0.38ばい（よこ 97・たて 125）。ならぶ ばしょ（うえの まんなか）は まんなか→ひだり→みぎ、2だんめも おなじ
const TROPHY_SCALE = 0.38;
const TROPHY_SLOTS = [[400, 100], [290, 100], [510, 100], [400, 245], [290, 245], [510, 245]];
export function trophyAt(p: { x: number; y: number }) {
  return TROPHIES.slice(0, TROPHY_SLOTS.length).find((_, i) => {
    const [cx, top] = TROPHY_SLOTS[i];
    return p.x * 1000 >= cx - 50 && p.x * 1000 <= cx + 50 && p.y * 750 >= top && p.y * 750 <= top + 128;
  });
}
function TrophyShelf({ t, i }: { t: typeof TROPHIES[number]; i: number }) {
  const [cx, top] = TROPHY_SLOTS[i];
  return (
    <g transform={`translate(${cx} ${top}) scale(${TROPHY_SCALE}) translate(-400 -58)`}>
      <defs>
        <radialGradient id="tsGlow" cx=".5" cy=".55" r=".6"><stop offset="0" stopColor="#fef9c3" stopOpacity=".45" /><stop offset="1" stopColor="#fef9c3" stopOpacity="0" /></radialGradient>
        <linearGradient id="tsGold" x1="0" x2="1"><stop offset="0" stopColor="#b8860b" /><stop offset=".45" stopColor="#ffe27a" /><stop offset=".6" stopColor="#f2c230" /><stop offset="1" stopColor="#a87708" /></linearGradient>
      </defs>
      {/* かざりだな（おくは みどりの ぬの） */}
      <rect x="272" y="58" width="256" height="248" rx="14" fill="#7c2d12" />
      <rect x="284" y="70" width="232" height="226" rx="8" fill="#166534" />
      <rect x="284" y="70" width="232" height="226" rx="8" fill="url(#tsGlow)" />
      {/* 「祝 初優勝」の たれまく */}
      <path d="M306 78 H494 V104 L482 114 L470 104 H330 L318 114 L306 104 Z" fill="#c8102e" stroke="#7f1d1d" strokeWidth="2" />
      <circle cx="342" cy="92" r="11" fill="#fff" stroke="#fcd34d" strokeWidth="2" />
      <text x="342" y="97" fontSize="14" fontWeight="900" textAnchor="middle" fill="#c8102e">祝</text>
      <text x="418" y="99" fontSize="18" fontWeight="900" textAnchor="middle" fill="#fff" letterSpacing="2">{t.banner}</text>
      {/* トロフィー */}
      <g transform="translate(330 118) scale(2.05)">
        <path d="M14 12 C2 12 2 34 20 38" fill="none" stroke="#c99a14" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M54 12 C66 12 66 34 48 38" fill="none" stroke="#c99a14" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M12 6 H56 V18 C56 34 46 44 34 44 C22 44 12 34 12 18 Z" fill="url(#tsGold)" stroke="#8a6206" strokeWidth="1.2" />
        <path d="M34 13 l2.6 5.4 5.9.8 -4.3 4.1 1 5.8 -5.2-2.8 -5.2 2.8 1-5.8 -4.3-4.1 5.9-.8z" fill="#fff8d8" />
        <path d="M18 10 V18 C18 26 21 32 25 36" fill="none" stroke="#fffbe6" strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
        <rect x="30" y="44" width="8" height="10" fill="url(#tsGold)" stroke="#8a6206" strokeWidth="1" />
        <path d="M22 54 H46 L49 62 H19 Z" fill="url(#tsGold)" stroke="#8a6206" strokeWidth="1.2" />
        <rect x="15" y="62" width="38" height="14" rx="2" fill="#1f7a3a" stroke="#145228" strokeWidth="1.2" />
        <rect x="22" y="66" width="24" height="6" rx="1" fill="#e8c34a" />
      </g>
      {/* サッカーボール */}
      <g transform="translate(476 272)">
        <ellipse cx="0" cy="14" rx="16" ry="4" fill="rgba(0,0,0,0.25)" />
        <circle r="15" fill="#fff" stroke="#1d2b22" strokeWidth="2" />
        <path d="M0 -6 l5.7 4.1 -2.2 6.7 h-7 l-2.2 -6.7 z" fill="#1d2b22" />
        <path d="M0 -6 V-14.6 M5.7 -1.9 L13.6 -4.6 M3.5 4.8 L8.6 12 M-3.5 4.8 L-8.6 12 M-5.7 -1.9 L-13.6 -4.6" stroke="#1d2b22" strokeWidth="1.6" />
        <path d="M-5 -14 L0 -14.8 L5 -14 M12 -8 L14 -3 M9.5 11 L13 6.5 M-9.5 11 L-13 6.5 M-12 -8 L-14 -3" stroke="#1d2b22" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      </g>
      {/* たな いた */}
      <rect x="276" y="288" width="248" height="16" rx="4" fill="#92400e" stroke="#7c2d12" strokeWidth="2" />
      {/* きんの プレート */}
      <rect x="282" y="310" width="236" height="78" rx="6" fill="#fcd34d" stroke="#b45309" strokeWidth="2.5" />
      <rect x="288" y="316" width="224" height="66" rx="4" fill="none" stroke="#b45309" strokeWidth="1" opacity=".6" />
      <text x="400" y="336" fontSize="16" fontWeight="900" textAnchor="middle" fill="#3a2c00">{t.l1}</text>
      <text x="400" y="356" fontSize="16" fontWeight="900" textAnchor="middle" fill="#3a2c00">{t.l2}</text>
      <text x="400" y="376" fontSize="14" fontWeight="900" textAnchor="middle" fill="#14532d">{t.l3}</text>
      {/* きらきら */}
      {[[312, 140], [500, 132], [318, 250], [498, 214], [440, 124]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 8} l2.4 5.6 5.6 2.4 -5.6 2.4 -2.4 5.6 -2.4 -5.6 -5.6 -2.4 5.6 -2.4 z`} fill="#fef08a" className="twinkle" />
      ))}
    </g>
  );
}

// 📜 ほんものの しょうじょう（緑ヶ丘シルバー・2026-10-19）。まどの みぎの かべに がくで かざる。タップで せつめい
// もらうたびに 1つ たす（2まいまで）。rank＝「第2位」など、medal＝きん/ぎん/どう、l1〜l2＝たいかい、team＝チーム、date＝ひづけ
export const CERTS = [
  { id: 'c20261019', rank: '第2位', medal: 'silver' as const, team: '緑ヶ丘シルバー', l1: '2026年度', l2: '2年生秋季大会',
    toast: '📜 しょうじょう！ 2026ねんど 2ねんせい しゅうき たいかいで、みどりがおか シルバーが 2いに なったよ！' },
];
// 1まいの がくは 200×270 の 絵を 0.5ばい（よこ 100・たて 135）。まどの みぎ、うえ→した
const CERT_SCALE = 0.5;
const CERT_SLOTS = [[876, 92], [876, 244]];
const CERT_MEDAL = { gold: ['#fde047', '#ca8a04'], silver: ['#f1f5f9', '#94a3b8'], bronze: ['#fdba74', '#b45309'] };
export function certAt(p: { x: number; y: number }) {
  return CERTS.slice(0, CERT_SLOTS.length).find((_, i) => {
    const [x, y] = CERT_SLOTS[i];
    return p.x * 1000 >= x && p.x * 1000 <= x + 100 && p.y * 750 >= y && p.y * 750 <= y + 135;
  });
}
function CertFrame({ c, i }: { c: typeof CERTS[number]; i: number }) {
  const [x, y] = CERT_SLOTS[i];
  const [m1, m2] = CERT_MEDAL[c.medal];
  return (
    <g transform={`translate(${x} ${y}) scale(${CERT_SCALE})`}>
      {/* ひも と くぎ */}
      <path d="M60 4 L100 -18 L140 4" fill="none" stroke="#78350f" strokeWidth="3" />
      <circle cx="100" cy="-18" r="5" fill="#a16207" />
      {/* がく（きんの ふち） */}
      <rect x="0" y="0" width="200" height="270" rx="4" fill="#b8860b" stroke="#78350f" strokeWidth="3" />
      <rect x="8" y="8" width="184" height="254" fill="#fde68a" />
      {/* かみ と もようの わく */}
      <rect x="14" y="14" width="172" height="242" fill="#fffdf5" />
      <rect x="22" y="22" width="156" height="226" fill="none" stroke="#c9a227" strokeWidth="3" />
      <rect x="27" y="27" width="146" height="216" fill="none" stroke="#c9a227" strokeWidth="1" />
      {[[22, 22], [178, 22], [22, 248], [178, 248]].map(([cx, cy], k) => <circle key={k} cx={cx} cy={cy} r="5" fill="#c9a227" />)}
      {/* もじ */}
      <text x="100" y="68" fontSize="34" fontWeight="900" textAnchor="middle" fill="#1f2937" letterSpacing="10">賞状</text>
      <text x="100" y="114" fontSize="36" fontWeight="900" textAnchor="middle" fill="#b91c1c">{c.rank}</text>
      <text x="100" y="148" fontSize="21" fontWeight="900" textAnchor="middle" fill="#14532d">{c.team}</text>
      <text x="100" y="176" fontSize="14" fontWeight="700" textAnchor="middle" fill="#374151">{c.l1}</text>
      <text x="100" y="194" fontSize="14" fontWeight="700" textAnchor="middle" fill="#374151">{c.l2}</text>
      {/* はんこ */}
      <rect x="138" y="208" width="26" height="26" rx="3" fill="none" stroke="#dc2626" strokeWidth="2.5" />
      <text x="151" y="227" fontSize="15" fontWeight="900" textAnchor="middle" fill="#dc2626">印</text>
      {/* メダルの シール */}
      <g transform="translate(56 222)">
        <path d="M-10 4 L-16 30 L-7 25 L-2 32 L2 8 Z M10 4 L16 30 L7 25 L2 32 L-2 8 Z" fill="#2563eb" />
        <circle r="16" fill={m1} stroke={m2} strokeWidth="3" />
        <text y="6" fontSize="16" fontWeight="900" textAnchor="middle" fill={m2}>{c.rank.replace(/\D/g, '')}</text>
      </g>
      {[[34, 40], [168, 92], [40, 196]].map(([sx, sy], k) => (
        <path key={k} d={`M${sx} ${sy - 7} l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z`} fill="#fde047" className="twinkle" />
      ))}
    </g>
  );
}

// 🎮 まどの したの ゲームコーナー（2026-10-19）。テレビ＋むかしの ゲームき（なまえ・マークは かかない）。
// テレビか ゲームきを タップ、または ちかくで「ゲームを する」→ /sora/（コロンのそらとび。あそべる きまりは ゲームの がわで みる）
export const GAME_HIT = { x0: 0.6, x1: 0.84, y0: 0.34, y1: 0.62 };
export const GAME_SPOT = { x: 0.72, y: 0.62 };
export function gameAt(p: { x: number; y: number }) {
  return p.x >= GAME_HIT.x0 && p.x <= GAME_HIT.x1 && p.y >= GAME_HIT.y0 && p.y <= GAME_HIT.y1;
}
function GameCorner() {
  const px = (x: number, y: number, w: number, h: number, c: string, k?: string) => <rect key={k} x={x} y={y} width={w} height={h} fill={c} />;
  return (
    <g>
      {/* テレビだい */}
      <rect x="606" y="372" width="228" height="58" rx="6" fill="#92400e" stroke="#5b2a0a" strokeWidth="3" />
      <rect x="606" y="372" width="228" height="9" rx="4" fill="#b45309" />
      <path d="M720 384 V424" stroke="#5b2a0a" strokeWidth="2" />
      <circle cx="710" cy="404" r="3" fill="#fcd34d" /><circle cx="730" cy="404" r="3" fill="#fcd34d" />
      {/* テレビ */}
      <rect x="690" y="364" width="60" height="10" rx="3" fill="#1f2937" />
      <rect x="636" y="256" width="168" height="112" rx="12" fill="#374151" stroke="#111827" strokeWidth="4" />
      <rect x="648" y="268" width="144" height="88" rx="5" fill="#7dd3fc" />
      {/* がめんの なか：コロンのそらとび */}
      <g transform="translate(648 268)">
        {px(10, 14, 22, 6, '#fff')}{px(14, 10, 12, 4, '#fff')}{px(100, 20, 26, 6, '#fff')}{px(106, 16, 12, 4, '#fff')}
        <ellipse cx="26" cy="74" rx="24" ry="30" fill="#5cc84a" stroke="#1d5a1d" strokeWidth="1.5" />
        <ellipse cx="118" cy="74" rx="18" ry="20" fill="#5cc84a" stroke="#1d5a1d" strokeWidth="1.5" />
        {px(0, 72, 144, 16, '#ec8a30')}{px(0, 72, 144, 3, '#ffd6a6')}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => px(4 + i * 16, 78, 6, 2, '#b85614', 'g' + i))}
        {px(58, 42, 11, 11, '#f5b014')}{px(61, 45, 5, 5, '#fff')}
        {[0, 1, 2].map((i) => <ellipse key={'c' + i} cx={86 + i * 10} cy={30} rx="3" ry="4.5" fill="#f8d040" stroke="#9a5a08" strokeWidth="1" className="twinkle" />)}
        {/* コロン（はっぱで きんの しっぽ。そらを とんでいる） */}
        <g transform="translate(34 34)">
          {px(-7, 11, 7, 4, '#ffd23a')}{px(-9, 13, 3, 3, '#fff')}
          {px(0, 0, 2, 4, '#6b3a1e')}{px(10, 0, 2, 4, '#6b3a1e')}
          {px(-2, 4, 16, 4, '#f5a571')}{px(-2, 8, 16, 2, '#fbe6c8')}{px(2, 5, 1, 2, '#2a1a10')}{px(9, 5, 1, 2, '#2a1a10')}
          {px(1, 10, 10, 7, '#f5a571')}{px(5, 1, 3, 2, '#2f9e3a')}
        </g>
      </g>
      <rect x="648" y="268" width="144" height="88" rx="5" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="3" />
      <circle cx="786" cy="362" r="2.5" fill="#22c55e" />
      {/* ゲームき（ゆかの うえ） */}
      <path d="M688 446 C 700 452 740 450 748 456" fill="none" stroke="#374151" strokeWidth="2.5" />
      <path d="M684 440 C 676 380 664 380 666 372" fill="none" stroke="#374151" strokeWidth="2" />
      <rect x="640" y="424" width="56" height="30" rx="7" fill="#d4d4dc" stroke="#6b7280" strokeWidth="2" />
      <rect x="646" y="418" width="44" height="12" rx="4" fill="#b8b8c4" stroke="#6b7280" strokeWidth="1.5" />
      <rect x="654" y="411" width="28" height="11" rx="2" fill="#f97316" stroke="#9a3412" strokeWidth="1.5" />
      <circle cx="668" cy="416" r="3" fill="#ffe2b0" />
      <rect x="646" y="438" width="10" height="5" rx="2" fill="#7c3aed" /><rect x="680" y="438" width="10" height="5" rx="2" fill="#7c3aed" />
      {/* コントローラー */}
      <g transform="translate(748 446)">
        <rect x="0" y="0" width="58" height="22" rx="11" fill="#d4d4dc" stroke="#6b7280" strokeWidth="2" />
        <path d="M10 9 h4 v-4 h4 v4 h4 v4 h-4 v4 h-4 v-4 h-4 z" fill="#374151" />
        <circle cx="44" cy="7" r="3" fill="#3b82f6" /><circle cx="50" cy="11" r="3" fill="#ef4444" />
        <circle cx="38" cy="11" r="3" fill="#22c55e" /><circle cx="44" cy="15" r="3" fill="#facc15" />
      </g>
    </g>
  );
}

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
      {TROPHIES.slice(0, TROPHY_SLOTS.length).map((t, i) => <TrophyShelf key={t.id} t={t} i={i} />)}
      {CERTS.slice(0, CERT_SLOTS.length).map((c, i) => <CertFrame key={c.id} c={c} i={i} />)}
      <GameCorner />
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

// ── 🌕 月の じめん（ロケットで いける。うえは くろい 空と ちきゅう）──
/** タップすると まめちしき（割合の 座標・はんけい） */
export const MOON_HITS: { id: string; x: number; y: number; r: number; text: string }[] = [
  { id: 'earth', x: 0.2, y: 0.17, r: 0.09, text: '' },   // ちきゅうは みちかけで ことばが かわる（IslandScreen で つくる）
  { id: 'flag', x: 0.44, y: 0.47, r: 0.06, text: '🚩 1969ねん、アポロ11ごうの ひとが はじめて 月を あるいたよ。月には 空気が ないから、はたは よこぼうで ひろげて あるんだ。' },
  { id: 'c1', x: 0.24, y: 0.68, r: 0.08, text: '🕳️ クレーターは いんせきが ぶつかった あと。月には 雨や かぜが ないから、あとが ずっと のこるよ。' },
  { id: 'c2', x: 0.6, y: 0.78, r: 0.07, text: '🕳️ 月の いちばん 大きい クレーターは さしわたし 2000km いじょう。にほんが すっぽり はいるくらい！' },
  { id: 'c3', x: 0.82, y: 0.86, r: 0.05, text: '🦶 月には かぜが ないから、あしあとは なんまんねんも きえずに のこるんだって。' },
  { id: 'c4', x: 0.12, y: 0.86, r: 0.05, text: '🌡️ 月の ひるは 100ど いじょう、よるは マイナス 170ど。だから うちゅうふくが ひつようだよ。' },
];
const MOON_CRATERS = [
  [240, 510, 70, 26], [600, 585, 60, 22], [820, 645, 36, 13], [120, 645, 34, 12],
  [400, 640, 22, 8], [720, 470, 26, 9], [520, 470, 16, 6], [920, 520, 20, 7], [330, 715, 18, 6],
] as const;
const MOON_STARS = Array.from({ length: 46 }, (_, i) => [(i * 211) % 1000, (i * 97) % 300, i % 7 === 0 ? 2.6 : 1.4] as const);

/** 月から みた ちきゅうは、地球から みた 月と ぎゃくの みちかけ（しんげつの とき まんちきゅう） */
export function earthAge(moonAge: number): number { return (moonAge + SYNODIC / 2) % SYNODIC; }

function MoonGroundBase({ moonAge }: { moonAge: number }) {
  const ea = earthAge(moonAge);
  return (
    <>
      <defs>
        <linearGradient id="moonSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020617" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <radialGradient id="moonSoil" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </radialGradient>
        <clipPath id="earthLit"><path d={moonLitPath(ea, 46)} /></clipPath>
      </defs>
      <rect x="0" y="0" width={ISLAND_W} height={ISLAND_H} fill="url(#moonSky)" />
      {MOON_STARS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" className={i % 3 ? undefined : 'twinkle'} />)}
      {/* ちきゅう（くらい ところも うっすら みえる） */}
      <g transform={`translate(${MOON_HITS[0].x * ISLAND_W} ${MOON_HITS[0].y * ISLAND_H})`}>
        <circle r="56" fill="rgba(96,165,250,0.18)" />
        <circle r="46" fill="#1e293b" />
        <g clipPath="url(#earthLit)">
          <circle r="46" fill="#3b82f6" />
          <path d="M-30 -20 q12 -14 26 -4 q6 14 -8 20 q-14 4 -18 -16 Z M6 4 q18 -6 26 8 q-4 18 -20 22 q-10 -12 -6 -30 Z" fill="#22c55e" />
          <path d="M-40 10 q20 -4 34 6 M-10 -36 q20 6 40 -2" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.75" />
        </g>
        <text y="70" fontSize="15" fontWeight="900" textAnchor="middle" fill="#bfdbfe">ちきゅう</text>
      </g>
      {/* じめん */}
      <path d={`M0 ${ISLAND_H * 0.42} Q 160 ${ISLAND_H * 0.36} 330 ${ISLAND_H * 0.41} T 680 ${ISLAND_H * 0.4} T 1000 ${ISLAND_H * 0.39} L1000 ${ISLAND_H} L0 ${ISLAND_H} Z`} fill="url(#moonSoil)" />
      <path d={`M0 ${ISLAND_H * 0.42} Q 160 ${ISLAND_H * 0.36} 330 ${ISLAND_H * 0.41} T 680 ${ISLAND_H * 0.4} T 1000 ${ISLAND_H * 0.39}`} fill="none" stroke="#f8fafc" strokeWidth="4" />
      {MOON_CRATERS.map(([x, y, rx, ry], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#94a3b8" stroke="#cbd5e1" strokeWidth="3" />
          <ellipse cx={x} cy={y + ry * 0.2} rx={rx * 0.78} ry={ry * 0.62} fill="#64748b" />
        </g>
      ))}
      {[[90, 470], [470, 560], [880, 720], [180, 740], [700, 700]].map(([x, y], i) => (
        <ellipse key={'r' + i} cx={x} cy={y} rx="12" ry="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
      ))}
      {/* はた（よこぼうで ひろげて ある） */}
      <g transform={`translate(${MOON_HITS[1].x * ISLAND_W} ${MOON_HITS[1].y * ISLAND_H + 30})`}>
        <ellipse cx="0" cy="2" rx="18" ry="5" fill="rgba(0,0,0,0.2)" />
        <path d="M0 0 L0 -96 M0 -92 L58 -92" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
        <rect x="2" y="-90" width="54" height="34" fill="#fff" stroke="#4c1d95" strokeWidth="2.5" />
        <circle cx="29" cy="-73" r="9" fill="#dc2626" />
      </g>
      {/* おりてきた ロケット */}
      <g transform={`translate(${0.85 * ISLAND_W} ${0.5 * ISLAND_H})`}>
        <BuildingSVG id="bd_rocket" />
      </g>
    </>
  );
}
export const MoonGround = React.memo(MoonGroundBase);

// ── 🔴 火星の じめん（その日 3教科クリアで いける。空は うすい オレンジ、ゆうやけは あおい）──
export const MARS_HITS: { id: string; x: number; y: number; r: number; text: string }[] = [
  { id: 'olympus', x: 0.3, y: 0.33, r: 0.1, text: '🌋 あれは オリンポスさん。たかさ やく 2まん5000m で、たいようけいで いちばん たかい やま。ふじさんの 7ばいくらい！' },
  { id: 'phobos', x: 0.62, y: 0.12, r: 0.05, text: '🥔 フォボスは 火星の 月。じゃがいもみたいな かたちで、1にちに 3かいも 空を まわるよ。' },
  { id: 'deimos', x: 0.82, y: 0.2, r: 0.04, text: '🌑 ダイモスは もう ひとつの 火星の 月。さしわたし やく 12km の ちいさな 月だよ。' },
  { id: 'earth', x: 0.12, y: 0.1, r: 0.05, text: '🌍 あの あおい ほしが ちきゅう！ 火星から みると、よあけや ゆうがたに ひかる ほしに みえるよ。' },
  { id: 'rover', x: 0.56, y: 0.6, r: 0.07, text: '🤖 たんさしゃ（ローバー）が つちや いわを しらべて いるよ。むかしの 火星には 水が ながれて いた あとが あるんだ。' },
  { id: 'soil', x: 0.22, y: 0.78, r: 0.08, text: '🧲 火星の つちが あかいのは、てつの さびが ふくまれて いるから。くぎが さびて あかく なるのと おなじだよ。' },
  { id: 'flag', x: 0.44, y: 0.47, r: 0.06, text: '🌅 火星の ゆうやけは あおいんだって。ひるの 空は うすい オレンジいろ。ちきゅうと ぎゃくだね。' },
];
const MARS_ROCKS = [
  [140, 470, 22], [380, 520, 16], [700, 560, 26], [900, 640, 18], [260, 690, 14], [520, 700, 20], [80, 610, 12], [620, 470, 10],
] as const;

function MarsGroundBase() {
  return (
    <>
      <defs>
        <linearGradient id="marsSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="100%" stopColor="#fdba74" />
        </linearGradient>
        <radialGradient id="marsSoil" cx="50%" cy="25%" r="85%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={ISLAND_W} height={ISLAND_H} fill="url(#marsSky)" />
      {MOON_STARS.slice(0, 14).map(([x, y], i) => <circle key={i} cx={x} cy={y * 0.5} r="1.2" fill="#fff" opacity="0.6" />)}
      {/* ちきゅう（あおい ほし）・フォボス・ダイモス */}
      <g transform={`translate(${MARS_HITS[3].x * ISLAND_W} ${MARS_HITS[3].y * ISLAND_H})`}>
        <circle r="13" fill="rgba(96,165,250,0.35)" className="twinkle" />
        <circle r="6" fill="#60a5fa" />
        <text y="28" fontSize="13" fontWeight="900" textAnchor="middle" fill="#dbeafe">ちきゅう</text>
      </g>
      <g transform={`translate(${MARS_HITS[1].x * ISLAND_W} ${MARS_HITS[1].y * ISLAND_H}) rotate(-20)`}>
        <ellipse rx="26" ry="17" fill="#a8a29e" stroke="#57534e" strokeWidth="2.5" />
        <circle cx="-7" cy="-3" r="5" fill="#78716c" /><circle cx="9" cy="5" r="3.5" fill="#78716c" />
        <text y="34" fontSize="12" fontWeight="900" textAnchor="middle" fill="#fff7ed" transform="rotate(20)">フォボス</text>
      </g>
      <g transform={`translate(${MARS_HITS[2].x * ISLAND_W} ${MARS_HITS[2].y * ISLAND_H})`}>
        <circle r="10" fill="#d6d3d1" stroke="#57534e" strokeWidth="2" />
        <text y="26" fontSize="12" fontWeight="900" textAnchor="middle" fill="#fff7ed">ダイモス</text>
      </g>
      {/* とおくの オリンポスさん */}
      <path d={`M60 ${ISLAND_H * 0.43} Q 200 ${ISLAND_H * 0.22} 270 ${ISLAND_H * 0.215} L330 ${ISLAND_H * 0.215} Q 400 ${ISLAND_H * 0.22} 540 ${ISLAND_H * 0.43} Z`} fill="#c2410c" stroke="#7c2d12" strokeWidth="3" />
      <ellipse cx="300" cy={ISLAND_H * 0.217} rx="30" ry="5" fill="#7c2d12" />
      <text x="300" y={ISLAND_H * 0.19} fontSize="13" fontWeight="900" textAnchor="middle" fill="#fff7ed">オリンポスさん</text>
      <path d={`M600 ${ISLAND_H * 0.43} Q 720 ${ISLAND_H * 0.33} 830 ${ISLAND_H * 0.42} Q 900 ${ISLAND_H * 0.36} 1000 ${ISLAND_H * 0.4} L1000 ${ISLAND_H * 0.45} L600 ${ISLAND_H * 0.45} Z`} fill="#c2410c" opacity="0.8" />
      {/* じめん */}
      <path d={`M0 ${ISLAND_H * 0.42} Q 180 ${ISLAND_H * 0.38} 350 ${ISLAND_H * 0.42} T 700 ${ISLAND_H * 0.41} T 1000 ${ISLAND_H * 0.4} L1000 ${ISLAND_H} L0 ${ISLAND_H} Z`} fill="url(#marsSoil)" />
      <path d={`M0 ${ISLAND_H * 0.42} Q 180 ${ISLAND_H * 0.38} 350 ${ISLAND_H * 0.42} T 700 ${ISLAND_H * 0.41} T 1000 ${ISLAND_H * 0.4}`} fill="none" stroke="#fed7aa" strokeWidth="3" />
      {[[300, 610, 90, 20], [760, 690, 70, 16]].map(([x, y, rx, ry], i) => (
        <g key={'c' + i}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#c2410c" stroke="#fdba74" strokeWidth="3" />
          <ellipse cx={x} cy={y + ry * 0.2} rx={rx * 0.75} ry={ry * 0.6} fill="#7c2d12" />
        </g>
      ))}
      {MARS_ROCKS.map(([x, y, r], i) => (
        <g key={'k' + i}>
          <ellipse cx={x} cy={y + r * 0.5} rx={r * 1.1} ry={r * 0.3} fill="rgba(0,0,0,0.2)" />
          <path d={`M${x - r} ${y + r * 0.4} L${x - r * 0.6} ${y - r * 0.5} L${x + r * 0.3} ${y - r * 0.7} L${x + r} ${y} L${x + r * 0.8} ${y + r * 0.4} Z`} fill="#b45309" stroke="#78350f" strokeWidth="2.5" />
        </g>
      ))}
      {/* はた */}
      <g transform={`translate(${MARS_HITS[6].x * ISLAND_W} ${MARS_HITS[6].y * ISLAND_H + 30})`}>
        <ellipse cx="0" cy="2" rx="18" ry="5" fill="rgba(0,0,0,0.2)" />
        <path d="M0 0 L0 -96 M0 -92 L58 -92" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
        <rect x="2" y="-90" width="54" height="34" fill="#fff" stroke="#4c1d95" strokeWidth="2.5" />
        <circle cx="29" cy="-73" r="9" fill="#dc2626" />
      </g>
      {/* たんさしゃ（ローバー） */}
      <g transform={`translate(${MARS_HITS[4].x * ISLAND_W} ${MARS_HITS[4].y * ISLAND_H + 20})`}>
        <ellipse cx="0" cy="4" rx="50" ry="8" fill="rgba(0,0,0,0.25)" />
        {[-34, 0, 34].map((x) => <circle key={x} cx={x} cy="-6" r="10" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />)}
        <rect x="-42" y="-34" width="84" height="22" rx="4" fill="#e5e7eb" stroke="#475569" strokeWidth="2.5" />
        <rect x="-38" y="-42" width="40" height="8" fill="#1d4ed8" stroke="#475569" strokeWidth="2" />
        <path d="M24 -34 L24 -64" stroke="#475569" strokeWidth="4" />
        <rect x="14" y="-76" width="22" height="14" rx="3" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" />
        <circle cx="30" cy="-69" r="3.5" fill="#0ea5e9" />
      </g>
      {/* おりてきた ロケット */}
      <g transform={`translate(${0.85 * ISLAND_W} ${0.5 * ISLAND_H})`}>
        <BuildingSVG id="bd_rocket" />
      </g>
    </>
  );
}
export const MarsGround = React.memo(MarsGroundBase);

// ── ☀️ たいようの ひょうめん（ロケットで ちかづいて「たいようの せいれい」に へんしんして あるく）──
// ほんとうの たいようは あつすぎて だれも ちかづけない。せいれいだから あるける、という おはなし。かいせつは ほんものの すうじ
export const SUN_HITS: { id: string; x: number; y: number; r: number; text: string }[] = [
  { id: 'spot', x: 0.33, y: 0.62, r: 0.07, text: '⚫ これが こくてん（黒点）。まわり（やく 6000℃）より ひくい やく 4000℃ なので、くろく みえるんだ。こくてんの うごきで、たいようが やく 1かげつで ひとまわり（じてん）して いると わかるよ。' },
  { id: 'granule', x: 0.16, y: 0.82, r: 0.08, text: '🟡 つぶつぶ もようは、したから あつい ガスが わきあがって くる あと。ひとつぶの おおきさは やく 1000km！ 10ぷんくらいで きえて、また あたらしい つぶが できるよ。' },
  { id: 'prom', x: 0.22, y: 0.31, r: 0.09, text: '🔥 プロミネンスは、たいようの ふちから ふきだした ガスの アーチ。ちきゅうが いくつも はいるほど おおきいよ。かいきにっしょくの ときに あかく みえるんだ。' },
  { id: 'flare', x: 0.7, y: 0.35, r: 0.07, text: '💥 フレアは たいようの ひょうめんの だいばくはつ。とびだした つぶが ちきゅうに とどくと、オーロラが でたり、でんぱが とどきにくく なったり するよ。' },
  { id: 'corona', x: 0.5, y: 0.16, r: 0.1, text: '🌫️ たいようの そとがわを つつむ うすい ガスが コロナ。100まん℃いじょうも あるのに、ふだんは まぶしくて みえない。かいきにっしょくの ときだけ しろく かがやいて みえるよ。' },
  { id: 'core', x: 0.56, y: 0.79, r: 0.07, text: '✨ この ずっと したが たいようの ちゅうしん。やく 1600まん℃ で、すいそが くっついて ヘリウムに かわる（かくゆうごう）ときに、ひかりと ねつが うまれて いるよ。' },
  { id: 'earth', x: 0.9, y: 0.1, r: 0.05, text: '🌍 あの ちいさな あおい てんが ちきゅう！ たいようの はばは ちきゅうの やく 109ばい。ここの ひかりは 8ぷん20びょうで ちきゅうに とどいて、月も この ひかりを はねかえして ひかって いるんだ。' },
];
/** つぶつぶ もよう（粒状斑）の 1つずつ：x, y, はば（じめんの 上に ならべる。きまった ならび） */
const SUN_GRANULES: [number, number, number][] = (() => {
  const out: [number, number, number][] = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let row = 0; row < 9; row++) {
    const y = ISLAND_H * 0.45 + row * 38;
    const w = 26 + row * 3;   // てまえほど おおきく
    for (let x = (row % 2) * w * 0.5; x < ISLAND_W + w; x += w * 1.15) out.push([x + rnd() * 8, y + rnd() * 10, w * (0.85 + rnd() * 0.3)]);
  }
  return out;
})();

function SunGroundBase() {
  const H = ISLAND_H, W = ISLAND_W;
  return (
    <>
      <defs>
        <radialGradient id="sunCorona" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#fde68a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sunSurf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="55%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill="#0f0a1e" />
      {MOON_STARS.slice(0, 18).map(([x, y], i) => <circle key={i} cx={x} cy={y * 0.45} r="1.2" fill="#fff" opacity="0.5" />)}
      {/* コロナ */}
      <ellipse cx={W / 2} cy={H * 0.46} rx={W * 0.8} ry={H * 0.42} fill="url(#sunCorona)" />
      {/* コロナの すじ（やわらかく ひろがる） */}
      {[-62, -34, -8, 20, 48, 70].map((a, i) => (
        <path key={a} d={`M${W / 2 + a * 4} ${H * 0.42} q${a * 2} -110 ${a * 5} -${220 + (i % 2) * 60}`} stroke="#fde68a" strokeWidth={36 - (i % 3) * 8} opacity="0.1" strokeLinecap="round" fill="none" />
      ))}
      <text x={SUN_HITS[4].x * W} y={SUN_HITS[4].y * H} fontSize="13" fontWeight="900" textAnchor="middle" fill="#fef3c7" opacity="0.85">コロナ</text>
      {/* とおくの ちきゅう（とても ちいさい） */}
      <g transform={`translate(${SUN_HITS[6].x * W} ${SUN_HITS[6].y * H})`}>
        <circle r="9" fill="rgba(96,165,250,0.3)" className="twinkle" />
        <circle r="3" fill="#60a5fa" />
        <text y="24" fontSize="12" fontWeight="900" textAnchor="middle" fill="#dbeafe">ちきゅう</text>
      </g>
      {/* プロミネンス（ふちから ふきだす ガスの アーチ） */}
      <g transform={`translate(${SUN_HITS[2].x * W} ${H * 0.42})`}>
        <path d="M-70 0 C -80 -150, 60 -170, 50 0" fill="none" stroke="#f43f5e" strokeWidth="16" strokeLinecap="round" opacity="0.85" />
        <path d="M-70 0 C -80 -150, 60 -170, 50 0" fill="none" stroke="#fda4af" strokeWidth="5" strokeLinecap="round" />
        <path d="M-20 0 C -10 -80, 70 -90, 80 0" fill="none" stroke="#fb7185" strokeWidth="9" strokeLinecap="round" opacity="0.7" />
      </g>
      {/* じめん（ひょうめん）。ふちは まるく カーブ */}
      <path d={`M0 ${H * 0.46} Q ${W / 2} ${H * 0.36} ${W} ${H * 0.46} L${W} ${H} L0 ${H} Z`} fill="url(#sunSurf)" />
      <path d={`M0 ${H * 0.46} Q ${W / 2} ${H * 0.36} ${W} ${H * 0.46}`} fill="none" stroke="#fffbeb" strokeWidth="5" opacity="0.9" />
      {/* つぶつぶ もよう */}
      <g opacity="0.55">
        {SUN_GRANULES.map(([x, y, w], i) => (
          <ellipse key={i} cx={x} cy={y} rx={w / 2} ry={w * 0.32} fill="#fef08a" stroke="#c2410c" strokeWidth="1.6" opacity={0.5 + (i % 3) * 0.15} />
        ))}
      </g>
      {/* フレア（ばくはつ） */}
      <g transform={`translate(${SUN_HITS[3].x * W} ${SUN_HITS[3].y * H})`}>
        <circle r="34" fill="#fffbeb" opacity="0.55" className="twinkle" />
        <path d="M0 -40 L9 -12 L38 -14 L14 4 L26 32 L0 14 L-26 32 L-14 4 L-38 -14 L-9 -12 Z" fill="#fff" stroke="#f59e0b" strokeWidth="3" />
      </g>
      {/* こくてん（大・小） */}
      {[[SUN_HITS[0].x * W, SUN_HITS[0].y * H, 46], [SUN_HITS[0].x * W + 80, SUN_HITS[0].y * H + 34, 22]].map(([x, y, r], i) => (
        <g key={'s' + i}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.45} fill="#b45309" opacity="0.75" />
          <ellipse cx={x} cy={y} rx={r * 0.55} ry={r * 0.25} fill="#1c1917" />
        </g>
      ))}
      {/* ちゅうしんへ つづく ひかり */}
      <g transform={`translate(${SUN_HITS[5].x * W} ${SUN_HITS[5].y * H})`}>
        <ellipse rx="44" ry="18" fill="url(#sunCore)" className="twinkle" />
        <ellipse rx="22" ry="8" fill="#fff" opacity="0.9" />
      </g>
      {/* ちかくで まっている ロケット（ねつを ふせぐ たて つき） */}
      <g transform={`translate(${0.85 * W} ${0.5 * H})`}>
        <BuildingSVG id="bd_rocket" />
        <path d="M-40 -150 Q0 -175 40 -150 L36 -140 Q0 -162 -36 -140 Z" fill="#e5e7eb" stroke="#475569" strokeWidth="2.5" />
      </g>
    </>
  );
}
export const SunGround = React.memo(SunGroundBase);

/** ほしごとの せってい（IslandScreen が つかう） */
export const PLANET_CFG = {
  moon: { title: '🌕 つき', hits: MOON_HITS, stone: '🪨 つきの いし', hop: 26, jump: 120, jumpMs: 1300, jumpClass: 'moon-jump', foot: 'rgba(71,85,105,0.55)',
    hint: 'クレーター・はた・ちきゅうを タップしてみよう。ロケットで しまに かえれるよ' },
  mars: { title: '🔴 かせい', hits: MARS_HITS, stone: '🔴 かせいの いし', hop: 18, jump: 80, jumpMs: 1000, jumpClass: 'mars-jump', foot: 'rgba(124,45,18,0.5)',
    hint: 'オリンポスさん・フォボス・ローバーを タップしてみよう。ロケットで しまに かえれるよ' },
  sun: { title: '☀️ たいよう', hits: SUN_HITS, stone: '✨ ひかりの たま', hop: 10, jump: 100, jumpMs: 1200, jumpClass: 'moon-jump', foot: 'rgba(255,251,235,0.8)',
    hint: 'たいようの せいれいに なって たんけん！ こくてん・つぶつぶ・プロミネンス・フレア・コロナ・ちゅうしん・ちきゅうを さがして タップしよう' },
} as const;
