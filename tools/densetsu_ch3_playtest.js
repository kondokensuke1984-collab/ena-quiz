// アンリノの伝説 第3章：十字パッドと ボタンの タッチ操作で「たねの ふかみ」を 通しで 遊ぶ テスト
//   python3 -m http.server 8765 を ena-quiz で 動かしてから
//   node tools/densetsu_ch3_playtest.js [shots-dir]    （playwright-core が 読める 場所で）
const { chromium } = require('playwright-core');
const SHOTS = process.argv[2] || '/tmp/densetsu_ch3';
const BOT = () => {
  const A = window.__AN, { G, P, ROOMS } = A;
  A.manual(true);
  const pad = document.getElementById('pad');
  let held = null, frames = 0;
  const ev = (el, type, x, y) => el.dispatchEvent(new PointerEvent(type, { pointerId: 1, bubbles: true, cancelable: true, clientX: x, clientY: y }));
  function hold(dx, dy) {
    const k = dx + ',' + dy;
    if (held === k) return;
    const r = pad.getBoundingClientRect(), x = r.left + r.width / 2 + dx * r.width * .35, y = r.top + r.height / 2 + dy * r.height * .35;
    if (!dx && !dy) { if (held) ev(pad, 'pointerup', x, y); held = null; return; }
    ev(pad, held ? 'pointermove' : 'pointerdown', x, y); held = k;
  }
  const btn = id => { const el = document.getElementById(id); ev(el, 'pointerdown', 0, 0); ev(el, 'pointerup', 0, 0); };
  function step(n = 1) {
    for (let i = 0; i < n; i++) {
      A.S.hp = A.S.maxHp;
      A.step(1);
      if (++frames > 300000) throw new Error('時間切れ room=' + G.id);
      let guard = 0;
      while (G.mode === 'dialog') { if (++guard > 4000) throw new Error('会話が おわらない'); btn('btnC'); A.step(1); }
    }
  }
  const settle = () => { for (let i = 0; i < 90 && G.mode !== 'play'; i++) step(1); };
  const tc = () => [Math.floor(P.x / 16), Math.floor(P.y / 16)];
  function bfs(goal) {
    const [sc, sr] = tc(), key = (c, r) => c + ',' + r, prev = { [key(sc, sr)]: null }, q = [[sc, sr]];
    while (q.length) {
      const [c, r] = q.shift();
      if (c === goal[0] && r === goal[1]) { const path = []; let k = key(c, r); while (k) { path.unshift(k.split(',').map(Number)); k = prev[k]; } return path; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nc = c + dx, nr = r + dy;
        if (nc < 0 || nc > 14 || nr < 0 || nr > 10 || key(nc, nr) in prev || !A.passable(nc, nr)) continue;
        if (G.ents.some(e => e.t === 'warp' && e.tx === nc && e.ty === nr)) continue;
        prev[key(nc, nr)] = key(c, r); q.push([nc, nr]);
      }
    }
    return null;
  }
  function walkTo(c, r) {
    let safety = 0;
    const room0 = G.id;
    for (;;) {
      if (G.id !== room0) { hold(0, 0); return; }
      if (++safety > 5000) throw new Error(`たどりつけない ${G.id} → ${c},${r} いま ${tc()}`);
      const path = bfs([c, r]);
      if (!path) throw new Error(`道が ない ${G.id} → ${c},${r} いま ${tc()}`);
      const next = path[1] || path[0], tx = next[0] * 16 + 8, ty = next[1] * 16 + 8, dx = tx - P.x, dy = ty - P.y;
      if (path.length === 1 && Math.abs(dx) < 3 && Math.abs(dy) < 3) { hold(0, 0); step(2); return; }
      hold(Math.abs(dx) >= 3 ? Math.sign(dx) : 0, Math.abs(dy) >= 3 ? Math.sign(dy) : 0);
      step(1);
    }
  }
  function face(dx, dy) { hold(dx, dy); step(1); hold(0, 0); step(1); }
  function touch(e) {
    while (P.kt > 0) step(1);   // はじかれている あいだは むきを かえられない
    for (const [dx, dy] of [[0, 1], [0, -1], [-1, 0], [1, 0]]) {
      const c = e.tx + dx, r = e.ty + dy;
      if (!A.passable(c, r) || !bfs([c, r])) continue;
      walkTo(c, r); face(-dx, -dy); btn('btnC'); step(1);
      return;
    }
    throw new Error('近づけない ' + JSON.stringify(e.def));
  }
  const ent = (t, f) => { const e = G.ents.find(x => x.t === t && A.active(x) && f(x)); if (!e) throw new Error(`${t} が ない ${G.id}`); return e; };
  const stone = id => ent('qstone', x => x.def.id === id);
  const click = (sel, text) => { const b = [...document.querySelectorAll(sel)].find(x => text === undefined || x.textContent === text); if (!b) throw new Error('ボタンが ない ' + sel + ' ' + text); b.click(); A.step(1); };
  function solve(id) {
    const p = c3Puzzle(id);
    touch(stone(id));
    if (G.mode !== 'riddle') throw new Error('石板が ひらかない ' + id);
    if (p.form === 'parts') p.parts.forEach(x => click('#rdBtns .chBtn', x.a));
    else if (p.form === 'word') Array.from(p.kana).forEach(k => click('#rdBtns .chBtn', k));
    else {
      click('#rdClose'); step(2);
      if (p.form === 'opts') {
        const ans = c3Question(id).answer;
        touch(ent('qopt', x => x.def.id === id && c3Order(id)[x.def.slot] === ans));
        click('#chBtns .chBtn', 'これだ！');
      } else {
        p.correct.forEach(i => { touch(ent('qopt', x => x.def.id === id && c3Order(id)[x.def.slot] === i)); step(2); });
        touch(stone(id)); click('#chBtns .chBtn', 'これで きめる');
      }
    }
    step(4); settle();
    if (!c3Solved(id)) throw new Error('とけない ' + id);
  }
  // へやの はしの 出口から となりへ
  function go(side) {
    const from = G.id, [c, r] = { n: [7, 0], s: [7, 10], w: [0, 5], e: [14, 5] }[side], [dx, dy] = { n: [0, -1], s: [0, 1], w: [-1, 0], e: [1, 0] }[side];
    walkTo(c, r); hold(dx, dy);
    for (let i = 0; i < 200 && G.id === from; i++) step(1);
    hold(0, 0); settle();
    if (G.id === from) throw new Error(`出られない ${from} ${side}`);
  }
  function fightBoss() {
    for (let i = 0; i < 12000 && A.boss(); i++) {
      const e = A.boss(), dx = e.x - P.x, dy = e.y - P.y, d = Math.hypot(dx, dy);
      if (e.aura) {
        if (Math.abs(dx) < 7 || Math.abs(dy) < 7) { Math.abs(dx) > Math.abs(dy) ? face(Math.sign(dx), 0) : face(0, Math.sign(dy)); btn('btnB'); step(30); }
        else { hold(Math.abs(dx) < Math.abs(dy) ? Math.sign(dx) : 0, Math.abs(dx) < Math.abs(dy) ? 0 : Math.sign(dy)); step(2); }
      } else if (d < 28) { Math.abs(dx) > Math.abs(dy) ? face(Math.sign(dx), 0) : face(0, Math.sign(dy)); btn('btnA'); step(18); }
      else { hold(Math.sign(Math.round(dx / 8)), Math.sign(Math.round(dy / 8))); step(2); }
    }
    hold(0, 0);
    if (A.boss()) throw new Error('ぬしを たおせない');
    for (let i = 0; i < 400 && G.mode !== 'fade' && G.id === 't8'; i++) step(1);
    settle();
  }
  window.__BOT = { step, settle, solve, go, touch, stone, ent, click, face, walkTo, fightBoss, btn, hold, get frames() { return frames; } };
};
(async () => {
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 1 });
  const p = await c.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/favicon|fonts\.g|ERR_/.test(m.text())) errs.push(m.text()); });
  require('fs').mkdirSync(SHOTS, { recursive: true });
  const shot = n => p.evaluate(() => __AN.render()).then(() => p.screenshot({ path: `${SHOTS}/${n}.png` }));
  const URL = 'http://localhost:8765/densetsu/index.html?unlock=1&debug=1';
  await p.goto(URL); await p.waitForTimeout(300);
  await p.evaluate(() => { localStorage.setItem('ena_densetsu_clear', JSON.stringify({ c1: { maxHp: 8, shells: 3 }, c2: true })); localStorage.setItem('ena_daily_202611_2026-11-9', JSON.stringify({ answered: 7 })); });
  await p.reload(); await p.waitForTimeout(400);
  await p.click('#btnChapters'); await p.click('#cpBtns .chBtn:has-text("第3章")');
  await p.waitForTimeout(100); await p.evaluate(BOT);
  const run = async (name, fn, arg) => { const r = await p.evaluate(fn, arg); console.log('✓', name, r === undefined ? '' : r); };
  await run('村長の場面→ねもと', async () => { await c3Load(); __BOT.step(40); __BOT.settle(); __BOT.step(40); __BOT.settle(); return __AN.G.id; });
  await shot('b0');
  await run('たねに入る', () => { const B = __BOT; B.touch(B.ent('story', () => true)); B.step(60); B.settle(); return __AN.G.id; });
  await shot('t0');
  await run('わざと まちがえる', () => {
    const B = __BOT, A = __AN; A.S.hp = 4; B.touch(B.stone('ta1_b01'));
    return 'riddle:' + A.G.mode;
  });
  await p.evaluate(() => __AN.render()); await p.screenshot({ path: `${SHOTS}/t0_riddle.png` });
  const wrong = await p.evaluate(() => {
    const A = __AN, rd = document.querySelector('#rdBtns'), first = c3Puzzle('ta1_b01').parts[0];
    const hp0 = A.S.hp, n0 = A.G.ents.filter(e => e.enemy).length;
    [...rd.querySelectorAll('.chBtn')].find(b => b.textContent !== first.a).click();
    A.step(1); let g = 0;
    while (A.G.mode === 'dialog' && g++ < 3000) { document.getElementById('btnC').dispatchEvent(new PointerEvent('pointerdown', { pointerId: 1, bubbles: true })); A.step(1); }
    return { hp0, hp1: A.S.hp, enemies0: n0, enemies1: A.G.ents.filter(e => e.enemy).length, solved: c3Solved('ta1_b01') };
  });
  console.log('まちがえたとき', JSON.stringify(wrong));
  if (wrong.hp1 !== wrong.hp0 - 1 || wrong.enemies1 !== wrong.enemies0 + 1 || wrong.solved) throw new Error('まちがえた ときの うごきが ちがう');
  await run('t0', () => { __BOT.solve('ta1_b01'); __BOT.go('n'); return __AN.G.id; });
  await shot('t1');
  await run('子葉の へや', () => { const B = __BOT; B.go('w'); B.solve('ta1_b02'); return c3Solved('ta1_b02'); });
  await run('図の 謎の 画面', () => { __BOT.touch(__BOT.stone('ta1_b02')); __BOT.step(40); __BOT.settle(); return __AN.G.mode; });
  await run('子葉 おく', () => { const B = __BOT; B.walkTo(7, 3); B.solve('ta1_b06'); B.walkTo(7, 5); B.go('e'); return __AN.G.id; });
  await run('胚乳の へや', () => { const B = __BOT; B.go('e'); B.solve('ta1_b10'); B.walkTo(7, 3); B.solve('ta1_b05'); return __AN.flag('c3_t1n'); });
  await shot('t3_after');
  await run('めざめの 間へ', () => { const B = __BOT; B.walkTo(7, 5); B.go('w'); B.go('n'); return __AN.G.id; });
  await run('3条件', () => { __BOT.solve('ta1_b12'); return [__AN.flag('c3_water'), __AN.S.tool]; });
  await shot('t4_water');
  await run('t4 なぜ', () => { const B = __BOT; B.solve('ta1_b18'); B.go('n'); return __AN.G.id; });
  await run('水で はし', () => {
    const B = __BOT, A = __AN; B.walkTo(7, 8); B.face(0, -1); B.btn('btnB'); B.step(60);
    if (!A.flag('c3_v1')) throw new Error('はしが かからない'); B.walkTo(7, 3); return A.tileAt(7, 4);
  });
  await shot('t5');
  await run('実験室', () => { const B = __BOT; B.solve('ta1_r04'); B.go('n'); return __AN.G.id; });
  await run('ひかりの へや', () => { const B = __BOT, A = __AN; if (A.tileAt(7, 0) !== 'Q') throw new Error('かくし とびらが はじめから ある'); B.solve('ta1_b15'); B.solve('ta1_b08'); const t = A.tileAt(7, 0); B.go('n'); return [t, A.G.id]; });
  await run('根の 道', () => { const B = __BOT; B.solve('ta1_b17'); B.go('n'); return __AN.G.id; });
  await shot('t8');
  await run('たて（謎の まえ）', () => { const B = __BOT, A = __AN; const e = A.boss(); B.walkTo(7, 8); B.face(0, -1); B.btn('btnB'); B.step(60); return A.boss().aura; });
  await run('ぬしの 謎', () => { __BOT.solve('ta1_k02'); return c3Solved('ta1_k02'); });
  await run('ぬしと たたかう', () => { __BOT.fightBoss(); return [__AN.flag('c3_b1'), __AN.flag('c3_a1'), __AN.G.id]; });
  await shot('end');
  const res = await p.evaluate(() => ({ solved: C3_UNITS[0].ids.filter(c3Solved).length, daily: localStorage.getItem('ena_daily_202611_2026-11-9'), dailyKeys: Object.keys(localStorage).filter(k => k.startsWith('ena_daily_')).length, frames: __BOT.frames, deaths: __AN.S.deaths }));
  console.log('結果', JSON.stringify(res));
  // はみ出し：石板の 文と 図が 画面に おさまるか
  const over = await p.evaluate(() => {
    const A = __AN, out = [], box = document.getElementById('rdBox');
    A.G.mode = 'play';
    C3_UNITS[0].ids.forEach(id => { c3Open(id); const t = document.getElementById('rdText'); if (t.scrollHeight > t.clientHeight + 2 || box.scrollHeight > box.clientHeight + 2) out.push([id, t.scrollHeight, t.clientHeight, box.scrollHeight, box.clientHeight]); c3CloseRiddle(); A.G.mode = 'play'; });
    return out;
  });
  console.log('はみ出す 石板', JSON.stringify(over));
  await p.evaluate(() => { __AN.G.mode = 'play'; c3Open('ta1_r04'); __AN.render(); }); await p.waitForTimeout(250); await p.screenshot({ path: `${SHOTS}/r04.png` });
  await p.evaluate(() => { c3CloseRiddle(); __AN.G.mode = 'play'; c3Open('ta1_b10'); }); await p.waitForTimeout(200); await p.screenshot({ path: `${SHOTS}/b10.png` });
  await p.evaluate(() => { c3CloseRiddle(); __AN.G.mode = 'play'; c3Open('ta1_b02'); }); await p.waitForTimeout(200); await p.screenshot({ path: `${SHOTS}/b02.png` });
  // 読みなおして つづきから
  await p.reload(); await p.waitForTimeout(400);
  console.log('再読込', await p.textContent('#logoSub'), await p.isVisible('#btnCont'));
  console.log('errors', JSON.stringify(errs));
  await b.close();
  if (errs.length || over.length) process.exitCode = 1;
})().catch(e => { console.error(e); process.exit(1); });
