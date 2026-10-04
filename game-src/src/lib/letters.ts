// キャラからの おてがみ。島を開いたときに「前回からの変化」を見て作る。
// 文面は子ども向けに ひらがな多め。

import type { Letter, LetterMarks } from '../types';
import type { Friend } from './friends';
import { dateKey } from './study';
import { CASES } from './detective';

export const LUNA = { from: 'luna', fromName: 'ルナ' };

export function mk(from: string, fromName: string, title: string, body: string): Letter {
  return { id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, from, fromName, title, body, at: Date.now(), read: false };
}

export interface LetterInput {
  friends: Friend[];
  playerName: string;
  stampCount: number;       // 今月のスタンプ数
  ym: string;               // 'YYYY-M'
  weekDays: number;         // 今週 勉強した日数
  halloween?: boolean;      // ハロウィンの きかん
  detectiveOpen?: number[]; // 名探偵あんり：いま ひらいている じけん
  moshiOpen?: { key: string; name: string; diff: number; extra?: boolean; rewards?: number[] }[]; // もしの しま：いま うかんでいる もし（近い順）
  currentMonth?: string;    // いまの しゅやくの 月（YYYYMM）
  /** その月（YYYYMM）の スタンプの日数。きねんしゃしんを わたすか決める */
  stampDaysOf?: (month: string) => number;
  now?: Date;
}

/** きねんしゃしんを もらえる スタンプの日数（その月に これだけ クイズを がんばったら） */
export const PHOTO_STAMP_DAYS = 3;

export interface LetterResult {
  letters: Letter[];
  marks: LetterMarks;
  gifts: string[];          // いっしょに とどく 家具
  newMonth?: string;        // 月が かわった（バナーを出す）ときの 新しい月
}

const monthNum = (ym: string) => Number(ym.slice(4));

export function buildLetters(marks: LetterMarks, x: LetterInput): LetterResult {
  const now = x.now ?? new Date();
  const to = x.playerName ? `${x.playerName}へ\n` : '';
  const next: LetterMarks = {
    init: true,
    lv: { ...marks.lv },
    full: { ...marks.full },
    stamp: [...marks.stamp],
    weekly: marks.weekly,
    halloween: marks.halloween,
    month: marks.month,
    detective: marks.detective,
    moshi: marks.moshi,
  };
  const out: Letter[] = [];
  const gifts: string[] = [];
  let newMonth: string | undefined;

  // はじめて：いまの様子を覚えるだけ（前からの成長で手紙がどっと届かないように）。ようこその1通だけ
  if (!marks.init) {
    x.friends.forEach((f) => {
      next.lv[f.id] = f.level;
      if (f.total > 0 && f.n >= f.total) next.full[f.id] = true;
    });
    [3, 7, 14, 20].forEach((d) => { if (x.stampCount >= d) next.stamp.push(`${x.ym}:${d}`); });
    next.weekly = dateKey(now);
    if (x.currentMonth) next.month = x.currentMonth;
    out.push(mk(LUNA.from, LUNA.fromName, 'しまへ ようこそ！',
      `${to}しまの ポストだよ。\nクイズを がんばると、しまの なかまから おてがみが とどくよ。\nたのしみに まっててね！\nルナより`));
    return { letters: out, marks: next, gifts };
  }

  // ── 月がわり：しゅやくが かわったら、あたらしい子と まえの子から 1つうずつ ──
  if (x.currentMonth && !marks.month) {
    next.month = x.currentMonth;   // この しくみが できる前からの セーブは 覚えるだけ
  } else if (x.currentMonth && marks.month && x.currentMonth > marks.month) {
    const prev = marks.month;
    const cur = x.currentMonth;
    next.month = cur;
    newMonth = cur;
    const news = x.friends.filter((f) => f.month === cur);
    const olds = x.friends.filter((f) => f.month === prev);
    const names = (fs: Friend[]) => fs.map((f) => f.name).join('と ');
    if (news.length) {
      const f = news[0];
      out.push(mk(f.char, f.name, `🎉 ${monthNum(cur)}月の なかまが きたよ！`,
        `${to}きょうから この しまで くらす ${names(news)}だよ。
` +
        `${f.monthLabel || `${monthNum(cur)}月`}の クイズを とくと、ぼくたちが そだつよ。
` +
        `いっしょに がんばろうね！
${f.name}より`));
    }
    if (olds.length) {
      const f = olds[0];
      out.push(mk(f.char, f.name, `${monthNum(prev)}月は ありがとう`,
        `${to}${monthNum(prev)}月は いっしょに がんばってくれて ありがとう！
` +
        `これからは ${names(olds)}も しまの じゅうにんだよ。
` +
        `ときどき あそびに いくから、みつけたら こえを かけてね。
${f.name}より`));
    }
    const photo = `fn_photo_${prev}`;
    if (olds.length && (x.stampDaysOf?.(prev) ?? 0) >= PHOTO_STAMP_DAYS) {
      gifts.push(photo);
      out.push(mk(LUNA.from, LUNA.fromName, `🖼️ ${monthNum(prev)}月の きねんしゃしん`,
        `${to}${monthNum(prev)}月も よく がんばったね！
${names(olds)}と とった しゃしんを おくるよ。
` +
        `「かぐ」から しまにも おうちにも かざれるよ。
ルナより`));
    }
  }

  for (const f of x.friends) {
    const before = marks.lv[f.id];
    if (before !== undefined && f.level > before) {
      out.push(mk(f.char, f.name, `${f.name}から おてがみ`,
        `${to}${f.monthLabel}の ${f.catLabel}の もんだい、がんばってくれて ありがとう！\n` +
        `${f.name}は Lv.${f.level}${f.levelName ? `「${f.levelName}」` : ''}に なれたよ。\n` +
        `つぎも いっしょに がんばろうね。\n${f.name}より`));
    }
    next.lv[f.id] = Math.max(before ?? 0, f.level);
    if (f.total > 0 && f.n >= f.total && !marks.full[f.id]) {
      out.push(mk(f.char, f.name, '🎉 ぜんぶ ⭐ おめでとう！',
        `${to}${f.monthLabel}の ${f.catLabel}の もんだいを ぜんぶ ⭐かんぺきに したんだね！\n` +
        `ほんとうに すごいよ。${f.name}は とっても うれしい！\nしまで いっしょに おいわいしよう。\n${f.name}より`));
      next.full[f.id] = true;
    }
  }

  for (const d of [7, 14, 20]) {
    const key = `${x.ym}:${d}`;
    if (x.stampCount >= d && !next.stamp.includes(key)) {
      out.push(mk(LUNA.from, LUNA.fromName, `スタンプ ${d}こ！`,
        `${to}こんげつ ${d}にちも クイズを がんばったね！\nしまの 🗓️ から ごほうびを うけとってね。\nルナより`));
      next.stamp.push(key);
    }
  }
  if (x.stampCount >= 3 && !next.stamp.includes(`${x.ym}:3`)) next.stamp.push(`${x.ym}:3`);

  // ハロウィン：きかんに はじめて島を ひらいたとき（1年に1回）
  const year = String(now.getFullYear());
  if (x.halloween && next.halloween !== year) {
    out.push(mk(LUNA.from, LUNA.fromName, '🎃 ハロウィンが はじまったよ！',
      `${to}10がつ31にちまで、しまは ハロウィンだよ。\nゆうがたと よるに みんなを タップしてみてね。\n「トリック・オア・トリート！」で おかしが もらえるかも？\nルナより`));
    next.halloween = year;
  }

  // 名探偵あんり：あたらしい じけんが ひらいたら（1じけん 1かい）
  const told = next.detective ?? [];
  const fresh = (x.detectiveOpen ?? []).filter((n) => !told.includes(n));
  if (fresh.length) {
    const c = CASES.find((k) => k.no === Math.max(...fresh));
    if (c) {
      out.push(mk(LUNA.from, LUNA.fromName, `🚨 じけんです！「${c.title}」`,
        `${to}たいへん！ ${c.headline}
めいたんていの でばん だよ。
しまの「🔍 名探偵あんりの じけんぼ」から そうさしてね。
（その日 クイズを 5もん やると そうさ できるよ）
ルナより`));
    }
    next.detective = [...told, ...fresh];
  }

  // もしの しま：テストの 3日まえに うかんだら（1テスト 1かい）
  for (const mo of x.moshiOpen ?? []) {
    if ((next.moshi ?? []).includes(mo.key)) continue;
    out.push(mk(LUNA.from, LUNA.fromName, mo.extra ? `🎯 もしの しまに「${mo.name}」が とどいたよ！` : '📝 もしの しまが うかんできたよ！',
      mo.extra
        ? `${to}まちがえやすい ところを あつめた とくべつな もしだよ。
しまの 左下の うみの「もしの しま」で ちょうせんできるよ（あと ${mo.diff}にち）。
8わり こえるたびに 🪙${mo.rewards?.[0] ?? 40}まい！ にがてを やっつけよう。
ルナより`
        : `${to}${mo.name}まで ${mo.diff === 0 ? 'きょうが ほんばん' : `あと ${mo.diff}にち`}！
しまの 左下の うみに「もしの しま」が うかんだよ。
テストの はんいの もんだいに ちょうせんして、8わり こえるたびに メダル！\nふつうは 🪙80まい、かこもん いりの チャレンジは 🪙120まい だよ。
ルナより`));
    next.moshi = [...(next.moshi ?? []), mo.key].slice(-12);
  }

  // 日曜日：その週の まとめ（1週間に1回）
  const today = dateKey(now);
  if (now.getDay() === 0 && next.weekly !== today) {
    const k = x.weekDays;
    const msg = k >= 7 ? 'まいにち がんばったね！ ほんとうに すごい！'
      : k >= 4 ? 'たくさん がんばったね！ そのちょうし！'
      : k >= 1 ? 'がんばったね！ らいしゅうは もう1にち ふやしてみよう。'
      : 'らいしゅうは いっしょに がんばろうね。まってるよ。';
    out.push(mk(LUNA.from, LUNA.fromName, 'こんしゅうの がんばり',
      `${to}こんしゅうは ${k}にち クイズを がんばったよ（スタンプ ${k}こ）。\n${msg}\nルナより`));
    next.weekly = today;
  }

  return { letters: out, marks: next, gifts, newMonth };
}
