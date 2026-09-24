// ============================================================
// 🌲 まよいの森（rpg.html の クエストの中の ドラクエふう 迷路）
//   ・B1〜B5。迷路は「日付＋階」から作るので、毎日かわる（同じ日なら同じ形）
//   ・十字キー／矢印キーで1マスずつ。ときどき モンスター（クエストの月の問題 2〜3問）
//   ・B3 に いずみ（HP ぜんかいふく）。B5 の奥に もりのぬし（8問）
//   ・メダル：問題はクエストと同じ（はじめて正解した問題は🪙1）。
//     ぬし：その日はじめて たおすと🪙5（<月>|forest:日付）、はじめて たおしたときだけ🪙10（<月>|forest:first）
//     ＋島に「もりの トロフィー」（ena_forest_trophy を書くだけ。島が開いたときに読んで家具にする）
//   rpg.html の bt / save / CHARS / QUESTIONS / renderBattle などを そのまま使う。
// ============================================================
const FOREST_SIZES = [0, 9, 11, 13, 13, 15];   // 階ごとの大きさ（奇数）
const FOREST_FLOORS = 5;
const FOREST_VIEW = 9;                        // 見えるマス（9×9）
const FOREST_ENC_RATE = 0.12, FOREST_ENC_MIN = 5;
const FOREST_BOSS_DAILY = 5, FOREST_BOSS_FIRST = 10;
const FOREST_BOSS_CHAR = 'bear', FOREST_BOSS_NAME = 'もりのぬし ビッグベア';
let fz = null;          // いまの階の迷路 { n, grid, start, goal, spring }
let forestMsg = '';
let forestMapOpen = false;
let forestFromIsland = false;   // 島の こじまから 来た（でるときは 島へ もどる）

// ── 迷路をつくる（シードつき乱数＋穴ほり法）──
function forestSeed(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0 || 1;
}
function forestRand(seed) {
  let x = seed >>> 0 || 1;
  return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
}
function buildForest(day, floor) {
  const n = FOREST_SIZES[floor];
  const rnd = forestRand(forestSeed(day + '#' + floor));
  const grid = new Array(n * n).fill(1);      // 1＝木、0＝みち
  const at = (x, y) => y * n + x;
  const stack = [[1, 1]];
  grid[at(1, 1)] = 0;
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const dirs = [[2, 0], [-2, 0], [0, 2], [0, -2]].filter(([dx, dy]) => {
      const nx = x + dx, ny = y + dy;
      return nx > 0 && ny > 0 && nx < n - 1 && ny < n - 1 && grid[at(nx, ny)] === 1;
    });
    if (!dirs.length) { stack.pop(); continue; }
    const [dx, dy] = dirs[Math.floor(rnd() * dirs.length)];
    grid[at(x + dx / 2, y + dy / 2)] = 0;
    grid[at(x + dx, y + dy)] = 0;
    stack.push([x + dx, y + dy]);
  }
  // スタートから いちばん遠いマス＝かいだん（B5 は ぬし）
  const dist = forestDist(grid, n, 1, 1);
  let goal = [1, 1], far = 0;
  for (let y = 1; y < n - 1; y++) for (let x = 1; x < n - 1; x++) {
    const d = dist[at(x, y)];
    if (d > far) { far = d; goal = [x, y]; }
  }
  // B3：いずみを 行き止まりに（スタート・ゴール以外で、まんなかくらいの遠さ）
  let spring = null;
  if (floor === 3) {
    const ends = [];
    for (let y = 1; y < n - 1; y++) for (let x = 1; x < n - 1; x++) {
      if (grid[at(x, y)] || (x === 1 && y === 1) || (x === goal[0] && y === goal[1])) continue;
      const open = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => grid[at(x + dx, y + dy)] === 0).length;
      if (open === 1) ends.push([x, y, dist[at(x, y)]]);
    }
    ends.sort((a, b) => a[2] - b[2]);
    if (ends.length) spring = ends[Math.floor(ends.length / 2)].slice(0, 2);
  }
  return { n, grid, start: [1, 1], goal, spring };
}
function forestDist(grid, n, sx, sy) {
  const dist = new Array(n * n).fill(-1);
  dist[sy * n + sx] = 0;
  const q = [[sx, sy]];
  while (q.length) {
    const [x, y] = q.shift();
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
      const nx = x + dx, ny = y + dy, i = ny * n + nx;
      if (nx < 0 || ny < 0 || nx >= n || ny >= n || grid[i] || dist[i] >= 0) return;
      dist[i] = dist[y * n + x] + 1;
      q.push([nx, ny]);
    });
  }
  return dist;
}

// ── その日の しんこう（save.forest）──
function forestState() {
  const d = todayKey();
  const old = save.forest || {};
  if (old.day !== d) {
    save.forest = { day: d, floor: 1, x: 1, y: 1, seen: {}, since: 0,
                    bossDay: old.bossDay || '', bossEver: !!old.bossEver };
    persist();
  }
  return save.forest;
}
function forestLoadFloor() {
  const f = forestState();
  fz = buildForest(f.day, f.floor);
  forestReveal();
}
function forestReveal() {
  const f = save.forest, n = fz.n;
  let s = f.seen[f.floor] || '';
  if (s.length !== n * n) s = '0'.repeat(n * n);
  const a = s.split('');
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    const x = f.x + dx, y = f.y + dy;
    if (x >= 0 && y >= 0 && x < n && y < n) a[y * n + x] = '1';
  }
  f.seen[f.floor] = a.join('');
}
function forestSeen(x, y) {
  const s = save.forest.seen[save.forest.floor] || '';
  return s[y * fz.n + x] === '1';
}
function forestTile(x, y) {
  if (x < 0 || y < 0 || x >= fz.n || y >= fz.n) return 'tree';
  if (fz.grid[y * fz.n + x]) return 'tree';
  if (x === fz.goal[0] && y === fz.goal[1]) return save.forest.floor < FOREST_FLOORS ? 'stairs' : 'boss';
  if (fz.spring && x === fz.spring[0] && y === fz.spring[1]) return 'spring';
  return 'path';
}

// ── 画面 ──
function forestMapPanel() {
  const f = save.forest && save.forest.day === todayKey() ? save.forest : null;
  const beat = save.forest && save.forest.bossDay === todayKey();
  return '<div class="panel" style="margin-bottom:11px; background:linear-gradient(135deg,#dcfce7,#bbf7d0);">' +
    '<div style="font-weight:800; font-size:15px;">🌲 まよいの森</div>' +
    '<div style="font-size:11.5px; color:#14532d; margin:3px 0 9px; line-height:1.6;">' +
      'まいにち かたちが かわる 5かいの めいろ。モンスターと もんだいで たたかって、いちばん おくの もりのぬしを めざそう' +
    '</div>' +
    '<button class="btn" onclick="enterForest()" style="text-align:center; background:#fff;">' +
      (f && (f.floor > 1 || f.x !== 1 || f.y !== 1) ? '🌲 つづきから（B' + f.floor + '）' : '🌲 もりに はいる') +
    '</button>' +
    (beat ? '<div style="margin-top:6px; font-size:11.5px; color:#15803d; font-weight:800; text-align:right;">👑 きょうは もりのぬしを たおしたよ！</div>' : '') +
  '</div>';
}

function enterForest() {
  ttPick = false;
  if (save.hp <= 0) save.hp = maxHp();
  forestLoadFloor();
  forestMsg = 'B' + save.forest.floor + '　もりの なかは うすぐらい…';
  forestMapOpen = false;
  persist();
  renderForest();
  showScreen('forest');
}

function renderForest() {
  const root = document.getElementById('forest-root');
  if (!root || !fz) return;
  const f = save.forest, half = (FOREST_VIEW - 1) / 2;
  const ICON = { stairs: '🪜', spring: '⛲', boss: f.bossDay === todayKey() ? '✨' : '👹' };
  let cells = '';
  for (let dy = -half; dy <= half; dy++) for (let dx = -half; dx <= half; dx++) {
    const x = f.x + dx, y = f.y + dy;
    const t = forestTile(x, y);
    const seen = x >= 0 && y >= 0 && x < fz.n && y < fz.n ? forestSeen(x, y) : true;   // 地図の外は ずっと 木
    const me = dx === 0 && dy === 0;
    const bg = !seen && !me ? '#052e16' : t === 'tree' ? '#166534' : t === 'spring' ? '#7dd3fc' : '#86efac';
    const inner = me ? CHARS.luna(Math.min(6, save.lv), 100, 40, {})
      : !seen ? '' : t === 'tree' ? '🌲' : ICON[t] || '';
    cells += '<div class="fz-cell" style="background:' + bg + ';">' + inner + '</div>';
  }
  const hpPct = pct(save.hp, maxHp());
  root.innerHTML =
    '<div class="panel" style="margin-top:14px; padding:11px 14px;">' +
      '<div style="display:flex; justify-content:space-between; align-items:baseline;">' +
        '<b style="font-size:15px;">🌲 まよいの森　B' + f.floor + '</b>' +
        '<span style="font-size:12px; color:#64748b;">ルナ Lv ' + save.lv + '　HP ' + Math.max(0, save.hp) + ' / ' + maxHp() + '</span>' +
      '</div>' +
      '<div class="hpbar" style="margin-top:6px;"><i style="width:' + hpPct + '%; background:linear-gradient(90deg,#22c55e,#4ade80);"></i></div>' +
    '</div>' +
    '<div class="fz-view">' + cells + '</div>' +
    '<div id="forest-msg" class="panel" style="margin-top:8px; padding:10px 14px; min-height:44px; font-weight:700; font-size:14px; color:#14532d;">' + esc(forestMsg) + '</div>' +
    '<div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:10px;">' +
      '<div class="fz-pad">' +
        '<span></span><button onclick="forestMove(0,-1)">▲</button><span></span>' +
        '<button onclick="forestMove(-1,0)">◀</button><span></span><button onclick="forestMove(1,0)">▶</button>' +
        '<span></span><button onclick="forestMove(0,1)">▼</button><span></span>' +
      '</div>' +
      '<div style="display:flex; flex-direction:column; gap:8px; flex:1; max-width:170px;">' +
        '<button class="btn-main" style="background:linear-gradient(135deg,#0ea5e9,#0284c7); box-shadow:none;" onclick="toggleForestMap()">🗺️ ちず</button>' +
        '<button class="btn-main" style="background:rgba(255,255,255,.16); box-shadow:none;" onclick="leaveForest()">' +
          (forestFromIsland ? '🏝 しまに もどる' : '🏃 もりを でる') + '</button>' +
      '</div>' +
    '</div>' +
    (forestMapOpen ? forestMiniMap() : '');
}

function forestMiniMap() {
  const f = save.forest, n = fz.n;
  let cells = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const t = forestTile(x, y), seen = forestSeen(x, y), me = x === f.x && y === f.y;
    const bg = me ? '#ef4444' : !seen ? '#0f172a' : t === 'tree' ? '#166534'
      : t === 'stairs' || t === 'boss' ? '#f59e0b' : t === 'spring' ? '#38bdf8' : '#bbf7d0';
    cells += '<i style="background:' + bg + ';"></i>';
  }
  return '<div class="fz-mapwrap" onclick="toggleForestMap()">' +
    '<div class="panel" style="text-align:center;" onclick="event.stopPropagation()">' +
      '<b>🗺️ B' + f.floor + ' の ちず</b>' +
      '<div class="fz-mini" style="grid-template-columns:repeat(' + n + ',1fr);">' + cells + '</div>' +
      '<div style="font-size:11px; color:#64748b;">🔴 ルナ　🟧 かいだん・ぬし　🟦 いずみ</div>' +
      '<button class="btn-main" style="margin-top:10px;" onclick="toggleForestMap()">とじる</button>' +
    '</div>' +
  '</div>';
}
function toggleForestMap() { forestMapOpen = !forestMapOpen; renderForest(); }
function leaveForest() {
  persist();
  if (forestFromIsland) { location.href = '/game/#island'; return; }
  showMap();
}

// ── あるく ──
function forestMove(dx, dy) {
  if (!fz || !document.getElementById('scr-forest').classList.contains('on') || forestMapOpen) return;
  const f = save.forest;
  const nx = f.x + dx, ny = f.y + dy;
  const t = forestTile(nx, ny);
  if (t === 'tree') { forestMsg = 'きが しげっていて すすめない。'; renderForest(); return; }
  f.x = nx; f.y = ny;
  f.since = (f.since || 0) + 1;
  forestReveal();
  forestMsg = '';
  if (t === 'stairs') {
    f.floor++;
    f.x = 1; f.y = 1; f.since = 0;
    forestLoadFloor();
    forestMsg = '🪜 かいだんを おりた。B' + f.floor + ' に ついた！' + (f.floor === FOREST_FLOORS ? '　この かいの おくに もりのぬしが いる…' : '');
  } else if (t === 'spring') {
    save.hp = maxHp();
    forestMsg = '⛲ いずみの みずを のんだ。HP が ぜんかいふく した！';
  } else if (t === 'boss') {
    if (f.bossDay === todayKey()) forestMsg = '✨ もりのぬしは もう たおしたよ。また あしたの もりで あおう！';
    else { persist(); return startForestBattle(true); }
  } else if (f.since >= FOREST_ENC_MIN && Math.random() < FOREST_ENC_RATE) {
    persist();
    return startForestBattle(false);
  }
  persist();
  renderForest();
}
document.addEventListener('keydown', e => {
  const el = document.getElementById('scr-forest');
  if (!el || !el.classList.contains('on')) return;
  const k = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
  if (!k) return;
  e.preventDefault();
  forestMove(k[0], k[1]);
});

// ── たたかい（rpg.html の戦いを そのまま つかう）──
function startForestBattle(boss) {
  const f = save.forest;
  if (save.hp <= 0) save.hp = maxHp();
  const n = boss ? 8 : 2 + (Math.random() < 0.5 ? 1 : 0);
  const char = boss ? FOREST_BOSS_CHAR : MONSTER_POOL[Math.floor(Math.random() * MONSTER_POOL.length)];
  f.since = 0;
  bt = {
    boss: false, key: '__forest__', char,
    name: boss ? FOREST_BOSS_NAME : 'もりの' + CHAR_NAME[char],
    queue: shuffle(QUESTIONS.slice()).slice(0, n), idx: 0,
    maxHp: n * DMG_HIT, hp: n * DMG_HIT, streak: 0, correct: 0, medals: 0, answered: false,
    tt: null, ttMedals: 0, ttIn: 0, ttAnswered: 0,
    forest: { floor: f.floor, boss: !!boss }
  };
  persist();
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
  const f = save.forest, boss = bt.forest.boss;
  let lvUps = 0, bonus = 0, first = false;
  questLogDay(d => { d.battles++; if (win) d.wins++; });
  if (win) {
    save.exp += boss ? EXP_WIN * 2 : EXP_WIN;
    save.wins++;
    if (boss && f.bossDay !== todayKey()) {
      bonus += medalForest('forest:' + todayKey(), FOREST_BOSS_DAILY);
      f.bossDay = todayKey();
      if (!f.bossEver) {
        bonus += medalForest('forest:first', FOREST_BOSS_FIRST);
        f.bossEver = true;
        first = true;
        try { localStorage.setItem('ena_forest_trophy', '1'); } catch (e) {}
      }
      bt.medals += bonus;
    }
  }
  while (save.exp >= needExp()) { save.exp -= needExp(); save.lv++; lvUps++; }
  if (lvUps) save.hp = maxHp();
  const wiped = save.hp <= 0;
  if (wiped) {                                     // めのまえが まっくらに…→ B1 の入り口へ
    save.hp = Math.max(1, Math.round(maxHp() / 2));
    f.floor = 1; f.x = 1; f.y = 1; f.since = 0;
  }
  persist();

  const art = (sil) => '<div style="margin:12px 0; display:flex; justify-content:center;' + (sil ? ' opacity:.75;' : '') + '">' +
    CHARS[bt.char](6, 100, 130, { silhouette: sil }) + '</div>';
  document.getElementById('result-body').innerHTML =
    (win
      ? '<div style="font-size:21px; font-weight:800; color:#16a34a;">' + (boss ? '👑 もりのぬしを たおした！' : bt.name + ' を やっつけた！') + '</div>' + art(false)
      : wiped
      ? '<div style="font-size:21px; font-weight:800; color:#b91c1c;">めのまえが まっくらに なった…</div>' + art(true) +
        '<div style="font-size:13px; color:#64748b;">もりの いりぐち（B1）に もどされた。HP は はんぶん かいふく。</div>'
      : '<div style="font-size:21px; font-weight:800; color:#b45309;">' + bt.name + ' は にげていった…</div>' + art(true)) +
    '<div style="margin-top:10px; font-size:14px;">せいかい ' + bt.correct + ' / ' + bt.queue.length + '</div>' +
    (bonus ? '<div style="margin-top:6px; font-size:15px; font-weight:800; color:#15803d;">🌲 もりのぬし ボーナス 🪙+' + bonus + '</div>' : '') +
    (first ? '<div style="margin-top:4px; font-size:13px; font-weight:800; color:#b45309;">🏆 しまに「もりの トロフィー」が とどくよ！</div>' : '') +
    '<div style="margin-top:8px; font-size:15px; font-weight:800; color:#b45309;">🪙 アンリノメダル +' + bt.medals + ' 枚' +
      '<div style="font-size:11.5px; color:#94a3b8; font-weight:700; margin-top:3px;">もっているメダル ' + medalTotal() + ' 枚（しまの ショップで つかえるよ）</div>' +
    '</div>';

  forestMsg = win ? (boss ? '👑 もりのぬしを たおした！ きょうの もりは クリア！' : 'モンスターを やっつけた！')
    : wiped ? 'きが ついたら もりの いりぐちに いた…' : 'モンスターは にげていった。';
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
  forestLoadFloor();
  renderForest();
  showScreen('forest');
}
