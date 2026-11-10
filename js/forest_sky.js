// ============================================================
// ☁️ そらの しろ（まよいの森の 7つめの ステージ。js/forest.js から よぶ）
//   ・マグマの かざんが へいわに なると、かざんに 🎈 ききゅうが でて のぼれる
//   ・ちずは 高さで 3だん（下の くも＝下層雲・まんなか＝中層雲・うえ＝上層雲）。モンスターは ほんものの 雲と おなじ だんに でる
//   ・🌬 かぜの ゆか（8 うえ・2 した・4 ひだり・6 みぎ）に のると ながされる＝上昇気流で 上の だんへ
//   ・🔔 そらの かね 3つ（その日だけ save.forest.sk）。ならすと「雲と雨1」の おはなし（問題は ださない）。3つで 🌈 にじの はし
//   ・そらのぬし かみなりグリフォン（8問・kind 'sky'）。はじめて たおすと save.skyPeace（ずっと）
//   ・💧 しずくの たび：かざんの おんせんの ゆげから きた しずくが ついてくる → ぬしの あと 雨に なって もりへ かえる
//     → もりの いずみで 1かいだけ「おかえり」（save.shizukuHome）
//   学びの 中身は 11月の「雲と雨1」まとめ（/kumo1.html）と おなじ ことだけ。
// ============================================================
// 記号：x そら（あるけない）　y くもの ゆか　t しろの いしだたみ　I はしら　8 2 4 6 かぜ（うえ・した・ひだり・みぎ）
//       n そらの かね　j にじの はし（かねが 3つ なるまでは x）　q そらのぬし　l ききゅう（かざんへ）
//       f ほんだい（まとめ）　W くもの いずみ　$ たからばこ　P たてふだ　V まちの ひと（へいわ後）
const SKY_ROWS = [
  'xxxxxxxxxxxxxxxxxxx',
  'xnyxxItttqtttIxxxxx',
  'xyyxxtttttttttxxxxx',
  'x28xxxxxxxxxxxxxxxx',
  'x28xxxxxxxxxxxxxxxx',
  'xyyyyyyyyyyyyy$yxxx',
  'xyyyfyyyyyyPyyyyxxx',
  'xxxxxxxxxxxxx2x8xxx',
  'xxxxxxxxxxxxx2x8xxx',
  'xxxyyyyyyyyyyyyyxnx',
  'xxxyyyPyyyyyyy$y6yx',
  'xxxyyyyyyyyyyyyy4yx',
  'xxx8x2xxxxxxxxxxxxx',
  'xxxyyyyyyyyyyyyyyxx',
  'xxxyyWyyyyyyyyyy$xx',
  'ny4yyyyyyPyyyyyyylx',
  'xy6yyyyyyyyyyyyyyxx',
  'xxxxxxxxxxxxxxxxxxx',
];
const SKY_SPOTS = { start: [16, 15], boss: [9, 1], exit: [17, 15] };
const SKY_BELLS = [[0, 15], [17, 9], [1, 1]];          // 下・まんなか・うえ（この じゅんに おはなしが すすむ）
const SKY_BRIDGE = [[9, 3], [9, 4]];
const SKY_WIND = { '8': 'up', '2': 'down', '4': 'left', '6': 'right' };
const VOLCANO_BALLOON = [15, 12];                       // かざんの ききゅう（へいわに なってから）
const VOLCANO_FROM_SKY = [14, 12];
const SKY_SIGNS = {
  '9,15': '🪧 たてふだ「ここは 下の くも（やく 2000mより ひくい ところ）。⬆の かぜは 上に のぼる 空気＝上昇気流。のると 上の だんへ いけるよ／➡ ききゅう（かざんへ）」',
  '6,10': '🪧 たてふだ「ここは まんなかの くも（やく 2000〜7000m）。空気が 上に のぼる わけは 3つ：①山の しゃめんに そって のぼる ②太陽で 地面が あたためられ、その上の 空気が のぼる ③あたたかい 空気が つめたい 空気の 上に のる」',
  '11,6': '🪧 たてふだ「ここは 上の くも（やく 7000mより 高い ところ）。🔔 3つの そらの かねを ならすと、おうざへ 🌈 にじの はしが かかる」',
};
const SKY_VILLAGERS = [
  [7, 13, 'fm_wata', 'わたぐもん「ぼくは 積雲（わた雲）。たてに のびる 雲なんだ。のびすぎると 積乱雲に なっちゃう！」'],
  [12, 14, 'fm_ame', 'あまぐもん「乱層雲は 広い はんいに 長い じかん、しとしと 雨を ふらせるよ」'],
  [4, 16, 'fm_kiri', 'きりぐもん「層雲は 山の あいだに できる、きりに にた 雲。いちばん ひくい ところに いるの」'],
  [9, 10, 'fm_hitsuji', 'ひつじぐもん「高積雲は ひつじ雲。まだらで 灰色の かげが あるのが じまん！」'],
  [12, 11, 'fm_kousou', 'ぶあつぐもん「高層雲は 灰色がかった あつい 雲。空の 広い はんいを おおうんだ」'],
  [6, 5, 'fm_suji', 'すじぐもん「巻雲は すじ雲。はけで こすった ような すじが ぼくの しるし」'],
  [12, 5, 'fm_uroko', 'うろこぐもん「巻積雲は うろこ雲・いわし雲。魚の うろこみたいでしょ？」'],
  [8, 6, 'fm_usu', 'うすぐもん「巻層雲は うす雲。太陽の まわりに 光の わ「かさ」が できたら わたしが いる しるし」'],
];

function forestSkyPeace() { return !!save.skyPeace; }   // 🕊 そらのぬしを たおして そらの しろが へいわに なった（ずっと）
function forestSkyBells() { const f = save.forest; if (!Array.isArray(f.sk)) f.sk = []; return f.sk; }
function forestSkyBridgeOn() { return forestSkyPeace() || forestSkyBells().length >= SKY_BELLS.length; }
function forestSkyMap() {
  const m = forestFixedMap(SKY_ROWS, 'sky', SKY_SPOTS.start, 'x');
  if (forestSkyBridgeOn()) SKY_BRIDGE.forEach(([x, y]) => { m.t[y * m.W + x] = 'j'; });
  return forestVillagers(m, SKY_VILLAGERS, forestSkyPeace());
}
// だん（高さ）：下の くも・まんなか・うえ
function forestSkyZone(y) { return y >= 12 ? 'low' : y >= 7 ? 'mid' : 'high'; }
const SKY_ZONE_NAME = { low: '下の くも', mid: 'まんなかの くも', high: '上の くも' };
function forestSkyMobs() { return SKY_ZONE_MOBS[forestSkyZone(save.forest.y)]; }
// 💧 しずくが ついてくるのは、はじめて へいわに するまで
function forestSkyShizukuOn() { return forestArea() === 'sky' && !forestSkyPeace(); }

// ── めざす ところ ──
function forestSkyGoal() {
  const f = save.forest, today = todayKey();
  if (forestSkyPeace() && !save.shizukuHome) return { at: SKY_SPOTS.exit, h: 2.6, text: '🌈 しずくは もりへ かえった。🧭 いどうで もりの キャンプへ もどって、⛲ いずみへ いってみよう' };
  if (forestSkyPeace() && f.skyDay !== today) return { at: SKY_SPOTS.boss, h: 2.8, text: '🕊 へいわな そらの しろ。おうざの グリフォンに 2かい はなしかけると しょうぶ！' };
  if (f.skyDay === today) return { at: SKY_SPOTS.exit, h: 2.6, text: '☁️ きょうの そらは クリア！ 🎈 ききゅうで かざんへ もどろう' };
  if (!forestSkyBridgeOn()) {
    const sk = forestSkyBells();
    const i = SKY_BELLS.findIndex((b, k) => !sk.includes(k));
    const z = forestSkyZone(SKY_BELLS[i][1]);
    return { at: SKY_BELLS[i], h: 1.9, text: '🎯 ' + SKY_ZONE_NAME[z] + 'の 🔔 そらの かねを ならそう！（' + sk.length + ' / ' + SKY_BELLS.length + '）' +
      (forestSkyZone(f.y) !== z ? '　⬆ かぜに のると 上の だんへ いけるよ' : '') };
  }
  return { at: SKY_SPOTS.boss, h: 2.8, text: '🎯 🌈 にじの はしを わたって、おうざの そらのぬしの ところへ！' };
}
function forestSkyHud() {
  return forestSkyPeace() ? '🕊 へいわな そらの しろ　'
    : '☁️ そらの しろ（' + SKY_ZONE_NAME[forestSkyZone(save.forest.y)] + '）　🔔 かね ' + forestSkyBells().length + ' / ' + SKY_BELLS.length + '　';
}

// ── 🌬 かぜの ゆか（forestArrive から。ながされたら true）──
function forestSkyWind() {
  if (forestArea() !== 'sky') return false;
  const f = save.forest, d = SKY_WIND[forestTile(f.x, f.y)];
  if (!d) return false;
  const [dx, dy] = FOREST_DIRS[d];
  if (!FOREST_WALK.includes(forestTile(f.x + dx, f.y + dy))) return false;
  forestMv = { fx: f.x, fy: f.y, tx: f.x + dx, ty: f.y + dy, t: 0, wind: true };
  forestHeld.length = 0;
  return true;
}
// だんが かわったら しずくが ひとこと（その日 1かいずつ）
let forestSkyLastZone = '';
function forestSkyZoneTalk() {
  if (forestArea() !== 'sky') return;
  const f = save.forest;
  const zz = forestSkyZone(f.y);
  if (zz !== forestSkyLastZone) { forestSkyLastZone = zz; forestHud(); }   // 上の「◯◯の くも」を かえる
  if (!forestSkyShizukuOn()) return;
  if (!Array.isArray(f.shz)) f.shz = [];
  const z = forestSkyZone(f.y);
  if (f.shz.includes(z)) return;
  f.shz.push(z);
  if (z === 'mid') forestSay('💧 しずく「わあ、たかく なってきた！ なんだか からだが ふくらんで、ひんやり してきたよ…」');
  if (z === 'high') forestSay('💧 しずく「さむい…！ まわりの ちいさな つぶと くっついて、わたし ちょっと 大きく なったみたい」');
}

// ── はなしの 画面（むせんと おなじ fz-brief。そら いろ）──
// lines：[[だれ, 'HTML'], …]　だれ：'shizuku' しずく／'bell' かねの せい／'griffin' グリフォン／'' ナレーション
const SKY_BELL_SVG = '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g stroke="' + FMON_INK + '" stroke-width="5" stroke-linejoin="round">' +
  '<path d="M100 26 L100 44" fill="none"/><circle cx="100" cy="22" r="9" fill="#facc15"/>' +
  '<path d="M56 150 C56 96 70 46 100 46 C130 46 144 96 144 150 Q160 156 160 166 L40 166 Q40 156 56 150 Z" fill="#fde047"/>' +
  '<path d="M72 74 C78 62 88 56 98 56" fill="none" stroke="#fff" stroke-width="8" opacity=".6"/>' +
  '<circle cx="100" cy="178" r="12" fill="#f59e0b"/>' +
  '<ellipse cx="84" cy="112" rx="7" ry="9" fill="' + FMON_INK + '" stroke="none"/><ellipse cx="116" cy="112" rx="7" ry="9" fill="' + FMON_INK + '" stroke="none"/>' +
  '<ellipse cx="72" cy="128" rx="8" ry="5" fill="#fb7185" stroke="none" opacity=".6"/><ellipse cx="128" cy="128" rx="8" ry="5" fill="#fb7185" stroke="none" opacity=".6"/>' +
  '<path d="M90 132 Q100 140 110 132" fill="none" stroke-width="4"/></g></svg>';
function forestSkyFace(who) {
  if (who === 'bell') return SKY_BELL_SVG + '<span>そらの かね</span>';
  if (who === 'griffin') return CHARS[FOREST_SKY_KEY](6, 100, 88, {}) + '<span>かみなり<br>グリフォン</span>';
  if (who === 'luna') return '<svg viewBox="0 0 200 200"><text x="100" y="128" font-size="96" text-anchor="middle">🌈</text></svg><span>&nbsp;</span>';
  return CHARS[FOREST_SHIZUKU_KEY](6, 100, 88, {}) + '<span>しずく</span>';
}
function forestSkyTalk(lines, done, head) {
  const old = document.getElementById('fz-brief');
  if (old) old.remove();
  forestHeld.length = 0;
  let i = 0;
  const w = document.createElement('div');
  w.id = 'fz-brief'; w.className = 'sky';
  const show = () => {
    const [who, html] = lines[i];
    w.innerHTML = '<div class="fz-brief-box">' +
      '<div class="fz-brief-face">' + forestSkyFace(who) + '</div>' +
      '<div class="fz-brief-text"><div class="fz-brief-ch">' + (head || '☁️ そらの しろ') + '　' + (i + 1) + ' / ' + lines.length + '</div>' + html +
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
}

// ── 📚 かねの おはなし（11月の「雲と雨1」と おなじ 中身）──
const SKY_FIG_FLOW = '<div class="fz-sky-flow">' +
  ['🌬 空気が 上に のぼる（上昇気流）', '🔽 上は 気圧が ひくい', '🎈 空気が ふくらむ（ぼうちょう）', '❄️ 温度が 下がる', '💧 水蒸気が 水てき・氷の つぶに（凝結）', '☁️ うかんだ つぶ＝雲']
    .map(s => '<span>' + s + '</span>').join('<b>→</b>') + '</div>';
const SKY_FIG_THERMO = '<div class="fz-sky-thermo">' +
  '<div><svg viewBox="0 0 40 120"><rect x="14" y="6" width="12" height="90" rx="6" fill="#fff" stroke="#0c4a6e" stroke-width="2"/><rect x="17" y="40" width="6" height="58" fill="#ef4444"/><circle cx="20" cy="104" r="11" fill="#ef4444" stroke="#0c4a6e" stroke-width="2"/></svg><small>乾球（かんきゅう）<br>20℃</small></div>' +
  '<div><svg viewBox="0 0 40 120"><rect x="14" y="6" width="12" height="90" rx="6" fill="#fff" stroke="#0c4a6e" stroke-width="2"/><rect x="17" y="48" width="6" height="50" fill="#ef4444"/><circle cx="20" cy="104" r="11" fill="#ef4444" stroke="#0c4a6e" stroke-width="2"/><path d="M6 96 Q20 90 34 96 L34 118 Q20 112 6 118 Z" fill="#7dd3fc" opacity=".85" stroke="#0369a1" stroke-width="2"/></svg><small>湿球（しっきゅう）<br>ぬれた 布つき 18℃</small></div>' +
  '</div>';
const SKY_FIG_TABLE = (() => {
  const rows = [['22℃', 100, 91, 82, 74, 66], ['21℃', 100, 91, 82, 73, 65], ['20℃', 100, 91, 81, 73, 64], ['19℃', 100, 90, 81, 72, 63], ['18℃', 100, 90, 80, 71, 62]];
  return '<table class="fz-sky-tbl"><tr><th>乾球＼差</th><th>0℃</th><th>1℃</th><th class="col">2℃</th><th>3℃</th><th>4℃</th></tr>' +
    rows.map(r => '<tr' + (r[0] === '20℃' ? ' class="row"' : '') + '><th>' + r[0] + '</th>' +
      r.slice(1).map((v, i) => '<td' + (r[0] === '20℃' && i === 2 ? ' class="hit"' : '') + '>' + v + '</td>').join('') + '</tr>').join('') + '</table>';
})();
const SKY_FIG_KINDS = '<table class="fz-sky-tbl kinds">' +
  '<tr><th>上層雲<br><small>やく7000m より 上</small></th><td>巻雲（すじ雲）・巻積雲（うろこ雲・いわし雲）・巻層雲（うす雲）</td></tr>' +
  '<tr><th>中層雲<br><small>やく2000〜7000m</small></th><td>高積雲（ひつじ雲）・高層雲</td></tr>' +
  '<tr><th>下層雲<br><small>やく2000m より 下</small></th><td>層積雲・乱層雲（雨雲）・層雲</td></tr>' +
  '<tr><th>たてに のびる</th><td>積雲（わた雲）・積乱雲（入道雲・かみなり雲）</td></tr></table>';
const SKY_LESSONS = [
  // 1 下の かね：雲の できかた
  [['bell', 'カラーン♪ ここは 下の くも。<br>雲が どうやって できるか、おしえて あげよう。'],
   ['bell', '地面の ちかくの 空気が 上へ のぼると、上は 気圧が ひくいので 空気が ふくらむ。ふくらむと、温度が 下がるんだ。'],
   ['bell', 'ひえると、空気に ふくまれていた 水蒸気が 小さな 水てきや 氷の つぶに かわる。これを <b>凝結（ぎょうけつ）</b> と いう。<br>その つぶが 空に うかんでいるのが <b>雲</b> だよ。' + SKY_FIG_FLOW],
   ['shizuku', '…それって、わたしの こと！？ かざんで あたためられて、ゆげに なって、ぐんぐん のぼってきたの！']],
  // 2 まんなかの かね：しつどと かんしつけい
  [['bell', 'カラーン♪ ここは まんなかの くも。<br>空気の しめりけの おはなしだ。'],
   ['bell', '空気が ふくむ ことの できる 水蒸気の いちばん 多い 量を <b>飽和水蒸気量（ほうわすいじょうきりょう）</b> と いう。気温が 高いほど 大きく なるよ。'],
   ['bell', '空気の しめりけの ぐあいが <b>湿度（しつど）</b>。<b>乾湿計（かんしつけい）</b> で はかる。かわいた ままの 乾球と、ぬれた 布を まいた 湿球、2本の 温度計で できているんだ。' + SKY_FIG_THERMO],
   ['bell', '水が じょうはつ する ときは、まわりから 熱（気化熱）を うばう。だから 湿球は 乾球より ひくい 温度に なるんだよ。'],
   ['bell', '乾球が 20℃、湿球が 18℃なら、差は 2℃。湿度表の「20℃の 行」と「2℃の 列」が まじわる ところを 見ると… <b>81％</b>！' + SKY_FIG_TABLE],
   ['bell', '乾球と 湿球の 差が 小さいほど 湿度は 高く、差が 大きいほど 湿度は ひくい。おぼえておいてね。'],
   ['shizuku', 'へぇ…！ じゃあ わたしたち 水蒸気が いっぱいの 空気は、湿度が 高いんだね。']],
  // 3 上の かね：雲の しゅるい
  [['bell', 'カラーン♪ ここは 上の くも。<br>雲は、かたちと できる 高さで <b>10しゅるい</b> に わけられるんだ。' + SKY_FIG_KINDS],
   ['bell', 'この だんに いる すじぐもん・うろこぐもん・うすぐもんは、上層雲の なかま。下の くもに いた わたぐもんは、たてに のびる 積雲だよ。'],
   ['bell', 'おうざに そびえる 入道雲は <b>積乱雲</b>。積雲が たてに 大きく のびた 雲で、てっぺんは 13000mを こえる ことも ある。そこに そらのぬしが いる…。'],
   ['shizuku', 'かねが 3つ なったら、にじの はしが かかるんだよね。ルナ、いっしょに いこう！']],
];

// ── しらべる（forestInteract から。あつかったら true）──
function forestSkyInteract(x, y, t) {
  const a = forestArea(), f = save.forest;
  // 🌋 かざんの ききゅう → そらの しろ
  if (a === 'volcano' && t === 'l') {
    if (forestSkyPeace()) { forestGoArea('sky', SKY_SPOTS.start, 'left', '🎈 ききゅうで へいわな そらの しろに ついた！'); return true; }
    forestSkyTalk([
      ['', '🎈 マグマの あたたかい かぜで ふくらむ ききゅうだ。…あれ？ おんせんの ゆげの なかから、ちいさな こえが する。'],
      ['shizuku', 'こんにちは！ わたし、しずく。もりの いずみから きたの。<br>あつくて ゆげに なって、ここまで ながされて きちゃった…。'],
      ['shizuku', 'もりは ずっと 雨が ふらなくて、いずみが へっているの。そらの しろの ぬしが かみなりで あばれて、雲たちが ばらばらに なっちゃったんだって。'],
      ['shizuku', 'おねがい、いっしょに そらへ のぼって！ わたし、もりに 雨を とどけたいの。'],
    ], () => forestGoArea('sky', SKY_SPOTS.start, 'left', '🎈 ききゅうで そらの しろに ついた！ 💧 しずくが ついてくる。3つの 🔔 かねを ならそう'), '🎈 ききゅう');
    return true;
  }
  if (a !== 'sky') return false;
  if (t === 'l') { forestGoArea('volcano', VOLCANO_FROM_SKY, 'left', '🎈 ききゅうで マグマの かざんに おりてきた。'); return true; }
  if (t === 'n') {
    const idx = SKY_BELLS.findIndex(([bx, by]) => bx === x && by === y);
    const sk = forestSkyBells();
    if (idx < 0) return false;
    if (typeof fmJingle === 'function') fmJingle('heal');
    if (sk.includes(idx) || forestSkyPeace()) {
      forestSkyTalk(SKY_LESSONS[idx], null, '🔔 もういちど きく');
      return true;
    }
    sk.push(idx);
    persist(); forestLoad(); forestHud(); forestDrawMap();
    forestFx('heal');
    forestSkyTalk(SKY_LESSONS[idx], () => forestSay(forestSkyBridgeOn()
      ? '🌈 3つの かねの おとが そらに ひびいて…おうざへ にじの はしが かかった！'
      : '🔔 そらの かねが なった！（' + sk.length + ' / ' + SKY_BELLS.length + '）あと ' + (SKY_BELLS.length - sk.length) + 'こ！'), '🔔 そらの かね ' + sk.length + ' / ' + SKY_BELLS.length);
    return true;
  }
  if (t === 'q') {
    if (forestSkyPeace()) {
      if (f.skyDay === todayKey()) { forestSay('⚡ グリフォン「いつも ありがとう。乱層雲は ゆっくり のぼって 広く 長く しとしと、積乱雲は いっきに のぼって せまく みじかく はげしい 雨。また おいで」'); return true; }
      if (!forestNushiAsk) {
        forestNushiAsk = true;
        forestSay('⚡ グリフォン「そらを へいわに してくれて ありがとう！ また うでだめしを するかい？（もう いちど はなしかけると しょうぶ）」');
        return true;
      }
      forestNushiAsk = false; persist();
      forestSay('⚡ かみなりグリフォンが つばさを ひろげた！');
      forestEncounter(() => startForestBattle('sky'));
      return true;
    }
    if (f.skyDay === todayKey()) { forestSay('⚡ そらのぬしは もう たおしたよ。また あした あおう！'); return true; }
    persist();
    forestSkyTalk([
      ['griffin', 'だれだ！ ここまで のぼって くるとは…。'],
      ['griffin', 'みんな わたしの かみなりを こわがって にげていく。おまえも にげるが いい！ ゴロゴロ…！'],
      ['shizuku', 'ルナ、まけないで！'],
    ], () => forestEncounter(() => startForestBattle('sky')), '⚡ そらのぬし');
    return true;
  }
  if (t === 'f') {
    forestSkyTalk([
      ['bell', '📖 そらの ほんだい。3つの かねの おはなしが まとめて あるよ。' + SKY_FIG_FLOW],
      ['bell', '湿度は 乾湿計で はかる。乾球20℃・湿球18℃ → 差2℃ → <b>81％</b>。' + SKY_FIG_TABLE],
      ['bell', '雲の 10しゅるい。' + SKY_FIG_KINDS +
        '<button class="fz-sky-link" onclick="event.stopPropagation(); window.open(\'/kumo1.html\', \'_blank\')">📖 「雲と雨1」の まとめページを ひらく</button>'],
    ], null, '📖 そらの ほんだい');
    return true;
  }
  if (t === 'P') { forestSay(SKY_SIGNS[x + ',' + y] || '🪧 たてふだ'); return true; }
  if (t === 'x') {
    if (SKY_BRIDGE.some(([bx, by]) => bx === x && by === y)) { forestSay('🌈 ここに うっすら にじの あとが ある…。3つの 🔔 そらの かねを ならすと はしが かかるよ。'); return true; }
    forestSay('☁️ ここから さきは そらだ。おちたら たいへん！');
    return true;
  }
  if (t === 'I') { forestSay('しろい いしの りっぱな はしらだ。'); return true; }
  return false;
}

// ── たたかいの あと（forestEndBattle から）。はじめて へいわ → おわかれの はなしを 森に もどったら だす ──
function forestSkyWinHtml(peaceNew) {
  if (!peaceNew) return '';
  return '<div class="fz-sky-story">' +
    '<div style="display:flex; justify-content:center; gap:6px; align-items:flex-end;">' + CHARS[FOREST_SKY_KEY](6, 100, 86, {}) + CHARS[FOREST_SHIZUKU_KEY](6, 100, 62, {}) + '</div>' +
    '⚡ グリフォン「…まけた。だれかと こんなに むきあったのは ひさしぶりだ」<br>' +
    '<span style="font-size:13px;">🕊 そらの しろが へいわに なった！ 雲の モンスターが まちの ひとに なったよ</span></div>';
}
function forestSkyPending() {
  const f = save.forest;
  if (!f || f.skyTalk !== 'farewell' || forestArea() !== 'sky') return;
  delete f.skyTalk; persist();
  forestSkyTalk([
    ['griffin', 'わたしの かみなりを こわがって、みんな はなれて いった。だから ずっと ひとりで おこっていたんだ…。'],
    ['shizuku', 'グリフォンさん、さみしかったんだね。でも かみなりも 雨も、もりの いのちを そだてる だいじな ちからだよ。'],
    ['griffin', '…ありがとう。もう むやみに あばれない。雲の こたちとも なかよく しよう。'],
    ['shizuku', 'ルナ、わたし… まわりの 子と くっついて、こんなに おもく なっちゃった。もう 空に うかんで いられないみたい。'],
    ['shizuku', 'だから、雨に なって もりへ かえるね。もりの いずみで まってる。<br>…いっしょに のぼってくれて、ありがとう！'],
    ['luna', 'しずくは きらきら ひかりながら、もりの ほうへ おちていった。<br>……とおくの もりに、やさしい 雨が ふりはじめた。🌈'],
  ], () => { forestPalReset(); forestSay('🌈 しずくは 雨に なって もりへ かえった。もりの ⛲ いずみに いってみよう'); }, '💧 しずくの たび');
}
// 🌲 もりの いずみで 1かいだけ（そらが へいわに なった あと）
function forestSkySpring() {
  if (forestArea() !== 'field' || !forestSkyPeace() || save.shizukuHome) return false;
  save.shizukuHome = true;
  save.hp = maxHp(); persist(); forestHud();
  forestFx('heal');
  if (typeof fmJingle === 'function') fmJingle('heal');
  forestSkyTalk([
    ['luna', '⛲ いずみが なみなみと あふれている。もりの 木も くさも、雨に ぬれて つやつや ひかっている。'],
    ['shizuku', '…おかえり、ルナ。ちゃんと もりに かえって これたよ。'],
    ['shizuku', 'いつか また あたたかく なったら、ゆげに なって 空へ のぼるね。そのときは また いっしょに いこうね。'],
    ['luna', '💧 しずくの こえが きこえた きが した。HP が ぜんかいふく した！'],
  ], null, '💧 しずくの たび　おわり');
  return true;
}

// ── 3D（forest3DInit の build から。c：THREE・world・inst など）──
function forestSkyBalloon3D(c, x, y) {
  const { THREE, world } = c;
  const nodepth = o => { o.material.depthWrite = false; o.renderOrder = 3; return o; };   // ルナを かくさない
  const g = new THREE.Group(); g.position.set(x, 0, y);
  const sc = document.createElement('canvas'); sc.width = 128; sc.height = 64;
  const sg = sc.getContext('2d');
  ['#ef4444', '#facc15', '#38bdf8', '#facc15'].forEach((cl, i) => { sg.fillStyle = cl; for (let k = 0; k < 4; k++) sg.fillRect((k * 4 + i) * 8, 0, 8, 64); });
  const tex = new THREE.CanvasTexture(sc); tex.colorSpace = THREE.SRGBColorSpace;
  const env = nodepth(new THREE.Mesh(new THREE.SphereGeometry(0.5, 18, 12), new THREE.MeshLambertMaterial({ map: tex })));
  env.scale.set(1, 1.15, 1); env.position.y = 1.3; g.add(env);
  const basket = nodepth(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.42), new THREE.MeshLambertMaterial({ color: 0x92400e })));
  basket.position.y = 0.2; g.add(basket);
  [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([dx, dz]) => {
    const r = nodepth(new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.62, 4), new THREE.MeshBasicMaterial({ color: 0x78350f })));
    r.position.set(dx * 1.2, 0.66, dz * 1.2); g.add(r);
  });
  world.add(g);
  (world.userData.balloons = world.userData.balloons || []).push(g);
  return g;
}
function forestSkyBuild3D(c) {
  const { THREE, scene, world, hemi, sun, water, inst, M, col, mat } = c;
  const calm = forestSkyPeace();
  const skyC = calm ? 0xbae6fd : 0x93c5fd;
  scene.background = new THREE.Color(skyC); scene.fog = new THREE.Fog(skyC, 16, 32);
  hemi.intensity = calm ? 1.45 : 1.25; hemi.color.set(0xffffff); hemi.groundColor.set(calm ? 0xfde68a : 0x93c5fd);
  sun.intensity = calm ? 1.5 : 1.2;
  water.visible = false;
  const rnd = forestRand(forestSeed('sky'));
  const sk = forestSkyBells();
  const floor = [], stone = [], puffs = [], seaPuffs = [];
  const isFloor = (x, y) => 'yWP$nVflq'.includes(fz.get(x, y)) || 'tIq'.includes(fz.get(x, y));
  // 下の 雲の うみ
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshLambertMaterial({ color: 0xf8fafc, emissive: 0xe0f2fe, emissiveIntensity: 0.5 }));
  sea.rotation.x = -Math.PI / 2; sea.position.set(fz.W / 2, -2.6, fz.H / 2); world.add(sea);
  const windTiles = [];
  const R = 6;
  for (let y = -R; y < fz.H + R; y++) for (let x = -R; x < fz.W + R; x++) {
    const t = fz.get(x, y);
    if (t === 'x' || SKY_WIND[t] || t === 'j') {
      if (rnd() < 0.16) seaPuffs.push([M(x + (rnd() - 0.5), -1.7 - rnd() * 0.6, y + (rnd() - 0.5), 1 + rnd(), 0.6 + rnd() * 0.4, 1 + rnd()), col('#ffffff', rnd, 0.04)]);
      if (SKY_WIND[t]) windTiles.push([x, y, SKY_WIND[t]]);
      continue;
    }
    if ('tIq'.includes(t)) {
      stone.push([M(x, -0.15, y, 1, 0.3, 1), col((x + y) % 2 ? '#f5f5f4' : '#e7e5e4', rnd, 0.03)]);
      stone.push([M(x, -0.42, y, 0.9, 0.3, 0.9), col('#cbd5e1', rnd, 0.03)]);
    } else {
      floor.push([M(x, -0.17, y, 1, 0.34, 1), col('#ffffff', rnd, 0.025)]);
      // ふちは まるい もこもこ（そらに めんした ところ）
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const n = fz.get(x + dx, y + dy);
        if (n === 'x' || n === 'j' || SKY_WIND[n]) for (let k = 0; k < 2; k++) {
          const s = 0.38 + rnd() * 0.16, o = (rnd() - 0.5) * 0.7;
          puffs.push([M(x + dx * 0.46 + (dy ? o : 0), -0.2 + rnd() * 0.06, y + dy * 0.46 + (dx ? o : 0), s * 1.1, s * 0.8, s * 1.1), col('#ffffff', rnd, 0.04)]);
        }
      });
      if (t === 'y' && rnd() < 0.1) puffs.push([M(x + (rnd() - 0.5) * 0.6, 0.0, y + (rnd() - 0.5) * 0.6, 0.32, 0.22, 0.32), col('#ffffff', rnd, 0.03)]);
    }
    if (t === 'I') {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 2.0, 12), mat({ color: 0xf8fafc })); p.position.set(x, 1.0, y); p.castShadow = true; world.add(p);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.16, 0.7), mat({ color: 0xfacc15 })); cap.position.set(x, 2.06, y); world.add(cap);
    }
    if (t === 'q') {
      const gold = mat({ color: 0xfacc15 }), blue = mat({ color: 0x38bdf8 });
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.6), blue); seat.position.set(x, 0.15, y - 0.25); world.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.6, 0.16), gold); back.position.set(x, 0.8, y - 0.55); world.add(back);
    }
    if (t === 'n') {
      const idx = SKY_BELLS.findIndex(([bx, by]) => bx === x && by === y);
      const on = calm || sk.includes(idx);
      const wood = mat({ color: 0xf8fafc });
      [-0.32, 0.32].forEach(dx => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.05, 6), wood); p.position.set(x + dx, 0.52, y); world.add(p); });
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.1), mat({ color: 0xfacc15 })); bar.position.set(x, 1.06, y); world.add(bar);
      const bell = new THREE.Group(); bell.position.set(x, 1.0, y);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.24, 0.32, 16), new THREE.MeshLambertMaterial({
        color: on ? 0xfacc15 : 0xa16207, emissive: on ? 0xf59e0b : 0x000000, emissiveIntensity: on ? 0.55 : 0 }));
      body.position.y = -0.2; bell.add(body);
      const clap = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), mat({ color: 0x78350f })); clap.position.y = -0.38; bell.add(clap);
      bell.userData.on = on; world.add(bell);
      (world.userData.bells = world.userData.bells || []).push(bell);
    }
    if (t === 'f') {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.62, 8), mat({ color: 0xfacc15 })); post.position.set(x, 0.31, y); world.add(post);
      const top = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.42), mat({ color: 0x0ea5e9 })); top.position.set(x, 0.66, y); top.rotation.x = 0.35; world.add(top);
      [-0.13, 0.13].forEach(dx => { const pg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.34), mat({ color: 0xffffff })); pg.position.set(x + dx, 0.71, y); pg.rotation.x = 0.35; pg.rotation.z = dx > 0 ? -0.08 : 0.08; world.add(pg); });
    }
    if (t === '$') c.chestAt(x, y);
    if (t === 'W') c.springAt(x, y);
    if (t === 'P') {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.75, 0.1), mat({ color: 0x78350f })); post.position.set(x, 0.37, y); world.add(post);
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.36, 0.06), mat({ color: 0xd6a35c })); board.position.set(x, 0.66, y + 0.04); world.add(board);
    }
    if (t === 'l') forestSkyBalloon3D(c, x, y);
    if (t === 'V') { const v = (fz.villagers || []).find(([vx, vy]) => vx === x && vy === y); if (v) c.standSprite(v[2], x, y, 1.2); }
  }
  // 雲は すこし じぶんで ひかる（かげで 灰色の いしに 見えないように）
  const cloudMat = () => new THREE.MeshLambertMaterial({ emissive: 0xe0f2fe, emissiveIntensity: 0.42 });
  inst(new THREE.BoxGeometry(1, 1, 1), cloudMat(), floor);
  inst(new THREE.BoxGeometry(1, 1, 1), mat(), stone);
  inst(new THREE.SphereGeometry(0.5, 16, 12), cloudMat(), puffs);
  inst(new THREE.SphereGeometry(0.5, 16, 12), new THREE.MeshLambertMaterial({ emissive: 0xffffff, emissiveIntensity: 0.55, transparent: true, opacity: 0.92 }), seaPuffs);
  // 🌈 にじの はし（かかる まえは うっすら）
  const bridgeOn = forestSkyBridgeOn();
  const rainbow = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#6366f1', '#a855f7'];
  SKY_BRIDGE.forEach(([bx, by]) => rainbow.forEach((cl, i) => {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 1.0), new THREE.MeshLambertMaterial({
      color: cl, emissive: cl, emissiveIntensity: 0.25, transparent: true, opacity: bridgeOn ? 0.95 : 0.16, depthWrite: bridgeOn }));
    s.position.set(bx - 0.39 + i * 0.13, -0.04, by); world.add(s);
  }));
  // 🌬 かぜの ゆか（やじるしが ながれる）
  const wc = document.createElement('canvas'); wc.width = 64; wc.height = 64;
  { const g = wc.getContext('2d'); g.fillStyle = 'rgba(165,243,252,.55)'; g.fillRect(0, 0, 64, 64);
    g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 7; g.lineCap = 'round'; g.lineJoin = 'round';
    [16, 48].forEach(yy => { g.beginPath(); g.moveTo(14, yy + 10); g.lineTo(32, yy - 8); g.lineTo(50, yy + 10); g.stroke(); }); }
  const windTex = new THREE.CanvasTexture(wc); windTex.colorSpace = THREE.SRGBColorSpace;
  windTex.wrapS = windTex.wrapT = THREE.RepeatWrapping;
  const windGeo = new THREE.PlaneGeometry(0.94, 0.94); windGeo.rotateX(-Math.PI / 2);
  const windMat = new THREE.MeshBasicMaterial({ map: windTex, transparent: true, depthWrite: false });
  const motes = [];
  windTiles.forEach(([x, y, d]) => {
    const m = new THREE.Mesh(windGeo, windMat);
    m.position.set(x, -0.08, y); m.rotation.y = { up: 0, left: Math.PI / 2, down: Math.PI, right: -Math.PI / 2 }[d];
    world.add(m);
    for (let k = 0; k < 2; k++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      s.userData = { x, y, d: FOREST_DIRS[d], p: k / 2 + rnd() * 0.2 }; world.add(s); motes.push(s);
    }
  });
  world.userData.skyTick = (dt, t) => {
    windTex.offset.y = (windTex.offset.y - dt * 1.4) % 1;
    motes.forEach((s, i) => {
      const u = s.userData, p = (t * 0.9 + u.p) % 1;
      s.position.set(u.x + u.d[0] * (p - 0.5), 0.12 + Math.sin(p * Math.PI) * 0.25, u.y + u.d[1] * (p - 0.5));
    });
    (world.userData.bells || []).forEach((b, i) => { b.rotation.z = b.userData.on ? Math.sin(t * 2.6 + i) * 0.18 : 0; });
  };
}
