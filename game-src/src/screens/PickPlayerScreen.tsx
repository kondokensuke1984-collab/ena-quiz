import { useState } from 'react';
import { KidSVG, PALETTES } from '../components/KidSVG';
import { useGame } from '../state/useGame';
import type { PlayerKey } from '../types';

const CHOICES: { key: PlayerKey; emoji: string; copy: string }[] = [
  { key: 'anri', emoji: '🌸', copy: 'げんきいっぱい。はなの かみかざりが おきにいり' },
  { key: 'rino', emoji: '🐰', copy: 'マイペース。うさみみフードを いつも きている' },
  { key: 'mitsuki', emoji: '🌙', copy: 'ほしを みるのが すき。ポニーテールが トレードマーク' },
  { key: 'kensuke', emoji: '⚽', copy: 'かけっこが とくい。いつも げんきな わんぱく' },
];

export const PLAYER_CHOICES = CHOICES;

export function PickPlayerScreen() {
  const { pickPlayer } = useGame();
  const [picked, setPicked] = useState<PlayerKey | null>(null);

  return (
    <div className="mx-auto min-h-full max-w-[480px] px-4 py-8">
      <h1 className="text-center text-xl font-black text-white">🏝 アンリノ島へ ようこそ</h1>
      <p className="mt-1.5 text-center text-[12px] font-bold text-indigo-200/80">
        しまを たんけんする しゅじんこうを えらんでね
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {CHOICES.map((c) => (
          <button
            key={c.key}
            onClick={() => setPicked(c.key)}
            className={`panel flex flex-col items-center gap-1 !px-2 !py-4 transition ${
              picked === c.key ? 'ring-4 ring-amber-400' : 'opacity-85'
            }`}
          >
            <div className={picked === c.key ? 'idle-breathe' : undefined}>
              <KidSVG who={c.key} size={96} />
            </div>
            <div className="mt-1 text-base font-black text-ink">
              {c.emoji} {PALETTES[c.key].name}
            </div>
            <div className="px-1 text-[10.5px] font-bold leading-snug text-indigo-900/60">{c.copy}</div>
          </button>
        ))}
      </div>

      <button className="btn-main mt-5" disabled={!picked} onClick={() => picked && pickPlayer(picked)}>
        {picked ? `${PALETTES[picked].name}で はじめる` : 'だれか えらんでね'}
      </button>

      <p className="mt-4 text-center text-[11px] font-bold leading-relaxed text-indigo-200/60">
        クイズアプリで ためた 🪙アンリノメダル を つかって、<br />
        なにもない しまを すこしずつ にぎやかに していこう
      </p>
    </div>
  );
}
