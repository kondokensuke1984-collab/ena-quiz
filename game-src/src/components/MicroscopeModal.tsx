// 🔬 けんびきょう：みずを とる → じゅんび（てじゅん）→ のぞく（プレパラートを うごかす・レボルバー）→ なまえあて → ずかん
// 8月 理科「メダカの育ち方」の プランクトンと けんびきょうの つかいかたの ふりかえり。

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  EYEPIECE, FIELD_100, makeSlide, MAX_FRAC, MIN_FRAC, OBJECTIVES, PLANKTON, PLANKTON_BY_ID, PLANKTON_PER_DAY, PLANKTON_REWARDS,
  PLANKTON_STUDY_BONUS, PREP_STEPS, PREP_TRAP, SLIDE_HALF, stepCritters, TYPE_LABEL, TYPE_WHY, WATERS,
  type Critter, type PlanktonType, type WaterId,
} from '../lib/plankton';
import { ITEM_BY_ID } from '../lib/items';
import { sfx, unlockAudio } from '../lib/sound';
import { useGame } from '../state/useGame';
import { PlanktonArt, PlanktonIcon } from './PlanktonSVG';

type Phase = 'water' | 'prep' | 'look' | 'dex';
/** しやの はんけい（px） */
const R = 120;

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

export function MicroscopeModal({ studied, onClose }: { studied: boolean; onClose: () => void }) {
  const g = useGame();
  const dex = g.save.micro.dex;
  const [phase, setPhase] = useState<Phase>('water');
  const [water, setWater] = useState<WaterId>('tank');

  const left = g.microLeft(studied);
  const nextReward = PLANKTON_REWARDS.find((r) => dex.length < r.kinds);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[92vh] w-full max-w-[520px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[14px] font-black text-ink">🔬 けんびきょう</div>
          <button
            className={`rounded-lg px-2 py-1 text-[11px] font-black ${phase === 'dex' ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-800'}`}
            onClick={() => setPhase(phase === 'dex' ? 'water' : 'dex')}
          >
            📗 ずかん {dex.length}/{PLANKTON.length}
          </button>
        </div>

        {phase === 'water' && (
          <>
            <p className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-ink">
              どの みずを しらべる？ みずに よって いる プランクトンが ちがうよ。
            </p>
            <div className="grid gap-1.5">
              {WATERS.map((w) => (
                <button
                  key={w.id}
                  className="rounded-xl bg-white/80 px-3 py-2 text-left ring-1 ring-sky-200"
                  onClick={() => { unlockAudio(); sfx('splash'); setWater(w.id); setPhase('prep'); }}
                >
                  <div className="text-[13px] font-black text-ink">{w.emoji} {w.label}</div>
                  <div className="text-[11px] font-bold text-indigo-900/60">{w.desc}</div>
                </button>
              ))}
            </div>
            <div className="mt-2 text-[11px] font-bold text-indigo-900/60">
              きょう ずかんに のせられるのは あと {left}かい
              {!studied && `（クイズを 5もん やると +${PLANKTON_STUDY_BONUS}かい）`}
            </div>
          </>
        )}

        {phase === 'prep' && <Prep onDone={() => setPhase('look')} />}

        {phase === 'look' && <Look water={water} studied={studied} onBack={() => setPhase('water')} />}

        {phase === 'dex' && (
          <>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-4">
              {PLANKTON.map((p) => {
                const got = dex.includes(p.id);
                return (
                  <div key={p.id} className="flex flex-col items-center rounded-xl bg-white/80 px-1 py-1.5 ring-1 ring-violet-100">
                    <PlanktonIcon id={p.id} px={48} gray={!got} />
                    <div className="text-[11px] font-black text-ink">{got ? p.name : '？？？'}</div>
                    {got && <div className="text-[9px] font-bold text-indigo-900/60">{p.type === 'plant' ? '🌿しょくぶつ' : '🦐どうぶつ'}</div>}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-[11px] font-bold leading-relaxed text-indigo-900/60">
              {nextReward
                ? `あと ${nextReward.kinds - dex.length}しゅるいで ${ITEM_BY_ID[nextReward.item].emoji}${ITEM_BY_ID[nextReward.item].name}`
                : dex.length < PLANKTON.length ? `ぜんぶ みつけると しょうごうが もらえるよ` : '🎉 ぜんぶ みつけたね！'}
            </div>
            {dex.length > 0 && (
              <div className="mt-2 grid gap-1">
                {PLANKTON.filter((p) => dex.includes(p.id)).map((p) => (
                  <div key={p.id} className="rounded-lg bg-sky-50 px-2 py-1 text-[11px] font-bold leading-relaxed text-ink">
                    <b>{p.name}</b>：{p.note}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <button className="btn mt-3" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}

// ── じゅんび：てじゅんを ただしい じゅんばんに ──
function Prep({ onDone }: { onDone: () => void }) {
  const g = useGame();
  const [done, setDone] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const buttons = useMemo(() => shuffle([...PREP_STEPS, PREP_TRAP]), []);

  const press = (id: string) => {
    if (PREP_STEPS.slice(0, done).some((s) => s.id === id)) return;
    const s = [...PREP_STEPS, PREP_TRAP].find((x) => x.id === id)!;
    if (!s.trap && PREP_STEPS[done].id === id) {
      const n = done + 1;
      setDone(n);
      setMsg(null);
      sfx('coin');
      if (n === PREP_STEPS.length) {
        g.setMicroReady();
        window.setTimeout(() => { sfx('reveal'); onDone(); }, 700);
      }
      return;
    }
    sfx('ng');
    // まだ はやい てじゅんを おしたら、その てじゅんの まえに やること。わなは わなの りゆう
    setMsg(s.wrong);
  };

  return (
    <>
      <p className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-ink">
        けんびきょうの じゅんび。ただしい じゅんばんに おしてね（{done}/{PREP_STEPS.length}）
      </p>
      {g.save.micro.ready && done === 0 && (
        <button className="btn-main mb-2 !py-2 text-[12px]" onClick={onDone}>✅ じゅんび かんりょう（もう おぼえた！）</button>
      )}
      {done > 0 && (
        <ol className="mb-2 list-inside list-decimal rounded-xl bg-emerald-50 px-3 py-1.5 text-[11px] font-bold leading-relaxed text-emerald-800">
          {PREP_STEPS.slice(0, done).map((s) => <li key={s.id}>{s.label}</li>)}
        </ol>
      )}
      <div className="grid gap-1.5">
        {buttons.filter((b) => !PREP_STEPS.slice(0, done).some((s) => s.id === b.id)).map((b) => (
          <button key={b.id} className="rounded-xl bg-white/80 px-3 py-2 text-left text-[12px] font-black text-ink ring-1 ring-violet-200" onClick={() => press(b.id)}>
            {b.label}
          </button>
        ))}
      </div>
      {msg && (
        <div className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-rose-800">🌙 ルナ「{msg}」</div>
      )}
    </>
  );
}

// ── のぞく ──
type Quiz = { id: string; step: 'name' | 'type'; names: string[]; wrong: string | null };

function Look({ water, studied, onBack }: { water: WaterId; studied: boolean; onBack: () => void }) {
  const g = useGame();
  const [critters, setCritters] = useState<Critter[]>(() => makeSlide(water));
  const [slide, setSlide] = useState({ x: 0, y: 0 });      // プレパラートを うごかした きょり
  const [obj, setObj] = useState<(typeof OBJECTIVES)[number]>(10);
  const [tip, setTip] = useState<string | null>('プレパラートを うごかして、プランクトンを しやの まんなかに もってこよう。');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [result, setResult] = useState<{ id: string; text: string } | null>(null);
  const movedTip = useRef(false);
  const hold = useRef<number | null>(null);
  // ゴミの つぶ（プレパラートと いっしょに うごいて みえる）
  const dust = useMemo(() => Array.from({ length: 70 }, () => ({
    x: (Math.random() * 2 - 1) * (SLIDE_HALF + 0.4), y: (Math.random() * 2 - 1) * (SLIDE_HALF + 0.4), r: 0.004 + Math.random() * 0.01,
  })), []);

  // うごかす（quiz の あいだは とめる）
  const paused = quiz !== null;
  useEffect(() => {
    if (paused) return;
    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setCritters((cs) => stepCritters(cs, dt, now / 1000));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused]);
  useEffect(() => () => { if (hold.current) window.clearInterval(hold.current); }, []);

  const mag = EYEPIECE * obj;
  const field = FIELD_100 * (100 / mag);
  const ppu = (2 * R) / field;

  // けんびきょうでは 上下左右が ぎゃくに みえる：がめんの いち ＝ −（いち＋うごかした きょり）
  const toScreen = (c: { x: number; y: number }) => ({ x: -(c.x + slide.x) * ppu, y: -(c.y + slide.y) * ppu });

  const move = (dx: number, dy: number) => {
    const st = field * 0.08;
    setSlide((s) => ({
      x: Math.max(-SLIDE_HALF, Math.min(SLIDE_HALF, s.x + dx * st)),
      y: Math.max(-SLIDE_HALF, Math.min(SLIDE_HALF, s.y + dy * st)),
    }));
    if (!movedTip.current) {
      movedTip.current = true;
      setTip('あれ？ うごかした むきと ぎゃくに うごいたね。けんびきょうでは 上下左右が ぎゃくに みえるんだ。');
    }
  };
  const startHold = (dx: number, dy: number) => {
    move(dx, dy);
    if (hold.current) window.clearInterval(hold.current);
    hold.current = window.setInterval(() => move(dx, dy), 90);
  };
  const endHold = () => { if (hold.current) { window.clearInterval(hold.current); hold.current = null; } };

  const tap = (c: Critter) => {
    const p = PLANKTON_BY_ID[c.id];
    const pos = toScreen(c);
    const frac = (p.size * ppu) / (2 * R);
    if (frac < MIN_FRAC) { sfx('ng'); setTip('ちいさくて よく みえない…。🔄 レボルバーを まわして ばいりつを あげよう。'); return; }
    if (frac > MAX_FRAC) { sfx('ng'); setTip('おおきすぎて はみだしてる…。🔄 レボルバーで ばいりつを さげよう。'); return; }
    if (Math.hypot(pos.x, pos.y) > R * 0.55) { sfx('ng'); setTip('しやの まんなかに もってきてから しらべよう（プレパラートを うごかしてね）。'); return; }
    unlockAudio();
    if (g.save.micro.dex.includes(p.id)) {
      sfx('letter');
      setResult({ id: p.id, text: `${p.name}だ！ ${p.note}` });
      return;
    }
    const others = shuffle(PLANKTON.filter((q) => q.id !== p.id)).slice(0, 2).map((q) => q.name);
    setQuiz({ id: p.id, step: 'name', names: shuffle([p.name, ...others]), wrong: null });
  };

  const answerName = (name: string) => {
    if (!quiz) return;
    const p = PLANKTON_BY_ID[quiz.id];
    if (name === p.name) { sfx('coin'); setQuiz({ ...quiz, step: 'type', wrong: null }); return; }
    sfx('ng');
    setQuiz({ ...quiz, wrong: `ちがうみたい。ヒント：${p.hint}` });
  };
  const answerType = (t: PlanktonType) => {
    if (!quiz) return;
    const p = PLANKTON_BY_ID[quiz.id];
    if (t !== p.type) { sfx('ng'); setQuiz({ ...quiz, wrong: `${p.name}は ${TYPE_LABEL[p.type].slice(3)}。${TYPE_WHY[p.type]}` }); return; }
    setQuiz(null);
    const r = g.markPlankton(p.id, studied);
    if (!r) {
      setResult({ id: p.id, text: `せいかい！ ${p.name}だね。きょうは もう ずかんに のせられないから、あした また さがしてね。` });
      sfx('coin');
      return;
    }
    let text = `🎉 ${p.name}を ずかんに のせたよ！ ${p.note}`;
    if (r.reward) text += ` ごほうびに ${ITEM_BY_ID[r.reward].emoji}${ITEM_BY_ID[r.reward].name}を もらったよ！（「かぐ」から おけるよ）`;
    setResult({ id: p.id, text });
    if (r.title) g.showToast(`🏅 しょうごう「${r.title}」を もらったよ！`);
    else if (r.reward) g.showToast(`${ITEM_BY_ID[r.reward].emoji} ${ITEM_BY_ID[r.reward].name}を もらったよ！`);
  };

  const qp = quiz ? PLANKTON_BY_ID[quiz.id] : null;

  return (
    <>
      <div className="mb-1 flex items-center justify-between text-[11px] font-black text-indigo-900/70">
        <span>{WATERS.find((w) => w.id === water)!.emoji} {WATERS.find((w) => w.id === water)!.label}</span>
        <span>せつがん{EYEPIECE}ばい × たいぶつ{obj}ばい ＝ <b className="text-[13px] text-violet-700">{mag}ばい</b></span>
      </div>

      <div className="flex flex-col items-center">
        <svg viewBox={`${-R - 6} ${-R - 6} ${2 * R + 12} ${2 * R + 12}`} className="w-full max-w-[280px]" style={{ touchAction: 'none' }}>
          <defs>
            <clipPath id="micro-field"><circle r={R} /></clipPath>
            <radialGradient id="micro-light">
              <stop offset="0.6" stopColor="#f0f9ff" />
              <stop offset="1" stopColor="#bae6fd" />
            </radialGradient>
          </defs>
          <circle r={R + 6} fill="#1e1b4b" />
          <g clipPath="url(#micro-field)">
            <circle r={R} fill="url(#micro-light)" />
            {dust.map((d, i) => {
              const s = toScreen(d);
              return Math.abs(s.x) < R + 10 && Math.abs(s.y) < R + 10
                ? <circle key={i} cx={s.x} cy={s.y} r={Math.max(0.8, d.r * ppu)} fill="#94a3b8" opacity="0.5" /> : null;
            })}
            {critters.map((c) => {
              const p = PLANKTON_BY_ID[c.id];
              const s = toScreen(c);
              const px = p.size * ppu;
              if (Math.hypot(s.x, s.y) > R + px / 2) return null;
              return (
                <g key={c.key} transform={`translate(${s.x} ${s.y})`} onPointerDown={(e) => { e.stopPropagation(); tap(c); }} style={{ cursor: 'pointer' }}>
                  <circle r={Math.max(16, px / 2)} fill="transparent" />
                  {/* 上下左右 ぎゃく＝180°まわった すがた */}
                  <PlanktonArt id={c.id} size={px} rot={c.rot + 180} />
                </g>
              );
            })}
            {obj === 40 && <circle r={R} fill="#000" opacity="0.14" pointerEvents="none" />}
            <circle r={R * 0.55} fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 5" opacity="0.4" pointerEvents="none" />
          </g>
        </svg>

        {/* プレパラートを うごかす ＋ レボルバー */}
        <div className="mt-2 flex w-full items-center justify-center gap-4">
          <div className="grid grid-cols-3 gap-1 text-[16px]" onPointerUp={endHold} onPointerLeave={endHold} onPointerCancel={endHold}>
            <span />
            <button className="rounded-lg bg-sky-100 px-3 py-1.5" onPointerDown={() => startHold(0, -1)} aria-label="うえ">⬆️</button>
            <span />
            <button className="rounded-lg bg-sky-100 px-3 py-1.5" onPointerDown={() => startHold(-1, 0)} aria-label="ひだり">⬅️</button>
            <span className="flex items-center justify-center text-[9px] font-black leading-tight text-indigo-900/60">プレパ<br />ラート</span>
            <button className="rounded-lg bg-sky-100 px-3 py-1.5" onPointerDown={() => startHold(1, 0)} aria-label="みぎ">➡️</button>
            <span />
            <button className="rounded-lg bg-sky-100 px-3 py-1.5" onPointerDown={() => startHold(0, 1)} aria-label="した">⬇️</button>
            <span />
          </div>
          <button
            className="rounded-xl bg-violet-600 px-3 py-2 text-[12px] font-black leading-tight text-white"
            onClick={() => { sfx('coin'); setObj(obj === 10 ? 40 : 10); setTip(obj === 10 ? '400ばいに したよ。大きく みえるけど、しやは せまく くらく なるね。' : '100ばいに もどしたよ。しやが ひろく あかるく なったね。'); }}
          >
            🔄 レボルバー<br />を まわす
          </button>
        </div>
      </div>

      {tip && !quiz && !result && (
        <div className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-ink">🌙 {tip}</div>
      )}

      {qp && quiz && (
        <div className="mt-2 rounded-xl bg-violet-50 px-3 py-2">
          <div className="flex items-center gap-2">
            <PlanktonIcon id={qp.id} px={48} />
            <div className="text-[13px] font-black text-ink">
              {quiz.step === 'name' ? 'この いきものの なまえは？' : `${qp.name}は どっち？`}
            </div>
          </div>
          <div className="mt-1.5 grid gap-1">
            {quiz.step === 'name'
              ? quiz.names.map((n) => (
                <button key={n} className="rounded-lg bg-white px-3 py-1.5 text-left text-[13px] font-black text-ink ring-1 ring-violet-200" onClick={() => answerName(n)}>{n}</button>
              ))
              : (['plant', 'animal'] as const).map((t) => (
                <button key={t} className="rounded-lg bg-white px-3 py-1.5 text-left text-[13px] font-black text-ink ring-1 ring-violet-200" onClick={() => answerType(t)}>{TYPE_LABEL[t]}</button>
              ))}
          </div>
          {quiz.wrong && <div className="mt-1.5 text-[11px] font-bold leading-relaxed text-rose-700">{quiz.wrong}</div>}
          <button className="mt-1 text-[11px] font-black text-violet-700 underline" onClick={() => setQuiz(null)}>← のぞくに もどる</button>
        </div>
      )}

      {result && (
        <div className="mt-2 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2">
          <PlanktonIcon id={result.id} px={44} />
          <div className="flex-1 text-[12px] font-bold leading-relaxed text-emerald-900">
            {result.text}
            <button className="ml-1 text-[11px] font-black text-violet-700 underline" onClick={() => setResult(null)}>つづける</button>
          </div>
        </div>
      )}

      <div className="mt-2 flex gap-2">
        <button className="btn !py-2 text-[12px]" onClick={() => { setCritters(makeSlide(water)); setSlide({ x: 0, y: 0 }); setResult(null); setQuiz(null); }}>🧫 あたらしい プレパラート</button>
        <button className="btn !py-2 text-[12px]" onClick={onBack}>💧 みずを かえる</button>
      </div>
      <div className="mt-1 text-[10px] font-bold text-indigo-900/50">
        ずかんに のせられるのは きょう あと {g.microLeft(studied)}かい（1にち {PLANKTON_PER_DAY}かい{studied ? ` ＋${PLANKTON_STUDY_BONUS}` : ''}）
      </div>
    </>
  );
}
