import { useState } from 'react';
import { useGame } from '../state/useGame';
import { CharSVG } from './CharSVG';
import { CURRENTS, JAPAN_D, JAPAN_VIEWBOX, PORT_XY } from '../lib/japanMap';
import { PORTS, ZONE_JA, ZONE_ORDER, firstZone, type Port } from '../lib/suisanPorts';
import { portLockHint, portOpen } from '../lib/suisanVoyage';

// 日本地図で 出港する 港を えらぶ。場所を おぼえられるように、県の 名前・ここで とれる 魚・海流（親潮・黒潮・潮目）も 見せる。
// 魚は 港ごとに ほんとうに とれる ものだけ（養殖は 入れない）。しるし：✓＝つった 魚の 数 / 🔒＝まだ 船が 小さい。

const curve = (pts: number[][]): string => `M${pts[0][0]} ${pts[0][1]} Q${pts[1][0]} ${pts[1][1]} ${pts[2][0]} ${pts[2][1]}`;

export function SuisanPortMap({ onGo, onBack }: { onGo(p: Port): void; onBack(): void }) {
  const g = useGame();
  const cleared = g.save.suisan.cleared;
  const dex = g.save.suisan.portDex;
  const all = typeof location !== 'undefined' && new URLSearchParams(location.search).get('voyage') === 'all';
  const [sel, setSel] = useState<Port | null>(null);

  const caughtOf = (p: Port) => p.fish.filter((f) => dex.includes(`${p.id}:${f.id}`)).length;
  const total = PORTS.reduce((a, p) => a + p.fish.length, 0);
  const got = dex.filter((k) => PORTS.some((p) => p.fish.some((f) => `${p.id}:${f.id}` === k))).length;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-[14px] font-black text-ink">🗾 どの 港から しゅっこう？</div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-black text-amber-800">💰 {g.save.suisan.coin}万円</span>
          <button className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-black text-ink" onClick={onBack}>もどる</button>
        </div>
      </div>

      <div className="mb-1.5 flex items-center gap-2 rounded-2xl bg-sky-50 px-2 py-1.5">
        <div className="shrink-0"><CharSVG charKey="beaver" level={6} fillPct={100} size={40} label="モクタ" /></div>
        <div className="text-[12px] font-bold leading-relaxed text-ink">
          港を えらぼう！ 港によって とれる 魚が ちがうよ。つった 魚は 港ずかんに のるよ（{got} / {total}）。
        </div>
      </div>

      <svg viewBox={JAPAN_VIEWBOX} className="mb-1.5 w-full select-none rounded-2xl shadow ring-1 ring-black/10" style={{ background: 'linear-gradient(#e0f2fe,#7dd3fc)' }}>
        <defs>
          <marker id="pm-cold" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#1d4ed8" /></marker>
          <marker id="pm-warm" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#ea580c" /></marker>
        </defs>
        <path d={JAPAN_D} fill="#bef264" stroke="#4d7c0f" strokeWidth="0.7" strokeLinejoin="round" />
        {/* 海流：親潮（寒流）・黒潮（暖流）・潮目 */}
        <path d={curve(CURRENTS.oyashio)} fill="none" stroke="#1d4ed8" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#pm-cold)" opacity="0.85" />
        <path d={curve(CURRENTS.kuroshio)} fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#pm-warm)" opacity="0.85" />
        <text x={CURRENTS.oyashio[1][0] - 5} y={CURRENTS.oyashio[1][1] - 1} textAnchor="end" fontSize="7.5" fontWeight="900" fill="#1e3a8a">親潮（寒流）</text>
        <text x={CURRENTS.kuroshio[0][0] - 4} y={CURRENTS.kuroshio[0][1] + 11} fontSize="7.5" fontWeight="900" fill="#9a3412">黒潮（暖流）</text>
        <ellipse cx={CURRENTS.shiome[1][0] + 6} cy={CURRENTS.shiome[1][1]} rx="9" ry="34" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeDasharray="4 3" />
        <text x={CURRENTS.shiome[1][0] + 17} y={CURRENTS.shiome[1][1] - 2} fontSize="7.5" fontWeight="900" fill="#78350f">潮目</text>
        <text x={CURRENTS.eastChina[0] - 24} y={CURRENTS.eastChina[1]} fontSize="7.5" fontWeight="900" fill="#0c4a6e">東シナ海</text>
        <text x={CURRENTS.eastChina[0] - 24} y={CURRENTS.eastChina[1] + 9} fontSize="6.5" fontWeight="800" fill="#0c4a6e">（大陸棚）</text>

        {PORTS.map((p) => {
          const [x, y] = PORT_XY[p.id];
          const open = portOpen(p, cleared, all);
          const on = sel?.id === p.id;
          const n = caughtOf(p);
          const done = n >= p.fish.length;
          const left = ['sakaiminato', 'makurazaki', 'matsuura', 'yaizu', 'kushiro'].includes(p.id);
          return (
            <g key={p.id} onClick={() => setSel(p)} style={{ cursor: 'pointer' }}>
              <circle cx={x} cy={y} r="20" fill="transparent" />
              {on && <circle cx={x} cy={y} r="11" fill="#fde047" opacity="0.55" />}
              <circle cx={x} cy={y} r="6.2" fill={open ? (done ? '#16a34a' : '#0369a1') : '#64748b'} stroke="#fff" strokeWidth="1.6" />
              <text x={x} y={y + 2.6} textAnchor="middle" fontSize="7" fill="#fff">{open ? '⚓' : '🔒'}</text>
              <text x={left ? x - 9 : x + 9} y={y - 5} textAnchor={left ? 'end' : 'start'} fontSize="10" fontWeight="900" fill="#0f172a" stroke="#fff" strokeWidth="2.4" paintOrder="stroke">{p.name}</text>
              <text x={left ? x - 9 : x + 9} y={y + 6} textAnchor={left ? 'end' : 'start'} fontSize="7.5" fontWeight="800" fill="#334155" stroke="#fff" strokeWidth="2" paintOrder="stroke">{n}/{p.fish.length}</text>
            </g>
          );
        })}
      </svg>

      {sel ? (
        <div className="rounded-2xl bg-white px-3 py-3 shadow ring-1 ring-black/5">
          <div className="mb-1 flex items-baseline justify-between">
            <div className="text-[15px] font-black text-ink">⚓ {sel.name}港　<span className="text-[12px] text-sky-700">{sel.pref}</span></div>
            <button className="text-[11px] font-black text-indigo-900/50" onClick={() => setSel(null)}>とじる</button>
          </div>
          <div className="mb-1.5 text-[12px] font-bold leading-relaxed text-ink">{sel.line}</div>
          <div className="mb-1.5 grid grid-cols-3 gap-1">
            {ZONE_ORDER.map((z) => {
              const list = sel.fish.filter((f) => f.zone === z);
              return (
                <div key={z} className={`rounded-xl px-1.5 py-1 ${list.length ? 'bg-sky-50' : 'bg-gray-100 opacity-60'}`}>
                  <div className="text-[10px] font-black text-sky-800">{ZONE_JA[z]}</div>
                  {list.length ? list.map((f) => {
                    const has = dex.includes(`${sel.id}:${f.id}`);
                    return <div key={f.id} className={`text-[11px] font-black ${has ? 'text-emerald-700' : 'text-ink'}`}>{has ? '✓' : '・'}{f.emoji}{f.name}</div>;
                  }) : <div className="text-[10px] font-bold text-gray-500">とれない</div>}
                </div>
              );
            })}
          </div>
          <div className="mb-2 rounded-xl bg-amber-50 px-2 py-1.5 text-[11px] font-bold leading-relaxed text-amber-900">📖 {sel.fact}</div>
          {portOpen(sel, cleared, all) ? (
            <button className="btn-main" onClick={() => onGo(sel)}>🚤 {sel.name}港から しゅっこう！</button>
          ) : (
            <div className="rounded-2xl bg-gray-100 px-3 py-2.5 text-center text-[12px] font-black text-gray-600">
              🔒 {ZONE_JA[firstZone(sel)]}の 海まで 行ける 船が いるよ<br />
              <span className="text-[11px] font-bold">{portLockHint(sel, cleared, all)}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-white/80 px-3 py-2.5 text-center text-[12px] font-black text-indigo-900/60">⚓ 地図の 港を おしてみよう</div>
      )}
    </div>
  );
}
