import type { Build } from '../lib/snowman';

// ゆきだるまの え。えらんだ ぶひんだけ かさねて かく（まだ えらんで いない ところは かかない）。

const INK = '#334155';
const S = { stroke: INK, strokeWidth: 1.6 } as const;
const SCARF: Record<string, string> = { red: '#ef4444', blue: '#3b82f6', green: '#22c55e', stripe: '#f8fafc' };

export function SnowmanSVG({ build, size = 120, dim = false }: { build: Partial<Build>; size?: number; dim?: boolean }) {
  const { hat, nose, scarf, arms } = build;
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} style={dim ? { filter: 'grayscale(1)', opacity: 0.35 } : undefined}>
      <ellipse cx="50" cy="114" rx="30" ry="5" fill="rgba(0,0,0,0.15)" />
      {/* うで（からだの うしろ） */}
      {arms === 'branch' && (
        <g stroke="#78350f" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M30 72 L10 58 M16 62 L12 54 M70 72 L90 58 M84 62 L88 54" />
        </g>
      )}
      {arms === 'glove' && (
        <g>
          <path d="M30 72 L14 62 M70 72 L86 62" stroke="#78350f" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="12" cy="60" r="6" fill="#ef4444" {...S} />
          <circle cx="88" cy="60" r="6" fill="#ef4444" {...S} />
        </g>
      )}
      {arms === 'broom' && (
        <g>
          <path d="M30 72 L14 64 M70 72 L84 50" stroke="#78350f" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M84 50 L84 18" stroke="#a16207" strokeWidth="3" strokeLinecap="round" />
          <path d="M78 18 L90 18 L94 6 L74 6 Z" fill="#facc15" {...S} />
        </g>
      )}
      {arms === 'flag' && (
        <g>
          <path d="M30 72 L14 64 M70 72 L84 52" stroke="#78350f" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M84 52 L84 22" stroke="#64748b" strokeWidth="2" />
          <path d="M84 22 L100 27 L84 33 Z" fill="#ef4444" {...S} />
        </g>
      )}
      {/* からだ */}
      <circle cx="50" cy="86" r="26" fill="#f8fafc" {...S} />
      <circle cx="50" cy="48" r="18" fill="#f8fafc" {...S} />
      {[78, 90].map((y) => <circle key={y} cx="50" cy={y} r="2.2" fill={INK} />)}
      {/* め・くち */}
      <circle cx="43" cy="44" r="2.2" fill={INK} />
      <circle cx="57" cy="44" r="2.2" fill={INK} />
      <path d="M43 56 Q50 60 57 56" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="40" cy="52" r="2.6" fill="#fda4af" opacity="0.7" />
      <circle cx="60" cy="52" r="2.6" fill="#fda4af" opacity="0.7" />
      {/* はな */}
      {nose === 'carrot' && <path d="M50 48 L64 51 L50 53 Z" fill="#f97316" {...S} strokeWidth={1.2} />}
      {nose === 'button' && <g><circle cx="50" cy="50" r="3.6" fill="#1e293b" /><circle cx="49" cy="49" r="0.8" fill="#fff" /><circle cx="51" cy="51" r="0.8" fill="#fff" /></g>}
      {nose === 'pine' && <ellipse cx="50" cy="50" rx="3.4" ry="4.4" fill="#92400e" {...S} strokeWidth={1.2} />}
      {nose === 'cherry' && <g><path d="M50 46 Q52 42 55 41" fill="none" stroke="#15803d" strokeWidth="1.2" /><circle cx="50" cy="50" r="3.6" fill="#dc2626" {...S} strokeWidth={1.2} /></g>}
      {/* マフラー */}
      {scarf && (
        <g>
          <path d="M31 62 Q50 72 69 62 L69 68 Q50 78 31 68 Z" fill={SCARF[scarf]} {...S} />
          <path d="M58 68 L62 88 L54 88 L52 70 Z" fill={SCARF[scarf]} {...S} />
          {scarf === 'stripe' && (
            <g fill="#ef4444">
              <rect x="38" y="65" width="4" height="7" />
              <rect x="48" y="67" width="4" height="7" />
              <rect x="57" y="65" width="4" height="7" />
              <rect x="54" y="78" width="7" height="3" />
            </g>
          )}
        </g>
      )}
      {/* ぼうし */}
      {hat === 'bucket' && <path d="M36 34 L40 16 L60 16 L64 34 Z" fill="#94a3b8" {...S} />}
      {hat === 'knit' && (
        <g>
          <path d="M33 36 Q34 16 50 16 Q66 16 67 36 Z" fill="#8b5cf6" {...S} />
          <rect x="32" y="32" width="36" height="6" rx="3" fill="#c4b5fd" {...S} />
          <circle cx="50" cy="14" r="4" fill="#f8fafc" {...S} />
        </g>
      )}
      {hat === 'silk' && (
        <g>
          <rect x="28" y="32" width="44" height="4" rx="2" fill="#1e293b" {...S} />
          <rect x="37" y="10" width="26" height="23" fill="#1e293b" {...S} />
          <rect x="37" y="26" width="26" height="4" fill="#ef4444" />
        </g>
      )}
      {hat === 'santa' && (
        <g>
          <path d="M34 34 Q44 6 66 18 L64 34 Z" fill="#ef4444" {...S} />
          <rect x="32" y="31" width="36" height="6" rx="3" fill="#f8fafc" {...S} />
          <circle cx="67" cy="19" r="4" fill="#f8fafc" {...S} />
        </g>
      )}
      {hat === 'crown' && (
        <g>
          <path d="M36 34 L36 18 L43 26 L50 14 L57 26 L64 18 L64 34 Z" fill="#facc15" {...S} />
          <circle cx="50" cy="29" r="2.4" fill="#ef4444" />
          <circle cx="42" cy="30" r="1.8" fill="#3b82f6" />
          <circle cx="58" cy="30" r="1.8" fill="#22c55e" />
        </g>
      )}
    </svg>
  );
}
