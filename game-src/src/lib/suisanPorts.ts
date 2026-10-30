// モクタの ぎょこうづくり：日本地図で えらぶ 漁港と、その港で ほんとうに とれる 魚（養殖は 入れない）。
//
// 魚の 出どころ（2026-10 に 確かめた）：
//  ・境港＝あじ・いわし・かに／銚子港＝さば・いわし／焼津港＝まぐろ・かつお（遠洋漁業の基地）
//      … ena-quiz の 問題（基礎コン冬 港・平野04〜06）と 11月 社会「水産業」
//  ・釧路：まいわし・まだら・さんま・すけとうだら（北海道新聞／東洋経済 2023年の 水あげ量ランキング）
//  ・八戸：さば・いわし（大中型まき網）・いか・ひらめ（青森県の 資料／八戸の 魚市場の 紹介）
//  ・石巻：さば（金華さば）・いわし・まだら・やりいか（石巻市の 資料。金華山沖は 世界三大漁場の ひとつ）
//  ・枕崎：かつお（かつお節の 生産が 全国一）・東シナ海の さば・あじ（水産庁の 資料）
//  ・松浦：あじ・さば（まき網。あじの 水あげ日本一を 何度も：松浦市／国土交通省）
// どの 海域（沿岸・沖合・遠洋）で とるかは 教材（suisan.html）に あわせた：
//   沿岸＝あじ・たら・たい・さば／沖合＝いわし・さんま・さば・かれい・すけとうだら／遠洋＝まぐろ・かつお
//   （いか・かには 沖合、ひらめは 沿岸と した）
// 数字（水あげ量の 順位）は 毎年 かわるので、画面には「〜の年も ある」と 書く。

export type ZoneId = 'near' | 'eez' | 'high';

export interface PortFish {
  id: string;
  name: string;
  emoji: string;
  hue?: number;
  price: number;     // 万円
  weight: number;    // 出やすさ
  zone: ZoneId;
}

export interface Port {
  id: string;
  name: string;
  pref: string;
  line: string;      // 港の ひとこと（カードに 出す）
  fact: string;      // つった あと・えらんだ ときの まなび
  fish: PortFish[];
}

const F = (id: string, name: string, emoji: string, zone: ZoneId, price: number, weight: number, hue?: number): PortFish =>
  ({ id, name, emoji, zone, price, weight, ...(hue ? { hue } : {}) });

const tara = (z: ZoneId = 'near') => F('tara', 'たら', '🐟', z, 3, 3, 30);
const hirame = () => F('hirame', 'ひらめ', '🐟', 'near', 4, 2, 60);
const aji = (z: ZoneId = 'near') => F('aji', 'あじ', '🐟', z, z === 'near' ? 3 : 5, 4);
const saba = () => F('saba', 'さば', '🐟', 'eez', 5, 4, 160);
const iwashi = () => F('iwashi', 'いわし', '🐟', 'eez', 4, 4, 270);
const sanma = () => F('sanma', 'さんま', '🐟', 'eez', 5, 3);
const suketo = () => F('suketo', 'すけとうだら', '🐟', 'eez', 5, 3, 200);
const ika = () => F('ika', 'いか', '🦑', 'eez', 6, 2);
const kani = () => F('kani', 'かに', '🦀', 'eez', 7, 2);
const katsuo = () => F('katsuo', 'かつお', '🐟', 'high', 8, 4, 240);
const maguro = () => F('maguro', 'まぐろ', '🐟', 'high', 12, 3, 200);

export const PORTS: Port[] = [
  {
    id: 'kushiro', name: '釧路', pref: '北海道',
    line: '北海道の 東の 港。親潮の 冷たい 海で さんま・いわし・たらが とれるよ。',
    fact: '釧路港は 水あげ量が 全国で 1位に なった 年も あるよ（2023年）。',
    fish: [tara(), sanma(), iwashi(), suketo()],
  },
  {
    id: 'hachinohe', name: '八戸', pref: '青森県',
    line: '青森県の 港。まき網で さば・いわし、いかも 水あげされるよ。',
    fact: '八戸港は さばの 水あげで 知られているよ。まき網で さば・いわしを とるんだ。',
    fish: [hirame(), saba(), iwashi(), ika()],
  },
  {
    id: 'ishinomaki', name: '石巻', pref: '宮城県',
    line: '宮城県の 港。沖の 金華山は 世界三大漁場の ひとつと いわれるよ。',
    fact: '石巻には「金華さば」が あるよ。さば・いわし・たらが 水あげされる。',
    fish: [tara(), saba(), iwashi()],
  },
  {
    id: 'choshi', name: '銚子', pref: '千葉県',
    line: '千葉県の 港。三陸沖から 銚子沖は 潮目で、さば・いわしが 多いよ。',
    fact: '銚子港は 水あげ量が 日本有数。さば・いわしが 多い 港だよ。',
    fish: [saba(), iwashi()],
  },
  {
    id: 'yaizu', name: '焼津', pref: '静岡県',
    line: '静岡県の 港。遠洋漁業の 基地で、まぐろ・かつおを 水あげするよ。',
    fact: '焼津港は 遠洋漁業の 基地。水あげの 金額が 全国トップの 年が つづいているよ。',
    fish: [maguro(), katsuo()],
  },
  {
    id: 'sakaiminato', name: '境港', pref: '鳥取県',
    line: '鳥取県の 日本海がわの 港。あじ・いわし・かにの 水あげが 多いよ。',
    fact: '境港は 日本海がわで 水あげが 多い 漁港。あじ・いわし・かにが 有名だよ。',
    fish: [aji(), iwashi(), saba(), kani()],
  },
  {
    id: 'makurazaki', name: '枕崎', pref: '鹿児島県',
    line: '鹿児島県の 港。かつおの 水あげと、かつお節づくりで 有名だよ。',
    fact: '枕崎は かつお節の 産地。東シナ海の さば・あじも 水あげされるよ。',
    fish: [katsuo(), saba(), aji('eez')],
  },
  {
    id: 'matsuura', name: '松浦', pref: '長崎県',
    line: '長崎県の 港。東シナ海の あじ・さばを まき網で とるよ。',
    fact: '松浦港は あじの 水あげ量が 日本一に なった 年が 何度も あるよ。',
    fish: [aji('eez'), saba()],
  },
];
export const PORT_BY_ID: Record<string, Port> = Object.fromEntries(PORTS.map((p) => [p.id, p]));

export const ZONE_ORDER: ZoneId[] = ['near', 'eez', 'high'];
export const ZONE_JA: Record<ZoneId, string> = { near: '沿岸', eez: '沖合', high: '遠洋' };

/** その港で いちばん 近くで 魚が とれる 海域 */
export const firstZone = (p: Port): ZoneId => ZONE_ORDER.find((z) => p.fish.some((f) => f.zone === z)) ?? 'near';

export function pickPortFish(p: Port, zone: ZoneId, r: number): PortFish | null {
  const list = p.fish.filter((f) => f.zone === zone);
  if (!list.length) return null;
  const total = list.reduce((a, f) => a + f.weight, 0);
  let x = r * total;
  for (const f of list) { x -= f.weight; if (x <= 0) return f; }
  return list[0];
}
