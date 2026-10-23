import { useGame } from '../state/useGame';
import { CONSTELLATIONS } from '../lib/stars';
import { FISH } from '../lib/fish';
import { PLANTS } from '../lib/plants';
import { PLANKTON } from '../lib/plankton';
import { DESTS } from '../lib/space';
import { LEAVES } from '../lib/arbor';
import { IMO_GRADES } from '../lib/yakiimo';

// としょかん（となりの しま・bd_planet）：しまの ずかんを 本だなに ならべる。本を ひらくと いつもの ずかん画面（dexOnly）が でる。

export type BookId = 'stars' | 'fish' | 'farm' | 'micro' | 'space' | 'arbor' | 'imo';

interface Book { id: BookId; emoji: string; title: string; n: number; total: number; color: string }

export function LibraryModal({ onOpen, onClose }: { onOpen(id: BookId): void; onClose(): void }) {
  const { save } = useGame();
  const books: Book[] = [
    { id: 'stars', emoji: '🌟', title: 'せいざ', n: save.stars.dex.length, total: CONSTELLATIONS.length, color: '#4338ca' },
    { id: 'fish', emoji: '🐟', title: 'さかな', n: Object.keys(save.fish.caught).length, total: FISH.length, color: '#0284c7' },
    { id: 'farm', emoji: '🌱', title: 'しょくぶつ', n: save.farm.dex.length, total: PLANTS.length, color: '#059669' },
    { id: 'micro', emoji: '🔬', title: 'プランクトン', n: save.micro.dex.length, total: PLANKTON.length, color: '#7c3aed' },
    { id: 'space', emoji: '🛰️', title: 'うちゅう', n: save.space.dex.length, total: DESTS.length, color: '#1e293b' },
    { id: 'arbor', emoji: '🍁', title: 'おちば', n: save.arbor.dex.length, total: LEAVES.length, color: '#e11d48' },
    { id: 'imo', emoji: '🍠', title: 'やきいも', n: save.imo.dex.length, total: IMO_GRADES.length, color: '#ea580c' },
  ];
  const all = books.reduce((a, b) => a + b.n, 0);
  const max = books.reduce((a, b) => a + b.total, 0);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[88vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[14px] font-black text-ink">📚 としょかん</div>
        <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-ink">
          しまで みつけた ものが ずかんに なって ならんでいるよ。ぜんぶで {all} / {max}。
        </p>
        {/* 本だな */}
        <div className="rounded-2xl bg-amber-800 p-2 shadow-inner">
          <div className="grid grid-cols-4 gap-2">
            {books.map((b) => {
              const empty = b.n === 0;
              return (
                <button
                  key={b.id}
                  disabled={empty}
                  onClick={() => onOpen(b.id)}
                  className="flex h-[118px] flex-col items-center justify-between rounded-lg border-2 border-black/20 px-1 py-2 text-white shadow disabled:opacity-60"
                  style={{ background: empty ? '#a8a29e' : b.color }}
                >
                  <span className="text-[22px] leading-none">{empty ? '❔' : b.emoji}</span>
                  <span className="text-[11px] font-black leading-tight">{empty ? '？？？' : b.title}</span>
                  <span className="rounded-full bg-white/90 px-1.5 text-[10px] font-black text-ink">{b.n}/{b.total}</span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] font-bold text-slate-500">❔の 本は、1つ みつけると よめるように なるよ</p>
        <button className="btn mt-3" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
