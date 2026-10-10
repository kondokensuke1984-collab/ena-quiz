// 🗓️ まいにちスタンプ（こんげつの カレンダーと ごほうび）

import { stampRewardsFor } from '../../lib/items';
import { useGame } from '../../state/useGame';

export function StampModal({ nowD, ym, stamps, onClose }: { nowD: Date; ym: string; stamps: number[]; onClose: () => void }) {
  const g = useGame();
  const { save } = g;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => onClose()}>
      <div className="panel max-h-[85vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[14px] font-black text-ink">🗓️ {nowD.getMonth() + 1}がつの スタンプ</div>
        <div className="mb-2 text-[11px] font-bold text-indigo-900/55">クイズで 5もん いじょう こたえた日に 🌟が つくよ</div>
        <div className="mb-3 grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-indigo-900/50">
          {['げつ', 'か', 'すい', 'もく', 'きん', 'ど', 'にち'].map((w) => <div key={w}>{w}</div>)}
          {Array.from({ length: (new Date(nowD.getFullYear(), nowD.getMonth(), 1).getDay() + 6) % 7 }, (_, i) => <div key={'b' + i} />)}
          {Array.from({ length: new Date(nowD.getFullYear(), nowD.getMonth() + 1, 0).getDate() }, (_, i) => {
            const d = i + 1;
            const got = stamps.includes(d);
            const isToday = d === nowD.getDate();
            return (
              <div key={d} className={`flex aspect-square flex-col items-center justify-center rounded-lg ${got ? 'bg-amber-100' : 'bg-indigo-50'} ${isToday ? 'ring-2 ring-violet-400' : ''}`}>
                <span className="text-[10px] text-indigo-900/60">{d}</span>
                <span className="text-[15px] leading-none">{got ? '🌟' : ''}</span>
              </div>
            );
          })}
        </div>
        <div className="mb-1.5 text-[12px] font-black text-ink">🎁 ごほうび（こんげつ {stamps.length}にち）</div>
        <div className="flex flex-col gap-1.5">
          {stampRewardsFor(nowD.getMonth() + 1).map((rw) => {
            const key = `${ym}:${rw.days}`;
            const claimed = save.stampClaims.includes(key);
            const can = stamps.length >= rw.days && !claimed;
            return (
              <div key={rw.days} className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2">
                <span className="w-12 shrink-0 text-[12px] font-black text-amber-600">{rw.days}にち</span>
                <span className="flex-1 text-[12px] font-extrabold text-ink">{rw.label}</span>
                {claimed ? (
                  <span className="text-[11px] font-extrabold text-emerald-600">✓ もらった</span>
                ) : (
                  <button
                    className={`rounded-lg px-3 py-1.5 text-[11px] font-black ${can ? 'bg-gradient-to-br from-amber-500 to-amber-400 text-white shadow active:scale-95' : 'bg-gray-100 text-gray-400'}`}
                    disabled={!can}
                    onClick={() => { const got = g.claimStamp(ym, rw.days); if (got) g.showToast(`🎉 ${got} を もらった！`); }}
                  >
                    {can ? 'うけとる' : `あと${rw.days - stamps.length}にち`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[10.5px] font-bold text-indigo-900/50">かぐは 🏝しまの「しまに おける かぐ」から おけるよ。まいつき また あつめられるよ。</p>
        <button className="btn-main mt-3" onClick={() => onClose()}>とじる</button>
      </div>
    </div>
  );
}
