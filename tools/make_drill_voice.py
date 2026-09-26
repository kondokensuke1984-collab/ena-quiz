#!/usr/bin/env python3
"""島に入るたびの あんきクイズの声（VOICEVOX:ずんだもん ノーマル）を作る。

先に VOICEVOX エンジンを起動しておく:
    cd "$HOME/Library/Application Support/voicevox-engine" && (nohup ./run --host 127.0.0.1 --port 50021 >/tmp/vv.log 2>&1 &)
つかいかた:
    python3 tools/make_drill_voice.py        # audio/drill/ に dq01〜・fa01〜・fq01〜・da01〜・intro・outro ができる

表は game-src/src/lib/drill.json（画面と同じ表）。読みは decYomi / fracYomi に書く。
dq＝「0.125は？」 fa＝「8分の1なのだ！」 fq＝「8分の1は？」 da＝「0.125なのだ！」
"""
import json
import subprocess
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / 'game-src' / 'src' / 'lib' / 'drill.json'
OUT = ROOT / 'audio' / 'drill'
VV_API = 'http://127.0.0.1:50021'
SPEAKER = 3        # ずんだもん ノーマル
SPEED = 0.95
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def synth(text: str) -> bytes:
    q = json.loads(urllib.request.urlopen(urllib.request.Request(
        f'{VV_API}/audio_query?text={urllib.parse.quote(text)}&speaker={SPEAKER}', method='POST')).read())
    q['speedScale'] = SPEED
    q['prePhonemeLength'] = 0.1
    q['postPhonemeLength'] = 0.15
    q['outputSamplingRate'] = 24000
    q['outputStereo'] = False
    req = urllib.request.Request(f'{VV_API}/synthesis?speaker={SPEAKER}', data=json.dumps(q).encode(),
                                 headers={'Content-Type': 'application/json'})
    return urllib.request.urlopen(req).read()


def save(name: str, text: str, tmp: Path) -> None:
    text = text.replace(' ', '').replace('　', '')   # 分かち書きの すきまで 止まらないように
    wav = tmp / f'{name}.wav'
    wav.write_bytes(synth(text))
    mp3 = OUT / f'{name}.mp3'
    # 音の大きさを そろえて、ステレオ2ch（モノラルだと鳴らないプレーヤーがある）
    subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', str(wav), '-af', 'loudnorm=I=-16:TP=-1.5', '-ac', '2', '-ar', '44100',
                    '-b:a', '96k', str(mp3)], check=True)
    print(f'{mp3.relative_to(ROOT)}  {text}')


def main() -> None:
    data = json.loads(SCRIPT.read_text(encoding='utf-8'))
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        save('intro', data['intro'], tmp)
        save('outro', data['outro'], tmp)
        for i, it in enumerate(data['items'], 1):
            n = f'{i:02d}'
            save(f'dq{n}', f"{it['decYomi']}は？", tmp)
            save(f'fa{n}', f"{it['fracYomi']}なのだ！", tmp)
            save(f'fq{n}', f"{it['fracYomi']}は？", tmp)
            save(f'da{n}', f"{it['decYomi']}なのだ！", tmp)


if __name__ == '__main__':
    main()
