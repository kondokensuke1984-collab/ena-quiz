import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import { sfx } from '../lib/sound';
import { SCOOP_GOLD, SCOOP_KINDS, SCOOP_SEC, pickScoopKind, type ScoopKind } from '../lib/suisanFarm';
import { CharSVG } from './CharSVG';

// さかなすくい：30びょうの あいだ、泳ぐ さかなを タップで すくう。稚魚は すくわず のがそう（とりすぎを ふせぐ）。

const W = 340;   // 水そうの 内部座標（%ではなく px 基準で動かす）
const H = 230;
const MAX_FISH = 9;

interface Fish { id: number; k: ScoopKind; x: number; y: number; vx: number; ph: number; born: number }
interface Pop { id: number; x: number; y: number; text: string; bad: boolean; at: number }

export function SuisanScoop({ onBack }: { onBack(): void }) {
  const g = useGame();
  const best = g.save.suisan.scoopBest;
  const [phase, setPhase] = useState<'ready' | 'play' | 'done'>('ready');
  const [, force] = useState(0);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(SCOOP_SEC);
  const [result, setResult] = useState<{ score: number; newBest: boolean; gold: boolean; freed: number; caught: number } | null>(null);
  const fishRef = useRef<Fish[]>([]);
  const popRef = useRef<Pop[]>([]);
  const st = useRef({ score: 0, caught: 0, freed: 0, hit: 0, nextId: 1, end: 0 });

  const spawn = (now: number) => {
    const k = pickScoopKind(Math.random());
    const dir = Math.random() < 0.5 ? 1 : -1;
    fishRef.current.push({
      id: st.current.nextId++, k, y: 28 + Math.random() * (H - 70),
      x: dir > 0 ? -k.size : W + k.size, vx: dir * (k.speed * (0.8 + Math.random() * 0.5)), ph: Math.random() * 6, born: now,
    });
  };

  const start = () => {
    g.suisanPlay();
    fishRef.current = [];
    popRef.current = [];
    const now = performance.now();
    st.current = { score: 0, caught: 0, freed: 0, hit: 0, nextId: 1, end: now + SCOOP_SEC * 1000 };
    for (let i = 0; i < 6; i++) {
      spawn(now);
      const f = fishRef.current[fishRef.current.length - 1];
      f.x = 20 + Math.random() * (W - 40);
    }
    setScore(0); setLeft(SCOOP_SEC); setResult(null);
    setPhase('play');
  };

  // ループ
  useEffect(() => {
    if (phase !== 'play') return;
    let raf = 0;
    let last = performance.now();
    let sec = SCOOP_SEC;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const remain = Math.max(0, (st.current.end - now) / 1000);
      const s2 = Math.ceil(remain);
      if (s2 !== sec) { sec = s2; setLeft(s2); }
      if (remain <= 0) { finish(); return; }
      const fs = fishRef.current;
      for (const f of fs) { f.x += f.vx * dt; f.ph += dt * 3; }
      fishRef.current = fs.filter((f) => (f.vx > 0 ? f.x < W + 70 : f.x > -70));
      if (fishRef.current.length < MAX_FISH && Math.random() < dt * 3.2) spawn(now);
      popRef.current = popRef.current.filter((p) => now - p.at < 700);
      force((n) => n + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const finish = () => {
    const sc = st.current;
    const total = Math.max(0, sc.score);
    const newBest = total > best;
    const gold = total >= SCOOP_GOLD;
    g.suisanUpdate((x) => ({ ...x, coin: x.coin + total, scoopBest: Math.max(x.scoopBest, total) }));
    if (gold) g.suisanReward('fn_sui_gold');
    sfx(gold ? 'chest' : 'star');
    setResult({ score: total, newBest, gold, freed: sc.hit, caught: sc.caught });
    setPhase('done');
  };

  const scoop = (f: Fish, e: React.PointerEvent) => {
    e.stopPropagation();
    if (phase !== 'play') return;
    const now = performance.now();
    fishRef.current = fishRef.current.filter((x) => x.id !== f.id);
    const c = st.current;
    if (f.k.pts < 0) {
      sfx('ng');
      c.score = Math.max(0, c.score + f.k.pts);
      c.hit++;
      popRef.current.push({ id: c.nextId++, x: f.x, y: f.y, text: `稚魚は のがそう ${f.k.pts}`, bad: true, at: now });
    } else {
      sfx('catch');
      c.score += f.k.pts;
      c.caught++;
      popRef.current.push({ id: c.nextId++, x: f.x, y: f.y, text: `+${f.k.pts}`, bad: false, at: now });
    }
    setScore(c.score);
  };

  const miss = (e: React.PointerEvent) => {
    if (phase !== 'play') return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    sfx('splash');
    popRef.current.push({ id: st.current.nextId++, x, y, text: '💦', bad: false, at: performance.now() });
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-[14px] font-black text-ink">🥅 さかなすくい</div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-black text-amber-800">💰 {g.save.suisan.coin}万円</span>
          <button className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-black text-ink" onClick={onBack}>もどる</button>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between rounded-xl bg-sky-50 px-3 py-1.5 text-[12px] font-black text-sky-900">
        <span>てん {score}</span><span>のこり {phase === 'ready' ? SCOOP_SEC : left}びょう</span><span>ベスト {best}</span>
      </div>

      <div className="relative mb-2 w-full select-none overflow-hidden rounded-2xl shadow ring-1 ring-black/10"
        style={{ aspectRatio: `${W} / ${H}`, background: 'linear-gradient(#7dd3fc,#0369a1)', touchAction: 'manipulation' }}
        onPointerDown={miss}>
        {fishRef.current.map((f) => (
          <button key={f.id} aria-label={f.k.name} onPointerDown={(e) => scoop(f, e)}
            className="absolute flex items-center justify-center"
            style={{
              left: `${(f.x / W) * 100}%`, top: `${((f.y + Math.sin(f.ph) * 6) / H) * 100}%`,
              width: Math.max(44, f.k.size + 14), height: Math.max(44, f.k.size + 14),
              transform: `translate(-50%,-50%) scaleX(${f.vx > 0 ? -1 : 1})`,
            }}>
            <span style={{ fontSize: f.k.size, lineHeight: 1, filter: f.k.hue ? `hue-rotate(${f.k.hue}deg) saturate(1.6)` : f.k.id === 'chigyo' ? 'opacity(0.75)' : undefined }}>{f.k.emoji}</span>
          </button>
        ))}
        {popRef.current.map((p) => (
          <span key={p.id} className={`pointer-events-none absolute whitespace-nowrap text-[13px] font-black ${p.bad ? 'text-rose-100' : 'text-white'}`}
            style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100 - 6}%`, transform: 'translate(-50%,-50%)', textShadow: '0 1px 3px rgba(0,0,0,.6)' }}>{p.text}</span>
        ))}
        {phase === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 px-4 text-center">
            <div className="text-[13px] font-black text-white">およぐ さかなを タップして すくおう！</div>
            <div className="mt-1 text-[11px] font-bold leading-relaxed text-white/90">
              {SCOOP_KINDS.filter((k) => k.pts > 0).map((k) => `${k.emoji}${k.name}+${k.pts}`).join('　')}<br />
              ちいさな 🐟稚魚は すくわずに のがそう（−2）
            </div>
          </div>
        )}
      </div>

      {phase === 'ready' && (
        <>
          <div className="mb-2 flex items-start gap-2 rounded-2xl bg-sky-50 px-2 py-2">
            <div className="shrink-0"><CharSVG charKey="beaver" level={6} fillPct={100} size={44} label="モクタ" /></div>
            <div className="text-[12px] font-bold leading-relaxed text-ink">
              {SCOOP_SEC}びょうで たくさん すくって 水あげを ふやそう！ 稚魚まで とりすぎると、あとの 魚が へってしまうよ。{SCOOP_GOLD}てん いじょうで {ITEM_BY_ID.fn_sui_gold.emoji}{ITEM_BY_ID.fn_sui_gold.name}が もらえる！
            </div>
          </div>
          <button className="btn-main" onClick={start}>🥅 スタート！</button>
        </>
      )}

      {phase === 'done' && result && (
        <div className="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
          <div className="bubble-pop mb-1 text-4xl">{result.gold ? '🏆' : '🎉'}</div>
          <div className="mb-1 text-[14px] font-black text-emerald-800">{result.score}てん！ +{result.score}万円{result.newBest ? '　ベストこうしん！' : ''}</div>
          <div className="mb-2 text-[11.5px] font-bold leading-relaxed text-ink">
            {result.caught}ひき すくったよ。{result.freed > 0 ? `稚魚を ${result.freed}ひき とっちゃった。稚魚を とりすぎると 魚が へるから、栽培漁業で ふやすんだよ。` : '稚魚は とらずに のがせた！ 資源を まもる とりかただね。'}
          </div>
          {result.gold && g.save.owned.includes('fn_sui_gold') && (
            <div className="mb-2 text-[12px] font-black text-violet-700">🎁 {ITEM_BY_ID.fn_sui_gold.emoji} {ITEM_BY_ID.fn_sui_gold.name}（「かぐ」から おけるよ）</div>
          )}
          <button className="btn-main mb-1.5" onClick={start}>もういちど！</button>
          <button className="w-full rounded-2xl bg-gray-100 py-2 text-[12px] font-black text-ink" onClick={onBack}>もどる</button>
        </div>
      )}
    </div>
  );
}
