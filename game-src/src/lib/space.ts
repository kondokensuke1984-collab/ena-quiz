// 🚀 うちゅうりょこう：となりの しまの ロケットで 月や わくせいへ。
// 10月 理科「月の位置と見え方」の つづき。いきさきは 月から じゅんに ひらく。
// メダルは つかわない・ふやさない（おみやげと ずかんの ごほうびだけ）。

export interface SpaceQuiz { q: string; choices: string[]; answer: number; why: string }

export interface SpaceDest {
  id: string;
  name: string;
  emoji: string;
  far: string;        // ちきゅうからの きょり（ひょうじ用）
  color: string;      // 星の いろ
  facts: string[];    // とうちゃくしたら 2つ えらんで みせる
  quizzes: SpaceQuiz[];
}

export const DESTS: SpaceDest[] = [
  {
    id: 'moon', name: 'つき', emoji: '🌕', far: 'やく 38まん km', color: '#e5e7eb',
    facts: [
      '月は じぶんで ひからない。たいようの ひかりを はねかえして かがやいて いるよ。',
      '月の みちかけは やく 29.5にちで ひとまわり。ひかって いる がわに たいようが あるよ。',
      '月の じゅうりょくは ちきゅうの やく 6ぶんの1。ジャンプすると ふわーっと たかく とべるよ。',
      'まるい くぼみは クレーター。いんせきが ぶつかった あとだよ。',
      '月は いつも おなじ めんを ちきゅうに むけて いるよ。',
      '月から ちきゅうを みると、ちきゅうも みちかけして みえるよ。',
    ],
    quizzes: [
      { q: '月が かがやいて みえるのは なぜ？', choices: ['じぶんで もえて いるから', 'たいようの ひかりを はねかえして いるから', 'ちきゅうの でんきが あたるから'], answer: 1, why: '月は じぶんで ひからないよ。たいようの ひかりを はねかえして いるんだ。' },
      { q: 'まんげつの とき、たいよう・ちきゅう・月は どう ならぶ？', choices: ['たいよう・ちきゅう・月 の じゅん', 'たいよう・月・ちきゅう の じゅん', 'ならばない'], answer: 0, why: 'たいよう・ちきゅう・月の じゅんに ならぶと、月の ひかって いる めんが ぜんぶ みえて まんげつに なるよ。たいよう・月・ちきゅうの じゅんだと しんげつ。' },
      { q: 'みかづきが みえるのは いつ・どの ほうがく？', choices: ['ゆうがた・にしの そら', 'あさ・ひがしの そら', 'まよなか・みなみの そら'], answer: 0, why: 'みかづきは ゆうがた にしの そらに みえて、すぐ しずむよ。' },
    ],
  },
  {
    id: 'venus', name: 'きんせい', emoji: '🟡', far: 'ちかい ときで やく 4000まん km', color: '#fcd34d',
    facts: [
      'きんせいは あけがたや ゆうがたに とても あかるく みえる。「あけの みょうじょう」「よいの みょうじょう」と よぶよ。',
      'あつい くもに つつまれて いて、じめんは やく 460ど。とても あつい！',
      'きんせいは ほかの わくせいと ぎゃくむきに まわって いるよ。',
      'ぼうえんきょうで みると、きんせいも 月のように みちかけするよ。',
    ],
    quizzes: [
      { q: 'ゆうがた にしの そらに あかるく みえる きんせいを なんと よぶ？', choices: ['よいの みょうじょう', 'あけの みょうじょう', 'ほっきょくせい'], answer: 0, why: 'ゆうがたは「よいの みょうじょう」、あけがたは「あけの みょうじょう」だよ。' },
    ],
  },
  {
    id: 'mars', name: 'かせい', emoji: '🔴', far: 'ちかい ときで やく 5600まん km', color: '#f87171',
    facts: [
      'かせいが あかいのは、つちに さび（てつの さび）が ふくまれて いるから。',
      'かせいには フォボスと ダイモスと いう ちいさな 月が 2つ あるよ。',
      'かせいの 1にちは やく 24じかん40ぷん。ちきゅうと ほとんど おなじ！',
      'たいようけいで いちばん たかい やま「オリンポスさん」は かせいに あるよ。',
    ],
    quizzes: [
      { q: 'かせいが あかく みえるのは なぜ？', choices: ['つちに てつの さびが あるから', 'ひが もえて いるから', 'あかい うみが あるから'], answer: 0, why: 'つちに ふくまれる てつの さびで あかく みえるよ。' },
    ],
  },
  {
    id: 'jupiter', name: 'もくせい', emoji: '🟠', far: 'やく 6おく km', color: '#fdba74',
    facts: [
      'もくせいは たいようけいで いちばん おおきい わくせい。ちきゅうが 1300こ いじょう はいるよ。',
      'ガスで できて いるので、たつ じめんが ないよ。',
      'あかい うずの「だいせきはん」は ちきゅうより おおきい あらし。',
      'もくせいには 月が たくさん！ 90こ いじょう みつかって いるよ。',
    ],
    quizzes: [
      { q: 'たいようけいで いちばん おおきい わくせいは？', choices: ['もくせい', 'どせい', 'ちきゅう'], answer: 0, why: 'もくせいが いちばん おおきいよ。' },
    ],
  },
  {
    id: 'saturn', name: 'どせい', emoji: '🪐', far: 'やく 13おく km', color: '#fde68a',
    facts: [
      'どせいの わは、こおりや いわの つぶが たくさん あつまって できて いるよ。',
      'どせいは とても かるくて、もし おおきな おふろが あったら うかぶほど！',
      'どせいも ガスで できた わくせい。2ばんめに おおきいよ。',
    ],
    quizzes: [
      { q: 'どせいの わは なにで できて いる？', choices: ['こおりや いわの つぶ', 'てつの いた', 'ひかる ガス'], answer: 0, why: 'ちいさな こおりや いわの つぶが たくさん まわって いるよ。' },
    ],
  },
  {
    id: 'sun', name: 'たいよう（とおくから みるだけ）', emoji: '☀️', far: 'やく 1おく5000まん km', color: '#fb923c',
    facts: [
      'たいようは じぶんで ひかる「こうせい」。月や わくせいは じぶんで ひからないよ。',
      'たいようの ちょっけいは ちきゅうの やく 109ばい。',
      'たいようの ひかりは ちきゅうまで やく 8ぷん20びょうで とどくよ。',
      'たいようは 月より やく 400ばい おおきくて、やく 400ばい とおい。だから そらでは おなじくらいの おおきさに みえるよ。',
    ],
    quizzes: [
      { q: 'じぶんで ひかって いるのは どれ？', choices: ['たいよう', '月', 'かせい'], answer: 0, why: 'たいようは じぶんで ひかる こうせいだよ。' },
    ],
  },
];

export const DEST_BY_ID: Record<string, SpaceDest> = Object.fromEntries(DESTS.map((d) => [d.id, d]));

/** いける いきさき：いったことの ある ところ＋つぎの 1つ（はじめは 月だけ） */
export function openDests(dex: string[]): SpaceDest[] {
  const n = DESTS.findIndex((d) => !dex.includes(d.id));
  return n < 0 ? DESTS : DESTS.slice(0, n + 1);
}

/** 1日に とべる かいすう（クイズを 5もん やった日は +1） */
export const TRIPS_PER_DAY = 1;
export const TRIPS_STUDY_BONUS = 1;

/** ずかんの ごほうび（いった ところの かず） */
export const SPACE_REWARDS: { kinds: number; item: string }[] = [
  { kinds: 3, item: 'fn_moonrock' },
  { kinds: 5, item: 'fw_saturn' },
  { kinds: 6, item: 'fn_rocketmini' },
];
export const SPACE_TITLE = 'うちゅう ひこうし';

/** その日の まめちしき 2つ・クイズ1もん（日と いきさきで きまる＝何回 ひらいても おなじ） */
function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}
export function tripContent(dest: SpaceDest, day: string, visit: number): { facts: string[]; quiz: SpaceQuiz } {
  const h = hash(`${day}|${dest.id}|${visit}`);
  const i = h % dest.facts.length;
  const j = (i + 1 + ((h >>> 8) % (dest.facts.length - 1))) % dest.facts.length;
  const base = dest.quizzes[(h >>> 4) % dest.quizzes.length];
  // こたえが いつも 1ばんめに ならないように ならべかえる
  const n = base.choices.length;
  const shift = (h >>> 12) % n;   // 正解の ばしょを 0..n-1 に まんべんなく
  const order = base.choices.map((_, k) => (k + n - shift) % n);
  const quiz = { ...base, choices: order.map((k) => base.choices[k]), answer: order.indexOf(base.answer) };
  return { facts: [dest.facts[i], dest.facts[j]], quiz };
}
