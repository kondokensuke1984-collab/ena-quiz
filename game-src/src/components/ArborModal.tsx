import { useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import type { Friend } from '../lib/friends';
import { pickLesson, type Lesson } from '../lib/lesson';
import { dateKey } from '../lib/study';
import { sfx } from '../lib/sound';
import {
  ARBOR_REWARDS, GATHER_PER_DAY, LEAVES, REST_LINES, TALK_PER_DAY, arborToday, isNight, teaLetter, type Leaf,
} from '../lib/arbor';
import { PALETTES } from './KidSVG';
import { CharSVG } from './CharSVG';

// もみじの あずまや：🍵ひとやすみ／🍁おちば／💬かいぎ／📮おちゃ。メダルは つかわない・ふやさない。

type Tab = 'rest' | 'leaf' | 'talk' | 'tea';

const pickOne = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

type TalkState = { f: Friend; l: (Lesson & { id: string }) | null; show: boolean; loading: boolean; done: null | { correct: boolean; heart: boolean } };

/** dexOnly＝としょかんから ひらく（ずかんだけ みせる） */
export function ArborModal({ friends, studied, onClose, dexOnly = false }: { friends: Friend[]; studied: boolean; onClose(): void; dexOnly?: boolean }) {
  const g = useGame();
  const [tab, setTab] = useState<Tab>(dexOnly ? 'leaf' : 'rest');
  const night = isNight();
  const today = arborToday(g.save.arbor, dateKey());
  const playerName = g.save.player ? PALETTES[g.save.player].name : '';

  // ── ひとやすみ ──
  const [restMsg, setRestMsg] = useState<{ line: string; gifts: string[] } | null>(null);
  const rest = () => {
    const r = g.arborRest(studied);
    if (!r) return;
    setRestMsg({ line: pickOne(studied ? REST_LINES.studied : REST_LINES.plain), gifts: r.gifts });
  };

  // ── おちば ──
  const [found, setFound] = useState<{ leaf: Leaf; isNew: boolean; reward: string | null } | null>(null);
  const dex = g.save.arbor.dex;
  const nextReward = ARBOR_REWARDS.find((r) => dex.length < r.kinds);
  const gather = () => {
    const r = g.arborGather();
    if (r) setFound(r);
  };

  // ── かいぎ ──
  const [talk, setTalk] = useState<TalkState | null>(null);
  const talkLeft = TALK_PER_DAY - today.talked;
  const startTalk = (f: Friend, notId?: string) => {
    setTalk({ f, l: null, show: false, loading: true, done: null });
    pickLesson(f.month, f.cat, notId).then((l) => {
      setTalk((cur) => (cur && cur.f.id === f.id ? { f, l, show: false, loading: false, done: null } : cur));
    });
  };
  const judge = (correct: boolean) => {
    if (!talk) return;
    const r = g.arborTalk(talk.f.char, correct);
    if (r) setTalk({ ...talk, done: { correct, heart: r.heartsAfter > r.heartsBefore } });
  };

  // ── おちゃ ──
  const [teaFrom, setTeaFrom] = useState<Friend | null>(null);
  const tea = () => {
    const f = pickOne(friends);
    if (!f) return;
    const l = teaLetter(playerName, f.name, f.catLabel, studied, night);
    if (g.arborTea(f.char, f.name, l.title, l.body)) setTeaFrom(f);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'rest', label: '🍵 ひとやすみ' },
    { id: 'leaf', label: `🍁 おちば ${dex.length}/${LEAVES.length}` },
    { id: 'talk', label: '💬 かいぎ' },
    { id: 'tea', label: '📮 おちゃ' },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[88vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[14px] font-black text-ink">🍁 もみじの あずまや</div>
        <div className={`mb-2 flex gap-1 ${dexOnly ? 'hidden' : ''}`}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`flex-1 rounded-xl px-0.5 py-2 text-[11px] font-black ${tab === t.id ? 'bg-rose-600 text-white shadow' : 'bg-rose-50 text-rose-800'}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'rest' && (
          <div>
            <div className={`mb-3 flex h-32 flex-col items-center justify-center rounded-2xl px-4 text-center ${night ? 'bg-gradient-to-b from-indigo-900 to-indigo-700' : 'bg-gradient-to-b from-amber-100 to-orange-200'}`}>
              <div className="text-5xl">{night ? '🌙' : '🍁'}</div>
              <div className={`mt-1 text-[12px] font-black leading-relaxed ${night ? 'text-indigo-50' : 'text-amber-900'}`}>
                {restMsg ? restMsg.line : night ? 'よるの あずまやは ほんのり あかるいよ' : 'ベンチで ひとやすみ しよう'}
              </div>
            </div>
            <div className="mb-2 rounded-2xl bg-amber-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-ink">
              {studied ? '✅ きょうは クイズを がんばったね！ ごほうびが 2つ もらえるよ' : '📝 クイズを 5もん とくと、ごほうびが ふえるよ（きょうは まだ）'}
            </div>
            {restMsg && (
              <div className="mb-2 rounded-2xl bg-orange-50 px-3 py-2 text-center text-[12px] font-bold text-ink">
                🎁 {restMsg.gifts.map((id) => `${ITEM_BY_ID[id].emoji}${ITEM_BY_ID[id].name}`).join('・')} を みつけた！
              </div>
            )}
            {today.rested ? (
              <div className="rounded-2xl bg-gray-100 px-3 py-3 text-center text-[12px] font-black text-ink">きょうの ひとやすみは おわり。また あした！</div>
            ) : (
              <button className="btn-main" onClick={rest}>🪑 ひとやすみ する</button>
            )}
          </div>
        )}

        {tab === 'leaf' && (
          <div>
            <div className="mb-2 text-center text-[11px] font-bold text-indigo-900/60">
              きょう あと <b className="text-[14px] text-rose-600">{GATHER_PER_DAY - today.gathered}</b>まい ひろえるよ（1にち {GATHER_PER_DAY}まい）
            </div>
            <div className="mb-2 flex min-h-[96px] flex-col items-center justify-center rounded-2xl bg-orange-50 px-3 py-3 text-center">
              {found ? (
                <>
                  <div className="bubble-pop text-5xl">{found.leaf.emoji}</div>
                  <div className="text-[14px] font-black text-ink">{found.leaf.name}</div>
                  <div className="text-[11px] font-bold leading-snug text-indigo-900/70">{found.leaf.fact}</div>
                  {found.isNew && <div className="mt-1 text-[12px] font-black text-sky-700">🆕 ずかんに のったよ！</div>}
                  {found.reward && (
                    <div className="mt-1 text-[12px] font-black text-violet-700">
                      🎉 ごほうび：{ITEM_BY_ID[found.reward].emoji} {ITEM_BY_ID[found.reward].name}（「かぐ」から おけるよ）
                    </div>
                  )}
                </>
              ) : (
                <div className="text-[12px] font-black text-ink">あずまやの まわりに おちばが いっぱい！<br />ひろってみよう</div>
              )}
            </div>
            {today.gathered < GATHER_PER_DAY ? (
              <button className="btn-main" onClick={gather}>🍂 おちばを ひろう</button>
            ) : (
              <div className="rounded-2xl bg-gray-100 px-3 py-3 text-center text-[12px] font-black text-ink">きょうの おちばひろいは おわり。また あした！</div>
            )}
            <div className="mb-2 mt-3 text-[11px] font-bold text-indigo-900/60">
              {nextReward
                ? `あと ${nextReward.kinds - dex.length}しゅるいで ${ITEM_BY_ID[nextReward.item].emoji}${ITEM_BY_ID[nextReward.item].name} が もらえるよ`
                : 'ごほうびは ぜんぶ もらったよ！ おちばはかせ！'}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {LEAVES.map((x) => {
                const got = dex.includes(x.id);
                return (
                  <div key={x.id} className={`rounded-xl px-1 py-2 text-center ${got ? 'bg-orange-50' : 'bg-gray-100'}`}>
                    <div className={`text-2xl ${got ? '' : 'opacity-40 grayscale'}`}>{got ? x.emoji : '❓'}</div>
                    <div className="text-[10px] font-black leading-tight text-ink">{got ? x.name : '？？？'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'talk' && (
          <div>
            {!talk ? (
              <>
                <div className="mb-2 text-center text-[11px] font-bold text-indigo-900/60">
                  きょう あと <b className="text-[14px] text-rose-600">{Math.max(0, talkLeft)}</b>かい おはなし できるよ（1にち {TALK_PER_DAY}かい）
                </div>
                {talkLeft <= 0 ? (
                  <div className="rounded-2xl bg-gray-100 px-3 py-3 text-center text-[12px] font-black text-ink">きょうの かいぎは おしまい。また あした！</div>
                ) : !friends.length ? (
                  <div className="rounded-2xl bg-amber-50 px-3 py-4 text-center text-[12px] font-bold text-ink">いまは だれも きていないみたい…</div>
                ) : (
                  <>
                    <div className="mb-2 text-[12px] font-bold text-ink">だれと おはなしする？ クイズを 1もん だしてくれるよ</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {friends.map((f) => (
                        <button key={f.id} className="flex flex-col items-center rounded-xl bg-amber-50 px-1 py-2" onClick={() => startTalk(f)}>
                          <CharSVG charKey={f.char} level={f.level} fillPct={f.fill} size={56} stars={f.stars} label={f.name} />
                          <div className="text-[10px] font-black leading-tight text-ink">{f.name}</div>
                          <div className="text-[9px] font-bold text-indigo-900/55">{f.catLabel}</div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <CharSVG charKey={talk.f.char} level={talk.f.level} fillPct={talk.f.fill} size={56} stars={talk.f.stars} label={talk.f.name} />
                  <div className="min-w-0">
                    <div className="text-[13px] font-black text-ink">{talk.f.name}と おはなし</div>
                    <div className="text-[11px] font-bold text-indigo-900/55">{talk.f.monthLabel}・{talk.f.catLabel}</div>
                  </div>
                </div>
                {talk.loading ? (
                  <div className="mt-3 rounded-2xl bg-indigo-50 px-4 py-3 text-[13px] font-bold text-ink">もんだいを えらんでいるよ…</div>
                ) : !talk.l ? (
                  <div className="mt-3 rounded-2xl bg-indigo-50 px-4 py-3 text-[13px] font-bold text-ink">きょうは もんだいが ないみたい。クイズで いっしょに べんきょうしよう！</div>
                ) : (
                  <>
                    <div className="mt-3 whitespace-pre-line rounded-2xl bg-emerald-800 px-4 py-3 text-[14px] font-bold leading-relaxed text-emerald-50">
                      {talk.l.q}
                      {talk.l.options.length > 0 && (
                        <div className="mt-2 text-[13px] text-emerald-100">{talk.l.options.map((o) => <div key={o}>{o}</div>)}</div>
                      )}
                    </div>
                    {!talk.show ? (
                      <button className="btn-main mt-3" onClick={() => { sfx('letter'); setTalk({ ...talk, show: true }); }}>💡 こたえを みる</button>
                    ) : (
                      <>
                        <div className="mt-2 whitespace-pre-line rounded-2xl bg-amber-50 px-4 py-3 text-[13px] font-bold leading-relaxed text-ink">
                          <div className="text-[14px] font-black text-rose-600">こたえ：{talk.l.answer}</div>
                          {talk.l.explanation && <div className="mt-1 text-indigo-900/75">{talk.l.explanation}</div>}
                        </div>
                        {!talk.done ? (
                          <div className="mt-2 flex gap-2">
                            <button className="btn-main" onClick={() => judge(true)}>⭕ あたってた！</button>
                            <button className="btn" onClick={() => judge(false)}>🤔 おしい…</button>
                          </div>
                        ) : (
                          <div className="mt-2 rounded-2xl bg-rose-50 px-3 py-2 text-center text-[12px] font-bold text-ink">
                            {talk.done.correct ? '🎉 すごい！ ' : 'つぎは きっと できるよ！ '}
                            💗 {talk.f.name}と なかよし +{talk.done.correct ? 2 : 1}{talk.done.heart && '（ハートが ふえた！）'}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
                <div className="mt-2 flex gap-2">
                  {talk.done && talkLeft > 0 && (
                    <button className="btn-main" onClick={() => startTalk(talk.f, talk.l?.id)}>✏️ もう1もん</button>
                  )}
                  <button className="btn" onClick={() => setTalk(null)}>🔙 ほかの こと はなす</button>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'tea' && (
          <div>
            <div className={`mb-3 flex h-32 flex-col items-center justify-center rounded-2xl px-4 text-center ${night ? 'bg-gradient-to-b from-indigo-900 to-indigo-700' : 'bg-gradient-to-b from-amber-100 to-orange-200'}`}>
              <div className="text-5xl">{teaFrom ? '💌' : '🍵'}</div>
              <div className={`mt-1 text-[12px] font-black leading-relaxed ${night ? 'text-indigo-50' : 'text-amber-900'}`}>
                {teaFrom
                  ? `${teaFrom.name}から おてがみが とどいたよ！`
                  : night ? 'おつきさまを みながら おちゃを いれよう' : 'あったかい おちゃを いれよう'}
              </div>
            </div>
            {teaFrom && (
              <div className="mb-2 rounded-2xl bg-rose-50 px-3 py-2 text-center text-[12px] font-bold leading-relaxed text-ink">
                💗 {teaFrom.name}と なかよし +2<br />📮 おてがみは 島の「おてがみ」から よめるよ
              </div>
            )}
            {today.tea ? (
              <div className="rounded-2xl bg-gray-100 px-3 py-3 text-center text-[12px] font-black text-ink">きょうの おちゃかいは おわり。また あした！</div>
            ) : !friends.length ? (
              <div className="rounded-2xl bg-amber-50 px-3 py-4 text-center text-[12px] font-bold text-ink">いまは だれも きていないみたい…</div>
            ) : (
              <button className="btn-main" onClick={tea}>🍵 おちゃを いれる</button>
            )}
            <div className="mt-2 text-[10px] font-bold leading-relaxed text-indigo-900/50">
              💡 1にち 1かい、なかまの だれかが おちゃに きて おてがみを くれるよ。
            </div>
          </div>
        )}

        <button className="btn mt-3" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
