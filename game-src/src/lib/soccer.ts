// アンリノ島 ⇄ サッカー（/soccer/。もとは midorigaoka-soccer）。
// サッカーは しあいの けっかを ena_soccer_results_v1 に のこすだけ（メダルの台帳には 書かない）。
// 島を ひらいたときに ここで 読んで ごほうびにし、claimed を つけて 書きもどす。
// メダルは grantBonus（'<月>|bonus:soccer:…'。同じ id は 2回 もらえないので、書きもどしに しっぱいしても ふえすぎない）。

import { readJSON, writeJSON } from './storage';
import { bonusCount, grantBonus } from './medals';

const RESULTS_KEY = 'ena_soccer_results_v1';
export const SOCCER_WIN_MEDALS = 5;     // 1しあい かつと（しあいけんは 10まい）
export const SOCCER_CUP_MEDALS = 20;    // たいかいで ゆうしょう（たいかいけんは 20まい）
export const SOCCER_WINS_PER_DAY = 3;   // かちの メダルは 1日 この しあい数まで
export const SOCCER_REWARD_ITEMS = ['fn_soccer_trophy', 'fn_soccer_ball'];   // はじめて ゆうしょうした ごほうび

interface SoccerResult { id: string; at: number; win: boolean; cupWon?: boolean; claimed?: boolean }
export interface SoccerClaim { medals: number; wins: number; cups: number; capped: number }

const pad = (n: number) => String(n).padStart(2, '0');

/** ゆうしょうした かいすう（ピッチの トロフィーの 数） */
export function soccerCups(): number {
  return bonusCount('soccer:cup:');
}

/** まだ うけとっていない しあいの ごほうびを メダルに する。なにも なければ null */
export function claimSoccerResults(): SoccerClaim | null {
  const raw = readJSON<unknown>(RESULTS_KEY, null);
  const list = raw && typeof raw === 'object' && Array.isArray((raw as { list?: unknown }).list)
    ? ((raw as { list: SoccerResult[] }).list) : null;
  if (!list) return null;
  const out: SoccerClaim = { medals: 0, wins: 0, cups: 0, capped: 0 };
  let changed = false;
  for (const r of list) {
    if (!r || typeof r !== 'object' || r.claimed || typeof r.id !== 'string') continue;
    r.claimed = true;
    changed = true;
    const d = new Date(Number(r.at) || Date.now());
    const month = `${d.getFullYear()}${pad(d.getMonth() + 1)}`, day = month + pad(d.getDate());
    if (r.win) {
      if (bonusCount(`soccer:win:${day}:`) >= SOCCER_WINS_PER_DAY) out.capped++;
      else if (grantBonus(`soccer:win:${day}:${r.id}`, month, SOCCER_WIN_MEDALS) === 'ok') { out.medals += SOCCER_WIN_MEDALS; out.wins++; }
    }
    if (r.cupWon && grantBonus(`soccer:cup:${r.id}`, month, SOCCER_CUP_MEDALS) === 'ok') { out.medals += SOCCER_CUP_MEDALS; out.cups++; }
  }
  if (changed) writeJSON(RESULTS_KEY, { ...(raw as object), list });
  return out.medals || out.capped ? out : null;
}
