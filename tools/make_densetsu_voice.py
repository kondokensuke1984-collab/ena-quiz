#!/usr/bin/env python3
"""アンリノの伝説 第2章の 見どころの 声（VOICEVOX）を作る。

先に VOICEVOX エンジンを起動しておく（tools/make_opening_voice.py と同じ）。
つかいかた:
    python3 tools/make_densetsu_voice.py          # audio/densetsu/*.mp3 ができる
    python3 tools/make_densetsu_voice.py --check  # 読みがなだけ 出す（まちがい読みの 確認）

画面の文は densetsu/ch2.js。文を かえたら ここも 直して 作りなおす。
読みまちがいは 漢字を かなに かえて 直す。
"""
import json
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'audio' / 'densetsu'
VV_API = 'http://127.0.0.1:50021'
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# だれの 声か：話者ID・はやさ・高さ
VOICES = {
    'mio': (10, 0.95, 0.0),      # 雨晴はう：小さい ころの ミオ
    'old': (10, 0.82, -0.04),    # 同じ 声を ゆっくり 低く：おばあさんに なった ミオ
    'turtle': (42, 0.9, 0.0),    # ちび式じい：村長
    'colon': (8, 1.0, 0.0),      # 春日部つむぎ：コロン
    'hero': (77, 1.0, 0.0),      # もち子さん（泣き）：アンリノ
}
KANA_FIX = {"ア'ンリ/ノ'/ガ'": "ア'ンリノガ", "ア'ンリ/ノ'/ナ'ラ": "ア'ンリノナラ"}
LINES = {
    # ミオの てがみ
    'l1_0': ('mio', 'この手紙を拾った人へ。わたしは島の灯台の火を守っています。ゆうべ、海の向こうに、見たことのない、あたたかい光が見えました。'),
    'l1_1': ('mio', 'だれか、このあかりを見ていますか。ミオ。'),
    'l2_1': ('mio', 'そうだ、わたしの名前の意味を教えるね。ミオは、船の通る海の道のこと。船が迷わないようにって、父さんがつけてくれたの。'),
    'l5_0': ('mio', 'アンリノへ。ひみつをひとつ教えるね。島の人はみんな海を渡って、いなくなりました。もう火をともさなくていいよ、って言われたの。'),
    'l5_1': ('mio', 'でも、もし船がいっそうでも迷ったら困るでしょう。だから、だれも見ていなくても、毎晩ともしました。'),
    'l5_2': ('mio', 'ほんとうは、ときどきさみしかった。きょうともしても、だれも知らないんだもの。でも、いまは違うよ。アンリノが見ていてくれるから。ミオ。'),
    'carve_0': ('mio', 'アンリノへ。かげは名前を食べるんだって。忘れてもだいじょうぶ。きみが呼んでくれたら、わたしはここにいるよ。'),
    # さいごの てがみ
    'lf_0': ('old', 'アンリノへ。おばあさんになりました。字が下手でごめんね。あの日から、いちどもあかりを消さなかったよ。'),
    'lf_1': ('old', 'だれも見ていない夜なんて、もうなかったから。きみが見ていてくれたから。'),
    'lf_2': ('old', 'カメに頼んでおきます。この子は長生きだから、きっと届けてくれる。'),
    'lf_3': ('old', '海のいちばん向こうには、夢の扉があるそうです。アンリノなら、きっとたどりつけるよ。迷ったら、ふりかえって。わたしのあかりがついているから。ミオ。'),
    # 村長
    't1': ('turtle', 'おかえり、アンリノ。会えたようじゃな。'),
    't2': ('turtle', 'これを渡す日を、ずっと待っておった。'),
    't3': ('turtle', 'わしの友達から預かったんじゃ。百年前にな。'),
    't4': ('turtle', 'わしはそのころ、小さなカメでな。その子の肩に乗って、火の番をしておった。'),
    't5': ('turtle', 'あの子はおばあさんになるまで、毎晩灯台にのぼったよ。'),
    't6': ('turtle', 'ずいぶん、かかってしまったな、ミオ。'),
    # コロンと アンリノ
    'c_tree': ('colon', 'うわあ！これ、ミオがきのう植えた木だよ！'),
    'c_who': ('colon', 'この手紙の子、名前、なんだっけ？'),
    'c_forget': ('colon', 'おかしいな。ぼく、ぜんぜん思いだせない。'),
    'c_saw': ('colon', '見えた？いま。'),
    'h_mio': ('hero', 'ミオ！'),
}


def query(text: str, who: str) -> dict:
    sp, speed, pitch = VOICES[who]
    q = json.loads(urllib.request.urlopen(urllib.request.Request(
        f'{VV_API}/audio_query?text={urllib.parse.quote(text)}&speaker={sp}', method='POST')).read())
    # 「アンリノ」の 名前の 区切りを 1語に 直す
    kana = q['kana']
    for a, b in KANA_FIX.items():
        kana = kana.replace(a, b)
    if kana != q['kana']:
        q['accent_phrases'] = json.loads(urllib.request.urlopen(urllib.request.Request(
            f'{VV_API}/accent_phrases?text={urllib.parse.quote(kana)}&speaker={sp}&is_kana=true', method='POST')).read())
        q['kana'] = kana
    q['speedScale'] = speed
    q['pitchScale'] = pitch
    q['prePhonemeLength'] = 0.1
    q['postPhonemeLength'] = 0.25
    q['outputSamplingRate'] = 24000
    return q


def main() -> None:
    if '--check' in sys.argv:
        for k, (who, text) in LINES.items():
            print(k, query(text, who)['kana'])
        return
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for k, (who, text) in LINES.items():
            q = query(text, who)
            req = urllib.request.Request(f'{VV_API}/synthesis?speaker={VOICES[who][0]}', data=json.dumps(q).encode(),
                                         headers={'Content-Type': 'application/json'})
            wav = Path(tmp) / f'{k}.wav'
            wav.write_bytes(urllib.request.urlopen(req).read())
            subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', str(wav), '-af', 'loudnorm=I=-16:TP=-1.5', '-ac', '2', '-ar', '44100',
                            '-b:a', '80k', str(OUT / f'{k}.mp3')], check=True)
    print(len(LINES), '本 できました')


if __name__ == '__main__':
    main()
