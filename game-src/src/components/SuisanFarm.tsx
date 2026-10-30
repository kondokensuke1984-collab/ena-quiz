import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEM_BY_ID } from '../lib/items';
import { sfx } from '../lib/sound';
import {
  FEED_COOLDOWN, FEED_COST, FEED_GAIN, POND_MAX, SEA_MAX, SEA_MS, SICK_DIE_MS, SPECIES, SP_BY_ID,
  gNow, growthLook, seaValue, spStyle,
} from '../lib/suisanFarm';
import type { FarmPlace } from '../lib/suisanFarmPlaces';
import { CharSVG } from './CharSVG';

// いけす：養殖＝えさを やって そだてる／栽培＝稚魚を 海に 放流して まつ。

export function SuisanFarm({ place, onBack }: { place: FarmPlace; onBack(): void }) {
  const g = useGame();
  const s = g.save.suisan;
  const [now, setNow] = useState(() => Date.now());
  const [msg, setMsg] = useState(`${place.line}\n稚魚を かって いけすに いれよう！ えさを あげると はやく そだつよ。`);
  const sRef = useRef(s);
  sRef.current = s;

  // 1びょうごとに 時計を すすめる。赤潮が おきたり、はらわないと だめになったり する
  useEffect(() => {
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      const cur = sRef.current;
      const dead = cur.pond.filter((f) => f.sick && t - f.sick > SICK_DIE_MS);
      if (dead.length) {
        sfx('ng');
        setMsg('赤潮を はらえなくて、さかなが よわってしまった… 赤潮は プランクトンが ふえすぎて おきるよ。');
        g.suisanUpdate((x) => ({ ...x, pond: x.pond.filter((f) => !(f.sick && t - f.sick > SICK_DIE_MS)) }));
        return;
      }
      if (Math.random() < 0.02 * cur.pond.length) {
        const i = Math.floor(Math.random() * cur.pond.length);
        const f = cur.pond[i];
        const gg = f ? gNow(f, t) : 0;
        if (f && !f.sick && gg > 8 && gg < 95) {
          sfx('siren');
          setMsg('あっ、赤潮だ！ 水が にごって さかなが くるしそう。「赤潮を はらう」を おして！');
          g.suisanUpdate((x) => ({
            ...x, pond: x.pond.map((p, k) => (k === i && !p.sick ? { ...p, g: gNow(p, t), t, sick: t } : p)),
          }));
        }
      }
    }, 1000);
    return () => window.clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ずかんが ぜんぶ そろったら ごほうび
  useEffect(() => {
    if (s.dex.length >= SPECIES.length && g.suisanReward('fn_sui_dexpanel')) {
      setMsg('🎁 ずかんが ぜんぶ そろった！ ごほうびに「さかなの ずかんボード」を もらったよ（「かぐ」から おけるよ）');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.dex.length]);

  const buy = (id: string, md: 'farm' | 'stock') => {
    const sp = SP_BY_ID[id];
    if (s.pond.length >= POND_MAX) { setMsg('いけすが いっぱい！ 大きくなった さかなを うろう'); return; }
    if (s.coin < sp.seed) { setMsg('水あげが たりないよ。さかなすくいや ステージで ふやそう'); return; }
    sfx('water');
    const t = Date.now();
    g.suisanUpdate((x) => (x.pond.length >= POND_MAX || x.coin < sp.seed ? x
      : { ...x, coin: x.coin - sp.seed, pond: [...x.pond, { sp: id, g: 0, t, sick: 0, fed: 0, md, pl: place.id }] }));
    setMsg(md === 'stock'
      ? `${sp.emoji} ${sp.name}の たまごを いれたよ。${place.name}の 栽培漁業。稚魚まで 育てたら 海（川）に 放流しよう。`
      : `${sp.emoji} ${sp.name}の たまごを いれたよ。${place.name}（${place.pref}）は ${sp.name}の 養殖が 有名だよ。`);
  };

  const feed = (i: number) => {
    const t = Date.now();
    const f = s.pond[i];
    if (!f || f.sick) return;
    if (t - f.fed < FEED_COOLDOWN) return;
    if (s.coin < FEED_COST) { setMsg('えさ代が たりないよ！ 養殖は えさ代が いちばん かかるんだ'); return; }
    sfx('water');
    setMsg('えさを あげたよ。はやく そだつけど、えさ代（−1万円）が かかる。待てば ただで そだつよ。');
    g.suisanUpdate((x) => ({
      ...x, coin: x.coin >= FEED_COST ? x.coin - FEED_COST : x.coin,
      pond: x.pond.map((p, k) => (k === i && !p.sick && x.coin >= FEED_COST ? { ...p, g: Math.min(100, gNow(p, t) + FEED_GAIN), t, fed: t } : p)),
    }));
  };

  const clean = (i: number) => {
    const t = Date.now();
    sfx('gift');
    setMsg('赤潮を はらったよ！ いけすの 水が きれいに なった。');
    g.suisanUpdate((x) => ({ ...x, pond: x.pond.map((p, k) => (k === i ? { ...p, sick: 0, t } : p)) }));
  };

  const sell = (i: number) => {
    const t = Date.now();
    const f = s.pond[i];
    if (!f || gNow(f, t) < 100) return;
    const sp = SP_BY_ID[f.sp];
    sfx('coin');
    const first = !s.dex.includes(sp.id);
    setMsg(`${sp.emoji} ${sp.name}を うって +${sp.sell}万円！ ${first ? '「ずかん」に のったよ！ ' : ''}${f.pl ? '' : sp.place + 'の 養殖は 有名だよ。'}`);
    g.suisanUpdate((x) => ({
      ...x, coin: x.coin + sp.sell,
      pond: x.pond.filter((_, k) => k !== i),
      dex: x.dex.includes(sp.id) ? x.dex : [...x.dex, sp.id],
    }));
  };

  const release = (i: number) => {
    const t = Date.now();
    const f = s.pond[i];
    if (!f || s.sea.length >= SEA_MAX) { if (f) setMsg('放流できるのは 3ひきまで。もどってくるのを まとう'); return; }
    if (f.md === 'stock' && gNow(f, t) < 8) { setMsg('まだ たまごだよ。稚魚まで 育ててから 放流しよう（えさを あげよう）'); return; }
    sfx('splash');
    setMsg('栽培漁業：たまごから 稚魚まで 育てて 海に 放流！ 海で 自然に 大きくなるから えさ代が かからないよ。もどってくるまで まとう。');
    g.suisanUpdate((x) => ({
      ...x, pond: x.pond.filter((_, k) => k !== i),
      sea: x.sea.length >= SEA_MAX ? x.sea : [...x.sea, { sp: f.sp, t, ...(f.pl ? { pl: f.pl } : {}) }],
    }));
  };

  const fetchSea = (i: number) => {
    const t = Date.now();
    const e = s.sea[i];
    if (!e || t - e.t < SEA_MS) return;
    const sp = SP_BY_ID[e.sp];
    const v = seaValue(sp);
    sfx('coin');
    setMsg(`🎣 放流した ${sp.name}が 大きくなって もどってきた！ +${v}万円（えさ代は ゼロ！）`);
    g.suisanUpdate((x) => ({
      ...x, coin: x.coin + v, sea: x.sea.filter((_, k) => k !== i),
      dex: x.dex.includes(sp.id) ? x.dex : [...x.dex, sp.id],
    }));
  };

  const mmss = (ms: number) => { const sec = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`; };

  return (
    <div>
      <style>{'@keyframes su-sway{0%,100%{transform:translate(-6px,0) scaleX(1)}25%{transform:translate(0,-4px) scaleX(1)}50%{transform:translate(6px,0) scaleX(-1)}75%{transform:translate(0,4px) scaleX(-1)}}'}</style>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-[14px] font-black text-ink">🐟 {place.name}（{place.pref}）</div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-black text-amber-800">💰 {s.coin}万円</span>
          <button className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-black text-ink" onClick={onBack}>産地を えらびなおす</button>
        </div>
      </div>

      <div className="mb-2 flex items-start gap-2 rounded-2xl bg-sky-50 px-2 py-2">
        <div className="shrink-0"><CharSVG charKey="beaver" level={6} fillPct={100} size={44} label="モクタ" /></div>
        <div className="whitespace-pre-line text-[12px] font-bold leading-relaxed text-ink">{msg}</div>
      </div>

      {/* いけす */}
      <div className="mb-2 text-[11px] font-black text-sky-800">養殖：いけす（{s.pond.length} / {POND_MAX}）</div>
      <div className="mb-2 grid grid-cols-2 gap-1.5">
        {Array.from({ length: POND_MAX }, (_, i) => {
          const f = s.pond[i];
          if (!f) {
            return <div key={i} className="flex h-[132px] items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/60 text-[11px] font-bold text-sky-400">あき</div>;
          }
          const sp = SP_BY_ID[f.sp];
          const gg = gNow(f, now);
          const look = growthLook(gg);
          const ready = gg >= 100;
          const wait = Math.max(0, FEED_COOLDOWN - (now - f.fed));
          return (
            <div key={i} className={`relative flex h-[132px] flex-col rounded-2xl p-1.5 shadow ring-1 ${f.sick ? 'bg-emerald-200/80 ring-rose-300' : 'bg-gradient-to-b from-sky-200 to-sky-400 ring-sky-300'}`}>
              <div className="relative flex flex-1 items-center justify-center overflow-hidden">
                <span style={{ fontSize: look.size, animation: f.sick ? undefined : 'su-sway 2.6s ease-in-out infinite', filter: f.sick ? 'grayscale(0.7)' : spStyle(sp)?.filter }}>{look.emoji(sp)}</span>
                {f.md && <span className={`absolute right-1 top-0 rounded-full px-1.5 text-[9px] font-black text-white ${f.md === 'stock' ? 'bg-teal-600' : 'bg-orange-500'}`}>{f.md === 'stock' ? '栽培' : '養殖'}</span>}
                {f.sick > 0 && <span className="absolute left-1 top-0 text-[10px] font-black text-rose-700">🦠 赤潮！</span>}
              </div>
              <div className="mb-1 flex items-center gap-1">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/70"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, gg)}%` }} /></div>
                <span className="text-[9.5px] font-black text-sky-950">{look.label}</span>
              </div>
              {f.sick ? (
                <button className="rounded-lg bg-rose-500 py-1 text-[11px] font-black text-white active:scale-95" onClick={() => clean(i)}>🧪 赤潮を はらう</button>
              ) : f.md === 'stock' ? (
                <div className="flex gap-1">
                  <button disabled={wait > 0 || ready} className="flex-1 rounded-lg bg-white py-1 text-[10.5px] font-black text-sky-900 active:scale-95 disabled:opacity-50" onClick={() => feed(i)}>
                    🍚 えさ −{FEED_COST}{wait > 0 ? `(${Math.ceil(wait / 1000)})` : ''}
                  </button>
                  <button className="flex-1 rounded-lg bg-teal-500 py-1 text-[10.5px] font-black text-white active:scale-95" onClick={() => release(i)}>🌊 放流</button>
                </div>
              ) : ready ? (
                <button className="rounded-lg bg-amber-400 py-1 text-[11px] font-black text-amber-950 active:scale-95" onClick={() => sell(i)}>✨ うる +{sp.sell}万円</button>
              ) : (
                <div className="flex gap-1">
                  <button disabled={wait > 0} className="flex-1 rounded-lg bg-white py-1 text-[10.5px] font-black text-sky-900 active:scale-95 disabled:opacity-50" onClick={() => feed(i)}>
                    🍚 えさ −{FEED_COST}{wait > 0 ? `(${Math.ceil(wait / 1000)})` : ''}
                  </button>
                  {!f.md && sp.release && gg < 60 && (
                    <button className="flex-1 rounded-lg bg-teal-500 py-1 text-[10.5px] font-black text-white active:scale-95" onClick={() => release(i)}>🌊 放流</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 栽培（放流） */}
      <div className="mb-1 text-[11px] font-black text-teal-800">栽培：海に 放流中（{s.sea.length} / {SEA_MAX}）</div>
      <div className="mb-2 grid grid-cols-3 gap-1.5">
        {Array.from({ length: SEA_MAX }, (_, i) => {
          const e = s.sea[i];
          if (!e) return <div key={i} className="flex h-[64px] items-center justify-center rounded-xl border-2 border-dashed border-teal-200 bg-teal-50/60 text-[10px] font-bold text-teal-400">あき</div>;
          const sp = SP_BY_ID[e.sp];
          const left = SEA_MS - (now - e.t);
          return (
            <button key={i} disabled={left > 0} onClick={() => fetchSea(i)}
              className={`flex h-[64px] flex-col items-center justify-center rounded-xl text-[10.5px] font-black shadow ring-1 ring-teal-300 ${left > 0 ? 'bg-teal-100 text-teal-900' : 'bg-amber-300 text-amber-950 active:scale-95'}`}>
              <span className="text-xl" style={{ animation: left > 0 ? 'su-sway 3.2s ease-in-out infinite' : undefined, filter: spStyle(sp)?.filter }}>{sp.emoji}</span>
              {left > 0 ? mmss(left) : `🎣 とる +${seaValue(sp)}`}
            </button>
          );
        })}
      </div>

      {/* かう（この 産地で できる ものだけ） */}
      {([['farm', '養殖：いけすで 育てて うる', place.farm, 'text-orange-700'], ['stock', '栽培：育てて 放流する', place.stock, 'text-teal-700']] as const).map(([md, title, ids, cls]) => (
        ids.length > 0 && (
          <div key={md}>
            <div className={`mb-1 text-[11px] font-black ${cls}`}>稚魚を かう　{title}</div>
            <div className="mb-2 grid grid-cols-2 gap-1.5">
              {ids.map((id) => {
                const sp = SP_BY_ID[id];
                return (
                  <button key={md + id} onClick={() => buy(id, md)}
                    className={`flex items-center gap-1.5 rounded-xl bg-white px-2 py-1.5 text-left shadow ring-1 ring-black/5 active:scale-95 ${s.coin < sp.seed || s.pond.length >= POND_MAX ? 'opacity-50' : ''}`}>
                    <span className="text-2xl" style={spStyle(sp)}>{sp.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-black text-ink">{sp.name}</span>
                      <span className="block text-[10px] font-bold text-indigo-900/60">{md === 'stock' ? `−${sp.seed}万円 → 放流で +${seaValue(sp)}万円` : `−${sp.seed}万円 → +${sp.sell}万円`}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )
      ))}
      <div className="mb-2 rounded-2xl bg-sky-50 px-3 py-2 text-[11px] font-bold leading-relaxed text-ink">📖 {place.fact}</div>

      <div className="mb-2 rounded-2xl bg-amber-50 px-3 py-2 text-[11px] font-bold leading-relaxed text-ink">
        <b>ずかん</b>　{SPECIES.map((sp) => (s.dex.includes(sp.id) ? `${sp.emoji}${sp.name}` : '❔')).join('　')}
        <div className="text-[10.5px] text-indigo-900/70">
          ぜんぶ そろえると {ITEM_BY_ID.fn_sui_dexpanel.emoji} {ITEM_BY_ID.fn_sui_dexpanel.name}{g.save.owned.includes('fn_sui_dexpanel') ? '（もらったよ）' : ' が もらえるよ'}
        </div>
      </div>
    </div>
  );
}
