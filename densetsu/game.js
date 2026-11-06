// ============================================================
// ⚓ アンリノの伝説 第1章・第2章（見下ろし型の 冒険ゲーム。第2章の 物語は ch2.js）
//   ・1へや 15×11タイル。60コマ／秒の 固定ステップ。
//   ・セーブは ena_densetsu_v1（この端末だけ）。へやに 入るたび 自動で きろく。
//   ・入口：その日 ぜんぶの月で 50もん といたら あそべる（ena_daily_* を 読むだけ。sora/index.html と 同じ 数え方）
//     島の 主人公が けんすけ・みつき の 端末は いつでも（ena_island_save_v1 の player）
//   ・localhost の ?unlock=1 で 入口を あける／?debug=1 で テスト用の __AN を 出す
// ============================================================
'use strict';
const TILE = 16, COLS = 15, ROWS = 11, W = 240, H = 192, FIELD_H = 176;
const SAVE_KEY = 'ena_densetsu_v1', NEED = 50;
const FREE = { kensuke: 'けんすけ', mitsuki: 'みつき' };   // いつでも あそべる 子（sora/index.html の GATE.free と 同じ）
const $ = id => document.getElementById(id);
const IS_LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const QS = new URLSearchParams(location.search);
const DEBUG = IS_LOCAL && QS.get('debug') === '1';

// 絵は 240×192 の 下絵に 描き、4倍に のばして 出す（どの 画面でも ドットの 大きさが そろう）
const cv = $('cv'), out = cv.getContext('2d');
const buf = Art.mk(W, H), g = buf.getContext('2d');
g.imageSmoothingEnabled = false; out.imageSmoothingEnabled = false;
const SOLID = new Set(['T', 'Y', 'W', 'R', 'B', '^', 'H', 'I', 'X', 'a', 't', 'L', 'E']);
const DIR = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
const DOOR_POS = { n: [7, 0], s: [7, 10], w: [0, 5], e: [14, 5] };

// ── せいぶつの ことば ──
const NAMES = { turtle: '村長（カメ）', seal: 'りょうしの アザラシ', rabbit: 'うさぎの子', cat: 'スープやの ネコ', colon: 'コロン', hero: 'アンリノ' };

let S = null;       // セーブする 中身
let frame = 0;
const G = { mode: 'title', room: null, id: '', tiles: null, ents: [], fx: [], gusts: [], bake: null, slide: null, fade: null, hold: null, dlg: null, fall: 0, toastT: 0, placeT: 0, hurtFlash: 0, shake: 0, end: null, cut: new Set() };
const P = { x: 120, y: 90, dir: 'd', walk: 0, swing: 0, gustCd: 0, inv: 0, kx: 0, ky: 0, kt: 0, pushT: 0, pushE: null, onWarp: false, safeX: 0, safeY: 0 };
const colonF = { x: 100, y: 90 };

function newSave() {
  return { v: 1, room: 'v0', x: 40, y: 104, dir: 'r', hp: 6, maxHp: 6, shells: 0, keys: 0, big: false, staff: false, jar: false, f: {}, time: 0, kills: 0, deaths: 0 };
}
function loadSave() {
  try { const o = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (o && o.v === 1 && ROOMS[o.room]) return o; } catch (e) {}
  return null;
}
function writeSave() { if (!S) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) {} }

// ── 入口（その日に といた 数）──
function answeredToday() {
  const d = new Date(), day = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  let n = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      if (k.startsWith('ena_daily_') && k.endsWith('_' + day)) { try { n += Number(JSON.parse(localStorage.getItem(k) || '{}').answered) || 0; } catch (e) {} }
    }
  } catch (e) {}
  return n;
}
function islandPlayer() {
  try { return (JSON.parse(localStorage.getItem('ena_island_save_v1') || '{}') || {}).player || null; } catch (e) { return null; }
}
function applyGate() {
  const n = answeredToday();
  if (FREE[islandPlayer()] || n >= NEED || (IS_LOCAL && QS.get('unlock') === '1')) { $('ovLock').hidden = true; return true; }
  $('lockLeft').textContent = NEED - n;
  $('lockBar').style.width = Math.min(100, n / NEED * 100) + '%';
  $('lockNow').textContent = `きょう といた もんだい ${n}もん`;
  $('ovTitle').hidden = true; $('ovLock').hidden = false;
  return false;
}

// ── 入力 ──
const input = { x: 0, y: 0, keys: {}, a: false, b: false, c: false, ap: false, bp: false, cp: false };
const pad = $('pad');
let padId = null;
function padFrom(e) {
  const r = pad.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
  const dead = r.width * .1;
  let x = 0, y = 0;
  if (Math.hypot(dx, dy) > dead) {
    const a = Math.atan2(dy, dx) / (Math.PI / 8);   // 8方向
    const s = ((Math.round(a / 2) % 8) + 8) % 8;
    x = [1, 1, 0, -1, -1, -1, 0, 1][s]; y = [0, 1, 1, 1, 0, -1, -1, -1][s];
  }
  input.x = x; input.y = y; showPad();
}
function showPad() {
  pad.classList.toggle('u', input.y < 0); pad.classList.toggle('d', input.y > 0);
  pad.classList.toggle('l', input.x < 0); pad.classList.toggle('r', input.x > 0);
}
pad.addEventListener('pointerdown', e => { e.preventDefault(); padId = e.pointerId; try { pad.setPointerCapture(padId); } catch (_) {} padFrom(e); });
pad.addEventListener('pointermove', e => { if (e.pointerId === padId) padFrom(e); });
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(n => pad.addEventListener(n, e => { if (e.pointerId === padId) { padId = null; input.x = input.y = 0; showPad(); } }));
const bindBtn = (el, k) => {
  el.addEventListener('pointerdown', e => { e.preventDefault(); input[k] = true; input[k + 'p'] = true; el.classList.add('down'); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => el.addEventListener(n, () => { input[k] = false; el.classList.remove('down'); }));
};
bindBtn($('btnA'), 'a'); bindBtn($('btnB'), 'b'); bindBtn($('btnC'), 'c');
const KEYMAP = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r', KeyW: 'u', KeyS: 'd', KeyA: 'l', KeyD: 'r' };
const KEYBTN = { KeyZ: 'a', Space: 'a', KeyJ: 'a', KeyX: 'b', KeyK: 'b', KeyC: 'c', Enter: 'c', KeyL: 'c' };
addEventListener('keydown', e => {
  if (KEYMAP[e.code]) { input.keys[KEYMAP[e.code]] = true; keyDir(); e.preventDefault(); }
  if (KEYBTN[e.code]) { if (!e.repeat) { input[KEYBTN[e.code]] = true; input[KEYBTN[e.code] + 'p'] = true; } e.preventDefault(); }
});
addEventListener('keyup', e => {
  if (KEYMAP[e.code]) { input.keys[KEYMAP[e.code]] = false; keyDir(); }
  if (KEYBTN[e.code]) input[KEYBTN[e.code]] = false;
});
function keyDir() { const k = input.keys; input.x = (k.r ? 1 : 0) - (k.l ? 1 : 0); input.y = (k.d ? 1 : 0) - (k.u ? 1 : 0); showPad(); }
['gesturestart', 'dblclick', 'contextmenu'].forEach(n => document.addEventListener(n, e => e.preventDefault()));
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

// ── ちょっとした 道具 ──
const flag = k => !!(S && S.f[k]);
function setFlag(k) {
  if (S.f[k]) return;
  S.f[k] = 1; rebuildTiles(); bakeRoom(); writeSave();
  // あらわれた 宝箱などに 重なって 動けなく ならないように、そばの あいた ところへ よける
  if (G.mode !== 'bossdie' && boxBlocked(P.x, P.y, PH, PH)) {
    for (let d = 4; d <= 32; d += 2) for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      if (!boxBlocked(P.x + dx * d, P.y + dy * d, PH, PH)) { P.x += dx * d; P.y += dy * d; return; }
    }
  }
}
const tileAt = (c, r) => (r < 0 || r >= ROWS || c < 0 || c >= COLS) ? undefined : G.tiles[r][c];
function toast(t) { const el = $('toast'); el.textContent = t; el.classList.add('on'); G.toastT = 130; }
function showPlace(t) { const el = $('place'); el.textContent = t; el.classList.add('on'); G.placeT = 110; }
const overlap = (ax, ay, aw, ah, bx, by, bw, bh) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
const entActive = e => (!e.def.if || flag(e.def.if)) && (!e.def.unless || !flag(e.def.unless));
const songFor = id => { const r = ROOMS[id]; if (id === 'dB' && flag('boss_dead')) return 'd_dungeon'; if (id === 'e5' && flag('e5_dead')) return 'd_dungeon'; if (id === 's4' && flag('c2_end')) return 'd_letter'; if (id === 'f4' && flag('ending')) return 'd_ending'; return r.music; };

// ── へや ──
function rebuildTiles() {
  const def = G.room;
  const t = def.map.map(r => r.split(''));
  (def.patches || []).forEach(p => { if (flag(p.if)) p.at.forEach(([c, r, ch]) => { t[r][c] = ch; }); });
  G.cut.forEach(k => { const [c, r] = k.split(',').map(Number); t[r][c] = '.'; });
  G.tiles = t;
}
function bakeRoom() {
  if (!G.bake) G.bake = Art.mk(W, FIELD_H);
  const b = G.bake.getContext('2d');
  b.imageSmoothingEnabled = false;
  const at = (c, r) => (r < 0 || r >= ROWS || c < 0 || c >= COLS) ? undefined : G.tiles[r][c];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) Art.tile(b, G.tiles[r][c], c, r, at);
  if (G.room.tower) Art.tower(b, G.room.tower[0], G.room.tower[1], flag('ending'));
  if (G.room.ruin) Art.ruin(b, G.room.ruin[0], G.room.ruin[1], flag('c2_lit'));
  (G.room.deco || []).forEach(d => { if (d.if && !flag(d.if)) return; if (d.t === 'boat') Art.boat(b, d.x * TILE, d.y * TILE); if (d.t === 'bigtree') Art.bigtree(b, d.x, d.y); if (d.t === 'shade') Art.ruinShade(b, d.x, d.y, d.w, d.h); });
}
function mkEnemy(def) {
  const px = def.x * TILE + 8, py = def.y * TILE + 8;
  const e = { def, t: def.t, kind: def.t, enemy: true, x: px, y: py, vx: 0, vy: 0, hp: 1, timer: 30 + Math.floor(Math.random() * 60), flash: 0, kx: 0, ky: 0, kt: 0, stun: 0, anim: Math.random() * 60 | 0, r: 6 };
  if (def.t === 'guard') { e.hp = 2; e.shield = true; }
  if (def.t === 'bat') { e.a = Math.random() * 6; e.awake = false; }
  if (def.t === 'crab') { e.vx = .75; }
  if (def.t === 'boss') { Object.assign(e, { hp: 6, r: 15, combo: 0, aura: true, state: 'walk', timer: 90, st: 0, spawned: false, x: def.x * TILE + 8, y: def.y * TILE + 8 }); }
  return e;
}
function loadRoom(id) {
  G.id = id; G.room = ROOMS[id]; G.cut = new Set();
  rebuildTiles(); bakeRoom();
  G.fx = []; G.gusts = [];
  G.ents = [];
  (G.room.ents || []).forEach(d => {
    if (d.t === 'slime' || d.t === 'bat' || d.t === 'crab' || d.t === 'guard' || d.t === 'boss') {
      if (!(d.unless && flag(d.unless)) && !(d.if && !flag(d.if))) G.ents.push(mkEnemy(d));
      return;
    }
    const e = { def: d, t: d.t, tx: d.x, ty: d.y, x: d.x * TILE, y: d.y * TILE };
    if (d.t === 'door') { const [c, r] = DOOR_POS[d.side]; e.tx = c; e.ty = r; e.x = c * TILE; e.y = r * TILE; }
    if ((d.t === 'block' || d.t === 'boulder') && d.solved && flag(d.flag)) { e.tx = d.solved[0]; e.ty = d.solved[1]; e.x = e.tx * TILE; e.y = e.ty * TILE; e.done = true; }
    if (d.t === 'pick' && flag('p_' + id + '_' + d.x + '_' + d.y)) return;
    if (d.t === 'pinwheel') e.spin = 0;
    G.ents.push(e);
  });
  showPlace(G.room.name);
}
function enterRoom(id, x, y, dir) {
  loadRoom(id);
  P.x = x; P.y = y; if (dir) P.dir = dir;
  P.safeX = x; P.safeY = y; P.kt = 0;
  P.onWarp = true;
  colonF.x = x - DIR[P.dir][0] * 18 + (DIR[P.dir][0] ? 0 : 14); colonF.y = y - DIR[P.dir][1] * 18 + 2;
  S.room = id; S.x = x; S.y = y; S.dir = P.dir; writeSave();
  fmPlay(songFor(id));
}

// ── あたり判定 ──
const SOLID_ENT = new Set(['chest', 'npc', 'sign', 'stone', 'block', 'boulder', 'pinwheel', 'lamp', 'story']);
function entSolidAt(e) { return e.t === 'door' ? !flag(e.def.flag) : SOLID_ENT.has(e.t) && entActive(e); }
function tileBlocked(c, r) {
  const t = tileAt(c, r);
  if (t === undefined) {
    if (c < 0) return !G.room.w; if (c >= COLS) return !G.room.e;
    if (r < 0) return !G.room.n; return !G.room.s;
  }
  return SOLID.has(t);
}
function boxBlocked(x, y, hw, hh, ignoreEnt) {
  const x0 = Math.floor((x - hw) / TILE), x1 = Math.floor((x + hw - .01) / TILE), y0 = Math.floor((y - hh) / TILE), y1 = Math.floor((y + hh - .01) / TILE);
  for (let r = y0; r <= y1; r++) for (let c = x0; c <= x1; c++) if (tileBlocked(c, r)) return true;
  for (const e of G.ents) {
    if (e === ignoreEnt || e.enemy || !entSolidAt(e)) continue;
    if (overlap(x - hw, y - hh, hw * 2, hh * 2, e.x + (e.t === 'door' ? 0 : 1), e.y + (e.t === 'door' ? 0 : 1), e.t === 'door' ? 16 : 14, e.t === 'door' ? 16 : 14)) return true;
  }
  return false;
}
const PH = 5;   // アンリノの あたりの 半分
function movePlayer(dx, dy) {
  if (dx) {
    if (!boxBlocked(P.x + dx, P.y, PH, PH)) P.x += dx;
    else if (!dy) slideAssist(dx, 0);
  }
  if (dy) {
    if (!boxBlocked(P.x, P.y + dy, PH, PH)) P.y += dy;
    else if (!dx) slideAssist(0, dy);
  }
}
// 角に すこし ひっかかったら、すべって 通す（タッチでも 通りやすく）
function slideAssist(dx, dy) {
  for (let i = 1; i <= 6; i++) for (const s of [-1, 1]) {
    const nx = dy ? P.x + s * i : P.x, ny = dx ? P.y + s * i : P.y;
    if (!boxBlocked(nx + dx, ny + dy, PH, PH)) {
      const sx = dy ? s * .9 : 0, sy = dx ? s * .9 : 0;
      if (!boxBlocked(P.x + sx, P.y + sy, PH, PH)) { P.x += sx; P.y += sy; }
      return;
    }
  }
}
function enemyBlocked(e, x, y) {
  const hw = e.r, fly = e.kind === 'bat';
  const x0 = Math.floor((x - hw) / TILE), x1 = Math.floor((x + hw - .01) / TILE), y0 = Math.floor((y - hw) / TILE), y1 = Math.floor((y + hw - .01) / TILE);
  for (let r = y0; r <= y1; r++) for (let c = x0; c <= x1; c++) {
    const t = tileAt(c, r);
    if (t === undefined) return true;
    if (fly) { if (t === 'X' || t === 'I' || t === 'L') return true; continue; }
    if (SOLID.has(t) || t === 'P' || t === 'D' || t === 'C') return true;
  }
  if (fly) return false;
  for (const o of G.ents) {
    if (o.enemy || !entSolidAt(o)) continue;
    if (overlap(x - hw, y - hw, hw * 2, hw * 2, o.x, o.y, 16, 16)) return true;
  }
  return false;
}

// ── 会話 ──
function say(pages, cb, name) {
  G.dlg = { pages: Array.isArray(pages) ? pages : [pages], i: 0, n: 0, cb, name: name || '' };
  G.mode = 'dialog';
  $('dialog').hidden = false; $('dlgName').textContent = G.dlg.name; $('dlgText').textContent = ''; $('dlgNext').hidden = true;
  input.ap = input.bp = input.cp = false;
}
function tickDialog() {
  const d = G.dlg, text = d.pages[d.i];
  const press = input.ap || input.bp || input.cp;
  if (d.n < text.length) {
    d.n = press ? text.length : d.n + .7;
    const n = Math.floor(d.n);
    $('dlgText').textContent = text.slice(0, n);
    if (n % 3 === 0 && !press) Sfx.text();
    if (d.n >= text.length) $('dlgNext').hidden = false;
    return;
  }
  if (!press) return;
  d.i++; d.n = 0; $('dlgNext').hidden = true;
  if (d.i >= d.pages.length) {
    $('dialog').hidden = true; G.mode = 'play'; G.dlg = null;
    if (d.cb) d.cb();
    return;
  }
  $('dlgText').textContent = '';
}
function colonSay(pages, cb) { say(pages, cb, 'コロン'); }

function colonHint() {
  if (flag('ch2') && !flag('c2_end')) return c2Hint();
  if (flag('c2_end')) return 'ミオの あかり、今夜も 見えるね。\n📜で、てがみを もう いちど よめるよ。';
  if (flag('ending') && S.maxHp >= 10) return '村長さんに 会いに いこう。\n海の むこうの かげの こと、なにか しっているかも！';
  if (!S.staff) return 'ひだりの いえの 村長に 会いに いこう。灯台のこと、なにか しっているよ！';
  if (G.id === 'v0' || G.id === 'h1' || G.id === 'h2') return 'ひがしの しげみを ぼうで はらって、野原へ でよう！ ⭐ボタンで ぼうを ふれるよ。';
  if (!flag('gate1')) return '野原を ひがしへ すすむと、灯台への 門が あるよ。いわを おして 赤い いしいたに のせよう！';
  if (!flag('dA_clear')) return 'みさきの 灯台へ 入ろう。かげたちを ぜんぶ たおすと、とびらが ひらくよ！';
  if (!S.jar) {
    if (S.keys === 0 && !flag('dC_n')) return 'ひろまの ひだりの へやで、いわを おしてみよう。カギが みつかるかも！';
    if (!flag('dC_n')) return 'ひろまの きたの カギの とびらを あけよう！';
    return '2かいの ひだりの へやが あやしいよ。かげを ぜんぶ たおそう！';
  }
  if (!flag('dH_e')) return 'つぼの 風（🏺ボタン）で、2かいの 風車を まわそう！ 風車の まっすぐ したから ふくよ。';
  if (!flag('dI_clear')) return '2かいの ひがしへ すすもう。たての かげは、まず 風で たてを はがして！';
  if (!flag('dC_e')) return 'カギを 手に入れたね。1かいの ひろまの 風車も 風で まわせるよ！';
  if (!S.big && !flag('dG_big')) {
    if (!flag('dD_bridge')) return 'ふたつの 風車を つづけて まわそう。まんなかに 立って、うえと したへ！';
    if (!flag('dD_e')) return 'カギの とびらを あけて、おくへ！';
    return 'おくの へやの いしいた ふたつに いわを のせると、はしが かかるよ！';
  }
  if (!flag('dG_bridge')) return '大きな カギの とびらは「かぜの いわの へや」の きた。風で いわを おくって はしを かけよう！';
  if (!flag('boss_dead')) return 'きたの 大きな とびらの おくに、いかり番が いるよ。むらさきの たては 風で はがしてから たたくんだ！';
  if (!flag('ending')) return 'きたへ のぼろう。灯台の てっぺんに 火を ともすんだ！';
  if (S.maxHp < 10) return 'はまべの まるい いわが 気に なるなあ。いまなら 風で うごかせるかも。';
  return 'ぜんぶ やったね！ アンリノ、ありがとう！';
}

// ── はなす・しらべる ──
function frontOf(d, dist) { return [P.x + DIR[d][0] * dist, P.y + DIR[d][1] * dist]; }
function tryAction() {
  const [fx, fy] = frontOf(P.dir, 11);
  let best = null, bd = 1e9;
  for (const e of G.ents) {
    if (e.enemy || !entActive(e)) continue;
    if (!['npc', 'sign', 'stone', 'chest', 'lamp', 'story'].includes(e.t)) continue;
    const d = Math.hypot(e.x + 8 - fx, e.y + 8 - fy);
    const reach = e.def.talkOver ? 34 : 15;
    if (d < reach && d < bd) { best = e; bd = d; }
  }
  if (!best) { colonSay(colonHint()); return; }
  if (best.t === 'npc') talk(best);
  else if (best.t === 'sign') say(best.def.text);
  else if (best.t === 'stone') rest();
  else if (best.t === 'chest') openChest(best);
  else if (best.t === 'lamp') lightLamp();
  else if (best.t === 'story') c2Story(best);
}
function rest() {
  S.hp = S.maxHp; writeSave(); fmJingle('d_rest');
  P.safeX = P.x; P.safeY = P.y; S.x = P.x; S.y = P.y;
  writeSave();
  say('ともしび石が あたたかく ひかった。\nしずくが ぜんぶ もどり、ここまでの ぼうけんを きろくした。');
}
function talk(e) {
  const id = e.def.id, n = NAMES[id];
  if (id === 'turtle') {
    if (!S.staff) {
      say(['おお、アンリノ！ よく 海を わたって きてくれた。',
        'みさきの 灯台の 火が、かげモンスターに けされて しもうた。\nあの 火は、となりの アンリノ島の 船も てらす、だいじな 火じゃ。',
        'この「ひかりのぼう」を もって いきなさい。\nかげは 光の ぼうで たたくと きえるのじゃ。'],
        () => give('staff'), n);
    } else if (!flag('boss_dead')) say('灯台への 道は、村を でて ひがしじゃ。\nこまったら、コロンに きいて ごらん（💬ボタン）。', null, n);
    else if (!flag('ending')) say('もう すぐじゃ。てっぺんの 火皿を しらべるのじゃぞ！', null, n);
    else if (!flag('ch2')) c2StartScene();
    else if (flag('c2_end')) say('今夜も、あの 島に あかりが 見えるのう。\nミオも きっと よろこんで おるよ。', null, n);
    else if (flag('c2_lit')) c2Finale();
    else say('しおさいの島は どうじゃな。\n船は アザラシに たのむと よいぞ。', null, n);
  } else if (id === 'seal') {
    if (G.id === 's0') return c2Boat(false);
    if (flag('ch2')) return c2Boat(true);
    if (flag('ending')) say('今夜は 灯台の おかげで、あんしんして 船が だせるよ！', null, n);
    else say(['火が きえてから、船が でられなくて こまって いるんだ。', '赤い 貝が らは「かい」と いって、村の スープやで つかえるよ。\nしげみの 中にも かくれて いるかも。'], null, n);
  } else if (id === 'rabbit') {
    if (S.jar) say('そのツボ、風の 音が する！\nはまべの まるい いわも、風なら うごくかなあ。', null, n);
    else say('はまべに、まるい 大きな いわが あるの。\nどんなに おしても ぜんぜん うごかないんだよ。', null, n);
  } else if (id === 'cat') {
    if (S.hp >= S.maxHp) say('しおスープは 10かい だよ。\nしずくが へったら、また おいで。', null, n);
    else if (S.shells >= 10) { S.shells -= 10; S.hp = S.maxHp; writeSave(); Sfx.heal(); say('まいど！ あつあつの しおスープを どうぞ。\nしずくが ぜんぶ もどった！', null, n); }
    else say(`しおスープは 10かい だよ。\nいまは ${S.shells}かい だね。また おいで。`, null, n);
  }
}
const ITEM_TEXT = {
  staff: ['ひかりのぼう を 手に入れた！', '⭐ボタンで ふると、かげを たおせる。しげみも はらえるよ。\nまず、ひがしの しげみへ いってみよう！'],
  jar: ['しおかぜの つぼ を 手に入れた！', '🏺ボタンで まっすぐ 風を とばせる！\nまるい いわを おす・風車を まわす・かげの たてを はがす。\nあなの うえも とんで いくよ。'],
  key: ['カギ を 手に入れた！', 'カギの とびらに ぶつかると あくよ。'],
  big: ['大きな カギ を 手に入れた！', 'いかり番の へやの とびらを あけられる！'],
  cont: ['しずくの うつわ を 手に入れた！', 'もてる しずくが 1つ ふえた！'],
  bottle: ['ふるい びん を ひろった！', '中に、てがみが 入っている。'],
  oldkey: ['さびた カギ を 手に入れた！', '100年 たって、すっかり さびている。'],
};
function give(what, cb) {
  let icon = what, pages;
  if (what.startsWith('shells:')) {
    const n = +what.split(':')[1]; S.shells += n; icon = 'shell'; pages = [`かい を ${n}こ 手に入れた！`];
  } else {
    pages = ITEM_TEXT[what];
    if (what === 'staff') S.staff = true;
    if (what === 'jar') S.jar = true;
    if (what === 'key') S.keys++;
    if (what === 'big') S.big = true;
    if (what === 'cont') { S.maxHp += 2; S.hp = S.maxHp; }
    if (what === 'oldkey') S.f.c2_key = 1;
    if (what === 'bottle') S.f.c2_bottle = 1;
  }
  writeSave();
  fmJingle('d_get');
  G.hold = Art.ICON[icon];
  P.dir = 'd';
  say(pages, () => { G.hold = null; if (cb) cb(); });
}
function openChest(e) {
  const fk = 'chest_' + e.def.id;
  if (flag(fk)) { say('もう からっぽだ。'); return; }
  Sfx.open();
  S.f[fk] = 1;
  give(e.def.give);
}

// ── アンリノの うごき ──
function hurtPlayer(n, fromX, fromY) {
  if (P.inv > 0 || G.mode !== 'play') return;
  S.hp -= n; P.inv = 70; G.hurtFlash = 10; Sfx.hurt();
  const a = Math.atan2(P.y - fromY, P.x - fromX);
  P.kx = Math.cos(a) * 2.6; P.ky = Math.sin(a) * 2.6; P.kt = 9;
  if (S.hp <= 0) { S.hp = 0; die(); }
}
function die() {
  S.deaths++;
  G.mode = 'dead'; fmStop(); G.deadT = 0;
}
function respawn() {
  $('ovDead').hidden = true;
  S.hp = Math.max(4, S.maxHp); P.inv = 90;
  G.mode = 'play';
  const room = S.room;
  enterRoom(room, S.x, S.y, S.dir);
  writeSave();
}
function fallInPit() {
  G.mode = 'fall'; G.fall = 0; Sfx.fall();
}
function tickFall() {
  G.fall++;
  if (G.fall > 32) {
    S.hp -= 1; P.x = P.safeX; P.y = P.safeY; P.inv = 60; G.mode = 'play';
    Sfx.hurt();
    if (S.hp <= 0) { S.hp = 0; die(); }
  }
}
function staffRect() {
  const [dx, dy] = DIR[P.dir];
  const w = dx ? 16 : 22, h = dy ? 16 : 22;
  return [P.x + dx * 12 - w / 2, P.y + dy * 12 - h / 2, w, h];
}
function hitEnemy(e, fromX, fromY, power) {
  if (e.flash > 0) return;
  if (e.kind === 'boss') {
    if (e.aura) { Sfx.ting(); spark(e.x, e.y); return; }
    if (e.hitCd > 0) return;
    e.hitCd = 18;
    e.hp -= power; e.flash = 16; Sfx.hit(); G.shake = 4;
    if (e.hp <= 0) { bossDown(e); return; }
    // 1かいの すきに たたけるのは 3かいまで。たてが もどって はなれる
    if (++e.combo >= 3) { e.combo = 0; e.aura = true; e.state = 'walk'; e.timer = 50; Sfx.ting(); toast('たてが もどった！ また 風で！'); }
    return;
  }
  if (e.shield) { Sfx.ting(); spark(e.x, e.y); const a = Math.atan2(e.y - fromY, e.x - fromX); e.kx = Math.cos(a) * 1.6; e.ky = Math.sin(a) * 1.6; e.kt = 8; toast('たてが かたい！ 風で はがそう'); return; }
  e.hp -= power; e.flash = 14; Sfx.hit();
  const a = Math.atan2(e.y - fromY, e.x - fromX);
  e.kx = Math.cos(a) * 2.6; e.ky = Math.sin(a) * 2.6; e.kt = 10;
  if (e.hp <= 0) killEnemy(e);
}
function killEnemy(e) {
  G.ents = G.ents.filter(o => o !== e);
  S.kills++; Sfx.pop(); poof(e.x, e.y);
  const r = Math.random();
  if (r < .32) G.ents.push({ t: 'drop', kind: S.hp < S.maxHp && r < .2 ? 'heal' : 'shell', x: e.x, y: e.y, life: 480, enemyDrop: true, def: {}, pick: true });
}
function poof(x, y) { for (let i = 0; i < 8; i++) { const a = i * .785; G.fx.push({ x, y, vx: Math.cos(a) * 1.1, vy: Math.sin(a) * 1.1, t: 18, c: i % 2 ? '#7c5bc4' : '#e6d4ff' }); } }
function spark(x, y) { for (let i = 0; i < 5; i++) { const a = Math.random() * 6.3; G.fx.push({ x, y, vx: Math.cos(a) * 1.5, vy: Math.sin(a) * 1.5, t: 10, c: '#fff4b0' }); } }
function leaves(c, r) { for (let i = 0; i < 7; i++) { const a = Math.random() * 6.3; G.fx.push({ x: c * TILE + 8, y: r * TILE + 8, vx: Math.cos(a) * 1, vy: Math.sin(a) * 1 - .3, t: 16, c: i % 2 ? '#3fa050' : '#8fd98a' }); } }

function tickPlayer() {
  const [ix, iy] = [input.x, input.y];
  if (P.kt > 0) {
    P.kt--;
    if (!boxBlocked(P.x + P.kx, P.y, PH, PH)) P.x += P.kx;
    if (!boxBlocked(P.x, P.y + P.ky, PH, PH)) P.y += P.ky;
  } else if (P.swing <= 0) {
    if (ix || iy) {
      // むきは、いま 押している 方向の うち、今の むきを のこす
      const cur = DIR[P.dir];
      if (!((cur[0] && cur[0] === ix) || (cur[1] && cur[1] === iy))) P.dir = ix && (!iy || Math.abs(ix) >= Math.abs(iy)) ? (ix > 0 ? 'r' : 'l') : (iy > 0 ? 'd' : 'u');
      const sp = 1.45 * ((ix && iy) ? .72 : 1);
      movePlayer(ix * sp, iy * sp);
      P.walk += .14;
    } else P.walk = 0;
  }
  // おす
  tickPush(ix, iy);

  if (P.swing > 0) {
    P.swing--;
    const [rx, ry, rw, rh] = staffRect();
    for (const e of [...G.ents]) if (e.enemy && overlap(rx, ry, rw, rh, e.x - e.r, e.y - e.r, e.r * 2, e.r * 2)) hitEnemy(e, P.x, P.y, 1);
    const c0 = Math.floor(rx / TILE), c1 = Math.floor((rx + rw) / TILE), r0 = Math.floor(ry / TILE), r1 = Math.floor((ry + rh) / TILE);
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) if (tileAt(c, r) === 'B') cutBush(c, r);
  }
  if (P.gustCd > 0) P.gustCd--;
  if (P.inv > 0) P.inv--;

  if (input.ap && P.swing <= 0) {
    if (S.staff) { P.swing = 14; Sfx.swing(); } else toast('まだ ぼうを もっていない');
  }
  if (input.bp) {
    if (!S.jar) toast('まだ つぼを もっていない');
    else if (P.gustCd <= 0) { fireGust(); P.gustCd = 26; }
  }
  if (input.cp) tryAction();
  if (G.mode !== 'play') return;

  // ひろう
  for (const e of [...G.ents]) if (e.pick || e.t === 'pick') {
    if (Math.hypot(e.x + (e.t === 'pick' ? 8 : 0) - P.x, e.y + (e.t === 'pick' ? 8 : 0) - P.y) < 11) collect(e);
  }
  // カギの とびら
  for (const e of G.ents) if (e.t === 'door' && !flag(e.def.flag) && Math.hypot(e.x + 8 - P.x, e.y + 8 - P.y) < 15) {
    const [dx, dy] = DIR[P.dir], tox = e.x + 8 - P.x, toy = e.y + 8 - P.y;
    if (!(ix || iy) || dx * tox + dy * toy <= 0) continue;
    if (e.def.kind === 'key') {
      if (S.keys > 0) { S.keys--; Sfx.door(); setFlag(e.def.flag); toast('カギで あけた！'); }
      else if (G.toastT <= 0) toast('カギが ひつようだ');
    } else if (e.def.kind === 'big') {
      if (S.big) { Sfx.door(); setFlag(e.def.flag); toast('大きな カギで あけた！'); }
      else if (G.toastT <= 0) toast('大きな カギが ひつようだ');
    } else if (e.def.kind === 'wind' && G.toastT <= 0) toast('風車を まわすと ひらくよ');
    else if (e.def.kind === 'clear' && G.toastT <= 0) toast('かげを ぜんぶ たおそう');
    else if (e.def.kind === 'gate' && G.toastT <= 0) toast('赤い いしいたに いわを のせよう');
  }
  // ワープ
  const cc = Math.floor(P.x / TILE), cr = Math.floor(P.y / TILE);
  let onW = null;
  for (const e of G.ents) if (e.t === 'warp' && entActive(e) && e.tx === cc && e.ty === cr) onW = e;
  if (onW && !P.onWarp) { startFade(onW.def.to, onW.def.tx * TILE + 8, onW.def.ty * TILE + 8, onW.def.dir); return; }
  if (!onW) P.onWarp = false;
  // あな
  const tc = tileAt(cc, cr);
  if (tc === 'P') { fallInPit(); return; }
  // となりの へやへ
  if (P.x < 2 && G.room.w) return slideTo(G.room.w, 'w');
  if (P.x > W - 2 && G.room.e) return slideTo(G.room.e, 'e');
  if (P.y < 2 && G.room.n) return slideTo(G.room.n, 'n');
  if (P.y > FIELD_H - 2 && G.room.s) return slideTo(G.room.s, 's');
}
function cutBush(c, r) {
  G.cut.add(c + ',' + r); rebuildTiles(); bakeRoom(); leaves(c, r); Sfx.bush();
  const a = Math.random();
  if (a < .3) G.ents.push({ t: 'drop', kind: a < .08 && S.hp < S.maxHp ? 'heal' : 'shell', x: c * TILE + 8, y: r * TILE + 8, life: 480, def: {}, pick: true });
}
function collect(e) {
  G.ents = G.ents.filter(o => o !== e);
  if (e.t === 'pick') { S.shells += 1; S.f['p_' + G.id + '_' + e.def.x + '_' + e.def.y] = 1; Sfx.pick(); writeSave(); return; }
  if (e.kind === 'heal') { S.hp = Math.min(S.maxHp, S.hp + 2); Sfx.heal(); } else { S.shells += 1; Sfx.pick(); }
}
function freeForPush(c, r, self) {
  const t = tileAt(c, r);
  if (t === undefined || SOLID.has(t) || t === 'P' || t === 'D' || t === 'C') return false;
  for (const e of G.ents) {
    if (e === self || e.enemy) continue;
    if (e.t === 'door' && !flag(e.def.flag) && e.tx === c && e.ty === r) return false;
    if (SOLID_ENT.has(e.t) && entActive(e) && e.tx === c && e.ty === r) return false;
    if (e.t === 'warp' && e.tx === c && e.ty === r) return false;
  }
  return true;
}
function moveObject(e, dx, dy) {
  const c = e.tx + dx, r = e.ty + dy;
  if (e.done || !freeForPush(c, r, e)) return false;
  e.tx = c; e.ty = r; e.slide = 16; e.sdx = dx; e.sdy = dy; Sfx.push();
  return true;
}
function checkPlate(e) {
  if (!e.def.solved || flag(e.def.flag)) return;
  if (e.tx === e.def.solved[0] && e.ty === e.def.solved[1]) {
    e.done = true; fmJingle('d_solve'); setFlag(e.def.flag); toast('カチッ！ なにかが うごいた');
  }
}
function tickPush(ix, iy) {
  if (P.swing > 0 || !(ix || iy) || (ix && iy)) { P.pushT = 0; return; }
  const [fx, fy] = [P.x + ix * (PH + 2), P.y + iy * (PH + 2)];
  let tgt = null;
  for (const e of G.ents) if ((e.t === 'block' || e.t === 'boulder') && !e.slide && overlap(fx - 1, fy - 1, 2, 2, e.x, e.y, 16, 16)) tgt = e;
  if (!tgt) { P.pushT = 0; return; }
  // すこし ずれていても 押せる
  const off = ix ? Math.abs(P.y - (tgt.y + 8)) : Math.abs(P.x - (tgt.x + 8));
  if (off > 8) { P.pushT = 0; return; }
  if (P.pushE !== tgt) { P.pushE = tgt; P.pushT = 0; }
  P.pushT++;
  if (P.pushT > 16) {
    P.pushT = 0;
    if (tgt.t === 'boulder') { if (G.toastT <= 0) toast('まるい いわは 手では うごかない'); return; }
    moveObject(tgt, ix, iy);
  }
}
function fireGust() {
  const [dx, dy] = DIR[P.dir];
  G.gusts.push({ x: P.x + dx * 9, y: P.y + dy * 9, dx, dy, life: 76, t: 0 });
  Sfx.wind();
}
function tickGusts() {
  for (const w of G.gusts) {
    w.x += w.dx * 3; w.y += w.dy * 3; w.t++; w.life--;
    const c = Math.floor(w.x / TILE), r = Math.floor(w.y / TILE), t = tileAt(c, r);
    if (t === undefined || ['T', 'R', '^', 'H', 'I', 'X', 'a', 't', 'L', 'B', 'E'].includes(t)) { w.life = 0; continue; }
    for (const e of [...G.ents]) {
      if (e.enemy) {
        if (Math.hypot(e.x - w.x, e.y - w.y) < e.r + 5) {
          if (e.kind === 'boss') { if (e.aura) { e.aura = false; e.state = 'stun'; e.timer = 220; e.st = 0; Sfx.ting(); spark(e.x, e.y); G.shake = 5; toast('いまだ！ ぼうで たたけ！'); } }
          else if (e.shield) { e.shield = false; Sfx.ting(); spark(e.x, e.y); e.stun = 60; }
          else { e.stun = 70; e.kx = w.dx * 2.6; e.ky = w.dy * 2.6; e.kt = 10; }
          w.life = 0; break;
        }
        continue;
      }
      if (!entActive(e)) continue;
      if (e.t === 'door' && !flag(e.def.flag) && overlap(w.x, w.y, 1, 1, e.x, e.y, 16, 16)) { w.life = 0; break; }
      if (e.t === 'pinwheel' && overlap(w.x - 3, w.y - 3, 6, 6, e.x, e.y, 16, 16)) {
        w.life = 0;
        e.spin = 360; Sfx.open();
        if (e.def.flag && !flag(e.def.flag)) { fmJingle('d_solve'); setFlag(e.def.flag); toast('とびらが ひらいた！'); }
        if (e.def.group && !flag(e.def.group)) {
          const all = G.ents.filter(o => o.t === 'pinwheel' && o.def.group === e.def.group);
          if (all.every(o => o.spin > 0)) { fmJingle('d_solve'); setFlag(e.def.group); toast('はしが かかった！'); }
          else toast('もう ひとつも はやく！');
        }
        break;
      }
      if ((e.t === 'boulder' || e.t === 'block') && overlap(w.x - 2, w.y - 2, 4, 4, e.x, e.y, 16, 16)) {
        w.life = 0;
        if (e.t === 'boulder') moveObject(e, w.dx, w.dy);
        break;
      }
      if (SOLID_ENT.has(e.t) && overlap(w.x, w.y, 1, 1, e.x, e.y, 16, 16)) { w.life = 0; break; }
    }
  }
  G.gusts = G.gusts.filter(w => w.life > 0);
}

// ── 敵の うごき ──
function tickEnemy(e) {
  e.anim++;
  if (e.flash > 0) e.flash--;
  if (e.hitCd > 0) e.hitCd--;
  if (e.kt > 0) {
    e.kt--;
    if (!enemyBlocked(e, e.x + e.kx, e.y)) e.x += e.kx;
    if (!enemyBlocked(e, e.x, e.y + e.ky)) e.y += e.ky;
    return;
  }
  if (e.kind === 'boss') return tickBoss(e);
  if (e.stun > 0) { e.stun--; contact(e); return; }
  const walk = (dx, dy) => {
    let hit = false;
    if (dx) { if (!enemyBlocked(e, e.x + dx, e.y)) e.x += dx; else hit = true; }
    if (dy) { if (!enemyBlocked(e, e.x, e.y + dy)) e.y += dy; else hit = true; }
    return hit;
  };
  if (e.kind === 'slime') {
    if (--e.timer <= 0) {
      e.timer = 40 + Math.floor(Math.random() * 70);
      const k = Math.floor(Math.random() * 5);
      [e.vx, e.vy] = [[.42, 0], [-.42, 0], [0, .42], [0, -.42], [0, 0]][k];
    }
    if (walk(e.vx, e.vy)) e.timer = 0;
  } else if (e.kind === 'crab') {
    if (walk(e.vx, 0)) e.vx = -e.vx;
  } else if (e.kind === 'bat') {
    const d = Math.hypot(P.x - e.x, P.y - e.y);
    if (!e.awake) { if (d < 70) e.awake = true; }
    else {
      e.a += .07 + Math.random() * .04;
      const tox = P.x - e.x, toy = P.y - e.y, n = Math.max(1, Math.hypot(tox, toy));
      walk(Math.cos(e.a) * .9 + tox / n * .35, Math.sin(e.a) * .9 + toy / n * .35);
    }
  } else if (e.kind === 'guard') {
    const tox = P.x - e.x, toy = P.y - e.y, n = Math.max(1, Math.hypot(tox, toy));
    const sp = e.shield ? .42 : .6;
    if (Math.abs(tox) > 2) walk(tox / n * sp, 0);
    if (Math.abs(toy) > 2) walk(0, toy / n * sp);
  }
  contact(e);
}
function contact(e) {
  if (Math.abs(e.x - P.x) < e.r + 4 && Math.abs(e.y - P.y) < e.r + 4) hurtPlayer(1, e.x, e.y);
}
function tickBoss(e) {
  e.st++;
  const tox = P.x - e.x, toy = P.y - e.y, n = Math.max(1, Math.hypot(tox, toy));
  if (e.state === 'walk') {
    const sp = e.hp <= 3 ? .62 : .46;
    if (!enemyBlocked(e, e.x + tox / n * sp, e.y)) e.x += tox / n * sp;
    if (!enemyBlocked(e, e.x, e.y + toy / n * sp)) e.y += toy / n * sp;
    if (--e.timer <= 0) { e.state = 'windup'; e.timer = 42; }
  } else if (e.state === 'windup') {
    e.shakeX = (e.st % 4 < 2) ? 1 : -1;
    if (--e.timer <= 0) {
      e.shakeX = 0; e.state = 'throw'; e.timer = 110;
      const ax = Math.abs(tox) > Math.abs(toy), sp = e.hp <= 3 ? 3.2 : 2.6;
      G.ents.push({ t: 'anchor', x: e.x, y: e.y, vx: ax ? Math.sign(tox) * sp : 0, vy: ax ? 0 : Math.sign(toy) * sp, st: 0, def: {}, owner: e, back: false });
      Sfx.throw();
    }
  } else if (e.state === 'throw') {
    if (--e.timer <= 0) { e.state = 'walk'; e.timer = 70 + Math.floor(Math.random() * 40); }
  } else if (e.state === 'stun') {
    if (--e.timer <= 0) { e.aura = true; e.combo = 0; e.state = 'walk'; e.timer = 60; Sfx.ting(); }
  }
  if (e.hp <= 3 && !e.spawned) {
    e.spawned = true; toast('かげを よんだ！');
    [[3, 4], [11, 4]].forEach(([x, y]) => G.ents.push(mkEnemy({ t: 'slime', x, y })));
  }
  contact(e);
}
function bossDown(e) {
  G.ents = G.ents.filter(o => o !== e && o.t !== 'anchor');
  G.ents = G.ents.filter(o => !o.enemy);
  G.mode = 'bossdie'; G.bossT = 0; G.bossX = e.x; G.bossY = e.y; fmStop(); Sfx.boom();
}
function tickBossDie() {
  G.bossT++;
  if (G.bossT % 9 === 0) { poof(G.bossX + (Math.random() - .5) * 26, G.bossY + (Math.random() - .5) * 26); Sfx.pop(); G.shake = 3; }
  tickFx();
  if (G.bossT > 90) {
    G.mode = 'play'; setFlag(G.room.bossFlag || 'boss_dead'); Sfx.door(); fmPlay('d_dungeon');
    say(G.room.bossFlag ? 'かげの ぬしを たおした！\nとびらが ひらいた。てっぺんへ のぼろう！' : 'いかり番を たおした！\nとびらが ひらいた。てっぺんへ のぼろう！', null, 'コロン');
  }
}
function tickAnchor(a) {
  a.st++;
  if (!a.back) {
    a.x += a.vx; a.y += a.vy;
    const c = Math.floor(a.x / TILE), r = Math.floor(a.y / TILE), t = tileAt(c, r);
    if (a.st > 44 || t === undefined || t === 'X' || t === 'a') { a.back = true; G.shake = 2; }
  } else {
    const dx = a.owner.x - a.x, dy = a.owner.y - a.y, n = Math.max(1, Math.hypot(dx, dy));
    a.x += dx / n * 3; a.y += dy / n * 3;
    if (n < 8 || !G.ents.includes(a.owner)) { G.ents = G.ents.filter(o => o !== a); return; }
  }
  if (Math.hypot(a.x - P.x, a.y - P.y) < 10) hurtPlayer(1, a.x, a.y);
}
function tickFx() { for (const f of G.fx) { f.x += f.vx; f.y += f.vy; f.t--; } G.fx = G.fx.filter(f => f.t > 0); }

// ── へやの きりかえ ──
function slideTo(id, side) {
  const from = G.bake; G.bake = null;
  const old = { x: P.x, y: P.y };
  const def = ROOMS[id];
  const inset = def.dg ? 24 : 8;
  let nx = P.x, ny = P.y;
  if (side === 'w') nx = W - inset; if (side === 'e') nx = inset;
  if (side === 'n') ny = FIELD_H - inset; if (side === 's') ny = inset;
  enterRoom(id, nx, ny, null);
  G.slide = { from, t: 0, dur: 26, dx: side === 'w' ? -1 : side === 'e' ? 1 : 0, dy: side === 'n' ? -1 : side === 's' ? 1 : 0, ox: old.x, oy: old.y, nx, ny };
  G.mode = 'slide'; P.onWarp = false; input.ap = input.bp = input.cp = false;
}
function startFade(to, x, y, dir) { G.fade = { to, x, y, dir, t: 0 }; G.mode = 'fade'; }
function tickFade() {
  const f = G.fade; f.t++;
  if (f.t === 16) enterRoom(f.to, f.x, f.y, f.dir);
  if (f.t >= 32) { G.fade = null; G.mode = 'play'; }
}

// ── エンディング ──
function lightLamp() {
  if (G.id === 'eT') return flag('c2_lit') ? say('ともった 火が、海を てらしている。') : say('火皿は つめたい。\nてっぺんの かべに、なにか 字が ほってある。');
  if (flag('ending')) { say('ともった 火が、海を てらしている。'); return; }
  say(['アンリノは、ひかりのぼうの 星を 火皿に そっと あてた。', '…………'], () => {
    S.f.ending = 1; writeSave();
    G.mode = 'ending'; G.end = { t: 0, line: -1 }; fmPlay('d_ending');
    $('ovEnd').hidden = false;
  });
}
const END_LINES = [
  [120, '灯台に 火が ともった！'],
  [320, '光は 海を わたり、アンリノ島の 港にも とどいた。'],
  [560, 'コロン「やったね、アンリノ！」'],
  [780, 'でも、とおい 海の むこうに、まだ かげが のこっている…'],
  [1020, '第1章 おわり\n第2章へ つづく'],
];
function tickEnding() {
  const e = G.end; e.t++;
  for (let i = END_LINES.length - 1; i >= 0; i--) if (e.t >= END_LINES[i][0]) { e.line = i; break; }
  if (e.t >= 1100) { $('btnEnd').hidden = false; if (!flag('ch2')) $('btnCh2End').hidden = false; }
}
function drawEnding() {
  const e = G.end, t = e.t;
  const dawn = Math.min(1, t / 700);
  const sky = g.createLinearGradient(0, 0, 0, 120);
  sky.addColorStop(0, `rgb(${12 + dawn * 30},${16 + dawn * 30},${50 + dawn * 50})`);
  sky.addColorStop(1, `rgb(${40 + dawn * 150},${50 + dawn * 70},${110 + dawn * 10})`);
  g.fillStyle = sky; g.fillRect(0, 0, W, 130);
  for (let i = 0; i < 40; i++) { const x = (i * 83) % 240, y = (i * 37) % 110; g.fillStyle = `rgba(255,255,255,${.7 * (1 - dawn) * (.4 + .6 * Math.sin(t * .03 + i) ** 2)})`; g.fillRect(x, y, 1, 1); }
  g.fillStyle = '#2a5f9d'; g.fillRect(0, 130, W, 62);
  for (let i = 0; i < 26; i++) { const x = (i * 47 + t * .15 * (1 + i % 3)) % 250 - 5, y = 134 + (i * 13) % 56; g.fillStyle = 'rgba(190,230,255,.35)'; g.fillRect(x, y, 8, 1); }
  // みさき
  g.fillStyle = '#27304f'; g.fillRect(138, 120, 110, 14); g.fillRect(150, 112, 90, 10);
  // とうだい
  const tx = 178;
  Art.R(g, '#e9e4f2', tx, 44, 22, 70); for (let i = 0; i < 3; i++) Art.R(g, '#e8705f', tx, 52 + i * 22, 22, 9);
  Art.R(g, '#27304f', tx - 3, 40, 28, 4); Art.R(g, '#27304f', tx + 2, 24, 18, 16); Art.R(g, '#27304f', tx + 6, 18, 10, 6);
  const on = t > 90;
  Art.R(g, on ? '#ffe36a' : '#3a4270', tx + 4, 26, 14, 12);
  if (on) {
    const a = Math.PI + Math.sin(t * .012) * .34 - .1, grow = Math.min(1, (t - 90) / 90);
    const lx = tx + 11, ly = 32, L = 240 * grow;
    const beam = g.createLinearGradient(lx, ly, lx + Math.cos(a) * L, ly + Math.sin(a) * L);
    beam.addColorStop(0, 'rgba(255,236,150,.85)'); beam.addColorStop(1, 'rgba(255,236,150,0)');
    g.fillStyle = beam; g.beginPath(); g.moveTo(lx, ly);
    g.lineTo(lx + Math.cos(a - .1) * L, ly + Math.sin(a - .1) * L); g.lineTo(lx + Math.cos(a + .1) * L, ly + Math.sin(a + .1) * L); g.closePath(); g.fill();
  }
  // とおくの アンリノ島
  g.fillStyle = '#1e3a57'; g.fillRect(14, 122, 44, 8); g.fillRect(22, 116, 26, 6);
  if (on && t > 320) { g.fillStyle = '#ffe36a'; g.fillRect(34, 118, 2, 2); g.fillRect(28, 120, 1, 1); g.fillRect(42, 121, 1, 1); }
  // ふたり
  g.drawImage(Art.heroFrames.u[0], 150, 96); g.drawImage(Art.colonL, 170, 100);
  // ことば
  if (e.line >= 0) {
    const txt = END_LINES[e.line][1].split('\n');
    const oy = e.line === END_LINES.length - 1 ? -22 : 0;   // さいごの ことばは ボタンに かくれないよう 上へ
    g.fillStyle = 'rgba(10,14,40,.76)'; g.fillRect(4, 142 + oy, 232, 40);
    g.fillStyle = '#fff7e0'; g.font = '13px DotGothic16, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const lines = txt.flatMap(s => s.length > 17 ? [s.slice(0, Math.ceil(s.length / 2)), s.slice(Math.ceil(s.length / 2))] : [s]);
    lines.forEach((s, i) => g.fillText(s, W / 2, 162 + oy + (i - (lines.length - 1) / 2) * 15));
    g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  }
}

// ── 1コマ ──
function clearEdges() { input.ap = input.bp = input.cp = false; }
function tick() {
  frame++;
  if (G.toastT > 0 && --G.toastT === 0) $('toast').classList.remove('on');
  if (G.placeT > 0 && --G.placeT === 0) $('place').classList.remove('on');
  if (G.hurtFlash > 0) G.hurtFlash--;
  if (G.shake > 0 && frame % 2 === 0) G.shake--;
  if (G.c2Flash > 0) G.c2Flash--;
  switch (G.mode) {
    case 'play': tickPlay(); break;
    case 'dialog': tickDialog(); break;
    case 'slide': if (++G.slide.t >= G.slide.dur) { G.slide = null; G.mode = 'play'; } break;
    case 'fade': tickFade(); break;
    case 'fall': tickFall(); break;
    case 'bossdie': tickBossDie(); break;
    case 'dead': if (++G.deadT === 50) $('ovDead').hidden = false; break;
    case 'ending': tickEnding(); break;
    case 'ending2': c2TickDawn(); break;
    case 'ending3': c2TickDusk(); break;
    case 'letter': if (input.ap || input.bp || input.cp) c2LetterNext(); break;
    case 'choice': c2TickMenu(); break;
  }
  clearEdges();
}
function tickPlay() {
  if (S) S.time++;
  if (c2Tick() || G.mode !== 'play') return;
  tickPlayer();
  if (G.mode !== 'play') return;
  for (const e of [...G.ents]) {
    if (e.enemy) tickEnemy(e);
    else if (e.t === 'anchor') tickAnchor(e);
    else if (e.t === 'drop') { if (--e.life <= 0) G.ents = G.ents.filter(o => o !== e); }
    else if (e.slide > 0) {
      e.slide -= 2; e.x += e.sdx * 2; e.y += e.sdy * 2;
      if (e.slide <= 0) { e.x = e.tx * TILE; e.y = e.ty * TILE; e.slide = 0; checkPlate(e); }
    } else if (e.t === 'pinwheel' && e.spin > 0) e.spin--;
    if (G.mode !== 'play') return;
  }
  tickGusts();
  tickFx();
  // ぜんぶ たおすと
  if (G.room.clear && !flag(G.room.clear) && !G.ents.some(e => e.enemy)) {
    fmJingle('d_solve'); setFlag(G.room.clear);
    toast(G.ents.some(e => e.t === 'chest' && entActive(e)) ? 'たからばこが あらわれた！' : 'とびらが ひらいた！'); Sfx.door();
  }
  // コロンが ついてくる（すこし はなれて 止まる）
  const cdx = P.x - colonF.x, cdy = P.y + 2 - colonF.y, cd = Math.hypot(cdx, cdy);
  if (cd > 20) { const sp = Math.min(1.6, (cd - 20) * .2 + .5); colonF.x += cdx / cd * sp; colonF.y += cdy / cd * sp; }
}

// ── 描く ──
function waterGlints() {
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (G.tiles[r][c] !== 'W') continue;
    const ph = (c * 7 + r * 13 + Math.floor(frame / 16)) % 10;
    if (ph < 3) { Art.R(g, '#a8e4f3', c * TILE + 3 + ph, r * TILE + 5, 6, 1); Art.R(g, '#74c7ec', c * TILE + 4 + ph, r * TILE + 6, 4, 1); }
    if (ph > 5 && ph < 8) { Art.R(g, '#a8e4f3', c * TILE + 9 - ph % 3, r * TILE + 11, 4, 1); }
    // 岸の なみ
    const up = r > 0 && G.tiles[r - 1][c] !== 'W' && G.tiles[r - 1][c] !== 'L';
    if (up && Math.floor(frame / 24 + c) % 2) Art.R(g, '#f2fcff', c * TILE, r * TILE + 3, 16, 1);
  }
}
function drawEnt(e) {
  const x = Math.round(e.x), y = Math.round(e.y);
  if (e.enemy) {
    if (e.flash > 0 && e.flash % 4 < 2 && e.kind !== 'boss') return;
    const fr = Math.floor(e.anim / 14) % 2;
    if (e.kind === 'boss') { Art.boss(g, x + (e.shakeX || 0), y, { t: e.anim, state: e.state, aura: e.aura, ink: e.def.ink, flash: e.flash > 0 && e.flash % 4 < 2 }); return; }
    g.fillStyle = 'rgba(5,10,30,.35)';
    if (e.kind === 'guard') g.fillRect(x - 9, y + 4, 18, 3);
    else if (e.kind === 'bat') g.fillRect(x - 5, y + 8, 10, 2);
    else g.fillRect(x - 7, y + 4, 14, 2);
    const img = { slime: Art.slime, bat: Art.bat, crab: Art.crab, guard: Art.guard }[e.kind][fr];
    const by = e.kind === 'bat' ? y - 10 + Math.round(Math.sin(e.anim * .15)) : y + 7 - img.height;
    g.drawImage(img, x - Math.floor(img.width / 2), by);
    if (e.shield) Art.shield(g, x, y - 6, e.anim);
    if (e.stun > 0 && !e.shield) { for (let i = 0; i < 3; i++) { const a = frame * .2 + i * 2.1; Art.R(g, '#ffe08a', x + Math.cos(a) * 7, y - 11 + Math.sin(a) * 2, 2, 2); } }
    return;
  }
  switch (e.t) {
    case 'door': if (!flag(e.def.flag)) Art.door(g, x, y, e.def.kind, e.def.side); break;
    case 'chest': if (entActive(e)) Art.chest(g, x, y, flag('chest_' + e.def.id), e.def.big); break;
    case 'npc': g.drawImage(Art.NPC[e.def.id], x, y + (Math.floor(frame / 40 + e.tx) % 2 ? -1 : 0)); break;
    case 'sign': Art.sign(g, x, y); break;
    case 'stone': Art.stone(g, x, y, frame); break;
    case 'block': Art.block(g, x, y); break;
    case 'boulder': Art.boulder(g, x, y); break;
    case 'pinwheel': Art.pinwheel(g, x, y, frame, e.spin > 0 || flag(e.def.flag || e.def.group)); break;
    case 'lamp': Art.lamp(g, x, y, flag(G.room.lampFlag || 'ending'), frame); break;
    case 'story': if (entActive(e)) Art.c2(g, e.def.kind, x, y, frame); break;
    case 'pick': g.drawImage(Art.ICON.shell, x + 4, y + 4); break;
    case 'drop': if (e.life > 90 || frame % 8 < 4) g.drawImage(e.kind === 'heal' ? Art.ICON.drop : Art.ICON.shell, x - 4, y - 4); break;
    case 'anchor': Art.anchor(g, x, y, e.st); break;
  }
}
function drawHero() {
  if (P.inv > 0 && frame % 6 < 3 && G.mode !== 'dead') return;
  const x = Math.round(P.x), y = Math.round(P.y);
  g.fillStyle = 'rgba(5,10,30,.32)'; g.fillRect(x - 6, y + 5, 12, 2);
  const moving = input.x || input.y;
  const f = moving && G.mode === 'play' ? 1 + Math.floor(P.walk * 1.2) % 2 : 0;
  let sprDir = P.dir;
  if (G.mode === 'dead') sprDir = ['d', 'l', 'u', 'r'][Math.floor(frame / 8) % 4];
  const img = Art.heroFrames[sprDir][f];
  if (G.mode === 'fall') {
    const s = Math.max(.1, 1 - G.fall / 32);
    g.drawImage(img, x - 9 * s, y - 14 * s, 18 * s, 22 * s);
    return;
  }
  const swing = P.swing > 0, sp = 1 - P.swing / 14;
  if (swing && P.dir === 'u') drawStaff(x, y, sp);
  g.drawImage(img, x - 9, y + 7 - img.height);
  if (swing && P.dir !== 'u') drawStaff(x, y, sp);
  if (G.hold) g.drawImage(G.hold, x - Math.floor(G.hold.width / 2), y - 19 - G.hold.height);
}
function drawStaff(x, y, sp) {
  const base = { u: 0, r: Math.PI / 2, d: Math.PI, l: -Math.PI / 2 }[P.dir];
  Art.staffSwing(g, x, y - 2, base - 1.05 + sp * 2.1);
  // きらきら
  if (sp > .2 && sp < .9) { const a = base - 1.05 + sp * 2.1 - Math.PI / 2; Art.R(g, '#fff4b0', x + Math.cos(a) * 18, y - 2 + Math.sin(a) * 18, 2, 2); }
}
function drawColon() {
  if (G.mode === 'ending') return;
  const flipL = P.x < colonF.x;
  g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(colonF.x - 4, colonF.y + 5, 8, 2);
  const by = Math.floor(frame / 12) % 2;
  g.drawImage(flipL ? Art.colonL : Art.colon, Math.round(colonF.x - 6), Math.round(colonF.y - 7 - by));
}
function drawWorld() {
  g.drawImage(G.bake, 0, 0);
  if (G.room.map.some(r => r.includes('W'))) waterGlints();
  for (const e of G.ents) if (e.t === 'plate') Art.plate(g, e.x, e.y, flag(e.def.flag));
  const list = G.ents.filter(e => e.t !== 'plate' && e.t !== 'warp').map(e => ({ y: e.t === 'door' ? -99 : e.y + (e.enemy ? 0 : 16), draw: () => drawEnt(e) }));
  list.push({ y: P.y + 5, draw: drawHero });
  list.push({ y: colonF.y + 3, draw: drawColon });
  list.sort((a, b) => a.y - b.y).forEach(o => o.draw());
  for (const w of G.gusts) Art.gust(g, w.x, w.y, w.t);
  for (const f of G.fx) Art.R(g, f.c, Math.round(f.x), Math.round(f.y), 2, 2);
  if ((G.id === 'dT' && flag('ending')) || (G.id === 'eT' && flag('c2_lit'))) { g.fillStyle = 'rgba(255,220,120,.14)'; g.fillRect(0, 0, W, FIELD_H); }
  if (G.c2Flash > 0) { g.fillStyle = `rgba(255,255,240,${G.c2Flash / 40})`; g.fillRect(0, 0, W, FIELD_H); }
}
function drawHUD() {
  const Y = FIELD_H;
  Art.R(g, '#10152e', 0, Y, W, 16); Art.R(g, '#efbd3b', 0, Y, W, 1); Art.R(g, '#8d5a14', 0, Y + 1, W, 1); Art.R(g, '#232b52', 0, Y + 2, W, 14);
  const n = S.maxHp / 2;
  for (let i = 0; i < n; i++) {
    const v = S.hp - i * 2;
    g.drawImage(v >= 2 ? Art.ICON.drop : v === 1 ? Art.ICON.dropHalf : Art.ICON.dropEmpty, 3 + i * 11, Y + 3);
  }
  g.font = '11px DotGothic16, monospace'; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  const num = (t, x) => { g.fillStyle = '#10152e'; g.fillText(t, x + 1, Y + 14); g.fillStyle = '#fff7e0'; g.fillText(t, x, Y + 13); };
  let x = 116;
  g.drawImage(Art.ICON.shell, x, Y + 3); num(String(S.shells), x + 12); x += 36;
  g.drawImage(Art.ICON.key, x, Y + 4); num(String(S.keys), x + 12); x += 24;
  if (S.big && !flag('dG_big')) g.drawImage(Art.ICON.big, x, Y + 3);
  x += 17;
  if (S.staff) g.drawImage(Art.ICON.staff, x, Y + 3);
  x += 12;
  if (S.jar) g.drawImage(Art.ICON.jar, x, Y + 2);
}
function render() { draw(); out.drawImage(buf, 0, 0, cv.width, cv.height); }
function draw() {
  if (G.mode === 'title' || !S) { g.fillStyle = '#0f1537'; g.fillRect(0, 0, W, H); return; }
  if (G.mode === 'ending') { drawEnding(); return; }
  if (G.mode === 'ending2') { c2DrawDawn(); return; }
  if (G.mode === 'ending3') { c2DrawDusk(); return; }
  g.save();
  if (G.shake > 0) g.translate((frame % 2 ? 1 : -1) * Math.min(2, G.shake), 0);
  if (G.mode === 'slide' && G.slide) {
    const s = G.slide, p = s.t / s.dur;
    const ax = -s.dx * W * p, ay = -s.dy * FIELD_H * p;
    g.drawImage(s.from, ax, ay);
    g.save(); g.translate(ax + s.dx * W, ay + s.dy * FIELD_H);
    drawWorldNoHero();
    g.restore();
    const hx = s.ox + (s.nx - s.ox) * p, hy = s.oy + (s.ny - s.oy) * p;
    const sx = P.x, sy = P.y; P.x = hx; P.y = hy; drawHero(); P.x = sx; P.y = sy;
  } else {
    drawWorld();
  }
  g.restore();
  if (G.hurtFlash > 0 && G.hurtFlash % 3 === 0) { g.fillStyle = 'rgba(255,90,90,.25)'; g.fillRect(0, 0, W, FIELD_H); }
  if (G.fade) { const a = G.fade.t < 16 ? G.fade.t / 16 : (32 - G.fade.t) / 16; g.fillStyle = `rgba(8,10,28,${a})`; g.fillRect(0, 0, W, FIELD_H); }
  if (G.mode === 'dead') { g.fillStyle = `rgba(8,10,28,${Math.min(.8, G.deadT / 60)})`; g.fillRect(0, 0, W, FIELD_H); drawHero(); }
  if (G.mode === 'bossdie') { g.fillStyle = `rgba(255,255,255,${G.bossT % 18 < 3 ? .35 : 0})`; g.fillRect(0, 0, W, FIELD_H); }
  drawHUD();
}
function drawWorldNoHero() {
  g.drawImage(G.bake, 0, 0);
  for (const e of G.ents) if (e.t === 'plate') Art.plate(g, e.x, e.y, flag(e.def.flag));
  for (const e of G.ents) if (e.t !== 'plate' && e.t !== 'warp') drawEnt(e);
}

// ── はじまり ──
function startNew() {
  S = newSave();
  $('ovTitle').hidden = true;
  fmUnlock();
  P.dir = 'r'; G.mode = 'play';
  enterRoom('v0', S.x, S.y, 'r');
  $('btnLetters').hidden = true;
  say(['かげモンスターが、海の むこうの 灯台の 火を けしてしまった。', 'アンリノは 相棒の コロンと、小さな 船で「みなとの村」に たどりついた。', 'コロン「まず 村長さんに 会いに いこう！ ひだりの いえだよ。こまったら 💬ボタンで ぼくに きいてね」'], null, '');
}
function startCont() {
  S = loadSave();
  if (!S) return startNew();
  $('ovTitle').hidden = true;
  fmUnlock();
  G.mode = 'play';
  enterRoom(S.room, S.x, S.y, S.dir);
  c2RefreshBtn();
}
function backToTitle() {
  $('ovEnd').hidden = true; $('btnEnd').hidden = true; $('btnCh2End').hidden = true; $('btnLetters').hidden = true;
  G.mode = 'title'; G.end = null; fmStop();
  $('ovTitle').hidden = false; refreshTitle();
  // おわったあとは、灯台の まえから 遊べるように
  if (S) { if (flag('c2_end')) { S.room = 'v0'; S.x = 72; S.y = 104; S.dir = 'r'; } else { S.room = 'f4'; S.x = 120; S.y = 104; S.dir = 'u'; } writeSave(); }
}
let confirmNew = false;
function refreshTitle() {
  const sv = loadSave(), has = !!sv;
  $('btnCh2').hidden = !(sv && sv.f.ending && !sv.f.ch2);
  $('logoSub').textContent = sv && sv.f.ending ? '第2章 ひかりの てがみ' : '第1章 きえた ともしび';
  $('btnCont').hidden = !has;
  $('btnNew').textContent = 'はじめから'; confirmNew = false;
  $('btnNew').classList.toggle('go', !has);
}
$('btnNew').addEventListener('click', () => {
  if (loadSave() && !confirmNew) { confirmNew = true; $('btnNew').textContent = 'きろくを けして はじめる？'; return; }
  startNew();
});
$('btnCont').addEventListener('click', startCont);
$('btnRetry').addEventListener('click', respawn);
$('btnEnd').addEventListener('click', backToTitle);
$('btnMusic').addEventListener('click', () => { const on = musicToggle(); $('btnMusic').textContent = on ? '🎵' : '🔇'; });
$('btnMusic').textContent = FM.on ? '🎵' : '🔇';
document.addEventListener('visibilitychange', () => { if (document.hidden) writeSave(); });
addEventListener('pagehide', writeSave);

// ── まわす ──
let last = 0, acc = 0, manual = false;
const STEP = 1000 / 60;
function loop(ts) {
  requestAnimationFrame(loop);
  if (manual) return;
  if (!last) last = ts;
  acc = Math.min(acc + ts - last, 200); last = ts;
  while (acc >= STEP) { tick(); acc -= STEP; }
  render();
}

c2Init();
refreshTitle();
applyGate();
requestAnimationFrame(loop);

if (DEBUG) {
  window.__AN = {
    get S() { return S; }, G, P, input, ROOMS, flag,
    manual(v) { manual = v; },
    step(n) { for (let i = 0; i < (n || 1); i++) tick(); render(); },
    render,
    passable(c, r) { return !tileBlocked(c, r) && tileAt(c, r) !== 'P' && !G.ents.some(e => !e.enemy && e.tx === c && e.ty === r && entSolidAt(e)); },
    tileAt,
  };
}
