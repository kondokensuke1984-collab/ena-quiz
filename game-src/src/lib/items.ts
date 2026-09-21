// ショップの商品と、バトルの報酬テーブル。データだけ置く。

import type { Item, ItemKind } from '../types';

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
];

export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export const KIND_TABS: { key: 'eat' | 'gear' | 'dress' | 'room'; label: string; kinds: ItemKind[] }[] = [
  { key: 'eat',   label: '🍙 エサ・おやつ', kinds: ['food', 'snack'] },
  { key: 'gear',  label: '🛡️ そうび',       kinds: ['gun', 'shield'] },
  { key: 'dress', label: '🎀 きせかえ',     kinds: ['costume', 'hat'] },
  { key: 'room',  label: '🌴 かぐ',         kinds: ['furniture'] },
];

export function isConsumable(item: Item): boolean {
  return item.kind === 'food' || item.kind === 'snack';
}

export function slotOf(item: Item): 'weapon' | 'shield' | 'costume' | 'hat' | null {
  if (item.kind === 'gun') return 'weapon';
  if (item.kind === 'shield') return 'shield';
  if (item.kind === 'costume') return 'costume';
  if (item.kind === 'hat') return 'hat';
  return null;
}

/** 勝利数の節目でもらえるもの。★メダルは配らない（メダルはクイズでしか増えない） */
export const BATTLE_REWARDS: { wins: number; furniture: string; title: string }[] = [
  { wins: 1, furniture: 'fn_rug',   title: 'はじめての しょうり' },
  { wins: 2, furniture: 'fn_sign',  title: 'しまの たんけんか' },
  { wins: 3, furniture: 'fn_lamp',  title: 'たたかいの たつじん' },
  { wins: 5, furniture: 'fn_tree',  title: 'しまの えいゆう' },
  { wins: 8, furniture: 'fn_mill',  title: 'でんせつの しまぬし' },
];
