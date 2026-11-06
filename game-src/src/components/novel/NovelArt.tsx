import type { ReactNode } from 'react';
import { KidSVG } from '../KidSVG';

// よみものの さしえ。はいけいは SVG、あんりは いつもの KidSVG を かさねる。ナギ・ゲンじい・ぽんたは 物語の 場面に あわせて ここで 描く。

const W = 320, H = 200;

/** カワウソの ナギ（あおい マフラー） */
function Nagi({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M14 -6 Q34 -4 32 -24 Q26 -12 12 -16Z" fill="#7c4a26" />
      <ellipse cx="0" cy="-16" rx="15" ry="19" fill="#92582e" />
      <ellipse cx="0" cy="-12" rx="9" ry="13" fill="#e7c9a0" />
      <ellipse cx="-8" cy="-1" rx="6" ry="3.5" fill="#6d3f1f" />
      <ellipse cx="8" cy="-1" rx="6" ry="3.5" fill="#6d3f1f" />
      <circle cx="-13" cy="-48" r="4.5" fill="#7c4a26" />
      <circle cx="13" cy="-48" r="4.5" fill="#7c4a26" />
      <circle cx="0" cy="-41" r="15" fill="#92582e" />
      <ellipse cx="0" cy="-36" rx="10" ry="8" fill="#e7c9a0" />
      <circle cx="-5.5" cy="-43" r="2.2" fill="#1f2937" />
      <circle cx="5.5" cy="-43" r="2.2" fill="#1f2937" />
      <ellipse cx="0" cy="-38.5" rx="2.6" ry="1.9" fill="#1f2937" />
      <path d="M-3 -34 Q0 -32 3 -34" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M-13 -28 Q0 -23 13 -28 L13 -23 Q0 -18 -13 -23Z" fill="#2563eb" />
      <rect x="4" y="-23" width="6" height="11" rx="1.5" fill="#1d4ed8" />
    </g>
  );
}

/** たぬきの ぽんた（めのまわりが こい・しましまの しっぽ） */
function Ponta({ x, y, s = 1, flip = false, children }: { x: number; y: number; s?: number; flip?: boolean; children?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M12 -8 Q34 -8 30 -28 Q22 -18 10 -18Z" fill="#a16207" />
      <path d="M24 -13 L30 -18 M20 -10 L26 -14" stroke="#422006" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="0" cy="-15" rx="16" ry="17" fill="#b7791f" />
      <ellipse cx="0" cy="-12" rx="10" ry="11" fill="#fef3c7" />
      <ellipse cx="-8" cy="-1" rx="6.5" ry="3.5" fill="#422006" />
      <ellipse cx="8" cy="-1" rx="6.5" ry="3.5" fill="#422006" />
      <circle cx="-13" cy="-49" r="5.5" fill="#92400e" />
      <circle cx="13" cy="-49" r="5.5" fill="#92400e" />
      <circle cx="0" cy="-41" r="16.5" fill="#b7791f" />
      <ellipse cx="-6.5" cy="-42" rx="6" ry="5" fill="#422006" />
      <ellipse cx="6.5" cy="-42" rx="6" ry="5" fill="#422006" />
      <circle cx="-6" cy="-42.5" r="2.3" fill="#fff" />
      <circle cx="6" cy="-42.5" r="2.3" fill="#fff" />
      <ellipse cx="0" cy="-34" rx="6.5" ry="5" fill="#fef3c7" />
      <ellipse cx="0" cy="-36" rx="2.4" ry="1.7" fill="#1f2937" />
      <path d="M-2.5 -32.5 Q0 -30.5 2.5 -32.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {children}
    </g>
  );
}

/** カメの ゲンじい（ねている・しろい まゆ） */
function GenjiiInBed({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-60" y="-6" width="124" height="24" rx="5" fill="#92400e" />
      <rect x="-56" y="-16" width="116" height="22" rx="8" fill="#fef3c7" />
      <path d="M-20 -18 Q24 -36 60 -16 L60 6 L-20 6Z" fill="#3b82f6" />
      <path d="M-20 -18 Q24 -36 60 -16" stroke="#1d4ed8" strokeWidth="2" fill="none" />
      <rect x="-58" y="-24" width="36" height="16" rx="7" fill="#fff" />
      <ellipse cx="-40" cy="-29" rx="15" ry="13" fill="#6b9f5b" />
      <circle cx="-46" cy="-32" r="1.9" fill="#1f2937" />
      <circle cx="-35" cy="-32" r="1.9" fill="#1f2937" />
      <path d="M-50 -37 q4 -3 8 0 M-39 -37 q4 -3 8 0" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M-44 -24 Q-40 -22 -36 -24" stroke="#1f2937" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Lighthouse({ x, y, s = 1, beam, night = true, off = false }: { x: number; y: number; s?: number; beam?: 'left' | 'right'; night?: boolean; off?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {beam && (
        <path d={beam === 'left' ? 'M-6 -92 L-190 -128 L-190 -58Z' : 'M6 -92 L190 -128 L190 -58Z'} fill="#fde68a" opacity=".55" />
      )}
      <path d="M-15 0 L-10 -80 L10 -80 L15 0Z" fill="#fff" />
      <path d="M-13.8 -20 L-12.5 -40 L12.5 -40 L13.8 -20Z" fill="#dc2626" />
      <path d="M-11.3 -60 L-10 -80 L10 -80 L11.3 -60Z" fill="#dc2626" />
      <rect x="-13" y="-84" width="26" height="4" fill="#374151" />
      <rect x="-8" y="-100" width="16" height="16" fill={off ? '#334155' : night ? '#fde047' : '#bae6fd'} stroke="#374151" strokeWidth="1.5" />
      <path d="M-11 -100 L0 -110 L11 -100Z" fill="#374151" />
      <rect x="-4.5" y="-14" width="9" height="14" rx="4" fill="#78350f" />
    </g>
  );
}

function Stars() {
  return (
    <g fill="#fff">
      {[[24, 22], [64, 42], [108, 18], [150, 36], [194, 16], [232, 44], [272, 24], [300, 52], [42, 66], [130, 58]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} opacity={i % 2 ? 0.75 : 1} />
      ))}
    </g>
  );
}

function Anri({ left, bottom, size, flip, dir, magnifier }: { left: number; bottom: number; size: number; flip?: boolean; dir?: 'down' | 'up' | 'side'; magnifier?: boolean }) {
  return (
    <div className="absolute" style={{ left: `${left}%`, bottom: `${bottom}%`, width: `${size}%` }}>
      <KidSVG who="anri" size={Math.round((size / 100) * 400)} flip={flip} dir={dir} magnifier={magnifier} />
    </div>
  );
}

function Scene({ svg, children, label }: { svg: ReactNode; children?: ReactNode; label: string }) {
  return (
    <div className="relative my-3 w-full overflow-hidden rounded-2xl shadow" role="img" aria-label={label} style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">{svg}</svg>
      {children}
    </div>
  );
}

const NIGHT = <defs><linearGradient id="nvNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0f172a" /><stop offset="1" stopColor="#1e3a8a" /></linearGradient></defs>;

export function NovelArt({ id }: { id: string }) {
  switch (id) {
    case 'wago11_cover':
      return (
        <Scene label="よるの うみと とうだい。おかの うえに あんりが たっている" svg={<>
          {NIGHT}
          <rect width={W} height={H} fill="url(#nvNight)" />
          <Stars />
          <circle cx="268" cy="38" r="15" fill="#fef3c7" />
          <circle cx="262" cy="34" r="13" fill="#111c44" />
          <rect y="146" width={W} height="54" fill="#172554" />
          <path d="M0 158 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity=".6" />
          <path d="M150 200 Q190 124 250 132 Q300 138 320 160 L320 200Z" fill="#14532d" />
          <Lighthouse x={236} y={136} beam="left" />
        </>}>
          <Anri left={58} bottom={2} size={20} dir="side" flip />
        </Scene>
      );
    case 'wago11_window':
      return (
        <Scene label="よる、へやの まどから とうだいの ひかりを みて ノートに かく あんり" svg={<>
          <rect width={W} height={H} fill="#fde7c7" />
          <rect x="130" y="22" width="166" height="120" rx="6" fill="#92400e" />
          {NIGHT}
          <rect x="138" y="30" width="150" height="104" fill="url(#nvNight)" />
          <g clipPath="url(#nvW)">
            <clipPath id="nvW"><rect x="138" y="30" width="150" height="104" /></clipPath>
            <circle cx="160" cy="48" r="1.2" fill="#fff" /><circle cx="196" cy="42" r="1" fill="#fff" /><circle cx="272" cy="54" r="1.3" fill="#fff" />
            <rect x="138" y="116" width="150" height="18" fill="#172554" />
            <Lighthouse x={236} y={120} s={0.72} beam="left" />
          </g>
          <rect x="211" y="30" width="4" height="104" fill="#92400e" />
          <rect x="138" y="80" width="150" height="4" fill="#92400e" />
          <rect y="150" width={W} height="50" fill="#a16207" />
          <rect x="146" y="142" width="150" height="10" rx="2" fill="#78350f" />
          <rect x="160" y="130" width="46" height="13" rx="2" fill="#fff" stroke="#94a3b8" />
          <path d="M183 130 v13 M166 134 h13 M166 138 h13 M187 134 h13" stroke="#64748b" strokeWidth="1" />
        </>}>
          <Anri left={8} bottom={6} size={28} dir="side" />
        </Scene>
      );
    case 'wago11_door':
      return (
        <Scene label="とうだいの とびらの まえ。かみに てを のばす カワウソの ナギと、ゆびを さす ぽんた、みまもる あんり" svg={<>
          <rect width={W} height={H} fill="#bae6fd" />
          <circle cx="42" cy="36" r="18" fill="#fef08a" />
          <rect y="150" width={W} height="50" fill="#86efac" />
          <path d="M214 150 L224 0 L304 0 L314 150Z" fill="#fff" />
          <path d="M218 96 L221 46 L307 46 L310 96Z" fill="#fecaca" />
          <rect x="240" y="82" width="48" height="68" rx="20" fill="#78350f" />
          <rect x="250" y="100" width="28" height="20" fill="#fffbeb" stroke="#a8a29e" transform="rotate(-3 264 110)" />
          <path d="M254 106 h20 M254 111 h20 M254 116 h13" stroke="#334155" strokeWidth="1.5" />
          <Nagi x={228} y={166} s={1.05} flip />
          <Ponta x={140} y={178} s={1.05}>
            <path d="M-15 -22 L-34 -30" stroke="#b7791f" strokeWidth="6" strokeLinecap="round" transform="scale(-1 1)" />
          </Ponta>
        </>}>
          <Anri left={4} bottom={3} size={22} />
        </Scene>
      );
    case 'wago11_follow':
      return (
        <Scene label="ゆうがたの もり。パンの ふくろを もつ ナギの あとを、はなうたの あんりと、はっぱを あたまに のせた ぽんたが つける" svg={<>
          <defs><linearGradient id="nvDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fb923c" /><stop offset="1" stopColor="#fde68a" /></linearGradient></defs>
          <rect width={W} height={H} fill="url(#nvDusk)" />
          <rect y="146" width={W} height="54" fill="#65a30d" />
          {[[34, 146, 30], [116, 142, 36], [216, 148, 28], [296, 144, 34]].map(([x, y, r], i) => (
            <g key={i}><rect x={x - 5} y={y - 44} width="10" height="46" fill="#713f12" /><circle cx={x} cy={y - 60} r={r} fill={i % 2 ? '#166534' : '#15803d'} /></g>
          ))}
          <path d="M0 176 Q160 150 320 176 L320 196 Q160 168 0 196Z" fill="#d6b58a" />
          <Nagi x={270} y={172} s={0.9} />
          <g transform="translate(252 150)">
            <path d="M-11 -9 L11 -9 L14 13 L-14 13Z" fill="#f5e0b8" stroke="#a16207" strokeWidth="1" />
            <ellipse cx="-3" cy="-11" rx="7" ry="4" fill="#d97706" />
          </g>
          <g fill="#7c2d12" fontSize="13" fontWeight="bold"><text x="24" y="78">♪</text><text x="42" y="64">♫</text></g>
          <Ponta x={134} y={178} s={1}>
            <path d="M-26 -55 Q0 -82 26 -55 Q0 -47 -26 -55Z" fill="#16a34a" stroke="#14532d" strokeWidth="1.2" />
            <path d="M-23 -55 H23" stroke="#14532d" strokeWidth="1.2" />
          </Ponta>
        </>}>
          <Anri left={3} bottom={6} size={22} dir="side" />
        </Scene>
      );
    case 'wago11_hut':
      return (
        <Scene label="やまごやの なか。ねている カメの ゲンじいに、ナギが スープを はこび、あんりが ノートを ひらく" svg={<>
          <rect width={W} height={H} fill="#78350f" />
          {[28, 62, 96, 130].map((y) => <path key={y} d={`M0 ${y} H${W}`} stroke="#5b2a0c" strokeWidth="2" />)}
          <rect y="150" width={W} height="50" fill="#a16207" />
          <rect x="222" y="26" width="72" height="56" fill="#172554" stroke="#451a03" strokeWidth="4" />
          <path d="M258 26 v56 M222 54 h72" stroke="#451a03" strokeWidth="3" />
          <circle cx="240" cy="42" r="1.2" fill="#fff" /><circle cx="278" cy="40" r="1" fill="#fff" />
          <g transform="translate(64 20)">
            <path d="M0 0 V14" stroke="#1f2937" strokeWidth="1.5" />
            <circle cx="0" cy="24" r="26" fill="#fde047" opacity=".25" />
            <path d="M-8 14 H8 L10 32 H-10Z" fill="#fef08a" stroke="#1f2937" strokeWidth="1.2" />
          </g>
          <GenjiiInBed x={128} y={150} />
          <Nagi x={238} y={174} s={1} flip />
          <g transform="translate(205 142)">
            <path d="M-11 -4 H11 L8 8 H-8Z" fill="#fff" stroke="#64748b" />
            <ellipse cx="0" cy="-4" rx="11" ry="3" fill="#fbbf24" />
            <path d="M-3 -10 q2 -3 0 -6 M3 -10 q2 -3 0 -6" stroke="#fff" strokeWidth="1.2" fill="none" />
          </g>
        </>}>
          <Anri left={2} bottom={2} size={20} magnifier />
        </Scene>
      );
    case 'wago11_storm':
      return (
        <Scene label="あらしの うみ。くらい とうだいと、おきの ふね" svg={<>
          <rect width={W} height={H} fill="#1e293b" />
          <path d="M0 0 H320 V54 Q280 40 240 54 T160 52 T80 54 T0 48Z" fill="#0f172a" />
          <path d="M92 8 L78 44 H92 L76 80" stroke="#fde047" strokeWidth="3" fill="none" strokeLinejoin="round" />
          <g stroke="#94a3b8" strokeWidth="1.2" opacity=".7">
            {Array.from({ length: 28 }).map((_, i) => {
              const x = (i * 37) % 320, y = 12 + (i * 53) % 170;
              return <path key={i} d={`M${x} ${y} l-7 15`} />;
            })}
          </g>
          <path d="M0 140 Q30 118 62 138 T124 136 T188 140 T252 134 T320 140 V200 H0Z" fill="#1d4ed8" />
          <path d="M0 160 Q40 142 78 160 T158 158 T238 160 T320 156 V200 H0Z" fill="#1e40af" />
          <g transform="translate(66 134) rotate(-9)">
            <path d="M-26 0 H26 L18 14 H-18Z" fill="#fff" />
            <rect x="-13" y="-13" width="26" height="13" fill="#fecaca" />
            <rect x="-3" y="-23" width="6" height="11" fill="#475569" />
            <circle cx="-6" cy="-6" r="2.2" fill="#fde047" /><circle cx="6" cy="-6" r="2.2" fill="#fde047" />
          </g>
          <path d="M180 200 Q210 136 262 136 Q300 136 320 152 V200Z" fill="#14532d" />
          <g opacity=".85"><Lighthouse x={256} y={140} s={1.1} off /></g>
        </>} />
      );
    case 'wago11_morning':
      return (
        <Scene label="あらしの つぎの あさ。とうだいの まえで ぽんたが ナギに やきいもを わたし、あんりが みまもる" svg={<>
          <rect width={W} height={H} fill="#7dd3fc" />
          <circle cx="50" cy="38" r="20" fill="#fde047" />
          <ellipse cx="136" cy="44" rx="28" ry="10" fill="#fff" />
          <ellipse cx="164" cy="36" rx="22" ry="10" fill="#fff" />
          <rect y="150" width={W} height="50" fill="#4ade80" />
          <Lighthouse x={270} y={154} s={1.25} night={false} />
          <g fill="#fff" stroke="#94a3b8" strokeWidth=".6">
            <rect x="257" y="108" width="11" height="9" transform="rotate(-6 262 112)" />
            <rect x="271" y="106" width="11" height="9" transform="rotate(5 276 110)" />
          </g>
          <Nagi x={214} y={178} s={1.1} flip />
          <Ponta x={140} y={182} s={1.1}>
            <path d="M15 -24 L33 -28" stroke="#b7791f" strokeWidth="6" strokeLinecap="round" />
          </Ponta>
          <g transform="translate(183 150) rotate(-14)">
            <ellipse cx="0" cy="0" rx="14" ry="6.5" fill="#9f1239" />
            <ellipse cx="7" cy="0" rx="7" ry="5.5" fill="#fde047" />
          </g>
        </>}>
          <Anri left={3} bottom={4} size={22} />
        </Scene>
      );
    default:
      return null;
  }
}
