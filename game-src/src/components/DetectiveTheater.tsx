import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { CharSVG } from './CharSVG';
import { KidSVG } from './KidSVG';
import { DetectiveBoard } from './DetectiveBoard';
import { CHAR_NAMES, type CharKey } from '../lib/chars';
import { caseOpen, CASES, eventToday, openLabel, studiedOn, type Case, type Line, type SceneKey, type Who } from '../lib/detective';
import { ITEM_BY_ID } from '../lib/items';
import { sfx } from '../lib/sound';

// イベント「名探偵あんり」の 全画面。じけんぼ → 1じけん 5まく
//   ① じけん はっせい（サイレン・しんぶん）② げんば そうさ（むしめがねで しょうこ）③ ききこみ
//   ④ すいりボード（○×表）⑤ はんにんは きみだ！（スポットライト → なぞは すべて とけた！ → じはく → かいけつ スタンプ）

type Act = 'intro' | 'scene' | 'talk' | 'board' | 'accuse' | 'solved';

function Portrait({ who, size = 64 }: { who: Who; size?: number }) {
  if (who === 'narr') return null;
  if (who === 'anri') return <KidSVG who="anri" size={size * 0.85} />;
  return <CharSVG charKey={who} level={6} fillPct={100} size={size} label={CHAR_NAMES[who]} />;
}

function nameOf(who: Who): string {
  return who === 'narr' ? '' : who === 'anri' ? 'あんり' : CHAR_NAMES[who];
}

function Speech({ line }: { line: Line }) {
  if (line.who === 'narr') {
    return <div className="dt-line rounded-2xl bg-black/40 px-4 py-3 text-[14px] font-bold leading-relaxed text-indigo-100">{line.text}</div>;
  }
  return (
    <div className="dt-line flex items-end gap-2">
      <div className="shrink-0"><Portrait who={line.who} size={60} /></div>
      <div className="relative flex-1 rounded-2xl bg-white px-3 py-2.5 text-[14px] font-bold leading-relaxed text-ink shadow">
        <div className="text-[11px] font-black text-violet-600">{nameOf(line.who)}</div>
        {line.text}
      </div>
    </div>
  );
}

// ── げんばの 絵 ──
const SCENES: Record<SceneKey, { sky: [string, string]; ground: string; props: [string, number, number, number][] }> = {
  beach:   { sky: ['#7dd3fc', '#bae6fd'], ground: '#fde68a', props: [['🌊', 12, 44, 34], ['🌴', 80, 40, 60], ['🧰', 55, 64, 46], ['🐚', 30, 86, 20]] },
  track:   { sky: ['#93c5fd', '#dbeafe'], ground: '#86efac', props: [['🏁', 82, 48, 44], ['🏃', 22, 62, 30], ['🚩', 50, 44, 26]] },
  field:   { sky: ['#93c5fd', '#e0f2fe'], ground: '#4ade80', props: [['🥅', 15, 55, 48], ['🥅', 85, 55, 48], ['⚽', 50, 72, 26], ['🏆', 50, 38, 30]] },
  forest:  { sky: ['#a7f3d0', '#ecfccb'], ground: '#a3e635', props: [['🌳', 12, 42, 64], ['🌳', 88, 44, 64], ['🍂', 40, 84, 24], ['🌰', 60, 68, 22]] },
  court:   { sky: ['#fde68a', '#fef3c7'], ground: '#fdba74', props: [['🏐', 50, 60, 34], ['🧺', 82, 72, 30], ['🏫', 18, 38, 50]] },
  morning: { sky: ['#fdba74', '#fef3c7'], ground: '#bbf7d0', props: [['🌅', 50, 28, 50], ['🏠', 20, 58, 50], ['🏠', 80, 58, 50], ['📻', 50, 76, 28]] },
  moon:    { sky: ['#1e1b4b', '#312e81'], ground: '#365314', props: [['🌕', 78, 18, 44], ['🎑', 42, 62, 56], ['🌾', 16, 70, 40], ['🍽️', 62, 78, 26]] },
};

function SceneArt({ scene, children, onMove }: { scene: SceneKey; children?: React.ReactNode; onMove?(x: number, y: number): void }) {
  const s = SCENES[scene];
  const ref = useRef<SVGSVGElement>(null);
  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      className="w-full touch-none rounded-2xl shadow-lg"
      style={{ aspectRatio: '1 / 1', maxHeight: '52vh' }}
      onPointerMove={(e) => {
        if (!onMove || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        onMove(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
      }}
    >
      <defs>
        <linearGradient id={`dt-sky-${scene}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.sky[0]} />
          <stop offset="100%" stopColor={s.sky[1]} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill={`url(#dt-sky-${scene})`} />
      <path d="M0 52 Q25 46 50 52 T100 50 L100 100 L0 100 Z" fill={s.ground} />
      {scene === 'beach' && <path d="M0 40 Q25 37 50 40 T100 39 L100 52 Q75 47 50 52 T0 51 Z" fill="#38bdf8" opacity="0.85" />}
      {scene === 'track' && <path d="M0 70 Q50 60 100 70 L100 82 Q50 72 0 82 Z" fill="#f87171" opacity="0.7" />}
      {scene === 'field' && <path d="M50 52 L50 100 M8 76 H92" stroke="#fff" strokeWidth="0.8" opacity="0.8" />}
      {s.props.map(([e, x, y, size], i) => (
        <text key={i} x={x} y={y} fontSize={size / 4} textAnchor="middle" dominantBaseline="middle">{e}</text>
      ))}
      {children}
    </svg>
  );
}

// ── じけんぼ ──
function CaseBook({ onOpen, onClose }: { onOpen(c: Case): void; onClose(): void }) {
  const g = useGame();
  const today = eventToday();
  const studied = studiedOn(today);
  const solved = g.save.detective.solved;
  return (
    <div className="mx-auto w-full max-w-[520px] px-4 py-6">
      <div className="text-center">
        <div className="text-[13px] font-black tracking-widest text-amber-300">🔍 イベント</div>
        <h1 className="text-2xl font-black text-white">名探偵あんりの じけんぼ</h1>
        <div className="mt-1 text-[12px] font-bold text-indigo-200">かいけつ {solved.length} / {CASES.length}</div>
      </div>
      {!studied && (
        <div className="mt-4 rounded-2xl bg-amber-100 px-4 py-3 text-center text-[12.5px] font-black text-amber-900">
          きょう クイズを 5もん やると、じけんの そうさが できるよ！
          <a href="/" className="mt-2 block rounded-xl bg-amber-500 px-3 py-2 text-white no-underline">📚 クイズを する</a>
        </div>
      )}
      <div className="mt-4 flex flex-col gap-2">
        {CASES.map((c) => {
          const open = caseOpen(c, today);
          const done = solved.includes(c.no);
          const canPlay = open && (done || studied);
          return (
            <button
              key={c.no}
              disabled={!canPlay}
              onClick={() => onOpen(c)}
              className={`relative flex items-center gap-3 rounded-2xl px-4 py-3 text-left shadow active:scale-[0.98] ${
                done ? 'bg-emerald-50' : open ? 'bg-white' : 'bg-white/15'
              }`}
            >
              <div className={`text-3xl ${open && !done ? 'dt-new' : ''}`}>{done ? '✅' : open ? '📁' : '🔒'}</div>
              <div className="min-w-0 flex-1">
                <div className={`text-[11px] font-black ${open ? 'text-violet-600' : 'text-indigo-200'}`}>じけん {c.no}{c.no === 7 ? '（大じけん）' : ''}</div>
                <div className={`truncate text-[15px] font-black ${open ? 'text-ink' : 'text-indigo-100/70'}`}>{open ? c.title : '？？？'}</div>
                {!open && <div className="text-[11px] font-bold text-indigo-200">{openLabel(c)} に ひらくよ</div>}
                {open && !done && !studied && <div className="text-[11px] font-bold text-amber-700">クイズを 5もん やると そうさ できるよ</div>}
              </div>
              {done && <div className="dt-stamp rounded-md border-2 border-rose-500 px-1.5 py-0.5 text-[11px] font-black text-rose-500">かいけつ</div>}
              {open && !done && <div className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white">NEW</div>}
            </button>
          );
        })}
      </div>
      <button className="btn mt-5" onClick={onClose}>しまに もどる</button>
    </div>
  );
}

// ── 1じけん ──
function Theater({ c, onBack }: { c: Case; onBack(): void }) {
  const g = useGame();
  const [act, setAct] = useState<Act>('intro');
  const [introN, setIntroN] = useState(1);
  const [card, setCard] = useState<string | null>(null);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [talkN, setTalkN] = useState(1);
  const [pIdx, setPIdx] = useState(0);
  const [pDone, setPDone] = useState(false);
  const [wrong, setWrong] = useState('');
  const [reveal, setReveal] = useState<{ x: number; y: number; step: number; confess: number } | null>(null);
  const [prize, setPrize] = useState<{ gift: string; reward: string | null; title: string | null } | null | undefined>(undefined);
  const lineupRef = useRef<HTMLDivElement>(null);

  const found = g.save.detective.found[c.no] ?? [];
  const hintN = g.save.detective.hint[c.no] ?? 0;
  const already = g.save.detective.solved.includes(c.no);

  useEffect(() => { sfx('siren'); }, []);

  // スポットライト → なぞは すべて とけた！ → じはく
  useEffect(() => {
    if (!reveal || reveal.step > 1) return;
    const t = window.setTimeout(() => {
      if (reveal.step === 0) sfx('reveal');
      setReveal({ ...reveal, step: reveal.step + 1 });
    }, reveal.step === 0 ? 1300 : 1600);
    return () => window.clearTimeout(t);
  }, [reveal]);

  const accuse = (who: CharKey, el: HTMLElement) => {
    if (who !== c.culprit) {
      sfx('ng');
      setWrong(`「${CHAR_NAMES[who]}」は ${c.badges[who] ?? '…'}。🎯てがかりと くらべてみよう！`);
      return;
    }
    const box = lineupRef.current?.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const x = box ? ((r.left + r.width / 2 - box.left) / box.width) * 100 : 50;
    const y = box ? ((r.top + r.height / 2 - box.top) / box.height) * 100 : 50;
    setWrong('');
    setReveal({ x, y, step: 0, confess: 1 });
  };

  const finish = () => {
    setAct('solved');
    setPrize(already ? null : g.solveCase(c.no));
  };

  const puzzle = c.puzzles[pIdx];
  const hints = c.hints.slice(0, hintN);

  return (
    <div className="relative mx-auto w-full max-w-[560px] px-4 pb-10 pt-4">
      <div className="mb-3 flex items-center gap-2">
        <button className="rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-black text-white" onClick={onBack}>◀ じけんぼ</button>
        <div className="flex-1 truncate text-right text-[12px] font-black text-amber-200">じけん {c.no}「{c.title}」</div>
      </div>

      {/* ① じけん はっせい */}
      {act === 'intro' && (
        <div>
          <div className="dt-siren pointer-events-none fixed inset-0 z-0" />
          <div className="relative z-10 text-center text-4xl"><span className="dt-siren-icon">🚨</span> <span className="dt-siren-icon">🚨</span></div>
          <div className="dt-news relative z-10 mx-auto mt-3 max-w-[420px] rounded-md bg-[#fdfaf0] px-4 py-3 text-center shadow-2xl">
            <div className="border-b-2 border-ink pb-1 text-[11px] font-black tracking-[0.3em] text-ink">しま しんぶん</div>
            <div className="mt-2 text-[20px] font-black leading-snug text-rose-700">{c.headline}</div>
            <div className="mt-1 text-[11px] font-bold text-slate-500">名探偵あんり、しゅつどう！</div>
          </div>
          <div className="relative z-10 mt-5 flex flex-col gap-3">
            {c.intro.slice(0, introN).map((l, i) => <Speech key={i} line={l} />)}
          </div>
          <button
            className="btn-main relative z-10 mt-5"
            onClick={() => (introN < c.intro.length ? setIntroN(introN + 1) : setAct('scene'))}
          >
            {introN < c.intro.length ? 'つぎへ ▶' : '🔍 げんばを しらべる'}
          </button>
        </div>
      )}

      {/* ② げんば そうさ */}
      {act === 'scene' && (
        <div>
          <div className="mb-2 text-[14px] font-black text-amber-200">🔍 げんば そうさ　しょうこ {found.length} / {c.evidence.length}</div>
          <div className="mb-2 text-[12px] font-bold text-indigo-200">✨ が ひかっている ところを タップして しらべよう</div>
          <div className="relative">
            <SceneArt scene={c.scene} onMove={(x, y) => setLens({ x, y })}>
              {c.evidence.map((e) => {
                const got = found.includes(e.id);
                return (
                  <g
                    key={e.id}
                    style={{ cursor: 'pointer' }}
                    onPointerDown={(ev) => {
                      ev.stopPropagation();
                      setLens({ x: e.x, y: e.y });
                      if (!got) { g.detectiveFound(c.no, e.id); sfx('clue'); }
                      setCard(e.id);
                    }}
                  >
                    <circle cx={e.x} cy={e.y} r="9" fill="transparent" />
                    {got
                      ? <text className="dt-found" x={e.x} y={e.y} fontSize="8" textAnchor="middle" dominantBaseline="middle">{e.icon}</text>
                      : (
                        <g className="dt-hotspot">
                          <circle cx={e.x} cy={e.y} r="5.5" fill="#fff" opacity="0.55" stroke="#f59e0b" strokeWidth="0.8" />
                          <text x={e.x} y={e.y + 0.3} fontSize="6" textAnchor="middle" dominantBaseline="middle">✨</text>
                        </g>
                      )}
                  </g>
                );
              })}
              {lens && <text x={lens.x + 3} y={lens.y + 4} fontSize="11" textAnchor="middle" dominantBaseline="middle" pointerEvents="none" opacity="0.9">🔍</text>}
            </SceneArt>
            {card && (() => {
              const e = c.evidence.find((x) => x.id === card)!;
              return (
                <div className="absolute inset-0 flex items-center justify-center" onClick={() => setCard(null)}>
                  <div className="dt-card w-[80%] rounded-2xl border-4 border-amber-400 bg-[#fffbeb] px-4 py-4 text-center shadow-2xl">
                    <div className="text-4xl">{e.icon}</div>
                    <div className="mt-1 text-[12px] font-black text-amber-700">しょうこ：{e.name}</div>
                    <div className="mt-2 text-[17px] font-black leading-snug text-ink">{e.text}</div>
                    <div className="mt-2 text-[11px] font-bold text-slate-500">タップで とじる</div>
                  </div>
                </div>
              );
            })()}
          </div>
          <Notebook c={c} found={found} />
          {found.length >= c.evidence.length && (
            <button className="btn-main mt-4" onClick={() => setAct('talk')}>🗣️ ききこみ へ</button>
          )}
        </div>
      )}

      {/* ③ ききこみ */}
      {act === 'talk' && (
        <div>
          <RuleBanner c={c} />
          <div className="mb-3 text-[14px] font-black text-amber-200">🗣️ ききこみ　ようぎしゃ {c.suspects.length}にん</div>
          <div className="flex flex-col gap-3">
            {c.suspects.slice(0, talkN).map((s) => (
              <div key={s.char} className="dt-slide-in flex items-end gap-2">
                <div className={`relative shrink-0 ${s.nervous ? 'dt-nervous' : ''}`}>
                  <Portrait who={s.char} size={62} />
                  {s.nervous && <span className="dt-sweat absolute right-1 top-1 text-[16px]">💧</span>}
                </div>
                <div className="flex-1 rounded-2xl bg-white px-3 py-2.5 text-[14px] font-bold leading-relaxed text-ink shadow">
                  <div className="text-[11px] font-black text-violet-600">{CHAR_NAMES[s.char]}</div>
                  {s.says}
                </div>
              </div>
            ))}
          </div>
          {talkN < c.suspects.length
            ? <button className="btn-main mt-4" onClick={() => setTalkN(talkN + 1)}>つぎの ひとに きく ▶</button>
            : <button className="btn-main mt-4" onClick={() => setAct('board')}>🧩 すいり ボードへ</button>}
        </div>
      )}

      {/* ④ すいり ボード */}
      {act === 'board' && puzzle && (
        <div>
          <RuleBanner c={c} />
          {c.puzzles.length > 1 && <div className="mb-1 text-[11px] font-black text-indigo-200">なぞ {pIdx + 1} / {c.puzzles.length}</div>}
          {!pDone ? (
            <DetectiveBoard key={pIdx} puzzle={puzzle} onSolved={() => { sfx('clue'); setPDone(true); }} />
          ) : (
            <div className="dt-zoom rounded-2xl bg-amber-100 px-4 py-4 text-center">
              <div className="text-3xl">💡</div>
              <div className="mt-1 text-[16px] font-black leading-snug text-amber-900">{puzzle.done}</div>
              {puzzle.chars && (
                <>
                  <Answers c={c} chars={puzzle.chars} />
                  <div className="mt-2 text-[12.5px] font-black text-amber-800">🎯 てがかりと くらべてみよう！</div>
                </>
              )}
              <button
                className="btn-main mt-3"
                onClick={() => {
                  if (pIdx + 1 < c.puzzles.length) { setPIdx(pIdx + 1); setPDone(false); }
                  else setAct('accuse');
                }}
              >
                {pIdx + 1 < c.puzzles.length ? 'つぎの なぞへ ▶' : '☝️ はんにんを あてる'}
              </button>
            </div>
          )}
          {!pDone && (
            <div className="mt-4">
              {hints.map((h, i) => (
                <div key={i} className="dt-line mb-2"><Speech line={{ who: 'luna', text: `ヒント${i + 1}：${h}` }} /></div>
              ))}
              {hintN < c.hints.length && (
                <button className="btn !py-2 text-[12px]" onClick={() => g.detectiveHint(c.no)}>💡 ルナの ヒント（{hintN}/{c.hints.length}）</button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ⑤ はんにんは きみだ！ */}
      {act === 'accuse' && (
        <div>
          <RuleBanner c={c} />
          <div className="rounded-2xl bg-black/40 px-4 py-3 text-[14px] font-bold leading-relaxed text-indigo-100">{c.deduce}</div>
          <div className="mt-3 text-center text-[16px] font-black text-amber-200">☝️ {c.question}</div>
          <div ref={lineupRef} className="relative mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-white/5 p-2 sm:grid-cols-5">
            {c.suspects.map((s) => (
              <button
                key={s.char}
                disabled={!!reveal}
                onClick={(e) => accuse(s.char, e.currentTarget)}
                className="flex flex-col items-center rounded-xl bg-white/10 px-1 py-2 active:scale-95"
              >
                <Portrait who={s.char} size={58} />
                <span className="mt-0.5 text-[12px] font-black text-white">{CHAR_NAMES[s.char]}</span>
                {c.badges[s.char] && <span className="mt-0.5 rounded-full bg-amber-300 px-1.5 text-[10.5px] font-black leading-snug text-amber-950">{c.badges[s.char]}</span>}
              </button>
            ))}
            {reveal && (
              <div
                className="dt-spot pointer-events-none absolute inset-0 rounded-2xl"
                style={{ ['--dt-x' as string]: `${reveal.x}%`, ['--dt-y' as string]: `${reveal.y}%` }}
              />
            )}
          </div>
          {wrong && <div className="dt-shake mt-3 rounded-xl bg-rose-500/25 px-3 py-2 text-center text-[13px] font-black text-rose-100">{wrong}</div>}
          {reveal && reveal.step >= 1 && (
            <div className="dt-zoom mt-4 text-center text-[26px] font-black text-amber-300 [text-shadow:0_2px_0_#7c2d12]">なぞは すべて とけた！</div>
          )}
          {reveal && reveal.step >= 2 && (
            <div className="mt-4 flex flex-col gap-3">
              {c.confession.slice(0, reveal.confess).map((l, i) => <Speech key={i} line={l} />)}
              <button
                className="btn-main"
                onClick={() => (reveal.confess < c.confession.length ? setReveal({ ...reveal, confess: reveal.confess + 1 }) : finish())}
              >
                {reveal.confess < c.confession.length ? 'つぎへ ▶' : '🎉 じけん かいけつ！'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* かいけつ */}
      {act === 'solved' && (
        <div className="relative text-center">
          <Confetti />
          <div className="dt-stamp mx-auto mt-6 inline-block rounded-xl border-[5px] border-rose-500 px-5 py-2 text-[28px] font-black text-rose-500">じけん かいけつ</div>
          <div className="mt-4 flex justify-center"><KidSVG who="anri" size={110} hat="detective" magnifier /></div>
          <div className="mt-2 text-[15px] font-black text-white">めいたんてい あんり、おてがら！</div>
          {prize && (
            <div className="mx-auto mt-4 max-w-[380px] rounded-2xl bg-white px-4 py-3 text-[13px] font-black text-ink">
              🎁 ごほうび：{ITEM_BY_ID[prize.gift].emoji} {ITEM_BY_ID[prize.gift].name}
              {prize.reward && <div className="mt-1 text-violet-700">🎉 {ITEM_BY_ID[prize.reward].emoji} {ITEM_BY_ID[prize.reward].name} を ゲット！</div>}
              {prize.title && <div className="mt-1 text-amber-700">👑 しょうごう「{prize.title}」を ゲット！</div>}
            </div>
          )}
          {prize === null && <div className="mt-3 text-[12px] font-bold text-indigo-200">（この じけんの ごほうびは もう もらったよ）</div>}
          <button className="btn-main mt-5" onClick={onBack}>📁 じけんぼに もどる</button>
        </div>
      )}
    </div>
  );
}

function RuleBanner({ c }: { c: Case }) {
  return (
    <div className="mb-3 rounded-2xl border-2 border-amber-300 bg-amber-50 px-3 py-2">
      <div className="text-[11px] font-black text-amber-700">🎯 はんにんの てがかり</div>
      <div className="text-[13.5px] font-black leading-snug text-ink">{c.rule}</div>
    </div>
  );
}

/** といた ボードの こたえを、ようぎしゃ ごとに ならべる */
function Answers({ c, chars }: { c: Case; chars: CharKey[] }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
      {chars.map((k) => (
        <div key={k} className="flex items-center gap-1.5 rounded-xl bg-white px-2 py-1.5 text-left">
          <span className="inline-block h-[34px] w-[34px] shrink-0 overflow-hidden rounded-full"><Portrait who={k} size={34} /></span>
          <span className="min-w-0">
            <span className="block text-[11px] font-black text-violet-600">{CHAR_NAMES[k]}</span>
            <span className="block text-[12.5px] font-black leading-tight text-ink">{c.badges[k]}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function Notebook({ c, found }: { c: Case; found: string[] }) {
  if (!found.length) return null;
  return (
    <div className="mt-3 rounded-2xl bg-[#fffbeb] px-3 py-2">
      <div className="text-[11px] font-black text-amber-700">📓 そうさ てちょう</div>
      {c.evidence.filter((e) => found.includes(e.id)).map((e) => (
        <div key={e.id} className="dt-line text-[12.5px] font-bold text-ink">{e.icon} {e.text}</div>
      ))}
    </div>
  );
}

const CONFETTI_COLORS = ['#f472b6', '#facc15', '#60a5fa', '#4ade80', '#fb923c', '#a78bfa'];
function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 36 }, (_, i) => (
        <span
          key={i}
          className="dt-confetti"
          style={{ left: `${(i * 29) % 100}%`, background: CONFETTI_COLORS[i % CONFETTI_COLORS.length], animationDelay: `${(i % 9) * 0.12}s` }}
        />
      ))}
    </div>
  );
}

/** イベントの 全画面（じけんぼ ⇄ じけん） */
export function DetectiveScreen({ onClose }: { onClose(): void }) {
  const [cur, setCur] = useState<Case | null>(null);
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#4c1d95]">
      {cur ? <Theater key={cur.no} c={cur} onBack={() => setCur(null)} /> : <CaseBook onOpen={setCur} onClose={onClose} />}
    </div>
  );
}
