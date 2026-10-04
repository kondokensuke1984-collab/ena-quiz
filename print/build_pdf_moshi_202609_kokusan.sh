#!/bin/bash
# ena 9月模試・国語算数版（問題・解答）→ A4 PDF
# 使い方:  bash build_pdf_moshi_202609_kokusan.sh
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT_Q="$HOME/Desktop/ena_9月模試_国語算数_問題.pdf"
OUT_A="$HOME/Desktop/ena_9月模試_国語算数_解答.pdf"

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=3000 \
  --print-to-pdf="$OUT_Q" \
  "file://$DIR/moshi_202609_kokusan.html" 2>/dev/null

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=3000 \
  --print-to-pdf="$OUT_A" \
  "file://$DIR/moshi_202609_kokusan_kaitou.html" 2>/dev/null

echo "→ $OUT_Q"
echo "→ $OUT_A"
python3 -c "
import re
for path in ['$OUT_Q', '$OUT_A']:
    d = open(path, 'rb').read()
    print(path, 'ページ数:', len(re.findall(rb'/Type\s*/Page[^s]', d)))
"
