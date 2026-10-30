import { useGame } from '../state/useGame';
import { FOREST_BY_ID, FORESTS, LEAF_LABEL, LEAF_OF } from '../lib/forestry';
import { TREE_DEX } from '../lib/treeDex';

// きのずかん：森を クリアすると、その森の 木が のる。写真と、どんな 木かの ひとこと。

export function TreeDexModal({ onClose }: { onClose(): void }) {
  const cleared = useGame().save.forestry.cleared;
  const n = TREE_DEX.filter((e) => cleared.includes(e.id)).length;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3" onClick={(e) => { e.stopPropagation(); onClose(); }}>
      <div className="panel max-h-[90vh] w-full max-w-[460px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <div className="text-[15px] font-black text-ink">🌲 きのずかん　<span className="text-[12px] text-emerald-700">{n} / {FORESTS.length}</span></div>
          <button className="rounded-full bg-gray-100 px-3 py-1 text-[12px] font-black text-ink" onClick={onClose}>とじる</button>
        </div>
        <p className="mb-2 rounded-xl bg-lime-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-ink">森を クリアすると、その 木が ずかんに のるよ。</p>
        <div className="space-y-2">
          {TREE_DEX.map((e) => {
            const f = FOREST_BY_ID[e.id];
            if (!cleared.includes(e.id)) {
              return (
                <div key={e.id} className="flex items-center gap-3 rounded-2xl bg-gray-100 px-3 py-3 opacity-70">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-300 text-2xl">❔</div>
                  <div className="text-[12px] font-black text-gray-500">？？？<div className="text-[11px] font-bold">{f.pref}の 森を クリアしよう</div></div>
                </div>
              );
            }
            const leaf = LEAF_OF[f.species];
            return (
              <div key={e.id} className="overflow-hidden rounded-2xl bg-white shadow ring-1 ring-black/5">
                <img src={e.photo.src} alt={e.tree} loading="lazy" className="h-44 w-full object-cover" />
                <div className="px-3 py-2">
                  <div className="flex items-baseline justify-between">
                    <div className="text-[14px] font-black text-ink">{e.tree}</div>
                    <div className="text-[10px] font-black text-emerald-700">{LEAF_LABEL[leaf]}・{f.kind === 'jinko' ? '人工林' : '天然林'}</div>
                  </div>
                  <div className="text-[11px] font-bold text-sky-700">{f.name}（{f.pref}）</div>
                  <div className="mt-1 text-[12px] font-bold leading-relaxed text-ink">{e.look}</div>
                  <div className="mt-1 rounded-lg bg-amber-50 px-2 py-1 text-[11.5px] font-bold leading-relaxed text-amber-900">📖 {e.use}</div>
                  <div className="mt-1 text-[9.5px] font-bold leading-snug text-slate-500">
                    📷 {e.photo.note}<br />
                    写真：{e.photo.author}／{e.photo.license}／<a href={e.photo.url} target="_blank" rel="noreferrer" className="underline">Wikimedia Commons</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn mt-3" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
