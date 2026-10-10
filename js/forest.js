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
const FOREST_ENC = { '.': 0.05, '"': 0.10, 'T': 0.12 };     // 1歩ごとの 出やすさ（みち・はしは 出ない）
const FOREST_STEP = 0.2;                                    // 1マス あるく 秒
const FOREST_BOSS_DAILY = 5, FOREST_BOSS_FIRST = 10;
const FOREST_BOSS_CHAR = 'bear', FOREST_BOSS_NAME = 'もりのぬし ビッグベア';
const FOREST_GUARD_NAME = 'どうくつの ばんにん';
const FOREST_WALK = '.";T=B';                              // あるける マス
let fz = null;          // いまの ちず（forestBuild の かえりち）
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
// 記号：# ふかい森（とおれない） ^ 山 ~ 川 X おしろ K しろの もん C どうくつ R ものみのとう W いずみ F テント $ たからばこ
//       . くさはら " くさむら T もり = みち B はし
function forestRiverX(y) { return 17 + Math.round(1.6 * Math.sin(y * 0.45)); }
function forestOutside(x, y) {           // ちずの 外（3D の まわりの けしき）
  const rx = forestRiverX(y);
  return x >= rx - 1 && x <= rx + 1 ? '~' : '#';
}
const FOREST_SPOTS = {
  start: [5, 22], tent: [4, 22], spring: [6, 17], cave: [2, 6], tower: [24, 19], gate: [28, 4],
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
  // たからばこ（毎日 3こ。スタートから すこし はなれた くさはら・もり）
  const chests = [];
  for (let tries = 0; chests.length < 3 && tries < 500; tries++) {
    const x = 1 + Math.floor(rnd() * (W - 2)), y = 1 + Math.floor(rnd() * (H - 2));
    const c = get(x, y);
    if (c !== '.' && c !== 'T' && c !== '"') continue;
    if (Math.abs(x - S.start[0]) + Math.abs(y - S.start[1]) < 9) continue;
    let near = false;
    for (let yy = y - 2; yy <= y + 2; yy++) for (let xx = x - 2; xx <= x + 2; xx++) if ('=BKCRWF$'.includes(get(xx, yy))) near = true;
    if (near) continue;
    set(x, y, '$');
    chests.push([x, y]);
  }
  const map = { W, H, t, get, chests, start: S.start.slice() };
  // ぜんぶの めじるしに いけるか（だめなら べつの salt で つくりなおす）
  const dist = forestDist(map, S.start[0], S.start[1]);
  const reach = ([x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => dist[at(x + dx, y + dy)] >= 0);
  const ok = [S.spring, S.cave, S.tower, S.gate, ...chests].every(reach);
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
function forestTile(x, y) { return fz ? fz.get(x, y) : '#'; }
function forestEast(x, y) { return x > forestRiverX(y) + 1; }

// ── その日の しんこう（save.forest）──
function forestState() {
  const d = todayKey();
  const old = save.forest || {};
  if (old.day !== d || old.v !== 2) {
    save.forest = {
      v: 2, day: d, x: FOREST_SPOTS.start[0], y: FOREST_SPOTS.start[1], dir: 'down', since: 0,
      seen: '', opened: [], key: false, tower: false,
      bossDay: old.bossDay || '', bossEver: !!old.bossEver,
    };
    persist();
  }
  return save.forest;
}
function forestLoad() {
  const f = forestState();
  if (!fz || fz.day !== f.day) { fz = forestBuild(f.day); fz.day = f.day; }
  if (!FOREST_WALK.includes(forestTile(f.x, f.y))) { f.x = fz.start[0]; f.y = fz.start[1]; }
  forestReveal();
}
function forestReveal() {
  const f = save.forest, n = FOREST_W * FOREST_H;
  const a = (f.seen && f.seen.length === n ? f.seen : '0'.repeat(n)).split('');
  for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
    const x = f.x + dx, y = f.y + dy;
    if (x >= 0 && y >= 0 && x < FOREST_W && y < FOREST_H && dx * dx + dy * dy <= 18) a[y * FOREST_W + x] = '1';
  }
  f.seen = a.join('');
}
function forestSeen(x, y) {
  const f = save.forest;
  return f.tower || (f.seen || '')[y * FOREST_W + x] === '1';
}
function forestChestOpened(x, y) { return (save.forest.opened || []).includes(x + ',' + y); }

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
    (beat ? '<div style="margin-top:6px; font-size:11.5px; color:#15803d; font-weight:800; text-align:right;">👑 きょうは もりのぬしを たおしたよ！</div>' : '') +
  '</div>';
}

function enterForest() {
  ttPick = false;
  if (save.hp <= 0) save.hp = maxHp();
  forestLoad();
  forestMapOpen = false;
  persist();
  forestShow(save.forest.key ? 'もりに もどってきた。おしろへ いこう！' : 'もりに はいった。どうくつの ばんにんが しろの かぎを もっているらしい…');
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
        '</div>' +
        '<div style="display:flex; flex-direction:column; gap:6px;">' +
          '<button class="fz-btn" onclick="toggleForestMap()">🗺️ ちず</button>' +
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
  if (typeof fmPlay === 'function') fmPlay('field');
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
    '📦 たからばこ ' + (f.opened || []).length + ' / ' + fz.chests.length;
}

let forestSayTimer = 0;
function forestSay(text) {
  forestMsg = text;
  const el = document.getElementById('forest-msg');
  if (!el) return;
  el.textContent = text;
  el.classList.toggle('on', !!text);
  clearTimeout(forestSayTimer);
  if (text) forestSayTimer = setTimeout(() => el.classList.remove('on'), 4200);
}

function toggleForestMap() { forestMapOpen = !forestMapOpen; forestDrawMap(); }
function forestDrawMap() {
  const box = document.getElementById('fz-mapbox');
  if (!box) return;
  if (!forestMapOpen) { box.innerHTML = ''; return; }
  box.innerHTML = '<div class="fz-mapwrap" onclick="toggleForestMap()">' +
    '<div class="panel" style="text-align:center;" onclick="event.stopPropagation()">' +
      '<b>🗺️ まよいの森の ちず</b>' +
      '<canvas id="fz-mini" class="fz-mini"></canvas>' +
      '<div style="font-size:11px; color:#64748b;">🔴 ルナ　🏰 おしろ　🕳 どうくつ　⛲ いずみ　🗼 とう　📦 たからばこ</div>' +
      (save.forest.tower ? '' : '<div style="font-size:11px; color:#64748b; margin-top:2px;">ものみのとうに のぼると ちずが ぜんぶ わかるよ</div>') +
      '<button class="btn-main" style="margin-top:10px;" onclick="toggleForestMap()">とじる</button>' +
    '</div>' +
  '</div>';
  const cv = document.getElementById('fz-mini');
  const k = 18;
  cv.width = FOREST_W * k; cv.height = FOREST_H * k;
  forestPaint2D(cv.getContext('2d'), 0, 0, FOREST_W, FOREST_H, k, true);
}

const FOREST_COLOR = { '#': '#14532d', '^': '#8d7b68', '~': '#3b82f6', 'X': '#9ca3af', 'K': '#9ca3af', 'C': '#44403c',
  'R': '#a8a29e', 'W': '#7dd3fc', 'F': '#fde68a', '$': '#86efac', '.': '#86d36b', '"': '#5fae48', 'T': '#2f8a3a',
  '=': '#e2c58f', 'B': '#a16207' };
const FOREST_EMOJI = { '#': '🌲', '^': '⛰️', 'T': '🌳', 'X': '', 'K': '🏰', 'C': '🕳️', 'R': '🗼', 'W': '⛲', 'F': '⛺', '$': '📦' };
// ちず（ちいさい）と、WebGL が ない 端末の 画面を 2D で かく
function forestPaint2D(g, ox, oy, cols, rows, k, mini) {
  const f = save.forest;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = ox + c, y = oy + r;
    const inMap = x >= 0 && y >= 0 && x < FOREST_W && y < FOREST_H;
    let t = forestTile(x, y);
    if (t === '$' && forestChestOpened(x, y)) t = '.';
    const seen = !mini || !inMap || forestSeen(x, y);
    g.fillStyle = seen ? FOREST_COLOR[t] || '#86d36b' : '#0f172a';
    g.fillRect(c * k, r * k, k + 0.5, k + 0.5);
    if (!seen) continue;
    const e = FOREST_EMOJI[t];
    if (e && (!mini || 'KCRW$'.includes(t))) {
      g.font = Math.round(k * (mini ? 1.25 : 0.8)) + 'px sans-serif';
      g.fillText(e, c * k + k / 2, r * k + k / 2 + 1);
    }
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
  f.x = forestMv.tx; f.y = forestMv.ty;
  forestMv = null;
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
  if (t === '$') {
    if (forestChestOpened(x, y)) return forestSay('📦 からっぽの たからばこだ。');
    f.opened = (f.opened || []).concat(x + ',' + y);
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
    if (f.bossDay === todayKey()) return forestSay('✨ もりのぬしは もう たおしたよ。また あしたの もりで あおう！');
    if (!f.key) return forestSay('🏰 しろの もんには かぎが かかっている。どうくつの ばんにんが かぎを もっているらしい…');
    persist();
    return forestEncounter(() => startForestBattle('boss'));
  }
  if (t === 'F') return forestSay('⛺ キャンプの テント。「🏃 でる」で もりを でられるよ。');
  if (t === '^') return forestSay('けわしい 山だ。のぼれない。');
  if (t === '~') return forestSay('ながれが はやくて わたれない。はしを さがそう。');
  if (t === '#') return forestSay('きが しげっていて すすめない。');
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

// ── ルナの え（SVG → canvas）──
function forestLunaCanvas(flip) {
  return new Promise(res => {
    const size = 256;
    const svg = CHARS.luna(Math.min(6, save.lv), 100, size, {});
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const g = c.getContext('2d');
      if (flip) { g.translate(size, 0); g.scale(-1, 1); }
      g.drawImage(img, 0, 0, size, size);
      res(c);
    };
    img.onerror = () => res(null);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
}

// ── 2D（WebGL が ない 端末）──
function forest2DInit() {
  const stage = document.getElementById('fz-stage');
  stage.innerHTML = '<canvas id="fz-canvas"></canvas>';
  const cv = stage.querySelector('canvas');
  let luna = null;
  forestLunaCanvas(false).then(c => { luna = c; });
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
      if (luna) g.drawImage(luna, w / 2 - k * 0.6, h / 2 - k * 0.7, k * 1.2, k * 1.2);
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
  scene.add(new THREE.HemisphereLight(0xe0f2fe, 0x3f6212, 1.15));
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
  const [lunaR, lunaL] = await Promise.all([forestLunaCanvas(false), forestLunaCanvas(true)]);
  const texR = lunaR && new THREE.CanvasTexture(lunaR), texL = lunaL && new THREE.CanvasTexture(lunaL);
  [texR, texL].forEach(t => { if (t) t.colorSpace = THREE.SRGBColorSpace; });
  const hero = new THREE.Sprite(new THREE.SpriteMaterial({ map: texR, transparent: true, alphaTest: 0.1 }));
  hero.center.set(0.5, 0.06);
  hero.scale.set(1.6, 1.6, 1);
  const heroShadow = new THREE.Mesh(new THREE.CircleGeometry(0.32, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false }));
  heroShadow.rotation.x = -Math.PI / 2;
  scene.add(hero, heroShadow);

  // いずみの きらきら
  const sparkles = [];
  const sparkGeo = new THREE.OctahedronGeometry(0.06);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
  let chestLids = {};

  function build() {
    while (world.children.length) { const c = world.children.pop(); if (c.geometry) c.geometry.dispose(); }
    sparkles.length = 0; chestLids = {};
    const rnd = forestRand(forestSeed('look#' + fz.day));
    const ground = [], bed = [], trunks = [], cones = [], rounds = [], tufts = [], flowers = [], rocks = [], mts = [], caps = [];
    const R = 7;   // ちずの 外も すこし かく
    for (let y = -R; y < FOREST_H + R; y++) for (let x = -R; x < FOREST_W + R; x++) {
      const t = forestTile(x, y);
      if (t === '~' || t === 'B') { bed.push([M(x, -0.6, y, 1, 0.3, 1), col('#a8a29e', rnd)]); continue; }
      const gc = { '.': '#7cc75a', '"': '#5fae48', 'T': '#4c9a3c', '#': '#3d7f35', '=': '#dcc08a', '^': '#8f9a5a',
        'X': '#8f9a5a', 'K': '#8f9a5a', 'C': '#8f9a5a', 'R': '#7cc75a', 'W': '#7cc75a', 'F': '#7cc75a', '$': '#7cc75a' }[t] || '#7cc75a';
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
        mts.push([M(x, h / 2, y, 1.05, h, 1.05, rnd() * 3), col(['#8d7b68', '#7b6b5a', '#9a8a76'][Math.floor(rnd() * 3)], rnd)]);
        if (h > 1.65) caps.push([M(x, h - h * 0.17, y, 0.37, h * 0.34, 0.37, rnd() * 3), col('#f8fafc')]);
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
    hole.position.set(cx, 0.02, cy + 0.47); world.add(hole);
    // いずみ
    const [sx, sy] = FOREST_SPOTS.spring;
    const pond = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.06, 20), new THREE.MeshLambertMaterial({ color: 0x7dd3fc, emissive: 0x0ea5e9, emissiveIntensity: 0.35 }));
    pond.position.set(sx, 0.03, sy); world.add(pond);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.07, 6, 20), stone); ring.rotation.x = Math.PI / 2; ring.position.set(sx, 0.06, sy); world.add(ring);
    for (let i = 0; i < 6; i++) { const s = new THREE.Mesh(sparkGeo, sparkMat); s.userData.p = i / 6; s.position.set(sx, 0.3, sy); world.add(s); sparkles.push(s); }
    // テントと たきび
    const [fx0, fy0] = FOREST_SPOTS.tent;
    const tent = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.75, 4), mat({ color: 0xf59e0b })); tent.position.set(fx0, 0.375, fy0); tent.rotation.y = Math.PI / 4; tent.castShadow = true; world.add(tent);
    const fire = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 6), new THREE.MeshBasicMaterial({ color: 0xfb923c })); fire.position.set(fx0, 0.15, fy0 + 0.55); fire.userData.fire = true; world.add(fire);
    // たからばこ
    fz.chests.forEach(([x, y]) => {
      const g = new THREE.Group(); g.position.set(x, 0, y);
      const wood = mat({ color: 0x92400e }), gold = mat({ color: 0xfacc15 });
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.36), wood); box.position.y = 0.15; box.castShadow = true; g.add(box);
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.38), gold); band.position.y = 0.2; g.add(band);
      const lid = new THREE.Group(); lid.position.set(0, 0.3, -0.18); g.add(lid);
      const top = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.36), wood); top.position.set(0, 0.06, 0.18); top.castShadow = true; lid.add(top);
      if (forestChestOpened(x, y)) lid.rotation.x = -1.9;
      chestLids[x + ',' + y] = lid;
      world.add(g);
    });
    castle.userData.flag = flag;
    world.userData.fire = fire;
    world.userData.castle = castle;
  }
  build();
  let builtDay = fz.day;

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
      if (builtDay !== fz.day) { build(); builtDay = fz.day; }
      const [px, py, k] = forestPos();
      const f = save.forest;
      const walking = !!forestMv;
      hero.position.set(px, walking ? Math.abs(Math.sin(k * Math.PI)) * 0.12 : 0, py);
      if (f.dir === 'left' && texL) hero.material.map = texL;
      else if (f.dir === 'right' && texR) hero.material.map = texR;
      heroShadow.position.set(px, 0.015, py);
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
        s.position.set(FOREST_SPOTS.spring[0] + Math.cos(a) * 0.3, 0.15 + p * 0.9, FOREST_SPOTS.spring[1] + Math.sin(a) * 0.3);
        s.scale.setScalar((1 - p) * (1 + fxT * 2));
        s.rotation.y = t * 3;
      });
      if (world.userData.fire) world.userData.fire.scale.set(1, 0.8 + Math.sin(t * 14) * 0.25, 1);
      const c = world.userData.castle;
      if (c && c.userData.flag) c.userData.flag.rotation.y = Math.sin(t * 3) * 0.3;
      Object.values(chestLids).forEach(l => { if (l.userData.open && l.rotation.x > -1.9) l.rotation.x = Math.max(-1.9, l.rotation.x - dt * 6); });
      fxT = Math.max(0, fxT - dt);
      hero.material.color.setRGB(1, 1, 1).lerp(new THREE.Color(0xbbf7d0), fxT * 0.6);
      renderer.render(scene, camera);
    },
  };
}

// ── たたかい（rpg.html の戦いを そのまま つかう）──
// kind：'mob' ふつう／'guard' どうくつの ばんにん／'boss' もりのぬし
function startForestBattle(kind) {
  if (kind === true) kind = 'boss';
  if (!kind) kind = 'mob';
  const f = save.forest;
  if (save.hp <= 0) save.hp = maxHp();
  const east = forestEast(f.x, f.y);
  const n = kind === 'boss' ? 8 : kind === 'guard' ? 4 : 2 + (east || Math.random() < 0.3 ? 1 : 0);
  const char = kind === 'boss' ? FOREST_BOSS_CHAR : MONSTER_POOL[Math.floor(Math.random() * MONSTER_POOL.length)];
  f.since = 0;
  bt = {
    boss: false, key: '__forest__', char,
    name: kind === 'boss' ? FOREST_BOSS_NAME : kind === 'guard' ? FOREST_GUARD_NAME : (east ? 'かわむこうの' : 'もりの') + CHAR_NAME[char],
    queue: shuffle(forestPool()).slice(0, n), idx: 0,
    maxHp: n * DMG_HIT, hp: n * DMG_HIT, streak: 0, correct: 0, medals: 0, answered: false,
    tt: null, ttMedals: 0, ttIn: 0, ttAnswered: 0,
    forest: { kind, boss: kind === 'boss', label: kind === 'boss' ? '🏰 もりのぬし' : kind === 'guard' ? '🕳 どうくつ' : east ? '🌲 まよいの森（かわむこう）' : '🌲 まよいの森' }
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
  if (win) {
    save.exp += boss ? EXP_WIN * 2 : kind === 'guard' ? Math.round(EXP_WIN * 1.5) : EXP_WIN;
    save.wins++;
    if (kind === 'guard' && !f.key) { f.key = true; gotKey = true; }
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
    f.x = FOREST_SPOTS.start[0]; f.y = FOREST_SPOTS.start[1]; f.since = 0;
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
    (gotKey ? '<div style="margin-top:6px; font-size:15px; font-weight:800; color:#b45309;">🗝 しろの かぎを てに いれた！</div>' : '') +
    (bonus ? '<div style="margin-top:6px; font-size:15px; font-weight:800; color:#15803d;">🌲 もりのぬし ボーナス 🪙+' + bonus + '</div>' : '') +
    (first ? '<div style="margin-top:4px; font-size:13px; font-weight:800; color:#b45309;">🏆 しまに「もりの トロフィー」が とどくよ！</div>' : '') +
    '<div style="margin-top:8px; font-size:15px; font-weight:800; color:#b45309;">🪙 アンリノメダル +' + bt.medals + ' 枚' +
      '<div style="font-size:11.5px; color:#94a3b8; font-weight:700; margin-top:3px;">もっているメダル ' + medalTotal() + ' 枚（しまの ショップで つかえるよ）</div>' +
    '</div>';

  forestMsg = win ? (boss ? '👑 もりのぬしを たおした！ きょうの もりは クリア！'
      : gotKey ? '🗝 しろの かぎを てに いれた！ 川の むこうの おしろへ いこう。'
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
