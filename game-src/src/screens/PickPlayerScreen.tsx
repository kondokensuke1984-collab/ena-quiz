import { useState } from 'react';
import { KidSVG, PALETTES } from '../components/KidSVG';
import { useGame } from '../state/useGame';
import type { PlayerKey, School } from '../types';
import { FIXED_SCHOOL, SCHOOLS, SCHOOL_LABEL } from '../lib/school';

const CHOICES: { key: PlayerKey; emoji: string; copy: string }[] = [
  { key: 'anri', emoji: '🌸', copy: 'げんきいっぱい。はなの かみかざりが おきにいり' },
  { key: 'rino', emoji: '🐰', copy: 'マイペース。うさみみフードを いつも きている' },
  { key: 'mitsuki', emoji: '🌙', copy: 'ほしを みるのが すき。ポニーテールが トレードマーク' },
  { key: 'kensuke', emoji: '⚽', copy: 'かけっこが とくい。いつも げんきな わんぱく' },
  { key: 'yusei', emoji: '🎒', copy: 'くくを れんしゅう ちゅうの 2年生。まるい メガネが トレードマーク' },
];

export const PLAYER_CHOICES = CHOICES;

export function PickPlayerScreen() {
  const { pickPlayer } = useGame();
  const [picked, setPicked] = useState<PlayerKey | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const fixed = picked ? FIXED_SCHOOL[picked] : undefined;
  const ready = !!picked && (!!fixed || !!school);

  return (
    <div className="mx-auto min-h-full max-w-[480px] px-4 py-8">
      <h1 className="text-center text-xl font-black text-white">🏝 アンリノ島へ ようこそ</h1>
      <p className="mt-1.5 text-center text-[12px] font-bold text-indigo-200/80">
        しまを たんけんする しゅじんこうを えらんでね
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {CHOICES.map((c, i) => (
          <button
            key={c.key}
            onClick={() => setPicked(c.key)}
            className={`panel flex flex-col items-center gap-1 !px-2 !py-4 transition ${
              CHOICES.length % 2 === 1 && i === CHOICES.length - 1 ? 'col-span-2 mx-auto w-[calc(50%-0.375rem)] ' : ''
            }${
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

      {picked && (
        <div className="panel mt-4 !py-3 text-center">
          {fixed ? (
            <div className="text-[13px] font-black text-ink">🏫 がっこう：{SCHOOL_LABEL[fixed]}</div>
          ) : (
            <>
              <div className="mb-2 text-[12px] font-black text-ink">🏫 がっこうを えらんでね</div>
              <div className="grid grid-cols-4 gap-2">
                {SCHOOLS.map((sc) => (
                  <button
                    key={sc}
                    onClick={() => setSchool(sc)}
                    className={`rounded-xl px-2 py-2 text-[14px] font-black active:scale-95 ${school === sc ? 'bg-amber-100 text-ink ring-2 ring-amber-400' : 'bg-indigo-50 text-indigo-900/70'}`}
                  >
                    {school === sc ? '✓ ' : ''}{SCHOOL_LABEL[sc]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <button className="btn-main mt-5" disabled={!ready} onClick={() => picked && ready && pickPlayer(picked, school ?? undefined)}>
        {!picked ? 'だれか えらんでね' : ready ? `${PALETTES[picked].name}で はじめる` : 'がっこうを えらんでね'}
      </button>

      <p className="mt-4 text-center text-[11px] font-bold leading-relaxed text-indigo-200/60">
        クイズアプリで ためた 🪙アンリノメダル を つかって、<br />
        なにもない しまを すこしずつ にぎやかに していこう
      </p>
    </div>
  );
}
