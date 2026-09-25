// ほんものの 星空：明るい星の いち（赤経・赤緯）から、東京で いつ どこに 見えるかを 計算する。
// 理科「星の動き」：日周運動（1時間 15°）・年周運動（1か月 30°）は この計算で しぜんに そうなる。
// 島の夜空（SkyLayer）と てんもんだいの 星座早見（Planisphere）で つかう。

import { hourNow } from './sky';

export type StarColor = 'bluewhite' | 'white' | 'yellow' | 'orange' | 'red';

export interface SkyStar {
  id: string;
  name: string;
  con: string;     // 星座
  ra: number;      // 赤経（時）
  dec: number;     // 赤緯（度）
  mag: number;     // 等級（小さいほど 明るい）
  color: StarColor;
}

const S = (id: string, name: string, con: string, ra: number, dec: number, mag: number, color: StarColor): SkyStar =>
  ({ id, name, con, ra, dec, mag, color });

export const SKY_STARS: SkyStar[] = [
  // 北の空
  S('polaris', '北極星', 'こぐま座', 2.530, 89.26, 2.0, 'yellow'),
  S('kochab', 'コカブ', 'こぐま座', 14.845, 74.16, 2.1, 'orange'),
  S('pherkad', 'フェルカド', 'こぐま座', 15.345, 71.83, 3.0, 'white'),
  S('dubhe', 'ドゥーベ', 'おおぐま座（北斗七星）', 11.062, 61.75, 1.8, 'orange'),
  S('merak', 'メラク', 'おおぐま座（北斗七星）', 11.031, 56.38, 2.4, 'white'),
  S('phecda', 'フェクダ', 'おおぐま座（北斗七星）', 11.897, 53.69, 2.4, 'white'),
  S('megrez', 'メグレズ', 'おおぐま座（北斗七星）', 12.257, 57.03, 3.3, 'white'),
  S('alioth', 'アリオト', 'おおぐま座（北斗七星）', 12.900, 55.96, 1.8, 'white'),
  S('mizar', 'ミザール', 'おおぐま座（北斗七星）', 13.399, 54.93, 2.2, 'white'),
  S('alkaid', 'アルカイド', 'おおぐま座（北斗七星）', 13.792, 49.31, 1.9, 'bluewhite'),
  S('caph', 'カフ', 'カシオペヤ座', 0.153, 59.15, 2.3, 'white'),
  S('schedar', 'シェダル', 'カシオペヤ座', 0.675, 56.54, 2.2, 'orange'),
  S('gcas', 'ツィー', 'カシオペヤ座', 0.945, 60.72, 2.2, 'bluewhite'),
  S('ruchbah', 'ルクバー', 'カシオペヤ座', 1.430, 60.24, 2.7, 'white'),
  S('segin', 'セギン', 'カシオペヤ座', 1.907, 63.67, 3.4, 'bluewhite'),
  // 春
  S('regulus', 'レグルス', 'しし座', 10.140, 11.97, 1.4, 'bluewhite'),
  S('etaleo', 'しし座η', 'しし座', 10.122, 16.76, 3.5, 'white'),
  S('algieba', 'アルギエバ', 'しし座', 10.333, 19.84, 2.0, 'orange'),
  S('adhafera', 'アダフェラ', 'しし座', 10.278, 23.42, 3.4, 'white'),
  S('rasalas', 'ラサラス', 'しし座', 9.879, 26.0, 3.9, 'orange'),
  S('zosma', 'ゾスマ', 'しし座', 11.235, 20.52, 2.6, 'white'),
  S('denebola', 'デネボラ', 'しし座', 11.818, 14.57, 2.1, 'white'),
  S('spica', 'スピカ', 'おとめ座', 13.420, -11.16, 1.0, 'bluewhite'),
  S('porrima', 'ポリマ', 'おとめ座', 12.694, -1.45, 2.7, 'white'),
  S('vindemiatrix', 'ビンデミアトリックス', 'おとめ座', 13.036, 10.96, 2.8, 'yellow'),
  S('arcturus', 'アークトゥルス', 'うしかい座', 14.261, 19.18, -0.05, 'orange'),
  S('izar', 'イザール', 'うしかい座', 14.750, 27.07, 2.4, 'orange'),
  S('muphrid', 'ムフリッド', 'うしかい座', 13.911, 18.40, 2.7, 'yellow'),
  S('seginus', 'セギヌス', 'うしかい座', 14.535, 38.31, 3.0, 'white'),
  S('nekkar', 'ネッカル', 'うしかい座', 15.032, 40.39, 3.5, 'yellow'),
  S('gienah', 'ギェナー', 'からす座', 12.263, -17.54, 2.6, 'bluewhite'),
  S('algorab', 'アルゴラブ', 'からす座', 12.498, -16.52, 2.9, 'white'),
  S('kraz', 'クラズ', 'からす座', 12.573, -23.40, 2.7, 'yellow'),
  S('minkar', 'ミンカル', 'からす座', 12.169, -22.62, 3.0, 'orange'),
  // 夏
  S('vega', 'ベガ（おりひめぼし）', 'こと座', 18.616, 38.78, 0.03, 'white'),
  S('sheliak', 'シェリアク', 'こと座', 18.835, 33.36, 3.5, 'bluewhite'),
  S('sulafat', 'スラファト', 'こと座', 18.982, 32.69, 3.2, 'bluewhite'),
  S('altair', 'アルタイル（ひこぼし）', 'わし座', 19.846, 8.87, 0.77, 'white'),
  S('tarazed', 'タラゼド', 'わし座', 19.771, 10.61, 2.7, 'orange'),
  S('alshain', 'アルシャイン', 'わし座', 19.922, 6.41, 3.7, 'yellow'),
  S('deneb', 'デネブ', 'はくちょう座', 20.690, 45.28, 1.25, 'white'),
  S('sadr', 'サドル', 'はくちょう座', 20.370, 40.26, 2.2, 'yellow'),
  S('albireo', 'アルビレオ', 'はくちょう座', 19.512, 27.96, 3.1, 'orange'),
  S('epscyg', 'はくちょう座ε', 'はくちょう座', 20.770, 33.97, 2.5, 'orange'),
  S('delcyg', 'はくちょう座δ', 'はくちょう座', 19.750, 45.13, 2.9, 'bluewhite'),
  S('antares', 'アンタレス', 'さそり座', 16.490, -26.43, 1.0, 'red'),
  S('acrab', 'アクラブ', 'さそり座', 16.091, -19.81, 2.6, 'bluewhite'),
  S('dschubba', 'ジュバ', 'さそり座', 16.006, -22.62, 2.3, 'bluewhite'),
  S('tausco', 'さそり座τ', 'さそり座', 16.598, -28.22, 2.8, 'bluewhite'),
  S('epssco', 'さそり座ε', 'さそり座', 16.836, -34.29, 2.3, 'orange'),
  S('musco', 'さそり座μ', 'さそり座', 16.864, -38.05, 3.0, 'bluewhite'),
  S('etasco', 'さそり座η', 'さそり座', 17.202, -43.24, 3.3, 'yellow'),
  S('sargas', 'サルガス', 'さそり座', 17.622, -43.0, 1.9, 'yellow'),
  S('shaula', 'シャウラ', 'さそり座', 17.560, -37.10, 1.6, 'bluewhite'),
  S('lesath', 'レサト', 'さそり座', 17.512, -37.30, 2.7, 'bluewhite'),
  // 秋
  S('markab', 'マルカブ', 'ペガスス座', 23.079, 15.21, 2.5, 'bluewhite'),
  S('scheat', 'シェアト', 'ペガスス座', 23.063, 28.08, 2.4, 'red'),
  S('algenib', 'アルゲニブ', 'ペガスス座', 0.220, 15.18, 2.8, 'bluewhite'),
  S('enif', 'エニフ', 'ペガスス座', 21.736, 9.88, 2.4, 'orange'),
  S('alpheratz', 'アルフェラッツ', 'アンドロメダ座', 0.140, 29.09, 2.1, 'bluewhite'),
  S('deland', 'アンドロメダ座δ', 'アンドロメダ座', 0.655, 30.86, 3.3, 'orange'),
  S('mirach', 'ミラク', 'アンドロメダ座', 1.162, 35.62, 2.1, 'red'),
  S('almach', 'アルマク', 'アンドロメダ座', 2.065, 42.33, 2.1, 'orange'),
  S('fomalhaut', 'フォーマルハウト', 'みなみのうお座', 22.961, -29.62, 1.2, 'white'),
  // 冬
  S('betelgeuse', 'ベテルギウス', 'オリオン座', 5.919, 7.41, 0.5, 'red'),
  S('rigel', 'リゲル', 'オリオン座', 5.242, -8.20, 0.13, 'bluewhite'),
  S('bellatrix', 'ベラトリックス', 'オリオン座', 5.419, 6.35, 1.6, 'bluewhite'),
  S('saiph', 'サイフ', 'オリオン座', 5.796, -9.67, 2.1, 'bluewhite'),
  S('mintaka', 'ミンタカ（三ツ星）', 'オリオン座', 5.533, -0.30, 2.2, 'bluewhite'),
  S('alnilam', 'アルニラム（三ツ星）', 'オリオン座', 5.604, -1.20, 1.7, 'bluewhite'),
  S('alnitak', 'アルニタク（三ツ星）', 'オリオン座', 5.679, -1.94, 1.8, 'bluewhite'),
  S('sirius', 'シリウス', 'おおいぬ座', 6.752, -16.72, -1.46, 'white'),
  S('mirzam', 'ミルザム', 'おおいぬ座', 6.378, -17.96, 2.0, 'bluewhite'),
  S('adhara', 'アダラ', 'おおいぬ座', 6.977, -28.97, 1.5, 'bluewhite'),
  S('wezen', 'ウェズン', 'おおいぬ座', 7.140, -26.39, 1.8, 'yellow'),
  S('aludra', 'アルドラ', 'おおいぬ座', 7.402, -29.30, 2.4, 'bluewhite'),
  S('procyon', 'プロキオン', 'こいぬ座', 7.655, 5.22, 0.34, 'yellow'),
  S('gomeisa', 'ゴメイサ', 'こいぬ座', 7.453, 8.29, 2.9, 'bluewhite'),
  S('aldebaran', 'アルデバラン', 'おうし座', 4.599, 16.51, 0.85, 'orange'),
  S('elnath', 'エルナト', 'おうし座', 5.438, 28.61, 1.65, 'bluewhite'),
  S('zetatau', 'おうし座ζ', 'おうし座', 5.627, 21.14, 3.0, 'bluewhite'),
  S('gamtau', 'おうし座γ', 'おうし座', 4.330, 15.63, 3.6, 'orange'),
  S('pleiades', 'すばる（プレアデス星団）', 'おうし座', 3.791, 24.11, 1.6, 'bluewhite'),
  S('capella', 'カペラ', 'ぎょしゃ座', 5.278, 46.0, 0.08, 'yellow'),
  S('menkalinan', 'メンカリナン', 'ぎょしゃ座', 5.992, 44.95, 1.9, 'white'),
  S('thetaaur', 'ぎょしゃ座θ', 'ぎょしゃ座', 5.995, 37.21, 2.6, 'white'),
  S('iotaaur', 'ぎょしゃ座ι', 'ぎょしゃ座', 4.950, 33.17, 2.7, 'orange'),
  S('pollux', 'ポルックス', 'ふたご座', 7.755, 28.03, 1.14, 'orange'),
  S('castor', 'カストル', 'ふたご座', 7.577, 31.89, 1.6, 'white'),
  S('alhena', 'アルヘナ', 'ふたご座', 6.629, 16.40, 1.9, 'white'),
  S('mebsuta', 'メブスタ', 'ふたご座', 6.383, 25.13, 3.0, 'yellow'),
];

export const SKY_STAR_BY_ID: Record<string, SkyStar> = Object.fromEntries(SKY_STARS.map((s) => [s.id, s]));

/** 星座の 形（つなぐ星） */
export const SKY_LINES: [string, string][] = [
  // こぐま・北斗七星・カシオペヤ
  ['polaris', 'kochab'], ['kochab', 'pherkad'],
  ['dubhe', 'merak'], ['merak', 'phecda'], ['phecda', 'megrez'], ['megrez', 'dubhe'], ['megrez', 'alioth'], ['alioth', 'mizar'], ['mizar', 'alkaid'],
  ['caph', 'schedar'], ['schedar', 'gcas'], ['gcas', 'ruchbah'], ['ruchbah', 'segin'],
  // しし・おとめ・うしかい・からす
  ['regulus', 'etaleo'], ['etaleo', 'algieba'], ['algieba', 'adhafera'], ['adhafera', 'rasalas'], ['algieba', 'zosma'], ['zosma', 'denebola'], ['regulus', 'denebola'],
  ['spica', 'porrima'], ['porrima', 'vindemiatrix'],
  ['arcturus', 'izar'], ['izar', 'nekkar'], ['nekkar', 'seginus'], ['seginus', 'arcturus'], ['arcturus', 'muphrid'],
  ['gienah', 'algorab'], ['algorab', 'kraz'], ['kraz', 'minkar'], ['minkar', 'gienah'],
  // こと・わし・はくちょう・さそり
  ['vega', 'sheliak'], ['sheliak', 'sulafat'], ['sulafat', 'vega'],
  ['tarazed', 'altair'], ['altair', 'alshain'],
  ['deneb', 'sadr'], ['sadr', 'albireo'], ['delcyg', 'sadr'], ['sadr', 'epscyg'],
  ['acrab', 'dschubba'], ['dschubba', 'antares'], ['antares', 'tausco'], ['tausco', 'epssco'], ['epssco', 'musco'], ['musco', 'etasco'], ['etasco', 'sargas'], ['sargas', 'shaula'], ['shaula', 'lesath'],
  // ペガスス・アンドロメダ
  ['markab', 'scheat'], ['scheat', 'alpheratz'], ['alpheratz', 'algenib'], ['algenib', 'markab'], ['markab', 'enif'],
  ['alpheratz', 'deland'], ['deland', 'mirach'], ['mirach', 'almach'],
  // オリオン・おおいぬ・こいぬ・おうし・ぎょしゃ・ふたご
  ['betelgeuse', 'bellatrix'], ['betelgeuse', 'alnitak'], ['bellatrix', 'mintaka'], ['mintaka', 'alnilam'], ['alnilam', 'alnitak'], ['alnitak', 'saiph'], ['mintaka', 'rigel'],
  ['mirzam', 'sirius'], ['sirius', 'wezen'], ['wezen', 'adhara'], ['wezen', 'aludra'],
  ['procyon', 'gomeisa'],
  ['aldebaran', 'gamtau'], ['aldebaran', 'elnath'], ['gamtau', 'zetatau'],
  ['capella', 'menkalinan'], ['menkalinan', 'thetaaur'], ['thetaaur', 'elnath'], ['elnath', 'iotaaur'], ['iotaaur', 'capella'],
  ['castor', 'pollux'], ['pollux', 'alhena'], ['castor', 'mebsuta'],
];

/** 大三角など（とじた かたちは さいしょの星に もどす） */
export const ASTERISMS: { name: string; stars: string[]; closed: boolean; color: string }[] = [
  { name: '春の大三角', stars: ['arcturus', 'spica', 'denebola'], closed: true, color: '#f472b6' },
  { name: '春の大曲線', stars: ['dubhe', 'megrez', 'alioth', 'mizar', 'alkaid', 'arcturus', 'spica'], closed: false, color: '#93c5fd' },
  { name: '夏の大三角', stars: ['vega', 'altair', 'deneb'], closed: true, color: '#f472b6' },
  { name: '秋の大四辺形', stars: ['markab', 'scheat', 'alpheratz', 'algenib'], closed: true, color: '#f472b6' },
  { name: '冬の大三角', stars: ['betelgeuse', 'sirius', 'procyon'], closed: true, color: '#f472b6' },
  { name: '冬の大六角形', stars: ['rigel', 'aldebaran', 'capella', 'pollux', 'procyon', 'sirius'], closed: true, color: '#fcd34d' },
];

export const STAR_COLOR: Record<StarColor, { fill: string; label: string; temp: string }> = {
  bluewhite: { fill: '#bfdbfe', label: 'あおじろい', temp: '12000℃いじょう' },
  white: { fill: '#ffffff', label: 'しろい', temp: 'やく8000〜12000℃' },
  yellow: { fill: '#fef08a', label: 'きいろい', temp: 'やく5000〜8000℃' },
  orange: { fill: '#fdba74', label: 'オレンジいろの', temp: 'やく4000〜5000℃' },
  red: { fill: '#f87171', label: 'あかい', temp: 'やく3000〜4000℃' },
};

/** 等級（1等星・2等星…）。1.5より明るい星を 1等星と よぶ */
export function magClass(mag: number): number {
  return mag < 1.5 ? 1 : Math.max(2, Math.round(mag));
}

/** 星を タップしたときの 説明 */
export function starInfo(id: string): string {
  const s = SKY_STAR_BY_ID[id];
  if (!s) return '';
  const c = STAR_COLOR[s.color];
  const ast = ASTERISMS.filter((a) => a.stars.includes(id)).map((a) => a.name);
  if (id === 'polaris') return '⭐ 北極星（こぐま座の 2等星）。ちじくの さきに あるので ほとんど うごかないよ。北の めじるし！';
  if (id === 'pleiades') return '✨ すばる（おうし座）。ちいさな 星が あつまった 星団だよ。';
  return `⭐ ${s.name}（${s.con}）${magClass(s.mag)}等星・${c.label} 星（${c.temp}）${ast.length ? `。${ast.join('・')}の 1つ` : ''}`;
}

// ── 計算 ──
const LAT = 35.7;
const LON = 139.7;
const RAD = Math.PI / 180;

/** 高度（度）と 方位（北0°・東90°・南180°・西270°） */
export function altAz(ra: number, dec: number, date: Date): { alt: number; az: number } {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const d = jd - 2451545.0;
  const lst = (280.46061837 + 360.98564736629 * d + LON) % 360;
  const H = (lst - ra * 15) * RAD;
  const δ = dec * RAD;
  const φ = LAT * RAD;
  const alt = Math.asin(Math.sin(δ) * Math.sin(φ) + Math.cos(δ) * Math.cos(φ) * Math.cos(H));
  const A = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(φ) - Math.tan(δ) * Math.cos(φ));
  return { alt: alt / RAD, az: ((A / RAD + 180) % 360 + 360) % 360 };
}

/** 空の 計算に つかう 日時。確認用に ?hour= と ?season=（その月の15日）で かえられる */
export function skyDate(now = new Date()): Date {
  const d = new Date(now);
  const q = new URLSearchParams(location.search);
  const m = Number(q.get('season'));
  if (m >= 1 && m <= 12) { d.setMonth(m - 1, 15); }
  if (q.get('hour') !== null) d.setHours(hourNow(now), 0, 0, 0);
  return d;
}
