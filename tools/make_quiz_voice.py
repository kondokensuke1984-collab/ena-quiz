#!/usr/bin/env python3
"""問題の読み上げ声（VOICEVOX:ずんだもん）を作る。いまは 11月 社会の 基本問題（農業6・林業・水産業）。

先に VOICEVOX エンジンを起動しておく:
    cd "$HOME/Library/Application Support/voicevox-engine" && (nohup ./run --host 127.0.0.1 --port 50021 >/tmp/vv.log 2>&1 &)
つかいかた:
    python3 tools/make_quiz_voice.py --kana    # 読み（カナ）だけ表示。声は作らない。読みまちがいの確認用
    python3 tools/make_quiz_voice.py           # audio/shakai11/<id>_q|a|e.mp3 と manifest.json ができる
      q＝問題文 / a＝「こたえは、〜」 / e＝解説

読みを直すときは YOMI_ID（問題ごと）か YOMI_WORD（ぜんぶ共通）に書く。
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data' / 'questions_202611.json'
OUT = ROOT / 'audio' / 'shakai11'
SUBJECTS = ('nougyou6_kihon', 'ringyo_kihon', 'suisan_kihon')
VV_API = 'http://127.0.0.1:50021'
SPEAKER = 3          # ずんだもん ノーマル
SPEED = 0.95
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# ぜんぶの文に かける置きかえ（上から順）
YOMI_WORD = [
    (r'基本問題(\d+)-\((\d+)\)\(iii\)', r'問題、\1の\2の3。'),
    (r'基本問題(\d+)-\((\d+)\)\(ii\)', r'問題、\1の\2の2。'),
    (r'基本問題(\d+)-\((\d+)\)\(i\)', r'問題、\1の\2の1。'),
    (r'基本問題(\d+)-\((\d+)\)', r'問題、\1の\2。'),
    (r'※', ''),
    (r'［\s*］|\[\s*\]', 'かっこ'),
    (r'[【】［］\[\]]', ''),
    (r'（\s*）|\(\s*\)', 'かっこ'),
    (r'下（草）がり', 'したくさがり'),
    (r'（例）', '、例として、'),
    (r'三大美林', 'さんだいびりん'),
    (r'そのため', 'そのため、'),
    (r'得にくかった', 'えにくかった'),
    (r'米', 'こめ'),
    (r'(\d+)m', r'\1メートル'),
    (r'①', '1番'), (r'②', '2番'), (r'③', '3番'),
    (r'ア〜([ア-ン])', r'アから\1'),
    (r'(?<=[^\n。、])([イウエ])：', r'。\1：'),
    (r'：', '、'),
    (r'Λ', 'ラムダ'),
    (r'\u3000+', '、'),
    (r'\n+', '。'),
    (r'[（）]', '、'),
    (r'、、+', '、'),
    (r'。。+', '。'),
    (r'、。', '。'),
    (r'。、', '。'),
    (r'^[、。]+', ''),
    (r'、$', '。'),
]
# 問題ごとの 言いなおし（キーは id、値は {'q'|'a'|'e': 読み文}）
YOMI_ID = {
}


def clean(text: str) -> str:
    for pat, rep in YOMI_WORD:
        text = re.sub(pat, rep, text)
    return text.replace('　', '').strip()


def scripts(q: dict) -> dict:
    body = q['q'].replace('基本問題', '基本問題', 1)
    out = {
        'q': clean(body),
        'a': clean('こたえは、' + q['answer']),
        'e': clean(q['explanation']),
    }
    out.update(YOMI_ID.get(q['id'], {}))
    return out


def vv(path: str, text: str, data: bytes | None = None, speaker: int = SPEAKER) -> bytes:
    url = f'{VV_API}/{path}?speaker={speaker}' + ('' if data else '&text=' + urllib.parse.quote(text))
    req = urllib.request.Request(url, data=data, method='POST',
                                 headers={'Content-Type': 'application/json'} if data else {})
    return urllib.request.urlopen(req).read()


def kana(text: str) -> str:
    q = json.loads(vv('audio_query', text))
    return '/'.join(''.join(m['text'] for m in ap['moras']) for ap in q['accent_phrases'])


def synth(text: str) -> bytes:
    q = json.loads(vv('audio_query', text))
    q.update(speedScale=SPEED, prePhonemeLength=0.1, postPhonemeLength=0.25,
             outputSamplingRate=24000, outputStereo=False)
    return vv('synthesis', '', json.dumps(q).encode())


def main() -> None:
    qs = [q for q in json.loads(DATA.read_text(encoding='utf-8')) if q['subject'] in SUBJECTS]
    if '--kana' in sys.argv:
        for q in qs:
            for k, t in scripts(q).items():
                print(f"{q['id']}_{k}  {t}\n    {kana(t)}")
        return
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    with tempfile.TemporaryDirectory() as tmp:
        for q in qs:
            for k, t in scripts(q).items():
                wav = Path(tmp) / f"{q['id']}_{k}.wav"
                wav.write_bytes(synth(t))
                mp3 = OUT / f"{q['id']}_{k}.mp3"
                # モノラルだと鳴らないプレーヤーがあるので ステレオ2ch。音の大きさもそろえる
                subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', str(wav), '-af', 'loudnorm=I=-16:TP=-1.5',
                                '-ac', '2', '-ar', '44100', '-b:a', '64k', str(mp3)], check=True)
            manifest.append(q['id'])
            print(q['id'], 'ok')
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False), encoding='utf-8')
    print(f'{len(manifest)}問ぶん できました → {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
