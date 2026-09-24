import { useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import { CONSTELLATIONS, STAR_REWARDS, type Constellation } from '../lib/stars';

// てんもんだい：のぞくと 今夜の星座が1つ 見える → ずかんに のる。5・10しゅるいで ごほうび。

function ConstellationArt({ c, size = 140 }: { c: Constellation; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect x="0" y="0" width="100" height="100" rx="12" fill="#1e1b4b" />
      {c.lines.map(([a, b], i) => (
        <line
          key={i}
          x1={c.points[a].x} y1={c.points[a].y} x2={c.points[b].x} y2={c.points[b].y}
          stroke="#a5b4fc" strokeWidth="1.4" strokeLinecap="round" opacity="0.85"
        />
      ))}
      {c.points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === 0 ? 3 : 2.2} fill="#fef9c3" />
      ))}
    </svg>
  );
}

export function StarsModal({ onClose }: { onClose(): void }) {
  const g = useGame();
  const [tab, setTab] = useState<'tonight' | 'dex'>('tonight');
  const [result, setResult] = useState<{ constellation: Constellation; isNew: boolean; reward: string | null } | null>(null);

  const dex = g.save.stars.dex;
  const kinds = dex.length;
  const nextReward = STAR_REWARDS.find((r) => kinds < r.kinds);

  const peek = () => {
    const r = g.viewStars();
    if (r) setResult(r);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[88vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex gap-1.5">
          {(['tonight', 'dex'] as const).map((t) => (
            <button
              key={t}
              className={`flex-1 rounded-xl px-2 py-2 text-[13px] font-black ${tab === t ? 'bg-indigo-600 text-white shadow' : 'bg-indigo-50 text-indigo-700'}`}
              onClick={() => setTab(t)}
            >
              {t === 'tonight' ? '🔭 のぞく' : `📘 ずかん ${kinds}/${CONSTELLATIONS.length}`}
            </button>
          ))}
        </div>

        {tab === 'tonight' ? (
          <div>
            {!result ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="text-[13px] font-bold text-indigo-900/60">よぞらを のぞいて 星座を さがそう</div>
                <div className="text-6xl">🔭</div>
                <button className="btn-main" onClick={peek}>のぞいてみる</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-2">
                <ConstellationArt c={result.constellation} />
                <div className="text-[16px] font-black text-ink">{result.constellation.emoji} {result.constellation.name}</div>
                <div className="px-2 text-center text-[12px] font-bold leading-relaxed text-indigo-900/70">{result.constellation.desc}</div>
                <div className="mt-1 rounded-2xl bg-amber-50 px-3 py-2 text-center text-[12px] font-bold text-ink">
                  {result.isNew ? '🆕 ずかんに のったよ！' : 'もう しっている星座だったね'}
                  {result.reward && (
                    <div className="mt-1 font-black text-violet-700">
                      🎉 ごほうび：{ITEM_BY_ID[result.reward].emoji} {ITEM_BY_ID[result.reward].name}（「かぐ」から おけるよ）
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-2 text-[11px] font-bold text-indigo-900/60">
              {nextReward
                ? `あと ${nextReward.kinds - kinds}しゅるいで ${ITEM_BY_ID[nextReward.item].emoji}${ITEM_BY_ID[nextReward.item].name} が もらえるよ`
                : 'ごほうびは ぜんぶ もらったよ！ ぜんしゅるい めざそう'}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {CONSTELLATIONS.map((c) => {
                const found = dex.includes(c.id);
                return (
                  <div key={c.id} className={`rounded-xl px-1 py-1.5 text-center ${found ? 'bg-indigo-50' : 'bg-gray-100'}`}>
                    <div className={`text-2xl ${found ? '' : 'opacity-40 grayscale'}`}>{found ? c.emoji : '❓'}</div>
                    <div className="truncate text-[10px] font-black text-ink">{found ? c.name : '？？？'}</div>
                    <div className="text-[9px] font-bold leading-tight text-indigo-900/55">{found ? c.desc : c.hint}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button className="btn mt-3" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
