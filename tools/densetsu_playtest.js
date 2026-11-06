// アンリノの伝説：十字パッドと ボタンへの タッチ操作だけで 始めから 終わりまで 遊ぶ テスト
//   python3 -m http.server 8765 を ena-quiz で 動かしてから
//   node tools/densetsu_playtest.js [shots-dir]    （playwright-core が 読める 場所で）
const { chromium } = require('playwright-core');
const BOT = () => {
  const A = window.__AN, { G, P, input, ROOMS } = A;
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
  class Died extends Error {}
  function step(n = 1) {
    for (let i = 0; i < n; i++) {
      A.step(1); frames++;
      if (frames > 400000) throw new Error('時間切れ room=' + G.id);
      if (G.mode === 'dead') { hold(0, 0); A.step(60); document.getElementById('btnRetry').click(); A.step(2); throw new Died(); }
      for (;;) {
        if (G.mode === 'dialog') { btn('btnC'); A.step(1); frames++; }
        else if (G.mode === 'letter') { document.getElementById('ovLetter').click(); A.step(1); frames++; }
        else if (G.mode === 'choice') { const bs = [...document.querySelectorAll('#chBtns .chBtn')]; (window.__pickFirst ? bs[0] : bs[bs.length - 1]).click(); window.__pickFirst = false; A.step(1); frames++; }
        else break;
      }
    }
  }
  const tc = () => [Math.floor(P.x / 16), Math.floor(P.y / 16)];
  const warpAt = (c, r) => G.ents.some(e => e.t === 'warp' && e.tx === c && e.ty === r);
  function bfs(goal) {
    const [sc, sr] = tc(), key = (c, r) => c + ',' + r, prev = { [key(sc, sr)]: null }, q = [[sc, sr]];
    while (q.length) {
      const [c, r] = q.shift();
      if (c === goal[0] && r === goal[1]) {
        const path = []; let k = key(c, r);
        while (k) { path.unshift(k.split(',').map(Number)); k = prev[k]; }
        return path;
      }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nc = c + dx, nr = r + dy;
        if (nc < 0 || nc > 14 || nr < 0 || nr > 10 || key(nc, nr) in prev) continue;
        const isGoal = nc === goal[0] && nr === goal[1];
        if (!A.passable(nc, nr) && !isGoal) continue;
        if (warpAt(nc, nr) && !isGoal) continue;
        prev[key(nc, nr)] = key(c, r); q.push([nc, nr]);
      }
    }
    return null;
  }
  const enemies = () => G.ents.filter(e => e.enemy);
  function fight() {
    let best = null, bd = 1e9;
    for (const e of enemies()) { const d = Math.hypot(e.x - P.x, e.y - P.y); if (d < bd) { bd = d; best = e; } }
    if (!best || !A.S.staff) return false;
    const dx = best.x - P.x, dy = best.y - P.y, tough = best.shield || best.aura;
    if (tough) {
      if (!A.S.jar) return false;
      if (bd > 110 || (Math.abs(dx) > 5 && Math.abs(dy) > 5)) return false;
      face(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]);
      btn('btnB'); step(16); return true;
    }
    if (bd > 28) return false;
    face(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]);
    btn('btnA'); step(16); return true;
  }
  function face([dx, dy]) { hold(dx, dy); step(1); hold(0, 0); }
  function walkTo(c, r, noFight) {
    let stuck = 0, lx = -1, ly = -1, safety = 0;
    const room0 = G.id;
    for (;;) {
      if (G.id !== room0 || G.mode === 'fade') { hold(0, 0); return; }   // 入口を ふんで へやが かわった
      if (++safety > 9000) throw new Error(`たどりつけない ${G.id} → ${c},${r} いま ${tc()}`);
      const [cc, cr] = tc();
      if (cc === c && cr === r && Math.abs(P.x - (c * 16 + 8)) < 3 && Math.abs(P.y - (r * 16 + 8)) < 3) { hold(0, 0); return; }
      if (!noFight && fight()) continue;
      const path = bfs([c, r]);
      if (!path) throw new Error(`道が ない ${G.id} → ${c},${r} いま ${tc()}`);
      const [nc, nr] = path[1] || [c, r], tx = nc * 16 + 8, ty = nr * 16 + 8;
      const dx = tx - P.x, dy = ty - P.y;
      // 曲がる前に 通路の まんなかへ
      if (Math.abs(dx) >= Math.abs(dy) && Math.abs(dy) > 1.5 && Math.abs(dx) > 2) hold(0, Math.sign(dy));
      else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dx) > 1.5 && Math.abs(dy) > 2) hold(Math.sign(dx), 0);
      else if (Math.abs(dx) > 1.5) hold(Math.sign(dx), 0);
      else if (Math.abs(dy) > 1.5) hold(0, Math.sign(dy));
      else hold(0, 0);
      step(1);
      if (Math.abs(P.x - lx) + Math.abs(P.y - ly) < .1) { if (++stuck > 90) { hold(0, 0); step(20); stuck = 0; } } else stuck = 0;
      lx = P.x; ly = P.y;
    }
  }
  function neighbors(id) {
    const r = ROOMS[id], out = [];
    ['n', 's', 'e', 'w'].forEach(k => { if (r[k]) out.push([r[k], k]); });
    (r.ents || []).forEach(e => { if (e.t === 'warp') out.push([e.to, e]); });
    return out;
  }
  function route(from, to) {
    const prev = { [from]: null }, q = [from];
    while (q.length) { const c = q.shift(); if (c === to) break; for (const [n, how] of neighbors(c)) if (!(n in prev)) { prev[n] = [c, how]; q.push(n); } }
    const out = []; let c = to; while (prev[c]) { out.unshift([c, prev[c][1]]); c = prev[c][0]; }
    return out;
  }
  function exitVia(how) {
    const start = G.id;
    if (typeof how === 'object') { walkTo(how.x, how.y); hold(0, how.y === 10 ? 1 : -1); let n = 0; while (G.id === start || G.mode === 'fade') { step(1); hold(0, 0); if (++n > 300) throw new Error('warp 失敗 ' + start); } while (G.mode !== 'play') step(1); return; }
    const [dx, dy] = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] }[how];
    const cand = [];
    for (let i = 0; i < 15; i++) for (let j = 0; j < 11; j++) {
      const edge = how === 'n' ? j === 0 : how === 's' ? j === 10 : how === 'e' ? i === 14 : i === 0;
      if (edge && A.passable(i, j)) { const p = bfs([i, j]); if (p) cand.push([p.length, i, j]); }
    }
    if (!cand.length) throw new Error(`出口が ない ${G.id} ${how}`);
    cand.sort((a, b) => a[0] - b[0]);
    walkTo(cand[0][1], cand[0][2]);
    hold(dx, dy); let n = 0;
    while (G.id === start) { step(1); if (++n > 200) throw new Error('出られない ' + start + ' ' + how); }
    hold(0, 0);
    while (G.mode !== 'play') step(1);
  }
  function toRoom(id) { while (G.id !== id) { const r = route(G.id, id); if (!r.length) throw new Error('へやの道が ない ' + G.id + '→' + id); exitVia(r[0][1]); } }
  function hunt() {
    let n = 0;
    while (enemies().length) {
      if (++n > 3000) throw new Error('たおせない ' + G.id + ' ' + enemies().map(e => e.kind));
      if (fight()) continue;
      const e = enemies()[0]; let c = Math.floor(e.x / 16), r = Math.floor(e.y / 16);
      const p = bfs([c, r]);
      if (!p || p.length < 2) { step(5); continue; }
      const [nc, nr] = p[1]; hold(Math.sign(Math.round(nc * 16 + 8 - P.x)), 0);
      if (Math.abs(nc * 16 + 8 - P.x) < 2) hold(0, Math.sign(Math.round(nr * 16 + 8 - P.y)));
      step(3); hold(0, 0);
    }
  }
  const take = (x, y, dir) => { walkTo(x, y); face(dir); step(1); btn('btnC'); step(3); hold(0, 0); };
  const gust = (x, y, dir) => { walkTo(x, y, true); face(dir); btn('btnB'); step(40); };
  function pushUntil(cond, x, y, dir) { walkTo(x, y); let n = 0; hold(...dir); while (!cond()) { step(1); if (++n > 900) throw new Error('押せない ' + G.id); } hold(0, 0); }
  const log = [];
  function stage(name, done, fn) {
    let tries = 0;
    while (!done()) {
      if (++tries > 8) throw new Error('やりなおし多すぎ: ' + name);
      try { fn(); } catch (e) { if (!(e instanceof Died)) { e.message = `[${name}] ` + e.message + ` (room ${G.id}, mode ${G.mode})`; throw e; } log.push('たおれた: ' + name + ' @' + G.id); }
    }
    log.push(`${name} OK f=${frames} hp=${A.S.hp}/${A.S.maxHp} shells=${A.S.shells}`);
  }
  const ent = (t, f) => G.ents.find(e => e.t === t && (!f || f(e)));
  const F = A.flag, S = () => A.S;
  const U = [0, -1], D = [0, 1], L = [-1, 0], R = [1, 0];
  window.__BOT = {
    log, phase1() {
      step(3);
      stage('村長に 会う', () => S().staff, () => { toRoom('h1'); take(7, 5, U); step(5); });
      stage('しげみを はらう', () => G.id !== 'v0' && G.id !== 'h1', () => { toRoom('v0'); walkTo(12, 5); face(R); btn('btnA'); step(20); exitVia('e'); });
      stage('門を あける', () => F('gate1'), () => { toRoom('f3'); hunt(); pushUntil(() => F('gate1'), 4, 7, R); });
      stage('野原の 宝', () => F('chest_c_f2'), () => { toRoom('f2'); hunt(); walkTo(6, 5); face(U); btn('btnA'); step(18); walkTo(6, 4); take(6, 4, U); });
      stage('灯台へ', () => G.id === 'dA' || F('dA_clear'), () => { toRoom('dA'); });
      stage('1かい 敵', () => F('dA_clear'), () => { toRoom('dA'); hunt(); step(3); });
      stage('カギ1', () => S().keys > 0 || F('dC_n'), () => {
        toRoom('dE'); const b = () => ent('block');
        if (b().ty > 3) pushUntil(() => b().ty === 3 && !b().slide, 8, 7, U);
        pushUntil(() => F('dE_plate'), 9, 3, L); take(12, 3, U);
      });
      stage('2かいへ', () => F('dC_n'), () => { toRoom('dC'); walkTo(7, 1); hold(0, -1); step(12); hold(0, 0); });
      stage('つぼ', () => S().jar, () => { toRoom('dJ'); hunt(); step(3); take(7, 6, U); step(3); });
    },
    phase2() {
      stage('風車1', () => F('dH_e'), () => { toRoom('dH'); gust(7, 3, U); });
      stage('カギ2', () => F('chest_c_dI'), () => { toRoom('dI'); hunt(); step(3); take(11, 5, R); });
      stage('風車2', () => F('dC_e'), () => { toRoom('dC'); gust(9, 2, R); });
      stage('はし', () => F('dD_bridge'), () => { toRoom('dD'); hunt(); walkTo(4, 5); face(U); btn('btnB'); step(28); face(D); btn('btnB'); step(40); });
      stage('カギの とびら', () => F('dD_e'), () => { toRoom('dD'); walkTo(13, 5); hold(1, 0); step(12); hold(0, 0); });
      stage('大きな カギ', () => S().big, () => {
        toRoom('dK'); hunt();
        if (!F('dK_a')) pushUntil(() => F('dK_a'), 2, 7, R);
        for (let i = 0; i < 6 && !F('dK_b'); i++) gust(11, 4, D);
        take(11, 2, R);
      });
      stage('はし2', () => F('dG_bridge'), () => { toRoom('dG'); gust(6, 8, R); gust(6, 8, R); gust(11, 5, D); });
      stage('大とびら', () => F('dG_big'), () => { toRoom('dG'); walkTo(7, 1); hold(0, -1); step(12); hold(0, 0); });
      stage('いかり番', () => F('boss_dead'), () => {
        toRoom('dB'); let n = 0;
        while (!F('boss_dead')) {
          if (++n > 30000) throw new Error('ボスが たおせない hp=' + (ent('boss') || enemies()[0] || {}).hp);
          const b = enemies().find(e => e.kind === 'boss');
          if (!b) { step(5); continue; }
          const dx = b.x - P.x, dy = b.y - P.y;
          if (b.aura) {
            if (Math.abs(dx) < 6 || Math.abs(dy) < 6) { face(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]); btn('btnB'); step(8); }
            else { hold(Math.abs(dx) < Math.abs(dy) ? Math.sign(dx) : 0, Math.abs(dx) < Math.abs(dy) ? 0 : Math.sign(dy)); step(3); hold(0, 0); }
          } else if (Math.hypot(dx, dy) < 26) { face(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]); btn('btnA'); step(16); }
          else { hold(Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) : 0, Math.abs(dx) > Math.abs(dy) ? 0 : Math.sign(dy)); step(3); hold(0, 0); }
        }
        step(5);
      });
      stage('ボスの 宝', () => F('chest_c_boss'), () => { toRoom('dB'); take(3, 6, U); });
    },
    phase3() {
      stage('火を ともす', () => F('ending'), () => { toRoom('dT'); take(7, 5, U); step(5); });
      let n = 0; while (document.getElementById('btnEnd').hidden) { A.step(1); if (++n > 1300) throw new Error('エンディングが おわらない'); }
      log.push('エンディング OK');
    },
    // 第2章（タイトルの「第2章へ」から、なまえを かく ところまで）
    phase5() {
      let n = 0; while (G.id !== 's0' || G.mode !== 'play') { step(1); if (++n > 3000) throw new Error('島に つかない ' + G.id + G.mode); }
      step(3);
      stage('びんの てがみ', () => F('l_l2'), () => { toRoom('s0'); take(11, 6, D); step(3); });
      stage('石碑と 100年', () => F('c2_100'), () => { toRoom('s4'); take(4, 7, D); step(3); });
      stage('岩を どかして（だめ）', () => F('c2_tree') || window.__rockNo, () => { toRoom('s4'); window.__pickFirst = true; take(7, 7, U); step(3); window.__rockNo = true; });
      if (F('c2_tree')) throw new Error('まちがいの へんじで 木が はえた');
      stage('岩の そばに 木', () => F('c2_tree'), () => { toRoom('s4'); take(7, 7, U); step(3); });
      stage('とびらの カギを たのむ', () => F('c2_ask'), () => { toRoom('s4'); take(7, 5, U); step(3); });
      stage('いどの そばを ほる', () => F('c2_key') && F('l_l5'), () => { toRoom('s2'); hunt(); take(9, 5, U); step(3); });
      stage('村の あとの 宝', () => F('chest_c_s2'), () => { toRoom('s2'); hunt(); walkTo(11, 9); face(R); btn('btnA'); step(20); walkTo(12, 9); take(12, 9, R); step(3); });
      stage('カギで あける', () => F('c2_door'), () => { toRoom('s4'); take(7, 5, U); step(3); });
      stage('灯台 1かい', () => F('e0_clear'), () => { toRoom('e0'); step(3); hunt(); step(3); });
      if (!F('c2_eat1')) throw new Error('なまえが にじまない');
      stage('カギ1', () => S().keys > 0 || F('e1_n'), () => {
        toRoom('e2'); hunt(); const b = () => ent('block');
        if (b().ty > 3) pushUntil(() => b().ty === 3 && !b().slide, 8, 7, U);
        pushUntil(() => F('e2_plate'), 9, 3, L); take(12, 3, U); step(3);
      });
      stage('ひろまの とびら', () => F('e1_n'), () => { toRoom('e1'); walkTo(7, 1); hold(0, -1); step(12); hold(0, 0); });
      stage('むしくいの てがみ', () => F('l_l6'), () => { toRoom('e4'); step(5); });
      stage('はし', () => F('e4_bridge'), () => { toRoom('e4'); hunt(); for (let i = 0; i < 2; i++) gust(7, 8, R); gust(12, 5, D); });
      stage('風車', () => F('e1_e'), () => { toRoom('e1'); gust(9, 2, R); });
      stage('カギ2', () => F('chest_c_e3'), () => { toRoom('e3'); hunt(); step(3); take(10, 5, R); step(3); });
      stage('きたの とびら', () => F('e4_n'), () => { toRoom('e4'); walkTo(7, 1); hold(0, -1); step(12); hold(0, 0); });
      stage('かげの ぬし', () => F('e5_dead'), () => {
        toRoom('e5'); let n = 0;
        while (!F('e5_dead')) {
          if (++n > 30000) throw new Error('ぬしが たおせない');
          const b = enemies().find(e => e.kind === 'boss');
          if (!b) { step(5); continue; }
          const dx = b.x - P.x, dy = b.y - P.y;
          if (b.aura) {
            if (Math.abs(dx) < 6 || Math.abs(dy) < 6) { face(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]); btn('btnB'); step(16); }
            else { hold(Math.abs(dx) < Math.abs(dy) ? Math.sign(dx) : 0, Math.abs(dx) < Math.abs(dy) ? 0 : Math.sign(dy)); step(3); hold(0, 0); }
          } else if (Math.hypot(dx, dy) < 26) { face(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]); btn('btnA'); step(16); }
          else { hold(Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) : 0, Math.abs(dx) > Math.abs(dy) ? 0 : Math.sign(dy)); step(3); hold(0, 0); }
        }
        step(5);
      });
      stage('ぬしの 宝', () => F('chest_c_e5'), () => { toRoom('e5'); take(3, 6, U); step(3); });
      stage('てっぺん', () => G.mode === 'name', () => { toRoom('eT'); take(7, 2, U); step(3); });
    },
    // 夜明けから さいごまで
    phase6() {
      const go = (until, max) => { let n = 0; while (!until()) { step(1); if (++n > max) throw new Error('すすまない ' + G.mode + ' ' + G.id); } };
      go(() => G.mode === 'ending3', 4000);
      log.push('さいごの てがみ ' + F('l_lf'));
      go(() => !document.getElementById('btnEnd').hidden, 1000);
      log.push('エンディング2 OK');
    },
    phase4() {
      stage('かくれた どうくつ', () => F('chest_c_cave'), () => {
        toRoom('f5');
        for (let i = 0; i < 5 && ent('boulder').tx < 12; i++) gust(9, 3, R);
        toRoom('cave'); take(7, 4, U); step(3);
      });
    },
  };
};
(async () => {
  const shots = process.argv[2] || '/tmp/an_pw';
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const URL = 'http://localhost:8765/densetsu/?unlock=1&debug=1';
  const shot = n => p.screenshot({ path: `${shots}/${n}.png` });
  const run = async f => { const r = await p.evaluate(f => { try { __BOT.log.length = 0; __BOT[f](); __AN.render(); return { ok: true, log: __BOT.log }; } catch (e) { __AN.render(); return { ok: false, err: e.message + ' :: ' + String(e.stack).split('\n').slice(1,5).join(' | '), log: __BOT.log }; } }, f); r.log.forEach(l => console.log(' ', l)); if (!r.ok) { await shot('fail'); console.log('失敗:', r.err); console.log('errors', errs); await b.close(); process.exit(1); } };
  await p.goto(URL); await p.waitForTimeout(500);
  await p.click('#btnNew'); await p.evaluate(BOT);
  await run('phase1'); await shot('p1_jar');
  // ここで 読みなおして つづきから
  await p.waitForTimeout(100);
  await p.reload(); await p.waitForTimeout(400);
  console.log('再読込: つづきからの表示', await p.isVisible('#btnCont'));
  await p.click('#btnCont'); await p.evaluate(BOT);
  console.log('再開', await p.evaluate(() => [__AN.G.id, __AN.S.jar, __AN.S.keys, __AN.S.hp]));
  await run('phase2'); await shot('p2_boss');
  await run('phase3'); await shot('p3_end');
  await p.click('#btnEnd'); await p.click('#btnCont'); await p.evaluate(BOT);
  await run('phase4'); await shot('p4_cave');
  // ── 第2章 ──
  await p.reload(); await p.waitForTimeout(400);
  console.log('タイトルの「第2章へ」', await p.isVisible('#btnCh2'), await p.textContent('#logoSub'));
  await p.click('#btnCh2'); await p.evaluate(BOT);
  await run('phase5'); await shot('c2_name');
  console.log('なまえの きえ方', await p.evaluate(() => c2Eat()), 'ふれる手紙', await p.evaluate(() => C2_ORDER.filter(c2Has).join()));
  const kana = k => p.evaluate(k => [...document.querySelectorAll('.nmBtn')].find(b => b.dataset.k === k).click(), k);
  await kana('ナ'); await kana('ソ'); console.log('まちがい1', await p.textContent('#nmHint')); await p.waitForTimeout(800);
  await kana('ソ'); await kana('ミ'); console.log('まちがい2', await p.textContent('#nmHint')); await shot('c2_name_glow'); await p.waitForTimeout(800);
  await kana('ミ'); await kana('オ');
  await p.evaluate(() => { const f = __AN; f.step(1); });
  await p.evaluate(() => { __BOT.dawn = n => { __AN.step(n); }; });
  // 「ミオ！」→ 夜明けの 場面を 写す
  await p.evaluate(() => { let n = 0; while (__AN.G.mode === 'dialog' && n++ < 300) { document.getElementById('btnC').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); __AN.step(1); } __AN.step(1); });
  for (const n of [60, 260, 360, 560, 900]) { await p.evaluate(n => { __AN.step(n - __AN.G.end.t); __AN.render(); }, n); await shot('c2_dawn_' + n); }
  await run('phase6'); await p.evaluate(() => __AN.render()); await shot('c2_dusk');
  // てがみの ページが 画面に おさまるか
  const over = await p.evaluate(() => {
    const out = [], box = document.getElementById('screen').getBoundingClientRect(), paper = document.getElementById('ltPaper');
    document.getElementById('ovEnd').hidden = true; __AN.G.mode = 'play';
    for (const id of Object.keys(C2_LETTERS).concat('note', 'carve')) {
      const def = id === 'note' ? C2_NOTE_HEAVY : id === 'carve' ? C2_CARVE : C2_LETTERS[id];
      c2OpenLetter(id === 'note' || id === 'carve' ? def : id);
      def.pages.forEach((_, i) => { const r = paper.getBoundingClientRect(); if (r.top < box.top || r.bottom > box.bottom || paper.scrollHeight > paper.clientHeight + 1) out.push(id + ':' + i + ' ' + Math.round(r.height) + '/' + Math.round(box.height)); c2LetterNext(); });
    }
    return out;
  });
  console.log('はみ出す てがみ', over);
  // 声：ぜんぶ 読めて、見どころで 鳴っているか
  console.log('声', await p.evaluate(async () => { const d = await Promise.all(C2_VOICES.map(id => c2VoiceLoad(id).then(b => b.duration))); return { 本数: d.length, 合計秒: Math.round(d.reduce((a, b) => a + b, 0)), 最短: +Math.min(...d).toFixed(2), 音源: FM.ctx.state, 鳴らした: c2Vc.log.join() }; }));
  console.log('第2章の最終', await p.evaluate(() => JSON.stringify({ end: __AN.flag('c2_end'), room: __AN.S.room, hp: __AN.S.hp, max: __AN.S.maxHp, deaths: __AN.S.deaths })));
  console.log('最終', await p.evaluate(() => JSON.stringify({ hp: __AN.S.hp, max: __AN.S.maxHp, shells: __AN.S.shells, deaths: __AN.S.deaths, kills: __AN.S.kills, min: Math.round(__AN.S.time / 3600) })));
  console.log('errors', errs);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
