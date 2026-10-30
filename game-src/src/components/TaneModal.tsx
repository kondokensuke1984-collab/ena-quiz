import { useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import { sfx } from '../lib/sound';
import { CharSVG } from './CharSVG';
import {
  STAGES, STAGE_BY_ID, QUESTIONS_PER_STAGE, HEARTS, kindsOf, makeQuestion,
  type Cup, type Fig, type Part, type Question, type SeedKind, type StageId,
} from '../lib/tane';

// たねの けんきゅうじょ：11月の理科「種子のつくりと発芽1」を、ステージを すすめながら れんしゅうする。
// まちがえると ❤️が へって、かいせつを みて べつの 問題で もういちど。
// メダルは つかわない・ふやさない。ごほうびは ステージごとの 家具。

const W = 300;
const H = 190;
const INK = '#4c1d95';
const STAIN = '#5b21b6';

interface Play {
  stage: StageId;
  kinds: string[];
  qi: number;
  q: Question;
  hearts: number;
  phase: 'ask' | 'right' | 'wrong' | 'over' | 'clear';
  picked: string | null;
  hint: boolean;
  miss: number;
}

const startQ = (): Pick<Play, 'phase' | 'picked' | 'hint'> => ({ phase: 'ask', picked: null, hint: false });

// ───────── 図 ─────────
function Label({ x, y, tx, ty, text, end }: { x: number; y: number; tx: number; ty: number; text: string; end?: boolean }) {
  return (
    <g>
      <line x1={x} y1={y} x2={tx} y2={ty} stroke="#334155" strokeWidth="1" />
      <text x={tx + (end ? -3 : 3)} y={ty + 4} fontSize="11" fontWeight="900" fill="#1e1b4b" textAnchor={end ? 'end' : 'start'}>{text}</text>
    </g>
  );
}

const ANCHOR: Record<SeedKind, Partial<Record<Part, [number, number]>>> = {
  bean: { youga: [172, 52], hanjiku: [172, 82], yokon: [172, 118], shiyo: [100, 100], shuhi: [51, 95] },
  corn: { hainyu: [150, 70], hai: [150, 138], shuhi: [87, 71] },
};

function SeedFig({ seed, mark, stain, reveal }: { seed: SeedKind; mark?: Part; stain?: Part[]; reveal: boolean }) {
  const st = (p: Part, base: string) => (reveal && stain?.includes(p) ? STAIN : base);
  const a = ANCHOR[seed];
  return (
    <g>
      {seed === 'bean' ? (
        <g>
          <ellipse cx="140" cy="95" rx="92" ry="74" fill="#a16207" stroke={INK} strokeWidth="2" />
          <ellipse cx="140" cy="95" rx="84" ry="66" fill={st('shiyo', '#fef3c7')} stroke="#d6a85f" strokeWidth="1.5" />
          <rect x="166" y="62" width="12" height="40" rx="5" fill="#fde68a" stroke={INK} strokeWidth="1.4" />
          <path d="M172 62 q-16 -8 -14 -22 q12 2 14 22 M172 62 q16 -8 14 -22 q-12 2 -14 22" fill="#4ade80" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M166 102 L178 102 L172 134 Z" fill="#fcd34d" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
        </g>
      ) : (
        <g>
          <path d="M92 30 Q150 14 208 30 Q228 98 172 168 Q150 180 128 168 Q72 98 92 30 Z" fill={st('hainyu', '#fde68a')} stroke="#a16207" strokeWidth="7" strokeLinejoin="round" />
          <ellipse cx="150" cy="138" rx="20" ry="26" fill="#fef9c3" stroke="#92400e" strokeWidth="2" />
        </g>
      )}
      {reveal && (seed === 'bean' ? (
        <g>
          <Label x={172} y={50} tx={226} ty={34} text="幼芽" />
          <Label x={178} y={82} tx={226} ty={80} text="胚じく" />
          <Label x={174} y={122} tx={226} ty={128} text="幼根" />
          <Label x={100} y={100} tx={20} ty={160} text="子葉" />
          <Label x={52} y={90} tx={6} ty={40} text="種皮" />
        </g>
      ) : (
        <g>
          <Label x={160} y={70} tx={232} ty={60} text="胚乳" />
          <Label x={168} y={138} tx={232} ty={140} text="胚" />
          <Label x={88} y={72} tx={6} ty={50} text="種皮" />
        </g>
      ))}
      {mark && a[mark] && !reveal && (
        <g>
          <circle cx={a[mark]![0]} cy={a[mark]![1]} r="12" fill="#ef4444" stroke="#fff" strokeWidth="2" className="animate-pulse" />
          <text x={a[mark]![0]} y={a[mark]![1] + 5} textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff">？</text>
        </g>
      )}
    </g>
  );
}

function CupFig({ cups }: { cups: Cup[] }) {
  const cw = W / cups.length;
  return (
    <g>
      {cups.map((c, i) => {
        const cx = cw * i + cw / 2;
        return (
          <g key={c.label} transform={`translate(${cx} 0)`}>
            <circle cx="0" cy="18" r="11" fill="#6366f1" />
            <text x="0" y="23" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff">{c.label}</text>
            <rect x="-26" y="40" width="52" height="64" rx="6" fill="#f0f9ff" stroke="#0369a1" strokeWidth="2" />
            <rect x="-24" y="80" width="48" height="22" rx="3" fill={c.water ? '#93c5fd' : '#f5f5f4'} stroke={c.water ? '#3b82f6' : '#d6d3d1'} strokeDasharray={c.water ? undefined : '3 3'} />
            {c.water && c.air && [-12, 0, 12].map((x) => <circle key={x} cx={x} cy="92" r="1.8" fill="#eff6ff" />)}
            <ellipse cx="0" cy="76" rx="10" ry="6" fill="#92400e" stroke={INK} strokeWidth="1.2" />
            {!c.air && <rect x="-24" y="52" width="48" height="50" rx="3" fill="#38bdf8" opacity="0.55" />}
            {!c.light && <rect x="-26" y="40" width="52" height="64" rx="6" fill="#1e293b" opacity="0.6" />}
            <text x="0" y="122" textAnchor="middle" fontSize="11" fontWeight="900" fill={c.warm ? '#b45309' : '#2563eb'}>{c.warm ? '25℃' : '❄️ 5℃'}</text>
            <text x="0" y="137" textAnchor="middle" fontSize="11" fontWeight="900" fill="#334155">{c.light ? '☀️ あかるい' : '🌑 くらい'}</text>
            <text x="0" y="152" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0369a1">{!c.air ? '水に しずめる' : c.water ? '水 あり' : '水 なし'}</text>
          </g>
        );
      })}
    </g>
  );
}

function StepsFig({ items }: { items: { e: string; s: string }[] }) {
  return (
    <div className="mb-2 flex items-start justify-around gap-1 rounded-2xl bg-white px-2 py-3 shadow ring-1 ring-black/10">
      {items.map((it, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col items-center text-center">
          <div className="text-[30px] leading-none">{it.e}</div>
          {it.s && <div className="mt-1 text-[11px] font-black leading-tight text-indigo-900/80">{it.s}</div>}
        </div>
      ))}
    </div>
  );
}

function Figure({ fig, reveal }: { fig: Fig; reveal: boolean }) {
  if (fig.t === 'steps') return <StepsFig items={fig.items} />;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mb-2 w-full select-none rounded-2xl bg-white shadow ring-1 ring-black/10">
      {fig.t === 'seed' && <SeedFig seed={fig.seed} mark={fig.mark} stain={fig.stain} reveal={reveal} />}
      {fig.t === 'cups' && <CupFig cups={fig.cups} />}
    </svg>
  );
}

// ───────── 本体 ─────────
export function TaneModal({ onClose }: { onClose: () => void }) {
  const g = useGame();
  const [p, setP] = useState<Play | null>(null);
  const [res, setRes] = useState<{ isNew: boolean; reward: string | null } | null>(null);
  const cleared = g.save.tane.cleared;

  const start = (stage: StageId) => {
    const kinds = kindsOf(stage);
    const q = makeQuestion(stage, kinds[0]);
    g.tanePlay();
    setRes(null);
    setP({ stage, kinds, qi: 0, q, hearts: HEARTS, miss: 0, ...startQ() });
  };

  const choose = (c: string) => {
    if (!p || p.phase !== 'ask') return;
    if (c === p.q.answer) {
      sfx('star');
      if (p.qi + 1 >= p.kinds.length) {
        setRes(g.taneClear(p.stage));
        setP({ ...p, picked: c, phase: 'clear' });
      } else {
        setP({ ...p, picked: c, phase: 'right' });
      }
    } else {
      sfx('gift');
      const hearts = p.hearts - 1;
      setP({ ...p, picked: c, hearts, miss: p.miss + 1, phase: hearts <= 0 ? 'over' : 'wrong' });
    }
  };

  const next = () => {
    if (!p) return;
    const qi = p.qi + 1;
    setP({ ...p, qi, q: makeQuestion(p.stage, p.kinds[qi]), ...startQ() });
  };
  const retry = () => {
    if (!p) return;
    setP({ ...p, q: makeQuestion(p.stage, p.kinds[p.qi]), ...startQ() });
  };

  // ───────── えらぶ画面 ─────────
  if (!p) {
    return (
      <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
        <div className="panel max-h-[90vh] w-full max-w-[460px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[15px] font-black text-ink">🌱 たねの けんきゅうじょ</div>
            <button className="rounded-full bg-gray-100 px-3 py-1 text-[12px] font-black text-ink" onClick={onClose}>とじる</button>
          </div>
          <div className="mb-2 flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2">
            <CharSVG charKey="bee" level={6} fillPct={100} size={52} label="ハニー" />
            <div className="text-[12px] font-bold leading-relaxed text-ink">
              11月の 理科「種子のつくりと発芽1」の れんしゅうだよ！ 4つの ステージを クリアすると 家具が もらえるよ。まちがえると ❤️が へるけど、かいせつを よんで もういちど ちょうせんしよう！
            </div>
          </div>
          {STAGES.map((s, i) => {
            const done = cleared.includes(s.id);
            return (
              <button key={s.id} className="mb-2 flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-3 text-left shadow ring-1 ring-black/5 active:scale-[0.99]" onClick={() => start(s.id)}>
                <div className="text-[34px]">{s.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black text-indigo-900/60">ステージ{i + 1}　{s.title}</div>
                  <div className="text-[15px] font-black text-ink">{s.game}</div>
                  <div className="text-[11px] font-black text-violet-700">
                    ごほうび：{ITEM_BY_ID[s.reward].emoji} {ITEM_BY_ID[s.reward].name}{done ? '（もらったよ）' : ''}
                  </div>
                </div>
                <div className="text-[20px]">{done ? '✅' : '▶'}</div>
              </button>
            );
          })}
          <div className="rounded-2xl bg-amber-50 px-3 py-2 text-center text-[11px] font-bold text-ink">
            クリアした ステージ {cleared.length} / {STAGES.length}　問題は まいかい ちょっとずつ かわるよ
          </div>
        </div>
      </div>
    );
  }

  const st = STAGE_BY_ID[p.stage];
  const q = p.q;
  const reveal = p.phase !== 'ask';

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[94vh] w-full max-w-[460px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <div className="text-[14px] font-black text-ink">{st.emoji} {st.game}　<span className="text-[12px] text-indigo-900/60">{p.phase === 'clear' ? 'クリア！' : `${p.qi + 1} / ${QUESTIONS_PER_STAGE}`}</span></div>
          <div className="flex items-center gap-1.5">
            <span className="text-[13px]">{'❤️'.repeat(Math.max(0, p.hearts))}{'🤍'.repeat(Math.max(0, HEARTS - p.hearts))}</span>
            <button className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-black text-ink" onClick={() => { setP(null); setRes(null); }}>やめる</button>
          </div>
        </div>

        <div className="mb-2 flex gap-1">
          {p.kinds.map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i < p.qi || p.phase === 'clear' ? 'bg-emerald-500' : i === p.qi ? 'bg-amber-400' : 'bg-gray-200'}`} />
          ))}
        </div>

        {p.phase !== 'clear' && (
          <>
            <Figure fig={q.fig} reveal={reveal} />

            <div className="mb-2 flex items-start gap-2 rounded-2xl bg-amber-50 px-2 py-2">
              <div className="shrink-0"><CharSVG charKey="bee" level={6} fillPct={100} size={44} label="ハニー" /></div>
              <div className="text-[12.5px] font-bold leading-relaxed text-ink">
                {q.boss && <span className="mr-1 rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-black text-white">ボス</span>}
                {p.qi === 0 && p.phase === 'ask' && <div className="mb-1 text-[11.5px] text-indigo-900/70">{st.intro}</div>}
                {q.text}
              </div>
            </div>
          </>
        )}

        {p.phase === 'ask' && (
          <>
            <div className="mb-2 grid grid-cols-2 gap-2">
              {q.choices.map((c) => (
                <button key={c} className="rounded-2xl bg-white px-2 py-3 text-[13.5px] font-black leading-snug text-ink shadow ring-1 ring-black/5 active:scale-[0.98]" onClick={() => choose(c)}>{c}</button>
              ))}
            </div>
            <button className="w-full rounded-2xl bg-gray-100 py-2 text-[12px] font-black text-ink" onClick={() => setP({ ...p, hint: true })}>💡 ヒント</button>
            {p.hint && <div className="mt-2 rounded-2xl bg-sky-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-sky-900">💡 {q.hint}</div>}
          </>
        )}

        {p.phase === 'right' && (
          <div className="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
            <div className="bubble-pop mb-1 text-3xl">⭕</div>
            <div className="mb-1 text-[14px] font-black text-emerald-800">せいかい！　{q.answer}</div>
            <div className="mb-2 whitespace-pre-line text-left text-[11.5px] font-bold leading-relaxed text-ink">{q.explain}</div>
            <button className="btn-main" onClick={next}>つぎの もんだいへ ▶</button>
          </div>
        )}

        {(p.phase === 'wrong' || p.phase === 'over') && (
          <div className="rounded-2xl bg-rose-50 px-3 py-3">
            <div className="mb-1 text-center text-[14px] font-black text-rose-700">ざんねん！ こたえは {q.answer}</div>
            <div className="mb-2 whitespace-pre-line rounded-xl bg-white px-2 py-2 text-[11.5px] font-bold leading-relaxed text-ink">{q.explain}</div>
            {p.phase === 'wrong' ? (
              <button className="btn-main" onClick={retry}>もういちど</button>
            ) : (
              <>
                <div className="mb-2 text-center text-[12px] font-black text-rose-700">❤️が なくなっちゃった…。さいしょから やりなおそう</div>
                <button className="btn-main" onClick={() => start(p.stage)}>さいしょから ちょうせん</button>
              </>
            )}
          </div>
        )}

        {p.phase === 'clear' && (
          <div className="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
            <div className="bubble-pop mb-1 text-4xl">🎉</div>
            <div className="mb-1 text-[14px] font-black text-emerald-800">{st.game}　クリア！</div>
            <div className="mb-2 text-[11.5px] font-bold text-ink">まちがえた かいすう：{p.miss}かい</div>
            {res?.reward ? (
              <div className="mb-2 text-[12px] font-black text-violet-700">🎁 ごほうび：{ITEM_BY_ID[res.reward].emoji} {ITEM_BY_ID[res.reward].name}（「かぐ」から おけるよ）</div>
            ) : (
              <div className="mb-2 text-[11px] font-bold text-indigo-900/60">この ステージの ごほうびは もう もらってるよ</div>
            )}
            <button className="btn-main mb-1.5" onClick={() => { setP(null); setRes(null); }}>ほかの ステージも やる</button>
            <button className="w-full rounded-2xl bg-gray-100 py-2 text-[12px] font-black text-ink" onClick={onClose}>とじる</button>
          </div>
        )}
      </div>
    </div>
  );
}

