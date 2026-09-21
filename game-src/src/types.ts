import type { CharKey } from './lib/chars';

export type PlayerKey = 'anri' | 'rino';
export type Stage = 'egg' | 'baby' | 'teen' | 'adult';
export type Slot = 'weapon' | 'shield' | 'costume' | 'hat';
export type Mood = 'egg' | 'happy' | 'hungry' | 'down';
export type Screen = 'island' | 'shop' | 'battle';

/** 島のなかの位置。0..1 の割合で持つので、あとで島を広げても壊れない */
export interface Pos {
  x: number;
  y: number;
}

export interface MonsterState {
  charKey: CharKey | null; // 孵化した瞬間に決まる。null＝まだたまご
  stage: Stage;
  exp: number;
  fullness: number;        // ★lastFedAt 時点の満腹度。現在値は displayFullness() で導出する
  lastFedAt: number;       // epoch ms。0 ＝ まだ一度もあげていない
  hatchFeeds: number;      // 孵化までのごはん回数
  pos: Pos;
  wander: Pos;             // うろうろ移動の目的地
}

export interface PlacedFurniture {
  uid: string;
  id: string;
  x: number;
  y: number;
}

export interface SaveV1 {
  v: 1;
  createdAt: number;
  player: PlayerKey | null;   // null＝まだ主人公を選んでいない
  pos: Pos;                   // 主人公の立ち位置
  monster: MonsterState;
  inventory: Record<string, number>;  // 消費アイテム（エサ・おやつ）
  owned: string[];                    // 一度きりの持ち物（装備・きせかえ・家具）
  equipped: Record<Slot, string | null>;
  placed: PlacedFurniture[];          // 島に置いた家具
  titles: string[];
  battle: { wins: number; losses: number; lastAt: number };
}

export type ItemKind = 'food' | 'snack' | 'gun' | 'shield' | 'costume' | 'hat' | 'furniture';

export interface Item {
  id: string;
  kind: ItemKind;
  name: string;
  emoji: string;
  price: number;
  desc: string;
  once?: boolean;     // 一度買えば十分なもの（装備・きせかえ・家具）
  fullness?: number;  // エサ：満腹度の回復量
  exp?: number;       // エサ・おやつ：経験値
  power?: number;     // 銃：攻撃力
  reduce?: number;    // 盾：追加の軽減率
  heal?: number;      // 盾：守ったときの追加回復
}
