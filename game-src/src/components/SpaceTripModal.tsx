import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import type { Friend } from '../lib/friends';
import { setSpaceBgm, sfx } from '../lib/sound';
import { dateKey } from '../lib/study';
import { DESTS, SPACE_REWARDS, TRIPS_STUDY_BONUS, openDests, tripContent, type SpaceDest, type SpaceQuiz } from '../lib/space';
import { CharSVG } from './CharSVG';

// 🚀 うちゅうりょこう（ロケット）／📘 うちゅうずかん（うちゅうきち）。
// いきさきを えらぶ → 3・2・1 はっしゃ → とうちゃく（まめちしき）→ クイズ1もん → おみやげ。

type Phase =
  | { kind: 'pick' }
  | { kind: 'count'; dest: SpaceDest; isNew: boolean; n: number }
  | { kind: 'fly'; dest: SpaceDest; isNew: boolean }
  | { kind: 'arrive'; dest: SpaceDest; isNew: boolean; facts: string[]; quiz: SpaceQuiz }
  | { kind: 'quiz'; dest: SpaceDest; isNew: boolean; quiz: SpaceQuiz; chosen: number | null }
  | { kind: 'done'; dest: SpaceDest; correct: boolean; got: number; reward: string | null; title: string | null };

/** 月と かせいには おりられる。ほかは まどから みる */
const LANDABLE = new Set(['moon', 'mars']);

export function SpaceTripModal({ tab: tab0, studied, crew, onClose }: {
  tab: 'go' | 'dex'; studied: boolean; crew: Friend[]; onClose(): void;
}) {
  const g = useGame();
  const hasRocket = g.save.buildings.includes('bd_rocket');
  const [tab, setTab] = useState<'go' | 'dex'>(hasRocket ? tab0 : 'dex');
  const [phase, setPhase] = useState<Phase>({ kind: 'pick' });
  const dex = g.save.space.dex;
  const left = g.spaceTripsLeft(studied);
  const open = openDests(dex);
  const riders = crew.filter((f) => f.level > 1).slice(0, 3);

  // とちゅうで とじたら、おみやげだけは わたす（かいすうは もう つかっている）
  const pending = useRef<{ dest: string; isNew: boolean } | null>(null);
  useEffect(() => () => {
    setSpaceBgm(null);
    if (pending.current) g.spaceReturn(pending.current.dest, false, pending.current.isNew);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // BGM：はっしゃまでは わくわく、うちゅうでは ゆったり、かえったら とめる
  useEffect(() => {
    setSpaceBgm(phase.kind === 'count' || phase.kind === 'fly' ? 'launch' : phase.kind === 'arrive' || phase.kind === 'quiz' ? 'space' : null);
  }, [phase.kind]);

  // カウントダウン → とぶ → とうちゃく
  useEffect(() => {
    if (phase.kind === 'count') {
      const id = window.setTimeout(() => {
        if (phase.n > 1) setPhase({ ...phase, n: phase.n - 1 });
        else { sfx('launch'); setPhase({ kind: 'fly', dest: phase.dest, isNew: phase.isNew }); }
      }, 800);
      return () => window.clearTimeout(id);
    }
    if (phase.kind === 'fly') {
      const id = window.setTimeout(() => {
        const c = tripContent(phase.dest, dateKey(), g.save.space.trips);
        setPhase({ kind: 'arrive', dest: phase.dest, isNew: phase.isNew, ...c });
      }, 2800);
      return () => window.clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const launch = (dest: SpaceDest) => {
    const r = g.spaceLaunch(dest.id, studied);
    if (!r) return;
    pending.current = { dest: dest.id, isNew: r.isNew };
    sfx('siren');
    setPhase({ kind: 'count', dest, isNew: r.isNew, n: 3 });
  };

  const answer = (i: number) => {
    if (phase.kind !== 'quiz' || phase.chosen !== null) return;
    const correct = i === phase.quiz.answer;
    sfx(correct ? 'heart' : 'ng');
    setPhase({ ...phase, chosen: i });
    const r = g.spaceReturn(phase.dest.id, correct, phase.isNew);
    pending.current = null;
    window.setTimeout(() => setPhase({ kind: 'done', dest: phase.dest, correct, ...r }), 1800);
  };

  const busy = phase.kind === 'count' || phase.kind === 'fly';

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={busy ? undefined : onClose}>
      <div className="panel max-h-[88vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {phase.kind === 'pick' && (
          <div className="mb-2 flex gap-1.5">
            {(['go', 'dex'] as const).map((t) => (
              <button
                key={t}
                className={`flex-1 rounded-xl px-2 py-2 text-[13px] font-black ${tab === t ? 'bg-indigo-600 text-white shadow' : 'bg-indigo-50 text-indigo-700'}`}
                onClick={() => setTab(t)}
              >
                {t === 'go' ? '🚀 うちゅうへ' : `📘 うちゅうずかん ${dex.length}/${DESTS.length}`}
              </button>
            ))}
          </div>
        )}

        {phase.kind === 'pick' && tab === 'go' && (
          !hasRocket ? (
            <div className="rounded-2xl bg-indigo-50 px-3 py-4 text-center text-[13px] font-bold leading-relaxed text-ink">
              🚀 ロケットを けんせつすると<br />うちゅうりょこうに いけるよ！
            </div>
          ) : (
            <div>
              <div className="mb-2 text-center text-[12px] font-bold text-indigo-900/60">
                きょう あと {left}かい とべるよ{!studied && `（クイズを 5もん やると +${TRIPS_STUDY_BONUS}かい）`}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DESTS.map((d) => {
                  const can = open.some((o) => o.id === d.id);
                  const been = dex.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      disabled={!can || left <= 0}
                      onClick={() => launch(d)}
                      className={`rounded-2xl border-2 px-2 py-2 text-center ${can ? 'border-indigo-300 bg-white' : 'border-dashed border-indigo-200 bg-indigo-50/50'} disabled:opacity-60`}
                    >
                      <div className="text-3xl">{can ? d.emoji : '❔'}</div>
                      <div className="text-[13px] font-black text-ink">{can ? d.name : '？？？'}</div>
                      <div className="text-[10px] font-bold text-indigo-900/50">{can ? d.far : 'まえの ほしに いくと ひらく'}</div>
                      {can && !been && <div className="mt-0.5 text-[10px] font-black text-rose-500">✨ はじめて！</div>}
                    </button>
                  );
                })}
              </div>
              {riders.length > 0 && (
                <div className="mt-2 text-center text-[11px] font-bold text-indigo-900/60">
                  いっしょに のる なかま：{riders.map((f) => f.name).join('・')}
                </div>
              )}
            </div>
          )
        )}

        {phase.kind === 'pick' && tab === 'dex' && <SpaceDex dex={dex} />}

        {(phase.kind === 'count' || phase.kind === 'fly') && (
          <div className="relative h-[260px] overflow-hidden rounded-2xl" style={{ background: phase.kind === 'fly' ? '#0b1026' : 'linear-gradient(#38bdf8, #bae6fd)' }}>
            {phase.kind === 'fly' && Array.from({ length: 18 }, (_, i) => (
              <div
                key={i}
                className="space-streak absolute w-[2px] rounded bg-white/80"
                style={{ left: `${(i * 53) % 100}%`, height: 20 + ((i * 7) % 30), animationDelay: `${-(i % 6) * 0.12}s` }}
              />
            ))}
            {phase.kind === 'count' && <div className="absolute inset-x-0 bottom-0 h-10 bg-green-400" />}
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 ${phase.kind === 'fly' ? 'rocket-shake' : ''}`}>
              <svg viewBox="-40 -180 80 200" width="80" height="200">
                {phase.kind === 'fly' && <path d="M-10 -6 Q0 40 10 -6 Z" fill="#f97316" className="twinkle" />}
                <path d="M-14 -20 L-30 -4 L-30 -34 L-14 -56 Z" fill="#ef4444" stroke="#4c1d95" strokeWidth="2.6" />
                <path d="M14 -20 L30 -4 L30 -34 L14 -56 Z" fill="#ef4444" stroke="#4c1d95" strokeWidth="2.6" />
                <path d="M-16 -8 L-16 -120 Q0 -176 16 -120 L16 -8 Z" fill="#f8fafc" stroke="#4c1d95" strokeWidth="2.6" />
                <path d="M-15 -128 Q0 -176 15 -128 Z" fill="#ef4444" stroke="#4c1d95" strokeWidth="2.6" />
                <circle cx="0" cy="-96" r="9" fill="#7dd3fc" stroke="#4c1d95" strokeWidth="2.6" />
              </svg>
            </div>
            {phase.kind === 'count' ? (
              <div key={phase.n} className="absolute inset-0 flex items-center justify-center text-[72px] font-black text-indigo-900 drop-shadow-lg" style={{ animation: 'bubble-pop .3s' }}>
                {phase.n}
              </div>
            ) : (
              <div className="absolute inset-x-0 top-3 text-center text-[15px] font-black text-white">
                {phase.dest.emoji} {phase.dest.name}へ しゅっぱつ！
              </div>
            )}
          </div>
        )}

        {phase.kind === 'arrive' && (
          <div>
            <DestScene dest={phase.dest} riders={riders} />
            <div className="mt-2 text-center text-[15px] font-black text-ink">
              {phase.dest.emoji} {phase.dest.name}に {LANDABLE.has(phase.dest.id) ? 'とうちゃく！' : 'ちかづいたよ！'}
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              {phase.facts.map((f, i) => (
                <div key={i} className="rounded-2xl bg-indigo-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-ink">💡 {f}</div>
              ))}
            </div>
            <button className="btn-main mt-3" onClick={() => setPhase({ kind: 'quiz', dest: phase.dest, isNew: phase.isNew, quiz: phase.quiz, chosen: null })}>
              ❓ うちゅうクイズに こたえて かえる
            </button>
          </div>
        )}

        {phase.kind === 'quiz' && (
          <div>
            <div className="mb-2 text-center text-[12px] font-black text-indigo-700">❓ うちゅうクイズ</div>
            <div className="rounded-2xl bg-indigo-50 px-3 py-3 text-center text-[14px] font-black leading-relaxed text-ink">{phase.quiz.q}</div>
            <div className="mt-2 flex flex-col gap-1.5">
              {phase.quiz.choices.map((c, i) => {
                const shown = phase.chosen !== null;
                const ok = i === phase.quiz.answer;
                return (
                  <button
                    key={i}
                    className={`rounded-2xl border-2 px-3 py-2.5 text-[13px] font-black ${
                      !shown ? 'border-indigo-200 bg-white text-ink' : ok ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : i === phase.chosen ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-indigo-100 bg-white text-ink/40'
                    }`}
                    onClick={() => answer(i)}
                  >
                    {shown && ok ? '⭕ ' : shown && i === phase.chosen ? '❌ ' : ''}{c}
                  </button>
                );
              })}
            </div>
            {phase.chosen !== null && (
              <div className="mt-2 rounded-2xl bg-amber-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-ink">{phase.quiz.why}</div>
            )}
          </div>
        )}

        {phase.kind === 'done' && (
          <div className="flex flex-col items-center gap-1.5 py-2 text-center">
            <div className="text-5xl">🏝️</div>
            <div className="text-[15px] font-black text-ink">しまに かえってきた！</div>
            <div className="text-[12px] font-bold text-indigo-900/60">{phase.correct ? 'クイズ せいかい！ おみやげ ふえたよ' : 'つぎは わかるね！'}</div>
            <div className="mt-1 w-full rounded-2xl bg-amber-50 px-3 py-2 text-[13px] font-black text-ink">
              {ITEM_BY_ID.gf_spacefood.emoji} {ITEM_BY_ID.gf_spacefood.name} ×{phase.got}
              <div className="text-[11px] font-bold text-indigo-900/60">なかまに プレゼント できるよ</div>
            </div>
            {phase.reward && (
              <div className="font-black text-violet-700 text-[12px]">
                🎉 ごほうび：{ITEM_BY_ID[phase.reward].emoji} {ITEM_BY_ID[phase.reward].name}
                {ITEM_BY_ID[phase.reward].kind === 'fwear' ? '（なかまに つけられるよ）' : '（「かぐ」から おけるよ）'}
              </div>
            )}
            {phase.title && <div className="text-[12px] font-black text-violet-700">🏅 しょうごう「{phase.title}」</div>}
            <button className="btn mt-2" onClick={() => setPhase({ kind: 'pick' })}>もどる</button>
          </div>
        )}

        {!busy && phase.kind !== 'quiz' && <button className="btn mt-3" onClick={onClose}>とじる</button>}
      </div>
    </div>
  );
}

/** とうちゃくした ばしょの え。月と かせいは じめんに たつ（ジャンプ できる）、ほかは まどから */
function DestScene({ dest, riders }: { dest: SpaceDest; riders: Friend[] }) {
  const [jump, setJump] = useState(0);
  const land = LANDABLE.has(dest.id);
  const moon = dest.id === 'moon';
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <svg viewBox="0 0 320 190" className="block w-full">
        <rect width="320" height="190" fill="#0b1026" />
        {Array.from({ length: 26 }, (_, i) => (
          <circle key={i} cx={(i * 97) % 320} cy={(i * 41) % 120} r={i % 4 === 0 ? 1.6 : 1} fill="#fff" opacity={0.5 + (i % 3) * 0.2} />
        ))}
        {land ? (
          <>
            {moon ? (
              // 月から みた ちきゅう（はんぶん ひかって いる）
              <g transform="translate(250 46)">
                <circle r="22" fill="#1e3a8a" />
                <path d="M0 -22 A22 22 0 0 1 0 22 A10 22 0 0 0 0 -22 Z" fill="#38bdf8" />
                <path d="M4 -10 q8 2 6 10 q-6 4 -8 -2 Z" fill="#4ade80" />
              </g>
            ) : (
              <circle cx="60" cy="40" r="10" fill="#fef3c7" opacity="0.8" />
            )}
            <path d="M0 140 Q80 124 160 134 T320 130 L320 190 L0 190 Z" fill={moon ? '#9ca3af' : '#c2410c'} />
            {[[50, 160, 16], [150, 170, 10], [250, 158, 20], [205, 178, 7]].map(([x, y, r], i) => (
              <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.35} fill={moon ? '#6b7280' : '#9a3412'} />
            ))}
            {moon && <text x="12" y="20" fontSize="11" fontWeight="900" fill="#fff">じゅうりょく ちきゅうの 6ぶんの1</text>}
          </>
        ) : (
          <>
            <circle cx="160" cy="98" r={dest.id === 'jupiter' ? 74 : dest.id === 'sun' ? 80 : 58} fill={dest.color} />
            {dest.id === 'jupiter' && [70, 88, 108, 124].map((y, i) => <rect key={i} x="86" y={y} width="148" height="6" rx="3" fill="#c2410c" opacity="0.45" />)}
            {dest.id === 'jupiter' && <ellipse cx="190" cy="118" rx="14" ry="8" fill="#b91c1c" />}
            {dest.id === 'saturn' && <ellipse cx="160" cy="98" rx="112" ry="22" fill="none" stroke="#f59e0b" strokeWidth="9" transform="rotate(-14 160 98)" opacity="0.85" />}
            {dest.id === 'venus' && <path d="M110 80 q50 -16 100 0 M104 110 q56 14 112 0" stroke="#fef3c7" strokeWidth="6" fill="none" opacity="0.7" />}
            {dest.id === 'sun' && <circle cx="160" cy="98" r="92" fill="#fdba74" opacity="0.3" />}
            {/* うちゅうせんの まど */}
            <rect x="2" y="2" width="316" height="186" rx="22" fill="none" stroke="#94a3b8" strokeWidth="10" />
          </>
        )}
      </svg>
      {land && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {riders.map((f, i) => (
            <div key={f.id + jump} className={jump ? (moon ? 'moon-jump' : 'char-jump') : ''} style={{ animationDelay: `${i * 0.12}s` }}>
              <CharSVG charKey={f.char} level={f.level} fillPct={f.fill} size={52} stars={f.stars} label={f.name} />
            </div>
          ))}
        </div>
      )}
      {land && riders.length > 0 && (
        <button
          className="absolute right-2 top-2 rounded-xl bg-white/90 px-3 py-1.5 text-[12px] font-black text-indigo-700 shadow"
          onClick={() => { sfx('heart'); setJump((n) => n + 1); }}
        >
          🦘 ジャンプ！
        </button>
      )}
    </div>
  );
}

function SpaceDex({ dex }: { dex: string[] }) {
  const next = SPACE_REWARDS.find((r) => dex.length < r.kinds);
  return (
    <div>
      {next && (
        <div className="mb-2 text-center text-[11px] font-bold text-indigo-900/60">
          あと {next.kinds - dex.length}かしょ で {ITEM_BY_ID[next.item].emoji} {ITEM_BY_ID[next.item].name}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        {DESTS.map((d) => {
          const been = dex.includes(d.id);
          return (
            <div key={d.id} className={`rounded-2xl px-3 py-2 ${been ? 'bg-indigo-50' : 'bg-slate-100'}`}>
              <div className="text-[13px] font-black text-ink">{been ? `${d.emoji} ${d.name}` : '❔ まだ いっていない ほし'}</div>
              {been && <div className="mt-0.5 text-[11px] font-bold leading-relaxed text-indigo-900/70">{d.facts[0]}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
