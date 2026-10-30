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

function renderCowSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#ffffff', patch:'#3f3a4a', muzzle:'#fbcfe8', nose:'#be185d', horn:'#fef3c7',
                ear:'#f9a8d4', line:'#57534e', eye:'#2a1d3d', blush:'#fda4af',
                bell:'#facc15', bellLine:'#a16207', collar:'#ef4444',
                apple:'#ef4444', leaf:'#22c55e', stem:'#78350f', grape:'#8b5cf6',
                milk:'#ffffff', cap:'#3b82f6', basket:'#d97706', basketLine:'#92400e',
                crown:'#fbbf24', star:'#fde68a', egg:'#fafaf9', spot:'#57534e' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#86efac', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M86 80 q-4 -12 2 -16 q2 8 6 14 z" fill="${c.horn}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M114 80 q4 -12 -2 -16 q-2 8 -6 14 z" fill="${c.horn}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>`);
  } else {
    const bell = `<g>
        <path d="M78 134 q22 10 44 0" fill="none" stroke="${c.collar}" stroke-width="4" stroke-linecap="round"/>
        <path d="M93 138 q7 -6 14 0 l2 11 h-18 z" fill="${c.bell}" stroke="${c.bellLine}" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="100" cy="150" r="2.4" fill="${c.bellLine}"/>
      </g>`;
    const apple = (x, y, r) => `<g>
        <circle cx="${x}" cy="${y}" r="${r}" fill="${c.apple}" stroke="${c.line}" stroke-width="1.6"/>
        <path d="M${x} ${y - r + 1} q1 -5 3 -7" stroke="${c.stem}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <ellipse cx="${x + 5}" cy="${y - r - 3}" rx="4.5" ry="2.4" fill="${c.leaf}" transform="rotate(-25 ${x + 5} ${y - r - 3})"/>
      </g>`;
    // Lv3 りんご1つ → Lv5 くだものかご（りんご＋ぶどう）
    const fruit = L >= 5 ? `<g>
        ${apple(44, 158, 8)}
        <g fill="${c.grape}" stroke="${c.line}" stroke-width="1">
          <circle cx="60" cy="156" r="4.2"/><circle cx="68" cy="156" r="4.2"/><circle cx="64" cy="163" r="4.2"/>
          <circle cx="56" cy="163" r="4.2"/><circle cx="60" cy="170" r="4.2"/>
        </g>
        <path d="M30 164 h44 l-5 18 h-34 z" fill="${c.basket}" stroke="${c.basketLine}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M34 170 h36 M36 176 h32" stroke="${c.basketLine}" stroke-width="1.2"/>
      </g>` : L >= 3 ? apple(52, 168, 10) : '';
    const milk = L >= 4 ? `<g transform="rotate(10 152 152)">
        <path d="M144 132 h16 v6 l4 8 v26 q0 4 -4 4 h-16 q-4 0 -4 -4 v-26 l4 -8 z" fill="${c.milk}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="143" y="127" width="18" height="6" rx="2" fill="${c.cap}" stroke="${c.line}" stroke-width="1.6"/>
        <rect x="143" y="152" width="18" height="12" fill="${c.cap}" opacity="0.35"/>
        <text x="152" y="161" font-size="7" font-weight="bold" fill="${c.cap}" text-anchor="middle">MILK</text>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 84 L88 68 L96 78 L100 64 L104 78 L112 68 L116 84 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <path d="M82 92 q-10 -8 -8 -20 q6 6 14 12 z" fill="${c.horn}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M118 92 q10 -8 8 -20 q-6 6 -14 12 z" fill="${c.horn}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="70" cy="104" rx="13" ry="7" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2" transform="rotate(20 70 104)"/>
      <ellipse cx="71" cy="104" rx="7" ry="3.5" fill="${c.ear}" transform="rotate(20 71 104)"/>
      <ellipse cx="130" cy="104" rx="13" ry="7" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2" transform="rotate(-20 130 104)"/>
      <ellipse cx="129" cy="104" rx="7" ry="3.5" fill="${c.ear}" transform="rotate(-20 129 104)"/>
      <ellipse cx="100" cy="146" rx="34" ry="31" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <path d="M72 138 q8 -6 14 2 q2 10 -8 12 q-8 -2 -6 -14 z" fill="${c.patch}"/>
      <path d="M118 150 q10 -4 14 4 q-2 12 -12 10 q-6 -6 -2 -14 z" fill="${c.patch}"/>
      <ellipse cx="84" cy="174" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="116" cy="174" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <circle cx="100" cy="112" r="27" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <path d="M108 87 q12 0 16 12 q-6 6 -14 0 q-4 -6 -2 -12 z" fill="${c.patch}"/>
      <path d="M80 94 q4 -4 9 -2 q0 7 -6 8 q-4 -1 -3 -6 z" fill="${c.patch}"/>
      <ellipse cx="100" cy="124" rx="17" ry="11" fill="${c.muzzle}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="93" cy="122" rx="2.4" ry="3" fill="${c.nose}"/>
      <ellipse cx="107" cy="122" rx="2.4" ry="3" fill="${c.nose}"/>
      <path d="M95 129 q5 4 10 0" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="78" cy="116" rx="5" ry="3.2" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="122" cy="116" rx="5" ry="3.2" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 90, 110, 106, 4)}
      ${bell}${crown}${fruit}${milk}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderKoalaSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#9ca3af', belly:'#f3f4f6', ear:'#d1d5db', earIn:'#fbcfe8', line:'#4b5563', eye:'#2a1d3d',
                nose:'#374151', blush:'#fda4af', leaf:'#22c55e', leafLine:'#166534',
                ruler:'#fde047', rulerLine:'#a16207', paper:'#ffffff', grid:'#93c5fd', cell:'#60a5fa',
                tri:'#a7f3d0', triLine:'#047857', crown:'#fbbf24', star:'#fde68a',
                egg:'#f3f4f6', spot:'#d1d5db' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#86efac', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <circle cx="82" cy="80" r="10" fill="${c.ear}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="118" cy="80" r="10" fill="${c.ear}" stroke="${c.line}" stroke-width="2"/>`);
  } else {
    // Lv2〜：ユーカリの葉っぱ
    const leaf = L >= 2 ? `<g>
        <path d="M44 138 q4 -16 12 -28" stroke="${c.leafLine}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <ellipse cx="50" cy="126" rx="10" ry="4.6" fill="${c.leaf}" stroke="${c.leafLine}" stroke-width="1.5" transform="rotate(-55 50 126)"/>
        <ellipse cx="57" cy="114" rx="10" ry="4.6" fill="${c.leaf}" stroke="${c.leafLine}" stroke-width="1.5" transform="rotate(-25 57 114)"/>
        <ellipse cx="43" cy="136" rx="9" ry="4.2" fill="${c.leaf}" stroke="${c.leafLine}" stroke-width="1.5" transform="rotate(-100 43 136)"/>
      </g>` : '';
    // Lv3〜：ものさし
    const ruler = L >= 3 ? `<g transform="rotate(8 173 150)">
        <rect x="167" y="120" width="12" height="58" rx="2" fill="${c.ruler}" stroke="${c.rulerLine}" stroke-width="1.8"/>
        <path d="M167 128 h6 M167 136 h4 M167 144 h6 M167 152 h4 M167 160 h6 M167 168 h4" stroke="${c.rulerLine}" stroke-width="1.2"/>
      </g>` : '';
    // Lv4〜：ほうがんノート（マスを色でぬって面積をかぞえる）
    const grid = L >= 4 ? `<g transform="rotate(-6 146 160)">
        <rect x="126" y="142" width="40" height="36" rx="2" fill="${c.paper}" stroke="${c.line}" stroke-width="1.8"/>
        <path d="M136 142 v36 M146 142 v36 M156 142 v36 M126 151 h40 M126 160 h40 M126 169 h40" stroke="${c.grid}" stroke-width="1"/>
        <rect x="136" y="151" width="20" height="18" fill="${c.cell}" opacity="0.65"/>
      </g>` : '';
    // Lv5〜：三角じょうぎ
    const tri = L >= 5 ? `<g>
        <path d="M26 182 L62 182 L26 150 Z" fill="${c.tri}" stroke="${c.triLine}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M33 175 L50 175 L33 160 Z" fill="${c.paper}" stroke="${c.triLine}" stroke-width="1.2" stroke-linejoin="round"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 82 L88 66 L96 76 L100 62 L104 76 L112 66 L116 82 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <circle cx="72" cy="96" r="16" fill="${c.fur}" stroke="${c.line}" stroke-width="2.4"/>
      <circle cx="72" cy="96" r="9" fill="${c.earIn}"/>
      <circle cx="128" cy="96" r="16" fill="${c.fur}" stroke="${c.line}" stroke-width="2.4"/>
      <circle cx="128" cy="96" r="9" fill="${c.earIn}"/>
      <ellipse cx="100" cy="146" rx="34" ry="31" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="154" rx="20" ry="19" fill="${c.belly}"/>
      <ellipse cx="84" cy="174" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="116" cy="174" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <circle cx="100" cy="114" r="27" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="80" cy="123" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="120" cy="123" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 88, 112, 109, 3.6)}
      <ellipse cx="100" cy="120" rx="7.5" ry="10" fill="${c.nose}" stroke="${c.line}" stroke-width="1"/>
      <ellipse cx="97" cy="116" rx="2" ry="3" fill="#ffffff" opacity="0.35"/>
      <path d="M100 130 q-4 5 -8 1 M100 130 q4 5 8 1" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${leaf}${crown}${ruler}${grid}${tri}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderDogSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#f59e0b', belly:'#fffbeb', ear:'#fcd34d', line:'#92400e', eye:'#2a1d3d', nose:'#1f2937',
                blush:'#fda4af', brush:'#78350f', tip:'#1f2937', paper:'#ffffff', ink:'#111827',
                book:'#2563eb', bookLine:'#1e3a8a', scarf:'#ef4444', crown:'#fbbf24', star:'#fde68a',
                egg:'#fef3c7', spot:'#f59e0b' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fcd34d', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M80 84 l4 -18 l12 12 z" fill="${c.fur}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M120 84 l-4 -18 l-12 12 z" fill="${c.fur}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>`);
  } else {
    // Lv2〜：くるんとした しっぽ と スカーフ
    const scarf = `<path d="M78 134 q22 10 44 0 l-2 6 q-20 8 -40 0 z" fill="${c.scarf}" stroke="${c.line}" stroke-width="1.4"/>`;
    // Lv3〜：ふで
    const brush = L >= 3 ? `<g transform="rotate(30 152 150)">
        <rect x="148" y="118" width="8" height="40" rx="3" fill="${c.brush}" stroke="${c.line}" stroke-width="1.6"/>
        <path d="M148 158 q4 16 4 16 q0 0 4 -16 z" fill="${c.tip}"/>
      </g>` : '';
    // Lv4〜：はんしに「志」
    const paper = L >= 4 ? `<g transform="rotate(-8 50 156)">
        <rect x="30" y="134" width="38" height="46" rx="2" fill="${c.paper}" stroke="${c.line}" stroke-width="1.6"/>
        <text x="49" y="167" font-size="24" font-weight="bold" fill="${c.ink}" text-anchor="middle">志</text>
      </g>` : '';
    // Lv5〜：こくごじてん
    const book = L >= 5 ? `<g>
        <rect x="132" y="166" width="40" height="14" rx="2" fill="${c.book}" stroke="${c.bookLine}" stroke-width="1.8"/>
        <path d="M136 170 h32" stroke="${c.paper}" stroke-width="1.4"/>
        <text x="152" y="179" font-size="7" font-weight="bold" fill="${c.paper}" text-anchor="middle">じてん</text>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 80 L88 64 L96 74 L100 60 L104 74 L112 64 L116 80 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <path d="M128 150 q22 -4 16 -22 q-6 -8 -12 0 q6 4 2 10 q-4 6 -10 4 z" fill="${c.fur}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M76 100 l2 -26 l18 14 z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M80 96 l1 -14 l9 8 z" fill="${c.ear}"/>
      <path d="M124 100 l-2 -26 l-18 14 z" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M120 96 l-1 -14 l-9 8 z" fill="${c.ear}"/>
      <ellipse cx="100" cy="146" rx="32" ry="30" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="154" rx="19" ry="18" fill="${c.belly}"/>
      <ellipse cx="86" cy="174" rx="10" ry="5" fill="${c.belly}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="114" cy="174" rx="10" ry="5" fill="${c.belly}" stroke="${c.line}" stroke-width="1.8"/>
      <circle cx="100" cy="112" r="27" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <path d="M78 118 q22 22 44 0 q-4 16 -22 18 q-18 -2 -22 -18 z" fill="${c.belly}"/>
      <ellipse cx="80" cy="121" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="120" cy="121" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 90, 110, 108, 4)}
      <ellipse cx="100" cy="119" rx="5" ry="3.4" fill="${c.nose}"/>
      <path d="M100 122 q-4 5 -8 1 M100 122 q4 5 8 1" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${scarf}${crown}${brush}${paper}${book}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderCheetahSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#fbbf24', belly:'#fffbeb', ear:'#fde68a', line:'#92400e', eye:'#2a1d3d', nose:'#7c2d12',
                dot:'#78350f', tear:'#451a03', blush:'#fda4af', watch:'#e5e7eb', watchLine:'#374151', hand:'#ef4444',
                card:'#dbeafe', cardLine:'#1d4ed8', shoe:'#22c55e', crown:'#fbbf24', star:'#fde68a',
                egg:'#fef9c3', spot:'#92400e' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fdba74', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <circle cx="84" cy="82" r="8" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="116" cy="82" r="8" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>`);
  } else {
    const dots = (pts) => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.dot}"/>`).join('');
    // Lv2〜：はしる くつ
    const shoes = `<g>
        <ellipse cx="84" cy="175" rx="11" ry="5.5" fill="${c.shoe}" stroke="${c.line}" stroke-width="1.8"/>
        <ellipse cx="116" cy="175" rx="11" ry="5.5" fill="${c.shoe}" stroke="${c.line}" stroke-width="1.8"/>
      </g>`;
    // Lv3〜：ストップウォッチ（はやさ）
    const watch = L >= 3 ? `<g>
        <rect x="45" y="128" width="8" height="6" rx="1" fill="${c.watchLine}"/>
        <circle cx="49" cy="150" r="16" fill="${c.watch}" stroke="${c.watchLine}" stroke-width="2.4"/>
        <path d="M49 150 v-10 M49 150 l7 4" stroke="${c.hand}" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="49" cy="150" r="2" fill="${c.watchLine}"/>
      </g>` : '';
    // Lv4〜：小数のカード
    const card = L >= 4 ? `<g transform="rotate(10 152 146)">
        <rect x="134" y="126" width="36" height="28" rx="4" fill="${c.card}" stroke="${c.cardLine}" stroke-width="2"/>
        <text x="152" y="145" font-size="13" font-weight="bold" fill="${c.cardLine}" text-anchor="middle">2.5</text>
      </g>` : '';
    // Lv5〜：分数のカード
    const frac = L >= 5 ? `<g transform="rotate(-6 150 172)">
        <rect x="136" y="158" width="28" height="26" rx="4" fill="#fff" stroke="${c.cardLine}" stroke-width="2"/>
        <text x="150" y="169" font-size="9" font-weight="bold" fill="${c.cardLine}" text-anchor="middle">5</text>
        <path d="M143 171 h14" stroke="${c.cardLine}" stroke-width="1.4"/>
        <text x="150" y="181" font-size="9" font-weight="bold" fill="${c.cardLine}" text-anchor="middle">6</text>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 82 L88 66 L96 76 L100 62 L104 76 L112 66 L116 82 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <path d="M130 156 q26 2 28 -22" fill="none" stroke="${c.line}" stroke-width="7" stroke-linecap="round"/>
      <path d="M130 156 q26 2 28 -22" fill="none" stroke="${c.fur}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="78" cy="92" r="10" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2"/>
      <circle cx="78" cy="92" r="5" fill="${c.ear}"/>
      <circle cx="122" cy="92" r="10" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2"/>
      <circle cx="122" cy="92" r="5" fill="${c.ear}"/>
      <ellipse cx="100" cy="146" rx="32" ry="30" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="154" rx="18" ry="17" fill="${c.belly}"/>
      ${dots([[76,140,3],[82,128,2.4],[124,138,3],[118,128,2.4],[126,156,2.6],[74,158,2.6]])}
      <circle cx="100" cy="112" r="27" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      ${dots([[90,94,2.2],[100,90,2.2],[110,94,2.2],[78,108,2],[122,108,2]])}
      <ellipse cx="100" cy="124" rx="13" ry="9" fill="${c.belly}"/>
      <path d="M88 114 q-2 8 -6 12 M112 114 q2 8 6 12" stroke="${c.tear}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      ${petEyes(c, sil, 90, 110, 108, 4)}
      <path d="M96 119 h8 l-4 4 z" fill="${c.nose}" stroke-linejoin="round"/>
      <path d="M100 123 q-4 5 -8 1 M100 123 q4 5 8 1" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${shoes}${crown}${watch}${card}${frac}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderLionSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#fcd34d', mane:'#ea580c', belly:'#fffbeb', ear:'#fde68a', line:'#7c2d12', eye:'#2a1d3d', nose:'#7c2d12',
                blush:'#fda4af', blockA:'#ef4444', blockB:'#3b82f6', blockC:'#22c55e', letter:'#ffffff',
                racket:'#8b5cf6', ball:'#d9f99d', ballLine:'#65a30d', globe:'#38bdf8', land:'#22c55e',
                crown:'#fbbf24', star:'#fde68a', egg:'#fff7ed', spot:'#fb923c' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fdba74', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <circle cx="84" cy="80" r="8" fill="${c.mane}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="116" cy="80" r="8" fill="${c.mane}" stroke="${c.line}" stroke-width="2"/>`);
  } else {
    // たてがみ：Lv が上がると ふさふさに
    const n = L >= 4 ? 14 : 10, R = L >= 4 ? 36 : 33;
    let mane = '';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      mane += `<circle cx="${(100 + Math.cos(a) * R * 0.86).toFixed(1)}" cy="${(112 + Math.sin(a) * R * 0.86).toFixed(1)}" r="${L >= 4 ? 11 : 10}" fill="${c.mane}" stroke="${c.line}" stroke-width="1.6"/>`;
    }
    const block = (x, y, col, t) => `<g>
        <rect x="${x}" y="${y}" width="20" height="20" rx="3" fill="${col}" stroke="${c.line}" stroke-width="1.6"/>
        <text x="${x + 10}" y="${y + 15}" font-size="13" font-weight="bold" fill="${c.letter}" text-anchor="middle">${t}</text>
      </g>`;
    // Lv3〜：ABC ブロック
    const blocks = L >= 3 ? `${block(28, 158, c.blockA, 'A')}${block(50, 158, c.blockB, 'B')}${block(39, 137, c.blockC, 'C')}` : '';
    // Lv4〜：テニスラケットと ボール（スポーツの えいたんご）
    const racket = L >= 4 ? `<g transform="rotate(25 152 150)">
        <ellipse cx="152" cy="132" rx="13" ry="16" fill="#fff" stroke="${c.racket}" stroke-width="3"/>
        <path d="M146 120 v24 M152 117 v30 M158 120 v24 M141 128 h22 M140 136 h24" stroke="${c.racket}" stroke-width="0.8"/>
        <rect x="149" y="147" width="6" height="22" rx="2" fill="${c.racket}"/>
      </g>
      <circle cx="172" cy="174" r="7" fill="${c.ball}" stroke="${c.ballLine}" stroke-width="1.6"/>
      <path d="M166 171 q6 4 12 0" stroke="${c.ballLine}" stroke-width="1.2" fill="none"/>` : '';
    // Lv5〜：ちきゅうぎ（Japan・China・Korea・India）
    const globe = L >= 5 ? `<g>
        <circle cx="52" cy="112" r="15" fill="${c.globe}" stroke="${c.line}" stroke-width="1.8"/>
        <path d="M44 104 q6 2 8 8 q-4 4 -10 2 z M54 114 q6 -2 8 4 q-2 6 -8 4 z" fill="${c.land}"/>
        <path d="M52 127 v8 M44 135 h16" stroke="${c.line}" stroke-width="2.2" stroke-linecap="round"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 74 L88 58 L96 68 L100 54 L104 68 L112 58 L116 74 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <path d="M130 158 q24 0 24 -18" fill="none" stroke="${c.line}" stroke-width="6" stroke-linecap="round"/>
      <path d="M130 158 q24 0 24 -18" fill="none" stroke="${c.fur}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="154" cy="137" r="6" fill="${c.mane}" stroke="${c.line}" stroke-width="1.4"/>
      <ellipse cx="100" cy="148" rx="32" ry="29" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="156" rx="18" ry="16" fill="${c.belly}"/>
      <ellipse cx="86" cy="175" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="114" cy="175" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      ${mane}
      <circle cx="80" cy="90" r="7" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <circle cx="120" cy="90" r="7" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <circle cx="100" cy="112" r="25" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="100" cy="124" rx="12" ry="8.5" fill="${c.belly}"/>
      <ellipse cx="81" cy="120" rx="5" ry="3.2" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="119" cy="120" rx="5" ry="3.2" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 90, 110, 108, 4)}
      <path d="M95 118 h10 l-5 5 z" fill="${c.nose}" stroke-linejoin="round"/>
      <path d="M100 123 q-4 5 -8 1 M100 123 q4 5 8 1" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${crown}${blocks}${racket}${globe}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderBeeSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#facc15', stripe:'#1f2937', wing:'#e0f2fe', wingLine:'#60a5fa', line:'#713f12', eye:'#2a1d3d',
                blush:'#fda4af', sprout:'#22c55e', sproutLine:'#166534', seed:'#a16207', soil:'#92400e',
                petal:'#a78bfa', petalLine:'#6d28d9', center:'#fef3c7', bottle:'#fef3c7', iodine:'#7c2d12',
                crown:'#fbbf24', star:'#fde68a', egg:'#fefce8', spot:'#facc15' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fde047', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M90 80 q-6 -12 -12 -14" stroke="${c.stripe}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M110 80 q6 -12 12 -14" stroke="${c.stripe}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="78" cy="66" r="4" fill="${c.stripe}"/><circle cx="122" cy="66" r="4" fill="${c.stripe}"/>`);
  } else {
    // Lv3〜：ふたばの はちうえ（はつが）
    const sprout = L >= 3 ? `<g>
        <path d="M30 162 h36 l-5 20 h-26 z" fill="${c.soil}" stroke="${c.line}" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M48 162 v-16" stroke="${c.sproutLine}" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse cx="40" cy="144" rx="9" ry="5" fill="${c.sprout}" stroke="${c.sproutLine}" stroke-width="1.5" transform="rotate(-20 40 144)"/>
        <ellipse cx="56" cy="144" rx="9" ry="5" fill="${c.sprout}" stroke="${c.sproutLine}" stroke-width="1.5" transform="rotate(20 56 144)"/>
      </g>` : '';
    // Lv4〜：アサガオの はな
    const flower = L >= 4 ? `<g>
        <path d="M152 162 v18" stroke="${c.sproutLine}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M134 130 q18 -10 36 0 l-12 30 h-12 z" fill="${c.petal}" stroke="${c.petalLine}" stroke-width="2" stroke-linejoin="round"/>
        <ellipse cx="152" cy="131" rx="18" ry="6" fill="${c.petal}" stroke="${c.petalLine}" stroke-width="2"/>
        <ellipse cx="152" cy="131" rx="6" ry="2.4" fill="${c.center}"/>
      </g>` : '';
    // Lv5〜：ヨウ素液の びん
    const bottle = L >= 5 ? `<g>
        <rect x="160" y="164" width="18" height="18" rx="3" fill="${c.bottle}" stroke="${c.line}" stroke-width="1.6"/>
        <rect x="160" y="172" width="18" height="10" rx="2" fill="${c.iodine}" opacity="0.8"/>
        <rect x="164" y="156" width="10" height="9" rx="2" fill="${c.stripe}"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 78 L88 62 L96 72 L100 58 L104 72 L112 62 L116 78 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <ellipse cx="70" cy="128" rx="22" ry="14" fill="${c.wing}" stroke="${c.wingLine}" stroke-width="2" opacity="0.9" transform="rotate(-30 70 128)"/>
      <ellipse cx="130" cy="128" rx="22" ry="14" fill="${c.wing}" stroke="${c.wingLine}" stroke-width="2" opacity="0.9" transform="rotate(30 130 128)"/>
      <path d="M100 178 l-5 8 h10 z" fill="${c.stripe}"/>
      <ellipse cx="100" cy="150" rx="30" ry="28" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <path d="M72 144 q28 8 56 0 v8 q-28 8 -56 0 z M74 162 q26 8 52 0 v6 q-26 8 -52 0 z" fill="${c.stripe}"/>
      <path d="M90 90 q-6 -14 -14 -16" stroke="${c.stripe}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M110 90 q6 -14 14 -16" stroke="${c.stripe}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="76" cy="74" r="4.5" fill="${c.stripe}"/><circle cx="124" cy="74" r="4.5" fill="${c.stripe}"/>
      <circle cx="100" cy="112" r="26" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="80" cy="120" rx="6" ry="4" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="120" cy="120" rx="6" ry="4" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 90, 110, 109, 4.2)}
      <path d="M100 120 q-5 6 -10 1 M100 120 q5 6 10 1" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${crown}${sprout}${flower}${bottle}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderPigSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#fbcfe8', belly:'#fdf2f8', ear:'#f9a8d4', snout:'#f9a8d4', nostril:'#be185d', line:'#9d174d', eye:'#2a1d3d',
                blush:'#f472b6', imo:'#a21caf', imoIn:'#fde68a', mikan:'#fb923c', leaf:'#22c55e', leafLine:'#166534',
                cup:'#ffffff', tea:'#65a30d', map:'#dcfce7', mapLine:'#15803d', pin:'#ef4444',
                crown:'#fbbf24', star:'#fde68a', egg:'#fdf2f8', spot:'#f9a8d4' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#86efac', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M80 84 l2 -14 l12 8 z" fill="${c.ear}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M120 84 l-2 -14 l-12 8 z" fill="${c.ear}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>`);
  } else {
    // Lv3〜：さつまいも（鹿児島）
    const imo = L >= 3 ? `<g transform="rotate(-20 48 166)">
        <ellipse cx="48" cy="166" rx="20" ry="9" fill="${c.imo}" stroke="${c.line}" stroke-width="1.6"/>
        <path d="M30 166 q-6 0 -8 -4 M66 166 q6 0 8 4" stroke="${c.imo}" stroke-width="2" fill="none"/>
      </g>` : '';
    // Lv4〜：みかん（和歌山）
    const mikan = L >= 4 ? `<g>
        <circle cx="156" cy="168" r="11" fill="${c.mikan}" stroke="${c.line}" stroke-width="1.6"/>
        <ellipse cx="160" cy="156" rx="5" ry="2.6" fill="${c.leaf}" stroke="${c.leafLine}" stroke-width="1" transform="rotate(-25 160 156)"/>
      </g>` : '';
    // Lv5〜：日本地図に ピン
    const map = L >= 5 ? `<g transform="rotate(8 150 132)">
        <rect x="132" y="116" width="38" height="32" rx="3" fill="${c.map}" stroke="${c.mapLine}" stroke-width="1.8"/>
        <path d="M160 120 q4 4 0 8 q-6 4 -8 10 q-6 4 -12 2 q4 -4 8 -6 q6 -6 12 -14 z" fill="${c.mapLine}" opacity="0.7"/>
        <circle cx="142" cy="140" r="3" fill="${c.pin}"/><circle cx="160" cy="124" r="3" fill="${c.pin}"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 82 L88 66 L96 76 L100 62 L104 76 L112 66 L116 82 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <path d="M132 150 q10 -2 8 -8 q-4 -4 -6 2 q-2 6 6 4" fill="none" stroke="${c.line}" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="100" cy="148" rx="34" ry="29" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="155" rx="20" ry="17" fill="${c.belly}"/>
      <ellipse cx="84" cy="175" rx="9" ry="5" fill="${c.ear}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="116" cy="175" rx="9" ry="5" fill="${c.ear}" stroke="${c.line}" stroke-width="1.8"/>
      <circle cx="100" cy="113" r="27" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <path d="M76 98 l-2 -18 l18 8 z" fill="${c.ear}" stroke="${c.line}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M124 98 l2 -18 l-18 8 z" fill="${c.ear}" stroke="${c.line}" stroke-width="2.2" stroke-linejoin="round"/>
      <ellipse cx="100" cy="122" rx="12" ry="8.5" fill="${c.snout}" stroke="${c.line}" stroke-width="2"/>
      <ellipse cx="95.5" cy="122" rx="2.2" ry="3.2" fill="${c.nostril}"/>
      <ellipse cx="104.5" cy="122" rx="2.2" ry="3.2" fill="${c.nostril}"/>
      <ellipse cx="79" cy="120" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.6"/>
      <ellipse cx="121" cy="120" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.6"/>
      ${petEyes(c, sil, 89, 111, 106, 4)}
      <path d="M94 133 q6 4 12 0" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${crown}${imo}${mikan}${map}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderGiraffeSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#fcd34d', belly:'#fef3c7', spot:'#b45309', horn:'#92400e', line:'#78350f', eye:'#2a1d3d',
                blush:'#fda4af', scarf:'#ef4444', scarfLine:'#991b1b', book:'#3b82f6', bookLine:'#1e3a8a', page:'#ffffff',
                brush:'#a16207', ink:'#1f2937', glass:'#1e3a8a', bub:'#ffffff', bubLine:'#6366f1', bubText:'#4338ca',
                crown:'#fbbf24', star:'#fde68a', egg:'#fef9c3' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fbbf24', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <rect x="95" y="68" width="4" height="12" rx="2" fill="${c.horn}"/><circle cx="97" cy="67" r="4" fill="${c.horn}"/>
      <rect x="105" y="68" width="4" height="12" rx="2" fill="${c.horn}"/><circle cx="107" cy="67" r="4" fill="${c.horn}"/>`);
  } else {
    // Lv2〜：ことばの スカーフ
    const scarf = L >= 2 ? `<g>
        <path d="M86 132 q14 8 28 0 l0 9 q-14 8 -28 0 z" fill="${c.scarf}" stroke="${c.scarfLine}" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M108 140 l6 16 l-9 -3 z" fill="${c.scarf}" stroke="${c.scarfLine}" stroke-width="1.6" stroke-linejoin="round"/>
      </g>` : '';
    // Lv3〜：ほん
    const book = L >= 3 ? `<g transform="rotate(-12 54 168)">
        <rect x="36" y="154" width="36" height="26" rx="3" fill="${c.book}" stroke="${c.bookLine}" stroke-width="2"/>
        <rect x="40" y="158" width="28" height="18" rx="2" fill="${c.page}"/>
        <path d="M54 158 v18 M44 164 h7 M44 169 h7 M57 164 h7 M57 169 h7" stroke="${c.bookLine}" stroke-width="1.2" fill="none"/>
      </g>` : '';
    // Lv4〜：ふで
    const brush = L >= 4 ? `<g transform="rotate(30 150 160)">
        <rect x="146" y="136" width="7" height="34" rx="3" fill="${c.brush}" stroke="${c.line}" stroke-width="1.6"/>
        <path d="M146 170 l3.5 12 l3.5 -12 z" fill="${c.ink}"/>
      </g>` : '';
    // Lv5〜：めがね ＋ ふきだし「あ」
    const glasses = L >= 5 ? `<g fill="none" stroke="${c.glass}" stroke-width="2">
        <circle cx="90" cy="98" r="8"/><circle cx="110" cy="98" r="8"/><path d="M98 98 h4"/>
      </g>
      <g>
        <path d="M128 70 h28 a6 6 0 0 1 6 6 v14 a6 6 0 0 1 -6 6 h-18 l-8 8 l1 -8 a6 6 0 0 1 -3 -6 v-14 a6 6 0 0 1 0 0 z" fill="${c.bub}" stroke="${c.bubLine}" stroke-width="1.8" stroke-linejoin="round"/>
        <text x="145" y="92" text-anchor="middle" font-size="16" font-weight="700" fill="${c.bubText}" font-family="sans-serif">あ</text>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M88 74 L91 60 L97 68 L100 56 L103 68 L109 60 L112 74 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <path d="M130 156 q12 -4 10 -12 q-6 -2 -8 6" fill="none" stroke="${c.line}" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="100" cy="158" rx="33" ry="24" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="164" rx="19" ry="14" fill="${c.belly}"/>
      <circle cx="82" cy="150" r="5" fill="${c.spot}" opacity="0.8"/><circle cx="118" cy="152" r="6" fill="${c.spot}" opacity="0.8"/>
      <rect x="85" y="176" width="9" height="12" rx="3" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <rect x="106" y="176" width="9" height="12" rx="3" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <rect x="90" y="112" width="20" height="40" rx="9" fill="${c.fur}" stroke="${c.line}" stroke-width="2.6"/>
      <circle cx="98" cy="128" r="4" fill="${c.spot}" opacity="0.8"/><circle cx="104" cy="142" r="3.6" fill="${c.spot}" opacity="0.8"/>
      <rect x="86.5" y="62" width="4" height="14" rx="2" fill="${c.horn}"/><circle cx="88.5" cy="61" r="4.2" fill="${c.horn}"/>
      <rect x="109.5" y="62" width="4" height="14" rx="2" fill="${c.horn}"/><circle cx="111.5" cy="61" r="4.2" fill="${c.horn}"/>
      <ellipse cx="76" cy="86" rx="7" ry="4.5" fill="${c.fur}" stroke="${c.line}" stroke-width="2" transform="rotate(-25 76 86)"/>
      <ellipse cx="124" cy="86" rx="7" ry="4.5" fill="${c.fur}" stroke="${c.line}" stroke-width="2" transform="rotate(25 124 86)"/>
      <ellipse cx="100" cy="97" rx="25" ry="23" fill="${c.fur}" stroke="${c.line}" stroke-width="2.6"/>
      <circle cx="82" cy="84" r="4" fill="${c.spot}" opacity="0.8"/><circle cx="119" cy="83" r="3.4" fill="${c.spot}" opacity="0.8"/>
      <ellipse cx="100" cy="108" rx="13" ry="9" fill="${c.belly}"/>
      <ellipse cx="80" cy="106" rx="5" ry="3.2" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="120" cy="106" rx="5" ry="3.2" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 90, 110, 98, 4)}
      <circle cx="95.5" cy="107" r="1.7" fill="${c.eye}"/><circle cx="104.5" cy="107" r="1.7" fill="${c.eye}"/>
      <path d="M95 112 q5 4 10 0" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${scarf}${glasses}${crown}${book}${brush}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderChickSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#fde047', belly:'#fef9c3', beak:'#fb923c', foot:'#fb923c', line:'#a16207', eye:'#2a1d3d',
                blush:'#fda4af', shell:'#fffbeb', card:'#ffffff', cardLine:'#16a34a', num:'#15803d', dot:'#f97316',
                medal:'#fbbf24', ribbon:'#ef4444', crown:'#fbbf24', star:'#fde68a', egg:'#fef9c3', spot:'#fcd34d' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#facc15', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M96 70 q-4 -10 -10 -8 M100 70 q0 -12 0 -14 M104 70 q4 -10 10 -8" stroke="${c.line}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);
  } else {
    // Lv2〜：たまごのから ぼうし
    const shell = L >= 2 ? `<path d="M80 92 l6 -8 l5 7 l5 -9 l4 9 l5 -7 l6 8 l5 -6 l0 8 z" fill="${c.shell}" stroke="${c.line}" stroke-width="1.8" stroke-linejoin="round" transform="translate(-0 -4)"/>` : '';
    // Lv3〜：かけ算カード
    const card = L >= 3 ? `<g transform="rotate(-10 52 164)">
        <rect x="32" y="148" width="40" height="30" rx="4" fill="${c.card}" stroke="${c.cardLine}" stroke-width="2"/>
        <text x="52" y="170" text-anchor="middle" font-size="16" font-weight="700" fill="${c.num}" font-family="sans-serif">3×3</text>
      </g>` : '';
    // Lv4〜：●の ならび（3×3）
    const dots = L >= 4 ? `<g transform="translate(138 138)">
        <rect x="-4" y="-4" width="40" height="40" rx="5" fill="#fff7ed" stroke="${c.line}" stroke-width="1.6"/>
        ${[0,1,2].map(i=>[0,1,2].map(j=>`<circle cx="${6+j*12}" cy="${6+i*12}" r="4" fill="${c.dot}"/>`).join('')).join('')}
      </g>` : '';
    // Lv5〜：81のメダル
    const medal = L >= 5 ? `<g>
        <path d="M92 138 l-5 14 M108 138 l5 14" stroke="${c.ribbon}" stroke-width="5"/>
        <circle cx="100" cy="158" r="12" fill="${c.medal}" stroke="${c.line}" stroke-width="1.8"/>
        <text x="100" y="163" text-anchor="middle" font-size="13" font-weight="700" fill="${c.line}" font-family="sans-serif">81</text>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M85 84 L89 68 L96 78 L100 64 L104 78 L111 68 L115 84 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <ellipse cx="68" cy="140" rx="10" ry="16" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2" transform="rotate(25 68 140)"/>
      <ellipse cx="132" cy="140" rx="10" ry="16" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2" transform="rotate(-25 132 140)"/>
      <ellipse cx="100" cy="142" rx="34" ry="32" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="152" rx="21" ry="20" fill="${c.belly}"/>
      <path d="M88 174 v8 M80 182 h16 M112 174 v8 M104 182 h16" stroke="${c.foot}" stroke-width="3" stroke-linecap="round"/>
      <path d="M96 86 q-4 -12 -10 -10 M100 86 q0 -14 0 -16 M104 86 q4 -12 10 -10" stroke="${c.line}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="100" cy="112" r="27" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="78" cy="120" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="122" cy="120" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 89, 111, 108, 4)}
      <path d="M93 117 l7 9 l7 -9 q-7 -4 -14 0 z" fill="${c.beak}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>
      ${shell}${crown}${card}${dots}${medal}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderMouseSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#d6d3d1', belly:'#fafaf9', ear:'#fda4af', line:'#57534e', eye:'#2a1d3d', nose:'#f472b6',
                blush:'#fda4af', pencil:'#facc15', pencilTip:'#78350f', lead:'#374151', note:'#fff7ed', noteLine:'#ea580c',
                card:'#ffffff', cardLine:'#7c3aed', kan:'#6d28d9', hana:'#ef4444', hanaIn:'#fde047',
                crown:'#fbbf24', star:'#fde68a', egg:'#f5f5f4', spot:'#e7e5e4' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#a78bfa', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <circle cx="82" cy="80" r="11" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/><circle cx="82" cy="80" r="6" fill="${c.ear}"/>
      <circle cx="118" cy="80" r="11" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/><circle cx="118" cy="80" r="6" fill="${c.ear}"/>`);
  } else {
    // Lv2〜：えんぴつ（みみに かけて）
    const pencil = L >= 2 ? `<g transform="rotate(-20 126 86)">
        <rect x="118" y="66" width="7" height="30" rx="2" fill="${c.pencil}" stroke="${c.line}" stroke-width="1.4"/>
        <path d="M118 96 l3.5 8 l3.5 -8 z" fill="${c.pencilTip}"/>
      </g>` : '';
    // Lv3〜：ノート「字」
    const note = L >= 3 ? `<g transform="rotate(-10 52 166)">
        <rect x="32" y="148" width="40" height="32" rx="3" fill="${c.note}" stroke="${c.noteLine}" stroke-width="2"/>
        <text x="52" y="172" text-anchor="middle" font-size="20" font-weight="700" fill="${c.noteLine}" font-family="sans-serif">字</text>
      </g>` : '';
    // Lv4〜：かん字カード「山」
    const kan = L >= 4 ? `<g transform="rotate(8 152 160)">
        <rect x="134" y="142" width="36" height="36" rx="4" fill="${c.card}" stroke="${c.cardLine}" stroke-width="2"/>
        <text x="152" y="170" text-anchor="middle" font-size="22" font-weight="700" fill="${c.kan}" font-family="sans-serif">山</text>
      </g>` : '';
    // Lv5〜：はなまる
    const hana = L >= 5 ? `<g transform="translate(150 96)">
        ${[0,1,2,3,4,5,6,7].map(i=>`<circle cx="${(Math.cos(i*Math.PI/4)*9).toFixed(1)}" cy="${(Math.sin(i*Math.PI/4)*9).toFixed(1)}" r="4.2" fill="none" stroke="${c.hana}" stroke-width="1.8"/>`).join('')}
        <circle r="5" fill="${c.hanaIn}" stroke="${c.hana}" stroke-width="1.6"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M86 78 L90 62 L97 72 L100 58 L103 72 L110 62 L114 78 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <path d="M130 156 q16 0 18 -14 q0 -8 -8 -6" fill="none" stroke="${c.ear}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="78" cy="90" r="13" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2"/><circle cx="78" cy="90" r="7" fill="${c.ear}"/>
      <circle cx="122" cy="90" r="13" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2"/><circle cx="122" cy="90" r="7" fill="${c.ear}"/>
      <ellipse cx="100" cy="146" rx="32" ry="30" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="154" rx="19" ry="18" fill="${c.belly}"/>
      <ellipse cx="84" cy="175" rx="9" ry="5" fill="${c.ear}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="116" cy="175" rx="9" ry="5" fill="${c.ear}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="100" cy="114" rx="27" ry="25" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="80" cy="122" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="120" cy="122" rx="5.5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 90, 110, 110, 4)}
      <ellipse cx="100" cy="121" rx="3.6" ry="2.8" fill="${c.nose}"/>
      <path d="M100 124 q-4 5 -8 1 M100 124 q4 5 8 1" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M86 124 l-12 -2 M86 127 l-12 3 M114 124 l12 -2 M114 127 l12 3" stroke="${c.line}" stroke-width="1.2" stroke-linecap="round"/>
      ${pencil}${crown}${note}${kan}${hana}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// ============================================================
// ラッコのラッキー（英語 小学校の英単語 3・4年）：ABCブロック → えほん → ヘッドホン
function renderOtterSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#a16207', face:'#fef3c7', belly:'#d6b48a', line:'#78350f', eye:'#2a1d3d',
                nose:'#3f2a1d', blush:'#fda4af', blockA:'#ef4444', blockB:'#3b82f6', blockC:'#22c55e',
                book:'#fde68a', bookLine:'#b45309', phone:'#7c3aed', crown:'#fbbf24', star:'#fde68a',
                egg:'#fef9c3', spot:'#d6b48a' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fbbf24', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <circle cx="84" cy="78" r="7" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="116" cy="78" r="7" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>`);
  } else {
    const blk = (x, y, col, ch) => `<rect x="${x}" y="${y}" width="20" height="20" rx="3" fill="${col}" stroke="${c.line}" stroke-width="1.6"/>
        <text x="${x + 10}" y="${y + 15}" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">${ch}</text>`;
    const blocks = L >= 3 ? `<g>${blk(26, 150, c.blockA, 'A')}${blk(48, 150, c.blockB, 'B')}${blk(37, 128, c.blockC, 'C')}</g>` : '';
    const book = L >= 4 ? `<g transform="rotate(10 152 146)">
        <rect x="132" y="128" width="40" height="32" rx="3" fill="${c.book}" stroke="${c.bookLine}" stroke-width="2"/>
        <path d="M152 128 v32" stroke="${c.bookLine}" stroke-width="1.6"/>
        <circle cx="142" cy="141" r="5" fill="${c.blockA}"/><path d="M142 136 l2 -3" stroke="${c.blockC}" stroke-width="1.6"/>
        <text x="162" y="146" font-size="9" font-weight="bold" fill="${c.bookLine}" text-anchor="middle">A</text>
      </g>` : '';
    const phones = L >= 5 ? `<g>
        <path d="M76 108 q24 -34 48 0" fill="none" stroke="${c.phone}" stroke-width="4" stroke-linecap="round"/>
        <rect x="70" y="104" width="10" height="16" rx="4" fill="${c.phone}" stroke="${c.line}" stroke-width="1.4"/>
        <rect x="120" y="104" width="10" height="16" rx="4" fill="${c.phone}" stroke="${c.line}" stroke-width="1.4"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 86 L88 70 L96 80 L100 66 L104 80 L112 70 L116 86 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <ellipse cx="100" cy="148" rx="33" ry="30" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="154" rx="20" ry="19" fill="${c.belly}"/>
      <path d="M128 164 q22 8 18 -10" fill="none" stroke="${c.line}" stroke-width="9" stroke-linecap="round"/>
      <path d="M128 164 q22 8 18 -10" fill="none" stroke="${c.fur}" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="86" cy="175" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="114" cy="175" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <circle cx="78" cy="92" r="7" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="122" cy="92" r="7" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="100" cy="112" r="27" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="100" cy="118" rx="20" ry="16" fill="${c.face}"/>
      <ellipse cx="80" cy="122" rx="5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="120" cy="122" rx="5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 90, 110, 108, 4)}
      <ellipse cx="100" cy="117" rx="4.5" ry="3" fill="${c.nose}"/>
      <path d="M100 120 q-4 5 -8 1 M100 120 q4 5 8 1" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M84 118 h-10 M84 122 h-9 M116 118 h10 M116 122 h9" stroke="${c.line}" stroke-width="1.2" stroke-linecap="round"/>
      <ellipse cx="88" cy="140" rx="7" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.6"/>
      <ellipse cx="112" cy="140" rx="7" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.6"/>
      ${phones}${crown}${blocks}${book}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

// トラのタイガ（英語 小学校の英単語 5・6年）：じしょ → Hello! のふきだし → マイク
function renderTigerSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#fb923c', belly:'#fff7ed', stripe:'#431407', line:'#7c2d12', eye:'#2a1d3d',
                nose:'#be185d', blush:'#fda4af', dict:'#2563eb', dictPage:'#ffffff', bubble:'#ffffff',
                bubbleLine:'#0369a1', mic:'#475569', crown:'#fbbf24', star:'#fde68a',
                egg:'#ffedd5', spot:'#fb923c' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#fb923c', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M88 70 l-6 -12 l12 6 z" fill="${c.fur}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M112 70 l6 -12 l-12 6 z" fill="${c.fur}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M92 100 h16 M90 112 h20" stroke="${c.stripe}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>`);
  } else {
    const dict = L >= 3 ? `<g transform="rotate(-8 44 150)">
        <rect x="24" y="132" width="38" height="36" rx="3" fill="${c.dict}" stroke="${c.line}" stroke-width="1.8"/>
        <rect x="58" y="134" width="5" height="32" fill="${c.dictPage}" stroke="${c.line}" stroke-width="1"/>
        <text x="41" y="148" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">ABC</text>
        <text x="41" y="160" font-size="6" fill="#fff" text-anchor="middle">じしょ</text>
      </g>` : '';
    const bubble = L >= 4 ? `<g>
        <rect x="128" y="64" width="54" height="26" rx="10" fill="${c.bubble}" stroke="${c.bubbleLine}" stroke-width="2"/>
        <path d="M136 90 l-6 10 l14 -10" fill="${c.bubble}" stroke="${c.bubbleLine}" stroke-width="2" stroke-linejoin="round"/>
        <text x="155" y="82" font-size="11" font-weight="bold" fill="${c.bubbleLine}" text-anchor="middle">Hello!</text>
      </g>` : '';
    const mic = L >= 5 ? `<g>
        <path d="M140 170 l12 -24" stroke="${c.mic}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="154" cy="142" r="8" fill="${c.mic}" stroke="${c.line}" stroke-width="1.6"/>
        <path d="M150 139 h8 M150 143 h8" stroke="#cbd5e1" stroke-width="1.2"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 88 L88 72 L96 82 L100 68 L104 82 L112 72 L116 88 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <path d="M128 166 q26 4 22 -22" fill="none" stroke="${c.line}" stroke-width="9" stroke-linecap="round"/>
      <path d="M128 166 q26 4 22 -22" fill="none" stroke="${c.fur}" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="100" cy="148" rx="32" ry="29" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="154" rx="19" ry="18" fill="${c.belly}"/>
      <path d="M70 140 h9 M70 152 h8 M130 140 h-9 M130 152 h-8" stroke="${c.stripe}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="86" cy="175" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="114" cy="175" rx="10" ry="5" fill="${c.fur}" stroke="${c.line}" stroke-width="1.8"/>
      <path d="M78 96 l-4 -16 l16 8 z" fill="${c.fur}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M122 96 l4 -16 l-16 8 z" fill="${c.fur}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="100" cy="112" r="27" fill="${c.fur}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="100" cy="122" rx="15" ry="11" fill="${c.belly}"/>
      <path d="M100 86 v8 M93 88 l2 6 M107 88 l-2 6 M74 108 h7 M75 116 h6 M126 108 h-7 M125 116 h-6" stroke="${c.stripe}" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="80" cy="122" rx="5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="120" cy="122" rx="5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 90, 110, 108, 4)}
      <path d="M96 117 h8 l-4 4 z" fill="${c.nose}" stroke="${c.line}" stroke-width="1" stroke-linejoin="round"/>
      <path d="M100 121 q-4 5 -8 1 M100 121 q4 5 8 1" stroke="${c.eye}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${crown}${dict}${bubble}${mic}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderPeacockSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { body:'#0891b2', belly:'#a5f3fc', head:'#06b6d4', line:'#164e63', eye:'#2a1d3d',
                blush:'#fda4af', beak:'#f59e0b', feather:'#10b981', fLine:'#047857', eyeBlue:'#2563eb', eyeGold:'#fbbf24',
                comp:'#64748b', proPlate:'#e0f2fe', crown:'#fbbf24', star:'#fde68a',
                egg:'#ecfeff', spot:'#67e8f9' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#22d3ee', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <path d="M92 76 q-3 -10 -8 -12 M100 74 q0 -12 0 -15 M108 76 q3 -10 8 -12" stroke="${c.line}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="84" cy="63" r="2.6" fill="${c.eyeBlue}"/><circle cx="100" cy="58" r="2.6" fill="${c.eyeBlue}"/><circle cx="116" cy="63" r="2.6" fill="${c.eyeBlue}"/>`);
  } else {
    const angs = L >= 5 ? [-75,-50,-25,0,25,50,75] : L >= 3 ? [-60,-30,0,30,60] : [-30,0,30];
    const ry = L >= 5 ? 30 : L >= 3 ? 24 : 18;
    const tail = angs.map(a => `<g transform="rotate(${a} 100 146)">
        <ellipse cx="100" cy="${100 - ry / 2}" rx="9" ry="${ry}" fill="${c.feather}" stroke="${c.fLine}" stroke-width="1.6"/>
        <circle cx="100" cy="${100 - ry / 2 - ry + 8}" r="5" fill="${c.eyeBlue}" stroke="${c.fLine}" stroke-width="1"/>
        <circle cx="100" cy="${100 - ry / 2 - ry + 8}" r="2.2" fill="${c.eyeGold}"/></g>`).join('');
    const compass = L >= 3 ? `<g>
        <path d="M152 138 L143 174 M152 138 L161 174" stroke="${c.comp}" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <circle cx="152" cy="137" r="4" fill="${c.comp}" stroke="${c.line}" stroke-width="1.4"/>
        <path d="M143 174 l-1 5" stroke="${c.line}" stroke-width="1.6" stroke-linecap="round"/>
      </g>` : '';
    const protractor = L >= 4 ? `<g>
        <path d="M30 178 a22 22 0 0 1 44 0 z" fill="${c.proPlate}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M52 178 l0 -6 M38 174 l4 -4 M66 174 l-4 -4 M33 168 l5 -2 M71 168 l-5 -2" stroke="${c.line}" stroke-width="1.2" stroke-linecap="round"/>
      </g>` : '';
    const fanDeco = L >= 5 ? `<path d="M50 150 a54 54 0 0 1 100 0" fill="none" stroke="${c.eyeGold}" stroke-width="2" stroke-dasharray="3 4" opacity="0.8"/>` : '';
    const crown = L >= 6 ? `<path d="M88 94 L91 80 L97 88 L100 76 L103 88 L109 80 L112 94 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      ${fanDeco}${tail}
      <ellipse cx="100" cy="148" rx="27" ry="30" fill="${c.body}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="155" rx="16" ry="19" fill="${c.belly}"/>
      <path d="M92 130 q8 6 16 0" fill="none" stroke="${c.belly}" stroke-width="3" stroke-linecap="round"/>
      <path d="M88 176 l-3 6 M95 177 l-1 6 M105 177 l1 6 M112 176 l3 6" stroke="${c.beak}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M96 100 q-3 -10 -8 -11 M100 99 q0 -11 0 -13 M104 100 q3 -10 8 -11" stroke="${c.line}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="88" cy="89" r="2.6" fill="${c.eyeBlue}"/><circle cx="100" cy="85" r="2.6" fill="${c.eyeBlue}"/><circle cx="112" cy="89" r="2.6" fill="${c.eyeBlue}"/>
      <circle cx="100" cy="114" r="23" fill="${c.head}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="80" cy="121" rx="5" ry="3.2" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="120" cy="121" rx="5" ry="3.2" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 91, 109, 111, 3.6)}
      <path d="M95 120 L105 120 L100 129 Z" fill="${c.beak}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>
      ${crown}${compass}${protractor}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

function renderBeaverSVG(level, fillPct, size, opts) {
  opts = opts || {};
  const sil = !!opts.silhouette, L = Math.max(1, level | 0);
  const pal = { fur:'#a16207', furDark:'#78350f', belly:'#fde68a', head:'#b45309', line:'#451a03', eye:'#2a1d3d',
                nose:'#292524', blush:'#fda4af', tooth:'#ffffff', tail:'#92400e', log:'#c08457', logRing:'#78350f',
                fish:'#38bdf8', fishLine:'#0369a1', leaf:'#22c55e', leafLine:'#15803d', pot:'#ea580c',
                crown:'#fbbf24', star:'#fde68a', egg:'#fef3c7', spot:'#d97706' };
  const c = sil ? petSilPalette(pal) : pal;
  const bg = petRingBG(fillPct, '#d97706', sil);
  const deco = petCommonDeco(L, opts.stars, c.star, sil);
  let body;
  if (L === 1) {
    body = petEggBody(c, `
      <circle cx="82" cy="76" r="7" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      <circle cx="118" cy="76" r="7" fill="${c.fur}" stroke="${c.line}" stroke-width="2"/>
      <path d="M100 76 q-1 -9 -8 -12 M100 76 q1 -9 8 -12" stroke="${c.leafLine}" stroke-width="2.2" fill="${c.leaf}" stroke-linecap="round"/>`);
  } else {
    const log = L >= 3 ? `<g>
        <rect x="18" y="160" width="58" height="20" rx="4" fill="${c.log}" stroke="${c.line}" stroke-width="2"/>
        <ellipse cx="72" cy="170" rx="5" ry="10" fill="${c.log}" stroke="${c.line}" stroke-width="2"/>
        <ellipse cx="72" cy="170" rx="2" ry="5" fill="none" stroke="${c.logRing}" stroke-width="1.4"/>
        <path d="M26 166 h30 M30 174 h24" stroke="${c.logRing}" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
      </g>` : '';
    const fish = L >= 4 ? `<g transform="rotate(-20 156 136)">
        <ellipse cx="154" cy="136" rx="16" ry="8" fill="${c.fish}" stroke="${c.fishLine}" stroke-width="1.8"/>
        <path d="M168 136 l12 -8 v16 z" fill="${c.fish}" stroke="${c.fishLine}" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="146" cy="134" r="2" fill="${c.eye}"/>
        <path d="M152 129 q4 3 0 14" fill="none" stroke="${c.fishLine}" stroke-width="1.2"/>
      </g>` : '';
    const pot = L >= 5 ? `<g>
        <path d="M148 176 h24 l-3 14 h-18 z" fill="${c.pot}" stroke="${c.line}" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M160 176 v-14 M160 168 q-10 -2 -10 -10 q10 0 10 10 M160 164 q10 -2 10 -10 q-10 0 -10 10" fill="${c.leaf}" stroke="${c.leafLine}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </g>` : '';
    const crown = L >= 6 ? `<path d="M84 90 L88 74 L96 84 L100 70 L104 84 L112 74 L116 90 Z" fill="${c.crown}" stroke="${c.line}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
    body = `
      <ellipse cx="136" cy="168" rx="22" ry="11" transform="rotate(-18 136 168)" fill="${c.tail}" stroke="${c.line}" stroke-width="2.4"/>
      <path d="M122 168 l8 -8 M130 172 l10 -10 M140 174 l8 -8" stroke="${c.furDark}" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>
      <ellipse cx="100" cy="148" rx="31" ry="29" fill="${c.fur}" stroke="${c.line}" stroke-width="3"/>
      <ellipse cx="100" cy="154" rx="19" ry="18" fill="${c.belly}"/>
      <ellipse cx="85" cy="176" rx="11" ry="5" fill="${c.furDark}" stroke="${c.line}" stroke-width="1.8"/>
      <ellipse cx="115" cy="176" rx="11" ry="5" fill="${c.furDark}" stroke="${c.line}" stroke-width="1.8"/>
      <circle cx="78" cy="94" r="9" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2"/>
      <circle cx="122" cy="94" r="9" fill="${c.fur}" stroke="${c.line}" stroke-width="2.2"/>
      <circle cx="78" cy="94" r="4" fill="${c.blush}" opacity="0.7"/>
      <circle cx="122" cy="94" r="4" fill="${c.blush}" opacity="0.7"/>
      <circle cx="100" cy="112" r="27" fill="${c.head}" stroke="${c.line}" stroke-width="2.5"/>
      <ellipse cx="100" cy="123" rx="15" ry="11" fill="${c.belly}"/>
      <ellipse cx="79" cy="121" rx="5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      <ellipse cx="121" cy="121" rx="5" ry="3.5" fill="${c.blush}" opacity="0.75"/>
      ${petEyes(c, sil, 90, 110, 107, 4)}
      <ellipse cx="100" cy="116" rx="5" ry="3.4" fill="${c.nose}"/>
      <path d="M97 121 h6 v8 h-6 z" fill="${c.tooth}" stroke="${c.line}" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M100 121 v8" stroke="${c.line}" stroke-width="1"/>
      ${crown}${log}${fish}${pot}`;
  }
  return petWrapSVG(L, size, bg, deco, body);
}

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
  cow: renderCowSVG,
  koala: renderKoalaSVG,
  dog: renderDogSVG,
  cheetah: renderCheetahSVG,
  lion: renderLionSVG,
  bee: renderBeeSVG,
  pig: renderPigSVG,
  giraffe: renderGiraffeSVG,
  chick: renderChickSVG,
  mouse: renderMouseSVG,
  otter: renderOtterSVG,
  tiger: renderTigerSVG,
  peacock: renderPeacockSVG,
  beaver: renderBeaverSVG,
};
