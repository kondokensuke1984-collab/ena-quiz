// index.html から機械的に切り出したキャラ描画。手で編集しない。
// 署名: render*SVG(level, fillPct, size, opts) -> SVG文字列
// opts.silhouette:true で影（＝未撃破のモンスター）になる。

function petStar(x, y, r, fill, anim) {
  const d = `M${x} ${y-r} L${x+r*0.28} ${y-r*0.3} L${x+r} ${y-r*0.3} L${x+r*0.4} ${y+r*0.18} `
          + `L${x+r*0.6} ${y+r} L${x} ${y+r*0.42} L${x-r*0.6} ${y+r} L${x-r*0.4} ${y+r*0.18} `
          + `L${x-r} ${y-r*0.3} L${x-r*0.28} ${y-r*0.3} Z`;
  return anim
    ? `<path d="${d}" fill="${fill}"><animate attributeName="opacity" values="0.25;1;0.25" dur="2.2s" begin="${(x%7)/5}s" repeatCount="indefinite"/></path>`
    : `<path d="${d}" fill="${fill}"/>`;
}

function renderLunaSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette;
  const L   = Math.max(1, level | 0);
  const nStars = Math.max(0, opts.stars || 0);
  const c = sil
    ? { lit:'#d8d3ea', dark:'rgba(0,0,0,0.03)', fur:'#d5d0e8', ear:'#c3bcdd', line:'#c3bcdd',
        eye:'#bdb6da', blush:'#c3bcdd', cape:'#c3bcdd', kine:'#c3bcdd', star:'#d5d0e8', crown:'#c3bcdd' }
    : { lit:'#fde68a', dark:'rgba(255,255,255,0.10)', fur:'#fffaf3', ear:'#fbcfe8', line:'#c4b5fd',
        eye:'#3d2b5e', blush:'#fda4af', cape:'#a78bfa', kine:'#deb887', star:'#fde68a', crown:'#fbbf24' };

  const R = 60, mcx = 100, mcy = 92;
  const p  = Math.max(0, Math.min(1, fillPct || 0));
  const rx = R * Math.abs(1 - 2 * p);
  const uid = 'lm' + Math.random().toString(36).slice(2, 8);

  // ── 背景の月（満ち欠け） ──
  let moon = '';
  if (!sil) {
    moon = `
      <circle cx="${mcx}" cy="${mcy}" r="${R}" fill="${c.dark}"/>
      <mask id="${uid}">
        <rect x="0" y="0" width="200" height="200" fill="black"/>
        <rect x="${mcx}" y="${mcy - R}" width="${R}" height="${2 * R}" fill="white"/>
        <ellipse cx="${mcx}" cy="${mcy}" rx="${rx.toFixed(1)}" ry="${R}" fill="${p < 0.5 ? 'black' : 'white'}"/>
      </mask>
      <g mask="url(#${uid})">
        <circle cx="${mcx}" cy="${mcy}" r="${R}" fill="${c.lit}" opacity="0.95"/>
        <circle cx="${mcx - 26}" cy="${mcy - 22}" r="9"   fill="#f6d268" opacity="0.55"/>
        <circle cx="${mcx + 20}" cy="${mcy + 6}"  r="12"  fill="#f6d268" opacity="0.45"/>
        <circle cx="${mcx + 2}"  cy="${mcy + 36}" r="7"   fill="#f6d268" opacity="0.5"/>
      </g>`;
  }

  // ── オーラ・星（レベル6以上） ──
  let deco = '';
  if (L >= 6 && !sil) {
    deco += `<circle cx="100" cy="112" r="84" fill="none" stroke="#fef3c7" stroke-width="3" opacity="0.35">
               <animate attributeName="r" values="78;88;78" dur="3s" repeatCount="indefinite"/>
               <animate attributeName="opacity" values="0.45;0.1;0.45" dur="3s" repeatCount="indefinite"/>
             </circle>`;
  }
  if (L >= 4) {
    deco += petStar(30, 44, 9, c.star, !sil) + petStar(172, 62, 8, c.star, !sil);
  }
  if (L >= 6) deco += petStar(24, 132, 8, c.star, !sil) + petStar(178, 140, 7, c.star, !sil);
  for (let i = 0; i < Math.min(nStars, 6); i++) {
    const a = -Math.PI / 2 + (i + 1) * (Math.PI * 2 / 7);
    deco += petStar(100 + Math.cos(a) * 88, 108 + Math.sin(a) * 88, 7, c.star, !sil);
  }

  // ── うさぎ本体 ──
  let body = '';
  if (L === 1) {
    // たまご
    body = `
      <ellipse cx="86" cy="76" rx="7"  ry="11" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="114" cy="76" rx="7" ry="11" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="100" cy="120" rx="40" ry="46" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <path d="M78 116 q7 -8 14 0" stroke="${c.eye}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M108 116 q7 -8 14 0" stroke="${c.eye}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="72" cy="130" rx="7" ry="4.5" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="128" cy="130" rx="7" ry="4.5" fill="${c.blush}" opacity="0.75"/>
      <path d="M96 130 q4 4 8 0" stroke="${c.eye}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  } else {
    const earLen = L >= 4 ? 26 : 20;
    const ear = (cx, rot) => `
      <g transform="rotate(${rot} ${cx} 82)">
        <ellipse cx="${cx}" cy="${82 - earLen}" rx="9" ry="${earLen}" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
        <ellipse cx="${cx}" cy="${84 - earLen}" rx="4" ry="${earLen - 8}" fill="${c.ear}"/>
      </g>`;
    let extra = '';
    if (L >= 3) {  // きね（もちつき）
      extra += `<g transform="rotate(-22 142 140)">
                  <rect x="138" y="104" width="8"  height="56" rx="4" fill="${c.kine}" stroke="${c.line}" stroke-width="1.5"/>
                  <rect x="124" y="92"  width="36" height="17" rx="7" fill="${c.kine}" stroke="${c.line}" stroke-width="1.5"/>
                </g>`;
    }
    let cape = '';
    if (L >= 4) {  // マント
      cape = `<path d="M70 124 Q100 112 130 124 L142 174 Q100 160 58 174 Z" fill="${c.cape}" opacity="${sil ? 1 : 0.85}"/>`;
    }
    let crown = '';
    if (L >= 5) {  // 星のかんむり
      crown = `<path d="M82 94 L88 78 L100 88 L112 78 L118 94 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.5" stroke-linejoin="round"/>`;
    }
    body = `
      ${extra}
      ${ear(86, -11)}
      ${ear(114, 11)}
      ${cape}
      <ellipse cx="100" cy="148" rx="30" ry="24" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="82"  cy="166" rx="13" ry="8" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="118" cy="166" rx="13" ry="8" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <circle cx="100" cy="112" r="31" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      ${crown}
      <ellipse cx="89"  cy="110" rx="4.5" ry="5.5" fill="${c.eye}"/>
      <ellipse cx="111" cy="110" rx="4.5" ry="5.5" fill="${c.eye}"/>
      ${sil ? '' : '<circle cx="90.5" cy="108" r="1.6" fill="#fff"/><circle cx="112.5" cy="108" r="1.6" fill="#fff"/>'}
      <ellipse cx="76"  cy="121" rx="7" ry="4.5" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="124" cy="121" rx="7" ry="4.5" fill="${c.blush}" opacity="0.75"/>
      <path d="M96 121 l4 4 l4 -4 z" fill="${c.blush}"/>
      <path d="M100 125 q-5 6 -9 2 M100 125 q5 6 9 2" stroke="${c.eye}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      ${L >= 3 ? petStar(126, 100, 5, c.crown, false) : ''}`;
  }

  const scale = L === 1 ? 0.88 : Math.min(1.08, 0.92 + (L - 2) * 0.035);
  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block;">
    ${moon}${deco}
    <g transform="translate(100,106) scale(${scale.toFixed(3)}) translate(-100,-106)">${body}</g>
  </svg>`;
}

// ============================================================
// カブたろうのSVG（背景のひまわりが咲く＋完全変態で育つカブトムシ）
// ============================================================
function renderKabuSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette;
  const L   = Math.max(1, level | 0);
  const nStars = Math.max(0, opts.stars || 0);
  const c = sil
    ? { petal:'#d5d0e8', petalOff:'rgba(0,0,0,0.03)', core:'#c3bcdd', seed:'#bdb6da', soil:'#c3bcdd',
        egg:'#d5d0e8', larva:'#d5d0e8', larvaHead:'#c3bcdd', pupa:'#c3bcdd',
        body:'#c3bcdd', body2:'#bdb6da', horn:'#c3bcdd', tip:null, eye:'#bdb6da',
        shine:'#d5d0e8', outline:'#bdb6da', star:'#d5d0e8' }
    : { petal:'#fbbf24', petalOff:'rgba(255,255,255,0.10)', core:'#c9873f', seed:'#7c4a21', soil:'#6b4423',
        egg:'#fffaf0', larva:'#fdf3e0', larvaHead:'#c98a4b', pupa:'#b5713a',
        body:(L>=5?'#5b3717':'#c2894e'), body2:(L>=5?'#432708':'#a86f38'),
        horn:(L>=5?'#2f1b06':'#8f5a24'), tip:(L>=6?'#f0b429':null), eye:'#1f1206',
        shine:'rgba(255,255,255,0.32)', outline:(L>=5?'#2a1705':'#7d4d1e'), star:'#fde68a' };

  // ── 背景のひまわり（花びらが達成率ぶんだけ黄色くなる）──
  const cx = 100, cy = 96, P = 18;
  const p  = Math.max(0, Math.min(1, fillPct || 0));
  const lit = Math.round(P * p);
  let flower = '';
  if (!sil) {
    for (let i = 0; i < P; i++) {
      const a = (i / P) * Math.PI * 2 - Math.PI / 2;
      const px = cx + Math.cos(a) * 56, py = cy + Math.sin(a) * 56;
      const deg = a * 180 / Math.PI + 90;
      flower += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="9" ry="25"
        transform="rotate(${deg.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})"
        fill="${i < lit ? c.petal : c.petalOff}"/>`;
    }
    flower += `<circle cx="${cx}" cy="${cy}" r="34" fill="${p > 0 ? c.core : 'rgba(255,255,255,0.12)'}"/>`;
    if (p > 0) {
      for (let i = 0; i < 11; i++) {
        const a = i * 1.4, r = 5 + i * 2.7;
        flower += `<circle cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r).toFixed(1)}" r="2.6" fill="${c.seed}" opacity="0.5"/>`;
      }
    }
  }

  // ── オーラ・星 ──
  let deco = '';
  if (L >= 6 && !sil) {
    deco += `<circle cx="100" cy="108" r="88" fill="none" stroke="#fef3c7" stroke-width="3" opacity="0.35">
               <animate attributeName="r" values="82;92;82" dur="3s" repeatCount="indefinite"/>
               <animate attributeName="opacity" values="0.45;0.1;0.45" dur="3s" repeatCount="indefinite"/>
             </circle>`;
  }
  if (L >= 4) deco += petStar(24, 40, 9, c.star, !sil) + petStar(178, 56, 8, c.star, !sil);
  if (L >= 6) deco += petStar(18, 140, 8, c.star, !sil) + petStar(184, 146, 7, c.star, !sil);
  for (let i = 0; i < Math.min(nStars, 6); i++) {
    const a = -Math.PI / 2 + (i + 1) * (Math.PI * 2 / 7);
    deco += petStar(100 + Math.cos(a) * 92, 108 + Math.sin(a) * 92, 7, c.star, !sil);
  }

  // ── 土（たまご・よう虫・さなぎは土の中）──
  const soil = L <= 3
    ? `<path d="M10 146 Q100 120 190 146 L190 200 L10 200 Z" fill="${c.soil}" opacity="${sil ? 1 : 0.92}"/>
       <path d="M10 146 Q100 120 190 146" fill="none" stroke="${sil ? c.soil : '#8a5a2b'}" stroke-width="3.5"/>`
    : '';

  let body = '';
  if (L === 1) {              // たまご
    body = `${soil}
      <ellipse cx="100" cy="166" rx="24" ry="29" fill="${c.egg}" stroke="${sil ? c.soil : '#e0c9a6'}" stroke-width="2.5"/>
      <ellipse cx="91" cy="156" rx="7" ry="9" fill="#fff" opacity="${sil ? 0 : 0.8}"/>
      <path d="M89 168 q5 5 10 0 M105 168 q5 5 10 0" stroke="${c.eye}" stroke-width="2.2" fill="none" opacity="0.4" stroke-linecap="round"/>`;
  } else if (L === 2) {       // よう虫（C字にまるまる）
    const lx = 100, ly = 158, lr = 31;
    let segs = '';
    for (let i = 1; i <= 6; i++) {
      const a = Math.PI * (0.62 + i * 0.19);
      segs += `<line x1="${(lx + Math.cos(a) * (lr - 15)).toFixed(1)}" y1="${(ly + Math.sin(a) * (lr - 15)).toFixed(1)}"
                     x2="${(lx + Math.cos(a) * (lr + 15)).toFixed(1)}" y2="${(ly + Math.sin(a) * (lr + 15)).toFixed(1)}"
                     stroke="${sil ? c.soil : '#e6cfa8'}" stroke-width="2.5" stroke-linecap="round"/>`;
    }
    body = `${soil}
      <path d="M118 134 A31 31 0 1 0 116 187" stroke="${sil ? c.soil : '#e6cfa8'}" stroke-width="34" fill="none" stroke-linecap="round"/>
      <path d="M118 134 A31 31 0 1 0 116 187" stroke="${c.larva}" stroke-width="29" fill="none" stroke-linecap="round"/>
      ${segs}
      <circle cx="116" cy="187" r="14" fill="${c.larvaHead}"/>
      <circle cx="111" cy="184" r="2.8" fill="${c.eye}"/>
      <circle cx="121" cy="184" r="2.8" fill="${c.eye}"/>
      <path d="M112 192 q4 3 9 0" stroke="${c.eye}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  } else if (L === 3) {       // さなぎ
    body = `${soil}
      <ellipse cx="100" cy="156" rx="29" ry="42" fill="${c.pupa}" stroke="${sil ? c.soil : '#8a5324'}" stroke-width="2.5"/>
      <path d="M100 122 q-2 -14 0 -22" stroke="${c.pupa}" stroke-width="11" fill="none" stroke-linecap="round"/>
      <path d="M100 116 q-2 -12 0 -18" stroke="${sil ? c.soil : '#8a5324'}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M74 154 q26 7 52 0 M74 168 q26 7 52 0 M74 182 q26 6 52 0" stroke="${sil ? c.soil : '#8a5324'}" stroke-width="2.5" fill="none" opacity="0.75"/>
      <circle cx="92" cy="138" r="2.8" fill="${c.eye}" opacity="0.7"/>
      <circle cx="108" cy="138" r="2.8" fill="${c.eye}" opacity="0.7"/>`;
  } else {                    // 成虫（L4 羽化したて / L5 成虫 / L6 キング）
    const hw  = L >= 6 ? 13 : L >= 5 ? 11 : 8;   // 角の太さ
    const top = L >= 6 ? 14 : L >= 5 ? 20 : 34;  // 角の先端の高さ
    const mid = top + 26;                        // 角が分かれる位置
    body = `
      <path d="M72 118 Q54 114 42 98 M70 138 Q50 138 38 132 M74 158 Q56 164 46 178"
            stroke="${c.body2}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
      <path d="M128 118 Q146 114 158 98 M130 138 Q150 138 162 132 M126 158 Q144 164 154 178"
            stroke="${c.body2}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="100" cy="152" rx="37" ry="42" fill="${c.body}" stroke="${c.outline}" stroke-width="2.5"/>
      <path d="M100 112 L100 193" stroke="${c.outline}" stroke-width="3"/>
      <ellipse cx="83" cy="136" rx="9" ry="16" fill="${c.shine}"/>
      <ellipse cx="100" cy="110" rx="28" ry="19" fill="${c.body2}" stroke="${c.outline}" stroke-width="2.5"/>
      <path d="M100 100 Q100 92 100 88" stroke="${c.horn}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <ellipse cx="100" cy="88" rx="16" ry="11" fill="${c.body2}" stroke="${c.outline}" stroke-width="2"/>
      <path d="M100 86 Q100 66 100 ${mid}" stroke="${c.horn}" stroke-width="${hw}" fill="none" stroke-linecap="round"/>
      <path d="M100 ${mid + 4} Q92 ${top + 12} 76 ${top}" stroke="${c.horn}" stroke-width="${hw - 3}" fill="none" stroke-linecap="round"/>
      <path d="M100 ${mid + 4} Q108 ${top + 12} 124 ${top}" stroke="${c.horn}" stroke-width="${hw - 3}" fill="none" stroke-linecap="round"/>
      <circle cx="91" cy="88" r="3.4" fill="${sil ? c.eye : '#fff'}"/>
      <circle cx="109" cy="88" r="3.4" fill="${sil ? c.eye : '#fff'}"/>
      <circle cx="91" cy="88" r="1.8" fill="${c.eye}"/>
      <circle cx="109" cy="88" r="1.8" fill="${c.eye}"/>
      ${c.tip && !sil ? `${petStar(76, top - 4, 7, c.tip, true)}${petStar(124, top - 4, 7, c.tip, true)}` : ''}`;
  }

  const scale = L <= 3 ? 0.95 : Math.min(1.02, 0.94 + (L - 4) * 0.04);
  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block;">
    ${flower}${deco}
    <g transform="translate(100,108) scale(${scale.toFixed(3)}) translate(-100,-108)">${body}</g>
  </svg>`;
}

// ============================================================
// 教科キャラのSVG（ぽんた・ホウ・ミケ・ペン太）
//   ・背景＝その教科の⭐の割合だけ色づくリング
//   ・Lv1はたまご、Lv2〜6で小物が増える（大きさ・拡大率・キラキラはルナと同じ）
// ============================================================
function petSilPalette(pal) {
  const out = {};
  Object.keys(pal).forEach(k => { out[k] = '#d5d0e8'; });
  out.line = '#c3bcdd'; out.eye = '#bdb6da';
  return out;
}

function petRingBG(fillPct, color, sil) {
  if (sil) return '';
  const p = Math.max(0, Math.min(1, fillPct || 0));
  const r = 72, C = 2 * Math.PI * r;
  return `<circle cx="100" cy="106" r="${r}" fill="${color}" opacity="0.13"/>
    <circle cx="100" cy="106" r="${r}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="7"/>
    ${p > 0 ? `<circle cx="100" cy="106" r="${r}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"
      stroke-dasharray="${(C * p).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 100 106)"/>` : ''}`;
}

function petCommonDeco(L, nStars, starColor, sil) {
  let deco = '';
  if (L >= 6 && !sil) {
    deco += `<circle cx="100" cy="112" r="84" fill="none" stroke="#fef3c7" stroke-width="3" opacity="0.35">
               <animate attributeName="r" values="78;88;78" dur="3s" repeatCount="indefinite"/>
               <animate attributeName="opacity" values="0.45;0.1;0.45" dur="3s" repeatCount="indefinite"/>
             </circle>`;
  }
  if (L >= 4) deco += petStar(30, 44, 9, starColor, !sil) + petStar(172, 62, 8, starColor, !sil);
  if (L >= 6) deco += petStar(24, 132, 8, starColor, !sil) + petStar(178, 140, 7, starColor, !sil);
  for (let i = 0; i < Math.min(Math.max(0, nStars || 0), 6); i++) {
    const a = -Math.PI / 2 + (i + 1) * (Math.PI * 2 / 7);
    deco += petStar(100 + Math.cos(a) * 88, 108 + Math.sin(a) * 88, 7, starColor, !sil);
  }
  return deco;
}

function petWrapSVG(L, size, bg, deco, body) {
  const scale = L === 1 ? 0.88 : Math.min(1.08, 0.92 + (L - 2) * 0.035);
  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block;">
    ${bg}${deco}
    <g transform="translate(100,106) scale(${scale.toFixed(3)}) translate(-100,-106)">${body}</g>
  </svg>`;
}

// たまご（Lv1）。top にはたまごからのぞく耳などを入れる
function petEggBody(c, top) {
  return `${top}
    <ellipse cx="100" cy="120" rx="40" ry="46" fill="${c.egg}" stroke="${c.line}" stroke-width="3"/>
    <ellipse cx="80"  cy="96"  rx="7" ry="5" fill="${c.spot}" opacity="0.7"/>
    <ellipse cx="118" cy="92"  rx="4" ry="3" fill="${c.spot}" opacity="0.7"/>
    <ellipse cx="124" cy="148" rx="9" ry="6" fill="${c.spot}" opacity="0.7"/>
    <path d="M78 116 q7 -8 14 0" stroke="${c.eye}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M108 116 q7 -8 14 0" stroke="${c.eye}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="72" cy="130" rx="7" ry="4.5" fill="${c.blush}" opacity="0.75"/>
    <ellipse cx="128" cy="130" rx="7" ry="4.5" fill="${c.blush}" opacity="0.75"/>
    <path d="M96 130 q4 4 8 0" stroke="${c.eye}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
}

function petEyes(c, sil, lx, rx, y, r, ring) {
  const ry = (r * 1.2).toFixed(1), hr = (r * 0.36).toFixed(1);
  let s = '';
  if (ring && !sil) s += `<circle cx="${lx}" cy="${y}" r="${r + 2.5}" fill="#fff"/><circle cx="${rx}" cy="${y}" r="${r + 2.5}" fill="#fff"/>`;
  s += `<ellipse cx="${lx}" cy="${y}" rx="${r}" ry="${ry}" fill="${c.eye}"/><ellipse cx="${rx}" cy="${y}" rx="${r}" ry="${ry}" fill="${c.eye}"/>`;
  if (!sil) s += `<circle cx="${lx + r * 0.33}" cy="${y - r * 0.45}" r="${hr}" fill="#fff"/><circle cx="${rx + r * 0.33}" cy="${y - r * 0.45}" r="${hr}" fill="#fff"/>`;
  return s;
}

// まだ出会っていないキャラ・すがたは「？」だけ見せる（ネタバレ防止）
function petUnknownSVG(size) {
  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display:block;">
    <circle cx="100" cy="106" r="70" fill="#f3f0ff" stroke="#c4b5fd" stroke-width="6" stroke-dasharray="15 13" stroke-linecap="round"/>
    <text x="100" y="142" font-size="84" font-weight="900" fill="#a78bfa" text-anchor="middle"
          font-family="system-ui, -apple-system, sans-serif">?</text>
  </svg>`;
}

// 社会：たぬきのぽんた（はっぱ→笠→地図の巻物→金の笠）
function renderTanukiSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#b88a64', belly:'#f7e7d3', mask:'#7a5a43', ear:'#5c4331', line:'#7c5c43', eye:'#2a1d3d',
                blush:'#fda4af', leaf:'#4ade80', vein:'#15803d', hat:'#e9c46a', band:'#b45309',
                scroll:'#fef3c7', rod:'#b45309', map:'#60a5fa', pin:'#ef4444', star:'#fde68a', crown:'#fbbf24',
                egg:'#f7e7d3', spot:'#d6b38c' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#86efac', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <circle cx="80" cy="82" r="10" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <circle cx="120" cy="82" r="10" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>`);
  } else {
    const leaf = (x, y, rot) => `<g transform="rotate(${rot} ${x} ${y})">
        <path d="M${x} ${y} q-4 -22 14 -30 q6 20 -14 30 z" fill="${c.leaf}" stroke="${c.vein}" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M${x} ${y} q5 -12 12 -26" stroke="${c.vein}" stroke-width="1.5" fill="none"/>
      </g>`;
    const tail = `<g transform="rotate(38 140 158)">
        <ellipse cx="140" cy="158" rx="13" ry="24" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
        <path d="M129 152 q11 4 22 0 M129 164 q11 4 22 0" stroke="${c.mask}" stroke-width="4" fill="none" stroke-linecap="round"/>
      </g>`;
    let head = '';
    if (L >= 4) {  // 笠（Lv6は金色）
      head = `<path d="M58 92 Q100 50 142 92 Q100 84 58 92 Z" fill="${L >= 6 ? c.crown : c.hat}" stroke="${c.band}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M76 84 Q100 76 124 84" stroke="${c.band}" stroke-width="3" fill="none"/>
        ${leaf(100, 72, -8)}
        ${L >= 6 ? petStar(116, 84, 5, '#fff7ed', false) : ''}`;
    } else if (L >= 3) {  // 頭にはっぱ
      head = leaf(98, 84, -10);
    }
    const scroll = L >= 5 ? `<g transform="rotate(-16 50 150)">
        <rect x="32" y="130" width="38" height="42" rx="2" fill="${c.scroll}" stroke="${c.rod}" stroke-width="1.8"/>
        <path d="M38 142 q7 -5 13 1 t14 -1 M38 156 q9 4 15 -2 t11 3" stroke="${c.map}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="58" cy="150" r="2.6" fill="${c.pin}"/>
        <rect x="28" y="126" width="46" height="7" rx="3.5" fill="${c.rod}"/>
        <rect x="28" y="169" width="46" height="7" rx="3.5" fill="${c.rod}"/>
      </g>` : '';
    body = `
      ${tail}
      <circle cx="76" cy="88" r="11" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <circle cx="76" cy="88" r="5" fill="${c.ear}"/>
      <circle cx="124" cy="88" r="11" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <circle cx="124" cy="88" r="5" fill="${c.ear}"/>
      <ellipse cx="100" cy="148" rx="30" ry="24" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="100" cy="152" rx="17" ry="15" fill="${c.belly}"/>
      <ellipse cx="82"  cy="166" rx="13" ry="8" fill="${c.mask}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="118" cy="166" rx="13" ry="8" fill="${c.mask}" stroke="${c.line}" stroke-width="2.5"/>
      <circle cx="100" cy="112" r="31" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="87"  cy="111" rx="11" ry="8.5" fill="${c.mask}" transform="rotate(18 87 111)"/>
      <ellipse cx="113" cy="111" rx="11" ry="8.5" fill="${c.mask}" transform="rotate(-18 113 111)"/>
      <ellipse cx="100" cy="126" rx="13" ry="9" fill="${c.belly}"/>
      ${petEyes(c, sil, 88, 112, 110, 4, true)}
      <ellipse cx="100" cy="121" rx="4.5" ry="3.2" fill="${c.eye}"/>
      <path d="M100 124 q-5 6 -9 2 M100 124 q5 6 9 2" stroke="${c.eye}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="74"  cy="126" rx="6" ry="4" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="126" cy="126" rx="6" ry="4" fill="${c.blush}" opacity="0.7"/>
      ${head}
      ${scroll}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 国語：インコのピコ（ことばカード→ちょうネクタイ→国語じしょ→かんむり）
function renderParrotSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { body:'#4ade80', chick:'#bbf7d0', wing:'#16a34a', stripe:'#14532d', belly:'#d9f99d', face:'#fde047',
                crest:'#facc15', tail:'#3b82f6', cheek:'#60a5fa', line:'#15803d', eye:'#2a1d3d', beak:'#fdba74',
                beakLine:'#c2410c', blush:'#fda4af', card:'#ffffff', cardLine:'#a78bfa', cardText:'#6d28d9',
                tie:'#e11d48', book:'#fef3c7', cover:'#2563eb', crown:'#fbbf24', crownLine:'#d97706',
                star:'#fde68a', egg:'#f0fdf4', spot:'#86efac' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#86efac', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M100 80 Q94 62 100 52 Q104 64 108 58 Q108 72 100 80 Z" fill="${c.crest}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>`);
  } else {
    const bodyCol = L === 2 ? c.chick : c.body;
    const tail = L >= 3 ? `<path d="M118 160 L152 196 L140 198 L112 168 Z" fill="${c.tail}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>` : '';
    const card = (L >= 3 && L < 5) ? `<g transform="rotate(-12 58 150)">
        <rect x="40" y="130" width="34" height="42" rx="5" fill="${c.card}" stroke="${c.cardLine}" stroke-width="2.5"/>
        ${sil ? '' : `<text x="57" y="160" font-size="22" font-weight="900" fill="${c.cardText}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">名</text>`}
      </g>` : '';
    const book = L >= 5 ? `<g transform="rotate(-8 56 158)">
        <path d="M24 146 Q42 138 58 146 L58 178 Q42 170 24 178 Z" fill="${c.book}" stroke="${c.cover}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M58 146 Q74 138 92 146 L92 178 Q74 170 58 178 Z" fill="${c.book}" stroke="${c.cover}" stroke-width="3" stroke-linejoin="round"/>
        ${sil ? '' : `<path d="M30 154 h20 M30 161 h20 M30 168 h16 M64 154 h20 M64 161 h20 M64 168 h16" stroke="#a8a29e" stroke-width="2" stroke-linecap="round"/>`}
      </g>` : '';
    const tie = L >= 4 ? `<path d="M100 146 L84 138 L84 154 Z M100 146 L116 138 L116 154 Z" fill="${c.tie}" stroke="${sil ? c.line : '#9f1239'}" stroke-width="1.5" stroke-linejoin="round"/>
        <circle cx="100" cy="146" r="4.5" fill="${c.tie}" stroke="${sil ? c.line : '#9f1239'}" stroke-width="1.5"/>` : '';
    const crown = L >= 6 ? `<path d="M80 80 L84 60 L94 72 L100 56 L106 72 L116 60 L120 80 Z" fill="${c.crown}" stroke="${c.crownLine}" stroke-width="2" stroke-linejoin="round"/>
        ${sil ? '' : '<circle cx="100" cy="70" r="3" fill="#f43f5e"/>'}` : '';
    const crest = L >= 6 ? '' : `<path d="M100 84 Q92 64 100 50 Q106 64 110 56 Q112 74 102 84 Z" fill="${c.crest}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>`;
    body = `
      ${tail}
      <ellipse cx="100" cy="138" rx="36" ry="42" fill="${bodyCol}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="152" rx="22" ry="24" fill="${c.belly}"/>
      <path d="M66 124 Q58 150 74 172 Q84 150 80 128 Z" fill="${c.wing}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M134 124 Q142 150 126 172 Q116 150 120 128 Z" fill="${c.wing}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
      ${L >= 3 && !sil ? `<path d="M68 138 q5 3 10 0 M69 150 q5 3 10 0 M122 138 q5 3 10 0 M121 150 q5 3 10 0" stroke="${c.stripe}" stroke-width="2" fill="none" stroke-linecap="round"/>` : ''}
      ${crest}
      <ellipse cx="100" cy="110" rx="28" ry="24" fill="${c.face}" stroke="${c.line}" stroke-width="2.5"/>
      ${petEyes(c, sil, 88, 112, 106, 5.5)}
      ${sil ? '' : `<circle cx="80" cy="120" r="3" fill="${c.cheek}"/><circle cx="120" cy="120" r="3" fill="${c.cheek}"/>`}
      <ellipse cx="78" cy="113" rx="5" ry="3.5" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="122" cy="113" rx="5" ry="3.5" fill="${c.blush}" opacity="0.7"/>
      <path d="M92 114 Q100 108 108 114 Q108 124 100 128 Q97 122 92 114 Z" fill="${c.beak}" stroke="${c.beakLine}" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M86 178 v5 M92 178 v5 M108 178 v5 M114 178 v5" stroke="${c.beakLine}" stroke-width="3" stroke-linecap="round"/>
      ${tie}${card}${book}${crown}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 理科：フクロウのホウ（メガネ→白衣→フラスコ→はかせぼうし）
function renderOwlSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#c19a6b', chick:'#e9d5b7', wing:'#a47c52', belly:'#fdf4e3', face:'#fff7ed', mark:'#d6b38c',
                line:'#7c5c43', eye:'#2a1d3d', beak:'#f59e0b', blush:'#fda4af', glass:'#475569',
                coat:'#ffffff', coatLine:'#cbd5e1', flask:'#e0f2fe', liquid:'#34d399', cap:'#1e293b',
                tassel:'#fbbf24', star:'#fde68a', egg:'#fdf4e3', spot:'#e7cfa8' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#7dd3fc', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M78 86 L72 64 L92 80 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M122 86 L128 64 L108 80 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>`);
  } else {
    const fur = L === 2 ? c.chick : c.fur;
    const coat = L >= 4 ? `<path d="M64 128 Q100 116 136 128 L140 170 Q100 180 60 170 Z" fill="${c.coat}" stroke="${c.coatLine}" stroke-width="2"/>
        <rect x="114" y="148" width="14" height="10" rx="2" fill="none" stroke="${c.coatLine}" stroke-width="2"/>` : '';
    const glasses = L >= 3 ? `<circle cx="86" cy="112" r="12" fill="none" stroke="${c.glass}" stroke-width="3"/>
        <circle cx="114" cy="112" r="12" fill="none" stroke="${c.glass}" stroke-width="3"/>
        <path d="M98 112 h4" stroke="${c.glass}" stroke-width="3"/>` : '';
    const flask = L >= 5 ? `<g transform="rotate(14 150 150)">
        <path d="M144 122 h12 v16 l14 26 q3 7 -5 7 h-30 q-8 0 -5 -7 l14 -26 z" fill="${c.flask}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M134 156 h32 l4 8 q2 7 -5 7 h-30 q-8 0 -5 -7 z" fill="${c.liquid}"/>
        ${sil ? '' : '<circle cx="146" cy="162" r="2.5" fill="#fff" opacity="0.85"/><circle cx="155" cy="150" r="2" fill="#fff" opacity="0.85"/>'}
        <rect x="141" y="118" width="18" height="5" rx="2" fill="${c.line}"/>
      </g>` : '';
    const cap = L >= 6 ? `<path d="M66 84 L100 70 L134 84 L100 98 Z" fill="${c.cap}"/>
        <path d="M84 90 v10 q16 8 32 0 v-10" fill="${c.cap}"/>
        <path d="M134 84 v16" stroke="${c.tassel}" stroke-width="2.5"/>
        <circle cx="134" cy="102" r="3.5" fill="${c.tassel}"/>` : '';
    body = `
      <path d="M76 96 L68 70 L90 88 Z" fill="${fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M124 96 L132 70 L110 88 Z" fill="${fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="100" cy="132" rx="38" ry="44" fill="${fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="66"  cy="142" rx="10" ry="24" fill="${c.wing}" stroke="${c.line}" stroke-width="2" transform="rotate(14 66 142)"/>
      <ellipse cx="134" cy="142" rx="10" ry="24" fill="${c.wing}" stroke="${c.line}" stroke-width="2" transform="rotate(-14 134 142)"/>
      ${coat}
      <ellipse cx="100" cy="150" rx="${L >= 4 ? 14 : 22}" ry="22" fill="${c.belly}"/>
      ${L < 4 ? `<path d="M92 142 l4 4 l4 -4 l4 4 l4 -4 M92 154 l4 4 l4 -4 l4 4 l4 -4" stroke="${c.mark}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
      <circle cx="86"  cy="112" r="14" fill="${c.face}"/>
      <circle cx="114" cy="112" r="14" fill="${c.face}"/>
      ${petEyes(c, sil, 86, 114, 112, 6)}
      <path d="M95 121 L105 121 L100 131 Z" fill="${c.beak}" stroke="${c.line}" stroke-width="1.2" stroke-linejoin="round"/>
      <ellipse cx="72"  cy="128" rx="6" ry="4" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="128" cy="128" rx="6" ry="4" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="88"  cy="176" rx="8" ry="4.5" fill="${c.beak}"/>
      <ellipse cx="112" cy="176" rx="8" ry="4.5" fill="${c.beak}"/>
      ${glasses}${cap}${flask}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 国語：ねこのミケ（筆→はかま→巻物→ベレー帽と丸メガネの文豪）
function renderNekoSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#fffaf3', patch:'#fb923c', patch2:'#57534e', line:'#d4a373', ear:'#fbcfe8', eye:'#3d2b5e',
                blush:'#fda4af', brush:'#92400e', tip:'#1f2937', hakama:'#7c3aed', collar:'#fde68a',
                scroll:'#fef3c7', rod:'#b45309', ink:'#1f2937', beret:'#be123c', glass:'#78350f',
                star:'#fde68a', egg:'#fffaf3', spot:'#fdba74' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#f9a8d4', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M76 90 L78 64 L96 80 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M124 90 L122 64 L104 80 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>`);
  } else {
    const tailPath = 'M126 164 q34 0 30 -32 q-1 -8 -7 -7';
    const brush = L >= 3 ? `<g transform="rotate(28 146 140)">
        <rect x="143" y="104" width="7" height="46" rx="3.5" fill="${c.brush}"/>
        <path d="M141 150 h11 l-2 13 q-3.5 7 -7 0 z" fill="${c.tip}"/>
      </g>` : '';
    const hakama = L >= 4 ? `<path d="M82 140 L100 156 L118 140" stroke="${c.collar}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M68 152 Q100 144 132 152 L138 178 L106 178 L100 162 L94 178 L62 178 Z" fill="${c.hakama}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>` : '';
    const scroll = L >= 5 ? `<g transform="rotate(-10 50 150)">
        <rect x="32" y="134" width="40" height="32" fill="${c.scroll}" stroke="${c.rod}" stroke-width="1.5"/>
        <path d="M40 141 v18 M48 141 v12 M56 141 v18 M64 141 v10" stroke="${c.ink}" stroke-width="2.4" stroke-linecap="round"/>
        <rect x="27" y="131" width="7" height="38" rx="3.5" fill="${c.rod}"/>
        <rect x="70" y="131" width="7" height="38" rx="3.5" fill="${c.rod}"/>
      </g>` : '';
    const bungo = L >= 6 ? `<ellipse cx="98" cy="84" rx="25" ry="9" fill="${c.beret}"/>
        <circle cx="98" cy="75" r="3.5" fill="${c.beret}"/>
        <circle cx="89" cy="110" r="9" fill="none" stroke="${c.glass}" stroke-width="2.5"/>
        <circle cx="111" cy="110" r="9" fill="none" stroke="${c.glass}" stroke-width="2.5"/>
        <path d="M98 110 h4" stroke="${c.glass}" stroke-width="2.5"/>` : '';
    body = `
      <path d="${tailPath}" stroke="${c.line}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="${tailPath}" stroke="${c.fur}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M72 96 L76 66 L96 84 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M77 90 L79 73 L90 84 Z" fill="${c.ear}"/>
      <path d="M128 96 L124 66 L104 84 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M123 90 L121 73 L110 84 Z" fill="${c.ear}"/>
      <ellipse cx="100" cy="148" rx="30" ry="24" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="82"  cy="166" rx="13" ry="8" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="118" cy="166" rx="13" ry="8" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      ${hakama}
      <circle cx="100" cy="112" r="31" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="84"  cy="98" rx="12" ry="8.5" fill="${c.patch}" transform="rotate(-28 84 98)"/>
      <ellipse cx="119" cy="95" rx="7" ry="5" fill="${c.patch2}" transform="rotate(20 119 95)"/>
      ${petEyes(c, sil, 89, 111, 110, 4.5)}
      <path d="M96 120 l4 4 l4 -4 z" fill="${c.blush}"/>
      <path d="M100 124 q-5 6 -9 2 M100 124 q5 6 9 2" stroke="${c.eye}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M70 118 h-16 M71 124 l-15 5 M130 118 h16 M129 124 l15 5" stroke="${c.line}" stroke-width="1.8" stroke-linecap="round"/>
      <ellipse cx="77"  cy="122" rx="6" ry="4" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="123" cy="122" rx="6" ry="4" fill="${c.blush}" opacity="0.7"/>
      ${bungo}${brush}${scroll}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 算数：ペンギンのペン太（そろばん→定規マント→計算メガネ→王かん）
function renderPenguinSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { back:'#334155', chick:'#94a3b8', belly:'#ffffff', line:'#1e293b', beak:'#f59e0b', eye:'#1e293b',
                blush:'#fda4af', board:'#fef3c7', frame:'#b45309', bead:'#f472b6', rod:'#92400e',
                ruler:'#fde047', tick:'#a16207', glass:'#0ea5e9', crown:'#fbbf24', gem:'#f472b6',
                star:'#fde68a', egg:'#e2e8f0', spot:'#94a3b8' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fde68a', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `<path d="M100 78 q-6 -10 2 -16 q-1 8 5 10" fill="${c.back}" stroke="${c.line}" stroke-width="2"/>`);
  } else {
    const back = L === 2 ? c.chick : c.back;
    const cape = L >= 4 ? `<path d="M60 118 Q100 104 140 118 L156 176 Q100 164 44 176 Z" fill="${c.ruler}" stroke="${c.tick}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M57 130 h6 M53 145 h8 M49 160 h6 M147 145 h-8 M143 130 h-6 M151 160 h-6" stroke="${c.tick}" stroke-width="2" stroke-linecap="round"/>` : '';
    const abacus = L >= 3 ? `<g transform="rotate(-8 44 152)">
        <rect x="22" y="136" width="46" height="32" rx="3" fill="${c.board}" stroke="${c.frame}" stroke-width="3"/>
        <path d="M22 146 h46" stroke="${c.frame}" stroke-width="2"/>
        <path d="M30 139 v26 M40 139 v26 M50 139 v26 M60 139 v26" stroke="${c.rod}" stroke-width="1.5"/>
        ${[30, 40, 50, 60].map((x, i) => `<ellipse cx="${x}" cy="141.5" rx="4" ry="2.6" fill="${c.bead}"/>
          <ellipse cx="${x}" cy="${152 + (i % 2) * 5}" rx="4" ry="2.6" fill="${c.bead}"/>
          <ellipse cx="${x}" cy="163" rx="4" ry="2.6" fill="${c.bead}"/>`).join('')}
      </g>` : '';
    const glasses = L >= 5 ? `<rect x="80" y="104" width="18" height="14" rx="5" fill="none" stroke="${c.glass}" stroke-width="2.8"/>
        <rect x="102" y="104" width="18" height="14" rx="5" fill="none" stroke="${c.glass}" stroke-width="2.8"/>
        <path d="M98 110 h4" stroke="${c.glass}" stroke-width="2.8"/>
        ${sil ? '' : '<path d="M83 108 l4 -2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'}` : '';
    const crown = L >= 6 ? `<path d="M82 96 L86 76 L94 86 L100 70 L106 86 L114 76 L118 96 Z" fill="${c.crown}" stroke="${c.frame}" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="100" cy="88" r="3" fill="${c.gem}"/>` : '';
    body = `
      ${cape}
      <ellipse cx="100" cy="134" rx="36" ry="42" fill="${back}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="146" rx="24" ry="28" fill="${c.belly}"/>
      <circle cx="90"  cy="114" r="12" fill="${c.belly}"/>
      <circle cx="110" cy="114" r="12" fill="${c.belly}"/>
      <ellipse cx="64"  cy="142" rx="8" ry="21" fill="${back}" stroke="${c.line}" stroke-width="2.5" transform="rotate(22 64 142)"/>
      <ellipse cx="136" cy="142" rx="8" ry="21" fill="${back}" stroke="${c.line}" stroke-width="2.5" transform="rotate(-22 136 142)"/>
      ${petEyes(c, sil, 90, 110, 112, 4)}
      <path d="M93 121 L107 121 L100 130 Z" fill="${c.beak}" stroke="${c.line}" stroke-width="1.2" stroke-linejoin="round"/>
      <ellipse cx="80"  cy="124" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="120" cy="124" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="88"  cy="177" rx="10" ry="5" fill="${c.beak}"/>
      <ellipse cx="112" cy="177" rx="10" ry="5" fill="${c.beak}"/>
      ${glasses}${crown}${abacus}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 5月社会：ひつじのメイ（コンパス→旅のマント→地図→王かん）
function renderSheepSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { wool:'#fdf6ee', woolSh:'#e7dcd0', face:'#e8c9a0', line:'#b08968', eye:'#2a1d3d',
                blush:'#fda4af', hoof:'#a1887f', comp:'#e5e7eb', needle:'#ef4444', cape:'#60a5fa',
                scroll:'#fef3c7', rod:'#b45309', map:'#60a5fa', crown:'#fbbf24', star:'#fde68a',
                egg:'#fdf6ee', spot:'#e7dcd0' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fbcfe8', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <ellipse cx="76" cy="84" rx="11" ry="7" fill="${c.face}" stroke="${c.line}" stroke-width="2.2" transform="rotate(-20 76 84)"/>
      <ellipse cx="124" cy="84" rx="11" ry="7" fill="${c.face}" stroke="${c.line}" stroke-width="2.2" transform="rotate(20 124 84)"/>`);
  } else {
    const cape = L >= 4 ? `<path d="M70 126 Q100 114 130 126 L142 172 Q100 158 58 172 Z" fill="${c.cape}" opacity="${sil ? 1 : 0.9}"/>` : '';
    const compass = L >= 3 ? `<g transform="rotate(-10 142 152)">
        <circle cx="142" cy="152" r="13" fill="${c.comp}" stroke="${c.line}" stroke-width="2.5"/>
        <path d="M142 143 L146 152 L142 161 L138 152 Z" fill="${c.needle}"/>
        <circle cx="142" cy="152" r="2" fill="${c.line}"/>
      </g>` : '';
    const scroll = L >= 5 ? `<g transform="rotate(-14 50 150)">
        <rect x="32" y="132" width="38" height="38" rx="2" fill="${c.scroll}" stroke="${c.rod}" stroke-width="1.8"/>
        <path d="M38 143 q7 -5 13 1 t14 -1 M38 157 q9 4 15 -2 t11 3" stroke="${c.map}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <rect x="28" y="128" width="46" height="7" rx="3.5" fill="${c.rod}"/>
        <rect x="28" y="167" width="46" height="7" rx="3.5" fill="${c.rod}"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 84 L88 68 L96 78 L100 64 L104 78 L112 68 L116 84 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      ${cape}
      <ellipse cx="100" cy="150" rx="33" ry="25" fill="${c.wool}" stroke="${c.line}" stroke-width="2.5"/>
      <circle cx="76" cy="140" r="11" fill="${c.wool}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="100" cy="132" r="12" fill="${c.wool}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="124" cy="140" r="11" fill="${c.wool}" stroke="${c.line}" stroke-width="2"/>
      <ellipse cx="84" cy="172" rx="7" ry="6" fill="${c.hoof}"/>
      <ellipse cx="116" cy="172" rx="7" ry="6" fill="${c.hoof}"/>
      <ellipse cx="74" cy="110" rx="11" ry="7" fill="${c.face}" stroke="${c.line}" stroke-width="2.2" transform="rotate(-20 74 110)"/>
      <ellipse cx="126" cy="110" rx="11" ry="7" fill="${c.face}" stroke="${c.line}" stroke-width="2.2" transform="rotate(20 126 110)"/>
      <ellipse cx="100" cy="112" rx="23" ry="25" fill="${c.face}" stroke="${c.line}" stroke-width="2.5"/>
      <circle cx="86" cy="92" r="11" fill="${c.wool}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="100" cy="87" r="12" fill="${c.wool}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="114" cy="92" r="11" fill="${c.wool}" stroke="${c.line}" stroke-width="2"/>
      ${petEyes(c, sil, 91, 109, 112, 4)}
      <ellipse cx="100" cy="124" rx="5" ry="3.5" fill="${c.line}"/>
      <path d="M100 128 q-4 5 -8 1 M100 128 q4 5 8 1" stroke="${c.line}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="80" cy="121" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="120" cy="121" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.7"/>
      ${crown}${compass}${scroll}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 5月理科：かえるのケロ（むしめがね→ゴーグル→試験管→かんむり）
function renderFrogSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { skin:'#86efac', dark:'#22c55e', belly:'#fef9c3', line:'#15803d', eye:'#1f2937',
                blush:'#fda4af', lens:'#bae6fd', handle:'#92400e', goggle:'#0ea5e9', band:'#334155',
                tube:'#e0f2fe', liquid:'#f472b6', crown:'#fbbf24', star:'#fde68a',
                egg:'#dcfce7', spot:'#86efac' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#86efac', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <circle cx="84" cy="82" r="9" fill="${c.skin}" stroke="${c.line}" stroke-width="2.2"/>
      <circle cx="116" cy="82" r="9" fill="${c.skin}" stroke="${c.line}" stroke-width="2.2"/>`);
  } else {
    const tail = L === 2 ? `<path d="M132 150 q22 -6 26 8 q-16 6 -26 0 z" fill="${c.dark}" stroke="${c.line}" stroke-width="2"/>` : '';
    const glass = L >= 3 ? `<g transform="rotate(18 148 146)">
        <circle cx="148" cy="140" r="14" fill="${c.lens}" stroke="${c.line}" stroke-width="3" opacity="0.9"/>
        <rect x="145" y="152" width="7" height="24" rx="3.5" fill="${c.handle}"/>
      </g>` : '';
    const goggle = L >= 4 ? `<path d="M64 96 q36 -10 72 0" stroke="${c.band}" stroke-width="5" fill="none"/>
        <circle cx="82" cy="98" r="14" fill="${c.lens}" stroke="${c.goggle}" stroke-width="3.5" opacity="0.85"/>
        <circle cx="118" cy="98" r="14" fill="${c.lens}" stroke="${c.goggle}" stroke-width="3.5" opacity="0.85"/>` : '';
    const tube = L >= 5 ? `<g transform="rotate(-16 52 148)">
        <rect x="42" y="118" width="20" height="52" rx="10" fill="${c.tube}" stroke="${c.line}" stroke-width="2"/>
        <path d="M42 146 h20 v14 q0 10 -10 10 q-10 0 -10 -10 z" fill="${c.liquid}"/>
        ${sil ? '' : '<circle cx="52" cy="152" r="2.4" fill="#fff" opacity="0.85"/>'}
        <rect x="40" y="114" width="24" height="6" rx="3" fill="${c.line}"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M82 78 L86 62 L94 72 L100 58 L106 72 L114 62 L118 78 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      ${tail}
      <ellipse cx="100" cy="142" rx="35" ry="33" fill="${c.skin}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="154" rx="23" ry="19" fill="${c.belly}"/>
      <ellipse cx="66" cy="168" rx="14" ry="8" fill="${c.skin}" stroke="${c.line}" stroke-width="2.2"/>
      <ellipse cx="134" cy="168" rx="14" ry="8" fill="${c.skin}" stroke="${c.line}" stroke-width="2.2"/>
      <circle cx="82" cy="98" r="16" fill="${c.skin}" stroke="${c.line}" stroke-width="2.5"/>
      <circle cx="118" cy="98" r="16" fill="${c.skin}" stroke="${c.line}" stroke-width="2.5"/>
      ${petEyes(c, sil, 82, 118, 98, 6, true)}
      <path d="M78 128 q22 14 44 0" stroke="${c.line}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="70" cy="126" rx="6" ry="4" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="130" cy="126" rx="6" ry="4" fill="${c.blush}" opacity="0.7"/>
      ${goggle}${crown}${glass}${tube}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 6月社会：かたつむりのマイマイ（コンパス→かさ→地図のから→黄金のから）
function renderSnailSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { body:'#f7d9b8', shell:'#d97706', shellIn:'#fbbf24', line:'#92400e', eye:'#2a1d3d',
                blush:'#fda4af', comp:'#e5e7eb', needle:'#ef4444', umb:'#60a5fa', umbPole:'#7c5c43',
                map:'#22c55e', crown:'#fbbf24', star:'#fde68a', egg:'#fde8cf', spot:'#f0b27a' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#a5b4fc', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M88 80 v-14" stroke="${c.line}" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="88" cy="64" r="4" fill="${c.body}" stroke="${c.line}" stroke-width="2"/>
      <path d="M112 80 v-14" stroke="${c.line}" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="112" cy="64" r="4" fill="${c.body}" stroke="${c.line}" stroke-width="2"/>`);
  } else {
    const shellFill = L >= 6 ? c.crown : c.shell;
    const umbrella = L >= 4 ? `<path d="M58 84 q42 -34 84 0 q-42 -14 -84 0 z" fill="${c.umb}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M100 66 v-8" stroke="${c.umbPole}" stroke-width="3" stroke-linecap="round"/>
        <path d="M100 84 v26 q0 8 -8 8" stroke="${c.umbPole}" stroke-width="3" fill="none" stroke-linecap="round"/>` : '';
    const compass = L >= 3 ? `<g transform="rotate(-8 52 156)">
        <circle cx="52" cy="156" r="12" fill="${c.comp}" stroke="${c.line}" stroke-width="2.5"/>
        <path d="M52 148 L56 156 L52 164 L48 156 Z" fill="${c.needle}"/>
      </g>` : '';
    const mapOnShell = L >= 5 ? `<path d="M112 118 q10 -4 16 4 t14 -2" stroke="${c.map}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M108 140 q12 6 20 -2 t16 4" stroke="${c.map}" stroke-width="3" fill="none" stroke-linecap="round"/>` : '';
    body = `
      <path d="M46 168 q6 -26 30 -30 q18 -3 26 -14 l16 8 q-10 22 -34 26 q-16 3 -20 10 z" fill="${c.body}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="122" cy="132" r="30" fill="${shellFill}" stroke="${c.line}" stroke-width="3"/>
      <path d="M122 132 m0 -20 a20 20 0 1 1 -14 34 a13 13 0 1 0 12 -22 a7 7 0 1 1 4 12"
            fill="none" stroke="${c.shellIn}" stroke-width="4" stroke-linecap="round"/>
      ${mapOnShell}
      <ellipse cx="78" cy="120" rx="20" ry="17" fill="${c.body}" stroke="${c.line}" stroke-width="2.5"/>
      <path d="M68 106 l-6 -18" stroke="${c.line}" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="61" cy="85" r="4.5" fill="${c.body}" stroke="${c.line}" stroke-width="2"/>
      <path d="M88 104 l4 -18" stroke="${c.line}" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="93" cy="83" r="4.5" fill="${c.body}" stroke="${c.line}" stroke-width="2"/>
      ${petEyes(c, sil, 72, 86, 118, 3.6)}
      <path d="M74 128 q5 5 10 1" stroke="${c.line}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="64" cy="126" rx="4.5" ry="3" fill="${c.blush}" opacity="0.7"/>
      ${umbrella}${compass}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 6月理科：あひるのアヒ（むしめがね→レインコート→ビーカー→かんむり）
function renderDuckSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { body:'#fcd34d', chick:'#fef3c7', wing:'#fbbf24', line:'#b45309', beak:'#f59e0b',
                eye:'#2a1d3d', blush:'#fda4af', lens:'#bae6fd', handle:'#92400e',
                coat:'#38bdf8', coatLine:'#0284c7', beaker:'#e0f2fe', liquid:'#34d399',
                crown:'#fbbf24', star:'#fde68a', egg:'#fef9e7', spot:'#fcd34d' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#7dd3fc', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `<path d="M92 74 q8 -12 16 0 z" fill="${c.beak}" stroke="${c.line}" stroke-width="1.6"/>`);
  } else {
    const fill = L === 2 ? c.chick : c.body;
    const coat = L >= 4 ? `<path d="M66 124 Q100 112 134 124 L140 172 Q100 182 60 172 Z" fill="${c.coat}" stroke="${c.coatLine}" stroke-width="2"/>
        <path d="M78 92 q22 -12 44 0 q-6 14 -22 14 q-16 0 -22 -14 z" fill="${c.coat}" stroke="${c.coatLine}" stroke-width="2"/>` : '';
    const glass = L >= 3 ? `<g transform="rotate(16 150 144)">
        <circle cx="150" cy="138" r="13" fill="${c.lens}" stroke="${c.line}" stroke-width="3" opacity="0.9"/>
        <rect x="147" y="149" width="6" height="22" rx="3" fill="${c.handle}"/>
      </g>` : '';
    const beaker = L >= 5 ? `<g transform="rotate(-12 52 150)">
        <path d="M38 124 h28 v10 l10 30 q2 8 -6 8 h-36 q-8 0 -6 -8 l10 -30 z" fill="${c.beaker}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M30 154 h44 l4 10 q2 8 -6 8 h-40 q-8 0 -6 -8 z" fill="${c.liquid}"/>
        ${sil ? '' : '<circle cx="46" cy="160" r="2.4" fill="#fff" opacity="0.85"/>'}
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 78 L88 62 L96 72 L100 58 L104 72 L112 62 L116 78 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <ellipse cx="100" cy="146" rx="31" ry="28" fill="${fill}" stroke="${c.line}" stroke-width="3"/>
      ${coat}
      <ellipse cx="70" cy="146" rx="9" ry="18" fill="${c.wing}" stroke="${c.line}" stroke-width="2" transform="rotate(12 70 146)"/>
      <ellipse cx="130" cy="146" rx="9" ry="18" fill="${c.wing}" stroke="${c.line}" stroke-width="2" transform="rotate(-12 130 146)"/>
      <circle cx="100" cy="106" r="23" fill="${fill}" stroke="${c.line}" stroke-width="3"/>
      ${petEyes(c, sil, 91, 109, 102, 4)}
      <path d="M88 114 q12 -4 24 0 q-6 10 -12 10 q-6 0 -12 -10 z" fill="${c.beak}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>
      <ellipse cx="79" cy="112" rx="5" ry="3.2" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="121" cy="112" rx="5" ry="3.2" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="88" cy="176" rx="9" ry="4.5" fill="${c.beak}"/>
      <ellipse cx="112" cy="176" rx="9" ry="4.5" fill="${c.beak}"/>
      ${crown}${glass}${beaker}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 6月国語：りすのリス丸（えんぴつ→はちまき→本→かんむりとメガネ）
function renderSquirrelSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#d98d5f', belly:'#fde8d7', line:'#8b5e34', ear:'#f0b27a', eye:'#2a1d3d',
                blush:'#fda4af', pencil:'#fbbf24', lead:'#334155', band:'#fff', dot:'#ef4444',
                book:'#7c3aed', page:'#fef3c7', glass:'#78350f', crown:'#fbbf24', star:'#fde68a',
                egg:'#fde8d7', spot:'#f0b27a', nut:'#92400e' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fdba74', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M80 86 L82 66 L96 82 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M120 86 L118 66 L104 82 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2" stroke-linejoin="round"/>`);
  } else {
    const tail = `<path d="M132 162 q34 -6 30 -40 q-3 -16 -18 -14 q12 6 8 20 q-4 16 -22 20 z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const pencil = L >= 3 ? `<g transform="rotate(26 146 138)">
        <rect x="142" y="104" width="8" height="42" rx="2" fill="${c.pencil}" stroke="${c.line}" stroke-width="1.4"/>
        <path d="M142 146 h8 l-4 10 z" fill="${c.lead}"/>
      </g>` : '';
    const band = L >= 4 ? `<path d="M72 100 q28 -12 56 0" stroke="${c.band}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <circle cx="100" cy="94" r="5" fill="${c.dot}"/>` : '';
    const book = L >= 5 ? `<g transform="rotate(-6 100 158)">
        <path d="M66 148 q16 -8 32 0 v24 q-16 -8 -32 0 z" fill="${c.page}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M100 148 q16 -8 32 0 v24 q-16 -8 -32 0 z" fill="${c.page}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M98 146 h4 v28 h-4 z" fill="${c.book}"/>
        <path d="M74 156 h16 M74 163 h14 M110 156 h16 M110 163 h14" stroke="${c.line}" stroke-width="1.6" stroke-linecap="round" opacity="0.6"/>
      </g>` : '';
    const smart = L >= 6 ? `<path d="M84 82 L88 66 L96 76 L100 62 L104 76 L112 66 L116 82 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>
        <circle cx="89" cy="112" r="9" fill="none" stroke="${c.glass}" stroke-width="2.5"/>
        <circle cx="111" cy="112" r="9" fill="none" stroke="${c.glass}" stroke-width="2.5"/>
        <path d="M98 112 h4" stroke="${c.glass}" stroke-width="2.5"/>` : '';
    body = `
      ${tail}
      <path d="M76 100 L80 70 L98 88 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M124 100 L120 70 L102 88 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="100" cy="150" rx="28" ry="24" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="100" cy="154" rx="16" ry="15" fill="${c.belly}"/>
      <ellipse cx="84" cy="170" rx="10" ry="6" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      <ellipse cx="116" cy="170" rx="10" ry="6" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="100" cy="112" r="29" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="76" cy="120" rx="9" ry="7" fill="${c.ear}" opacity="0.8"/>
      <ellipse cx="124" cy="120" rx="9" ry="7" fill="${c.ear}" opacity="0.8"/>
      ${petEyes(c, sil, 90, 110, 110, 4.2)}
      <path d="M96 120 l4 4 l4 -4 z" fill="${c.line}"/>
      <path d="M100 124 q-5 6 -9 2 M100 124 q5 6 9 2" stroke="${c.line}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${band}${smart}${pencil}${book}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 6月算数：かめのカメ吉（三角じょうぎ→数字のこうら→計算→かんむり）
function renderTurtleSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { shell:'#65a30d', shellDark:'#3f6212', shellLine:'#bef264', skin:'#a3e635', line:'#3f6212',
                eye:'#1f2937', blush:'#fda4af', ruler:'#fde047', rulerLine:'#a16207', num:'#fef9c3',
                calc:'#e5e7eb', calcBtn:'#64748b', crown:'#fbbf24', star:'#fde68a',
                egg:'#ecfccb', spot:'#bef264' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#bef264', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `<ellipse cx="100" cy="76" rx="14" ry="8" fill="${c.shell}" stroke="${c.line}" stroke-width="2"/>`);
  } else {
    const nums = L >= 4 ? `<text x="86" y="134" font-size="13" font-weight="bold" fill="${c.num}" text-anchor="middle">1</text>
        <text x="100" y="128" font-size="13" font-weight="bold" fill="${c.num}" text-anchor="middle">2</text>
        <text x="114" y="134" font-size="13" font-weight="bold" fill="${c.num}" text-anchor="middle">3</text>` : '';
    const ruler = L >= 3 ? `<g transform="rotate(-16 150 146)">
        <path d="M138 118 L166 166 L138 166 Z" fill="${c.ruler}" stroke="${c.rulerLine}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M142 158 v-6 M146 158 v-9 M150 158 v-6 M154 158 v-9" stroke="${c.rulerLine}" stroke-width="1.6" stroke-linecap="round"/>
      </g>` : '';
    const calc = L >= 5 ? `<g transform="rotate(10 48 152)">
        <rect x="30" y="130" width="36" height="46" rx="5" fill="${c.calc}" stroke="${c.line}" stroke-width="2"/>
        <rect x="35" y="135" width="26" height="10" rx="2" fill="${c.shellDark}"/>
        <circle cx="39" cy="153" r="3" fill="${c.calcBtn}"/><circle cx="48" cy="153" r="3" fill="${c.calcBtn}"/><circle cx="57" cy="153" r="3" fill="${c.calcBtn}"/>
        <circle cx="39" cy="163" r="3" fill="${c.calcBtn}"/><circle cx="48" cy="163" r="3" fill="${c.calcBtn}"/><circle cx="57" cy="163" r="3" fill="${c.calcBtn}"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M86 84 L90 68 L96 78 L100 64 L104 78 L110 68 L114 84 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <ellipse cx="66" cy="166" rx="13" ry="8" fill="${c.skin}" stroke="${c.line}" stroke-width="2.2"/>
      <ellipse cx="134" cy="166" rx="13" ry="8" fill="${c.skin}" stroke="${c.line}" stroke-width="2.2"/>
      <ellipse cx="100" cy="140" rx="38" ry="30" fill="${c.shell}" stroke="${c.line}" stroke-width="3"/>
      <path d="M100 112 v56 M72 132 h56 M76 152 h48" stroke="${c.shellLine}" stroke-width="2.5" opacity="0.75"/>
      ${nums}
      <circle cx="100" cy="100" r="19" fill="${c.skin}" stroke="${c.line}" stroke-width="2.5"/>
      ${petEyes(c, sil, 93, 107, 97, 3.6)}
      <path d="M96 108 q4 4 8 0" stroke="${c.line}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="85" cy="105" rx="4.5" ry="3" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="115" cy="105" rx="4.5" ry="3" fill="${c.blush}" opacity="0.7"/>
      ${crown}${ruler}${calc}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 7月社会：きつねのコン太（双眼鏡→たんけんぼうし→旗→王かん）
function renderFoxSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#fb923c', belly:'#fff7ed', ear:'#7c2d12', line:'#c2410c', eye:'#2a1d3d',
                blush:'#fda4af', bino:'#334155', lens:'#bae6fd', hat:'#a3a380', band:'#65a30d',
                flag:'#ef4444', pole:'#7c5c43', crown:'#fbbf24', star:'#fde68a',
                egg:'#ffedd5', spot:'#fdba74' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fdba74', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M78 88 L74 62 L96 82 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M122 88 L126 62 L104 82 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2" stroke-linejoin="round"/>`);
  } else {
    const tail = `<path d="M128 160 q34 4 34 -26 q0 -14 -12 -16 q8 12 0 24 q-8 12 -24 14 z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M150 118 q12 2 12 16 q0 8 -4 12 q-2 -18 -8 -28 z" fill="${c.belly}"/>`;
    const bino = L >= 3 ? `<g transform="rotate(-8 146 140)">
        <rect x="134" y="128" width="12" height="26" rx="5" fill="${c.bino}"/>
        <rect x="150" y="128" width="12" height="26" rx="5" fill="${c.bino}"/>
        <rect x="146" y="134" width="4" height="8" fill="${c.bino}"/>
        <circle cx="140" cy="152" r="5" fill="${c.lens}"/><circle cx="156" cy="152" r="5" fill="${c.lens}"/>
      </g>` : '';
    const hat = L >= 4 ? `<path d="M62 92 q38 -30 76 0 q-38 -10 -76 0 z" fill="${c.hat}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M76 84 q24 -8 48 0" stroke="${c.band}" stroke-width="5" fill="none"/>` : '';
    const flag = L >= 5 ? `<g transform="rotate(6 46 140)">
        <rect x="42" y="104" width="5" height="66" rx="2.5" fill="${c.pole}"/>
        <path d="M47 108 q18 6 30 -2 v22 q-14 8 -30 2 z" fill="${c.flag}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 78 L88 62 L96 72 L100 58 L104 72 L112 62 L116 78 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      ${tail}
      <path d="M74 98 L70 66 L94 86 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M79 92 L77 74 L90 86 Z" fill="${c.ear}"/>
      <path d="M126 98 L130 66 L106 86 Z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M121 92 L123 74 L110 86 Z" fill="${c.ear}"/>
      <ellipse cx="100" cy="150" rx="29" ry="24" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="100" cy="154" rx="17" ry="15" fill="${c.belly}"/>
      <ellipse cx="84" cy="170" rx="11" ry="6" fill="${c.ear}"/>
      <ellipse cx="116" cy="170" rx="11" ry="6" fill="${c.ear}"/>
      <circle cx="100" cy="112" r="29" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <path d="M100 118 q-18 4 -22 14 q14 6 22 6 q8 0 22 -6 q-4 -10 -22 -14 z" fill="${c.belly}"/>
      ${petEyes(c, sil, 90, 110, 110, 4.2)}
      <path d="M96 124 l4 4 l4 -4 z" fill="${c.eye}"/>
      <path d="M100 128 q-5 6 -9 2 M100 128 q5 6 9 2" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${hat}${crown}${bino}${flag}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 7月理科：いるかのドルル（温度計→シュノーケル→けんび鏡→かんむり）
function renderDolphinSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { body:'#38bdf8', dark:'#0284c7', belly:'#f0f9ff', line:'#075985', eye:'#1f2937',
                blush:'#fda4af', therm:'#e5e7eb', mercury:'#ef4444', snork:'#f59e0b',
                scope:'#94a3b8', scopeDark:'#475569', crown:'#fbbf24', star:'#fde68a',
                egg:'#e0f2fe', spot:'#7dd3fc' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#38bdf8', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `<path d="M100 74 q10 -14 20 -10 q-6 8 -6 14 z" fill="${c.body}" stroke="${c.line}" stroke-width="2"/>`);
  } else {
    const therm = L >= 3 ? `<g transform="rotate(14 150 142)">
        <rect x="145" y="110" width="10" height="46" rx="5" fill="${c.therm}" stroke="${c.line}" stroke-width="1.8"/>
        <rect x="147.5" y="126" width="5" height="30" fill="${c.mercury}"/>
        <circle cx="150" cy="160" r="8" fill="${c.mercury}" stroke="${c.line}" stroke-width="1.8"/>
      </g>` : '';
    const snorkel = L >= 4 ? `<path d="M126 92 q14 -4 14 12 v22" stroke="${c.snork}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M72 104 q28 -12 56 0" stroke="${c.scopeDark}" stroke-width="4" fill="none"/>` : '';
    const scope = L >= 5 ? `<g transform="rotate(-10 50 148)">
        <rect x="30" y="166" width="44" height="8" rx="4" fill="${c.scopeDark}"/>
        <rect x="46" y="120" width="10" height="48" rx="4" fill="${c.scope}" stroke="${c.line}" stroke-width="1.6"/>
        <rect x="38" y="112" width="26" height="12" rx="5" fill="${c.scopeDark}"/>
        <rect x="34" y="146" width="30" height="7" rx="3" fill="${c.scope}"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 76 L88 60 L96 70 L100 56 L104 70 L112 60 L116 76 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <path d="M100 86 q16 -18 30 -14 q-8 12 -8 22 z" fill="${c.dark}" stroke="${c.line}" stroke-width="2.2" stroke-linejoin="round"/>
      <ellipse cx="100" cy="132" rx="34" ry="40" fill="${c.body}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="148" rx="22" ry="26" fill="${c.belly}"/>
      <path d="M66 150 q-22 6 -26 24 q22 2 30 -12 z" fill="${c.body}" stroke="${c.line}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M134 150 q22 6 26 24 q-22 2 -30 -12 z" fill="${c.body}" stroke="${c.line}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M86 122 q14 10 28 0 q-2 12 -14 12 q-12 0 -14 -12 z" fill="${c.belly}"/>
      ${petEyes(c, sil, 88, 112, 110, 4.2)}
      <path d="M86 126 q14 12 28 0" stroke="${c.line}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <ellipse cx="76" cy="122" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="124" cy="122" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.7"/>
      ${snorkel}${crown}${therm}${scope}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 基礎コン社会：ぞうのゾウ丸（地球儀→マント→地図の巻物→王かん）
function renderElephantSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { skin:'#a5b4fc', dark:'#818cf8', belly:'#e0e7ff', line:'#4338ca', eye:'#1f2937',
                blush:'#fda4af', globe:'#38bdf8', land:'#22c55e', cape:'#ef4444',
                scroll:'#fef3c7', rod:'#b45309', map:'#0ea5e9', crown:'#fbbf24', star:'#fde68a',
                egg:'#e0e7ff', spot:'#c7d2fe' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#a5b4fc', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <ellipse cx="74" cy="86" rx="12" ry="14" fill="${c.skin}" stroke="${c.line}" stroke-width="2.2"/>
      <ellipse cx="126" cy="86" rx="12" ry="14" fill="${c.skin}" stroke="${c.line}" stroke-width="2.2"/>`);
  } else {
    const cape = L >= 4 ? `<path d="M70 122 Q100 110 130 122 L144 174 Q100 160 56 174 Z" fill="${c.cape}" opacity="${sil ? 1 : 0.9}"/>` : '';
    const globe = L >= 3 ? `<g transform="rotate(-6 148 148)">
        <circle cx="148" cy="144" r="15" fill="${c.globe}" stroke="${c.line}" stroke-width="2"/>
        <path d="M138 138 q8 4 16 -2 q6 8 -2 12 q-10 4 -14 -4 z" fill="${c.land}"/>
        <rect x="145" y="159" width="6" height="12" rx="3" fill="${c.rod}"/>
        <rect x="136" y="170" width="24" height="6" rx="3" fill="${c.rod}"/>
      </g>` : '';
    const scroll = L >= 5 ? `<g transform="rotate(-12 48 146)">
        <rect x="28" y="128" width="40" height="38" rx="2" fill="${c.scroll}" stroke="${c.rod}" stroke-width="1.8"/>
        <path d="M34 139 q8 -5 14 1 t14 -1 M34 153 q9 4 15 -2 t12 3" stroke="${c.map}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <rect x="24" y="124" width="48" height="7" rx="3.5" fill="${c.rod}"/>
        <rect x="24" y="163" width="48" height="7" rx="3.5" fill="${c.rod}"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 78 L88 62 L96 72 L100 58 L104 72 L112 62 L116 78 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      ${cape}
      <ellipse cx="100" cy="152" rx="32" ry="24" fill="${c.skin}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="82" cy="172" rx="11" ry="7" fill="${c.dark}"/>
      <ellipse cx="118" cy="172" rx="11" ry="7" fill="${c.dark}"/>
      <ellipse cx="68" cy="106" rx="16" ry="20" fill="${c.dark}" stroke="${c.line}" stroke-width="2.2"/>
      <ellipse cx="132" cy="106" rx="16" ry="20" fill="${c.dark}" stroke="${c.line}" stroke-width="2.2"/>
      <circle cx="100" cy="110" r="28" fill="${c.skin}" stroke="${c.line}" stroke-width="3"/>
      <path d="M100 124 q-6 20 4 30 q10 8 16 -2" stroke="${c.skin}" stroke-width="13" fill="none" stroke-linecap="round"/>
      <path d="M100 124 q-6 20 4 30 q10 8 16 -2" stroke="${c.line}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.35"/>
      ${petEyes(c, sil, 89, 111, 106, 4)}
      <ellipse cx="77" cy="118" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="123" cy="118" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.7"/>
      ${crown}${globe}${scroll}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 基礎コン理科：はりねずみのハリー（むしめがね→エプロン→フラスコ→かんむり）
function renderHedgehogSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { spike:'#8b5e34', spikeLt:'#a97452', face:'#fde8d7', line:'#5c3d21', eye:'#2a1d3d',
                blush:'#fda4af', lens:'#bae6fd', handle:'#92400e', apron:'#f9a8d4',
                flask:'#e0f2fe', liquid:'#a78bfa', crown:'#fbbf24', star:'#fde68a',
                egg:'#fde8d7', spot:'#d3a276' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fbbf24', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `<path d="M84 78 l6 -14 l6 12 l6 -16 l6 16 l6 -12 l6 14 z" fill="${c.spike}" stroke="${c.line}" stroke-width="1.8" stroke-linejoin="round"/>`);
  } else {
    const spikes = (() => {
      let out = '';
      for (let i = 0; i <= 12; i++) {
        const a = Math.PI * (1 + i / 12);
        const x = 100 + Math.cos(a) * 36, y = 142 + Math.sin(a) * 34;
        const x2 = 100 + Math.cos(a) * 50, y2 = 142 + Math.sin(a) * 47;
        out += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${(x + Math.cos(a + 0.22) * 12).toFixed(1)} ${(y + Math.sin(a + 0.22) * 12).toFixed(1)} Z" fill="${i % 2 ? c.spike : c.spikeLt}" stroke="${c.line}" stroke-width="1.4" stroke-linejoin="round"/>`;
      }
      return out;
    })();
    const apron = L >= 4 ? `<path d="M84 140 q16 -6 32 0 l4 32 q-20 6 -40 0 z" fill="${c.apron}" stroke="${c.line}" stroke-width="1.8"/>
        <path d="M92 140 l4 -10 M108 140 l-4 -10" stroke="${c.apron}" stroke-width="4" stroke-linecap="round"/>` : '';
    const glass = L >= 3 ? `<g transform="rotate(18 152 142)">
        <circle cx="152" cy="136" r="13" fill="${c.lens}" stroke="${c.line}" stroke-width="3" opacity="0.9"/>
        <rect x="149" y="147" width="6" height="22" rx="3" fill="${c.handle}"/>
      </g>` : '';
    const flask = L >= 5 ? `<g transform="rotate(-14 48 150)">
        <path d="M40 120 h14 v16 l12 26 q3 7 -5 7 h-28 q-8 0 -5 -7 l12 -26 z" fill="${c.flask}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M32 154 h30 l4 8 q2 7 -5 7 h-28 q-8 0 -5 -7 z" fill="${c.liquid}"/>
        <rect x="38" y="116" width="18" height="5" rx="2" fill="${c.line}"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 86 L88 70 L96 80 L100 66 L104 80 L112 70 L116 86 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      ${spikes}
      <ellipse cx="100" cy="146" rx="37" ry="33" fill="${c.spike}" stroke="${c.line}" stroke-width="2.5"/>
      ${apron}
      <ellipse cx="100" cy="128" rx="26" ry="22" fill="${c.face}" stroke="${c.line}" stroke-width="2.5"/>
      ${petEyes(c, sil, 91, 109, 124, 4)}
      <ellipse cx="100" cy="136" rx="5" ry="3.6" fill="${c.eye}"/>
      <path d="M100 140 q-4 5 -8 1 M100 140 q4 5 8 1" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="80" cy="133" rx="5" ry="3.2" fill="${c.blush}" opacity="0.7"/>
      <ellipse cx="120" cy="133" rx="5" ry="3.2" fill="${c.blush}" opacity="0.7"/>
      ${crown}${glass}${flask}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 基礎コン国語：パンダのパン子（竹の筆→マフラー→本→かんむりとメガネ）
function renderPandaSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#ffffff', black:'#1f2937', line:'#94a3b8', eye:'#1f2937', blush:'#fda4af',
                bamboo:'#65a30d', brushTip:'#334155', scarf:'#ef4444', book:'#7c3aed',
                page:'#fef3c7', glass:'#334155', crown:'#fbbf24', star:'#fde68a',
                egg:'#f8fafc', spot:'#e2e8f0' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#e9d5ff', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <circle cx="80" cy="80" r="10" fill="${c.black}"/>
      <circle cx="120" cy="80" r="10" fill="${c.black}"/>`);
  } else {
    const brush = L >= 3 ? `<g transform="rotate(26 148 138)">
        <rect x="144" y="102" width="8" height="44" rx="4" fill="${c.bamboo}" stroke="${c.line}" stroke-width="1.2"/>
        <path d="M144 106 h8 M144 118 h8 M144 130 h8" stroke="${c.line}" stroke-width="1.2" opacity="0.6"/>
        <path d="M142 146 h12 l-3 13 q-3 7 -6 0 z" fill="${c.brushTip}"/>
      </g>` : '';
    const scarf = L >= 4 ? `<path d="M76 134 q24 12 48 0 l2 12 q-26 12 -52 0 z" fill="${c.scarf}" stroke="${c.line}" stroke-width="1.6"/>
        <path d="M118 146 l10 22 l-12 4 l-6 -22 z" fill="${c.scarf}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    const books = L >= 5 ? `<g>
        <rect x="26" y="152" width="44" height="10" rx="2" fill="${c.book}" stroke="${c.line}" stroke-width="1.6"/>
        <rect x="30" y="140" width="40" height="10" rx="2" fill="${c.page}" stroke="${c.line}" stroke-width="1.6"/>
        <rect x="28" y="164" width="46" height="10" rx="2" fill="${c.bamboo}" stroke="${c.line}" stroke-width="1.6"/>
      </g>` : '';
    const smart = L >= 6 ? `<path d="M84 74 L88 58 L96 68 L100 54 L104 68 L112 58 L116 74 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>
        <circle cx="88" cy="112" r="10" fill="none" stroke="${c.glass}" stroke-width="2.5"/>
        <circle cx="112" cy="112" r="10" fill="none" stroke="${c.glass}" stroke-width="2.5"/>
        <path d="M98 112 h4" stroke="${c.glass}" stroke-width="2.5"/>` : '';
    body = `
      <circle cx="76" cy="86" r="14" fill="${c.black}"/>
      <circle cx="124" cy="86" r="14" fill="${c.black}"/>
      <ellipse cx="100" cy="150" rx="31" ry="26" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="72" cy="150" rx="11" ry="20" fill="${c.black}" transform="rotate(12 72 150)"/>
      <ellipse cx="128" cy="150" rx="11" ry="20" fill="${c.black}" transform="rotate(-12 128 150)"/>
      <ellipse cx="86" cy="174" rx="12" ry="7" fill="${c.black}"/>
      <ellipse cx="114" cy="174" rx="12" ry="7" fill="${c.black}"/>
      ${scarf}
      <circle cx="100" cy="110" r="30" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="88" cy="110" rx="11" ry="13" fill="${c.black}" transform="rotate(-12 88 110)"/>
      <ellipse cx="112" cy="110" rx="11" ry="13" fill="${c.black}" transform="rotate(12 112 110)"/>
      ${petEyes({ eye: sil ? c.eye : '#fff' }, sil, 88, 112, 110, 4)}
      <ellipse cx="100" cy="124" rx="6" ry="4" fill="${c.black}"/>
      <path d="M100 128 q-5 6 -9 2 M100 128 q5 6 9 2" stroke="${c.black}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${smart}${brush}${books}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// 基礎コン算数：ハムスターのハム太（かずブロック→ものさし→そろばん→王かん）
function renderHamsterSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#fbbf24', belly:'#fef3c7', ear:'#f0b27a', line:'#b45309', eye:'#2a1d3d',
                blush:'#fda4af', blockA:'#ef4444', blockB:'#3b82f6', blockC:'#22c55e',
                ruler:'#fde047', rulerLine:'#a16207', frame:'#b45309', bead:'#f472b6',
                crown:'#fbbf24', star:'#fde68a', egg:'#fef3c7', spot:'#fcd34d' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fcd34d', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <circle cx="82" cy="80" r="9" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="118" cy="80" r="9" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>`);
  } else {
    const blocks = L >= 3 ? `<g>
        <rect x="30" y="150" width="20" height="20" rx="3" fill="${c.blockA}" stroke="${c.line}" stroke-width="1.6"/>
        <rect x="52" y="150" width="20" height="20" rx="3" fill="${c.blockB}" stroke="${c.line}" stroke-width="1.6"/>
        <rect x="41" y="128" width="20" height="20" rx="3" fill="${c.blockC}" stroke="${c.line}" stroke-width="1.6"/>
        <text x="40" y="165" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">1</text>
        <text x="62" y="165" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">2</text>
        <text x="51" y="143" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">3</text>
      </g>` : '';
    const ruler = L >= 4 ? `<g transform="rotate(-72 148 142)">
        <rect x="118" y="134" width="60" height="16" rx="3" fill="${c.ruler}" stroke="${c.rulerLine}" stroke-width="1.8"/>
        <path d="M126 134 v6 M134 134 v9 M142 134 v6 M150 134 v9 M158 134 v6 M166 134 v9" stroke="${c.rulerLine}" stroke-width="1.6"/>
      </g>` : '';
    const soroban = L >= 5 ? `<g transform="rotate(8 100 176)">
        <rect x="64" y="164" width="72" height="26" rx="3" fill="none" stroke="${c.frame}" stroke-width="3"/>
        <path d="M64 172 h72" stroke="${c.frame}" stroke-width="2"/>
        ${[74, 88, 102, 116, 130].map(x => `<ellipse cx="${x}" cy="169" rx="4.5" ry="2.8" fill="${c.bead}"/><ellipse cx="${x}" cy="183" rx="4.5" ry="2.8" fill="${c.bead}"/>`).join('')}
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 76 L88 60 L96 70 L100 56 L104 70 L112 60 L116 76 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <circle cx="78" cy="90" r="12" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2"/>
      <circle cx="78" cy="90" r="6" fill="${c.ear}"/>
      <circle cx="122" cy="90" r="12" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2"/>
      <circle cx="122" cy="90" r="6" fill="${c.ear}"/>
      <ellipse cx="100" cy="142" rx="34" ry="32" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="152" rx="21" ry="20" fill="${c.belly}"/>
      <ellipse cx="86" cy="172" rx="9" ry="5" fill="${c.ear}"/>
      <ellipse cx="114" cy="172" rx="9" ry="5" fill="${c.ear}"/>
      <circle cx="100" cy="112" r="27" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="74" cy="120" rx="12" ry="10" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      <ellipse cx="126" cy="120" rx="12" ry="10" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      ${petEyes(c, sil, 90, 110, 110, 4)}
      <ellipse cx="100" cy="121" rx="4.5" ry="3" fill="${c.eye}"/>
      <path d="M100 125 q-4 5 -8 1 M100 125 q4 5 8 1" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${crown}${blocks}${ruler}${soroban}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderRabbitSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#f8fafc', belly:'#ffffff', ear:'#fbcfe8', line:'#9d174d', eye:'#2a1d3d',
                blush:'#fda4af', pieceA:'#f97316', pieceB:'#3b82f6', pieceC:'#22c55e',
                card:'#fef3c7', cardLine:'#b45309', crown:'#fbbf24', star:'#fde68a',
                egg:'#fdf2f8', spot:'#f9a8d4' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#f9a8d4', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <ellipse cx="88" cy="70" rx="6" ry="14" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      <ellipse cx="112" cy="70" rx="6" ry="14" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>`);
  } else {
    const pieces = L >= 3 ? `<g>
        <rect x="28" y="150" width="20" height="20" rx="3" fill="${c.pieceA}" stroke="${c.line}" stroke-width="1.6"/>
        <rect x="50" y="150" width="20" height="20" rx="3" fill="${c.pieceB}" stroke="${c.line}" stroke-width="1.6"/>
        <circle cx="49" cy="160" r="4" fill="${c.pieceB}"/>
        <rect x="39" y="128" width="20" height="20" rx="3" fill="${c.pieceC}" stroke="${c.line}" stroke-width="1.6"/>
        <circle cx="49" cy="149" r="4" fill="${c.pieceC}"/>
      </g>` : '';
    const card = L >= 4 ? `<g transform="rotate(12 150 145)">
        <rect x="134" y="124" width="34" height="42" rx="4" fill="${c.card}" stroke="${c.cardLine}" stroke-width="2"/>
        <text x="151" y="143" font-size="12" font-weight="bold" fill="${c.cardLine}" text-anchor="middle">12</text>
        <text x="151" y="158" font-size="8" fill="${c.cardLine}" text-anchor="middle">1·2·3·4</text>
      </g>` : '';
    const glasses = L >= 5 ? `<g fill="none" stroke="${c.eye}" stroke-width="2">
        <circle cx="90" cy="110" r="8"/><circle cx="110" cy="110" r="8"/><path d="M98 110 h4"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 88 L88 72 L96 82 L100 68 L104 82 L112 72 L116 88 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <ellipse cx="86" cy="66" rx="10" ry="28" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2" transform="rotate(-10 86 66)"/>
      <ellipse cx="86" cy="68" rx="4.5" ry="19" fill="${c.ear}" transform="rotate(-10 86 68)"/>
      <ellipse cx="114" cy="66" rx="10" ry="28" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2" transform="rotate(10 114 66)"/>
      <ellipse cx="114" cy="68" rx="4.5" ry="19" fill="${c.ear}" transform="rotate(10 114 68)"/>
      <ellipse cx="100" cy="146" rx="32" ry="30" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="154" rx="19" ry="18" fill="${c.belly}"/>
      <ellipse cx="86" cy="174" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="114" cy="174" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <circle cx="100" cy="112" r="26" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="80" cy="120" rx="6" ry="4" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="120" cy="120" rx="6" ry="4" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 90, 110, 110, 4)}
      <path d="M97 119 l3 3 l3 -3 z" fill="${c.ear}" stroke="${c.line}" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M100 122 q-4 5 -8 1 M100 122 q4 5 8 1" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${glasses}${crown}${pieces}${card}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderBearSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#b45309', belly:'#fde68a', ear:'#f59e0b', line:'#78350f', eye:'#2a1d3d',
                blush:'#fda4af', moon:'#fde047', scope:'#6366f1', scopeLine:'#312e81',
                dango:'#fff7ed', plate:'#f59e0b', crown:'#fbbf24', star:'#fde68a',
                egg:'#fef3c7', spot:'#fcd34d' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fde047', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <circle cx="84" cy="80" r="9" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="116" cy="80" r="9" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>`);
  } else {
    const moon = L >= 2 ? `<path d="M150 58 a16 16 0 1 0 12 26 a13 13 0 1 1 -12 -26 z" fill="${c.moon}" stroke="${c.line}" stroke-width="1.5"/>` : '';
    const scope = L >= 3 ? `<g transform="rotate(-35 146 150)">
        <rect x="128" y="142" width="40" height="13" rx="4" fill="${c.scope}" stroke="${c.scopeLine}" stroke-width="2"/>
        <rect x="164" y="139" width="9" height="19" rx="3" fill="${c.scope}" stroke="${c.scopeLine}" stroke-width="2"/>
      </g>` : '';
    const dango = L >= 5 ? `<g>
        <ellipse cx="54" cy="176" rx="22" ry="6" fill="${c.plate}" stroke="${c.line}" stroke-width="1.6"/>
        <circle cx="46" cy="168" r="7" fill="${c.dango}" stroke="${c.line}" stroke-width="1.4"/>
        <circle cx="62" cy="168" r="7" fill="${c.dango}" stroke="${c.line}" stroke-width="1.4"/>
        <circle cx="54" cy="157" r="7" fill="${c.dango}" stroke="${c.line}" stroke-width="1.4"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 80 L88 64 L96 74 L100 60 L104 74 L112 64 L116 80 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <circle cx="78" cy="92" r="12" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2"/>
      <circle cx="78" cy="92" r="6" fill="${c.ear}"/>
      <circle cx="122" cy="92" r="12" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2"/>
      <circle cx="122" cy="92" r="6" fill="${c.ear}"/>
      <ellipse cx="100" cy="145" rx="34" ry="31" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="153" rx="20" ry="19" fill="${c.belly}"/>
      <path d="M92 132 a8 8 0 1 0 16 0" fill="none" stroke="${c.moon}" stroke-width="3"/>
      <ellipse cx="84" cy="174" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="116" cy="174" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <circle cx="100" cy="114" r="27" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="100" cy="124" rx="12" ry="9" fill="${c.belly}"/>
      <ellipse cx="80" cy="122" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="120" cy="122" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 90, 110, 110, 4)}
      <ellipse cx="100" cy="121" rx="4.5" ry="3" fill="${c.eye}"/>
      <path d="M100 124 q-4 5 -8 1 M100 124 q4 5 8 1" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${moon}${crown}${scope}${dango}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// ============================================================
// ホームの育成カード
// ============================================================

window.CHARS = {
  luna: renderLunaSVG,
  kabu: renderKabuSVG,
  tanuki: renderTanukiSVG,
  parrot: renderParrotSVG,
  owl: renderOwlSVG,
  neko: renderNekoSVG,
  penguin: renderPenguinSVG,
  sheep: renderSheepSVG,
  frog: renderFrogSVG,
  snail: renderSnailSVG,
  duck: renderDuckSVG,
  squirrel: renderSquirrelSVG,
  turtle: renderTurtleSVG,
  fox: renderFoxSVG,
  dolphin: renderDolphinSVG,
  elephant: renderElephantSVG,
  hedgehog: renderHedgehogSVG,
  panda: renderPandaSVG,
  hamster: renderHamsterSVG,
  rabbit: renderRabbitSVG,
  bear: renderBearSVG,
};
