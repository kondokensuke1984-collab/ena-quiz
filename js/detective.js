// 🔍 イベント「名探偵あんりの なぞとき」（クエスト rpg.html の中）
//   島の じけん（game-src/src/lib/detective.ts）と おなじ きかん。算数「推理」の 選択問題 12問（data/detective.json）。
//   メダル：はじめての正解 🪙1（medalFirstCorrect）、はじめて たおすと 🪙5（台帳 <月>|quest:detective）。
//   きかんを かえるときは 島の EVENT_START / EVENT_END も いっしょに かえる。

const DETECTIVE_KEY = '__detective__';
const DETECTIVE_START = new Date(2026, 8, 26);   // 9/26
const DETECTIVE_END = new Date(2026, 9, 31);     // 10/31
const DETECTIVE_CLEAR = 5;
let DETECTIVE_QS = [];

function detectiveToday() {
  const q = new URLSearchParams(location.search).get('today') || '';
  if (QUEST_IS_LOCAL && /^\d{4}-\d{1,2}-\d{1,2}$/.test(q)) {
    const [y, m, d] = q.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
function detectiveActive() {
  const t = detectiveToday().getTime();
  return t >= DETECTIVE_START.getTime() && t <= DETECTIVE_END.getTime();
}
async function loadDetective() {
  if (!detectiveActive()) return;
  try { DETECTIVE_QS = await fetch('data/detective.json', { cache: 'no-cache' }).then(r => r.json()); } catch (e) { DETECTIVE_QS = []; }
}

function detectiveMapPanel() {
  if (!detectiveActive() || !DETECTIVE_QS.length) return '';
  const done = !!(save.cleared && save.cleared[DETECTIVE_KEY]);
  return '<div class="panel" style="margin-bottom:11px; background:linear-gradient(135deg,#312e81,#7c3aed); color:#fff;">' +
    '<div style="font-size:11px; font-weight:800; color:#fcd34d;">🔍 イベント（10/31まで）</div>' +
    '<div style="font-weight:800; font-size:15px;">名探偵あんりの なぞとき</div>' +
    '<div style="font-size:11.5px; color:#e0e7ff; margin:3px 0 9px; line-height:1.6;">' +
      'なぞの かいとうが あらわれた！ 数の推理・リーグ戦・順位の もんだい ' + DETECTIVE_QS.length + 'もん。' +
      'はじめて たおすと 🪙' + DETECTIVE_CLEAR + 'まい' +
    '</div>' +
    '<button class="btn" onclick="startBattle(\'' + DETECTIVE_KEY + '\')" style="display:flex; align-items:center; gap:11px; background:#fff; color:#1e1b4b;">' +
      '<span style="flex:0 0 42px;">' + CHARS.fox(6, 100, 42, { silhouette: !done }) + '</span>' +
      '<span style="flex:1;">' + (done ? 'かいとうを つかまえた！' : 'なぞの かいとう') +
        '<span style="display:block; font-size:11px; color:#64748b; font-weight:400;">全' + DETECTIVE_QS.length + '問</span></span>' +
      '<span style="font-size:17px;">' + (done ? '🕵️' : '⚔️') + '</span>' +
    '</button>' +
  '</div>';
}
