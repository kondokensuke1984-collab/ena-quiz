// ============================================================
// 🌲 まよいの森（rpg.html の クエストの中の ドラクエふう フィールド）
//   ・ひろい 1まいの ちず（森・川と はし・山・どうくつ・ものみのとう・おしろ）を ななめ上から 3D で 見て あるく
//   ・くさむら／もりを あるくと ときどき モンスター（クエストの月の問題 2〜3問。川の むこうは 3問）
//   ・どうくつの ばんにん（4問）を たおすと 🗝しろの かぎ → おしろの もりのぬし（8問）
//   ・いずみで HP ぜんかいふく、ものみのとうで ちずが ぜんぶ わかる、たからばこ（毎日 3こ・場所が かわる）
//   ・森の かたち（木・くさむら）と たからばこは「日付」から 作るので 毎日 すこし かわる（同じ日なら 同じ）
//   ・メダル：問題はクエストと同じ。森では せいかいするたび 🪙1（かこもんは2）。
//     ぬし：その日はじめて たおすと🪙5（<月>|forest:日付）、その月 はじめて たおしたときだけ🪙10（<月>|forest:first）
//     ＋島に「もりの トロフィー」（ena_forest_trophy を書くだけ。島が開いたときに読んで家具にする）
//   ・3D は three.js（js/vendor/ に おいた 0.169。CDN を つかわない）。WebGL が ない 端末は 2D で 描く
//   rpg.html の bt / save / CHARS / QUESTIONS / renderBattle などを そのまま使う。
// ============================================================
const FOREST_W = 34, FOREST_H = 26;
const FOREST_ENC_MIN = 4;                                   // たたかいの あと この歩数は 出ない
const FOREST_ENC = { '.': 0.05, '"': 0.10, 'T': 0.12, 'o': 0.07, 'r': 0.03 };   // 1歩ごとの 出やすさ（みち・はしは 出ない。o r は おしろの なか）
const FOREST_STEP = 0.2;                                    // 1マス あるく 秒
const FOREST_BOSS_DAILY = 5, FOREST_BOSS_FIRST = 10;
const FOREST_BOSS_CHAR = 'bear', FOREST_BOSS_NAME = 'もりのぬし ビッグベア';
const FOREST_GUARD_NAME = 'どうくつの ばんにん';
const FOREST_WALK = '.";T=Bor';                            // あるける マス（o いしの ゆか・r じゅうたん は おしろの なか）
// 🏰 おしろに はいる じょうけん（かぎ ＋ 島の たてもの ＋ これまでに たおした モンスター）
const FOREST_CASTLE_BUILD = 7, FOREST_CASTLE_KILLS = 30;
let fz = null;          // いまの ちず（森＝forestBuild／おしろ＝forestCastleMap。fz.area で わかる）
let fzField = null;     // その日の 森の ちず（おしろから もどったときに つかいまわす）
let forestMsg = '';
let forestMapOpen = false;
let forestUnits = null;         // 森で出す単元（data/forest_units.json）。空・読めないときは制限なし
fetch('data/forest_units.json', { cache: 'no-cache' }).then(r => r.json())
  .then(j => { if (Array.isArray(j.units) && j.units.length) forestUnits = j.units; }).catch(() => {});
function forestPool() {
  if (!forestUnits) return QUESTIONS.slice();
  const pool = QUESTIONS.filter(q => {
    const su = SUBJECTS[q.subject] || {};
    return forestUnits.includes(su.parent || q.subject);
  });
  return pool.length ? pool : QUESTIONS.slice();
}
let forestFromIsland = false;   // 島の こじまから 来た（でるときは 島へ もどる）

// ── シードつき乱数 ──
function forestSeed(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0 || 1;
}
function forestRand(seed) {
  let x = seed >>> 0 || 1;
  return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
}
function forestNoise(rnd, cell) {
  const gw = Math.ceil(FOREST_W / cell) + 3, gh = Math.ceil(FOREST_H / cell) + 3;
  const g = Array.from({ length: gw * gh }, rnd);
  const s = t => t * t * (3 - 2 * t);
  return (x, y) => {
    const fx = (x + cell) / cell, fy = (y + cell) / cell, ix = Math.floor(fx), iy = Math.floor(fy);
    const tx = s(fx - ix), ty = s(fy - iy);
    const a = g[iy * gw + ix], b = g[iy * gw + ix + 1], c = g[(iy + 1) * gw + ix], d = g[(iy + 1) * gw + ix + 1];
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
  };
}

// ── ちず ──
// 記号：P たてふだ　# ふかい森（とおれない） ^ 山 ~ 川 X おしろ K しろの もん C どうくつ R ものみのとう W いずみ F テント $ たからばこ
//       . くさはら " くさむら T もり = みち B はし
function forestRiverX(y) { return 17 + Math.round(1.6 * Math.sin(y * 0.45)); }
function forestOutside(x, y) {           // ちずの 外（3D の まわりの けしき）
  const rx = forestRiverX(y);
  return x >= rx - 1 && x <= rx + 1 ? '~' : '#';
}
const FOREST_SPOTS = {
  start: [5, 22], tent: [4, 22], spring: [6, 17], cave: [2, 6], tower: [24, 19], gate: [28, 4],
  sign: [11, 13],   // わかれ道の たてふだ（どうくつ／はし・おしろ）
};
function forestBuild(day, salt) {
  const W = FOREST_W, H = FOREST_H, S = FOREST_SPOTS;
  const rnd = forestRand(forestSeed('field#' + day + '#' + (salt || 0)));
  const t = new Array(W * H).fill('.');
  const at = (x, y) => y * W + x;
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) t[at(x, y)] = c; };
  const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? forestOutside(x, y) : t[at(x, y)];
  // もり・くさむら（毎日 かわる）
  const n1 = forestNoise(rnd, 5), n2 = forestNoise(rnd, 3);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    let bias = 0;
    if (x < 14 && y > 11) bias += 0.14;            // 南西の ふかい森
    if (x > 22) bias += 0.08;                       // 東の森
    if (Math.abs(x - forestRiverX(y)) <= 3) bias -= 0.22;   // 川べりは ひらけている
    const v = n1(x, y) + bias + (rnd() - 0.5) * 0.12;
    if (v > 0.6) set(x, y, 'T');
    else if (n2(x, y) > 0.62) set(x, y, '"');
  }
  // ふち
  for (let x = 0; x < W; x++) { set(x, 0, '#'); set(x, H - 1, '#'); }
  for (let y = 0; y < H; y++) { set(0, y, '#'); set(W - 1, y, '#'); }
  // 山（北西・北東・南東）
  for (let y = 1; y <= 6; y++) for (let x = 1; x <= 9 - y + (y < 3 ? 2 : 0); x++) set(x, y, '^');
  for (let y = 1; y <= 5; y++) for (let x = 30; x <= 32; x++) set(x, y, '^');
  for (let y = 1; y <= 2; y++) for (let x = 25; x <= 26; x++) set(x, y, '^');
  for (let y = 19; y < H - 1; y++) for (let x = 27; x < W - 1; x++) if ((x - 27) + (y - 19) >= 3) set(x, y, '^');
  // 川（はしの 行だけ はし）
  for (let y = 0; y < H; y++) { const rx = forestRiverX(y); for (let x = rx - 1; x <= rx + 1; x++) set(x, y, y === 14 ? 'B' : '~'); }
  // みち
  const line = (a, b) => {
    const [x0, y0] = a, [x1, y1] = b;
    const dx = Math.sign(x1 - x0), dy = Math.sign(y1 - y0);
    for (let x = x0, y = y0; ; x += dx, y += dy) { if (get(x, y) !== 'B') set(x, y, '='); if (x === x1 && y === y1) break; }
  };
  const rx14 = forestRiverX(14);
  [[[5, 22], [10, 22]], [[10, 22], [10, 14]], [[10, 14], [rx14 - 2, 14]], [[rx14 + 2, 14], [23, 14]],
   [[23, 14], [23, 8]], [[23, 8], [28, 8]], [[28, 8], [28, 5]],
   [[10, 14], [10, 9]], [[10, 9], [2, 9]], [[2, 9], [2, 7]],
   [[23, 14], [23, 18]], [[23, 18], [24, 18]], [[10, 17], [7, 17]]].forEach(([a, b]) => line(a, b));
  // めじるしの まわりを ひらく
  const clear = (cx, cy, r) => {
    for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) {
      const c = get(x, y);
      if (c === 'T' || c === '"') set(x, y, '.');
    }
  };
  clear(S.spring[0], S.spring[1], 1); clear(S.start[0], S.start[1], 1); clear(S.tower[0], S.tower[1], 1);
  clear(28, 6, 1); clear(S.cave[0], S.cave[1] + 1, 1);
  // おしろ・めじるし
  for (let y = 2; y <= 4; y++) for (let x = 27; x <= 29; x++) set(x, y, 'X');
  set(S.gate[0], S.gate[1], 'K');
  set(S.cave[0], S.cave[1], 'C');
  set(S.tower[0], S.tower[1], 'R');
  set(S.spring[0], S.spring[1], 'W');
  set(S.tent[0], S.tent[1], 'F');
  set(S.sign[0], S.sign[1], 'P');
  // たからばこ（毎日 3こ。スタートから すこし はなれた くさはら・もり）
  const chests = [];
  for (let tries = 0; chests.length < 3 && tries < 500; tries++) {
    const x = 1 + Math.floor(rnd() * (W - 2)), y = 1 + Math.floor(rnd() * (H - 2));
    const c = get(x, y);
    if (c !== '.' && c !== 'T' && c !== '"') continue;
    if (Math.abs(x - S.start[0]) + Math.abs(y - S.start[1]) < 9) continue;
    let near = false;
    for (let yy = y - 2; yy <= y + 2; yy++) for (let xx = x - 2; xx <= x + 2; xx++) if ('=BKCRWFP$'.includes(get(xx, yy))) near = true;
    if (near) continue;
    set(x, y, '$');
    chests.push([x, y]);
  }
  const map = { W, H, t, get, chests, start: S.start.slice() };
  // ぜんぶの めじるしに いけるか（だめなら べつの salt で つくりなおす）
  const dist = forestDist(map, S.start[0], S.start[1]);
  const reach = ([x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => dist[at(x + dx, y + dy)] >= 0);
  const ok = [S.spring, S.cave, S.tower, S.gate, S.sign, ...chests].every(reach);
  if (!ok && (salt || 0) < 8) return forestBuild(day, (salt || 0) + 1);
  return map;
}
function forestDist(map, sx, sy) {
  const { W, H } = map;
  const dist = new Array(W * H).fill(-1);
  dist[sy * W + sx] = 0;
  const q = [[sx, sy]];
  while (q.length) {
    const [x, y] = q.shift();
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
      const nx = x + dx, ny = y + dy, i = ny * W + nx;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || dist[i] >= 0 || !FOREST_WALK.includes(map.t[i])) return;
      dist[i] = dist[y * W + x] + 1;
      q.push([nx, ny]);
    });
  }
  return dist;
}
// ── 🏰 おしろの なか（まいにち おなじ かたち）──
// 記号：H かべ　o いしの ゆか　r じゅうたん　I はしら　L たいまつ（かべ）　N おうざの ぬし　D でぐち
//       $ たからばこ　M ミミック（たからばこの ふり）　W いずみ
const CASTLE_ROWS = [
  'HHHHHHHHHHHHHHHHH',
  'HHHHLoooNoooLHHHH',
  'HHHHHIorrroIHHHHH',
  'HHHHHoorrrooHHHHH',
  'HHHHHIorrroIHHHHH',
  'HHHHHHHHrHHHHHHHH',
  'H$ooHoooroooHooMH',
  'LoooLoIoroIoLoooL',
  'HWooHoooroooHoo$H',
  'HoooooooroooooooH',
  'HHHHHoIoroIoHHHHH',
  'HHHHLoooroooLHHHH',
  'HHHHHoooroooHHHHH',
  'HHHHHHHHDHHHHHHHH',
];
const CASTLE_SPOTS = { start: [8, 12], throne: [8, 1], door: [8, 13], gateOut: [28, 5] };
function forestCastleMap() {
  const W = CASTLE_ROWS[0].length, H = CASTLE_ROWS.length;
  const t = CASTLE_ROWS.join('').split('');
  const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? 'H' : t[y * W + x];
  const chests = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (t[y * W + x] === '$') chests.push([x, y]);
  return { W, H, t, get, chests, start: CASTLE_SPOTS.start.slice(), area: 'castle' };
}
function forestInCastle() { return !!fz && fz.area === 'castle'; }

// 🏰 おしろに はいる じょうけん
// 島の たてもの（島の セーブ ena_island_save_v1 の buildings。おなじ サイトなので 読める）
function forestCastleBuilt() {
  try {
    const s = JSON.parse(localStorage.getItem('ena_island_save_v1') || 'null');
    return s && Array.isArray(s.buildings) ? s.buildings.filter(b => /^bd_/.test(b)).length : 0;
  } catch (e) { return 0; }
}
// これまでに たおした モンスターの かず（ずかんの 合計。しんかした すがたは かぞえない）
function forestKills() {
  const d = forestDex();
  return Object.keys(d).reduce((a, k) => a + (Number(d[k]) > 0 ? Math.floor(d[k]) : 0), 0);
}
// たりない ものが あれば { msg, goal, line }、ぜんぶ そろっていれば null（かぎは べつに しらべる）
function forestCastleNeed() {
  const b = forestCastleBuilt(), k = forestKills();
  const line = '🏝 しまの たてもの ' + Math.min(b, FOREST_CASTLE_BUILD) + '/' + FOREST_CASTLE_BUILD + (b >= FOREST_CASTLE_BUILD ? '✓' : '') +
    '　⚔️ たおした モンスター ' + Math.min(k, FOREST_CASTLE_KILLS) + '/' + FOREST_CASTLE_KILLS + (k >= FOREST_CASTLE_KILLS ? '✓' : '');
  if (b >= FOREST_CASTLE_BUILD && k >= FOREST_CASTLE_KILLS) return null;
  const goal = k < FOREST_CASTLE_KILLS
    ? '⚔️ もりで モンスターを あと ' + (FOREST_CASTLE_KILLS - k) + 'ひき たおそう（おしろに はいる じょうけん）'
    : '🏝 しまで たてものを あと ' + (FOREST_CASTLE_BUILD - b) + 'こ たてよう（おしろに はいる じょうけん）';
  return { line, goal };
}
// おしろの もんで：たりない ものを「◯◯まで しないと いけないよ」と おしえる（ぜんぶ そろっていれば ''）
function forestCastleTodo() {
  const f = save.forest, b = forestCastleBuilt(), k = forestKills(), todo = [];
  if (!f.key) todo.push('どうくつの ばんにんを たおして 🗝しろの かぎを もらう');
  if (b < FOREST_CASTLE_BUILD) todo.push('🏝しまで たてものを あと ' + (FOREST_CASTLE_BUILD - b) + 'こ たてる（いま ' + b + '/' + FOREST_CASTLE_BUILD + '）');
  if (k < FOREST_CASTLE_KILLS) todo.push('⚔️もりで モンスターを あと ' + (FOREST_CASTLE_KILLS - k) + 'ひき たおす（いま ' + k + '/' + FOREST_CASTLE_KILLS + '）');
  return todo.length ? '🏰 おしろに はいるには、' + todo.join('、') + ' まで しないと いけないよ！' : '';
}

// 🎯 いま めざす ところ（画面の 上の「つぎに やること」と、光る ！の 場所）
function forestGoal() {
  const f = save.forest;
  if (forestInCastle()) {
    if (f.bossDay === todayKey()) return { at: CASTLE_SPOTS.door, h: 1.8, text: '👑 きょうの もりは クリア！ 🚪 でぐちから もりへ もどろう' };
    return { at: CASTLE_SPOTS.throne, h: 2.9, text: '🎯 おくの おうざのまへ！ もりのぬしが まっている' };
  }
  if (f.bossDay === todayKey()) return { at: null, text: '👑 きょうの もりは クリア！ また あしたの もりで あそぼう' };
  if (!f.key) return { at: FOREST_SPOTS.cave, h: 2.2, text: '🎯 ひだり うえの どうくつで ばんにんを たおして、しろの かぎを ゲット！' };
  const need = forestCastleNeed();
  if (need) return { at: null, text: need.goal };
  return { at: FOREST_SPOTS.gate, h: 3.9, text: '🎯 かぎを もって、はしを わたった みぎ うえの おしろに はいろう！' };
}
function forestTile(x, y) { return fz ? fz.get(x, y) : '#'; }
function forestEast(x, y) { return x > forestRiverX(y) + 1; }

// ── その日の しんこう（save.forest）──
function forestState() {
  const d = todayKey();
  const old = save.forest || {};
  if (old.day !== d || old.v !== 2) {
    save.forest = {
      v: 2, day: d, x: FOREST_SPOTS.start[0], y: FOREST_SPOTS.start[1], dir: 'down', since: 0,
      seen: '', opened: [], key: false, tower: false, area: 'field', mimic: false,
      bossDay: old.bossDay || '', bossEver: !!old.bossEver,
    };
    persist();
  }
  return save.forest;
}
function forestLoad() {
  const f = forestState();
  if (!fzField || fzField.day !== f.day) { fzField = forestBuild(f.day); fzField.day = f.day; fzField.area = 'field'; }
  if (f.area === 'castle') { fz = forestCastleMap(); fz.day = f.day; } else fz = fzField;
  if (!FOREST_WALK.includes(forestTile(f.x, f.y))) { f.x = fz.start[0]; f.y = fz.start[1]; }
  forestReveal();
  forestPalReset();
}
function forestReveal() {
  if (forestInCastle()) return;   // おしろの なかは ちいさいので さいしょから ぜんぶ 見える
  const f = save.forest, n = FOREST_W * FOREST_H;
  const a = (f.seen && f.seen.length === n ? f.seen : '0'.repeat(n)).split('');
  for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
    const x = f.x + dx, y = f.y + dy;
    if (x >= 0 && y >= 0 && x < FOREST_W && y < FOREST_H && dx * dx + dy * dy <= 18) a[y * FOREST_W + x] = '1';
  }
  f.seen = a.join('');
}
function forestSeen(x, y) {
  if (forestInCastle()) return true;
  const f = save.forest;
  return f.tower || (f.seen || '')[y * FOREST_W + x] === '1';
}
// あけた たからばこ（おしろの なかは 'c:x,y' で 森と わける）
function forestChestKey(x, y) { return (forestInCastle() ? 'c:' : '') + x + ',' + y; }
function forestChestOpened(x, y) { return (save.forest.opened || []).includes(forestChestKey(x, y)); }

// ── 画面 ──
function forestMapPanel() {
  const f = save.forest && save.forest.day === todayKey() && save.forest.v === 2 ? save.forest : null;
  const beat = save.forest && save.forest.bossDay === todayKey();
  return '<div class="panel" style="margin-bottom:11px; background:linear-gradient(135deg,#dcfce7,#bbf7d0);">' +
    '<div style="font-weight:800; font-size:15px;">🌲 まよいの森</div>' +
    '<div style="font-size:11.5px; color:#14532d; margin:3px 0 9px; line-height:1.6;">' +
      'くさむらを あるくと モンスターが でるよ。どうくつの ばんにんから かぎを とって、おしろの もりのぬしを たおそう' +
    '</div>' +
    '<button class="btn" onclick="enterForest()" style="text-align:center; background:#fff;">' +
      (f && (f.x !== FOREST_SPOTS.start[0] || f.y !== FOREST_SPOTS.start[1] || f.key) ? '🌲 つづきから' : '🌲 もりに はいる') +
    '</button>' +
    (typeof FOREST_DEX_ORDER !== 'undefined'
      ? '<button class="btn" onclick="forestDexOpen()" style="text-align:center; background:#fff; margin-top:8px;">📖 モンスターずかん ' + forestDexCount() + ' / ' + FOREST_DEX_ORDER.length + '</button>' : '') +
    '<div style="margin-top:7px; font-size:11.5px; color:#14532d; font-weight:800;">🏰 おしろに はいる じょうけん：' +
      (forestCastleNeed() ? forestCastleNeed().line : '🏝 たてもの✓　⚔️ モンスター✓（あとは 🗝 かぎ！）') + '</div>' +
    (beat ? '<div style="margin-top:6px; font-size:11.5px; color:#15803d; font-weight:800; text-align:right;">👑 きょうは もりのぬしを たおしたよ！</div>' : '') +
  '</div>';
}

function enterForest() {
  ttPick = false;
  if (save.hp <= 0) save.hp = maxHp();
  forestLoad();
  forestMapOpen = false;
  persist();
  forestShow(forestInCastle() ? 'おしろの なかに もどってきた。'
    : save.forest.key ? 'もりに もどってきた。おしろへ いこう！' : 'もりに はいった。どうくつの ばんにんが しろの かぎを もっているらしい…');
}

// 森の画面を つくって 出す（3D は はじめの 1かいだけ よみこむ）
function forestShow(msg) {
  const root = document.getElementById('forest-root');
  if (!root) return;
  if (!root.querySelector('#fz-stage')) {
    root.innerHTML =
      '<div id="fz-stage"><div class="fz-loading">🌲 もりを よみこみちゅう…</div></div>' +
      '<div class="fz-hud">' +
        '<div class="fz-hudbox">' +
          '<div style="display:flex; justify-content:space-between; gap:10px; align-items:baseline;">' +
            '<b>🌲 まよいの森</b><span id="fz-lv"></span>' +
          '</div>' +
          '<div class="fz-hp"><i id="fz-hpbar"></i></div>' +
          '<div id="fz-items" style="font-size:12px; margin-top:4px;"></div>' +
          '<div id="fz-goal" class="fz-goal"></div>' +
        '</div>' +
        '<div style="display:flex; flex-direction:column; gap:6px;">' +
          '<button class="fz-btn" onclick="toggleForestMap()">🗺️ ちず</button>' +
          '<button class="fz-btn" onclick="forestDexOpen()">📖 ずかん</button>' +
          '<button class="fz-btn" id="fz-music" onclick="forestMusicToggle()"></button>' +
          '<button class="fz-btn" id="fz-leave" onclick="leaveForest()"></button>' +
        '</div>' +
      '</div>' +
      '<div id="forest-msg" class="fz-msg"></div>' +
      '<div class="fz-pad">' +
        '<span></span><button data-d="up">▲</button><span></span>' +
        '<button data-d="left">◀</button><span></span><button data-d="right">▶</button>' +
        '<span></span><button data-d="down">▼</button><span></span>' +
      '</div>' +
      '<button class="fz-act" onclick="forestSearch()">しらべる</button>' +
      '<div id="fz-arrow"><div>➤</div></div>' +
      '<div id="fz-flash"></div>' +
      '<div id="fz-mapbox"></div>';
    root.querySelectorAll('.fz-pad button').forEach(b => {
      const d = b.dataset.d;
      const on = e => { e.preventDefault(); forestHold(d, true); };
      const off = e => { e.preventDefault(); forestHold(d, false); };
      b.addEventListener('pointerdown', on);
      b.addEventListener('pointerup', off);
      b.addEventListener('pointercancel', off);
      b.addEventListener('pointerleave', off);
      b.addEventListener('contextmenu', e => e.preventDefault());
    });
  }
  document.getElementById('fz-leave').textContent = forestFromIsland ? '🏝 しまへ' : '🏃 でる';
  forestMusicLabel();
  showScreen('forest');
  if (typeof fmPlay === 'function') fmPlay(forestInCastle() ? 'castle' : 'field');
  forestSay(msg || '');
  forestHud();
  forestDrawMap();
  forestStart();
}
function forestMusicLabel() {
  const b = document.getElementById('fz-music');
  if (b) b.textContent = typeof FM !== 'undefined' && FM.on ? '🎵 おんがく' : '🔇 おとなし';
}
function forestMusicToggle() { if (typeof fmToggle === 'function') fmToggle(); forestMusicLabel(); }
function renderForest() { forestHud(); forestDrawMap(); }   // 古い よびだし（rpg.html）のため

function forestHud() {
  const lv = document.getElementById('fz-lv');
  if (!lv) return;
  lv.textContent = 'ルナ Lv ' + save.lv + '　HP ' + Math.max(0, save.hp) + ' / ' + maxHp();
  document.getElementById('fz-hpbar').style.width = pct(save.hp, maxHp()) + '%';
  const f = save.forest;
  document.getElementById('fz-items').textContent =
    (f.key ? '🗝 しろの かぎ　' : '') + (f.tower ? '🗺 ちずが ぜんぶ わかる　' : '') +
    (forestInCastle() ? '🏰 おしろの なか　' : '') +
    '📦 たからばこ ' + (f.opened || []).filter(o => forestInCastle() === o.startsWith('c:')).length + ' / ' + fz.chests.length;
  document.getElementById('fz-goal').textContent = forestGoal().text;
}

let forestSayTimer = 0;
function forestSay(text) {
  forestMsg = text;
  const el = document.getElementById('forest-msg');
  if (!el) return;
  el.textContent = text;
  el.classList.toggle('on', !!text);
  clearTimeout(forestSayTimer);
  if (text) forestSayTimer = setTimeout(() => el.classList.remove('on'), text.length > 40 ? 8000 : 4200);   // ながい おしらせは ゆっくり 読めるように
}

function toggleForestMap() { forestMapOpen = !forestMapOpen; forestDrawMap(); }
function forestDrawMap() {
  const box = document.getElementById('fz-mapbox');
  if (!box) return;
  if (!forestMapOpen) { box.innerHTML = ''; return; }
  box.innerHTML = '<div class="fz-mapwrap" onclick="toggleForestMap()">' +
    '<div class="panel" style="text-align:center;" onclick="event.stopPropagation()">' +
      (forestInCastle() ? '<b>🗺️ おしろの ちず</b>' : '<b>🗺️ まよいの森の ちず</b>') +
      '<canvas id="fz-mini" class="fz-mini"></canvas>' +
      (forestInCastle()
        ? '<div style="font-size:11px; color:#64748b;">🔴 ルナ　🟡 いま いく ところ　👑 おうざ　📦 たからばこ　⛲ いずみ　🚪 でぐち</div>'
        : '<div style="font-size:11px; color:#64748b;">🔴 ルナ　🟡 いま いく ところ　🏰 おしろ　🕳 どうくつ　⛲ いずみ　🗼 とう　🪧 たてふだ　📦 たからばこ</div>' +
          (save.forest.tower ? '' : '<div style="font-size:11px; color:#64748b; margin-top:2px;">ものみのとうに のぼると ちずが ぜんぶ わかるよ</div>')) +
      '<button class="btn-main" style="margin-top:10px;" onclick="toggleForestMap()">とじる</button>' +
    '</div>' +
  '</div>';
  const cv = document.getElementById('fz-mini');
  const k = 18;
  const k2 = forestInCastle() ? 30 : k;   // おしろは ちいさいので 大きめに
  cv.width = fz.W * k2; cv.height = fz.H * k2;
  forestPaint2D(cv.getContext('2d'), 0, 0, fz.W, fz.H, k2, true);
}

const FOREST_COLOR = { '#': '#14532d', '^': '#8d7b68', '~': '#3b82f6', 'X': '#9ca3af', 'K': '#9ca3af', 'C': '#44403c',
  'R': '#a8a29e', 'W': '#7dd3fc', 'F': '#fde68a', 'P': '#a16207', '$': '#86efac', '.': '#86d36b', '"': '#5fae48', 'T': '#2f8a3a',
  '=': '#e2c58f', 'B': '#a16207',
  // おしろの なか
  'H': '#3f3a4a', 'o': '#8b8598', 'r': '#b91c1c', 'I': '#d6d3d1', 'L': '#3f3a4a', 'N': '#facc15', 'D': '#78350f', 'M': '#86efac' };
const FOREST_EMOJI = { '#': '🌲', '^': '⛰️', 'T': '🌳', 'X': '', 'K': '🏰', 'C': '🕳️', 'R': '🗼', 'W': '⛲', 'F': '⛺', 'P': '🪧', '$': '📦',
  'L': '🔥', 'N': '👑', 'D': '🚪', 'M': '📦', 'I': '🏛️' };
// ちず（ちいさい）と、WebGL が ない 端末の 画面を 2D で かく
function forestPaint2D(g, ox, oy, cols, rows, k, mini) {
  const f = save.forest;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = ox + c, y = oy + r;
    const inMap = x >= 0 && y >= 0 && x < fz.W && y < fz.H;
    const castle = forestInCastle();
    let t = forestTile(x, y);
    if ((t === '$' || t === 'M') && forestChestOpened(x, y)) t = castle ? 'o' : '.';
    const seen = !mini || !inMap || forestSeen(x, y);
    g.fillStyle = !seen ? '#0f172a' : castle && (t === '$' || t === 'M' || t === 'W') ? FOREST_COLOR.o : FOREST_COLOR[t] || '#86d36b';
    g.fillRect(c * k, r * k, k + 0.5, k + 0.5);
    if (!seen) continue;
    const e = FOREST_EMOJI[t];
    if (e && (!mini || 'KCRW$NDML'.includes(t))) {
      g.font = Math.round(k * (mini ? 1.25 : 0.8)) + 'px sans-serif';
      g.fillText(e, c * k + k / 2, r * k + k / 2 + 1);
    }
  }
  const goal = forestGoal().at;
  if (goal) {
    const gx = (goal[0] - ox) * k + k / 2, gy = (goal[1] - oy) * k + k / 2;
    g.strokeStyle = '#facc15'; g.lineWidth = mini ? 4 : 3;
    g.beginPath(); g.arc(gx, gy, k * (mini ? 1.5 : 0.7), 0, Math.PI * 2); g.stroke();
    if (!mini) { g.font = 'bold ' + Math.round(k * 0.8) + 'px sans-serif'; g.fillStyle = '#facc15'; g.fillText('！', gx, gy - k * 0.9); }
  }
  if (mini) {
    g.fillStyle = '#ef4444';
    g.beginPath(); g.arc((f.x - ox) * k + k / 2, (f.y - oy) * k + k / 2, k * 0.75, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.stroke();
  }
}

function leaveForest() {
  forestHeld.length = 0;
  if (typeof fmStop === 'function') fmStop();
  persist();
  if (forestFromIsland) { location.href = '/game/#island'; return; }
  showMap();
}

// ── あるく ──
const FOREST_DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const forestHeld = [];        // おしている むき（あとから おした ほうが つよい）
let forestMv = null;          // { fx, fy, tx, ty, t }
let forestBusy = false;       // たたかいへ うつる まで うごかない
let forestLastBump = '';
function forestHold(d, on) {
  const i = forestHeld.indexOf(d);
  if (i >= 0) forestHeld.splice(i, 1);
  if (on) forestHeld.push(d);
  if (!on && !forestHeld.length) forestLastBump = '';
}
function forestOn() {
  const el = document.getElementById('scr-forest');
  return !!el && el.classList.contains('on') && !forestMapOpen;
}
function forestTryStep(d) {
  const f = save.forest, [dx, dy] = FOREST_DIRS[d];
  f.dir = d;
  const nx = f.x + dx, ny = f.y + dy, t = forestTile(nx, ny);
  if (!FOREST_WALK.includes(t)) {
    const key = nx + ',' + ny;
    if (forestLastBump !== key) { forestLastBump = key; forestInteract(nx, ny, t); }
    return;
  }
  forestLastBump = '';
  forestMv = { fx: f.x, fy: f.y, tx: nx, ty: ny, t: 0 };
}
function forestArrive() {
  const f = save.forest;
  forestPalAt = [forestMv.fx, forestMv.fy];   // なかまは ルナが いた マスへ
  f.x = forestMv.tx; f.y = forestMv.ty;
  forestMv = null;
  forestStepN++;
  f.since = (f.since || 0) + 1;
  forestReveal();
  const rate = FOREST_ENC[forestTile(f.x, f.y)] || 0;
  if (f.since >= FOREST_ENC_MIN && Math.random() < rate) {
    persist();
    return forestEncounter(() => startForestBattle('mob'));
  }
  persist();
}
// めのまえを しらべる（ボタン）
function forestSearch() {
  if (!forestOn() || forestBusy || forestMv) return;
  const f = save.forest, [dx, dy] = FOREST_DIRS[f.dir || 'down'];
  const t = forestTile(f.x + dx, f.y + dy);
  if (FOREST_WALK.includes(t)) return forestSay('なにも みつからなかった。');
  forestInteract(f.x + dx, f.y + dy, t);
}
function forestInteract(x, y, t) {
  const f = save.forest;
  if (t === 'W') {
    save.hp = maxHp(); persist(); forestHud();
    forestFx('heal');
    if (typeof fmJingle === 'function') fmJingle('heal');
    return forestSay('⛲ いずみの みずを のんだ。HP が ぜんかいふく した！');
  }
  if (t === 'R') {
    if (f.tower) return forestSay('🗼 ものみのとう。もりが ぜんぶ みわたせる。');
    f.tower = true; persist(); forestHud();
    return forestSay('🗼 ものみのとうに のぼった！ もりの ちずが ぜんぶ わかるように なった。');
  }
  if (t === 'M' && !f.mimic) {   // 🏰 たからばこ…と おもったら ミミック！（たおすと ふつうの たからばこに なる）
    persist();
    forestSay('📦 たからばこ…と おもったら ミミックだ！');
    return forestEncounter(() => startForestBattle('mimic'));
  }
  if (t === '$' || t === 'M') {
    if (forestChestOpened(x, y)) return forestSay('📦 からっぽの たからばこだ。');
    f.opened = (f.opened || []).concat(forestChestKey(x, y));
    const heal = Math.max(1, Math.round(maxHp() * 0.3));
    save.hp = Math.min(maxHp(), save.hp + heal);
    save.exp += 20;
    let up = 0;
    while (save.exp >= needExp()) { save.exp -= needExp(); save.lv++; up++; }
    if (up) save.hp = maxHp();
    persist(); forestHud(); forestChest3D(x, y);
    forestFx('heal');
    if (typeof fmJingle === 'function') fmJingle('chest');
    return forestSay('📦 たからばこを あけた！ やくそうで HP が かいふく、けいけんち +20' + (up ? '。レベルが あがった！' : '。'));
  }
  if (t === 'C') {
    if (f.key) return forestSay('🕳 どうくつは しずかだ…。ばんにんは もう いない。');
    persist();
    return forestEncounter(() => startForestBattle('guard'));
  }
  if (t === 'K' || t === 'X') {
    const todo = forestCastleTodo();
    if (todo) return forestSay(todo);
    return forestGoArea('castle');
  }
  // 🏰 おしろの なか
  if (t === 'N') {
    if (f.bossDay === todayKey()) return forestSay('✨ もりのぬしは もう たおしたよ。また あしたの もりで あおう！');
    persist();
    forestSay('👑 もりのぬしが おうざから たちあがった！');
    return forestEncounter(() => startForestBattle('boss'));
  }
  if (t === 'D') return forestGoArea('field');
  if (t === 'H') return forestSay('おしろの いしの かべだ。');
  if (t === 'I') return forestSay('りっぱな はしらだ。');
  if (t === 'L') return forestSay('🔥 たいまつが ゆらゆら もえている。');
  if (t === 'P') return forestSay('🪧 たてふだ「⬆ どうくつ（ばんにんが かぎを もっている）／➡ はし・おしろ（もりのぬし）／⬇ キャンプ」');
  if (t === 'F') return forestSay('⛺ キャンプの テント。「🏃 でる」で もりを でられるよ。');
  if (t === '^') return forestSay('けわしい 山だ。のぼれない。');
  if (t === '~') return forestSay('ながれが はやくて わたれない。はしを さがそう。');
  if (t === '#') return forestSay('きが しげっていて すすめない。');
}
// 森 ⇄ おしろ（area を かえて ちずを よみなおす）
function forestGoArea(area) {
  const f = save.forest;
  f.area = area;
  const [x, y] = area === 'castle' ? CASTLE_SPOTS.start : CASTLE_SPOTS.gateOut;
  f.x = x; f.y = y; f.dir = area === 'castle' ? 'up' : 'down'; f.since = 0;
  forestMv = null; forestHeld.length = 0; forestLastBump = '';
  persist();
  forestLoad();
  if (typeof fmPlay === 'function') fmPlay(area === 'castle' ? 'castle' : 'field');
  forestHud(); forestDrawMap();
  forestSay(area === 'castle' ? '🏰 おしろに はいった！ おくの おうざのまに もりのぬしが いるらしい…' : '🌲 おしろを でて もりに もどった。');
}
// モンスターが でた！（画面が ちかちか してから たたかいへ）
function forestEncounter(go) {
  forestBusy = true;
  forestHeld.length = 0;
  if (typeof fmOnce === 'function') fmOnce('encounter', null);
  const fl = document.getElementById('fz-flash');
  if (fl) { fl.classList.remove('on'); void fl.offsetWidth; fl.classList.add('on'); }
  setTimeout(() => { forestBusy = false; if (fl) fl.classList.remove('on'); go(); }, 650);
}
document.addEventListener('keydown', e => {
  if (!forestOn()) return;
  const d = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[e.key];
  if (d) { e.preventDefault(); if (!e.repeat) forestHold(d, true); return; }
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); forestSearch(); }
});
document.addEventListener('keyup', e => {
  const d = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[e.key];
  if (d) forestHold(d, false);
});

// ── まいフレーム（3D でも 2D でも おなじ）──
let forestRaf = 0, forestLast = 0, forestView = null;   // forestView：3D か 2D の かきて
function forestStart() {
  if (!forestView) {
    forestView = { kind: 'loading' };
    forest3DInit().then(v => { forestView = v; }).catch(() => { forestView = forest2DInit(); });
  }
  if (forestRaf) return;
  forestLast = performance.now();
  forestRaf = requestAnimationFrame(forestFrame);
}
function forestFrame(now) {
  if (!document.getElementById('scr-forest').classList.contains('on')) { forestRaf = 0; return; }   // たたかい中は とめる
  forestRaf = requestAnimationFrame(forestFrame);
  const dt = Math.min(0.05, (now - forestLast) / 1000);
  forestLast = now;
  if (forestOn() && !forestBusy) {
    if (forestMv) {
      forestMv.t += dt / FOREST_STEP;
      if (forestMv.t >= 1) forestArrive();
    }
    if (!forestMv && !forestBusy && forestHeld.length) forestTryStep(forestHeld[forestHeld.length - 1]);
  }
  if (forestView && forestView.draw) forestView.draw(dt, now / 1000);
}
// いま 画面に かく 位置（あるいている とちゅうは あいだ）
function forestPos() {
  const f = save.forest;
  if (!forestMv) return [f.x, f.y, 0];
  const k = forestMv.t;
  return [forestMv.fx + (forestMv.tx - forestMv.fx) * k, forestMv.fy + (forestMv.ty - forestMv.fy) * k, k];
}
function forestFx(kind) { if (forestView && forestView.fx) forestView.fx(kind); }
function forestChest3D(x, y) { if (forestView && forestView.chest) forestView.chest(x, y); }

// ── ルナの え（フィールド用：まえ・うしろ・よこ × たつ・あるく2コマ）──
// js/chars.js の renderLunaSVG と おなじ 色・おなじ レベルの かざり（みみ・きね・マント・かんむり）で、むきを かえて かく。
// うしろの 月は フィールドでは かかない（じめんに うかんで 見えるので）
function forestLunaSVG(dir, frame) {
  const L = Math.max(1, Math.min(6, save.lv | 0));
  const c = { fur: '#fffaf3', ear: '#fbcfe8', line: '#a78bfa', eye: '#3d2b5e', blush: '#fda4af', cape: '#a78bfa', kine: '#deb887', crown: '#fbbf24' };
  const st = 'stroke="' + c.line + '" stroke-width="3"';
  // あし：stand＝そろえる、a／b＝こうごに まえへ
  const fa = frame === 'a' ? 1 : frame === 'b' ? -1 : 0;
  const bob = fa ? -3 : 0;
  const side = dir === 'side', back = dir === 'up';
  let body = '';
  if (L === 1) {   // たまご：ぴょこぴょこ かたむいて すすむ
    const tilt = fa * 7;
    const face = back ? '' : side
      ? '<path d="M112 116 q6 -7 12 0" stroke="' + c.eye + '" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="124" cy="130" rx="6" ry="4" fill="' + c.blush + '" opacity=".75"/>'
      : '<path d="M78 116 q7 -8 14 0 M108 116 q7 -8 14 0" stroke="' + c.eye + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="72" cy="130" rx="7" ry="4.5" fill="' + c.blush + '" opacity=".75"/><ellipse cx="128" cy="130" rx="7" ry="4.5" fill="' + c.blush + '" opacity=".75"/>' +
        '<path d="M96 130 q4 4 8 0" stroke="' + c.eye + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
    body = '<g transform="rotate(' + tilt + ' 100 166)">' +
      '<ellipse cx="' + (side ? 92 : 86) + '" cy="76" rx="7" ry="11" fill="' + c.fur + '" ' + st + '/>' +
      '<ellipse cx="' + (side ? 104 : 114) + '" cy="76" rx="7" ry="11" fill="' + c.fur + '" ' + st + '/>' +
      '<ellipse cx="100" cy="120" rx="40" ry="46" fill="' + c.fur + '" ' + st + '/>' + face + '</g>';
  } else {
    const earLen = L >= 4 ? 26 : 20;
    const ear = (cx, cy, rot) => '<g transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')">' +
      '<ellipse cx="' + cx + '" cy="' + (cy - earLen) + '" rx="9" ry="' + earLen + '" fill="' + c.fur + '" ' + st + '/>' +
      (back ? '' : '<ellipse cx="' + cx + '" cy="' + (cy + 2 - earLen) + '" rx="4" ry="' + (earLen - 8) + '" fill="' + c.ear + '"/>') + '</g>';
    const foot = (x, y) => '<ellipse cx="' + x + '" cy="' + y + '" rx="13" ry="8" fill="' + c.fur + '" ' + st + '/>';
    const crown = (x, y) => L >= 5 ? '<path d="M' + (x - 18) + ' ' + y + ' L' + (x - 12) + ' ' + (y - 16) + ' L' + x + ' ' + (y - 6) + ' L' + (x + 12) + ' ' + (y - 16) + ' L' + (x + 18) + ' ' + y + ' Z" fill="' + c.crown + '" ' + st + ' stroke-linejoin="round"/>' : '';
    const kine = (x, y, rot) => L >= 3 ? '<g transform="rotate(' + rot + ' ' + x + ' ' + y + ')"><rect x="' + (x - 4) + '" y="' + (y - 36) + '" width="8" height="56" rx="4" fill="' + c.kine + '" ' + st + '/>' +
      '<rect x="' + (x - 18) + '" y="' + (y - 48) + '" width="36" height="17" rx="7" fill="' + c.kine + '" ' + st + '/></g>' : '';
    if (side) {        // みぎむき（ひだりは かがみで うつす）
      body =
        kine(78, 132, -28) +
        ear(94, 90, -26) + ear(104, 88, -14) +
        '<circle cx="72" cy="150" r="8" fill="' + c.fur + '" ' + st + '/>' +
        foot(86 - fa * 8, 168 + (fa > 0 ? -2 : 0)) +
        (L >= 4 ? '<path d="M92 126 Q70 132 64 172 Q84 166 96 160 Z" fill="' + c.cape + '" opacity=".9"/>' : '') +
        '<ellipse cx="100" cy="148" rx="27" ry="24" fill="' + c.fur + '" ' + st + '/>' +
        foot(114 + fa * 8, 168 + (fa < 0 ? -2 : 0)) +
        '<circle cx="106" cy="112" r="30" fill="' + c.fur + '" ' + st + '/>' + crown(102, 88) +
        '<ellipse cx="122" cy="109" rx="4.5" ry="5.5" fill="' + c.eye + '"/><circle cx="123.5" cy="107" r="1.6" fill="#fff"/>' +
        '<ellipse cx="124" cy="121" rx="6" ry="4" fill="' + c.blush + '" opacity=".75"/>' +
        '<path d="M133 117 l3 3 l-4 2 z" fill="' + c.blush + '"/><path d="M134 123 q-3 4 -7 3" stroke="' + c.eye + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    } else if (back) { // うしろむき
      body =
        kine(138, 128, 22) +
        ear(88, 84, -11) + ear(112, 84, 11) +
        foot(84, 168 + fa * 3) + foot(116, 168 - fa * 3) +
        '<ellipse cx="100" cy="148" rx="30" ry="24" fill="' + c.fur + '" ' + st + '/>' +
        (L >= 4 ? '<path d="M72 124 Q100 116 128 124 L138 172 Q100 162 62 172 Z" fill="' + c.cape + '" opacity=".9"/>' : '') +
        '<circle cx="100" cy="' + (L >= 4 ? 166 : 160) + '" r="8" fill="' + c.fur + '" ' + st + '/>' +
        '<circle cx="100" cy="112" r="31" fill="' + c.fur + '" ' + st + '/>' + crown(100, 90) +
        '<path d="M92 132 q8 4 16 0" stroke="' + c.line + '" stroke-width="2" fill="none" opacity=".6"/>';
    } else {           // まえむき
      body =
        ear(86, 82, -11) + ear(114, 82, 11) +
        (L >= 4 ? '<path d="M70 124 Q100 112 130 124 L142 174 Q100 160 58 174 Z" fill="' + c.cape + '" opacity=".85"/>' : '') +
        '<ellipse cx="100" cy="148" rx="30" ry="24" fill="' + c.fur + '" ' + st + '/>' +
        foot(82, 166 - fa * 3) + foot(118, 166 + fa * 3) +
        kine(142, 140, -22) +
        '<circle cx="100" cy="112" r="31" fill="' + c.fur + '" ' + st + '/>' + crown(100, 94) +
        '<ellipse cx="89" cy="110" rx="4.5" ry="5.5" fill="' + c.eye + '"/><ellipse cx="111" cy="110" rx="4.5" ry="5.5" fill="' + c.eye + '"/>' +
        '<circle cx="90.5" cy="108" r="1.6" fill="#fff"/><circle cx="112.5" cy="108" r="1.6" fill="#fff"/>' +
        '<ellipse cx="76" cy="121" rx="7" ry="4.5" fill="' + c.blush + '" opacity=".75"/><ellipse cx="124" cy="121" rx="7" ry="4.5" fill="' + c.blush + '" opacity=".75"/>' +
        '<path d="M96 121 l4 4 l4 -4 z" fill="' + c.blush + '"/>' +
        '<path d="M100 125 q-5 6 -9 2 M100 125 q5 6 9 2" stroke="' + c.eye + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    }
  }
  const scale = L === 1 ? 0.88 : Math.min(1.08, 0.92 + (L - 2) * 0.035);
  return '<svg viewBox="0 0 200 200" width="256" height="256" xmlns="http://www.w3.org/2000/svg">' +
    '<g transform="translate(0,' + bob + ') translate(100,106) scale(' + scale.toFixed(3) + ') translate(-100,-106)">' + body + '</g></svg>';
}
// むき（down / up / right / left）× コマ（stand / a / b）の canvas を まとめて つくる
async function forestLunaSet() {
  const out = {};
  for (const dir of ['down', 'up', 'side']) for (const fr of ['stand', 'a', 'b']) {
    const cv = await forestSvgCanvas(forestLunaSVG(dir, fr), 256);
    if (!cv) continue;
    if (dir === 'side') {
      out['right_' + fr] = cv;
      const m = document.createElement('canvas'); m.width = m.height = 256;
      const g = m.getContext('2d'); g.translate(256, 0); g.scale(-1, 1); g.drawImage(cv, 0, 0);
      out['left_' + fr] = m;
    } else out[dir + '_' + fr] = cv;
  }
  return out;
}
// いまの コマ（あるいている あいだは 1マスごとに あしを こうたい）
let forestStepN = 0;

// ── 🤝 なかま（5かい たおした モンスターを ずかんから えらぶと、ルナの うしろを ついてくる）──
// save.forestPal：つれている モンスターの key（しんかした すがた _evo も えらべる）。'' なら なし
const FOREST_PAL_NEED = 5;
let forestPalAt = null;        // なかまが いる マス（ルナが 1マス すすむと、ルナが いた マスへ うつる）
function forestPalKey() { const k = save.forestPal; return k && CHARS[k] && forestCanPal(k) ? k : ''; }
function forestCanPal(k) {
  if (/_evo$/.test(k)) return !!forestEvo()[k.slice(0, -4)];
  return (forestDex()[k] || 0) >= FOREST_PAL_NEED;
}
function forestSetPal(k) {
  save.forestPal = save.forestPal === k ? '' : k;   // おなじ子を もう いちど おすと わかれる
  persist();
  forestPalReset();
  forestDexOpen(k);
}
// ルナの うしろ（あるけない ときは となりの どこか、なければ おなじ マス）
function forestPalReset() {
  const f = save.forest;
  if (!f) { forestPalAt = null; return; }
  const [dx, dy] = FOREST_DIRS[f.dir] || FOREST_DIRS.down;
  const tries = [[-dx, -dy], [0, 1], [-1, 0], [1, 0], [0, -1]];
  const ok = tries.find(([ax, ay]) => FOREST_WALK.includes(forestTile(f.x + ax, f.y + ay)));
  forestPalAt = ok ? [f.x + ok[0], f.y + ok[1]] : [f.x, f.y];
}
// いま 画面に かく なかまの 位置（ルナが あるく あいだ、ルナが いた マスへ むかう）
function forestPalPos() {
  if (!forestPalAt) forestPalReset();
  const [ax, ay] = forestPalAt;
  if (!forestMv) return [ax, ay, 0];
  const k = forestMv.t;
  return [ax + (forestMv.fx - ax) * k, ay + (forestMv.fy - ay) * k, k];
}
// なかまの え（canvas）。key が かわったら つくりなおす
let forestPalCv = { key: '', cv: null, busy: '' };
function forestPalCanvas() {
  const k = forestPalKey();
  if (forestPalCv.key !== k && forestPalCv.busy !== k) {
    forestPalCv.busy = k;
    if (!k) forestPalCv = { key: '', cv: null, busy: '' };
    else forestSvgCanvas(CHARS[k](6, 100, 256, {}), 256).then(cv => { if (forestPalCv.busy === k) forestPalCv = { key: k, cv, busy: '' }; });
  }
  return forestPalCv.key === k ? forestPalCv.cv : null;
}
function forestLunaFrame() {
  const f = save.forest;
  const d = FOREST_DIRS[f.dir] ? f.dir : 'down';
  if (!forestMv) return d + '_stand';
  return d + '_' + ((forestStepN + (forestMv.t > 0.5 ? 1 : 0)) % 2 ? 'a' : 'b');
}

// SVG の 文字列 → canvas（ゴーレムの え など）
function forestSvgCanvas(svg, size) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => { const c = document.createElement('canvas'); c.width = c.height = size; c.getContext('2d').drawImage(img, 0, 0, size, size); res(c); };
    img.onerror = () => res(null);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
}
// ひかる「！」（めざす ところの 上に うかべる）
function forestMarkCanvas() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#facc15'; g.strokeStyle = '#2a1b3d'; g.lineWidth = 8;
  g.beginPath(); g.arc(64, 56, 44, 0, Math.PI * 2); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(50, 96); g.lineTo(64, 122); g.lineTo(78, 96); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#facc15'; g.fillRect(48, 88, 32, 12);
  g.fillStyle = '#dc2626'; g.font = 'bold 64px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('！', 64, 58);
  return c;
}

// ── 2D（WebGL が ない 端末）──
function forest2DInit() {
  const stage = document.getElementById('fz-stage');
  stage.innerHTML = '<canvas id="fz-canvas"></canvas>';
  const cv = stage.querySelector('canvas');
  let lunas = {};
  forestLunaSet().then(o => { lunas = o; });
  return {
    kind: '2d',
    draw() {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); cv.style.width = w + 'px'; cv.style.height = h + 'px'; }
      const g = cv.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const k = Math.max(28, Math.min(w, h) / 9);
      const cols = Math.ceil(w / k) + 2, rows = Math.ceil(h / k) + 2;
      const [px, py] = forestPos();
      const ox = Math.floor(px - cols / 2), oy = Math.floor(py - rows / 2);
      g.save();
      g.translate(-((px - cols / 2) - ox) * k, -((py - rows / 2) - oy) * k);
      forestPaint2D(g, ox, oy, cols, rows, k, false);
      g.restore();
      const pal = forestPalCanvas();
      const [qx, qy, qk] = forestPalPos();
      const drawPal = () => { if (pal) g.drawImage(pal, w / 2 + (qx - px) * k - k * 0.42, h / 2 + (qy - py) * k - k * 0.55 - Math.abs(Math.sin(qk * Math.PI)) * k * 0.12, k * 0.84, k * 0.84); };
      if (qy <= py) drawPal();   // おくに いる ときは ルナの うしろに かく
      const luna = lunas[forestLunaFrame()];
      if (luna) g.drawImage(luna, w / 2 - k * 0.6, h / 2 - k * 0.7, k * 1.2, k * 1.2);
      if (qy > py) drawPal();
    },
  };
}

// ── 3D（three.js）──
async function forest3DInit() {
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('no webgl');
  const THREE = await import('/js/vendor/three-0.169.module.min.js');
  const stage = document.getElementById('fz-stage');
  stage.innerHTML = '';
  const touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: touch ? 'default' : 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const SKY = 0xa5d8ff;
  scene.background = new THREE.Color(SKY);
  scene.fog = new THREE.Fog(SKY, 17, 32);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  const hemi = new THREE.HemisphereLight(0xe0f2fe, 0x3f6212, 1.15);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff7e0, 1.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  const sc = sun.shadow.camera;
  sc.left = -13; sc.right = 13; sc.top = 13; sc.bottom = -13; sc.near = 1; sc.far = 40;
  sun.shadow.bias = -0.0015;
  scene.add(sun, sun.target);

  const world = new THREE.Group();
  scene.add(world);
  const V = new THREE.Vector3(), Q = new THREE.Quaternion(), E = new THREE.Euler(), SV = new THREE.Vector3();
  const M = (x, y, z, sx, sy, sz, ry) => new THREE.Matrix4().compose(V.set(x, y, z), Q.setFromEuler(E.set(0, ry || 0, 0)), SV.set(sx, sy, sz));
  const col = (hex, rnd, v) => { const c = new THREE.Color(hex); if (rnd) c.offsetHSL(0, 0, (rnd() - 0.5) * (v || 0.08)); return c; };
  const mat = (o) => new THREE.MeshLambertMaterial(Object.assign({ flatShading: true }, o || {}));
  function inst(geo, material, list, shadow) {
    const m = new THREE.InstancedMesh(geo, material, Math.max(1, list.length));
    list.forEach((it, i) => { m.setMatrixAt(i, it[0]); if (it[1]) m.setColorAt(i, it[1]); });
    m.count = list.length;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.castShadow = !!shadow; m.receiveShadow = true;
    world.add(m);
    return m;
  }
  // 川の 水（ながれる もよう）
  const wc = document.createElement('canvas'); wc.width = wc.height = 128;
  { const g = wc.getContext('2d'); g.fillStyle = '#3b82f6'; g.fillRect(0, 0, 128, 128);
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3;
    for (let i = 0; i < 6; i++) { g.beginPath(); const y = i * 22 + 8; g.moveTo(0, y); g.bezierCurveTo(40, y - 8, 80, y + 8, 128, y); g.stroke(); } }
  const waterTex = new THREE.CanvasTexture(wc);
  waterTex.colorSpace = THREE.SRGBColorSpace;
  waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping;
  waterTex.repeat.set(30, 30);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshLambertMaterial({ map: waterTex }));
  water.rotation.x = -Math.PI / 2;
  water.position.set(FOREST_W / 2, -0.14, FOREST_H / 2);
  water.receiveShadow = true;
  scene.add(water);

  // ルナ
  const [lunaCv, golemC] = await Promise.all([forestLunaSet(),
    typeof FOREST_GUARD_KEY !== 'undefined' ? forestSvgCanvas(CHARS[FOREST_GUARD_KEY](6, 100, 256, {}), 256) : null]);
  // どうくつの まえに たつ ばんにん（たおすまで 見える）
  let golem = null;
  if (golemC) {
    const tex = new THREE.CanvasTexture(golemC); tex.colorSpace = THREE.SRGBColorSpace;
    // ななめから 見ると 絵の 上が 山に めりこむので、山より 手前に かく（ルナは さらに その 手前）
    golem = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, alphaTest: 0.1, depthTest: false, depthWrite: false }));
    golem.renderOrder = 5;
    golem.center.set(0.5, 0.05); golem.scale.set(1.55, 1.55, 1);
    golem.position.set(FOREST_SPOTS.cave[0], 0.05, FOREST_SPOTS.cave[1] + 0.35);
    scene.add(golem);
  }
  // 🏰 おうざの まえに たつ もりのぬし（その日 たおすまで 見える）
  let nushi = null;
  if (typeof FOREST_NUSHI_KEY !== 'undefined') {
    forestSvgCanvas(CHARS[FOREST_NUSHI_KEY](6, 100, 256, {}), 256).then(cv => {
      if (!cv) return;
      const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
      // ななめから 見ると 絵の 上が おうざに めりこむので、ゴーレムと おなじく まえに かく（ルナは さらに その 手前）
      nushi = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, alphaTest: 0.1, depthTest: false, depthWrite: false }));
      nushi.renderOrder = 5;
      nushi.center.set(0.5, 0.05); nushi.scale.set(1.9, 1.9, 1);
      nushi.position.set(CASTLE_SPOTS.throne[0], 0.05, CASTLE_SPOTS.throne[1] + 0.45);
      scene.add(nushi);
    });
  }
  // めざす ところの 上の「！」
  const markTex = new THREE.CanvasTexture(forestMarkCanvas()); markTex.colorSpace = THREE.SRGBColorSpace;
  const mark = new THREE.Sprite(new THREE.SpriteMaterial({ map: markTex, transparent: true, depthTest: false, fog: false }));
  mark.scale.set(1.1, 1.1, 1); mark.renderOrder = 10;
  scene.add(mark);
  // ルナ（むき×コマの え。レベルが あがったら つくりなおす）
  let heroTex = {}, heroLv = save.lv;
  const makeHeroTex = (cvs) => {
    Object.values(heroTex).forEach(t => t.dispose());
    heroTex = {};
    Object.entries(cvs).forEach(([k, cv]) => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; heroTex[k] = t; });
  };
  makeHeroTex(lunaCv);
  const hero = new THREE.Sprite(new THREE.SpriteMaterial({ map: heroTex.down_stand, transparent: true, alphaTest: 0.1 }));
  hero.center.set(0.5, 0.11);   // 絵の 下の あき（あしの 下）ぶん さげて、かげに あしを つける
  hero.scale.set(1.6, 1.6, 1);
  hero.renderOrder = 6;
  const heroShadow = new THREE.Mesh(new THREE.CircleGeometry(0.32, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false }));
  heroShadow.rotation.x = -Math.PI / 2;
  scene.add(hero, heroShadow);
  // 🤝 なかま（ルナの うしろを ついてくる）
  let palTexKey = '', palTex = null;
  const pal = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, alphaTest: 0.1 }));
  pal.center.set(0.5, 0.06);
  pal.scale.set(1.05, 1.05, 1);
  pal.renderOrder = 5;
  const palShadow = new THREE.Mesh(new THREE.CircleGeometry(0.26, 18), heroShadow.material);
  palShadow.rotation.x = -Math.PI / 2;
  scene.add(pal, palShadow);

  // いずみの きらきら
  const sparkles = [];
  const sparkGeo = new THREE.OctahedronGeometry(0.06);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
  let chestLids = {};

  // たからばこ（森と おしろで おなじ かたち）
  function chestAt(x, y) {
    const g = new THREE.Group(); g.position.set(x, 0, y);
    const wood = mat({ color: 0x92400e }), gold = mat({ color: 0xfacc15 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.36), wood); box.position.y = 0.15; box.castShadow = true; g.add(box);
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.38), gold); band.position.y = 0.2; g.add(band);
    const lid = new THREE.Group(); lid.position.set(0, 0.3, -0.18); g.add(lid);
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.36), wood); top.position.set(0, 0.06, 0.18); top.castShadow = true; lid.add(top);
    if (forestChestOpened(x, y)) lid.rotation.x = -1.9;
    chestLids[x + ',' + y] = lid;
    world.add(g);
  }
  // いずみ（森と おしろで おなじ かたち）
  function springAt(sx, sy) {
    const stone = mat({ color: 0xb8b9c2 });
    const pond = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.06, 20), new THREE.MeshLambertMaterial({ color: 0x7dd3fc, emissive: 0x0ea5e9, emissiveIntensity: 0.35 }));
    pond.position.set(sx, 0.03, sy); world.add(pond);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.07, 6, 20), stone); ring.rotation.x = Math.PI / 2; ring.position.set(sx, 0.06, sy); world.add(ring);
    for (let i = 0; i < 6; i++) { const s = new THREE.Mesh(sparkGeo, sparkMat); s.userData.p = i / 6; s.position.set(sx, 0.3, sy); world.add(s); sparkles.push(s); }
    world.userData.spring = [sx, sy];
  }
  const SKY_FIELD = new THREE.Color(SKY), SKY_CASTLE = new THREE.Color(0x1e1b2e);
  // 🏰 おしろの なか（いしの ゆか・かべ・はしら・たいまつ・おうざ）
  function buildCastle() {
    scene.background = SKY_CASTLE; scene.fog = new THREE.Fog(0x1e1b2e, 16, 30);
    hemi.intensity = 0.9; hemi.color.set(0xc4b5fd); hemi.groundColor.set(0x312e81);
    sun.intensity = 0.55;
    water.visible = false;
    const rnd = forestRand(forestSeed('castle'));
    const floors = [], walls = [], carpets = [], pillars = [], caps = [];
    const flames = [];
    const R = 4;
    const walk = (x, y) => FOREST_WALK.includes(fz.get(x, y)) || 'W$MN'.includes(fz.get(x, y));
    for (let y = -R; y < fz.H + R; y++) for (let x = -R; x < fz.W + R; x++) {
      const t = fz.get(x, y);
      if (t === 'H' || t === 'L' || t === 'D') {
        // てまえ（南）に ゆかが ない かべは たかく、ゆかの すぐ 南の かべは ひくく（ルナが かくれないように）
        const low = walk(x, y - 1);
        const h = low ? 0.35 : 1.5;
        walls.push([M(x, h / 2, y, 1, h, 1), col(t === 'D' ? '#78350f' : '#4b4458', rnd, 0.06)]);
        if (t === 'L') {
          // ゆかの ある がわの かべに かける（右・左・手前の じゅん）
          const [ox, oz] = walk(x + 1, y) ? [0.52, 0] : walk(x - 1, y) ? [-0.52, 0] : [0, 0.52];
          const fx = x + ox, fz0 = y + oz, fy = low ? 0.55 : 1.05;
          const br = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), mat({ color: 0x3f2a14 })); br.position.set(fx, fy - 0.18, fz0); world.add(br);
          const fl = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.3, 6), new THREE.MeshBasicMaterial({ color: 0xfb923c }));
          fl.position.set(fx, fy + 0.08, fz0); fl.userData.base = fy + 0.08; world.add(fl); flames.push(fl);
          const pl = new THREE.PointLight(0xffa94d, 6, 5, 1.4); pl.position.set(fx + ox * 0.6, fy + 0.3, fz0 + oz * 0.6); world.add(pl);
        }
        if (t === 'D') {   // でぐちの とびら（きの わく）
          const wood = mat({ color: 0xa16207 });
          [[-0.42, 0.55], [0.42, 0.55]].forEach(([dx, hy]) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.12), wood); p.position.set(x + dx, hy, y - 0.4); p.castShadow = true; world.add(p); });
          const top = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.14, 0.14), wood); top.position.set(x, 1.12, y - 0.4); world.add(top);
        }
        continue;
      }
      floors.push([M(x, -0.15, y, 1, 0.3, 1), col((x + y) % 2 ? '#8b8598' : '#7d7790', rnd, 0.04)]);
      if (t === 'r') carpets.push([M(x, 0.02, y, 0.86, 0.04, 1.0), col('#b91c1c')]);
      if (t === 'I') {
        pillars.push([M(x, 0.95, y, 1, 1.9, 1), col('#e7e5e4', rnd, 0.04)]);
        caps.push([M(x, 1.92, y, 1, 0.14, 1), col('#a8a29e')]);
        caps.push([M(x, 0.07, y, 1, 0.14, 1), col('#a8a29e')]);
      }
      if (t === '$' || t === 'M') chestAt(x, y);
      if (t === 'W') springAt(x, y);
      if (t === 'N') {   // きんの おうざ
        const gold = mat({ color: 0xfacc15 }), red = mat({ color: 0xdc2626 });
        const th = new THREE.Group(); th.position.set(x, 0, y - 0.25);
        [[new THREE.BoxGeometry(0.9, 0.42, 0.7), gold, 0, 0.21, 0], [new THREE.BoxGeometry(0.9, 1.5, 0.16), gold, 0, 0.75, -0.3],
         [new THREE.BoxGeometry(0.7, 0.1, 0.56), red, 0, 0.46, 0.04], [new THREE.BoxGeometry(0.6, 1.0, 0.04), red, 0, 0.9, -0.21],
         [new THREE.SphereGeometry(0.1, 8, 6), gold, -0.42, 1.55, -0.3], [new THREE.SphereGeometry(0.1, 8, 6), gold, 0.42, 1.55, -0.3]]
          .forEach(([g, m, px, py, pz]) => { const o = new THREE.Mesh(g, m); o.position.set(px, py, pz); o.castShadow = o.receiveShadow = true; th.add(o); });
        world.add(th);
        // うしろの かべの たれまく
        [-2, 2].forEach(dx => {
          const b = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.04), mat({ color: 0x7c3aed })); b.position.set(x + dx, 1.0, y - 0.47); world.add(b);
          const e = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.05), mat({ color: 0xfacc15 })); e.position.set(x + dx, 1.15, y - 0.45); world.add(e);
        });
      }
    }
    inst(new THREE.BoxGeometry(1, 1, 1), mat(), floors);
    inst(new THREE.BoxGeometry(1, 1, 1), mat(), walls, true);
    inst(new THREE.BoxGeometry(1, 1, 1), mat(), carpets);
    inst(new THREE.CylinderGeometry(0.26, 0.3, 1, 10), mat(), pillars, true);
    inst(new THREE.CylinderGeometry(0.36, 0.36, 1, 10), mat(), caps);
    world.userData.flames = flames;
  }

  function build() {
    while (world.children.length) { const c = world.children.pop(); if (c.geometry) c.geometry.dispose(); }
    sparkles.length = 0; chestLids = {};
    world.userData = {};
    if (fz.area === 'castle') return buildCastle();
    scene.background = SKY_FIELD; scene.fog = new THREE.Fog(SKY, 17, 32);
    hemi.intensity = 1.15; hemi.color.set(0xe0f2fe); hemi.groundColor.set(0x3f6212);
    sun.intensity = 1.6;
    water.visible = true;
    const rnd = forestRand(forestSeed('look#' + fz.day));
    const ground = [], bed = [], trunks = [], cones = [], rounds = [], tufts = [], flowers = [], rocks = [], mts = [], caps = [];
    const R = 7;   // ちずの 外も すこし かく
    for (let y = -R; y < FOREST_H + R; y++) for (let x = -R; x < FOREST_W + R; x++) {
      const t = forestTile(x, y);
      if (t === '~' || t === 'B') { bed.push([M(x, -0.6, y, 1, 0.3, 1), col('#a8a29e', rnd)]); continue; }
      const gc = { '.': '#7cc75a', '"': '#5fae48', 'T': '#4c9a3c', '#': '#3d7f35', '=': '#dcc08a', '^': '#8f9a5a',
        'X': '#8f9a5a', 'K': '#8f9a5a', 'C': '#8f9a5a', 'R': '#7cc75a', 'W': '#7cc75a', 'F': '#7cc75a', 'P': '#7cc75a', '$': '#7cc75a' }[t] || '#7cc75a';
      ground.push([M(x, -0.15, y, 1, 0.3, 1), col(gc, rnd, t === '=' ? 0.05 : 0.07)]);
      const j = () => (rnd() - 0.5) * 0.5;
      const conifer = (px, pz, s) => {
        const h = s * (0.9 + rnd() * 0.3);
        trunks.push([M(px, 0.15 * h, pz, s, h, s), col('#7c4a2a', rnd)]);
        cones.push([M(px, 0.75 * h, pz, s, h, s), col(['#2f7d32', '#25692a', '#3a8f3c'][Math.floor(rnd() * 3)], rnd)]);
        cones.push([M(px, 1.15 * h, pz, s * 0.72, h * 0.7, s * 0.72), col(['#2f7d32', '#25692a', '#3a8f3c'][Math.floor(rnd() * 3)], rnd)]);
      };
      const round = (px, pz, s) => {
        trunks.push([M(px, 0.15 * s, pz, s, s, s), col('#7c4a2a', rnd)]);
        const autumn = ['#e07b2a', '#d9a420', '#c0392b', '#4caf50', '#5cb85c', '#e8912f'];   // 10がつ：もみじ
        rounds.push([M(px, 0.78 * s, pz, s, s * 0.95, s), col(autumn[Math.floor(rnd() * autumn.length)], rnd)]);
      };
      if (t === '#') { for (let i = 0; i < 3; i++) conifer(x + j(), y + j(), 1.05 + rnd() * 0.35); }
      else if (t === 'T') {
        const n = 1 + (rnd() < 0.6 ? 1 : 0);
        for (let i = 0; i < n; i++) (rnd() < 0.6 ? conifer : round)(x + j() * 0.8, y + j() * 0.8, 0.75 + rnd() * 0.25);
      } else if (t === '"') {
        for (let i = 0; i < 7; i++) tufts.push([M(x + (rnd() - 0.5) * 0.85, 0.12, y + (rnd() - 0.5) * 0.85, 1, 0.8 + rnd() * 0.6, 1, rnd() * 3), col('#3f8f2f', rnd, 0.12)]);
      } else if (t === '.') {
        if (rnd() < 0.18) for (let i = 0; i < 3; i++) flowers.push([M(x + (rnd() - 0.5) * 0.7, 0.04, y + (rnd() - 0.5) * 0.7, 1, 1, 1), col(['#ffffff', '#fde047', '#f9a8d4'][Math.floor(rnd() * 3)])]);
        if (rnd() < 0.05) rocks.push([M(x + j(), 0.05, y + j(), 0.8 + rnd() * 0.5, 0.6, 0.8 + rnd() * 0.5, rnd() * 3), col('#9ca3af', rnd)]);
      } else if (t === '^' || t === 'C') {
        const h = 1.3 + rnd() * 0.8 + (t === 'C' ? 0.4 : 0);
        const my = t === 'C' ? y - 0.4 : y;   // どうくつの 山は おくに さげて、まえに ばんにんを たたせる
        mts.push([M(x, h / 2, my, 1.05, h, 1.05, rnd() * 3), col(['#8d7b68', '#7b6b5a', '#9a8a76'][Math.floor(rnd() * 3)], rnd)]);
        if (h > 1.65) caps.push([M(x, h - h * 0.17, my, 0.37, h * 0.34, 0.37, rnd() * 3), col('#f8fafc')]);
      }
    }
    inst(new THREE.BoxGeometry(1, 1, 1), mat(), ground);
    inst(new THREE.BoxGeometry(1, 1, 1), mat(), bed);
    inst(new THREE.CylinderGeometry(0.07, 0.1, 0.3, 6), mat(), trunks, true);
    inst(new THREE.ConeGeometry(0.42, 0.8, 7), mat(), cones, true);
    inst(new THREE.IcosahedronGeometry(0.42, 0), mat(), rounds, true);
    inst(new THREE.ConeGeometry(0.05, 0.28, 4), mat(), tufts);
    inst(new THREE.SphereGeometry(0.045, 6, 4), new THREE.MeshLambertMaterial(), flowers);
    inst(new THREE.DodecahedronGeometry(0.16, 0), mat(), rocks, true);
    inst(new THREE.ConeGeometry(0.62, 1, 6), mat(), mts, true);
    inst(new THREE.ConeGeometry(0.62, 1, 6), mat(), caps);

    // はし
    const plank = new THREE.MeshLambertMaterial({ color: 0xa16207 });
    for (let x = -2; x < FOREST_W + 2; x++) if (forestTile(x, 14) === 'B') {
      const p = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.1, 0.86), plank); p.position.set(x, 0.0, 14); p.castShadow = p.receiveShadow = true; world.add(p);
      [-0.42, 0.42].forEach(dz => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.07, 0.06), plank); rail.position.set(x, 0.28, 14 + dz); world.add(rail);
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.08), plank); post.position.set(x - 0.45, 0.14, 14 + dz); post.castShadow = true; world.add(post);
      });
    }
    // おしろ（もんが 手前＝南）
    const stone = mat({ color: 0xb8b9c2 }), dark = mat({ color: 0x2a2433 }), roof = mat({ color: 0xdc2626 }), roof2 = mat({ color: 0x1d4ed8 });
    const castle = new THREE.Group(); castle.position.set(28, 0, 3);
    const add = (geo, m, x, y, z, ry) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); if (ry) o.rotation.y = ry; o.castShadow = o.receiveShadow = true; castle.add(o); return o; };
    add(new THREE.BoxGeometry(2.7, 1.1, 2.5), stone, 0, 0.55, 0);
    for (let i = -1.2; i <= 1.21; i += 0.4) { add(new THREE.BoxGeometry(0.22, 0.22, 0.22), stone, i, 1.21, 1.2); add(new THREE.BoxGeometry(0.22, 0.22, 0.22), stone, i, 1.21, -1.2); }
    add(new THREE.BoxGeometry(1.2, 2.3, 1.2), stone, 0, 1.15, -0.3);
    add(new THREE.ConeGeometry(0.95, 1.0, 4), roof2, 0, 2.8, -0.3, Math.PI / 4);
    [[-1.3, 1.2], [1.3, 1.2], [-1.3, -1.2], [1.3, -1.2]].forEach(([x, z]) => {
      add(new THREE.CylinderGeometry(0.42, 0.48, 1.9, 10), stone, x, 0.95, z);
      add(new THREE.ConeGeometry(0.55, 0.85, 10), roof, x, 2.3, z);
    });
    add(new THREE.BoxGeometry(0.62, 0.8, 0.06), dark, 0, 0.4, 1.27);
    const flag = add(new THREE.BoxGeometry(0.4, 0.25, 0.02), roof, 0.2, 3.55, -0.3);
    add(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 4), dark, 0, 3.35, -0.3);
    world.add(castle);
    // ものみのとう
    const [tx, ty] = FOREST_SPOTS.tower;
    const tower = new THREE.Group(); tower.position.set(tx, 0, ty);
    [[new THREE.CylinderGeometry(0.34, 0.42, 2.2, 10), stone, 1.1], [new THREE.CylinderGeometry(0.46, 0.46, 0.16, 10), stone, 2.25], [new THREE.ConeGeometry(0.5, 0.75, 10), mat({ color: 0x92400e }), 2.7]]
      .forEach(([g, m, y]) => { const o = new THREE.Mesh(g, m); o.position.y = y; o.castShadow = true; tower.add(o); });
    [0.8, 1.6].forEach(y => { const w = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.05), dark); w.position.set(0, y, 0.39); tower.add(w); });
    world.add(tower);
    // どうくつの いりぐち
    const [cx, cy] = FOREST_SPOTS.cave;
    const hole = new THREE.Mesh(new THREE.CircleGeometry(0.34, 16, 0, Math.PI), new THREE.MeshBasicMaterial({ color: 0x0c0a09 }));
    hole.position.set(cx, 0.02, cy + 0.12); world.add(hole);
    // いずみ
    springAt(FOREST_SPOTS.spring[0], FOREST_SPOTS.spring[1]);
    // たてふだ
    const [px0, py0] = FOREST_SPOTS.sign, wood = mat({ color: 0xa16207 });
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.75, 0.1), wood); post.position.set(px0, 0.37, py0); post.castShadow = true; world.add(post);
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.36, 0.06), mat({ color: 0xd6a35c })); board.position.set(px0, 0.66, py0 + 0.04); board.castShadow = true; world.add(board);
    // テントと たきび
    const [fx0, fy0] = FOREST_SPOTS.tent;
    const tent = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.75, 4), mat({ color: 0xf59e0b })); tent.position.set(fx0, 0.375, fy0); tent.rotation.y = Math.PI / 4; tent.castShadow = true; world.add(tent);
    const fire = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 6), new THREE.MeshBasicMaterial({ color: 0xfb923c })); fire.position.set(fx0, 0.15, fy0 + 0.55); fire.userData.fire = true; world.add(fire);
    // たからばこ
    fz.chests.forEach(([x, y]) => chestAt(x, y));
    castle.userData.flag = flag;
    world.userData.fire = fire;
    world.userData.castle = castle;
  }
  build();
  let builtDay = fz.day + fz.area;

  let fxT = 0;
  const cam = new THREE.Vector3(), look = new THREE.Vector3();
  let first = true;
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // たて長の 画面では すこし 上から 遠く（はばが せまいので）
    camera.fov = w / h < 0.8 ? 46 : 36;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  // 画面を おしている あいだ、その むきへ あるく（ルナの いちから みた むき）
  const toScreen = new THREE.Vector3();
  let touchDir = null;
  const el = renderer.domElement;
  el.style.touchAction = 'none';
  function pointDir(e) {
    const r = el.getBoundingClientRect();
    toScreen.copy(hero.position); toScreen.y += 0.5; toScreen.project(camera);
    const hx = (toScreen.x + 1) / 2 * r.width, hy = (1 - toScreen.y) / 2 * r.height;
    const dx = e.clientX - r.left - hx, dy = e.clientY - r.top - hy;
    if (Math.hypot(dx, dy) < 24) return null;
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  }
  const setTouch = d => { if (touchDir) forestHold(touchDir, false); touchDir = d; if (d) forestHold(d, true); };
  el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); setTouch(pointDir(e)); });
  el.addEventListener('pointermove', e => { if (touchDir !== null || e.buttons) { const d = pointDir(e); if (d !== touchDir) setTouch(d); } });
  ['pointerup', 'pointercancel'].forEach(n => el.addEventListener(n, () => setTouch(null)));

  return {
    kind: '3d',
    chest(x, y) { const lid = chestLids[x + ',' + y]; if (lid) lid.userData.open = true; },
    fx(kind) { if (kind === 'heal') fxT = 1; },
    draw(dt, t) {
      if (builtDay !== fz.day + fz.area) { build(); builtDay = fz.day + fz.area; first = true; }
      const [px, py, k] = forestPos();
      const f = save.forest;
      const walking = !!forestMv;
      hero.position.set(px, walking ? Math.abs(Math.sin(k * Math.PI)) * 0.12 : 0, py);
      if (heroLv !== save.lv) { heroLv = save.lv; forestLunaSet().then(makeHeroTex); }
      const ht = heroTex[forestLunaFrame()];
      if (ht && hero.material.map !== ht) hero.material.map = ht;
      heroShadow.position.set(px, 0.015, py);
      const palCv = forestPalCanvas();
      if (palCv && palTexKey !== forestPalCv.key) {
        if (palTex) palTex.dispose();
        palTex = new THREE.CanvasTexture(palCv); palTex.colorSpace = THREE.SRGBColorSpace;
        pal.material.map = palTex; pal.material.needsUpdate = true; palTexKey = forestPalCv.key;
      }
      pal.visible = palShadow.visible = !!palCv;
      if (palCv) {
        const [qx, qy, qk] = forestPalPos();
        pal.position.set(qx, walking ? Math.abs(Math.sin(qk * Math.PI)) * 0.16 : Math.abs(Math.sin(t * 2.4)) * 0.04, qy);
        palShadow.position.set(qx, 0.012, qy);
      }
      // カメラ：ななめ 上・うしろ（南）から
      look.set(px, 0.3, py - 0.6);
      const back = camera.fov > 40 ? 9 : 7.2, up = camera.fov > 40 ? 14 : 10.8;   // 約55°の 見おろし
      const want = V.set(px, up, py + back);
      if (first) { cam.copy(want); first = false; } else cam.lerp(want, 1 - Math.exp(-dt * 7));
      camera.position.copy(cam);
      camera.lookAt(cam.x, 0.3, cam.z - back - 0.6);
      sun.position.set(px - 6, 14, py + 5);
      sun.target.position.set(px, 0, py);
      // うごく もの
      waterTex.offset.y = (waterTex.offset.y - dt * 0.25) % 1;
      sparkles.forEach(s => {
        const p = (t * 0.4 + s.userData.p) % 1, a = s.userData.p * Math.PI * 2 + t;
        const [wx, wy] = world.userData.spring || FOREST_SPOTS.spring;
        s.position.set(wx + Math.cos(a) * 0.3, 0.15 + p * 0.9, wy + Math.sin(a) * 0.3);
        s.scale.setScalar((1 - p) * (1 + fxT * 2));
        s.rotation.y = t * 3;
      });
      if (world.userData.fire) world.userData.fire.scale.set(1, 0.8 + Math.sin(t * 14) * 0.25, 1);
      const c = world.userData.castle;
      if (c && c.userData.flag) c.userData.flag.rotation.y = Math.sin(t * 3) * 0.3;
      Object.values(chestLids).forEach(l => { if (l.userData.open && l.rotation.x > -1.9) l.rotation.x = Math.max(-1.9, l.rotation.x - dt * 6); });
      fxT = Math.max(0, fxT - dt);
      if (golem) golem.visible = !f.key && fz.area !== 'castle';
      if (nushi) nushi.visible = fz.area === 'castle' && f.bossDay !== todayKey();
      (world.userData.flames || []).forEach((fl, i) => { fl.scale.set(1, 0.8 + Math.sin(t * 13 + i * 1.7) * 0.25, 1); fl.position.y = fl.userData.base + Math.sin(t * 9 + i) * 0.02; });
      const goal = forestGoal().at;
      mark.visible = !!goal;
      if (goal) mark.position.set(goal[0], forestGoal().h + Math.abs(Math.sin(t * 3.2)) * 0.35, goal[1]);
      // めざす ところが 画面の 外なら、はしに やじるしを 出す
      const arrow = document.getElementById('fz-arrow');
      if (arrow) {
        let show = false;
        if (goal) {
          toScreen.copy(mark.position).project(camera);
          const off = toScreen.z > 1 || Math.abs(toScreen.x) > 0.92 || Math.abs(toScreen.y) > 0.92;
          if (off) {
            const r = el.getBoundingClientRect();
            const ang = Math.atan2(goal[1] - py, goal[0] - px);        // ちずの 上での むき（＋z が 画面の 下）
            // うごける わく：上の じょうほう・下の ボタンに かさならない
            const x0 = 46, x1 = r.width - 46, y0 = Math.min(r.height / 2 - 40, 170), y1 = Math.max(r.height / 2 + 40, r.height - 250);
            const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
            const k = Math.min((x1 - cx) / Math.max(1e-3, Math.abs(Math.cos(ang))), (y1 - cy) / Math.max(1e-3, Math.abs(Math.sin(ang))));
            arrow.style.transform = 'translate(' + (cx + Math.cos(ang) * k - 28) + 'px,' + (cy + Math.sin(ang) * k - 28) + 'px)';
            arrow.firstChild.style.transform = 'rotate(' + ang + 'rad)';
            show = true;
          }
        }
        arrow.style.display = show ? 'block' : 'none';
      }
      hero.material.color.setRGB(1, 1, 1).lerp(new THREE.Color(0xbbf7d0), fxT * 0.6);
      renderer.render(scene, camera);
    },
  };
}

// ── 📖 モンスターずかん（save.forestDex：{ モンスターの key: たおした かず }。日を こえても のこる）──
function forestDex() { if (!save.forestDex || typeof save.forestDex !== 'object') save.forestDex = {}; return save.forestDex; }
// ✨ しんか（save.forestEvo：{ もとの key: true }。一生に 1かい）
function forestEvo() { if (!save.forestEvo || typeof save.forestEvo !== 'object') save.forestEvo = {}; return save.forestEvo; }
// ずかんに のっているか（しんかした すがたは もとの モンスターが しんか していれば）
function forestDexHas(k) { return /_evo$/.test(k) ? !!forestEvo()[k.slice(0, -4)] : !!forestDex()[k]; }
function forestDexCount() { return typeof FOREST_DEX_ORDER === 'undefined' ? 0 : FOREST_DEX_ORDER.filter(([k]) => forestDexHas(k)).length; }
function forestDexOpen(pick) {
  if (typeof FOREST_DEX_ORDER === 'undefined') return;
  let w = document.getElementById('fz-dex');
  if (!w) {
    w = document.createElement('div');
    w.id = 'fz-dex'; w.className = 'fz-mapwrap';
    w.onclick = e => { if (e.target === w) forestDexClose(); };
    document.body.appendChild(w);
  }
  const dex = forestDex(), got = forestDexCount(), all = FOREST_DEX_ORDER.length;
  let body;
  if (pick && forestDexHas(pick)) {
    const area = (FOREST_DEX_ORDER.find(([k]) => k === pick) || [])[1] || '';
    const isEvo = /_evo$/.test(pick), base = isEvo ? pick.slice(0, -4) : pick;
    const canEvo = !isEvo && typeof FOREST_EVOS !== 'undefined' && FOREST_EVOS[pick];
    // あと なんかい：しんかと なかまが おなじ かず（5）の ときは 1行に まとめる
    const left = isEvo ? 0 : Math.max(0, FOREST_PAL_NEED - dex[pick]);
    const evoLeft = canEvo && !forestEvo()[pick] ? Math.max(1, FOREST_EVO_NEED - dex[pick]) : 0;
    const palLine = forestCanPal(pick)
      ? '<button class="fz-palbtn' + (save.forestPal === pick ? ' on' : '') + '" onclick="forestSetPal(\'' + pick + '\')">' +
          (save.forestPal === pick ? '🤝 いっしょに いるよ（タップで わかれる）' : '🤝 なかまに する') + '</button>'
      : left && evoLeft === left ? '<div class="fz-evonext">✨ あと ' + left + 'かい たおすと しんか ＆ なかまに できるよ！</div>'
      : left ? '<div class="fz-evonext">🤝 あと ' + left + 'かい たおすと なかまに できるよ！</div>' : '';
    const evoLine = isEvo
      ? '<button class="fz-evolink" onclick="forestDexOpen(\'' + base + '\')">' + esc(CHAR_NAME[base]) + ' が しんかした すがた →</button>'
      : !canEvo ? ''
      : forestEvo()[pick]
      ? '<button class="fz-evolink" onclick="forestDexOpen(\'' + pick + '_evo\')">✨ ' + esc(CHAR_NAME[pick + '_evo']) + ' に しんかした！ →</button>'
      : evoLeft === left ? ''
      : '<div class="fz-evonext">✨ あと ' + evoLeft + 'かい たおすと しんか するよ！</div>';
    body =
      '<div style="display:flex; justify-content:center;">' + CHARS[pick](6, 100, 190, {}) + '</div>' +
      '<div style="font-size:20px; font-weight:800;">' + esc(CHAR_NAME[pick]) + '</div>' +
      '<div style="font-size:12px; color:#64748b; margin-top:2px;">📍 ' + area + (isEvo ? '' : '　⚔️ たおした かず ' + dex[pick]) + '</div>' +
      '<div style="margin-top:10px; background:#f0fdf4; border-radius:12px; padding:10px 12px; font-size:14px; line-height:1.8; text-align:left;">' + esc(FOREST_MONSTER_INFO[pick] || '') + '</div>' +
      palLine + (palLine && evoLine ? '<br>' : '') + evoLine +
      '<button class="btn-main" style="margin-top:12px;" onclick="forestDexOpen()">← ずかんに もどる</button>';
  } else {
    let lastArea = '';
    const cards = FOREST_DEX_ORDER.map(([k, area], i) => {
      const head = area !== lastArea ? '<div class="fz-dexhead">' + area + '</div>' : '';
      lastArea = area;
      const on = forestDexHas(k);
      // しんかの めじるし：しんか ずみは ✨、まだなら たおした かず / ひつような かず
      const evo = !on || typeof FOREST_EVOS === 'undefined' || !FOREST_EVOS[k] ? ''
        : forestEvo()[k] ? '<span class="fz-dexevo done">✨</span>'
        : '<span class="fz-dexevo">' + Math.min(dex[k], FOREST_EVO_NEED) + '/' + FOREST_EVO_NEED + '</span>';
      const palMark = on && save.forestPal === k ? '<span class="fz-dexpal">🤝</span>' : '';
      return head + '<button class="fz-dexcard' + (on ? '' : ' off') + (palMark ? ' pal' : '') + '"' + (on ? ' onclick="forestDexOpen(\'' + k + '\')"' : '') + '>' +
        '<span class="fz-dexno">No.' + String(i + 1).padStart(2, '0') + '</span>' + evo + palMark +
        CHARS[k](6, 100, 74, { silhouette: !on }) +
        '<span class="fz-dexname">' + (on ? esc(CHAR_NAME[k]) : '？？？') + '</span></button>';
    }).join('');
    body =
      '<div style="font-size:18px; font-weight:800;">📖 モンスターずかん</div>' +
      '<div style="font-size:13px; color:#64748b; margin:2px 0 8px;">たおした モンスター ' + got + ' / ' + all + (got === all ? '　🎉 コンプリート！' : '') + '</div>' +
      '<div class="fz-dexbar"><i style="width:' + Math.round(got / all * 100) + '%"></i></div>' +
      '<div class="fz-dexgrid">' + cards + '</div>' +
      '<button class="btn-main" style="margin-top:12px;" onclick="forestDexClose()">とじる</button>';
  }
  w.innerHTML = '<div class="panel fz-dexpanel" onclick="event.stopPropagation()">' + body + '</div>';
}
function forestDexClose() { const w = document.getElementById('fz-dex'); if (w) w.remove(); }

// ── たたかい（rpg.html の戦いを そのまま つかう）──
// kind：'mob' ふつう／'guard' どうくつの ばんにん／'boss' もりのぬし
function startForestBattle(kind) {
  if (kind === true) kind = 'boss';
  if (!kind) kind = 'mob';
  const f = save.forest;
  if (save.hp <= 0) save.hp = maxHp();
  const castle = forestInCastle();
  const east = !castle && forestEast(f.x, f.y);
  const n = kind === 'boss' ? 8 : kind === 'guard' ? 4 : kind === 'mimic' || castle ? 3 : 2 + (east || Math.random() < 0.3 ? 1 : 0);
  // モンスター（js/forest_monsters.js）。川の むこうは 色ちがいの つよい なかま、おしろの なかは おしろの モンスター
  const mobs = typeof FOREST_MOBS !== 'undefined' ? FOREST_MOBS[castle && FOREST_MOBS.castle ? 'castle' : east ? 'east' : 'west'] : MONSTER_POOL;
  const char = kind === 'boss' ? (typeof FOREST_NUSHI_KEY !== 'undefined' ? FOREST_NUSHI_KEY : FOREST_BOSS_CHAR)
    : kind === 'guard' && typeof FOREST_GUARD_KEY !== 'undefined' ? FOREST_GUARD_KEY
    : kind === 'mimic' && typeof FOREST_MIMIC_KEY !== 'undefined' ? FOREST_MIMIC_KEY
    : mobs[Math.floor(Math.random() * mobs.length)];
  f.since = 0;
  bt = {
    boss: false, key: '__forest__', char,
    name: kind === 'boss' ? CHAR_NAME[char] || FOREST_BOSS_NAME : kind === 'guard' ? FOREST_GUARD_NAME : CHAR_NAME[char],
    queue: shuffle(forestPool()).slice(0, n), idx: 0,
    maxHp: n * DMG_HIT, hp: n * DMG_HIT, streak: 0, correct: 0, medals: 0, answered: false,
    tt: null, ttMedals: 0, ttIn: 0, ttAnswered: 0,
    forest: { kind, boss: kind === 'boss', label: kind === 'boss' ? '🏰 もりのぬし' : kind === 'guard' ? '🕳 どうくつ'
      : kind === 'mimic' ? '🏰 おしろの たからばこ' : castle ? '🏰 おしろの なか' : east ? '🌲 まよいの森（かわむこう）' : '🌲 まよいの森' }
  };
  persist();
  if (typeof fmPlay === 'function') fmPlay(kind === 'boss' ? 'boss' : 'battle');
  renderBattle();
  setMsg(bt.name + ' が あらわれた！');
  showScreen('battle');
  ttRender();
}

function medalForest(key, n) {
  const led = loadMedalLedger();
  const k = MEDAL_MONTH + '|' + key;
  if (led.units[k]) return 0;
  led.units[k] = n;
  saveMedalLedger(led);
  return n;
}

function forestEndBattle(win) {
  const f = save.forest, kind = bt.forest.kind || (bt.forest.boss ? 'boss' : 'mob'), boss = kind === 'boss';
  let lvUps = 0, bonus = 0, first = false, gotKey = false;
  questLogDay(d => { d.battles++; if (win) d.wins++; });
  let dexNew = false, evolved = null, evoBonus = 0;
  if (win) {
    const dex = forestDex();
    dexNew = !dex[bt.char];
    dex[bt.char] = (dex[bt.char] || 0) + 1;
    // ✨ おなじ モンスターを FOREST_EVO_NEED かい たおすと しんか（一生に 1かい）
    if (typeof FOREST_EVOS !== 'undefined' && FOREST_EVOS[bt.char] && dex[bt.char] >= FOREST_EVO_NEED && !forestEvo()[bt.char]) {
      forestEvo()[bt.char] = true;
      evolved = bt.char + '_evo';
      evoBonus = medalForest('forest:evo:' + bt.char, FOREST_EVO_MEDAL);
      bt.medals += evoBonus;
    }
    save.exp += boss ? EXP_WIN * 2 : kind === 'guard' || kind === 'mimic' ? Math.round(EXP_WIN * 1.5) : EXP_WIN;
    save.wins++;
    if (kind === 'guard' && !f.key) { f.key = true; gotKey = true; }
    if (kind === 'mimic') f.mimic = true;   // たおした ミミックは ふつうの たからばこに なる
    if (boss && f.bossDay !== todayKey()) {
      bonus += medalForest('forest:' + todayKey(), FOREST_BOSS_DAILY);
      f.bossDay = todayKey();
      // はじめての ぬしボーナスは 月ごと（台帳の <月>|forest:first が なければ）
      const monthFirst = !loadMedalLedger().units[MEDAL_MONTH + '|forest:first'];
      if (monthFirst) {
        bonus += medalForest('forest:first', FOREST_BOSS_FIRST);
        first = !f.bossEver;   // トロフィーの おしらせは 一生に1回
        f.bossEver = true;
        try { localStorage.setItem('ena_forest_trophy', '1'); } catch (e) {}
      }
      bt.medals += bonus;
    }
  }
  while (save.exp >= needExp()) { save.exp -= needExp(); save.lv++; lvUps++; }
  if (lvUps) save.hp = maxHp();
  const wiped = save.hp <= 0;
  if (wiped) {                                     // めのまえが まっくらに…→ キャンプへ
    save.hp = Math.max(1, Math.round(maxHp() / 2));
    f.area = 'field'; f.x = FOREST_SPOTS.start[0]; f.y = FOREST_SPOTS.start[1]; f.since = 0;
  }
  persist();

  const art = (sil) => '<div style="margin:12px 0; display:flex; justify-content:center;' + (sil ? ' opacity:.75;' : '') + '">' +
    CHARS[bt.char](6, 100, 130, { silhouette: sil }) + '</div>';
  document.getElementById('result-body').innerHTML =
    (win
      ? '<div style="font-size:21px; font-weight:800; color:#16a34a;">' + (boss ? '👑 もりのぬしを たおした！' : bt.name + ' を やっつけた！') + '</div>' + art(false)
      : wiped
      ? '<div style="font-size:21px; font-weight:800; color:#b91c1c;">めのまえが まっくらに なった…</div>' + art(true) +
        '<div style="font-size:13px; color:#64748b;">もりの キャンプに もどされた。HP は はんぶん かいふく。</div>'
      : '<div style="font-size:21px; font-weight:800; color:#b45309;">' + bt.name + ' は にげていった…</div>' + art(true)) +
    '<div style="margin-top:10px; font-size:14px;">せいかい ' + bt.correct + ' / ' + bt.queue.length + '</div>' +
    (dexNew ? '<div style="margin-top:6px; font-size:15px; font-weight:800; color:#7c3aed;">📖 ' + esc(CHAR_NAME[bt.char] || bt.name) + ' が ずかんに のった！（' + forestDexCount() + ' / ' + FOREST_DEX_ORDER.length + '）</div>' : '') +
    (evolved ? '<div class="fz-evoresult">' +
        '<div style="font-size:16px; font-weight:800; color:#b45309;">✨ ' + esc(CHAR_NAME[bt.char]) + ' が しんかした！</div>' +
        '<div style="display:flex; justify-content:center;">' + CHARS[evolved](6, 100, 120, {}) + '</div>' +
        '<div style="font-size:15px; font-weight:800; color:#7c3aed;">📖 ' + esc(CHAR_NAME[evolved]) + ' が ずかんに のった！（' + forestDexCount() + ' / ' + FOREST_DEX_ORDER.length + '）</div>' +
        (evoBonus ? '<div style="font-size:14px; font-weight:800; color:#15803d; margin-top:2px;">しんか ボーナス 🪙+' + evoBonus + '</div>' : '') +
      '</div>' : '') +
    (win && !evolved && forestDex()[bt.char] === FOREST_PAL_NEED ? '<div style="margin-top:6px; font-size:14px; font-weight:800; color:#0369a1;">🤝 ' + esc(CHAR_NAME[bt.char]) + ' を ずかんから なかまに できるよ！</div>' : '') +
    (evolved ? '<div style="margin-top:6px; font-size:14px; font-weight:800; color:#0369a1;">🤝 ずかんから なかまに できるよ！</div>' : '') +
    (gotKey ? '<div style="margin-top:6px; font-size:15px; font-weight:800; color:#b45309;">🗝 しろの かぎを てに いれた！</div>' : '') +
    (bonus ? '<div style="margin-top:6px; font-size:15px; font-weight:800; color:#15803d;">🌲 もりのぬし ボーナス 🪙+' + bonus + '</div>' : '') +
    (first ? '<div style="margin-top:4px; font-size:13px; font-weight:800; color:#b45309;">🏆 しまに「もりの トロフィー」が とどくよ！</div>' : '') +
    '<div style="margin-top:8px; font-size:15px; font-weight:800; color:#b45309;">🪙 アンリノメダル +' + bt.medals + ' 枚' +
      '<div style="font-size:11.5px; color:#94a3b8; font-weight:700; margin-top:3px;">もっているメダル ' + medalTotal() + ' 枚（しまの ショップで つかえるよ）</div>' +
    '</div>';

  forestMsg = win ? (evolved ? '✨ ' + CHAR_NAME[evolved] + ' が ずかんに のった！ 📖で みてみよう。' : boss ? '👑 もりのぬしを たおした！ きょうの もりは クリア！'
      : gotKey ? '🗝 しろの かぎを てに いれた！ 川の むこうの おしろへ いこう。'
      : kind === 'mimic' ? 'ミミックを やっつけた！ こんどこそ たからばこを あけよう。'
      : 'モンスターを やっつけた！')
    : wiped ? 'きが ついたら もりの キャンプに いた…' : 'モンスターは にげていった。';
  if (typeof fmOnce === 'function') { if (win) fmOnce('victory', null); else fmStop(); }
  afterResult = backToForest;
  document.getElementById('result-back').textContent = '🌲 もりへ もどる';
  if (lvUps) showLevelUp(lvUps);
  showScreen('result');
}

function forestFlee() {
  setMsg('');
  forestMsg = 'うまく にげきれた！';
  backToForest();
}
function backToForest() {
  forestLoad();
  forestShow(forestMsg);
}
