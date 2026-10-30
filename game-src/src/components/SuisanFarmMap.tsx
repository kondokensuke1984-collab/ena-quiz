import { useState } from 'react';
import { useGame } from '../state/useGame';
import { CharSVG } from './CharSVG';
import { JAPAN_D, JAPAN_VIEWBOX, PLACE_XY } from '../lib/japanMap';
import { FARM_PLACES, type FarmPlace } from '../lib/suisanFarmPlaces';
import { SP_BY_ID, spStyle } from '../lib/suisanFarm';

// 日本地図で 養殖・栽培の 産地を えらぶ。オレンジ＝養殖／みどり＝栽培（放流）／むらさき＝どちらも できる。

export function SuisanFarmMap({ onGo, onBack }: { onGo(p: FarmPlace): void; onBack(): void }) {
  const g = useGame();
  const [sel, setSel] = useState<FarmPlace | null>(null);
  const color = (p: FarmPlace) => (p.farm.length && p.stock.length ? '#7c3aed' : p.stock.length ? '#0d9488' : '#ea580c');
  // ラベルの 場所（x, y の ずれ・そろえ）。ほかの しるしと かさならないように
  const LAB: Record<string, [number, number, 'start' | 'middle' | 'end']> = {
    hiroshima: [-8, 3, 'end'], ehime: [-8, 3, 'end'], saga: [-8, 3, 'end'], nagasaki: [-8, 3, 'end'], hokkaido: [-8, 3, 'end'], saroma: [-8, 3, 'end'],
    yamatokoriyama: [0, -9, 'middle'], mie: [0, 16, 'middle'],
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-[14px] font-black text-ink">🗾 どこで そだてる？</div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-black text-amber-800">💰 {g.save.suisan.coin}万円</span>
          <button className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-black text-ink" onClick={onBack}>もどる</button>
        </div>
      </div>

      <div className="mb-1.5 flex items-center gap-2 rounded-2xl bg-sky-50 px-2 py-1.5">
        <div className="shrink-0"><CharSVG charKey="beaver" level={6} fillPct={100} size={40} label="モクタ" /></div>
        <div className="text-[12px] font-bold leading-relaxed text-ink">
          産地を えらぼう！ 場所によって そだてる 魚が ちがうよ。
          <span className="ml-1 whitespace-nowrap"><b className="text-orange-600">●養殖</b> <b className="text-teal-600">●栽培</b> <b className="text-violet-600">●両方</b></span>
        </div>
      </div>

      <svg viewBox={JAPAN_VIEWBOX} className="mb-1.5 w-full select-none rounded-2xl shadow ring-1 ring-black/10" style={{ background: 'linear-gradient(#e0f2fe,#7dd3fc)' }}>
        <path d={JAPAN_D} fill="#bef264" stroke="#4d7c0f" strokeWidth="0.7" strokeLinejoin="round" />
        {FARM_PLACES.map((p) => {
          const [x, y] = PLACE_XY[p.id];
          const on = sel?.id === p.id;
          const [dx, dy, anc] = LAB[p.id] ?? [8, 3, 'start'];
          return (
            <g key={p.id} onClick={() => setSel(p)} style={{ cursor: 'pointer' }}>
              <circle cx={x} cy={y} r="16" fill="transparent" />
              {on && <circle cx={x} cy={y} r="10.5" fill="#fde047" opacity="0.6" />}
              <circle cx={x} cy={y} r="5.6" fill={color(p)} stroke="#fff" strokeWidth="1.6" />
              <text x={x + dx} y={y + dy} textAnchor={anc} fontSize="9.5" fontWeight="900" fill="#0f172a" stroke="#fff" strokeWidth="2.4" paintOrder="stroke">{p.name}</text>
            </g>
          );
        })}
      </svg>

      {sel ? (
        <div className="rounded-2xl bg-white px-3 py-3 shadow ring-1 ring-black/5">
          <div className="mb-1 flex items-baseline justify-between">
            <div className="text-[15px] font-black text-ink">📍 {sel.name}　<span className="text-[12px] text-sky-700">{sel.pref}</span></div>
            <button className="text-[11px] font-black text-indigo-900/50" onClick={() => setSel(null)}>とじる</button>
          </div>
          <div className="mb-1.5 text-[12px] font-bold leading-relaxed text-ink">{sel.line}</div>
          <div className="mb-1.5 grid grid-cols-2 gap-1">
            {([['養殖', sel.farm, 'bg-orange-50 text-orange-800'], ['栽培（放流）', sel.stock, 'bg-teal-50 text-teal-800']] as const).map(([name, ids, cls]) => (
              <div key={name} className={`rounded-xl px-2 py-1 ${ids.length ? cls : 'bg-gray-100 text-gray-400'}`}>
                <div className="text-[10px] font-black">{name}</div>
                {ids.length ? ids.map((id) => <div key={id} className="text-[12px] font-black text-ink"><span style={spStyle(SP_BY_ID[id])}>{SP_BY_ID[id].emoji}</span>{SP_BY_ID[id].name}</div>) : <div className="text-[10px] font-bold">なし</div>}
              </div>
            ))}
          </div>
          <div className="mb-2 rounded-xl bg-amber-50 px-2 py-1.5 text-[11px] font-bold leading-relaxed text-amber-900">📖 {sel.fact}</div>
          <button className="btn-main" onClick={() => onGo(sel)}>🐟 {sel.name}で はじめる</button>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/80 px-3 py-2.5 text-center text-[12px] font-black text-indigo-900/60">📍 地図の しるしを おしてみよう</div>
      )}
    </div>
  );
}
