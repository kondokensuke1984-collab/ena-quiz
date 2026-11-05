// 🎅 サンタさんへの おねがい（api/santa.js）。おくると 保護者の 2人に メールで とどく
import type { PlayerKey } from '../types';

export const SANTA_MAX = 100;

const ERR: Record<string, string> = {
  empty: 'ほしいものを かいてね',
  'too long': `${SANTA_MAX}もじ までに してね`,
  url: 'URL（http や www）は かけないよ',
  'too many requests': 'きょうは たくさん おくったね！ また あした',
  mail: 'うまく とどかなかったよ。もういちど おくってね',
  who: 'さきに しゅじんこうを えらんでね',
};

/** サンタさんに おねがいを おくる。だめなら 子ども向けの ことばで Error */
export async function postSanta(who: PlayerKey | null, text: string): Promise<void> {
  if (!who) throw new Error(ERR.who);
  let r: Response;
  try {
    r = await fetch('/api/santa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ who, text }),
    });
  } catch {
    throw new Error('インターネットに つながって いないみたい');
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(ERR[j.error] ?? 'うまく おくれなかったよ');
}
