// ============================================================
// 🎨 アンリノの伝説の 絵（画像ファイルは つかわず、ぜんぶ コードで 描く）
//   ・shade()：文字の表や 図形に、左上から 光を あてて 5段階の かげを 自動で つける
//   ・モチーフは「海と灯台」：青海波の ゆか・しんちゅうの かざり・貝がらの もよう
// ============================================================
const Art = (() => {
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const R = (g, c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const flip = src => { const c = mk(src.width, src.height), g = c.getContext('2d'); g.translate(src.width, 0); g.scale(-1, 1); g.drawImage(src, 0, 0); return c; };
  const noise = (x, y, s) => { const n = Math.sin(x * 127.1 + y * 311.7 + (s || 0) * 74.7) * 43758.5453; return n - Math.floor(n); };
  const LINE = '#181a36';

  // 色の だん（くらい → あかるい）
  const C = {
    blue: ['#1f4f8f', '#2f78bb', '#55a9e0', '#8bd4f4', '#d2f3ff'],
    sky: ['#3a7fb5', '#5fa9d6', '#8dcfee', '#b9e7f8', '#ecfbff'],
    yel: ['#c9812d', '#e8a93f', '#fbd062', '#ffe68e', '#fff8cf'],
    grn: ['#25602f', '#3a8440', '#5cab52', '#8ccd6c', '#c5eb94'],
    teal: ['#17645f', '#22908a', '#3dbdb0', '#74e0cf', '#c1f8ea'],
    org: ['#a44f1f', '#d3752f', '#f49d4f', '#fbc27c', '#ffe6bc'],
    crm: ['#c8a875', '#e4cda0', '#f6e6c4', '#fff5e0', '#ffffff'],
    wood: ['#4f2f18', '#74482a', '#9a6a3c', '#c29155', '#e6bd80'],
    stone: ['#3e4160', '#5e6184', '#8488a8', '#afb2cb', '#dcdeea'],
    sand: ['#7a6a4f', '#a08c68', '#c4af87', '#dfcfa8', '#f3e8cb'],
    iron: ['#262a45', '#3c4166', '#5d648f', '#8b92b8', '#c8cde4'],
    gold: ['#8d5a14', '#c08a22', '#efbd3b', '#ffe07a', '#fff7c6'],
    red: ['#7f1f33', '#b5324a', '#e0556a', '#f5888f', '#ffc7c4'],
    shad: ['#1a1038', '#2c1b58', '#452d80', '#6a4cb0', '#a88ae0'],
    deep: ['#100a26', '#1d1340', '#302062', '#4a3390', '#7a5fc8'],
    pink: ['#b0506a', '#d9758a', '#f3a0ab', '#ffc7c8', '#fff0ea'],
    gray: ['#4b5569', '#6b7a90', '#93a5b8', '#bccbd9', '#e8f0f6'],
    wht: ['#a9a6c6', '#c8c6de', '#e3e2f0', '#f6f5fb', '#ffffff'],
    leaf: ['#123f33', '#1b5e43', '#2a8155', '#4aa768', '#88cf85'],
    leaf2: ['#1b5e43', '#2a8155', '#46a366', '#74c67d', '#b5e69a'],
    moss: ['#2b5f33', '#3c8240', '#5ea551', '#8dc865', '#c0e68a'],
  };

  // ── かげを つける ──
  function shade(grid, mats, outline) {
    const h = grid.length, w = Math.max(...grid.map(r => r.length));
    const m = outline === null ? 0 : 1;
    const c = mk(w + m * 2, h + m * 2), g = c.getContext('2d');
    const at = (x, y) => (grid[y] && grid[y][x]) || '.';
    const filled = (x, y) => { const k = at(x, y); return k !== '.' && k !== ' '; };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const k = at(x, y); if (!filled(x, y)) continue;
      const mat = mats[k]; if (!mat) continue;
      if (typeof mat === 'string') { R(g, mat, x + m, y + m, 1, 1); continue; }
      let v = (mat.length - 1) / 2;
      for (let r = 1; r <= 3; r++) if (at(x - r, y) !== k || at(x, y - r) !== k) { v += (4 - r) * .55; break; }
      for (let r = 1; r <= 3; r++) if (at(x + r, y) !== k || at(x, y + r) !== k) { v -= (4 - r) * .55; break; }
      R(g, mat[Math.max(0, Math.min(mat.length - 1, Math.round(v)))], x + m, y + m, 1, 1);
    }
    if (m) {
      g.fillStyle = outline || LINE;
      for (let y = -1; y <= h; y++) for (let x = -1; x <= w; x++) {
        if (filled(x, y)) continue;
        if (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1)) g.fillRect(x + 1, y + 1, 1, 1);
      }
    }
    return c;
  }
  // 図形で 描いて shade する
  function paint(w, h, fn, mats, outline) {
    const grid = Array.from({ length: h }, () => Array(w).fill('.'));
    const put = (x, y, k) => { x = Math.round(x); y = Math.round(y); if (grid[y] && x >= 0 && x < w) grid[y][x] = k; };
    fn({
      put,
      rect(x, y, rw, rh, k) { for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) put(x + i, y + j, k); },
      ell(cx, cy, rx, ry, k) { for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) put(x, y, k); },
      line(x0, y0, x1, y1, t, k) { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0)) || 1; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n; for (let a = 0; a < t; a++) for (let b = 0; b < t; b++) put(x + a, y + b, k); } },
    });
    return shade(grid, mats, outline);
  }
  const rows = (r, mats, outline) => shade(r.map(s => s.split('')), mats, outline);

  // ── 🐾 アンリノ（青い 毛・黄色い かお・みどりの かばん・ちいさな つばさ）──
  const SKIN = ['#e8b24a', '#f7cf6a', '#ffe08a', '#ffeaa6', '#fff3c4'];
  const HM = { b: C.blue, y: SKIN, o: SKIN, g: C.grn, G: C.grn, h: C.yel, s: C.teal, c: C.sky, e: '#20213f', w: '#ffffff', p: '#f79a9a', n: '#6b3326', m: '#d9605f' };
  const heroD = [
    '.....b.bb.......',
    '......bbbb......',
    '....bbbbbbbb....',
    '...bbbbbbbbbb...',
    '.bbbbbbbbbbbbbb.',
    'bbbbbbbbbbbbbbbb',
    'oobbbyyyyyybbboo',
    'oobbyyyyyyyybboo',
    'oobbyewyyewybboo',
    '.oobyeeyyeeybbo.',
    '..obpyynnyypbo..',
    '....byymmyyb....',
    '.....yyyyyy.....',
    '...bbgyyyybb....',
    '..bb.bgyyybb.h..',
    '..yy.bbgyybyyh..',
    '.....bbbgGGh....',
    '.....bbyGGG.....',
  ];
  const heroU = [
    '.....b.bb.......',
    '......bbbb......',
    '....bbbbbbbb....',
    '...bbbbbbbbbb...',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '.bbbbbbbbbbbbbb.',
    'oobbbbbbbbbbbboo',
    'oobbbbbbbbbbbboo',
    'oobbbbbbbbbbbboo',
    '.oobbbbbbbbbboo.',
    '...bbbbbbbbbb...',
    '.....bbbbbb.....',
    'cc..bbggbbb...cc',
    'ccc.bbbggbb..ccc',
    '.ccbbbbbggbbbcc.',
    '..c..bbbbgg..c..',
    '.....bbbbbGG....',
  ];
  const heroR = [
    '......b.bb......',
    '.......bbbb.....',
    '.....bbbbbbbb...',
    '...bbbbbbbbbbb..',
    '..bbbbbbbbbbbbb.',
    '.bbbbbbbbyyyyyy.',
    '.bbbbbbyyyyyyyy.',
    'bbbooobyyyyewyyy',
    'bboooobyyyyeeyyy',
    'bbooooyyyyyeeynn',
    '.oooo.yypyyyyyy.',
    '.ooo...yyyyymm..',
    '.......yyyyyy...',
    '...cc.bbgyyb....',
    '..cccbbggyyb....',
    '..cc.bggyyyb....',
    '.....GGGbyyb....',
    '.....GGGbbbb....',
  ];
  const FEET = [['....sss..sss....', '....sss..sss....'], ['...sss...sss....', '.........sss....'], ['....sss...sss...', '....sss.........']];
  const heroFrames = { d: [], u: [], r: [] };
  [['d', heroD], ['u', heroU], ['r', heroR]].forEach(([k, base]) => FEET.forEach(f => heroFrames[k].push(rows(base.concat(f), HM))));
  heroFrames.l = heroFrames.r.map(flip);

  // ── 🦊 コロン ──
  const colon = rows([
    '.o........o.',
    'opo......opo',
    'oppo....oppo',
    'oooo....oooo',
    '.oooooooooo.',
    'oooooooooooo',
    'ccccoooocccc',
    '.ccekccekcc.',
    '..cccnnccc..',
    '...cccccc...',
    '...oooooo...',
    '..oooooooo..',
    '..oo.oo.oo..',
  ], { o: C.org, c: C.crm, p: C.pink, e: '#2a1a10', k: '#ffffff', n: '#5b3a24' }, '#4a2d1a');
  const colonL = flip(colon);

  // ── 村の ひとびと ──
  const NPC = {
    turtle: rows([
      '.....GGGGGG.....', '....GGGGGGGG....', '....GeGGGGeG....', '....GGGGGGGG....', '.....GnnnnG.....',
      '...wwwwwwwwww...', '..wAAwAAAwAAw...', '.wAAAwAAAwAAAw..', '.wwwwwwwwwwwww..', '.wAAAwAAAwAAAw..',
      '..wAAwAAAwAAw...', '...wwwwwwwwww...', '..GGG.....GGG...', '..GGG.....GGG...'],
      { G: C.moss, e: '#14182c', n: '#27502c', A: C.wood, w: C.sand }),
    seal: rows([
      '.....ssssss.....', '....ssssssss....', '...ssssssssss...', '...sesssssses...', '...ssswnnwsss...', '....sswwwwss....',
      '...RRRRRRRRRR...', '..ssRRRRRRRRss..', '.sss.ssssss.sss.', '.ss.ssssssss.ss.', '...ssssssssss...', '...ssssssssss...',
      '....ssssssss....', '.....ssssss.....'],
      { s: C.gray, e: '#10131f', w: C.wht, n: '#2d3748', R: C.red }),
    rabbit: rows([
      '.....ww..ww.....', '....wppwwppw....', '....wppwwppw....', '....wppwwppw....', '....wwwwwwww....', '...wwwwwwwwww...',
      '...wweewweeww...', '...wwwwppwwww...', '....wwwwwwww....', '....YYYYYYYY....', '...wYYYYYYYYw...', '....YYYYYYYY....',
      '....ww....ww....', '....ww....ww....'],
      { w: C.wht, p: C.pink, e: '#2a2140', Y: C.yel }),
    cat: rows([
      '...o........o...', '..ooo......ooo..', '..oooooooooooo..', '..oooooooooooo..', '..oeeooooooeeo..', '..ooooonnooooo..',
      '...oooooooooo...', '...wwwwwwwwww...', '..owwWWWWWWwwo..', '...WWWWWWWWWW...', '...WWWWWWWWWW...', '...WWWWWWWWWW...',
      '....oo....oo....', '....oo....oo....'],
      { o: C.org, e: '#1b1730', n: '#b35060', w: C.wht, W: C.sky }),
  };

  // ── かげモンスター ──
  const SM = { d: C.shad, D: C.deep, l: C.sky, e: '#ffe9a0', E: '#ff9d5c', k: '#0c0820', r: '#ff7f96', w: '#ffffff', g: C.gold, s: C.pink, S: C.iron, m: C.teal };
  const slime = [0, 1].map(f => paint(18, 16, p => {
    const sq = f ? 1 : 0;
    p.ell(9, 10 + sq, 8 + sq, 5.6 - sq, 'd');
    p.ell(9, 6.5 + sq * 1.6, 5.8 + sq, 5.2 - sq, 'd');
    p.rect(1 - sq, 13, 16 + sq * 2, 2, 'd');
    p.put(4, 15, 'd'); p.put(9, 15, 'd'); p.put(14, 15, 'd');
    p.rect(5, 6 + sq, 3, 3, 'e'); p.rect(11, 6 + sq, 3, 3, 'e'); p.put(6, 7 + sq, 'k'); p.put(12, 7 + sq, 'k');
    p.rect(8, 11 + sq, 3, 1, 'k');
    p.rect(5, 3 + sq, 2, 1, 'w');
  }, SM));
  const bat = [0, 1].map(f => paint(22, 16, p => {
    const up = f === 0;
    p.ell(11, 7, 4.6, 5, 'd');
    p.line(3, 4, 7, 2, 2, 'd'); p.line(11, 2, 8, 0, 1, 'd'); p.line(11, 2, 14, 0, 1, 'd');
    if (up) { p.line(7, 7, 1, 1, 3, 'D'); p.line(14, 7, 20, 1, 3, 'D'); p.line(1, 2, 2, 9, 2, 'D'); p.line(20, 2, 19, 9, 2, 'D'); p.line(4, 4, 6, 10, 2, 'D'); p.line(17, 4, 15, 10, 2, 'D'); }
    else { p.line(7, 7, 1, 11, 3, 'D'); p.line(14, 7, 20, 11, 3, 'D'); p.line(1, 11, 3, 14, 2, 'D'); p.line(20, 11, 18, 14, 2, 'D'); p.line(5, 9, 7, 13, 2, 'D'); p.line(16, 9, 14, 13, 2, 'D'); }
    p.rect(8, 5, 2, 2, 'e'); p.rect(12, 5, 2, 2, 'e');
    p.put(9, 9, 'w'); p.put(12, 9, 'w');
    p.rect(9, 8, 4, 1, 'k');
  }, SM));
  const crab = [0, 1].map(f => paint(22, 15, p => {
    p.ell(11, 9, 7.5, 5, 'd');
    p.rect(5, 12, 12, 1, 'D');
    p.ell(3 - f, 4 + f, 3, 3, 'd'); p.ell(18 + f, 4 + f, 3, 3, 'd');
    p.put(3 - f, 3 + f, 'k'); p.put(18 + f, 3 + f, 'k');
    p.line(5, 7, 4, 6, 1, 'D'); p.line(16, 7, 17, 6, 1, 'D');
    p.rect(8, 3, 1, 4, 'D'); p.rect(13, 3, 1, 4, 'D'); p.rect(7, 2, 3, 2, 'e'); p.rect(12, 2, 3, 2, 'e');
    p.put(8, 3, 'k'); p.put(13, 3, 'k');
    p.rect(9, 11, 4, 1, 'k');
    [4, 7, 14, 17].forEach((x, i) => p.line(x, 13, x + (i < 2 ? -1 : 1), 14 - ((i + f) % 2), 1, 'D'));
  }, SM));
  // かげの 番兵：フードの 影が、大きな 貝の たてを かかえる（2コマ）
  const guard = [0, 1].map(f => paint(26, 30, p => {
    p.ell(13, 18, 8, 9, 'd');
    p.rect(5, 18, 16, 8, 'd');
    p.rect(5 + f, 26, 6, 3, 'D'); p.rect(15 - f, 26, 6, 3, 'D');
    p.ell(13, 8, 7.5, 7.5, 'D');
    p.line(13, 1, 13, 0, 2, 'D');
    p.ell(13, 9, 4.8, 4.2, 'k');
    p.rect(10, 8, 2, 2, 'E'); p.rect(15, 8, 2, 2, 'E'); p.put(10, 8, 'e'); p.put(15, 8, 'e');
    // 帯と かざり
    p.rect(6, 19, 14, 2, 'g'); p.rect(12, 18, 3, 4, 'g');
    // 腕とヤリ
    p.ell(22, 17, 2.4, 2.8, 'd');
    p.line(23, 3, 23, 27, 2, 'S'); p.rect(22, 0, 4, 3, 'g');
    p.ell(3.5, 17, 2.6, 2.8, 'd');
  }, SM));

  // ── アイテムの 絵 ──
  const IM = { b: C.blue, w: '#ffffff', y: C.gold, k: '#3a2606', p: C.pink, c: C.teal, h: C.wht, O: C.blue, s: C.yel, e: '#163a66', D: C.org };
  const drop = rows(['...bb...', '...bb...', '..bbbb..', '.bwbbbb.', '.bwbbbb.', 'bbbbbbbb', 'bbbbbbbb', '.bbbbbb.', '..bbbb..'], IM, '#0d2a55');
  const dropHalf = rows(['...ee...', '...ee...', '..eeee..', '.eeeeee.', '.eeeeee.', 'bbbbbbbb', 'bbbbbbbb', '.bbbbbb.', '..bbbb..'], { b: C.blue, e: '#1c2a4a' }, '#0d2a55');
  const dropEmpty = rows(['...ee...', '...ee...', '..eeee..', '.eeeeee.', '.eeeeee.', 'eeeeeeee', 'eeeeeeee', '.eeeeee.', '..eeee..'], { e: '#1c2a4a' }, '#3b4570');
  const shell = rows(['..pppp..', '.pwpwpw.', 'ppwpwpwp', 'pwpwpwpw', 'ppwpwpwp', '.ppwpwp.', '..pppp..'], { p: C.pink, w: C.wht }, '#6e3247');
  const key = rows(['.yyy....', 'yy.yy...', 'yy.yy...', '.yyyyyyy', '....y.yy', '....y..y'], IM, '#4a3008');
  const bigkey = rows(['..DDDDD.....', '.DD...DD....', 'DD..y..DD...', 'DD.yyy.DD...', 'DD..y..DD...', '.DD...DDDDDD', '..DDDDDDDDDD', '.......DD.DD', '.......DD.DD'], IM, '#4a1f08');
  const jar = rows(['...hhhh...', '..cccccc..', '...cccc...', '..cccccc..', '.cccccccc.', 'cccchhcccc', 'ccchcchccc', 'ccchhhhccc', 'cccccccccc', '.cccccccc.', '..cccccc..'], IM, '#0e3b48');
  const staff = rows(['......s.', '.....sss', '.....sss', '....OOs.', '...OO...', '..OO....', '.OO.....', 'OO......'], IM, '#3a2606');
  const cont = rows(['.....bb.....', '....bbbb....', '....bbbb....', '...bwbbbb...', '..bwwbbbbb..', '.bwwbbbbbbb.', 'bbwbbbbbbbbb', 'bbbbbbbbbbbb', 'bbbbbbbbbbbb', '.bbbbbbbbbb.', '..bbbbbbbb..'], IM, '#0d2a55');
  const ICON = { drop, dropHalf, dropEmpty, shell, key, big: bigkey, jar, staff, cont };

  // ── 地面 ──
  // 🌊 青海波（ゆか）。うろこのように かさねて 16×16 で つながる
  const SEI = (() => {
    const c = mk(16, 16), g = c.getContext('2d');
    R(g, '#34566e', 0, 0, 16, 16);
    for (let row = -1; row <= 5; row++) for (let i = -1; i <= 2; i++) {
      const cx = i * 16 + (row % 2 ? 8 : 0), cy = row * 4 + 8;
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        const d = Math.hypot(x + .5 - cx, y + .5 - cy);
        if (d > 8.2 || y + .5 > cy) continue;
        R(g, d > 7.2 ? '#223c52' : d > 5.8 ? '#477084' : d > 4.6 ? '#34566e' : d > 3.2 ? '#3f6579' : d > 2 ? '#2d4e64' : '#3f6579', x, y, 1, 1);
      }
    }
    return c;
  })();
  function grass(g, X, Y, cx, cy) {
    R(g, '#6dbf5f', X, Y, 16, 16);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const wx = cx * 16 + x, wy = cy * 16 + y;
      const low = Math.sin(wx * .17 + wy * .09) + Math.sin(wx * .06 - wy * .21);
      if (low > .75 && (x + y) % 2 === 0) R(g, '#7fcc69', X + x, Y + y, 1, 1);
      else if (low < -.85 && (x + y) % 2 === 0) R(g, '#5cae55', X + x, Y + y, 1, 1);
    }
    for (let i = 0; i < 4; i++) {
      const a = noise(cx, cy, i), b = noise(cy, cx, i + 9), x = X + 1 + Math.floor(a * 13), y = Y + 2 + Math.floor(b * 12);
      R(g, '#4a9c4f', x, y, 1, 2); R(g, '#4a9c4f', x + 2, y, 1, 2); R(g, '#8fd878', x + 1, y - 1, 1, 2);
    }
  }
  const isGrass = c => c === '.' || c === ',' || c === 'T' || c === 'B';
  function fringe(g, X, Y, cx, cy, near) {     // すなや みちに 草が かかる
    const col = '#6dbf5f', dk = '#4a9c4f';
    for (let i = 0; i < 16; i++) {
      const n = 1 + Math.floor(noise(cx * 16 + i, cy, 3) * 3);
      if (isGrass(near(0, -1))) { R(g, col, X + i, Y, 1, n); R(g, dk, X + i, Y + n, 1, 1); }
      if (isGrass(near(0, 1))) { R(g, col, X + i, Y + 16 - n, 1, n); R(g, '#b79f6e', X + i, Y + 15 - n, 1, 1); }
      if (isGrass(near(-1, 0))) { R(g, col, X, Y + i, n, 1); R(g, dk, X + n, Y + i, 1, 1); }
      if (isGrass(near(1, 0))) { R(g, col, X + 16 - n, Y + i, n, 1); R(g, dk, X + 15 - n, Y + i, 1, 1); }
    }
  }
  const TREE = paint(22, 24, p => {
    p.rect(9, 17, 5, 6, 't');
    p.ell(11, 10, 10, 8.6, 'l');
    p.ell(6, 12, 5, 4.6, 'l'); p.ell(16, 12, 5, 4.6, 'l');
    p.ell(7.5, 6.5, 4.6, 4, 'm'); p.ell(14.5, 7.5, 4.6, 3.6, 'm'); p.ell(11, 12.5, 4.8, 3.4, 'm'); p.ell(4.5, 12, 2.8, 2.4, 'm'); p.ell(17.5, 12.5, 2.8, 2.4, 'm');
  }, { t: C.wood, l: C.leaf, m: C.leaf2 }, '#0d2b24');
  const PALM = paint(22, 24, p => {
    p.line(11, 8, 10, 22, 3, 't');
    for (const [a, b] of [[1, 8], [21, 8], [3, 3], [19, 3], [11, 0], [0, 12], [21, 13]]) p.line(11, 7, a, b, 2, 'l');
    p.ell(11, 8, 3, 2.4, 'c');
  }, { t: C.wood, l: C.leaf2, c: C.wood }, '#0d2b24');
  const BUSH = paint(16, 14, p => {
    p.ell(8, 8, 7.6, 5.6, 'l'); p.ell(4, 6.5, 3.4, 3.2, 'm'); p.ell(10.5, 5, 3.6, 3.2, 'm'); p.ell(7, 10.5, 3, 2.2, 'm');
    p.rect(12, 8, 2, 2, 'r'); p.rect(3, 10, 2, 2, 'r'); p.rect(8, 3, 2, 2, 'r');
  }, { l: C.leaf, m: C.moss, r: C.red }, '#123227');

  function tile(g, ch, cx, cy, at) {
    const X = cx * 16, Y = cy * 16;
    const near = (dx, dy) => at(cx + dx, cy + dy);
    switch (ch) {
      case '.': grass(g, X, Y, cx, cy); break;
      case ',': grass(g, X, Y, cx, cy);
        [[3, 4, '#ffffff', '#f7c948'], [10, 9, '#ffc1d0', '#fff2b0'], [12, 3, '#ffe28a', '#e98a3c']].forEach(([x, y, a, b]) => { R(g, a, X + x - 1, Y + y, 3, 1); R(g, a, X + x, Y + y - 1, 1, 3); R(g, b, X + x, Y + y, 1, 1); R(g, '#3f8d48', X + x, Y + y + 2, 1, 2); });
        break;
      case ':': case 'Y': R(g, '#efdba6', X, Y, 16, 16);
        for (let i = 0; i < 12; i++) { const x = Math.floor(noise(cx, cy, i) * 15), y = Math.floor(noise(cy, cx, i) * 15); R(g, i % 3 ? '#dcc48c' : '#fbf0cb', X + x, Y + y, 1, 1); }
        for (let i = 0; i < 2; i++) { const y = 3 + Math.floor(noise(cx, cy, i + 20) * 10), x = Math.floor(noise(cy, cx, i + 30) * 8); R(g, '#e0ca94', X + x, Y + y, 6, 1); }
        fringe(g, X, Y, cx, cy, near);
        if (ch === 'Y') g.drawImage(PALM, X - 4, Y - 10);
        break;
      case '=': R(g, '#dfbf85', X, Y, 16, 16);
        for (let i = 0; i < 9; i++) { const x = Math.floor(noise(cx, cy, i) * 14), y = Math.floor(noise(cy, cx, i) * 14); R(g, i % 2 ? '#c6a26b' : '#efd7a2', X + x, Y + y, 2, 1); }
        fringe(g, X, Y, cx, cy, near);
        break;
      case 'W': case 'L': {
        const land = c => c !== 'W' && c !== undefined && c !== 'L';
        const lands = [];
        for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) if (land(near(dx, dy))) lands.push([X + dx * 16, Y + dy * 16]);
        for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
          const px = X + x, py = Y + y;
          let d = 99;
          for (const [lx, ly] of lands) { const ax = Math.max(lx - px, 0, px - lx - 15), ay = Math.max(ly - py, 0, py - ly - 15); d = Math.min(d, Math.hypot(ax, ay)); }
          d += Math.sin(px * .4 + py * .23) * 3 + Math.sin(py * .31 - px * .13) * 2;   // 岸の 線を ゆらす
          const dith = (px + py) % 2 === 0;
          R(g, d < 7 ? '#5cc2e4' : d < 11 ? (dith ? '#5cc2e4' : '#46a9dc') : d < 18 ? '#46a9dc' : d < 23 ? (dith ? '#46a9dc' : '#3593d3') : d < 34 ? '#3593d3' : d < 40 ? (dith ? '#3593d3' : '#2a7fc4') : '#2a7fc4', px, py, 1, 1);
        }
        for (let i = 0; i < 16; i++) {
          const w = 2 + Math.floor(noise(cx * 16 + i, cy, 5) * 2);
          if (land(near(0, -1))) { R(g, '#f2fcff', X + i, Y, 1, w); R(g, '#a8e4f3', X + i, Y + w, 1, 1); }
          if (land(near(0, 1))) { R(g, '#a8e4f3', X + i, Y + 15, 1, 1); }
          if (land(near(-1, 0))) { R(g, '#f2fcff', X, Y + i, w - 1, 1); R(g, '#a8e4f3', X + w - 1, Y + i, 1, 1); }
          if (land(near(1, 0))) { R(g, '#f2fcff', X + 17 - w, Y + i, w - 1, 1); R(g, '#a8e4f3', X + 16 - w, Y + i, 1, 1); }
        }
      } break;
      case 'T': grass(g, X, Y, cx, cy); R(g, 'rgba(10,50,40,.35)', X + 1, Y + 11, 15, 5); g.drawImage(TREE, X - 4, Y - 9); break;
      case 'B': grass(g, X, Y, cx, cy); R(g, 'rgba(10,50,40,.3)', X + 1, Y + 12, 14, 4); g.drawImage(BUSH, X - 1, Y); break;
      case 'R': {
        const south = near(0, 1), faceS = south !== 'R';
        R(g, '#8e8fa8', X, Y, 16, 16);
        for (let i = 0; i < 12; i++) { const x = Math.floor(noise(cx, cy, i) * 15), y = Math.floor(noise(cy, cx, i) * 15); R(g, i % 2 ? '#a5a6bd' : '#7a7b96', X + x, Y + y, 2, 1); }
        if (near(0, -1) !== 'R') R(g, '#c5c6d8', X, Y, 16, 2);
        if (near(-1, 0) !== 'R' && near(-1, 0) !== undefined) R(g, '#b0b1c6', X, Y, 2, 16);
        if (near(1, 0) !== 'R' && near(1, 0) !== undefined) R(g, '#5e5f7c', X + 14, Y, 2, 16);
        if (faceS) {
          R(g, '#5e5f7c', X, Y + 6, 16, 10); R(g, '#c5c6d8', X, Y + 5, 16, 1); R(g, '#7a7b96', X, Y + 7, 16, 2);
          for (let i = 0; i < 4; i++) { const x = 1 + Math.floor(noise(cx, cy, i + 40) * 14); R(g, '#3e3f5c', X + x, Y + 8, 1, 6 + (i % 2)); R(g, '#7a7b96', X + x + 1, Y + 8, 1, 4); }
          R(g, '#3e3f5c', X, Y + 15, 16, 1);
        }
      } break;
      case '^': {
        const top = near(0, -1) !== '^', bottom = near(0, 1) !== '^', left = near(-1, 0) !== '^', right = near(1, 0) !== '^';
        R(g, '#d85f4e', X, Y, 16, 16);
        for (let r = 0; r < 4; r++) for (let i = -1; i < 4; i++) {
          const x = X + i * 5 + (r % 2 ? 2 : 0), y = Y + r * 4;
          R(g, '#ec7c66', x, y, 4, 2); R(g, '#c44c3e', x, y + 2, 4, 1); R(g, '#a23a33', x + 4, y, 1, 4); R(g, '#f7a389', x, y, 3, 1);
        }
        if (top) { R(g, '#f7a389', X, Y, 16, 2); R(g, '#a23a33', X, Y + 2, 16, 1); }
        if (bottom) { R(g, '#a23a33', X, Y + 13, 16, 2); R(g, '#6e2626', X, Y + 15, 16, 1); }
        if (left) R(g, '#f7a389', X, Y, 1, 16);
        if (right) R(g, '#8d3030', X + 15, Y, 1, 16);
      } break;
      case 'H': case 'D': {
        R(g, '#f5ead0', X, Y, 16, 16); R(g, 'rgba(90,50,40,.3)', X, Y, 16, 3);
        for (let i = 0; i < 6; i++) R(g, '#e5d6b5', X + Math.floor(noise(cx, cy, i) * 15), Y + 4 + Math.floor(noise(cy, cx, i) * 10), 2, 1);
        R(g, '#7f5a34', X, Y + 13, 16, 3); R(g, '#a77b4c', X, Y + 13, 16, 1);
        if (near(-1, 0) !== 'H' && near(-1, 0) !== 'D') R(g, '#7f5a34', X, Y, 2, 16);
        if (near(1, 0) !== 'H' && near(1, 0) !== 'D') R(g, '#5f4226', X + 14, Y, 2, 16);
        if (ch === 'H') {
          R(g, '#5f4226', X + 3, Y + 3, 10, 8); R(g, '#7fc7e6', X + 4, Y + 4, 8, 6); R(g, '#cdf0fa', X + 4, Y + 4, 3, 2); R(g, '#5f4226', X + 7, Y + 4, 2, 6); R(g, '#5f4226', X + 4, Y + 6, 8, 1);
          R(g, '#a77b4c', X + 2, Y + 11, 12, 2); [4, 7, 10].forEach(x => { R(g, '#e0556a', X + x, Y + 10, 2, 1); R(g, '#5cab52', X + x, Y + 11, 2, 1); });
        } else {
          R(g, '#5f4226', X + 1, Y + 2, 14, 14); R(g, '#3a2615', X + 2, Y + 3, 12, 13); R(g, '#74482a', X + 3, Y + 4, 10, 12);
          for (let i = 3; i < 13; i += 3) R(g, '#4f2f18', X + i, Y + 4, 1, 12);
          R(g, '#efbd3b', X + 10, Y + 10, 2, 2);
          R(g, '#c4af87', X + 1, Y + 15, 14, 1);
        }
      } break;
      case 'C': { R(g, '#8e8fa8', X, Y, 16, 16); R(g, '#5e5f7c', X, Y + 2, 16, 14); R(g, '#c5c6d8', X, Y + 1, 16, 1); R(g, '#0d0b1e', X + 2, Y + 4, 12, 12); R(g, '#0d0b1e', X + 4, Y + 2, 8, 2); R(g, '#3e3f5c', X + 1, Y + 4, 1, 12); R(g, '#3e3f5c', X + 14, Y + 4, 1, 12); } break;
      case 'K': R(g, '#a77b4c', X, Y, 16, 16); for (let i = 0; i < 16; i += 4) { R(g, '#c29155', X, Y + i, 16, 1); R(g, '#6e4a2a', X, Y + i + 3, 16, 1); } R(g, '#4f2f18', X, Y, 1, 16); R(g, '#4f2f18', X + 15, Y, 1, 16); [2, 13].forEach(x => { R(g, '#3a2615', X + x, Y + 1, 1, 1); R(g, '#3a2615', X + x, Y + 9, 1, 1); }); break;
      // ─ いえの 中 ─
      case 'I': {
        R(g, '#6e4a2a', X, Y, 16, 16); R(g, '#4f2f18', X, Y, 16, 1);
        const below = near(0, 1);
        if (below && below !== 'I') { R(g, '#b98c5a', X, Y + 2, 16, 12); for (let i = 0; i < 16; i += 5) R(g, '#8a6238', X + i, Y + 2, 1, 12); R(g, '#e6bd80', X, Y + 2, 16, 1); R(g, '#4f2f18', X, Y + 14, 16, 2); }
      } break;
      case 'w': case 't': {
        R(g, '#d9b687', X, Y, 16, 16); R(g, '#c4a06f', X, Y + 7, 16, 1); R(g, '#c4a06f', X, Y + 15, 16, 1); R(g, '#eccda0', X, Y, 16, 1); R(g, '#c4a06f', X + (cy % 2 ? 4 : 11), Y, 1, 7); R(g, '#c4a06f', X + (cy % 2 ? 11 : 4), Y + 8, 1, 7);
        if (near(0, -1) === 'I') R(g, 'rgba(60,30,20,.3)', X, Y, 16, 4);
        if (ch === 't') { R(g, 'rgba(60,30,20,.35)', X + 1, Y + 11, 14, 4); R(g, '#4f2f18', X + 1, Y + 2, 14, 11); R(g, '#a77b4c', X + 2, Y + 3, 12, 6); R(g, '#c29155', X + 2, Y + 3, 12, 1); R(g, '#74482a', X + 2, Y + 9, 12, 3); R(g, '#f7ecd4', X + 5, Y + 4, 6, 3); R(g, '#e0556a', X + 7, Y + 5, 2, 1); }
      } break;
      // ─ 灯台の 中 ─
      case 'X': wall(g, X, Y, cx, cy, near); break;
      case 'f': floor(g, X, Y, cx, cy, near, at); break;
      case 'a': { floor(g, X, Y, cx, cy, near, at);
        R(g, 'rgba(5,10,30,.42)', X + 1, Y + 11, 15, 5);
        R(g, LINE, X + 2, Y - 3, 12, 18); R(g, '#5d648f', X + 3, Y - 2, 10, 16); R(g, '#8b92b8', X + 3, Y - 2, 3, 16); R(g, '#3c4166', X + 10, Y - 2, 3, 16);
        R(g, '#efbd3b', X + 3, Y + 1, 10, 2); R(g, '#fff7c6', X + 3, Y + 1, 4, 1); R(g, '#8d5a14', X + 3, Y + 3, 10, 1);
        R(g, '#efbd3b', X + 3, Y + 10, 10, 2); R(g, '#8d5a14', X + 3, Y + 12, 10, 1);
        R(g, '#74e0cf', X + 6, Y + 5, 4, 3); R(g, '#c1f8ea', X + 6, Y + 5, 2, 1);
      } break;
      case 'P': {
        R(g, '#05060f', X, Y, 16, 16);
        const up = near(0, -1), lf = near(-1, 0), rt = near(1, 0), dn = near(0, 1), solid = c => c !== 'P' && c !== undefined;
        if (solid(up)) { R(g, '#223c52', X, Y, 16, 2); R(g, '#16283a', X, Y + 2, 16, 3); R(g, '#0c1522', X, Y + 5, 16, 3); }
        if (solid(lf)) { R(g, '#16283a', X, Y, 2, 16); R(g, '#0c1522', X + 2, Y, 1, 16); }
        if (solid(rt)) { R(g, '#16283a', X + 14, Y, 2, 16); R(g, '#0c1522', X + 13, Y, 1, 16); }
        if (solid(dn)) R(g, '#5a7a8c', X, Y + 15, 16, 1);
      } break;
      case 'U': { R(g, '#05060f', X, Y, 16, 16); R(g, '#9a6a3c', X + 1, Y, 14, 16); for (let i = 0; i < 16; i += 4) { R(g, '#c29155', X + 1, Y + i, 14, 1); R(g, '#5f4226', X + 1, Y + i + 3, 14, 1); } R(g, '#efbd3b', X, Y, 2, 16); R(g, '#efbd3b', X + 14, Y, 2, 16); R(g, '#8d5a14', X + 1, Y, 1, 16); R(g, '#8d5a14', X + 15, Y, 1, 16); } break;
      default: R(g, '#f0f', X, Y, 16, 16);
    }
  }
  // 灯台の かべ：屋根の 帯 → 面 → しんちゅうの ふち の 順に 立体に
  function wall(g, X, Y, cx, cy, near) {
    const open = c => c !== undefined && c !== 'X';
    R(g, '#1d2748', X, Y, 16, 16);
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) { const x = X + i * 8 + (j ? 4 : 0) - (j && i ? 8 : 0), y = Y + j * 8; R(g, '#27335c', Math.max(X, x) + 1, y + 1, 6, 6); R(g, '#32406f', Math.max(X, x) + 1, y + 1, 6, 1); }
    const S = open(near(0, 1)), N = open(near(0, -1)), E = open(near(1, 0)), W = open(near(-1, 0));
    if (!S && !N && !E && !W && (open(near(1, 1)) || open(near(-1, 1)) || open(near(1, -1)) || open(near(-1, -1)))) {
      R(g, '#0c1224', X + 3, Y + 3, 10, 10); R(g, '#efbd3b', X + 4, Y + 4, 8, 8); R(g, '#8d5a14', X + 6, Y + 6, 6, 6); R(g, '#74e0cf', X + 6, Y + 6, 4, 4); R(g, '#c1f8ea', X + 6, Y + 6, 2, 2);
    }
    if (S) {   // 奥の かべ（いちばん 見える 面）
      R(g, '#141b38', X, Y, 16, 2);
      R(g, '#efbd3b', X, Y + 2, 16, 1); R(g, '#8d5a14', X, Y + 3, 16, 1);
      R(g, '#4a5a8c', X, Y + 4, 16, 8);
      R(g, '#6476a8', X, Y + 4, 16, 1);
      for (let j = 0; j < 2; j++) for (let i = -1; i < 3; i++) { const x = X + i * 8 + (j ? 4 : 0); if (x + 7 > X && x < X + 16) { const l = Math.max(X, x), r = Math.min(X + 16, x + 7); R(g, '#3a4874', l, Y + 5 + j * 4, r - l, 3); R(g, '#5a6c9c', l, Y + 5 + j * 4, r - l, 1); } }
      if (cx % 3 === 1) { R(g, '#6476a8', X + 5, Y + 2, 6, 11); R(g, '#8b9cc8', X + 5, Y + 2, 2, 11); R(g, '#2d3a64', X + 10, Y + 2, 1, 11); R(g, '#74e0cf', X + 7, Y + 5, 2, 3); R(g, '#c1f8ea', X + 7, Y + 5, 1, 1); }
      R(g, '#2d3a64', X, Y + 12, 16, 1); R(g, '#57d8c8', X, Y + 13, 16, 1); R(g, '#17645f', X, Y + 14, 16, 1); R(g, '#0c1224', X, Y + 15, 16, 1);
    }
    if (N) { R(g, '#efbd3b', X, Y, 16, 1); R(g, '#57688f', X, Y + 1, 16, 2); R(g, '#0c1224', X, Y + 3, 16, 1); }
    if (E) { R(g, '#141b38', X + 8, Y, 1, 16); R(g, '#efbd3b', X + 9, Y, 1, 16); R(g, '#4a5a8c', X + 10, Y, 4, 16); R(g, '#6476a8', X + 10, Y, 1, 16); R(g, '#57d8c8', X + 14, Y, 1, 16); R(g, '#0c1224', X + 15, Y, 1, 16); for (let j = 3; j < 16; j += 4) R(g, '#2d3a64', X + 10, Y + j, 4, 1);
      if (cy % 3 === 2) { R(g, '#0c1224', X + 8, Y + 2, 8, 12); R(g, '#efbd3b', X + 9, Y + 3, 7, 10); R(g, '#6476a8', X + 10, Y + 4, 6, 8); R(g, '#8b9cc8', X + 10, Y + 4, 6, 2); R(g, '#74e0cf', X + 12, Y + 7, 2, 3); R(g, '#c1f8ea', X + 12, Y + 7, 1, 1); } }
    if (W) { R(g, '#0c1224', X, Y, 1, 16); R(g, '#57d8c8', X + 1, Y, 1, 16); R(g, '#3a4874', X + 2, Y, 4, 16); R(g, '#5a6c9c', X + 5, Y, 1, 16); R(g, '#efbd3b', X + 6, Y, 1, 16); R(g, '#141b38', X + 7, Y, 1, 16); for (let j = 3; j < 16; j += 4) R(g, '#2d3a64', X + 2, Y + j, 4, 1);
      if (cy % 3 === 2) { R(g, '#0c1224', X, Y + 2, 8, 12); R(g, '#efbd3b', X, Y + 3, 7, 10); R(g, '#3a4874', X, Y + 4, 6, 8); R(g, '#5a6c9c', X, Y + 4, 6, 2); R(g, '#74e0cf', X + 2, Y + 7, 2, 3); R(g, '#c1f8ea', X + 2, Y + 7, 1, 1); } }
  }
  function floor(g, X, Y, cx, cy, near, at) {
    g.drawImage(SEI, X, Y);
    const up = near(0, -1), lf = near(-1, 0), rt = near(1, 0);
    if (up === 'X') R(g, 'rgba(5,10,30,.5)', X, Y, 16, 4);
    if (lf === 'X') R(g, 'rgba(5,10,30,.38)', X, Y, 3, 16);
    if (rt === 'X') R(g, 'rgba(5,10,30,.22)', X + 14, Y, 2, 16);
    if (up === 'a') R(g, 'rgba(5,10,30,.25)', X, Y, 16, 2);
    // ヘリの 入口（とびらの わく）
    const onEdge = cy === 0 || cy === 10 || cx === 0 || cx === 14;
    if (onEdge) {
      R(g, '#0c1224', X, Y, 16, 16);
      if (cy === 0 || cy === 10) {
        for (let j = 0; j < 16; j++) R(g, `rgba(52,86,110,${cy === 0 ? j / 16 : 1 - j / 16})`, X + 2, Y + j, 12, 1);
        [0, 14].forEach(x => { R(g, '#8d5a14', X + x, Y, 2, 16); R(g, '#efbd3b', X + x, Y, 1, 16); });
        R(g, '#efbd3b', X, cy === 0 ? Y : Y + 14, 16, 2); R(g, '#fff7c6', X + 6, cy === 0 ? Y : Y + 14, 4, 2);
      } else {
        for (let j = 0; j < 16; j++) R(g, `rgba(52,86,110,${cx === 0 ? j / 16 : 1 - j / 16})`, X + j, Y + 2, 1, 12);
        [0, 14].forEach(y => { R(g, '#8d5a14', X, Y + y, 16, 2); R(g, '#efbd3b', X, Y + y, 16, 1); });
      }
    }
  }

  // ── とうだい ──
  function tower(g, cx, cy, lit) {
    const X = cx * 16, Y = cy * 16, w = 64, x0 = X + 8;
    const band = [['#a9a6c6', 0], ['#e3e2f0', 6], ['#ffffff', 16], ['#e3e2f0', 30], ['#c8c6de', 44], ['#9b98bc', 56]];
    const redB = [['#b5324a', 0], ['#e0556a', 6], ['#f5888f', 16], ['#e0556a', 30], ['#b5324a', 44], ['#7f1f33', 56]];
    const paintBand = (b, y, h) => b.forEach(([c, s], i) => { const e = i + 1 < b.length ? b[i + 1][1] : w; R(g, c, x0 + s, y, e - s, h); });
    paintBand(band, Y, 80);
    for (let i = 0; i < 3; i++) { paintBand(redB, Y + 6 + i * 26, 12); R(g, 'rgba(40,20,60,.25)', x0, Y + 18 + i * 26, w, 1); }
    for (let j = 0; j < 80; j += 8) for (let i = 0; i < w; i += 16) R(g, 'rgba(60,60,110,.14)', x0 + i + (j % 16 ? 8 : 0), Y + j, 1, 8);
    for (let j = 8; j < 80; j += 8) R(g, 'rgba(60,60,110,.1)', x0, Y + j, w, 1);
    R(g, LINE, x0 - 1, Y, 1, 80); R(g, LINE, x0 + w, Y, 1, 80);
    // 窓
    [[x0 + 28, Y + 27]].forEach(([x, y]) => { R(g, LINE, x - 1, y - 1, 10, 13); R(g, lit ? '#ffe36a' : '#20264a', x, y, 8, 11); R(g, lit ? '#fff7c6' : '#3c4166', x, y, 3, 2); });
    // いりぐちの アーチ
    R(g, LINE, X + 30, Y + 60, 20, 20); R(g, '#efbd3b', X + 31, Y + 61, 18, 19); R(g, '#8d5a14', X + 32, Y + 62, 16, 18); R(g, '#080a18', X + 33, Y + 64, 14, 16);
    R(g, '#fff7c6', X + 38, Y + 60, 4, 3);
    R(g, 'rgba(10,20,40,.3)', x0, Y + 76, w, 4);
  }

  // ── ぼう・風 ──
  function staffSwing(g, x, y, ang) {
    g.save(); g.translate(x, y); g.rotate(ang);
    R(g, LINE, -2, -15, 4, 14); R(g, '#2f78bb', -1, -14, 2, 13); R(g, '#8bd4f4', -1, -14, 1, 13);
    R(g, LINE, -4, -22, 8, 8); R(g, '#efbd3b', -3, -21, 6, 6); R(g, '#ffe68e', -3, -21, 4, 3); R(g, '#fff', -2, -20, 2, 2);
    R(g, 'rgba(255,240,170,.35)', -6, -24, 12, 12);
    g.restore();
  }
  function gust(g, x, y, t) {
    const a = t * .55;
    for (let i = 0; i < 10; i++) {
      const r = 1.5 + i * .85, an = a + i * .9;
      R(g, i < 3 ? '#ffffff' : i % 2 ? '#c1f8ea' : '#74e0cf', Math.round(x + Math.cos(an) * r), Math.round(y + Math.sin(an) * r * .8), 2, 2);
    }
    R(g, 'rgba(193,248,234,.3)', Math.round(x) - 8, Math.round(y) - 6, 16, 12);
  }

  // ── ⚓ かげの いかり番（56×56）──
  const BM = { d: C.shad, D: C.deep, k: '#07040f', S: C.iron, e: '#ffe9a0', E: '#ff9d5c', g: C.gold, b: C.sand, t: C.teal, o: C.stone, c: C.sky };
  const bossBody = stun => paint(56, 56, p => {
    // からだ
    p.ell(28, 34, 21, 18, 'D');
    p.rect(9, 36, 38, 14, 'D');
    [10, 18, 27, 36, 44].forEach((x, i) => p.ell(x, 50, 4.4, 3.6, 'D'));
    // 肩のマント
    p.ell(11, 27, 8.6, 9, 'd'); p.ell(45, 27, 8.6, 9, 'd');
    // フード
    p.ell(28, 17, 15.5, 14.5, 'd');
    p.rect(13, 19, 30, 10, 'd');
    p.line(28, 2, 28, 0, 2, 'd');
    // 顔の くらがり
    p.ell(28, 19, 10.5, 9, 'k');
    // 目
    if (stun) { p.rect(19, 19, 7, 2, 'c'); p.rect(30, 19, 7, 2, 'c'); }
    else { p.ell(22.5, 18.5, 3.2, 2.8, 'E'); p.ell(33.5, 18.5, 3.2, 2.8, 'E'); p.rect(21, 17, 3, 2, 'e'); p.rect(32, 17, 3, 2, 'e'); }
    // フジツボ
    [[15, 13], [41, 15], [38, 7], [13, 30], [44, 32], [20, 46], [36, 42]].forEach(([x, y]) => { p.ell(x, y, 2.4, 2, 'o'); p.put(x, y, 'k'); });
    // 胸の いかりの しるし
    p.rect(26.5, 31, 3, 13, 'g'); p.rect(22, 34, 12, 2, 'g'); p.ell(28, 30, 2.8, 2.6, 'g');
    p.line(20, 41, 26, 45, 2, 'g'); p.line(30, 45, 36, 41, 2, 'g');
    // くさり
    for (let i = 0; i < 5; i++) p.ell(49 + (i % 2), 28 + i * 4.4, 2.2, 2.2, 'S');
    // 帯の しおくさ
    for (let i = 0; i < 6; i++) p.line(12 + i * 6.5, 36, 13 + i * 6.5, 41 + (i % 2) * 2, 1, 't');
  }, BM);
  const BOSS = [bossBody(false), bossBody(true)];
  const BOSS_FLASH = BOSS.map(src => { const c = mk(src.width, src.height), g = c.getContext('2d'); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-atop'; R(g, '#ffffff', 0, 0, c.width, c.height); return c; });
  function boss(g, cx, cy, s) {
    const bob = Math.round(Math.sin(s.t * .09) * 1.4);
    const img = (s.flash ? BOSS_FLASH : BOSS)[s.state === 'stun' ? 1 : 0];
    const x = Math.round(cx) - 29, y = Math.round(cy) - 44 + bob;
    g.fillStyle = 'rgba(5,10,30,.42)'; for (let j = 0; j < 6; j++) { const w = 46 - Math.abs(j - 2.5) * 5; g.fillRect(Math.round(cx - w / 2), Math.round(cy) + 8 + j, w, 1); }
    g.drawImage(img, x, y);
    if (s.state === 'windup') { const a = s.t % 6 < 3 ? '#ffe9a0' : '#ff9d5c'; R(g, a, x + 24, y + 3, 10, 2); }
    if (s.state === 'stun') for (let i = 0; i < 5; i++) { const an = s.t * .14 + i * 1.26; R(g, '#ffe68e', Math.round(cx + Math.cos(an) * 16), Math.round(cy - 40 + Math.sin(an) * 4), 3, 3); }
    if (s.aura) for (let i = 0; i < 30; i++) {
      const an = s.t * .06 * (i % 2 ? 1 : -1) + i * .21, r = 27 + Math.sin(s.t * .15 + i) * 2.4;
      R(g, i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#c7a8ff' : '#7a4fe0', Math.round(cx + Math.cos(an) * r), Math.round(cy - 12 + Math.sin(an) * r * .9), 2, 2);
    }
  }
  const ANCHOR = paint(22, 24, p => {
    p.ell(11, 3, 3, 3, 'g'); p.put(11, 3, '.');
    p.rect(9.5, 5, 3, 15, 'S'); p.rect(5, 8, 12, 2, 'S');
    p.line(2, 14, 9, 21, 3, 'S'); p.line(19, 14, 12, 21, 3, 'S');
    p.line(1, 11, 2, 15, 2, 'g'); p.line(20, 11, 19, 15, 2, 'g');
  }, BM);
  function anchor(g, x, y, t) {
    g.save(); g.translate(Math.round(x), Math.round(y)); g.rotate(t * .33); g.drawImage(ANCHOR, -12, -13); g.restore();
  }
  function shield(g, x, y, t) {
    // 貝の たて（前に うかぶ）と 光の つぶ
    for (let i = 0; i < 14; i++) {
      const an = t * .09 + i * .45;
      R(g, i % 2 ? '#c7a8ff' : '#ffffff', Math.round(x + Math.cos(an) * 14), Math.round(y + Math.sin(an) * 14), 2, 2);
    }
    g.drawImage(SHELL_SHIELD, Math.round(x) - 13, Math.round(y) - 6);
  }
  const SHELL_SHIELD = paint(14, 16, p => {
    p.ell(7, 7, 6.6, 7, 'p');
    for (let i = 0; i < 5; i++) p.line(7, 14, 1 + i * 3, 2 + (i === 0 || i === 4 ? 3 : 0), 1, 'q');
    p.rect(4, 13, 7, 2, 'g');
  }, { p: C.shad, q: C.deep, g: C.gold }, '#07040f');

  // ── しかけ ──
  const CHEST_M = { w: C.wood, o: C.org, g: C.gold, r: C.red, k: '#10101f' };
  const CHEST = paint(16, 14, p => { p.rect(1, 1, 14, 12, 'w'); p.rect(1, 6, 14, 1, 'k'); p.rect(3, 1, 2, 12, 'g'); p.rect(11, 1, 2, 12, 'g'); p.rect(6, 5, 4, 4, 'g'); p.rect(7, 6, 2, 2, 'k'); }, CHEST_M);
  const CHEST_O = paint(16, 14, p => { p.rect(1, 1, 14, 5, 'w'); p.rect(2, 2, 12, 3, 'k'); p.rect(1, 6, 14, 7, 'w'); p.rect(3, 6, 2, 7, 'g'); p.rect(11, 6, 2, 7, 'g'); }, CHEST_M);
  const CHEST_B = paint(16, 14, p => { p.rect(1, 1, 14, 12, 'r'); p.rect(1, 6, 14, 1, 'k'); p.rect(1, 1, 2, 12, 'g'); p.rect(13, 1, 2, 12, 'g'); p.rect(1, 1, 14, 1, 'g'); p.rect(5, 4, 6, 5, 'g'); p.rect(7, 6, 2, 2, 'k'); }, CHEST_M);
  const CHEST_BO = paint(16, 14, p => { p.rect(1, 1, 14, 5, 'r'); p.rect(2, 2, 12, 3, 'k'); p.rect(1, 6, 14, 7, 'r'); p.rect(1, 6, 2, 7, 'g'); p.rect(13, 6, 2, 7, 'g'); }, CHEST_M);
  function chest(g, x, y, open, big) {
    R(g, 'rgba(5,10,30,.35)', x, y + 12, 16, 4);
    g.drawImage(big ? (open ? CHEST_BO : CHEST_B) : (open ? CHEST_O : CHEST), x - 1, y);
  }
  const BLOCK = paint(16, 16, p => {
    p.rect(0, 0, 16, 16, 's');
    p.rect(3, 3, 10, 10, 'S');
    p.ell(8, 8, 3.2, 3.2, 'g'); p.ell(8, 8, 1.2, 1.2, 'S');
  }, { s: C.stone, S: C.iron, g: C.teal });
  function block(g, x, y) { R(g, 'rgba(5,10,30,.38)', x + 1, y + 12, 16, 5); g.drawImage(BLOCK, x - 1, y - 2); }
  const BOULDER = paint(16, 15, p => {
    p.ell(8, 7.5, 7.6, 7, 's');
    p.line(5, 3, 8, 7, 1, 'k'); p.line(8, 7, 7, 11, 1, 'k'); p.line(8, 7, 12, 8, 1, 'k');
    p.rect(3, 10, 3, 2, 'm'); p.rect(10, 11, 3, 1, 'm');
  }, { s: C.sand, k: '#463a2c', m: C.moss });
  function boulder(g, x, y) { R(g, 'rgba(5,10,30,.38)', x + 1, y + 12, 15, 4); g.drawImage(BOULDER, x - 1, y - 1); }
  function plate(g, x, y, on) {
    R(g, LINE, x + 1, y + 1, 14, 14); R(g, '#efbd3b', x + 2, y + 2, 12, 12); R(g, '#8d5a14', x + 3, y + 3, 10, 10);
    R(g, on ? '#3dbdb0' : '#e0556a', x + 4, y + 4, 8, 8); R(g, on ? '#c1f8ea' : '#ffc7c4', x + 4, y + 4, 4, 2); R(g, on ? '#17645f' : '#7f1f33', x + 4, y + 11, 8, 1);
  }
  function pinwheel(g, x, y, t, spin) {
    const cx = x + 8, cy = y + 6, an = spin ? t * .35 : .4;
    R(g, 'rgba(5,10,30,.35)', x + 4, y + 13, 9, 3);
    R(g, LINE, x + 6, y + 6, 4, 10); R(g, '#9a6a3c', x + 7, y + 7, 2, 9); R(g, '#c29155', x + 7, y + 7, 1, 9);
    for (let i = 0; i < 4; i++) {
      const a = an + i * Math.PI / 2, cols = i % 2 ? ['#8d5a14', '#efbd3b', '#fff7c6'] : ['#7f1f33', '#e0556a', '#ffc7c4'];
      for (let r = 1; r < 8; r++) for (let w = 0; w < Math.min(r, 3); w++) {
        const ca = a + Math.PI / 2;
        R(g, cols[Math.min(2, w)], Math.round(cx + Math.cos(a) * r + Math.cos(ca) * w), Math.round(cy + Math.sin(a) * r + Math.sin(ca) * w), 1, 1);
      }
    }
    R(g, LINE, cx - 1, cy - 1, 3, 3); R(g, '#fff', cx, cy, 1, 1);
  }
  const STONE = paint(14, 19, p => { p.rect(3, 2, 8, 15, 's'); p.ell(7, 3, 4, 3, 's'); p.rect(1, 15, 12, 3, 'S'); p.ell(7, 8, 2.4, 3.2, 'k'); }, { s: C.stone, S: C.iron, k: '#141a38' });
  function stone(g, x, y, t) {
    R(g, 'rgba(5,10,30,.3)', x + 1, y + 12, 15, 4);
    g.drawImage(STONE, x, y - 5);
    const a = Math.sin(t * .1);
    R(g, 'rgba(255,220,120,.28)', x + 3, y - 2, 11, 11);
    R(g, a > 0 ? '#ffc04a' : '#ff9d4c', x + 7, y + 1, 3, 6); R(g, '#fff4b0', x + 8, y + 3 + (a > 0 ? 0 : 1), 1, 3);
  }
  const SIGN = paint(14, 15, p => { p.rect(0, 0, 14, 9, 'w'); p.rect(6, 9, 2, 6, 'W'); p.rect(2, 3, 10, 1, 'k'); p.rect(2, 5, 7, 1, 'k'); }, { w: C.wood, W: C.wood, k: '#3a2615' });
  function sign(g, x, y) { R(g, 'rgba(5,10,30,.28)', x + 3, y + 13, 11, 3); g.drawImage(SIGN, x, y); }
  function door(g, x, y, kind, side) {
    if (kind === 'gate') {
      R(g, LINE, x, y, 16, 16); R(g, '#9a6a3c', x + 1, y + 1, 14, 14);
      for (let i = 1; i < 15; i += 4) { R(g, '#c29155', x + i, y + 1, 1, 14); R(g, '#5f4226', x + i + 3, y + 1, 1, 14); }
      R(g, '#3c4166', x + 1, y + 3, 14, 2); R(g, '#3c4166', x + 1, y + 11, 14, 2); R(g, '#8b92b8', x + 1, y + 3, 14, 1); R(g, '#8b92b8', x + 1, y + 11, 14, 1);
      return;
    }
    R(g, LINE, x, y, 16, 16);
    if (kind === 'key') {
      R(g, '#74482a', x + 1, y + 1, 14, 14); for (let i = 1; i < 15; i += 3) R(g, '#4f2f18', x + i, y + 1, 1, 14);
      R(g, '#efbd3b', x + 1, y + 1, 14, 1); R(g, '#8d5a14', x + 1, y + 14, 14, 1);
      R(g, LINE, x + 4, y + 4, 8, 8); R(g, '#efbd3b', x + 5, y + 5, 6, 6); R(g, '#fff7c6', x + 5, y + 5, 3, 1); R(g, LINE, x + 7, y + 6, 2, 2); R(g, LINE, x + 7, y + 8, 1, 2);
    } else if (kind === 'big') {
      R(g, '#7f1f33', x + 1, y + 1, 14, 14); R(g, '#b5324a', x + 2, y + 2, 12, 12);
      R(g, '#efbd3b', x + 1, y + 1, 14, 2); R(g, '#efbd3b', x + 1, y + 13, 14, 2);
      R(g, LINE, x + 3, y + 3, 10, 10); R(g, '#fbc27c', x + 4, y + 4, 8, 8); R(g, '#f49d4f', x + 5, y + 8, 7, 4);
      R(g, LINE, x + 7, y + 5, 2, 3); R(g, LINE, x + 6, y + 8, 4, 3);
    } else {
      R(g, '#2c3358', x + 1, y + 1, 14, 14);
      for (let i = 2; i < 15; i += 3) { R(g, '#5d648f', x + i, y + 1, 1, 14); R(g, '#8b92b8', x + i, y + 1, 1, 2); R(g, '#141a38', x + i + 1, y + 1, 1, 14); }
      R(g, '#8b92b8', x + 1, y + 7, 14, 2);
      if (kind === 'wind') { R(g, LINE, x + 4, y + 4, 8, 8); R(g, '#3dbdb0', x + 5, y + 5, 6, 6); R(g, '#c1f8ea', x + 5, y + 5, 3, 2); R(g, LINE, x + 7, y + 7, 2, 2); }
      else { R(g, LINE, x + 4, y + 5, 8, 6); R(g, '#e0556a', x + 5, y + 6, 6, 4); R(g, '#ffc7c4', x + 5, y + 6, 3, 1); }
    }
  }
  const LAMP = paint(30, 26, p => {
    p.rect(11, 12, 8, 11, 's'); p.rect(6, 22, 18, 3, 'S');
    p.ell(15, 9, 12, 4.5, 'g'); p.rect(3, 5, 24, 3, 'g');
    p.ell(15, 6, 9, 2, 'k');
  }, { s: C.stone, S: C.iron, g: C.gold, k: '#141a38' });
  function lamp(g, x, y, lit, t) {
    R(g, 'rgba(5,10,30,.4)', x - 5, y + 12, 26, 5);
    g.drawImage(LAMP, x - 7, y - 10);
    if (lit) {
      const f = Math.floor(t / 5) % 3;
      R(g, 'rgba(255,220,120,.2)', x - 12, y - 28, 40, 32);
      R(g, '#ff7b3a', x + 1, y - 13 - f, 14, 11 + f); R(g, '#ffc04a', x + 3, y - 15 + f, 10, 13 - f); R(g, '#fff4b0', x + 6, y - 11, 4, 8);
    }
  }
  const BOAT = paint(26, 22, p => {
    p.rect(11, 0, 2, 13, 'w'); p.line(13, 1, 22, 11, 1, 'c');
    for (let y = 1; y < 12; y++) p.rect(13, y, Math.min(9, y), 1, 'c');
    p.rect(1, 13, 24, 3, 'r'); p.rect(3, 16, 20, 4, 'k'); p.rect(0, 12, 3, 2, 'r'); p.rect(23, 12, 3, 2, 'r');
  }, { w: C.wood, c: C.wht, r: C.red, k: C.crm });
  function boat(g, x, y) { g.drawImage(BOAT, x - 8, y - 8); }

  return { mk, flip, heroFrames, colon, colonL, NPC, slime, bat, crab, guard, ICON, tile, tower, staffSwing, gust, boss, anchor, shield, chest, block, boulder, plate, pinwheel, stone, sign, door, lamp, boat, R };
})();
