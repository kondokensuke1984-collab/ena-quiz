// 空のようす：時間帯・月の形・おてんき。確認用に ?hour=20 ?weather=rain で上書きできる。

export type TimeOfDay = 'day' | 'evening' | 'night';
export type Weather = 'sunny' | 'cloudy' | 'rain' | 'rainbow';

function q(name: string): string | null {
  return new URLSearchParams(location.search).get(name);
}

export function hourNow(d = new Date()): number {
  const h = Number(q('hour'));
  return q('hour') !== null && h >= 0 && h <= 23 ? h : d.getHours();
}

export function timeOfDay(d = new Date()): TimeOfDay {
  const h = hourNow(d);
  if (h >= 5 && h < 16) return 'day';
  if (h >= 16 && h < 18) return 'evening';
  return 'night';
}

const SYNODIC = 29.530588853;
const NEW_MOON_REF = Date.UTC(2000, 0, 6, 18, 14);   // 基準の新月

/** 月齢（0..29.5）。平均の周期で出すので、本当の月齢と1日くらいずれることがある。確認用に ?moonage=15 で上書きできる */
export function moonAge(d = new Date()): number {
  const q = Number(new URLSearchParams(location.search).get('moonage'));
  if (new URLSearchParams(location.search).has('moonage') && q >= 0 && q < SYNODIC) return q;
  const days = (d.getTime() - NEW_MOON_REF) / 86_400_000;
  return ((days % SYNODIC) + SYNODIC) % SYNODIC;
}

export function moonName(age: number): string {
  if (age < 1.8 || age >= 27.8) return 'しんげつ（新月）';
  if (age < 5.5) return 'みかづき（三日月）';
  if (age < 9.2) return 'じょうげんの月（上弦の月）';
  if (age < 13.8) return 'ふくらんでいく月';
  if (age < 16.2) return 'まんげつ（満月）';
  if (age < 20.5) return 'かけていく月';
  if (age < 24.2) return 'かげんの月（下弦の月）';
  return 'ありあけの月';
}

/** 本物の満月に近い夜かどうか（おだんごお供えの ごほうび判定に使う） */
export function isNearFull(age: number): boolean {
  return moonName(age) === 'まんげつ（満月）';
}

/** 光っている部分の形（中心0,0・半径r）。北半球の見え方：満ちていくときは右が光る */
export function moonLitPath(age: number, r: number): string {
  const p = age / SYNODIC;
  const k = Math.cos(2 * Math.PI * p);           // 1＝新月、-1＝満月
  const rx = Math.max(0.01, Math.abs(k) * r);
  const waxing = p < 0.5;
  if (waxing) {
    return `M0 ${-r} A${r} ${r} 0 0 1 0 ${r} A${rx} ${r} 0 0 ${k > 0 ? 0 : 1} 0 ${-r} Z`;
  }
  return `M0 ${-r} A${r} ${r} 0 0 0 0 ${r} A${rx} ${r} 0 0 ${k > 0 ? 1 : 0} 0 ${-r} Z`;
}

/** その日のおてんき（日付で決まるので1日同じ） */
export function weatherFor(dayKey: string): Weather {
  const w = q('weather');
  if (w === 'sunny' || w === 'cloudy' || w === 'rain' || w === 'rainbow') return w;
  let h = 7;
  for (const ch of dayKey) h = (h * 131 + ch.charCodeAt(0)) >>> 0;
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995) >>> 0; h ^= h >>> 15;
  const n = h % 100;
  if (n < 62) return 'sunny';
  if (n < 80) return 'cloudy';
  if (n < 95) return 'rain';
  return 'rainbow';
}
