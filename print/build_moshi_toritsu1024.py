# 都立中チャレンジ（10/24）もし：アプリの もし専用問題（data/moshi_toritsu1024_t1/_t2.json）から
# A4印刷用の 問題（moshi_toritsu1024.html）と 解答（moshi_toritsu1024_kaitou.html）を作る。
# 問題の じゅんばんは ファイルの とおり（アプリでは まぜて出るが、紙は 固定）。
# PDF は build_pdf_moshi_toritsu1024.sh
import json, os, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = os.path.dirname(os.path.abspath(__file__))

def load(name):
    return json.load(open(os.path.join(ROOT, 'data', name), encoding='utf-8'))['questions']

T1, T2 = load('moshi_toritsu1024_t1.json'), load('moshi_toritsu1024_t2.json')
# 配点（めやす・各100点）
POINTS = {'trm1_01': 10, 'trm1_02': 15, 'trm1_03': 10, 'trm1_04': 20, 'trm1_05': 30, 'trm1_06': 15,
          'trm2_01': 15, 'trm2_02': 15, 'trm2_03': 15, 'trm2_04': 15, 'trm2_05': 15, 'trm2_06': 25}
assert sum(POINTS[q['id']] for q in T1) == 100 and sum(POINTS[q['id']] for q in T2) == 100
# 答えの書き方：('grid', 列, 行) マス目／('lines', 本数)／('box',) 選択・数字
ANS = {'trm1_02': ('grid', 20, 2), 'trm1_04': ('lines', 6), 'trm1_05': ('grid', 20, 11), 'trm1_06': ('lines', 4),
       'trm2_06': ('lines', 16)}

e = lambda s: html.escape(s)

def split(q):
    """q を 見出し（適性Ⅰ-1）・本文・問題に わける"""
    head, rest = q['q'].split('\n', 1)
    passage = None
    if '【文章】' in rest and '【問題】' in rest:
        pre, after = rest.split('【文章】', 1)
        passage, prob = after.split('【問題】', 1)
        rest = prob
    rest = rest.replace('（ノートに書いてから答えを見て丸つけしよう）', '')
    return head, passage, rest.replace('【問題】', '').strip()

def grid(cols, rows):
    cells = ''.join('<i></i>' for _ in range(cols * rows))
    return f'<div class="grid" style="grid-template-columns:repeat({cols},7.6mm)">{cells}</div>'

def answer_area(q):
    kind = ANS.get(q['id'])
    if kind and kind[0] == 'grid':
        return grid(kind[1], kind[2]) + f'<div class="cnt">（{kind[1]}字×{kind[2]}行）</div>'
    if kind and kind[0] == 'lines':
        return '<div class="line"></div>' * kind[1]
    if q.get('type') == 'input':
        return '<div class="ansbox">答え（　　　　　　　　　　）</div>'
    return '<div class="ansbox">答え（　　　　）</div>'

def render_q(q, n):
    head, _, prob = split(q)
    out = [f'<div class="qb"><div class="num">問{n}<span class="pt">（{POINTS[q["id"]]}点）</span></div>',
           f'<div class="qtext">{e(prob)}</div>']
    if q.get('qImage'):
        out.append(f'<div class="img"><img src="..{e(q["qImage"])}"></div>')
    if q.get('options'):
        out.append('<div class="opts">' + ''.join(f'<div>{e(o)}</div>' for o in q['options']) + '</div>')
    out.append(answer_area(q) + '</div>')
    return ''.join(out)

def passage_block(qs):
    for q in qs:
        _, p, _ = split(q)
        if p:
            paras = [x for x in p.replace('①', '\n①').replace('②', '\n②').replace('③', '\n③').replace('④', '\n④').replace('⑤', '\n⑤').split('\n') if x.strip()]
            return '<div class="passage"><div class="ph">【文章】</div>' + ''.join(f'<p>{e(x)}</p>' for x in paras) + '</div>'
    return ''

CSS = '''
@page { size: A4 portrait; margin: 0; }
*{ margin:0; padding:0; box-sizing:border-box; }
html,body{ width:210mm; }
body{ font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif; color:#111;
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }
section.page{ padding:13mm 15mm 12mm; break-after:page; }
section.page:last-child{ break-after:auto; }
.cover{ display:flex; flex-direction:column; align-items:center; padding-top:34mm; min-height:297mm; }
.cover h1{ font-size:26pt; letter-spacing:.04em; margin-bottom:3mm; }
.cover .sub{ font-size:11pt; color:#555; margin-bottom:16mm; }
.cover table{ border-collapse:collapse; font-size:12pt; margin-bottom:12mm; }
.cover td{ border:.3mm solid #999; padding:3mm 7mm; }
.cover td.label{ background:#f2f2f2; font-weight:700; text-align:center; }
.cover ul{ font-size:10.5pt; line-height:1.9; width:150mm; list-style:none; }
.cover ul li::before{ content:'・'; }
.head{ color:#fff; padding:2.5mm 5mm; border-radius:1.5mm; margin-bottom:5mm; display:flex; justify-content:space-between; align-items:baseline; }
.head h2{ font-size:15pt; }
.head span{ font-size:10.5pt; font-weight:700; }
.passage{ border:.35mm solid #555; border-radius:1.5mm; padding:4mm 5mm; margin-bottom:6mm; font-size:10.5pt; line-height:1.85; }
.passage .ph{ font-weight:800; margin-bottom:1mm; }
.passage p{ text-indent:0; margin-bottom:1mm; }
.qb{ break-inside:avoid; margin-bottom:6mm; padding-bottom:4mm; border-bottom:.2mm dotted #bbb; }
.qb .num{ font-weight:800; font-size:11.5pt; }
.qb .pt{ font-weight:400; font-size:9pt; color:#555; margin-left:2mm; }
.qb .qtext{ font-size:10.5pt; line-height:1.7; white-space:pre-line; margin:1.5mm 0 2.5mm; }
.qb .img{ text-align:center; margin:2mm 0 3mm; }
.qb .img img{ max-width:150mm; max-height:62mm; }
.qb .opts{ font-size:10.2pt; line-height:1.65; margin:0 0 2.5mm 3mm; }
.qb .ansbox{ font-size:10.5pt; text-align:right; margin-top:2mm; }
.qb .line{ border-bottom:.3mm solid #999; height:8.5mm; }
.grid{ display:grid; border-top:.3mm solid #777; border-left:.3mm solid #777; width:max-content; margin:1mm auto 0; }
.grid i{ width:7.6mm; height:7.6mm; border-right:.3mm solid #777; border-bottom:.3mm solid #777; }
.grid i:nth-child(10n){ border-right-color:#333; }
.cnt{ font-size:8.5pt; color:#666; text-align:right; margin-top:1mm; }
'''

def exam_page(title, color, qs, minutes):
    body = [f'<section class="page"><div class="head" style="background:{color}"><h2>{title}</h2><span>{minutes}分・100点</span></div>']
    body.append(passage_block(qs))
    body += [render_q(q, i + 1) for i, q in enumerate(qs)]
    body.append('</section>')
    return ''.join(body)

EXAM = f'''<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>都立中チャレンジ もし</title><style>{CSS}</style></head><body>
<section class="page cover">
  <h1>都立中チャレンジ もし</h1>
  <div class="sub">10/24 都立中チャレンジテスト たいさく（適性検査Ⅰ・Ⅱ）</div>
  <table>
    <tr><td class="label">名前</td><td style="width:62mm">&nbsp;</td></tr>
    <tr><td class="label">日付</td><td>&nbsp;</td></tr>
    <tr><td class="label">適性Ⅰ</td><td style="text-align:right">／100点</td></tr>
    <tr><td class="label">適性Ⅱ</td><td style="text-align:right">／100点</td></tr>
  </table>
  <ul>
    <li>適性検査Ⅰ（読解・作文）45分、適性検査Ⅱ（思考力）45分です。本番と同じように時間をはかってときましょう。</li>
    <li>記述は、問題の字数を守り、文の終わりまで書きましょう。マス目は1マスに1字（句読点も1マス）。</li>
    <li>適性Ⅱは、答えだけでなく、式や考え方も書くと点になります。</li>
  </ul>
</section>
{exam_page('適性検査Ⅰ　読解・作文', '#7c3aed', T1, 45)}
{exam_page('適性検査Ⅱ　思考力', '#0e7490', T2, 45)}
</body></html>'''

def kaitou_items(qs):
    out = []
    for i, q in enumerate(qs):
        ans = f'{"アイウエ"[q["answer"]]}' if q.get('options') else q['answer']
        out.append(f'<div class="item"><div><b>問{i + 1}</b><span class="pt">（{POINTS[q["id"]]}点）</span> '
                   f'<b class="ans">{e(ans)}</b></div><div class="exp">{e(q.get("explanation", ""))}</div></div>')
    return ''.join(out)

KCSS = '''
@page { size: A4 portrait; margin: 0; }
*{ margin:0; padding:0; box-sizing:border-box; }
html,body{ width:210mm; }
body{ padding:11mm 13mm; font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif; color:#111;
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }
header{ border-bottom:1mm solid #111; padding-bottom:2mm; margin-bottom:4mm; }
h1{ font-size:15pt; } h1 .warn{ font-size:9.5pt; color:#c00; margin-left:3mm; }
h2{ font-size:11pt; color:#fff; padding:1mm 3mm; border-radius:1mm; margin:4mm 0 2mm; break-after:avoid; }
.item{ break-inside:avoid; border-bottom:.2mm dotted #ccc; padding:1.5mm 0 2mm; font-size:9.3pt; line-height:1.55; }
.item .pt{ color:#666; font-size:8.5pt; margin-left:1mm; }
.item .ans{ white-space:pre-line; display:block; margin-top:.5mm; }
.item .exp{ color:#444; white-space:pre-line; margin-top:1mm; }
.rule{ font-size:9pt; color:#444; margin-bottom:2mm; }
'''

KAITOU = f'''<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>都立中チャレンジ もし 解答</title><style>{KCSS}</style></head><body>
<header><h1>都立中チャレンジ もし　解答・解説<span class="warn">※おうちの人用</span></h1></header>
<div class="rule">記述は【丸つけの目安】で部分点をつけてください（半分＝配点の半分）。配点はめやすです。</div>
<h2 style="background:#7c3aed">適性検査Ⅰ　読解・作文</h2>{kaitou_items(T1)}
<h2 style="background:#0e7490">適性検査Ⅱ　思考力</h2>{kaitou_items(T2)}
</body></html>'''

open(os.path.join(SP, 'moshi_toritsu1024.html'), 'w', encoding='utf-8').write(EXAM)
open(os.path.join(SP, 'moshi_toritsu1024_kaitou.html'), 'w', encoding='utf-8').write(KAITOU)
miss = [q['qImage'] for q in T1 + T2 if q.get('qImage') and not os.path.exists(os.path.join(ROOT, q['qImage'].lstrip('/')))]
print(f'適性Ⅰ {len(T1)}問・適性Ⅱ {len(T2)}問・画像の欠け:', miss or 'なし')
