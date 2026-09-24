// クイズアプリの「きょう何問といたか」の記録を読むだけのモジュール（書き込まない）。
// クイズ側は ena_daily_<月>_<YYYY-M-D> に { answered, correct } を保存している。

import { readJSON } from './storage';

export const STAMP_MIN = 5;   // この問題数いじょう答えた日が スタンプ1つ

/** クイズと同じ形の日付キー（ゼロうめなし）。例 2026-9-21 */
export function dateKey(d = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/** 日付ごとの答えた数（ぜんぶの月を合計） */
export function answeredByDate(): Record<string, number> {
  const out: Record<string, number> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      const m = /^ena_daily_.+_(\d{4}-\d{1,2}-\d{1,2})$/.exec(k);
      if (!m) continue;
      const n = Number(readJSON<{ answered?: number }>(k, {}).answered) || 0;
      if (n > 0) out[m[1]] = (out[m[1]] || 0) + n;
    }
  } catch { /* 読めなければ 0 日 */ }
  return out;
}

/** その月の、スタンプがもらえた日（1..31） */
export function stampDays(year: number, month1: number, by = answeredByDate()): number[] {
  const days: number[] = [];
  for (let d = 1; d <= 31; d++) {
    if ((by[`${year}-${month1}-${d}`] || 0) >= STAMP_MIN) days.push(d);
  }
  return days;
}

export function studiedToday(by = answeredByDate()): boolean {
  return (by[dateKey()] || 0) >= STAMP_MIN;
}

/** その週（月曜はじまり）に勉強した日数 */
export function daysThisWeek(now = new Date(), by = answeredByDate()): number {
  const start = new Date(now);
  start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  let n = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d > now) break;
    if ((by[dateKey(d)] || 0) >= STAMP_MIN) n++;
  }
  return n;
}

/** 島の入口：その日に この数の教科で、単元を1つずつ 最後まで といたら ひらく（クイズの ISLAND_UNLOCK_CATS と おなじ） */
export const UNLOCK_CATS = 2;

/** 今日 単元を最後まで といた教科（クイズが ena_daily_*_<今日> の units に書く） */
export function todayUnits(now = new Date()): { cats: string[]; unlocked: boolean } {
  const day = dateKey(now);
  const cats = new Set<string>();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      if (!k.startsWith('ena_daily_') || !k.endsWith('_' + day)) continue;
      const units = readJSON<{ units?: Record<string, string> }>(k, {}).units;
      if (units && typeof units === 'object') Object.values(units).forEach((c) => typeof c === 'string' && cats.add(c));
    }
  } catch { /* 読めなければ 0 教科 */ }
  // 確認用：localhost だけ ?unlock=1 で ひらく
  const dev = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).get('unlock') === '1';
  return { cats: [...cats], unlocked: dev || cats.size >= UNLOCK_CATS };
}
