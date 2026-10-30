import { JAPAN_D, FOREST_XY } from '../lib/japanMap';
import { FORESTS, SPECIES_LABEL, type Forest } from '../lib/forestry';

// 日本地図で 三大美林を えらぶ。あお＝人工（植えて 育てる）／ちゃいろ＝天然（守り 育てる）。✓＝クリアした 森。

const LAB: Record<string, [number, number, 'start' | 'middle' | 'end']> = {
  yoshino: [-9, 3, 'end'], owase: [9, 6, 'start'], tenryu: [9, 0, 'start'], kiso: [-9, 3, 'end'], akita: [-9, 8, 'end'], aomori: [-9, 0, 'end'],
};

export function ForestMap({ cleared, onPick }: { cleared: string[]; onPick(f: Forest): void }) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex items-center justify-center gap-3 text-[11px] font-black">
        <span className="text-sky-700">● 人工（植えて 育てる）</span>
        <span className="text-amber-800">● 天然（守り 育てる）</span>
      </div>
      <svg viewBox="150 95 130 165" className="w-full select-none rounded-2xl shadow ring-1 ring-black/10" style={{ background: 'linear-gradient(#e0f2fe,#7dd3fc)' }}>
        <path d={JAPAN_D} fill="#bef264" stroke="#4d7c0f" strokeWidth="0.7" strokeLinejoin="round" />
        {FORESTS.map((f) => {
          const [x, y] = FOREST_XY[f.id];
          const [dx, dy, anc] = LAB[f.id] ?? [9, 3, 'start'];
          const done = cleared.includes(f.id);
          return (
            <g key={f.id} onClick={() => onPick(f)} style={{ cursor: 'pointer' }}>
              <circle cx={x} cy={y} r="8" fill="transparent" />
              <circle cx={x} cy={y} r="4.6" fill={f.kind === 'jinko' ? '#0369a1' : '#b45309'} stroke={done ? '#16a34a' : '#fff'} strokeWidth="1.6" />
              <text x={x} y={y + 2} textAnchor="middle" fontSize="5.5" fill="#fff">{done ? '✓' : '🌲'}</text>
              <text x={x + dx} y={y + dy - 3} textAnchor={anc} fontSize="6.5" fontWeight="900" fill="#0f172a" stroke="#fff" strokeWidth="1.8" paintOrder="stroke">{f.name}</text>
              <text x={x + dx} y={y + dy + 4} textAnchor={anc} fontSize="5" fontWeight="800" fill="#334155" stroke="#fff" strokeWidth="1.5" paintOrder="stroke">{f.pref}・{SPECIES_LABEL[f.species]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
