#!/usr/bin/env python3
"""サッカーの うごきかた（soccer-lesson）の 声（VOICEVOX:ずんだもん）を作る。

台本は soccer-lesson/lessons.js（node で読む）。変わった文だけ作りなおす。
先に VOICEVOX エンジンを起動しておく:
    cd "$HOME/Library/Application Support/voicevox-engine" && (nohup ./run --host 127.0.0.1 --port 50021 >/tmp/vv.log 2>&1 &)
つかいかた:
    python3 tools/make_soccer_voice.py --kana   # 読み（カナ）だけ表示。読みまちがいの確認用
    python3 tools/make_soccer_voice.py          # audio/soccer/<id>.mp3 と durations.json ができる
    python3 tools/make_soccer_voice.py --all    # ぜんぶ作りなおす
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from make_quiz_voice import FFMPEG, kana, synth  # noqa: E402  同じ声・同じ速さ

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'audio' / 'soccer'
SRC = ROOT / 'soccer-lesson' / 'lessons.js'


def lines() -> dict:
    js = f"process.stdout.write(JSON.stringify(require({json.dumps(str(SRC))}).LINES))"
    return json.loads(subprocess.run(['node', '-e', js], check=True, capture_output=True, text=True).stdout)


def main() -> None:
    ls = lines()
    if '--kana' in sys.argv:
        for k, v in ls.items():
            t = v.get('y') or v['t']
            print(f'{k}  {t}\n    {kana(t)}')
        return
    OUT.mkdir(parents=True, exist_ok=True)
    cache_p, dur_p = OUT / 'texts.json', OUT / 'durations.json'
    cache = json.loads(cache_p.read_text(encoding='utf-8')) if cache_p.exists() else {}
    durs = json.loads(dur_p.read_text(encoding='utf-8')) if dur_p.exists() else {}
    made = 0
    with tempfile.TemporaryDirectory() as tmp:
        for k, v in ls.items():
            t = v.get('y') or v['t']
            mp3 = OUT / f'{k}.mp3'
            if '--all' not in sys.argv and cache.get(k) == t and mp3.exists() and k in durs:
                continue
            wav = Path(tmp) / f'{k}.wav'
            wav.write_bytes(synth(t))
            with wave.open(str(wav)) as w:
                durs[k] = round(w.getnframes() / w.getframerate(), 2)
            subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', str(wav), '-af', 'loudnorm=I=-16:TP=-1.5',
                            '-ac', '2', '-ar', '44100', '-b:a', '64k', str(mp3)], check=True)
            cache[k] = t
            made += 1
            print(k, durs[k], 's')
    # 台本から消えた文の 声は 消す
    for k in list(durs):
        if k not in ls:
            durs.pop(k, None); cache.pop(k, None)
            (OUT / f'{k}.mp3').unlink(missing_ok=True)
    cache_p.write_text(json.dumps(cache, ensure_ascii=False, indent=0), encoding='utf-8')
    dur_p.write_text(json.dumps(durs, ensure_ascii=False), encoding='utf-8')
    print(f'{made}こ 作りました（ぜんぶで {len(ls)}こ）→ {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
