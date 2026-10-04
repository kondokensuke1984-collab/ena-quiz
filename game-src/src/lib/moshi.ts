// 📝 もしの しま：塾のテストの 3日まえ〜当日だけ、main の 左下の海に うかぶ。
// テストの日程は /data/tests.json（tools_extract_202609.py が クイズの TEST_KEYS から作る）。
// 日付は クイズで ✏️ すると 'ena_test_<key>' に入るので そちらを優先（rpg.html の js/moshi.js と同じ きまり）。
// 模試そのもの・メダルは rpg.html（/rpg.html#moshi）。島は 読むだけ。

import { useEffect, useState } from 'react';
import { eventToday } from './detective';

export interface MoshiTest {
  key: string; name: string; month: string; date: string; covers: string[];
  /** れんしゅうもし（index.html の MOSHI_EXTRA）：from〜date に うかぶ・メダルは reward・レベルは levels */
  extra?: boolean; from?: string; reward?: number; levels?: ('normal' | 'kako')[];
}
export interface MoshiNow { test: MoshiTest; diff: number; date: Date }

export const MOSHI_WINDOW = 3;
/** 8わりを こえるたびに もらえる メダル（ふつう＝過去問演習なし／チャレンジ＝過去問演習いり）。js/moshi.js の MOSHI_LEVELS と そろえる */
export const MOSHI_REWARD = { normal: 80, kako: 120 };

let cache: Promise<MoshiTest[]> | null = null;
export function loadTests(): Promise<MoshiTest[]> {
  cache ??= fetch('/data/tests.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => (j && Array.isArray(j.tests) ? (j.tests as MoshiTest[]) : []))
    .catch(() => []);
  return cache;
}

export function testDate(t: MoshiTest): Date {
  let s = '';
  try { s = localStorage.getItem('ena_test_' + t.key) || ''; } catch { /* よめなくても もとの日 */ }
  const [y, m, d] = (/^\d{4}-\d{2}-\d{2}$/.test(s) ? s : t.date).split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** そのもしで えらべる レベルと メダル（js/moshi.js の moshiLevels・moshiReward と そろえる） */
export function moshiRewards(t: MoshiTest): { lv: 'normal' | 'kako'; reward: number }[] {
  const lvs = t.levels?.length ? t.levels : (['normal', 'kako'] as const);
  return lvs.map((lv) => ({ lv, reward: t.reward ?? MOSHI_REWARD[lv] }));
}

/** いま うかんでいる もし（近い順）。テスト＝3日まえ〜当日、れんしゅうもし＝from〜date */
export function activeMoshis(tests: MoshiTest[], now = eventToday()): MoshiNow[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const out: MoshiNow[] = [];
  for (const t of tests) {
    const date = testDate(t);
    const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
    let ok = diff >= 0 && diff <= MOSHI_WINDOW;
    if (t.from && /^\d{4}-\d{2}-\d{2}$/.test(t.from)) {
      const [y, m, d] = t.from.split('-').map(Number);
      ok = diff >= 0 && today.getTime() >= new Date(y, m - 1, d).getTime();
    }
    if (ok) out.push({ test: t, diff, date });
  }
  return out.sort((a, b) => a.diff - b.diff);
}

/** いま うかんでいる もし（なければ 空）。島を ひらいたときに 1回 よむ */
export function useMoshis(): MoshiNow[] {
  const [m, setM] = useState<MoshiNow[]>([]);
  useEffect(() => {
    let alive = true;
    loadTests().then((ts) => { if (alive) setM(activeMoshis(ts)); });
    return () => { alive = false; };
  }, []);
  return m;
}
