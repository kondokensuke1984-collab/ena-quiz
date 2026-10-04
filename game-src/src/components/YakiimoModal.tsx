import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import type { Friend } from '../lib/friends';
import { sfx } from '../lib/sound';
import {
  BAKE_SECONDS, GOLD, IMO_GRADES, IMO_PER_DAY, IMO_REWARDS, ORDER_LINES, RAW_UNTIL, THANKS_LINES, gradeAt, type ImoGrade,
} from '../lib/yakiimo';
import { CharSVG } from './CharSVG';

// やきいも やたい：🔥やく（はたけの サツマイモを いしやきがまで）／🛒おみせ（なかまが かいに くる）／📘ずかん。

type BakePhase =
  | { kind: 'ready' }
  | { kind: 'baking' }
  | { kind: 'done'; grade: ImoGrade; count: number; isNew: boolean; reward: string | null };

type Customer = { f: Friend; n: number; line: string };
type ShopResult = { f: Friend; thanks: string; line: string; heart: boolean } | null;

const pickOne = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

function newCustomer(list: Friend[], not?: string): Customer | null {
  if (!list.length) return null;
  const pool = list.length > 1 ? list.filter((f) => f.char !== not) : list;
  const f = pickOne(pool);
  const n = 1 + Math.floor(Math.random() * 3);
  return { f, n, line: pickOne(ORDER_LINES).replace('{n}', String(n)) };
}

export function YakiimoModal({ customers, onClose }: { customers: Friend[]; onClose(): void }) {
  const g = useGame();
  const [tab, setTab] = useState<'bake' | 'shop' | 'dex'>('bake');
  const raw = g.save.inventory.gf_rawimo ?? 0;
  const baked = g.save.inventory.gf_imo ?? 0;

  // ── やく ──
  const [phase, setPhase] = useState<BakePhase>({ kind: 'ready' });
  const [hint, setHint] = useState('');
  const pos = useRef(0);
  const cursorEl = useRef<HTMLDivElement | null>(null);
  const fireRef = useRef<HTMLDivElement | null>(null);

  // ゲージが じわじわ すすむ。さいごまで いくと こげる
  useEffect(() => {
    if (phase.kind !== 'baking') return;
    const t0 = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      pos.current = Math.min(1, (t - t0) / 1000 / BAKE_SECONDS);
      if (cursorEl.current) cursorEl.current.style.left = `${pos.current * 100}%`;
      if (fireRef.current) fireRef.current.style.filter = `brightness(${1 - pos.current * 0.55})`;
      if (pos.current >= 1) { finish(); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase.kind]);

  const start = () => {
    if (raw <= 0) return;
    pos.current = 0;
    setHint('');
    sfx('water');
    setPhase({ kind: 'baking' });
  };

  const finish = () => {
    const grade = gradeAt(pos.current);
    if (!grade) return;
    const r = g.bakeImo(grade.id);
    if (!r) { setPhase({ kind: 'ready' }); return; }
    setPhase({ kind: 'done', grade, ...r });
  };

  const takeOut = () => {
    if (phase.kind !== 'baking') return;
    if (pos.current < RAW_UNTIL) { sfx('ng'); setHint('まだ かたいよ！ もうすこし まってね'); return; }
    finish();
  };

  // ── おみせ ──
  const left = g.imoCustomersLeft();
  const [cust, setCust] = useState<Customer | null>(() => newCustomer(customers));
  const [shopRes, setShopRes] = useState<ShopResult>(null);

  const serve = () => {
    if (!cust) return;
    const r = g.serveImo(cust.f.char, cust.n);
    if (!r) return;
    setShopRes({ f: cust.f, thanks: r.thanks, line: pickOne(THANKS_LINES), heart: r.heartsAfter > r.heartsBefore });
  };
  const next = () => {
    setShopRes(null);
    setCust(newCustomer(customers, cust?.f.char));
  };

  // ── ずかん ──
  const dex = g.save.imo.dex;
  const nextReward = IMO_REWARDS.find((r) => dex.length < r.kinds);

  const tabs = [
    { id: 'bake' as const, label: '🔥 やく' },
    { id: 'shop' as const, label: '🛒 おみせ' },
    { id: 'dex' as const, label: `📘 ずかん ${dex.length}/${IMO_GRADES.length}` },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={phase.kind === 'baking' ? undefined : onClose}>
      <div className="panel max-h-[88vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[14px] font-black text-ink">🍠 やきいもやさん</div>
        <div className="mb-2 flex gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              disabled={phase.kind === 'baking'}
              className={`flex-1 rounded-xl px-1 py-2 text-[12px] font-black ${tab === t.id ? 'bg-orange-500 text-white shadow' : 'bg-orange-50 text-orange-800'}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mb-2 text-center text-[11px] font-bold text-indigo-900/60">
          なまの サツマイモ ×<b className="text-[13px] text-rose-700">{raw}</b>　／　やきいも ×<b className="text-[13px] text-orange-600">{baked}</b>
        </div>

        {tab === 'bake' && (
          <div>
            <div className="relative mb-3 flex h-40 flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-stone-700 to-stone-900">
              {phase.kind === 'baking' && (
                <>
                  <div className="imo-smoke absolute top-3 text-2xl opacity-70">💨</div>
                  <div className="text-5xl">🍠</div>
                  <div ref={fireRef} className="mt-1 text-[22px] tracking-[0.3em]">🪨🔥🪨🔥🪨</div>
                </>
              )}
              {phase.kind === 'ready' && (
                <div className="px-4 text-center text-[13px] font-black leading-relaxed text-white/90">
                  {raw > 0
                    ? <>いしやきがまに サツマイモを いれて<br />いい ところで とりだそう</>
                    : <>なまの サツマイモが ないよ<br /><span className="text-[11px] text-white/70">はたけで サツマイモの なえを そだてよう（10〜11がつに ショップで うってるよ）</span></>}
                </div>
              )}
              {phase.kind === 'done' && (
                <div className="flex flex-col items-center text-white">
                  <div className="bubble-pop text-6xl">{phase.grade.emoji}</div>
                  <div className="mt-1 text-[16px] font-black drop-shadow">{phase.grade.name}</div>
                  <div className="text-[11px] font-bold text-white/80">{phase.grade.line}</div>
                </div>
              )}
            </div>

            {phase.kind === 'baking' && (
              <>
                <div className="relative mb-1 h-8 overflow-hidden rounded-full bg-stone-200">
                  <div className="absolute inset-y-0 left-0 bg-stone-300" style={{ width: `${RAW_UNTIL * 100}%` }} />
                  {IMO_GRADES.filter((x) => x.id !== 'gold').map((x) => (
                    <div key={x.id} className="absolute inset-y-0" style={{ left: `${x.from * 100}%`, width: `${(Math.min(1, x.to) - x.from) * 100}%`, background: x.color }} />
                  ))}
                  <div className="absolute inset-y-0" style={{ left: `${GOLD.from * 100}%`, width: `${(GOLD.to - GOLD.from) * 100}%`, background: '#fef08a' }} />
                  <div ref={cursorEl} className="absolute inset-y-[-2px] w-[6px] -translate-x-1/2 rounded bg-rose-600" />
                </div>
                <div className="mb-2 flex justify-between px-1 text-[9px] font-black text-indigo-900/55">
                  <span>なま</span><span>ほくほく</span><span>ねっとり</span><span>みつ✨</span><span>こげ</span>
                </div>
                <div className="mb-2 h-4 text-center text-[11px] font-black text-rose-600">{hint}</div>
                <button className="btn-main" onPointerDown={takeOut}>🧤 とりだす！</button>
              </>
            )}
            {phase.kind === 'done' && (
              <div className="mb-2 rounded-2xl bg-amber-50 px-3 py-2 text-center text-[12px] font-bold leading-relaxed text-ink">
                {phase.count > 0 ? `🍠 やきいもが ${phase.count}こ できた！` : 'やきいもは できなかった…'}
                {phase.isNew && <div className="font-black text-sky-700">🆕 ずかんに のったよ！</div>}
                {phase.reward && (
                  <div className="mt-1 font-black text-violet-700">
                    🎉 ごほうび：{ITEM_BY_ID[phase.reward].emoji} {ITEM_BY_ID[phase.reward].name}（「かぐ」から おけるよ）
                  </div>
                )}
              </div>
            )}
            {phase.kind !== 'baking' && raw > 0 && (
              <button className="btn-main" onClick={start}>{phase.kind === 'done' ? '🍠 もう1こ やく' : '🍠 サツマイモを いれる'}</button>
            )}
          </div>
        )}

        {tab === 'shop' && (
          <div>
            <div className="mb-2 text-center text-[11px] font-bold text-indigo-900/60">
              きょう あと <b className="text-[14px] text-orange-600">{left}</b>にん きてくれるよ（1にち {IMO_PER_DAY}にん）
            </div>
            {left <= 0 && !shopRes ? (
              <div className="rounded-2xl bg-amber-50 px-3 py-4 text-center text-[13px] font-black text-ink">きょうの おみせは おしまい。また あした！</div>
            ) : !cust ? (
              <div className="rounded-2xl bg-amber-50 px-3 py-4 text-center text-[12px] font-bold text-ink">いまは おきゃくさんが いないみたい…</div>
            ) : shopRes ? (
              <div className="flex flex-col items-center gap-1 rounded-2xl bg-amber-50 px-3 py-3 text-center">
                <CharSVG charKey={shopRes.f.char} level={shopRes.f.level} fillPct={shopRes.f.fill} size={72} stars={shopRes.f.stars} label={shopRes.f.name} />
                <div className="text-[13px] font-black text-ink">「{shopRes.line}」</div>
                <div className="text-[11px] font-bold text-indigo-900/70">
                  💗 {shopRes.f.name}と なかよし +3{shopRes.heart && '（ハートが ふえた！）'}
                </div>
                <div className="text-[11px] font-bold text-indigo-900/70">
                  🎁 おれいに {ITEM_BY_ID[shopRes.thanks].emoji} {ITEM_BY_ID[shopRes.thanks].name} を もらった
                </div>
                {left > 0 && <button className="btn-main mt-1" onClick={next}>🛒 つぎの おきゃくさん</button>}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 rounded-2xl bg-amber-50 px-3 py-3 text-center">
                <CharSVG charKey={cust.f.char} level={cust.f.level} fillPct={cust.f.fill} size={72} stars={cust.f.stars} label={cust.f.name} />
                <div className="text-[11px] font-bold text-indigo-900/60">{cust.f.name}</div>
                <div className="text-[14px] font-black text-ink">「{cust.line}」</div>
                <div className="text-[22px]">{'🍠'.repeat(cust.n)}</div>
                {baked >= cust.n ? (
                  <button className="btn-main mt-1" onClick={serve}>🍠 やきいもを {cust.n}こ わたす</button>
                ) : (
                  <>
                    <div className="text-[11px] font-black text-rose-600">やきいもが たりないよ。「🔥 やく」で やこう</div>
                    <button className="btn mt-1" onClick={next}>🙇 ごめんね（ほかの おきゃくさん）</button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'dex' && (
          <div>
            <div className="mb-2 text-[11px] font-bold text-indigo-900/60">
              {nextReward
                ? `あと ${nextReward.kinds - dex.length}しゅるいで ${ITEM_BY_ID[nextReward.item].emoji}${ITEM_BY_ID[nextReward.item].name} が もらえるよ`
                : 'ごほうびは ぜんぶ もらったよ！ やきいも めいじん！'}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {IMO_GRADES.map((x) => {
                const got = dex.includes(x.id);
                return (
                  <div key={x.id} className={`rounded-xl px-1 py-2 text-center ${got ? 'bg-orange-50' : 'bg-gray-100'}`}>
                    <div className={`text-2xl ${got ? '' : 'opacity-40 grayscale'}`}>{got ? x.emoji : '❓'}</div>
                    <div className="text-[10px] font-black leading-tight text-ink">{got ? x.name : '？？？'}</div>
                    <div className="text-[9px] font-bold leading-tight text-indigo-900/55">
                      {x.count > 0 ? `やきいも ${x.count}こ` : 'やきいも 0こ'}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-[10px] font-bold leading-relaxed text-indigo-900/50">
              💡 サツマイモの でんぷんは、ゆっくり あたためると あまい とうに かわるよ。だから じっくり やくと あまくなるんだ。
            </div>
          </div>
        )}

        <button className="btn mt-3" disabled={phase.kind === 'baking'} onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
