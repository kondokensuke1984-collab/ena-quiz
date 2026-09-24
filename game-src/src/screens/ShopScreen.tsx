import { useState } from 'react';
import { Shell } from '../components/Shell';
import { useGame } from '../state/useGame';
import { BUILD_ORDER, ITEMS, ITEM_BY_ID, KIND_TABS, nextBuildId, onSale, slotOf } from '../lib/items';
import type { Item } from '../types';

export function ShopScreen() {
  const g = useGame();
  const [tab, setTab] = useState(KIND_TABS[0].key);
  const active = KIND_TABS.find((t) => t.key === tab)!;
  const list = ITEMS.filter((i) => active.kinds.includes(i.kind) && onSale(i, g.save.owned));

  const owned = (it: Item) => !!it.builtin || (!!it.once && g.save.owned.includes(it.id));
  const stock = (it: Item) => g.save.inventory[it.id] ?? 0;

  return (
    <Shell title="🛒 メダルショップ" sub="クイズで ためた メダルで かえるよ">
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {KIND_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-extrabold transition ${
              tab === t.key ? 'bg-white text-ink shadow' : 'bg-white/10 text-indigo-100/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active.key === 'build' ? (
        <div className="flex flex-col gap-2 lg:landscape:grid lg:landscape:grid-cols-2">
          <p className="rounded-2xl bg-white/10 px-4 py-3 text-[11px] font-bold leading-relaxed text-indigo-100/75">
            メダルを ためて、しまに たてものを たてよう。<br />
            じゅんばんに 1つずつ たてられるよ。たてると しまが ひろがることも！
          </p>
          {BUILD_ORDER.map((id) => {
            const it = ITEM_BY_ID[id];
            const built = g.save.buildings.includes(id);
            const isNext = id === nextBuildId(g.save.buildings);
            const cant = g.balance < it.price;
            return (
              <div key={id} className={`panel flex items-center gap-3 !py-3 ${!built && !isNext ? 'opacity-55' : ''}`}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-2xl">
                  {built || isNext ? it.emoji : '🔒'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-black text-ink">{built || isNext ? it.name : '？？？'}</div>
                  <div className="truncate text-[11px] font-bold text-indigo-900/55">
                    {built ? 'たてたよ！' : isNext ? it.desc : 'まえの たてものを たてると みられるよ'}
                  </div>
                  {isNext && cant && (
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-indigo-100">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(100, (g.balance / it.price) * 100)}%` }} />
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  {built ? (
                    <span className="rounded-xl bg-emerald-100 px-3 py-2 text-[11px] font-extrabold text-emerald-700">✓ たてた</span>
                  ) : isNext ? (
                    <button
                      className={`rounded-xl px-3 py-2 text-[12px] font-black active:scale-95 ${
                        cant ? 'bg-gray-100 text-gray-400' : 'bg-gradient-to-br from-amber-500 to-amber-400 text-white shadow'
                      }`}
                      disabled={cant}
                      onClick={() => g.build(id)}
                    >
                      🪙{it.price}
                    </button>
                  ) : (
                    <span className="rounded-xl bg-gray-100 px-3 py-2 text-[11px] font-extrabold text-gray-400">🪙{it.price}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
      <div className="flex flex-col gap-2 lg:landscape:grid lg:landscape:grid-cols-2">
        {list.map((it) => {
          const have = owned(it);
          const cant = !have && g.balance < it.price;
          const slot = slotOf(it);
          const equipped = slot ? g.save.equipped[slot] === it.id : false;

          return (
            <div key={it.id} className="panel flex items-center gap-3 !py-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                {it.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-black text-ink">
                  {it.name}
                  {stock(it) > 0 && <span className="ml-1.5 text-[11px] font-extrabold text-indigo-500">もっている ×{stock(it)}</span>}
                </div>
                <div className="truncate text-[11px] font-bold text-indigo-900/55">{it.desc}</div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                {have ? (
                  it.kind === 'wall' || it.kind === 'floor' ? (
                    <button
                      className={`rounded-xl px-3 py-2 text-[11px] font-extrabold ${
                        g.save.room[it.kind] === it.id ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700 active:scale-95'
                      }`}
                      onClick={() => { g.setRoom(it.kind as 'wall' | 'floor', it.id); g.showToast(`${it.emoji} はりかえたよ！`); }}
                    >
                      {g.save.room[it.kind] === it.id ? '✓ はってる' : 'はる'}
                    </button>
                  ) : slot ? (
                    <button
                      className={`rounded-xl px-3 py-2 text-[11px] font-extrabold ${
                        equipped ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700 active:scale-95'
                      }`}
                      onClick={() => g.equip(slot, equipped ? null : it.id)}
                    >
                      {equipped ? '✓ そうび中' : 'そうびする'}
                    </button>
                  ) : (
                    <span className="rounded-xl bg-gray-100 px-3 py-2 text-[11px] font-extrabold text-gray-500">もっている</span>
                  )
                ) : (
                  <button
                    className={`rounded-xl px-3 py-2 text-[12px] font-black active:scale-95 ${
                      cant ? 'bg-gray-100 text-gray-400' : 'bg-gradient-to-br from-amber-500 to-amber-400 text-white shadow'
                    }`}
                    disabled={cant}
                    onClick={() => g.buy(it)}
                  >
                    🪙{it.price}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      )}

      {active.key === 'gift' && (
        <p className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-[11px] font-bold leading-relaxed text-indigo-100/75">
          かった プレゼントは、🏝しま で きょうかキャラに ちかづいて「🎁 プレゼント」で あげよう。<br />
          みんな 1つずつ だいすきな ものが あるよ。
        </p>
      )}

      {active.key === 'home' && (
        <p className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-[11px] font-bold leading-relaxed text-indigo-100/75">
          へやの かぐは、🏠おうちの なかで「おける かぐ」から えらんで おこう。<br />
          おうちは 🏗️けんせつ の「みんなの おうち」を たてると はいれるよ。
        </p>
      )}

      {active.key === 'room' && (
        <p className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-[11px] font-bold leading-relaxed text-indigo-100/75">
          かった かぐは、🏝しま の そこにある「しまに おける かぐ」から えらんで、<br />
          おきたい ばしょを タップすると おけるよ。
        </p>
      )}

      {/* 持ち物 */}
      <div className="panel mt-3 !py-3">
        <div className="mb-2 text-[12px] font-black text-ink">🎒 もちもの</div>
        {Object.keys(g.save.inventory).length === 0 && g.save.owned.length === 0 ? (
          <p className="text-[11px] font-bold text-indigo-900/50">まだ なにも もっていないよ</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(g.save.inventory).map(([id, n]) => (
              <span key={id} className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-extrabold text-indigo-700">
                {ITEM_BY_ID[id]?.emoji} {ITEM_BY_ID[id]?.name} ×{n}
              </span>
            ))}
            {g.save.owned.map((id) => (
              <span key={id} className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700">
                {ITEM_BY_ID[id]?.emoji} {ITEM_BY_ID[id]?.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-[11px] font-bold leading-relaxed text-indigo-100/70">
        🪙 メダルは クイズで はじめて せいかいしたり、単元を ぜんぶ⭐に したり、クエストで かげモンスターを たおすと もらえるよ。<br />
        これまでに ためた {g.earned}枚 のうち {g.spentTotal}枚 つかったよ。
      </div>
    </Shell>
  );
}
