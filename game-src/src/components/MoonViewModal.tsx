import { useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import { moonAge, moonName, isNearFull } from '../lib/sky';
import { dateKey } from '../lib/study';

// おつきみだい：おだんごを おそなえすると 今の月が見える。ほんものの まんげつに ちかい夜だけ とくべつ。

export function MoonViewModal({ onClose }: { onClose(): void }) {
  const g = useGame();
  const age = moonAge();
  const name = moonName(age);
  const full = isNearFull(age);
  const dango = g.save.inventory.gf_dango ?? 0;
  const offeredToday = g.save.moon.lastOffer === dateKey();
  const [result, setResult] = useState<{ isFull: boolean; got: string[]; reward: string | null } | null>(null);

  const offer = () => {
    const r = g.offerDango();
    if (r) setResult(r);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[88vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[14px] font-black text-ink">🎑 おつきみ</div>

        <div className="flex flex-col items-center gap-2 py-2">
          <div className="text-6xl">{full ? '🌕' : '🌙'}</div>
          <div className="text-[15px] font-black text-ink">こんやの月：{name}</div>

          {!result ? (
            <>
              <div className="text-[12px] font-bold text-indigo-900/60">🍡 おだんご ×{dango}</div>
              {offeredToday ? (
                <div className="mt-1 rounded-2xl bg-amber-50 px-3 py-2 text-center text-[12px] font-bold text-ink">きょうは もう おそなえしたよ</div>
              ) : (
                <button className="btn-main" disabled={dango <= 0} onClick={offer}>
                  {dango <= 0 ? 'おだんごが ないよ' : '🍡 おだんごを おそなえする'}
                </button>
              )}
            </>
          ) : (
            <div className="mt-1 w-full rounded-2xl bg-amber-50 px-3 py-2 text-center text-[12px] font-bold leading-relaxed text-ink">
              {result.isFull ? '🌕 まんげつの よる！ とくべつな おくりものが とどいたよ' : 'おだんごを おそなえしたよ'}
              <div className="mt-1 text-[16px]">{result.got.map((id) => ITEM_BY_ID[id].emoji).join(' ')}</div>
              <div className="text-[11px] text-indigo-900/60">{result.got.map((id) => ITEM_BY_ID[id].name).join('・')} を もらった</div>
              {result.reward && (
                <div className="mt-1 font-black text-violet-700">
                  🎉 ごほうび：{ITEM_BY_ID[result.reward].emoji} {ITEM_BY_ID[result.reward].name}（「かぐ」から おけるよ）
                </div>
              )}
            </div>
          )}
        </div>

        <button className="btn mt-3" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
