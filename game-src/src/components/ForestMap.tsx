import { useState } from 'react';
import { JAPAN_D, FOREST_XY } from '../lib/japanMap';
import { FORESTS, LEAF_LABEL, LEAF_OF, SPECIES_LABEL, type Forest, type Leaf } from '../lib/forestry';

// 日本地図で 森を えらぶ。あお＝人工（植えて 育てる）／ちゃいろ＝天然（守り 育てる）。🌲＝針葉樹／🌳＝広葉樹。✓＝クリアした 森。

const LAB: Record<string, [number, number, 'start' | 'middle' | 'end']> = {
  yoshino: [-9, 3, 'end'], owase: [9, 6, 'start'], tenryu: [9, 0, 'start'], kiso: [-9, 3, 'end'], akita: [-9, 10, 'end'], aomori: [-9, -4, 'end'],
  shirakami: [-9, 3, 'end'], yaku: [9, 3, 'start'],
};
type Filter = 'all' | Leaf;
const FILTERS: [Filter, string][] = [['all', 'ぜんぶ'], ['conifer', '🌲 針葉樹'], ['broad', '🌳 広葉樹']];

export function ForestMap({ cleared, onPick }: { cleared: string[]; onPick(f: Forest): void }) {
  const [flt, setFlt] = useState<Filter>('all');
  return (
    <div className="mb-2">
      <div className="mb-1.5 flex justify-center gap-1.5">
        {FILTERS.map(([k, label]) => (
          <button key={k} onClick={() => setFlt(k)} className={`rounded-full px-3 py-1 text-[11px] font-black ${flt === k ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-ink'}`}>{label}</button>
        ))}
      </div>
      <div className="mb-1 flex items-center justify-center gap-3 text-[11px] font-black">
        <span className="text-sky-700">● 人工（植えて 育てる）</span>
        <span className="text-amber-800">● 天然（守り 育てる）</span>
      </div>
      <svg viewBox="98 100 185 205" className="w-full select-none rounded-2xl shadow ring-1 ring-black/10" style={{ background: 'linear-gradient(#e0f2fe,#7dd3fc)' }}>
        <path d={JAPAN_D} fill="#bef264" stroke="#4d7c0f" strokeWidth="0.7" strokeLinejoin="round" />
        {FORESTS.map((f) => {
          const [x, y] = FOREST_XY[f.id];
          const [dx, dy, anc] = LAB[f.id] ?? [9, 3, 'start'];
          const done = cleared.includes(f.id);
          const leaf = LEAF_OF[f.species];
          const on = flt === 'all' || flt === leaf;
          return (
            <g key={f.id} onClick={() => on && onPick(f)} style={{ cursor: on ? 'pointer' : 'default' }} opacity={on ? 1 : 0.2}>
              <circle cx={x} cy={y} r="8" fill="transparent" />
              <circle cx={x} cy={y} r="4.6" fill={f.kind === 'jinko' ? '#0369a1' : '#b45309'} stroke={done ? '#16a34a' : '#fff'} strokeWidth="1.6" />
              <text x={x} y={y + 2} textAnchor="middle" fontSize="5.5" fill="#fff">{done ? '✓' : leaf === 'broad' ? '🌳' : '🌲'}</text>
              <text x={x + dx} y={y + dy - 3} textAnchor={anc} fontSize="6.5" fontWeight="900" fill="#0f172a" stroke="#fff" strokeWidth="1.8" paintOrder="stroke">{f.name}</text>
              <text x={x + dx} y={y + dy + 4} textAnchor={anc} fontSize="4.6" fontWeight="800" fill="#334155" stroke="#fff" strokeWidth="1.5" paintOrder="stroke">{f.pref}・{SPECIES_LABEL[f.species]}（{LEAF_LABEL[leaf]}）</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
