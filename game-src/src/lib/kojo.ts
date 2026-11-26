// イベント「サンタの おもちゃこうじょう」：2026-12-01〜12-24。
// ぶひん（⚙️）を あつめて、サンタの おもちゃを つくる。12月の 理科「雲と雨」・社会「工業・鉱産資源」を おさらい。
//   ・その日 クイズを 5もん やると「きょうの まめクイズ」3もん。せいかい 1もん＝ぶひん +1
//   ・その日 クイズで 単元を クリア（80%いじょう）した 教科の かず ぶん「こうじょうの しごと」で ぶひん +1（1日2こまで）
//   ・テストの まえの日（12/13・12/17）は まめクイズの ぶひんが 2ばい
// まめクイズの 中身は 12月の 問題データ（km1/km2/kg1/kg2/ksg）の 答え（解答ページで たしかめたもの）だけを 使う。
// 問題を ふやすときも、問題データで 確かめた ことだけに する。

import { answeredByDate, dateKey, STAMP_MIN, todayUnits } from './study';
import { eventToday } from './detective';

export const KOJO_START = '2026-12-1';
export const KOJO_END = '2026-12-24';
export const KOJO_TITLE = 'おもちゃ しょくにん';
/** テストの まえの日（この日は まめクイズの ぶひんが 2ばい） */
export const DOUBLE_DAYS: Record<string, string> = {
  '2026-12-13': 'あしたは 4か えんしゅう！',
  '2026-12-17': 'あしたは がくりょく はんてい テスト！',
};

export const QUIZ_PER_DAY = 3;
export const WORK_PER_DAY = 2;

/** ごほうび（あつめた ぶひん → もらえる おもちゃ）。さいごで しょうごう */
export const KOJO_REWARDS: { at: number; item: string }[] = [
  { at: 10, item: 'fn_toybox' },
  { at: 20, item: 'fn_toytrain' },
  { at: 30, item: 'fn_toyfactory' },
];
export const KOJO_GOAL = 30;

export interface MameQ {
  id: string;     // もとの 問題ID
  cat: 'rika' | 'shakai';
  unit: string;   // 単元の なまえ
  q: string;
  choices: string[];  // [0] が せいかい（出すときに まぜる）
  note: string;       // せいかいの あとの ひとこと
}

export const MAME_QS: MameQ[] = [
  // ── 理科「雲と雨1・2」 ──
  { id: 'km1_b01', cat: 'rika', unit: '雲と雨', q: '雲は、上空で ひやされた 空気の 何が 小さな 水てきや 氷の つぶに なった もの？', choices: ['水じょう気', 'けむり', 'さんそ'], note: '水じょう気が 水てきに かわる ことを「ぎょうけつ」というよ。' },
  { id: 'km1_r03', cat: 'rika', unit: '雲と雨', q: '空気中の 水じょう気が ひえて 水てきに なる ことを 何という？', choices: ['ぎょうけつ（凝結）', 'じょうはつ（蒸発）', 'ふっとう（沸騰）'], note: '気体 → 液体 が ぎょうけつ。' },
  { id: 'km1_b02', cat: 'rika', unit: '雲と雨', q: '空気中に ふくむ ことの できる 水じょう気の いちばん 多い りょうは？', choices: ['飽和水蒸気量', '湿度', '降水量'], note: '気温が 高いほど 大きく なるよ。' },
  { id: 'km1_b04', cat: 'rika', unit: '雲と雨', q: '乾湿計で、乾球と 湿球の 温度の 差が 小さいほど 湿度は？', choices: ['高い', '低い', 'かわらない'], note: 'しめっていると 水が じょうはつ しにくく、湿球が あまり 下がらないよ。' },
  { id: 'km1_b06', cat: 'rika', unit: '雲と雨', q: '積乱雲の べつの よびかたは？', choices: ['入道雲', 'わた雲', '雨雲'], note: 'みじかい 時間に 強い 雨や かみなり。' },
  { id: 'km1_b07', cat: 'rika', unit: '雲と雨', q: '積雲の べつの よびかたは？', choices: ['わた雲', 'うろこ雲', '入道雲'], note: '白い わたの かたまりの ような 雲。' },
  { id: 'km1_b08', cat: 'rika', unit: '雲と雨', q: '乱層雲の べつの よびかたは？', choices: ['雨雲', 'うろこ雲', 'わた雲'], note: '広い はんいに 長い 時間、しとしと 雨。' },
  { id: 'km1_b09', cat: 'rika', unit: '雲と雨', q: '巻積雲の べつの よびかたは？', choices: ['うろこ雲', 'ひつじ雲', '雨雲'], note: 'いわし雲 とも いうよ。ひつじ雲は 高積雲。' },
  { id: 'km1_b12', cat: 'rika', unit: '雲と雨', q: '太陽や 月の まわりに「かさ」が できる 雲は？', choices: ['巻層雲', '積乱雲', '乱層雲'], note: 'うすい きぬの ような「うす雲」。' },
  { id: 'km2_b01', cat: 'rika', unit: '雲と雨', q: 'ふった 雨の りょう（mm で あらわす）を 何という？', choices: ['雨量', '湿度', '気圧'], note: 'はかる 道具は 雨量計。' },
  { id: 'km2_b04', cat: 'rika', unit: '雲と雨', q: '空気の おもさに よる 力を 何という？', choices: ['気圧', '湿度', '雨量'], note: '1気圧は やく 1013 ヘクトパスカル。' },
  { id: 'km2_b05', cat: 'rika', unit: '雲と雨', q: '風は 気圧の どちらから どちらへ ふく？', choices: ['高い ところ → 低い ところ', '低い ところ → 高い ところ', '気圧とは かんけい ない'], note: 'すべりだいと おなじ イメージ。' },
  { id: 'km2_b09', cat: 'rika', unit: '雲と雨', q: '高気圧に おおわれた ときの 天気は？', choices: ['晴れが 多い', '雨が 多い', 'くもりが 多い'], note: '下降気流で 雲が できにくいよ。' },
  { id: 'km2_b10', cat: 'rika', unit: '雲と雨', q: '低気圧の 中心で おきている 空気の ながれは？', choices: ['上昇気流', '下降気流', '横に ながれるだけ'], note: '上で ひやされて 雲が できる → 雨や くもり。' },
  { id: 'km2_b12', cat: 'rika', unit: '雲と雨', q: '晴れた 日の 昼に ふく「海風」は どっちむき？', choices: ['海 → 陸', '陸 → 海', '上空で 陸 → 海'], note: '昼は 陸が 早く あたたまるよ。' },
  { id: 'km2_b14', cat: 'rika', unit: '雲と雨', q: '海風と 陸風が 入れかわる ときに 風が やむ ことを 何という？', choices: ['なぎ', 'あらし', 'つむじ風'], note: '朝と 夕方の 1日2回。' },
  { id: 'km2_b15', cat: 'rika', unit: '雲と雨', q: '日本の 冬の 季節風は どの 方角から ふく？', choices: ['北西', '南東', '南西'], note: '夏は 南東から。冬は 日本海側に 雪。' },
  // ── 社会「工業1・2」 ──
  { id: 'kg1_b01', cat: 'shakai', unit: '工業', q: '大きな 工場で 製品を たくさん つくる 工業は？', choices: ['重化学工業', '軽工業', 'せんい工業'], note: '金属・機械・化学の 3つ。' },
  { id: 'kg1_b04', cat: 'shakai', unit: '工業', q: '自動車の まちとして 有名な 愛知県の 都市は？', choices: ['豊田市', '川崎市', '倉敷市'], note: '中京工業地帯の 中心。' },
  { id: 'kg1_b05', cat: 'shakai', unit: '工業', q: '半導体から つくられ、コンピューターの 部品に なる ものは？', choices: ['集積回路（IC）', 'ナフサ', 'パルプ'], note: '小さく 軽く 高いので 飛行機や トラックで はこぶよ。' },
  { id: 'kg1_b06', cat: 'shakai', unit: '工業', q: '石油から とりだした ナフサで いろいろな 製品を つくる 工業は？', choices: ['石油化学工業', '製紙・パルプ工業', 'よう業'], note: 'パイプラインで つながった 石油化学コンビナート。' },
  { id: 'kg1_b09', cat: 'shakai', unit: '工業', q: '第二次世界大戦の まえまで 出荷額が いちばん 多かった、糸や 布を つくる 工業は？', choices: ['せんい工業', '食料品工業', '機械工業'], note: 'いまは 中国などからの ゆにゅうが ふえたよ。' },
  { id: 'kg1_r07', cat: 'shakai', unit: '工業', q: '製紙・パルプ工業の 出荷額が いちばん 多い 都道府県は？', choices: ['静岡県', '茨城県', '北海道'], note: '富士市などで さかん。' },
  { id: 'kg2_b01', cat: 'shakai', unit: '工業', q: 'いま、工業生産額が 日本一の 工業地帯は？', choices: ['中京工業地帯', '阪神工業地帯', '京浜工業地帯'], note: '機械が 約7わり。' },
  { id: 'kg2_b03', cat: 'shakai', unit: '工業', q: '印刷業が さかんな 工業地帯は？', choices: ['京浜工業地帯', '中京工業地帯', '北九州工業地帯'], note: '東京は 政治・経済・文化の 中心。' },
  { id: 'kg2_b08', cat: 'shakai', unit: '工業', q: '化学工業の わりあいが いちばん 大きい、千葉県の 工業地域は？', choices: ['京葉工業地域', '東海工業地域', '関東内陸工業地域'], note: '東京湾の うめたて地に コンビナート。' },
  { id: 'kg2_b07', cat: 'shakai', unit: '工業', q: '倉敷市に 水島コンビナートが ある 工業地域は？', choices: ['瀬戸内工業地域', '京葉工業地域', '東海工業地域'], note: '岡山・広島・山口・香川・愛媛。' },
  { id: 'kg2_b20', cat: 'shakai', unit: '工業', q: 'すなはまを ほって つくった「掘り込み港」が ある 工業地域は？', choices: ['鹿島臨海工業地域', '京葉工業地域', '瀬戸内工業地域'], note: '茨城県。Y字型の 港。' },
  // ── 社会「鉱産資源」 ──
  { id: 'ksg_b02', cat: 'shakai', unit: '鉱産資源', q: '「黒い ダイヤ」と よばれる 資源は？', choices: ['石炭', '原油', '鉄鉱石'], note: 'イギリスの 産業革命から エネルギーの 中心。' },
  { id: 'ksg_b08', cat: 'shakai', unit: '鉱産資源', q: '日本で 100％ じきゅう できる、セメントの 原料は？', choices: ['石灰石', 'ボーキサイト', 'ウラン'], note: 'ほかの 資源は ほとんど ゆにゅう。' },
  { id: 'ksg_k02', cat: 'shakai', unit: '鉱産資源', q: 'アルミニウムの 原料に なる 鉱石は？', choices: ['ボーキサイト', '鉄鉱石', '石灰石'], note: 'つくるのに 電力を たくさん つかうよ。' },
  { id: 'ksg_b07', cat: 'shakai', unit: '鉱産資源', q: '原子力発電の 燃料に なる 資源は？', choices: ['ウラン', '石炭', '天然ガス'], note: 'プルトニウムなども つかうよ。' },
  { id: 'ksg_r04', cat: 'shakai', unit: '鉱産資源', q: '天然ガスを −162℃に ひやして 液体に した ものは？', choices: ['液化天然ガス（LNG）', 'シェールオイル', 'ナフサ'], note: 'たいせきは 600分の1。' },
  { id: 'ksg_r02', cat: 'shakai', unit: '鉱産資源', q: '日本が 石炭を いちばん 多く ゆにゅうしている 国は？', choices: ['オーストラリア', 'サウジアラビア', 'ブラジル'], note: '鉄鉱石・液化天然ガスも 1位は オーストラリア。' },
  { id: 'ksg_r07', cat: 'shakai', unit: '鉱産資源', q: '日本が 原油を いちばん 多く ゆにゅうしている 国は？', choices: ['アラブ首長国連邦', 'オーストラリア', 'チリ'], note: '2位は サウジアラビア。中東から 9わり いじょう。' },
  { id: 'ksg_b10', cat: 'shakai', unit: '鉱産資源', q: 'つかわなくなった 携帯電話などに ねむる 金や 銀を 鉱山に たとえて 何という？', choices: ['都市鉱山', '露天掘り', '掘り込み港'], note: '東京オリンピックの メダルにも なったよ。' },
  { id: 'ksg_k04', cat: 'shakai', unit: '鉱産資源', q: '1973年に おきた、石油の ねだんが 大きく 上がった できごとは？', choices: ['オイルショック（石油危機）', 'エネルギー革命', '産業革命'], note: 'このあと 石炭や 天然ガスも また つかうように なったよ。' },
];

// ── 日づけ ──
function parse(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function dayOnly(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function kojoActive(now = eventToday()): boolean {
  const t = dayOnly(now);
  return t >= parse(KOJO_START).getTime() && t <= parse(KOJO_END).getTime();
}

/** テストの まえの日なら ひとこと（2ばいの日） */
export function doubleNote(now = eventToday()): string | null {
  return DOUBLE_DAYS[dateKey(now)] ?? null;
}

/** のこりの 日数（さいごの 日は 0） */
export function kojoDaysLeft(now = eventToday()): number {
  return Math.round((parse(KOJO_END).getTime() - dayOnly(now)) / 86400000);
}

/** きょう（?today の日）クイズを 5もん やったか */
export function studiedOnDay(now = eventToday(), by = answeredByDate()): boolean {
  return (by[dateKey(now)] || 0) >= STAMP_MIN;
}

/** きょう 単元を クリアした 教科の かず（こうじょうの しごとで もらえる ぶひん。WORK_PER_DAY まで） */
export function workToday(now = eventToday()): number {
  return Math.min(WORK_PER_DAY, todayUnits(now, null, null).cats.length);
}

/** その日の まめクイズ 3もん（日づけで きまる。理科1・社会2 か 理科2・社会1 を まぜる） */
export function dailyQuestions(day: string): MameQ[] {
  let h = 2166136261;
  for (const c of day) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const idx = MAME_QS.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const qs = idx.map((i) => MAME_QS[i]);
  const rika = qs.filter((q) => q.cat === 'rika');
  const sha = qs.filter((q) => q.cat === 'shakai');
  const nR = h % 2 === 0 ? 1 : 2;
  return [...rika.slice(0, nR), ...sha.slice(0, QUIZ_PER_DAY - nR)];
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
