import { useState } from 'react';
import { useGame } from '../state/useGame';
import type { HarvestGot } from '../state/GameProvider';
import { ITEM_BY_ID } from '../lib/items';
import { dateKey, STAMP_MIN } from '../lib/study';
import { eventToday } from '../lib/detective';
import {
  dailyQuestions, daysLeft, HARVEST_END, HARVEST_GOAL, HARVEST_REWARDS, HARVEST_TITLE, isThanksDay, OFFER_ITEMS, OFFER_PER_DAY,
  QUIZ_PER_DAY, shuffledChoices, studiedOnDay,
} from '../lib/harvest';
import { FurnitureSVG } from './FurnitureSVG';

// イベント「あきの しゅうかくさい」の 全画面：みのりの かご／きょうの まめクイズ／おそなえ／ごほうび

function Basket({ pts }: { pts: number }) {
  const pct = Math.min(100, (pts / HARVEST_GOAL) * 100);
  return (
    <div className="rounded-2xl bg-white/90 p-3 shadow">
      <div className="mb-1 flex items-end justify-between">
        <div className="text-[13px] font-black text-amber-800">🧺 みのりの かご</div>
        <div className="text-[20px] font-black text-amber-700">🌾 {pts}<span className="text-[12px] text-amber-500"> / {HARVEST_GOAL}</span></div>
      </div>
      <div className="relative h-4 rounded-full bg-amber-100">
        <div className="h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all" style={{ width: `${pct}%` }} />
        {HARVEST_REWARDS.map((r) => (
          <div key={r.at} className="absolute -top-1 h-6 w-0.5 bg-amber-800/40" style={{ left: `${(r.at / HARVEST_GOAL) * 100}%` }} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {HARVEST_REWARDS.map((r) => {
          const it = ITEM_BY_ID[r.item];
          const got = pts >= r.at;
          return (
            <div key={r.at} className={`flex flex-col items-center rounded-xl px-1 py-1.5 ${got ? 'bg-amber-200' : 'bg-amber-50'}`}>
              <svg viewBox="-36 -70 72 78" width="46" height="50" className={got ? '' : 'opacity-40 grayscale'}><FurnitureSVG id={r.item} /></svg>
              <div className="text-center text-[10.5px] font-black leading-tight text-amber-900">{it?.name}</div>
              <div className="text-[10px] font-extrabold text-amber-600">{got ? '✅ もらった' : `🌾${r.at}`}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 text-center text-[11px] font-bold text-amber-700">
        {pts >= HARVEST_GOAL ? `🏅 しょうごう「${HARVEST_TITLE}」を もらったよ！` : `🌾${HARVEST_GOAL}で しょうごう「${HARVEST_TITLE}」`}
      </div>
    </div>
  );
}

export function HarvestModal({ onClose }: { onClose(): void }) {
  const g = useGame();
  const now = eventToday();
  const day = dateKey(now);
  const h = g.save.harvest.day === day ? g.save.harvest : { ...g.save.harvest, quiz: {} as Record<string, boolean>, offered: 0 };
  const studied = studiedOnDay(now);
  const thanks = isThanksDay(now);
  const gain = thanks ? 2 : 1;
  const qs = dailyQuestions(day);
  const [qi, setQi] = useState(() => qs.findIndex((q) => !(q.id in h.quiz)));
  const [picked, setPicked] = useState<string | null>(null);
  const [msg, setMsg] = useState<HarvestGot | null>(null);
  const left = daysLeft(now);
  const offerable = OFFER_ITEMS.filter((id) => (g.save.inventory[id] ?? 0) > 0 && ITEM_BY_ID[id]);
  const quizDone = Object.keys(h.quiz).length >= QUIZ_PER_DAY;

  const answer = (choice: string) => {
    if (picked || qi < 0) return;
    const q = qs[qi];
    const ok = choice === q.choices[0];
    setPicked(choice);
    const r = g.harvestAnswer(day, q.id, ok, gain);
    if (r) setMsg(r);
  };
  const next = () => {
    setPicked(null);
    setMsg(null);
    const n = qs.findIndex((q, i) => i > qi && !(q.id in g.save.harvest.quiz));
    setQi(n);
  };
  const offer = (id: string) => {
    const r = g.harvestOffer(day, id);
    if (r) setMsg(r);
  };

  const q = qi >= 0 ? qs[qi] : null;
  const right = qs.filter((x) => h.quiz[x.id]).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#fde68a] via-[#fdba74] to-[#f97316]">
      <div className="mx-auto max-w-[560px] px-3 pb-10 pt-3">
        <div className="mb-2 flex items-center gap-2">
          <button className="rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-black text-ink shadow active:scale-95" onClick={onClose}>◀ しまへ</button>
          <div className="flex-1 text-center text-[19px] font-black text-amber-900 drop-shadow-sm">🌾 あきの しゅうかくさい</div>
        </div>
        <div className="mb-2 text-center text-[12px] font-bold text-amber-900">
          {left > 0 ? `11がつ30にちまで（あと ${left}にち）` : 'きょうが さいごの ひ！'}
          ・みのりを あつめて おまつりを もりあげよう
        </div>
        {thanks && (
          <div className="mb-2 rounded-2xl bg-rose-600 px-3 py-2 text-[12.5px] font-black leading-relaxed text-white shadow">
            🎉 きょうは きんろう かんしゃの ひ！ むかしは「にいなめさい」といって、その年に とれた おこめを かみさまに そなえて かんしゃする ひだったよ。まめクイズの みのりが 2ばい！
          </div>
        )}

        <Basket pts={g.save.harvest.pts} />

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
            <div className="text-[11.5px] font-extrabold text-amber-600">せいかい 1もん ＝ 🌾+{gain}・1日 {QUIZ_PER_DAY}もん</div>
          </div>
          {!studied ? (
            <div className="rounded-xl bg-amber-50 px-3 py-3 text-center text-[13px] font-bold leading-relaxed text-amber-800">
              🔒 きょう クイズを {STAMP_MIN}もん やると ちょうせん できるよ<br />
              <a href="/" className="mt-1.5 inline-block rounded-full bg-amber-500 px-4 py-1.5 text-[13px] font-black text-white shadow">✏️ クイズへ</a>
            </div>
          ) : q ? (
            <div>
              <div className="mb-1 text-[11px] font-extrabold text-slate-500">しゃかい「日本の農業」・{qs.indexOf(q) + 1} / {QUIZ_PER_DAY}</div>
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
                  {picked === q.choices[0] ? `せいかい！ 🌾+${gain}` : `こたえは「${q.choices[0]}」`}　{q.note}
                  <button className="mt-1.5 block w-full rounded-xl bg-amber-500 py-2 text-[14px] font-black text-white shadow active:scale-95" onClick={next}>
                    {qs.some((x, i) => i > qi && !(x.id in g.save.harvest.quiz)) ? 'つぎの もんだい ▶' : 'おしまい'}
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

        {/* ── おそなえ ── */}
        <div className="mt-3 rounded-2xl bg-white/95 p-3 shadow">
          <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-2">
            <div className="text-[14px] font-black text-amber-900">🧺 はたけの ものを おそなえ</div>
            <div className="text-[11.5px] font-extrabold text-amber-600">1こ ＝ 🌾+1・きょう {h.offered} / {OFFER_PER_DAY}</div>
          </div>
          {h.offered >= OFFER_PER_DAY ? (
            <div className="rounded-xl bg-emerald-50 px-3 py-3 text-center text-[13px] font-bold text-emerald-800">きょうの おそなえは おしまい。ありがとう！</div>
          ) : offerable.length === 0 ? (
            <div className="rounded-xl bg-amber-50 px-3 py-3 text-center text-[12.5px] font-bold leading-relaxed text-amber-800">
              はたけで とれた ものが ないよ。<br />🌱 はたけで サツマイモや おこめを そだてて もってきてね
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {offerable.map((id) => (
                <button key={id} className="flex items-center gap-1.5 rounded-xl bg-amber-100 px-2 py-2 text-left text-[13px] font-black text-amber-900 shadow-sm active:scale-95" onClick={() => offer(id)}>
                  <span className="text-xl">{ITEM_BY_ID[id].emoji}</span>
                  <span className="min-w-0 flex-1 truncate">{ITEM_BY_ID[id].name}</span>
                  <span className="text-[11px] text-amber-600">×{g.save.inventory[id]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-[11.5px] font-bold leading-relaxed text-amber-900">
          🗓️ {HARVEST_END.replace(/^\d+-(\d+)-(\d+)$/, '$1がつ$2にち')}まで。11がつ23にち（きんろう かんしゃの ひ）は まめクイズの みのりが 2ばい！
        </div>
      </div>
    </div>
  );
}
