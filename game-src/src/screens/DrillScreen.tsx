import { sfx } from '../lib/sound';
import drill from '../lib/drill.json';

// 島に 入るたびに 見せる あんき表（ずんだもん）。ページを ひらくたびに 1回。見たら すぐ 島へ いける。
// 表は lib/drill.json。group ごとに 見出しを 出す。

interface Item { group: string; dec: string; num: number; den: number; star?: boolean }
const ITEMS = drill.items as Item[];
const GROUPS = [...new Set(ITEMS.map((it) => it.group))];

function Frac({ num, den }: { num: number; den: number }) {
  return (
    <span className="inline-flex flex-col items-center align-middle text-[15px] leading-none sm:text-[17px]">
      <span>{num}</span>
      <span className="my-[3px] h-[3px] w-[1.4em] rounded-full bg-current" />
      <span>{den}</span>
    </span>
  );
}

export function DrillScreen({ onDone }: { onDone: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex select-none flex-col overflow-hidden bg-gradient-to-b from-[#14532d] via-[#166534] to-[#1e1b4b]">
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-5">
        <div className="mx-auto max-w-[640px]">
          <div className="flex items-center justify-center gap-3">
            <img src="/images/zundamon.png" alt="ずんだもん" className="h-16 w-16 rounded-full border-4 border-lime-200 shadow-lg" />
            <div className="text-left">
              <div className="text-[16px] font-black tracking-widest text-lime-100">ずんだもんの あんき ひょう</div>
              <div className="text-[13px] font-bold text-lime-200/80">{drill.title}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 items-start gap-2 sm:gap-3">
            {GROUPS.map((g) => (
              <div key={g} className="panel !px-2 !py-2 sm:!px-4 sm:!py-3">
                <div className="mb-1 px-1 text-[12px] sm:text-[13px] font-black text-indigo-500">{g}</div>
                {ITEMS.filter((it) => it.group === g).map((it) => (
                  <div key={it.dec} className={`flex items-center gap-1.5 rounded-xl px-1 py-0.5 font-black sm:gap-3 sm:px-2 text-ink ${it.star ? 'bg-amber-50' : ''}`}>
                    <span className="w-[3.3em] text-right text-[17px] sm:text-[20px]">{it.dec}</span>
                    <span className="text-[14px] text-indigo-300">＝</span>
                    <span className="text-emerald-600"><Frac num={it.num} den={it.den} /></span>
                    {it.star && <span className="ml-auto text-[11px] text-amber-500">★</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-[11px] font-bold text-lime-100/70">★は よく でる かず</div>
        </div>
      </div>

      <div className="p-4 pt-2">
        <button
          className="mx-auto block w-full max-w-[360px] rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 px-8 py-3 text-[16px] font-black text-white shadow-lg active:scale-95"
          onClick={() => { sfx('stamp'); onDone(); }}
        >
          🏝 しまへ いく
        </button>
      </div>
    </div>
  );
}
