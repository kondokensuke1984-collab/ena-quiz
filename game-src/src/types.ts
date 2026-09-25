import type { CharKey } from './lib/chars';

export type PlayerKey = 'anri' | 'rino' | 'mitsuki' | 'kensuke';
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

/** 島の場所。main＝いまの島、east＝となりの島、house＝おうちの中 */
export type Area = 'main' | 'east' | 'house';

export interface PlacedFurniture {
  uid: string;
  id: string;
  x: number;
  y: number;
  area?: Area;   // ないものは main（エリアを作る前に置いた家具）
}

/** 教科キャラと あそんだ記録（char キーごと。月をまたいで引きつぐ） */
export interface FriendPlay {
  pts: number;          // なかよしポイント（♥の元）
  day: string;          // today を数えている日（YYYY-MM-DD）
  today: number;        // その日に あげたプレゼントの数
  wear: string | null;  // つけている きせかえ（fwear のID）
  followOff?: boolean;  // true＝なかよし♥3いじょうでも ついてこない（プレイヤーが選んだ）
}

/** キャラからの おてがみ */
export interface Letter {
  id: string;
  from: string;       // CharKey（ルナは 'luna'）
  fromName: string;
  title: string;
  body: string;
  at: number;
  read: boolean;
}

/** 手紙を出すかどうかを決めるための「前回の記録」 */
export interface LetterMarks {
  init: boolean;                    // はじめての記録（ここでは手紙を出さずに覚えるだけ）
  lv: Record<string, number>;       // friend.id → 前回のLv
  full: Record<string, boolean>;    // friend.id → ぜんぶ⭐のお祝いずみ
  stamp: string[];                  // 'YYYY-M:7' スタンプのお祝いずみ
  weekly: string;                   // 最後に週のまとめを出した日（YYYY-M-D）
  halloween?: string;               // ハロウィンの手紙を出した年
  month?: string;                   // 最後に見た「しゅやくの 月」（YYYYMM）。かわったら ひっこしの手紙
  detective?: number[];             // 名探偵あんり：ひらいたと 手紙で しらせた じけん
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
  buildings: string[];                        // 建てた建物（BUILD_ORDER の順）
  friendsPlay: Record<string, FriendPlay>;    // キー＝CharKey
  stampClaims: string[];                      // 'YYYY-M:日数' うけとった スタンプのごほうび
  letters: Letter[];                          // 新しい順。最大30通
  letterMarks: LetterMarks;
  lastChest: string;                          // たからばこを あけた日（YYYY-M-D）
  area: Area;                                 // いま いる場所（pos はこの場所での立ち位置）
  room: { wall: string; floor: string };      // おうちの かべがみ・ゆか
  fish: FishLog;                              // つりの きろく
  farm: { plots: (FarmPlot | null)[]; dex: string[]; flowers: string[] };  // はたけ 3まい・しゅうかくした たね・はなを しらべた たね
  treats: { day: string; got: string[] };     // ハロウィンで おかしを くれた子（その日）
  stars: { dex: string[] };                   // てんもんだいで みつけた星座ID
  moon: { lastOffer: string };                // おだんごを おそなえした日（YYYY-M-D）
  openingSeen: boolean;                       // はじまりの ものがたり（オープニング）を 見た
  detective: { solved: number[]; found: Record<string, string[]>; hint: Record<string, number> };  // 名探偵あんり：とけた じけん・みつけた しょうこ・つかった ヒント
}

export interface FishLog {
  day: string;                    // today を数えている日（YYYY-M-D）
  today: number;                  // その日に つりをした回数
  caught: Record<string, number>; // 魚ID → つった数
  big: Record<string, number>;    // 魚ID → いちばん大きい cm
}

export interface FarmPlot {
  seed: string;     // たねの ID
  at: string;       // うえた日（YYYY-M-D）
  watered: string;  // さいごに みずをあげた日
  wetAt?: string;   // はじめて みずをあげた日（はつがは ここから数える）
  wetDays?: number; // みずを あげた日の数
  fert?: ('n' | 'p' | 'k')[]; // あげた ひりょう
  box?: boolean;    // はこを かぶせて 日光を さえぎる じっけん
}

export type ItemKind =
  | 'food' | 'snack' | 'gun' | 'shield' | 'costume' | 'hat' | 'furniture'
  | 'building' | 'gift' | 'fwear'
  | 'indoor' | 'wall' | 'floor' | 'seed' | 'fert';

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
  love?: number;      // プレゼント：なかよしポイント
  season?: number;    // 季節の品：この月（1..12）のあいだだけ ショップに並ぶ
  reward?: boolean;   // スタンプのごほうび（ショップでは売らない）
  anywhere?: boolean; // そとにも おうちの中にも 置ける家具
  builtin?: boolean;  // はじめから もっている（かべがみ・ゆかの さいしょの1つ）
  crop?: string;      // たね：とれる プレゼントの ID（2つ）
}
