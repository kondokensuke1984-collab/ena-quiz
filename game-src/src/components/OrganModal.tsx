// 🎹 オルガン：じゆうに ひく／おてほんを きく／ひかる けんを おして れんしゅう

import { useEffect, useRef, useState } from 'react';
import { BLACK_KEYS, noteFreq, SONGS, WHITE_KEYS, type AnyNote, type Song } from '../lib/songs';
import { cycleSoundMode, organNote, playSong, setBgmPaused, sfx, soundMode, unlockAudio } from '../lib/sound';
import { useGame } from '../state/useGame';

type Tab = 'free' | 'listen' | 'practice';

const TABS: { key: Tab; label: string }[] = [
  { key: 'free', label: '🎹 じゆうに' },
  { key: 'listen', label: '🎧 おてほん' },
  { key: 'practice', label: '⭐ れんしゅう' },
];

export function OrganModal({ onClose, onClear }: { onClose: () => void; onClear: () => void }) {
  const g = useGame();
  const played = g.save.organ.played;
  const [tab, setTab] = useState<Tab>('free');
  const [song, setSong] = useState<Song | null>(null);
  const [step, setStep] = useState(-1);            // おてほん：いま なっている音／れんしゅう：つぎに おす音
  const [pressed, setPressed] = useState<Record<string, number>>({});
  const [done, setDone] = useState<string | null>(null);
  const [muted, setMuted] = useState(soundMode() === 'off');
  const stopRef = useRef<(() => void) | null>(null);

  const stop = () => { stopRef.current?.(); stopRef.current = null; };

  useEffect(() => {
    setBgmPaused(true);
    return () => { stopRef.current?.(); setBgmPaused(false); };
  }, []);

  const changeTab = (t: Tab) => { stop(); setTab(t); setSong(null); setStep(-1); setDone(null); };

  const listen = (s: Song) => {
    stop();
    unlockAudio();
    setSong(s);
    stopRef.current = playSong(s.notes.map(([n, b]) => ({ freq: noteFreq(n), beats: b })), s.bpm, (i) => {
      setStep(i);
      if (i < 0) { stopRef.current = null; setSong(null); }
    });
  };

  const startPractice = (s: Song) => { setSong(s); setStep(0); setDone(null); };

  const press = (n: AnyNote) => {
    unlockAudio();
    organNote(noteFreq(n));
    setPressed((p) => ({ ...p, [n]: Date.now() }));
    window.setTimeout(() => setPressed((p) => { const q = { ...p }; delete q[n]; return q; }), 160);
    if (tab !== 'practice' || !song || step < 0) return;
    if (song.notes[step][0] !== n) return;           // ちがう けんは 音だけ（ばつは なし）
    const next = step + 1;
    if (next < song.notes.length) { setStep(next); return; }
    // さいごまで ひけた
    setStep(-1);
    setDone(song.id);
    window.setTimeout(() => sfx('reveal'), 350);
    const r = g.markSongPlayed(song.id);
    if (r.title) g.showToast(`🏅 しょうごう「${r.title}」を もらったよ！`);
    onClear();
  };

  // 光らせる けん
  const lit: AnyNote | null =
    song && step >= 0 && step < song.notes.length ? song.notes[step][0] : null;
  const litColor = tab === 'practice' ? 'bg-amber-300' : 'bg-sky-300';

  const whiteW = 100 / WHITE_KEYS.length;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel w-full max-w-[560px]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[14px] font-black text-ink">🎹 オルガン</div>
          <div className="text-[11px] font-bold text-indigo-900/60">♪ ひけた きょく {played.length}/{SONGS.length}</div>
        </div>

        <div className="mb-2 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`flex-1 rounded-xl px-1 py-1.5 text-[12px] font-black ${tab === t.key ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-800'}`}
              onClick={() => changeTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {muted && (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-bold text-rose-700">
            🔇 おとなし に なっているよ
            <button className="rounded-lg bg-rose-500 px-2 py-1 text-white" onClick={() => { cycleSoundMode(); setMuted(soundMode() === 'off'); }}>
              🔊 おとを だす
            </button>
          </div>
        )}

        {/* 曲えらび・ようす */}
        {tab === 'free' && (
          <p className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-bold leading-relaxed text-ink">
            すきな けんを おして みよう。くろい けんも なるよ。
          </p>
        )}
        {tab !== 'free' && !(tab === 'practice' && song) && (
          <div className="mb-2 grid grid-cols-2 gap-1.5">
            {SONGS.map((s) => (
              <button
                key={s.id}
                className={`rounded-xl px-2 py-1.5 text-left text-[12px] font-black ${song?.id === s.id ? 'bg-sky-200 text-sky-900' : 'bg-white/80 text-ink'} ring-1 ring-violet-200`}
                onClick={() => (tab === 'listen' ? (song?.id === s.id ? (stop(), setSong(null), setStep(-1)) : listen(s)) : startPractice(s))}
              >
                {s.emoji} {s.title}
                {played.includes(s.id) && <span className="ml-1 text-amber-500">♪</span>}
                {tab === 'listen' && song?.id === s.id && <span className="ml-1">⏹</span>}
              </button>
            ))}
          </div>
        )}
        {tab === 'practice' && song && (
          <div className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-bold text-ink">
            {done === song.id ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px]">🎉 「{song.title}」が ひけたね！ ♪</span>
                <button className="shrink-0 whitespace-nowrap rounded-lg bg-amber-400 px-2 py-1 text-[11px]" onClick={() => startPractice(song)}>もういちど</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span>{song.emoji} {song.title}</span>
                  <span className="text-indigo-900/60">{step}/{song.notes.length}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-amber-100">
                  <div className="h-full bg-amber-400 transition-all" style={{ width: `${(step / song.notes.length) * 100}%` }} />
                </div>
                <div className="mt-1 text-[11px] text-indigo-900/60">きいろく ひかる けんを じゅんばんに おしてね</div>
              </>
            )}
            <button className="mt-1 text-[11px] font-black text-violet-700 underline" onClick={() => { setSong(null); setStep(-1); setDone(null); }}>
              ← きょくを えらぶ
            </button>
          </div>
        )}

        {/* けんばん */}
        <div className="relative h-[150px] w-full select-none overflow-hidden rounded-xl bg-[#7c2d12] p-1.5" style={{ touchAction: 'none' }}>
          <div className="relative flex h-full w-full">
            {WHITE_KEYS.map((k) => (
              <div
                key={k.n}
                className={`relative mx-[1px] flex flex-1 items-end justify-center rounded-b-md pb-1.5 text-[11px] font-black text-indigo-900/70 transition-colors ${
                  pressed[k.n] ? 'bg-violet-200' : lit === k.n ? `${litColor} animate-pulse` : 'bg-white'
                }`}
                onPointerDown={(e) => { e.preventDefault(); press(k.n); }}
              >
                {k.label}
              </div>
            ))}
            {BLACK_KEYS.map((k) => (
              <div
                key={k.n}
                className={`absolute top-0 z-10 h-[58%] rounded-b-md ${pressed[k.n] ? 'bg-violet-500' : 'bg-[#1e1b4b]'}`}
                style={{ left: `calc(${(k.after + 1) * whiteW}% - ${whiteW * 0.3}%)`, width: `${whiteW * 0.6}%` }}
                onPointerDown={(e) => { e.preventDefault(); press(k.n); }}
              />
            ))}
          </div>
        </div>

        <button className="btn mt-3" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
