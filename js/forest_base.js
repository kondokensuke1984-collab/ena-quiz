// ============================================================
// 🏜 さばくの アジト だっかんさくせん（まよいの森の つぎの ステージ）
//   ・うみが へいわに なると、うみべに ボート（u）が くる → フクロウたいちょうの むせん → アジトへ
//   ・みはり（BASE_GUARDS）が きまった みちを みまわる。みえる ところ（きいろ）に はいると「！」→ たたかい
//     かつと その みはりは その日 ずっと 💤。まけると いりぐちへ
//   ・🌾 たかい くさ（h）の なか・📦 ダンボールを かぶって じっと している あいだは みつからない
//   ・ろうや（J）の ロックを クイズで あけて、まちの ひとを 3にん たすける → かげの だんちょう（O）→ ヘリポート（Z）で せいこう
//   ・はじめて せいこうすると save.basePeace（ずっと）。アジトは へいわな まちに なる
//   ・その日の しんこうは save.forest.base（1日ごとに forestState が つくりなおす）
//   ・3D・2D の かきかたは js/forest.js（buildBase・forestPaint2D）。ここは しくみと データ
// ============================================================

// 記号：w コンクリの かべ　a すなの ゆか　b つみにの はこ　h たかい くさ（かくれられる）　J ろうや
//       A ダンボールの やま　O かげの だんちょう　Z ヘリポート　u ボート（うみべへ）　~ うみ
const BASE_ROWS = [
  'wwwwwwwwwwwwwwwwwwwwwwww',
  'wJaaaawaaaaaZaaaaawaaaJw',
  'waaaaawaaaaaaaaaaawaaaaw',
  'waaaaawaaaaaOaaaaawaaaaw',
  'wbaaaawaaaaaaaaaaawaaabw',
  'wwwawwwwwwwaawwwwwwwawww',
  'waaaaaaaaaaaaaaaaaaaaaaw',
  'wahhaabbaaaaaaaabbaahhaw',
  'wahhaabbaawwwwwaabbaahhw',
  'waaaaaaaaawJaawaaaaaaaaw',
  'waaaaaaaaawaaawaaaaaaaaw',
  'waabbaaahhwwawwaaaabbaaw',
  'waabbaaahhaaaaaaaaabbaaw',
  'wAaaaaaaaaaaaaaaaaaaaaaw',
  'wwwwwwwaaaaaaaaaawwwwwww',
  '~~~~~~waaaaaaaaaaw~~~~~~',
  '~~~~~~~~~~~u~~~~~~~~~~~~',
  '~~~~~~~~~~~~~~~~~~~~~~~~',
];
const BASE_SPOTS = { start: [11, 15], boss: [12, 3], heli: [12, 1], boat: [11, 16] };
const BEACH_BOAT = [1, 8], BEACH_FROM_BOAT = [2, 8];   // うみべの ボート（うみが へいわに なると くる）
// ろうや [x, y, つかまった ひと, なまえ]
const BASE_CELLS = [
  [1, 1, 'fm_knight', 'よろいナイト'],
  [22, 1, 'fm_kurage', 'ふわふわクラゲ'],
  [11, 9, 'fm_candle', 'おばけキャンドル'],
];
// みはり：みまわる みち（かどの マスを じゅんばんに。はしまで いくと まわりを みまわして もどる）
const BASE_GUARDS = [
  { key: 'fm_heitai', path: [[2, 6], [10, 6]] },
  { key: 'fm_heitai2', path: [[21, 6], [13, 6]] },
  { key: 'fm_drone', path: [[7, 9], [7, 13]] },
  { key: 'fm_drone2', path: [[16, 13], [16, 9]] },
  { key: 'fm_light', path: [[8, 2], [16, 2]] },
];
// 🕊 へいわに なった あとの まちの ひと（もと みはり）
const BASE_VILLAGERS = [
  [5, 7, 'fm_heitai', 'みはりへい「もう みはりは しないよ。いまは さばくの おはなを そだてているんだ」'],
  [18, 7, 'fm_heitai2', 'へいたいちょう「ルナどのに けいれい！ …まちがえた、こんにちは！」'],
  [11, 12, 'fm_drone', 'ていさつドローン「そらから まちの みんなを みまもっているよ」'],
  [8, 3, 'fm_drone2', 'レッドドローン「ランプは もう あかじゃなくて、みどりに したよ」'],
  [16, 3, 'fm_light', 'サーチライトロボ「よるは まちの みちを てらす しごと！」'],
];
const BASE_TICK = 0.6;          // みはりが 1マス すすむ 秒
const BASE_GRACE = 1.2;         // アジトに はいった・たたかいの あと、この 秒は みつからない
const BASE_MEDAL_DAILY = 5, BASE_MEDAL_FIRST = 10, BASE_MEDAL_S = 2;

// 🦉 フクロウたいちょう（むせんの かお）
const BASE_OWL_SVG =
  '<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><g stroke="#2a1b3d" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">' +
  '<path d="M20 112 C16 64 34 34 60 34 C86 34 104 64 100 112 Z" fill="#a16207"/>' +
  '<path d="M38 112 C38 84 46 70 60 70 C74 70 82 84 82 112 Z" fill="#fde68a"/>' +
  '<path d="M44 84 l4 4 M56 80 l4 4 M66 86 l4 4 M50 96 l4 4 M62 98 l4 4" fill="none" stroke-width="3"/>' +
  '<path d="M26 40 L34 14 L48 34 Z M94 40 L86 14 L72 34 Z" fill="#a16207"/>' +
  '<path d="M24 34 C30 18 90 18 96 34 Q60 42 24 34 Z" fill="#15803d"/><circle cx="80" cy="26" r="5" fill="#facc15" stroke-width="3"/>' +
  '<circle cx="44" cy="54" r="15" fill="#fff"/><circle cx="76" cy="54" r="15" fill="#fff"/>' +
  '<circle cx="46" cy="56" r="7" fill="#111" stroke="none"/><circle cx="74" cy="56" r="7" fill="#111" stroke="none"/>' +
  '<circle cx="43" cy="53" r="2.5" fill="#fff" stroke="none"/><circle cx="71" cy="53" r="2.5" fill="#fff" stroke="none"/>' +
  '<path d="M30 44 L52 48 M90 44 L68 48" fill="none" stroke-width="5"/>' +
  '<path d="M54 64 L60 76 L66 64 Z" fill="#f59e0b"/>' +
  '<path d="M16 58 C10 58 10 76 16 76" fill="#334155"/><path d="M16 76 Q22 92 40 90" fill="none" stroke-width="3"/><circle cx="41" cy="90" r="4" fill="#334155" stroke-width="3"/>' +
  '</g></svg>';

let fzBase = null;              // いまの みはり（アジトに はいるたびに つくる）
let forestBaseFight = -1;       // たたかっている みはりの ばんごう
let forestBaseCellNow = -1;     // あけようと している ろうや
let forestBaseTrail = [];       // ルナが あるいた マス（たすけた ひとが ついてくる）

function forestBasePeace() { return !!save.basePeace; }
function forestBaseState() {
  const f = save.forest;
  if (!f.base || typeof f.base !== 'object') f.base = { rescued: [], sleep: {}, hasBox: false, box: false, found: 0, t0: 0, boss: false, done: false };
  return f.base;
}
function forestInBase() { return typeof fz !== 'undefined' && fz && fz.area === 'base'; }

// ちず（へいわなら まちの ひと）。うみべの ボートは うみが へいわに なるまで うみの まま
function forestBaseMap() {
  const m = forestFixedMap(BASE_ROWS, 'base', BASE_SPOTS.start, '~');
  return forestVillagers(m, BASE_VILLAGERS, forestBasePeace());
}
function forestBaseBeachFix(m) {
  if (!forestUmiPeace()) m.t[BEACH_BOAT[1] * m.W + BEACH_BOAT[0]] = '~';
  return m;
}

// ── みはりの じゅんび ──
function forestBasePathCells(path) {
  const out = [];
  for (let i = 0; i < path.length - 1; i++) {
    const [ax, ay] = path[i], [bx, by] = path[i + 1];
    const n = Math.max(Math.abs(bx - ax), Math.abs(by - ay));
    for (let k = 0; k < n; k++) out.push([ax + Math.sign(bx - ax) * k, ay + Math.sign(by - ay) * k]);
  }
  out.push(path[path.length - 1].slice());
  return out;
}
function forestBaseDirOf(dx, dy) { return dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up'; }
function forestBaseLoad() {
  if (!forestInBase()) { fzBase = null; return; }
  const b = forestBaseState();
  const f = save.forest;
  forestBaseTrail = [];
  for (let i = 0; i < 6; i++) forestBaseTrail.push([f.x, Math.min(f.y + 1, BASE_SPOTS.start[1])]);
  if (forestBasePeace()) { fzBase = { guards: [], t: 0, grace: 0, alert: null }; return; }
  fzBase = {
    t: 0, grace: BASE_GRACE, alert: null,
    guards: BASE_GUARDS.map((g, n) => {
      const cells = forestBasePathCells(g.path);
      const z = b.sleep[n];
      const [x, y] = z ? [z[0], z[1]] : cells[0];
      const [dx, dy] = cells.length > 1 ? [cells[1][0] - cells[0][0], cells[1][1] - cells[0][1]] : [0, 1];
      return { n, key: g.key, cells, i: z ? cells.findIndex(c => c[0] === x && c[1] === y) : 0, d: 1, x, y, fx: x, fy: y,
               dir: z ? z[2] : forestBaseDirOf(dx, dy), wait: 0, look: [], sleep: !!z || b.done };
    }),
  };
}

// ── みえる ところ（むいている ほうへ 3マス。2マス めから となりも。かべ・はこで さえぎる）──
function forestBaseSeeThrough(x, y) { const t = fz.get(x, y); return FOREST_WALK.includes(t) || t === '~' || t === 'V'; }
function forestBaseView(g) {
  if (g.sleep) return [];
  const [dx, dy] = FOREST_DIRS[g.dir], sx = -dy, sy = dx, out = [];
  for (let i = 1; i <= 3; i++) { const x = g.x + dx * i, y = g.y + dy * i; if (!forestBaseSeeThrough(x, y)) break; out.push([x, y]); }
  if (forestBaseSeeThrough(g.x + dx, g.y + dy)) {
    [-1, 1].forEach(s => {
      for (let i = 2; i <= 3; i++) { const x = g.x + dx * i + sx * s, y = g.y + dy * i + sy * s; if (!forestBaseSeeThrough(x, y)) break; out.push([x, y]); }
    });
  }
  return out;
}
// ルナが かくれているか（くさの なか・ダンボールで じっと）
function forestBaseHidden() {
  const f = save.forest, b = forestBaseState();
  const onGrass = forestTile(f.x, f.y) === 'h' && (!forestMv || forestTile(forestMv.tx, forestMv.ty) === 'h');
  return onGrass || (b.box && !forestMv && !forestHeld.length);
}
function forestBaseBoxOn() { return forestInBase() && !forestBasePeace() && !!forestBaseState().box; }

// ── まいフレーム（forestFrame から）──
function forestBaseTick(dt) {
  if (!forestInBase() || !fzBase) return;
  forestBaseRadar();
  if (forestBasePeace() || fzBase.alert || forestBaseState().done) return;
  if (document.getElementById('fz-brief') || document.getElementById('fz-warp') || document.getElementById('fz-dex') || document.getElementById('fz-mission')) return;
  const tk = typeof TENKEN !== 'undefined' && TENKEN.on ? TENKEN : {};   // 🔧 点検モード（js/tenken.js）
  if (tk.freeze) return;
  fzBase.grace = Math.max(0, fzBase.grace - dt);
  fzBase.t += dt;
  if (fzBase.t >= BASE_TICK) {
    fzBase.t -= BASE_TICK;
    for (const g of fzBase.guards) { if (forestBaseStepGuard(g)) return; }
  }
  if (fzBase.grace > 0 || forestBaseHidden() || tk.ghost) return;
  const f = save.forest;
  const cells = forestMv ? [[f.x, f.y], [forestMv.tx, forestMv.ty]] : [[f.x, f.y]];
  for (const g of fzBase.guards) {
    const v = forestBaseView(g);
    if (cells.some(([cx, cy]) => v.some(([x, y]) => x === cx && y === cy))) return forestBaseAlert(g, '');
  }
}
// みはりを 1マス すすめる（ルナに ぶつかったら みつかる）。みつかったら true
function forestBaseStepGuard(g) {
  g.fx = g.x; g.fy = g.y;
  if (g.sleep) return false;
  if (g.wait > 0) { g.dir = g.look[g.look.length - g.wait]; g.wait--; return false; }
  let ni = g.i + g.d;
  if (ni < 0 || ni >= g.cells.length) {          // はしまで きた：まわりを みまわして もどる
    g.d = -g.d;
    const [dx, dy] = FOREST_DIRS[g.dir];
    g.look = [forestBaseDirOf(-dy, dx), forestBaseDirOf(dy, -dx), forestBaseDirOf(-dx, -dy)];
    g.wait = g.look.length;
    g.dir = g.look[0]; g.wait--;
    return false;
  }
  const [nx, ny] = g.cells[ni], f = save.forest;
  g.dir = forestBaseDirOf(nx - g.x, ny - g.y);
  const lx = forestMv ? forestMv.tx : f.x, ly = forestMv ? forestMv.ty : f.y;
  const ghost = typeof TENKEN !== 'undefined' && TENKEN.on && TENKEN.ghost;
  if (fzBase.grace <= 0 && !ghost && ((nx === f.x && ny === f.y) || (nx === lx && ny === ly))) {
    forestBaseAlert(g, forestBaseState().box ? '📦 ダンボールに ぶつかった…！ ' : '');
    return true;
  }
  g.i = ni; g.x = nx; g.y = ny;
  return false;
}
function forestBaseAlert(g, pre) {
  const b = forestBaseState();
  fzBase.alert = g;
  b.found = (b.found || 0) + 1;
  persist();
  forestHeld.length = 0;
  forestBusy = true;
  if (typeof fmJingle === 'function') fmJingle('alert');
  forestSay((pre || '') + '❗ みつかった！ ' + CHAR_NAME[g.key] + ' が こっちに きた！');
  setTimeout(() => {
    forestBusy = false;
    forestEncounter(() => { forestBaseFight = g.n; startForestBattle('patrol', g.key); });
  }, 700);
}

// いま かく みはり（あるいている とちゅうは あいだ）
function forestBaseGuardsNow() {
  if (!fzBase) return [];
  const k = Math.min(1, fzBase.t / BASE_TICK);
  return fzBase.guards.map(g => ({
    n: g.n, key: g.key, dir: g.dir, sleep: g.sleep, alert: fzBase.alert === g,
    px: g.fx + (g.x - g.fx) * k, py: g.fy + (g.y - g.fy) * k, view: forestBaseView(g),
  }));
}
// たすけた ひと（ルナの うしろに ならぶ）
function forestBaseArrived(fx, fy) {
  if (!forestInBase()) return;
  forestBaseTrail.unshift([fx, fy]);
  forestBaseTrail.length = Math.min(forestBaseTrail.length, 8);
}
function forestBaseFollowers() {
  if (!forestInBase() || forestBasePeace()) return [];
  const b = forestBaseState();
  if (b.done) return [];
  const off = forestPalKey() ? 1 : 0;
  return b.rescued.map((c, i) => {
    const j = off + i, at = forestBaseTrail[j] || forestBaseTrail[forestBaseTrail.length - 1];
    if (!forestMv) return { key: BASE_CELLS[c][2], x: at[0], y: at[1], k: 0 };
    const to = j === 0 ? [forestMv.fx, forestMv.fy] : forestBaseTrail[j - 1];
    const k = forestMv.t;
    return { key: BASE_CELLS[c][2], x: at[0] + (to[0] - at[0]) * k, y: at[1] + (to[1] - at[1]) * k, k };
  });
}
// 3D を つくりなおす めじるし
function forestBaseKey() {
  const b = forestBaseState();
  return ':base' + (forestBasePeace() ? 'P' : '') + b.rescued.join('') + (b.boss ? 'B' : '') + (b.done ? 'D' : '');
}

// ── アジトへ いく ──
function forestBaseGo() {
  if (!forestUmiPeace()) return forestSay('🌊 うみが へいわに なると、ボートが むかえに くるよ。');
  if (forestBasePeace()) return forestGoArea('base', BASE_SPOTS.start, 'up', '🕊 へいわな さばくの まちに ついた。まちの ひとが まっているよ');
  const b = forestBaseState();
  if (b.done) return forestGoArea('base', BASE_SPOTS.start, 'up', '✅ きょうの さくせんは せいこうずみ！ また あした ちょうせん しよう');
  if (b.t0) return forestGoArea('base', BASE_SPOTS.start, 'up', '🏜 アジトに もどってきた。みつからないように すすもう…');
  forestBriefing([
    'ルナ、きこえるか？ こちら フクロウたいちょう だ。',
    'うみの むこうの さばくに、かげの だんちょうの アジトが みつかった。',
    'おしろと うみの まちの ひとが 3にん、ろうやに つかまっている。',
    'さくせんめいは『オペレーション・ムーンライト』。3にんを たすけだして、ヘリポートから だっしゅつ せよ！',
    'みはりの まえの きいろい ところに はいると みつかるぞ。かべや はこの かげを つかえ。',
    '🌾 たかい くさの なかや、📦 ダンボールを かぶって じっと していれば みつからない。ダンボールは アジトの ひだり したに ある。',
    'みつかったら たたかいだ。かてば みはりは ねむる。…ぶじを いのる。',
  ], () => {
    forestBaseState().t0 = Date.now();
    persist();
    forestGoArea('base', BASE_SPOTS.start, 'up', '🏜 オペレーション・ムーンライト かいし！ みつからないように…');
  });
}

// ── しらべる（forestInteract の さいしょ。あつかったら true）──
function forestBaseInteract(x, y, t) {
  if (t === 'u') {
    if (forestArea() === 'beach') { forestBaseGo(); return true; }
    forestGoArea('beach', BEACH_FROM_BOAT, 'right', '🚤 ボートで うみべに もどった。');
    return true;
  }
  if (!forestInBase()) return false;
  const b = forestBaseState(), peace = forestBasePeace();
  if (t === 'w') { forestSay('コンクリートの かべだ。'); return true; }
  if (t === 'b') { forestSay('つみにの はこだ。この かげに かくれれば みはりから みえない。'); return true; }
  if (t === 'A') {
    if (peace) { forestSay('📦 ダンボールの やまだ。'); return true; }
    if (b.hasBox) { forestSay('📦 ダンボールの やまだ。もう ひとつ もっているよ。'); return true; }
    b.hasBox = true; persist(); forestHud();
    forestSay('📦 ダンボールを てに いれた！ みぎの「📦 かぶる」で かくれられるよ（うごくと みつかる）');
    return true;
  }
  if (t === 'J') {
    const c = BASE_CELLS.findIndex(([cx, cy]) => cx === x && cy === y);
    if (peace || c < 0) { forestSay('もう だれも いない ろうやだ。'); return true; }
    if (b.rescued.includes(c)) { forestSay('からっぽの ろうやだ。'); return true; }
    forestSay('🔐 ' + BASE_CELLS[c][3] + '「たすけて〜！」　ロックを クイズで はずそう！');
    forestBaseCellNow = c;
    persist();
    forestEncounter(() => startForestBattle('lock'));
    return true;
  }
  if (t === 'O') {
    if (peace) {
      if (save.forest.baseDay === todayKey()) { forestSay('🕶 だんちょう「きょうは もう まいった。また あした こい」'); return true; }
      if (!forestNushiAsk) { forestNushiAsk = true; forestSay('🕶 だんちょう「いまは まちの ちょうちょう だ。…また しょうぶ するか？（もう いちど はなしかけると しょうぶ）」'); return true; }
      forestNushiAsk = false;
    } else if (b.boss) { forestSay('だんちょうは もう いない。ヘリポートへ いそげ！'); return true; }
    else if (b.rescued.length < BASE_CELLS.length) { forestSay('🕶 かげの だんちょう「ふん…ろうやの 3にんを たすけてから くるんだな」（あと ' + (BASE_CELLS.length - b.rescued.length) + 'にん）'); return true; }
    persist();
    forestSay('🕶 かげの だんちょう「よく ここまで きたな。だが ここで おわりだ！」');
    forestEncounter(() => startForestBattle('base'));
    return true;
  }
  if (t === 'Z') {
    if (peace) {
      forestGoArea('volcano', VOLCANO_SPOTS.start, 'up',
        forestVolcanoPeace() ? '🚁 ヘリで へいわな マグマの かざんに ついた！'
        : '🚁 ヘリで マグマの かざんに ついた！ 3つの こおりの クリスタルを さわって おくへ すすもう');
      return true;
    }
    if (b.done) { forestSay('✅ きょうの さくせんは せいこうずみ！ ヘリで マグマの かざんへ いこう'); return true; }
    if (!b.boss) { forestSay('🚁 ヘリポートだ。だんちょうを たおすと ヘリが むかえに くる。'); return true; }
    forestBaseComplete();
    return true;
  }
  return false;
}

// ── たたかいの あと（forestEndBattle から。win・まけ）──
// かえすもの：{ title, html, msg }（ない ときは null）
function forestBaseAfterBattle(kind, win, wiped) {
  if (!['patrol', 'lock', 'base'].includes(kind)) return null;
  const b = forestBaseState(), f = save.forest;
  const back = () => { f.area = 'base'; f.x = BASE_SPOTS.start[0]; f.y = BASE_SPOTS.start[1]; f.dir = 'up'; b.box = false; };
  const box = (bg, color, html) => '<div style="margin-top:8px; padding:10px; border-radius:14px; background:' + bg + '; font-size:15px; font-weight:800; color:' + color + '; line-height:1.6;">' + html + '</div>';
  if (wiped) { back(); return { html: '', msg: 'きが ついたら アジトの いりぐちに いた…' }; }
  if (kind === 'patrol') {
    const g = BASE_GUARDS[forestBaseFight], live = fzBase && fzBase.guards[forestBaseFight];
    forestBaseFight = -1;
    if (win && g && live) {
      b.sleep[live.n] = [live.x, live.y, live.dir];
      return { html: box('#ede9fe', '#5b21b6', '💤 ' + CHAR_NAME[g.key] + ' は ねむって しまった！<br><span style="font-size:13px;">いまの うちに すすもう</span>'), msg: '💤 みはりが ねむった。いまの うちに！' };
    }
    back();
    return { title: '❗ つかまって しまった…', html: box('#fee2e2', '#b91c1c', 'つかまって いりぐちに もどされた…<br><span style="font-size:13px;">たすけた ひとは ぶじだよ。こんどは みつからないように！</span>'), msg: '🚤 いりぐちに もどされた。こんどは みつからないように！' };
  }
  if (kind === 'lock') {
    const c = forestBaseCellNow;
    forestBaseCellNow = -1;
    if (!win || c < 0) return { title: '🔐 ロックは はずれなかった…', html: '', msg: '🔐 ロックは はずれなかった。もう いちど しらべて ちょうせん！' };
    if (!b.rescued.includes(c)) b.rescued.push(c);
    const n = b.rescued.length, all = n >= BASE_CELLS.length, who = BASE_CELLS[c][3];
    if (all) setTimeout(() => forestBriefing(['よくやった、ルナ！ 3にん ぜんいん ぶじだ。', 'あとは おくの しれいしつに いる かげの だんちょうだ。たおして ヘリポートへ！'], null), 400);
    return { title: '🔓 ロックを はずした！',
      html: box('#dcfce7', '#15803d', '🙋 ' + who + ' を たすけた！（' + n + ' / ' + BASE_CELLS.length + '）<br><span style="font-size:13px;">' + who + '「ありがとう、ルナ！ うしろから ついていくね」</span>' +
        (all ? '<br>🎯 のこるは かげの だんちょう！' : '')),
      msg: all ? '🎯 3にん たすけた！ おくの かげの だんちょうへ！' : '🙋 ' + who + ' を たすけた！ のこり ' + (BASE_CELLS.length - n) + 'にん' };
  }
  // kind === 'base'（かげの だんちょう）
  if (!win) { if (!forestBasePeace()) back(); return { title: forestBasePeace() ? '' : '❗ だんちょうに おいかえされた…', html: '', msg: forestBasePeace() ? 'だんちょうは にげていった。' : '🚤 だんちょうに おいかえされた…。いりぐちから やりなおし！' }; }
  if (forestBasePeace()) {
    let bonus = 0;
    if (f.baseDay !== todayKey()) { f.baseDay = todayKey(); bonus = medalForest('base:' + todayKey(), BASE_MEDAL_DAILY); bt.medals += bonus; }
    return { title: '🕶 かげの だんちょうを たおした！', html: bonus ? box('#dcfce7', '#15803d', '🏜 アジトの ぬし ボーナス 🪙+' + bonus) : '', msg: '🕶 だんちょうに かった！' };
  }
  b.boss = true;
  setTimeout(() => forestBriefing(['ヘリが むかえに いった！ ルナ、ヘリポートへ いそげ！'], null), 400);
  return { title: '🕶 かげの だんちょうを たおした！', html: box('#e0f2fe', '#0369a1', '🚁 ヘリが むかえに きた！<br>しれいしつの おくの ヘリポートへ いそげ！'), msg: '🚁 ヘリポートへ いそげ！' };
}
function forestBaseFled(kind) {
  if (kind !== 'patrol' && kind !== 'base') return false;
  if (kind === 'base' && forestBasePeace()) return false;
  const f = save.forest;
  forestBaseFight = -1;
  f.x = BASE_SPOTS.start[0]; f.y = BASE_SPOTS.start[1]; f.dir = 'up'; forestBaseState().box = false;
  persist();
  forestMsg = '🚤 にげて いりぐちまで もどってきた…';
  return true;
}

// ── 🚁 さくせん せいこう ──
function forestBaseComplete() {
  const b = forestBaseState(), f = save.forest;
  b.done = true;
  const sec = Math.max(1, Math.round((Date.now() - (b.t0 || Date.now())) / 1000));
  const found = b.found || 0;
  const rank = found === 0 && sec <= 600 ? 'S' : found <= 2 ? 'A' : 'B';
  let medals = 0;
  medals += medalForest('base:' + todayKey(), BASE_MEDAL_DAILY);
  if (!loadMedalLedger().units[MEDAL_MONTH + '|base:first']) medals += medalForest('base:first', BASE_MEDAL_FIRST);
  if (rank === 'S') medals += medalForest('base:rank:' + todayKey(), BASE_MEDAL_S);
  f.baseDay = todayKey();
  const peaceNew = !save.basePeace;
  if (peaceNew) save.basePeace = true;
  save.exp += EXP_WIN * 3;
  let up = 0;
  while (save.exp >= needExp()) { save.exp -= needExp(); save.lv++; up++; }
  if (up) save.hp = maxHp();
  persist();
  forestHud();
  if (typeof fmOnce === 'function') fmOnce('mission', null);
  const w = document.createElement('div');
  w.id = 'fz-mission'; w.className = 'fz-mapwrap';
  const mm = Math.floor(sec / 60), ss = sec % 60;
  w.innerHTML = '<div class="panel fz-missionpanel" onclick="event.stopPropagation()">' +
    '<div class="fz-mission-head">MISSION COMPLETE</div>' +
    '<div style="font-size:15px; font-weight:800; margin-top:4px;">オペレーション・ムーンライト せいこう！</div>' +
    '<div class="fz-mission-rank r' + rank + '">' + rank + '<small>ランク</small></div>' +
    '<div class="fz-mission-stats">' +
      '<div>⏱ かかった じかん<b>' + (mm ? mm + 'ふん ' : '') + ss + 'びょう</b></div>' +
      '<div>❗ みつかった かいすう<b>' + found + 'かい</b></div>' +
      '<div>🙋 たすけた ひと<b>' + b.rescued.length + ' / ' + BASE_CELLS.length + '</b></div>' +
    '</div>' +
    (rank === 'S' ? '<div style="font-size:13px; color:#7c3aed; font-weight:800;">🌟 いちども みつからずに せいこう！ すごい！</div>'
      : rank === 'A' ? '<div style="font-size:13px; color:#0369a1; font-weight:800;">いちども みつからないと S ランク！</div>'
      : '<div style="font-size:13px; color:#64748b; font-weight:800;">くさや ダンボールで かくれると ランクが あがるよ</div>') +
    (medals ? '<div style="margin-top:8px; font-size:16px; font-weight:800; color:#b45309;">🪙 アンリノメダル +' + medals + ' 枚</div>' : '') +
    (peaceNew ? '<div style="margin-top:8px; padding:10px; border-radius:14px; background:#fef9c3; font-size:14px; font-weight:800; color:#a16207; line-height:1.6;">🕊 アジトが へいわな さばくの まちに なった！<br><span style="font-size:12.5px;">🚁 ヘリポートから「🌋 マグマの かざん」へ いけるよ！</span></div>' : '') +
    '<button class="btn-main" style="margin-top:12px;" onclick="forestBaseCompleteClose()">つづける</button>' +
  '</div>';
  document.body.appendChild(w);
}
function forestBaseCompleteClose() {
  const w = document.getElementById('fz-mission');
  if (w) w.remove();
  forestLoad();
  if (typeof fmPlay === 'function') fmPlay(forestMusic());
  forestHud(); forestDrawMap();
  forestSay(forestBasePeace() ? '🕊 へいわな さばくの まちに なった！ めのまえの ヘリで マグマの かざんへ いけるよ' : '✅ さくせん せいこう！');
}

// ── 🦉 むせん（タップで つぎへ）──
function forestBriefing(lines, done) {
  const old = document.getElementById('fz-brief');
  if (old) old.remove();
  forestHeld.length = 0;
  let i = 0;
  const w = document.createElement('div');
  w.id = 'fz-brief';
  const show = () => {
    w.innerHTML = '<div class="fz-brief-box">' +
      '<div class="fz-brief-face">' + BASE_OWL_SVG + '<span>フクロウたいちょう</span></div>' +
      '<div class="fz-brief-text"><div class="fz-brief-ch">📡 むせん ' + (i + 1) + ' / ' + lines.length + '</div>' + lines[i] +
        '<div class="fz-brief-next">' + (i < lines.length - 1 ? 'タップで つぎへ ▶' : 'タップで とじる ▶') + '</div></div>' +
    '</div>';
  };
  w.onclick = () => {
    i++;
    if (i < lines.length) return show();
    w.remove();
    if (done) done();
  };
  show();
  document.body.appendChild(w);
  if (typeof fmJingle === 'function') fmJingle('chest');
}

// ── 📦 ダンボール（HUD の ボタン）──
function forestBaseBoxToggle() {
  const b = forestBaseState();
  if (!b.hasBox) return;
  b.box = !b.box;
  persist(); forestHud();
  forestSay(b.box ? '📦 ダンボールを かぶった。じっと していれば みつからない…' : '📦 ダンボールを ぬいだ。');
}

// ── めざす ところ・HUD ──
function forestBaseGoal() {
  const b = forestBaseState();
  if (forestBasePeace()) {
    if (typeof forestVolcanoPeace === 'function' && !forestVolcanoPeace()) return { at: BASE_SPOTS.heli, h: 2.6, text: '🚁 おくの ヘリポートから マグマの かざんへ とんで いこう！' };
    if (save.forest.baseDay !== todayKey()) return { at: BASE_SPOTS.boss, h: 2.4, text: '🕊 へいわな さばくの まち。だんちょうに 2かい はなしかけると しょうぶ！' };
    return { at: BASE_SPOTS.heli, h: 2.6, text: '🕊 へいわな さばくの まち。ヘリで かざん、ボートで うみべに いけるよ' };
  }
  if (b.done) return { at: BASE_SPOTS.boat, h: 1.4, text: '✅ さくせん せいこう！ ボートで うみべへ かえろう' };
  if (b.boss) return { at: BASE_SPOTS.heli, h: 2.6, text: '🚁 ヘリポートへ いそげ！' };
  if (b.rescued.length >= BASE_CELLS.length) return { at: BASE_SPOTS.boss, h: 2.4, text: '🎯 しれいしつの かげの だんちょうを たおせ！' };
  const f = save.forest;
  const left = BASE_CELLS.map((c, i) => [c, i]).filter(([, i]) => !b.rescued.includes(i))
    .sort((p, q) => Math.abs(p[0][0] - f.x) + Math.abs(p[0][1] - f.y) - Math.abs(q[0][0] - f.x) - Math.abs(q[0][1] - f.y));
  return { at: [left[0][0][0], left[0][0][1]], h: 1.9, text: '🎯 ろうやの まちの ひとを たすけだせ！（' + b.rescued.length + ' / ' + BASE_CELLS.length + '）みはりに みつからないように' };
}
function forestBaseHudText() {
  const b = forestBaseState();
  if (forestBasePeace()) return '🕊 さばくの まち';
  return '🏜 さばくの アジト　🙋 ' + b.rescued.length + ' / ' + BASE_CELLS.length + (b.hasBox ? '　📦 ダンボール' : '') + '　❗ ' + (b.found || 0);
}
function forestBaseHudButtons() {
  const on = forestInBase() && !forestBasePeace();
  const bb = document.getElementById('fz-boxbtn'), rd = document.getElementById('fz-radar');
  if (bb) {
    const b = forestBaseState();
    bb.style.display = on && b.hasBox && !b.done ? '' : 'none';
    bb.textContent = b.box ? '📦 ぬぐ' : '📦 かぶる';
    bb.classList.toggle('on', !!b.box);
  }
  if (rd) rd.style.display = on ? '' : 'none';
}

// ── 📡 レーダー（まわり 9マス。みはりと みえる ところ）──
function forestBaseRadar() {
  const cv = document.getElementById('fz-radar');
  if (!cv || cv.style.display === 'none' || !fzBase) return;
  const g = cv.getContext('2d'), S = cv.width, R = 4, k = S / (R * 2 + 1);
  const [px, py] = forestPos();
  const cx = Math.round(px), cy = Math.round(py);
  const alert = !!fzBase.alert;
  g.fillStyle = alert ? '#450a0a' : '#052e16';
  g.fillRect(0, 0, S, S);
  for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) {
    const t = fz.get(cx + x, cy + y);
    if (t === 'w' || t === 'b' || t === 'J' || t === 'O' || t === 'Z' || t === 'A') { g.fillStyle = alert ? '#7f1d1d' : '#166534'; g.fillRect((x + R) * k, (y + R) * k, k, k); }
    else if (t === 'h') { g.fillStyle = alert ? '#991b1b' : '#15803d'; g.fillRect((x + R) * k + k * 0.25, (y + R) * k + k * 0.25, k * 0.5, k * 0.5); }
  }
  forestBaseGuardsNow().forEach(q => {
    q.view.forEach(([x, y]) => {
      if (Math.abs(x - cx) > R || Math.abs(y - cy) > R) return;
      g.fillStyle = 'rgba(250,204,21,.45)'; g.fillRect((x - cx + R) * k, (y - cy + R) * k, k, k);
    });
    const gx = (q.px - cx + R + 0.5) * k, gy = (q.py - cy + R + 0.5) * k;
    if (gx < 0 || gy < 0 || gx > S || gy > S) return;
    g.fillStyle = q.sleep ? '#a78bfa' : '#ef4444';
    g.beginPath(); g.arc(gx, gy, k * 0.32, 0, Math.PI * 2); g.fill();
  });
  g.fillStyle = '#fff'; g.beginPath(); g.arc((R + 0.5) * k, (R + 0.5) * k, k * 0.3, 0, Math.PI * 2); g.fill();
  // ぐるっと まわる 線
  const a = performance.now() / 700;
  g.strokeStyle = alert ? 'rgba(254,202,202,.6)' : 'rgba(134,239,172,.55)'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(S / 2, S / 2); g.lineTo(S / 2 + Math.cos(a) * S, S / 2 + Math.sin(a) * S); g.stroke();
  g.strokeStyle = alert ? '#fca5a5' : '#86efac'; g.strokeRect(1, 1, S - 2, S - 2);
  if (alert) { g.fillStyle = '#fecaca'; g.font = 'bold ' + Math.round(S * 0.16) + 'px sans-serif'; g.textAlign = 'center'; g.fillText('！ALERT', S / 2, S * 0.2); }
}

// ── 2D（WebGL が ない 端末・ちず）：みえる ところ・みはり・たすけた ひと ──
const forestBaseCv = {};
function forestBaseSprite(key) {
  if (forestBaseCv[key] === undefined) {
    forestBaseCv[key] = null;
    forestSvgCanvas(CHARS[key](6, 100, 128, {}), 128).then(c => { forestBaseCv[key] = c; });
  }
  return forestBaseCv[key];
}
function forestBaseDraw2D(g, ox, oy, k, mini) {
  if (!forestInBase() || !fzBase) return;
  const gs = forestBaseGuardsNow();
  gs.forEach(q => q.view.forEach(([x, y]) => {
    g.fillStyle = q.alert ? 'rgba(239,68,68,.45)' : 'rgba(250,204,21,.38)';
    g.fillRect((x - ox) * k, (y - oy) * k, k + 0.5, k + 0.5);
  }));
  gs.forEach(q => {
    const x = (q.px - ox) * k, y = (q.py - oy) * k;
    if (mini) { g.fillStyle = q.sleep ? '#a78bfa' : '#ef4444'; g.beginPath(); g.arc(x + k / 2, y + k / 2, k * 0.35, 0, Math.PI * 2); g.fill(); return; }
    const c = forestBaseSprite(q.key);
    if (c) g.drawImage(c, x - k * 0.1, y - k * 0.35, k * 1.2, k * 1.2);
    g.font = Math.round(k * 0.55) + 'px sans-serif';
    if (q.sleep) g.fillText('💤', x + k * 0.85, y - k * 0.1);
    if (q.alert) { g.fillStyle = '#dc2626'; g.font = 'bold ' + Math.round(k * 0.8) + 'px sans-serif'; g.fillText('！', x + k / 2, y - k * 0.3); }
  });
  if (mini) return;
  forestBaseFollowers().forEach(p => {
    const c = forestBaseSprite(p.key);
    if (c) g.drawImage(c, (p.x - ox) * k + k * 0.1, (p.y - oy) * k - k * 0.15 - Math.abs(Math.sin(p.k * Math.PI)) * k * 0.1, k * 0.8, k * 0.8);
  });
}
