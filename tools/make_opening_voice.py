#!/usr/bin/env python3
"""島のオープニングの声（VOICEVOX:ずんだもん）を作る。

先に VOICEVOX エンジンを起動しておく:
    cd "$HOME/Library/Application Support/voicevox-engine" && (nohup ./run --host 127.0.0.1 --port 50021 >/tmp/vv.log 2>&1 &)
つかいかた:
    python3 tools/make_opening_voice.py        # audio/opening/p1.mp3 〜 p6.mp3 ができる

文は game-src/src/lib/opening.json（画面と同じ表）。読みを直すときは その行に "yomi" を書く。
"""
import json
import subprocess
import tempfile
import urllib.parse
import urllib.request
import wave
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / 'game-src' / 'src' / 'lib' / 'opening.json'
OUT = ROOT / 'audio' / 'opening'
VV_API = 'http://127.0.0.1:50021'
SPEAKER = {'narr': 22, 'luna': 1}      # 22＝ずんだもん ささやき／1＝ずんだもん あまあま
SPEED = {'narr': 0.92, 'luna': 1.0}   # 語りは すこし ゆっくり
GAP = 0.45                            # 行と行の あいだ（秒）
SR = 24000
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def synth(text: str, who: str) -> bytes:
    sp = SPEAKER[who]
    q = json.loads(urllib.request.urlopen(urllib.request.Request(
        f'{VV_API}/audio_query?text={urllib.parse.quote(text)}&speaker={sp}', method='POST')).read())
    q['speedScale'] = SPEED[who]
    q['prePhonemeLength'] = 0.1
    q['postPhonemeLength'] = 0.2
    q['outputSamplingRate'] = SR
    q['outputStereo'] = False
    req = urllib.request.Request(f'{VV_API}/synthesis?speaker={sp}', data=json.dumps(q).encode(),
                                 headers={'Content-Type': 'application/json'})
    return urllib.request.urlopen(req).read()


def main() -> None:
    pages = json.loads(SCRIPT.read_text(encoding='utf-8'))['pages']
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for i, page in enumerate(pages, 1):
            frames = b''
            for j, line in enumerate(page['lines']):
                text = line.get('yomi') or line['text'].replace('—', '').replace('『', '').replace('』', '')
                text = text.replace(' ', '').replace('\u3000', '')   # 分かち書きの すきまで 1語ずつ 止まらないように
                wav = Path(tmp) / f'{i}_{j}.wav'
                wav.write_bytes(synth(text, line['who']))
                with wave.open(str(wav)) as w:
                    assert w.getframerate() == SR and w.getsampwidth() == 2
                    if j:
                        frames += b'\x00\x00' * int(SR * GAP) * w.getnchannels()
                    frames += w.readframes(w.getnframes())
            joined = Path(tmp) / f'p{i}.wav'
            with wave.open(str(joined), 'wb') as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
                w.writeframes(frames)
            mp3 = OUT / f'p{i}.mp3'
            # 音の大きさを そろえて（ささやきは小さい）、ステレオ2ch（モノラルだと鳴らないプレーヤーがある）
            subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', str(joined), '-af', 'loudnorm=I=-16:TP=-1.5', '-ac', '2', '-ar', '44100',
                            '-b:a', '96k', str(mp3)], check=True)
            print(f'{mp3.relative_to(ROOT)}  {len(frames) / 2 / SR:.1f}秒')


if __name__ == '__main__':
    main()
