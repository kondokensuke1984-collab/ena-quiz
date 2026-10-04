// やきいも やたい：はたけの なまの サツマイモを いしやきがまで やく → やきいも。
// ゲージは 0（なま）→ 1（まっくろ）へ すすむ。とりだした ところで できあがりが きまる。

export interface ImoGrade {
  id: string;
  name: string;
  emoji: string;
  from: number;   // ゲージの区間（0..1）
  to: number;
  count: number;  // できる やきいもの数
  color: string;  // ゲージの いろ
  line: string;   // できたときの ひとこと
}

/** ゲージの区間（なまは とりだせない）。きんいろは みつたっぷりの まん中の ほそい ところ */
export const RAW_UNTIL = 0.22;
export const GOLD = { from: 0.72, to: 0.755 };

export const IMO_GRADES: ImoGrade[] = [
  { id: 'hoku',  name: 'ほくほく やきいも',     emoji: '🍠', from: 0.22, to: 0.45, count: 1, color: '#fcd34d', line: 'ほくほくで やさしい あじ' },
  { id: 'netto', name: 'ねっとり やきいも',     emoji: '🍠', from: 0.45, to: 0.65, count: 1, color: '#fb923c', line: 'ねっとり あまくて おいしい' },
  { id: 'mitsu', name: 'みつたっぷり やきいも', emoji: '🍯', from: 0.65, to: 0.82, count: 2, color: '#ea580c', line: 'みつが じゅわっと あふれた！' },
  { id: 'gold',  name: 'きんいろ やきいも',     emoji: '✨', from: GOLD.from, to: GOLD.to, count: 2, color: '#facc15', line: 'ぴかぴかの きんいろ！ めったに できないよ' },
  { id: 'koge',  name: 'こげいも',             emoji: '⚫', from: 0.82, to: 1.01, count: 0, color: '#44403c', line: 'まっくろに こげちゃった…' },
];

export const IMO_BY_ID: Record<string, ImoGrade> = Object.fromEntries(IMO_GRADES.map((x) => [x.id, x]));

/** ゲージの いち → できあがり（なまの ときは null） */
export function gradeAt(pos: number): ImoGrade | null {
  if (pos < RAW_UNTIL) return null;
  if (pos >= GOLD.from && pos < GOLD.to) return IMO_BY_ID.gold;
  return IMO_GRADES.find((x) => x.id !== 'gold' && pos >= x.from && pos < x.to) ?? IMO_BY_ID.koge;
}

/** なまから まっくろまでの 秒数 */
export const BAKE_SECONDS = 7;

/** ずかんの ごほうび */
export const IMO_REWARDS: { kinds: number; item: string }[] = [
  { kinds: 3, item: 'fn_imosign' },
  { kinds: 5, item: 'fn_imokama' },
];

/** おみせに くる おきゃくさんは 1日3人まで */
export const IMO_PER_DAY = 3;

export const ORDER_LINES = [
  'やきいも {n}こ ください！',
  'いい におい〜。{n}こ もらえる？',
  'あったかい やきいも {n}こ ちょうだい！',
  'みんなで たべたいから {n}こ おねがい！',
];

export const THANKS_LINES = ['ありがとう！ ほっかほか〜', 'あまくて おいしい！', 'また くるね！', 'おれいに これ あげる！'];
