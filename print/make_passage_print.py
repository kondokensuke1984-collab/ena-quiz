# 模試の印刷用に、読解の本文画像を元の写真から作り直す。
# アプリ用の images/*_kihon_*.jpg は切り抜きの境目で行の頭が欠けていたり、鉛筆の書きこみ（答えの印）が残っているため。
# 出力: print/passage/*.png（グレースケール・背景を白に・鉛筆を薄く飛ばす）
#   python3 make_passage_print.py            … 作る
#   python3 make_passage_print.py --preview  … 切り抜き範囲を赤枠で描いた縮小画像を作る（座標合わせ用）
import os, sys
import cv2
import numpy as np

SP = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SP)
OUT = os.path.join(SP, 'passage')
DL = os.path.expanduser('~/Downloads')

# 写真ごとの切り抜き。座標は「時計回りに90°回して長辺1400pxに縮めた画像」での (x0, y0, x1, y1)。
# 縦書きは段の中で行の途中を切らないよう、段ごとに1枚にする。
# 4つ目の要素（任意）は白で消す範囲のリスト（同じ座標系）。
CROPS = {
    'setumei9_kihon': [
        ('IMG_1907.JPG', 'cw', (22, 28, 815, 700)),     # 上段（左ほど行の頭が上にずれているので上を広めに）
        ('IMG_1907.JPG', 'cw', (22, 700, 845, 1392), [(760, 1350, 845, 1392)]),   # 下段（右下の EXE ロゴは白で消す）
    ],
}


# 元の写真が残っていない本文は、アプリ用の切り抜き（images/）をそのまま使う。
# 切り抜きは写真を2倍にしてあり、文字は約95px（k=1.45）。
# 消す範囲は切り抜き画像のpxで (x0, y0, x1, y1)。鉛筆の答えの印（問15・16の答えに引いた線と ①② の書きこみ）。
SLICES = {
    'bungaku9_kihon': {
        'k': 1.45,
        'erase': {
            1: [(350, 405, 372, 712),     # 「うらやましく」の横の鉛筆線（問16の答え。文字の右はしに重なる）
                (386, 484, 400, 512),     # 手書きの「1」
                (380, 535, 420, 595),     # 手書きの丸②
                (557, 1240, 573, 1670),   # 「電車通学やバス通学」の横の鉛筆線（問15の答え）
                (604, 1335, 622, 1390),   # 手書きの「1」
                (586, 1418, 642, 1474)],  # 手書きの丸①
        },
    },
    # 説明的文章の〔注〕（本文は CROPS で写真から作り直す）
    'setumei9_kihon': {'k': 1.45, 'only': [5, 6], 'name': 'setumei9_kihon_chu', 'erase': {}},
}


def load_rotated(name, rot):
    img = cv2.imread(os.path.join(DL, name), cv2.IMREAD_GRAYSCALE)
    if rot == 'cw':
        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
    elif rot == 'ccw':
        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
    return img


def clean(gray, k=1.0):
    """k: 文字の大きさの倍率（写真の文字≒65px を 1.0 とする）"""
    """明るさのむらを消して背景を白にし、鉛筆のような薄い線を飛ばす。印刷の黒は残す。"""
    g = gray.astype(np.float32)
    kb = int(31 * k) | 1
    bg = cv2.GaussianBlur(cv2.dilate(gray, np.ones((kb, kb), np.uint8)), (0, 0), 25 * k).astype(np.float32)
    # 光の反射で文字が灰色に写った所もあるので、近くの一番濃い所（印刷の黒）を0、背景を255にそろえる
    kw = int(INK_WIN * k) | 1
    ink = cv2.GaussianBlur(cv2.erode(gray, np.ones((kw, kw), np.uint8)), (0, 0), kw / 2).astype(np.float32)
    ink = np.minimum(ink, bg - MIN_CONTRAST)                    # 文字のない余白でむりに引きのばさない
    norm = np.clip((g - ink) / np.maximum(bg - ink, 1) * 255, 0, 255)
    # 印刷の黒（~<120）はそのまま濃く、鉛筆（~140〜210）は白へ。境目はなめらかに。
    lo, hi = LO, HI
    out = (np.clip((norm - lo) / (hi - lo), 0, 1) * 255).astype(np.uint8)
    # 鉛筆の下線・かっこを消す。印刷の文字は芯が黒く、1つの画は1文字（約65px）より短い。
    # 鉛筆は灰色で、何文字分も縦（または横）に長くつながっている。
    # そこで「灰色の画素が縦か横にLINE_LEN以上続くところ」を白にする。黒い芯には手をつけない。
    gray = ((out > BLACK) & (out < 225)).astype(np.uint8)
    ll = int(LINE_LEN * k)
    v = cv2.morphologyEx(gray, cv2.MORPH_OPEN, np.ones((ll, 1), np.uint8))
    h = cv2.morphologyEx(gray, cv2.MORPH_OPEN, np.ones((1, ll), np.uint8))
    lines = cv2.dilate(v | h, np.ones((3, 3), np.uint8)).astype(bool) & (out > BLACK)
    out[lines] = 255
    return out


INK_WIN = 121    # 印刷の黒をさがす範囲（元画像のpx。約2文字分）
MIN_CONTRAST = 90
LO, HI = 50, 165
LINE_LEN = 61    # 灰色がこれ以上まっすぐ続けば鉛筆の線とみなす（元画像のpx。1文字は約65px）
BLACK = 40       # これより濃い画素は印刷の黒として必ず残す


def main():
    preview = '--preview' in sys.argv
    os.makedirs(OUT, exist_ok=True)
    for key, conf in SLICES.items():
        i = 0
        while os.path.exists(os.path.join(ROOT, 'images', f'{key}_{i + 1}.jpg')):
            i += 1
            if 'only' in conf and i not in conf['only']:
                continue
            img = cv2.imread(os.path.join(ROOT, 'images', f'{key}_{i}.jpg'), cv2.IMREAD_GRAYSCALE)
            for (x0, y0, x1, y1) in conf['erase'].get(i, []):
                img[y0:y1, x0:x1] = 255
            out = clean(img, conf['k'])
            if not preview:
                name = f"{conf.get('name', key)}_{i}.png"
                cv2.imwrite(os.path.join(OUT, name), out)
                print(name, out.shape)
    for key, items in CROPS.items():
        for i, (name, rot, box, *rest) in enumerate(items, 1):
            erase = rest[0] if rest else []
            img = load_rotated(name, rot)
            s = max(img.shape) / 1400
            x0, y0, x1, y1 = [int(round(v * s)) for v in box]
            if preview:
                small = cv2.resize(img, (int(img.shape[1] / s), int(img.shape[0] / s)))
                small = cv2.cvtColor(small, cv2.COLOR_GRAY2BGR)
                for (_, _, b, *_r) in items:
                    cv2.rectangle(small, b[:2], b[2:], (0, 0, 255), 2)
                cv2.imwrite(os.path.join(OUT, f'_preview_{key}.jpg'), small)
                break
            crop = clean(img[y0:y1, x0:x1])
            for ex in erase:
                ex0, ey0, ex1, ey1 = [int(round(v * s)) for v in ex]
                crop[max(ey0 - y0, 0):max(ey1 - y0, 0), max(ex0 - x0, 0):max(ex1 - x0, 0)] = 255
            # 印刷で約600dpi相当になれば十分なので、長辺2400pxまでに縮める
            k = min(1.0, 2400 / max(crop.shape))
            if k < 1:
                crop = cv2.resize(crop, None, fx=k, fy=k, interpolation=cv2.INTER_AREA)
            cv2.imwrite(os.path.join(OUT, f'{key}_{i}.png'), crop)
            print(key, i, crop.shape)


if __name__ == '__main__':
    main()
