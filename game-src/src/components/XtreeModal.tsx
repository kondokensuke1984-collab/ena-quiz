import { useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import type { Friend } from '../lib/friends';
import { dateKey } from '../lib/study';
import { sfx } from '../lib/sound';
import { isNight } from '../lib/arbor';
import { GIVE_PER_DAY, PRESENTS, THANKS_LINES, XTREE_REWARDS, makeRound, xtreeToday, type Present, type Round } from '../lib/xtree';
import { CharSVG } from './CharSVG';

// クリスマスツリー ひろば：🎁くばる／🎄かざりつけ（XmasModal へ）／📘ずかん。メダルは つかわない・ふやさない。

type Tab = 'give' | 'dex';

const pickOne = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

type GiveState = {
  f: Friend;
  r: Round;
  done: null | { pick: Present; correct: boolean; line: string; heart: boolean; isNew: boolean; rewards: string[] };
};

/** dexOnly＝としょかんから ひらく（ずかんだけ みせる） */
export function XtreeModal({ friends, onDecorate, onClose, dexOnly = false }: { friends: Friend[]; onDecorate?(): void; onClose(): void; dexOnly?: boolean }) {
  const g = useGame();
  const [tab, setTab] = useState<Tab>(dexOnly ? 'dex' : 'give');
  const night = isNight();
  const today = xtreeToday(g.save.xtree, dateKey());
  const left = GIVE_PER_DAY - today.given;
  const dex = g.save.xtree.dex;
  const nextReward = XTREE_REWARDS.find((r) => dex.length < r.kinds);

  const [give, setGive] = useState<GiveState | null>(null);
  const start = (not?: string) => {
    const pool = friends.length > 1 && not ? friends.filter((f) => f.char !== not) : friends;
    const f = pickOne(pool);
    if (!f) return;
    sfx('letter');
    setGive({ f, r: makeRound(dex), done: null });
  };
  const choose = (p: Present) => {
    if (!give || give.done) return;
    const correct = p.id === give.r.want.id;
    const res = g.xtreeGive(give.f.char, give.r.want.id, correct);
    if (!res) return;
    const line = correct
      ? pickOne(night ? [...THANKS_LINES.day, ...THANKS_LINES.night] : THANKS_LINES.day)
      : pickOne(THANKS_LINES.miss).replace('{want}', `${give.r.want.emoji}${give.r.want.name}`);
    setGive({ ...give, done: { pick: p, correct, line, heart: res.heartsAfter > res.heartsBefore, isNew: res.isNew, rewards: res.rewards } });
  };

  const tabs: { id: Tab | 'deco'; label: string }[] = [
    { id: 'give', label: '🎁 くばる' },
    { id: 'deco', label: '🎄 かざりつけ' },
    { id: 'dex', label: `📘 ずかん ${dex.length}/${PRESENTS.length}` },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[88vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[14px] font-black text-ink">{dexOnly ? '🎁 プレゼントずかん' : '🎄 クリスマスツリー ひろば'}</div>
        <div className={`mb-2 flex gap-1 ${dexOnly ? 'hidden' : ''}`}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`flex-1 rounded-xl px-0.5 py-2 text-[11px] font-black ${tab === t.id ? 'bg-emerald-700 text-white shadow' : 'bg-emerald-50 text-emerald-900'}`}
              onClick={() => (t.id === 'deco' ? onDecorate?.() : setTab(t.id))}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'give' && (
          <div>
            <div className="mb-2 text-center text-[11px] font-bold text-indigo-900/60">
              きょう あと <b className="text-[14px] text-rose-600">{Math.max(0, left)}</b>かい くばれるよ（1にち {GIVE_PER_DAY}かい）
            </div>
            {!give ? (
              <>
                <div className={`mb-3 flex h-32 flex-col items-center justify-center rounded-2xl px-4 text-center ${night ? 'bg-gradient-to-b from-indigo-950 to-indigo-800' : 'bg-gradient-to-b from-emerald-100 to-red-100'}`}>
                  <div className={`text-5xl ${night ? 'animate-pulse' : ''}`}>🎄</div>
                  <div className={`mt-1 text-[12px] font-black leading-relaxed ${night ? 'text-indigo-50' : 'text-emerald-900'}`}>
                    {night ? 'ツリーが ピカピカ ひかってる！ だれかが まってるよ' : 'サンタの ふくろに プレゼントが いっぱい！'}
                  </div>
                </div>
                {left <= 0 ? (
                  <div className="rounded-2xl bg-gray-100 px-3 py-3 text-center text-[12px] font-black text-ink">きょうの プレゼントくばりは おわり。また あした！</div>
                ) : !friends.length ? (
                  <div className="rounded-2xl bg-amber-50 px-3 py-4 text-center text-[12px] font-bold text-ink">いまは だれも きていないみたい…</div>
                ) : (
                  <button className="btn-main" onClick={() => start()}>🎅 だれか きたかな？</button>
                )}
                <div className="mt-2 text-[10px] font-bold leading-relaxed text-indigo-900/50">
                  💡 なかまの ヒントを よんで、ぴったりの プレゼントを えらぼう。ぴったりだと なかよし +2、ずかんに のるよ。
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <CharSVG charKey={give.f.char} level={give.f.level} fillPct={give.f.fill} size={64} stars={give.f.stars} label={give.f.name} />
                  <div className="min-w-0 flex-1 rounded-2xl bg-emerald-50 px-3 py-2 text-[13px] font-bold leading-relaxed text-ink">
                    <div className="text-[11px] font-black text-emerald-800">{give.f.name}</div>
                    {give.done ? give.done.line : give.r.hint}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {give.r.choices.map((p) => {
                    const picked = give.done?.pick.id === p.id;
                    const isWant = give.done && p.id === give.r.want.id;
                    return (
                      <button
                        key={p.id}
                        disabled={!!give.done}
                        onClick={() => choose(p)}
                        className={`flex flex-col items-center rounded-2xl px-1 py-3 active:scale-95 ${
                          isWant ? 'bg-emerald-100 ring-2 ring-emerald-500' : picked ? 'bg-rose-100 ring-2 ring-rose-400' : 'bg-red-50'
                        }`}
                      >
                        <div className={`text-4xl ${picked ? 'bubble-pop' : ''}`}>{p.emoji}</div>
                        <div className="mt-1 text-[11px] font-black leading-tight text-ink">{p.name}</div>
                      </button>
                    );
                  })}
                </div>
                {give.done && (
                  <div className="mt-2 rounded-2xl bg-rose-50 px-3 py-2 text-center text-[12px] font-bold leading-relaxed text-ink">
                    {give.done.correct ? '🎉 ぴったり！ ' : 'わたせたよ！ '}
                    💗 {give.f.name}と なかよし +{give.done.correct ? 2 : 1}{give.done.heart && '（ハートが ふえた！）'}
                    {give.done.isNew && <div className="text-[12px] font-black text-sky-700">🆕 {give.r.want.emoji}{give.r.want.name} が ずかんに のったよ！</div>}
                    {give.done.rewards.length > 0 && (
                      <div className="text-[12px] font-black text-violet-700">
                        🎉 ごほうび：{give.done.rewards.map((id) => `${ITEM_BY_ID[id].emoji} ${ITEM_BY_ID[id].name}`).join('・')}（「かぐ」から おけるよ）
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-2 flex gap-2">
                  {give.done && left > 0 && (
                    <button className="btn-main" onClick={() => start(give.f.char)}>🎁 つぎの こ</button>
                  )}
                  {give.done && <button className="btn" onClick={() => setGive(null)}>🔙 ひろばに もどる</button>}
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'dex' && (
          <div>
            <div className="mb-2 text-[11px] font-bold text-indigo-900/60">
              {nextReward
                ? `あと ${nextReward.kinds - dex.length}しゅるいで ${ITEM_BY_ID[nextReward.item].emoji}${ITEM_BY_ID[nextReward.item].name} が もらえるよ`
                : 'ごほうびは ぜんぶ もらったよ！ プレゼント めいじん！'}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {PRESENTS.map((p) => {
                const got = dex.includes(p.id);
                return (
                  <div key={p.id} className={`rounded-xl px-1 py-2 text-center ${got ? 'bg-red-50' : 'bg-gray-100'}`}>
                    <div className={`text-2xl ${got ? '' : 'opacity-40 grayscale'}`}>{got ? p.emoji : '🎁'}</div>
                    <div className="text-[10px] font-black leading-tight text-ink">{got ? p.name : '？？？'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button className="btn mt-3" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
