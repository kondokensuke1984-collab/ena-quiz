// アンリノの伝説 第3章：謎の 対応表が 問題データと 合っているかの 検査
//   node tools/densetsu_ch3_check.js
//   ・選んだ 問題が ぜんぶ データに ある／重複が ない
//   ・parts / word の 答え、multi の 正解が 問題データの 答えと 合う
//   ・部屋に おいた 謎（qstone）と 台座（qopt）の 数が 選択肢と 合う
//   ・C3_ROUTE に ある 謎は ぜんぶ 部屋に おかれている
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = { ROOMS: {}, console };
vm.createContext(ctx);
for (const f of ['densetsu/ch3_puzzles.js', 'densetsu/ch3.js']) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
const get = n => vm.runInContext(n, ctx);
const UNITS = get('C3_UNITS'), PUZ = get('C3_PUZZLES'), ROUTE = get('C3_ROUTE'), ROOMS = get('C3_ROOMS');
const q = {}; JSON.parse(fs.readFileSync(path.join(root, 'data/questions_202611.json'), 'utf8')).forEach(x => { q[x.id] = x; });
const bad = [], err = m => bad.push(m);
const all = UNITS.flatMap(u => u.ids);
if (all.length !== 53) err(`選んだ 問題が ${all.length}問（53問の はず）`);
if (new Set(all).size !== all.length) err('選んだ 問題に 重複が ある');
all.forEach(id => { if (!q[id]) err(`データに ない: ${id}`); });
const needOpts = id => { const x = q[id], p = PUZ[id]; if (p && p.form === 'multi') return p.options.length; if (p) return 0; return x.options ? x.options.length : -1; };
for (const [id, p] of Object.entries(PUZ)) {
  const ans = String(q[id].answer);
  if (!all.includes(id)) err(`対応表に あるが 選んでいない: ${id}`);
  if (p.form === 'parts') p.parts.forEach(x => { if (!ans.includes(x.a)) err(`${id} ${x.label}: 「${x.a}」は 答えに ない（${ans}）`); if (!x.pick.includes(x.a)) err(`${id} ${x.label}: 札に 答えが ない`); if (!ans.includes(x.label + (id.includes('b02') ? '：' : '') + x.a)) err(`${id} ${x.label}: 記号と 言葉の 組が 答えと ちがう（${ans}）`); });
  if (p.form === 'word' && !ans.includes(p.word)) err(`${id}: 「${p.word}」は 答えに ない（${ans}）`);
  if (p.form === 'multi') p.marks.forEach((m, i) => { const has = ans.includes(m), want = p.correct.includes(i); if (has !== want) err(`${id}: ${m} の 正誤が 答えと ちがう（${ans}）`); });
}
const placed = {}, opts = {};
for (const [rid, r] of Object.entries(ROOMS)) {
  if (r.map.length !== 11 || r.map.some(l => l.length !== 15)) err(`${rid}: へやの 大きさが ちがう`);
  for (const e of r.ents || []) {
    if (e.t === 'qstone') { if (placed[e.id]) err(`${e.id}: 石板が 2つ`); placed[e.id] = rid; }
    if (e.t === 'qopt') (opts[e.id] = opts[e.id] || []).push(e.slot);
  }
}
for (const [id, s] of Object.entries(opts)) { const n = needOpts(id); if (s.length !== n || new Set(s).size !== n) err(`${id}: 台座 ${s.length}こ（選択肢 ${n}こ）`); }
for (const id of Object.keys(placed)) if (needOpts(id) > 0 && !opts[id]) err(`${id}: 台座が ない`);
Object.keys(placed).forEach(id => { if (!PUZ[id] && !q[id].options) err(`選択肢が なく、対応表にも ない: ${id}`); });
ROUTE.forEach(([id]) => { if (!placed[id]) err(`案内に あるが 部屋に ない: ${id}`); });
Object.keys(placed).forEach(id => { if (!ROUTE.some(r => r[0] === id)) err(`部屋に あるが 案内に ない: ${id}`); });
const count = UNITS.map(u => `${u.key} ${u.ids.filter(i => placed[i]).length}/${u.ids.length}`).join('  ');
console.log(`部屋に おいた 謎: ${Object.keys(placed).length}/${all.length}（${count}）`);
if (bad.length) { console.log('✗ ' + bad.join('\n✗ ')); process.exit(1); }
console.log('✓ 対応表は 問題データと 合っています');
