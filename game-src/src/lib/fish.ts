// つり：さかなの表と、なにが かかるかの くじ。メダルは出さない（ずかんと ごほうびの家具だけ）。

import type { TimeOfDay, Weather } from './sky';

export interface Fish {
  id: string;
  name: string;
  emoji: string;
  rare: 1 | 2 | 3;       // ★の数。多いほど でにくい・タイミングが むずかしい
  min: number;           // 大きさ cm
  max: number;
  when?: 'night' | 'rain' | 'evening' | 'rainbow';
  season?: number;       // この月だけ
  hue?: number;          // 絵文字の 色を かえる（🐟 が ならんでも 見わけが つくように。hue-rotate の 度）
  hint: string;          // ずかんで まだ つれていないときの ヒント
}

export const FISH: Fish[] = [
  { id: 'aji',    name: 'あじ',           emoji: '🐟', rare: 1, min: 15, max: 35,  hint: 'いつでも つれるよ' },
  { id: 'kani',   name: 'かに',           emoji: '🦀', rare: 1, min: 5,  max: 20,  hint: 'いつでも つれるよ' },
  { id: 'ebi',    name: 'えび',           emoji: '🦐', rare: 1, min: 5,  max: 25,  hint: 'いつでも つれるよ' },
  { id: 'kai',    name: 'かいがら',       emoji: '🐚', rare: 1, min: 3,  max: 12,  hint: 'いつでも つれるよ' },
  { id: 'boot',   name: 'ながぐつ',       emoji: '👢', rare: 1, min: 20, max: 30,  hint: 'さかな…じゃないかも？' },
  { id: 'nemo',   name: 'クマノミ',       emoji: '🐠', rare: 2, min: 6,  max: 12,  hint: 'いつでも つれるよ' },
  { id: 'fugu',   name: 'ふぐ',           emoji: '🐡', rare: 2, min: 15, max: 40,  hint: 'いつでも つれるよ' },
  { id: 'tako',   name: 'たこ',           emoji: '🐙', rare: 2, min: 30, max: 90,  hint: 'いつでも つれるよ' },
  { id: 'ika',    name: 'いか',           emoji: '🦑', rare: 2, min: 20, max: 50,  when: 'night', hint: 'よるに つれるよ' },
  { id: 'anko',   name: 'ちょうちんあんこう', emoji: '🏮', rare: 3, min: 20, max: 60, when: 'night', hint: 'よるの ふかい うみに いるよ' },
  { id: 'namazu', name: 'なまず',         emoji: '🐟', rare: 2, min: 30, max: 80,  when: 'rain', hint: 'あめの日に つれるよ' },
  { id: 'sanma',  name: 'さんま',         emoji: '🐟', rare: 2, min: 25, max: 35,  season: 10, hint: '10月だけ つれるよ' },
  { id: 'sake',   name: 'さけ',           emoji: '🐟', rare: 2, min: 50, max: 90,  season: 11, hint: '11月だけ つれるよ' },
  { id: 'kame',   name: 'うみがめ',       emoji: '🐢', rare: 3, min: 50, max: 120, hint: 'めったに あえないよ' },
  { id: 'iruka',  name: 'いるか',         emoji: '🐬', rare: 3, min: 150, max: 300, hint: 'めったに あえないよ' },
  { id: 'same',   name: 'さめ',           emoji: '🦈', rare: 3, min: 100, max: 400, hint: 'めったに あえないよ' },
  // ── 2026-10 に ふやした なかま ──
  { id: 'hitode',  name: 'ひとで',         emoji: '⭐', rare: 1, min: 8,  max: 25,  hint: 'いつでも つれるよ' },
  { id: 'iseebi',  name: 'いせえび',       emoji: '🦞', rare: 2, min: 20, max: 40,  hint: 'いつでも つれるよ' },
  { id: 'uni',     name: 'うに',           emoji: '🌰', rare: 2, min: 5,  max: 12,  hint: 'とげとげに ちゅうい！' },
  { id: 'kujira',  name: 'くじら',         emoji: '🐳', rare: 3, min: 500, max: 1500, hint: 'めったに あえないよ' },
  { id: 'takara',  name: 'うみの たからばこ', emoji: '🎁', rare: 3, min: 30, max: 60,  hint: 'うみの そこに ねむっている…？' },
  { id: 'suzuki',  name: 'すずき',         emoji: '🐟', rare: 2, min: 40, max: 90,  when: 'evening', hue: 180, hint: 'ゆうがたに つれるよ' },
  { id: 'tachiuo', name: 'たちうお',       emoji: '🗡️', rare: 2, min: 60, max: 120, when: 'evening', hint: 'ゆうがたに つれるよ' },
  { id: 'hotaru',  name: 'うみほたる',     emoji: '✨', rare: 2, min: 1,  max: 3,   when: 'night', hint: 'よるの うみで ひかるよ' },
  { id: 'kaeru',   name: 'かえる',         emoji: '🐸', rare: 1, min: 4,  max: 12,  when: 'rain', hint: 'あめの日に でてくるよ' },
  { id: 'ningyo',  name: 'にんぎょ',       emoji: '🧜‍♀️', rare: 3, min: 120, max: 160, when: 'rainbow', hint: 'にじが でた日に あえるかも' },
  { id: 'buri',    name: 'ぶり',           emoji: '🐟', rare: 2, min: 60, max: 100, season: 12, hue: 200, hint: '12月だけ つれるよ' },
  { id: 'tara',    name: 'たら',           emoji: '🐟', rare: 2, min: 40, max: 80,  season: 1,  hue: 30,  hint: '1月だけ つれるよ' },
  { id: 'kaki',    name: 'かき',           emoji: '🦪', rare: 2, min: 8,  max: 15,  season: 2,  hint: '2月だけ つれるよ' },
  { id: 'wakame',  name: 'わかめ',         emoji: '🌿', rare: 1, min: 30, max: 100, season: 3,  hint: '3月だけ つれるよ' },
  { id: 'tai',     name: 'さくらだい',     emoji: '🐟', rare: 2, min: 30, max: 60,  season: 4,  hue: 140, hint: '4月だけ つれるよ' },
  { id: 'katsuo',  name: 'かつお',         emoji: '🐟', rare: 2, min: 40, max: 80,  season: 5,  hue: 240, hint: '5月だけ つれるよ' },
  { id: 'ayu',     name: 'あゆ',           emoji: '🐟', rare: 2, min: 15, max: 25,  season: 6,  hue: 90,  hint: '6月だけ つれるよ' },
  { id: 'unagi',   name: 'うなぎ',         emoji: '🐟', rare: 2, min: 40, max: 90,  season: 7,  hue: 300, hint: '7月だけ つれるよ' },
  { id: 'tobiuo',  name: 'とびうお',       emoji: '🐟', rare: 2, min: 25, max: 35,  season: 8,  hue: 60,  hint: '8月だけ つれるよ' },
  { id: 'iwashi',  name: 'いわし',         emoji: '🐟', rare: 1, min: 10, max: 20,  season: 9,  hue: 270, hint: '9月だけ つれるよ' },
];
/** 絵文字に つける 色の フィルター（hue が ある さかなだけ） */
export function fishStyle(f: Fish): { filter: string } | undefined {
  return f.hue ? { filter: `hue-rotate(${f.hue}deg) saturate(1.3)` } : undefined;
}
export const FISH_BY_ID: Record<string, Fish> = Object.fromEntries(FISH.map((f) => [f.id, f]));

/** 1日に つれる数。その日 クイズを5もん やっていたら ふえる */
export const FISH_PER_DAY = 3;
export const FISH_STUDY_BONUS = 2;

/** ずかんの ごほうび（つった しゅるいの数） */
export const FISH_REWARDS: { kinds: number; item: string }[] = [
  { kinds: 5, item: 'fn_fishsign' },
  { kinds: 10, item: 'fn_aquarium' },
  { kinds: 18, item: 'fn_fishboat' },
  { kinds: 25, item: 'fn_whalefount' },
];

const WEIGHT = { 1: 10, 2: 4, 3: 1.2 } as const;

export interface FishCtx { tod: TimeOfDay; weather: Weather; month: number }

/** いま つれる さかな */
export function catchable(ctx: FishCtx): Fish[] {
  return FISH.filter((f) =>
    (!f.season || f.season === ctx.month) &&
    (f.when !== 'night' || ctx.tod === 'night') &&
    (f.when !== 'evening' || ctx.tod === 'evening') &&
    (f.when !== 'rain' || ctx.weather === 'rain') &&
    (f.when !== 'rainbow' || ctx.weather === 'rainbow'));
}

/** なにが かかるか。限定の さかなは 出やすくして「いまだけ」を 楽しめるようにする */
export function rollFish(ctx: FishCtx, rnd = Math.random): { fish: Fish; cm: number } {
  const list = catchable(ctx);
  const w = list.map((f) => WEIGHT[f.rare] * (f.when || f.season ? 2 : 1));
  let r = rnd() * w.reduce((a, b) => a + b, 0);
  let fish = list[list.length - 1];
  for (let i = 0; i < list.length; i++) {
    r -= w[i];
    if (r <= 0) { fish = list[i]; break; }
  }
  const cm = Math.round(fish.min + (fish.max - fish.min) * rnd());
  return { fish, cm };
}

/** タイミングの あたり はば（0..1）。★が多いほど せまい */
export function zoneWidth(f: Fish): number {
  return f.rare === 1 ? 0.3 : f.rare === 2 ? 0.22 : 0.15;
}
