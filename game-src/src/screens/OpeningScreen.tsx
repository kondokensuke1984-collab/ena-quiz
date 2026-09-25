import { useEffect, useRef, useState } from 'react';
import { CharSVG } from '../components/CharSVG';
import { sfx, soundMode } from '../lib/sound';
import script from '../lib/opening.json';

// はじまりの ものがたり「ゆめの とびら」。島を はじめて ひらいたときに 1回、あとは「📜 はじまり」から 見なおせる。
// 文は lib/opening.json（声 audio/opening/p1〜6.mp3 と同じ表。文を かえたら tools/make_opening_voice.py で 声も 作りなおす）。
// 冒険の いちばん先の「ゆめの とびら」は、受験（さいごの ふゆ）と それとなく 重ねてある。子どもには はっきり 言わない。

type Scene = 'sea' | 'door' | 'lights' | 'shards' | 'luna' | 'title';
interface Line { who: string; text: string }
const PAGES = script.pages as { scene: Scene; lines: Line[] }[];

const LINE_DELAY = 1.7;   // 行が ひとつずつ 出る 間（秒）

/** 背景の 星（いつも おなじ 位置） */
const STARS = Array.from({ length: 70 }, (_, i) => [(i * 97) % 400, ((i * 53) % 570) - 400, i % 3 === 0 ? 1.6 : 1] as const);
/** 4つの ひかり（こくご・さんすう・りか・しゃかい） */
const LIGHTS = [
  { x: 110, c: '#f472b6', label: 'ことば' },
  { x: 170, c: '#60a5fa', label: 'かず' },
  { x: 230, c: '#4ade80', label: 'しぜん' },
  { x: 290, c: '#fbbf24', label: 'せかい' },
];

function Sky() {
  return (
    <>
      <defs>
        <linearGradient id="op-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1033" />
          <stop offset="70%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <radialGradient id="op-door" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="rgba(254,249,195,0)" />
        </radialGradient>
      </defs>
      {/* たて長の 画面では 上に 空を のばす（y が マイナスの ところ） */}
      <rect x="0" y="-600" width="400" height="600" fill="#0b1033" />
      <rect x="0" y="0" width="400" height="300" fill="url(#op-sky)" />
      {STARS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" className="twinkle" style={{ animationDelay: `${(i % 7) * -0.5}s` }} />
      ))}
    </>
  );
}

function Sea({ y = 210 }: { y?: number }) {
  return (
    <>
      <rect x="0" y={y} width="400" height={900 - y} fill="#172554" />
      {[0, 1, 2].map((i) => (
        <g key={i} className="op-wave" style={{ animationDelay: `${i * -1.6}s` }}>
          <path d={`M-40 ${y + 14 + i * 22}` + ' q 20 -6 40 0 t 40 0'.repeat(12)} fill="none" stroke="rgba(191,219,254,0.35)" strokeWidth="2" />
        </g>
      ))}
    </>
  );
}

/** 霧の中の ゆめの しま（とびらが 光る） */
function DreamIsle({ x, y, s = 1, door = true }: { x: number; y: number; s?: number; door?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-90 10 Q-70 -10 -40 -12 Q-24 -48 0 -54 Q24 -48 36 -18 Q66 -14 90 10 Z" fill="#475569" />
      {door && (
        <g className="op-glow">
          <circle cx="0" cy="-30" r="26" fill="url(#op-door)" />
          <path d="M-7 -18 L-7 -36 Q0 -46 7 -36 L7 -18 Z" fill="#fef9c3" />
        </g>
      )}
      <g className="dream-mist">
        <ellipse cx="-34" cy="4" rx="70" ry="10" fill="rgba(226,232,240,0.55)" />
        <ellipse cx="40" cy="8" rx="64" ry="9" fill="rgba(226,232,240,0.45)" />
      </g>
    </g>
  );
}

/** 画面の たて横に あわせた viewBox。よこ長は 400x300 を うめる。たて長は 横はばを ぜんぶ見せて、上下を のばす */
function useViewBox(): string {
  const calc = () => {
    const w = window.innerWidth, h = window.innerHeight;
    if (w / h >= 4 / 3) return '0 0 400 300';
    const H = (400 * h) / w;
    return `0 ${Math.round(300 - 0.72 * H)} 400 ${Math.round(H)}`;   // 絵の 下はし（300）を 画面の 72% の 高さに
  };
  const [vb, setVb] = useState(calc);
  useEffect(() => {
    const on = () => setVb(calc());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return vb;
}

function SceneArt({ scene }: { scene: Scene }) {
  const vb = useViewBox();
  return (
    <svg viewBox={vb} className="block h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Sky />
      {scene === 'sea' && (
        <>
          <circle cx="300" cy="70" r="26" fill="#fef3c7" />
          <circle cx="300" cy="70" r="40" fill="rgba(254,243,199,0.15)" />
          <Sea />
          <g opacity="0.55"><DreamIsle x={120} y={212} s={0.45} door={false} /></g>
          {/* 月の ひかりが 海に うつる */}
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={i} cx="300" cy={222 + i * 16} rx={16 - i * 2} ry="2.5" fill="rgba(254,243,199,0.35)" className="op-glow" style={{ animationDelay: `${i * -0.5}s` }} />
          ))}
        </>
      )}
      {scene === 'door' && (
        <>
          <Sea y={230} />
          <DreamIsle x={200} y={232} s={1.5} />
        </>
      )}
      {scene === 'lights' && (
        <>
          <Sea y={240} />
          <g opacity="0.6"><DreamIsle x={200} y={242} s={1.1} /></g>
          {LIGHTS.map((l, i) => (
            <g key={l.label} transform={`translate(${l.x} 120)`}>
              <g className="op-light-on" style={{ animationDelay: `${0.5 + i * 0.7}s` }}>
                <circle r="24" fill={l.c} opacity="0.25" />
                <circle r="13" fill={l.c} />
                <circle cx="-4" cy="-4" r="4" fill="#fff" opacity="0.8" />
                <text y="42" fontSize="13" fontWeight="900" textAnchor="middle" fill="#e0e7ff">{l.label}</text>
              </g>
            </g>
          ))}
        </>
      )}
      {scene === 'shards' && (
        <>
          <Sea y={250} />
          {Array.from({ length: 22 }, (_, i) => (
            <g key={i} transform={`translate(${15 + ((i * 71) % 370)} 0)`}>
              <g className="op-fall" style={{ animationDelay: `${(i * -0.61) % 4.5}s` }}>
                <path d="M0 -9 L3 0 L0 9 L-3 0 Z" fill={LIGHTS[i % 4].c} />
                <circle r="9" fill={LIGHTS[i % 4].c} opacity="0.25" />
              </g>
            </g>
          ))}
        </>
      )}
      {scene === 'luna' && (
        <>
          <circle cx="330" cy="60" r="22" fill="#fef3c7" />
          <Sea y={240} />
          <g opacity="0.5"><DreamIsle x={320} y={242} s={0.6} /></g>
          <foreignObject x="110" y="40" width="180" height="200">
            <div className="op-rise flex h-full w-full items-end justify-center">
              <CharSVG charKey="luna" level={4} fillPct={1} size={170} label="ルナ" />
            </div>
          </foreignObject>
        </>
      )}
      {scene === 'title' && (
        <>
          <circle cx="330" cy="54" r="18" fill="#fef3c7" />
          <Sea y={170} />
          <g opacity="0.7"><DreamIsle x={300} y={172} s={0.55} /></g>
          {/* てまえの アンリノ島 */}
          <ellipse cx="130" cy="300" rx="190" ry="80" fill="#fde68a" />
          <ellipse cx="130" cy="304" rx="170" ry="66" fill="#4ade80" />
          <path d="M60 250 L60 226 M52 234 L60 222 L68 234" stroke="#14532d" strokeWidth="3" fill="#15803d" />
          <rect x="120" y="226" width="30" height="22" fill="#fef3c7" stroke="#4c1d95" strokeWidth="2" />
          <path d="M114 228 L135 210 L156 228 Z" fill="#f87171" stroke="#4c1d95" strokeWidth="2" />
          <rect x="130" y="236" width="8" height="12" fill="#fde047" className="op-glow" />
          <g className="op-rise">
            <text x="200" y="96" fontSize="34" fontWeight="900" textAnchor="middle" fill="#fef3c7" stroke="#1e1b4b" strokeWidth="1" letterSpacing="4">アンリノ島</text>
            <text x="200" y="122" fontSize="14" fontWeight="900" textAnchor="middle" fill="#c7d2fe" letterSpacing="3">〜 ゆめの とびら 〜</text>
          </g>
        </>
      )}
    </svg>
  );
}

export function OpeningScreen({ onDone }: { onDone: () => void }) {
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState(0);
  const [voiceOn, setVoiceOn] = useState(() => soundMode() !== 'off');
  const audio = useRef<HTMLAudioElement | null>(null);
  const last = page === PAGES.length - 1;
  const p = PAGES[page];

  // ページが かわったら、その ページの 声を ながす（まえの 声は とめる）
  useEffect(() => {
    if (!started) return;
    audio.current?.pause();
    if (!voiceOn) return;
    const a = new Audio(`/audio/opening/p${page + 1}.mp3`);
    audio.current = a;
    a.play().catch(() => { /* 鳴らせない端末は 文字だけ */ });
    return () => { a.pause(); };
  }, [started, page, voiceOn]);

  // ページが かわって すぐの タップは むし（れんだで 2まい とばさないように）
  const shownAt = useRef(0);
  useEffect(() => { shownAt.current = Date.now(); }, [page, started]);

  const next = () => {
    if (!started || last || Date.now() - shownAt.current < 700) return;
    sfx('star');
    setPage((n) => n + 1);
  };
  const finish = () => {
    audio.current?.pause();
    sfx('stamp');
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[60] select-none overflow-hidden bg-[#0b1033]" onClick={next}>
      <div key={page} className="absolute inset-0" style={{ animation: 'fade 1.2s ease-out' }}>
        <SceneArt scene={started ? p.scene : 'sea'} />
      </div>

      {/* 上の ボタン */}
      <div className="absolute inset-x-0 top-0 flex justify-between p-3" onClick={(e) => e.stopPropagation()}>
        <button
          className="rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-black text-white active:scale-95"
          onClick={() => setVoiceOn((v) => !v)}
        >
          {voiceOn ? '🔊 こえあり' : '🔇 こえなし'}
        </button>
        <button className="rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-black text-white active:scale-95" onClick={finish}>
          スキップ ▶▶
        </button>
      </div>

      {/* 文 */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/55 to-transparent px-5 pb-8 pt-16">
        <div className="mx-auto max-w-[520px]">
          {!started ? (
            <div className="text-center">
              <div className="mb-4 text-[15px] font-black tracking-widest text-indigo-100">〜 はじまりの ものがたり 〜</div>
              <button
                className="rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 px-8 py-3 text-[16px] font-black text-white shadow-lg active:scale-95"
                onClick={(e) => { e.stopPropagation(); setStarted(true); }}
              >
                ▶ はじめる
              </button>
            </div>
          ) : (
            <div key={page}>
              {p.lines.map((l, i) => (
                <p
                  key={i}
                  className={`op-line mb-1.5 text-[17px] font-black leading-relaxed ${l.who === 'luna' ? 'text-amber-200' : 'text-white'}`}
                  style={{ animationDelay: `${0.3 + i * LINE_DELAY}s`, textShadow: '0 2px 6px rgba(0,0,0,.6)' }}
                >
                  {l.who === 'luna' && (i === 0 || p.lines[i - 1].who !== 'luna') && <span className="mr-1 text-[12px] text-amber-300">ルナ</span>}
                  {l.text}
                </p>
              ))}
              {last ? (
                <div className="op-line mt-4 text-center" style={{ animationDelay: `${0.3 + p.lines.length * LINE_DELAY}s` }}>
                  <button
                    className="rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 px-8 py-3 text-[16px] font-black text-white shadow-lg active:scale-95"
                    onClick={(e) => { e.stopPropagation(); finish(); }}
                  >
                    🏝 しまへ いく
                  </button>
                  <div className="mt-3 text-[10px] font-bold text-indigo-200/60">声：VOICEVOX:ずんだもん</div>
                </div>
              ) : (
                <div className="op-line mt-2 text-right text-[12px] font-bold text-indigo-200/70" style={{ animationDelay: `${0.3 + p.lines.length * LINE_DELAY}s` }}>
                  タップで つぎへ ▼
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
