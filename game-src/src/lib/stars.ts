// 星座ずかん：てんもんだいで 見える星座。メダルは出さない（ずかんと ごほうびの家具だけ）。

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface Constellation {
  id: string;
  name: string;
  emoji: string;
  season: Season;
  desc: string;   // 見つけたときの一言説明
  hint: string;   // まだ見つけていないときの ヒント
  points: { x: number; y: number }[];  // 0..100 の かんたんな星の位置
  lines: [number, number][];           // つなぐ星のペア（points の index）
}

export const CONSTELLATIONS: Constellation[] = [
  // 春 3-5月
  { id: 'st_leo', name: 'しし座', emoji: '🦁', season: 'spring',
    desc: 'ぎゃくの クエスチョンマークが ライオンの あたま。★レグルスが めじるし。',
    hint: 'はるの よるに みえるよ',
    points: [{ x: 20, y: 30 }, { x: 30, y: 15 }, { x: 45, y: 18 }, { x: 42, y: 40 }, { x: 55, y: 55 }, { x: 78, y: 50 }, { x: 30, y: 55 }],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [3, 6]] },
  { id: 'st_virgo', name: 'おとめ座', emoji: '🌾', season: 'spring',
    desc: 'あおじろく ひかる ★スピカが めじるし。しし座の みぎしたに いるよ。',
    hint: 'しし座の となりを さがしてね',
    points: [{ x: 15, y: 20 }, { x: 35, y: 30 }, { x: 55, y: 25 }, { x: 60, y: 50 }, { x: 80, y: 75 }, { x: 40, y: 60 }],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 1]] },
  { id: 'st_bootes', name: 'うしかい座', emoji: '🪁', season: 'spring',
    desc: 'オレンジいろの ★アークトゥルスが めじるし。たこの かたち。',
    hint: 'ほくとしちせいの カーブを のばすと あえるよ',
    points: [{ x: 50, y: 10 }, { x: 30, y: 35 }, { x: 50, y: 55 }, { x: 70, y: 35 }, { x: 50, y: 85 }],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4]] },
  { id: 'st_corvus', name: 'からす座', emoji: '🐦', season: 'spring',
    desc: 'ちいさな しかくい かたちの からすの ほし。',
    hint: 'おとめ座の ちかくに あるよ',
    points: [{ x: 25, y: 20 }, { x: 75, y: 25 }, { x: 65, y: 70 }, { x: 30, y: 65 }],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]] },

  // 夏 6-8月
  { id: 'st_scorpius', name: 'さそり座', emoji: '🦂', season: 'summer',
    desc: 'あかく ひかる ★アンタレスが しんぞう。しっぽが カーブしてる。',
    hint: 'なつの よる ひくい そらに いるよ',
    points: [{ x: 15, y: 20 }, { x: 30, y: 35 }, { x: 45, y: 45 }, { x: 55, y: 60 }, { x: 65, y: 75 }, { x: 78, y: 78 }, { x: 85, y: 65 }],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]] },
  { id: 'st_lyra', name: 'こと座', emoji: '🎻', season: 'summer',
    desc: 'なつの大三角の いちばん あかるい ★ベガ（おりひめぼし）。',
    hint: 'てんちょうの ちかくに あるよ',
    points: [{ x: 50, y: 15 }, { x: 30, y: 55 }, { x: 45, y: 80 }, { x: 65, y: 78 }, { x: 72, y: 50 }],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
  { id: 'st_aquila', name: 'わし座', emoji: '🦅', season: 'summer',
    desc: '★アルタイル（ひこぼし）が つばさを ひろげた わしの かたち。',
    hint: 'あまのがわを はさんで こと座と むかいあうよ',
    points: [{ x: 15, y: 50 }, { x: 45, y: 40 }, { x: 85, y: 55 }, { x: 45, y: 80 }],
    lines: [[0, 1], [1, 2], [1, 3]] },
  { id: 'st_cygnus', name: 'はくちょう座', emoji: '🦢', season: 'summer',
    desc: 'あまのがわを とぶ はくちょう。じゅうじの かたちが めじるし。★デネブが しっぽ。',
    hint: 'なつの大三角の ひとつだよ',
    points: [{ x: 50, y: 10 }, { x: 50, y: 55 }, { x: 50, y: 90 }, { x: 15, y: 45 }, { x: 85, y: 65 }],
    lines: [[0, 1], [1, 2], [3, 1], [1, 4]] },

  // 秋 9-11月
  { id: 'st_pegasus', name: 'ペガサス座', emoji: '🐎', season: 'autumn',
    desc: 'おおきな しかく『あきの四辺形』が とくちょう。',
    hint: 'あきの よぞらの まんなかに あるよ',
    points: [{ x: 25, y: 25 }, { x: 75, y: 20 }, { x: 80, y: 70 }, { x: 30, y: 75 }],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]] },
  { id: 'st_cassiopeia', name: 'カシオペヤ座', emoji: '👑', season: 'autumn',
    desc: 'アルファベットの『W』みたいな かたち。北極星を みつける めじるし。',
    hint: '北極星の はんたいがわに いつも いるよ',
    points: [{ x: 15, y: 60 }, { x: 35, y: 20 }, { x: 55, y: 55 }, { x: 75, y: 15 }, { x: 90, y: 50 }],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { id: 'st_andromeda', name: 'アンドロメダ座', emoji: '👸', season: 'autumn',
    desc: 'ペガサス座の しかくから のびる ほしの れつ。',
    hint: 'ペガサス座の かどから つながっているよ',
    points: [{ x: 20, y: 20 }, { x: 40, y: 40 }, { x: 62, y: 55 }, { x: 85, y: 75 }],
    lines: [[0, 1], [1, 2], [2, 3]] },
  { id: 'st_aquarius', name: 'みずがめ座', emoji: '🏺', season: 'autumn',
    desc: 'みずを そそぐ ひとの すがた。あまり あかるい ★は ないよ。',
    hint: 'ペガサス座の みなみがわに あるよ',
    points: [{ x: 50, y: 15 }, { x: 45, y: 40 }, { x: 25, y: 55 }, { x: 45, y: 65 }, { x: 60, y: 85 }],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4]] },

  // 冬 12-2月
  { id: 'st_orion', name: 'オリオン座', emoji: '🏹', season: 'winter',
    desc: 'みっつ ならんだ ★が めじるし。ふゆの よぞらで いちばん みつけやすいよ。',
    hint: 'ふゆの よるに たかく のぼるよ',
    points: [{ x: 20, y: 15 }, { x: 75, y: 20 }, { x: 35, y: 50 }, { x: 50, y: 53 }, { x: 65, y: 56 }, { x: 25, y: 85 }, { x: 78, y: 82 }],
    lines: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]] },
  { id: 'st_canismajor', name: 'おおいぬ座', emoji: '🐕', season: 'winter',
    desc: 'よぞらで いちばん きらきら ひかる ★シリウスが いる。',
    hint: 'オリオン座の みぎしたに いるよ',
    points: [{ x: 30, y: 20 }, { x: 55, y: 40 }, { x: 40, y: 70 }, { x: 70, y: 65 }],
    lines: [[0, 1], [1, 2], [1, 3]] },
  { id: 'st_canisminor', name: 'こいぬ座', emoji: '🐶', season: 'winter',
    desc: 'ふたつの ★だけの ちいさい星座。★プロキオンが めじるし。',
    hint: 'オリオン座の ひだりうえに いるよ',
    points: [{ x: 35, y: 30 }, { x: 65, y: 65 }],
    lines: [[0, 1]] },
  { id: 'st_taurus', name: 'おうし座', emoji: '🐂', season: 'winter',
    desc: 'ちいさい ★の あつまり『すばる』が とくちょう。うしの つのの かたち。',
    hint: 'オリオン座の みぎうえに あるよ',
    points: [{ x: 20, y: 25 }, { x: 45, y: 45 }, { x: 20, y: 65 }, { x: 70, y: 30 }, { x: 85, y: 15 }],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4]] },
];

export const CONSTELLATION_BY_ID: Record<string, Constellation> = Object.fromEntries(CONSTELLATIONS.map((c) => [c.id, c]));

/** ずかんの ごほうび（見つけた しゅるいの数） */
export const STAR_REWARDS: { kinds: number; item: string }[] = [
  { kinds: 5, item: 'fn_starsign' },
  { kinds: 10, item: 'fn_stardome' },
];

export function seasonOf(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

export function poolFor(month: number): Constellation[] {
  const season = seasonOf(month);
  return CONSTELLATIONS.filter((c) => c.season === season);
}

/** 今夜の星座（日付で決まるので1日同じ） */
export function tonightConstellation(dayKey: string, month: number): Constellation {
  const pool = poolFor(month);
  let h = 11;
  for (const ch of dayKey) h = (h * 131 + ch.charCodeAt(0)) >>> 0;
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995) >>> 0; h ^= h >>> 15;
  return pool[(h >>> 0) % pool.length];   // ^= で マイナスに なることが あるので 0以上に もどす
}
