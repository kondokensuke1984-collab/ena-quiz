# 11/25（水）学力判定テストの範囲の算数模試・オリジナル問題版（A4印刷用）
# 範囲：多角形の角（tkk11）／円とおうぎ形（en11a・en11b）。基本問題5問＋練習問題5問・計10問・1問10点で100点。
# アプリの問題は使わず、同じ型の問題を新しく作る。答えはすべてスクリプトの中で計算（角は座標からも）して確かめる。
import json, os, math
from decimal import Decimal as D

SP = os.path.dirname(os.path.abspath(__file__))

TITLE = '11月 学力判定テストたいさく 算数模試（オリジナル）'
COLOR = '#be185d'
LIMIT_MIN = 30
PI = D('3.14')


def chk(cond):
    assert cond
    return True


def ang(o, a, b):
    """点oでの角aob（度）"""
    v1 = (a[0] - o[0], a[1] - o[1]); v2 = (b[0] - o[0], b[1] - o[1])
    c = (v1[0] * v2[0] + v1[1] * v2[1]) / (math.hypot(*v1) * math.hypot(*v2))
    return math.degrees(math.acos(max(-1, min(1, c))))


def near(x, y):
    return abs(x - y) < 1e-6


# ── 平面図形の図 ─────────────────────────────────────────────
def plane_svg(shapes, labels, scale=9, pad=30):
    """shapes: (点の列, 塗り, 線のかたち)  線 'solid'/'dash'/'none'/'open'（閉じない線）。y は上向き。
    labels: (x, y, 文字, dx, dy)"""
    pts = [p for s in shapes for p in s[0]] + [(l[0], l[1]) for l in labels]
    minx = min(p[0] for p in pts); maxx = max(p[0] for p in pts)
    miny = min(p[1] for p in pts); maxy = max(p[1] for p in pts)
    W = (maxx - minx) * scale + pad * 2
    H = (maxy - miny) * scale + pad * 2

    def S(p):
        return ((p[0] - minx) * scale + pad, (maxy - p[1]) * scale + pad)

    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" width="{W:.0f}" height="{H:.0f}">']
    for ps, fill, line in shapes:
        pp = ' '.join(f'{x:.1f},{y:.1f}' for x, y in map(S, ps))
        stroke = 'none' if line == 'none' else '#111'
        dash = ' stroke-dasharray="4 3"' if line == 'dash' else ''
        tag = 'polyline' if line == 'open' or (fill == 'none' and len(ps) == 2) else 'polygon'
        if tag == 'polyline':
            fill = 'none'
        out.append(f'<{tag} points="{pp}" fill="{fill}" stroke="{stroke}" stroke-width="1.3"{dash} stroke-linejoin="round"/>')
    for x, y, text, dx, dy in labels:
        sx, sy = S((x, y))
        out.append(f'<text x="{sx + dx:.1f}" y="{sy + dy:.1f}" font-size="12" text-anchor="middle" dominant-baseline="middle" '
                   f'font-family="Hiragino Sans, sans-serif" font-weight="700">{text}</text>')
    out.append('</svg>')
    return ''.join(out)


def arc(c, r, a0, a1, n=48):
    """中心c・半径r・角度a0→a1（度）の弧の点の列"""
    return [(c[0] + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             c[1] + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def mark(o, a, b, r=1.2):
    """点oの角aobに小さな弧のしるし"""
    t1 = math.degrees(math.atan2(a[1] - o[1], a[0] - o[0]))
    t2 = math.degrees(math.atan2(b[1] - o[1], b[0] - o[0]))
    if (t2 - t1) % 360 > 180:
        t1, t2 = t2, t1
    return (arc(o, r, t1, t1 + (t2 - t1) % 360, 16), 'none', 'open')


def fmt(x):
    s = format(D(x).normalize(), 'f')
    return s


# ── 大問1 基本問題 ────────────────────────────────────────────
Q1 = []

n = 11
chk(n * (n - 3) // 2 == 44)
Q1.append(dict(q='十一角形の対角線の本数は何本ですか。', answer='44本',
               explanation='1つの頂点からは、自分と両どなりをのぞく 11－3＝8（本）の対角線がひける。\n11×8＝88 だと1本を2回数えているので、88÷2＝44（本）'))

k = [m for m in range(3, 50) if 180 * (m - 2) == 156 * m]
chk(k == [15])
Q1.append(dict(q='1つの内角の大きさが156度の正多角形は、正何角形ですか。', answer='正十五角形',
               explanation='1つの外角は 180－156＝24（度）\n外角の和はいつも360度なので、360÷24＝15\n→ 正十五角形'))

B = (0, 0); C = (10, 0); E = (15, 0)
tb = math.radians(65); tc = math.radians(180 - 67)
# A は Bから65度、Cから(180-67)度の向きの直線の交点
t = 10 * math.sin(math.radians(67)) / math.sin(math.radians(48))
A = (t * math.cos(tb), t * math.sin(tb))
chk(near(ang(B, A, C), 65) and near(ang(A, B, C), 48) and near(ang(C, A, E), 113))
Q1.append(dict(q='図の角アの大きさは何度ですか。',
               svg=plane_svg([([A, B, C], '#f1f5f9', 'solid'), ([C, E], 'none', 'solid'),
                              mark(B, C, A), mark(A, B, C), mark(C, E, A)],
                             [(B[0], B[1], '65°', 30, -10), (A[0], A[1], '48°', 0, 26), (C[0], C[1], 'ア', 26, -14)], scale=13),
               answer='113度', explanation='三角形の1つの外角は、となりにない2つの内角の和に等しい。\n48＋65＝113（度）\n（別解：角Cの内角は 180－48－65＝67、ア＝180－67＝113）'))

r = D('31.4') / PI / 2
chk(r == 5 and r * r * PI == D('78.5'))
Q1.append(dict(q='円周率を3.14として答えなさい。\n円周の長さが31.4cmの円の面積は何cm²ですか。', answer='78.5cm²',
               explanation='直径＝円周÷3.14＝31.4÷3.14＝10（cm）→ 半径は5cm\n面積＝半径×半径×3.14＝5×5×3.14＝78.5（cm²）'))

l = 9 * 2 * PI * 80 / 360; s = 9 * 9 * PI * 80 / 360
chk(l == D('12.56') and s == D('56.52'))
Q1.append(dict(q='円周率を3.14として答えなさい。\n半径が9cmで、中心角が80度のおうぎ形の、弧の長さと面積をそれぞれ求めなさい。',
               answer='弧の長さ12.56cm、面積56.52cm²', wide=True,
               explanation='80/360＝2/9\n弧の長さ＝9×2×3.14×2/9＝4×3.14＝12.56（cm）\n面積＝9×9×3.14×2/9＝18×3.14＝56.52（cm²）'))


# ── 大問2 練習問題 ────────────────────────────────────────────
Q2 = []

P5 = [(6 * math.cos(math.radians(90 + 72 * i)), 6 * math.sin(math.radians(90 + 72 * i))) for i in range(5)]
pA, pB, pC, pD, pE = P5[0], P5[1], P5[2], P5[3], P5[4]   # 反時計回り：A上・B左上・C左下・D右下・E右上


def cross(p1, p2, p3, p4):
    d = (p2[0] - p1[0]) * (p4[1] - p3[1]) - (p2[1] - p1[1]) * (p4[0] - p3[0])
    u = ((p3[0] - p1[0]) * (p4[1] - p3[1]) - (p3[1] - p1[1]) * (p4[0] - p3[0])) / d
    return (p1[0] + u * (p2[0] - p1[0]), p1[1] + u * (p2[1] - p1[1]))


pP = cross(pA, pC, pB, pE)
chk(near(ang(pP, pB, pC), 72) and near(ang(pP, pA, pB), 108))
Q2.append(dict(q='図の五角形ABCDEは正五角形です。対角線ACとBEが交わる点をPとするとき、角アの大きさは何度ですか。',
               svg=plane_svg([(P5, '#f1f5f9', 'solid'), ([pA, pC], 'none', 'solid'), ([pB, pE], 'none', 'solid'), mark(pP, pB, pC, 1.0)],
                             [(pA[0], pA[1], 'A', 0, -10), (pB[0], pB[1], 'B', -10, 0), (pC[0], pC[1], 'C', -8, 10),
                              (pD[0], pD[1], 'D', 8, 10), (pE[0], pE[1], 'E', 10, 0), (pP[0], pP[1], 'P', 10, 13),
                              (pP[0], pP[1], 'ア', -24, 9)], scale=14),
               answer='72度', explanation='正五角形の1つの内角は 180×3÷5＝108（度）\n三角形ABCは BA＝BC の二等辺三角形なので、角BCA＝（180－108）÷2＝36（度）\n三角形ABEも AB＝AE の二等辺三角形なので、角ABE＝36（度）→ 角PBC＝108－36＝72（度）\n三角形PBCで、ア＝180－36－72＝72（度）'))

S_A = (0, 10); S_B = (0, 0); S_C = (10, 0); S_D = (10, 10)
S_E = (5, 5 * math.sqrt(3))
chk(near(ang(S_E, S_A, S_D), 150))
Q2.append(dict(q='図のように、正方形ABCDの中に、辺BCを1辺とする正三角形EBCをかきました。角アの大きさは何度ですか。',
               svg=plane_svg([([S_A, S_B, S_C, S_D], '#fff', 'solid'), ([S_B, S_C, S_E], '#f1f5f9', 'solid'),
                              ([S_A, S_E], 'none', 'solid'), ([S_D, S_E], 'none', 'solid'), mark(S_E, S_D, S_A, 1.1)],
                             [(0, 10, 'A', -10, -8), (0, 0, 'B', -10, 8), (10, 0, 'C', 10, 8), (10, 10, 'D', 10, -8),
                              (S_E[0], S_E[1], 'E', 0, 16), (S_E[0], S_E[1], 'ア', 0, -10)], scale=16),
               answer='150度', explanation='BA＝BC＝BE なので、三角形ABEは二等辺三角形。\n角ABE＝90－60＝30（度）→ 角BEA＝（180－30）÷2＝75（度）\n同じように 角CED＝75（度）\nEのまわりは360度なので、ア＝360－60－75－75＝150（度）'))

q = 6 * 6 * PI / 4
leaf = q * 2 - 36
chk(leaf == D('20.52'))
Lp = arc((0, 0), 6, 0, 90) + arc((6, 6), 6, 180, 270)[1:-1]
Q2.append(dict(q='図は、1辺6cmの正方形の中に、半径6cmの四分円を2つかいたものです。色のついた部分の面積は何cm²ですか。円周率は3.14とします。',
               svg=plane_svg([([(0, 0), (6, 0), (6, 6), (0, 6)], '#fff', 'solid'), (Lp, '#cbd5e1', 'solid')],
                             [(3, 0, '6cm', 0, 12), (0, 3, '6cm', -18, 0)], scale=22),
               answer='20.52cm²', explanation='四分円2つを重ねると、色の部分が2回数えられ、正方形全体より 色の部分の分だけ大きくなる。\n四分円1つ：6×6×3.14÷4＝28.26（cm²）\n色の部分＝28.26×2－6×6＝56.52－36＝20.52（cm²）'))

from fractions import Fraction as F
ctr = F('7.85') / (6 * 2 * F('3.14')) * 360
area_s = D(6 * 6 * F('3.14') * ctr / 360 * 100 // 1) / 100
chk(6 * 6 * F('3.14') * ctr / 360 == F('23.55'))
chk(ctr == 75 and area_s == D('23.55') and D('7.85') * 6 / 2 == area_s)
Q2.append(dict(q='円周率を3.14として答えなさい。\n半径6cmのおうぎ形があり、弧の長さは7.85cmです。このおうぎ形の中心角は何度ですか。また、面積は何cm²ですか。',
               answer='中心角75度、面積23.55cm²', wide=True,
               explanation='半径6cmの円の円周は 6×2×3.14＝37.68（cm）\n7.85÷37.68＝5/24 なので、中心角は 360×5/24＝75（度）\n面積＝6×6×3.14×5/24＝23.55（cm²）\n（別解：おうぎ形の面積＝弧の長さ×半径÷2＝7.85×6÷2＝23.55）'))

w = 10 * 10 * PI / 4 / 10
chk(w == D('7.85'))
wf = float(w)
th = math.degrees(math.acos(wf / 10))
ARC = arc((0, 0), 10, 0, 90)
regA = [(wf, 0)] + arc((0, 0), 10, 0, th)
regI = arc((0, 0), 10, th, 90) + [(wf, 10)]
chk(near(math.hypot(wf, 10 * math.sin(math.radians(th))), 10))
Q2.append(dict(q='図は、点Aを中心とする半径10cm、中心角90度のおうぎ形と、長方形ABCDを組み合わせたものです。アとイの部分の面積が等しいとき、辺ADの長さ□は何cmですか。円周率は3.14とします。',
               svg=plane_svg([(regA, '#cbd5e1', 'none'), (regI, '#e2e8f0', 'none'),
                              ([(0, 0), (wf, 0), (wf, 10), (0, 10)], 'none', 'solid'), ([(0, 0)] + ARC, 'none', 'solid')],
                             [(0, 0, 'A', -10, 8), (0, 10, 'B', -10, -6), (wf, 10, 'C', 4, -10), (wf, 0, 'D', -6, 12),
                              (8.8, 1.6, 'ア', 0, 0), (6.2, 9.2, 'イ', 0, 0), (0, 5, '10cm', -20, 0), (wf / 2, 0, '□cm', 0, 14)], scale=16),
               answer='7.85cm', explanation='アとイの面積が等しいので、それぞれに「重なっている部分」を加えると、\nおうぎ形の面積＝長方形の面積 になる。\nおうぎ形：10×10×3.14÷4＝78.5（cm²）\n長方形：10×□＝78.5 → □＝7.85（cm）'))

Q2.append(Q2.pop(3))  # 図のない問題を最後に（横長のわくにする）
exam = [{'title': '基本問題（多角形の角・円とおうぎ形）', 'qs': Q1}, {'title': '練習問題（多角形の角・円とおうぎ形）', 'qs': Q2}]
total = sum(len(s['qs']) for s in exam)
assert total == 10, total
POINT = 100 // total
print(f'合計{total}問（図{sum(1 for s in exam for q in s["qs"] if q.get("svg"))}問）・1問{POINT}点')
for s in exam:
    for q in s['qs']:
        print(' ', s['title'][:4], q['answer'])

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
  .cover h1{ font-size:19pt; letter-spacing:.03em; margin-bottom:4mm; }
  .cover .sub{ font-size:11pt; color:#555; margin-bottom:18mm; }
  .cover table{ border-collapse:collapse; font-size:12pt; margin-bottom:14mm; }
  .cover td{ border:0.3mm solid #999; padding:3mm 8mm; }
  .cover td.label{ background:#f2f2f2; font-weight:700; text-align:center; }
  .cover .score{ font-size:16pt; }
  .cover .note{ font-size:10pt; color:#555; border-top:.3mm solid #ccc; padding-top:4mm; margin-top:4mm; width:150mm; line-height:1.7; }

  .cat-head{ break-after:avoid; color:#fff; padding:2.5mm 5mm; border-radius:1.5mm; margin-bottom:5mm; }
  .cat-head h2{ font-size:15pt; }

  .grid2{ display:grid; grid-template-columns:1fr 1fr; column-gap:6mm; row-gap:3mm; margin-bottom:2mm; }
  .qb{ break-inside:avoid; border:.3mm solid #bbb; border-radius:1.5mm; padding:2.5mm 3mm; display:flex; flex-direction:column; }
  .qb .num{ font-weight:800; font-size:11pt; }
  .qb .qtext{ font-size:10pt; line-height:1.6; white-space:pre-line; margin:1mm 0 2mm; }
  .qb .imgs{ display:flex; justify-content:center; margin:1mm 0 2mm; }
  .qb .imgs svg{ max-width:100%; max-height:34mm; height:auto; }
  .qb .work{ flex:1; min-height:14mm; border-top:.2mm dashed #ccc; font-size:7.5pt; color:#aaa; padding-top:.5mm; }
  .qb.noimg .work{ min-height:30mm; }
  .qb.full{ grid-column:1 / -1; }
  .qb.full .work{ min-height:12mm; }
  .qb.full.fig{ display:grid; grid-template-columns:1fr auto; column-gap:4mm; }
  .qb.full.fig .num,.qb.full.fig .qtext,.qb.full.fig .work,.qb.full.fig .ans{ grid-column:1; }
  .qb.full.fig .imgs{ grid-column:2; grid-row:1 / 5; align-self:center; }
  .qb.full.fig .imgs svg{ max-height:40mm; }
  .qb .ans{ display:flex; justify-content:flex-end; align-items:center; gap:2mm; font-size:10pt; font-weight:700; margin-top:1.5mm; }
  .qb .ans span.box{ display:inline-block; width:38mm; height:9mm; border:.4mm solid #333; }
  .qb .ans span.box.wide{ width:68mm; }
</style>
</head>
<body>
<section class="page cover">
  <h1>%%TITLE%%</h1>
  <div class="sub">ena ANRINO　11/25（水）学力判定テストの範囲：多角形の角・円とおうぎ形</div>
  <table>
    <tr><td class="label">名前</td><td style="width:60mm;">&nbsp;</td><td class="label">日付</td><td style="width:36mm;">&nbsp;</td></tr>
    <tr><td class="label">時間</td><td>%%LIMIT%%分</td><td class="label">得点</td><td class="score">　　　／100</td></tr>
  </table>
  <div class="note">
    ・全部で%%TOTAL%%問、1問%%POINT%%点、100点満点です。<br>
    ・大問1は基本問題、大問2は練習問題レベルで、それぞれ5問ずつです。<br>
    ・式や考え方は、それぞれのわくの中の空いているところに書きましょう。<br>
    ・答えは□の中に書きましょう。単位（度・本・cm・cm²など）もわすれずに。<br>
    ・円周率は3.14として計算しましょう。
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
  html += '<div class="work">式・考え方</div><div class="ans">答え <span class="box' + (q.wide ? ' wide' : '') + '"></span></div>';
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
  sec.qs.forEach((q, i) => { const el = renderQ(q, ++n); if (sec.qs.length % 2 && i === sec.qs.length - 1) { el.classList.add('full'); if (q.svg) el.classList.add('fig'); } grid.appendChild(el); });
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
  <div class="info">1問%%POINT%%点・100点満点／目安時間%%LIMIT%%分。単位がないものは、その場で直させてから正解にしてください。2つ答える問題は、両方合って正解です。</div>
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
            .replace('%%POINT%%', str(POINT)))


with open(os.path.join(SP, 'moshi_202611_sansu_orig.html'), 'w', encoding='utf-8') as f:
    f.write(fill(EXAM_HTML))
with open(os.path.join(SP, 'moshi_202611_sansu_orig_kaitou.html'), 'w', encoding='utf-8') as f:
    f.write(fill(KAITOU_HTML))
print('→ moshi_202611_sansu_orig.html / _kaitou.html')
