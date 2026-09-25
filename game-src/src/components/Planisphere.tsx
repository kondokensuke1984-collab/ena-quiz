import { useEffect, useMemo, useState } from 'react';
import { altAz, ASTERISMS, SKY_LINES, SKY_STARS, skyDate, STAR_COLOR, starInfo } from '../lib/starsky';
import { starRadius } from './SkyLayer';

// 星座早見：あたまの上を 見上げた 円の 星図（まんなか＝天頂、ふち＝地平線）。
// 北が上なら 東が左・西が右（見上げて つかうので 地図と 東西が ぎゃく）。
// 日付と 時こくの 目もりを 回すと 空が 回る。▶で 日周運動（1時間15°）と 年周運動（1か月30°）を 見る。

type Dir = 'N' | 'E' | 'S' | 'W';
const DIR_LABEL: Record<Dir, string> = { N: '北', E: '東', S: '南', W: '西' };
const ROT: Record<Dir, number> = { S: 0, N: 180, E: -90, W: 90 };   // えらんだ 方位が 下に くる 回転
const R = 120;
const C = 150;

type Pos = Record<string, { x: number; y: number }>;

function dateOf(year: number, doy: number, tmin: number): Date {
  const d = new Date(year, 0, 1 + doy, 18, 0, 0, 0);
  d.setMinutes(d.getMinutes() + tmin);
  return d;
}

function project(d: Date): Pos {
  const out: Pos = {};
  for (const st of SKY_STARS) {
    const { alt, az } = altAz(st.ra, st.dec, d);
    if (alt <= 0) continue;
    const r = R * (90 - alt) / 90;
    out[st.id] = { x: -Math.sin(az * Math.PI / 180) * r, y: -Math.cos(az * Math.PI / 180) * r };
  }
  return out;
}

function initial(): { year: number; doy: number; tmin: number } {
  const now = skyDate();
  const h = now.getHours();
  const night = new Date(now);
  let tmin: number;
  if (h >= 18) tmin = (h - 18) * 60 + now.getMinutes();
  else if (h < 6) { tmin = (h + 6) * 60 + now.getMinutes(); night.setDate(night.getDate() - 1); }
  else tmin = 120;   // ひるまは 20時の 空
  const start = new Date(night.getFullYear(), 0, 1);
  const doy = Math.round((new Date(night.getFullYear(), night.getMonth(), night.getDate()).getTime() - start.getTime()) / 86400000);
  return { year: night.getFullYear(), doy, tmin: Math.round(tmin / 10) * 10 };
}

export function Planisphere() {
  const init = useMemo(initial, []);
  const [doy, setDoy] = useState(init.doy);
  const [tmin, setTmin] = useState(init.tmin);
  const [dir, setDir] = useState<Dir>('S');
  const [showAst, setShowAst] = useState(true);
  const [info, setInfo] = useState('');
  const [play, setPlay] = useState<null | { kind: 'day' | 'year'; step: number }>(null);
  const [trail, setTrail] = useState<Pos[]>([]);
  const [shown, setShown] = useState<null | { kind: 'day' | 'year'; step: number }>(null);   // おわっても のこす

  const date = dateOf(init.year, doy, tmin);
  const pos = useMemo(() => project(date), [init.year, doy, tmin]); // eslint-disable-line react-hooks/exhaustive-deps

  // ▶ 日周運動・年周運動
  useEffect(() => {
    if (!play) return;
    const t = window.setTimeout(() => {
      if (play.kind === 'day') {
        if (tmin + 60 > 720 || play.step >= 10) { setPlay(null); return; }
        setTrail((tr) => [...tr, pos]);
        setTmin(tmin + 60);
      } else {
        if (play.step >= 11) { setPlay(null); return; }
        setTrail((tr) => [...tr, pos]);
        setDoy((doy + 30) % 365);
      }
      setPlay({ ...play, step: play.step + 1 });
      setShown({ kind: play.kind, step: play.step + 1 });
    }, 700);
    return () => window.clearTimeout(t);
  }, [play, tmin, doy, pos]);

  const start = (kind: 'day' | 'year') => {
    setTrail([]);
    setInfo('');
    if (kind === 'day' && tmin > 360) setTmin(0);     // よるの はじめから
    setPlay({ kind, step: 0 });
    setShown(null);
  };
  const manual = (fn: () => void) => { setPlay(null); setShown(null); setTrail([]); fn(); };

  const rot = ROT[dir];
  const md = `${date.getMonth() + 1}がつ${date.getDate()}にち`;
  const hm = `${date.getHours()}じ${date.getMinutes() ? `${date.getMinutes()}ふん` : ''}`;
  const moved = shown && shown.step > 0
    ? shown.kind === 'day'
      ? `${shown.step}じかん たった → 星は ${shown.step * 15}° うごいた（1じかんで 15°）`
      : `${shown.step}かげつ たった（おなじ ${hm}）→ ${shown.step * 30}° うごいた（1かげつで 30°＝2じかん はやい 時こくと おなじ）`
    : '';

  const labelAt = (d: Dir) => {
    const p = { N: [0, -R - 13], E: [-R - 13, 0], S: [0, R + 13], W: [R + 13, 0] }[d];
    return (
      <text key={d} x={p[0]} y={p[1] + 5} fontSize="14" fontWeight="900" textAnchor="middle" fill={d === dir ? '#f59e0b' : '#c7d2fe'}
        transform={`rotate(${-rot} ${p[0]} ${p[1]})`}>{DIR_LABEL[d]}</text>
    );
  };

  return (
    <div>
      <div className="mb-1 text-[11px] font-bold leading-snug text-indigo-900/70">
        みたい ほういを <b>した</b> にして あたまの うえに かざすよ。ちずと ちがって <b>東と西が はんたい</b>。
      </div>
      <svg viewBox="0 0 300 300" className="w-full rounded-2xl bg-slate-900" style={{ maxHeight: 360 }}>
        <g transform={`translate(${C} ${C}) rotate(${rot})`}>
          <circle r={R} fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
          <circle r={R * 2 / 3} fill="none" stroke="#312e81" strokeDasharray="2 4" />
          <circle r={R / 3} fill="none" stroke="#312e81" strokeDasharray="2 4" />
          {/* 星の あと */}
          {trail.map((fr, k) => {
            const next = trail[k + 1] ?? pos;
            return (
              <g key={'t' + k} opacity="0.55">
                {SKY_STARS.filter((s) => s.mag < 2.6).map((s) => fr[s.id] && next[s.id] && (
                  <line key={s.id} x1={fr[s.id].x} y1={fr[s.id].y} x2={next[s.id].x} y2={next[s.id].y} stroke={STAR_COLOR[s.color].fill} strokeWidth="1.2" />
                ))}
              </g>
            );
          })}
          <g stroke="#818cf8" strokeWidth="0.8" opacity="0.45">
            {SKY_LINES.map(([a, b], i) => pos[a] && pos[b] && <line key={i} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} />)}
          </g>
          {showAst && ASTERISMS.map((a) => {
            const pts = a.stars.map((id) => pos[id]);
            if (pts.some((p) => !p)) return null;
            const list = a.closed ? [...pts, pts[0]] : pts;
            const cx = pts.reduce((t, p) => t + p!.x, 0) / pts.length;
            const cy = pts.reduce((t, p) => t + p!.y, 0) / pts.length;
            return (
              <g key={a.name}>
                <polyline points={list.map((p) => `${p!.x},${p!.y}`).join(' ')} fill="none" stroke={a.color} strokeWidth="1.4" strokeDasharray="4 3" opacity="0.85" />
                <text x={cx} y={cy} fontSize="8.5" fontWeight="900" fill={a.color} textAnchor="middle" transform={`rotate(${-rot} ${cx} ${cy})`}>{a.name}</text>
              </g>
            );
          })}
          {SKY_STARS.map((s) => {
            const p = pos[s.id];
            if (!p) return null;
            const r = starRadius(s.mag) * 0.75;
            return (
              <g key={s.id} transform={`translate(${p.x} ${p.y})`} style={{ cursor: 'pointer' }} onClick={() => setInfo(starInfo(s.id))}>
                <circle r="8" fill="transparent" />
                <circle r={r} fill={STAR_COLOR[s.color].fill} />
                {s.id === 'polaris' && <text y="-6" fontSize="8" fontWeight="900" fill="#fde68a" textAnchor="middle" transform={`rotate(${-rot})`}>北極星</text>}
              </g>
            );
          })}
          {(['N', 'E', 'S', 'W'] as Dir[]).map(labelAt)}
        </g>
      </svg>

      <div className="mt-1 text-center text-[13px] font-black text-ink">{md} {hm} の そら</div>
      {moved && <div className="mt-0.5 rounded-xl bg-amber-50 px-2 py-1 text-center text-[11px] font-black text-amber-800">{moved}</div>}
      {info && <div className="mt-1 rounded-xl bg-indigo-50 px-2 py-1.5 text-[11.5px] font-bold leading-snug text-indigo-900">{info}</div>}

      <div className="mt-2 flex items-center gap-2 text-[11px] font-black text-indigo-900">
        <span className="w-12 shrink-0">📅 ひづけ</span>
        <input type="range" min={0} max={364} value={doy} className="flex-1" onChange={(e) => manual(() => setDoy(Number(e.target.value)))} />
      </div>
      <div className="mt-1 flex items-center gap-2 text-[11px] font-black text-indigo-900">
        <span className="w-12 shrink-0">🕗 じこく</span>
        <input type="range" min={0} max={720} step={10} value={tmin} className="flex-1" onChange={(e) => manual(() => setTmin(Number(e.target.value)))} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-black text-indigo-900">みる ほうい：</span>
        {(['N', 'E', 'S', 'W'] as Dir[]).map((d) => (
          <button key={d} className={`rounded-full px-3 py-1 text-[12px] font-black ${dir === d ? 'bg-amber-400 text-white' : 'bg-white text-ink shadow'}`} onClick={() => setDir(d)}>
            {DIR_LABEL[d]}
          </button>
        ))}
        <button className="ml-auto rounded-full bg-white px-3 py-1 text-[11px] font-black text-ink shadow" onClick={() => manual(() => { setDoy(init.doy); setTmin(init.tmin); })}>いま</button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button className="rounded-xl bg-indigo-600 px-2 py-2 text-[12px] font-black text-white shadow active:scale-95" onClick={() => start('day')}>▶ 1ばんの うごき</button>
        <button className="rounded-xl bg-violet-600 px-2 py-2 text-[12px] font-black text-white shadow active:scale-95" onClick={() => start('year')}>▶ 1ねんの うごき</button>
      </div>
      <label className="mt-2 flex items-center gap-1.5 text-[11px] font-black text-indigo-900">
        <input type="checkbox" checked={showAst} onChange={(e) => setShowAst(e.target.checked)} />
        大三角・大四辺形・大六角形を だす
      </label>
      <div className="mt-1 text-[10.5px] font-bold leading-snug text-indigo-900/55">
        北の空の 星は 北極星を まんなかに 反時計回り、南の空の 星は 東から 西へ。星を タップすると 名前・色・温度が わかるよ。
        金星や 火星などの わくせいは のっていないよ（うごきが ふくざつだから）。
      </div>
    </div>
  );
}
