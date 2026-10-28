# 10/30（金）学力判定テストの範囲の算数模試・オリジナル問題版（A4印刷用）
# 範囲：日々の学習10月（大きな数・計算・素因数分解）／面積／立方体と直方体／割合の表し方／推理。各4問・計20問・1問5点で100点。
# アプリの問題は使わず、同じ型の問題を新しく作る。答えはすべてスクリプトの中で計算・総当たりで確かめる（推理は答えが1通りだけか）。
# 立体の図は build_moshi_202610_sansu_orig2.py と同じ見取図、平面の図は plane_svg で描く。
import json, os, math
from fractions import Fraction as F

SP = os.path.dirname(os.path.abspath(__file__))

TITLE = '10月 学力判定テストたいさく 算数模試（オリジナル）'
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


def chk(cond):
    assert cond
    return True


# ── 平面図形の図 ─────────────────────────────────────────────
def plane_svg(shapes, labels, scale=9, pad=30):
    """shapes: (点の列, 塗り, 線のかたち)  線のかたち 'solid'/'dash'/'none'。y は上向き。
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
        tag = 'polyline' if fill == 'none' and len(ps) == 2 else 'polygon'
        out.append(f'<{tag} points="{pp}" fill="{fill}" stroke="{stroke}" stroke-width="1.3"{dash} stroke-linejoin="round"/>')
    for x, y, text, dx, dy in labels:
        sx, sy = S((x, y))
        out.append(f'<text x="{sx + dx:.1f}" y="{sy + dy:.1f}" font-size="12" text-anchor="middle" dominant-baseline="middle" '
                   f'font-family="Hiragino Sans, sans-serif" font-weight="700">{text}</text>')
    out.append('</svg>')
    return ''.join(out)


def rect(x0, y0, x1, y1):
    return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]


KANJI = '〇一二三四五六七八九'


def kansuji(n):
    """算用数字 → 漢数字（億・万の位まで）"""
    def under10000(m):
        s = ''
        for v, u in ((1000, '千'), (100, '百'), (10, '十')):
            k = m // v
            if k:
                s += ('' if k == 1 else KANJI[k]) + u
            m %= v
        return s + (KANJI[m] if m else '')
    s = ''
    for v, u in ((10 ** 8, '億'), (10 ** 4, '万'), (1, '')):
        k = n // v
        if k:
            s += under10000(k) + u
        n %= v
    return s


# ── 大問1 計算と数（日々の学習10月）─────────────────────────────
Q1 = []

n1 = 5060 * 10 ** 8 + 400 * 10 ** 4 + 8
chk(n1 == 506004000008 and kansuji(n1) == '五千六十億四百万八')
Q1.append(dict(q='漢数字を算用数字に変えなさい。\n五千六十億四百万八', answer='506004000008',
               explanation='億・万で区切って考える。\n5060億＝5060 0000 0000、400万＝400 0000、8\n→ 5060｜0400｜0008 ＝ 506004000008\n（「0」の入る位に注意。全部で12けた）'))

n2 = 30070500900
chk(kansuji(n2) == '三百億七千五十万九百')
Q1.append(dict(q='算用数字を漢数字に変えなさい。\n30070500900', answer='三百億七千五十万九百', wide=True,
               explanation='右から4けたずつ区切る。\n300｜7050｜0900\n→ 300億・7050万・900\n＝三百億七千五十万九百'))

chk(608 * 75 == 45600)
Q1.append(dict(q='次の計算をしなさい。\n608 × 75', answer='45600',
               explanation='608×5＝3040、608×70＝42560\n3040＋42560＝45600'))

chk(2 * 2 * 3 * 3 * 7 == 252)
Q1.append(dict(q='252を素因数分解しなさい。', answer='2×2×3×3×7',
               explanation='252÷2＝126、126÷2＝63、63÷3＝21、21÷3＝7\n→ 252＝2×2×3×3×7（小さい順に書く）'))


# ── 大問2 面積 ────────────────────────────────────────────
Q2 = []

trap = [(0, 0), (14, 0), (10, 9), (4, 9)]
chk(area(trap) == 90)
Q2.append(dict(q='図の台形の面積は何cm²ですか。',
               svg=plane_svg([(trap, '#f1f5f9', 'solid'), ([(4, 9), (4, 0)], 'none', 'dash')],
                             [(7, 9, '6cm', 0, -10), (7, 0, '14cm', 0, 12), (4, 4.5, '9cm', 15, 0)], scale=10),
               answer='90cm²', explanation='台形の面積＝（上底＋下底）×高さ÷2\n（6＋14）×9÷2＝90（cm²）'))

chk(16 * 16 // 2 == 128)
Q2.append(dict(q='対角線の長さが16cmの正方形の面積は何cm²ですか。', answer='128cm²',
               explanation='正方形はひし形の仲間なので、対角線×対角線÷2 で求められる。\n16×16÷2＝128（cm²）'))

chk(F('2.5') * 10000 == 25000)
Q2.append(dict(q='次の面積を（　）の中の単位で答えなさい。\n2.5ha（m²）', answer='25000m²',
               explanation='1ha＝100m×100m＝10000m²\n2.5×10000＝25000（m²）\n（1a＝100m²、1ha＝100a もいっしょにおぼえよう）'))

field = rect(0, 0, 24, 15)
road_v = rect(9, 0, 11, 15)
road_h = rect(0, 6, 24, 8)
rest = 24 * 15 - (2 * 15 + 2 * 24 - 2 * 2)
chk(rest == 286 and (24 - 2) * (15 - 2) == 286)
Q2.append(dict(q='たて15m、横24mの長方形の土地に、図のように はば2mの道を、たてと横に1本ずつ通しました。道をのぞいた土地（白い部分）の面積は何m²ですか。',
               svg=plane_svg([(field, '#fff', 'solid'), (road_v, '#cbd5e1', 'none'), (road_h, '#cbd5e1', 'none'), (field, 'none', 'solid')],
                             [(12, 0, '24m', 0, 12), (0, 7.5, '15m', -18, 0), (10, 15, '2m', 0, -10), (24, 7, '2m', 15, 0)], scale=7),
               answer='286m²', explanation='道を土地のはしによせて考えると、白い部分は1つの長方形になる。\nたて 15－2＝13（m）、横 24－2＝22（m）\n13×22＝286（m²）\n（別解：24×15＝360、道は 2×15＋2×24－2×2＝74、360－74＝286）'))


# ── 大問3 立方体と直方体 ──────────────────────────────────────
Q3 = []

poly, d = box(8, 5, 6)
sa = 2 * area(poly) + perimeter(poly) * d
chk(sa == 236)
Q3.append(dict(q='図の直方体の表面積は何cm²ですか。',
               svg=prism_svg(poly, d, [(4, 0, 0, '8cm', 0, 12), (0, 2.5, 0, '5cm', -18, 0), (8, 0, 3, '6cm', 22, 6)]),
               answer='236cm²', explanation='3種類の面が2つずつある。\n8×5＝40、8×6＝48、5×6＝30\n（40＋48＋30）×2＝236（cm²）'))

side = 5
chk(6 * side * side == 150 and side ** 3 == 125)
Q3.append(dict(q='表面積が150cm²の立方体があります。この立方体の体積は何cm³ですか。', answer='125cm³',
               explanation='立方体の面は6つで、どれも同じ正方形。\n1つの面は 150÷6＝25（cm²）→ 5×5＝25 なので1辺は5cm\n体積は 5×5×5＝125（cm³）'))

poly = [(0, 0), (10, 0), (10, 5), (6, 5), (6, 8), (0, 8)]; d = 7
chk(area(poly) == 68 and area(poly) * d == 476)
Q3.append(dict(q='図は、2つの直方体を組み合わせた立体です。この立体の体積は何cm³ですか。',
               svg=prism_svg(poly, d, [(5, 0, 0, '10cm', 0, 12), (3, 8, 0, '6cm', 0, -10), (0, 4, 0, '8cm', -18, 0),
                                       (10, 2.5, 0, '5cm', -16, 0), (10, 0, 3.5, '7cm', 22, 6)], scale=12),
               answer='476cm³', explanation='前の面を2つの長方形に分ける。\n左：6×8＝48、右：（10－6）×5＝20 → 前の面は 68（cm²）\n奥行き7cmなので 68×7＝476（cm³）\n（別解：大きい直方体 10×8×7＝560 から、かけた部分 4×3×7＝84 をひいて 476）'))

chk(9000 % (20 * 30) == 0 and 9000 // (20 * 30) == 15)
Q3.append(dict(q='内のりが、たて20cm・横30cm・深さ25cmの直方体の水そうに、9Lの水を入れました。水の深さは何cmになりますか。', answer='15cm',
               explanation='9L＝9000cm³\n底面積は 20×30＝600（cm²）\n深さ＝9000÷600＝15（cm）'))


# ── 大問4 割合の表し方 ──────────────────────────────────────
Q4 = []

chk(54 / F('0.75') == 72)
Q4.append(dict(q='次の□にあてはまる数を求めなさい。\n□mの0.75倍は54m', answer='72（m）',
               explanation='もとにする量＝くらべる量÷割合\n54÷0.75＝72（m）'))

chk(F(42, 56) == F(3, 4))
Q4.append(dict(q='次の□にあてはまる数を求めなさい。（分数で答えなさい）\n42kgは56kgの□倍', answer='3/4（倍）',
               explanation='AはBの A÷B 倍。\n42÷56＝42/56＝3/4'))

chk(280 / F('1.6') == 175)
Q4.append(dict(q='りんご1この重さは、みかん1この重さの1.6倍で、280gです。みかん1この重さは何gですか。', answer='175g',
               explanation='もとにする量（みかん）＝280÷1.6＝175（g）\n（たしかめ：175×1.6＝280）'))

_M = 450 / ((1 - F(3, 8)) * (1 - F(2, 5)))
chk(_M == 1200 and _M * F(3, 8) == 450 and (_M - 450) * F(2, 5) == 300)
Q4.append(dict(q='はじめの所持金の 3/8 で本を買い、残りの 2/5 でペンを買ったところ、450円残りました。はじめの所持金は何円でしたか。', answer='1200円',
               explanation='本を買った残りは、はじめの 1－3/8＝5/8\nペンを買った残りは、その 1－2/5＝3/5 なので、はじめの 5/8×3/5＝3/8\nはじめの 3/8 が450円 → 450÷3/8＝1200（円）\n（たしかめ：本450円、残り750円の2/5でペン300円、残り450円）'))


# ── 大問5 推理 ────────────────────────────────────────────
Q5 = []
from itertools import permutations, product

s = [p for p in permutations(range(1, 6)) if p[0] + p[1] == p[2] and p[3] - p[4] == p[0] and p[1] > p[3]]
chk(s == [(1, 4, 5, 3, 2)])
Q5.append(dict(q='A、B、C、D、Eは、1から5までのどれかの整数を表していて、ことなる文字はことなる整数を表しています。次の①〜③が分かっているとき、A、B、C、D、Eはそれぞれいくつですか。\n① A＋B＝C\n② D－E＝A\n③ BはDより大きい',
               answer='A＝1、B＝4、C＝5、D＝3、E＝2', wide=True,
               explanation='①より CはAやBより大きい。②より DはAやEより大きい。\n③より B＞D なので、C＞B＞D＞A、E となる。\nよって C＝5、B＝4、D＝3。\n①より A＝5－4＝1、のこりの E＝2。\n（たしかめ：②3－2＝1＝A）'))

names = ['あおい', 'かいと', 'さくら', 'だいち']
s = [p for p in permutations(range(1, 5)) if p[0] != 1 and p[1] < p[2] and p[2] != 4 and p[3] == p[0] + 1]
chk(s == [(3, 1, 2, 4)])
Q5.append(dict(q='あおい、かいと、さくら、だいちの4人がかけっこをしました。同じ順位の人はいません。\nあおい「わたしは1位ではなかったよ。」\nかいと「ぼくは、さくらさんより先にゴールしたよ。」\nさくら「わたしは4位ではなかったよ。」\nだいち「ぼくは、あおいさんのすぐ後にゴールしたよ。」\n4人の順位をそれぞれ答えなさい。',
               answer='かいと…1位、さくら…2位、あおい…3位、だいち…4位', wide=True,
               explanation='だいちは あおいのすぐ後で、あおいは1位ではないので\n（あおい、だいち）＝（2位、3位）か（3位、4位）。\n・2位・3位のとき：かいと・さくらが1位・4位。かいとが先なので さくら4位 → さくらの話に合わない。\n・3位・4位のとき：かいと・さくらが1位・2位。かいとが先なので かいと1位、さくら2位。'))

teams = 'ABCD'
games = [(i, j) for i in range(4) for j in range(i + 1, 4)]
ok = []
for res in product([0, 1], repeat=6):
    win = [0] * 4
    beat = set()
    for (i, j), r in zip(games, res):
        w, l = (i, j) if r == 0 else (j, i)
        win[w] += 1; beat.add((w, l))
    if win[0] == 2 and (1, 0) in beat and win[2] == 0 and win[3] == 1:
        ok.append(win[1])
chk(ok == [3])
Q5.append(dict(q='A、B、C、Dの4チームで、サッカーのリーグ戦（どのチームとも1回ずつ試合をする）をしました。引き分けはありませんでした。\n① Aチームは2勝1敗だった。\n② BチームはAチームに勝った。\n③ Cチームは1回も勝てなかった。\n④ Dチームは1勝だけだった。\nBチームは何勝何敗でしたか。',
               answer='3勝0敗',
               explanation='試合は全部で6試合。Aは Bに負けて2勝なので、CとDに勝った。\nCは全敗なので、B・Dにも負けた → DはCに勝って1勝。\nDは1勝だけなので、Bとの試合は負け → BはDに勝った。\nBは A・C・Dに勝って 3勝0敗。'))

L = 'ABCDE'
s = []
for p in permutations(range(5)):  # p[i]＝重さの順位（0が一番重い）
    A, B, C, D, E = p
    if min((A, 'A'), (B, 'B'), (C, 'C'))[1] == 'C' and max((A, 'A'), (B, 'B'), (C, 'C'))[1] == 'B' \
            and B < D and E > B and E != 4:
        s.append(''.join(sorted(L, key=lambda c: p[L.index(c)])))
chk(s == ['CABED'])
Q5.append(dict(q='A、B、C、D、Eの5つの荷物の重さをくらべたところ、次の①〜③が分かりました。同じ重さのものはありません。\n① A、B、Cの中で、一番重いのはC、一番軽いのはBである。\n② BはDより重い。\n③ EはBより軽いが、5つの中で一番軽くはない。\n重い順に記号でならべなさい。',
               answer='C、A、B、E、D', wide=True,
               explanation='①より C＞A＞B。②より B＞D。③より B＞E。\nDとEはどちらもBより軽く、Eは一番軽くないので E＞D。\nよって C、A、B、E、D の順。'))

exam = [{'title': '計算と数（日々の学習）', 'qs': Q1}, {'title': '面積', 'qs': Q2},
        {'title': '立方体と直方体', 'qs': Q3}, {'title': '割合の表し方', 'qs': Q4}, {'title': '推理', 'qs': Q5}]
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
  .cover h1{ font-size:19pt; letter-spacing:.03em; margin-bottom:4mm; }
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
  .qb .ans span.box.wide{ width:68mm; }
</style>
</head>
<body>
<section class="page cover">
  <h1>%%TITLE%%</h1>
  <div class="sub">ena ANRINO　10/30（金）学力判定テストの範囲：計算と数・面積・立方体と直方体・割合の表し方・推理</div>
  <table>
    <tr><td class="label">名前</td><td style="width:60mm;">&nbsp;</td><td class="label">日付</td><td style="width:36mm;">&nbsp;</td></tr>
    <tr><td class="label">時間</td><td>%%LIMIT%%分</td><td class="label">得点</td><td class="score">　　　／100</td></tr>
  </table>
  <div class="note">
    ・全部で%%TOTAL%%問、1問%%POINT%%点、100点満点です。<br>
    ・大問1〜5、それぞれ4問ずつです。<br>
    ・式や考え方は、それぞれのわくの中の空いているところに書きましょう。<br>
    ・答えは□の中に書きましょう。単位（cm²・m²・cm³・gなど）もわすれずに。<br>
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
            .replace('%%POINT%%', str(POINT)))


with open(os.path.join(SP, 'moshi_202610_gakuryoku_orig.html'), 'w', encoding='utf-8') as f:
    f.write(fill(EXAM_HTML))
with open(os.path.join(SP, 'moshi_202610_gakuryoku_orig_kaitou.html'), 'w', encoding='utf-8') as f:
    f.write(fill(KAITOU_HTML))
print('→ moshi_202610_gakuryoku_orig.html / _kaitou.html')
