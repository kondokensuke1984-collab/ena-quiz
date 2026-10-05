// 島の音。音のファイルは使わず WebAudio で合成する。
// ・最初のタップで音を起こす（iPhone は ユーザー操作の中でしか鳴らせない）
// ・設定は ena_island_sound に保存。はじめは 効果音オン・BGMオフ

import { readJSON, writeJSON } from './storage';

export type SoundMode = 'sfx' | 'all' | 'off';
const KEY = 'ena_island_sound';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let mode: SoundMode = (() => {
  const v = readJSON<unknown>(KEY, 'sfx');
  return v === 'all' || v === 'off' ? v : 'sfx';
})();
let bgmTimer: number | null = null;
let bgmNight = false;
let bgmStep = 0;
let bgmPaused = false;

export function soundMode(): SoundMode { return mode; }

export function setSoundMode(m: SoundMode): void {
  mode = m;
  writeJSON(KEY, m);
  if (m === 'all') startBgm(); else stopBgm();
}

/** 次の設定へ（🔊効果音 → 🎵効果音＋BGM → 🔇なし） */
export function cycleSoundMode(): SoundMode {
  const next: SoundMode = mode === 'sfx' ? 'all' : mode === 'all' ? 'off' : 'sfx';
  unlockAudio();
  setSoundMode(next);
  return next;
}

/** タップのたびに呼んでよい（2回目以降は何もしない） */
export function unlockAudio(): void {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
      // iOS16.4+：サイレントスイッチの影響を受けないようにする
      const nav = navigator as unknown as { audioSession?: { type: string } };
      if (nav.audioSession) nav.audioSession.type = 'playback';
      // 無音を1回鳴らして起こす
      const b = ctx.createBuffer(1, 1, 22050);
      const s = ctx.createBufferSource();
      s.buffer = b; s.connect(ctx.destination); s.start(0);
      if (mode === 'all') startBgm();
    }
    if (ctx.state === 'suspended') void ctx.resume();
  } catch { /* 音が出なくても遊べるようにする */ }
}

function tone(freq: number, at: number, dur: number, type: OscillatorType = 'sine', vol = 0.16, slideTo?: number, dest?: AudioNode): void {
  if (!ctx || !master) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, at + dur);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g); g.connect(dest ?? master);
  o.start(at); o.stop(at + dur + 0.02);
}

export type Sfx = 'coin' | 'build' | 'gift' | 'heart' | 'stamp' | 'letter' | 'chest' | 'star' | 'ng' | 'splash' | 'catch' | 'water' | 'siren' | 'clue' | 'reveal' | 'launch';

export function sfx(name: Sfx): void {
  if (mode === 'off' || !ctx) return;
  const t = ctx.currentTime + 0.01;
  switch (name) {
    case 'coin': tone(988, t, 0.08, 'square', 0.08); tone(1319, t + 0.08, 0.22, 'square', 0.08); break;
    case 'build': [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.11, 0.28, 'triangle', 0.14)); tone(1319, t + 0.46, 0.5, 'triangle', 0.12); break;
    case 'gift': [1568, 1760, 2093, 2637].forEach((f, i) => tone(f, t + i * 0.06, 0.18, 'sine', 0.09)); break;
    case 'heart': tone(660, t, 0.14, 'sine', 0.14); tone(880, t + 0.12, 0.3, 'sine', 0.14); break;
    case 'stamp': tone(220, t, 0.08, 'square', 0.12, 110); tone(784, t + 0.06, 0.2, 'triangle', 0.12); break;
    case 'letter': tone(1047, t, 0.12, 'sine', 0.12); tone(1568, t + 0.1, 0.25, 'sine', 0.12); break;
    case 'chest': [392, 494, 587, 784, 988].forEach((f, i) => tone(f, t + i * 0.07, 0.25, 'triangle', 0.12)); break;
    case 'star': tone(2093, t, 0.6, 'sine', 0.07, 1047); break;
    case 'splash': tone(420, t, 0.18, 'sine', 0.1, 140); tone(900, t + 0.05, 0.12, 'triangle', 0.05, 300); break;
    case 'catch': [784, 988, 1175, 1568].forEach((f, i) => tone(f, t + i * 0.08, 0.22, 'square', 0.07)); break;
    case 'water': [1200, 1000, 1300].forEach((f, i) => tone(f, t + i * 0.09, 0.1, 'sine', 0.08, f * 0.7)); break;
    case 'ng': tone(196, t, 0.18, 'square', 0.08, 147); break;
    case 'siren': [0, 1, 2].forEach((i) => { tone(880, t + i * 0.5, 0.25, 'triangle', 0.07, 660); tone(660, t + i * 0.5 + 0.25, 0.25, 'triangle', 0.07, 880); }); break;
    case 'clue': [1319, 1760, 2349].forEach((f, i) => tone(f, t + i * 0.06, 0.2, 'sine', 0.08)); break;
    case 'launch': tone(70, t, 2.4, 'sawtooth', 0.07, 520); tone(140, t + 0.2, 2.2, 'triangle', 0.06, 1040); [784, 988, 1319].forEach((f, i) => tone(f, t + 2.2 + i * 0.1, 0.3, 'sine', 0.08)); break;
    case 'reveal': [392, 523, 659, 784].forEach((f, i) => tone(f, t + i * 0.12, 0.3, 'square', 0.07)); tone(1047, t + 0.5, 0.8, 'triangle', 0.12); break;
  }
}

/** キャラの声。名前から高さを決めるので、同じ子はいつも同じ声 */
export function voice(key: string): void {
  if (mode === 'off' || !ctx) return;
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const base = 420 + (h % 9) * 55;
  const t = ctx.currentTime + 0.01;
  tone(base, t, 0.09, 'triangle', 0.16, base * 1.35);
  tone(base * 1.25, t + 0.1, 0.12, 'triangle', 0.14, base * 1.6);
}

// ── BGM：ペンタトニックの やさしいループ。夜は ゆっくり・ひくめ ──
const DAY = [523, 587, 659, 784, 880, 1047];
const NIGHT = [392, 440, 523, 587, 659, 784];
const MELODY = [0, 2, 4, 2, 3, 1, 0, -1, 2, 4, 5, 4, 3, 2, 1, -1];

export function setBgmNight(night: boolean): void { bgmNight = night; }
/** オルガンを ひいている あいだは BGM を やすむ */
export function setBgmPaused(p: boolean): void { bgmPaused = p; }

function startBgm(): void {
  if (!ctx || bgmTimer !== null) return;
  bgmTimer = window.setInterval(() => {
    if (!ctx || mode !== 'all' || document.hidden || bgmPaused) return;
    const i = MELODY[bgmStep % MELODY.length];
    bgmStep++;
    if (bgmNight && bgmStep % 2) return;          // 夜は音を間引いて ゆったり
    if (i < 0) return;
    const scale = bgmNight ? NIGHT : DAY;
    const t = ctx.currentTime + 0.02;
    tone(scale[i], t, bgmNight ? 0.9 : 0.5, 'sine', 0.035);
    if (bgmStep % 4 === 1) tone(scale[0] / 2, t, 1.1, 'triangle', 0.03);
  }, 360);
}

function stopBgm(): void {
  if (bgmTimer !== null) { window.clearInterval(bgmTimer); bgmTimer = null; }
}

// ── オルガン ──
/** やわらかい オルガンの音（sine ＋ 1オクターブ上の triangle を すこし）。at は ctx の時刻（省略＝いま） */
export function organNote(freq: number, dur = 0.45, at?: number, dest?: AudioNode): void {
  if (mode === 'off' || !ctx) return;
  const t = at ?? ctx.currentTime + 0.005;
  tone(freq, t, dur, 'sine', 0.17, undefined, dest);
  tone(freq * 2, t, dur * 0.8, 'triangle', 0.035, undefined, dest);
}

/** 曲を ながす。onStep(i) は i ばんめの音が なった とき（さいごに -1）。戻り値＝とめる */
export function playSong(notes: { freq: number; beats: number }[], bpm: number, onStep: (i: number) => void): () => void {
  const timers: number[] = [];
  if (!ctx || !master) { onStep(-1); return () => {}; }
  // 曲ごとの 出口。とめるときは ここを きれば 予約ずみの音も きえる
  const bus = ctx.createGain();
  bus.connect(master);
  const beat = 60 / bpm;
  const start = ctx.currentTime + 0.08;
  let at = 0;
  notes.forEach((n, i) => {
    organNote(n.freq, Math.max(0.2, n.beats * beat * 0.92), start + at, bus);
    timers.push(window.setTimeout(() => onStep(i), (0.08 + at) * 1000));
    at += n.beats * beat;
  });
  timers.push(window.setTimeout(() => { bus.disconnect(); onStep(-1); }, (0.08 + at + 0.4) * 1000));
  return () => {
    timers.forEach((id) => window.clearTimeout(id));
    try { bus.disconnect(); } catch { /* もう きれている */ }
  };
}
