import { useState } from 'react';
import { useGame } from '../state/useGame';
import type { KojoGot } from '../state/GameProvider';
import { ITEM_BY_ID } from '../lib/items';
import { dateKey, STAMP_MIN } from '../lib/study';
import { eventToday } from '../lib/detective';
import {
  dailyQuestions, doubleNote, KOJO_GOAL, KOJO_REWARDS, KOJO_TITLE, kojoDaysLeft,
  QUIZ_PER_DAY, shuffledChoices, studiedOnDay, WORK_PER_DAY, workToday,
} from '../lib/kojo';
import { FurnitureSVG } from './FurnitureSVG';

// イベント「サンタの おもちゃこうじょう」の 全画面：ぶひんの はこ／きょうの まめクイズ／こうじょうの しごと／ごほうび

function PartsBox({ pts }: { pts: number }) {
  const pct = Math.min(100, (pts / KOJO_GOAL) * 100);
  return (
    <div className="rounded-2xl bg-white/90 p-3 shadow">
      <div className="mb-1 flex items-end justify-between">
        <div className="text-[13px] font-black text-amber-800">🧰 ぶひんの はこ</div>
        <div className="text-[20px] font-black text-amber-700">⚙️ {pts}<span className="text-[12px] text-amber-500"> / {KOJO_GOAL}</span></div>
      </div>
      <div className="relative h-4 rounded-full bg-amber-100">
        <div className="h-4 rounded-full bg-gradient-to-r from-emerald-400 to-red-500 transition-all" style={{ width: `${pct}%` }} />
        {KOJO_REWARDS.map((r) => (
          <div key={r.at} className="absolute -top-1 h-6 w-0.5 bg-amber-800/40" style={{ left: `${(r.at / KOJO_GOAL) * 100}%` }} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {KOJO_REWARDS.map((r) => {
          const it = ITEM_BY_ID[r.item];
          const got = pts >= r.at;
          return (
            <div key={r.at} className={`flex flex-col items-center rounded-xl px-1 py-1.5 ${got ? 'bg-amber-200' : 'bg-amber-50'}`}>
              <svg viewBox="-36 -70 72 78" width="46" height="50" className={got ? '' : 'opacity-40 grayscale'}><FurnitureSVG id={r.item} /></svg>
              <div className="text-center text-[10.5px] font-black leading-tight text-amber-900">{it?.name}</div>
              <div className="text-[10px] font-extrabold text-amber-600">{got ? '✅ もらった' : `⚙️${r.at}`}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 text-center text-[11px] font-bold text-amber-700">
        {pts >= KOJO_GOAL ? `🏅 しょうごう「${KOJO_TITLE}」を もらったよ！` : `⚙️${KOJO_GOAL}で しょうごう「${KOJO_TITLE}」`}
      </div>
    </div>
  );
}

export function KojoModal({ onClose }: { onClose(): void }) {
  const g = useGame();
  const now = eventToday();
  const day = dateKey(now);
  const h = g.save.kojo.day === day ? g.save.kojo : { ...g.save.kojo, quiz: {} as Record<string, boolean>, worked: 0 };
  const studied = studiedOnDay(now);
  const dbl = doubleNote(now);
  const gain = dbl ? 2 : 1;
  const qs = dailyQuestions(day);
  const [qi, setQi] = useState(() => qs.findIndex((q) => !(q.id in h.quiz)));
  const [picked, setPicked] = useState<string | null>(null);
  const [msg, setMsg] = useState<KojoGot | null>(null);
  const left = kojoDaysLeft(now);
  const quizDone = Object.keys(h.quiz).length >= QUIZ_PER_DAY;
  const canWork = workToday(now);

  const answer = (choice: string) => {
    if (picked || qi < 0) return;
    const q = qs[qi];
    const ok = choice === q.choices[0];
    setPicked(choice);
    const r = g.kojoAnswer(day, q.id, ok, gain);
    if (r) setMsg(r);
  };
  const next = () => {
    setPicked(null);
    setMsg(null);
    const n = qs.findIndex((q, i) => i > qi && !(q.id in g.save.kojo.quiz));
    setQi(n);
  };
  const work = () => {
    const r = g.kojoWork(day, canWork);
    if (r) setMsg(r);
  };

  const q = qi >= 0 ? qs[qi] : null;
  const right = qs.filter((x) => h.quiz[x.id]).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#1e3a8a] via-[#166534] to-[#991b1b]">
      <div className="mx-auto max-w-[560px] px-3 pb-10 pt-3">
        <div className="mb-2 flex items-center gap-2">
          <button className="rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-black text-ink shadow active:scale-95" onClick={onClose}>◀ しまへ</button>
          <div className="flex-1 text-center text-[19px] font-black text-white drop-shadow">🎅 サンタの おもちゃこうじょう</div>
        </div>
        <div className="mb-2 text-center text-[12px] font-bold text-white/90">
          {left > 0 ? `12がつ24にちまで（あと ${left}にち）` : 'きょうは クリスマスイブ！ さいごの ひ！'}
          ・ぶひんを あつめて サンタの おもちゃを つくろう
        </div>
        {dbl && (
          <div className="mb-2 rounded-2xl bg-amber-400 px-3 py-2 text-[12.5px] font-black leading-relaxed text-amber-950 shadow">
            📣 {dbl} きょうは まめクイズの ぶひんが 2ばい！ さいごの おさらいを しよう
          </div>
        )}

        <PartsBox pts={g.save.kojo.pts} />

        {msg && (msg.rewards.length > 0 || msg.title) && (
          <div className="mt-2 rounded-2xl border-2 border-amber-400 bg-white px-3 py-2.5 text-center shadow-lg">
            {msg.rewards.map((id) => (
              <div key={id} className="text-[14px] font-black text-amber-700">🎁「{ITEM_BY_ID[id]?.name}」を もらった！ しまの「しまに おける かぐ」から おいてね</div>
            ))}
            {msg.title && <div className="text-[14px] font-black text-rose-600">🏅 しょうごう「{msg.title}」！</div>}
          </div>
        )}

        {/* ── きょうの まめクイズ ── */}
        <div className="mt-3 rounded-2xl bg-white/95 p-3 shadow">
          <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-2">
            <div className="text-[14px] font-black text-amber-900">📝 きょうの まめクイズ</div>
            <div className="text-[11.5px] font-extrabold text-amber-600">せいかい 1もん ＝ ⚙️+{gain}・1日 {QUIZ_PER_DAY}もん</div>
          </div>
          {!studied ? (
            <div className="rounded-xl bg-amber-50 px-3 py-3 text-center text-[13px] font-bold leading-relaxed text-amber-800">
              🔒 きょう クイズを {STAMP_MIN}もん やると ちょうせん できるよ<br />
              <a href="/" className="mt-1.5 inline-block rounded-full bg-amber-500 px-4 py-1.5 text-[13px] font-black text-white shadow">✏️ クイズへ</a>
            </div>
          ) : q ? (
            <div>
              <div className="mb-1 text-[11px] font-extrabold text-slate-500">{q.cat === 'rika' ? 'りか' : 'しゃかい'}「{q.unit}」・{qs.indexOf(q) + 1} / {QUIZ_PER_DAY}</div>
              <div className="mb-2 text-[15px] font-black leading-relaxed text-ink">{q.q}</div>
              <div className="grid gap-1.5">
                {shuffledChoices(q, day).map((c) => {
                  const isAns = c === q.choices[0];
                  const tone = !picked ? 'bg-amber-100 text-amber-900' : isAns ? 'bg-emerald-500 text-white' : c === picked ? 'bg-rose-400 text-white' : 'bg-slate-100 text-slate-400';
                  return (
                    <button key={c} disabled={!!picked} className={`rounded-xl px-3 py-2.5 text-left text-[14.5px] font-black shadow-sm active:scale-[0.98] ${tone}`} onClick={() => answer(c)}>
                      {picked && isAns ? '⭕ ' : picked && c === picked ? '❌ ' : ''}{c}
                    </button>
                  );
                })}
              </div>
              {picked && (
                <div className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[13px] font-bold leading-relaxed text-amber-900">
                  {picked === q.choices[0] ? `せいかい！ ⚙️+${gain}` : `こたえは「${q.choices[0]}」`}　{q.note}
                  <button className="mt-1.5 block w-full rounded-xl bg-amber-500 py-2 text-[14px] font-black text-white shadow active:scale-95" onClick={next}>
                    {qs.some((x, i) => i > qi && !(x.id in g.save.kojo.quiz)) ? 'つぎの もんだい ▶' : 'おしまい'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-emerald-50 px-3 py-3 text-center text-[13px] font-bold text-emerald-800">
              {quizDone ? `きょうは ${right} / ${QUIZ_PER_DAY}もん せいかい！ また あした ちょうせんしてね` : 'また あした ちょうせんしてね'}
            </div>
          )}
        </div>

        {/* ── こうじょうの しごと（単元クリア） ── */}
        <div className="mt-3 rounded-2xl bg-white/95 p-3 shadow">
          <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-2">
            <div className="text-[14px] font-black text-amber-900">🏭 こうじょうの しごと</div>
            <div className="text-[11.5px] font-extrabold text-amber-600">クリアした きょうか 1つ ＝ ⚙️+1・1日 {WORK_PER_DAY}こまで</div>
          </div>
          {h.worked > 0 ? (
            <div className="rounded-xl bg-emerald-50 px-3 py-3 text-center text-[13px] font-bold text-emerald-800">きょうの しごとは おしまい（⚙️+{h.worked}）。ありがとう！</div>
          ) : canWork > 0 ? (
            <button className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-red-500 px-3 py-3 text-[15px] font-black text-white shadow active:scale-95" onClick={work}>
              🔨 おもちゃを くみたてる（⚙️+{canWork}）
            </button>
          ) : (
            <div className="rounded-xl bg-amber-50 px-3 py-3 text-center text-[12.5px] font-bold leading-relaxed text-amber-800">
              きょう クイズで 単元を さいごまで といて 80てん いじょう とると、しごとが できるよ。<br />2きょうか クリアで ⚙️+2！
              <a href="/" className="mt-1.5 block rounded-full bg-amber-500 px-4 py-1.5 text-[13px] font-black text-white shadow">✏️ クイズへ</a>
            </div>
          )}
        </div>

        <div className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-[11.5px] font-bold leading-relaxed text-amber-900">
          🗓️ 12がつ24にちまで。テストの まえの日（12がつ13にち・17にち）は まめクイズの ぶひんが 2ばい！ ⚙️{KOJO_GOAL}で しょうごう「{KOJO_TITLE}」
        </div>
      </div>
    </div>
  );
}
