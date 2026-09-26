import { useEffect, useRef, useState } from 'react';
import { sfx, soundMode } from '../lib/sound';
import { readJSON, writeJSON } from '../lib/storage';
import drill from '../lib/drill.json';

// 島に 入るたびの あんきクイズ（ずんだもん）。ページを ひらくたびに 1回、スキップなしで さいごまで。
// 表は lib/drill.json（声 audio/drill/ と 同じ表。中身を かえたら tools/make_drill_voice.py で 声も 作りなおす）。
// 1回 perVisit こずつ 順番に 出す。向きは 小数→分数 と 分数→小数 を こうごに、1周ごとに 入れかえる（2周で ぜんぶ 両方の 向き）。

interface Item { dec: string; num: number; den: number; star?: boolean }
const ITEMS = drill.items as Item[];
const PER = drill.perVisit;
const KEY = 'ena_island_drill';

const THINK_MS = 2000;   // 問いの あと、考える 間
const NEXT_MS = 1000;    // 答えの あと、つぎの 問題まで
const NO_VOICE_MS = 1600; // こえなし・鳴らせないときの 1本ぶんの 長さ

interface Progress { idx: number; lap: number }
interface Card { i: number; toFrac: boolean }   // toFrac: 小数を 見せて 分数を こたえる

function loadProgress(): Progress {
  const v = readJSON<Partial<Progress>>(KEY, {});
  const idx = Number.isInteger(v.idx) && v.idx! >= 0 && v.idx! < ITEMS.length ? v.idx! : 0;
  const lap = Number.isInteger(v.lap) && v.lap! >= 0 ? v.lap! : 0;
  return { idx, lap };
}

function makeCards({ idx, lap }: Progress): Card[] {
  return Array.from({ length: PER }, (_, k) => {
    const n = idx + k;
    const i = n % ITEMS.length;
    const l = lap + Math.floor(n / ITEMS.length);
    return { i, toFrac: (i + l) % 2 === 0 };
  });
}

function Frac({ num, den }: { num: number; den: number }) {
  return (
    <span className="inline-flex flex-col items-center align-middle leading-none">
      <span>{num}</span>
      <span className="my-1 h-[5px] w-[1.3em] rounded-full bg-current" />
      <span>{den}</span>
    </span>
  );
}

function Face({ it, frac }: { it: Item; frac: boolean }) {
  return frac ? <Frac num={it.num} den={it.den} /> : <span>{it.dec}</span>;
}

type Phase = 'ready' | 'intro' | 'q' | 'a' | 'done';

export function DrillScreen({ onDone }: { onDone: () => void }) {
  const [start] = useState(loadProgress);
  const [cards] = useState(() => makeCards(start));
  const [phase, setPhase] = useState<Phase>('ready');
  const [step, setStep] = useState(0);
  const [voiceOn, setVoiceOn] = useState(() => soundMode() !== 'off');
  const voiceRef = useRef(voiceOn);
  voiceRef.current = voiceOn;
  const audio = useRef<HTMLAudioElement | null>(null);

  // 1本 ならす。おわるか、鳴らせなければ 決まった 時間で すすむ
  const say = (name: string) =>
    new Promise<void>((resolve) => {
      if (!voiceRef.current) { setTimeout(resolve, NO_VOICE_MS); return; }
      const a = new Audio(`/audio/drill/${name}.mp3`);
      audio.current = a;
      let done = false;
      const end = () => { if (!done) { done = true; clearTimeout(guard); resolve(); } };
      const guard = setTimeout(end, 8000);   // 止まったままに ならないように
      a.onended = end;
      a.onerror = () => setTimeout(end, NO_VOICE_MS);
      a.play().catch(() => setTimeout(end, NO_VOICE_MS));
    });

  const run = async () => {
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    setPhase('intro');
    await say('intro');
    for (let k = 0; k < cards.length; k++) {
      const c = cards[k];
      const n = String(c.i + 1).padStart(2, '0');
      setStep(k);
      setPhase('q');
      await say(c.toFrac ? `dq${n}` : `fq${n}`);
      await wait(THINK_MS);
      setPhase('a');
      sfx('star');
      await say(c.toFrac ? `fa${n}` : `da${n}`);
      await wait(NEXT_MS);
    }
    // さいごまで 聞いたので、つぎは その続きから
    const n = start.idx + PER;
    writeJSON(KEY, { idx: n % ITEMS.length, lap: start.lap + Math.floor(n / ITEMS.length) });
    setPhase('done');
    await say('outro');
  };

  useEffect(() => () => { audio.current?.pause(); }, []);

  const c = cards[step];
  const it = ITEMS[c.i];

  return (
    <div className="fixed inset-0 z-[60] flex select-none flex-col overflow-hidden bg-gradient-to-b from-[#14532d] via-[#166534] to-[#1e1b4b]">
      {/* 上：こえ・すすみぐあい */}
      <div className="flex items-center justify-between p-3">
        <button
          className="rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-black text-white active:scale-95"
          onClick={() => setVoiceOn((v) => !v)}
        >
          {voiceOn ? '🔊 こえあり' : '🔇 こえなし'}
        </button>
        {(phase === 'q' || phase === 'a') && (
          <div className="flex gap-1.5">
            {cards.map((_, k) => (
              <span key={k} className={`h-3 w-3 rounded-full ${k < step || (k === step && phase === 'a') ? 'bg-lime-300' : k === step ? 'bg-white' : 'bg-white/25'}`} />
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center justify-center px-5 text-center">
        <img src="/images/zundamon.png" alt="ずんだもん" className="h-24 w-24 rounded-full border-4 border-lime-200 shadow-lg" />
        <div className="mt-3 text-[15px] font-black tracking-widest text-lime-100">ずんだもんの あんきクイズ</div>
        <div className="text-[13px] font-bold text-lime-200/80">{drill.title}</div>

        {phase === 'ready' && (
          <button
            className="mt-8 rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-500 px-8 py-3 text-[17px] font-black text-white shadow-lg active:scale-95"
            onClick={() => { sfx('star'); void run(); }}
          >
            ▶ はじめる
          </button>
        )}

        {phase === 'intro' && (
          <div className="mt-8 text-[18px] font-black text-white" style={{ animation: 'fade .6s ease-out' }}>
            しまに 入る まえに、<br />あんきクイズなのだ！
          </div>
        )}

        {(phase === 'q' || phase === 'a') && (
          <div key={step} className="panel mt-6 w-full !py-6" style={{ animation: 'fade .5s ease-out' }}>
            <div className="text-[13px] font-black text-indigo-400">
              {step + 1} / {cards.length} もんめ {it.star && <span className="ml-1 text-amber-500">★よく でる</span>}
            </div>
            <div className="mt-3 flex items-center justify-center gap-3 text-[44px] font-black text-ink sm:gap-4 sm:text-[52px]">
              <Face it={it} frac={!c.toFrac} />
              <span className="text-[40px] text-indigo-300">＝</span>
              {phase === 'q' ? (
                <span className="text-rose-400">？</span>
              ) : (
                <span className="text-emerald-600" style={{ animation: 'bubble-pop .35s ease-out' }}>
                  <Face it={it} frac={c.toFrac} />
                </span>
              )}
            </div>
            <div className="mt-2 h-5 text-[13px] font-bold text-indigo-900/50">
              {phase === 'q' ? 'あたまの 中で こたえてね' : ''}
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="mt-6 w-full" style={{ animation: 'fade .6s ease-out' }}>
            <div className="text-[20px] font-black text-white">よくできたのだ！</div>
            <button
              className="mt-6 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 px-8 py-3 text-[16px] font-black text-white shadow-lg active:scale-95"
              onClick={() => { audio.current?.pause(); sfx('stamp'); onDone(); }}
            >
              🏝 しまへ いく
            </button>
          </div>
        )}
      </div>

      <div className="p-3 text-right text-[10px] font-bold text-lime-100/60">声：VOICEVOX:ずんだもん</div>
    </div>
  );
}
