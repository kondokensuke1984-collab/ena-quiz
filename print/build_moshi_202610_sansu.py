# data/questions_202610.json から
# 10/26 4科演習の範囲（立方体と直方体・割合の表し方）の算数模試（A4印刷用）を作る。
# 20問・1問5点で100点。ランダム性なし・何回動かしても同じ結果。
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = os.path.dirname(os.path.abspath(__file__))

questions = json.load(open(os.path.join(ROOT, 'data/questions_202610.json'), encoding='utf-8'))

TITLE = '10月 4科演習たいさく 算数模試'
COLOR = '#be185d'
LIMIT_MIN = 40

# (subject_id, 単元内の何問目か[0始まり]) — この順で並べる
# 同じ図の「体積」「表面積」は片方だけ（例外：練習2-2 は□を求めてから表面積なので2問続けて入れる）。
# 割合の基本2・練習2 は 基本1・練習1 の数字ちがいなので、同じ形の問題は片方だけ。
SECTIONS = [
    ('立方体と直方体', [
        ('chokuho10_kihon', [2, 5, 6, 9]),      # 直方体の体積・表面積、立方体／直方体から取りのぞいた立体
        ('chokuho10_renshu', [0, 7, 8, 9]),     # 組み合わせた立体の体積、□を求める→表面積、表面積→体積
        ('chokuho10_kakomon', [0, 2]),          # 工学院（x を求める）、実践学園（切り取った立体の表面積）
    ]),
    ('割合の表し方', [
        ('wariai10_kihon', [3, 7, 11, 15]),     # 何倍（分数）、□の0.75倍、もとにする量、欠席→全体
        ('wariai10_renshu', [9, 12, 13, 15]),   # □人の5/7、姉のカード、所持金、本の全ページ
        ('wariai10_kakomon', [2, 4]),           # 浦和実業（パン）、日本工大駒場（男子の人数）
    ]),
]

# 元の図の下のはしに、別の文字の切れはしが写っているもの → 印刷では下を何%かくす
CROP_BOTTOM = {'ckt10_33': 6}

by_subject = {}
for q in questions:
    by_subject.setdefault(q['subject'], []).append(q)


def clean_question(q):
    """模試用に整形したコピーを返す（元のqは変更しない）"""
    out = dict(q)
    if '\n' in out['q']:
        head, rest = out['q'].split('\n', 1)
        out['q'] = rest
        # 過去問は学校名を残す（「（2015 工学院中）」）
        if '（' in head and '中）' in head:
            out['src'] = head[head.index('（'):]
    for k in ('qImage', 'qImage2'):
        if out.get(k, '').startswith('/images/'):
            out[k] = '../images/' + out[k][len('/images/'):]
    if out['id'] in CROP_BOTTOM:
        out['cropBottom'] = CROP_BOTTOM[out['id']]
    return out


exam = []
for title, parts in SECTIONS:
    qs = []
    for subject_id, idxs in parts:
        items = by_subject.get(subject_id, [])
        qs.extend(clean_question(items[i]) for i in idxs)
    exam.append({'title': title, 'qs': qs})

_ids = [q['id'] for s in exam for q in s['qs']]
assert len(_ids) == len(set(_ids)), '同じ問題が2回入っている'
total = len(_ids)
assert total == 20, f'20問になっていない: {total}'
POINT = 100 // total
total_img = sum(1 for s in exam for q in s['qs'] if q.get('qImage'))
print(f'選定: 合計{total}問（画像{total_img}問）・1問{POINT}点')
for s in exam:
    print(f"  {s['title']}: {len(s['qs'])}問", [q['id'] for q in s['qs']])

EXAM_JSON = json.dumps(exam, ensure_ascii=False)

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
  /* 表紙のあとだけ改ページ。大問2は大問1のすぐ後ろから続ける（大問1の最後のページが半分空くため） */
  section.page.cover{ break-after:page; }
  section.daimon + section.daimon{ margin-top:2mm; }

  .cover{ display:flex; flex-direction:column; align-items:center; padding-top:30mm; }
  .cover h1{ font-size:26pt; letter-spacing:.05em; margin-bottom:4mm; }
  .cover .sub{ font-size:11pt; color:#555; margin-bottom:18mm; }
  .cover table{ border-collapse:collapse; font-size:12pt; margin-bottom:14mm; }
  .cover td{ border:0.3mm solid #999; padding:3mm 8mm; }
  .cover td.label{ background:#f2f2f2; font-weight:700; text-align:center; }
  .cover .score{ font-size:16pt; }
  .cover .note{ font-size:10pt; color:#555; border-top:.3mm solid #ccc; padding-top:4mm; margin-top:4mm; width:150mm; line-height:1.7; }

  .cat-head{ break-after:avoid; color:#fff; padding:2.5mm 5mm; border-radius:1.5mm; margin-bottom:5mm; }
  .cat-head h2{ font-size:15pt; }

  /* 2段組。1問ずつ、問題・図・計算スペース・答えの欄をまとめてページをまたがない */
  .grid2{ display:grid; grid-template-columns:1fr 1fr; column-gap:6mm; row-gap:4mm; margin-bottom:4mm; }
  .qb{ break-inside:avoid; border:.3mm solid #bbb; border-radius:1.5mm; padding:2.5mm 3mm; display:flex; flex-direction:column; }
  .qb .num{ font-weight:800; font-size:11pt; }
  .qb .num small{ font-weight:400; font-size:8pt; color:#666; margin-left:1.5mm; }
  .qb .qtext{ font-size:10pt; line-height:1.6; white-space:pre-line; margin:1mm 0 2mm; }
  .qb .imgs{ display:flex; justify-content:center; margin:1mm 0 2mm; }
  .qb .imgs img{ max-width:100%; max-height:52mm; }
  .qb .work{ flex:1; min-height:30mm; border-top:.2mm dashed #ccc; font-size:7.5pt; color:#aaa; padding-top:.5mm; }
  .qb.noimg .work{ min-height:22mm; }
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
  d.className = q.qImage ? 'qb' : 'qb noimg';
  let html = `<div class="num">問${n}<small></small></div><div class="qtext"></div>`;
  if (q.qImage) {
    const crop = q.cropBottom ? ` style="clip-path:inset(0 0 ${q.cropBottom}% 0);margin-bottom:-${q.cropBottom * 0.5}mm"` : '';
    html += `<div class="imgs"><img src="${q.qImage}"${crop}></div>`;
  }
  html += '<div class="work">式・考え方</div><div class="ans">答え <span class="box"></span></div>';
  d.innerHTML = html;
  d.querySelector('.qtext').textContent = q.q;
  d.querySelector('.num small').textContent = q.src || '';
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
  .item .ans{ font-weight:800; color:#be185d; }
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


with open(os.path.join(SP, 'moshi_202610_sansu.html'), 'w', encoding='utf-8') as f:
    f.write(fill(EXAM_HTML))
with open(os.path.join(SP, 'moshi_202610_sansu_kaitou.html'), 'w', encoding='utf-8') as f:
    f.write(fill(KAITOU_HTML))

# ── 検算 ──────────────────────────────────────────────
by_type = {}
missing = []
for s in exam:
    for q in s['qs']:
        by_type[q.get('type', 'choice')] = by_type.get(q.get('type', 'choice'), 0) + 1
        for k in ('qImage', 'qImage2'):
            if q.get(k) and not os.path.exists(os.path.join(SP, q[k])):
                missing.append(q[k])
print('type内訳:', by_type)
print('画像の欠け:', missing or 'なし')
