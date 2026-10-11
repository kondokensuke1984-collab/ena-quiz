// 🪙 アンリノメダルの 台帳（ena_anrino_medals）を 読む・書く・数える ところ。
//   クイズ（index.html）と クエスト（rpg.html）が つかう。島（game-src/src/lib/medals.ts）も 同じ 決まりで 読む。
//   ・こわれた 値（NaN・負の数・文字列）は 0 として 合計する（どの画面でも 同じ 枚数に なるように）
//   ・書くときは よびだした側で「読む → かえる → 書く」を 1回の 処理で おこなう（あいだに ほかの タブの 書きこみが 入らない）
//   ・容量が いっぱいで 書けなくても 画面は 止めない（false を かえす）
(function () {
  const KEY = 'ena_anrino_medals';
  const count = (v) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0; };

  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (d && typeof d === 'object' && d.units && typeof d.units === 'object' && !Array.isArray(d.units)) return d;
    } catch (e) { /* こわれていたら 空から */ }
    return { units: {} };
  }
  function save(led) {
    try { localStorage.setItem(KEY, JSON.stringify(led)); return true; } catch (e) { return false; }
  }
  function total() {
    const u = load().units;
    return Object.keys(u).reduce((a, k) => a + count(u[k]), 0);
  }
  function monthTotal(month) {
    const u = load().units;
    return Object.keys(u).reduce((a, k) => a + (k.split('|')[0] === month ? count(u[k]) : 0), 0);
  }

  window.AnrinoMedals = { KEY, load, save, total, monthTotal };
})();
