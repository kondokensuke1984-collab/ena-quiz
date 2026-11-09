// ============================================================
// 🌱 アンリノの伝説 第3章「めぶきの たね」
//   ・game.js より 先に よむ。関数は 実行するときに game.js の ものを つかう。
//   ・小さくなって たねの 中へ 入り、理科の 知識で 謎の とびらを あける。
//   ・すすみ具合は セーブの S.f だけ。q_問題ID：とけた 謎 / ch3 はじまった / c3_water めざめの水
//     c3_v1 つるの はし / c3_t1n ふたまたの とびら / c3_b1 ぬし / c3_a1 たねの ふかみ クリア
//   ・ここで といても「その日 50もん」には 数えない（ena_daily_* には 書かない）
// ============================================================

// ── へや ──（Q たねの かべ  q 子葉の ゆか  j 胚乳の ゆか  V つるの はし  P あな）
const C3_ROOMS = {
  b0: { name: 'ミオの木の ねもと', music: 'd_shio', map: [
    'TTTTTTTTTTTTTTT',
    'T.............T',
    'T.............T',
    'T.............T',
    'T.............T',
    'T.....EE......T',
    'T.............T',
    'T.............T',
    'T.............T',
    'T.............T',
    'TTTTTTTTTTTTTTT'],
    deco: [{ t: 'bigtree', x: 6, y: 5 }, { t: 'wither', unless: 'c3_a1' }],
    ents: [{ t: 'story', x: 7, y: 7, kind: 'c3seed' }] },
  t0: { name: '種皮の げんかん', music: 'd_seed', dg: true, n: 't1', map: [
    'QQQQQQQqQQQQQQQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QQQQQQQqQQQQQQQ'],
    ents: [
      { t: 'door', side: 'n', kind: 'riddle', flag: 'q_ta1_b01' },
      { t: 'warp', x: 7, y: 10, to: 'b0', tx: 7, ty: 9, dir: 'd' },
      { t: 'qstone', x: 7, y: 4, id: 'ta1_b01' },
      { t: 'sign', x: 3, y: 2, text: ['たねの いちばん 外がわ、「種皮」の 中だ。\nとじた とびらは、知識で ひらく。'] },
    ] },
  t1: { name: 'ふたまたの ひろま', music: 'd_seed', dg: true, n: 't4', s: 't0', w: 't2', e: 't3', map: [
    'QQQQQQQqQQQQQQQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqQqqqqqQqqqQ',
    'QqqqqqqqqqqqqqQ',
    'qqqqqqqqqqqqqqq',
    'QqqqqqqqqqqqqqQ',
    'QqqqQqqqqqQqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QQQQQQQqQQQQQQQ'],
    ents: [
      { t: 'door', side: 'n', kind: 'riddle', flag: 'c3_t1n' },
      { t: 'stone', x: 7, y: 8 },
      { t: 'sign', x: 5, y: 2, text: ['にしは 子葉に 養分を ためる たね。\nひがしは 胚乳に 養分を ためる たね。\nふたつの 謎を とくと、きたの とびらが ひらく。'] },
      { t: 'slime', x: 3, y: 2 }, { t: 'slime', x: 11, y: 8 },
    ] },
  t2: { name: '子葉の へや', music: 'd_seed', dg: true, e: 't1', map: [
    'QQQQQQQQQQQQQQQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QQQQQQQQQQQQQQQ',
    'Qqqqqqqqqqqqqqq',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QQQQQQQQQQQQQQQ'],
    patches: [{ if: 'q_ta1_b02', at: [[7, 4, 'q']] }],
    ents: [
      { t: 'qstone', x: 7, y: 7, id: 'ta1_b02' },
      { t: 'slime', x: 3, y: 8 }, { t: 'bat', x: 11, y: 7 },
      { t: 'qstone', x: 2, y: 1, id: 'ta1_b06', if: 'q_ta1_b02' },
      { t: 'qopt', x: 4, y: 2, id: 'ta1_b06', slot: 0, look: 'door', unless: 'q_ta1_b06' },
      { t: 'qopt', x: 6, y: 2, id: 'ta1_b06', slot: 1, look: 'door', unless: 'q_ta1_b06' },
      { t: 'qopt', x: 8, y: 2, id: 'ta1_b06', slot: 2, look: 'door', unless: 'q_ta1_b06' },
      { t: 'qopt', x: 10, y: 2, id: 'ta1_b06', slot: 3, look: 'door', unless: 'q_ta1_b06' },
    ] },
  t3: { name: '胚乳の へや', music: 'd_seed', dg: true, w: 't1', map: [
    'QQQQQQQQQQQQQQQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QQQQQQQQQQQQQQQ',
    'jjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QQQQQQQQQQQQQQQ'],
    patches: [{ if: 'q_ta1_b10', at: [[7, 4, 'j']] }],
    ents: [
      { t: 'qstone', x: 7, y: 7, id: 'ta1_b10' },
      { t: 'slime', x: 11, y: 8 }, { t: 'slime', x: 4, y: 8 },
      { t: 'qstone', x: 2, y: 1, id: 'ta1_b05', if: 'q_ta1_b10' },
      { t: 'qopt', x: 4, y: 2, id: 'ta1_b05', slot: 0, unless: 'q_ta1_b05' },
      { t: 'qopt', x: 6, y: 2, id: 'ta1_b05', slot: 1, unless: 'q_ta1_b05' },
      { t: 'qopt', x: 8, y: 2, id: 'ta1_b05', slot: 2, unless: 'q_ta1_b05' },
      { t: 'qopt', x: 10, y: 2, id: 'ta1_b05', slot: 3, unless: 'q_ta1_b05' },
      { t: 'qopt', x: 12, y: 2, id: 'ta1_b05', slot: 4, unless: 'q_ta1_b05' },
    ] },
  t4: { name: 'めざめの 間', music: 'd_seed', dg: true, n: 't5', s: 't1', map: [
    'QQQQQQQqQQQQQQQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QQQQQQQqQQQQQQQ'],
    ents: [
      { t: 'door', side: 'n', kind: 'riddle', flag: 'q_ta1_b18' },
      { t: 'qstone', x: 7, y: 7, id: 'ta1_b12', unless: 'q_ta1_b12' },
      { t: 'qopt', x: 3, y: 4, id: 'ta1_b12', slot: 0, unless: 'q_ta1_b12' },
      { t: 'qopt', x: 5, y: 4, id: 'ta1_b12', slot: 1, unless: 'q_ta1_b12' },
      { t: 'qopt', x: 7, y: 4, id: 'ta1_b12', slot: 2, unless: 'q_ta1_b12' },
      { t: 'qopt', x: 9, y: 4, id: 'ta1_b12', slot: 3, unless: 'q_ta1_b12' },
      { t: 'qopt', x: 11, y: 4, id: 'ta1_b12', slot: 4, unless: 'q_ta1_b12' },
      { t: 'qstone', x: 7, y: 7, id: 'ta1_b18', if: 'q_ta1_b12' },
      { t: 'qopt', x: 4, y: 4, id: 'ta1_b18', slot: 0, look: 'door', if: 'q_ta1_b12', unless: 'q_ta1_b18' },
      { t: 'qopt', x: 6, y: 4, id: 'ta1_b18', slot: 1, look: 'door', if: 'q_ta1_b12', unless: 'q_ta1_b18' },
      { t: 'qopt', x: 8, y: 4, id: 'ta1_b18', slot: 2, look: 'door', if: 'q_ta1_b12', unless: 'q_ta1_b18' },
      { t: 'qopt', x: 10, y: 4, id: 'ta1_b18', slot: 3, look: 'door', if: 'q_ta1_b12', unless: 'q_ta1_b18' },
    ] },
  t5: { name: 'はっけんの 実験室', music: 'd_seed', dg: true, n: 't6', s: 't4', map: [
    'QQQQQQQqQQQQQQQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QPPPPPPPPPPPPPQ',
    'QPPPPPPPPPPPPPQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QQQQQQQqQQQQQQQ'],
    patches: [{ if: 'c3_v1', at: [[7, 4, 'V'], [7, 5, 'V']] }],
    ents: [
      { t: 'door', side: 'n', kind: 'riddle', flag: 'q_ta1_r04' },
      { t: 'sprout', x: 7, y: 6, flag: 'c3_v1', unless: 'c3_v1' },
      { t: 'bat', x: 3, y: 8 },
      { t: 'qstone', x: 2, y: 1, id: 'ta1_r04' },
      { t: 'qopt', x: 4, y: 2, id: 'ta1_r04', slot: 0, unless: 'q_ta1_r04' },
      { t: 'qopt', x: 6, y: 2, id: 'ta1_r04', slot: 1, unless: 'q_ta1_r04' },
      { t: 'qopt', x: 8, y: 2, id: 'ta1_r04', slot: 2, unless: 'q_ta1_r04' },
      { t: 'qopt', x: 10, y: 2, id: 'ta1_r04', slot: 3, unless: 'q_ta1_r04' },
      { t: 'qopt', x: 12, y: 2, id: 'ta1_r04', slot: 4, unless: 'q_ta1_r04' },
    ] },
  t6: { name: 'ひかりの へや', music: 'd_seed', dg: true, n: 't7', s: 't5', map: [
    'QQQQQQQQQQQQQQQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QjjjjjjjjjjjjjQ',
    'QQQQQQQjQQQQQQQ'],
    patches: [{ if: 'q_ta1_b08', at: [[7, 0, 'j']] }],
    ents: [
      { t: 'qstone', x: 7, y: 7, id: 'ta1_b15', unless: 'q_ta1_b15' },
      { t: 'qopt', x: 4, y: 3, id: 'ta1_b15', slot: 0, look: 'seed', unless: 'q_ta1_b15' },
      { t: 'qopt', x: 6, y: 3, id: 'ta1_b15', slot: 1, look: 'seed', unless: 'q_ta1_b15' },
      { t: 'qopt', x: 8, y: 3, id: 'ta1_b15', slot: 2, look: 'seed', unless: 'q_ta1_b15' },
      { t: 'qopt', x: 10, y: 3, id: 'ta1_b15', slot: 3, look: 'seed', unless: 'q_ta1_b15' },
      { t: 'qstone', x: 7, y: 7, id: 'ta1_b08', if: 'q_ta1_b15' },
      { t: 'qopt', x: 4, y: 3, id: 'ta1_b08', slot: 0, look: 'seed', if: 'q_ta1_b15', unless: 'q_ta1_b08' },
      { t: 'qopt', x: 6, y: 3, id: 'ta1_b08', slot: 1, look: 'seed', if: 'q_ta1_b15', unless: 'q_ta1_b08' },
      { t: 'qopt', x: 8, y: 3, id: 'ta1_b08', slot: 2, look: 'seed', if: 'q_ta1_b15', unless: 'q_ta1_b08' },
      { t: 'qopt', x: 10, y: 3, id: 'ta1_b08', slot: 3, look: 'seed', if: 'q_ta1_b15', unless: 'q_ta1_b08' },
    ] },
  t7: { name: '根の 道', music: 'd_seed', dg: true, n: 't8', s: 't6', map: [
    'QQQQQQQqQQQQQQQ',
    'QqqqqqqqqqqqqqQ',
    'QqQQQqqqqqQQQqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqQQQqqqqqQQQqQ',
    'QqqqqqqqqqqqqqQ',
    'QQQQQQQqQQQQQQQ'],
    ents: [
      { t: 'door', side: 'n', kind: 'riddle', flag: 'q_ta1_b17' },
      { t: 'guard', x: 4, y: 5 }, { t: 'guard', x: 10, y: 5 },
      { t: 'stone', x: 1, y: 9 },
      { t: 'qstone', x: 7, y: 7, id: 'ta1_b17' },
      { t: 'qopt', x: 4, y: 4, id: 'ta1_b17', slot: 0, look: 'door', unless: 'q_ta1_b17' },
      { t: 'qopt', x: 6, y: 4, id: 'ta1_b17', slot: 1, look: 'door', unless: 'q_ta1_b17' },
      { t: 'qopt', x: 8, y: 4, id: 'ta1_b17', slot: 2, look: 'door', unless: 'q_ta1_b17' },
      { t: 'qopt', x: 10, y: 4, id: 'ta1_b17', slot: 3, look: 'door', unless: 'q_ta1_b17' },
    ] },
  t8: { name: 'からっぽの 間', music: 'd_boss', dg: true, s: 't7', bossFlag: 'c3_b1', bossMsg: 'からっぽの かげを たおした！\nたねの 中に、あたたかい 光が もどってくる！', map: [
    'QQQQQQQQQQQQQQQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QqqqqqqqqqqqqqQ',
    'QQQQQQQqQQQQQQQ'],
    ents: [
      { t: 'boss', x: 7, y: 4, ink: true, needQ: 'q_ta1_k02', unless: 'c3_b1' },
      { t: 'qstone', x: 13, y: 5, id: 'ta1_k02' },
      { t: 'qopt', x: 2, y: 2, id: 'ta1_k02', slot: 0, look: 'door', unless: 'q_ta1_k02' },
      { t: 'qopt', x: 12, y: 2, id: 'ta1_k02', slot: 1, look: 'door', unless: 'q_ta1_k02' },
      { t: 'qopt', x: 2, y: 8, id: 'ta1_k02', slot: 2, look: 'door', unless: 'q_ta1_k02' },
      { t: 'qopt', x: 12, y: 8, id: 'ta1_k02', slot: 3, look: 'door', unless: 'q_ta1_k02' },
    ] },
};
Object.assign(ROOMS, C3_ROOMS);

// ── 問題を 読む ──
const C3 = { q: null, loading: null, order: {}, sel: {}, rd: null, seen: {}, syncKey: '' };
const c3Puzzle = id => C3_PUZZLES[id] || { form: 'opts' };
const c3Question = id => (C3.q || {})[id];
const c3Text = id => c3Question(id).q.replace(/^[^\n]*\n/, '');
const c3Options = id => { const p = c3Puzzle(id); return p.options || c3Question(id).options.map(o => o.replace(/^[ア-ン]：/, '')); };
const c3Pages = id => c3Question(id).explanation.split('\n').filter(Boolean);
const c3Solved = id => flag('q_' + id);
function c3Load() {
  if (C3.loading) return C3.loading;
  C3.loading = fetch('/data/questions_202611.json').then(r => { if (!r.ok) throw new Error('load'); return r.json(); }).then(list => {
    const q = {}; list.forEach(x => { q[x.id] = x; });
    C3.q = q;
    C3_UNITS.forEach(u => u.ids.forEach(id => { if (q[id] && q[id].qImage) new Image().src = q[id].qImage; }));
  }).catch(e => { C3.loading = null; throw e; });
  return C3.loading;
}
function c3Ready(cb) {
  if (C3.q) return cb();
  c3Load().then(() => { if (G.mode === 'play') cb(); }).catch(() => say('石板の 字が よめない……\nインターネットに つないで、もう いちど しらべてみよう。', null, 'コロン'));
}
function c3Shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function c3Order(id) {
  if (!C3.order[id]) {
    const idx = c3Options(id).map((_, i) => i), p = c3Puzzle(id), q = c3Question(id);
    C3.order[id] = q.keepOrder || p.look === 'jar' ? idx : c3Shuffle(idx);
  }
  return C3.order[id];
}
const c3Sel = id => C3.sel[id] || (C3.sel[id] = new Set());

// ── 石板と 台座 ──
function c3Stone(e) {
  const id = e.def.id;
  c3Ready(() => {
    if (c3Solved(id)) return say(['この 謎は もう といたよ。', ...c3Pages(id)], null, 'コロン');
    const p = c3Puzzle(id);
    if (p.form === 'multi' && c3Sel(id).size) return c2Choose('えらんだ ものに きめる？', ['これで きめる', 'もんだいを 読む'], i => { if (i) c3Open(id); else c3JudgeMulti(id); });
    c3Open(id);
  });
}
function c3Opt(e) {
  const { id, slot } = e.def;
  c3Ready(() => {
    const i = c3Order(id)[slot], text = c3Options(id)[i], p = c3Puzzle(id);
    if (p.form === 'multi') {
      const s = c3Sel(id);
      if (s.has(i)) { s.delete(i); toast(`${text} を やめた`); } else { s.add(i); toast(`${text} を えらんだ`); }
      Sfx.text();
      return;
    }
    c2Choose(text, ['これだ！', 'やめる'], k => { if (k) return; if (i === c3Question(id).answer) c3Solve(id); else c3Wrong(id); });
  });
}
function c3DrawOpt(e, x, y) {
  const { id, slot } = e.def, p = c3Puzzle(id);
  if (!C3.q) { Art.c3Opt(g, x, y, frame, e.def.look || p.look, false); return; }
  const i = c3Order(id)[slot], look = e.def.look || (p.looks ? p.looks[i] : p.look);
  Art.c3Opt(g, x, y, frame, look, !!(C3.sel[id] && C3.sel[id].has(i)));
  if (Math.hypot(x + 8 - P.x, y + 8 - P.y) > 30) return;
  const t = c3Options(id)[i], s = t.length > 8 ? 'しらべる' : t;
  g.font = '10px DotGothic16, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const w = g.measureText(s).width + 6, lx = Math.max(w / 2, Math.min(W - w / 2, x + 8));
  g.fillStyle = 'rgba(10,14,40,.82)'; g.fillRect(Math.round(lx - w / 2), y - 13, Math.round(w), 12);
  g.fillStyle = '#fff7e0'; g.fillText(s, Math.round(lx), y - 7);
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
}
function c3Open(id) {
  const q = c3Question(id), p = c3Puzzle(id), img = $('rdImg');
  G.mode = 'riddle';
  C3.rd = { id, part: 0, typed: '' };
  $('rdText').textContent = c3Text(id);
  img.hidden = !q.qImage; img.classList.remove('big');
  if (q.qImage) img.src = q.qImage;
  $('ovRiddle').hidden = false;
  $('rdClose').textContent = p.form === 'parts' || p.form === 'word' ? 'やめる' : 'とじる';
  $('rdSlots').textContent = ''; $('rdPrompt').textContent = ''; $('rdBtns').textContent = '';
  $('rdBtns').className = p.form === 'word' ? 'kana' : '';
  if (p.form === 'parts') c3ShowPart();
  if (p.form === 'word') c3ShowWord();
}
function c3CloseRiddle() {
  if (G.mode !== 'riddle') return;
  const rd = C3.rd, p = rd && c3Puzzle(rd.id);
  $('ovRiddle').hidden = true; C3.rd = null; G.mode = 'play'; input.ap = input.bp = input.cp = false;
  if (rd && !C3.seen[rd.id] && (p.form === 'opts' || p.form === 'multi')) {
    C3.seen[rd.id] = 1;
    colonSay(p.form === 'multi' ? 'ひつような ものを ぜんぶ えらんでから、\nもう いちど 石板を しらべて きめよう！' : 'まわりの 台や とびらを しらべて、\n正しいと 思うものを えらぼう！');
  }
}
function c3Btn(box, label, fn) {
  const b = document.createElement('button');
  b.className = 'mbtn chBtn'; b.textContent = label;
  b.addEventListener('click', fn);
  box.appendChild(b);
}
function c3ShowPart() {
  const rd = C3.rd, p = c3Puzzle(rd.id), part = p.parts[rd.part], box = $('rdBtns');
  $('rdSlots').textContent = p.parts.slice(0, rd.part).map(x => `${x.label} ${x.a}`).join('　');
  $('rdPrompt').textContent = `${part.label} は どれ？`;
  box.textContent = '';
  c3Shuffle(part.pick.slice()).forEach(t => c3Btn(box, t, () => {
    if (t !== part.a) return c3LeaveWrong(rd.id);
    Sfx.text();
    if (++rd.part < p.parts.length) return c3ShowPart();
    c3LeaveRight(rd.id);
  }));
}
function c3ShowWord() {
  const rd = C3.rd, p = c3Puzzle(rd.id), box = $('rdBtns');
  $('rdPrompt').textContent = 'かなの 石を じゅんに おして、言葉を 彫ろう';
  const chars = Array.from(p.kana);
  const paint = () => { $('rdSlots').textContent = Array.from(rd.typed).concat(Array(chars.length - Array.from(rd.typed).length).fill('＿')).join(' '); };
  paint();
  box.textContent = '';
  c3Shuffle(Array.from(new Set(chars.concat(Array.from(p.extra))))).forEach(k => c3Btn(box, k, () => {
    rd.typed += k; Sfx.text(); paint();
    if (Array.from(rd.typed).length < chars.length) return;
    if (rd.typed === p.kana) c3LeaveRight(rd.id); else c3LeaveWrong(rd.id);
  }));
}
function c3HideRiddle() { $('ovRiddle').hidden = true; C3.rd = null; G.mode = 'play'; input.ap = input.bp = input.cp = false; }
function c3LeaveRight(id) { c3HideRiddle(); c3Solve(id); }
function c3LeaveWrong(id) { c3HideRiddle(); c3Wrong(id); }
function c3JudgeMulti(id) {
  const s = c3Sel(id), want = c3Puzzle(id).correct;
  if (s.size === want.length && want.every(i => s.has(i))) c3Solve(id); else c3Wrong(id);
}
function c3Solve(id) {
  fmJingle('d_solve'); G.c2Flash = 24; Sfx.door();
  setFlag('q_' + id);
  delete C3.order[id]; delete C3.sel[id];
  const done = C3_UNITS.reduce((n, u) => n + u.ids.filter(c3Solved).length, 0);
  toast(`なぞを といた！ ${done}／53`);
  say(['そのとおり！', ...c3Pages(id)], () => { if (C3_AFTER[id]) C3_AFTER[id](); }, 'コロン');
}
function c3Wrong(id) {
  delete C3.order[id]; delete C3.sel[id];
  say(['ちがうみたい……。', ...c3Pages(id), 'かげが 出てきた！\n台の ならびも かわったよ。もう いちど！'], () => {
    P.inv = 0; hurtPlayer(1, P.x, P.y - 10);
    if (G.mode === 'play' && G.ents.filter(e => e.enemy).length < 5) c3SpawnSlime();
  }, 'コロン');
}
function c3SpawnSlime() {
  const spots = [];
  for (let r = 1; r < ROWS - 1; r++) for (let c = 1; c < COLS - 1; c++) {
    const t = tileAt(c, r);
    if ((t === 'q' || t === 'j') && Math.hypot(c * TILE + 8 - P.x, r * TILE + 8 - P.y) > 56 && !G.ents.some(e => !e.enemy && e.tx === c && e.ty === r)) spots.push([c, r]);
  }
  if (!spots.length) return;
  const [x, y] = spots[Math.floor(Math.random() * spots.length)];
  G.ents.push(mkEnemy({ t: 'slime', x, y }));
}

// ── 謎が とけた あとの できごと ──
function c3Seal() {
  if (c3Solved('ta1_b05') && c3Solved('ta1_b06') && !flag('c3_t1n')) {
    setFlag('c3_t1n');
    colonSay('ふたつの たねの ちがいが わかったね！\nふたまたの ひろまの きたの とびらが ひらいたよ！');
  }
}
const C3_AFTER = {
  ta1_b05: c3Seal, ta1_b06: c3Seal,
  ta1_b12: () => {
    S.f.c3_water = 1; S.tool = 'water'; writeSave();
    give('water', () => colonSay('水と 空気と 温度で、たねが 目を さました！\nめざめの水は 🔁 で つぼと とりかえられるよ。'));
  },
  ta1_b15: () => colonSay('つぎの 謎が あらわれたよ！\nもう いちど 石板を 読んでみて。'),
  ta1_b08: () => { Sfx.door(); colonSay('見て！ かべだった ところに、\nかくし とびらが ひらいたよ！'); },
  ta1_k02: () => colonSay('かげの たてが ゆらいだ！\nめざめの水を かけて たてを はがしたら、ぼうで たたこう！'),
};

// ── めざめの水 ──
function c3Shot(w, e) {
  if (w.kind !== 'water' || e.t !== 'sprout' || !overlap(w.x - 3, w.y - 3, 6, 6, e.x, e.y, 16, 16)) return false;
  w.life = 0; G.c2Flash = 14; fmJingle('d_solve');
  setFlag(e.def.flag);
  toast('芽が のびて、はしに なった！');
  return true;
}
function c3Sync() {
  const on = !!(S && flag('ch3')), tool = on ? (S.tool || 'jar') : 'jar', key = `${on}|${tool}|${flag('c3_water')}`;
  if (key === C3.syncKey) return;
  C3.syncKey = key;
  $('iconB').textContent = tool === 'water' ? '💧' : '🏺';
  $('btnB').lastChild.textContent = tool === 'water' ? 'みず' : 'つぼ';
  $('btnTool').hidden = !(on && flag('c3_water'));
  $('btnZukan').hidden = !on;
}
function c3SwapTool() {
  if (G.mode !== 'play' || !S || !flag('c3_water')) return;
  S.tool = S.tool === 'water' ? 'jar' : 'water'; writeSave(); Sfx.text(); c3Sync();
  toast(S.tool === 'water' ? 'めざめの水 に かえた' : 'しおかぜの つぼ に かえた');
}

// ── へやに 入ったときの できごと（ダイアログを 出したら true）──
const C3_ENTER = {
  t0: ['ここが たねの 中……！\nかべも ゆかも、ぜんぶ たねで できてるんだ。', '石板の 謎を とくと、とびらが ひらくみたい。\nアンリノ、いっしょに 考えよう！'],
  t4: ['たねが ねむっている ばしょだ。\nここで 目を さまさせれば、芽が 出るはず！'],
  t5: ['あなの むこうに 行けないね……。\nしおれた 芽に、めざめの水を かけてみよう！'],
  t6: ['あれ？ この へや、出口が ないよ。\n謎を とけば、なにか おこるかも！'],
  t8: ['あれが たねの 養分を うばった かげだ！\nまず 石板の 謎を とかないと、たてが きかないよ！'],
};
function c3Tick() {
  c3Sync();
  if (!S || !flag('ch3')) return false;
  if (!C3.q && !C3.loading) c3Load().catch(() => {});
  if (C3_ENTER[G.id] && !flag('c3_e_' + G.id)) {
    S.f['c3_e_' + G.id] = 1; writeSave();
    colonSay(C3_ENTER[G.id]);
    return true;
  }
  if (G.id === 't8' && flag('c3_b1') && !flag('c3_a1')) { c3AreaClear(); return true; }
  return false;
}
function c3AreaClear() {
  S.f.c3_a1 = 1; writeSave();
  say(['たねが、とくん、と 動いた。', 'ミオの木の 最後の たねが、\n目を さましたんだ！', 'コロン「やったね！ 外へ もどって みよう！」'], () => {
    fmJingle('d_get');
    startFade('b0', 120, 136, 'u');
  }, '');
}

// ── はじまり ──
function c3NewGame(clear) {
  S = Object.assign(newSave(), { staff: true, jar: true, tool: 'jar', maxHp: Math.max((clear.c1 && clear.c1.maxHp) || 8, 8), shells: (clear.c1 && clear.c1.shells) || 0, f: { ending: 1, boss_dead: 1, ch2: 1, c2_end: 1, ch3: 1 } });
  S.hp = S.maxHp; writeSave();
  $('ovTitle').hidden = true; $('ovEnd').hidden = true; $('btnEnd').hidden = true; $('btnCh2End').hidden = true;
  G.end = null; fmUnlock();
  G.mode = 'play'; c2ListBack = 'play';
  enterRoom('h1', 120, 104, 'u');
  c2RefreshBtn();
  c3Load().catch(() => {});
  const n = NAMES.turtle;
  say(['アンリノ、よく きてくれた。', 'かげが 島じゅうの 緑を うばっておる。\nミオの木も、もう 葉が 黄色くなって しもうた。', 'じゃが、木は さいごに 1つぶ、たねを のこした。\nこの たねが 目を さませば、まだ まにあう。', 'カメの ひみつの 術で、そなたを 小さくしよう。\nたねの 中へ 入って、たねを おこしてやっておくれ。'], () => {
    startFade('b0', 120, 136, 'u');
  }, n);
}
function c3TalkTurtle() {
  say(flag('c3_a1') ? 'おお、たねが 目を さましたか！\nミオも きっと よろこんで おるよ。' : 'たねの 中は どうじゃな。\n知識は、かげにも うばえぬ 力じゃ。', null, NAMES.turtle);
}
function c3Seed() {
  if (flag('c3_a1')) return colonSay('たねが 目を さましたよ！\nつぎの 冒険は、もうすこし まってね。');
  say('ミオの木が のこした、最後の たね。\n手を ふれると、体が すうっと 小さくなった……', () => {
    c3Load().catch(() => {});
    startFade('t0', 120, 136, 'u');
  });
}
function c3Hint() {
  const next = C3_ROUTE.find(r => !c3Solved(r[0]));
  if (next) return `つぎは「${next[1]}」だよ。\n${next[2]}`;
  if (!flag('c3_b1')) return 'かげの たてを 水で はがして、\nぼうで たたこう！';
  return 'たねが 目を さましたよ！\nつぎの 冒険は、もうすこし まってね。';
}

// ── いのちの ずかん ──
function c3OpenZukan() {
  if (G.mode !== 'play' || !S || !flag('ch3')) return;
  G.mode = 'list'; c2ListBack = 'play';
  const box = $('lsBtns'); box.textContent = '';
  $('lsTitle').textContent = 'いのちの ずかん（といた なぞ）';
  C3_UNITS.forEach(u => {
    const n = u.ids.filter(c3Solved).length;
    c3Btn(box, `${u.label}\n${n}／${u.ids.length}`, () => {
      const left = C3_ROUTE.filter(r => u.ids.includes(r[0]) && !c3Solved(r[0])).map(r => r[1]);
      $('lsTitle').textContent = n === u.ids.length ? `${u.label}：ぜんぶ といた！` : left.length ? `のこりの なぞ：${Array.from(new Set(left)).join('、')}` : 'この なぞは つぎの エリアに あるよ';
    });
  });
  $('ovList').hidden = false;
}
function c3Init() {
  ITEM_TEXT.water = ['めざめの水 を 手に入れた！', 'ボタンで まっすぐ 水を とばせる！\nしおれた 芽に かけると、ぐんぐん のびるよ。'];
  $('rdClose').addEventListener('click', c3CloseRiddle);
  $('rdImg').addEventListener('click', () => $('rdImg').classList.toggle('big'));
  $('btnTool').addEventListener('click', c3SwapTool);
  $('btnZukan').addEventListener('click', c3OpenZukan);
}
