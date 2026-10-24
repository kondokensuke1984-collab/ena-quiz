# 10/26 4科演習の範囲（立方体と直方体・割合の表し方）の算数模試・オリジナル問題版（A4印刷用）
# アプリの問題は使わず、同じ単元・同じ型の問題を新しく作る。20問・1問5点で100点。
# 図は「前の面の形を奥へのばした立体（角柱）」として SVG で描き、体積・表面積はその形から計算して答えと照らし合わせる。
import json, os, math
from fractions import Fraction as F

SP = os.path.dirname(os.path.abspath(__file__))

TITLE = '10月 4科演習たいさく 算数模試（オリジナル）'
COLOR = '#0f766e'
LIMIT_MIN = 40


# ── 図（見取図）──────────────────────────────────────────────
# poly: 前の面の形（横x・高さz, cm）、反時計回り。depth: 奥行き（たて, cm）。
# 斜投影：奥行きは 45°・長さ 1/2 で右上へ。
COS = SIN = math.sqrt(0.5)
K = 0.5


def area(poly):
    s = 0
    for (x1, z1), (x2, z2) in zip(poly, poly[1:] + poly[:1]):
        s += x1 * z2 - x2 * z1
    return s / 2


def perimeter(poly):
    return sum(math.dist(a, b) for a, b in zip(poly, poly[1:] + poly[:1]))


def prism_svg(poly, depth, labels, scale=13, pad=34):
    """labels: (x, z, y, 文字, dx, dy) … 立体の点(x,z,y)の近くに文字（dx,dy は px のずらし）"""
    def P(x, z, y):
        return (x + K * y * COS, z + K * y * SIN)
    pts = [P(x, z, y) for x, z in poly for y in (0, depth)]
    for lx, lz, ly, *_ in labels:
        pts.append(P(lx, lz, ly))
    minx = min(p[0] for p in pts); maxx = max(p[0] for p in pts)
    minz = min(p[1] for p in pts); maxz = max(p[1] for p in pts)
    W = (maxx - minx) * scale + pad * 2
    H = (maxz - minz) * scale + pad * 2

    def S(p):
        return ((p[0] - minx) * scale + pad, (maxz - p[1]) * scale + pad)

    def path(ps):
        return ' '.join(f'{x:.1f},{y:.1f}' for x, y in (S(p) for p in ps))

    faces = []
    n = len(poly)
    for i in range(n):
        (x1, z1), (x2, z2) = poly[i], poly[(i + 1) % n]
        nx, nz = z2 - z1, -(x2 - x1)          # 反時計回りの外向き法線
        if nx * COS + nz * SIN <= 1e-9:
            continue                           # 左・下を向く面は見えない
        key = (x1 + x2) / 2 * COS + (z1 + z2) / 2 * SIN
        shade = '#e2e8f0' if nz > 0 else '#cbd5e1'   # 上向き＝明るめ・右向き＝暗め
        faces.append((key, [P(x1, z1, 0), P(x2, z2, 0), P(x2, z2, depth), P(x1, z1, depth)], shade))
    faces.sort(key=lambda f: f[0])
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" width="{W:.0f}" height="{H:.0f}">']
    for _, quad, shade in faces:
        out.append(f'<polygon points="{path(quad)}" fill="{shade}" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/>')
    out.append(f'<polygon points="{path([P(x, z, 0) for x, z in poly])}" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/>')
    for lx, lz, ly, text, dx, dy in labels:
        sx, sy = S(P(lx, lz, ly))
        out.append(f'<text x="{sx + dx:.1f}" y="{sy + dy:.1f}" font-size="12" text-anchor="middle" dominant-baseline="middle" '
                   f'font-family="Hiragino Sans, sans-serif" font-weight="700">{text}</text>')
    out.append('</svg>')
    return ''.join(out)


def box(w, h, d):
    return [(0, 0), (w, 0), (w, h), (0, h)], d


# ── 大問1 立方体と直方体 ──────────────────────────────────────
Q1 = []

# 問1 立方体の体積
poly, d = box(7, 7, 7)
assert area(poly) * d == 343
Q1.append(dict(q='1辺が7cmの立方体があります。この立方体の体積は何cm³ですか。',
               svg=prism_svg(poly, d, [(3.5, 0, 0, '7cm', 0, 12), (0, 3.5, 0, '7cm', -18, 0), (7, 0, 3.5, '7cm', 22, 6)], scale=12),
               answer='343cm³', explanation='立方体の体積＝1辺×1辺×1辺\n7×7×7＝343（cm³）'))

# 問2 直方体の表面積
poly, d = box(8, 6, 5)
sa = 2 * area(poly) + perimeter(poly) * d
assert sa == 236
Q1.append(dict(q='図の直方体の表面積は何cm²ですか。',
               svg=prism_svg(poly, d, [(4, 0, 0, '8cm', 0, 12), (0, 3, 0, '6cm', -18, 0), (8, 0, 2.5, '5cm', 22, 6)]),
               answer='236cm²', explanation='向かい合う面は同じ形なので、3種類の面を2つずつ。\n8×6＝48、8×5＝40、6×5＝30\n（48＋40＋30）×2＝236（cm²）'))

# 問3 体積から高さ
assert 360 // (6 * 10) == 6
Q1.append(dict(q='たて6cm、横10cmの直方体があります。体積が360cm³のとき、高さは何cmですか。',
               answer='6cm', explanation='体積＝たて×横×高さ なので、高さ＝体積÷（たて×横）\n360÷（6×10）＝360÷60＝6（cm）'))

# 問4 表面積から立方体の体積
side = int(math.isqrt(150 // 6))
assert side * side * 6 == 150 and side ** 3 == 125
Q1.append(dict(q='表面積が150cm²の立方体があります。この立方体の体積は何cm³ですか。',
               answer='125cm³', explanation='立方体の6つの面はすべて同じ正方形。\n1つの面は 150÷6＝25（cm²）、25＝5×5 なので1辺は5cm。\n体積は 5×5×5＝125（cm³）'))

# 問5 L字の立体の体積
poly = [(0, 0), (10, 0), (10, 3), (4, 3), (4, 8), (0, 8)]; d = 6
assert area(poly) * d == 300
Q1.append(dict(q='図は、2つの直方体を組み合わせた立体です。この立体の体積は何cm³ですか。',
               svg=prism_svg(poly, d, [(5, 0, 0, '10cm', 0, 12), (2, 8, 0, '4cm', 0, -10), (0, 4, 0, '8cm', -18, 0),
                                       (10, 1.5, 0, '3cm', -16, 0), (10, 0, 3, '6cm', 22, 6)]),
               answer='300cm³', explanation='前の面を2つの長方形に分ける。\n左：4×8＝32、右：（10－4）×3＝18 → 前の面は 32＋18＝50（cm²）\n奥行きが6cmなので 50×6＝300（cm³）\n（別解）4×8×6＋6×3×6＝192＋108＝300'))

# 問6 階段の形の立体の表面積
poly = [(0, 0), (9, 0), (9, 2), (6, 2), (6, 4), (3, 4), (3, 6), (0, 6)]; d = 5
sa = 2 * area(poly) + perimeter(poly) * d
assert area(poly) == 36 and perimeter(poly) == 30 and sa == 222
Q1.append(dict(q='図は、3だんの階段の形をした立体です。だんの高さはどれも2cm、はばはどれも3cm、奥行きは5cmです。この立体の表面積は何cm²ですか。',
               svg=prism_svg(poly, d, [(4.5, 0, 0, '9cm', 0, 12), (0, 3, 0, '6cm', -18, 0), (9, 0, 2.5, '5cm', 22, 6)]),
               answer='222cm²', explanation='前と後ろの面：3×6＋3×4＋3×2＝36（cm²）が2つで72（cm²）\nまわりの面は、横にのばすと たて5cm・横＝前の面のまわりの長さの長方形になる。\n前の面のまわりの長さ＝（9＋6）×2＝30（cm） → 30×5＝150（cm²）\n合わせて 72＋150＝222（cm²）'))

# 問7 みぞのある立体の体積
poly = [(0, 0), (12, 0), (12, 7), (8, 7), (8, 3), (4, 3), (4, 7), (0, 7)]; d = 5
assert area(poly) * d == 340
Q1.append(dict(q='図は、直方体から、はばが4cm・深さが4cmの直方体を、前から後ろまで取りのぞいた立体です。この立体の体積は何cm³ですか。',
               svg=prism_svg(poly, d, [(6, 0, 0, '12cm', 0, 12), (0, 3.5, 0, '7cm', -18, 0), (6, 3, 0, '4cm', 0, 10),
                                       (12, 0, 2.5, '5cm', 22, 6)]),
               answer='340cm³', explanation='もとの直方体から、取りのぞいた直方体をひく。\n12×5×7＝420、4×5×4＝80\n420－80＝340（cm³）'))

# 問8 体積から□を求める
poly = [(0, 0), (12, 0), (12, 4), (8, 4), (8, 11), (4, 11), (4, 4), (0, 4)]; d = 6
assert area(poly) * d == 456
Q1.append(dict(q='図は、3つの直方体を組み合わせた立体で、体積は456cm³です。□の長さは何cmですか。',
               svg=prism_svg(poly, d, [(6, 0, 0, '12cm', 0, 12), (0, 2, 0, '4cm', -18, 0), (6, 11, 0, '4cm', 0, -10),
                                       (4, 7.5, 0, '□cm', -18, 0), (12, 0, 3, '6cm', 22, 6)]),
               answer='11cm', explanation='下の直方体：12×6×4＝288（cm³）\n上の直方体の体積は 456－288＝168（cm³）\n上の直方体の高さ＝168÷（4×6）＝7（cm）\n□＝4＋7＝11（cm）'))

# 問9 水そう（容積と L）
assert 12000 // (20 * 30) == 20
Q1.append(dict(q='内のりが、たて20cm・横30cm・深さ25cmの直方体の水そうがあります。この水そうに12Lの水を入れると、水の深さは何cmになりますか。',
               answer='20cm', explanation='1L＝1000cm³ なので 12L＝12000cm³\n底面積は 20×30＝600（cm²）\n深さ＝12000÷600＝20（cm）'))

# 問10 つみ木の表面積
w, dd, h = 2 * 4, 2 * 3, 2 * 2
assert 2 * (w * dd + w * h + dd * h) == 208
Q1.append(dict(q='1辺が2cmの立方体のつみ木を、横に4こ、たてに3こならべ、それを2だん重ねて、すきまのない直方体を作りました。この直方体の表面積は何cm²ですか。',
               answer='208cm²', explanation='できた直方体は 横8cm・たて6cm・高さ4cm。\n8×6＝48、8×4＝32、6×4＝24\n（48＋32＋24）×2＝208（cm²）'))


# ── 大問2 割合の表し方 ──────────────────────────────────────
Q2 = []


def chk(cond):
    assert cond
    return True


chk(F(18, 24) == F(3, 4))
Q2.append(dict(q='次の□にあてはまる数を求めなさい。（分数で答えなさい）\n18kgは24kgの□倍', answer='3/4（倍）',
               explanation='AはBの A÷B 倍。\n18÷24＝18/24＝3/4'))
chk(35 * F('1.6') == 56)
Q2.append(dict(q='次の□にあてはまる数を求めなさい。\n35人の1.6倍は□人', answer='56（人）',
               explanation='もとにする量×割合＝くらべる量\n35×1.6＝56（人）'))
chk(52 / F('0.8') == 65)
Q2.append(dict(q='次の□にあてはまる数を求めなさい。\n□mの0.8倍は52m', answer='65（m）',
               explanation='もとにする量＝くらべる量÷割合\n52÷0.8＝65（m）'))
chk(28 * F(3, 7) == 12)
Q2.append(dict(q='次の□にあてはまる数を求めなさい。\n28人の 3/7 は□人', answer='12（人）',
               explanation='28×3/7＝12（人）\n（28を7等分すると4、その3つ分で12）'))
chk(450 / F(5, 8) == 720)
Q2.append(dict(q='次の□にあてはまる数を求めなさい。\n□円の 5/8 は450円', answer='720（円）',
               explanation='450÷5/8＝450×8/5＝720（円）\n（5つ分が450円なので1つ分は90円、8つ分で720円）'))
chk(F(368, 320) == F('1.15'))
Q2.append(dict(q='定員が320人のホールに、368人のお客さんが入りました。定員をもとにしたときの、お客さんの人数の割合を小数で求めなさい。',
               answer='1.15', explanation='割合＝くらべる量÷もとにする量\n368÷320＝1.15'))
chk(42 / F('0.7') == 60)
Q2.append(dict(q='弟はシールを42枚持っていて、これは兄が持っているシールの0.7倍です。兄はシールを何枚持っていますか。',
               answer='60枚', explanation='もとにする量（兄）＝42÷0.7＝60（枚）'))
chk(600 / F(3, 8) == 1600)
Q2.append(dict(q='ゆいさんは、はじめの所持金の 3/8 を使って、600円の本を買いました。はじめの所持金は何円でしたか。',
               answer='1600円', explanation='はじめの所持金の 3/8 が600円。\n600÷3/8＝600×8/3＝1600（円）'))
chk(72 / (1 - F(5, 9)) == 162)
Q2.append(dict(q='そうた君はある本を、全体の 5/9 まで読みました。残りは72ページです。この本は全部で何ページありますか。',
               answer='162ページ', explanation='残りは全体の 1－5/9＝4/9\n72÷4/9＝72×9/4＝162（ページ）'))
_T = (51 + 3) / F(3, 7)  # 女子＝全体×3/7－3 → 全体×3/7＝54
chk(_T == 126 and F(4, 7) * _T + 3 == 75 and _T - 75 == 51)
Q2.append(dict(q='ある学年の男子の人数は、学年全体の人数の 4/7 より3人多く、女子の人数は51人です。この学年の男子の人数は何人ですか。',
               answer='75人', explanation='男子は「全体の4/7＋3人」なので、女子は「全体の3/7－3人」。\n全体の 3/7 が 51＋3＝54（人）にあたる。\n全体＝54÷3/7＝126（人）\n男子＝126－51＝75（人）\n（たしかめ：126×4/7＋3＝72＋3＝75）'))

exam = [{'title': '立方体と直方体', 'qs': Q1}, {'title': '割合の表し方', 'qs': Q2}]
total = sum(len(s['qs']) for s in exam)
assert total == 20, total
POINT = 100 // total
print(f'合計{total}問（図{sum(1 for s in exam for q in s["qs"] if q.get("svg"))}問）・1問{POINT}点')
for s in exam:
    for q in s['qs']:
        print(' ', s['title'], q['answer'])

EXAM_JSON = json.dumps(exam, ensure_ascii=False).replace('</', '<\\/')

# ── 模試本体 ──────────────────────────────────────────────
EXAM_HTML = '''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>%%TITLE%%</title>
<style>
  @page { size: A4 portrait; margin: 14mm 13mm 13mm; }
  *{ margin:0; padding:0; box-sizing:border-box; }
  body{
    font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;
    color:#111; -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  section.page.cover{ break-after:page; }
  section.daimon + section.daimon{ break-before:page; }

  .cover{ display:flex; flex-direction:column; align-items:center; padding-top:30mm; }
  .cover h1{ font-size:23pt; letter-spacing:.03em; margin-bottom:4mm; }
  .cover .sub{ font-size:11pt; color:#555; margin-bottom:18mm; }
  .cover table{ border-collapse:collapse; font-size:12pt; margin-bottom:14mm; }
  .cover td{ border:0.3mm solid #999; padding:3mm 8mm; }
  .cover td.label{ background:#f2f2f2; font-weight:700; text-align:center; }
  .cover .score{ font-size:16pt; }
  .cover .note{ font-size:10pt; color:#555; border-top:.3mm solid #ccc; padding-top:4mm; margin-top:4mm; width:150mm; line-height:1.7; }

  .cat-head{ break-after:avoid; color:#fff; padding:2.5mm 5mm; border-radius:1.5mm; margin-bottom:5mm; }
  .cat-head h2{ font-size:15pt; }

  .grid2{ display:grid; grid-template-columns:1fr 1fr; column-gap:6mm; row-gap:4mm; margin-bottom:4mm; }
  .qb{ break-inside:avoid; border:.3mm solid #bbb; border-radius:1.5mm; padding:2.5mm 3mm; display:flex; flex-direction:column; }
  .qb .num{ font-weight:800; font-size:11pt; }
  .qb .qtext{ font-size:10pt; line-height:1.6; white-space:pre-line; margin:1mm 0 2mm; }
  .qb .imgs{ display:flex; justify-content:center; margin:1mm 0 2mm; }
  .qb .imgs svg{ max-width:100%; max-height:46mm; height:auto; }
  .qb .work{ flex:1; min-height:30mm; border-top:.2mm dashed #ccc; font-size:7.5pt; color:#aaa; padding-top:.5mm; }
  .qb.noimg .work{ min-height:34mm; }
  .qb .ans{ display:flex; justify-content:flex-end; align-items:center; gap:2mm; font-size:10pt; font-weight:700; margin-top:1.5mm; }
  .qb .ans span.box{ display:inline-block; width:38mm; height:9mm; border:.4mm solid #333; }
</style>
</head>
<body>
<section class="page cover">
  <h1>%%TITLE%%</h1>
  <div class="sub">ena ANRINO　10/26（月）4科演習の範囲：立方体と直方体・割合の表し方</div>
  <table>
    <tr><td class="label">名前</td><td style="width:60mm;">&nbsp;</td><td class="label">日付</td><td style="width:36mm;">&nbsp;</td></tr>
    <tr><td class="label">時間</td><td>%%LIMIT%%分</td><td class="label">得点</td><td class="score">　　　／100</td></tr>
  </table>
  <div class="note">
    ・全部で%%TOTAL%%問、1問%%POINT%%点、100点満点です。<br>
    ・大問1「立方体と直方体」%%N1%%問、大問2「割合の表し方」%%N2%%問。<br>
    ・式や考え方は、それぞれのわくの中の空いているところに書きましょう。<br>
    ・答えは□の中に書きましょう。単位（cm³・cm²・人など）もわすれずに。<br>
    ・分数の答えは、それ以上約分できない形で書きましょう。
  </div>
</section>
<div id="cats"></div>
<script>
const EXAM = %%EXAM_JSON%%;
const COLOR = '%%COLOR%%';

function renderQ(q, n) {
  const d = document.createElement('div');
  d.className = q.svg ? 'qb' : 'qb noimg';
  let html = `<div class="num">問${n}</div><div class="qtext"></div>`;
  if (q.svg) html += `<div class="imgs">${q.svg}</div>`;
  html += '<div class="work">式・考え方</div><div class="ans">答え <span class="box"></span></div>';
  d.innerHTML = html;
  d.querySelector('.qtext').textContent = q.q;
  return d;
}

let n = 0;
EXAM.forEach((sec, si) => {
  const page = document.createElement('section');
  page.className = 'daimon';
  const head = document.createElement('div');
  head.className = 'cat-head';
  head.style.background = COLOR;
  head.innerHTML = `<h2>大問${si + 1}　${sec.title}</h2>`;
  page.appendChild(head);
  const grid = document.createElement('div');
  grid.className = 'grid2';
  sec.qs.forEach(q => grid.appendChild(renderQ(q, ++n)));
  page.appendChild(grid);
  document.getElementById('cats').appendChild(page);
});
</script>
</body>
</html>
'''

# ── 解答・解説 ──────────────────────────────────────────────
KAITOU_HTML = '''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>%%TITLE%% 解答・解説</title>
<style>
  @page { size: A4 portrait; margin: 11mm 12mm 10mm; }
  *{ margin:0; padding:0; box-sizing:border-box; }
  body{
    font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;
    color:#111; -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  header{ border-bottom:1.2mm solid #111; padding-bottom:2mm; margin-bottom:4mm; }
  h1{ font-size:14pt; }
  h1 .warn{ font-size:9pt; color:#c00; font-weight:700; margin-left:3mm; }
  .info{ font-size:8.5pt; color:#444; margin-top:1mm; }
  .sheet{ column-count:2; column-gap:6mm; }
  .region h2{ font-size:10pt; font-weight:800; color:#fff; padding:.8mm 2.5mm; margin:2mm 0 1.5mm; border-radius:.8mm; break-after:avoid; }
  .region:first-child h2{ margin-top:0; }
  .item{ break-inside:avoid; padding-bottom:1.2mm; margin-bottom:1.2mm; border-bottom:.2mm dotted #ccc; font-size:8.8pt; line-height:1.45; }
  .item .n{ font-weight:800; }
  .item .ans{ font-weight:800; color:#0f766e; }
  .item .exp{ color:#444; white-space:pre-line; }
</style>
</head>
<body>
<header>
  <h1>%%TITLE%%　解答・解説<span class="warn">※おうちの人用</span></h1>
  <div class="info">1問%%POINT%%点・100点満点／目安時間%%LIMIT%%分。単位がないもの・約分していない分数は、その場で直させてから正解にしてください。</div>
</header>
<div class="sheet" id="sheet"></div>
<script>
const EXAM = %%EXAM_JSON%%;
const COLOR = '%%COLOR%%';
const sheet = document.getElementById('sheet');
let n = 0;
EXAM.forEach((sec, si) => {
  const r = document.createElement('section');
  r.className = 'region';
  const h = document.createElement('h2');
  h.textContent = `大問${si + 1}　${sec.title}`;
  h.style.background = COLOR;
  r.appendChild(h);
  sec.qs.forEach(q => {
    const d = document.createElement('div');
    d.className = 'item';
    d.innerHTML = '<span class="n"></span>　<span class="ans"></span><div class="exp"></div>';
    d.querySelector('.n').textContent = `問${++n}`;
    d.querySelector('.ans').textContent = q.answer;
    d.querySelector('.exp').textContent = q.explanation || '';
    r.appendChild(d);
  });
  sheet.appendChild(r);
});
</script>
</body>
</html>
'''


def fill(html):
    return (html.replace('%%EXAM_JSON%%', EXAM_JSON)
            .replace('%%TITLE%%', TITLE)
            .replace('%%COLOR%%', COLOR)
            .replace('%%LIMIT%%', str(LIMIT_MIN))
            .replace('%%TOTAL%%', str(total))
            .replace('%%POINT%%', str(POINT))
            .replace('%%N1%%', str(len(exam[0]['qs'])))
            .replace('%%N2%%', str(len(exam[1]['qs']))))


with open(os.path.join(SP, 'moshi_202610_sansu_orig.html'), 'w', encoding='utf-8') as f:
    f.write(fill(EXAM_HTML))
with open(os.path.join(SP, 'moshi_202610_sansu_orig_kaitou.html'), 'w', encoding='utf-8') as f:
    f.write(fill(KAITOU_HTML))
print('→ moshi_202610_sansu_orig.html / _kaitou.html')
