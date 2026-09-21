// アンリノメダルの「消費台帳」。
// 獲得台帳（ena_anrino_medals）は減らないので、残高は 獲得 − 消費 で出す。

import { readJSON, writeJSON } from './storage';
import { earnedTotal } from './medals';

const SPENT_KEY = 'ena_island_spent_v1';
const SPENT_BAK = 'ena_island_spent_v1_bak';
const LOG_LIMIT = 200;

export interface SpendEntry {
  at: number;
  n: number;
  reason: string;
}

export interface SpendLedger {
  v: 1;
  total: number;
  log: SpendEntry[];
}

const EMPTY: SpendLedger = { v: 1, total: 0, log: [] };

function normalize(raw: unknown): SpendLedger | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Partial<SpendLedger>;
  const total = Number(o.total);
  if (!Number.isFinite(total) || total < 0) return null;
  return {
    v: 1,
    total: Math.floor(total),
    log: Array.isArray(o.log) ? o.log.slice(0, LOG_LIMIT) : [],
  };
}

export function loadSpent(): SpendLedger {
  // 壊れていたらバックアップを試し、それもダメなら 0（＝メダルを返す方向に倒す）。
  // 子ども向けなので、ショップが固まるより返しすぎるほうがまし。
  return (
    normalize(readJSON<unknown>(SPENT_KEY, null)) ??
    normalize(readJSON<unknown>(SPENT_BAK, null)) ?? { ...EMPTY }
  );
}

export function spentTotal(): number {
  return loadSpent().total;
}

export function balance(): number {
  return Math.max(0, earnedTotal() - loadSpent().total);
}

export type SpendResult =
  | { ok: true; spent: number; balance: number }
  | { ok: false; code: 'invalid' | 'insufficient' | 'write_failed'; balance: number };

/**
 * メダルを使う。
 * 書き込む直前に localStorage を読み直すので、画面の状態が古くても
 * タブが2つ開いていても、残高以上に使われることはない。
 */
export function spend(n: number, reason: string): SpendResult {
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    return { ok: false, code: 'invalid', balance: balance() };
  }

  const earned = earnedTotal();
  const ledger = loadSpent();
  const bal = Math.max(0, earned - ledger.total);
  if (n > bal) return { ok: false, code: 'insufficient', balance: bal };

  const next: SpendLedger = {
    v: 1,
    total: ledger.total + n,
    log: [{ at: Date.now(), n, reason }, ...ledger.log].slice(0, LOG_LIMIT),
  };

  if (!writeJSON(SPENT_KEY, next)) {
    return { ok: false, code: 'write_failed', balance: bal };
  }
  writeJSON(SPENT_BAK, next); // ミラー。失敗しても購入自体は成立させる

  return { ok: true, spent: n, balance: Math.max(0, earned - next.total) };
}

export function isSpentKey(key: string | null): boolean {
  return key === SPENT_KEY;
}
