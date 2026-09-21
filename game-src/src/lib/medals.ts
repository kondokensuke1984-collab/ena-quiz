// クイズアプリ（index.html）が持つアンリノメダルの「獲得台帳」を読むだけのモジュール。
//
// ★このファイルは読み取り専用。書き込み関数を作ってはいけない。
//   キー文字列 'ena_anrino_medals' もこのファイルの外に出さない。
//   誤って書き込むと、クイズ側の獲得実績（減らない台帳）が壊れる。
//
// 台帳の形： { "units": { "<月>|<単元キー>": 枚数 } }   例) {"units":{"202609|nougyou2_kakomon":3}}
// index.html:15596-15616 の loadMedalLedger / medalTotal と同じ読み方をしている。

import { readJSON } from './storage';

const MEDAL_KEY = 'ena_anrino_medals';

interface MedalLedger {
  units: Record<string, number>;
}

function loadLedger(): MedalLedger {
  const raw = readJSON<unknown>(MEDAL_KEY, null);
  if (!raw || typeof raw !== 'object') return { units: {} };
  const units = (raw as { units?: unknown }).units;
  if (!units || typeof units !== 'object' || Array.isArray(units)) return { units: {} };
  return { units: units as Record<string, number> };
}

/** 壊れた値（NaN・負数・文字列）は 0 として無視して合計する */
export function earnedTotal(): number {
  const units = loadLedger().units;
  let sum = 0;
  for (const key of Object.keys(units)) {
    const n = Number(units[key]);
    if (Number.isFinite(n) && n > 0) sum += Math.floor(n);
  }
  return sum;
}

/** 月ごとの獲得枚数（キーの "|" より前が月ID） */
export function earnedByMonth(month: string): number {
  const units = loadLedger().units;
  let sum = 0;
  for (const key of Object.keys(units)) {
    if (key.split('|')[0] !== month) continue;
    const n = Number(units[key]);
    if (Number.isFinite(n) && n > 0) sum += Math.floor(n);
  }
  return sum;
}

/** storage イベントの購読側で「メダルが増えたか」を判定するのに使う */
export function isMedalKey(key: string | null): boolean {
  return key === MEDAL_KEY;
}
