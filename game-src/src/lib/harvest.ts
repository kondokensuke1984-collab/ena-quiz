// イベント「あきの しゅうかくさい」：2026-11-01〜11-30。
// みのり（🌾）を かごに あつめて、おまつりの じゅんびを する。
//   ・その日 クイズを 5もん やると「きょうの まめクイズ」3もん（社会「日本の農業3〜5」から）。せいかい 1もん＝みのり +1
//   ・はたけで とれた ものを「おそなえ」すると みのり +1（1日2こまで）
//   ・11/23（きんろう かんしゃの ひ＝むかしの にいなめさい）は まめクイズの みのりが 2ばい
// まめクイズの 中身は 10月の 問題データ（data/questions_202610.json の nog3/nog4/nog5）の 答えを そのまま使っている。
// 問題を ふやすときも、問題データで 確かめた ことだけに する。

import { answeredByDate, dateKey, STAMP_MIN } from './study';
import { eventToday } from './detective';

export const HARVEST_START = '2026-11-1';
export const HARVEST_END = '2026-11-30';
export const HARVEST_TITLE = 'しゅうかく めいじん';
/** きんろう かんしゃの ひ（この日は まめクイズの みのりが 2ばい） */
export const THANKS_DAY = '2026-11-23';

export const QUIZ_PER_DAY = 3;
export const OFFER_PER_DAY = 2;

/** おそなえ できる もの（はたけで とれる もの だけ。メダルで かえる ものは いれない） */
export const OFFER_ITEMS = ['gf_rawimo', 'gf_onigiri', 'gf_potato', 'gf_mame', 'gf_corn', 'gf_soramame', 'gf_sunseed', 'gf_tulip'];

/** ごほうび（あつめた みのり → もらえる もの）。さいごで しょうごう */
export const HARVEST_REWARDS: { at: number; item: string }[] = [
  { at: 10, item: 'fn_inamura' },
  { at: 20, item: 'fn_mikoshi' },
  { at: 30, item: 'fn_yagura' },
];
export const HARVEST_GOAL = 30;

export interface MameQ {
  id: string;   // もとの 問題ID
  q: string;
  choices: string[];  // [0] が せいかい（出すときに まぜる）
  note: string;       // せいかいの あとの ひとこと
}

// 3たく。まちがいの せんたくしは 同じ たんげんの べつの ことば。
export const MAME_QS: MameQ[] = [
  { id: 'nog3_01', q: '東京・大阪・名古屋などの 都市の まわりで 行われる 農業は？', choices: ['近郊農業', '遠郊農業', '高冷地農業'], note: '都市に 近いから、しんせんな 野菜を すぐ とどけられるよ。' },
  { id: 'nog3_02', q: 'ビニールハウスなどを 使わずに、畑で そのまま 育てる 方法は？', choices: ['露地栽培', '促成栽培', '抑制栽培'], note: '「露地（ろじ）」は 屋根の ない 地面の こと。' },
  { id: 'nog3_03', q: '冬でも あたたかい 地域で、野菜を 早く 育てて 出荷する 方法は？', choices: ['促成栽培', '抑制栽培', '露地栽培'], note: '「促（うなが）す」＝ 早める。ねだんが 高い 時期に 出せるよ。' },
  { id: 'nog3_05', q: '夏でも すずしい 地域で、野菜を おそく 育てて 出荷する 方法は？', choices: ['抑制栽培', '促成栽培', '近郊農業'], note: '「抑（おさ）える」＝ おくらせる。' },
  { id: 'nog3_06', q: '野辺山原（のべやまはら）など、すずしい 高地で 行う 農業は？', choices: ['高冷地農業', '近郊農業', '施設園芸農業'], note: '高くて 冷たい 土地の 農業だね。' },
  { id: 'nog3_r05', q: '嬬恋村（つまごいむら）などで 夏に 作られる キャベツなどを まとめて 何という？', choices: ['高原野菜', '近郊野菜', '促成野菜'], note: '高原の すずしさを 生かした 野菜だよ。' },
  { id: 'nog3_08', q: '保冷車などで 作物を 冷やしたまま とどける とりくみは？', choices: ['コールドチェーン', '地産地消', '輸送園芸農業'], note: 'つめたい（コールド）くさり（チェーン）で つなぐ イメージ。' },
  { id: 'nog3_09', q: 'トラックや カーフェリーで 遠くへ 出荷する 農業は？', choices: ['輸送園芸農業', '近郊農業', '集落営農'], note: '遠くまで 運んで 売る 園芸農業だよ。' },
  { id: 'nog3_10', q: '地元で 作った 野菜を 地元で 食べる とりくみは？', choices: ['地産地消', 'コールドチェーン', '共同作業'], note: '地元で 産んで、地元で 消（け）す ＝ 食べる。' },
  { id: 'nog4_01', q: '家畜を 飼って、肉や 乳製品などを 生産する ことは？', choices: ['畜産', '酪農', '干拓'], note: '「畜」は 家畜の 畜だよ。' },
  { id: 'nog4_02', q: '乳牛を 飼って、バターなどの 乳製品を 作る ことは？', choices: ['酪農', '畜産', '開拓'], note: '酪農は 畜産の なかまだよ。' },
  { id: 'nog4_03', q: '酪農が さかんな、北海道の 台地は？', choices: ['根釧台地', '野辺山原', '八郎潟'], note: 'こんせん だいち。すずしくて 牧草が よく 育つよ。' },
  { id: 'nog4_06', q: 'ぶたの 飼育数の 割合が いちばん 高い 都道府県は？', choices: ['鹿児島県', '宮崎県', '北海道'], note: '鹿児島県は 黒ぶたでも 有名。' },
  { id: 'nog4_08', q: '家畜の えさに なる 穀物を、日本は おもに どこの 国から 輸入している？', choices: ['アメリカ', 'ロシア', 'フランス'], note: 'とうもろこしや 大豆が おおいよ。' },
  { id: 'nog5_01', q: '日本の 農家の 数や 農業で 働く 人の 数は？', choices: ['減っている', '増えている', 'かわらない'], note: 'だから 機械を みんなで 使うなどの 工夫を しているよ。' },
  { id: 'nog5_02', q: '農業機械を いくつかの 農家で 買って いっしょに 使う 方法は？', choices: ['共同作業', '集落営農', '兼業'], note: '高い 機械も みんなで 買えば 安く なるね。' },
  { id: 'nog5_03', q: '集落の 農家が まとまって 農業生産に とりくむ 方法は？', choices: ['集落営農', '共同作業', '地産地消'], note: '集落（むら）で 営（いとな）む 農業。' },
  { id: 'nog5_04', q: '農業いがいで 働いている 人が だれも いない 農家は？', choices: ['専業農家', '兼業農家', '集落営農'], note: '農業 専門（せんもん）の 農家だね。' },
  { id: 'nog5_05', q: '農業いがいで 働いている 人が いる 農家は？', choices: ['兼業農家', '専業農家', '近郊農家'], note: '「兼（か）ねる」＝ ほかの しごとも する。' },
  { id: 'nog5_06', q: '山地や 森林を 切りひらいて 田畑を つくる ことは？', choices: ['開拓', '干拓', '客土'], note: '切り「開く」から 開拓。' },
  { id: 'nog5_07', q: '浅い 海や 湖の 水を ぬいて 土地を つくる ことは？', choices: ['干拓', '開拓', '客土'], note: '水を「干（ほ）す」から 干拓。' },
  { id: 'nog5_08', q: '秋田県に ある 干拓地は？', choices: ['八郎潟', '根釧台地', '野辺山原'], note: 'はちろうがた。日本三大干拓地の ひとつ。' },
  { id: 'nog5_10', q: 'ほかの 場所から 土を もってきて 入れかえる 耕地改良は？', choices: ['客土', '干拓', '開拓'], note: 'お客さんの 土で 客土（きゃくど）。' },
  { id: 'nog5_r09', q: 'コンピューターが 水やりや 肥料を 自動で 行う 農業は？', choices: ['スマート農業', '集約農業', '近郊農業'], note: '人手が へっても できるように する 工夫だよ。' },
  { id: 'nog5_k01', q: 'せまい 耕地から 多くの 収穫量を あげる 日本の 農業は？', choices: ['集約農業', 'スマート農業', '遠郊農業'], note: '人手や 肥料を たくさん かけて、せまい 土地を 生かすよ。' },
];

// ── 日づけ ──
function parse(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function dayOnly(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function harvestActive(now = eventToday()): boolean {
  const t = dayOnly(now);
  return t >= parse(HARVEST_START).getTime() && t <= parse(HARVEST_END).getTime();
}

export function isThanksDay(now = eventToday()): boolean {
  return dayOnly(now) === parse(THANKS_DAY).getTime();
}

/** のこりの 日数（さいごの 日は 0） */
export function daysLeft(now = eventToday()): number {
  return Math.round((parse(HARVEST_END).getTime() - dayOnly(now)) / 86400000);
}

/** きょう（?today の日）クイズを 5もん やったか */
export function studiedOnDay(now = eventToday(), by = answeredByDate()): boolean {
  return (by[dateKey(now)] || 0) >= STAMP_MIN;
}

/** その日の まめクイズ 3もん（日づけで きまる。同じ日は 何回 ひらいても 同じ） */
export function dailyQuestions(day: string): MameQ[] {
  let h = 2166136261;
  for (const c of day) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const idx = MAME_QS.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, QUIZ_PER_DAY).map((i) => MAME_QS[i]);
}

/** せんたくしを その日・その問題で きまった じゅんに まぜる */
export function shuffledChoices(q: MameQ, day: string): string[] {
  let h = 7;
  for (const c of day + q.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const a = [...q.choices];
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
