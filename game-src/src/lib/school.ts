// しゅじんこう（だれが あそんでいるか）から、クイズアプリの「がっこう」を決める。
// クイズアプリ（index.html）は ena_school_v1 を読んで、がっこう選びを とばす。
// あんり＝ena、りの＝栄光、ゆうせい＝2年生 は きまり。けんすけ・みつきは えらぶ。

import { writeJSON } from './storage';
import type { PlayerKey, School } from '../types';

export const SCHOOLS: School[] = ['ena', 'eikoh', 'g2'];

export const SCHOOL_LABEL: Record<School, string> = { ena: 'ena', eikoh: '栄光', g2: '2年生' };

export const FIXED_SCHOOL: Partial<Record<PlayerKey, School>> = { anri: 'ena', rino: 'eikoh', yusei: 'g2' };

const SHARED_KEY = 'ena_school_v1';

export function isSchool(x: unknown): x is School {
  return typeof x === 'string' && (SCHOOLS as string[]).includes(x);
}

/** きまっている キャラは そのがっこう、ほかは えらんだもの（なければ null） */
export function resolveSchool(player: PlayerKey | null, chosen: School | null | undefined): School | null {
  if (!player) return null;
  return FIXED_SCHOOL[player] ?? (isSchool(chosen) ? chosen : null);
}

/** クイズアプリと共有するキーに 書く。がっこうが きまっていなければ 消す */
export function publishSchool(player: PlayerKey | null, school: School | null): void {
  try {
    if (!player || !school) { localStorage.removeItem(SHARED_KEY); return; }
  } catch { return; }
  writeJSON(SHARED_KEY, { v: 1, school, player, at: Date.now() });
}
