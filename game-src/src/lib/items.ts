// ショップの商品と、バトルの報酬テーブル。データだけ置く。

import type { Item, ItemKind } from '../types';

// ── おうちの中（へやのかぐ・かべがみ・ゆか）──
export const ROOM_ITEMS: Item[] = [
  { id: 'in_bed',    kind: 'indoor', name: 'ベッド',           emoji: '🛏️', price: 15, desc: 'よるに タップすると おやすみ', once: true },
  { id: 'in_desk',   kind: 'indoor', name: 'べんきょうづくえ', emoji: '📚', price: 12, desc: 'きょうの がんばりが みられる', once: true },
  { id: 'in_shelf',  kind: 'indoor', name: 'ほんだな',         emoji: '📖', price: 10, desc: 'えほんが いっぱい',           once: true },
  { id: 'in_bear',   kind: 'indoor', name: 'ぬいぐるみ',       emoji: '🧸', price: 8,  desc: 'ふわふわの くま',             once: true },
  { id: 'in_plant',  kind: 'indoor', name: 'はちうえ',         emoji: '🪴', price: 6,  desc: 'へやに みどりを',             once: true },
  { id: 'in_carpet', kind: 'indoor', name: 'カーペット',       emoji: '🟪', price: 8,  desc: 'ゆかに しく',                 once: true },
  { id: 'wl_beige',  kind: 'wall',  name: 'ベージュの かべ',   emoji: '🟨', price: 0,  desc: 'はじめの かべがみ', once: true, builtin: true },
  { id: 'wl_star',   kind: 'wall',  name: 'ほしの かべがみ',   emoji: '🌟', price: 10, desc: 'よぞらの もよう',   once: true },
  { id: 'wl_flower', kind: 'wall',  name: 'はなの かべがみ',   emoji: '🌸', price: 10, desc: 'ピンクの はなもよう', once: true },
  { id: 'fl_wood',   kind: 'floor', name: 'もくめの ゆか',     emoji: '🟫', price: 0,  desc: 'はじめの ゆか', once: true, builtin: true },
  { id: 'fl_check',  kind: 'floor', name: 'チェックの ゆか',   emoji: '🏁', price: 8,  desc: 'しろと みずいろ', once: true },
  { id: 'fl_grass',  kind: 'floor', name: 'くさはらの ゆか',   emoji: '🌿', price: 8,  desc: 'へやの なかに くさはら', once: true },
];


/** 月の きねんしゃしん（主役の月が おわると もらえる。'fn_photo_202609' など）。2026年9月〜2028年3月ぶん */
export const PHOTO_PREFIX = 'fn_photo_';
export function photoMonthOf(id: string): string | null {
  return id.startsWith(PHOTO_PREFIX) ? id.slice(PHOTO_PREFIX.length) : null;
}
const PHOTO_ITEMS: Item[] = [];
for (let y = 2026, m = 9; y * 100 + m <= 202803; m === 12 ? (y++, m = 1) : m++) {
  PHOTO_ITEMS.push({
    id: `${PHOTO_PREFIX}${y}${String(m).padStart(2, '0')}`, kind: 'furniture', name: `${m}月の きねんしゃしん`, emoji: '🖼️',
    price: 0, desc: `${m}月の しゅやくと とった しゃしん`, once: true, reward: true, anywhere: true,
  });
}

export const ITEMS: Item[] = [
  // ── エサ・おやつ（満腹度と進化）──
  { id: 'fd_rice',   kind: 'food',  name: 'おにぎり',     emoji: '🍙', price: 3,  desc: 'まんぷく +30',            fullness: 30, exp: 10 },
  { id: 'fd_fish',   kind: 'food',  name: 'やきざかな',   emoji: '🐟', price: 5,  desc: 'まんぷく +45',            fullness: 45, exp: 16 },
  { id: 'fd_carrot', kind: 'food',  name: 'にんじん',     emoji: '🥕', price: 4,  desc: 'まんぷく +35',            fullness: 35, exp: 14 },
  { id: 'sn_cake',   kind: 'snack', name: 'ショートケーキ', emoji: '🍰', price: 8,  desc: 'まんぷく +15・ぐんぐん育つ', fullness: 15, exp: 45 },
  { id: 'sn_candy',  kind: 'snack', name: 'キャンディ',   emoji: '🍬', price: 6,  desc: 'まんぷく +10・よく育つ',    fullness: 10, exp: 32 },

  // ── 装備 ──
  { id: 'gun_bamboo', kind: 'gun',    name: 'たけのてっぽう', emoji: '🎋', price: 12, desc: 'こうげき 6',        power: 6,  once: true },
  { id: 'gun_silver', kind: 'gun',    name: 'ぎんのじゅう',   emoji: '🔫', price: 30, desc: 'こうげき 10',       power: 10, once: true },
  { id: 'sh_wood',    kind: 'shield', name: 'きのたて',       emoji: '🛡️', price: 10, desc: 'まもる +15%・かいふく +1', reduce: 0.15, heal: 1, once: true },
  { id: 'sh_star',    kind: 'shield', name: 'ほしのたて',     emoji: '✨', price: 26, desc: 'まもる +30%・かいふく +3', reduce: 0.30, heal: 3, once: true },

  // ── きせかえ ──
  { id: 'cs_ribbon', kind: 'costume', name: 'リボン',     emoji: '🎀', price: 9,  desc: 'あたまに リボン',   once: true },
  { id: 'ht_cap',    kind: 'hat',     name: 'ぼうし',     emoji: '🧢', price: 9,  desc: 'あたまに ぼうし',   once: true },
  { id: 'ht_crown',  kind: 'hat',     name: 'おうかん',   emoji: '👑', price: 28, desc: 'しまの おうさま',   once: true },

  // ── 家具（更地を埋めるのが主目的なので厚めに）──
  { id: 'fn_rug',    kind: 'furniture', name: 'ラグ',       emoji: '🟫', price: 6,  desc: 'しまに しく',         once: true },
  { id: 'fn_lamp',   kind: 'furniture', name: 'ランプ',     emoji: '🏮', price: 8,  desc: 'よるを てらす',       once: true },
  { id: 'fn_tree',   kind: 'furniture', name: 'ヤシのき',   emoji: '🌴', price: 10, desc: 'みなみの しまらしく', once: true },
  { id: 'fn_bench',  kind: 'furniture', name: 'ベンチ',     emoji: '🪑', price: 9,  desc: 'すわって ひとやすみ', once: true },
  { id: 'fn_flower', kind: 'furniture', name: 'かだん',     emoji: '🌷', price: 7,  desc: 'はなが さく',         once: true },
  { id: 'fn_tent',   kind: 'furniture', name: 'テント',     emoji: '⛺', price: 14, desc: 'キャンプの きち',     once: true },
  { id: 'fn_fire',   kind: 'furniture', name: 'たきび',     emoji: '🔥', price: 12, desc: 'あたたかい',          once: true },
  { id: 'fn_swing',  kind: 'furniture', name: 'ブランコ',   emoji: '🛝', price: 16, desc: 'ゆらゆら あそべる',   once: true },
  { id: 'fn_sign',   kind: 'furniture', name: 'かんばん',   emoji: '🪧', price: 5,  desc: 'しまの なまえ',       once: true },
  { id: 'fn_mill',   kind: 'furniture', name: 'ふうしゃ',   emoji: '🌬️', price: 22, desc: 'かぜで まわる',       once: true },

  // ── 教科キャラへの プレゼント（消耗品）──
  { id: 'gf_cookie', kind: 'gift', name: 'クッキー',   emoji: '🍪', price: 2, desc: 'なかよし +1', love: 1 },
  { id: 'gf_flower', kind: 'gift', name: 'おはな',     emoji: '🌸', price: 3, desc: 'なかよし +2', love: 2 },
  { id: 'gf_berry',  kind: 'gift', name: 'いちご',     emoji: '🍓', price: 4, desc: 'なかよし +2', love: 2 },
  { id: 'gf_apple',  kind: 'gift', name: 'りんご',     emoji: '🍎', price: 4, desc: 'なかよし +2', love: 2 },
  { id: 'gf_book',   kind: 'gift', name: 'えほん',     emoji: '📚', price: 5, desc: 'なかよし +3', love: 3 },
  { id: 'gf_dango',  kind: 'gift', name: 'おだんご',   emoji: '🍡', price: 5, desc: 'なかよし +3', love: 3 },

  // ── 教科キャラの きせかえ（1回かえば ずっと つかえる）──
  { id: 'fw_silk',   kind: 'fwear', name: 'シルクハット', emoji: '🎩', price: 12, desc: 'きょうかキャラに かぶせる', once: true },
  { id: 'fw_glass',  kind: 'fwear', name: 'サングラス',   emoji: '🕶️', price: 10, desc: 'きょうかキャラに かける',   once: true },
  { id: 'fw_scarf',  kind: 'fwear', name: 'マフラー',     emoji: '🧣', price: 10, desc: 'きょうかキャラに まく',     once: true },
  { id: 'fw_flower', kind: 'fwear', name: 'はなかんむり', emoji: '🌼', price: 14, desc: 'きょうかキャラに のせる',   once: true },

  // ── けんせつ（BUILD_ORDER の順に1つずつ）──
  { id: 'bd_house',  kind: 'building', name: 'みんなの おうち',     emoji: '🏠', price: 30,  desc: 'しまの おくに おうちが たつ', once: true },
  { id: 'bd_pier',   kind: 'building', name: 'さんばし と ボート', emoji: '🌉', price: 60,  desc: 'しまが ひとまわり ひろがる',  once: true },
  { id: 'bd_light',  kind: 'building', name: 'とうだい',           emoji: '🗼', price: 100, desc: 'ひかりが くるくる まわる',    once: true },
  { id: 'bd_school', kind: 'building', name: 'しまの がっこう',     emoji: '🏫', price: 150, desc: 'しまが もっと ひろがって こじまも できる', once: true },
  { id: 'bd_bridge', kind: 'building', name: 'となりの しまへの はし', emoji: '🌉', price: 200, desc: 'はなばたけの しまへ いけるように なる', once: true },
  { id: 'bd_wheel',  kind: 'building', name: 'かんらんしゃ',       emoji: '🎡', price: 250, desc: 'しょうごう「しまの おうさま」', once: true },
  // 10月：月の位置と見え方
  { id: 'bd_observ', kind: 'building', name: 'てんもんだい',       emoji: '🔭', price: 300, desc: 'よるに なると 月が みえる',  once: true },
  { id: 'bd_moon',   kind: 'building', name: 'おつきみだい',       emoji: '🎑', price: 400, desc: 'おだんごと すすきで お月見',  once: true },
  // 11月（となりの しまに たつ。単元が きまったら 名前・絵を さしかえる）
  { id: 'bd_imo',    kind: 'building', name: 'やきいも やたい',     emoji: '🍠', price: 500, desc: 'となりの しまに たつ。よるは あかりが つく', once: true },
  { id: 'bd_arbor',  kind: 'building', name: 'もみじの あずまや',   emoji: '🍁', price: 600, desc: 'となりの しまに たつ。みんなで ひとやすみ', once: true },

  // ── 季節の品（その月のあいだだけ 並ぶ。かったものは ずっと つかえる）──
  { id: 'gf_pumpkin', kind: 'gift',  name: 'かぼちゃだんご', emoji: '🎃', price: 4, desc: '10月だけ・なかよし +3', love: 3, season: 10 },
  { id: 'fw_pumpkin', kind: 'fwear', name: 'かぼちゃの ぼうし', emoji: '🎃', price: 12, desc: '10月だけの きせかえ', once: true, season: 10 },
  { id: 'gf_imo',     kind: 'gift',  name: 'やきいも',       emoji: '🍠', price: 4, desc: '11月だけ・なかよし +3', love: 3, season: 11 },
  { id: 'fw_leaf',    kind: 'fwear', name: 'もみじの かみかざり', emoji: '🍁', price: 12, desc: '11月だけの きせかえ', once: true, season: 11 },

  // ── まいにちスタンプの ごほうび（ショップでは売らない）──
  { id: 'fn_trophy',   kind: 'furniture', name: 'がんばりトロフィー', emoji: '🏆', price: 0, desc: 'スタンプ7日の ごほうび',  once: true, reward: true, anywhere: true },
  { id: 'fw_gold',     kind: 'fwear',     name: 'きんの かんむり',    emoji: '👑', price: 0, desc: 'スタンプ14日の ごほうび', once: true, reward: true },
  { id: 'fn_fountain', kind: 'furniture', name: 'ふんすい',           emoji: '⛲', price: 0, desc: 'スタンプ20日の ごほうび', once: true, reward: true },
  // 10月の スタンプ（かかし＝社会の 農業にちなんで）
  { id: 'fn_lantern',  kind: 'furniture', name: 'かぼちゃの ランタン', emoji: '🎃', price: 0, desc: '10月の スタンプ7日の ごほうび',  once: true, reward: true, anywhere: true },
  { id: 'fw_moon',     kind: 'fwear',     name: 'おつきさまの かんむり', emoji: '🌕', price: 0, desc: '10月の スタンプ14日の ごほうび', once: true, reward: true },
  { id: 'fn_scarecrow', kind: 'furniture', name: 'かかし',            emoji: '🌾', price: 0, desc: '10月の スタンプ20日の ごほうび', once: true, reward: true },
  // 11月の スタンプ
  { id: 'fn_maple',    kind: 'furniture', name: 'もみじの き',        emoji: '🍁', price: 0, desc: '11月の スタンプ7日の ごほうび',  once: true, reward: true },
  { id: 'fw_acorn',    kind: 'fwear',     name: 'どんぐり ぼうし',    emoji: '🌰', price: 0, desc: '11月の スタンプ14日の ごほうび', once: true, reward: true },
  { id: 'fn_mushroom', kind: 'furniture', name: 'きのこの いす',      emoji: '🍄', price: 0, desc: '11月の スタンプ20日の ごほうび', once: true, reward: true, anywhere: true },
  // 12月の スタンプ
  { id: 'fn_snowman',  kind: 'furniture', name: 'ゆきだるま',         emoji: '⛄', price: 0, desc: '12月の スタンプ7日の ごほうび',  once: true, reward: true },
  { id: 'fw_santa',    kind: 'fwear',     name: 'サンタの ぼうし',    emoji: '🎅', price: 0, desc: '12月の スタンプ14日の ごほうび', once: true, reward: true },
  { id: 'fn_xtree',    kind: 'furniture', name: 'クリスマスツリー',   emoji: '🎄', price: 0, desc: '12月の スタンプ20日の ごほうび', once: true, reward: true, anywhere: true },
  ...PHOTO_ITEMS,
  // ── ハロウィンの おかし・つりの ずかんの ごほうび（ショップでは売らない）──
  { id: 'gf_candy',    kind: 'gift',      name: 'ハロウィンの おかし', emoji: '🍬', price: 0, desc: 'ハロウィンの よるに もらえる・なかよし +2', love: 2, reward: true },
  { id: 'fn_fishsign', kind: 'furniture', name: 'さかなの かんばん',   emoji: '🐟', price: 0, desc: 'さかなを 5しゅるい つった ごほうび',  once: true, reward: true },
  { id: 'fn_forest',   kind: 'furniture', name: 'もりの トロフィー',   emoji: '🌲', price: 0, desc: 'クエストの まよいの森で もりのぬしを たおした ごほうび', once: true, reward: true, anywhere: true },
  { id: 'fn_aquarium', kind: 'furniture', name: 'すいそう',           emoji: '🐠', price: 0, desc: 'さかなを 10しゅるい つった ごほうび', once: true, reward: true, anywhere: true },
  // ── 星座ずかん・おだんごお供えの ごほうび（ショップでは売らない）──
  { id: 'fn_starsign',   kind: 'furniture', name: 'ほしざの かんばん',     emoji: '🌟', price: 0, desc: '星座を 5しゅるい みつけた ごほうび',  once: true, reward: true },
  { id: 'fn_stardome',   kind: 'furniture', name: 'プラネタリウムドーム', emoji: '🪐', price: 0, desc: '星座を 10しゅるい みつけた ごほうび', once: true, reward: true, anywhere: true },
  { id: 'fn_moonrabbit', kind: 'furniture', name: 'もちつき うさぎ',     emoji: '🐇', price: 0, desc: 'まんげつの よるに おだんごを おそなえした ごほうび', once: true, reward: true, anywhere: true },

  // ── はたけの たね（うえて クイズを 3にち やると とれる）──
  { id: 'sd_berry',   kind: 'seed', name: 'いちごの たね',     emoji: '🍓', price: 3, desc: 'いちごが 2つ とれる',   crop: 'gf_berry' },
  { id: 'sd_flower',  kind: 'seed', name: 'おはなの たね',     emoji: '🌸', price: 3, desc: 'おはなが 2つ さく',     crop: 'gf_flower' },
  { id: 'sd_pumpkin', kind: 'seed', name: 'かぼちゃの たね',   emoji: '🎃', price: 4, desc: '10月だけ・かぼちゃだんごが 2つ', crop: 'gf_pumpkin', season: 10 },
  { id: 'sd_imo',     kind: 'seed', name: 'さつまいもの たね', emoji: '🍠', price: 4, desc: '11月だけ・やきいもが 2つ',     crop: 'gf_imo', season: 11 },
  ...ROOM_ITEMS,
];

/** その場所に置ける家具か */
export function placeableIn(item: Item | undefined, area: 'main' | 'east' | 'house'): boolean {
  if (!item) return false;
  if (item.anywhere) return item.kind === 'furniture' || item.kind === 'indoor';
  return area === 'house' ? item.kind === 'indoor' : item.kind === 'furniture';
}

/** まいにちスタンプの ごほうび（その月の日数）。item がないものは プレゼント3つ */
export interface StampReward { days: number; item?: string; label: string }
/** 月（1..12）ごとの 7・14・20日の品。表にない月は 9月と同じ（🏆👑⛲）。持っている品は プレゼント3つに かわる */
const STAMP_ITEMS_BY_MONTH: Record<number, [string, string, string]> = {
  9: ['fn_trophy', 'fw_gold', 'fn_fountain'],
  10: ['fn_lantern', 'fw_moon', 'fn_scarecrow'],
  11: ['fn_maple', 'fw_acorn', 'fn_mushroom'],
  12: ['fn_snowman', 'fw_santa', 'fn_xtree'],
};
export function stampRewardsFor(month: number): StampReward[] {
  const ids = STAMP_ITEMS_BY_MONTH[month] ?? STAMP_ITEMS_BY_MONTH[9];
  const lbl = (id: string) => `${ITEM_BY_ID[id].emoji} ${ITEM_BY_ID[id].name}`;
  return [
    { days: 3, label: '🎁 プレゼント 3つ' },
    { days: 7, item: ids[0], label: lbl(ids[0]) },
    { days: 14, item: ids[1], label: lbl(ids[1]) },
    { days: 20, item: ids[2], label: lbl(ids[2]) },
  ];
}
/** スタンプの月として 表があるか（点検スクリプト用に export） */
export const STAMP_MONTHS = Object.keys(STAMP_ITEMS_BY_MONTH).map(Number);
/** たからばこ・スタンプで もらえる プレゼント（季節の品は入れない） */
export const EVERYDAY_GIFTS = ['gf_cookie', 'gf_flower', 'gf_berry', 'gf_apple', 'gf_book', 'gf_dango'];

/** いまの月（1..12）。?season=10 で見た目の確認ができる */
export function seasonNow(): number {
  const q = Number(new URLSearchParams(location.search).get('season'));
  return q >= 1 && q <= 12 ? q : new Date().getMonth() + 1;
}
/** ショップに並べるか（季節の品は その月だけ。もう持っている きせかえは いつでも見える） */
export function onSale(item: Item, ownedIds: string[]): boolean {
  if (item.reward) return false;
  return !item.season || item.season === seasonNow() || ownedIds.includes(item.id);
}

/** 建てる順番。前のを建てると次が出る */
export const BUILD_ORDER = ['bd_house', 'bd_pier', 'bd_light', 'bd_school', 'bd_bridge', 'bd_wheel', 'bd_observ', 'bd_moon', 'bd_imo', 'bd_arbor'];
/** つぎに建てるもの＝BUILD_ORDER の順で まだ建てていない最初の1つ（途中に足しても 今のセーブが こわれない） */
export function nextBuildId(buildings: string[]): string | undefined {
  return BUILD_ORDER.find((id) => !buildings.includes(id));
}
export const WHEEL_TITLE = 'しまの おうさま';

/** 建てた数 → 島の広がり段階（0..2）。さんばしで1段、がっこうでもう1段 */
export function expansionOf(buildings: string[]): number {
  return buildings.includes('bd_school') ? 2 : buildings.includes('bd_pier') ? 1 : 0;
}

/** 教科キャラの だいすきなもの（ポイント2倍） */
export const FAVORITE: Record<string, string> = {
  tanuki: 'gf_dango', owl: 'gf_book', parrot: 'gf_berry', rabbit: 'gf_flower', bear: 'gf_cookie', cow: 'gf_apple',
};
export const GIFTS_PER_DAY = 3;
/** ♥が1つ増える なかよしポイント */
export const LOVE_STEPS = [3, 8, 15, 25, 40];
export function heartsOf(pts: number): number {
  return LOVE_STEPS.filter((t) => pts >= t).length;
}
export const FOLLOW_HEARTS = 3;

export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export const KIND_TABS: { key: 'eat' | 'gear' | 'gift' | 'seed' | 'dress' | 'room' | 'home' | 'build'; label: string; kinds: ItemKind[] }[] = [
  { key: 'eat',   label: '🍙 エサ・おやつ', kinds: ['food', 'snack'] },
  { key: 'gift',  label: '🎁 プレゼント',   kinds: ['gift'] },
  { key: 'seed',  label: '🌱 たね',         kinds: ['seed'] },
  // 'gear'（じゅう・たて）はミニバトル用だったので、バトル廃止とともに売り場から外した
  { key: 'dress', label: '🎀 きせかえ',     kinds: ['costume', 'hat', 'fwear'] },
  { key: 'room',  label: '🌴 かぐ',         kinds: ['furniture'] },
  { key: 'home',  label: '🛋️ へや',         kinds: ['indoor', 'wall', 'floor'] },
  { key: 'build', label: '🏗️ けんせつ',     kinds: ['building'] },
];

export function isConsumable(item: Item): boolean {
  return item.kind === 'food' || item.kind === 'snack' || item.kind === 'gift' || item.kind === 'seed';
}

export function slotOf(item: Item): 'weapon' | 'shield' | 'costume' | 'hat' | null {
  if (item.kind === 'gun') return 'weapon';
  if (item.kind === 'shield') return 'shield';
  if (item.kind === 'costume') return 'costume';
  if (item.kind === 'hat') return 'hat';
  return null;
}

