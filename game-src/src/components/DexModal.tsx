import { useMemo } from 'react';
import { readFriends } from '../lib/friends';
import { earnedByMonth } from '../lib/medals';
import { CharSVG } from './CharSVG';

// コレクションずかん（クイズから おうちの ずかんだなに ひっこし 2026-11-03）。
// クイズが書き出す ena_island_friends_v1 と メダルの台帳を 読むだけ。

export function DexModal({ onClose }: { onClose(): void }) {
  const months = useMemo(() => {
    const { friends } = readFriends();
    const out: { month: string; label: string; list: typeof friends }[] = [];
    for (const f of friends) {
      let m = out.find((x) => x.month === f.month);
      if (!m) { m = { month: f.month, label: f.monthLabel, list: [] }; out.push(m); }
      m.list.push(f);
    }
    return out.sort((a, b) => a.month.localeCompare(b.month));
  }, []);
  const got = (f: { n: number; level: number; stars: number }) => f.n > 0 || f.level > 1 || f.stars > 0;
  const all = months.reduce((a, m) => a + m.list.length, 0);
  const have = months.reduce((a, m) => a + m.list.filter(got).length, 0);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[90vh] w-full max-w-[460px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <div className="text-[15px] font-black text-ink">📖 コレクションずかん　<span className="text-[12px] text-amber-700">{have} / {all}</span></div>
          <button className="rounded-full bg-gray-100 px-3 py-1 text-[12px] font-black text-ink" onClick={onClose}>とじる</button>
        </div>
        <p className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-ink">
          クイズで なかよくなった キャラと、もらった メダルが ならぶよ。
        </p>
        {months.length === 0 && <div className="py-6 text-center text-[12px] font-bold text-slate-500">まだ キャラが いないよ</div>}
        {[...months].reverse().map((m) => {
          const coins = earnedByMonth(m.month);
          const done = m.list.length > 0 && m.list.every((f) => f.total > 0 && f.n >= f.total);
          return (
            <div key={m.month} className="mb-3">
              <div className="mb-1 flex flex-wrap items-center gap-1 text-[13px] font-black text-ink">
                <span>{m.label || m.month}</span>
                {coins > 0 && <span className="rounded-full bg-yellow-100 px-2 text-[11px] text-yellow-800">🪙 {coins}まい</span>}
                {done && <span className="rounded-full bg-amber-200 px-2 text-[11px] text-amber-900">🏆 コンプリート</span>}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {m.list.map((f) => {
                  const ok = got(f);
                  return (
                    <div key={f.id} className={`relative flex flex-col items-center rounded-2xl bg-white px-1 py-2 text-center shadow ring-1 ring-black/5 ${ok ? '' : 'opacity-60'}`}>
                      <CharSVG charKey={f.char} level={f.level} fillPct={Math.round(f.fill * 100)} size={66} silhouette={!ok} stars={f.stars} label={ok ? f.name : '？？？'} />
                      <div className="text-[11px] font-black text-ink">{ok ? f.levelName || f.name : '？？？'}</div>
                      <div className="text-[10px] font-bold text-slate-500">
                        {ok ? `Lv.${f.level}${f.stars ? ' ★' + f.stars : ''}　⭐${f.n}/${f.total}` : `${f.catLabel}を 1もん ⭐でゲット`}
                      </div>
                      {f.total > 0 && f.n >= f.total && <span className="absolute right-1 top-1 text-[12px]">🥇</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <button className="btn mt-1" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
