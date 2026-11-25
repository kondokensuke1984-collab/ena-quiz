import { useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import type { Friend } from '../lib/friends';
import { dateKey } from '../lib/study';
import { sfx } from '../lib/sound';
import {
  PART_KINDS, SNOWMEN, SNOW_PER_DAY, SNOW_REWARDS, SNOW_THANKS, clueLines, makeSnowRound, snowToday,
  type Build, type Part, type PartKind, type SnowRound,
} from '../lib/snowman';
import { CharSVG } from './CharSVG';
import { SnowmanSVG } from './SnowmanSVG';

// ゆきの こや（bd_kotatsu）：⛄ゆきだるまづくり／📘ずかん。メダルは つかわない・ふやさない。

type Tab = 'make' | 'dex';

const pickOne = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

type MakeState = {
  f: Friend;
  r: SnowRound;
  picked: Partial<Build>;
  done: null | { correct: boolean; hits: number; line: string; heart: boolean; isNew: boolean; rewards: string[] };
};

/** dexOnly＝としょかんから ひらく（ずかんだけ みせる） */
export function SnowHutModal({ friends, onClose, dexOnly = false }: { friends: Friend[]; onClose(): void; dexOnly?: boolean }) {
  const g = useGame();
  const [tab, setTab] = useState<Tab>(dexOnly ? 'dex' : 'make');
  const today = snowToday(g.save.snow, dateKey());
  const left = SNOW_PER_DAY - today.made;
  const dex = g.save.snow.dex;
  const nextReward = SNOW_REWARDS.find((r) => dex.length < r.kinds);

  const [mk, setMk] = useState<MakeState | null>(null);
  const start = (not?: string) => {
    const pool = friends.length > 1 && not ? friends.filter((f) => f.char !== not) : friends;
    const f = pickOne(pool);
    if (!f) return;
    sfx('letter');
    setMk({ f, r: makeSnowRound(dex), picked: {}, done: null });
  };

  const step = mk ? PART_KINDS.find((k) => !mk.picked[k.kind]) : undefined;

  const choose = (kind: PartKind, p: Part) => {
    if (!mk || mk.done) return;
    sfx('stamp');
    const picked = { ...mk.picked, [kind]: p.id };
    if (PART_KINDS.some((k) => !picked[k.kind])) { setMk({ ...mk, picked }); return; }
    const hits = PART_KINDS.filter((k) => picked[k.kind] === mk.r.want.build[k.kind]).length;
    const correct = hits === PART_KINDS.length;
    const res = g.snowMake(mk.f.char, mk.r.want.id, correct);
    if (!res) return;
    const line = correct ? pickOne(SNOW_THANKS.hit) : pickOne(SNOW_THANKS.miss).replace('{want}', `${mk.r.want.emoji}${mk.r.want.name}`);
    setMk({ ...mk, picked, done: { correct, hits, line, heart: res.heartsAfter > res.heartsBefore, isNew: res.isNew, rewards: res.rewards } });
  };
  const undo = () => {
    if (!mk || mk.done) return;
    const last = [...PART_KINDS].reverse().find((k) => mk.picked[k.kind]);
    if (!last) return;
    const picked = { ...mk.picked };
    delete picked[last.kind];
    setMk({ ...mk, picked });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'make', label: '⛄ つくる' },
    { id: 'dex', label: `📘 ずかん ${dex.length}/${SNOWMEN.length}` },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[88vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[14px] font-black text-ink">{dexOnly ? '⛄ ゆきだるまずかん' : '⛄ ゆきの こや'}</div>
        <div className={`mb-2 flex gap-1 ${dexOnly ? 'hidden' : ''}`}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`flex-1 rounded-xl px-0.5 py-2 text-[11px] font-black ${tab === t.id ? 'bg-sky-700 text-white shadow' : 'bg-sky-50 text-sky-900'}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'make' && (
          <div>
            <div className="mb-2 text-center text-[11px] font-bold text-indigo-900/60">
              きょう あと <b className="text-[14px] text-rose-600">{Math.max(0, left)}</b>かい つくれるよ（1にち {SNOW_PER_DAY}かい）
            </div>
            {!mk ? (
              <>
                <div className="mb-3 flex h-32 flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-sky-200 to-slate-50 px-4 text-center">
                  <div className="text-5xl">⛄</div>
                  <div className="mt-1 text-[12px] font-black leading-relaxed text-sky-900">こやの まえに ゆきが どっさり！ ゆきだるまを つくろう</div>
                </div>
                {left <= 0 ? (
                  <div className="rounded-2xl bg-gray-100 px-3 py-3 text-center text-[12px] font-black text-ink">きょうの ゆきだるまづくりは おわり。また あした！</div>
                ) : !friends.length ? (
                  <div className="rounded-2xl bg-amber-50 px-3 py-4 text-center text-[12px] font-bold text-ink">いまは だれも きていないみたい…</div>
                ) : (
                  <button className="btn-main" onClick={() => start()}>🧤 だれか きたかな？</button>
                )}
                <div className="mt-2 text-[10px] font-bold leading-relaxed text-indigo-900/50">
                  💡 なかまの なぞなぞを よんで、ぼうし・はな・マフラー・うでを えらぼう。4つ ぜんぶ あうと なかよし +2、ずかんに のるよ。
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <CharSVG charKey={mk.f.char} level={mk.f.level} fillPct={mk.f.fill} size={64} stars={mk.f.stars} label={mk.f.name} />
                  <div className="min-w-0 flex-1 rounded-2xl bg-sky-50 px-3 py-2 text-[13px] font-bold leading-relaxed text-ink">
                    <div className="text-[11px] font-black text-sky-800">{mk.f.name}</div>
                    {mk.done ? mk.done.line : mk.r.want.wish}
                  </div>
                </div>
                {/* なぞなぞ */}
                <div className="mt-2 rounded-2xl bg-white/70 px-3 py-2 text-[12px] font-bold leading-relaxed text-ink ring-1 ring-sky-200">
                  {clueLines(mk.r.want).map((c) => {
                    const chosen = mk.picked[c.kind];
                    const ok = mk.done && chosen === mk.r.want.build[c.kind];
                    const now = !mk.done && step?.kind === c.kind;
                    return (
                      <div key={c.kind} className={`flex items-center gap-1 rounded-lg px-1 ${now ? 'bg-amber-100' : ''}`}>
                        <span className="w-[64px] shrink-0 text-[11px] font-black text-sky-800">{c.label}は</span>
                        <span className="flex-1">「{c.text}」</span>
                        {mk.done && <span>{ok ? '⭕' : '❌'}</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex items-center justify-center">
                  <SnowmanSVG build={mk.done ? mk.picked : mk.picked} size={110} />
                </div>
                {!mk.done && step && (
                  <>
                    <div className="mt-1 text-center text-[12px] font-black text-sky-900">{step.emoji} {step.label}を えらんでね</div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {mk.r.choices[step.kind].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => choose(step.kind, p)}
                          className="flex flex-col items-center rounded-2xl bg-sky-50 px-1 py-3 active:scale-95"
                        >
                          <div className="text-4xl">{p.emoji}</div>
                          <div className="mt-1 text-[11px] font-black leading-tight text-ink">{p.name}</div>
                        </button>
                      ))}
                    </div>
                    {Object.keys(mk.picked).length > 0 && (
                      <button className="btn mt-2" onClick={undo}>↩️ ひとつ もどす</button>
                    )}
                  </>
                )}
                {mk.done && (
                  <div className="mt-2 rounded-2xl bg-rose-50 px-3 py-2 text-center text-[12px] font-bold leading-relaxed text-ink">
                    {mk.done.correct ? `🎉 ぴったり！ ${mk.r.want.emoji}${mk.r.want.name} が できた！ ` : `${mk.done.hits}/4 あたり！ `}
                    💗 {mk.f.name}と なかよし +{mk.done.correct ? 2 : 1}{mk.done.heart && '（ハートが ふえた！）'}
                    {mk.done.isNew && <div className="text-[12px] font-black text-sky-700">🆕 {mk.r.want.emoji}{mk.r.want.name} が ずかんに のったよ！</div>}
                    {mk.done.rewards.length > 0 && (
                      <div className="text-[12px] font-black text-violet-700">
                        🎉 ごほうび：{mk.done.rewards.map((id) => `${ITEM_BY_ID[id].emoji} ${ITEM_BY_ID[id].name}`).join('・')}（「かぐ」から おけるよ）
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-2 flex gap-2">
                  {mk.done && left > 0 && <button className="btn-main" onClick={() => start(mk.f.char)}>⛄ つぎの こ</button>}
                  {mk.done && <button className="btn" onClick={() => setMk(null)}>🔙 こやに もどる</button>}
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
                : 'ごほうびは ぜんぶ もらったよ！ ゆきだるま めいじん！'}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {SNOWMEN.map((s) => {
                const got = dex.includes(s.id);
                return (
                  <div key={s.id} className={`flex flex-col items-center rounded-xl px-1 py-1.5 text-center ${got ? 'bg-sky-50' : 'bg-gray-100'}`}>
                    <SnowmanSVG build={got ? s.build : {}} size={56} dim={!got} />
                    <div className="text-[10px] font-black leading-tight text-ink">{got ? s.name : '？？？'}</div>
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
