import { useGame } from '../state/useGame';
import { ITEMS, ITEM_BY_ID } from '../lib/items';
import { CROP_COUNT, GROW_DAYS, STAGE_NAME } from '../lib/farm';
import { dateKey } from '../lib/study';

// はたけの うね3つ：うえる／みずやり／しゅうかく
export function FarmModal({ stages, studied, onClose }: { stages: number[]; studied: boolean; onClose(): void }) {
  const g = useGame();
  const seeds = ITEMS.filter((i) => i.kind === 'seed' && (g.save.inventory[i.id] ?? 0) > 0);
  const today = dateKey();

  const harvest = (i: number) => {
    const id = g.harvest(i);
    if (id) g.showToast(`🧺 ${ITEM_BY_ID[id].emoji} ${ITEM_BY_ID[id].name} が ${CROP_COUNT}つ とれた！ プレゼントに できるよ`);
  };
  const water = (i: number) => {
    if (g.waterPlot(i)) g.showToast(studied ? '💧 みずを あげたよ。きょうも そだつよ！' : '💧 みずを あげたよ。クイズを 5もん やると そだつよ');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[88vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[14px] font-black text-ink">🌱 はたけ</div>
        <div className="mb-2 text-[11px] font-bold leading-snug text-indigo-900/60">
          たねを うえて、クイズを 5もん やった日が {GROW_DAYS}にち に なると しゅうかく できるよ。
          {studied ? ' きょうは もう そだったよ！' : ' きょうは まだ クイズを していないよ。'}
        </div>
        <div className="flex flex-col gap-2">
          {g.save.farm.plots.map((p, i) => {
            const st = p ? stages[i] : 0;
            const ripe = !!p && st >= GROW_DAYS;
            return (
              <div key={i} className="rounded-2xl bg-amber-50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{!p ? '🟫' : ripe ? ITEM_BY_ID[p.seed]?.emoji : st === 0 ? '🫘' : '🌱'}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-black text-ink">
                      {p ? `${ITEM_BY_ID[p.seed]?.name ?? ''}：${STAGE_NAME[Math.min(st, GROW_DAYS)]}` : `うね ${i + 1}（あいてるよ）`}
                    </div>
                    {p && !ripe && (
                      <div className="mt-1 flex gap-1">
                        {Array.from({ length: GROW_DAYS }, (_, k) => (
                          <span key={k} className={`h-2 flex-1 rounded-full ${k < st ? 'bg-emerald-400' : 'bg-amber-200'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                  {p && (ripe ? (
                    <button className="shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 px-3 py-2 text-[12px] font-black text-white shadow active:scale-95" onClick={() => harvest(i)}>🧺 しゅうかく</button>
                  ) : (
                    <button
                      className={`shrink-0 rounded-xl px-3 py-2 text-[12px] font-black active:scale-95 ${p.watered === today ? 'bg-gray-100 text-gray-400' : 'bg-sky-500 text-white shadow'}`}
                      disabled={p.watered === today}
                      onClick={() => water(i)}
                    >
                      {p.watered === today ? '💧 あげたよ' : '💧 みずやり'}
                    </button>
                  ))}
                </div>
                {!p && (
                  seeds.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {seeds.map((s) => (
                        <button key={s.id} className="rounded-xl bg-white px-2.5 py-1.5 text-[12px] font-black text-ink shadow active:scale-95" onClick={() => { g.plantSeed(i, s.id); g.showToast(`🌱 ${s.name}を うえたよ！`); }}>
                          {s.emoji} {s.name} ×{g.save.inventory[s.id]}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button className="mt-2 text-[11px] font-black text-amber-700 underline" onClick={() => { onClose(); g.go('shop'); }}>
                      🛒 ショップの「🌱 たね」で かおう
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
        {!studied && <a className="btn-main mt-3 block text-center no-underline" href="/">📚 クイズを して そだてる</a>}
        <button className="btn mt-2" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
