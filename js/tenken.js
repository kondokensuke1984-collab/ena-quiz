// ============================================================
// 🔧 点検モード（大人だけ）：rpg.html?tenken=1
//   ・この ページの きろく（セーブ・メダル・ずかん・島の ごほうびの しるし など）は ぜんぶ メモリの 中だけ。
//     ほんものの localStorage には 1つも 書かない（とじる・よみなおすと もとどおり）。読むのは ほんものから（いまの すすみぐあいで ためせる）
//   ・サーバーへ おくる もの（/api/ への POST）も おくらない
//   ・rpg.html?tenken=1#base で ひらくと すぐ アジトの さくせんへ
//   ・下の「🔧 点検」から：アジトへ（じょうけん なし）・みはりを とめる・みつからない・たたかいを かったことに・HP かいふく
//   ・ほかの スクリプトより さきに よむ（rpg.html の いちばん はじめの <script>）
// ============================================================
const TENKEN = { on: /[?&]tenken=1(&|$)/.test(location.search), freeze: false, ghost: false };
(function () {
  if (!TENKEN.on) return;
  // ── きろくは メモリだけ ──
  const real = window.localStorage, P = Storage.prototype;
  const get = P.getItem, set = P.setItem, rm = P.removeItem, clr = P.clear;
  const mem = new Map();
  let cleared = false;
  P.getItem = function (k) {
    if (this !== real) return get.call(this, k);
    if (mem.has(k)) return mem.get(k);
    return cleared ? null : get.call(this, k);
  };
  P.setItem = function (k, v) { if (this !== real) return set.call(this, k, v); mem.set(String(k), String(v)); };
  P.removeItem = function (k) { if (this !== real) return rm.call(this, k); mem.set(String(k), null); };
  P.clear = function () { if (this !== real) return clr.call(this); mem.clear(); cleared = true; };
  // ── サーバーへは おくらない ──
  const f0 = window.fetch.bind(window);
  window.fetch = function (url, opt) {
    const m = ((opt && opt.method) || 'GET').toUpperCase();
    if (m !== 'GET' && /\/api\//.test(String(url))) return Promise.resolve(new Response('{"ok":true,"tenken":true}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
    return f0(url, opt);
  };
  document.title = '🔧 点検 ' + document.title;
  window.addEventListener('DOMContentLoaded', () => {
    const st = document.createElement('style');
    st.textContent =
      '#tk-btn{ position:fixed; left:50%; transform:translateX(-50%); bottom:calc(8px + env(safe-area-inset-bottom)); z-index:9998; border:2px solid #fff; border-radius:999px; background:#b91c1c; color:#fff; font-weight:800; font-size:13px; padding:7px 14px; box-shadow:0 3px 0 rgba(0,0,0,.3); }' +
      '#tk-panel{ position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; padding:16px; }' +
      '#tk-panel .tk-box{ width:min(94vw,400px); max-height:90vh; overflow-y:auto; background:#fff; border:3px solid #b91c1c; border-radius:16px; padding:14px; font-size:14px; color:#1e1b4b; }' +
      '#tk-panel h3{ margin:0; font-size:17px; font-weight:800; color:#b91c1c; }' +
      '#tk-panel .tk-note{ font-size:12px; color:#64748b; margin:2px 0 10px; line-height:1.6; }' +
      '#tk-panel .tk-h{ font-size:12px; font-weight:800; color:#64748b; margin:10px 0 4px; }' +
      '#tk-panel button.tk{ display:block; width:100%; text-align:left; margin-top:6px; padding:10px 12px; border:2px solid #e2e8f0; border-radius:12px; background:#f8fafc; font-weight:800; font-size:14px; color:#1e1b4b; }' +
      '#tk-panel button.tk.on{ border-color:#16a34a; background:#dcfce7; }' +
      '#tk-panel button.tk.end{ border-color:#b91c1c; color:#b91c1c; }';
    document.head.appendChild(st);
    const b = document.createElement('button');
    b.id = 'tk-btn'; b.textContent = '🔧 点検モード';
    b.onclick = tenkenOpen;
    document.body.appendChild(b);
    // #base／#volcano：ひらいたら すぐ その ステージへ（もんだいの よみこみを まってから）
    if (location.hash === '#base' || location.hash === '#volcano') {
      const t0 = Date.now(), h = location.hash;
      const iv = setInterval(() => {
        const ready = typeof STAGES !== 'undefined' && STAGES.length && typeof tenkenBase === 'function' && document.getElementById('title-hero') && document.getElementById('title-hero').innerHTML;
        if (!ready && Date.now() - t0 < 15000) return;
        clearInterval(iv);
        if (ready) { if (h === '#volcano') tenkenVolcano(false); else tenkenBase(false); }
      }, 200);
    }
  });
})();

function tenkenOpen() {
  tenkenClose();
  const w = document.createElement('div');
  w.id = 'tk-panel';
  w.onclick = e => { if (e.target === w) tenkenClose(); };
  const inBattle = typeof bt !== 'undefined' && bt && document.querySelector('#scr-battle.on');
  const tg = (on, label, fn) => '<button class="tk' + (on ? ' on' : '') + '" onclick="' + fn + '">' + (on ? '✅ ' : '⬜ ') + label + '</button>';
  w.innerHTML = '<div class="tk-box">' +
    '<h3>🔧 点検モード（大人だけ）</h3>' +
    '<div class="tk-note">ここで した ことは きろくに のこりません（セーブ・メダル・ずかん・島は かわりません）。とじると もとどおり。</div>' +
    (inBattle ? '<div class="tk-h">⚔️ たたかい</div>' +
      '<button class="tk" onclick="tenkenWin(true)">🏆 かったことに する</button>' +
      '<button class="tk" onclick="tenkenWin(false)">💥 まけたことに する</button>' : '') +
    '<div class="tk-h">🌋 マグマの かざん</div>' +
    '<button class="tk" onclick="tenkenVolcano(false)">▶ かざんの いりぐちから（クリスタル 0こ）</button>' +
    '<button class="tk" onclick="tenkenVolcano(\'boss\')">▶ クリスタル 3こ そろえて ぬしの まえへ</button>' +
    '<button class="tk" onclick="tenkenVolcano(\'peace\')">▶ へいわに なった あとの かざん</button>' +
    '<div class="tk-h">🏜 さばくの アジト</div>' +
    '<button class="tk" onclick="tenkenBase(false)">▶ さくせんを さいしょから（むせんから）</button>' +
    '<button class="tk" onclick="tenkenBase(\'boss\')">▶ 3にん たすけた ところから（だんちょうの まえ）</button>' +
    '<button class="tk" onclick="tenkenBase(\'heli\')">▶ だんちょうを たおした ところから（ヘリポートへ）</button>' +
    '<button class="tk" onclick="tenkenBase(\'peace\')">▶ へいわに なった あとの まち</button>' +
    tg(TENKEN.freeze, 'みはりを とめる', 'tenkenToggle(\'freeze\')') +
    tg(TENKEN.ghost, 'みつからない（とうめい）', 'tenkenToggle(\'ghost\')') +
    '<div class="tk-h">🌲 まよいの森</div>' +
    '<button class="tk" onclick="tenkenWarp()">🧭 どこへでも いく（じょうけん なし）</button>' +
    '<button class="tk" onclick="tenkenHeal()">❤ HP ぜんかいふく</button>' +
    '<button class="tk end" onclick="tenkenEnd()">✖ 点検を おわる（ふつうの がめんへ）</button>' +
  '</div>';
  document.body.appendChild(w);
}
function tenkenClose() { const w = document.getElementById('tk-panel'); if (w) w.remove(); }
function tenkenToggle(k) { TENKEN[k] = !TENKEN[k]; tenkenOpen(); }
function tenkenEnd() { location.href = location.pathname; }
function tenkenHeal() { save.hp = maxHp(); persist(); if (typeof forestHud === 'function' && document.getElementById('fz-lv')) forestHud(); tenkenClose(); }
function tenkenWin(win) {
  tenkenClose();
  if (!bt) return;
  if (win) { bt.correct = bt.queue.length; bt.hp = 0; } else bt.correct = 0;
  endBattle(win);
}
// 森に はいって いなければ はいる（ぜんぶの ステージを ひらいた ことに する）
function tenkenForest() {
  if (!save) startGame();
  save.forestPeace = true; save.umiPeace = true; save.basePeace = true;
  if (!document.querySelector('#scr-forest.on')) enterForest();
  forestWarpClose();
  ['fz-brief', 'fz-mission', 'fz-dex'].forEach(id => { const e = document.getElementById(id); if (e) e.remove(); });
  forestBusy = false;
}
function tenkenWarp() { tenkenClose(); tenkenForest(); forestWarpOpen(false); }
function tenkenBase(step) {
  tenkenClose();
  tenkenForest();
  const f = save.forest;
  delete f.base;
  save.basePeace = step === 'peace';
  const b = forestBaseState();
  if (step === 'boss' || step === 'heli') {
    b.t0 = Date.now(); b.rescued = BASE_CELLS.map((_, i) => i); b.boss = step === 'heli';
    persist();
    return forestGoArea('base', step === 'heli' ? [12, 2] : [12, 4], 'up', '🔧 点検：' + (step === 'heli' ? 'うえの ヘリポートを しらべると せいこう' : 'めのまえの だんちょうを しらべると しょうぶ'));
  }
  persist();
  forestBaseGo();
}
function tenkenVolcano(step) {
  tenkenClose();
  tenkenForest();
  const f = save.forest;
  save.volcanoPeace = step === 'peace';
  delete f.volcanoDay;
  f.vc = step === 'boss' || step === 'peace' ? [0, 1, 2] : [];
  persist();
  if (step === 'boss') return forestGoArea('volcano', [9, 2], 'up', '🔧 点検：めのまえの かざんのぬしを しらべると しょうぶ');
  if (step === 'peace') return forestGoArea('volcano', VOLCANO_SPOTS.start, 'up', '🔧 点検：🕊 へいわに なった マグマの かざん');
  forestGoArea('volcano', VOLCANO_SPOTS.start, 'up', '🌋 マグマの かざんへ ようこそ！ 3つの こおりの クリスタルを しらべよう。');
}
