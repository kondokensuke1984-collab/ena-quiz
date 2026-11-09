// ============================================================
// 🎵 アンリノの伝説の 曲と 効果音（音の ファイルは なし・すべて この作品の ための オリジナル）
//   音源は まよいの森の js/forest_music.js を つかう（FM_SONGS に 足すだけ）
// ============================================================
Object.assign(FM_SONGS, {
  // ⚓ 港の村：ゆったり、なみの ゆれる 感じ
  d_village: {
    bpm: 92, pad: 0.45, gain: 0.85,
    chords: '| C | Am | F | G | C | Am | Dm G | C |',
    lead: [['bell',
      'G5.3 E5.1 G5.4 A5.4 G5.4  E5.3 C5.1 E5.4 A5.8  F5.3 A5.1 C6.4 A5.4 F5.4  G5.3 B5.1 D6.4 B5.8 ' +
      'G5.3 E5.1 G5.4 C6.4 B5.4  A5.3 E5.1 A5.4 C6.8  D6.3 C6.1 A5.4 B5.3 G5.1 D6.4  C6.12 r.4']],
  },
  // 🌾 しおかぜの野原：ふなのり歌ふうの 元気な 曲
  d_field: {
    bpm: 128, pad: 0.4, bass: 'drive', gain: 0.8,
    chords: '| Dm | Dm | F | C | Dm | Bb | Gm A | Dm | F | C | Dm | Am | Bb | F | Gm | A |',
    lead: [['lead',
      'A4.2 D5.2 D5.2 D5.2 F5.4 E5.2 D5.2  C5.2 A4.2 A4.2 C5.2 D5.8  F5.2 A5.2 A5.2 A5.2 C6.4 A5.2 F5.2  G5.2 E5.2 C5.2 E5.2 G5.8 ' +
      'A5.2 F5.2 D5.2 F5.2 A5.4 G5.2 F5.2  Bb5.4 A5.2 G5.2 F5.8  G5.2 Bb5.2 D6.2 Bb5.2 C#6.4 A5.4  D6.12 r.4 ' +
      'C6.3 C6.1 A5.2 C6.2 F6.4 E6.2 C6.2  E6.3 D6.1 C6.2 G5.2 E6.8  D6.2 C6.2 A5.2 F5.2 D5.4 F5.4  E5.2 A5.2 C6.2 A5.2 E6.8 ' +
      'D6.2 Bb5.2 F5.2 D6.2 C6.4 Bb5.4  A5.2 C6.2 F6.4 C6.8  Bb5.2 D6.2 G6.4 F6.2 D6.2 Bb5.4  A5.2 C#6.2 E6.2 A6.2 G6.8']],
    drums: ['k...s..hk.h.s...', 'k.h.s..hk...s.hh'],
  },
  // 🏛 かげの灯台：しずかで ふしぎな 曲
  d_dungeon: {
    bpm: 76, pad: 0.5, bass: 'pulse', gain: 0.85,
    chords: '| Cm | Ab | Cm | G | Fm | Cm | Ab | G |',
    lead: [['horn',
      'C5.8 Eb5.4 G5.4  Ab5.8 G5.4 Eb5.4  C5.6 D5.2 Eb5.4 G5.4  D5.16 ' +
      'F5.8 Ab5.4 C6.4  G5.8 Eb5.4 C5.4  Ab4.4 C5.4 Eb5.4 Ab5.4  G5.12 r.4', 0.85],
      ['bell', 'r.12 G6.2 Eb6.2 r.12 C6.4 r.12 Ab5.2 C6.2 r.16 r.12 F6.2 Ab6.2 r.12 G6.4 r.16 r.12 D6.4', 0.35]],
  },
  // 🌱 たねの 中：まだ ねむっている いのちが、ゆっくり 息を する
  d_seed: {
    bpm: 84, pad: 0.55, bass: 'pulse', gain: 0.8,
    chords: '| F | Dm | Bb | C | F | Am | Bb | C |',
    lead: [['bell',
      'A5.4 C6.4 F6.8  D6.4 C6.4 A5.8  Bb5.4 D6.4 F6.8  G6.8 E6.8 ' +
      'A5.4 C6.4 F6.8  E6.4 C6.4 A5.8  Bb5.4 A5.4 G5.8  C6.16', 0.7]],
  },
  // ⚓ いかり番：はやく くるしい 曲
  d_boss: {
    bpm: 166, pad: 0.35, bass: 'drive', gain: 0.78,
    chords: '| Cm | Cm | Ab | G | Cm | Fm | Ab G | Cm |',
    lead: [['brass',
      'C5.2 C5.2 Eb5.2 G5.2 C6.4 Bb5.2 G5.2  Ab5.2 G5.2 F5.2 Eb5.2 G5.8  Ab5.2 C6.2 Eb6.2 C6.2 Ab5.4 Eb5.4  B4.2 D5.2 G5.2 B5.2 D6.8 ' +
      'C6.2 G5.2 Eb5.2 G5.2 C6.4 Eb6.4  F6.2 C6.2 Ab5.2 C6.2 F6.4 Eb6.2 C6.2  Ab5.4 C6.4 B5.4 D6.4  C6.12 r.4']],
    drums: ['x.h.s.h.x.x.s.hh', 'x.h.s.h.x.h.s.rr'],
  },
  // 🔦 火が ともった：あたたかい 曲
  d_ending: {
    bpm: 84, pad: 0.6, gain: 0.9,
    chords: '| C | F | G | C | Am | F | G | C |',
    lead: [['horn', 'E5.8 G5.4 C6.4  A5.8 C6.4 F6.4  G5.4 B5.4 D6.8  E6.12 r.4  C6.6 B5.2 A5.8  F5.4 A5.4 C6.8  D6.6 C6.2 B5.4 G5.4  C6.16', 0.9],
      ['bell', 'r.8 C6.4 E6.4 r.8 F6.4 A6.4 r.8 G6.4 B6.4 r.8 G6.4 C7.4 r.8 A6.4 C7.4 r.8 F6.4 A6.4 r.8 G6.4 B6.4 r.8 E6.4 C7.4', 0.4]],
  },
  // ✉️ 第2章：しおさいの島（さみしくて、きれいな 曲）
  d_shio: {
    bpm: 88, pad: 0.5, gain: 0.85,
    chords: '| Am | F | C | G | Am | F | Dm | G |',
    lead: [['bell',
      'E5.6 A5.2 C6.4 B5.4  A5.8 F5.4 C5.4  G5.6 E5.2 G5.4 C6.4  B5.8 D6.4 B5.4 ' +
      'C6.6 B5.2 A5.4 E5.4  F5.6 A5.2 C6.8  D6.6 C6.2 A5.4 F5.4  G5.8 B5.4 D6.4']],
  },
  // ✉️ てがみの 曲（ミオの メロディ）
  d_letter: {
    bpm: 72, pad: 0.55, gain: 0.85,
    chords: '| F | C | Dm | Bb | F | C | Bb C | F |',
    lead: [['bell',
      'A5.4 C6.4 F6.8  E6.4 D6.4 C6.8  D6.4 F6.4 A6.4 F6.4  D6.12 r.4 ' +
      'C6.4 A5.4 C6.8  G5.4 E6.4 D6.4 C6.4  Bb5.4 D6.4 C6.4 E6.4  F6.12 r.4']],
  },
  // 🌅 2つの 火が かさなる（ミオの メロディが 大きく なる）
  d_hikari: {
    bpm: 76, pad: 0.65, gain: 0.92,
    chords: '| F | C | Dm | Bb | F | C | Bb C | F | Dm | Bb | F | C | Dm | Bb | C | F |',
    lead: [['horn',
      'A5.4 C6.4 F6.8  E6.4 D6.4 C6.8  D6.4 F6.4 A6.4 F6.4  D6.12 r.4 ' +
      'C6.4 A5.4 C6.8  G5.4 E6.4 D6.4 C6.4  Bb5.4 D6.4 C6.4 E6.4  F6.12 r.4 ' +
      'F6.6 E6.2 D6.8  D6.4 F6.4 Bb6.8  A6.6 G6.2 F6.8  E6.4 G6.4 C7.8 ' +
      'A6.6 G6.2 F6.8  D6.4 F6.4 Bb6.8  C7.4 Bb6.4 A6.4 G6.4  F6.16', 0.9],
      ['bell', 'r.8 C6.4 F6.4 r.8 G6.4 C7.4 r.8 A6.4 D7.4 r.8 F6.4 Bb6.4 r.8 C6.4 F6.4 r.8 G6.4 C7.4 r.8 F6.4 G6.4 r.8 A6.4 C7.4 ' +
        'r.8 A6.4 D7.4 r.8 F6.4 Bb6.4 r.8 C7.4 F7.4 r.8 G6.4 C7.4 r.8 A6.4 D7.4 r.8 F6.4 Bb6.4 r.8 G6.4 C7.4 r.8 A6.4 F7.4', 0.4]],
  },
  // 🎁 手に入れた
  d_get: { bpm: 150, loop: false, lead: [['brass', 'G5.1 B5.1 D6.1 G6.2 F#6.1 G6.1 B6.6'], ['lead', 'D5.1 G5.1 B5.1 D6.2 D6.1 D6.1 G6.6', 0.6]] },
  // 🔓 しかけが とけた
  d_solve: { bpm: 170, loop: false, lead: [['bell', 'E6.1 A6.1 E7.2 r.1 C7.1 G7.5'], ['bell', 'C6.1 E6.1 C7.2 r.1 G6.1 E7.5', 0.5]] },
  // 🕯 ともしび石
  d_rest: { bpm: 110, loop: false, lead: [['bell', 'C6.2 E6.2 G6.2 E6.2 C7.8'], ['horn', 'C5.8 G5.8', 0.5]] },
});

// ── 音を 確実に 出す ──
//  ・音の オン／オフは この ゲームだけの 設定（森で 消していても、ここでは なる）
//  ・iPhone の マナーモードでも なるように、audioSession と 無音の <audio> を つかう
//  ・タップの たびに 音が 止まっていないか たしかめて、起こしなおす
const MUSIC_KEY = 'ena_densetsu_music';
FM.on = (() => { try { return localStorage.getItem(MUSIC_KEY) !== 'off'; } catch (e) { return true; } })();
const silentTag = (() => {
  // 0.5びょうの 無音 WAV
  const n = 4000, b = new Uint8Array(44 + n), v = new DataView(b.buffer), s = (o, t) => [...t].forEach((c, i) => { b[o + i] = c.charCodeAt(0); });
  s(0, 'RIFF'); v.setUint32(4, 36 + n, true); s(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); s(36, 'data'); v.setUint32(40, n, true); b.fill(128, 44);
  const a = new Audio('data:audio/wav;base64,' + btoa(String.fromCharCode(...b)));
  a.loop = true; a.setAttribute('playsinline', ''); a.volume = .01;
  return a;
})();
function musicWake() {
  if (!FM.on) return;
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
  const ctx = fmEnsure();
  if (!ctx) return;
  FM.master.gain.value = 1;     // 森より 大きめ
  if (silentTag.paused) { const p = silentTag.play(); if (p && p.catch) p.catch(() => {}); }
  const go = () => { if (FM.want && !FM.timer) { FM.name = null; fmPlay(FM.want); } };
  if (ctx.state !== 'running') { const p = ctx.resume(); if (p && p.then) p.then(go).catch(() => {}); } else go();
}
['touchend', 'click', 'pointerup', 'keydown'].forEach(n => document.addEventListener(n, musicWake, { passive: true, capture: true }));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) silentTag.pause();
  else if (FM.on && FM.want) musicWake();
});
function musicToggle() {
  FM.on = !FM.on;
  try { localStorage.setItem(MUSIC_KEY, FM.on ? 'on' : 'off'); } catch (e) {}
  if (FM.on) musicWake();
  else { const w = FM.want; fmStop(); FM.want = w; silentTag.pause(); }
  return FM.on;
}

const Sfx = (() => {
  function tone(type, f0, f1, dur, vol, delay) {
    if (!FM.on || !FM.ctx || FM.ctx.state !== 'running') return;
    const c = FM.ctx, t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g); g.connect(FM.sfx); o.start(t); o.stop(t + dur + .02);
  }
  function hiss(hz0, hz1, dur, vol) {
    if (!FM.on || !FM.ctx || FM.ctx.state !== 'running' || !FM.noise) return;
    const c = FM.ctx, t = c.currentTime, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = FM.noise; f.type = 'bandpass'; f.Q.value = 1.4;
    f.frequency.setValueAtTime(hz0, t); f.frequency.exponentialRampToValueAtTime(hz1, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    s.connect(f); f.connect(g); g.connect(FM.sfx); s.start(t); s.stop(t + dur + .02);
  }
  return {
    swing() { hiss(2400, 700, .12, .22); },
    hit() { tone('square', 340, 110, .1, .22); hiss(1800, 500, .07, .15); },
    ting() { tone('triangle', 1900, 1500, .12, .22); tone('square', 2600, 2100, .08, .08); },
    pop() { tone('square', 500, 70, .22, .2); hiss(1000, 200, .22, .22); },
    hurt() { tone('sawtooth', 420, 90, .28, .22); },
    wind() { hiss(500, 2600, .34, .34); },
    bush() { hiss(3200, 1200, .14, .2); },
    pick() { tone('triangle', 988, 988, .06, .2); tone('triangle', 1319, 1319, .1, .2, .06); },
    heal() { tone('triangle', 660, 1320, .2, .2); },
    push() { tone('sawtooth', 90, 70, .16, .14); },
    open() { tone('square', 200, 500, .22, .13); },
    door() { tone('square', 120, 240, .28, .16); hiss(600, 300, .28, .12); },
    fall() { tone('triangle', 900, 80, .5, .22); },
    text() { tone('square', 880, 880, .018, .035); },
    throw() { hiss(900, 300, .3, .24); },
    boom() { tone('sawtooth', 160, 30, .6, .32); hiss(800, 90, .6, .34); },
  };
})();
