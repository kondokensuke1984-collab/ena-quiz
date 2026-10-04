// ============================================================
// 📖 読解の本文パネル（index.html と rpg.html で共用）
//   問題に passage:'<キー>' があると、画面の下半分に本文が出て解きながら読める。
//   同じ本文のあいだはパネルを作り直さないので、読みかけの位置が残る。
//   bungaku9.html（本文だけ読むページ）も ?p=キー,キー でこのデータを使う。
//   updatePassagePanel(q, host, pad) … host にパネルを入れ、pad の下に余白を付ける。
//   パネルは host の中にあるので、host が隠れればいっしょに隠れる。
// ============================================================
const PASSAGES = {
  bungaku9_kihon: { tab: '基本問題の本文', title: '子供のいる駅', src: '黒井千次「子供のいる駅」より', img: 'bungaku9_kihon', w: [974, 946, 1068, 1012, 1178, 1162] },
  bungaku9_kako:  { tab: '過去問演習の本文', title: 'ぼくらのスクープ', src: '赤羽じゅんこ『ぼくらのスクープ』より（2022 明治大学付属中野中・改題）', img: 'bungaku9_kako', w: [1080, 980, 1270, 1070, 1112, 1308, 1068, 892] },
  setumei9_kihon: { tab: '基本問題の本文', title: '牧野富太郎の植物学', src: '田中伸幸『牧野富太郎の植物学』より（最後の2枚は〔注〕）', img: 'setumei9_kihon', w: [1018, 972, 1226, 1024, 936, 884] },
  setumei9_kako:  { tab: '過去問演習の本文', title: 'インフルエンザのひみつ', src: '岡田晴恵『おしえて！インフルエンザのひみつ』（ポプラ社）より（2016 埼玉栄中・改題）', img: 'setumei9_kako', w: [1212, 1108, 1330, 1130, 1320, 1120, 510] },
};

(function () {
  const css = `
.psg-sheet { position: fixed; left: 0; right: 0; bottom: 0; z-index: 60; max-width: 600px; margin: 0 auto; height: 50vh; height: 50dvh; background: #fff; border-radius: 18px 18px 0 0; box-shadow: 0 -6px 22px rgba(80,40,140,0.25); display: none; flex-direction: column; color: #1f2937; }
.psg-sheet.big { height: 80vh; height: 80dvh; }
.psg-bar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-bottom: 1px solid #ede9fe; font-weight: 700; font-size: 14px; color: #4c1d95; }
.psg-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.psg-btn { border: 1.5px solid #c4b5fd; background: #f5f3ff; color: #5b21b6; border-radius: 10px; padding: 5px 10px; font: inherit; font-size: 13px; cursor: pointer; white-space: nowrap; }
.psg-scroll { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; padding: 6px 10px 24px; text-align: center; background: #faf7ff; }
.psg-scroll img { max-width: 100%; height: auto; display: inline-block; margin-bottom: 8px; background: #fff; border-radius: 6px; }
.psg-src { font-size: 12px; color: #6b7280; text-align: left; margin: 2px 2px 6px; }
.psg-open { position: fixed; right: 16px; bottom: 16px; z-index: 60; display: none; border: none; border-radius: 999px; padding: 12px 18px; font: inherit; font-weight: 700; font-size: 15px; color: #fff; background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 4px 14px rgba(109,40,217,0.35); cursor: pointer; }
.psg-pad-half { padding-bottom: calc(50vh + 24px) !important; }
.psg-pad-big { padding-bottom: calc(80vh + 24px) !important; }
.psg-pad-closed { padding-bottom: 80px !important; }`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
})();

let psgKey = null;
let psgPadEl = null;
function psgPref() {
  try { return Object.assign({ open: true, big: false }, JSON.parse(localStorage.getItem('ena_psg_pref') || '{}')); }
  catch (e) { return { open: true, big: false }; }
}
function psgSetPref(p) {
  try { localStorage.setItem('ena_psg_pref', JSON.stringify(p)); } catch (e) {}
  applyPassagePanel();
}
function applyPassagePanel() {
  const sheet = document.getElementById('psg-sheet');
  const openBtn = document.getElementById('psg-open');
  if (!sheet) return;
  if (psgPadEl) psgPadEl.classList.remove('psg-pad-half', 'psg-pad-big', 'psg-pad-closed');
  if (!psgKey) { sheet.style.display = 'none'; openBtn.style.display = 'none'; return; }
  const p = psgPref();
  sheet.style.display = p.open ? 'flex' : 'none';
  sheet.classList.toggle('big', !!p.big);
  openBtn.style.display = p.open ? 'none' : 'block';
  if (psgPadEl) psgPadEl.classList.add(!p.open ? 'psg-pad-closed' : (p.big ? 'psg-pad-big' : 'psg-pad-half'));
  document.getElementById('psg-size').textContent = p.big ? '半分' : '大きく';
}
function updatePassagePanel(q, host, pad) {
  let sheet = document.getElementById('psg-sheet');
  if (!sheet) {
    sheet = document.createElement('div');
    sheet.id = 'psg-sheet';
    sheet.className = 'psg-sheet';
    sheet.innerHTML =
      '<div class="psg-bar"><span class="psg-title" id="psg-title"></span>' +
      '<button class="psg-btn" id="psg-size" type="button"></button>' +
      '<button class="psg-btn" id="psg-close" type="button">しまう ▼</button></div>' +
      '<div class="psg-scroll" id="psg-scroll"></div>';
    host.appendChild(sheet);
    const openBtn = document.createElement('button');
    openBtn.id = 'psg-open';
    openBtn.className = 'psg-open';
    openBtn.type = 'button';
    openBtn.textContent = '📖 本文を見る';
    host.appendChild(openBtn);
    document.getElementById('psg-size').onclick = () => { const p = psgPref(); p.big = !p.big; psgSetPref(p); };
    document.getElementById('psg-close').onclick = () => { const p = psgPref(); p.open = false; psgSetPref(p); };
    openBtn.onclick = () => { const p = psgPref(); p.open = true; psgSetPref(p); };
  }
  if (psgPadEl && psgPadEl !== pad) psgPadEl.classList.remove('psg-pad-half', 'psg-pad-big', 'psg-pad-closed');
  psgPadEl = pad || host;
  const key = q && q.passage && PASSAGES[q.passage] ? q.passage : null;
  if (key && key !== psgKey) {
    const P = PASSAGES[key];
    const maxW = Math.max(...P.w);
    document.getElementById('psg-title').textContent = `📖 本文「${P.title}」`;
    const sc = document.getElementById('psg-scroll');
    sc.innerHTML = `<p class="psg-src">${P.src}　※右の行から左へ、1枚ずつ下へ読む</p>` +
      P.w.map((w, i) => `<img src="/images/${P.img}_${i + 1}.jpg" style="width:${(w / maxW * 100).toFixed(1)}%" alt="本文 ${i + 1}枚目">`).join('');
    sc.scrollTop = 0;
  }
  psgKey = key;
  applyPassagePanel();
}
