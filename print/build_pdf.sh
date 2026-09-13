#!/bin/bash
# ena 8月 社会 厳選50問 → A4 1枚 PDF
# 使い方:  bash build_pdf.sh
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$DIR/shakai_202608_50.html"
OUT="$HOME/Desktop/ena_8月社会_一問一答50.pdf"

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=3000 \
  --print-to-pdf="$OUT" \
  "file://$SRC" 2>/dev/null

echo "→ $OUT"
python3 -c "
import re,sys
d=open('$OUT','rb').read()
print('ページ数:', len(re.findall(rb'/Type\s*/Page[^s]', d)))
"
