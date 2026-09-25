#!/usr/bin/env python3
"""島とクエストの「月の更新」の入れわすれを さがす（読むだけ。ファイルは かえない）。

つかいかた:
    python3 tools/check_island_month.py            # 今月と来月（15日からは 来月と さ来月）を しらべる
    python3 tools/check_island_month.py 202611     # この月を しらべる（と その前の月との 値段くらべ）

しらべること:
  1. index.html の MONTH_CAT_PET（9月いこう）の キャラ → CAT_CHARS の render → js/chars.js・
     島の CharKey / CHAR_NAMES / FAVORITE に あるか
  2. その月の 季節の品（gift・fwear・seed）・限定魚・SeasonDeco・fwear の WEAR_POS・スタンプの ごほうびの表
  3. BUILD_ORDER の建物に BUILDING_SPOTS と絵が あるか、値段が 前より 上がっているか
  4. data/quest_months.json に その月が あるか
"""
import datetime
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'game-src' / 'src'


def read(p: Path) -> str:
    return p.read_text(encoding='utf-8')


problems: list[str] = []
oks: list[str] = []


def ng(msg: str) -> None:
    problems.append(msg)


def ok(msg: str) -> None:
    oks.append(msg)


def target_months() -> list[str]:
    if len(sys.argv) > 1 and re.fullmatch(r'\d{6}', sys.argv[1]):
        return [sys.argv[1]]
    # 月の前半は「今月と来月」、後半（15日〜）は じゅんびする「来月と さ来月」
    d = datetime.date.today()
    y, m = d.year, d.month
    if d.day >= 15:
        y, m = (y + 1, 1) if m == 12 else (y, m + 1)
    ny, nm = (y + 1, 1) if m == 12 else (y, m + 1)
    return [f'{y}{m:02d}', f'{ny}{nm:02d}']


def check_chars(months: list[str]) -> None:
    html = read(ROOT / 'index.html')
    chars_js = read(ROOT / 'js' / 'chars.js')
    chars_ts = read(SRC / 'lib' / 'chars.ts')
    items_ts = read(SRC / 'lib' / 'items.ts')

    m = re.search(r'const MONTH_CAT_PET = \{(.*?)\n\};', html, re.S)
    if not m:
        ng('index.html に MONTH_CAT_PET が 見つからない')
        return
    table = {}
    for mm, body in re.findall(r"'(\d{6})':\s*\{([^}]*)\}", m.group(1)):
        table[mm] = dict(re.findall(r"(\w+):\s*'(\w+)'", body))

    keytype = re.search(r'export type CharKey =(.*?);', chars_ts, re.S)
    charkeys = set(re.findall(r"'(\w+)'", keytype.group(1))) if keytype else set()
    names = re.search(r'export const CHAR_NAMES[^{]*\{(.*?)\};', chars_ts, re.S)
    namekeys = set(re.findall(r'(\w+):', names.group(1))) if names else set()
    fav = re.search(r'export const FAVORITE[^{]*\{(.*?)\};', items_ts, re.S)
    favkeys = set(re.findall(r'(\w+):', fav.group(1))) if fav else set()

    for mm in sorted(table):
        if mm < '202609':
            continue
        for cat, pet in table[mm].items():
            blk = re.search(rf'\n  {pet}: \{{.*?render:\s*[^\n]*?render(\w+)SVG', html, re.S)
            if not blk:
                ng(f'{mm} {cat}「{pet}」: CAT_CHARS に render が ない')
                continue
            key = blk.group(1).lower()
            miss = []
            if f'{key}: render{blk.group(1)}SVG' not in chars_js:
                miss.append('js/chars.js（tools_extract_202609.py を 回す）')
            if key not in charkeys:
                miss.append('chars.ts の CharKey')
            if key not in namekeys:
                miss.append('chars.ts の CHAR_NAMES')
            if key not in favkeys:
                miss.append('items.ts の FAVORITE（好物）')
            if miss:
                ng(f'{mm} {cat}「{pet}」（島キー {key}）: ' + '・'.join(miss) + ' に ない')
            else:
                ok(f'{mm} {cat}「{pet}」（{key}）')

    for mm in months:
        if mm not in table:
            ng(f'{mm}: MONTH_CAT_PET に この月が まだ ない（問題を 入れたら キャラを 足す）')
        else:
            cats = set(table[mm])
            rest = {'kokugo', 'sansu', 'rika', 'shakai'} - cats
            if rest:
                ok(f'{mm}: キャラの いない教科 {sorted(rest)}（問題を 入れたら 足す）')


def check_season(months: list[str]) -> None:
    items_ts = read(SRC / 'lib' / 'items.ts')
    fish_ts = read(SRC / 'lib' / 'fish.ts')
    stage = read(SRC / 'components' / 'IslandStage.tsx')
    screen = read(SRC / 'screens' / 'IslandScreen.tsx')

    wear_pos = set(re.findall(r'^\s+(fw_\w+): \{ y:', screen, re.M))
    for fid in re.findall(r"id: '(fw_\w+)', kind: 'fwear'", items_ts):
        if fid not in wear_pos:
            ng(f'きせかえ {fid}: IslandScreen の WEAR_POS に ない（かぶせても 見えない）')

    stamp = re.search(r'STAMP_ITEMS_BY_MONTH[^{]*\{(.*?)\n\};', items_ts, re.S)
    stamp_months = set(int(x) for x in re.findall(r'^\s*(\d+):', stamp.group(1), re.M)) if stamp else set()

    for mm in months:
        mon = int(mm[4:])
        kinds = re.findall(rf"kind: '(\w+)'[^\n]*season: {mon}\b", items_ts)
        for k in ('gift', 'fwear', 'seed'):
            if k in kinds:
                ok(f'{mon}月: 季節の {k} あり')
            else:
                ng(f'{mon}月: 季節の {k}（season: {mon}）が ない')
        if re.search(rf'season: {mon}\b', fish_ts):
            ok(f'{mon}月: 限定魚 あり')
        else:
            ng(f'{mon}月: 限定魚（fish.ts の season: {mon}）が ない')
        if re.search(rf'season === {mon}\b', stage):
            ok(f'{mon}月: SeasonDeco あり')
        else:
            ng(f'{mon}月: IslandStage.tsx の SeasonDeco に {mon}月が ない')
        if mon in stamp_months:
            ok(f'{mon}月: スタンプの ごほうびの表 あり')
        else:
            ng(f'{mon}月: items.ts の STAMP_ITEMS_BY_MONTH に ない（9月の 🏆👑⛲ に なる）')


def check_buildings() -> None:
    items_ts = read(SRC / 'lib' / 'items.ts')
    bsvg = read(SRC / 'components' / 'BuildingSVG.tsx')
    order = re.search(r'export const BUILD_ORDER = \[(.*?)\];', items_ts, re.S)
    ids = re.findall(r"'(\w+)'", order.group(1)) if order else []
    spots = re.search(r'export const BUILDING_SPOTS[^{]*\{(.*?)\n\};', bsvg, re.S)
    spot_ids = set(re.findall(r'^\s+(bd_\w+):', spots.group(1), re.M)) if spots else set()
    draw = re.search(r'const DRAW[^{]*\{(.*?)\n\};', bsvg, re.S)
    draw_ids = set(re.findall(r'(bd_\w+):', draw.group(1))) if draw else set()
    prices = {i: int(p) for i, p in re.findall(r"id: '(bd_\w+)',\s*kind: 'building'.*?price: (\d+)", items_ts)}
    last = 0
    for bid in ids:
        if bid not in prices:
            ng(f'{bid}: ITEMS に ない')
            continue
        if bid != 'bd_pier' and bid != 'bd_bridge':   # さんばし・はしは 地面の絵
            if bid not in spot_ids:
                ng(f'{bid}: BUILDING_SPOTS に 置き場所が ない')
            if bid not in draw_ids:
                ng(f'{bid}: BuildingSVG の DRAW に 絵が ない')
        if prices[bid] < last:
            ng(f'{bid}: 値段 {prices[bid]} が 前の建物（{last}）より 安い')
        last = max(last, prices[bid])
    ok(f'建物 {len(ids)}こ（さいごは {ids[-2:] if ids else []}、{last}枚まで）')


def check_quest(months: list[str]) -> None:
    p = ROOT / 'data' / 'quest_months.json'
    try:
        have = {m['month']: m.get('count', 0) for m in json.loads(read(p))['months']}
    except Exception as e:  # noqa: BLE001
        ng(f'data/quest_months.json が 読めない: {e}')
        return
    for mm in months:
        if mm in have:
            ok(f'{mm}: クエストの 問題 {have[mm]}問')
        else:
            ng(f'{mm}: data/quest_months.json に ない（問題を 入れたら tools_extract_202609.py を 回す）')


def main() -> None:
    months = target_months()
    print(f'しらべる月: {", ".join(months)}\n')
    check_chars(months)
    check_season(months)
    check_buildings()
    check_quest(months)
    print('✅ OK')
    for o in oks:
        print('  ・' + o)
    print()
    if problems:
        print(f'⚠️ たりないもの {len(problems)}こ')
        for p in problems:
            print('  ・' + p)
        sys.exit(1)
    print('⚠️ たりないもの なし')


if __name__ == '__main__':
    main()
