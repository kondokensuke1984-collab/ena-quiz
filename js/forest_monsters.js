// ============================================================
// 👾 まよいの森の モンスター（ドラクエ「ふう」の オリジナル。本物の モンスターは つかわない）
//   ・CHARS['fm_…'] に とうろくするので、rpg.html の たたかい・けっか画面が そのまま つかえる
//     （よびかた：CHARS[key](lv, fill, size, { silhouette })）
//   ・ドラクエの ように「色ちがいで つよい なかま」を 川の むこうに 出す
//   ・FOREST_MOBS.west / east：出る モンスター。FOREST_GUARD_KEY：どうくつ、FOREST_NUSHI_KEY：もりのぬし
// ============================================================
const FMON_INK = '#2a1b3d';
function fmonSvg(size, body, sil) {
  return '<svg class="fmon" width="' + size + '" height="' + size + '" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"' +
    (sil ? ' style="filter:brightness(0) opacity(.8)"' : '') + '>' +
    '<ellipse cx="100" cy="188" rx="62" ry="8" fill="rgba(0,0,0,.22)"/>' +
    '<g stroke="' + FMON_INK + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">' + body + '</g></svg>';
}
// おこった 目（x,y：まんなか、r：大きさ、d：まゆの むき 1/-1）
function fmonEye(x, y, r, d, iris) {
  return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + (r * 1.2) + '" fill="#fff"/>' +
    '<circle cx="' + (x + d * r * 0.25) + '" cy="' + (y + r * 0.25) + '" r="' + (r * 0.55) + '" fill="' + (iris || '#111') + '" stroke="none"/>' +
    '<circle cx="' + (x + d * r * 0.25 - r * 0.2) + '" cy="' + (y + r * 0.05) + '" r="' + (r * 0.18) + '" fill="#fff" stroke="none"/>' +
    '<path d="M' + (x - d * r * 1.3) + ' ' + (y - r * 1.5) + ' L' + (x + d * r * 0.9) + ' ' + (y - r * 0.85) + '" fill="none" stroke-width="6"/>';
}
function fmonShine(d) { return '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="8" opacity=".55"/>'; }

const FMON_DRAW = {
  // 🟢 ぷるぷる（まるい ゼリー。あたまに め）
  puru: (p) =>
    '<path d="M38 180 C30 118 60 72 100 72 C140 72 170 118 162 180 Q150 186 140 180 Q128 188 116 181 Q100 188 84 181 Q72 188 60 180 Q48 186 38 180 Z" fill="' + p[0] + '"/>' +
    fmonShine('M60 118 C64 98 76 86 92 82') +
    '<path d="M100 72 L100 50" fill="none"/><path d="M100 54 C86 40 70 46 66 54 C80 60 92 58 100 54 Z" fill="' + p[2] + '"/><path d="M100 50 C112 34 130 38 134 46 C122 54 108 54 100 50 Z" fill="' + p[2] + '"/>' +
    fmonEye(80, 128, 13, 1) + fmonEye(120, 128, 13, -1) +
    '<path d="M80 154 Q100 170 120 154" fill="' + p[1] + '"/><path d="M90 157 L94 166 L98 159" fill="#fff" stroke-width="3"/>',
  // 🍄 おばけキノコ
  kinoko: (p) =>
    '<path d="M78 172 Q70 186 58 184 Q60 172 74 168 Z" fill="#8b5a2b"/><path d="M122 172 Q130 186 142 184 Q140 172 126 168 Z" fill="#8b5a2b"/>' +
    '<path d="M64 106 L136 106 L142 166 Q100 182 58 166 Z" fill="#fde9c4"/>' +
    '<path d="M24 108 C22 46 178 46 176 108 C176 120 24 120 24 108 Z" fill="' + p[0] + '"/>' +
    '<circle cx="62" cy="80" r="11" fill="' + p[1] + '"/><circle cx="104" cy="64" r="13" fill="' + p[1] + '"/><circle cx="142" cy="86" r="10" fill="' + p[1] + '"/><circle cx="90" cy="96" r="6" fill="' + p[1] + '"/>' +
    fmonShine('M44 82 C50 66 62 56 76 52') +
    fmonEye(84, 134, 11, 1) + fmonEye(116, 134, 11, -1) +
    '<path d="M86 158 Q100 150 114 158" fill="none"/>',
  // 🦇 コウモリ
  koumori: (p) =>
    '<path d="M70 96 C46 60 18 66 8 86 C22 86 26 98 22 110 C36 104 44 112 44 124 C56 114 66 118 72 128 Z" fill="' + p[1] + '"/>' +
    '<path d="M130 96 C154 60 182 66 192 86 C178 86 174 98 178 110 C164 104 156 112 156 124 C144 114 134 118 128 128 Z" fill="' + p[1] + '"/>' +
    '<path d="M72 74 L66 38 L92 64 Z" fill="' + p[0] + '"/><path d="M128 74 L134 38 L108 64 Z" fill="' + p[0] + '"/>' +
    '<circle cx="100" cy="104" r="40" fill="' + p[0] + '"/>' +
    fmonShine('M74 92 C78 80 88 72 98 70') +
    fmonEye(84, 100, 10, 1, p[2]) + fmonEye(116, 100, 10, -1, p[2]) +
    '<path d="M84 124 Q100 134 116 124" fill="none"/><path d="M88 125 L92 136 L96 127 Z" fill="#fff" stroke-width="3"/><path d="M112 125 L108 136 L104 127 Z" fill="#fff" stroke-width="3"/>' +
    '<path d="M92 144 L96 158 M108 144 L104 158" fill="none"/>',
  // 🌰 どんぐりへい（やりを もつ）
  donguri: (p) =>
    '<path d="M150 40 L150 176" fill="none" stroke-width="6"/><path d="M150 40 L150 176" fill="none" stroke="#a16207" stroke-width="3"/>' +
    '<path d="M150 22 L162 48 L138 48 Z" fill="#cbd5e1"/>' +
    '<path d="M86 170 L80 184 M114 170 L120 184" fill="none" stroke-width="7"/>' +
    '<ellipse cx="100" cy="128" rx="46" ry="52" fill="' + p[0] + '"/>' +
    fmonShine('M68 116 C70 100 78 90 88 86') +
    '<path d="M48 98 C48 62 152 62 152 98 Q100 112 48 98 Z" fill="' + p[1] + '"/>' +
    '<path d="M62 82 L72 96 M80 74 L88 92 M100 70 L100 90 M120 74 L112 92 M138 82 L128 96" fill="none" stroke-width="3" opacity=".6"/>' +
    '<path d="M100 66 L100 52" fill="none" stroke-width="6"/>' +
    fmonEye(86, 128, 10, 1) + fmonEye(114, 128, 10, -1) +
    '<path d="M88 152 Q100 146 112 152" fill="none"/>' +
    '<path d="M146 130 C140 120 134 124 136 132" fill="' + p[0] + '"/>',
  // 🐝 どくバチ
  hachi: (p) =>
    '<ellipse cx="66" cy="70" rx="30" ry="18" fill="rgba(255,255,255,.75)" transform="rotate(-25 66 70)"/><ellipse cx="134" cy="70" rx="30" ry="18" fill="rgba(255,255,255,.75)" transform="rotate(25 134 70)"/>' +
    '<path d="M100 170 L108 192 L92 192 Z" fill="#334155" transform="translate(0,-10)"/>' +
    '<ellipse cx="100" cy="128" rx="44" ry="46" fill="' + p[0] + '"/>' +
    '<path d="M60 112 Q100 122 140 112 L144 126 Q100 136 56 126 Z M60 146 Q100 156 140 146 L134 160 Q100 168 66 160 Z" fill="' + p[1] + '"/>' +
    fmonShine('M70 104 C74 94 82 88 92 86') +
    '<path d="M86 84 C80 64 70 56 62 54 M114 84 C120 64 130 56 138 54" fill="none"/><circle cx="62" cy="54" r="5" fill="' + p[1] + '"/><circle cx="138" cy="54" r="5" fill="' + p[1] + '"/>' +
    fmonEye(84, 108, 11, 1, '#b91c1c') + fmonEye(116, 108, 11, -1, '#b91c1c'),
  // 🐺 かげオオカミ
  ookami: (p) =>
    '<path d="M40 186 C34 140 60 116 100 116 C140 116 166 140 160 186 Z" fill="' + p[1] + '"/>' +
    '<path d="M52 92 L46 30 L88 66 Z" fill="' + p[0] + '"/><path d="M148 92 L154 30 L112 66 Z" fill="' + p[0] + '"/>' +
    '<path d="M58 84 L56 50 L78 70 Z M142 84 L144 50 L122 70 Z" fill="#fca5a5" stroke-width="3"/>' +
    '<path d="M44 100 C44 60 156 60 156 100 C156 130 134 150 100 160 C66 150 44 130 44 100 Z" fill="' + p[0] + '"/>' +
    '<path d="M72 120 C80 108 120 108 128 120 C126 144 112 158 100 162 C88 158 74 144 72 120 Z" fill="' + p[2] + '"/>' +
    '<ellipse cx="100" cy="124" rx="11" ry="8" fill="#111"/>' +
    '<path d="M84 146 L88 154 L92 146 M108 146 L112 154 L116 146" fill="#fff" stroke-width="3"/>' +
    fmonEye(76, 96, 10, 1, '#facc15') + fmonEye(124, 96, 10, -1, '#facc15'),
  // 🪵 あばれウッド（きりかぶ）
  woody: (p) =>
    '<path d="M60 176 L44 188 M80 180 L76 192 M120 180 L124 192 M140 176 L156 188" fill="none" stroke-width="7"/>' +
    '<path d="M58 70 L54 176 Q100 190 146 176 L142 70 Z" fill="' + p[0] + '"/>' +
    '<path d="M70 100 L72 166 M128 96 L126 164 M98 110 L98 172" fill="none" stroke-width="3" opacity=".45"/>' +
    '<ellipse cx="100" cy="70" rx="42" ry="14" fill="#e8c98a"/><ellipse cx="100" cy="70" rx="24" ry="7" fill="none" stroke-width="3" opacity=".5"/>' +
    '<path d="M58 110 C36 104 26 88 22 72 M142 110 C164 104 174 88 178 72" fill="none" stroke-width="9"/>' +
    '<path d="M58 110 C36 104 26 88 22 72 M142 110 C164 104 174 88 178 72" fill="none" stroke="' + p[0] + '" stroke-width="4"/>' +
    '<circle cx="20" cy="66" r="14" fill="' + p[1] + '"/><circle cx="180" cy="66" r="14" fill="' + p[1] + '"/><circle cx="114" cy="54" r="12" fill="' + p[1] + '"/>' +
    fmonEye(82, 118, 11, 1, '#b45309') + fmonEye(118, 118, 11, -1, '#b45309') +
    '<path d="M78 148 Q100 136 122 148 Q100 160 78 148 Z" fill="#3b1d0f"/>',
  // 🛡 ガランドウ（からっぽの よろい）
  yoroi: (p) =>
    '<path d="M156 60 L156 160" fill="none" stroke-width="7"/><path d="M156 30 L164 60 L148 60 Z" fill="#e2e8f0"/><path d="M142 150 L170 150" fill="none" stroke-width="7"/>' +
    '<path d="M70 176 L66 190 L88 190 L88 176 Z M130 176 L134 190 L112 190 L112 176 Z" fill="' + p[1] + '"/>' +
    '<path d="M62 104 L138 104 L130 178 L70 178 Z" fill="' + p[0] + '"/>' +
    '<path d="M100 104 L100 178" fill="none" stroke-width="3" opacity=".5"/>' +
    '<ellipse cx="54" cy="110" rx="22" ry="16" fill="' + p[1] + '"/><ellipse cx="146" cy="110" rx="22" ry="16" fill="' + p[1] + '"/>' +
    '<path d="M64 98 C60 50 140 50 136 98 Z" fill="' + p[0] + '"/>' +
    '<path d="M100 46 C110 30 124 28 132 32 C122 40 112 46 100 50 Z" fill="' + p[2] + '"/>' +
    '<rect x="70" y="72" width="60" height="12" rx="4" fill="#111"/>' +
    '<circle cx="86" cy="78" r="4" fill="' + p[2] + '" stroke="none"/><circle cx="114" cy="78" r="4" fill="' + p[2] + '" stroke="none"/>' +
    fmonShine('M74 64 C78 56 86 52 94 50'),
  // 🪨 いわゴーレム（どうくつの ばんにん）
  golem: (p) =>
    '<path d="M66 168 L60 190 L92 190 L90 168 Z M134 168 L140 190 L108 190 L110 168 Z" fill="' + p[1] + '"/>' +
    '<path d="M50 86 L150 82 L158 172 L42 174 Z" fill="' + p[0] + '"/>' +
    '<path d="M40 92 L14 104 L10 150 L40 158 L46 120 Z" fill="' + p[1] + '"/><path d="M160 92 L186 104 L190 150 L160 158 L154 120 Z" fill="' + p[1] + '"/>' +
    '<path d="M70 82 L74 40 L130 36 L134 82 Z" fill="' + p[0] + '"/>' +
    '<path d="M60 120 L80 132 L76 150 M130 112 L140 140 M98 150 L118 160" fill="none" stroke-width="3" opacity=".5"/>' +
    '<path d="M70 52 C84 40 104 44 112 38 C122 34 130 40 130 44" fill="none" stroke="' + p[3] + '" stroke-width="10"/>' +
    '<rect x="80" y="56" width="14" height="10" rx="2" fill="' + p[2] + '" stroke="none"/><rect x="108" y="56" width="14" height="10" rx="2" fill="' + p[2] + '" stroke="none"/>' +
    '<path d="M86 74 L116 74" fill="none"/>' +
    '<circle cx="100" cy="122" r="10" fill="' + p[2] + '" stroke-width="3"/>',
  // 👻 おばけ
  obake: (p) =>
    '<path d="M44 176 C40 110 54 50 100 50 C146 50 160 110 156 176 Q146 166 136 178 Q124 166 112 180 Q100 166 88 180 Q76 166 64 178 Q54 166 44 176 Z" fill="' + p[0] + '"/>' +
    '<path d="M48 120 C30 118 22 104 24 92 C36 98 44 100 52 100 Z M152 120 C170 118 178 104 176 92 C164 98 156 100 148 100 Z" fill="' + p[0] + '"/>' +
    fmonShine('M66 94 C70 76 80 64 92 60') +
    fmonEye(82, 104, 12, 1, p[2]) + fmonEye(118, 104, 12, -1, p[2]) +
    '<path d="M80 132 Q100 148 120 132 Q100 140 80 132 Z" fill="#3b0d2e"/><path d="M96 138 Q100 156 108 150 Q110 142 104 138 Z" fill="' + p[1] + '" stroke-width="3"/>',
  // 🐍 へび（とぐろ）
  hebi: (p) =>
    '<ellipse cx="100" cy="170" rx="56" ry="16" fill="' + p[0] + '"/><ellipse cx="100" cy="152" rx="44" ry="14" fill="' + p[0] + '"/><ellipse cx="100" cy="136" rx="32" ry="12" fill="' + p[0] + '"/>' +
    '<path d="M70 166 Q100 174 130 166 M76 150 Q100 156 124 150" fill="none" stroke="' + p[1] + '" stroke-width="4"/>' +
    '<path d="M108 132 C122 108 118 86 104 76" fill="none" stroke-width="26"/><path d="M108 132 C122 108 118 86 104 76" fill="none" stroke="' + p[0] + '" stroke-width="17"/>' +
    '<path d="M64 70 C64 44 130 40 136 66 C138 84 118 92 100 92 C80 92 64 86 64 70 Z" fill="' + p[0] + '"/>' +
    fmonShine('M74 62 C78 54 86 50 96 48') +
    fmonEye(86, 64, 9, 1, '#facc15') + fmonEye(116, 62, 9, -1, '#facc15') +
    '<path d="M100 90 L100 106 M100 106 L92 114 M100 106 L108 114" fill="none" stroke="#dc2626" stroke-width="4"/>' +
    '<path d="M88 84 Q100 90 112 84" fill="none"/>',
  // 🌺 パクパクフラワー
  hana: (p) =>
    '<path d="M100 122 L100 184" fill="none" stroke-width="12"/><path d="M100 122 L100 184" fill="none" stroke="#16a34a" stroke-width="6"/>' +
    '<path d="M100 166 C80 146 56 150 46 164 C64 172 84 172 100 166 Z M100 158 C120 138 144 142 154 156 C136 164 116 164 100 158 Z" fill="#22c55e"/>' +
    [0, 60, 120, 180, 240, 300].map(a => '<ellipse cx="100" cy="54" rx="22" ry="30" fill="' + p[0] + '" transform="rotate(' + a + ' 100 90)"/>').join('') +
    '<circle cx="100" cy="90" r="38" fill="' + p[1] + '"/>' +
    '<path d="M70 96 Q100 132 130 96 Q100 112 70 96 Z" fill="#3b0d2e"/>' +
    '<path d="M76 100 L82 110 L86 102 M94 104 L100 114 L104 104 M114 102 L118 110 L124 100" fill="#fff" stroke-width="2.5"/>' +
    fmonEye(86, 78, 9, 1) + fmonEye(114, 78, 9, -1),
  // 🐛 いもむし
  imomushi: (p) =>
    '<circle cx="40" cy="160" r="20" fill="' + p[0] + '"/><circle cx="66" cy="148" r="23" fill="' + p[1] + '"/><circle cx="94" cy="142" r="25" fill="' + p[0] + '"/><circle cx="122" cy="132" r="26" fill="' + p[1] + '"/>' +
    '<path d="M40 180 L40 188 M66 170 L66 186 M94 166 L94 186 M122 158 L122 186" fill="none" stroke-width="6"/>' +
    '<circle cx="146" cy="100" r="34" fill="' + p[0] + '"/>' +
    fmonShine('M126 86 C130 76 138 70 148 68') +
    '<path d="M134 70 C128 46 116 40 108 40 M160 68 C166 44 178 38 186 40" fill="none"/><circle cx="108" cy="40" r="6" fill="' + p[2] + '"/><circle cx="186" cy="40" r="6" fill="' + p[2] + '"/>' +
    fmonEye(134, 98, 9, 1) + fmonEye(160, 96, 9, -1) +
    '<path d="M134 118 Q148 126 162 116" fill="none"/>',
  // 🐲 ちびドラゴン
  chibidora: (p) =>
    '<path d="M136 160 C166 160 182 140 184 118 C172 132 160 138 144 140 Z" fill="' + p[0] + '"/><path d="M184 118 L194 110 L188 126 Z" fill="' + p[2] + '"/>' +
    '<path d="M60 96 C34 74 16 82 12 100 C26 98 30 108 28 118 C42 110 52 116 56 126 Z" fill="' + p[2] + '"/><path d="M140 96 C166 74 184 82 188 100 C174 98 170 108 172 118 C158 110 148 116 144 126 Z" fill="' + p[2] + '"/>' +
    '<path d="M76 168 L72 188 L92 188 L92 170 Z M124 168 L128 188 L108 188 L108 170 Z" fill="' + p[0] + '"/>' +
    '<ellipse cx="100" cy="138" rx="44" ry="44" fill="' + p[0] + '"/><ellipse cx="100" cy="148" rx="26" ry="28" fill="' + p[1] + '"/>' +
    '<path d="M86 146 L114 146 M88 160 L112 160" fill="none" stroke-width="3" opacity=".4"/>' +
    '<path d="M72 64 L64 36 L86 56 Z M128 64 L136 36 L114 56 Z" fill="' + p[1] + '"/>' +
    '<ellipse cx="100" cy="82" rx="40" ry="34" fill="' + p[0] + '"/>' +
    fmonShine('M72 74 C76 62 86 54 96 52') +
    fmonEye(86, 80, 10, 1) + fmonEye(114, 80, 10, -1) +
    '<path d="M86 102 Q100 110 114 102" fill="none"/><circle cx="92" cy="96" r="2" fill="#111" stroke="none"/><circle cx="108" cy="96" r="2" fill="#111" stroke="none"/>' +
    '<path d="M118 104 C130 98 140 104 146 96 C150 108 140 116 128 112 Z" fill="#fb923c" stroke-width="3"/>',
  // 👑 もりのぬし（つのの ある 大グマ。うでを あげて ほえる）
  nushi: (p) =>
    '<ellipse cx="100" cy="104" rx="96" ry="86" fill="rgba(239,68,68,.22)" stroke="none"/>' +
    // つの（えだわかれ＋もみじ）
    '<path d="M74 46 L60 14 M64 26 L44 18 M68 36 L50 40 M126 46 L140 14 M136 26 L156 18 M132 36 L150 40" fill="none" stroke-width="12"/>' +
    '<path d="M74 46 L60 14 M64 26 L44 18 M68 36 L50 40 M126 46 L140 14 M136 26 L156 18 M132 36 L150 40" fill="none" stroke="#e7cfa3" stroke-width="6"/>' +
    '<circle cx="44" cy="16" r="7" fill="#e07b2a"/><circle cx="60" cy="10" r="6" fill="#c0392b"/><circle cx="156" cy="16" r="7" fill="#d9a420"/><circle cx="142" cy="9" r="6" fill="#e07b2a"/>' +
    // うで（あげて つめ）
    '<path d="M50 128 C34 112 22 92 24 70 L44 66 C46 86 56 102 68 112 Z" fill="' + p[0] + '"/>' +
    '<path d="M150 128 C166 112 178 92 176 70 L156 66 C154 86 144 102 132 112 Z" fill="' + p[0] + '"/>' +
    '<circle cx="34" cy="62" r="17" fill="' + p[0] + '"/><circle cx="166" cy="62" r="17" fill="' + p[0] + '"/>' +
    '<path d="M20 52 Q14 38 22 30 Q24 42 30 48 Z M32 46 Q30 30 38 24 Q38 38 42 44 Z M44 50 Q48 36 56 34 Q52 44 50 52 Z" fill="#f8fafc" stroke-width="3"/>' +
    '<path d="M180 52 Q186 38 178 30 Q176 42 170 48 Z M168 46 Q170 30 162 24 Q162 38 158 44 Z M156 50 Q152 36 144 34 Q148 44 150 52 Z" fill="#f8fafc" stroke-width="3"/>' +
    // からだ・おなか・こけの マント
    '<path d="M28 192 C22 132 54 104 100 104 C146 104 178 132 172 192 Z" fill="' + p[0] + '"/>' +
    '<ellipse cx="100" cy="160" rx="38" ry="30" fill="' + p[1] + '"/>' +
    '<path d="M42 132 Q52 118 62 128 Q72 112 84 124 Q100 110 116 124 Q128 112 138 128 Q148 118 158 132 Q150 142 100 140 Q50 142 42 132 Z" fill="' + p[2] + '"/>' +
    // あたま
    '<circle cx="66" cy="50" r="13" fill="' + p[0] + '"/><circle cx="134" cy="50" r="13" fill="' + p[0] + '"/>' +
    '<path d="M54 80 C52 48 148 48 146 80 C146 108 126 122 100 122 C74 122 54 108 54 80 Z" fill="' + p[0] + '"/>' +
    '<path d="M76 94 C80 82 120 82 124 94 C124 112 112 120 100 120 C88 120 76 112 76 94 Z" fill="' + p[1] + '"/>' +
    '<ellipse cx="100" cy="90" rx="9" ry="6" fill="#111"/>' +
    // ほえる 口
    '<path d="M84 102 Q100 98 116 102 Q114 118 100 118 Q86 118 84 102 Z" fill="#7f1d1d"/>' +
    '<path d="M87 103 L91 111 L95 102 M105 102 L109 111 L113 103" fill="#fff" stroke-width="2.5"/>' +
    fmonEye(80, 72, 8, 1, '#dc2626') + fmonEye(120, 72, 8, -1, '#dc2626') +
    '<circle cx="80" cy="74" r="13" fill="rgba(253,224,71,.25)" stroke="none"/><circle cx="120" cy="74" r="13" fill="rgba(253,224,71,.25)" stroke="none"/>',
};

// key → [かたち, いろ（[からだ, こい色, アクセント, …]）, なまえ]
// ※ あおい まるい ゼリーは つくらない（本物の スライムに にてしまうので）
const FOREST_MONSTERS = {
  // 川の こちら（よわめ）
  fm_puru:      ['puru', ['#4ade80', '#14532d', '#16a34a'], 'ぷるぷる'],
  fm_kinoko:    ['kinoko', ['#ef4444', '#ffffff'], 'おばけキノコ'],
  fm_koumori:   ['koumori', ['#8b5cf6', '#6d28d9', '#fde047'], 'もりコウモリ'],
  fm_donguri:   ['donguri', ['#b45309', '#78350f'], 'どんぐりへい'],
  fm_hachi:     ['hachi', ['#facc15', '#1f2937'], 'どくバチ'],
  fm_obake:     ['obake', ['#f8fafc', '#f472b6', '#111'], 'もりおばけ'],
  fm_hebi:      ['hebi', ['#84cc16', '#3f6212'], 'くさへび'],
  fm_hana:      ['hana', ['#f472b6', '#fde047'], 'パクパクフラワー'],
  fm_imomushi:  ['imomushi', ['#a3e635', '#65a30d', '#facc15'], 'もぐもぐムシ'],
  // 川の むこう（色ちがいで つよい ＋ むこうだけの なかま）
  fm_puru2:     ['puru', ['#f97316', '#7c2d12', '#dc2626'], 'メラぷる'],
  fm_puru3:     ['puru', ['#c084fc', '#3b0764', '#7e22ce'], 'どくぷる'],
  fm_kinoko2:   ['kinoko', ['#a855f7', '#d9f99d'], 'どくどくキノコ'],
  fm_koumori2:  ['koumori', ['#334155', '#7f1d1d', '#f87171'], 'やみコウモリ'],
  fm_donguri2:  ['donguri', ['#facc15', '#a16207'], 'どんぐりたいちょう'],
  fm_hachi2:    ['hachi', ['#f87171', '#450a0a'], 'じょおうバチ'],
  fm_obake2:    ['obake', ['#a78bfa', '#22d3ee', '#fde047'], 'かげおばけ'],
  fm_hebi2:     ['hebi', ['#7c3aed', '#2e1065'], 'まどうへび'],
  fm_hana2:     ['hana', ['#991b1b', '#fb923c'], 'ひとくいフラワー'],
  fm_imomushi2: ['imomushi', ['#fb923c', '#dc2626', '#fde047'], 'ほのおムシ'],
  fm_ookami:    ['ookami', ['#94a3b8', '#475569', '#e2e8f0'], 'かげオオカミ'],
  fm_woody:     ['woody', ['#92400e', '#e07b2a'], 'あばれウッド'],
  fm_yoroi:     ['yoroi', ['#94a3b8', '#64748b', '#ef4444'], 'ガランドウ'],
  fm_chibidora: ['chibidora', ['#ef4444', '#fde68a', '#f97316'], 'ちびドラゴン'],
  // どうくつ・ぬし
  fm_golem:     ['golem', ['#a8a29e', '#78716c', '#22d3ee', '#4d7c0f'], 'いわゴーレム'],
  fm_nushi:     ['nushi', ['#5b3a1f', '#c8a27a', '#4d7c0f'], 'もりのぬし グランベア'],
};
const FOREST_MOBS = {
  west: ['fm_puru', 'fm_kinoko', 'fm_koumori', 'fm_donguri', 'fm_hachi', 'fm_obake', 'fm_hebi', 'fm_hana', 'fm_imomushi'],
  east: ['fm_puru2', 'fm_puru3', 'fm_kinoko2', 'fm_koumori2', 'fm_donguri2', 'fm_hachi2', 'fm_obake2', 'fm_hebi2',
         'fm_hana2', 'fm_imomushi2', 'fm_ookami', 'fm_woody', 'fm_yoroi', 'fm_chibidora'],
};
const FOREST_GUARD_KEY = 'fm_golem', FOREST_NUSHI_KEY = 'fm_nushi';
Object.entries(FOREST_MONSTERS).forEach(([key, [shape, pal, name]]) => {
  CHARS[key] = (lv, fill, size, opts) => fmonSvg(size || 160, FMON_DRAW[shape](pal), opts && opts.silhouette);
  CHAR_NAME[key] = name;
});
