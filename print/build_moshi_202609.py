# data/questions_202609.json + data/subjects_202609.json から
# 9月模試（A4印刷用）を作る。ランダム性なし・何回動かしても同じ結果。
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = os.path.dirname(os.path.abspath(__file__))

questions = json.load(open(os.path.join(ROOT, 'data/questions_202609.json'), encoding='utf-8'))
subjects = json.load(open(os.path.join(ROOT, 'data/subjects_202609.json'), encoding='utf-8'))

CAT_LABEL = {'shakai': '社会', 'rika': '理科', 'kokugo': '国語', 'sansu': '算数'}
CAT_COLOR = {'shakai': '#1d4ed8', 'rika': '#065f46', 'kokugo': '#3730a3', 'sansu': '#be185d'}
CAT_ORDER = ['rika', 'shakai', 'kokugo', 'sansu']

# (subject_id, 採用数, うち画像つき数) — カテゴリごとにこの順で並べる
SELECTION = {
    'rika': [
        ('tsuki1_kihon', 3, 0), ('tsuki1_renshu', 2, 0), ('tsuki1_renshu2', 3, 2), ('tsuki1_kakomon', 2, 1),
        ('tsuki2_kihon', 3, 0), ('tsuki2_renshu', 4, 2), ('tsuki2_kakomon', 3, 2),
    ],
    'shakai': [
        ('nougyou1_kihon', 4, 1), ('nougyou1_renshu', 3, 1), ('nougyou1_kakomon', 3, 0),
        ('nougyou2_kihon', 4, 1), ('nougyou2_renshu', 3, 1), ('nougyou2_kakomon', 2, 1),
    ],
    'kokugo': [
        ('meishi9_kihon', 6, 0), ('meishi9_hojuu', 2, 0),
        ('doushi9_kihon', 4, 0), ('doushi9_hojuu', 4, 0),
    ],
    'sansu': [
        ('yakusu9_kihon', 3, 0), ('yakusu9_renshu', 3, 0),
        ('baisu9_kihon', 3, 0), ('baisu9_renshu', 4, 0),
        ('shobun9_kihon', 4, 0), ('shobun9_renshu', 3, 0),
    ],
}

by_subject = {}
for q in questions:
    by_subject.setdefault(q['subject'], []).append(q)


def select(subject_id, n, k_img):
    items = by_subject.get(subject_id, [])
    has_img = lambda q: bool(q.get('qImage') or q.get('qImage2'))
    image_items = [q for q in items if has_img(q)]
    text_items = [q for q in items if not has_img(q)]
    chosen = image_items[:k_img] + text_items[:n - k_img]
    chosen_ids = {q['id'] for q in chosen}
    return [q for q in items if q['id'] in chosen_ids]  # 元の並び順に戻す


def clean_question(q):
    """模試用に整形したコピーを返す（元のqは変更しない）"""
    out = dict(q)
    text = out['q']
    if '\n' in text:
        _, rest = text.split('\n', 1)
        out['q'] = rest
    for k in ('qImage', 'qImage2'):
        if out.get(k, '').startswith('/images/'):
            out[k] = '../images/' + out[k][len('/images/'):]
    return out


exam_by_cat = {}
for cat in CAT_ORDER:
    picked = []
    for subject_id, n, k_img in SELECTION[cat]:
        picked.extend(select(subject_id, n, k_img))
    exam_by_cat[cat] = [clean_question(q) for q in picked]

total = sum(len(v) for v in exam_by_cat.values())
total_img = sum(1 for v in exam_by_cat.values() for q in v if q.get('qImage'))
print(f'選定: 合計{total}問（画像{total_img}問）')
for cat in CAT_ORDER:
    print(f'  {CAT_LABEL[cat]}: {len(exam_by_cat[cat])}問')

EXAM_JSON = json.dumps(exam_by_cat, ensure_ascii=False)

# ── 模試本体 ──────────────────────────────────────────────
EXAM_HTML = '''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>ena 9月 模試</title>
<style>
  :root{ --cat-shakai:#1d4ed8; --cat-rika:#065f46; --cat-kokugo:#3730a3; --cat-sansu:#be185d; }
  @page { size: A4 portrait; margin: 0; }
  *{ margin:0; padding:0; box-sizing:border-box; }
  html,body{ width:210mm; }
  body{
    font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;
    color:#111; -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  section.page{ padding:14mm 14mm 12mm; min-height:297mm; box-sizing:border-box; break-after:page; }
  section.page:last-child{ break-after:auto; }

  /* 表紙 */
  .cover{ display:flex; flex-direction:column; align-items:center; padding-top:40mm; }
  .cover h1{ font-size:28pt; letter-spacing:.05em; margin-bottom:4mm; }
  .cover .sub{ font-size:11pt; color:#555; margin-bottom:20mm; }
  .cover table{ border-collapse:collapse; font-size:12pt; margin-bottom:16mm; }
  .cover td{ border:0.3mm solid #999; padding:3mm 8mm; }
  .cover td.label{ background:#f2f2f2; font-weight:700; text-align:center; }
  .cover .note{ font-size:9.5pt; color:#777; border-top:.3mm solid #ccc; padding-top:4mm; margin-top:6mm; width:140mm; text-align:center; }

  /* 大問見出し */
  .cat-head{ color:#fff; padding:2.5mm 5mm; border-radius:1.5mm; margin-bottom:6mm; }
  .cat-head h2{ font-size:15pt; }

  .qb{ break-inside:avoid; margin-bottom:6mm; padding-bottom:4mm; border-bottom:.2mm dotted #ccc; }
  .qb .num{ font-weight:800; font-size:11pt; }
  .qb .qtext{ font-size:10.5pt; line-height:1.6; white-space:pre-line; margin:1.5mm 0 2.5mm; }
  .qb .imgs{ display:flex; gap:4mm; justify-content:center; margin:2mm 0; }
  .qb .imgs img{ max-width:65mm; max-height:55mm; border:.2mm solid #ddd; }
  .qb .opts{ display:flex; flex-wrap:wrap; gap:2.5mm 6mm; font-size:10pt; margin-bottom:2mm; }
  .qb .ans-box{ font-size:10pt; color:#333; }
  .qb .line{ border-bottom:.3mm solid #999; height:7mm; margin-top:1mm; }
</style>
</head>
<body>
<section class="page cover">
  <h1>9月 模試</h1>
  <div class="sub">ena ANRINO 9月の学習内容から出題</div>
  <table>
    <tr><td class="label">名前</td><td style="width:60mm;">&nbsp;</td><td class="label">組</td><td style="width:30mm;">&nbsp;</td></tr>
    <tr><td class="label">日付</td><td colspan="3">&nbsp;</td></tr>
  </table>
  <div class="note">英語（えいご）は9月は単元テストの対象外です。社会・理科・国語・算数の4教科から出題しています。</div>
</section>
<div id="cats"></div>
<script>
const EXAM = %%EXAM_JSON%%;
const CAT_LABEL = %%CAT_LABEL%%;
const CAT_COLOR = %%CAT_COLOR%%;
const CAT_ORDER = %%CAT_ORDER%%;

function renderQ(q, n) {
  const d = document.createElement('div');
  d.className = 'qb';
  let html = `<div class="num">問${n}</div><div class="qtext"></div>`;
  if (q.qImage || q.qImage2) {
    html += '<div class="imgs">';
    if (q.qImage) html += `<img src="${q.qImage}">`;
    if (q.qImage2) html += `<img src="${q.qImage2}">`;
    html += '</div>';
  }
  const type = q.type || 'choice';
  if (type === 'choice') {
    html += '<div class="opts">' + q.options.map(o => `<span>${o}</span>`).join('') + '</div>';
    html += '<div class="ans-box">答え（　　　　）</div>';
  } else if (type === 'selfjudge') {
    html += '<div class="line"></div><div class="line"></div>';
  } else {
    html += '<div class="line"></div>';
  }
  d.innerHTML = html;
  d.querySelector('.qtext').textContent = q.q;
  return d;
}

let daimon = 0;
for (const cat of CAT_ORDER) {
  daimon++;
  const page = document.createElement('section');
  page.className = 'page';
  const head = document.createElement('div');
  head.className = 'cat-head';
  head.style.background = CAT_COLOR[cat];
  head.innerHTML = `<h2>大問${daimon}　${CAT_LABEL[cat]}</h2>`;
  page.appendChild(head);
  EXAM[cat].forEach((q, i) => page.appendChild(renderQ(q, i + 1)));
  document.getElementById('cats').appendChild(page);
}
</script>
</body>
</html>
'''

EXAM_HTML = (EXAM_HTML
             .replace('%%EXAM_JSON%%', EXAM_JSON)
             .replace('%%CAT_LABEL%%', json.dumps(CAT_LABEL, ensure_ascii=False))
             .replace('%%CAT_COLOR%%', json.dumps(CAT_COLOR, ensure_ascii=False))
             .replace('%%CAT_ORDER%%', json.dumps(CAT_ORDER, ensure_ascii=False)))

with open(os.path.join(SP, 'moshi_202609.html'), 'w', encoding='utf-8') as f:
    f.write(EXAM_HTML)

# ── 解答・解説 ──────────────────────────────────────────────
KAITOU_HTML = '''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>ena 9月 模試 解答・解説（指導者用）</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  *{ margin:0; padding:0; box-sizing:border-box; }
  html,body{ width:210mm; }
  body{
    padding:10mm 12mm;
    font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;
    color:#111; -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  header{ border-bottom:1.2mm solid #111; padding-bottom:2mm; margin-bottom:4mm; }
  h1{ font-size:15pt; }
  h1 .warn{ font-size:9.5pt; color:#c00; font-weight:700; margin-left:3mm; }
  .sheet{ column-count:2; column-gap:8mm; }
  .region h2{ font-size:9.5pt; font-weight:800; color:#fff; padding:.6mm 2.5mm; margin:2mm 0 1.5mm; border-radius:.8mm; break-after:avoid; }
  .region:first-child h2{ margin-top:0; }
  .item{ break-inside:avoid; padding-bottom:1mm; margin-bottom:1mm; border-bottom:.2mm dotted #ddd; font-size:8.6pt; line-height:1.35; }
  .item .n{ font-weight:800; }
  .item .ans{ font-weight:700; color:#111; }
  .item .exp{ color:#666; white-space:pre-line; }
</style>
</head>
<body>
<header><h1>9月 模試　解答・解説<span class="warn">※指導者用（生徒に配布しないこと）</span></h1></header>
<div class="sheet" id="sheet"></div>
<script>
const EXAM = %%EXAM_JSON%%;
const CAT_LABEL = %%CAT_LABEL%%;
const CAT_COLOR = %%CAT_COLOR%%;
const CAT_ORDER = %%CAT_ORDER%%;

const sheet = document.getElementById('sheet');
let daimon = 0;
for (const cat of CAT_ORDER) {
  daimon++;
  const sec = document.createElement('section');
  sec.className = 'region';
  const h = document.createElement('h2');
  h.textContent = `大問${daimon}　${CAT_LABEL[cat]}`;
  h.style.background = CAT_COLOR[cat];
  sec.appendChild(h);
  EXAM[cat].forEach((q, i) => {
    const type = q.type || 'choice';
    let ansText;
    if (type === 'choice') {
      const idx = q.answer;
      ansText = `${idx + 1}番：${q.options[idx]}`;
    } else {
      ansText = q.answer;
    }
    const d = document.createElement('div');
    d.className = 'item';
    d.innerHTML = `<span class="n"></span> <span class="ans"></span><div class="exp"></div>`;
    d.querySelector('.n').textContent = `問${i + 1}`;
    d.querySelector('.ans').textContent = ansText;
    d.querySelector('.exp').textContent = q.explanation || '';
    sec.appendChild(d);
  });
  sheet.appendChild(sec);
}
</script>
</body>
</html>
'''

KAITOU_HTML = (KAITOU_HTML
               .replace('%%EXAM_JSON%%', EXAM_JSON)
               .replace('%%CAT_LABEL%%', json.dumps(CAT_LABEL, ensure_ascii=False))
               .replace('%%CAT_COLOR%%', json.dumps(CAT_COLOR, ensure_ascii=False))
               .replace('%%CAT_ORDER%%', json.dumps(CAT_ORDER, ensure_ascii=False)))

with open(os.path.join(SP, 'moshi_202609_kaitou.html'), 'w', encoding='utf-8') as f:
    f.write(KAITOU_HTML)

# ── 検算 ──────────────────────────────────────────────
by_type = {}
missing_images = []
for cat in CAT_ORDER:
    for q in exam_by_cat[cat]:
        t = q.get('type', 'choice')
        by_type[t] = by_type.get(t, 0) + 1
        for k in ('qImage', 'qImage2'):
            if q.get(k):
                p = os.path.join(SP, q[k])
                if not os.path.exists(p):
                    missing_images.append(q[k])
print('type内訳:', by_type)
print('画像の欠け:', missing_images or 'なし')
