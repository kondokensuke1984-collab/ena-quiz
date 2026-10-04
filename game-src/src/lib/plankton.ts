// 🔬 けんびきょうで みる プランクトン。8月 理科「メダカの育ち方」の ふりかえり。
// のぞくのは 何回でも。ずかんに のせるのは 1日 PLANKTON_PER_DAY 回（クイズ5もんの日は +PLANKTON_STUDY_BONUS）。

export type PlanktonType = 'plant' | 'animal';
export type WaterId = 'tank' | 'paddy' | 'pond';

export interface Plankton {
  id: string;
  name: string;
  type: PlanktonType;
  /** けんびきょうで みたときの 大きさ（ゲーム用の めやす。100ばいで size×133px） */
  size: number;
  /** うごく はやさ（0＝ただようだけ） */
  speed: number;
  /** みずごとの 出やすさ */
  where: Partial<Record<WaterId, number>>;
  /** みつけた ときの ひとこと（ずかん） */
  note: string;
  /** なまえあてを まちがえた ときの ヒント（みため だけ。しょくぶつ／どうぶつは いわない） */
  hint: string;
}

export const PLANKTON: Plankton[] = [
  { id: 'mikazukimo', name: 'ミカヅキモ', type: 'plant', size: 0.26, speed: 0.004, where: { pond: 4, paddy: 2, tank: 1 },
    hint: 'みかづきの かたちを した みどりいろの いきものだよ。',
    note: 'みかづきの かたちを した みどりいろの しょくぶつプランクトン。にっこうで ようぶんを つくるよ。' },
  { id: 'ikadamo', name: 'イカダモ', type: 'plant', size: 0.1, speed: 0.002, where: { pond: 3, paddy: 3 },
    hint: 'ほそながい つぶが いかだのように ならんでいるよ。',
    note: 'ほそながい さいぼうが いかだのように ならんでいる しょくぶつプランクトン。ちいさいので ばいりつを あげて みよう。' },
  { id: 'keiso', name: 'ケイソウ', type: 'plant', size: 0.1, speed: 0.003, where: { pond: 3, tank: 3 },
    hint: 'ガラスのような からを もつ、ちゃいろっぽい ふねの かたちだよ。',
    note: 'ガラスのような からを もつ ちゃいろっぽい しょくぶつプランクトン。とても ちいさいよ。' },
  { id: 'mijinko', name: 'ミジンコ', type: 'animal', size: 1.1, speed: 0.05, where: { pond: 3, paddy: 3, tank: 2 },
    hint: 'からだが すきとおっていて、しょっかくで ぴょんぴょん およぐよ。',
    note: 'からだが すきとおっていて、しょっかくを うごかして およぐ どうぶつプランクトン。メダカの だいこうぶつ！' },
  { id: 'zourimushi', name: 'ゾウリムシ', type: 'animal', size: 0.22, speed: 0.04, where: { paddy: 4, tank: 2 },
    hint: 'ぞうりの かたちで、まわりに こまかい けが はえているよ。',
    note: 'ぞうりの かたちで、からだじゅうの せんもうを うごかして すすむ どうぶつプランクトン。' },
  { id: 'wamushi', name: 'ワムシ', type: 'animal', size: 0.2, speed: 0.02, where: { tank: 3, pond: 2, paddy: 1 },
    hint: 'あたまの けが くるくる わのように まわって みえるよ。',
    note: 'あたまの せんもうが くるくる まわる わのように みえる どうぶつプランクトン。' },
  { id: 'amoeba', name: 'アメーバ', type: 'animal', size: 0.3, speed: 0.008, where: { paddy: 3, tank: 1 },
    hint: 'きまった かたちが なくて、ぐにゃぐにゃ かたちを かえるよ。',
    note: 'きまった かたちが なくて、からだの かたちを かえながら うごく いきもの。' },
];

export const PLANKTON_BY_ID: Record<string, Plankton> = Object.fromEntries(PLANKTON.map((p) => [p.id, p]));

export const WATERS: { id: WaterId; label: string; emoji: string; desc: string }[] = [
  { id: 'tank', label: 'すいそうの みず', emoji: '🐟', desc: 'メダカの すいそうの そこの みず' },
  { id: 'paddy', label: 'たんぼの みず', emoji: '🌾', desc: 'どろの まじった あさい みず' },
  { id: 'pond', label: 'いけの みず', emoji: '🏞️', desc: 'にっこうが よく あたる みどりの みず' },
];

export const TYPE_LABEL: Record<PlanktonType, string> = {
  plant: '🌿 しょくぶつプランクトン',
  animal: '🦐 どうぶつプランクトン',
};
export const TYPE_WHY: Record<PlanktonType, string> = {
  plant: 'にっこうを あびて じぶんで ようぶんを つくるのが しょくぶつプランクトン。',
  animal: 'じぶんで うごいて ほかの プランクトンを たべるのが どうぶつプランクトン。',
};

export const PLANKTON_PER_DAY = 3;
export const PLANKTON_STUDY_BONUS = 2;
export const MICRO_TITLE = 'プランクトン はかせ';
/** ずかんの ごほうび（しゅるいの数 → 家具） */
export const PLANKTON_REWARDS: { kinds: number; item: string }[] = [{ kinds: 4, item: 'fn_medaka' }];

/** せつがんレンズ×たいぶつレンズ */
export const EYEPIECE = 10;
export const OBJECTIVES = [10, 40] as const;
/** 100ばいの ときの しやの はば（プレパラートの 上の たんい） */
export const FIELD_100 = 1.8;
/** 見わけられる 大きさ（しやの はばに たいする わりあい） */
export const MIN_FRAC = 0.1;
export const MAX_FRAC = 1.05;

/** プレパラートの 上に いる 1ぴき */
export interface Critter { key: number; id: string; x: number; y: number; vx: number; vy: number; rot: number; phase: number }

/** プレパラートの ひろさ（まんなか 0,0 から ±SLIDE_HALF） */
export const SLIDE_HALF = 2.2;

/** えらんだ みずから プレパラートを つくる（5〜7ひき） */
export function makeSlide(water: WaterId, rnd = Math.random): Critter[] {
  const pool = PLANKTON.filter((p) => (p.where[water] ?? 0) > 0);
  const total = pool.reduce((a, p) => a + (p.where[water] ?? 0), 0);
  const n = 5 + Math.floor(rnd() * 3);
  const out: Critter[] = [];
  for (let i = 0; i < n; i++) {
    let r = rnd() * total;
    const p = pool.find((q) => (r -= q.where[water] ?? 0) < 0) ?? pool[0];
    const ang = rnd() * Math.PI * 2;
    // はじめの 1ぴきは しやの ちかくに（なにも みえないと こまるので）
    const far = i === 0 ? 0.3 : 0.4 + rnd() * (SLIDE_HALF - 0.5);
    out.push({
      key: i, id: p.id,
      x: Math.cos(ang) * far, y: Math.sin(ang) * far,
      vx: Math.cos(ang + 1.3) * p.speed, vy: Math.sin(ang + 1.3) * p.speed,
      rot: rnd() * 360, phase: rnd() * 10,
    });
  }
  return out;
}

/** 1フレームぶん うごかす（dt 秒）。プレパラートの はしで はねかえる */
export function stepCritters(cs: Critter[], dt: number, t: number): Critter[] {
  return cs.map((c) => {
    const p = PLANKTON_BY_ID[c.id];
    // どうぶつは ときどき むきを かえる、しょくぶつは ゆらゆら
    const wob = p.type === 'animal' ? Math.sin(t * 0.7 + c.phase) * 0.6 : Math.sin(t * 0.3 + c.phase) * 0.2;
    const sp = Math.hypot(c.vx, c.vy) || p.speed;
    const a = Math.atan2(c.vy, c.vx) + wob * dt;
    let vx = Math.cos(a) * sp, vy = Math.sin(a) * sp;
    let x = c.x + vx * dt, y = c.y + vy * dt;
    if (Math.abs(x) > SLIDE_HALF) { vx = -vx; x = Math.sign(x) * SLIDE_HALF; }
    if (Math.abs(y) > SLIDE_HALF) { vy = -vy; y = Math.sign(y) * SLIDE_HALF; }
    const rot = p.speed > 0.01 ? (Math.atan2(vy, vx) * 180) / Math.PI : c.rot + dt * 3;
    return { ...c, x, y, vx, vy, rot };
  });
}

/** じゅんびの てじゅん（正しい じゅんばん）。trap は いつでも まちがい */
export interface PrepStep { id: string; label: string; wrong: string; trap?: boolean }
export const PREP_STEPS: PrepStep[] = [
  { id: 'eye', label: '👁️ せつがんレンズを つける', wrong: '' },
  { id: 'obj', label: '🔭 たいぶつレンズ（ひくい ばいりつ）を つける', wrong: 'さきに たいぶつレンズを つけると、きょうとうの なかに ごみや ほこりが はいっちゃうよ。せつがんレンズが さき！' },
  { id: 'light', label: '💡 はんしゃきょうで しやを あかるく する', wrong: 'レンズを 2つとも つけてから、はんしゃきょうと しぼりで しやぜんたいを あかるく するよ。' },
  { id: 'slide', label: '🧫 プレパラートを ステージに のせる', wrong: 'レンズを つけて、しやを あかるく してから プレパラートを のせるよ。' },
  { id: 'near', label: '👀 よこから みながら ちかづける', wrong: 'プレパラートを のせてから、よこから みて たいぶつレンズを ちかづけるよ。' },
  { id: 'focus', label: '🔍 のぞきながら とおざけて ピントを あわせる', wrong: 'のぞきながら ちかづけると、レンズと プレパラートが ぶつかっちゃう！ さいごに のぞきながら「とおざけて」ピントを あわせよう。' },
];
export const PREP_TRAP: PrepStep = {
  id: 'sun', label: '☀️ ちょくしゃにっこうの あたる まどべに おく', trap: true,
  wrong: 'ちょくしゃにっこうが あたる ところで つかうと、はんしゃきょうの ひかりで めを いためて しまうよ。あかるい ひかげで つかおう。',
};
