#!/usr/bin/env python3
"""一級建築士の過去問（architect-exam）から、島の クエスト用の問題を作る。

  python3 tools/make_kenchiku_quest.py [architect-exam の場所]

出力：
  data/questions_kenchiku.json   4択の問題（id は 'kc:<年度>-<番号>'。建築アプリの「メダルを受け取る」と同じ id なので、メダルは二重に増えない）
  data/questions_kenchiku1.json  一問一答（○×）。4択の肢を1つずつ「正しい記述か」で出す（id は 'kc:<年度>-<番号>#<肢>'。建築アプリの一問一答と同じ）
                                 クエスト（マップ・まよいの森）は こちらを使う（quest_schools.json の questions）
  data/subjects_kenchiku.json    ダンジョン＝科目、フロア＝分野
  data/quest_schools.json        'kenchiku' の1行を追加（ほかの学校はそのまま）
  data/kenchiku_fig/             解説の図（建築アプリの data/expfig から、使うぶんだけ写す）。問題の explainFigs に [{src, title}]

図・表が ないと 答えられない問題、正解が複数の問題、文字化けのある問題は 入れない。
一問一答は 建築アプリの buildStatements と同じ条件（解説の ○× が 問題文と正答から導いたものと 合う問題だけ）。
"""
import glob, json, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(ROOT), 'architect-exam')
MONTH = 'kenchiku'
MIN_PER_STAGE = 3
FIG_DIR = 'data/kenchiku_fig'

GROUPS = {  # 科目キー: (ラベル, アイコン)
    'plan': ('計画', '📐'), 'env': ('環境・設備', '🌡️'), 'law': ('法規', '⚖️'),
    'struct': ('構造', '🧱'), 'const': ('施工', '🏗️'),
}
NEEDS_FIGURE = re.compile(r'(下図|次の図|上図|右図|左図|図[0-9０-９]|図に示|図の|図のよう|次の表|下表|表[0-9０-９]|表に示|表の|別表|グラフ)')
NEG = re.compile(r'(不適当|誤って|誤っている|適当でない|不適切|正しくない|間違)')

def load(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)

cats = load(os.path.join(SRC, 'data/categories.json'))
expfig = load(os.path.join(SRC, 'data/expfig/index.json'))
questions, kept, kept1, skipped = [], {}, {}, {'figure': 0, 'multi': 0, 'noexp': 0, 'mojibake': 0}
used_figs = set()

def figs_of(qid):
    names = expfig['byQuestion'].get(qid, [])
    used_figs.update(names)
    return [{'src': FIG_DIR + '/' + n + '.svg', 'title': expfig['figs'].get(n, '')} for n in names]

for qf in sorted(glob.glob(os.path.join(SRC, 'data/questions/*.json'))):
    year = os.path.basename(qf)[:-5]
    d = load(qf)
    qs = d if isinstance(d, list) else d.get('questions', d)
    ef = os.path.join(SRC, 'data/explanations', year + '.json')
    exp = load(ef) if os.path.exists(ef) else {}
    for q in qs:
        text = q['question'] + ''.join(q['choices'])
        if q.get('figures') or q.get('imageOnly') or NEEDS_FIGURE.search(text):
            skipped['figure'] += 1; continue
        if '�' in text:   # もとデータの 文字化け（�）がある問題は入れない
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
        figs = figs_of(q['id'])
        item = {
            'id': 'kc:' + q['id'], 'subject': key, 'month': MONTH,
            'q': q['question'], 'options': q['choices'], 'answer': q['answer'][0],
            'explanation': explanation,
        }
        if figs: item['explainFigs'] = figs
        kept.setdefault(key, []).append(item)

        # 一問一答（○×）：肢ごとに「正しい記述か」
        c = (e or {}).get('c') or []
        if len(c) != len(q['choices']):
            continue
        marks = [x[:1] for x in c]
        if any(m not in '○×' for m in marks):
            continue
        neg, ans = bool(NEG.search(q['question'])), q['answer'][0]
        if any(m != ('×' if (i == ans) == neg else '○') for i, m in enumerate(marks)):
            continue   # 解説の ○× が 問題文と正答から 導いたものと 食いちがう
        for i, ch in enumerate(q['choices']):
            if NEEDS_FIGURE.search(ch):
                continue
            truth = marks[i] == '○'
            why = re.sub(r'^[○×]\s*', '', c[i])
            kept1.setdefault(key, []).append({
                'id': 'kc:%s#%d' % (q['id'], i), 'subject': key, 'month': MONTH,
                'q': '【' + cat + '】つぎの きじゅつは ただしい？\n\n' + ch,
                'options': ['⭕ ただしい', '❌ まちがい'], 'answer': 0 if truth else 1, 'keepOrder': True,
                'explanation': ('👉 この きじゅつは ただしい' if truth else '👉 この きじゅつは まちがい') + '\n' + why,
                **({'explainFigs': figs} if figs else {}),
            })

subjects = {}
for sk, (label, icon) in GROUPS.items():
    gk = 'kc_' + sk
    subjects[gk] = {'label': label, 'icon': icon, 'tag': 'tag-kenchiku', 'category': 'kenchiku', 'month': MONTH, 'isGroup': True}
    for i, cat in enumerate(cats[sk]):
        key = 'kc_%s_%02d' % (sk, i + 1)
        if len(kept.get(key, [])) < MIN_PER_STAGE:
            kept.pop(key, None); kept1.pop(key, None); continue
        subjects[key] = {'label': cat, 'icon': '✏️', 'tag': 'tag-kenchiku', 'category': 'kenchiku', 'month': MONTH, 'parent': gk}
for k in sorted(kept):
    questions += kept[k]
oneq = [x for k in sorted(kept1) for x in kept1[k]]

# 図は 使うぶんだけ 写す（前のぶんは 消してから）
fig_out = os.path.join(ROOT, FIG_DIR)
shutil.rmtree(fig_out, ignore_errors=True)
for n in sorted(used_figs):
    dst = os.path.join(fig_out, n + '.svg')
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copyfile(os.path.join(SRC, 'data/expfig', n + '.svg'), dst)

def dump(name, obj, indent=1):
    with open(os.path.join(ROOT, name), 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=indent, separators=None if indent else (',', ':'))

dump('data/questions_kenchiku.json', questions)
dump('data/questions_kenchiku1.json', oneq, None)   # 5000こ ちかいので つめて書く
dump('data/subjects_kenchiku.json', subjects)

qsp = os.path.join(ROOT, 'data/quest_schools.json')
qs = load(qsp)
qs['kenchiku'] = {'label': '一級建築士', 'months': [MONTH], 'questions': [MONTH + '1']}
with open(qsp, 'w', encoding='utf-8') as f:
    json.dump(qs, f, ensure_ascii=False)

print('問題', len(questions), '/ 一問一答', len(oneq), '/ ステージ', sum(1 for v in subjects.values() if 'parent' in v),
      '/ 図', len(used_figs), '/ 図つき', sum(1 for x in questions if x.get('explainFigs')), '/ 除外', skipped)
