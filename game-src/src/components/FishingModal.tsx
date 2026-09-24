import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import { FISH, FISH_PER_DAY, FISH_REWARDS, FISH_STUDY_BONUS, rollFish, zoneWidth, type Fish, type FishCtx } from '../lib/fish';
import { sfx } from '../lib/sound';

// つり：うきが しずんだら ゲージの「いま！」で タップ。にげられても 回数は へらない（もういちど できる）。

type Phase =
  | { kind: 'ready' }
  | { kind: 'wait' }
  | { kind: 'bite'; fish: Fish; cm: number; center: number }
  | { kind: 'got'; fish: Fish; cm: number; isNew: boolean; best: boolean; reward: string | null }
  | { kind: 'miss'; fish: Fish };

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(3 - n);

export function FishingModal({ ctx, studied, onClose }: { ctx: FishCtx; studied: boolean; onClose(): void }) {
  const g = useGame();
  const [tab, setTab] = useState<'fish' | 'dex'>('fish');
  const [phase, setPhase] = useState<Phase>({ kind: 'ready' });
  const cursor = useRef(0);
  const cursorEl = useRef<HTMLDivElement | null>(null);
  const left = g.fishLeft(studied);

  // うきが しずむまで すこし まつ
  useEffect(() => {
    if (phase.kind !== 'wait') return;
    const id = window.setTimeout(() => {
      const r = rollFish(ctx);
      const w = zoneWidth(r.fish);
      sfx('splash');
      setPhase({ kind: 'bite', ...r, center: w / 2 + Math.random() * (1 - w) });
    }, 900 + Math.random() * 1800);
    return () => window.clearTimeout(id);
  }, [phase.kind, ctx]);

  // ゲージの カーソルを 往復させる（★が多いほど はやい）
  useEffect(() => {
    if (phase.kind !== 'bite') return;
    const period = phase.fish.rare === 1 ? 1.7 : phase.fish.rare === 2 ? 1.25 : 0.95;
    const t0 = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      const u = ((t - t0) / 1000 / period) % 1;
      cursor.current = u < 0.5 ? u * 2 : 2 - u * 2;
      if (cursorEl.current) cursorEl.current.style.left = `${cursor.current * 100}%`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const cast = () => {
    if (left <= 0) return;
    sfx('splash');
    setPhase({ kind: 'wait' });
  };

  const reel = () => {
    if (phase.kind !== 'bite') return;
    const w = zoneWidth(phase.fish);
    if (Math.abs(cursor.current - phase.center) <= w / 2) {
      const r = g.landFish(phase.fish.id, phase.cm, studied);
      if (!r) { setPhase({ kind: 'ready' }); return; }
      setPhase({ kind: 'got', fish: phase.fish, cm: phase.cm, ...r });
    } else {
      sfx('ng');
      setPhase({ kind: 'miss', fish: phase.fish });
    }
  };

  const caught = g.save.fish.caught;
  const kinds = Object.keys(caught).length;
  const nextReward = FISH_REWARDS.find((r) => kinds < r.kinds);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[88vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex gap-1.5">
          {(['fish', 'dex'] as const).map((t) => (
            <button
              key={t}
              className={`flex-1 rounded-xl px-2 py-2 text-[13px] font-black ${tab === t ? 'bg-sky-500 text-white shadow' : 'bg-indigo-50 text-indigo-700'}`}
              onClick={() => setTab(t)}
            >
              {t === 'fish' ? '🎣 つり' : `📘 ずかん ${kinds}/${FISH.length}`}
            </button>
          ))}
        </div>

        {tab === 'fish' ? (
          <div>
            <div className="mb-2 text-center text-[11px] font-bold text-indigo-900/60">
              きょう あと <b className="text-[14px] text-sky-600">{left}</b>かい つれるよ
              {!studied && `（クイズを 5もん やると +${FISH_STUDY_BONUS}かい）`}
            </div>

            <div className="relative mb-3 h-40 overflow-hidden rounded-2xl bg-gradient-to-b from-sky-300 to-blue-700">
              <div className="absolute inset-x-0 top-8 h-[2px] bg-white/50" />
              {phase.kind === 'wait' && <div className="bobber absolute left-1/2 top-5 -translate-x-1/2 text-3xl">🔴</div>}
              {phase.kind === 'bite' && (
                <>
                  <div className="absolute left-1/2 top-4 -translate-x-1/2 text-[22px] font-black text-white drop-shadow">！！ かかった！</div>
                  <div className="fish-shadow absolute left-1/2 top-20 -translate-x-1/2 rounded-full bg-black/35" style={{ width: 30 + phase.fish.rare * 24, height: 14 + phase.fish.rare * 6 }} />
                </>
              )}
              {phase.kind === 'got' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="bubble-pop text-6xl">{phase.fish.emoji}</div>
                  <div className="mt-1 text-[16px] font-black drop-shadow">{phase.fish.name}　{phase.cm}cm！</div>
                </div>
              )}
              {phase.kind === 'miss' && (
                <div className="absolute inset-0 flex items-center justify-center text-[16px] font-black text-white drop-shadow">
                  💦 にげられた〜
                </div>
              )}
              {phase.kind === 'ready' && (
                <div className="absolute inset-0 flex items-center justify-center text-[13px] font-black text-white/90 drop-shadow">
                  {left > 0 ? 'うみに つりざおを なげよう' : 'きょうは おしまい。また あした きてね'}
                </div>
              )}
            </div>

            {phase.kind === 'bite' && (
              <>
                <div className="relative mb-3 h-8 overflow-hidden rounded-full bg-indigo-100">
                  <div
                    className="absolute inset-y-0 rounded-full bg-emerald-400"
                    style={{ left: `${(phase.center - zoneWidth(phase.fish) / 2) * 100}%`, width: `${zoneWidth(phase.fish) * 100}%` }}
                  />
                  <div ref={cursorEl} className="absolute inset-y-[-2px] w-[6px] -translate-x-1/2 rounded bg-rose-600" />
                </div>
                <button className="btn-main" onPointerDown={reel}>🎣 みどりで タップ！</button>
              </>
            )}
            {phase.kind === 'got' && (
              <div className="mb-2 rounded-2xl bg-amber-50 px-3 py-2 text-center text-[12px] font-bold leading-relaxed text-ink">
                {phase.isNew ? '🆕 ずかんに のったよ！' : phase.best ? '📏 いちばん おおきい きろく！' : `${stars(phase.fish.rare)}`}
                {phase.reward && (
                  <div className="mt-1 font-black text-violet-700">
                    🎉 ごほうび：{ITEM_BY_ID[phase.reward].emoji} {ITEM_BY_ID[phase.reward].name}（「かぐ」から おけるよ）
                  </div>
                )}
              </div>
            )}
            {(phase.kind === 'ready' || phase.kind === 'got' || phase.kind === 'miss') && (
              left > 0 ? (
                <button className="btn-main" onClick={cast}>{phase.kind === 'miss' ? '🎣 もういちど' : '🎣 なげる'}</button>
              ) : !studied ? (
                <a className="btn-main block text-center no-underline" href="/">📚 クイズで つりの かいすうを ふやす</a>
              ) : null
            )}
            {phase.kind === 'wait' && <div className="py-3 text-center text-[13px] font-black text-indigo-900/60">うきを よーく みて…</div>}
          </div>
        ) : (
          <div>
            <div className="mb-2 text-[11px] font-bold text-indigo-900/60">
              {nextReward
                ? `あと ${nextReward.kinds - kinds}しゅるいで ${ITEM_BY_ID[nextReward.item].emoji}${ITEM_BY_ID[nextReward.item].name} が もらえるよ`
                : 'ごほうびは ぜんぶ もらったよ！ ぜんしゅるい めざそう'}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {FISH.map((f) => {
                const n = caught[f.id] ?? 0;
                return (
                  <div key={f.id} className={`rounded-xl px-1 py-1.5 text-center ${n ? 'bg-sky-50' : 'bg-gray-100'}`}>
                    <div className={`text-2xl ${n ? '' : 'opacity-40 grayscale'}`}>{n ? f.emoji : '❓'}</div>
                    <div className="truncate text-[10px] font-black text-ink">{n ? f.name : '？？？'}</div>
                    <div className="text-[9px] font-bold leading-tight text-indigo-900/55">
                      {n ? `${g.save.fish.big[f.id] ?? 0}cm・${n}ひき` : f.hint}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-[10px] font-bold text-indigo-900/45">1にち {FISH_PER_DAY}かい（クイズを やった日は +{FISH_STUDY_BONUS}かい）</div>
          </div>
        )}

        <button className="btn mt-3" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
