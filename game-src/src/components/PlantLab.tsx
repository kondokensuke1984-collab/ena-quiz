import { useState, type ReactElement } from 'react';
import type { PlantDef } from '../lib/plants';

// しらべる：たねの だんめん（＋ヨウ素液）と、はなの 4つの つくり
const INK = '#4c1d95';

function Label({ x, y, tx, ty, text }: { x: number; y: number; tx: number; ty: number; text: string }) {
  return (
    <g>
      <line x1={x} y1={y} x2={tx} y2={ty} stroke="#334155" strokeWidth="1" />
      <text x={tx + (tx >= x ? 3 : -3)} y={ty + 4} fontSize="11" fontWeight="900" fill="#1e1b4b" textAnchor={tx >= x ? 'start' : 'end'}>{text}</text>
    </g>
  );
}

/** ヨウ素液を たらしたときの 色 */
function starchColor(base: string, iodine: boolean, level: 0 | 1 | 2): string {
  if (!iodine) return base;
  return level === 2 ? '#4c1d95' : level === 1 ? '#8b5cf6' : '#b45309';
}

export function SeedCut({ p }: { p: PlantDef }) {
  const [iodine, setIodine] = useState(false);
  let body: ReactElement;
  let note: string;
  if (p.type === 'tuber') {
    body = (
      <g>
        <ellipse cx="120" cy="80" rx="70" ry="45" fill={p.seed === 'sd_imo' ? '#be185d' : '#a16207'} stroke={INK} strokeWidth="2" />
        <ellipse cx="120" cy="80" rx="62" ry="38" fill={starchColor('#fef3c7', iodine, p.starch)} />
        {p.seed === 'sd_potato' && [[70, 60], [160, 58], [120, 118]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4" fill="#78350f" />)}
        <Label x={70} y={58} tx={30} ty={30} text={p.seed === 'sd_potato' ? 'め（くぼみ）' : 'かわ'} />
        <Label x={130} y={80} tx={190} ty={40} text={p.seed === 'sd_potato' ? 'くきが へんか' : '根が へんか'} />
      </g>
    );
    note = `いもを 切った ところ。${p.grows}。`;
  } else if (p.type === 'bulb') {
    body = (
      <g>
        {[60, 48, 36, 24].map((r, i) => (
          <path key={r} d={`M${120 - r} 130 Q${120 - r - 6} ${80 - i * 4} 120 ${40 + i * 10} Q${120 + r + 6} ${80 - i * 4} ${120 + r} 130 Z`}
            fill={i === 0 ? '#c2410c' : starchColor('#fef3c7', iodine, p.starch)} stroke={INK} strokeWidth="1.4" />
        ))}
        <path d="M120 130 L120 70" stroke="#16a34a" strokeWidth="4" />
        <path d="M100 132 q-6 14 -12 20 M120 132 v20 M140 132 q6 14 12 20" stroke="#a8a29e" strokeWidth="2" fill="none" />
        <Label x={70} y={100} tx={25} ty={60} text="葉が へんか" />
        <Label x={120} y={80} tx={190} ty={40} text="め" />
        <Label x={140} y={146} tx={200} ty={150} text="根" />
      </g>
    );
    note = 'きゅうこんを たてに 切った ところ。あつい 葉が かさなって ようぶんを ためている。';
  } else if (p.endosperm) {
    // 有胚乳（トウモロコシ・イネ）
    body = (
      <g>
        <path d="M120 20 Q185 30 180 95 Q170 145 120 150 Q70 145 60 95 Q55 30 120 20 Z" fill="#fde68a" stroke={INK} strokeWidth="2.4" />
        <path d="M120 26 Q178 36 173 95 Q165 140 120 144 Q75 140 67 95 Q62 36 120 26 Z" fill={starchColor('#fef9c3', iodine, p.starch)} />
        <path d="M105 140 Q95 110 112 85 Q128 110 124 142 Z" fill="#fefce8" stroke={INK} strokeWidth="1.4" />
        <Label x={178} y={80} tx={190} ty={60} text="種皮（しゅひ）" />
        <Label x={150} y={60} tx={190} ty={30} text="はいにゅう" />
        <Label x={112} y={120} tx={40} ty={140} text="はい" />
      </g>
    );
    note = 'はいにゅうの ある たね。ようぶんは はいにゅうに ある。はいが 育って からだに なる。';
  } else {
    // 無胚乳（マメ・アサガオ・ヒマワリ・イチゴ）
    body = (
      <g>
        <path d="M60 80 Q60 25 120 25 Q180 25 180 80 Q180 140 120 140 Q60 140 60 80 Z" fill="#a16207" stroke={INK} strokeWidth="2.4" />
        <path d="M66 80 Q66 31 118 31 L118 134 Q66 134 66 80 Z" fill={starchColor('#fef3c7', iodine, p.starch)} stroke={INK} strokeWidth="1.2" />
        <path d="M174 80 Q174 31 122 31 L122 134 Q174 134 174 80 Z" fill={starchColor('#fef3c7', iodine, p.starch)} stroke={INK} strokeWidth="1.2" />
        <path d="M120 40 q-6 4 -2 10 M120 50 L120 100 q0 12 -4 18" stroke="#fef9c3" strokeWidth="5" fill="none" strokeLinecap="round" />
        <Label x={118} y={44} tx={190} ty={20} text="ようが（→葉・くき）" />
        <Label x={121} y={75} tx={190} ty={70} text="はいじく（→くき）" />
        <Label x={117} y={115} tx={190} ty={125} text="ようこん（→根）" />
        <Label x={85} y={70} tx={30} ty={40} text="子葉" />
        <Label x={62} y={100} tx={30} ty={130} text="種皮" />
      </g>
    );
    note = 'はいにゅうの ない たね。ようぶんは 子葉に ある。ようが・はいじく・ようこん・子葉を あわせて「はい」。';
  }
  const result = p.starch === 2 ? 'こい 青むらさきに なった！ でんぷんが たくさん あるよ'
    : p.starch === 1 ? 'すこし 青むらさきに なった。でんぷんは すこし'
    : 'ほとんど かわらない。でんぷんは すくなくて、しぼうが おおいよ';
  return (
    <div>
      <svg viewBox="-10 0 330 160" className="w-full rounded-xl bg-white">{body}</svg>
      <div className="mt-1 text-[11px] font-bold leading-snug text-indigo-900/70">{note}</div>
      {!iodine ? (
        <button className="btn-main mt-2 !py-2 text-[12px]" onClick={() => setIodine(true)}>💧 ヨウ素液を たらす</button>
      ) : (
        <div className="mt-2 rounded-xl bg-violet-50 px-3 py-2 text-[12px] font-black text-violet-900">🧪 {result}</div>
      )}
    </div>
  );
}

const PARTS = [
  { key: 'mesibe', name: 'めしべ', role: 'めしべの 子房の 中の はいしゅが たねに なる' },
  { key: 'osibe', name: 'おしべ', role: 'おしべの やくで 花粉を つくる' },
  { key: 'hanabira', name: '花びら', role: 'めだつ いろで こんちゅうを よぶ' },
  { key: 'gaku', name: 'がく', role: 'つぼみの とき はなを まもる' },
] as const;
type PartKey = typeof PARTS[number]['key'];

export function FlowerParts({ p, done, onDone }: { p: PlantDef; done: boolean; onDone(): void }) {
  const [found, setFound] = useState<PartKey[]>(done ? PARTS.map((x) => x.key) : []);
  const [miss, setMiss] = useState('');
  const ask = PARTS.find((x) => !found.includes(x.key));

  if (p.pollen === 'wind' || p.seed === 'sd_ine') {
    return (
      <div className="rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-ink">
        🍃 {p.name}の はなは <b>花びらが ない</b> めだたない はな。かるい 花粉を たくさん つくって、かぜで はこぶ（ふうばいか）。
        {p.seed === 'sd_corn' && ' くきの てっぺんに おばな、とちゅうに めばな（ひげが めしべ）が あるよ。'}
        {p.seed === 'sd_ine' && ' イネは じぶんの 花粉が めしべに つく じかじゅふんも するよ。'}
        {!done && <button className="btn-main mt-2 !py-2 text-[12px]" onClick={onDone}>わかった！</button>}
      </div>
    );
  }

  const tap = (k: PartKey) => {
    if (!ask || found.includes(k)) return;
    if (k === ask.key) {
      const next = [...found, k];
      setFound(next);
      setMiss('');
      if (next.length === PARTS.length) onDone();
    } else {
      setMiss(`そこは ${PARTS.find((x) => x.key === k)!.name}。${ask.name}を さがしてね`);
    }
  };
  const has = (k: PartKey) => found.includes(k);
  const hit = { cursor: 'pointer' } as const;

  return (
    <div>
      <div className="mb-1 text-[12px] font-black text-ink">
        {ask ? `🔍 「${ask.name}」は どれ？ タップしてね（${found.length}/4）` : '🎉 はなの 4つの つくりが ぜんぶ わかった！（かんぜんか）'}
      </div>
      <svg viewBox="-10 0 310 200" className="w-full rounded-xl bg-white">
        <rect x="118" y="150" width="4" height="50" fill="#15803d" />
        <g onClick={() => tap('hanabira')} style={hit}>
          <ellipse cx="60" cy="116" rx="30" ry="16" fill={p.flower} stroke={INK} strokeWidth="1.6" transform="rotate(-25 60 116)" />
          <ellipse cx="180" cy="116" rx="30" ry="16" fill={p.flower} stroke={INK} strokeWidth="1.6" transform="rotate(25 180 116)" />
        </g>
        <g onClick={() => tap('gaku')} style={hit}>
          <ellipse cx="104" cy="150" rx="16" ry="6" fill="#22c55e" stroke={INK} strokeWidth="1.4" transform="rotate(25 104 150)" />
          <ellipse cx="136" cy="150" rx="16" ry="6" fill="#22c55e" stroke={INK} strokeWidth="1.4" transform="rotate(-25 136 150)" />
        </g>
        <g onClick={() => tap('osibe')} style={hit}>
          {[98, 142].map((x) => (
            <g key={x}>
              <line x1={x} y1="148" x2={x} y2="92" stroke="#a3e635" strokeWidth="3" />
              <line x1={x} y1="148" x2={x} y2="92" stroke="transparent" strokeWidth="14" />
              <ellipse cx={x} cy="88" rx="6" ry="8" fill="#f59e0b" stroke={INK} strokeWidth="1.2" />
            </g>
          ))}
        </g>
        <g onClick={() => tap('mesibe')} style={hit}>
          <ellipse cx="120" cy="134" rx="10" ry="15" fill="#4ade80" stroke={INK} strokeWidth="1.4" />
          <line x1="120" y1="120" x2="120" y2="78" stroke="#4ade80" strokeWidth="4" />
          <line x1="120" y1="120" x2="120" y2="78" stroke="transparent" strokeWidth="14" />
          <circle cx="120" cy="76" r="5" fill="#16a34a" stroke={INK} strokeWidth="1.2" />
          {[128, 136, 142].map((y) => <circle key={y} cx="120" cy={y} r="2" fill="#fef9c3" />)}
        </g>
        {has('mesibe') && <Label x={128} y={130} tx={185} ty={185} text="めしべ（子房）" />}
        {has('osibe') && <Label x={146} y={88} tx={190} ty={50} text="おしべ（やく）" />}
        {has('hanabira') && <Label x={50} y={108} tx={25} ty={50} text="花びら" />}
        {has('gaku') && <Label x={98} y={152} tx={35} ty={180} text="がく" />}
      </svg>
      {miss && <div className="mt-1 text-[11px] font-black text-rose-600">{miss}</div>}
      {found.length > 0 && (
        <ul className="mt-1 text-[11px] font-bold leading-snug text-indigo-900/70">
          {PARTS.filter((x) => found.includes(x.key)).map((x) => <li key={x.key}>・{x.name}：{x.role}</li>)}
        </ul>
      )}
      {!ask && p.seed === 'sd_berry' && (
        <div className="mt-1 text-[11px] font-bold text-rose-700">🍓 イチゴの たべる ところは 子房ではなく かたく（がくの つけね）が そだった「ぎか」だよ。</div>
      )}
    </div>
  );
}
