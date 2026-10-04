# data/questions_202609.json + data/subjects_202609.json から
# 9月模試・国語算数版（A4印刷用）を作る。各教科25問。ランダム性なし・何回動かしても同じ結果。
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = os.path.dirname(os.path.abspath(__file__))

questions = json.load(open(os.path.join(ROOT, 'data/questions_202609.json'), encoding='utf-8'))
subjects = json.load(open(os.path.join(ROOT, 'data/subjects_202609.json'), encoding='utf-8'))

CAT_LABEL = {'shakai': '社会', 'rika': '理科', 'kokugo': '国語', 'sansu': '算数'}
CAT_COLOR = {'shakai': '#1d4ed8', 'rika': '#065f46', 'kokugo': '#3730a3', 'sansu': '#be185d'}
CAT_ORDER = ['kokugo', 'sansu']

# (subject_id, 単元内の何問目か[0始まり]) — カテゴリごとにこの順で並べる
# 前回の9月模試（moshi_202609.html・4教科版）で使った問題は入れない（下で検査）。
# 国語は 文法14問（前回の残り）＋ 読解の基本問題11問。読解は本文画像を問題の前に載せる。
# 読解の過去問・解き方は入れない（本文が長く、ページが増えるため）。
# 同じ図形・同じ数の言いかえ問題（例：75cm×120cm の2問）は片方だけにする。
SELECTION = {
    'kokugo': [
        ('meishi9_kihon', [6, 7]), ('meishi9_hojuu', [2, 3, 4, 5]),
        ('doushi9_kihon', [4, 5, 6]), ('doushi9_hojuu', [4, 5, 6, 7, 8]),
        ('meishi9_dokkai', [0, 1, 2, 3, 4, 5, 6]),
        ('doushi9_dokkai', [0, 1, 2, 3]),
    ],
    'sansu': [
        ('yakusu9_kihon', [5, 6, 7]), ('yakusu9_renshu', [5, 8, 9]), ('yakusu9_kakomon', [0, 1]),
        ('baisu9_kihon', [4, 7, 8]), ('baisu9_renshu', [4, 5, 7]), ('baisu9_kakomon', [0, 1]),
        # 分数の計算は 小数→分数・分数→小数・計算 がまんべんなく入るように
        ('shobun9_kihon', [4, 12, 17]), ('shobun9_renshu', [3, 5, 11, 15]), ('shobun9_kakomon', [0, 1]),
    ],
}

# 答えが短く、2段組・答えの線1本で足りる単元
COMPACT_SUBJECTS = {'meishi9_kihon', 'meishi9_hojuu', 'doushi9_kihon', 'doushi9_hojuu'}

# 読解の本文（問題の passage キー → 題名・出典・画像の並べ方）
# 画像は print/make_passage_print.py で作る印刷用（行頭の欠けを直し、鉛筆の書きこみ・答えの印を消したもの）。
# rows は紙面の1行ぶん。各行の中は右から左へ並べる（縦書きを読む順）。h は画像の高さ(mm)。
PASSAGES = {
    'bungaku9_kihon': {
        'src': '黒井千次「子供のいる駅」より', 'order': '（右上から左へ読む）',
        'rows': [[(f'bungaku9_kihon_{i}.png', 72) for i in (1, 2, 3, 4)],
                 [(f'bungaku9_kihon_{i}.png', 72) for i in (5, 6)]],
    },
    'setumei9_kihon': {
        'src': '田中伸幸『牧野富太郎の植物学』より', 'order': '（上の段から下の段へ読む）',
        # 段ごとの画像は横に2つ並べると文字が約3mmと小さいので、1行に1段。下段の左に〔注〕を置く。
        'rows': [[('setumei9_kihon_1.png', 92)],
                 [('setumei9_kihon_2.png', 92), ('setumei9_kihon_chu_5.png', 50), ('setumei9_kihon_chu_6.png', 50)]],
    },
}
for key, ps in PASSAGES.items():
    for row in ps['rows']:
        for name, _h in row:
            assert os.path.exists(os.path.join(SP, 'passage', name)), f'本文画像がない: {name}（make_passage_print.py を先に動かす）'

by_subject = {}
for q in questions:
    by_subject.setdefault(q['subject'], []).append(q)

# 前回の9月模試で使った問題
_prev_html = open(os.path.join(SP, 'moshi_202609.html'), encoding='utf-8').read()
_prev = json.loads(_prev_html.split('const EXAM = ', 1)[1].split(';\n', 1)[0])
PREV_IDS = {q['id'] for v in _prev.values() for q in v}


def select(subject_id, idxs):
    items = by_subject.get(subject_id, [])
    return [items[i] for i in idxs]


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
    if out['subject'] in COMPACT_SUBJECTS:
        out['compact'] = True
    # 読解で答えが短い問題（三十字以上などの記述でないもの）は答えの線1本
    if out.get('passage') and not re.search(r'[二三四五六七八九]十字', out['q']):
        out['oneLine'] = True
    if out.get('passage'):
        assert out['passage'] in PASSAGES, f"本文の設定がない: {out['passage']}"
    return out


def dedupe_shared_text(qs):
    """読解で前の問題と同じ文（――線の説明・【まとめ】）がくり返されるときは2回目から省く。
    例：問1-①②③ は同じ【まとめ】の空らん違いなので、②③ は「問○と同じまとめの文の」にする。"""
    out = []
    first_no = None
    for i, q in enumerate(qs):
        prev = out[-1] if out else None
        shared_matome = prev is not None and any(
            line.startswith('【') and line in qs[i - 1]['q'].split('\n') for line in q['q'].split('\n'))
        if shared_matome and q.get('passage') == prev.get('passage'):
            prev_sents = {x for line in qs[i - 1]['q'].split('\n') for x in re.split(r'(?<=。)', line) if x}
            lines = []
            dropped = False
            for line in q['q'].split('\n'):
                keep = [x for x in re.split(r'(?<=。)', line) if x and x not in prev_sents]
                dropped |= len(keep) != len([x for x in re.split(r'(?<=。)', line) if x])
                if keep:
                    lines.append(''.join(keep))
            if dropped and lines:
                if first_no is None:
                    first_no = i  # 0始まり → 表示は i
                q = dict(q)
                q['q'] = f'問{first_no}と同じまとめの文の、' + '\n'.join(lines)
            else:
                first_no = None
        else:
            first_no = None
        out.append(q)
    return out


exam_by_cat = {}
for cat in CAT_ORDER:
    picked = []
    for subject_id, idxs in SELECTION[cat]:
        picked.extend(select(subject_id, idxs))
    exam_by_cat[cat] = dedupe_shared_text([clean_question(q) for q in picked])

_dup = [q['id'] for v in exam_by_cat.values() for q in v if q['id'] in PREV_IDS]
assert not _dup, f'前回の9月模試と重なっている問題: {_dup}'
_ids = [q['id'] for v in exam_by_cat.values() for q in v]
assert len(_ids) == len(set(_ids)), '同じ問題が2回入っている'
total = sum(len(v) for v in exam_by_cat.values())
total_img = sum(1 for v in exam_by_cat.values() for q in v if q.get('qImage'))
print(f'選定: 合計{total}問（画像{total_img}問）')
for cat in CAT_ORDER:
    print(f'  {CAT_LABEL[cat]}: {len(exam_by_cat[cat])}問')

EXAM_JSON = json.dumps(exam_by_cat, ensure_ascii=False)
PASSAGES_JSON = json.dumps(PASSAGES, ensure_ascii=False)

# ── 模試本体 ──────────────────────────────────────────────
EXAM_HTML = '''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>ena 9月 模試（国語・算数）</title>
<style>
  :root{ --cat-shakai:#1d4ed8; --cat-rika:#065f46; --cat-kokugo:#3730a3; --cat-sansu:#be185d; }
  /* 余白は @page で全ページに付ける（section の padding だと2ページ目以降の上端が0mmになり、印刷で切れる） */
  @page { size: A4 portrait; margin: 15mm 14mm 14mm; }
  *{ margin:0; padding:0; box-sizing:border-box; }
  body{
    font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;
    color:#111; -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  section.page{ break-after:page; }
  section.page:last-child{ break-after:auto; }

  /* 表紙 */
  .cover{ display:flex; flex-direction:column; align-items:center; padding-top:30mm; }
  .cover h1{ font-size:28pt; letter-spacing:.05em; margin-bottom:4mm; }
  .cover .sub{ font-size:11pt; color:#555; margin-bottom:20mm; }
  .cover table{ border-collapse:collapse; font-size:12pt; margin-bottom:16mm; }
  .cover td{ border:0.3mm solid #999; padding:3mm 8mm; }
  .cover td.label{ background:#f2f2f2; font-weight:700; text-align:center; }
  .cover .note{ font-size:9.5pt; color:#777; border-top:.3mm solid #ccc; padding-top:4mm; margin-top:6mm; width:140mm; text-align:center; }

  /* 大問見出し */
  .cat-head{ color:#fff; padding:2.5mm 5mm; border-radius:1.5mm; margin-bottom:6mm; }
  .cat-head h2{ font-size:15pt; }

  .qb{ break-inside:avoid; margin-bottom:4mm; padding-bottom:3mm; border-bottom:.2mm dotted #ccc; }
  .qb .num{ font-weight:800; font-size:11pt; }
  .qb .qtext{ font-size:10.5pt; line-height:1.6; white-space:pre-line; margin:1.5mm 0 2.5mm; }
  .qb .imgs{ display:flex; gap:4mm; justify-content:center; margin:2mm 0; }
  .qb .imgs img{ max-width:65mm; max-height:55mm; border:.2mm solid #ddd; }
  .qb .opts{ display:flex; flex-wrap:wrap; gap:2.5mm 6mm; font-size:10pt; margin-bottom:2mm; }
  .qb .ans-box{ font-size:10pt; color:#333; }
  .qb .line{ border-bottom:.3mm solid #999; height:7mm; margin-top:1mm; }

  /* 文法：2段組・答えの線1本 */
  .grid2{ display:grid; grid-template-columns:1fr 1fr; column-gap:7mm; }
  .grid2 .qb{ margin-bottom:3.5mm; padding-bottom:2.5mm; }
  .grid2 .qb .qtext{ font-size:10pt; line-height:1.5; margin:1mm 0 1.5mm; }

  /* 読解の本文：高さをそろえて右から左へ並べる */
  /* 本文は4枚ずつの行に分け、行の途中ではページを切らない（本文全体を1まとまりにすると大きな空白ができる） */
  .passage{ margin:0 0 4mm; }
  .passage .ptitle{ break-after:avoid; font-size:10.5pt; font-weight:800; border-left:1.5mm solid #3730a3; padding-left:2mm; margin-bottom:2mm; }
  .passage .ptitle small{ font-weight:400; color:#555; font-size:8.5pt; margin-left:2mm; }
  .passage .pimgs{ display:flex; flex-direction:row-reverse; gap:2mm; margin-bottom:2mm; break-inside:avoid; }
  .passage img{ display:block; border:.2mm solid #ccc; }
  .passage .pfirst{ break-inside:avoid; }
  .passage .porder{ font-weight:400; font-size:8.5pt; color:#555; margin-left:1mm; }
</style>
</head>
<body>
<section class="page cover">
  <h1>9月 模試（国語・算数）</h1>
  <div class="sub">ena ANRINO 9月の学習内容から出題</div>
  <table>
    <tr><td class="label">名前</td><td style="width:60mm;">&nbsp;</td><td class="label">組</td><td style="width:30mm;">&nbsp;</td></tr>
    <tr><td class="label">日付</td><td colspan="3">&nbsp;</td></tr>
  </table>
  <div class="note">国語25問・算数25問。1問4点、各教科100点満点です。<br>理科・社会は別冊（9月模試）です。英語（えいご）は9月は単元テストの対象外です。</div>
</section>
<div id="cats"></div>
<script>
const EXAM = %%EXAM_JSON%%;
const CAT_LABEL = %%CAT_LABEL%%;
const CAT_COLOR = %%CAT_COLOR%%;
const CAT_ORDER = %%CAT_ORDER%%;
const PASSAGES = %%PASSAGES_JSON%%;

function renderPassage(key) {
  const ps = PASSAGES[key];
  const d = document.createElement('div');
  d.className = 'passage';
  // 見出しと本文の1行目はページをまたがないよう1まとまりにする
  const rowHtml = row => '<div class="pimgs">' + row.map(([name, h]) => `<img src="passage/${name}" style="height:${h}mm">`).join('') + '</div>';
  const rows = '<div class="pfirst"><div class="ptitle"></div>' + rowHtml(ps.rows[0]) + '</div>' + ps.rows.slice(1).map(rowHtml).join('');
  d.innerHTML = rows;
  d.querySelector('.ptitle').innerHTML = '次の文章を読んで、あとの問いに答えなさい。<span class="porder"></span>';
  d.querySelector('.porder').textContent = ps.order;
  const sm = document.createElement('small');
  sm.textContent = ps.src;
  d.querySelector('.ptitle').appendChild(sm);
  return d;
}

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
  } else if (type === 'selfjudge' && !q.compact && !q.oneLine) {
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
  let grid = null, lastPassage = null;
  EXAM[cat].forEach((q, i) => {
    if (q.passage && q.passage !== lastPassage) page.appendChild(renderPassage(q.passage));
    lastPassage = q.passage || null;
    if (q.compact) {
      if (!grid) { grid = document.createElement('div'); grid.className = 'grid2'; page.appendChild(grid); }
      grid.appendChild(renderQ(q, i + 1));
    } else {
      grid = null;
      page.appendChild(renderQ(q, i + 1));
    }
  });
  document.getElementById('cats').appendChild(page);
}
</script>
</body>
</html>
'''

EXAM_HTML = (EXAM_HTML
             .replace('%%EXAM_JSON%%', EXAM_JSON)
             .replace('%%PASSAGES_JSON%%', PASSAGES_JSON)
             .replace('%%CAT_LABEL%%', json.dumps(CAT_LABEL, ensure_ascii=False))
             .replace('%%CAT_COLOR%%', json.dumps(CAT_COLOR, ensure_ascii=False))
             .replace('%%CAT_ORDER%%', json.dumps(CAT_ORDER, ensure_ascii=False)))

with open(os.path.join(SP, 'moshi_202609_kokusan.html'), 'w', encoding='utf-8') as f:
    f.write(EXAM_HTML)

# ── 解答・解説 ──────────────────────────────────────────────
KAITOU_HTML = '''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>ena 9月 模試（国語・算数） 解答・解説（指導者用）</title>
<style>
  /* 余白は @page で全ページに付ける（section の padding だと2ページ目以降の上端が0mmになり、印刷で切れる） */
  @page { size: A4 portrait; margin: 10mm 11mm 8mm; }
  *{ margin:0; padding:0; box-sizing:border-box; }
  body{
    font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;
    color:#111; -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  header{ border-bottom:1.2mm solid #111; padding-bottom:2mm; margin-bottom:4mm; }
  h1{ font-size:15pt; }
  h1 .warn{ font-size:9.5pt; color:#c00; font-weight:700; margin-left:3mm; }
  .sheet{ column-count:2; column-gap:6mm; }
  .region h2{ font-size:9.5pt; font-weight:800; color:#fff; padding:.6mm 2.5mm; margin:2mm 0 1.5mm; border-radius:.8mm; break-after:avoid; }
  .region:first-child h2{ margin-top:0; }
  /* 解説が長い読解は段をまたいでよい（まとめて送ると段の下に大きな空きができる） */
  .item{ orphans:2; widows:2; padding-bottom:.8mm; margin-bottom:.8mm; border-bottom:.2mm dotted #ddd; font-size:7.8pt; line-height:1.3; }
  .item .n{ font-weight:800; }
  .item .ans{ font-weight:700; color:#111; }
  .item .exp{ color:#666; white-space:pre-line; }
</style>
</head>
<body>
<header><h1>9月 模試（国語・算数）　解答・解説<span class="warn">※指導者用（生徒に配布しないこと）</span></h1></header>
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

with open(os.path.join(SP, 'moshi_202609_kokusan_kaitou.html'), 'w', encoding='utf-8') as f:
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
