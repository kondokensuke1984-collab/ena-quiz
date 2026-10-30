import { useState } from 'react';
import { useGame } from '../state/useGame';
import { KIND_JA, ZUKAN, ZUKAN_BY_ID, photoOf, zukanGot, type ZukanEntry } from '../lib/fishZukan';

// さかなずかん。つった・そだてた さかなは 写真で 見られる。まだの さかなは シルエット（？）。

function Credit({ z }: { z: ZukanEntry }) {
  return (
    <div className="text-[9.5px] font-bold leading-snug text-indigo-900/50">
      写真：{z.credit.by ? `${z.credit.by}／` : ''}{z.credit.lic}／
      <a className="underline" href={z.credit.page} target="_blank" rel="noreferrer">Wikimedia Commons</a>
    </div>
  );
}

/** 新しく ずかんに のった とき の おしらせ */
export function ZukanPop({ id, onClose, onOpen }: { id: string; onClose(): void; onOpen?(): void }) {
  const z = ZUKAN_BY_ID[id];
  if (!z) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="panel w-full max-w-[380px] text-center" onClick={(e) => e.stopPropagation()}>
        <div className="bubble-pop mb-1 text-[13px] font-black text-amber-600">🆕 さかなずかんに のったよ！</div>
        <img src={photoOf(z.id)} alt={z.name} className="mx-auto mb-2 max-h-[220px] w-full rounded-2xl object-cover shadow ring-1 ring-black/10" />
        <div className="text-[18px] font-black text-ink">{z.name}</div>
        <div className="mb-1 text-[11px] font-black text-sky-700">{KIND_JA[z.kind]}</div>
        <div className="mb-2 text-[12px] font-bold leading-relaxed text-ink">{z.fact}</div>
        <Credit z={z} />
        <div className="mt-3 flex gap-1.5">
          {onOpen && <button className="btn flex-1" onClick={onOpen}>📘 ずかんを みる</button>}
          <button className="btn-main flex-1" onClick={onClose}>とじる</button>
        </div>
      </div>
    </div>
  );
}

export function SuisanZukan({ onBack }: { onBack(): void }) {
  const g = useGame();
  const { portDex, dex } = g.save.suisan;
  const [sel, setSel] = useState<ZukanEntry | null>(null);
  const got = ZUKAN.filter((z) => zukanGot(z.id, portDex, dex)).length;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-[14px] font-black text-ink">📘 さかなずかん　<span className="text-[12px] text-sky-700">{got} / {ZUKAN.length}</span></div>
        <button className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-black text-ink" onClick={sel ? () => setSel(null) : onBack}>もどる</button>
      </div>

      {sel ? (
        <div className="rounded-2xl bg-white px-3 py-3 shadow ring-1 ring-black/5">
          <img src={photoOf(sel.id)} alt={sel.name} className="mb-2 max-h-[260px] w-full rounded-2xl object-cover shadow ring-1 ring-black/10" />
          <div className="text-[18px] font-black text-ink">{sel.name}</div>
          <div className="mb-1 text-[11px] font-black text-sky-700">{KIND_JA[sel.kind]}</div>
          <div className="mb-1.5 text-[12px] font-bold leading-relaxed text-ink">{sel.fact}</div>
          <div className="mb-2 rounded-xl bg-amber-50 px-2 py-1.5 text-[11px] font-bold text-amber-900">📍 {sel.where}</div>
          <Credit z={sel} />
        </div>
      ) : (
        <>
          <div className="mb-1.5 text-[11px] font-bold text-indigo-900/60">しゅっこうで つったり、産地で そだてて うったりすると 写真が ひらくよ。</div>
          <div className="grid grid-cols-4 gap-1.5">
            {ZUKAN.map((z) => {
              const has = zukanGot(z.id, portDex, dex);
              return (
                <button key={z.id} disabled={!has} onClick={() => setSel(z)}
                  className={`overflow-hidden rounded-xl text-center shadow ring-1 ring-black/5 ${has ? 'bg-white active:scale-95' : 'bg-gray-100'}`}>
                  <div className="aspect-square w-full overflow-hidden bg-sky-100">
                    <img src={photoOf(z.id)} alt={has ? z.name : '？'} loading="lazy"
                      className="h-full w-full object-cover" style={has ? undefined : { filter: 'brightness(0) opacity(0.28)' }} />
                  </div>
                  <div className="truncate px-0.5 py-1 text-[10px] font-black text-ink">{has ? z.name : '？？？'}</div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
