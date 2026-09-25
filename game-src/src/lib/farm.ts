// はたけ：うえた日から「クイズを5もん やった日」で そだつ。
// そだち具合は クイズの記録から毎回 計算する（保存しない＝書きわすれで とまらない）。
// 理科の「発芽の3条件（水・空気・温度）」「成長の5条件（＋日光・肥料）」を おせわで たいけんする。
//   ・はつが：うえたあと 水を1回 あげた日から 数える（イネは 田んぼなので いらない）。適温でない月は 1日よけいに かかる。
//   ・はつがの あと：日光（はこを かぶせない）・肥料（1回いじょう）・水（2日いじょう）が そろうと げんき。
//     たりないと ひょろひょろ（でも しゅうかくは できる）。

import type { FarmPlot } from '../types';
import { answeredByDate, dateKey, STAMP_MIN } from './study';
import { MONTH_TEMP, PLANT_BY_SEED, type PlantDef } from './plants';

export const GROW_DAYS = 3;       // むかしの たね（おはな・かぼちゃ）
export const PLANT_DAYS = 4;      // たね → はつが → ほんば → はな → み
export const CROP_COUNT = 2;
export const FARM_POS = { x: 0.47, y: 0.84 };   // はたけの まんなか（割合）
export const PLOT_DX = 0.075;                   // うね どうしの 間

function parse(key: string): Date | null {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(key);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

/** start の日から今日までで、クイズを5もん いじょう やった日の数（max で とめる） */
function studyDaysFrom(startKey: string, max: number, by: Record<string, number>, now: Date): number {
  const start = parse(startKey);
  if (!start) return 0;
  const today = dateKey(now);
  let n = 0;
  const d = new Date(start);
  for (let i = 0; i < 120 && n < max; i++) {
    if ((by[dateKey(d)] || 0) >= STAMP_MIN) n++;
    if (dateKey(d) === today) break;
    d.setDate(d.getDate() + 1);
  }
  return n;
}

/** むかしの たね用：うえた日から数える（GROW_DAYS で とめる） */
export function grownDays(plot: FarmPlot, by = answeredByDate(), now = new Date()): number {
  return studyDaysFrom(plot.at, GROW_DAYS, by, now);
}

export function plantOf(plot: FarmPlot | null): PlantDef | undefined {
  return plot ? PLANT_BY_SEED[plot.seed] : undefined;
}

/** その月の 気温が 発芽の 適温に あうか（±3℃は おまけ） */
export function tempOk(p: PlantDef, month = new Date().getMonth() + 1): boolean {
  const t = MONTH_TEMP[month] ?? 20;
  return t >= p.temp[0] - 3 && t <= p.temp[1] + 3;
}

/** はつがに ひつような 勉強の日数（適温なら 1、そうでなければ 2） */
export function germDays(p: PlantDef, month?: number): number {
  return tempOk(p, month) ? 1 : 2;
}

/** ステージの さいご（しゅうかく できる） */
export function ripeStage(plot: FarmPlot): number {
  return plantOf(plot) ? PLANT_DAYS : GROW_DAYS;
}

/**
 * いまの ステージ。
 * しょくぶつ：0 たね／1 はつが／2 ほんば／3 はな／4 み。むかしの たね：0..3。
 */
export function stageOf(plot: FarmPlot, by = answeredByDate(), now = new Date()): number {
  const p = plantOf(plot);
  if (!p) return grownDays(plot, by, now);
  if (!plot.wetAt) return 0;                         // 水が ないと はつが しない
  const g = germDays(p, (parse(plot.at) ?? now).getMonth() + 1);
  const n = studyDaysFrom(plot.wetAt, g + PLANT_DAYS - 1, by, now);
  return n < g ? 0 : Math.min(PLANT_DAYS, 1 + (n - g));
}

export function isRipe(plot: FarmPlot | null, stage: number): boolean {
  return !!plot && stage >= ripeStage(plot);
}

export interface Health { sun: boolean; fert: boolean; water: boolean }

/** 成長の条件が そろっているか（はつがの あとに 見る） */
export function healthOf(plot: FarmPlot): Health {
  const p = plantOf(plot);
  const fert = plot.fert ?? [];
  const needWater = fert.includes('k') ? 1 : 2;
  return {
    sun: !plot.box,
    fert: fert.length > 0,
    water: !!p?.paddy || (plot.wetDays ?? 0) >= needWater,
  };
}

export function missingOf(h: Health): number {
  return (h.sun ? 0 : 1) + (h.fert ? 0 : 1) + (h.water ? 0 : 1);
}

/** しゅうかくの 数と、たねが もどるか */
export function harvestOf(plot: FarmPlot): { count: number; seedBack: boolean } {
  const p = plantOf(plot);
  if (!p) return { count: CROP_COUNT, seedBack: false };
  const miss = missingOf(healthOf(plot));
  let count = miss === 0 ? 3 : miss === 1 ? 2 : 1;
  const fert = plot.fert ?? [];
  if (fert.includes('p') && p.type !== 'tuber') count++;
  if (fert.includes('k') && p.type === 'tuber') count++;
  return { count, seedBack: miss === 0 };
}

export const STAGE_NAME = ['たね', 'め', 'つぼみ', 'できた！'];
export const PLANT_STAGE_NAME = ['たね', 'はつが', 'ほんば', 'はな', 'しゅうかく！'];

/** うねの 1行 まめちしき（ステージごと） */
export function stageTip(p: PlantDef, stage: number, plot: FarmPlot): string {
  if (stage === 0) {
    if (!plot.wetAt) return '💧 みずを あげると はつがの じゅんびが はじまるよ（はつがには 水・くうき・ちょうどいい 温度）';
    if (!tempOk(p)) return `🌡️ ${p.name}は ${p.temp[0]}〜${p.temp[1]}℃が すき。いまは すこし あわないから ゆっくり はつが するよ`;
    if (p.lightGerm) return '☀️ この たねは はつがに 光が いるよ。つちは うすく かけたよ';
    return '🌱 たねの 中で はつがの じゅんび中。日光や ひりょうは まだ いらないよ';
  }
  if (stage === 1) {
    if (p.type === 'tuber') return `🥔 ${p.grows.replace(/（.*/, '')}から 芽と 根が でたよ`;
    if (p.type === 'bulb') return '🧅 きゅうこんから 根と 芽が でたよ';
    if (!p.rootFirst) return '💧 水の中では 子葉が さきに でて、そのあと 根が でるよ';
    if (!p.epigeal) return '🫛 根が でたよ。子葉は 土の中に のこって ようぶんを おくるよ';
    return `🌱 まず 根が でて、${p.cotyledons === 1 ? 'ほそながい 子葉が 1まい' : '子葉が 2まい'} でたよ`;
  }
  if (stage === 2) return '☀️ ここからは 日光と ひりょうも いるよ（成長の 5つの 条件）';
  if (stage === 3) {
    return p.pollen === 'wind' ? '🍃 はなが さいた！ かぜが 花粉を はこぶよ'
      : p.pollen === 'self' ? '🌼 はなが さいた！ じぶんの 花粉が めしべに つくよ'
      : '🐝 はなが さいた！ こんちゅうが 花粉を はこぶよ';
  }
  return '🧺 みが できた！ しゅうかく しよう';
}
