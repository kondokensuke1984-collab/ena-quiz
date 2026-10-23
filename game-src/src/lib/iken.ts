// 🗳️ いけんばこ（api/iken.js）。書いたら すぐ みんなに 見える。けすのは 保護者の 合言葉で
import type { PlayerKey } from '../types';

export interface Iken { id: string; t: number; who: PlayerKey | ''; text: string }

export const IKEN_MAX = 120;
/** main の ポストの となり（割合） */
export const IKEN_POS = { x: 0.665, y: 0.71 };

// 学判などと おなじ 合言葉（js/edit_token.js と おなじ キー）
const TOKEN_KEY = 'ena_edit_token';
const getToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } };
const setToken = (v: string) => { try { if (v) localStorage.setItem(TOKEN_KEY, v); else localStorage.removeItem(TOKEN_KEY); } catch { /* 覚えられなくても 今回は つかう */ } };

export async function loadIken(): Promise<Iken[]> {
  const r = await fetch('/api/iken', { cache: 'no-store' });
  if (!r.ok) throw new Error('load ' + r.status);
  return ((await r.json()).items ?? []) as Iken[];
}

const ERR: Record<string, string> = {
  empty: 'なにか かいてね',
  'too long': `${IKEN_MAX}もじ までに してね`,
  url: 'URL（http や www）は かけないよ',
  'too many requests': 'たくさん かいたね！ すこし まってから また かいてね',
};

/** かいた いけんを いれる。だめなら 子ども向けの ことばで Error */
export async function postIken(who: PlayerKey | null, text: string): Promise<Iken> {
  let r: Response;
  try {
    r = await fetch('/api/iken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', who, text }),
    });
  } catch {
    throw new Error('インターネットに つながって いないみたい');
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(ERR[j.error] ?? 'うまく いれられなかったよ');
  return j.item as Iken;
}

/** 保護者が けす。合言葉は この端末で 1回 入れたら 覚える（ちがえば わすれて もう1回 きく） */
export async function deleteIken(id: string): Promise<boolean> {
  for (let i = 0; i < 2; i++) {
    let token = getToken();
    if (!token) {
      token = (prompt('保護者の 合言葉を 入れてください（この端末で 1回だけ）') || '').trim();
      if (!token) return false;
    }
    const r = await fetch('/api/iken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'del', id, token }),
    });
    if (r.status === 401) { setToken(''); alert('合言葉が ちがいます'); continue; }
    if (!r.ok) { alert('けせませんでした（' + r.status + '）'); return false; }
    setToken(token);
    return true;
  }
  return false;
}

export function ikenDate(t: number): string {
  const d = new Date(t);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}
