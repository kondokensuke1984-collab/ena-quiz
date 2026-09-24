// きせつの イベント。いまは ハロウィン（10/24〜10/31）だけ。確認用に ?halloween=1 で いつでも出せる。

import { timeOfDay } from './sky';

export function isHalloween(d = new Date()): boolean {
  if (new URLSearchParams(location.search).get('halloween') === '1') return true;
  return d.getMonth() === 9 && d.getDate() >= 24;
}

/** ハロウィンの ばん（夕方と夜）。かそう・おかし・ランタンが光るのは このとき */
export function halloweenNight(d = new Date()): boolean {
  return isHalloween(d) && timeOfDay(d) !== 'day';
}

const COSTUMES = ['👻', '🧙', '🦇', '🎃'];
/** キャラごとに きまった かそう（毎年おなじ） */
export function costumeOf(charKey: string): string {
  let h = 0;
  for (const c of charKey) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return COSTUMES[h % COSTUMES.length];
}
