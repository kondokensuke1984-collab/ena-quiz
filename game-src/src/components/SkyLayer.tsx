import React, { useEffect, useMemo, useState } from 'react';
import { ISLAND_H, ISLAND_W } from '../lib/island';
import { moonLitPath, type TimeOfDay, type Weather } from '../lib/sky';
import { altAz, ASTERISMS, SKY_LINES, SKY_STARS, skyDate, STAR_COLOR } from '../lib/starsky';

// 島の上に重ねる「空」：夕方・夜の色、星、その日の本当の形の月、雨・くもり・にじ、流れ星、夜のあかり。
// タップを拾うのは 月・流れ星・明るい星 だけ（ほかは pointer-events:none で島のタップを邪魔しない）。
// 星は ほんもの：いまの日時に 南の空（東が左・西が右）に 見える星を lib/starsky で 計算して かく。

export const MOON_POS = { x: 0.6, y: 0.085 };   // 割合

interface Props {
  tod: TimeOfDay;
  weather: Weather;
  moonAge: number;
  glows: { x: number; y: number; r: number }[];   // 夜に光るところ（窓・ランプ）。割合
  onMoon(): void;
  onStar(): void;
  skyTime: number;                 // 1分ごとに かわる（星を うごかす）
  onStarTap(id: string): void;
}

// 暗い かざりの 星（明るい星の あいだを うめる）
const DIM = Array.from({ length: 16 }, (_, i) => [((i * 283 + 71) % 1000), 12 + ((i * 97) % 210)]);

// 南の空の 帯：方位 70°〜290°（東が左・西が右）を よこ、高度 3°〜80° を たて に
const AZ0 = 70, AZ1 = 290, ALT0 = 3, ALT1 = 80;
function toStrip(alt: number, az: number): { x: number; y: number } | null {
  if (alt < ALT0 || az < AZ0 || az > AZ1) return null;
  return { x: ((az - AZ0) / (AZ1 - AZ0)) * ISLAND_W, y: 235 - (Math.min(alt, ALT1) - ALT0) / (ALT1 - ALT0) * 225 };
}
export function starRadius(mag: number): number {
  return Math.max(1.2, 3.8 - mag * 0.9);
}

function SkyLayerBase({ tod, weather, moonAge, glows, onMoon, onStar, skyTime, onStarTap }: Props) {
  const night = tod === 'night';
  const pos = useMemo(() => {
    const d = skyDate();
    const out: Record<string, { x: number; y: number }> = {};
    for (const st of SKY_STARS) {
      const { alt, az } = altAz(st.ra, st.dec, d);
      const p = toStrip(alt, az);
      if (p) out[st.id] = p;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skyTime]);
  // 流れ星：夜に 20〜40秒おきに1回
  const [star, setStar] = useState<{ key: number; x: number } | null>(null);
  useEffect(() => {
    if (!night) return;
    let t = 0;
    const plan = () => {
      t = window.setTimeout(() => {
        setStar({ key: Date.now(), x: 200 + Math.random() * 600 });
        window.setTimeout(() => setStar(null), 2400);
        plan();
      }, 20000 + Math.random() * 20000);
    };
    // はじめの1回は すこし早めに
    t = window.setTimeout(() => {
      setStar({ key: Date.now(), x: 300 + Math.random() * 400 });
      window.setTimeout(() => setStar(null), 2400);
      plan();
    }, 5000);
    return () => window.clearTimeout(t);
  }, [night]);

  const mx = MOON_POS.x * ISLAND_W;
  const my = MOON_POS.y * ISLAND_H;

  return (
    <g>
      {/* 時間帯の色 */}
      {tod === 'evening' && <rect x="0" y="0" width={ISLAND_W} height={ISLAND_H} fill="rgba(251,146,60,0.18)" pointerEvents="none" />}
      {night && <rect x="0" y="0" width={ISLAND_W} height={ISLAND_H} fill="rgba(15,23,72,0.5)" pointerEvents="none" />}

      {/* くもり・雨は すこし灰色に */}
      {(weather === 'cloudy' || weather === 'rain') && (
        <rect x="0" y="0" width={ISLAND_W} height={ISLAND_H} fill="rgba(100,116,139,0.16)" pointerEvents="none" />
      )}

      {/* 夜の星 */}
      {night && weather !== 'rain' && (
        <g>
          {DIM.map(([x, y], i) => <circle key={'d' + i} cx={x} cy={y} r="0.9" fill="#e0e7ff" opacity="0.5" pointerEvents="none" />)}
          {/* 星座の 線（うすく）と 大三角など（うすい 点線） */}
          <g pointerEvents="none" stroke="#a5b4fc" strokeWidth="1" opacity="0.3">
            {SKY_LINES.map(([a, b], i) => pos[a] && pos[b] && <line key={'l' + i} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} />)}
          </g>
          <g pointerEvents="none" strokeWidth="1.2" strokeDasharray="4 5" opacity="0.4" fill="none">
            {ASTERISMS.filter((a) => a.closed).map((a) => {
              const pts = a.stars.map((id) => pos[id]);
              if (pts.some((p) => !p)) return null;
              return <polygon key={a.name} points={pts.map((p) => `${p!.x},${p!.y}`).join(' ')} stroke={a.color} />;
            })}
          </g>
          {SKY_STARS.map((st, i) => {
            const p = pos[st.id];
            if (!p) return null;
            const r = starRadius(st.mag);
            const fill = STAR_COLOR[st.color].fill;
            const tappable = st.mag < 2.3;
            return (
              <g key={st.id} transform={`translate(${p.x} ${p.y})`}
                pointerEvents={tappable ? undefined : 'none'}
                style={tappable ? { cursor: 'pointer' } : undefined}
                onPointerDown={tappable ? (e) => { e.stopPropagation(); onStarTap(st.id); } : undefined}>
                {tappable && <circle r="16" fill="transparent" />}
                {st.mag < 1.5 && <circle r={r * 2.4} fill={fill} opacity="0.18" />}
                <circle r={r} fill={fill} className="twinkle" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
              </g>
            );
          })}
        </g>
      )}

      {/* 夜のあかり（窓・ランプ）。暗い膜の上に あたたかい光を重ねる */}
      {night && glows.map((g, i) => (
        <circle key={'g' + i} cx={g.x * ISLAND_W} cy={g.y * ISLAND_H} r={g.r} fill="url(#warmGlow)" pointerEvents="none" />
      ))}
      <defs>
        <radialGradient id="warmGlow">
          <stop offset="0%" stopColor="rgba(253,224,71,0.55)" />
          <stop offset="100%" stopColor="rgba(253,224,71,0)" />
        </radialGradient>
      </defs>

      {/* 月（夜・夕方）。その日の月齢の形。タップで名前を教える */}
      {tod !== 'day' && weather !== 'rain' && (
        <g transform={`translate(${mx} ${my})`} style={{ cursor: 'pointer' }} onPointerDown={(e) => { e.stopPropagation(); onMoon(); }}>
          <circle r="34" fill="transparent" />
          <circle r="22" fill="rgba(30,41,59,0.55)" />
          <path d={moonLitPath(moonAge, 22)} fill="#fef08a" />
          <circle r="22" fill="none" stroke="rgba(254,240,138,0.5)" strokeWidth="1.5" />
        </g>
      )}

      {/* くも */}
      {(weather === 'cloudy' || weather === 'rain') && [[120, 60], [520, 40], [820, 80]].map(([x, y], i) => (
        <g key={'c' + i} className="cloud-drift" style={{ animationDelay: `${i * -7}s` }} pointerEvents="none">
          <ellipse cx={x} cy={y} rx="60" ry="20" fill={weather === 'rain' ? '#94a3b8' : '#e2e8f0'} />
          <ellipse cx={x + 30} cy={y - 14} rx="36" ry="18" fill={weather === 'rain' ? '#94a3b8' : '#f1f5f9'} />
        </g>
      ))}

      {/* 雨つぶ */}
      {weather === 'rain' && (
        <g className="rain-fall" pointerEvents="none">
          {Array.from({ length: 60 }, (_, i) => {
            const x = (i * 157) % 1000;
            const y = (i * 71) % ISLAND_H;
            return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 22} stroke="rgba(191,219,254,0.8)" strokeWidth="2.5" strokeLinecap="round" />;
          })}
        </g>
      )}

      {/* にじ（昼だけ） */}
      {weather === 'rainbow' && tod !== 'night' && (
        <g opacity="0.55" pointerEvents="none">
          {['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6'].map((c, i) => (
            <path key={c} d={`M${140 + i * 10} 250 A ${360 - i * 10} ${230 - i * 10} 0 0 1 ${860 - i * 10} 250`} fill="none" stroke={c} strokeWidth="9" />
          ))}
        </g>
      )}

      {/* 流れ星（タップで ねがいごと） */}
      {star && (
        <g key={star.key} className="shooting-star" onPointerDown={(e) => { e.stopPropagation(); onStar(); }} style={{ cursor: 'pointer' }}>
          <line x1={star.x} y1="30" x2={star.x - 90} y2="-10" stroke="rgba(254,249,195,0.9)" strokeWidth="4" strokeLinecap="round" />
          <circle cx={star.x} cy="30" r="6" fill="#fef9c3" />
          <circle cx={star.x} cy="30" r="40" fill="transparent" />
        </g>
      )}
    </g>
  );
}

export const SkyLayer = React.memo(SkyLayerBase);
