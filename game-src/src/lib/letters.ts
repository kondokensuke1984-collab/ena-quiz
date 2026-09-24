// キャラからの おてがみ。島を開いたときに「前回からの変化」を見て作る。
// 文面は子ども向けに ひらがな多め。

import type { Letter, LetterMarks } from '../types';
import type { Friend } from './friends';
import { dateKey } from './study';

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
  now?: Date;
}

export function buildLetters(marks: LetterMarks, x: LetterInput): { letters: Letter[]; marks: LetterMarks } {
  const now = x.now ?? new Date();
  const to = x.playerName ? `${x.playerName}へ\n` : '';
  const next: LetterMarks = {
    init: true,
    lv: { ...marks.lv },
    full: { ...marks.full },
    stamp: [...marks.stamp],
    weekly: marks.weekly,
    halloween: marks.halloween,
  };
  const out: Letter[] = [];

  // はじめて：いまの様子を覚えるだけ（前からの成長で手紙がどっと届かないように）。ようこその1通だけ
  if (!marks.init) {
    x.friends.forEach((f) => {
      next.lv[f.id] = f.level;
      if (f.total > 0 && f.n >= f.total) next.full[f.id] = true;
    });
    [3, 7, 14, 20].forEach((d) => { if (x.stampCount >= d) next.stamp.push(`${x.ym}:${d}`); });
    next.weekly = dateKey(now);
    out.push(mk(LUNA.from, LUNA.fromName, 'しまへ ようこそ！',
      `${to}しまの ポストだよ。\nクイズを がんばると、しまの なかまから おてがみが とどくよ。\nたのしみに まっててね！\nルナより`));
    return { letters: out, marks: next };
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

  return { letters: out, marks: next };
}
