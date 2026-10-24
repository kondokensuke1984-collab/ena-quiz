#!/bin/bash
# ena 10月 4科演習たいさく 算数模試・オリジナル（問題・解答）→ A4 PDF
# 使い方:  bash build_pdf_moshi_202610_sansu_orig.sh
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT_Q="$HOME/Desktop/ena_10月4科演習_算数模試_オリジナル_問題.pdf"
OUT_A="$HOME/Desktop/ena_10月4科演習_算数模試_オリジナル_解答.pdf"

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=3000 \
  --print-to-pdf="$OUT_Q" \
  "file://$DIR/moshi_202610_sansu_orig.html" 2>/dev/null

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=3000 \
  --print-to-pdf="$OUT_A" \
  "file://$DIR/moshi_202610_sansu_orig_kaitou.html" 2>/dev/null

echo "→ $OUT_Q"
echo "→ $OUT_A"
python3 -c "
import re
for path in ['$OUT_Q', '$OUT_A']:
    d = open(path, 'rb').read()
    print(path, 'ページ数:', len(re.findall(rb'/Type\s*/Page[^s]', d)))
"
