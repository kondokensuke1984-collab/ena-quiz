import { useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import { dateKey } from '../lib/study';
import { allDone, STREAK_BONUS_EVERY, todaysWishes, wishDone } from '../lib/wishes';

// 毎日の「おねがい」ボード：きょうの おねがい 3つ。ぜんぶ かなえると プレゼントが もらえる。

export function WishModal({ onClose }: { onClose(): void }) {
  const g = useGame();
  const day = dateKey();
  const s = g.save;
  const wishes = todaysWishes(s, day);
  const done = allDone(s, day);
  const claimed = s.wishes.day === day && s.wishes.claimed;
  const [got, setGot] = useState<string[] | null>(null);
  const streak = claimed ? s.wishes.streak : s.wishes.last === dateKey(new Date(Date.now() - 86_400_000)) ? s.wishes.streak : 0;

  const claim = () => {
    const r = g.claimWishes();
    if (r) {
      setGot(r.gifts);
      g.showToast('🎁 おねがいを ぜんぶ かなえた！');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#bfdbfe] via-[#c4b5fd] to-[#f0abfc]">
      <div className="mx-auto max-w-md px-4 pb-10 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <button className="rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-black text-ink shadow active:scale-95" onClick={onClose}>◀ しまへ</button>
          <div className="text-[13px] font-black text-violet-900">🔥 {streak}にち つづいてるよ</div>
        </div>

        <div className="mb-3 rounded-2xl bg-white/90 p-4 text-center shadow">
          <div className="text-[22px] font-black text-violet-800">📋 きょうの おねがい</div>
          <div className="mt-1 text-[12px] font-bold text-violet-600">3つ ぜんぶ かなえると プレゼント！（{STREAK_BONUS_EVERY}にち つづけると おまけ）</div>
        </div>

        <div className="space-y-2">
          {wishes.map((w) => {
            const have = Math.min(w.have(s, day), w.need);
            const ok = wishDone(s, day, w);
            return (
              <div key={w.id} className={`flex items-center gap-3 rounded-2xl px-4 py-3 shadow ${ok ? 'bg-emerald-100' : 'bg-white/90'}`}>
                <div className="text-[30px]">{ok ? '✅' : w.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-black text-ink">{w.text}</div>
                  <div className="mt-1 h-2 rounded-full bg-black/10">
                    <div className="h-2 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all" style={{ width: `${(have / w.need) * 100}%` }} />
                  </div>
                </div>
                <div className="text-[13px] font-black text-violet-700">{have}/{w.need}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          {got ? (
            <div className="rounded-2xl bg-white/90 p-4 shadow">
              <div className="text-[16px] font-black text-violet-800">🎁 プレゼントを もらったよ！</div>
              <div className="mt-2 flex justify-center gap-3 text-[34px]">{got.map((id, i) => <span key={i}>{ITEM_BY_ID[id]?.emoji ?? '🎁'}</span>)}</div>
              <div className="mt-1 text-[12px] font-bold text-violet-600">{got.map((id) => ITEM_BY_ID[id]?.name).join('・')}（なかまに あげよう）</div>
            </div>
          ) : claimed ? (
            <div className="rounded-2xl bg-white/80 p-3 text-[14px] font-black text-violet-700">✅ きょうの プレゼントは もらったよ。また あした！</div>
          ) : (
            <button
              className={`w-full rounded-2xl py-3.5 text-[17px] font-black shadow active:scale-95 ${done ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' : 'bg-white/50 text-violet-400'}`}
              disabled={!done}
              onClick={claim}
            >
              {done ? '🎁 プレゼントを もらう' : 'ぜんぶ かなえると もらえるよ'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
