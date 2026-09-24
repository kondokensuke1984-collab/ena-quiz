import React, { useEffect, useState } from 'react';
import { ISLAND_H, ISLAND_W } from '../lib/island';
import { moonLitPath, type TimeOfDay, type Weather } from '../lib/sky';

// 島の上に重ねる「空」：夕方・夜の色、星、その日の本当の形の月、雨・くもり・にじ、流れ星、夜のあかり。
// タップを拾うのは 月 と 流れ星 だけ（ほかは pointer-events:none で島のタップを邪魔しない）。

export const MOON_POS = { x: 0.6, y: 0.085 };   // 割合

interface Props {
  tod: TimeOfDay;
  weather: Weather;
  moonAge: number;
  glows: { x: number; y: number; r: number }[];   // 夜に光るところ（窓・ランプ）。割合
  onMoon(): void;
  onStar(): void;
}

const STARS = Array.from({ length: 34 }, (_, i) => [((i * 283) % 1000), 8 + ((i * 97) % 150), 1 + (i % 3)]);

function SkyLayerBase({ tod, weather, moonAge, glows, onMoon, onStar }: Props) {
  const night = tod === 'night';
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
      {night && weather !== 'rain' && STARS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fef9c3" className="twinkle" style={{ animationDelay: `${(i % 7) * 0.4}s` }} pointerEvents="none" />
      ))}

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
