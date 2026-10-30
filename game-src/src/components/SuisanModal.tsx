import { useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import { sfx } from '../lib/sound';
import {
  STAGES, GOOD_MONEY, RETRY_MONEY, clearLine, lockHint, unlocked,
  type Sea, type Stage,
} from '../lib/suisan';
import { CharSVG } from './CharSVG';

// モクタの ぎょこうづくり：5つの漁業を 漁港の けいえいで まなぶ。
// 場面ごとに 「どうする？」を えらんで 水あげ（万円）を ふやす。メダルは つかわない・ふやさない。ごほうびは ステージごとの 家具。

const VW = 360;
const VH = 150;

interface Play {
  stage: Stage;
  hint: boolean;
  order: number[][];    // 各ラウンドの 見せる じゅんばん（order[r][k] ＝ 元の choices の番号）
  ri: number;
  hearts: number;
  money: number;
  tried: number[];      // このラウンドで まちがえた 見た目の番号
  status: 'ask' | 'right' | 'wrong';
  firstTry: boolean;
  over: null | 'dead' | 'clear';
}

const shuffle = (n: number): number[] => {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function newPlay(stage: Stage, hint: boolean): Play {
  return {
    stage, hint, order: stage.rounds.map((r) => shuffle(r.choices.length)),
    ri: 0, hearts: 3, money: 0, tried: [], status: 'ask', firstTry: true, over: null,
  };
}

// 海の絵：左が 陸、そこから 領海(12海里)・経済水域(200海里)・公海
const ZONES = [
  { x: 56,  w: 84,  label: '領海 12海里',   fill: '#7dd3fc' },
  { x: 140, w: 110, label: '経済水域 200海里', fill: '#38bdf8' },
  { x: 250, w: 110, label: '公海',           fill: '#0ea5e9' },
];
const seaX = (sea: Sea, prog: number): number => {
  switch (sea) {
    case 'near': return 70 + prog * 56;
    case 'eez':  return 150 + prog * 90;
    case 'high': return 260 + prog * 80;
    case 'pond': return 74 + prog * 40;
    case 'port': return 80 + prog * 220;
    default:     return 80 + prog * 240;
  }
};

function SeaScene({ stage, prog }: { stage: Stage; prog: number }) {
  const x = seaX(stage.sea, prog);
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="mb-2 w-full select-none rounded-2xl shadow ring-1 ring-black/10">
      <defs>
        <linearGradient id="su-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e0f2fe" /><stop offset="1" stopColor="#bae6fd" /></linearGradient>
      </defs>
      <rect width={VW} height={VH} fill="url(#su-sky)" />
      {ZONES.map((z) => (
        <g key={z.label}>
          <rect x={z.x} y="52" width={z.w} height={VH - 52} fill={z.fill} />
          <text x={z.x + z.w / 2} y="70" textAnchor="middle" fontSize="10" fontWeight="900" fill="#0c4a6e">{z.label}</text>
        </g>
      ))}
      <path d="M140 52 V150 M250 52 V150" stroke="#fff" strokeWidth="1.6" strokeDasharray="4 3" />
      {/* 陸と 漁港 */}
      <path d="M0 62 Q30 50 56 58 V150 H0 Z" fill="#a3e635" stroke="#4d7c0f" strokeWidth="1.4" />
      <rect x="10" y="40" width="26" height="20" rx="2" fill="#fde68a" stroke="#92400e" strokeWidth="1.4" />
      <path d="M7 41 L23 28 L39 41 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.4" />
      <text x="24" y="104" textAnchor="middle" fontSize="10" fontWeight="900" fill="#14532d">漁港</text>
      {stage.id === 'umi' && (
        <g>
          <ellipse cx="170" cy="112" rx="26" ry="10" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
          <text x="170" y="116" textAnchor="middle" fontSize="9" fontWeight="900" fill="#78350f">潮目</text>
          <path d="M62 132 Q100 140 138 132" fill="none" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          <text x="100" y="146" textAnchor="middle" fontSize="9" fontWeight="900" fill="#78350f">大陸棚</text>
        </g>
      )}
      {stage.sea === 'pond' && (
        <g>
          <rect x="60" y="92" width="62" height="38" rx="4" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" strokeDasharray="5 3" />
          <text x="91" y="146" textAnchor="middle" fontSize="9" fontWeight="900" fill="#0c4a6e">{stage.id === 'yoshoku' ? 'いけす' : '放流'}</text>
        </g>
      )}
      <text x={x} y={stage.sea === 'pond' ? 118 : 108} textAnchor="middle" fontSize="28" style={{ transition: 'all .5s' }}>{stage.boat}</text>
    </svg>
  );
}

export function SuisanModal({ onClose }: { onClose(): void }) {
  const g = useGame();
  const cleared = g.save.suisan.cleared;
  const [pick, setPick] = useState<Stage | null>(null);
  const [p, setP] = useState<Play | null>(null);
  const pRef = useRef<Play | null>(null);
  const [res, setRes] = useState<{ isNew: boolean; reward: string | null } | null>(null);

  const commit = (fn: (cur: Play) => Play) => {
    if (!pRef.current) return;
    const next = fn(pRef.current);
    pRef.current = next;
    setP(next);
  };
  const start = (st: Stage, hint: boolean) => {
    g.suisanPlay();
    const n = newPlay(st, hint);
    pRef.current = n;
    setP(n);
    setRes(null);
    setPick(null);
  };
  const back = () => { pRef.current = null; setP(null); setRes(null); };

  /** こたえを えらぶ（k ＝ 見た目の 番号） */
  const answer = (k: number) => {
    commit((cur) => {
      if (cur.over || cur.status !== 'ask' || cur.tried.includes(k)) return cur;
      const r = cur.stage.rounds[cur.ri];
      const ok = cur.order[cur.ri][k] === r.ans;
      if (ok) {
        sfx('catch');
        return { ...cur, status: 'right', money: cur.money + (cur.firstTry ? GOOD_MONEY : RETRY_MONEY) };
      }
      sfx('ng');
      if (cur.hint) return { ...cur, tried: [...cur.tried, k], firstTry: false };
      return { ...cur, tried: [...cur.tried, k], status: 'wrong', hearts: cur.hearts - 1 };
    });
  };

  const next = () => {
    commit((cur) => {
      if (cur.status === 'ask' || cur.over) return cur;
      if (cur.hearts <= 0) return { ...cur, over: 'dead' };
      if (cur.ri + 1 >= cur.stage.rounds.length) {
        sfx('chest');
        setRes(g.suisanClear(cur.stage.id));
        return { ...cur, over: 'clear' };
      }
      sfx('gift');
      return { ...cur, ri: cur.ri + 1, tried: [], status: 'ask', firstTry: true };
    });
  };

  // ───────── えらぶ画面 ─────────
  if (!p) {
    return (
      <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
        <div className="panel max-h-[90vh] w-full max-w-[460px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[15px] font-black text-ink">⚓ モクタの ぎょこうづくり</div>
            <button className="rounded-full bg-gray-100 px-3 py-1 text-[12px] font-black text-ink" onClick={onClose}>とじる</button>
          </div>
          <div className="mb-2 flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-2">
            <CharSVG charKey="beaver" level={6} fillPct={100} size={52} label="モクタ" />
            <div className="text-[12px] font-bold leading-relaxed text-ink">
              漁港を 大きく しよう！ <b className="text-sky-700">沿岸 → 沖合 → 遠洋 → 養殖 → 栽培</b> の じゅんに、場面ごとに「どうする？」を えらんで 水あげを ふやすよ。
            </div>
          </div>
          {!pick ? (
            <>
              <div className="grid grid-cols-1 gap-1.5">
                {STAGES.map((st) => {
                  const open = unlocked(st, cleared);
                  return (
                    <button key={st.id} disabled={!open}
                      className={`relative flex items-center gap-2 rounded-2xl px-3 py-2 text-left shadow ring-1 ring-black/5 ${open ? 'bg-white active:scale-[0.98]' : 'bg-gray-100 opacity-60'}`}
                      onClick={() => setPick(st)}>
                      <span className="text-2xl">{open ? st.emoji : '🔒'}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-black text-ink">{st.name}</span>
                        <span className="block truncate text-[10.5px] font-bold text-indigo-900/60">{open ? st.sub : lockHint(st, cleared)}</span>
                      </span>
                      {cleared.includes(st.id) && <span className="rounded-full bg-emerald-500 px-1.5 text-[10px] font-black text-white">✓</span>}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 rounded-2xl bg-amber-50 px-3 py-2 text-center text-[11px] font-bold text-ink">
                クリアした ステージ {cleared.length} / {STAGES.length}　クリアすると 家具が もらえるよ
              </div>
            </>
          ) : (
            <div>
              <div className="mb-2 rounded-2xl bg-white px-3 py-3 text-center shadow ring-1 ring-black/5">
                <div className="text-4xl">{pick.emoji}</div>
                <div className="text-[15px] font-black text-ink">{pick.name}</div>
                <div className="mt-1 text-[11.5px] font-bold leading-relaxed text-indigo-900/70">{pick.intro}</div>
                <div className="mt-1 text-[11px] font-black text-emerald-700">ごほうび：{ITEM_BY_ID[pick.reward].emoji} {ITEM_BY_ID[pick.reward].name}{cleared.includes(pick.id) ? '（もらったよ）' : ''}</div>
              </div>
              <button className="btn-main mb-1.5" onClick={() => start(pick, true)}>🌱 ヒントありで はじめる</button>
              <button className="btn mb-1.5 w-full" onClick={() => start(pick, false)}>💪 ヒントなしで ちょうせん（まちがえると ❤️が へるよ）</button>
              <button className="w-full rounded-2xl bg-gray-100 py-2 text-[12px] font-black text-ink" onClick={() => setPick(null)}>← ステージを えらびなおす</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ───────── あそぶ画面 ─────────
  const st = p.stage;
  const r = st.rounds[p.ri];
  const total = st.rounds.length;
  const prog = p.over === 'clear' ? 1 : p.ri / Math.max(1, total - 1);
  const last = p.ri + 1 >= total;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[94vh] w-full max-w-[460px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <div className="text-[14px] font-black text-ink">{st.emoji} {st.name}　<span className="text-[12px] text-sky-700">{Math.min(p.ri + 1, total)} / {total}</span></div>
          <div className="flex items-center gap-1.5">
            {!p.hint && <span className="text-[13px]">{'❤️'.repeat(Math.max(0, p.hearts))}{'🤍'.repeat(Math.max(0, 3 - p.hearts))}</span>}
            <button className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-black text-ink" onClick={back}>やめる</button>
          </div>
        </div>

        <SeaScene stage={st} prog={prog} />

        <div className="mb-2 flex items-center justify-between rounded-xl bg-sky-50 px-3 py-1.5 text-[12px] font-black text-sky-900">
          <span>🐟 水あげ</span><span>{p.money}万円</span>
        </div>

        {!p.over && (
          <>
            <div className="mb-2 flex items-start gap-2 rounded-2xl bg-sky-50 px-2 py-2">
              <div className="shrink-0"><CharSVG charKey="beaver" level={6} fillPct={100} size={48} label="モクタ" /></div>
              <div className="whitespace-pre-line text-[12.5px] font-bold leading-relaxed text-ink">
                {p.ri === 0 && p.status === 'ask' && p.tried.length === 0 ? `${st.intro}\n\n` : ''}{r.q}
              </div>
            </div>

            <div className="mb-2 grid grid-cols-1 gap-1.5">
              {p.order[p.ri].map((orig, k) => {
                const isAns = orig === r.ans;
                const done = p.status !== 'ask';
                const wrongPick = p.tried.includes(k);
                const cls = done && isAns ? 'bg-emerald-500 text-white'
                  : wrongPick ? 'bg-rose-100 text-rose-700 line-through'
                  : 'bg-white text-ink';
                return (
                  <button key={k} disabled={done || wrongPick} onClick={() => answer(k)}
                    className={`rounded-xl px-3 py-2.5 text-left text-[13px] font-black shadow ring-1 ring-black/5 active:scale-[0.98] ${cls}`}>
                    {r.choices[orig]}
                  </button>
                );
              })}
            </div>

            {p.status === 'ask' && p.tried.length > 0 && (
              <div className="mb-2 rounded-2xl bg-rose-50 px-3 py-2 text-[12px] font-bold text-rose-700">ざんねん！ もういちど えらんでみよう</div>
            )}

            {p.status !== 'ask' && (
              <>
                <div className={`mb-2 rounded-2xl px-3 py-2 text-[12px] font-bold leading-relaxed ${p.status === 'right' ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-800'}`}>
                  {p.status === 'right' ? `⭕ せいかい！ +${p.firstTry ? GOOD_MONEY : RETRY_MONEY}万円\n` : '❌ ざんねん… せいかいは 緑のところ（❤️ −1）\n'}{r.say}
                </div>
                <button className="btn-main" onClick={next}>{p.hearts <= 0 ? 'つづき' : last ? '🎉 水あげを まとめる' : '▶ つぎの 場面へ'}</button>
              </>
            )}
          </>
        )}

        {p.over === 'dead' && (
          <div className="rounded-2xl bg-rose-50 px-3 py-3 text-center">
            <div className="mb-2 text-[13px] font-black text-rose-700">❤️が なくなっちゃった…。もういちど やってみよう</div>
            <button className="btn-main mb-1.5" onClick={() => start(st, p.hint)}>もういちど！</button>
            <button className="btn mb-1.5 w-full" onClick={() => start(st, true)}>ヒントありで やる</button>
          </div>
        )}

        {p.over === 'clear' && (
          <div className="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
            <div className="bubble-pop mb-1 text-4xl">🎉</div>
            <div className="mb-1 text-[13px] font-black text-emerald-800">{clearLine(st, p.money)}</div>
            <div className="mb-2 text-[11.5px] font-bold leading-relaxed text-ink">{st.outro}</div>
            {res?.reward ? (
              <div className="mb-2 text-[12px] font-black text-violet-700">🎁 ごほうび：{ITEM_BY_ID[res.reward].emoji} {ITEM_BY_ID[res.reward].name}（「かぐ」から おけるよ）</div>
            ) : (
              <div className="mb-2 text-[11px] font-bold text-indigo-900/60">この ステージの ごほうびは もう もらってるよ</div>
            )}
            <button className="btn-main mb-1.5" onClick={back}>ほかの ステージも あそぶ</button>
            <button className="w-full rounded-2xl bg-gray-100 py-2 text-[12px] font-black text-ink" onClick={onClose}>とじる</button>
          </div>
        )}
      </div>
    </div>
  );
}
