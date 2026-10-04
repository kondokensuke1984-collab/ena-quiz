// ============================================================
// 📝 もしの しま（rpg.html の中の 模試。島の「もしの しま」から #moshi で来る）
//   ・data/tests.json（tools_extract_202609.py が index.html の TEST_KEYS から作る）の テストの
//     3日前〜当日だけ ひらく。日付は クイズで ✏️ した 'ena_test_<key>' を優先。
//   ・れんしゅうもし（index.html の MOSHI_EXTRA → tests.json の extra:true）は from〜date に ひらく。メダルは t.reward、レベルは t.levels。
//     t.kakoMax＝過去問の 上限、t.balance＝単元ごとに じゅんばんに 1問ずつ（過去問も ふつうも）、t.note＝はじめの 画面の せつめい。
//     t.pass＝メダルの ライン（％・なければ 80）、t.limitMin＝せいげん じかん（分）。やすんでも 時計は すすむ・すぎても おわらせず しらせるだけ（メールに オーバーを かく）。
//     ひらいている もしが 2つ以上なら えらぶ画面（moshiRenderPick）。
//   ・範囲（covers の単元とその子）から 教科ごとに 20問。算数・理科は えらぶ・入力を先に、足りないぶんだけ 自己採点。
//     国語・社会（MOSHI_MIX_CATS）は えらぶ問題が 少ないので 区別せずに 全部から ランダム。
//   ・とちゅうでは ○× を出さない。おわったら 保護者メール（/api/send-report）に
//     自己採点の答え・正解と「まるつけコード」（4けた、その回だけ）を送る。端末には コードのハッシュだけ。
//   ・おうちの人が コードを入れて ○× → 点が決まる。8わり以上で ふつう🪙80（台帳 '<月>|moshi:<テストキー>'）・
//     チャレンジ（過去問演習いり）🪙120（'<月>|moshi:<テストキー>:kako'）。8わりを こえるたびに 足しこむ（回数の上限なし）。
//   ・点が きまったら（まるつけ後／自己採点0問なら おわった時）「さいごの けっか」メール（全問題の 答え・正解・○×、×は解説つき）を送り、
//     × は クイズの「⚠️ 苦手」に入れる（rpg.html の quizLinkRecord）。
//   ・とちゅうで「◀ まえの もんだい」で もどって なおせる。さいごの あとは みなおし（ばんごうで とべる）→「おわる」で メール。
//   rpg.html の esc / qHTML / checkInputAns / shuffle / showScreen / updatePassagePanel / questLogDay を使う。
// ============================================================
const MOSHI_KEY = 'ena_moshi_v1';
const MOSHI_PER_CAT = 20, MOSHI_PASS = 80, MOSHI_WINDOW = 3, MOSHI_CODE_TRIES = 3;
// レベル：ふつう＝過去問演習なし／チャレンジ＝教科ごとに 過去問演習を 最大10問 まぜる。メダルは 8わりを こえるたび
const MOSHI_KAKO_MAX = 10;
// えらぶ問題が 少ない教科は、えらぶ・かく を 区別せずに 全部から ランダム（毎回 同じ えらぶ問題に ならないように）
const MOSHI_MIX_CATS = ['kokugo', 'shakai'];
// かならず この数だけ 入れる単元（範囲に あるときだけ）。漢字は 読み3・書き3
const MOSHI_QUOTA = { kanji9_yomi: 3, kanji9_kaki: 3 };
// 漢字の読み：答えが ひらがなだけなら 入力して 自動で ○×（カタカナで うっても よい）
function moshiKanaAuto(q) { return /_yomi$/.test(q.subject || '') && /^[ぁ-んー]+$/.test(String(q.answer || '')); }
// 漢字の書き：画面に 手書き → おうちの人が 絵を見て まるつけ
function moshiHand(q) { return /_kaki$/.test(q.subject || '') && q.type === 'selfjudge'; }
function moshiKana(s) {
  return String(s || '').replace(/[ァ-ン]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60)).replace(/[\s　、。・,.「」【】（）()]/g, '');
}
const MOSHI_LEVELS = {
  normal: { label: 'ふつう', sub: '過去問演習なし', icon: '📘', reward: 80, suffix: '' },
  kako:   { label: 'チャレンジ', sub: '過去問演習あり', icon: '🔥', reward: 120, suffix: ':kako' },
};
function moshiLv(a) { return a && a.lv === 'kako' ? 'kako' : 'normal'; }   // 前の セーブ（lv なし）は ふつう
const MOSHI_CATS = ['sansu', 'kokugo', 'rika', 'shakai', 'eigo'];
const MOSHI_CAT_LABEL = { sansu: '算数', kokugo: '国語', rika: '理科', shakai: '社会', eigo: '英語' };
let moshiFromIsland = false;
let mz = null;   // { test, att, qs:{id:q}, view:'intro'|'q'|'end'|'code'|'grade', marks:{}, msg }

// ── 日付（localhost だけ ?today=YYYY-M-D）──
function moshiToday() {
  const qp = new URLSearchParams(location.search);
  let d = new Date();
  if (QUEST_IS_LOCAL && /^\d{4}-\d{1,2}-\d{1,2}$/.test(qp.get('today') || '')) {
    const [y, m, dd] = qp.get('today').split('-').map(Number); d = new Date(y, m - 1, dd);
  }
  d.setHours(0, 0, 0, 0);
  return d;
}
function moshiDayKey(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
function moshiTestDate(t) {
  let s = '';
  try { s = localStorage.getItem('ena_test_' + t.key) || ''; } catch (e) {}
  const v = /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : t.date;
  const [y, m, d] = v.split('-').map(Number);
  return new Date(y, m - 1, d);
}
/** いま ひらいている もし（近い順）。テスト＝3日前〜当日、れんしゅうもし（from あり）＝from〜date */
function moshiActiveAll(tests, today) {
  const out = [];
  (tests || []).forEach(t => {
    const diff = Math.round((moshiTestDate(t) - today) / 86400000);
    let ok = diff >= 0 && diff <= MOSHI_WINDOW;
    if (t.from && /^\d{4}-\d{2}-\d{2}$/.test(t.from)) {
      const [y, m, d] = t.from.split('-').map(Number);
      ok = diff >= 0 && today >= new Date(y, m - 1, d);
    }
    if (ok) out.push({ test: t, diff });
  });
  return out.sort((a, b) => a.diff - b.diff);
}
/** そのテストの メダルの ライン（％）。れんしゅうもしは t.pass で かえられる */
function moshiPass(t) { return (t && t.pass) || MOSHI_PASS; }
function moshiPassWari(t) { return moshiPass(t) / 10 + 'わり'; }
/** そのテストで 8わりのときの メダル（れんしゅうもしは reward を もつ） */
function moshiReward(t, lv) { return (t && t.reward) || MOSHI_LEVELS[lv].reward; }
/** そのテストで えらべる レベル */
function moshiLevels(t) { return (t && Array.isArray(t.levels) && t.levels.length) ? t.levels.filter(l => MOSHI_LEVELS[l]) : ['normal', 'kako']; }

// ── ほぞん ──
function moshiLoad() {
  try { const v = JSON.parse(localStorage.getItem(MOSHI_KEY) || 'null'); return v && v.v === 1 && v.tests ? v : { v: 1, tests: {} }; }
  catch (e) { return { v: 1, tests: {} }; }
}
function moshiSave(db) { try { localStorage.setItem(MOSHI_KEY, JSON.stringify(db)); } catch (e) {} }
function moshiRec(db, key) { return db.tests[key] || (db.tests[key] = { atts: [], best: 0 }); }
function moshiPersist() {
  const db = moshiLoad();
  const r = moshiRec(db, mz.test.key);
  const i = r.atts.findIndex(a => a.id === mz.att.id);
  if (i >= 0) r.atts[i] = mz.att; else r.atts.push(mz.att);
  if (r.atts.length > 5) r.atts = r.atts.slice(-5);
  if (mz.att.pct != null) {
    r.bestBy = r.bestBy || { normal: r.best || 0 };
    const lv = moshiLv(mz.att);
    r.bestBy[lv] = Math.max(r.bestBy[lv] || 0, mz.att.pct);
    r.best = Math.max(r.best || 0, mz.att.pct);
  }
  moshiSave(db);
}

// ── メダル（台帳に「ないときだけ」足す）──
function moshiMedalKey(t, lv) { return t.month + '|moshi:' + t.key + MOSHI_LEVELS[lv].suffix; }
/** そのテスト・レベルで これまでに もらった 合計 */
function moshiMedalSum(t, lv) { return Number(loadMedalLedger().units[moshiMedalKey(t, lv)]) || 0; }
/** 8わりを こえるたびに 同じキーへ 足しこむ（台帳は へらさない） */
function moshiGrantMedal(t, lv) {
  const led = loadMedalLedger();
  const k = moshiMedalKey(t, lv);
  led.units[k] = (Number(led.units[k]) || 0) + moshiReward(t, lv);
  saveMedalLedger(led);
  return true;
}

// ── 問題をえらぶ ──
function moshiIsKako(k, subs) { return /_kakomon$/.test(k || '') || ((subs[k] || {}).label === '過去問演習'); }
/** list を keyFn の グループに わけて、グループを じゅんばんに 1問ずつ n問 とる（グループの じゅんと 中身は ランダム） */
function moshiSpread(list, n, keyFn, orderFn) {
  const g = {};
  list.forEach(q => { (g[keyFn(q)] = g[keyFn(q)] || []).push(q); });
  const qs = shuffle(Object.keys(g)).map(k => orderFn(g[k]));
  const out = [];
  for (let i = 0; out.length < n && qs.some(x => x.length > i); i++) qs.forEach(x => { if (out.length < n && x[i]) out.push(x[i]); });
  return out;
}
function moshiPick(t, qs, subs, lv) {
  const root = k => { let g = 0; while (subs[k] && subs[k].parent && g++ < 5) k = subs[k].parent; return k; };
  const cov = new Set(t.covers);
  const catOf = k => (subs[k] && subs[k].category) || (subs[root(k)] && subs[root(k)].category) || '';
  const inRange = qs.filter(q => q.id && q.subject && (cov.has(q.subject) || cov.has(root(q.subject))));
  const ids = [];
  MOSHI_CATS.forEach(cat => {
    const all = inRange.filter(q => catOf(q.subject) === cat);
    const isAuto = q => q.type === 'input' || q.type === 'choice' || !q.type;
    const order = MOSHI_MIX_CATS.includes(cat)
      ? list => shuffle(list.slice())                                                          // 国語・社会：区別せずに
      : list => shuffle(list.filter(isAuto)).concat(shuffle(list.filter(q => !isAuto(q))));   // 算数・理科：えらぶ・入力を 先に
    const quota = [];
    Object.keys(MOSHI_QUOTA).forEach(k => { quota.push(...shuffle(all.filter(q => q.subject === k)).slice(0, MOSHI_QUOTA[k])); });
    const rest = all.filter(q => !(q.subject in MOSHI_QUOTA));
    const norm = rest.filter(q => !moshiIsKako(q.subject, subs));
    const per = t.perCat || MOSHI_PER_CAT;   // perCat＝もしごとの問題数（MOSHI_EXTRA）
    // balance：単元（root）ごとに じゅんばんに 1問ずつ（単元の中は order の じゅん）
    const take = t.balance ? (list, n) => moshiSpread(list, n, q => root(q.subject), order) : (list, n) => order(list).slice(0, n);
    const kako = lv === 'kako' ? take(rest.filter(q => moshiIsKako(q.subject, subs)), t.kakoMax || MOSHI_KAKO_MAX) : [];
    const pick = quota.concat(kako, take(norm, per - quota.length - kako.length)).slice(0, per);
    ids.push(...shuffle(pick.slice()).map(q => q.id));   // 過去問が まえに かたまらないように まぜる
  });
  return ids;
}
function moshiCatOfQ(q) {
  const subs = mz.subs;
  let k = q.subject, g = 0;
  while (subs[k] && !subs[k].category && subs[k].parent && g++ < 5) k = subs[k].parent;
  return (subs[k] && subs[k].category) || '';
}

// ── 入口 ──
let moshiList = [];   // えらべる もし [{ test, diff, open }]
async function enterMoshi() {
  showScreen('moshi');
  const root = document.getElementById('moshi-root');
  root.innerHTML = '<div class="panel" style="margin-top:24px; text-align:center;">よみこみちゅう…</div>';
  let tests = [];
  try { tests = (await fetch('data/tests.json', { cache: 'no-cache' }).then(r => r.json())).tests || []; } catch (e) {}
  const acts = moshiActiveAll(tests, moshiToday());
  // まるつけ まちの回は、きかんが すぎても ひらける
  const db = moshiLoad();
  moshiList = acts.map(x => ({ test: x.test, diff: x.diff, open: true }));
  Object.keys(db.tests).filter(k => db.tests[k].atts.some(a => a.finished && a.pct == null)).forEach(k => {
    const t = tests.find(x => x.key === k);
    if (t && !moshiList.some(x => x.test.key === k)) moshiList.push({ test: t, diff: null, open: false });
  });
  if (!moshiList.length) {
    root.innerHTML = '<div class="panel" style="margin-top:24px; text-align:center;">' +
      '<div style="font-size:40px;">🌊</div><b style="font-size:17px;">いまは もしの しまは うみの そこ…</b>' +
      '<div style="font-size:13px; color:#64748b; margin-top:6px;">テストの 3日まえに うかんでくるよ</div>' +
      '<button class="btn-main" style="margin-top:14px;" onclick="leaveMoshi()">🏝 しまに もどる</button></div>';
    return;
  }
  if (moshiList.length === 1) return moshiOpenTest(moshiList[0].test.key);
  moshiRenderPick();
}
/** もしを えらぶ画面（ひらいている もしが 2つ以上のとき） */
function moshiRenderPick() {
  mz = null;
  const db = moshiLoad();
  const root = document.getElementById('moshi-root');
  const rows = moshiList.map(x => {
    const t = x.test, d = moshiTestDate(t), rec = db.tests[t.key];
    const atts = rec ? rec.atts : [];
    const st = atts.some(a => a.finished && a.pct == null) ? '📝 まるつけ まち'
      : atts.some(a => !a.finished && a.pct == null) ? '▶ つづきから'
      : rec && rec.best ? 'さいこう ' + rec.best + '％' : '';
    const when = x.diff == null ? 'きかんは おわったよ' : t.extra ? (d.getMonth() + 1) + '/' + d.getDate() + ' まで・あと ' + x.diff + 'にち'
      : x.diff === 0 ? '🎯 きょうが テスト！' : (d.getMonth() + 1) + '/' + d.getDate() + '・テストまで あと ' + x.diff + 'にち';
    const bg = t.bg || (t.extra ? 'linear-gradient(135deg,#0ea5e9,#2563eb)' : 'linear-gradient(135deg,#8b5cf6,#6366f1)');   // t.bg・t.icon＝ほかと 見分ける もし
    return '<button class="btn-main" style="margin-top:10px; background:' + bg + '; text-align:left; padding:12px 15px;" onclick="moshiOpenTest(\'' + esc(t.key) + '\')">' +
        '<div style="font-size:17px;">' + (t.icon ? t.icon + ' ' : t.extra ? '🎯 ' : '📝 ') + esc(t.name) + '</div>' +
        '<div style="font-size:12px; font-weight:700; opacity:.92; margin-top:2px;">' + when +
          (t.limitMin ? '・⏱' + t.limitMin + 'ぷん' : '') + '・' + moshiPassWari(t) + 'で 🪙' + moshiLevels(t).map(l => moshiReward(t, l)).join('／') + (st ? '・' + st : '') + '</div>' +
      '</button>';
  }).join('');
  root.innerHTML =
    '<div class="panel" style="margin-top:16px; text-align:center;">' +
      '<div style="font-size:44px; line-height:1;">🏝️📝</div>' +
      '<h2 style="font-size:20px; font-weight:800; margin:6px 0 2px;">もしの しま</h2>' +
      '<div style="font-size:13px; font-weight:800; margin-top:6px; color:#4c1d95;">どの もしに する？</div>' + rows +
      '<button class="btn-main" style="margin-top:12px; background:rgba(99,102,241,.12); color:#4c1d95; box-shadow:none;" onclick="leaveMoshi()">' +
        (moshiFromIsland ? '🏝 しまに もどる' : 'もどる') + '</button>' +
    '</div>';
}
async function moshiOpenTest(key) {
  const x = moshiList.find(y => y.test.key === key);
  if (!x) return;
  const t = x.test, db = moshiLoad();
  const root = document.getElementById('moshi-root');
  root.innerHTML = '<div class="panel" style="margin-top:24px; text-align:center;">よみこみちゅう…</div>';
  let qs = [], subs = {};
  try {
    [qs, subs] = await Promise.all([
      fetch('data/questions_' + t.month + '.json').then(r => r.json()),
      fetch('data/subjects_' + t.month + '.json').then(r => r.json()),
    ]);
  } catch (e) {}
  const byId = {};
  qs.forEach(q => { byId[q.id] = q; });
  const rec = moshiRec(db, t.key);
  const cur = rec.atts.find(a => a.pct == null) || null;
  mz = { test: t, diff: x.diff, open: x.open,
         qs: byId, all: qs, subs, att: cur, view: 'intro', marks: {}, msg: '' };
  renderMoshi();
}
function leaveMoshi() {
  if (typeof hideRpgMemo === 'function') hideRpgMemo();
  const host = document.getElementById('scr-moshi');
  if (typeof updatePassagePanel === 'function' && document.getElementById('psg-sheet')) updatePassagePanel(null, host, host);
  if (moshiFromIsland) { location.href = '/game/#island'; return; }
  showMap();
}

function moshiStart(lv) {
  if (!mz.open) return;
  lv = lv === 'kako' ? 'kako' : 'normal';
  const ids = moshiPick(mz.test, mz.all, mz.subs, lv);
  if (!ids.length) { mz.msg = 'もんだいが まだ ないよ'; renderMoshi(); return; }
  mz.att = { id: Date.now(), lv, day: moshiDayKey(moshiToday()), ids, i: 0, ans: {}, finished: false,
             mail: '', codeHash: '', codeDay: '', codeTries: 0, pct: null, score: null };
  if (mz.test.limitMin) { mz.att.startedAt = Date.now(); mz.att.limitMin = mz.test.limitMin; }
  mz.view = 'q';
  moshiPersist();
  renderMoshi();
}
// ── せいげん じかん（t.limitMin のある もしだけ。att.startedAt から 実時間で 数える）──
let moshiClockTimer = null;
function moshiElapsedSec(a) { return Math.max(0, Math.floor(((a.endedAt || Date.now()) - a.startedAt) / 1000)); }
function moshiMMSS(sec) { return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }
function moshiClockText(a) {
  const rest = a.limitMin * 60 - moshiElapsedSec(a);
  return rest >= 0 ? '⏱ のこり ' + moshiMMSS(rest) : '⏰ じかん ぎれ（+' + moshiMMSS(-rest) + '）';
}
/** メール・おわり画面の 1行 */
function moshiTimeLine(a) {
  if (!a || !a.startedAt || !a.limitMin) return '';
  const sec = moshiElapsedSec(a), min = Math.floor(sec / 60), over = sec - a.limitMin * 60;
  return 'かかった時間 ' + min + '分（制限' + a.limitMin + '分' + (over > 0 ? '・' + (over < 60 ? '少し' : Math.floor(over / 60) + '分') + 'オーバー' : '') + '）';
}
function moshiClockHTML(a) {
  return a && a.startedAt && a.limitMin ? '<span id="moshi-clock" style="font-weight:800;"></span>' : '';
}
function moshiClockTick() {
  const el = document.getElementById('moshi-clock'), a = mz && mz.att;
  if (!el || !a || !a.startedAt || a.endedAt) return moshiClockStop();
  const rest = a.limitMin * 60 - moshiElapsedSec(a);
  el.textContent = moshiClockText(a);
  el.style.color = rest < 0 ? '#dc2626' : rest <= 300 ? '#ea580c' : '#4c1d95';
  if (rest < 0 && !a.overShown) {
    a.overShown = true;
    moshiPersist();
    const box = document.getElementById('moshi-over');
    if (box) box.innerHTML = '<div style="background:#fee2e2; color:#b91c1c; border-radius:12px; padding:9px 12px; margin-top:10px; font-weight:800; text-align:center;">' +
      '⏰ ' + a.limitMin + 'ぷん たったよ！ さいごまで といて OK</div>';
  }
}
function moshiClockStart() { moshiClockStop(); if (document.getElementById('moshi-clock')) { moshiClockTick(); moshiClockTimer = setInterval(moshiClockTick, 1000); } }
function moshiClockStop() { if (moshiClockTimer) { clearInterval(moshiClockTimer); moshiClockTimer = null; } }
function moshiResume() { const a = mz.att; mz.view = a.finished ? 'end' : a.i >= a.ids.length ? 'check' : 'q'; renderMoshi(); }

// ── 画面 ──
function renderMoshi() {
  const root = document.getElementById('moshi-root');
  const host = document.getElementById('scr-moshi');
  if (mz.view !== 'q' && document.getElementById('psg-sheet')) updatePassagePanel(null, host, host);
  if (mz.view !== 'q' && mz.view !== 'check') moshiClockStop();
  if (mz.view !== 'q' && typeof hideRpgMemo === 'function') { hideRpgMemo(); mz.memoQ = null; }
  if (mz.view === 'q') return moshiRenderQ();
  if (mz.view === 'code') return moshiRenderCode();
  if (mz.view === 'grade') return moshiRenderGrade();
  if (mz.view === 'end') return moshiRenderEnd();
  if (mz.view === 'check') return moshiRenderCheck();
  // intro
  const t = mz.test, rec = moshiRec(moshiLoad(), t.key);
  const bestBy = rec.bestBy || { normal: rec.best || 0 };
  const d = moshiTestDate(t);
  const when = mz.diff == null ? 'きかんは おわったよ' : t.extra ? (d.getMonth() + 1) + '/' + d.getDate() + ' まで・あと ' + mz.diff + 'にち'
    : mz.diff === 0 ? '🎯 きょうが テスト！' : 'テストまで あと ' + mz.diff + 'にち';
  const a = mz.att;
  // レベルの ボタン（そのレベルで 出る もんだいの かず・メダル・さいこう）
  const lvCard = lv => {
    const L = MOSHI_LEVELS[lv], cats = {};
    moshiPick(t, mz.all, mz.subs, lv).forEach(id => { const c = moshiCatOfQ(mz.qs[id]); cats[c] = (cats[c] || 0) + 1; });
    const total = Object.values(cats).reduce((x, y) => x + y, 0);
    const kako = lv === 'kako' ? moshiKakoCount(t) : 0;
    const sum = moshiMedalSum(t, lv);
    const bg = lv === 'kako' ? 'linear-gradient(135deg,#f97316,#dc2626)' : 'linear-gradient(135deg,#8b5cf6,#6366f1)';
    return '<button class="btn-main" style="margin-top:10px; background:' + bg + '; text-align:left; padding:12px 15px;" onclick="moshiStart(\'' + lv + '\')" ' + (total ? '' : 'disabled') + '>' +
        '<div style="font-size:17px;">' + L.icon + ' ' + (moshiLevels(t).length > 1 ? L.label + '<span style="font-size:12px; opacity:.85;">（' + L.sub + '）</span>' : 'はじめる') + '</div>' +
        '<div style="font-size:12px; font-weight:700; opacity:.92; margin-top:2px;">' + total + 'もん' + (kako ? '（かこもん ' + kako + 'もん いり）' : '') + (t.limitMin ? '・' + t.limitMin + 'ぷん' : '') +
          '・' + moshiPassWari(t) + 'で 🪙' + moshiReward(t, lv) + (sum ? '（もらった ごうけい 🪙' + sum + '）' : '') + (bestBy[lv] ? '・さいこう ' + bestBy[lv] + '％' : '') + '</div>' +
      '</button>';
  };
  const catsAll = {};
  moshiPick(t, mz.all, mz.subs, 'normal').forEach(id => { const c = moshiCatOfQ(mz.qs[id]); catsAll[c] = 1; });
  const catLine = MOSHI_CATS.filter(c => catsAll[c]).map(c => MOSHI_CAT_LABEL[c]).join('・');
  root.innerHTML =
    '<div class="panel" style="margin-top:16px; text-align:center;">' +
      '<div style="font-size:44px; line-height:1;">🏝️📝</div>' +
      '<h2 style="font-size:20px; font-weight:800; margin:6px 0 2px;">もしの しま</h2>' +
      '<div style="font-size:14px; font-weight:800; color:#4c1d95;">' + esc(t.name) + '（' + (d.getMonth() + 1) + '/' + d.getDate() + '）</div>' +
      '<div style="font-size:13px; color:#b45309; font-weight:800; margin-top:2px;">' + when + '</div>' +
      '<div style="background:#f5f3ff; border-radius:12px; padding:10px; margin-top:10px; font-size:13px; line-height:1.8;">' +
        (catLine ? (catLine.includes('・') ? catLine + ' を きょうか ' + (t.perCat || MOSHI_PER_CAT) + 'もんずつ' : catLine + ' ' + (t.perCat || MOSHI_PER_CAT) + 'もん' + (t.note ? '（' + esc(t.note) + '）' : t.extra ? '（まちがえやすい ところを あつめたよ）' : '')) + '<br>' : '') +
        (t.limitMin ? '⏱ <b>せいげん じかん ' + t.limitMin + 'ぷん</b>（やすんでも 時計は すすむよ）<br>' : '') +
        '<b>' + moshiPassWari(t) + '</b> こえるたびに メダル！（なんかい でも）<br>' +
        '<span style="color:#64748b;">かいて こたえる もんだいは おうちの ひとが まるつけ するよ</span>' +
      '</div>' +
      (mz.msg ? '<div style="color:#dc2626; font-weight:700; margin-top:8px;">' + esc(mz.msg) + '</div>' : '') +
      (a && !a.finished ? '<button class="btn-main" style="margin-top:14px;" onclick="moshiResume()">▶ つづきから（' + MOSHI_LEVELS[moshiLv(a)].label + '・' + Math.min(a.i + 1, a.ids.length) + '/' + a.ids.length + '）</button>'
       : a && a.finished ? '<button class="btn-main" style="margin-top:14px;" onclick="moshiResume()">📝 まるつけ まち（' + moshiPending().length + 'もん）</button>'
       : mz.open ? (moshiLevels(t).length > 1 ? '<div style="font-size:13px; font-weight:800; margin-top:12px; color:#4c1d95;">レベルを えらんでね</div>' : '') +
           moshiLevels(t).map(lvCard).join('') : '') +
      (moshiList.length > 1 ? '<button class="btn-main" style="margin-top:10px; background:rgba(99,102,241,.12); color:#4c1d95; box-shadow:none;" onclick="moshiRenderPick()">◀ ほかの もしを えらぶ</button>' : '') +
      '<button class="btn-main" style="margin-top:10px; background:rgba(99,102,241,.12); color:#4c1d95; box-shadow:none;" onclick="leaveMoshi()">' +
        (moshiFromIsland ? '🏝 しまに もどる' : 'もどる') + '</button>' +
    '</div>';
}
/** 範囲の 過去問演習の かず（教科ごとに 最大 t.kakoMax || MOSHI_KAKO_MAX）の 合計 */
function moshiKakoCount(t) {
  const n = {};
  moshiPick(t, mz.all, mz.subs, 'kako').forEach(id => { const q = mz.qs[id]; if (moshiIsKako(q.subject, mz.subs)) n[moshiCatOfQ(q)] = (n[moshiCatOfQ(q)] || 0) + 1; });
  return Object.values(n).reduce((x, y) => x + y, 0);
}

function moshiRenderQ() {
  const a = mz.att, q = mz.qs[a.ids[a.i]];
  const root = document.getElementById('moshi-root');
  if (!q) { a.i++; if (a.i >= a.ids.length) return moshiToCheck(); return moshiRenderQ(); }
  const cat = moshiCatOfQ(q);
  const done = a.ids.filter(id => a.ans[id]).length;
  const pctDone = Math.round(done / a.ids.length * 100);
  const prev = a.ans[q.id];   // もどって きたとき：まえの こたえを 出しておく
  let ans = '';
  if (moshiKanaAuto(q)) {
    ans = '<input id="in-input" type="text" autocomplete="off" autocapitalize="off" placeholder="ひらがなで こたえる" ' +
        'value="' + (prev ? esc(prev.mine).replace(/"/g, '&quot;') : '') + '" ' +
        'style="width:100%; border:2px solid var(--line); border-radius:12px; padding:12px; font-size:18px; font-weight:700;" ' +
        'onkeydown="if(event.key===\'Enter\' && !event.isComposing)moshiAnswer()">' +
      '<button class="btn-main" style="margin-top:8px;" onclick="moshiAnswer()">つぎへ ▶</button>';
  } else if (moshiHand(q)) {
    ans = '<div style="font-size:12px; color:#64748b; margin-bottom:4px;">✍️ ゆびや ペンで 漢字を かこう（おうちの ひとが あとで まるつけ）</div>' +
      '<canvas id="moshi-pad" style="display:block; width:100%; height:190px; touch-action:none; background:#fff; border:2px solid var(--line); border-radius:12px;"></canvas>' +
      '<div style="display:flex; gap:8px; margin-top:8px;">' +
        '<button class="btn" style="width:auto; margin:0; padding:10px 14px;" onclick="moshiPadClear()">🧽 けす</button>' +
        '<button class="btn-main" style="flex:1;" onclick="moshiAnswer()">つぎへ ▶</button>' +
      '</div>';
  } else if (q.type === 'input') {
    const frac = String(q.answer).includes('/');
    ans = '<input id="in-input" type="text" inputmode="' + (frac ? 'text' : 'decimal') + '" autocomplete="off" ' +
        'placeholder="' + (frac ? '例）1と1/4 や 5/4' : 'こたえ') + '" value="' + (prev ? esc(prev.mine).replace(/"/g, '&quot;') : '') + '" ' +
        'style="width:100%; border:2px solid var(--line); border-radius:12px; padding:12px; font-size:17px; font-weight:700;" ' +
        'onkeydown="if(event.key===\'Enter\')moshiAnswer()">' +
      '<button class="btn-main" style="margin-top:8px;" onclick="moshiAnswer()">つぎへ ▶</button>';
  } else if (q.type === 'selfjudge') {
    ans = '<textarea id="sj-input" rows="3" placeholder="ここに こたえを かく…" ' +
        'style="width:100%; border:2px solid var(--line); border-radius:12px; padding:11px; font-size:15px;">' + (prev ? esc(prev.mine) : '') + '</textarea>' +
      '<div style="font-size:11.5px; color:#64748b; margin:4px 0 0;">✍️ おうちの ひとが あとで まるつけ するよ</div>' +
      '<button class="btn-main" style="margin-top:8px;" onclick="moshiAnswer()">つぎへ ▶</button>';
  } else {
    q._order = q._order || (q.keepOrder ? q.options.map((_, i) => i) : shuffle(q.options.map((_, i) => i)));
    ans = q._order.map(orig => {
      const on = prev && prev.pick === orig;
      return '<button class="btn" style="' + (on ? 'background:#ede9fe; border-color:#8b5cf6;' : '') + '" onclick="moshiAnswer(' + orig + ')">' +
        (on ? '👉 ' : '') + qHTML(q.options[orig]) + '</button>';
    }).join('') +
      (prev ? '<div style="font-size:11.5px; color:#64748b;">👉 が いまの こたえ。ちがう ものを おすと かわるよ</div>' : '');
  }
  const navBtn = 'flex:1; margin:0; text-align:center; padding:11px 8px; font-size:14px;';
  root.innerHTML =
    '<div class="panel" style="margin-top:12px; padding:11px 14px;">' +
      '<div style="display:flex; justify-content:space-between; align-items:baseline; font-size:13px;">' +
        '<b>' + MOSHI_LEVELS[moshiLv(a)].icon + ' もし　' + (a.i + 1) + ' / ' + a.ids.length + '</b>' + moshiClockHTML(a) +
        '<span class="gem">' + (MOSHI_CAT_LABEL[cat] || '') + (moshiIsKako(q.subject, mz.subs) ? '・かこもん' : '') + '</span>' +
      '</div>' +
      '<div class="hpbar" style="height:8px; margin-top:6px;"><i style="width:' + pctDone + '%; background:linear-gradient(90deg,#8b5cf6,#6366f1);"></i></div>' +
      '<div id="moshi-over"></div>' +
    '</div>' +
    '<div class="panel" style="margin-top:10px;">' +
      '<div style="font-weight:700; line-height:1.8; font-size:15px;">' + qHTML(q.q) + '</div>' +
      (q.qImage ? '<img class="qimg" src="' + q.qImage + '" alt="図">' : '') +
      (q.qImage2 ? '<img class="qimg" src="' + q.qImage2 + '" alt="図2">' : '') +
      '<div style="margin-top:12px;">' + ans + '</div>' +
      '<div style="display:flex; gap:8px; margin-top:12px;">' +
        (a.i > 0 ? '<button class="btn" style="' + navBtn + '" onclick="moshiGo(-1)">◀ まえの もんだい</button>' : '') +
        (prev && q.type !== 'input' && q.type !== 'selfjudge' ? '<button class="btn" style="' + navBtn + '" onclick="moshiGo(1)">そのまま つぎへ ▶</button>' : '') +
        (moshiHand(q) || typeof toggleRpgMemo !== 'function' ? '' : '<button class="btn" style="' + navBtn + '" onclick="toggleRpgMemo()" title="計算メモ">✏️ メモ</button>') +
      '</div>' +
    '</div>' +
    '<button class="btn-main" style="margin-top:12px; background:rgba(255,255,255,.16); box-shadow:none;" onclick="moshiPause()">⏸ やすむ（つづきは あとで）</button>';
  const host = document.getElementById('scr-moshi');
  const sheet = document.getElementById('psg-sheet');
  if (sheet && sheet.parentElement !== host) { host.appendChild(sheet); host.appendChild(document.getElementById('psg-open')); }
  updatePassagePanel(q, host, host);
  window.scrollTo(0, 0);
  if (moshiHand(q)) moshiPadInit(prev && prev.img);
  if (q.type === 'input' || moshiKanaAuto(q)) setTimeout(() => { const el = document.getElementById('in-input'); if (el) el.focus(); }, 100);
  moshiClockStart();
  if (mz.memoQ !== q.id && typeof clearRpgMemo === 'function') clearRpgMemo();   // ✏️ メモは ひらいたまま、もんだいが かわったら けす
  mz.memoQ = q.id;
}

// ── 手書きパッド（漢字の書き）──
let mzPad = null;   // { cv, ctx, drawn }
function moshiPadInit(img) {
  const cv = document.getElementById('moshi-pad');
  if (!cv) { mzPad = null; return; }
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(cv.clientWidth * dpr);
  cv.height = Math.round(cv.clientHeight * dpr);
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1e1b4b';
  mzPad = { cv, ctx, drawn: false };
  if (img) {
    const im = new Image();
    im.onload = () => { ctx.drawImage(im, 0, 0, cv.width, cv.height); mzPad.drawn = true; };
    im.src = img;
  }
  let on = false, lx = 0, ly = 0;
  const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
  const width = e => (e.pointerType === 'pen' && e.pressure ? Math.max(2, e.pressure * 9) : 5) * dpr;
  cv.addEventListener('pointerdown', e => {
    e.preventDefault(); on = true;
    try { cv.setPointerCapture(e.pointerId); } catch (err) {}
    [lx, ly] = pos(e);
    ctx.fillStyle = '#1e1b4b'; ctx.beginPath(); ctx.arc(lx, ly, width(e) / 2, 0, Math.PI * 2); ctx.fill();
    mzPad.drawn = true;
  });
  cv.addEventListener('pointermove', e => {
    if (!on) return; e.preventDefault();
    const [x, y] = pos(e);
    ctx.lineWidth = width(e); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(x, y); ctx.stroke();
    lx = x; ly = y;
  });
  const stop = () => { on = false; };
  cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop); cv.addEventListener('pointerleave', stop);
}
function moshiPadClear() {
  if (!mzPad) return;
  mzPad.ctx.fillStyle = '#fff'; mzPad.ctx.fillRect(0, 0, mzPad.cv.width, mzPad.cv.height);
  mzPad.drawn = false;
}
/** 小さな JPEG にして 保存（幅 320px） */
function moshiPadImage() {
  if (!mzPad || !mzPad.drawn) return '';
  const w = 320, h = Math.round(320 * mzPad.cv.height / mzPad.cv.width);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.drawImage(mzPad.cv, 0, 0, w, h);
  return c.toDataURL('image/jpeg', 0.7);
}
function moshiAnswer(orig) {
  const a = mz.att, q = mz.qs[a.ids[a.i]];
  if (moshiKanaAuto(q)) {
    const el = document.getElementById('in-input');
    const mine = el ? el.value.trim() : '';
    if (!mine) { if (el) el.style.borderColor = '#ef4444'; return; }
    a.ans[q.id] = { mine, ok: moshiKana(mine) === moshiKana(q.answer) };
  } else if (moshiHand(q)) {
    const img = moshiPadImage();
    a.ans[q.id] = img ? { mine: '（手書き）', img } : { mine: '', ok: false };   // かかなかったら ×（まるつけ しない）
  } else if (q.type === 'input') {
    const el = document.getElementById('in-input');
    const mine = el ? el.value.trim() : '';
    if (!mine) { if (el) el.style.borderColor = '#ef4444'; return; }
    a.ans[q.id] = { mine, ok: checkInputAns(mine, q) };
  } else if (q.type === 'selfjudge') {
    const mine = ((document.getElementById('sj-input') || {}).value || '').trim();
    a.ans[q.id] = mine ? { mine } : { mine: '', ok: false };   // かかなかったら ×（まるつけ しない）
  } else {
    a.ans[q.id] = { mine: q.options[orig], ok: orig === q.answer, pick: orig };
  }
  moshiGo(1);
}
/** まえ・つぎへ。さいごの あとは みなおしの がめん（まだ おわりに しない） */
function moshiGo(step) {
  const a = mz.att;
  a.i = Math.max(0, Math.min(a.ids.length, a.i + step));
  moshiPersist();
  if (a.i >= a.ids.length) moshiToCheck(); else { mz.view = 'q'; moshiRenderQ(); }
}
function moshiJump(i) { mz.att.i = i; mz.view = 'q'; moshiPersist(); renderMoshi(); }
function moshiToCheck() {
  const a = mz.att;
  const miss = a.ids.findIndex(id => mz.qs[id] && !a.ans[id]);
  if (miss >= 0) { a.i = miss; mz.view = 'q'; moshiPersist(); return moshiRenderQ(); }   // こたえて いない もんだいへ
  a.i = a.ids.length;
  mz.view = 'check';
  moshiPersist();
  renderMoshi();
}
/** みなおし：ばんごうを おすと その もんだいに もどれる。「おわる」で はじめて メール・まるつけへ */
function moshiRenderCheck() {
  const a = mz.att;
  const cells = a.ids.map((id, i) => {
    const q = mz.qs[id]; if (!q) return '';
    const r = a.ans[id] || {};
    const self = q.type === 'selfjudge' && !moshiKanaAuto(q);
    const empty = self && !r.mine;
    return '<button onclick="moshiJump(' + i + ')" style="border:2px solid ' + (empty ? '#f59e0b' : 'var(--line)') + '; background:' + (empty ? '#fef3c7' : '#fff') +
      '; border-radius:10px; padding:6px 0; font-weight:800; font-size:13px; color:#1e1b4b;">' + (i + 1) + (self ? '<span style="font-size:9px;">✍️</span>' : '') + '</button>';
  }).join('');
  const blank = a.ids.filter(id => mz.qs[id] && mz.qs[id].type === 'selfjudge' && !moshiKanaAuto(mz.qs[id]) && !(a.ans[id] || {}).mine).length;
  document.getElementById('moshi-root').innerHTML =
    '<div class="panel" style="margin-top:16px; text-align:center;">' +
      '<div style="font-size:36px;">🔎</div><b style="font-size:18px;">ぜんぶ こたえたよ！</b>' +
      (moshiClockHTML(a) ? '<div style="margin-top:4px;">' + moshiClockHTML(a) + '</div><div id="moshi-over"></div>' : '') +
      '<div style="font-size:13px; color:#64748b; margin-top:4px; line-height:1.7;">なおしたい もんだいの ばんごうを おすと もどれるよ。<br>' +
        (blank ? '<span style="color:#b45309; font-weight:800;">🟨 かいていない もんだいが ' + blank + 'もん あるよ</span><br>' : '') +
        '「おわる」を おすと もう なおせないよ。</div>' +
      '<div style="display:grid; grid-template-columns:repeat(8,1fr); gap:5px; margin-top:12px;">' + cells + '</div>' +
      '<button class="btn-main" style="margin-top:14px; background:linear-gradient(135deg,#22c55e,#16a34a);" onclick="moshiFinish()">✅ おわる（まるつけへ）</button>' +
      '<button class="btn-main" style="margin-top:8px; background:rgba(99,102,241,.12); color:#4c1d95; box-shadow:none;" onclick="moshiJump(' + (a.ids.length - 1) + ')">◀ さいごの もんだいに もどる</button>' +
      '<button class="btn-main" style="margin-top:8px; background:rgba(99,102,241,.12); color:#4c1d95; box-shadow:none;" onclick="moshiPause()">⏸ やすむ（つづきは あとで）</button>' +
    '</div>';
  moshiClockStart();
}
function moshiPause() { moshiPersist(); mz.view = 'intro'; renderMoshi(); }

// ── おわり・まるつけ ──
function moshiPending() { const a = mz.att; return a ? a.ids.filter(id => a.ans[id] && a.ans[id].ok == null) : []; }
function moshiScore() {
  const a = mz.att, by = {};
  let ok = 0;
  a.ids.forEach(id => {
    const q = mz.qs[id]; if (!q) return;
    const c = moshiCatOfQ(q), r = a.ans[id];
    by[c] = by[c] || { n: 0, ok: 0 };
    by[c].n++;
    if (r && r.ok) { by[c].ok++; ok++; }
  });
  return { ok, n: a.ids.filter(id => mz.qs[id]).length, by };
}
async function moshiFinish() {
  const a = mz.att;
  if (a.finished) return;
  a.finished = true;
  if (a.startedAt && !a.endedAt) a.endedAt = Date.now();
  mz.view = 'end';
  moshiPersist();
  renderMoshi();
  if (!moshiPending().length) { moshiFinalize(); await moshiSendResultMail(); return; }
  await moshiSendMail();
}
function moshiRandCode() {
  const b = new Uint32Array(1);
  crypto.getRandomValues(b);
  return String(b[0] % 10000).padStart(4, '0');
}
async function moshiHash(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('ena-moshi:' + s));
  return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
}
/** メールに 手書きの絵を 入れる（本文は cid:、絵は images で /api/send-report へ） */
function moshiMailImgs() {
  const images = [];
  return {
    images,
    tag(id) {
      const r = mz.att.ans[id];
      if (!r || !r.img) return '';
      const cid = 'hand-' + (images.length + 1);
      images.push({ cid, dataUrl: r.img });
      return '<img src="cid:' + cid + '" alt="手書き" width="320" style="display:block; width:100%; max-width:320px; margin-top:4px; border:1px solid #cbd5e1; border-radius:8px; background:#fff;">';
    },
  };
}
/** localhost の ためし見用：cid: を 絵に もどした HTML */
function moshiMailPreview(html, images) {
  return (images || []).reduce((h, im) => h.split('cid:' + im.cid).join(im.dataUrl), html);
}
function moshiPlain(s) { return String(s == null ? '' : s).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim(); }
function moshiH(s) { return esc(moshiPlain(s)).replace(/\n/g, '<br>'); }
async function moshiSendMail() {
  const a = mz.att, t = mz.test, pend = moshiPending();
  let code = '';
  if (pend.length) {
    code = moshiRandCode();
    a.codeHash = await moshiHash(code);   // おくりなおすと 前の コードは つかえなくなる（まちがえた回数は そのまま）
  }
  const sc = moshiScore();
  const d = moshiTestDate(t);
  const auto = sc.n - pend.length;
  const catRows = MOSHI_CATS.filter(c => sc.by[c]).map(c =>
    '<tr><td style="padding:5px 10px;">' + MOSHI_CAT_LABEL[c] + '</td><td style="padding:5px 10px; text-align:center;">' + sc.by[c].ok + ' / ' + sc.by[c].n + '</td></tr>').join('');
  const mi = moshiMailImgs();
  const items = pend.map((id, i) => {
    const q = mz.qs[id];
    return '<div style="border:1px solid #e5e7eb; border-radius:10px; padding:10px 12px; margin-bottom:10px;">' +
      '<div style="font-size:12px; color:#6b7280;">' + (i + 1) + '. ' + MOSHI_CAT_LABEL[moshiCatOfQ(q)] + (q.qImage ? '（図あり）' : '') + '</div>' +
      '<div style="margin:4px 0 8px;">' + moshiH(q.q) + '</div>' +
      '<div style="background:#eff6ff; border-radius:8px; padding:6px 10px;"><b>子どもの答え：</b>' + (a.ans[id].img ? '手書き' + mi.tag(id) : moshiH(a.ans[id].mine)) + '</div>' +
      '<div style="background:#f0fdf4; border-radius:8px; padding:6px 10px; margin-top:4px;"><b>正解：</b>' + moshiH(q.answer) + '</div>' +
      (q.explanation ? '<div style="font-size:12px; color:#6b7280; margin-top:4px;">' + moshiH(q.explanation) + '</div>' : '') +
    '</div>';
  }).join('');
  const html = '<html><body style="font-family:sans-serif; color:#1f2937; max-width:640px;">' +
    '<h2 style="font-size:17px;">📝 もしの しま　' + esc(t.name) + '（' + (d.getMonth() + 1) + '/' + d.getDate() + '）・' + MOSHI_LEVELS[moshiLv(a)].label + '（' + MOSHI_LEVELS[moshiLv(a)].sub + '）</h2>' +
    '<p>' + sc.n + '問のうち、自動採点 ' + auto + '問で ' + sc.ok + '問 正解。' +
      (pend.length ? '<br><b>書いて答える問題が ' + pend.length + '問あります。まるつけをお願いします。</b>' : '') + '</p>' +
    '<table style="border-collapse:collapse; border:1px solid #e5e7eb; margin-bottom:14px;"><tr style="background:#ede9fe;"><th style="padding:5px 10px;">教科</th><th style="padding:5px 10px;">自動採点の正解</th></tr>' + catRows + '</table>' +
    (moshiTimeLine(a) ? '<p>⏱ ' + moshiTimeLine(a) + '</p>' : '') +
    (pend.length ?
      '<div style="background:#fef3c7; border-radius:12px; padding:12px 14px; margin-bottom:14px;">' +
        '<div>まるつけコード</div><div style="font-size:30px; font-weight:800; letter-spacing:6px;">' + code + '</div>' +
        '<div style="font-size:12px;">子どもの端末の「もしの しま」→「📝 まるつけ（おうちの人）」でこのコードを入れ、下の答えを見ながら ○× をつけてください。' +
        moshiPass(t) / 10 + '割以上で アンリノメダル ' + moshiReward(t, moshiLv(a)) + '枚（' + moshiPass(t) / 10 + '割をこえるたび）。コードはこの回だけ使えます。</div>' +
      '</div>' + items : '') +
    '<p style="font-size:11px; color:#9ca3af;">ANRINOアプリ（もしの しま）自動送信</p></body></html>';
  const subject = pend.length ? '📝 もしの しま（' + t.name + ' ' + (d.getMonth() + 1) + '/' + d.getDate() + '・' + MOSHI_LEVELS[moshiLv(a)].label + '）まるつけのおねがい'
                              : '📝 もしの しま（' + t.name + ' ' + (d.getMonth() + 1) + '/' + d.getDate() + '・' + MOSHI_LEVELS[moshiLv(a)].label + '）けっか';
  if (QUEST_IS_LOCAL) {   // テストでは 送らない（コンソールで 本文とコードを見る）
    window._moshiLastMail = { subject, html, code, images: mi.images, preview: moshiMailPreview(html, mi.images) };
    console.info('[moshi] mail (localhost では送らない)', subject, 'code=' + code);
    a.mail = 'local';
  } else {
    try {
      const r = await fetch('/api/send-report', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, htmlContent: html, images: mi.images }) });
      a.mail = r.ok ? 'sent' : 'failed';
    } catch (e) { a.mail = 'failed'; }
  }
  moshiPersist();
  if (mz.view === 'end') renderMoshi();
}
async function moshiResend() { mz.att.mail = 'sending'; renderMoshi(); await moshiSendMail(); }

// ── さいごの けっか（点が きまったあと。全問題の 答え・正解・○× を 保護者へ）──
function moshiAnsText(q, r) {
  if (!r || (!r.mine && !r.img)) return '（なし）';
  if (r.img || r.mine === '（手書き）') return '手書き';
  return moshiPlain(r.mine);
}
function moshiCorrectText(q) {
  return (q.type === 'choice' || (!q.type && q.options)) && q.options ? q.options[q.answer] : q.answer;
}
function moshiResultMailHtml() {
  const a = mz.att, t = mz.test, lv = MOSHI_LEVELS[moshiLv(a)], sc = moshiScore(), d = moshiTestDate(t);
  const pass = a.pct >= moshiPass(t);
  const catRows = MOSHI_CATS.filter(c => sc.by[c]).map(c =>
    '<tr><td style="padding:5px 10px;">' + MOSHI_CAT_LABEL[c] + '</td><td style="padding:5px 10px; text-align:center;">' + sc.by[c].ok + ' / ' + sc.by[c].n +
    '（' + Math.floor(sc.by[c].ok / sc.by[c].n * 100) + '％）</td></tr>').join('');
  let no = 0;
  const mi = moshiMailImgs();
  const lists = MOSHI_CATS.filter(c => sc.by[c]).map(c => {
    const rows = a.ids.filter(id => mz.qs[id] && moshiCatOfQ(mz.qs[id]) === c).map(id => {
      const q = mz.qs[id], r = a.ans[id], ok = !!(r && r.ok);
      no++;
      return '<div style="border:1px solid ' + (ok ? '#bbf7d0' : '#fecaca') + '; background:' + (ok ? '#f0fdf4' : '#fef2f2') + '; border-radius:10px; padding:8px 12px; margin-bottom:8px;">' +
        '<div style="font-size:12px; color:#6b7280;"><b style="font-size:15px; color:' + (ok ? '#16a34a' : '#dc2626') + ';">' + (ok ? '○' : '×') + '</b>　' + no + '.' +
          (q.qImage ? '（図あり）' : '') + '　まるつけ：' + (r && r.by === 'parent' ? 'おうちの人' : '自動') + '</div>' +
        '<div style="margin:3px 0 6px;">' + moshiH(q.q) + '</div>' +
        '<div style="font-size:14px;"><b>子どもの答え：</b>' + esc(moshiAnsText(q, r)).replace(/\n/g, '<br>') + mi.tag(id) + '</div>' +
        '<div style="font-size:14px;"><b>正解：</b>' + moshiH(moshiCorrectText(q)) + '</div>' +
        (!ok && q.explanation ? '<div style="font-size:12px; color:#4b5563; margin-top:4px; border-top:1px dashed #fca5a5; padding-top:4px;">' + moshiH(q.explanation) + '</div>' : '') +
      '</div>';
    }).join('');
    return '<h3 style="font-size:15px; margin:16px 0 6px;">' + MOSHI_CAT_LABEL[c] + '（' + sc.by[c].ok + ' / ' + sc.by[c].n + '）</h3>' + rows;
  }).join('');
  const html = '<html><body style="font-family:sans-serif; color:#1f2937; max-width:640px;">' +
    '<h2 style="font-size:17px;">📝 もしの しま　' + esc(t.name) + '（' + (d.getMonth() + 1) + '/' + d.getDate() + '）・' + lv.label + '（' + lv.sub + '）　さいごの けっか</h2>' +
    '<div style="background:' + (pass ? '#dcfce7' : '#fef3c7') + '; border-radius:12px; padding:12px 14px; margin-bottom:12px;">' +
      '<div style="font-size:28px; font-weight:800; color:' + (pass ? '#16a34a' : '#b45309') + ';">' + a.pct + '％</div>' +
      '<div>' + sc.n + '問中 ' + sc.ok + '問 正解' + (pass ? '（' + moshiPass(t) / 10 + '割たっせい）' : '') + '</div>' +
      (a.reward === 'new' ? '<div>アンリノメダル +' + moshiReward(t, moshiLv(a)) + '枚</div>' : '') +
    '</div>' +
    '<table style="border-collapse:collapse; border:1px solid #e5e7eb; margin-bottom:10px;"><tr style="background:#ede9fe;"><th style="padding:5px 10px;">教科</th><th style="padding:5px 10px;">正解</th></tr>' + catRows + '</table>' +
    (moshiTimeLine(a) ? '<p>⏱ ' + moshiTimeLine(a) + '</p>' : '') +
    '<p style="font-size:12px; color:#6b7280;">まちがえた問題は、アプリの「⚠️ 苦手問題を復習」に入りました。下は全問題の一覧です（まちがえた問題には解説つき）。</p>' +
    lists +
    '<p style="font-size:11px; color:#9ca3af;">ANRINOアプリ（もしの しま）自動送信</p></body></html>';
  return { html, images: mi.images };
}
async function moshiSendResultMail(force) {
  const a = mz.att, t = mz.test, d = moshiTestDate(t);
  if (a.pct == null || (!force && (a.resultMail === 'sent' || a.resultMail === 'local'))) return;
  a.resultMail = 'sending';
  moshiPersist();
  if (mz.view === 'end') renderMoshi();
  const subject = '📝 もしの しま（' + t.name + ' ' + (d.getMonth() + 1) + '/' + d.getDate() + '・' + MOSHI_LEVELS[moshiLv(a)].label + '）さいごの けっか ' + a.pct + '％';
  const { html, images } = moshiResultMailHtml();
  if (QUEST_IS_LOCAL) {   // テストでは 送らない
    window._moshiLastMail = { subject, html, code: '', images, preview: moshiMailPreview(html, images) };
    console.info('[moshi] result mail (localhost では送らない)', subject);
    a.resultMail = 'local';
  } else {
    try {
      const r = await fetch('/api/send-report', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, htmlContent: html, images }) });
      a.resultMail = r.ok ? 'sent' : 'failed';
    } catch (e) { a.resultMail = 'failed'; }
  }
  // おくれたら 手書きの 絵は けして 保存を かるく（おくれなかったら「もう一度 おくる」のために のこす）
  if (a.resultMail !== 'failed') Object.values(a.ans).forEach(r => { if (r && r.img) delete r.img; });
  moshiPersist();
  if (mz.view === 'end') renderMoshi();
}

function moshiRenderEnd() {
  const a = mz.att, pend = moshiPending(), sc = moshiScore();
  const root = document.getElementById('moshi-root');
  const mail = a.pct != null && a.resultMail ? (
      a.resultMail === 'sent' ? '📨 さいごの けっかを おうちの ひとに おくったよ'
    : a.resultMail === 'local' ? '📨（テスト：さいごの けっかは おくっていない）'
    : a.resultMail === 'failed' ? '⚠️ さいごの けっかが おくれなかった'
    : '📨 さいごの けっかを おくっているよ…')
    : a.mail === 'sent' ? '📨 おうちの ひとに メールを おくったよ'
    : a.mail === 'local' ? '📨（テスト：メールは おくっていない）'
    : a.mail === 'failed' ? '⚠️ メールが おくれなかった'
    : '📨 メールを おくっているよ…';
  const catRows = MOSHI_CATS.filter(c => sc.by[c]).map(c =>
    '<div style="display:flex; justify-content:space-between; padding:3px 0;"><span>' + MOSHI_CAT_LABEL[c] + '</span><b>' + sc.by[c].ok + ' / ' + sc.by[c].n + '</b></div>').join('');
  let head;
  if (a.pct == null) {
    head = '<div style="font-size:40px;">✍️</div><b style="font-size:18px;">おつかれさま！</b>' +
      '<div style="font-size:13.5px; margin-top:6px; line-height:1.7;">いまの ところ ' + sc.ok + 'もん せいかい。<br>' +
      'かいて こたえた <b>' + pend.length + 'もん</b> は<br>おうちの ひとに まるつけ してもらおう。</div>';
  } else {
    const pass = a.pct >= moshiPass(mz.test);
    head = '<div style="font-size:40px;">' + (pass ? '🎉' : '💪') + '</div>' +
      '<div style="font-size:26px; font-weight:800; color:' + (pass ? '#16a34a' : '#b45309') + ';">' + a.pct + '％</div>' +
      '<div style="font-size:14px; font-weight:700;">' + sc.n + 'もん中 ' + sc.ok + 'もん せいかい</div>' +
      (a.reward === 'new' ? '<div style="font-size:18px; font-weight:800; color:#b45309; margin-top:8px;">🪙 アンリノメダル +' + moshiReward(mz.test, moshiLv(a)) + ' まい！</div>' +
          '<div style="font-size:11.5px; color:#94a3b8;">もっているメダル ' + medalTotal() + ' まい（しまの ショップで つかえるよ）</div>'
       : pass ? '<div style="font-size:13px; color:#16a34a; font-weight:800; margin-top:6px;">' + moshiPassWari(mz.test) + ' たっせい！</div>'
       : '<div style="font-size:13px; color:#b45309; font-weight:800; margin-top:6px;">あと ' + Math.max(1, Math.ceil(sc.n * moshiPass(mz.test) / 100) - sc.ok) + 'もんで ' + moshiPassWari(mz.test) + '！　また ちょうせん しよう</div>');
  }
  const wrong = a.pct == null ? '' : a.ids.filter(id => mz.qs[id] && !(a.ans[id] && a.ans[id].ok)).slice(0, 30).map(id => {
    const q = mz.qs[id];
    const ansText = q.type === 'choice' || (!q.type && q.options) ? q.options[q.answer] : q.answer;
    return '<div style="border-top:1px solid #eee; padding:8px 0; font-size:13px; text-align:left;">' +
      '<div style="font-weight:700;">' + qHTML(moshiPlain(q.q)) + '</div>' +
      '<div style="color:#64748b;">きみ：' + esc((a.ans[id] && a.ans[id].mine) || '（なし）') + '</div>' +
      '<div style="color:#16a34a; font-weight:800;">こたえ：' + qHTML(moshiPlain(ansText)) + '</div></div>';
  }).join('');
  root.innerHTML =
    '<div class="panel" style="margin-top:16px; text-align:center;">' + head +
      '<div style="background:#f5f3ff; border-radius:12px; padding:8px 14px; margin-top:12px; font-size:13.5px; text-align:left;">' + catRows + '</div>' +
      (moshiTimeLine(a) ? '<div style="font-size:13px; font-weight:800; color:#4c1d95; margin-top:8px;">⏱ ' + moshiTimeLine(a).replace('かかった時間', 'かかった じかん') + '</div>' : '') +
      '<div style="font-size:12px; color:#64748b; margin-top:8px;">' + mail + '</div>' +
      (a.pct == null ?
        '<button class="btn-main" style="margin-top:12px; background:linear-gradient(135deg,#f59e0b,#d97706);" onclick="moshiOpenCode()">📝 まるつけ（おうちの人）</button>' +
        (a.mail !== 'sending' && a.mail !== '' ? '<button class="btn-main" style="margin-top:8px; background:rgba(99,102,241,.12); color:#4c1d95; box-shadow:none; font-size:14px;" onclick="moshiResend()">📨 メールを もう一度 おくる</button>' : '')
        : '') +
      (a.pct != null && a.resultMail === 'failed' ? '<button class="btn-main" style="margin-top:8px; background:rgba(99,102,241,.12); color:#4c1d95; box-shadow:none; font-size:14px;" onclick="moshiSendResultMail(true)">📨 もう一度 おくる</button>' : '') +
      (wrong ? '<details style="margin-top:12px; text-align:left;"><summary style="font-weight:800; cursor:pointer;">✏️ まちがえた もんだいを みる</summary>' + wrong + '</details>' : '') +
      (a.pct != null && mz.open ? '<button class="btn-main" style="margin-top:12px;" onclick="moshiAgain()">🔁 もう一度 ちょうせん</button>' : '') +
      '<button class="btn-main" style="margin-top:10px; background:rgba(99,102,241,.12); color:#4c1d95; box-shadow:none;" onclick="leaveMoshi()">' +
        (moshiFromIsland ? '🏝 しまに もどる' : 'もどる') + '</button>' +
    '</div>';
}
function moshiAgain() { mz.att = null; mz.view = 'intro'; renderMoshi(); }

function moshiOpenCode() { mz.view = 'code'; mz.msg = ''; renderMoshi(); }
function moshiRenderCode() {
  const a = mz.att, today = moshiDayKey(moshiToday());
  if (a.codeDay !== today) { a.codeDay = today; a.codeTries = 0; }
  const locked = a.codeTries >= MOSHI_CODE_TRIES;
  document.getElementById('moshi-root').innerHTML =
    '<div class="panel" style="margin-top:16px; text-align:center;">' +
      '<div style="font-size:36px;">🔐</div><b style="font-size:17px;">おうちの人の まるつけ</b>' +
      '<div style="font-size:12.5px; color:#64748b; margin-top:6px;">保護者あての メールに書いてある 4けたの まるつけコードを 入れてください。</div>' +
      (locked ? '<div style="color:#dc2626; font-weight:800; margin-top:12px;">きょうは もう 入れられません（' + MOSHI_CODE_TRIES + '回 まちがえました）</div>'
        : '<input id="moshi-code" type="password" inputmode="numeric" maxlength="4" autocomplete="off" ' +
            'style="width:10em; text-align:center; letter-spacing:8px; border:2px solid var(--line); border-radius:12px; padding:12px; font-size:22px; font-weight:800; margin-top:12px;" ' +
            'onkeydown="if(event.key===\'Enter\')moshiCheckCode()">' +
          '<button class="btn-main" style="margin-top:10px;" onclick="moshiCheckCode()">ひらく</button>') +
      (mz.msg ? '<div style="color:#dc2626; font-weight:700; margin-top:8px;">' + esc(mz.msg) + '</div>' : '') +
      '<button class="btn-main" style="margin-top:10px; background:rgba(99,102,241,.12); color:#4c1d95; box-shadow:none;" onclick="mz.view=\'end\'; renderMoshi()">もどる</button>' +
    '</div>';
  const el = document.getElementById('moshi-code');
  if (el) setTimeout(() => el.focus(), 80);
}
async function moshiCheckCode() {
  const a = mz.att;
  const v = ((document.getElementById('moshi-code') || {}).value || '').replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).trim();
  if (!/^\d{4}$/.test(v)) { mz.msg = '4けたの 数字を 入れてください'; renderMoshi(); return; }
  if (!a.codeHash) { mz.msg = 'メールを おくっている ところです。すこし まってね'; renderMoshi(); return; }
  if (a.codeHash && (await moshiHash(v)) === a.codeHash) { mz.view = 'grade'; mz.marks = {}; mz.msg = ''; renderMoshi(); return; }
  a.codeTries = (a.codeTries || 0) + 1;
  moshiPersist();
  mz.msg = 'コードが ちがいます（あと ' + Math.max(0, MOSHI_CODE_TRIES - a.codeTries) + '回）';
  renderMoshi();
}
function moshiRenderGrade() {
  const a = mz.att, pend = moshiPending();
  const items = pend.map((id, i) => {
    const q = mz.qs[id], m = mz.marks[id];
    return '<div style="border:2px solid ' + (m === true ? '#22c55e' : m === false ? '#ef4444' : 'var(--line)') + '; border-radius:14px; padding:10px 12px; margin-bottom:10px;">' +
      '<div style="font-size:11.5px; color:#64748b;">' + (i + 1) + '. ' + MOSHI_CAT_LABEL[moshiCatOfQ(q)] + '</div>' +
      '<div style="font-size:14px; font-weight:700; line-height:1.7;">' + qHTML(moshiPlain(q.q)) + '</div>' +
      (q.qImage ? '<img class="qimg" style="max-height:160px;" src="' + q.qImage + '" alt="図">' : '') +
      '<div style="background:#eff6ff; border-radius:10px; padding:7px 10px; margin-top:6px; font-size:14px;"><span style="font-size:11px; color:#2563eb; font-weight:800;">こどもの こたえ</span><br>' + (a.ans[id].img ? '<img src="' + a.ans[id].img + '" alt="手書き" style="display:block; width:100%; max-width:320px; margin-top:4px; border:1px solid #cbd5e1; border-radius:8px; background:#fff;">' : esc(a.ans[id].mine).replace(/\n/g, '<br>')) + '</div>' +
      '<div style="background:#f0fdf4; border-radius:10px; padding:7px 10px; margin-top:5px; font-size:14px;"><span style="font-size:11px; color:#16a34a; font-weight:800;">せいかい</span><br>' + qHTML(moshiPlain(q.answer)) + '</div>' +
      '<div style="display:flex; gap:8px; margin-top:8px;">' +
        '<button class="btn" style="margin:0; text-align:center; ' + (m === true ? 'background:#bbf7d0; border-color:#22c55e;' : '') + '" onclick="moshiMark(\'' + id + '\',true)">⭕</button>' +
        '<button class="btn" style="margin:0; text-align:center; ' + (m === false ? 'background:#fecaca; border-color:#ef4444;' : '') + '" onclick="moshiMark(\'' + id + '\',false)">❌</button>' +
      '</div>' +
    '</div>';
  }).join('');
  const done = pend.every(id => mz.marks[id] != null);
  document.getElementById('moshi-root').innerHTML =
    '<div class="panel" style="margin-top:12px;">' +
      '<b style="font-size:16px;">📝 まるつけ（' + pend.length + 'もん）</b>' +
      '<div style="font-size:12px; color:#64748b; margin:2px 0 10px;">こどもの こたえと せいかいを くらべて ⭕❌ を つけてください。</div>' +
      items +
      '<button class="btn-main" ' + (done ? '' : 'disabled style="opacity:.5;"') + ' onclick="moshiGradeDone()">けってい（' + Object.keys(mz.marks).length + '/' + pend.length + '）</button>' +
    '</div>';
}
function moshiMark(id, ok) {
  mz.marks[id] = ok;
  const y = window.scrollY;
  renderMoshi();
  window.scrollTo(0, y);
}
function moshiGradeDone() {
  const a = mz.att, pend = moshiPending();
  if (!pend.every(id => mz.marks[id] != null)) return;
  pend.forEach(id => { a.ans[id].ok = !!mz.marks[id]; a.ans[id].by = 'parent'; });
  a.codeHash = '';
  moshiFinalize();
  mz.view = 'end';
  renderMoshi();
  moshiSendResultMail();
}
function moshiFinalize() {
  const a = mz.att;
  if (a.pct != null) return;   // おなじ回で 2かい くばらない
  const sc = moshiScore();
  a.pct = sc.n ? Math.floor(sc.ok / sc.n * 100) : 0;
  a.score = { ok: sc.ok, n: sc.n };
  a.reward = a.pct >= moshiPass(mz.test) && moshiGrantMedal(mz.test, moshiLv(a)) ? 'new' : '';
  // クイズの「⚠️ 苦手」とつなぐ：× は 苦手に入れる（3回で 超苦手）、○ は クエストと同じく 苦手から外す
  if (typeof quizLinkRecord === 'function') a.ids.forEach(id => { const q = mz.qs[id]; if (q) quizLinkRecord(!!(a.ans[id] && a.ans[id].ok), q); });
  moshiPersist();
  questLogDay(d => {
    d.stages = d.stages || {};
    const k = 'moshi:' + mz.test.key + MOSHI_LEVELS[moshiLv(mz.att)].suffix;
    const s = d.stages[k] || { label: '📝 もしの しま（' + mz.test.name + '・' + MOSHI_LEVELS[moshiLv(mz.att)].label + '）', answered: 0, correct: 0 };
    s.answered += sc.n; s.correct += sc.ok;
    d.stages[k] = s;
    d.answered += sc.n; d.correct += sc.ok;
  });
}
