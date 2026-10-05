#!/usr/bin/env python3
"""一級建築士の過去問（architect-exam）から、島の クエスト用の問題を作る。

  python3 tools/make_kenchiku_quest.py [architect-exam の場所]

出力：
  data/questions_kenchiku.json   問題（id は 'kc:<年度>-<番号>'。建築アプリの「メダルを受け取る」と同じ id なので、メダルは二重に増えない）
  data/subjects_kenchiku.json    ダンジョン＝科目、フロア＝分野
  data/quest_schools.json        'kenchiku' の1行を追加（ほかの学校はそのまま）

図・表が ないと 答えられない問題、正解が複数の問題、文字化けのある問題は 入れない。
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(ROOT), 'architect-exam')
MONTH = 'kenchiku'
MIN_PER_STAGE = 3

GROUPS = {  # 科目キー: (ラベル, アイコン)
    'plan': ('計画', '📐'), 'env': ('環境・設備', '🌡️'), 'law': ('法規', '⚖️'),
    'struct': ('構造', '🧱'), 'const': ('施工', '🏗️'),
}
NEEDS_FIGURE = re.compile(r'(下図|次の図|上図|右図|左図|図[0-9０-９]|図に示|図の|図のよう|次の表|下表|表[0-9０-９]|表に示|表の|別表|グラフ)')

def load(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)

cats = load(os.path.join(SRC, 'data/categories.json'))
questions, kept, skipped = [], {}, {'figure': 0, 'multi': 0, 'noexp': 0, 'mojibake': 0}

for qf in sorted(glob.glob(os.path.join(SRC, 'data/questions/*.json'))):
    year = os.path.basename(qf)[:-5]
    d = load(qf)
    qs = d if isinstance(d, list) else d.get('questions', d)
    ef = os.path.join(SRC, 'data/explanations', year + '.json')
    exp = load(ef) if os.path.exists(ef) else {}
    for q in qs:
        text = q['question'] + ''.join(q['choices'])
        if q.get('figures') or NEEDS_FIGURE.search(text):
            skipped['figure'] += 1; continue
        if '\ufffd' in text:   # もとデータの 文字化け（�）がある問題は入れない
            skipped['mojibake'] += 1; continue
        if len(q.get('answer', [])) != 1 or q.get('allCorrect'):
            skipped['multi'] += 1; continue
        sk, cat = q['subjectKey'], q.get('category')
        if sk not in GROUPS or cat not in cats.get(sk, []):
            continue
        e = exp.get(q['id'])
        explanation = ''
        if e:
            lines = [e.get('p', '')] + [x for x in e.get('c', [])]
            explanation = '\n'.join(x for x in lines if x)
        else:
            skipped['noexp'] += 1
        key = 'kc_%s_%02d' % (sk, cats[sk].index(cat) + 1)
        kept.setdefault(key, []).append({
            'id': 'kc:' + q['id'], 'subject': key, 'month': MONTH,
            'q': q['question'], 'options': q['choices'], 'answer': q['answer'][0],
            'explanation': explanation,
        })

subjects = {}
for sk, (label, icon) in GROUPS.items():
    gk = 'kc_' + sk
    subjects[gk] = {'label': label, 'icon': icon, 'tag': 'tag-kenchiku', 'category': 'kenchiku', 'month': MONTH, 'isGroup': True}
    for i, cat in enumerate(cats[sk]):
        key = 'kc_%s_%02d' % (sk, i + 1)
        if len(kept.get(key, [])) < MIN_PER_STAGE:
            kept.pop(key, None); continue
        subjects[key] = {'label': cat, 'icon': '✏️', 'tag': 'tag-kenchiku', 'category': 'kenchiku', 'month': MONTH, 'parent': gk}
for k in sorted(kept):
    questions += kept[k]

with open(os.path.join(ROOT, 'data/questions_kenchiku.json'), 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=1)
with open(os.path.join(ROOT, 'data/subjects_kenchiku.json'), 'w', encoding='utf-8') as f:
    json.dump(subjects, f, ensure_ascii=False, indent=1)

qsp = os.path.join(ROOT, 'data/quest_schools.json')
qs = load(qsp)
qs['kenchiku'] = {'label': '一級建築士', 'months': [MONTH]}
with open(qsp, 'w', encoding='utf-8') as f:
    json.dump(qs, f, ensure_ascii=False)

print('問題', len(questions), '/ ステージ', sum(1 for v in subjects.values() if 'parent' in v), '/ 除外', skipped)
