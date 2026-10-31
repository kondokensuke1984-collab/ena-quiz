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
# 声を作る 単元の かたまり。--group <名前> で えらぶ（なにも書かなければ shakai11）。出力は audio/<名前>/
GROUPS = {
    'shakai11': ('questions_202611.json', ('nougyou6_kihon', 'ringyo_kihon', 'suisan_kihon')),
    'rika11': ('questions_202611.json', ('tane1_kihon', 'tane2_kihon', 'kumo1_kihon')),
    # 栄光 基礎コン冬。読み（漢字の読み）は 読むと答えが わかるので のぞく。英語（意味・つづり）は ずんだもんでは 読めないので のぞく
    'eikoh11': ('questions_eikoh_202611.json', ('kifuyu_kanji', 'kifuyu_keigo', 'kifuyu_keisan', 'kifuyu_bunsho', 'kifuyu_menseki',
                                              'kifuyu_hatsuga', 'kifuyu_tane', 'kifuyu_hana',
                                              'kifuyu_yasai', 'kifuyu_kudamono', 'kifuyu_chikusan', 'kifuyu_minato')),
    # ENA 11月の 練習問題（過去問演習は まだ）
    'ena_renshu11': ('questions_202611.json', ('en11a_renshu', 'en11b_renshu', 'jouken1_renshu', 'jouken2_renshu', 'tkk11_renshu',
                                              'kumo1_renshu', 'tane1_renshu', 'tane2_renshu', 'ringyo_renshu', 'suisan_renshu',
                                              'nougyou6_renshu')),
}
LEAN = {'eikoh11', 'ena_renshu11'}                 # a（こたえ）の 音声は 書いて答える（selfjudge）問題だけ。e が こたえも 読む
DROP_LABEL = {'eikoh11', 'ena_renshu11'}           # 1行目の「漢字01」「プリント②-1-(1)」のような 見出しは 読まない
NO_OPTIONS = {'kifuyu_kanji'}      # 漢字の 書きとりは 選択肢（漢字）を 読んでも 意味がないので 読まない
GROUP = sys.argv[sys.argv.index('--group') + 1] if '--group' in sys.argv else 'shakai11'
OUT = ROOT / 'audio' / GROUP
DATA = ROOT / 'data' / GROUPS[GROUP][0]
SUBJECTS = GROUPS[GROUP][1]
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
    (r'（([①-④])）', r'かっこ\1'),
    (r'下（草）がり', 'したくさがり'),
    (r'（例）', '、例として、'),
    (r'三大美林', 'さんだいびりん'),
    (r'そのため', 'そのため、'),
    (r'得にくかった', 'えにくかった'),
    (r'(?<![一-龥])米(?![一-龥])', 'こめ'),   # 「欧米」「玄米」などの 熟語は そのまま（VOICEVOX にまかせる）
    (r'【\s*】', 'かっこ'),
    (r'(\d+) (\d+)/(\d+)', r'\1と\3分の\2'),
    (r'(\d+)/(\d+)', r'\2分の\1'),
    (r'cm²', '平方センチメートル'), (r'cm', 'センチメートル'), (r'km', 'キロメートル'), (r'kg', 'キログラム'),
    (r'mL', 'ミリリットル'), (r'(\d)L', r'\1リットル'), (r'(\d)g', r'\1グラム'), (r'(\d+)m', r'\1メートル'),
    (r'\s*[＋+]\s*', ' たす '), (r'\s*−\s*', ' ひく '), (r'\s+[−-]\s+', ' ひく '),
    (r'★は', 'ほしじるしは、'), (r'[★☆]', ''), (r'○(?=時間|分|秒)', '何'), (r'○', 'まる'),
    (r'①', '1番'), (r'②', '2番'), (r'③', '3番'), (r'④', '4番'), (r'⑤', '5番'), (r'⑥', '6番'), (r'⑦', '7番'), (r'⑧', '8番'),
    (r'℃', '度'), (r'〜', 'から'), (r'\s*[＝=]\s*', ' イコール '), (r'□', 'しかく'), (r'[Ⅰⅰ]', '1'), (r'[Ⅱⅱ]', '2'), (r'[Ⅲⅲ]', '3'), (r'／', '分の'), (r'÷', 'わる'), (r'×', 'かける'),
    (r'(?<![ア-ン])([ア-オ]) (?=\S)', r'\1、'),
    (r'(?<![ァ-ヶー])([ア-シ]) (?=\d)', r'\1、'),
    (r'(\d)t', r'\1トン'),
    (r'ア〜([ア-ン])', r'アから\1'),
    (r'(?<=[^\n。、])([イウエ])：', r'。\1：'),
    (r'：', '、'),
    (r'Λ', 'ラムダ'),
    (r'\u3000+', '、'),
    (r'\n+', '。'),
    (r'\*\*', ''),
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
    if GROUP == 'eikoh11':   # 「通分 → 2/6 − 1/6」「キャベツ → 群馬県」の矢印は ひと呼吸おく
        text = re.sub(r'\s*→\s*', '、', text)
    for pat, rep in YOMI_WORD:
        text = re.sub(pat, rep, text)
    return text.replace('　', '').strip()


def scripts(q: dict) -> dict:
    choice = 'options' in q    # 4択：選択肢も読む。答えは「こたえは、ウ。〜」と 解説の 前につける
    read_opts = choice and q['subject'] not in NO_OPTIONS
    qtext = q['q']
    if GROUP in DROP_LABEL and '\n' in qtext:
        qtext = qtext.split('\n', 1)[1]
    body = qtext + ('\n' + '\n'.join(q['options']) if read_opts else '')
    ans = q['options'][q['answer']] if choice else q['answer']
    sj = q.get('type') == 'selfjudge'
    out = {'q': clean(body)}
    if not (GROUP in LEAN and not sj):
        out['a'] = clean('こたえは、' + ans)
    # 4択・計算入力は 解説の前に こたえも 言う（selfjudge は こたえを 先に きくので 解説だけ）
    out['e'] = clean(('こたえは、' + ans + '。' if (choice or (GROUP in LEAN and not sj)) else '') + q['explanation'])
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
    only = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else None
    if only:
        qs = [q for q in qs if q['id'] in only]   # 直した 問題だけ 作りなおす（manifest は 書きなおさない）
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
    if not only:
        (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False), encoding='utf-8')
    print(f'{len(manifest)}問ぶん できました → {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
