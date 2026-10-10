// なかまの おしゃべり：せいかくと くちぐせ、その日の ようすに あわせた せりふ、まめちしき、なかまどうしの かいわ、1日1回の おねがい。
// せりふは ひらがな おおめ・わかちがき（島の ほかの もじと おなじ）。ふきだしに 1ぎょうで 入るように 短めに。
//
// {name}＝しゅじんこうの なまえ、{me}＝はなしている子、{cat}＝その子の きょうか、{mon}＝モンスター、{o}＝あいての子、{ocat}＝あいての きょうか

import type { CharKey } from './chars';
import type { TimeOfDay, Weather } from './sky';

export type Persona = 'genki' | 'nonbiri' | 'shikkari' | 'yasashi';

/** せいかく と くちぐせ（せりふの さいごに つける） */
export const PERSONA: Record<CharKey, { type: Persona; tag: string }> = {
  luna: { type: 'shikkari', tag: 'ルナ☆' },
  kabu: { type: 'genki', tag: 'カブ！' },
  tanuki: { type: 'genki', tag: 'ぽん！' },
  parrot: { type: 'genki', tag: 'ピコ♪' },
  owl: { type: 'shikkari', tag: 'ホウ。' },
  neko: { type: 'nonbiri', tag: 'にゃ〜' },
  penguin: { type: 'genki', tag: 'ペン！' },
  sheep: { type: 'yasashi', tag: 'メェ〜' },
  frog: { type: 'genki', tag: 'ケロ！' },
  snail: { type: 'nonbiri', tag: 'マイ〜' },
  duck: { type: 'genki', tag: 'グワッ！' },
  squirrel: { type: 'shikkari', tag: 'リス！' },
  turtle: { type: 'nonbiri', tag: 'のう〜' },
  fox: { type: 'shikkari', tag: 'コン！' },
  dolphin: { type: 'genki', tag: 'キュイ♪' },
  elephant: { type: 'yasashi', tag: 'パオ〜' },
  hedgehog: { type: 'shikkari', tag: 'ハリッ' },
  panda: { type: 'nonbiri', tag: 'パン♪' },
  hamster: { type: 'genki', tag: 'ハム！' },
  rabbit: { type: 'yasashi', tag: 'ぴょん♪' },
  bear: { type: 'yasashi', tag: 'クマ〜' },
  cow: { type: 'nonbiri', tag: 'モ〜' },
  koala: { type: 'nonbiri', tag: 'ユー♪' },
};

export interface TalkCtx {
  char: CharKey;
  me: string;
  cat: string;          // rika / sansu / kokugo / shakai …
  catLabel: string;
  hearts: number;       // 0..5
  name: string;         // しゅじんこう
  hour: number;
  tod: TimeOfDay;
  weather: Weather;
  month: number;        // 1..12
  studiedToday: boolean;
  answeredToday: number;
  studiedYesterday: boolean;
  weekDays: number;     // こんしゅう べんきょうした 日
  moonFull: boolean;
  halloween: boolean;
  ripe: boolean;        // はたけに しゅうかく できる ものが ある
  unread: number;       // よんでいない てがみ
  chest: boolean;       // たからばこが ながれついている
  monHungry: boolean;
  mon: string;
  buildings: string[];
  others: { name: string; catLabel: string }[];
}

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

function fill(s: string, c: TalkCtx, o?: { name: string; catLabel: string }): string {
  return s.replace(/\{name\}/g, c.name || 'きみ').replace(/\{me\}/g, c.me).replace(/\{cat\}/g, c.catLabel || 'べんきょう')
    .replace(/\{mon\}/g, c.mon).replace(/\{o\}/g, o?.name ?? '').replace(/\{ocat\}/g, o?.catLabel ?? '');
}
const withTag = (s: string, c: TalkCtx) => `${s} ${PERSONA[c.char]?.tag ?? ''}`.trim();

// ── あいさつ（1回め） ──
function greeting(c: TalkCtx): string {
  const close = c.hearts >= 3;
  const byTime = c.hour < 10 && c.hour >= 5 ? ['おはよう、{name}！', 'あさだね！ よく ねむれた？']
    : c.tod === 'evening' ? ['ゆうやけ きれいだね', 'こんばんは〜 もうすぐ よるだね']
    : c.tod === 'night' ? ['こんばんは、{name}', 'よるの しまも すてきでしょ？']
    : ['こんにちは、{name}！', 'やあ、{name}！'];
  const byHeart = c.hearts === 0 ? ['えっと… はじめまして かな？', 'よろしくね、{name}']
    : close ? ['{name}！ まってたよ！', 'あいたかった〜！', 'きょうも きてくれて うれしい']
    : ['また あえたね！', 'きてくれたんだ！'];
  return withTag(fill(pick(Math.random() < 0.5 ? byTime : byHeart), c), c);
}

// ── その日の ようす ──
const WEATHER: Record<Weather, string[]> = {
  sunny: ['きょうは いい てんきだね', 'ひなたぼっこ したく なっちゃう', 'そらが まっさおだよ'],
  cloudy: ['くもりの ひも すずしくて すき', 'くもが ゆっくり ながれてるね'],
  rain: ['あめの おと、きこえる？', 'かさ もってる？ ぬれないでね', 'あめの あとは にじが でるかも'],
  rainbow: ['にじ みた!? 7しょくだよ！', 'にじの ねもとには なにが あるのかな'],
};
const MONTH: Record<number, string[]> = {
  1: ['あけまして おめでとう！', 'おしょうがつは おもちが たのしみ'],
  2: ['せつぶんは まめまき するの？', 'さむいけど もうすぐ はるだね'],
  3: ['ひなまつり、しってる？', 'つぼみが ふくらんできたよ'],
  4: ['さくらが さいたね！', 'あたらしい がくねん、どきどき するね'],
  5: ['こいのぼり、およいでたよ', 'みどりが きらきら してる'],
  6: ['つゆの じきだね。かたつむりが げんき', 'あじさいの いろ、きれいだね'],
  7: ['たなばたの ねがいごと、きめた？', 'なつやすみ まで もうすこし！'],
  8: ['なつまつり いきたいな', 'うみで およぎたい きぶん！'],
  9: ['おつきみの きせつだね', 'すずしい かぜが ふいてきたね'],
  10: ['はっぱが あかく なってきたね', 'どんぐり ひろいに いこうよ', 'ハロウィン、なにに かそう する？'],
  11: ['おちばの じゅうたん、ふかふか', 'やきいもが おいしい きせつ！'],
  12: ['サンタさん、くるかな？', 'ゆきが ふったら ゆきだるま つくろう'],
};
function topical(c: TalkCtx): string[] {
  const out: string[] = [...WEATHER[c.weather], ...(MONTH[c.month] ?? [])];
  if (c.moonFull && c.tod !== 'day') out.push('こんやは まんまるの おつきさまだよ', 'まんげつ、いっしょに みよう？');
  if (c.halloween) out.push('トリック・オア・トリート！ …なんてね', 'よるに なったら おばけの かっこう するんだ');
  if (c.ripe) out.push('はたけで なにか みのってたよ！', 'はたけ、しゅうかく できそう！');
  if (c.unread > 0) out.push('ポストに てがみが きてたよ', 'てがみ、もう よんだ？');
  if (c.chest) out.push('はまべに たからばこが ながれついてたよ！');
  if (c.monHungry) out.push('{mon}、おなかが すいてるみたい');
  if (c.buildings.includes('bd_wheel')) out.push('かんらんしゃから うみが みえるんだよ');
  if (c.buildings.includes('bd_light') && c.tod === 'night') out.push('とうだいの ひかり、くるくる きれい');
  if (c.buildings.includes('bd_observ') && c.tod !== 'day') out.push('てんもんだいで ほしを みようよ');
  return out;
}

// ── べんきょうの こと ──
function study(c: TalkCtx): string[] {
  if (c.studiedToday) {
    return [
      `きょうは ${c.answeredToday}もん も といたんだね！`,
      'きょうも がんばったね、えらい！',
      '{name}が がんばると ぼくたちも うれしい',
      ...(c.weekDays >= 3 ? [`こんしゅう ${c.weekDays}にちめの べんきょうだね！`] : []),
    ];
  }
  return [
    'クイズを 5もん とくと しまが にぎやかに なるよ',
    '{cat}の もんだい、いっしょに やってみない？',
    ...(c.studiedYesterday ? ['きのうも がんばってたね！ きょうも ファイト'] : []),
    'わからない もんだいは、まとめの ページを みてみよう',
  ];
}

// ── その子の きょうかの まめちしき（ただしい ことだけ） ──
const TRIVIA: Record<string, string[]> = {
  rika: [
    'まめちしき！ 月は じぶんでは ひからないよ',
    'まめちしき！ こんちゅうの あしは 6ぽん',
    'まめちしき！ 月は やく 30にちで みちかけ するよ',
    'まめちしき！ かみなりは ひかりが さきに とどくよ',
    'まめちしき！ みずは こおると かさが ふえるよ',
    'まめちしき！ 月は ひがしから のぼるよ',
  ],
  sansu: [
    'まめちしき！ 0.5は 2ぶんの1と おなじ',
    'まめちしき！ さんかくけいの かどを たすと 180ど',
    'まめちしき！ しかくけいの かどを たすと 360ど',
    'まめちしき！ 1キロメートルは 1000メートル',
    'まめちしき！ 0.25は 4ぶんの1 だよ',
    'まめちしき！ 1じかんは 60ぷん、1ぷんは 60びょう',
  ],
  kokugo: [
    'まめちしき！「森」は 木が 3つ',
    'まめちしき！ はいくは 5・7・5の 17おん',
    'まめちしき！「早い」と「速い」は いみが ちがうよ',
    'まめちしき！「林」は 木が 2つ',
    'まめちしき！「いそがば まわれ」は あわてずに って いみ',
  ],
  shakai: [
    'まめちしき！ にほんで いちばん たかい やまは ふじさん',
    'まめちしき！ にほんで いちばん ながい かわは しなのがわ',
    'まめちしき！ にほんには 47の とどうふけんが あるよ',
    'まめちしき！ ちずの「〒」は ゆうびんきょく',
    'まめちしき！ にほんで いちばん おおきい みずうみは びわこ',
  ],
};
const TRIVIA_ANY = [
  'まめちしき！ たこの あしは 8ぽん',
  'まめちしき！ にじは 7しょく って いわれてるよ',
  'まめちしき！ 1しゅうかんは 7にち',
];

// ── せいかくの おしゃべり ──
const CHAT: Record<Persona, string[]> = {
  genki: ['かけっこ しようよ！ まけないよ', 'きょうは なんだか わくわく する！', 'ジャンプの れんしゅう ちゅう！', 'おなか すいた〜！ なに たべよう', 'しまを 1しゅう はしってきたよ！'],
  nonbiri: ['ふわぁ… ちょっと ねむいかも', 'ゆっくり いこうよ〜', 'おひるねに ちょうど いい ひだね', 'おやつの じかん まだかなぁ', 'くもを みてると あきないんだ'],
  shikkari: ['きょうの よてい、もう きめた？', 'ほんを よむと せかいが ひろがるよ', 'こつこつ つづけるのが だいじ', 'しらべものは たのしいよ', 'じぶんの ペースで いいんだよ'],
  yasashi: ['おはなに みずを あげてきたの', 'こまったら いつでも いってね', '{name}の えがお、すきだよ', 'みんなで なかよく したいな', 'きょうも げんきで よかった'],
};
const CLOSE = ['{name}と いると たのしい！', 'ずっと ともだちで いてね', '{name}は だいじな ともだち！', 'こんど いっしょに さんぽ しよう'];
const BYE = ['また はなそうね！', 'またね〜', 'じゃあ、また あとで！', 'きょうは はなせて うれしかった'];

/**
 * n＝この かいわで なんかいめか（0＝あいさつ）。3回めの つぎは「またね」で おしまい。
 */
export function talkLine(c: TalkCtx, n: number): { text: string; end: boolean } {
  if (n <= 0) return { text: greeting(c), end: false };
  if (n >= 3) return { text: withTag(fill(pick(BYE), c), c), end: true };
  const pool: string[] = [];
  const add = (list: string[], w: number) => { for (let i = 0; i < w; i++) pool.push(...list); };
  if (n === 1) {
    add(topical(c), 2);
    add(study(c), 1);
  } else {
    add(CHAT[PERSONA[c.char]?.type ?? 'genki'], 1);
    add(TRIVIA[c.cat] ?? TRIVIA_ANY, 1);
    if (c.hearts >= 3) add(CLOSE, 1);
  }
  return { text: withTag(fill(pick(pool), c), c), end: false };
}

// ── なかまどうしの かいわ（ちかくに いる 2人が ときどき はなす） ──
type Pair = [string, string];
export function pairTalk(a: TalkCtx, b: { name: string; catLabel: string; char: CharKey }): [string, string] {
  const list: Pair[] = [
    ['{o}、なに してるの？', 'おさんぽ ちゅう だよ'],
    ['{o}の きょうかって なんだっけ？', '{ocat}だよ！ おもしろいよ'],
    ['きょうの おやつ、なにかな？', 'クッキーが いいな〜'],
    ['ねえ {o}、かけっこ しない？', 'いいよ！ まけないからね'],
    ['{name}、きょうも きてくれたね', 'うん！ うれしいね'],
    ['しまが にぎやかに なってきたね', 'つぎは なにが できるかな'],
  ];
  if (a.weather === 'rain') list.push(['あめ、やまないね', 'あめの おとも すきだよ']);
  if (a.weather === 'sunny' && a.tod === 'day') list.push(['いい てんき！', 'ひなたぼっこ しよう']);
  if (a.tod === 'night') list.push(['ほし、きれいだね', 'ながれぼしに ねがいごと しよう']);
  if (a.studiedToday) list.push(['{name}、きょう べんきょう がんばってたよ', 'すごいね！ ぼくも そだちたいな']);
  if (a.month === 10 || a.month === 11) list.push(['どんぐり みつけた！', 'わたしにも みせて〜']);
  if (a.month === 12 || a.month === 1 || a.month === 2) list.push(['さむいね〜', 'くっついたら あったかいよ']);
  const [x, y] = pick(list);
  const o = { name: b.name, catLabel: b.catLabel };
  const back = { name: a.me, catLabel: a.catLabel };
  const bc: TalkCtx = { ...a, char: b.char, me: b.name, catLabel: b.catLabel };
  return [withTag(fill(x, a, o), a), withTag(fill(y, bc, back), bc)];
}

// ── おねがい（1日に 1人だけ。かなえると なかよしが ふえる） ──
export type Request =
  | { char: string; kind: 'gift'; item: string }
  | { char: string; kind: 'talk'; to: string }
  | { char: string; kind: 'quiz' }
  | { char: string; kind: 'water' };

export function makeRequest(
  chars: string[],
  opt: { giftItems: string[]; canWater: boolean; studied: boolean },
): Request | null {
  if (!chars.length) return null;
  const char = pick(chars);
  const kinds: Request['kind'][] = ['gift'];
  if (chars.length >= 2) kinds.push('talk');
  if (!opt.studied) kinds.push('quiz', 'quiz');
  if (opt.canWater) kinds.push('water');
  const kind = pick(kinds);
  if (kind === 'talk') return { char, kind, to: pick(chars.filter((c) => c !== char)) };
  if (kind === 'quiz') return { char, kind };
  if (kind === 'water') return { char, kind };
  return { char, kind: 'gift', item: pick(opt.giftItems) };
}

/** おねがいを いう せりふ */
export function requestLine(r: Request, c: TalkCtx, names: { item?: string; to?: string }): string {
  const s = r.kind === 'gift' ? `おねがい！ ${names.item}が ほしいな`
    : r.kind === 'talk' ? `${names.to}に「やあ」って つたえてきて！`
    : r.kind === 'quiz' ? 'おねがい！ きょう クイズを 5もん といてきて'
    : 'おねがい！ はたけに みずを あげてきて';
  return withTag(s, c);
}

export function thanksLine(c: TalkCtx): string {
  return withTag(pick(['ありがとう！ たすかったよ', 'わあ、うれしい！ ありがとう', '{name}、やさしいね！']).replace('{name}', c.name || 'きみ'), c);
}
