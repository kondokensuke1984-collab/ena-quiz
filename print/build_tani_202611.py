# 11/25 学力判定テスト対策：日々の学習11月「単位の変換」（オリジナル）の問題・解答 HTML を作る
# 日々の学習11月はアプリに無いので、10月の No.5〜8「（ ）の単位で表しなさい」と同じ型で作る。
# 11月は計算プリント No.5〜10 の 1.③ が面積の単位（cm²・m²・a・ha・km²）なので、面積を多めにする。
# 答えはここで Decimal で計算して確かめる。
from decimal import Decimal as D
import os, re

DIR = os.path.dirname(os.path.abspath(__file__))

# 基準の単位にしたときの大きさ
U = {
    # 長さ（m）
    'mm': ('len', D('0.001')), 'cm': ('len', D('0.01')), 'm': ('len', D(1)), 'km': ('len', D(1000)),
    # 面積（m²）
    'cm²': ('area', D('0.0001')), 'm²': ('area', D(1)), 'a': ('area', D(100)), 'ha': ('area', D(10000)), 'km²': ('area', D(1000000)),
    # かさ（L）
    'mL': ('vol', D('0.001')), 'dL': ('vol', D('0.1')), 'L': ('vol', D(1)),
    # 重さ（g）
    'g': ('w', D(1)), 'kg': ('w', D(1000)), 't': ('w', D(1000000)),
    # 時間（秒）
    '秒': ('t', D(1)), '分': ('t', D(60)), '時間': ('t', D(3600)), '日': ('t', D(86400)),
}
UNIT_RE = '|'.join(sorted(map(re.escape, U), key=len, reverse=True))


def parse(s):
    """'2時間15分' や '6m5cm' を (種類, 基準の量) にする"""
    kind, total = None, D(0)
    for num, unit in re.findall(rf'([\d.]+)({UNIT_RE})', s):
        k, f = U[unit]
        assert kind in (None, k), s
        kind = k
        total += D(num) * f
    assert re.sub(rf'[\d.]+({UNIT_RE})', '', s) == '', s
    return kind, total


def fmt(x):
    s = format(x.normalize(), 'f')
    if '.' in s:
        s = s.rstrip('0').rstrip('.')
    ip, _, dp = s.partition('.')
    ip = f'{int(ip):,}'
    return ip + ('.' + dp if dp else '')


def conv(src, to):
    kind, base = parse(src)
    k2, f = U[to]
    assert kind == k2, (src, to)
    return base / f


# (問題, 答えの単位, 考え方)
AREA = [
    ('1m²', 'cm²', '1m×1m＝100cm×100cm＝10000cm²'),
    ('3m²', 'cm²', '1m²＝10000cm² なので 3×10000'),
    ('0.5m²', 'cm²', '0.5×10000'),
    ('2.4m²', 'cm²', '2.4×10000'),
    ('20000cm²', 'm²', '20000÷10000'),
    ('5000cm²', 'm²', '5000÷10000'),
    ('800cm²', 'm²', '800÷10000（小数点を左に4つ）'),
    ('2m²500cm²', 'cm²', '20000＋500'),
    ('1a', 'm²', '1a は 1辺10m の正方形。10×10'),
    ('7a', 'm²', '1a＝100m² なので 7×100'),
    ('0.3a', 'm²', '0.3×100'),
    ('450m²', 'a', '450÷100'),
    ('1ha', 'm²', '1ha は 1辺100m の正方形。100×100'),
    ('1ha', 'a', '10000m²÷100m²'),
    ('2.5ha', 'a', '1ha＝100a なので 2.5×100'),
    ('600a', 'ha', '600÷100'),
    ('30000m²', 'ha', '30000÷10000'),
    ('5000m²', 'ha', '5000÷10000'),
    ('0.06ha', 'm²', '0.06×10000'),
    ('1km²', 'm²', '1000m×1000m'),
    ('1km²', 'ha', '1辺1000m の中に 1辺100m が 10×10＝100こ'),
    ('0.4km²', 'ha', '1km²＝100ha なので 0.4×100'),
    ('3km²', 'a', '1km²＝100ha＝10000a なので 3×10000'),
    ('250ha', 'km²', '250÷100'),
]
OTHER = [
    ('0.7L', 'dL', '1L＝10dL'),
    ('350mL', 'L', '1L＝1000mL なので 350÷1000'),
    ('2.3L', 'mL', '2.3×1000'),
    ('4dL', 'mL', '1dL＝100mL'),
    ('6m5cm', 'm', '5cm＝0.05m（0.5m ではない）'),
    ('0.08km', 'm', '0.08×1000'),
    ('3500m', 'km', '3500÷1000'),
    ('45mm', 'cm', '1cm＝10mm なので 45÷10'),
    ('0.6kg', 'g', '0.6×1000'),
    ('750g', 'kg', '750÷1000'),
    ('2.4t', 'kg', '1t＝1000kg'),
    ('3日', '時間', '1日＝24時間 なので 3×24'),
    ('1.5時間', '分', '1時間＝60分 なので 1.5×60'),
    ('4分', '秒', '4×60'),
    ('180分', '時間', '180÷60'),
    ('2時間15分', '分', '120＋15'),
]

SECTIONS = [
    ('1', '面積の単位', '（ ）の単位で表しなさい。', AREA),
    ('2', 'いろいろな単位', '（ ）の単位で表しなさい。', OTHER),
]

# 答えを計算（手で決めた値と突き合わせて、まちがいがないか確かめる）
EXPECT = ['10000', '30000', '5000', '24000', '2', '0.5', '0.08', '20500', '100', '700', '30', '4.5',
          '10000', '100', '250', '6', '3', '0.5', '600', '1000000', '100', '40', '30000', '2.5',
          '7', '0.35', '2300', '400', '6.05', '80', '3.5', '4.5', '600', '0.75', '2400', '72', '90', '240', '3', '135']
got = [fmt(conv(s, u)).replace(',', '') for _, _, _, items in SECTIONS for s, u, _ in items]
assert got == EXPECT, list(zip(got, EXPECT))


def show_src(s):
    # 2m²500cm² → 2m² 500cm²（読みやすく）
    return re.sub(rf'({UNIT_RE})(?=\d)', r'\1 ', s)


CSS = '''
@page { size: A4; margin: 12mm 13mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', sans-serif; color: #1f2937; }
.page { page-break-after: always; }
.page:last-child { page-break-after: auto; }
.head { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #be185d; padding-bottom: 5px; margin-bottom: 8px; }
.head h1 { font-size: 19px; color: #be185d; }
.head .sub { font-size: 11px; color: #6b7280; margin-top: 2px; }
.namebox { font-size: 12px; display: flex; gap: 10px; }
.namebox span { border-bottom: 1px solid #374151; padding: 0 4px; min-width: 120px; display: inline-block; }
.score { border: 1.5px solid #374151; border-radius: 6px; padding: 3px 10px; font-size: 12px; }
.sec { margin-top: 8px; }
.sec h2 { font-size: 14px; background: #fce7f3; color: #9d174d; padding: 4px 8px; border-radius: 4px; }
.sec h2 small { font-weight: normal; color: #374151; margin-left: 8px; font-size: 12px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 18px; margin-top: 4px; }
.q { display: flex; align-items: center; font-size: 15px; height: 36px; border-bottom: 1px dotted #d1d5db; }
.q .n { width: 30px; color: #be185d; font-weight: bold; font-size: 13px; }
.q .src { width: 138px; white-space: nowrap; font-size: 14.5px; }
.q .box { flex: 1; height: 25px; border: 1.3px solid #6b7280; border-radius: 4px; margin-right: 6px; }
.q .unit { width: 36px; font-size: 14px; }
.ans .box { border: none; color: #b91c1c; font-weight: bold; text-align: right; padding-right: 8px; line-height: 25px; }
.ans .q { height: 31px; }
.ans .box { flex: 0 0 82px; height: 21px; line-height: 21px; }
.ans .how { flex: 1; font-size: 9.5px; color: #6b7280; line-height: 1.25; }
.tip { margin-top: 10px; border: 2px solid #f9a8d4; border-radius: 8px; padding: 8px 12px; font-size: 12.5px; line-height: 1.7; }
.tip b { color: #be185d; }
table.kaidan { border-collapse: collapse; margin: 6px 0; font-size: 12.5px; }
table.kaidan td, table.kaidan th { border: 1px solid #9ca3af; padding: 3px 9px; text-align: center; }
table.kaidan th { background: #fdf2f8; }
.foot { font-size: 10.5px; color: #6b7280; margin-top: 8px; }
'''

TIP = '''
<div class="tip">
<b>面積の単位のかいだん</b>（1辺の長さが10倍 → 広さは10×10＝100倍）
<table class="kaidan">
<tr><th>単位</th><td>cm²</td><td>m²</td><td>a（アール）</td><td>ha（ヘクタール）</td><td>km²</td></tr>
<tr><th>1辺の長さ</th><td>1cm</td><td>1m</td><td>10m</td><td>100m</td><td>1km（1000m）</td></tr>
<tr><th>となりとの関係</th><td colspan="2">1m²＝<b>10000</b>cm²（100じゃない！）</td><td>1a＝100m²</td><td>1ha＝100a</td><td>1km²＝100ha</td></tr>
</table>
<b>そのほか</b>　1km＝1000m　1m＝100cm　1cm＝10mm　／　1L＝10dL＝1000mL　1dL＝100mL　／　1t＝1000kg　1kg＝1000g　／　1日＝24時間　1時間＝60分　1分＝60秒
</div>'''


def page(answer):
    title = '単位の変換（日々の学習11月 たいさく）' + ('　解答' if answer else '')
    out = [f'<div class="page {"ans" if answer else ""}">',
           f'<div class="head"><div><h1>📏 {title}</h1><div class="sub">11/25 学力判定テスト たいさく｜日々の学習11月と同じ型のオリジナル問題（全40問）</div></div>',
           '<div class="namebox">月　　日　名前<span></span></div>' if not answer else '<div class="score">1問 2.5点</div>',
           '</div>']
    n = 0
    for sid, name, lead, items in SECTIONS:
        out.append(f'<div class="sec"><h2>{sid}　{name}<small>{lead}</small></h2><div class="grid">')
        half = (len(items) + 1) // 2
        order = [items[i] for i in range(half)] + [items[i] for i in range(half, len(items))]
        cells = []
        for i, (s, u, how) in enumerate(order):
            n += 1
            ans = fmt(conv(s, u)) if answer else ''
            how_html = f'<div class="how">{how}</div>' if answer else ''
            cells.append(f'<div class="q"><span class="n">{n}</span><span class="src">{show_src(s)}（{u}）</span>'
                         f'<span class="box">{ans}</span><span class="unit">{u}</span>{how_html}</div>')
        # 2列：左に前半、右に後半（たて読み）
        left, right = cells[:half], cells[half:]
        for i in range(half):
            out.append(left[i])
            out.append(right[i] if i < len(right) else '<div></div>')
        out.append('</div></div>')
    if answer:
        out.append(TIP)
    else:
        out.append('<div class="foot">★ 答えは数字だけ書けばよい（単位は右に書いてあります）。わからないときは、1辺の長さの正方形を思いうかべよう。</div>')
    out.append('</div>')
    return '\n'.join(out)


for answer, name in ((False, 'tani_202611.html'), (True, 'tani_202611_kaitou.html')):
    html = f'<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>単位の変換</title><style>{CSS}</style></head><body>{page(answer)}</body></html>'
    open(os.path.join(DIR, name), 'w').write(html)
    print('→', name)
print('答えの検算 OK（40問）')
