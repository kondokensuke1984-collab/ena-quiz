// 💬 かぞくチャット（api/chat.js）。トップ画面と そらとび の どちらからも よみこむ。
//   ボタン：<button data-chat-open>…<span data-chat-badge hidden></span></button>
//   AnrinoChat.open() で 画面が ひらく。赤い まるじるし（data-chat-badge）は 10秒ごとに 新着を しらべる。
(function () {
  'use strict';
  var API = '/api/chat';
  var NAME = { anri: 'あんり', rino: 'りの', mitsuki: 'みつき', kensuke: 'けんすけ', yusei: 'ゆうせい' };
  var STAMPS = ['👍', '❤️', '😂', '🙏', '🎉', '🍙'];
  var READ_KEY = 'ena_chat_read';

  var items = [];        // 古い → 新しい
  var lastT = 0;
  var overlay = null, listEl = null, inputEl = null, noteEl = null;
  var timer = null, sending = false;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function me() {
    try {
      var p = (JSON.parse(localStorage.getItem('ena_island_save_v1') || '{}') || {}).player;
      return NAME[p] ? p : null;
    } catch (_) { return null; }
  }
  function setMe(p) {
    try {
      var s = JSON.parse(localStorage.getItem('ena_island_save_v1') || '{}') || {};
      s.player = p;
      localStorage.setItem('ena_island_save_v1', JSON.stringify(s));
    } catch (_) {}
  }
  function readT() { return Number(localStorage.getItem(READ_KEY)) || 0; }
  function markRead() { if (lastT) localStorage.setItem(READ_KEY, String(lastT)); updateBadge(); }

  function unread() {
    var m = me(), r = readT();
    return items.filter(function (x) { return x.t > r && x.who !== m; }).length;
  }
  function updateBadge() {
    var n = unread();
    document.querySelectorAll('[data-chat-badge]').forEach(function (el) {
      el.hidden = n === 0;
      el.textContent = n > 9 ? '9+' : String(n);
    });
  }

  function fetchNew() {
    return fetch(API + (lastT ? '?since=' + lastT : ''), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.items) return false;
        var fresh = d.items.filter(function (x) { return x.t > lastT; }).reverse();
        if (!fresh.length) return false;
        items = items.concat(fresh).slice(-200);
        lastT = items[items.length - 1].t;
        return true;
      })
      .catch(function () { return false; });
  }

  function fmtTime(t) {
    var d = new Date(t), n = new Date();
    var hm = d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2);
    return d.toDateString() === n.toDateString() ? hm : (d.getMonth() + 1) + '/' + d.getDate() + ' ' + hm;
  }

  function render() {
    if (!listEl) return;
    var m = me();
    var atBottom = listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight < 80;
    if (!items.length) { listEl.innerHTML = '<p class="ac-empty">まだ なにも ないよ。さいしょの メッセージを おくってみよう</p>'; return; }
    listEl.innerHTML = items.map(function (x) {
      var mine = x.who === m;
      var body = x.stamp ? '<span class="ac-stamp">' + esc(x.stamp) + '</span>' : '<span class="ac-bubble">' + esc(x.text).replace(/\n/g, '<br>') + '</span>';
      return '<div class="ac-row ' + (mine ? 'ac-me' : 'ac-other') + '">' +
        (mine ? '' : '<span class="ac-name">' + esc(NAME[x.who] || '?') + '</span>') +
        '<div class="ac-line">' + (mine ? '<span class="ac-time">' + fmtTime(x.t) + '</span>' + body : body + '<span class="ac-time">' + fmtTime(x.t) + '</span>') + '</div></div>';
    }).join('');
    if (atBottom || !render.done) listEl.scrollTop = listEl.scrollHeight;
    render.done = true;
  }

  function send(payload) {
    var who = me();
    if (!who || sending) return;
    sending = true;
    payload.action = 'add';
    payload.who = who;
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) { noteEl.textContent = res.d && res.d.error === 'too long' ? '200もじまで だよ' : 'おくれなかったよ。もういちど ためしてね'; return; }
        noteEl.textContent = '';
        if (payload.text !== undefined) inputEl.value = '';
        return fetchNew().then(function () { markRead(); render(); });
      })
      .catch(function () { noteEl.textContent = 'ネットに つながっていないよ'; })
      .then(function () { sending = false; });
  }

  function css() {
    if (document.getElementById('ac-style')) return;
    var s = document.createElement('style');
    s.id = 'ac-style';
    s.textContent =
      '.ac-ov{position:fixed;inset:0;z-index:99999;background:#e8f0e4;display:flex;flex-direction:column;font-family:"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif;color:#222;-webkit-user-select:text;user-select:text}' +
      '.ac-ov[hidden]{display:none}' +
      '.ac-head{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#06c755;color:#fff;font-weight:800;font-size:17px;padding-top:max(10px,env(safe-area-inset-top))}' +
      '.ac-head span{flex:1}.ac-head button{font:inherit;font-size:14px;background:rgba(255,255,255,.2);color:#fff;border:0;border-radius:8px;padding:6px 12px;cursor:pointer}' +
      '.ac-list{flex:1;overflow-y:auto;padding:12px 12px 6px;-webkit-overflow-scrolling:touch}' +
      '.ac-empty{text-align:center;color:#667;margin-top:40px;font-size:14px}' +
      '.ac-row{margin:0 0 10px;display:flex;flex-direction:column}.ac-me{align-items:flex-end}.ac-other{align-items:flex-start}' +
      '.ac-name{font-size:12px;color:#556;margin:0 0 2px 4px}' +
      '.ac-line{display:flex;align-items:flex-end;gap:5px;max-width:92%}' +
      '.ac-bubble{padding:9px 12px;border-radius:16px;font-size:16px;line-height:1.5;word-break:break-word;background:#fff}' +
      '.ac-me .ac-bubble{background:#8de055}' +
      '.ac-stamp{font-size:44px;line-height:1.1}' +
      '.ac-time{font-size:10px;color:#778;white-space:nowrap}' +
      '.ac-stamps{display:flex;gap:4px;padding:6px 10px 0;background:#f4f7f2;overflow-x:auto}' +
      '.ac-stamps button{font-size:26px;background:#fff;border:1px solid #cdd8c8;border-radius:10px;padding:2px 8px;cursor:pointer}' +
      '.ac-form{display:flex;gap:8px;padding:8px 10px;padding-bottom:max(8px,env(safe-area-inset-bottom));background:#f4f7f2}' +
      '.ac-form textarea{flex:1;font:inherit;font-size:16px;border:1px solid #bcc9b6;border-radius:18px;padding:8px 12px;resize:none;height:42px;box-sizing:border-box}' +
      '.ac-form button{font:inherit;font-weight:800;color:#fff;background:#06c755;border:0;border-radius:18px;padding:0 16px;cursor:pointer}' +
      '.ac-note{font-size:11px;color:#667;text-align:center;padding:4px 10px 0;background:#f4f7f2;min-height:14px}' +
      '.ac-who{padding:30px 20px;text-align:center}.ac-who h2{font-size:18px;margin:0 0 14px}' +
      '.ac-who button{display:block;width:70%;max-width:260px;margin:8px auto;font:inherit;font-size:18px;font-weight:800;padding:12px;border:0;border-radius:14px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.15);cursor:pointer}' +
      '[data-chat-badge]{display:inline-block;min-width:18px;height:18px;line-height:18px;padding:0 5px;border-radius:9px;background:#ef4444;color:#fff;font-size:11px;font-weight:800;text-align:center;box-sizing:border-box;vertical-align:middle;margin-left:6px}' +
      '[data-chat-badge][hidden]{display:none}';
    document.head.appendChild(s);
  }

  function whoScreen() {
    overlay.innerHTML = '<div class="ac-head"><span>💬 かぞくチャット</span><button type="button" data-ac-close>とじる</button></div>' +
      '<div class="ac-who"><h2>あなたは だれ？</h2>' +
      Object.keys(NAME).map(function (k) { return '<button type="button" data-ac-who="' + k + '">' + NAME[k] + '</button>'; }).join('') + '</div>';
  }

  function chatScreen() {
    overlay.innerHTML = '<div class="ac-head"><span>💬 かぞくチャット</span><button type="button" data-ac-close>とじる</button></div>' +
      '<div class="ac-list" id="acList"></div>' +
      '<div class="ac-note" id="acNote">じゅうしょ・でんわばんごう・がっこうの名前は かかないでね</div>' +
      '<div class="ac-stamps">' + STAMPS.map(function (s) { return '<button type="button" data-ac-stamp="' + s + '" aria-label="スタンプ">' + s + '</button>'; }).join('') + '</div>' +
      '<form class="ac-form" id="acForm"><textarea id="acInput" maxlength="200" placeholder="メッセージ" aria-label="メッセージ"></textarea><button type="submit">おくる</button></form>';
    listEl = overlay.querySelector('#acList');
    inputEl = overlay.querySelector('#acInput');
    noteEl = overlay.querySelector('#acNote');
    render.done = false;
    render();
  }

  function build() {
    css();
    overlay = document.createElement('div');
    overlay.className = 'ac-ov';
    overlay.hidden = true;
    overlay.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('[data-ac-close]')) return close();
      var w = t.closest('[data-ac-who]');
      if (w) { setMe(w.getAttribute('data-ac-who')); return enter(); }
      var st = t.closest('[data-ac-stamp]');
      if (st) send({ stamp: st.getAttribute('data-ac-stamp') });
    });
    overlay.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = inputEl.value.trim();
      if (v) send({ text: v });
    });
    // そらとびの キー操作（Z・X・P など）に 入力が とられないように
    overlay.addEventListener('keydown', function (e) { e.stopPropagation(); });
    overlay.addEventListener('keyup', function (e) { e.stopPropagation(); });
    document.body.appendChild(overlay);
  }

  function enter() {
    if (!me()) { whoScreen(); return; }
    chatScreen();
    fetchNew().then(function () { markRead(); render(); });
  }

  function open() {
    if (!overlay) build();
    overlay.hidden = false;
    enter();
    clearInterval(timer);
    timer = setInterval(function () {
      if (document.hidden || !me()) return;
      fetchNew().then(function (got) { if (got) { markRead(); render(); } });
    }, 5000);
  }
  function close() {
    if (overlay) overlay.hidden = true;
    clearInterval(timer);
    timer = null;
    updateBadge();
  }

  // ひらいていない あいだは 10秒ごとに 新着を しらべて 赤い まるじるしを 出す
  function poll() {
    if (document.hidden || (overlay && !overlay.hidden) || !me()) return;
    fetchNew().then(updateBadge);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-chat-open]');
    if (b) { e.preventDefault(); open(); }
  });
  function start() { setTimeout(poll, 800); setInterval(poll, 10000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  window.AnrinoChat = { open: open, close: close };
})();
