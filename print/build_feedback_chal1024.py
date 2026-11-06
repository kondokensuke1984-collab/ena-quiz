# 10/24 適性Ⅱ（もしの しま）の成績表フィードバック → moshi_chal1024_feedback.html
# 個人の成績なので GitHub には送らない（.gitignore 済み）。元データは chal1024_feedback.json
import json, os, html, re
SP = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(SP)
F = json.load(open(os.path.join(SP, 'chal1024_feedback.json'), encoding='utf-8'))
Q = json.load(open(os.path.join(ROOT, 'data', 'moshi_chal1024.json'), encoding='utf-8'))['questions']
e = html.escape
def mark(sc, pt):
    r = sc / pt
    return '◎' if r == 1 else ('○' if r >= .6 else ('△' if r > 0 else '×'))
rows1 = ''.join(f'<tr><td>{a}</td><td class="l">{b}</td><td>{c}</td><td>{d}</td><td>{m}</td><td>{n}</td><td>{g}</td></tr>' for a,b,c,d,m,n,g in F['t1'])
sumrows = ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td><td>{e(f1)}</td><td>{e(f2)}</td></tr>' for a,b,c,d,f1,f2 in F['summary'])
items = []; weak = []
for i, q in enumerate(Q):
    what, pt, sc, avg, dev, g = F['t2'][q['id']]
    m = re.search(r'【10/24の 答案では】(.*)', q.get('explanation', ''), re.S)
    note = m.group(1).strip() if m else ''
    if sc < pt: weak.append(f'問{i+1}（{sc}/{pt}点）')
    cls = 'bad' if sc / pt < .5 else ('mid' if sc < pt else 'ok')
    items.append(f'<div class="it {cls}"><div class="h"><span><b>問{i+1}</b>　{e(what)}</span><span class="sc">{mark(sc,pt)} {sc}/{pt}点　平均{avg}　偏差値{dev}　評価{g}</span></div>'
                 + (f'<div class="n">{e(note)}</div>' if note and sc < pt else '<div class="n">満点でした。この調子！</div>') + '</div>')
safe = ''.join(f'<tr><td>{i+1}</td><td class="l">{a}</td><td>{b}</td><td>あと{c}点</td></tr>' for i,(a,b,c) in enumerate(F['safe']))
CSS = '''@page{size:A4 portrait;margin:0}*{margin:0;padding:0;box-sizing:border-box}
body{width:210mm;padding:11mm 13mm;font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN',sans-serif;color:#111;font-size:9.5pt;line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1{font-size:15pt;border-bottom:1mm solid #111;padding-bottom:2mm;margin-bottom:3mm}h1 span{font-size:9.5pt;color:#555;margin-left:3mm;font-weight:400}
h2{font-size:11pt;color:#fff;background:#0e7490;padding:1mm 3mm;border-radius:1mm;margin:4mm 0 2mm;break-after:avoid}
table{border-collapse:collapse;width:100%;font-size:9pt;margin-bottom:1mm}td,th{border:.2mm solid #999;padding:.8mm 2mm;text-align:center}th{background:#eee}td.l{text-align:left}
.it{break-inside:avoid;border:.25mm solid #bbb;border-left:1.6mm solid #16a34a;border-radius:1mm;padding:1.5mm 3mm;margin-bottom:2mm}.it.mid{border-left-color:#f59e0b}.it.bad{border-left-color:#dc2626}
.it .h{display:flex;justify-content:space-between;font-size:10pt}.it .sc{font-size:9pt;color:#444}.it .n{margin-top:.8mm;white-space:pre-line;color:#333}
.box{border:.3mm solid #0e7490;border-radius:1mm;padding:2mm 3mm;margin-top:2mm}'''
doc = f'''<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>適性Ⅱ フィードバック</title><style>{CSS}</style></head><body>
<h1>10/24 小4チャレンジテスト フィードバック<span>成績表と もしの しまの 問題を つないだもの</span></h1>
<h2>成績</h2>
<table><tr><th>科目</th><th>得点</th><th>平均点</th><th>偏差値</th><th>総合順位</th><th>男女別順位</th></tr>{sumrows}</table>
<div class="box"><b>つぎに のばす ところ（適Ⅱ）：</b>{'、'.join(weak) if weak else 'なし'}<br>とくに 問4（資料から 読み取れる ことを 書く）は 0点。「グラフを 使って 説明」を ねらって れんしゅうしよう。</div>
<h2>適性Ⅱ 設問別（もしの しまの 問題と 同じ ばんごう）</h2>{''.join(items)}
<h2>適性Ⅰ 設問別</h2>
<table><tr><th>問</th><th>出題内容</th><th>配点</th><th>得点</th><th>平均点</th><th>偏差値</th><th>評価</th></tr>{rows1}</table>
<h2>志望校の 安全圏まで</h2>
<table><tr><th>志望</th><th>学校</th><th>合格率80%ライン</th><th>あと何点</th></tr>{safe}</table>
<div class="box"><b>判定評価：</b>{e(F['judge'])}</div>
</body></html>'''
open(os.path.join(SP, 'moshi_chal1024_feedback.html'), 'w', encoding='utf-8').write(doc)
