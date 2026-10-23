#!/bin/bash
# 都立中チャレンジ もし（問題・解答）→ A4 PDF
# 使い方:  bash build_pdf_moshi_toritsu1024.sh
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
python3 "$DIR/build_moshi_toritsu1024.py"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT_Q="$HOME/Desktop/都立中チャレンジもし_問題.pdf"
OUT_A="$HOME/Desktop/都立中チャレンジもし_解答.pdf"

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=3000 \
  --print-to-pdf="$OUT_Q" "file://$DIR/moshi_toritsu1024.html" 2>/dev/null
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=3000 \
  --print-to-pdf="$OUT_A" "file://$DIR/moshi_toritsu1024_kaitou.html" 2>/dev/null

python3 -c "
import re
for path in ['$OUT_Q', '$OUT_A']:
    d = open(path, 'rb').read()
    print(path, 'ページ数:', len(re.findall(rb'/Type\s*/Page[^s]', d)))
"
