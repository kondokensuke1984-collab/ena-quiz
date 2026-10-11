// 📦 ひきつぎコード：この端末の ANRINO の きろく（島・クイズ・メダル・サッカー など）を まるごと
// 1本の 文字列にして、べつの iPad（や ホーム画面の アプリ）へ うつす。
// ANRINO は 1つの サイトなので、localStorage を ぜんぶ はこべば もれが ない。

import { safeGet, safeSet } from './storage';
import { medalTotalInDump } from './medals';

const PREFIX = 'ANRINO1:';
/** よみこむ まえの 島の セーブ（まちがえて よみこんだときに 手で もどせるように） */
const BACKUP_KEY = 'ena_transfer_backup';
const ISLAND_KEY = 'ena_island_save_v1';

type Dump = { at: number; keys: Record<string, string> };

export interface TransferSummary {
  at: number;
  keys: number;
  player: string | null;
  buildings: number;
  medals: number;
}

function allKeys(): string[] {
  const out: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k !== BACKUP_KEY) out.push(k);
    }
  } catch { /* よめない ブラウザ */ }
  return out;
}

function dumpNow(): Dump {
  const keys: Record<string, string> = {};
  for (const k of allKeys()) {
    const v = safeGet(k);
    if (v !== null) keys[k] = v;
  }
  return { at: Date.now(), keys };
}

function toB64url(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(txt: string): Uint8Array {
  const b = atob(txt.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const buf = await new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream)).arrayBuffer();
  return new Uint8Array(buf);
}

/** いまの きろくを コードに する */
export async function exportCode(): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(dumpNow()));
  return PREFIX + toB64url(await pipe(json, new CompressionStream('gzip')));
}

/** コードを ほどく（まちがった コードなら null） */
export async function parseCode(code: string): Promise<Dump | null> {
  const body = code.replace(/\s+/g, '');
  if (!body.startsWith(PREFIX)) return null;
  try {
    const raw = await pipe(fromB64url(body.slice(PREFIX.length)), new DecompressionStream('gzip'));
    const d = JSON.parse(new TextDecoder().decode(raw)) as Dump;
    if (!d || typeof d !== 'object' || !d.keys || typeof d.keys !== 'object') return null;
    if (Object.values(d.keys).some((v) => typeof v !== 'string')) return null;
    return d;
  } catch {
    return null;
  }
}

/** 「だれの きろくか」を 見せる ための まとめ */
export function summarize(d: Dump): TransferSummary {
  let player: string | null = null, buildings = 0, medals: number;
  try {
    const s = JSON.parse(d.keys[ISLAND_KEY] ?? 'null');
    if (s && typeof s === 'object') {
      player = typeof s.player === 'string' ? s.player : null;
      buildings = Array.isArray(s.buildings) ? s.buildings.length : 0;
    }
  } catch { /* 島の きろくなし */ }
  medals = medalTotalInDump(d.keys);
  return { at: d.at, keys: Object.keys(d.keys).length, player, buildings, medals };
}

/**
 * コードの きろくで この端末を おきかえる（よびだしたあと すぐ location.reload() する）。
 * じゅんばん：あたらしい きろくを ぜんぶ 書く → うまく いったら コードに ない 古い きろくを けす。
 * 入りきらなければ 古い きろくを けしてから もう1回。それでも だめなら 書くまえに もどして false。
 * 島の セーブだけは BACKUP_KEY に 1つ まえの ぶんを のこす（まるごとの コピーは 容量を 2ばいに するので しない）。
 */
export function applyDump(d: Dump): boolean {
  const before = dumpNow();
  // 島の セーブは rev を いまより 大きく して、ひらいている 画面が 古いセーブで 上書きしないように
  const keys = { ...d.keys };
  try {
    const s = JSON.parse(keys[ISLAND_KEY] ?? 'null');
    const cur = JSON.parse(before.keys[ISLAND_KEY] ?? 'null');
    if (s && typeof s === 'object') {
      s.rev = Math.max(Number(s.rev) || 0, Number(cur?.rev) || 0) + 1;
      keys[ISLAND_KEY] = JSON.stringify(s);
    }
  } catch { /* そのまま */ }

  const stale = Object.keys(before.keys).filter((k) => !(k in keys));
  const remove = (ks: string[]) => { for (const k of ks) try { localStorage.removeItem(k); } catch { /* つづける */ } };
  const writeAll = () => Object.entries(keys).filter(([k, v]) => !safeSet(k, v)).map(([k]) => k);

  try { localStorage.removeItem(BACKUP_KEY); } catch { /* なくても よい */ }
  let failed = writeAll();
  remove(stale);
  if (failed.length) failed = failed.filter((k) => !safeSet(k, keys[k]));
  if (failed.length) {
    // もとに もどす：コードで ふえた キーを けしてから、まえの きろくを 書きもどす
    remove(Object.keys(keys).filter((k) => !(k in before.keys)));
    for (const [k, v] of Object.entries(before.keys)) safeSet(k, v);
    return false;
  }
  if (before.keys[ISLAND_KEY]) safeSet(BACKUP_KEY, before.keys[ISLAND_KEY]);
  return true;
}

/** このブラウザで つかえるか（とても古い iPad の Safari は CompressionStream が ない） */
export function transferSupported(): boolean {
  return typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';
}
