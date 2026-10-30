// モクタの もりづくり：林業の作業の流れ（植栽→下刈り→除伐→間伐→主伐）を、手を動かして まなぶ。
// 教材（ringyo.html 4章）の「人工林を育てる森林整備サイクル」に合わせた林齢の目安：
//   植栽＝1年／下刈り＝1〜5年ごろ／除伐＝10年ごろ／間伐＝20〜45年に3回ほど／主伐＝50〜100年。
// メダルは つかわない・ふやさない。ごほうびは 家具だけ（森ごとに1つ）。

export type Work = 'plant' | 'weed' | 'cull' | 'thin' | 'fell' | 'watch';
export type Species = 'sugi' | 'hinoki' | 'hiba';

export interface Forest {
  id: string;
  name: string;      // 吉野すぎ
  pref: string;      // 奈良県
  species: Species;
  kind: 'jinko' | 'tennen';
  fact: string;      // えらんだ ときの ひとこと
  reward: string;    // 家具ID
}

export const FORESTS: Forest[] = [
  { id: 'yoshino', name: '吉野すぎ',   pref: '奈良県', species: 'sugi',   kind: 'jinko',  reward: 'fn_wd_tar', fact: '奈良県の紀伊山地で育つ、人工の三大美林。まっすぐで目が細かく、たるや酒だるにも使われるよ' },
  { id: 'tenryu',  name: '天竜すぎ',   pref: '静岡県', species: 'sugi',   kind: 'jinko',  reward: 'fn_wd_bench', fact: '静岡県の天竜川ぞいにある、人工の三大美林。人の手で植えて、大事に手入れしてきた森だよ' },
  { id: 'owase',   name: '尾鷲ひのき', pref: '三重県', species: 'hinoki', kind: 'jinko',  reward: 'fn_wd_tub', fact: '三重県の尾鷲で育つ、人工の三大美林。ひのきは いいにおいで、お風呂やお寺の建物にも使われるよ' },
  { id: 'akita',   name: '秋田すぎ',   pref: '秋田県', species: 'sugi',   kind: 'tennen', reward: 'fn_wd_shelf', fact: '秋田県の天然の三大美林。もともと自然にできた森だから、植えずに「守り育てる」手入れがたいせつだよ' },
  { id: 'aomori',  name: '青森ひば',   pref: '青森県', species: 'hiba',   kind: 'tennen', reward: 'fn_wd_board', fact: '青森県の天然の三大美林。ひばは水や虫に強い木で、すてきな香りがするよ' },
  { id: 'kiso',    name: '木曽ひのき', pref: '長野県', species: 'hinoki', kind: 'tennen', reward: 'fn_wd_box', fact: '長野県の天然の三大美林。木曽のひのきは むかしから大切に守られてきた森だよ' },
];
export const FOREST_BY_ID: Record<string, Forest> = Object.fromEntries(FORESTS.map((f) => [f.id, f]));

export const SPECIES_LABEL: Record<Species, string> = { sugi: 'すぎ', hinoki: 'ひのき', hiba: 'ひば' };

export const WORK_LABEL: Record<Work, { name: string; emoji: string; tool: string }> = {
  plant: { name: '植栽',   emoji: '🌱', tool: 'なえ木' },
  weed:  { name: '下刈り', emoji: '🌿', tool: 'かま' },
  cull:  { name: '除伐',   emoji: '🪚', tool: 'のこぎり' },
  thin:  { name: '間伐',   emoji: '🌲', tool: 'のこぎり/チェーンソー' },
  fell:  { name: '主伐',   emoji: '🪓', tool: 'おの/チェーンソー' },
  watch: { name: '見守り', emoji: '👀', tool: '' },
};

export interface Checkpoint {
  age: number;       // 林齢（年）
  work: Work;
  need: number;      // この時期に やる回数（木の本数・草の かたまり）
  title: string;     // いまの作業
  say: string;       // モクタの ヒント（ヒントありの ときに出る）
}

export const SLOTS = 12;      // 木を 植えられる 場所（よこ6×たて2）
export const WEED_TUFTS = 8;  // 下刈りで かる 草の かたまり

/** 人工の森：植栽から主伐まで ぜんぶ */
export const JINKO_STEPS: Checkpoint[] = [
  { age: 1,  work: 'plant', need: SLOTS,     title: '植栽（なえ木を植える）', say: '林齢1年。土の あなに なえ木を 1本ずつ 植えよう（なぞっても OK）' },
  { age: 2,  work: 'weed',  need: WEED_TUFTS, title: '下刈り（草をかる）',     say: '林齢2年。なえ木より 草が のびたよ！ かまで 草を かろう（なぞって OK）' },
  { age: 3,  work: 'weed',  need: WEED_TUFTS, title: '下刈り（草をかる）',     say: '林齢3年。また 草が はえたよ。下刈りは 植えてから 5年ぐらい くりかえすんだ' },
  { age: 5,  work: 'weed',  need: WEED_TUFTS, title: '下刈り（草をかる）',     say: '林齢5年。さいごの 下刈り！ 木が 草より 高くなれば もう だいじょうぶ' },
  { age: 10, work: 'cull',  need: 2,         title: '除伐（形の悪い木を切る）', say: '林齢10年ごろ。まがった木・弱った木（色が ちがう木）だけを 切って、いい木を そだてよう' },
  { age: 25, work: 'thin',  need: 2,         title: '間伐（木をまびく）',       say: '林齢25年ごろ。木が こみあってきたよ。2本 切って 本数を ととのえよう（1回め）' },
  { age: 35, work: 'thin',  need: 2,         title: '間伐（木をまびく）',       say: '林齢35年ごろ。間伐は 20〜45年のあいだに 3回ほど やるよ（2回め）' },
  { age: 45, work: 'thin',  need: 2,         title: '間伐（木をまびく）',       say: '林齢45年ごろ。さいごの 間伐（3回め）。残った木が ぐんと 太くなるよ' },
  { age: 55, work: 'fell',  need: 0,         title: '主伐（育った木を切り出す）', say: '林齢50年をこえた！ 育った木を 切って、木材として 運び出そう（50〜100年ごろ）' },
];

/** 天然の森：植えずに 守り育てる（手入れ中心） */
export const TENNEN_STEPS: Checkpoint[] = [
  { age: 60,  work: 'cull',  need: 2, title: '手入れ（弱った木をのぞく）',   say: '天然林は 人が植えた森じゃないよ。かれかけた木・病気の木を 2本 切って、森を元気にしよう' },
  { age: 80,  work: 'thin',  need: 2, title: '手入れ（こみあいをへらす）',   say: '木が こみあうと 日光が とどかないよ。2本 まびいて、若い木に 光を あげよう' },
  { age: 100, work: 'watch', need: 0, title: '見守り（切らずに守る）',       say: '天然の美林は 切らずに 守っていく森。ここまで 守ってきた 100年の 森を 見てみよう' },
];

export const stepsOf = (f: Forest): Checkpoint[] => (f.kind === 'jinko' ? JINKO_STEPS : TENNEN_STEPS);

/** 森を 1つ クリアしたときの ひとこと */
export function clearLine(f: Forest, age: number): string {
  return f.kind === 'jinko'
    ? `${f.name}の 森が できたよ！ 植えてから ${age}年かけて 育てたんだ`
    : `${f.name}の 森を 守りきったよ！ 天然の森は 切らずに 手入れしながら 守っていくんだ`;
}

/** 林齢→ 木の 大きさ（1が 大人の木） */
export function treeScale(age: number, kind: 'jinko' | 'tennen'): number {
  if (kind === 'tennen') return 1.05;
  if (age <= 1) return 0.2;
  if (age <= 3) return 0.3;
  if (age <= 5) return 0.4;
  if (age <= 10) return 0.52;
  if (age <= 25) return 0.7;
  if (age <= 35) return 0.82;
  if (age <= 45) return 0.94;
  return 1.05;
}

/** 日付で ひらく（2026-10-30から。みんな あそべる。けんすけ・みつきの 端末は いつでも）。?forestry=1 か ?today=YYYY-M-D で 確認できる */
export const FORESTRY_OPEN_FROM = { y: 2026, m: 10, d: 30 };
export function forestryOpen(now = new Date(), search = typeof location !== 'undefined' ? location.search : '', player?: string | null): boolean {
  if (player === 'kensuke' || player === 'mitsuki') return true;   // けんすけ・みつきは 今日から あそべる
  try {
    const q = new URLSearchParams(search);
    if (q.get('forestry') === '1') return true;
    const t = q.get('today');
    if (t) {
      const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t);
      if (m) now = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    }
  } catch { /* そのまま */ }
  const open = new Date(FORESTRY_OPEN_FROM.y, FORESTRY_OPEN_FROM.m - 1, FORESTRY_OPEN_FROM.d);
  return now.getTime() >= open.getTime();
}
