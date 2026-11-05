import { useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import { eventToday } from '../lib/detective';
import { studiedOnDay } from '../lib/harvest';
import { GIFT_PER_DAY, ORNAMENTS, XMAS_END, XMAS_GOAL, XMAS_REWARDS, XMAS_TITLE, xmasDay, xmasDaysLeft } from '../lib/xmas';
import type { XmasGot } from '../state/GameProvider';

// イベント「クリスマス」の 全画面：ツリー（かざりが ふえる）／かざりつけ／サンタの ふくろ／ごほうび

export function XmasTree({ pts, size = 220 }: { pts: number; size?: number }) {
  const n = Math.min(pts, ORNAMENTS.length);
  return (
    <svg viewBox="-60 -150 120 160" width={size} height={size * 160 / 120} className="mx-auto block">
      <rect x="-8" y="-14" width="16" height="16" fill="#92400e" stroke="#14532d" strokeWidth="2" />
      <path d="M-46 -12 L0 -70 L46 -12 Z" fill="#15803d" stroke="#14532d" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M-36 -54 L0 -104 L36 -54 Z" fill="#16a34a" stroke="#14532d" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M-24 -90 L0 -128 L24 -90 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M0 -146 L4 -135 L16 -134 L8 -126 L11 -114 L0 -121 L-11 -114 L-8 -126 L-16 -134 L-4 -135 Z" fill="#fde047" stroke="#b45309" strokeWidth="1.6" strokeLinejoin="round" />
      {ORNAMENTS.slice(0, n).map((o, i) => (
        <circle key={i} cx={o.x} cy={o.y - 14} r="4.6" fill={o.c} stroke="#fff" strokeWidth="1.2" />
      ))}
    </svg>
  );
}

export function XmasModal({ onClose }: { onClose(): void }) {
  const g = useGame();
  const now = eventToday();
  const day = xmasDay(now);
  const x = g.save.xmas.day === day ? g.save.xmas : { ...g.save.xmas, hung: false, gifted: 0 };
  const studied = studiedOnDay(now);
  const [msg, setMsg] = useState<string | null>(null);
  const gifts = Object.entries(g.save.inventory).filter(([id, n]) => n > 0 && ITEM_BY_ID[id]?.kind === 'gift' && !ITEM_BY_ID[id]?.season);
  const giftsAll = Object.entries(g.save.inventory).filter(([id, n]) => n > 0 && ITEM_BY_ID[id]?.kind === 'gift');
  const list = gifts.length ? gifts : giftsAll;

  const show = (r: XmasGot | null, ok: string) => {
    if (!r) return;
    const parts = [ok];
    for (const it of r.rewards) parts.push(`${ITEM_BY_ID[it]?.emoji ?? '🎁'} ${ITEM_BY_ID[it]?.name ?? it} を もらった！`);
    if (r.title) parts.push(`🏅 しょうごう「${XMAS_TITLE}」を もらった！`);
    setMsg(parts.join('\n'));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#0f172a] via-[#14532d] to-[#7f1d1d]">
      <div className="mx-auto max-w-md px-4 pb-10 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <button className="rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-black text-ink shadow active:scale-95" onClick={onClose}>◀ しまへ</button>
          <div className="text-[12px] font-black text-amber-100">12/{XMAS_END.split('-')[2]}まで あと {xmasDaysLeft(now)}にち</div>
        </div>

        <div className="rounded-2xl bg-white/10 p-3 shadow">
          <div className="text-center text-[20px] font-black text-amber-100">🎄 クリスマス</div>
          <XmasTree pts={x.pts} />
          <div className="mb-1 mt-1 flex items-end justify-between">
            <div className="text-[13px] font-black text-white">かざり</div>
            <div className="text-[20px] font-black text-amber-200">{Math.min(x.pts, XMAS_GOAL)}<span className="text-[12px] text-amber-100/70"> / {XMAS_GOAL}</span></div>
          </div>
          <div className="h-3 rounded-full bg-white/20">
            <div className="h-3 rounded-full bg-gradient-to-r from-red-400 to-amber-300 transition-all" style={{ width: `${Math.min(100, (x.pts / XMAS_GOAL) * 100)}%` }} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-center text-[11px] font-black">
            {XMAS_REWARDS.map((r) => {
              const it = ITEM_BY_ID[r.item];
              const got = x.pts >= r.at;
              return <div key={r.at} className={`rounded-xl px-1 py-1.5 ${got ? 'bg-amber-300 text-amber-900' : 'bg-white/15 text-white'}`}>{it?.emoji} {it?.name}<br />{got ? '✅ もらった' : `🎄${r.at}で もらえる`}</div>;
            })}
            <div className={`rounded-xl px-1 py-1.5 ${x.pts >= XMAS_GOAL ? 'bg-amber-300 text-amber-900' : 'bg-white/15 text-white'}`}>🏅 {XMAS_TITLE}<br />{x.pts >= XMAS_GOAL ? '✅ もらった' : `🎄${XMAS_GOAL}で もらえる`}</div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-white/90 p-3 shadow">
          <div className="text-[14px] font-black text-green-800">🎄 かざりつけ</div>
          <div className="mb-2 text-[11.5px] font-bold text-green-700">クイズを 5もん やると、1日1かい ツリーに かざりが ふえるよ</div>
          <button
            className={`w-full rounded-xl py-3 text-[15px] font-black shadow active:scale-95 ${!x.hung && studied ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-green-100 text-green-400'}`}
            disabled={x.hung || !studied}
            onClick={() => show(g.xmasHang(day), '⭐ かざりが ふえた！')}
          >
            {x.hung ? '✅ きょうは かざりつけ したよ' : studied ? '⭐ かざりつけ する' : 'クイズを 5もん やってね'}
          </button>
        </div>

        <div className="mt-3 rounded-2xl bg-white/90 p-3 shadow">
          <div className="text-[14px] font-black text-red-800">🎁 サンタの ふくろ <span className="text-[11px] text-red-500">（きょう {x.gifted}/{GIFT_PER_DAY}）</span></div>
          <div className="mb-2 text-[11.5px] font-bold text-red-700">プレゼントを 1こ いれると かざりが ふえるよ（おねがいボードで もらえる！）</div>
          {list.length === 0 ? (
            <div className="rounded-xl bg-red-50 py-3 text-center text-[12px] font-black text-red-400">プレゼントが ないよ。おねがいを かなえよう</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {list.map(([id, n]) => (
                <button
                  key={id}
                  disabled={x.gifted >= GIFT_PER_DAY}
                  className={`rounded-xl px-3 py-2 text-[13px] font-black shadow active:scale-95 ${x.gifted >= GIFT_PER_DAY ? 'bg-red-50 text-red-300' : 'bg-red-100 text-red-800'}`}
                  onClick={() => show(g.xmasGift(day, id), `${ITEM_BY_ID[id]?.emoji ?? '🎁'} サンタが よろこんだ！`)}
                >
                  {ITEM_BY_ID[id]?.emoji} {ITEM_BY_ID[id]?.name} ×{n}
                </button>
              ))}
            </div>
          )}
        </div>

        {msg && <div className="mt-3 whitespace-pre-line rounded-2xl bg-amber-100 p-3 text-center text-[14px] font-black text-amber-900 shadow">{msg}</div>}
      </div>
    </div>
  );
}
