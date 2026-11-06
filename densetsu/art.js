// ============================================================
// 🎨 アンリノの伝説の 絵（画像ファイルは つかわず、ぜんぶ コードで 描く）
//   ・文字の表 1文字＝1ドット。パレットの 色を ぬる
//   ・タイルは Art.tile(g, ch, x, y, ...) で 下絵（bake）に 描く
// ============================================================
const Art = (() => {
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const K = '#27304f';   // ふちの 色（くろでなく 紺）
  const fromRows = (rows, pal) => {
    const w = Math.max(...rows.map(r => r.length)), h = rows.length, c = mk(w, h), g = c.getContext('2d');
    rows.forEach((r, y) => [...r].forEach((ch, x) => { const col = pal[ch]; if (col) { g.fillStyle = col; g.fillRect(x, y, 1, 1); } }));
    return c;
  };
  const flip = src => { const c = mk(src.width, src.height), g = c.getContext('2d'); g.translate(src.width, 0); g.scale(-1, 1); g.drawImage(src, 0, 0); return c; };

  // ── 🐾 アンリノ（青い かみ・黄色い かお・みどりの かばん）──
  const HERO = { k: K, b: '#86d2ef', B: '#4fa3d6', y: '#ffe585', Y: '#f4c04e', w: '#fff', e: '#1f2140', p: '#f6a2a2', g: '#75b957', G: '#3f8043', s: '#5fcfbf' };
  const heroDown = [
    '................',
    '.kkk..kkkk..kkk.',
    'kbbbkkbbbbkkbbbk',
    'kbyBkbbbbbbkBybk',
    'kyyBkbbbbbbkByyk',
    '.kkkbyyyyyybkkk.',
    '...kyeyyyyeyk...',
    '...kyeyyyyeyk...',
    '...kpyyeeypyk...',
    '....kkyyyykk....',
    '...kbGyyyybk....',
    '..kbkgGyyybkk...',
    '...kkggGyyk.k...',
    '....kyyyyyk.....',
  ];
  const heroUp = [
    '................',
    '.kkk..kkkk..kkk.',
    'kbbbkkbbbbkkbbbk',
    'kbyBkbbbbbbkBybk',
    'kyyBkbbbbbbkByyk',
    '.kkkbbbbbbbbkkk.',
    '...kbbbBBbbbk...',
    '...kbbBBBBbbk...',
    '...kbbbbbbbbk...',
    '....kkbbbbkk....',
    '..kkkGbbbbGkkk..',
    '.kbbkgGbbGgkbbk.',
    '..kkkggbbggkkk..',
    '....kyyyyyyk....',
  ];
  const heroRight = [
    '................',
    '....kkkkkk......',
    '..kkbbbbbbkk....',
    '.kbbbbbbbbbbk...',
    '.kbbkkkbbbbbbk..',
    'kbybBBkbbbbbbk..',
    'kyyyBkbyyyyyyk..',
    '.kkkkbyyyyeyyk..',
    '....kyyyyyeyyk..',
    '....kpyyyyyeek..',
    '.....kkyyyykk...',
    '...kgGbbyyyk....',
    '...kggkbyyyk....',
    '....kkyyyyk.....',
  ];
  const feet = [['....kss.kssk....', '....kkk..kkk....'], ['....kss.kkk.....', '....kkk.........'], ['.....kkk.ssk....', '.........kkk....']];
  const heroFrames = {};
  const heroSet = (name, base) => { heroFrames[name] = [0, 1, 2].map(i => fromRows(base.concat(feet[i]), HERO)); };
  heroSet('d', heroDown); heroSet('u', heroUp); heroSet('r', heroRight);
  heroFrames.l = heroFrames.r.map(flip);

  // ── 🦊 コロン（オレンジの キツネ）──
  const COLON = { k: '#5b3a24', o: '#f6a65e', O: '#dc7f3c', c: '#fff4dd', e: '#3a2415', p: '#f4b6a0' };
  const colonRows = [
    '.k......k...',
    'kpk....kpk..',
    'kook..kook..',
    '.koOkkOok...',
    'koooooooook.',
    'kcccoocccck.',
    '.kcekkeck...',
    '..kcccck....',
    '..koooook...',
    '.kOoooooOk..',
    '..koookok...',
    '..kk..kk....',
  ];
  const colon = fromRows(colonRows, COLON);
  const colonL = flip(colon);

  // ── 村の ひとびと（どうぶつたち）──
  const NPC = {
    // 🐢 村長
    turtle: fromRows([
      '.....kkkkkk.....', '....k8888888k...', '....k8e88e88k...', '....k888888k....', '.....kkkkkk.....',
      '...kkkkkkkkkk...', '..kAaAaAaAaAk...', '.kAaAaAaAaAaAk..', '.kaAaAaAaAaAak..', '.kAaAaAaAaAaAk..',
      '..kaAaAaAaAak...', '...kkkkkkkkkk...', '..k88k...k88k...', '..kkk.....kkk...'],
      { k: '#2e3d2a', 8: '#a8d88a', e: '#1f2140', A: '#7a5a34', a: '#b28a50' }),
    // 🦭 りょうし（アザラシ）
    seal: fromRows([
      '................', '.....kkkkkk.....', '....ksssssskk...', '...kssssssssk...', '...kseesseesk...', '...kssssssssk...',
      '...ksswkkwssk...', '....ksswwssk....', '...kRRRRRRRRk...', '..kssRRRRRRssk..', '..ksssssssssk...', '...kssssssssk...',
      '...kssssssssk...', '....kssssssk....', '.....kkkkkk.....', '................'],
      { k: '#2d3748', s: '#a9bdcc', e: '#10131f', w: '#f4f7fa', R: '#e0605c' }),
    // 🐰 こども
    rabbit: fromRows([
      '.....kk..kk.....', '....kwwkkwwk....', '....kwpkkpwk....', '....kwpkkpwk....', '....kwwkkwwk....', '...kkwwwwwwkk...',
      '...kwwwwwwwwk...', '...kweewweewk...', '...kwwwppwwwk...', '....kkwwwwkk....', '....kYYYYYYk....', '....kYYYYYYk....',
      '....kwwkkwwk....', '....kkk..kkk....'],
      { k: '#51465f', w: '#fbf6ef', p: '#f6a2b2', e: '#2a2140', Y: '#f4c04e' }),
    // 🐱 スープやさん
    cat: fromRows([
      '...k........k...', '..kok......kok..', '..koookkkkoook..', '..kooooooooook..', '..koeeooooeeok..', '..koooooppoook..',
      '...kkoooooookk..', '...kwwwwwwwwk...', '..koWwwwwwwWok..', '...kWWwwwwWWk...', '...kWWWWWWWWk...', '...kkkkkkkkkk...',
      '....koo..ook....', '....kkk..kkk....'],
      { k: '#3a2c3f', o: '#c8b7a5', e: '#1b1730', p: '#e77f8d', w: '#fff', W: '#83b6dd' }),
  };

  // ── かげモンスターたち ──
  const SH = { k: '#16112e', d: '#4a2f7f', D: '#2f1f5b', l: '#7c5bc4', e: '#ffe08a', r: '#ff8aa0' };
  const slime = [fromRows([
    '................', '................', '................', '.....kkkkkk.....', '....kllddddk....', '...klddddddDk...', '..kldeeddeedDk..', '..kddeeddeedDk..',
    '..kddddddddDDk..', '..kdddrrdddDDk..', '..kDdddddDDDDk..', '...kkkkkkkkkk...'], SH),
  fromRows([
    '................', '................', '................', '................', '................', '.....kkkkkk.....', '...kkllddddkk...', '..klddddddddDk..',
    '.kldeeddddeedDk.', '.kddeeddddeeDDk.', '.kDdddrrrrddDDk.', '..kkkkkkkkkkkk..'], SH)];
  const bat = [fromRows([
    '................', '................', 'k....kk..kk....k', 'kk...kdkkdk...kk', 'kdk..kddddk..kdk', 'kddk.kekdek.kddk',
    'kdddkkddddkkdddk', '.kddddddddddddk.', '..kkddkrrkddkk..', '....kk.kk.kk....'], SH),
  fromRows([
    '................', '................', '................', '.....kk..kk.....', '.....kdkkdk.....', '.....kekdek.....',
    '..kkkkddddkkkk..', '.kddddddddddddk.', 'kddkkdkrrkdkkddk', 'kdk..kkkkkk..kdk', 'kk............kk'], SH)];
  const crab = [fromRows([
    '................', '................', '...kk......kk...', '..kdlk....kldk..', '..kddk....kddk..', '...kk.kkkk.kk...', '....kkeddekk....',
    '...kdddddddDk...', '..kldddddddDDk..', '..kdddddddDDDk..', '...kkkkkkkkkk...', '..k.k.k..k.k.k..'], SH),
  fromRows([
    '................', '................', '................', '..kk........kk..', '.kdlk......kldk.', '.kddk.kkkk.kddk.', '..kkkkeddekkkk..',
    '...kdddddddDk...', '..kldddddddDDk..', '..kdddddddDDDk..', '...kkkkkkkkkk...', '...k.k.kk.k.k...'], SH)];
  const guard = [fromRows([
    '.....kkkkkk.....', '....kllddddk....', '...klddddddDk...', '...kdeeddeeDk...', '...kdeeddeeDk...', '...kDddddddDk...',
    '...kkDDDDDDkk...', '..kdkddddddkdk..', '..kdkddddddkdk..', '..kkkddddddkkk..', '....kDDDDDDk....', '....kdk..kdk....', '....kkk..kkk....'], SH),
  fromRows([
    '.....kkkkkk.....', '....kllddddk....', '...klddddddDk...', '...kdeeddeeDk...', '...kdeeddeeDk...', '...kDddddddDk...',
    '...kkDDDDDDkk...', '..kdkddddddkdk..', '..kdkddddddkdk..', '..kkkddddddkkk..', '....kDDDDDDk....', '....kdkkkkk.....', '....kkk.........'], SH)];

  // ── アイテムの 絵（HUD・もちあげ）──
  const drop = fromRows(['...kk...', '..kbbk..', '..kbbk..', '.kbwbbk.', 'kbwbbbbk', 'kbbbbbbk', '.kbbbbk.', '..kkkk..'], { k: '#163a66', b: '#54b6ee', w: '#dff5ff' });
  const dropHalf = fromRows(['...kk...', '..k..k..', '..k..k..', '.k....k.', 'kbbbbbbk', 'kbbbbbbk', '.kbbbbk.', '..kkkk..'], { k: '#163a66', b: '#54b6ee' });
  const dropEmpty = fromRows(['...kk...', '..k..k..', '..k..k..', '.k....k.', 'k......k', 'k......k', '.k....k.', '..kkkk..'], { k: '#46506f' });
  const shell = fromRows(['..kkkk..', '.kpwpwk.', 'kpwpwpwk', 'kwpwpwpk', '.kpwpwk.', '..kppk..', '..kkkk..'], { k: '#804b5c', p: '#ffb4c0', w: '#fff0ea' });
  const key = fromRows(['.kkk....', 'kyyyk...', 'kykyk...', 'kyyykkkk', '.kkkyyyy', '....kkyk', '.....kkk'], { k: '#6a4814', y: '#ffd85e' });
  const bigkey = fromRows(['..kkkkk.....', '.kyyyyyk....', 'kyykkkyyk...', 'kyk...kyk...', 'kyykkkyykkkk', '.kyyyyyyyyyy', '..kkkkkyykyk', '.......kkkkk'], { k: '#6a2a14', y: '#ff9f43' });
  const jar = fromRows(['...kkkk...', '..kwwwwk..', '...kcck...', '..kccCCk..', '.kccccCCk.', 'kcccwwcCCk', 'kccwccwCCk', 'kccwwwwCCk', 'kcccccCCCk', '.kccCCCCk.', '..kkkkkk..'], { k: '#16415a', w: '#e9fcff', c: '#6fd6de', C: '#3796ac' });
  const staff = fromRows(['......yk', '.....yyy', '....kyyk', '...kOOk.', '..kOOk..', '.kOOk...', 'kOOk....', 'kkk.....'], { k: '#4a2f1b', y: '#ffe36a', O: '#3f7fd0' });
  const cont = fromRows(['....kkkk....', '...kbbbbk...', '...kbbbbk...', '..kbwwbbbk..', '.kbwbbbbbbk.', 'kbwbbbbbbbbk', 'kbbbbbbbbbbk', 'kbbbbbbbbbbk', '.kbbbbbbbbk.', '..kkkkkkkk..'], { k: '#163a66', b: '#54b6ee', w: '#ffffff' });
  const ICON = { drop, dropHalf, dropEmpty, shell, key, big: bigkey, jar, staff, cont };

  // ── タイル ──
  const noise = (x, y, s) => { const n = Math.sin(x * 127.1 + y * 311.7 + (s || 0) * 74.7) * 43758.5453; return n - Math.floor(n); };
  const R = (g, c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  function grass(g, X, Y, cx, cy) {
    R(g, '#74c76b', X, Y, 16, 16);
    for (let i = 0; i < 5; i++) {
      const a = noise(cx, cy, i), b = noise(cy, cx, i + 9);
      R(g, a > .5 ? '#5fb45e' : '#92d97c', X + Math.floor(a * 15), Y + Math.floor(b * 14), 1, 2);
    }
  }
  function tile(g, ch, cx, cy, at) {
    const X = cx * 16, Y = cy * 16;
    const near = (dx, dy) => at(cx + dx, cy + dy);
    switch (ch) {
      case '.': grass(g, X, Y, cx, cy); break;
      case ',': grass(g, X, Y, cx, cy);
        R(g, '#fff', X + 3, Y + 4, 3, 3); R(g, '#f9c74f', X + 4, Y + 5, 1, 1); R(g, '#ffb7c5', X + 10, Y + 10, 3, 3); R(g, '#fff4b0', X + 11, Y + 11, 1, 1); break;
      case ':': R(g, '#f2dfae', X, Y, 16, 16);
        for (let i = 0; i < 4; i++) R(g, '#dcc48c', X + Math.floor(noise(cx, cy, i) * 15), Y + Math.floor(noise(cy, cx, i) * 15), 1, 1); break;
      case '=': R(g, '#e3c78f', X, Y, 16, 16);
        for (let i = 0; i < 3; i++) R(g, '#c9a973', X + Math.floor(noise(cx, cy, i) * 14), Y + Math.floor(noise(cy, cx, i) * 14), 2, 1); break;
      case 'W': R(g, '#3f9fd8', X, Y, 16, 16);
        { const land = c => c !== 'W' && c !== undefined && c !== 'L';
          if (land(near(0, -1))) { R(g, '#e9fbff', X, Y, 16, 2); R(g, '#8fd6ef', X, Y + 2, 16, 1); }
          if (land(near(0, 1))) R(g, '#8fd6ef', X, Y + 15, 16, 1);
          if (land(near(-1, 0))) R(g, '#8fd6ef', X, Y, 1, 16);
          if (land(near(1, 0))) R(g, '#8fd6ef', X + 15, Y, 1, 16); } break;
      case 'T': grass(g, X, Y, cx, cy);
        R(g, '#6a4628', X + 6, Y + 11, 4, 5);
        R(g, '#1f6b4a', X + 1, Y + 2, 14, 10); R(g, '#1f6b4a', X + 3, Y, 10, 14);
        R(g, '#2f9060', X + 2, Y + 2, 11, 8); R(g, '#2f9060', X + 4, Y + 1, 8, 10);
        R(g, '#58b777', X + 4, Y + 3, 4, 3); R(g, '#58b777', X + 9, Y + 6, 2, 2); break;
      case 'Y': R(g, '#f2dfae', X, Y, 16, 16);
        R(g, '#8a6238', X + 7, Y + 5, 3, 11); R(g, '#6e4c2a', X + 7, Y + 8, 3, 1); R(g, '#6e4c2a', X + 7, Y + 12, 3, 1);
        R(g, '#2f9060', X + 1, Y + 3, 14, 2); R(g, '#2f9060', X, Y + 5, 3, 2); R(g, '#2f9060', X + 13, Y + 5, 3, 2); R(g, '#2f9060', X + 5, Y, 6, 4); R(g, '#58b777', X + 6, Y + 1, 4, 2); break;
      case 'R': R(g, '#7d7a8f', X, Y, 16, 16); R(g, '#9b98ad', X, Y, 16, 4); R(g, '#9b98ad', X + 3, Y + 5, 6, 3);
        R(g, '#5d5a70', X, Y + 13, 16, 3); R(g, '#5d5a70', X + 10, Y + 7, 4, 2); break;
      case 'B': grass(g, X, Y, cx, cy);
        R(g, '#2a7d3e', X + 1, Y + 3, 14, 12); R(g, '#3fa050', X + 2, Y + 2, 12, 10); R(g, '#6fc76e', X + 4, Y + 4, 2, 2); R(g, '#6fc76e', X + 9, Y + 3, 2, 2); R(g, '#6fc76e', X + 7, Y + 8, 2, 2); R(g, '#e2607a', X + 11, Y + 8, 2, 2); break;
      case '^': R(g, '#e8705f', X, Y, 16, 16); R(g, '#c9513f', X, Y + 7, 16, 1); R(g, '#c9513f', X, Y + 15, 16, 1);
        for (let i = 0; i < 16; i += 4) R(g, '#c9513f', X + i + (cy % 2 ? 2 : 0), Y, 1, 7); R(g, '#f59c82', X, Y, 16, 1); break;
      case 'H': R(g, '#f7ecd4', X, Y, 16, 16); R(g, '#c7ad82', X, Y + 15, 16, 1); R(g, '#7fbad8', X + 4, Y + 4, 8, 7); R(g, '#5b4a3a', X + 4, Y + 3, 8, 1); R(g, '#5b4a3a', X + 7, Y + 4, 1, 7); break;
      case 'D': R(g, '#f7ecd4', X, Y, 16, 16); R(g, '#6a4628', X + 2, Y + 1, 12, 15); R(g, '#3b2616', X + 3, Y + 2, 10, 14); R(g, '#ffd85e', X + 10, Y + 9, 2, 2); break;
      case 'C': R(g, '#7d7a8f', X, Y, 16, 16); R(g, '#17132b', X + 2, Y + 2, 12, 14); R(g, '#17132b', X + 1, Y + 6, 14, 10); break;
      case 'K': R(g, '#a77b4c', X, Y, 16, 16); for (let i = 0; i < 16; i += 4) R(g, '#7f5a34', X, Y + i, 16, 1); R(g, '#7f5a34', X + 8, Y, 1, 16); break;
      case 'L': R(g, '#3f9fd8', X, Y, 16, 16); break;   // とうだいの 足もと（上から Art.tower で 描く）
      // ─ たてもの・ダンジョン ─
      case 'I': R(g, '#a77b4c', X, Y, 16, 16); R(g, '#7f5a34', X, Y + 7, 16, 1); R(g, '#7f5a34', X, Y + 15, 16, 1); R(g, '#c79a68', X, Y, 16, 1); break;
      case 'w': R(g, '#e7c79a', X, Y, 16, 16); R(g, '#cfa877', X, Y, 16, 1); R(g, '#cfa877', X + ((cx + cy) % 2 ? 4 : 11), Y, 1, 16); break;
      case 't': R(g, '#e7c79a', X, Y, 16, 16); R(g, '#8a6238', X + 1, Y + 3, 14, 10); R(g, '#a97c4c', X + 2, Y + 3, 12, 7); R(g, '#fff4dd', X + 5, Y + 4, 6, 4); break;
      case 'X': R(g, '#2a3463', X, Y, 16, 16);
        R(g, '#3b478a', X + ((cy % 2) ? 0 : 8), Y + 1, 7, 6); R(g, '#3b478a', X + ((cy % 2) ? 8 : 0), Y + 9, 7, 6); R(g, '#1c2348', X, Y + 15, 16, 1); R(g, '#1c2348', X, Y + 7, 16, 1);
        if (near(0, 1) && near(0, 1) !== 'X') { R(g, '#57d8c8', X, Y + 14, 16, 1); R(g, '#141a38', X, Y + 15, 16, 1); } break;
      case 'f': R(g, '#57618f', X, Y, 16, 16); R(g, '#4a5380', X, Y, 16, 1); R(g, '#4a5380', X, Y, 1, 16); R(g, '#6771a0', X + 1, Y + 1, 14, 1);
        if (near(0, -1) === 'X') R(g, '#3a4270', X, Y, 16, 4);
        if (noise(cx, cy) > .8) R(g, '#4a5380', X + 5, Y + 7, 5, 1); break;
      case 'a': R(g, '#57618f', X, Y, 16, 16); R(g, '#141a38', X + 2, Y + 12, 12, 4); R(g, '#3b478a', X + 2, Y + 1, 12, 12); R(g, '#57d8c8', X + 4, Y + 3, 8, 2); R(g, '#2a3463', X + 4, Y + 7, 8, 4); break;
      case 'P': R(g, '#0b0d1f', X, Y, 16, 16);
        if (near(0, -1) && near(0, -1) !== 'P') { R(g, '#272d55', X, Y, 16, 3); R(g, '#141833', X, Y + 3, 16, 2); } break;
      case 'U': R(g, '#0b0d1f', X, Y, 16, 16); R(g, '#a77b4c', X, Y, 16, 16); for (let i = 0; i < 16; i += 4) R(g, '#7f5a34', X, Y + i, 16, 1); R(g, '#57d8c8', X, Y, 2, 16); R(g, '#57d8c8', X + 14, Y, 2, 16); break;
      default: R(g, '#f0f', X, Y, 16, 16);
    }
  }

  // ── とうだい（みさきの 大きな たてもの）──
  function tower(g, cx, cy, lit) {
    const X = cx * 16, Y = cy * 16;   // X,Y＝足もとの 左上（5×5タイル）
    R(g, '#e9e4f2', X + 8, Y, 64, 80); R(g, '#bdb6d6', X + 56, Y, 16, 80);
    for (let i = 0; i < 3; i++) { R(g, '#e8705f', X + 8, Y + 8 + i * 24, 64, 10); R(g, '#b84b3c', X + 56, Y + 8 + i * 24, 16, 10); }
    R(g, '#27304f', X + 8, Y, 1, 80); R(g, '#27304f', X + 71, Y, 1, 80);
    R(g, '#39406b', X + 22, Y + 2, 36, 4);
    R(g, lit ? '#ffe58a' : '#231f45', X + 28, Y - 0, 24, 2);
  }

  // ── 🔦 ぼう（ふる むきで ぐるっと）──
  function staffSwing(g, x, y, ang) {
    g.save(); g.translate(x, y); g.rotate(ang);
    R(g, '#27304f', -1, -15, 4, 14); R(g, '#3f7fd0', 0, -14, 2, 13);
    R(g, '#ffe36a', -2, -19, 6, 5); R(g, '#fff', -1, -18, 2, 2); R(g, '#ffe36a', 0, -21, 2, 2);
    g.restore();
  }
  // 🌀 風
  function gust(g, x, y, t) {
    const a = t * .5;
    for (let i = 0; i < 6; i++) {
      const r = 2 + i * .9, an = a + i * 1.1;
      R(g, i % 2 ? '#eafcff' : '#8fe3f0', Math.round(x + Math.cos(an) * r), Math.round(y + Math.sin(an) * r), 2, 2);
    }
  }
  // かげの いかり番（32×32）
  function boss(g, x, y, s) {
    const D = '#2a1d57', d = '#4a2f7f', l = '#7c5bc4', k = '#100b24';
    const bob = Math.round(Math.sin(s.t * .12) * 1);
    x = Math.round(x); y = Math.round(y) + bob;
    R(g, 'rgba(0,0,0,.28)', x + 3, y + 28 - bob, 26, 4);
    R(g, k, x + 5, y + 4, 22, 25); R(g, k, x + 2, y + 10, 28, 13);
    R(g, s.flash ? '#fff' : d, x + 6, y + 5, 20, 22); R(g, s.flash ? '#fff' : d, x + 3, y + 11, 26, 11);
    R(g, D, x + 6, y + 20, 20, 7); R(g, l, x + 8, y + 6, 10, 2);
    // 目
    const stun = s.state === 'stun';
    R(g, stun ? '#8fe3f0' : '#ffe08a', x + 10, y + 12, 4, stun ? 2 : 4); R(g, stun ? '#8fe3f0' : '#ffe08a', x + 18, y + 12, 4, stun ? 2 : 4);
    // くさり
    R(g, '#8a90b5', x + 26, y + 16, 5, 2);
    if (stun) { for (let i = 0; i < 4; i++) { const an = s.t * .15 + i * 1.57; R(g, '#ffe08a', x + 16 + Math.cos(an) * 13, y + 2 + Math.sin(an) * 3, 2, 2); } }
    if (s.aura) {
      for (let i = 0; i < 18; i++) {
        const an = s.t * .08 + i * .35, r = 20 + Math.sin(s.t * .2 + i) * 2;
        R(g, i % 3 ? '#9b6cff' : '#e6d4ff', Math.round(x + 16 + Math.cos(an) * r), Math.round(y + 16 + Math.sin(an) * r), 2, 2);
      }
    }
  }
  function anchor(g, x, y, t) {
    x = Math.round(x); y = Math.round(y);
    g.save(); g.translate(x, y); g.rotate(t * .35);
    R(g, '#10132a', -2, -8, 4, 16); R(g, '#b7bdd8', -1, -7, 2, 14); R(g, '#b7bdd8', -6, 3, 12, 2); R(g, '#b7bdd8', -7, 0, 2, 4); R(g, '#b7bdd8', 5, 0, 2, 4); R(g, '#ffe08a', -2, -9, 4, 3);
    g.restore();
  }
  function shield(g, x, y, t) {
    for (let i = 0; i < 10; i++) {
      const an = t * .1 + i * .63;
      R(g, i % 2 ? '#9b6cff' : '#e6d4ff', Math.round(x + Math.cos(an) * 10), Math.round(y + Math.sin(an) * 10), 2, 2);
    }
  }
  // しかけ
  function chest(g, x, y, open, big) {
    const c = big ? '#d14d7a' : '#b6743a', C = big ? '#8d2b52' : '#7f4c22';
    R(g, 'rgba(0,0,0,.25)', x + 1, y + 13, 14, 3);
    R(g, '#27304f', x + 1, y + 3, 14, 12); R(g, c, x + 2, y + (open ? 7 : 4), 12, open ? 7 : 10);
    if (open) { R(g, '#17132b', x + 2, y + 4, 12, 4); } else { R(g, C, x + 2, y + 8, 12, 1); R(g, '#ffd85e', x + 7, y + 7, 2, 3); }
  }
  function block(g, x, y) {
    R(g, 'rgba(0,0,0,.25)', x, y + 13, 16, 3);
    R(g, '#27304f', x, y, 16, 15); R(g, '#a8a3bf', x + 1, y + 1, 14, 13); R(g, '#d7d3e6', x + 1, y + 1, 14, 2); R(g, '#7f7a99', x + 1, y + 11, 14, 3); R(g, '#7f7a99', x + 4, y + 5, 8, 1); R(g, '#7f7a99', x + 4, y + 8, 8, 1);
  }
  function boulder(g, x, y) {
    R(g, 'rgba(0,0,0,.25)', x + 1, y + 13, 14, 3);
    R(g, '#27304f', x + 3, y, 10, 16); R(g, '#27304f', x, y + 3, 16, 10); R(g, '#8c7f6f', x + 4, y + 1, 8, 13); R(g, '#8c7f6f', x + 1, y + 4, 14, 8);
    R(g, '#b6a994', x + 4, y + 2, 5, 2); R(g, '#b6a994', x + 2, y + 5, 3, 3); R(g, '#655a4f', x + 8, y + 9, 5, 3);
  }
  function plate(g, x, y, on) {
    R(g, '#27304f', x + 2, y + 2, 12, 12); R(g, on ? '#57d8c8' : '#d46a6a', x + 3, y + 3, 10, 10); R(g, on ? '#a3f2e6' : '#f09a9a', x + 3, y + 3, 10, 2);
  }
  function pinwheel(g, x, y, t, spin) {
    const cx = x + 8, cy = y + 7, an = spin ? t * .35 : 0;
    R(g, '#6a4628', x + 7, y + 7, 2, 9);
    for (let i = 0; i < 4; i++) {
      const a = an + i * Math.PI / 2;
      for (let r = 1; r < 7; r++) R(g, i % 2 ? '#ffd85e' : '#ff7d7d', Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 2, 2);
    }
    R(g, '#fff', cx - 1, cy - 1, 2, 2);
  }
  function stone(g, x, y, t) {
    R(g, 'rgba(0,0,0,.25)', x + 2, y + 13, 12, 3);
    R(g, '#27304f', x + 3, y + 2, 10, 13); R(g, '#8f97b8', x + 4, y + 3, 8, 11); R(g, '#c5cae0', x + 4, y + 3, 8, 2);
    const a = Math.sin(t * .08) > 0; R(g, a ? '#ffe36a' : '#ffb84a', x + 6, y + 6, 4, 5); R(g, '#fff', x + 7, y + 7, 2, 2);
  }
  function sign(g, x, y) {
    R(g, '#6a4628', x + 7, y + 8, 2, 8); R(g, '#27304f', x + 1, y + 1, 14, 9); R(g, '#c79a68', x + 2, y + 2, 12, 7); R(g, '#7f5a34', x + 4, y + 4, 8, 1); R(g, '#7f5a34', x + 4, y + 6, 6, 1);
  }
  function door(g, x, y, kind, side) {
    R(g, '#27304f', x, y, 16, 16);
    if (kind === 'gate') { R(g, '#8a6238', x + 1, y + 1, 14, 14); for (let i = 3; i < 15; i += 4) R(g, '#5f4226', x + i, y + 1, 1, 14); R(g, '#3a2b1f', x + 1, y + 7, 14, 2); return; }
    R(g, '#475084', x + 1, y + 1, 14, 14);
    if (kind === 'key') { R(g, '#b6743a', x + 1, y + 1, 14, 14); R(g, '#ffd85e', x + 5, y + 4, 6, 8); R(g, '#27304f', x + 7, y + 6, 2, 4); }
    else if (kind === 'big') { R(g, '#a0325c', x + 1, y + 1, 14, 14); R(g, '#ff9f43', x + 3, y + 3, 10, 10); R(g, '#27304f', x + 7, y + 5, 2, 6); R(g, '#27304f', x + 5, y + 7, 6, 1); }
    else if (kind === 'wind') { for (let i = 2; i < 15; i += 3) R(g, '#22295a', x + i, y + 1, 1, 14); R(g, '#8fe3f0', x + 5, y + 5, 6, 6); R(g, '#27304f', x + 7, y + 7, 2, 2); }
    else { for (let i = 2; i < 15; i += 3) R(g, '#22295a', x + i, y + 1, 1, 14); R(g, '#d46a6a', x + 5, y + 6, 6, 4); }
  }
  function lamp(g, x, y, lit, t) {
    R(g, '#27304f', x + 1, y + 7, 14, 9); R(g, '#b7bdd8', x + 2, y + 8, 12, 7); R(g, '#8a90b5', x + 2, y + 13, 12, 2);
    R(g, '#27304f', x + 3, y + 3, 10, 5); R(g, lit ? '#ffe36a' : '#3a4270', x + 4, y + 4, 8, 3);
    if (lit) { R(g, '#ff9f43', x + 5, y - 3 + Math.sin(t * .3), 6, 7); R(g, '#fff4b0', x + 7, y - 1, 2, 4); }
  }
  // 🚤 ふね
  function boat(g, x, y) {
    R(g, '#27304f', x, y + 4, 16, 9); R(g, '#e8705f', x + 1, y + 5, 14, 3); R(g, '#f7ecd4', x + 2, y + 8, 12, 4); R(g, '#6a4628', x + 7, y - 7, 2, 12); R(g, '#fff', x + 9, y - 6, 5, 7); R(g, '#e0d7ee', x + 9, y - 1, 5, 2);
  }

  return { mk, flip, heroFrames, colon, colonL, NPC, slime, bat, crab, guard, ICON, tile, tower, staffSwing, gust, boss, anchor, shield, chest, block, boulder, plate, pinwheel, stone, sign, door, lamp, boat, R };
})();
