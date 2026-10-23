// ============================================================
// 🎵 まよいの森の おんがく（js/forest.js から よぶ）
//   ・ドラクエ「ふう」の オリジナル曲（本物の 曲は つかわない）。音の ファイルは なく、WebAudio で その場で つくる
//   ・field＝フィールドの マーチ（ヘ長調）／battle＝たたかい（ニ短調）／boss＝ぬし（ハ短調・はやい）
//     victory＝かちの ファンファーレ／encounter＝モンスターが でた！／chest・heal＝みじかい ジングル
//   ・設定は ena_forest_music（'on' / 'off'）。iPhone・iPad は さいしょに タップするまで ならせない
// ============================================================
const FM_KEY = 'ena_forest_music';
const FM = {
  ctx: null, master: null, music: null, sfx: null,
  on: (() => { try { return localStorage.getItem(FM_KEY) !== 'off'; } catch (e) { return true; } })(),
  want: null,       // ならしたい 曲（音が まだ 起きていなくても おぼえておく）
  song: null, name: null, pos: 0, nextT: 0, timer: 0, once: false,
};

// ── 音名 → 周波数 ──
const FM_NOTE = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
function fmMidi(n) { const m = /^([A-G][#b]?)(\d)$/.exec(n); return m ? 12 * (+m[2] + 1) + FM_NOTE[m[1]] : null; }
function fmHz(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

// "C5.4 r.2 E5.2" → [[midi|null, 16ぶ音符の数], …]
function fmSeq(s) {
  return s.trim().split(/\s+/).map(tok => {
    const [n, l] = tok.split('.');
    return [n === 'r' ? null : fmMidi(n), +l];
  });
}
// コード名 → 3和音（低め）
const FM_CHORD = {
  F: ['F3', 'A3', 'C4'], C: ['E3', 'G3', 'C4'], C7: ['E3', 'Bb3', 'C4'], Dm: ['D3', 'F3', 'A3'], Bb: ['D3', 'F3', 'Bb3'],
  Am: ['E3', 'A3', 'C4'], Gm: ['D3', 'G3', 'Bb3'], A: ['E3', 'A3', 'C#4'], Cm: ['Eb3', 'G3', 'C4'], Ab: ['Eb3', 'Ab3', 'C4'],
  Eb: ['Eb3', 'G3', 'Bb3'], G: ['D3', 'G3', 'B3'], Fm: ['F3', 'Ab3', 'C4'],
};
const FM_ROOT = { F: 'F2', C: 'C2', C7: 'C2', Dm: 'D2', Bb: 'Bb1', Am: 'A1', Gm: 'G1', A: 'A1', Cm: 'C2', Ab: 'Ab1', Eb: 'Eb2', G: 'G1', Fm: 'F2' };

// 曲を「16ぶ音符ごとの できごと」に ならべる
function fmCompile(def) {
  const ev = [];
  const push = (inst, seq, t0, vel) => {
    let t = t0 || 0;
    seq.forEach(([m, l]) => { if (m !== null) ev.push({ t, inst, m, l, v: vel || 1 }); t += l; });
    return t;
  };
  let len = 0;
  (def.lead || []).forEach(([inst, s, v]) => { len = Math.max(len, push(inst, fmSeq(s), 0, v)); });
  // コード：1小節＝16。「F C」のように 2つ書くと 半分ずつ
  if (def.chords) {
    const bars = def.chords.trim().split('|').map(b => b.trim()).filter(Boolean);
    bars.forEach((bar, i) => {
      const cs = bar.split(/\s+/), each = 16 / cs.length;
      cs.forEach((c, j) => {
        const t = i * 16 + j * each;
        if (def.pad) FM_CHORD[c].forEach(n => ev.push({ t, inst: 'pad', m: fmMidi(n) + (def.padUp || 0), l: each, v: def.pad }));
        const r = fmMidi(FM_ROOT[c]), fifth = r + 7;
        (def.bass || 'march') === 'march'
          ? [r, fifth, r, fifth].slice(0, each / 4).forEach((m, k) => ev.push({ t: t + k * 4, inst: 'bass', m, l: 3, v: 1 }))
          : [r, r, r + 12, r, r, r + 12, r, r + 10].slice(0, each / 2).forEach((m, k) => ev.push({ t: t + k * 2, inst: 'bass', m, l: 1.6, v: 1 }));
      });
    });
    len = Math.max(len, bars.length * 16);
  }
  // たいこ：1小節 16もじ（k キック s スネア h ハット r ロール）
  if (def.drums) {
    const bars = Math.ceil(len / 16);
    for (let b = 0; b < bars; b++) {
      const pat = def.drums[b % def.drums.length];
      for (let i = 0; i < 16; i++) {
        const c = pat[i];
        if (c === 'k') ev.push({ t: b * 16 + i, inst: 'kick' });
        if (c === 's') ev.push({ t: b * 16 + i, inst: 'snare' });
        if (c === 'h') ev.push({ t: b * 16 + i, inst: 'hat' });
        if (c === 'x') { ev.push({ t: b * 16 + i, inst: 'kick' }); ev.push({ t: b * 16 + i, inst: 'hat' }); }
        if (c === 'r') { ev.push({ t: b * 16 + i, inst: 'snare', v: 0.55 }); ev.push({ t: b * 16 + i + 0.5, inst: 'snare', v: 0.45 }); }
      }
    }
  }
  const steps = Array.from({ length: Math.ceil(len) }, () => []);
  ev.forEach(e => { const i = Math.floor(e.t); if (steps[i]) steps[i].push(Object.assign({ off: e.t - i }, e)); });
  return { bpm: def.bpm, steps, len: Math.ceil(len), loop: def.loop !== false, gain: def.gain || 1 };
}

// ── 曲（すべて オリジナル）──
const FM_SONGS = {
  // 🌲 フィールド：ゆったりした マーチ（ヘ長調）
  field: {
    bpm: 112, pad: 0.55, bass: 'march',
    chords: '| F | C | Dm | Bb | F | Bb C | F | C | Dm | Am | Bb | F | Gm | C | F | C7 |',
    lead: [['lead',
      'C5.4 F5.6 G5.2 A5.4  G5.6 E5.2 C5.8  D5.4 F5.4 A5.6 G5.2  F5.12 r.4 ' +
      'A5.4 A5.2 Bb5.2 C6.8  D6.4 C6.4 Bb5.4 G5.4  A5.6 G5.2 F5.4 A5.4  G5.16 ' +
      'F5.4 E5.2 D5.2 A5.8  C6.4 A5.4 E5.8  D6.6 C6.2 Bb5.4 D6.4  C6.12 A5.4 ' +
      'Bb5.4 A5.2 G5.2 D6.8  C6.4 Bb5.4 A5.4 G5.4  A5.6 Bb5.2 C6.4 A5.4  G5.8 E5.4 C5.4'],
      ['horn',
      'r.16 r.16 r.16 D5.4 C5.4 Bb4.8 ' +
      'r.16 r.16 r.16 r.16 ' +
      'r.16 r.16 r.16 r.16 ' +
      'r.16 r.16 r.16 Bb4.8 G4.8', 0.7]],
    drums: ['k...s...k...s...', 'k...s...k...s.s.', 'k...s...k...s...', 'k...s...k.k.rrrr'],
  },
  // ⚔️ たたかい：はやい 8ぶの ベース（ニ短調）
  battle: {
    bpm: 152, pad: 0.35, bass: 'drive', gain: 0.95,
    chords: '| Dm | Dm | Bb | C | Dm | Dm | Bb | A |',
    lead: [['lead',
      'A5.2 r.2 A5.2 G5.2 A5.8  D6.4 C6.4 A5.4 F5.4  G5.2 r.2 G5.2 F5.2 G5.4 Bb5.4  A5.4 G5.4 E5.4 C5.4 ' +
      'D5.2 F5.2 A5.2 D6.2 C6.4 A5.4  F6.6 E6.2 D6.8  Bb5.4 D6.4 F6.4 E6.2 D6.2  C#6.8 E6.4 A5.4']],
    drums: ['x.h.s.h.x.h.s.h.', 'x.h.s.h.x.x.s.h.', 'x.h.s.h.x.h.s.h.', 'x.h.s.h.x.x.rrrr'],
  },
  // 👑 ぬし：ひくく おもい（ハ短調）
  boss: {
    bpm: 164, pad: 0.45, bass: 'drive', gain: 1,
    chords: '| Cm | Cm | Ab | Ab | Fm | G | Cm | G |',
    lead: [['brass',
      'C5.4 Eb5.4 G5.4 C6.4  B5.6 G5.2 Eb5.8  Ab5.4 C6.4 Eb6.4 C6.4  Ab5.12 r.4 ' +
      'F5.4 Ab5.4 C6.4 F6.4  D6.4 B5.4 G5.8  Eb6.4 D6.4 C6.4 G5.4  B5.8 D6.8']],
    drums: ['x.hsx.h.x.hsx.h.', 'x.hsx.h.x.hsxrrr'],
  },
  // 🏰 おしろの なか：ゆっくり おごそかな マーチ（イ短調）
  castle: {
    bpm: 92, pad: 0.6, bass: 'march', gain: 0.9,
    chords: '| Am | Dm | G | C | F | Dm | A | A |',
    lead: [['horn',
      'A4.8 C5.4 E5.4  F5.8 E5.4 D5.4  B4.8 D5.4 G5.4  E5.16 ' +
      'F5.6 E5.2 D5.4 C5.4  D5.8 F5.8  E5.6 D5.2 C#5.4 E5.4  A4.16'],
      ['bell', 'r.16 r.16 r.16 r.8 E6.4 C6.4  r.16 r.16 r.16 r.8 A5.8', 0.4]],
    drums: ['k.......s.......', 'k.......s...s.s.'],
  },
  // 🕊 へいわに なった おしろ：やさしい（ヘ長調）
  peace: {
    bpm: 100, pad: 0.6, bass: 'march', gain: 0.85,
    chords: '| F | Dm | Bb | C | F | Am | Bb C | F |',
    lead: [['bell',
      'A5.4 C6.4 A5.4 F5.4  D5.8 F5.8  Bb5.4 A5.4 G5.8  E5.16 ' +
      'F5.4 A5.4 C6.8  C6.4 E5.4 A5.8  D6.4 C6.4 Bb5.4 G5.4  F5.16', 0.8],
      ['lead', 'r.16 r.16 r.16 G5.4 A5.4 Bb5.8  r.16 r.16 r.16 A4.16', 0.5]],
    drums: ['k.......h.......', 'k.......h...h...'],
  },
  // 🌊 うみべ：あかるく はずむ（ハ長調）
  beach: {
    bpm: 126, pad: 0.45, bass: 'drive', gain: 0.9,
    chords: '| C | Am | F | G | C | Am | F G | C |',
    lead: [['lead',
      'E5.2 G5.2 C6.4 B5.2 A5.2 G5.4  E5.2 G5.2 A5.8 r.4  F5.2 A5.2 C6.4 A5.4 F5.4  G5.4 B5.4 D6.8 ' +
      'E6.2 D6.2 C6.4 G5.4 E5.4  A5.4 C6.4 E6.8  D6.4 C6.4 A5.2 B5.2 G5.4  C6.16'],
      ['bell', 'r.16 r.16 r.16 r.8 G6.4 E6.4  r.16 r.16 r.16 r.8 C7.8', 0.35]],
    drums: ['k.h.s.hkk.h.s.h.', 'k.h.s.hkk.h.s.hr'],
  },
  // 🕳 うみの どうくつ：ひんやり ふしぎ（ニ短調）
  seacave: {
    bpm: 84, pad: 0.65, bass: 'march', gain: 0.85,
    chords: '| Dm | Bb | Gm | A | Dm | Bb | Gm | A |',
    lead: [['bell',
      'D6.4 A5.4 F5.8  D6.4 Bb5.4 F5.8  G5.4 Bb5.4 D6.8  C#6.8 E6.8 ' +
      'F6.4 E6.4 D6.8  Bb5.4 D6.4 F6.8  G6.4 F6.4 D6.4 Bb5.4  A5.16', 0.7],
      ['horn', 'D4.16 Bb3.16 G3.16 A3.16 D4.16 Bb3.16 G3.16 A3.16', 0.5]],
    drums: ['k...............', 'k.......k.......'],
  },
  // 🏜 さばくの アジト：しのびあしの スパイ曲（ハ短調。はねる ベースと ちいさな 音）
  base: {
    bpm: 104, pad: 0.35, bass: 'drive', gain: 0.85,
    chords: '| Cm | Cm | Ab | G | Cm | Fm | Ab | G |',
    lead: [['lead',
      'C5.2 r.2 Eb5.2 r.2 G5.2 r.2 F5.2 Eb5.2  D5.4 r.4 G4.4 r.4  Ab4.2 r.2 C5.2 r.2 Eb5.2 r.2 D5.2 C5.2  B4.8 D5.4 G4.4 ' +
      'C5.2 r.2 Eb5.2 r.2 G5.2 r.2 Bb5.2 Ab5.2  G5.4 F5.4 Ab5.4 F5.4  Eb5.2 r.2 C5.2 r.2 Ab4.2 r.2 C5.2 Eb5.2  D5.8 B4.8', 0.6],
      ['bell', 'r.16 r.12 G6.4  r.16 r.12 B5.4  r.16 r.12 G6.4  r.16 D6.8 B5.8', 0.3]],
    drums: ['k...h...k.h.h...', 'k...h...k.h.h.hh'],
  },
  // 🌋 マグマの かざん：あつく もえあがる ビート（ニ短調）
  volcano: {
    bpm: 136, pad: 0.5, bass: 'drive', gain: 0.9,
    chords: '| Dm | Gm | C | A | Dm | Bb | Gm A | Dm |',
    lead: [['brass',
      'D5.4 F5.2 A5.2 D6.6 C6.2  Bb5.4 A5.4 G5.8  E5.4 G5.2 C6.2 E6.6 D6.2  C#6.8 E6.4 A5.4 ' +
      'F6.4 E6.2 D6.2 A5.4 F5.4  G5.4 Bb5.4 D6.8  E6.4 D6.4 C#6.4 A5.4  D6.12 r.4', 0.85],
      ['horn', 'A4.8 F4.8  G4.8 D4.8  G4.8 E4.8  A4.16  A4.8 F4.8  Bb4.8 F4.8  G4.8 A4.8  D4.16', 0.55]],
    drums: ['x.h.s.hkx.h.s.h.', 'x.h.s.hkx.x.s.hr'],
  },
  // ❗ みはりに みつかった！
  alert: { bpm: 180, loop: false, lead: [['brass', 'C6.2 r.1 C6.2 r.1 C6.2 r.1 Eb6.10'], ['lead', 'G5.2 r.1 G5.2 r.1 G5.2 r.1 Bb5.10', 0.7]], drums: ['x..x..x.r.......'] },
  // 🚁 さくせん せいこう！（ファンファーレ。1かいだけ）
  mission: {
    bpm: 132, loop: false, pad: 0.7, bass: 'march',
    chords: '| C | F G | C |',
    lead: [['brass', 'G5.2 C6.2 E6.2 G6.6 E6.2 F6.4  D6.2 B5.2 G5.4 D6.4  C6.16'],
      ['lead', 'E5.2 G5.2 C6.2 E6.6 C6.2 A5.4  B5.2 G5.2 D5.4 B5.4  E5.16', 0.6]],
    drums: ['x...x...x.x.x...', 'x.......x...rrrr', 'x...............'],
  },
  // 🎺 かちの ファンファーレ「たらら ら・ったっ・たた・たー」（オリジナル。1かいだけ）
  victory: {
    bpm: 138, loop: false, pad: 0.7, bass: 'march',
    chords: '| C | C |',
    lead: [['brass', 'C5.1 D5.1 E5.1 F5.1  G5.2 r.1 E5.1  G5.2 r.1 A5.1  C6.20'],
      ['lead', 'A4.1 B4.1 C5.1 D5.1  E5.2 r.1 C5.1  E5.2 r.1 F5.1  G5.20', 0.7],
      ['horn', 'r.4  C4.3 r.1  C4.3 r.1  E4.20', 0.9]],
    drums: ['....x...x...rrrr', 'k...............'],
  },
  // ❗ モンスターが でた！
  encounter: { bpm: 200, loop: false, lead: [['brass', 'C5.1 C#5.1 D5.1 D#5.1 E5.1 F5.1 F#5.1 G5.1 G#5.1 A5.1 A#5.1 B5.1 C6.6']], drums: ['............x...'] },
  // 📦 たからばこ
  chest: { bpm: 150, loop: false, lead: [['lead', 'A5.1 C#6.1 E6.1 A6.6'], ['lead', 'E5.1 A5.1 C#6.1 E6.6', 0.5]] },
  // ⛲ いずみ（やさしく）
  heal: { bpm: 96, loop: false, lead: [['bell', 'C6.2 G5.2 E6.2 C6.2 G6.8'], ['bell', 'E5.2 C5.2 G5.2 E5.2 C6.8', 0.5]] },
};
const FM_CACHE = {};

// ── 音を おこす ──
function fmEnsure() {
  if (FM.ctx) return FM.ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();
  FM.ctx = ctx;
  FM.master = ctx.createGain(); FM.master.gain.value = 0.55; FM.master.connect(ctx.destination);
  FM.music = ctx.createGain(); FM.music.gain.value = 0.7; FM.music.connect(FM.master);
  FM.sfx = ctx.createGain(); FM.sfx.gain.value = 0.9; FM.sfx.connect(FM.master);
  // ノイズ（たいこ用）
  const n = ctx.sampleRate;
  FM.noise = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = FM.noise.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}
// タップや キーで 音を おこす（iPhone・iPad は これが ないと ならない）
function fmUnlock() {
  if (!FM.on) return;
  const ctx = fmEnsure();
  if (!ctx) return;
  if (ctx.state !== 'running') ctx.resume().then(() => { if (FM.want && !FM.timer) fmPlay(FM.want); }).catch(() => {});
  else if (FM.want && !FM.timer) fmPlay(FM.want);
}
['pointerdown', 'keydown', 'touchend'].forEach(n => document.addEventListener(n, fmUnlock, { passive: true }));
document.addEventListener('visibilitychange', () => {
  if (!FM.ctx) return;
  if (document.hidden) FM.ctx.suspend().catch(() => {});
  else if (FM.on) FM.ctx.resume().catch(() => {});
});

// ── 楽器 ──
function fmEnv(g, t, a, peak, sustain, dur, rel) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + a);
  g.gain.linearRampToValueAtTime(peak * sustain, t + a + 0.08);
  g.gain.setValueAtTime(peak * sustain, t + Math.max(a + 0.08, dur));
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(a + 0.08, dur) + rel);
  return t + Math.max(a + 0.08, dur) + rel + 0.02;
}
function fmOsc(type, hz, t, end, dest, detune) {
  const o = FM.ctx.createOscillator();
  o.type = type; o.frequency.value = hz; if (detune) o.detune.value = detune;
  o.connect(dest); o.start(t); o.stop(end);
  return o;
}
function fmFilter(type, hz, dest) { const f = FM.ctx.createBiquadFilter(); f.type = type; f.frequency.value = hz; f.connect(dest); return f; }
function fmVoice(inst, m, t, dur, v, out) {
  const ctx = FM.ctx, hz = fmHz(m), g = ctx.createGain();
  g.connect(out);
  if (inst === 'lead') {           // 四角い 音を すこし まるく（ふえ）
    const end = fmEnv(g, t, 0.012, 0.13 * v, 0.75, dur * 0.92, 0.07);
    const f = fmFilter('lowpass', 2600, g);
    const o = fmOsc('square', hz, t, end, f);
    fmOsc('square', hz, t, end, f, 7);
    if (dur > 0.3) {                // のばす 音は ビブラート
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 5.5; lg.gain.value = hz * 0.006;
      lfo.connect(lg); lg.connect(o.frequency); lfo.start(t + 0.18); lfo.stop(end);
    }
  } else if (inst === 'brass') {   // ラッパ
    const end = fmEnv(g, t, 0.03, 0.12 * v, 0.8, dur * 0.95, 0.08);
    const f = fmFilter('lowpass', 1900, g);
    f.frequency.setValueAtTime(900, t); f.frequency.linearRampToValueAtTime(2300, t + 0.06);
    fmOsc('sawtooth', hz, t, end, f); fmOsc('sawtooth', hz, t, end, f, -8);
  } else if (inst === 'horn') {    // うしろで なる やわらかい 音
    const end = fmEnv(g, t, 0.06, 0.07 * v, 0.85, dur, 0.15);
    fmOsc('triangle', hz, t, end, fmFilter('lowpass', 1500, g));
  } else if (inst === 'pad') {     // げんがく（コード）
    const end = fmEnv(g, t, 0.09, 0.028 * v, 0.9, dur * 0.97, 0.18);
    const f = fmFilter('lowpass', 1300, g);
    fmOsc('sawtooth', hz, t, end, f, -6); fmOsc('sawtooth', hz, t, end, f, 6);
  } else if (inst === 'bass') {
    const end = fmEnv(g, t, 0.008, 0.26 * v, 0.7, dur * 0.85, 0.05);
    fmOsc('triangle', hz, t, end, g);
    fmOsc('square', hz, t, end, fmFilter('lowpass', 400, g)).detune.value = 0;
  } else if (inst === 'bell') {    // いずみの きらきら
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.14 * v, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.9);
    fmOsc('sine', hz, t, t + dur + 1, g); fmOsc('sine', hz * 2.01, t, t + dur + 1, g);
  }
}
function fmDrum(inst, t, v, out) {
  const ctx = FM.ctx, g = ctx.createGain();
  g.connect(out);
  v = v || 1;
  if (inst === 'kick') {
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(0.5 * v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g); o.start(t); o.stop(t + 0.18);
    return;
  }
  const src = ctx.createBufferSource();
  src.buffer = FM.noise;
  const f = fmFilter('highpass', inst === 'hat' ? 7000 : 1400, g);
  src.connect(f);
  const len = inst === 'hat' ? 0.035 : 0.12;
  g.gain.setValueAtTime((inst === 'hat' ? 0.06 : 0.2) * v, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  src.start(t, Math.random() * 0.5); src.stop(t + len + 0.02);
}

// ── ならす ──
function fmTick() {
  const s = FM.song, ctx = FM.ctx;
  if (!s || !ctx) return;
  const step = 60 / s.bpm / 4;
  while (FM.nextT < ctx.currentTime + 0.18) {
    if (FM.pos >= s.len) {
      if (!s.loop) { fmStopTimer(); if (FM.once) { FM.once = false; fmResumeAfter(); } return; }
      FM.pos = 0;
    }
    const out = FM.songOut;
    (s.steps[FM.pos] || []).forEach(e => {
      const t = FM.nextT + e.off * step;
      if (e.m === undefined) fmDrum(e.inst, t, e.v, out);
      else fmVoice(e.inst, e.m, t, e.l * step, e.v || 1, out);
    });
    FM.pos++;
    FM.nextT += step;
  }
}
function fmStopTimer() { clearInterval(FM.timer); FM.timer = 0; }
function fmGetSong(name) { return FM_CACHE[name] || (FM_CACHE[name] = fmCompile(FM_SONGS[name])); }

/** 曲を ながす（field / battle / boss はくりかえし、victory・encounter は 1かい） */
function fmPlay(name) {
  FM.want = name;
  if (!FM.on || !name) return fmStopTimer();
  const ctx = fmEnsure();
  if (!ctx || ctx.state !== 'running') return;    // タップで 起きたら fmUnlock が もういちど よぶ
  if (FM.name === name && FM.timer) return;
  fmStopTimer();
  // まえの 曲の のこりを すっと けす
  if (FM.songOut) { const old = FM.songOut; old.gain.setTargetAtTime(0, ctx.currentTime, 0.05); setTimeout(() => old.disconnect(), 400); }
  FM.songOut = ctx.createGain();
  FM.songOut.connect(FM.music);
  const song = fmGetSong(name);
  FM.songOut.gain.value = song.gain;
  FM.song = song; FM.name = name; FM.pos = 0; FM.nextT = ctx.currentTime + 0.05;
  FM.once = false;
  fmTick();
  FM.timer = setInterval(fmTick, 25);
}
/** 1かいだけの 曲（ファンファーレ・でた！）。おわったら next を ながす */
function fmOnce(name, next) {
  FM.after = next || null;
  fmPlay(name);
  FM.want = next || null;
  FM.once = true;
}
function fmResumeAfter() { if (FM.after) { const n = FM.after; FM.after = null; FM.name = null; fmPlay(n); } }
function fmStop() { FM.want = null; FM.after = null; fmStopTimer(); FM.name = null; if (FM.songOut && FM.ctx) FM.songOut.gain.setTargetAtTime(0, FM.ctx.currentTime, 0.08); }

/** みじかい ジングル：BGM を すこし さげて ならす */
function fmJingle(name) {
  if (!FM.on) return;
  const ctx = fmEnsure();
  if (!ctx || ctx.state !== 'running') return;
  const s = fmGetSong(name), step = 60 / s.bpm / 4, t0 = ctx.currentTime + 0.03;
  const dur = s.len * step + 0.6;
  FM.music.gain.setTargetAtTime(0.18, t0, 0.04);
  FM.music.gain.setTargetAtTime(0.7, t0 + dur, 0.2);
  s.steps.forEach((evs, i) => evs.forEach(e => {
    const t = t0 + (i + e.off) * step;
    if (e.m === undefined) fmDrum(e.inst, t, e.v, FM.sfx);
    else fmVoice(e.inst, e.m, t, e.l * step, e.v || 1, FM.sfx);
  }));
}

/** 🎵 ⇄ 🔇（かえした あとの じょうたいを かえす） */
function fmToggle() {
  FM.on = !FM.on;
  try { localStorage.setItem(FM_KEY, FM.on ? 'on' : 'off'); } catch (e) {}
  if (FM.on) { const w = FM.want; fmUnlock(); if (w) { FM.name = null; fmPlay(w); } }
  else { const w = FM.want; fmStop(); FM.want = w; }
  return FM.on;
}
