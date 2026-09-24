# index.html から「9月の問題」と「SVGキャラ描画」を機械的に切り出す。
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

# ── 1. QUESTIONS から 202609 の問題を抜く（node で評価してJSON化） ──────────
qs_start = next(i for i, l in enumerate(lines) if l.startswith('const QUESTIONS = ['))
qs_end   = next(i for i in range(qs_start + 1, len(lines)) if lines[i] == '];')
arr = '\n'.join(lines[qs_start:qs_end + 1])

# QUESTIONS が参照している「使いまわしの選択肢」定数も一緒に持っていく
deps = '\n'.join(l for l in lines[:qs_start]
                  if re.match(r'const (WAGO_IMI_OPTS|KANYOU_OPTS) = ', l))

js = os.path.join(SP, '_q.js')
open(js, 'w', encoding='utf-8').write(
    deps + '\n' + arr + "\nconst out = QUESTIONS.filter(q => q.month === '202609');\n"
          "process.stdout.write(JSON.stringify(out));\n")
out = subprocess.run(['node', js], capture_output=True, text=True)
if out.returncode:
    sys.exit('QUESTIONS の評価に失敗:\n' + out.stderr[:800])
questions = json.loads(out.stdout)
os.remove(js)

os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)
with open(os.path.join(ROOT, 'data/questions_202609.json'), 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=0)

# ── 2. SUBJECTS から 9月の単元だけ抜く（ステージ定義の元ネタ） ──────────────
su_start = next(i for i, l in enumerate(lines) if l.startswith('const SUBJECTS = {'))
su_end   = next(i for i in range(su_start + 1, len(lines)) if lines[i] == '};')
js2 = os.path.join(SP, '_s.js')
open(js2, 'w', encoding='utf-8').write(
    '\n'.join(lines[su_start:su_end + 1]) +
    "\nconst o = {}; for (const [k, v] of Object.entries(SUBJECTS)) if (v.month === '202609') o[k] = v;\n"
    "process.stdout.write(JSON.stringify(o));\n")
out2 = subprocess.run(['node', js2], capture_output=True, text=True)
if out2.returncode:
    sys.exit('SUBJECTS の評価に失敗:\n' + out2.stderr[:800])
subjects = json.loads(out2.stdout)
os.remove(js2)
with open(os.path.join(ROOT, 'data/subjects_202609.json'), 'w', encoding='utf-8') as f:
    json.dump(subjects, f, ensure_ascii=False, indent=0)

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
imgs = {q[k][len('/images/'):] for q in questions for k in ('qImage', 'qImage2') if q.get(k)}
print(f'問題      : {len(questions)} 件')
print(f'単元      : {len(subjects)} 件')
print(f'図つき問題: {sum(1 for q in questions if q.get("qImage"))} 件 / 図ファイル {len(imgs)} 枚')
print(f'キャラ    : {len(names)} 体 -> js/chars.js ({os.path.getsize(os.path.join(ROOT,"js/chars.js")):,} bytes)')
print('type内訳  :', {t: sum(1 for q in questions if q.get('type', 'choice') == t)
                      for t in ('choice', 'input', 'selfjudge')})
missing = [i for i in sorted(imgs) if not os.path.exists(os.path.join(ROOT, 'images', i))]
print('画像の欠け:', missing or 'なし')
