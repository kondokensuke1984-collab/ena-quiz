// はたけ：うえた日から「クイズを5もん やった日」が GROW_DAYS 日に なったら しゅうかく。
// そだち具合は クイズの記録から毎回 計算する（保存しない＝書きわすれで とまらない）。

import type { FarmPlot } from '../types';
import { answeredByDate, dateKey, STAMP_MIN } from './study';

export const GROW_DAYS = 3;
export const CROP_COUNT = 2;
export const FARM_POS = { x: 0.47, y: 0.84 };   // はたけの まんなか（割合）
export const PLOT_DX = 0.075;                   // うね どうしの 間

function parse(key: string): Date | null {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(key);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

/** うえた日から今日までで、クイズを5もん いじょう やった日の数（GROW_DAYS で とめる） */
export function grownDays(plot: FarmPlot, by = answeredByDate(), now = new Date()): number {
  const start = parse(plot.at);
  if (!start) return 0;
  const today = dateKey(now);
  let n = 0;
  const d = new Date(start);
  for (let i = 0; i < 120 && n < GROW_DAYS; i++) {
    if ((by[dateKey(d)] || 0) >= STAMP_MIN) n++;
    if (dateKey(d) === today) break;
    d.setDate(d.getDate() + 1);
  }
  return n;
}

export const STAGE_NAME = ['たね', 'め', 'つぼみ', 'できた！'];
