// 🐰 もちつきうさぎ：月の うすの よこに いる。はなす（1日1回 +1）・プレゼントで なかよく なり、
// ♥3（FOLLOW_HEARTS）に なると「いっしょに ちきゅうへ」さそえる。きたあとは どこでも ついてくる（がっこうは のぞく）。
// なかよし度は ほかの なかまと おなじ friendsPlay（キー USAGI_KEY）に もつので、プレゼントは giveGift が そのまま つかえる。
import type { Area } from '../types';

export const USAGI_KEY = 'mochiusa';
export const USAGI_NAME = 'もちつきうさぎ';
/** 月の うす（うさぎは その ひだりで ぺったん） */
export const USU_SPOT = { x: 0.66, y: 0.5 };
export const USAGI_SPOT = { x: 0.6, y: 0.52 };
/** ちきゅうに きたあと ついてくる ばしょ */
export const USAGI_AREAS: Area[] = ['main', 'east', 'house', 'moon', 'mars'];

const MOON_LINES = [
  'ぺったん ぺったん！ つきで おもちを ついて いるんだ',
  'にっぽんでは、つきの もようが うさぎの もちつきに みえるんだって',
  'ほかの くにでは、つきの もようが カニや ほんを よむ おばあさんに みえるらしいよ',
  'くろっぽい ところは「うみ」って いうけど、みずは ないんだよ',
  'ここは じゅうりょくが 6ぶんの1。きねも かるくて らくちん！',
  'まんげつの よるは、ちきゅうから ぼくが いちばん よく みえるよ',
  'おだんご だいすき！ もって きてくれたら うれしいな',
];
const INVITE_LINES = ['ちきゅうって どんな ところ？ いって みたいなあ', 'あおい ちきゅう、きれいだね。いつか いってみたいな'];
const EARTH_LINES: Partial<Record<Area, string[]>> = {
  main: ['ちきゅうは みどりが いっぱい！', 'うみって ほんとうに しょっぱいの？', 'ここでは ジャンプが ひくいね。おもたい〜'],
  east: ['おはなが いっぱい！ つきには さいて いないんだ', 'ロケット、なつかしいなあ'],
  house: ['おうちの なか、あったかいね', 'ふとんって ふかふか！'],
  moon: ['ただいま、つき！ うすも まってて くれたね', 'ちきゅうが あんなに ちいさく みえるよ'],
  mars: ['かせいって あかいねえ！', 'かせいの つきは 2つも あるんだって'],
};

/** はなしかける ことば（日と かいすうで かわる） */
export function usagiLine(area: Area, home: boolean, hearts: number, n: number): string {
  const list = home ? EARTH_LINES[area] ?? MOON_LINES
    : hearts >= 3 ? [...INVITE_LINES, ...MOON_LINES]
    : MOON_LINES;
  return list[n % list.length];
}
