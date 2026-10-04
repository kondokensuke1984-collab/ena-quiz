// 🔒 テストまえの とくべつルール（2026-09-29 追加）。
// TEST_LOCK.player を 主人公に えらんでいる あいだ、until の日まで、毎日の入口条件（lib/study.ts）に くわえて
//   ① もしの しま（passKeys の どれか）で pct％ いじょう  または  ② rangeKey の はんいの 苦手問題が 0もん
// でないと 島に はいれない。until を すぎれば 自然に きえる。島は 読むだけ（書きこまない）。

import { useEffect, useState } from 'react';
import { loadTests } from './moshi';
import { eventToday } from './detective';
import { readJSON } from './storage';
import type { PlayerKey } from '../types';

export const TEST_LOCK = {
  player: 'anri' as PlayerKey,
  until: '2026-10-05',                                   // この日（テスト当日）まで
  rangeKey: '4ka_1005',                                  // 苦手を 見る はんい（data/tests.json の covers）
  passKeys: ['gakuryoku9', '4ka_1005', 'sansu9moshi'],   // 8わりを 数える もし
  pct: 80,
};

export interface TestLock {
  locked: boolean;
  loading: boolean;
  best: number;          // passKeys の さいこう点（％）
  pending: boolean;      // おわったけど まるつけ まち の もしが ある
  weak: number | null;   // はんいの 苦手の数（よめなければ null）
  byUnit: { label: string; n: number }[];
}

const OFF: TestLock = { locked: false, loading: false, best: 0, pending: false, weak: 0, byUnit: [] };

function isDev(): boolean {
  return /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
}

/** いま しばりの きかん中か（localhost は ?today= で 日付を かえられる） */
export function lockActive(player: PlayerKey | null, now = eventToday()): boolean {
  if (player !== TEST_LOCK.player) return false;
  if (isDev() && new URLSearchParams(location.search).get('unlock') === 'all') return false;
  const [y, m, d] = TEST_LOCK.until.split('-').map(Number);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today.getTime() <= new Date(y, m - 1, d).getTime();
}

/** もしの きろく（js/moshi.js の ena_moshi_v1）から さいこう点と まるつけ まち */
export function moshiBest(): { best: number; pending: boolean } {
  const db = readJSON<{ v?: number; tests?: Record<string, { best?: number; atts?: { finished?: boolean; pct?: number | null }[] }> }>('ena_moshi_v1', {});
  let best = 0, pending = false;
  for (const k of TEST_LOCK.passKeys) {
    const r = db.tests?.[k];
    if (!r) continue;
    best = Math.max(best, Number(r.best) || 0);
    (r.atts || []).forEach((a) => {
      if (a.pct != null) best = Math.max(best, Number(a.pct) || 0);
      else if (a.finished) pending = true;
    });
  }
  return { best, pending };
}

interface Sub { label?: string; parent?: string }
interface Q { id?: string; subject?: string }

const cacheJSON: Record<string, Promise<unknown>> = {};
function getJSON<T>(url: string): Promise<T | null> {
  cacheJSON[url] ??= fetch(url, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  return cacheJSON[url] as Promise<T | null>;
}

/** はんいの 問題ID → 単元（いちばん上の単元）の名前 */
async function rangeQuestions(): Promise<Map<string, string> | null> {
  const t = (await loadTests()).find((x) => x.key === TEST_LOCK.rangeKey);
  if (!t) return null;
  const [subs, qs] = await Promise.all([
    getJSON<Record<string, Sub>>(`/data/subjects_${t.month}.json`),
    getJSON<Q[]>(`/data/questions_${t.month}.json`),
  ]);
  if (!subs || !Array.isArray(qs)) return null;
  const root = (k: string) => { let g = 0; while (subs[k]?.parent && g++ < 5) k = subs[k].parent!; return k; };
  const cov = new Set(t.covers);
  const out = new Map<string, string>();
  for (const q of qs) {
    if (!q.id || !q.subject) continue;
    const r = root(q.subject);
    if (cov.has(q.subject) || cov.has(r)) out.set(q.id, subs[r]?.label || r);
  }
  return out;
}

/** クイズの 苦手（ena_wrong_<YYYYMM>）の うち、はんいに あるもの */
function weakIn(range: Map<string, string>): { weak: number; byUnit: { label: string; n: number }[] } {
  const ids = new Set<string>();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      if (!/^ena_wrong_\d{6}$/.test(k)) continue;
      const arr = readJSON<unknown>(k, []);
      if (Array.isArray(arr)) arr.forEach((id) => typeof id === 'string' && range.has(id) && ids.add(id));
    }
  } catch { /* よめなければ 0 */ }
  const per = new Map<string, number>();
  ids.forEach((id) => { const l = range.get(id)!; per.set(l, (per.get(l) || 0) + 1); });
  return { weak: ids.size, byUnit: [...per].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n) };
}

export function useTestLock(player: PlayerKey | null): TestLock {
  const active = lockActive(player);
  const [range, setRange] = useState<Map<string, string> | null | undefined>(undefined);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!active) return;
    let alive = true;
    rangeQuestions().then((r) => { if (alive) setRange(r); });
    return () => { alive = false; };
  }, [active]);

  // クイズや もしから もどったときに 読みなおす
  useEffect(() => {
    if (!active) return;
    const re = () => { if (!document.hidden) setTick((n) => n + 1); };
    window.addEventListener('focus', re);
    window.addEventListener('storage', re);
    document.addEventListener('visibilitychange', re);
    return () => {
      window.removeEventListener('focus', re);
      window.removeEventListener('storage', re);
      document.removeEventListener('visibilitychange', re);
    };
  }, [active]);

  if (!active) return OFF;
  void tick;
  const { best, pending } = moshiBest();
  const passMoshi = best >= TEST_LOCK.pct;
  if (range === undefined) return { ...OFF, locked: !passMoshi, loading: !passMoshi, best, pending, weak: null };
  const w = range ? weakIn(range) : null;
  const passWeak = w !== null && w.weak === 0;
  return { locked: !passMoshi && !passWeak, loading: false, best, pending, weak: w ? w.weak : null, byUnit: w ? w.byUnit : [] };
}
