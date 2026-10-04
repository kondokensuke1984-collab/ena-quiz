# index.html から「9月以降の月ごとの問題」と「SVGキャラ描画」を機械的に切り出す。
# 中身は読まず、件数だけ検算する。
import json, os, re, subprocess, sys

ROOT = '/Users/kondokensuke/Desktop/開発/ena-quiz'
SP   = os.path.dirname(os.path.abspath(__file__))
src  = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
lines = src.split('\n')                      # 0-based。行番号は 1-based で扱う

def grab_function(name):
    """`function name(` の行から、列0の '}' までを返す"""
    start = next(i for i, l in enumerate(lines) if l.startswith('function ' + name + '('))
    end = next(i for i in range(start + 1, len(lines)) if lines[i] == '}')
    return '\n'.join(lines[start:end + 1])

# ── 1. QUESTIONS・SUBJECTS から 9月以降の月ごとに問題と単元を抜く（node で評価してJSON化） ──
#   data/questions_<月>.json・data/subjects_<月>.json と、月の一覧 data/quest_months.json を書く。
#   クエスト（rpg.html）は quest_months.json を見て、毎月6日に新しい月へ切りかえる。
FIRST_MONTH = '202609'
qs_start = next(i for i, l in enumerate(lines) if l.startswith('const QUESTIONS = ['))
qs_end   = next(i for i in range(qs_start + 1, len(lines)) if lines[i] == '];')
arr = '\n'.join(lines[qs_start:qs_end + 1])

# QUESTIONS が参照している「使いまわしの選択肢」定数も一緒に持っていく
deps = '\n'.join(l for l in lines[:qs_start]
                  if re.match(r'const (WAGO_IMI_OPTS|KANYOU_OPTS) = ', l))

js = os.path.join(SP, '_q.js')
open(js, 'w', encoding='utf-8').write(
    deps + '\n' + arr + "\nconst out = QUESTIONS.filter(q => /^\\d{6}$/.test(q.month || '') && q.month >= '" + FIRST_MONTH + "');\n"
          "process.stdout.write(JSON.stringify(out));\n")
out = subprocess.run(['node', js], capture_output=True, text=True)
if out.returncode:
    sys.exit('QUESTIONS の評価に失敗:\n' + out.stderr[:800])
all_questions = json.loads(out.stdout)
os.remove(js)

su_start = next(i for i, l in enumerate(lines) if l.startswith('const SUBJECTS = {'))
su_end   = next(i for i in range(su_start + 1, len(lines)) if lines[i] == '};')
js2 = os.path.join(SP, '_s.js')
open(js2, 'w', encoding='utf-8').write(
    '\n'.join(lines[su_start:su_end + 1]) +
    "\nprocess.stdout.write(JSON.stringify(SUBJECTS));\n")
out2 = subprocess.run(['node', js2], capture_output=True, text=True)
if out2.returncode:
    sys.exit('SUBJECTS の評価に失敗:\n' + out2.stderr[:800])
all_subjects = json.loads(out2.stdout)
os.remove(js2)

os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)
months = sorted({q['month'] for q in all_questions})
per_month = {}
for m in months:
    qs_m = [q for q in all_questions if q['month'] == m]
    su_m = {k: v for k, v in all_subjects.items() if v.get('month') == m}
    per_month[m] = (qs_m, su_m)
    with open(os.path.join(ROOT, f'data/questions_{m}.json'), 'w', encoding='utf-8') as f:
        json.dump(qs_m, f, ensure_ascii=False, indent=0)
    with open(os.path.join(ROOT, f'data/subjects_{m}.json'), 'w', encoding='utf-8') as f:
        json.dump(su_m, f, ensure_ascii=False, indent=0)
with open(os.path.join(ROOT, 'data/quest_months.json'), 'w', encoding='utf-8') as f:
    json.dump({'months': [{'month': m, 'count': len(per_month[m][0])} for m in months]}, f, ensure_ascii=False)

# ── 1c. 学校べつ クエスト（栄光・2年生）→ data/questions_<月>.json・subjects_<月>.json と data/quest_schools.json ──
#   島の しゅじんこうで きまる がっこう（ena_school_v1。りの＝栄光・ゆうせい＝2年生）なら、rpg.html は
#   quest_schools.json の月を まとめて クエスト（ステージ・ぬし・森・タイムトライアル）にする。ena は quest_months.json のまま。
#   学校の月が かわったら ここを なおして 回す。
SCHOOL_QUEST = {
    'eikoh': {'label': '10月ターム', 'months': ['eikoh_term10']},
    'g2':    {'label': '2年生',     'months': ['g2_kuku', 'g2_kanji']},
}
school_months = sum((v['months'] for v in SCHOOL_QUEST.values()), [])
js4 = os.path.join(SP, '_f.js')
open(js4, 'w', encoding='utf-8').write(
    deps + '\n' + arr + "\nprocess.stdout.write(JSON.stringify(QUESTIONS.filter(q => " + json.dumps(school_months) + ".includes(q.month))));\n")
out4 = subprocess.run(['node', js4], capture_output=True, text=True)
if out4.returncode:
    sys.exit('学校べつの問題の評価に失敗:\n' + out4.stderr[:800])
os.remove(js4)
school_all = json.loads(out4.stdout)
school_count = {}
for m in school_months:
    qs_m = [q for q in school_all if q['month'] == m]
    used = {q['subject'] for q in qs_m}
    # 月のついた単元＋問題が使っている月なし単元（栄光の「英語」など）
    su_m = {k: v for k, v in all_subjects.items() if v.get('month') == m or (k in used and not v.get('month'))}
    school_count[m] = (len(qs_m), len(su_m))
    with open(os.path.join(ROOT, f'data/questions_{m}.json'), 'w', encoding='utf-8') as f:
        json.dump(qs_m, f, ensure_ascii=False, indent=0)
    with open(os.path.join(ROOT, f'data/subjects_{m}.json'), 'w', encoding='utf-8') as f:
        json.dump(su_m, f, ensure_ascii=False, indent=0)
with open(os.path.join(ROOT, 'data/quest_schools.json'), 'w', encoding='utf-8') as f:
    json.dump(SCHOOL_QUEST, f, ensure_ascii=False)

# ── 1b. テストの日程（TEST_KEYS.ena と DEFAULT_TEST_DATES）→ data/tests.json ──
#   島の「もしの しま」と rpg.html の 模試（js/moshi.js）が読む。テスト3日前〜当日に ひらく。
#   日付は保護者が クイズで ✏️ すると localStorage 'ena_test_<key>' に入るので、読む側で そちらを優先する。
tk_start = next(i for i, l in enumerate(lines) if l.startswith('const TEST_KEYS = {'))
tk_end   = next(i for i in range(tk_start + 1, len(lines)) if lines[i] == '};')
dd_start = next(i for i, l in enumerate(lines) if l.startswith('const DEFAULT_TEST_DATES = {'))
dd_end   = next(i for i in range(dd_start + 1, len(lines)) if lines[i] == '};')
# 📝 れんしゅうもし（MOSHI_EXTRA）：塾のテストではない もし。from〜date の あいだ 出る
mx_start = next(i for i, l in enumerate(lines) if l.startswith('const MOSHI_EXTRA = ['))
mx_end   = next(i for i in range(mx_start + 1, len(lines)) if lines[i] == '];')
js3 = os.path.join(SP, '_t.js')
open(js3, 'w', encoding='utf-8').write(
    '\n'.join(lines[tk_start:tk_end + 1]) + '\n' + '\n'.join(lines[dd_start:dd_end + 1]) + '\n' + '\n'.join(lines[mx_start:mx_end + 1]) +
    "\nconst out = (TEST_KEYS.ena || []).filter(t => t.month && DEFAULT_TEST_DATES[t.key] && t.month >= '" + FIRST_MONTH + "')"
    ".map(t => ({ key: t.key, name: t.name, month: t.month, date: DEFAULT_TEST_DATES[t.key], covers: t.covers || [] }))\n"
    ".concat(MOSHI_EXTRA.map(t => Object.assign({ extra: true }, t)));\n"
    "process.stdout.write(JSON.stringify(out));\n")
out3 = subprocess.run(['node', js3], capture_output=True, text=True)
if out3.returncode:
    sys.exit('TEST_KEYS の評価に失敗:\n' + out3.stderr[:800])
tests = json.loads(out3.stdout)
os.remove(js3)
with open(os.path.join(ROOT, 'data/tests.json'), 'w', encoding='utf-8') as f:
    json.dump({'tests': tests}, f, ensure_ascii=False, indent=1)

# ── 3. SVGキャラ描画（petStar + render*SVG 19体）を chars.js に切り出す ─────
c_start = next(i for i, l in enumerate(lines) if l.startswith('function petStar('))
c_end   = next(i for i in range(c_start, len(lines)) if lines[i].startswith('function renderPetCard('))
chars_src = '\n'.join(lines[c_start:c_end]).rstrip()
names = re.findall(r'^function (render[A-Za-z]+SVG)\(', chars_src, re.M)

os.makedirs(os.path.join(ROOT, 'js'), exist_ok=True)
with open(os.path.join(ROOT, 'js/chars.js'), 'w', encoding='utf-8') as f:
    f.write('// index.html から機械的に切り出したキャラ描画。手で編集しない。\n')
    f.write('// 署名: render*SVG(level, fillPct, size, opts) -> SVG文字列\n')
    f.write('// opts.silhouette:true で影（＝未撃破のモンスター）になる。\n\n')
    f.write(chars_src + '\n\n')
    f.write('window.CHARS = {\n')
    for n in names:
        key = n[len('render'):-len('SVG')].lower()
        f.write(f"  {key}: {n},\n")
    f.write('};\n')

# ── 4. 汎用ユーティリティ ───────────────────────────────────────────────
with open(os.path.join(ROOT, 'js/util.js'), 'w', encoding='utf-8') as f:
    f.write('// index.html から機械的に切り出した汎用関数。手で編集しない。\n\n')
    for n in ('shuffle', 'renderMath'):
        f.write(grab_function(n) + '\n\n')
    # playSound は getAudioCtx に、getAudioCtx は index.html の別行の `let _audioCtx` に依存する。
    # 抜き出しただけだと ReferenceError で無音になる（try/catch に飲まれて気づけない）ので、宣言ごと書く。
    f.write('let _audioCtx = null;   // index.html 側の宣言が別行にあるため、ここで補う\n')
    f.write(grab_function('getAudioCtx') + '\n\n')
    f.write(grab_function('playSound') + '\n\n')

# ── 検算（中身は見ない。数だけ） ─────────────────────────────────────────
questions = all_questions
imgs = {q[k][len('/images/'):] for q in questions for k in ('qImage', 'qImage2') if q.get(k)}
for m in months:
    print(f'{m}    : 問題 {len(per_month[m][0])} 件 / 単元 {len(per_month[m][1])} 件')
print(f'図つき問題: {sum(1 for q in questions if q.get("qImage"))} 件 / 図ファイル {len(imgs)} 枚')
print(f'キャラ    : {len(names)} 体 -> js/chars.js ({os.path.getsize(os.path.join(ROOT,"js/chars.js")):,} bytes)')
print('type内訳  :', {t: sum(1 for q in questions if q.get('type', 'choice') == t)
                      for t in ('choice', 'input', 'selfjudge')})
missing = [i for i in sorted(imgs) if not os.path.exists(os.path.join(ROOT, 'images', i))]
print('画像の欠け:', missing or 'なし')
print('学校べつ  :', ', '.join(f'{m} 問題{a}件/単元{b}件' for m, (a, b) in school_count.items()))
fimgs = {q[k][len('/images/'):] for q in school_all for k in ('qImage', 'qImage2') if q.get(k)}
print('学校べつの画像の欠け:', [i for i in sorted(fimgs) if not os.path.exists(os.path.join(ROOT, 'images', i))] or 'なし')
print('テスト    :', ', '.join(f"{t['key']}({t['date']})" for t in tests))
