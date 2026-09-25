// イベント「名探偵あんり」：算数「推理」（数の推理・リーグ戦・順位）を じけんに して とく。
// じけん1は 2026-09-26、じけん2〜7は 10/7〜10/12 に ひらく。イベントは 10/31 まで（とけなかった じけんも それまでは とける）。
// その日 クイズを 5もん やると、その日までに ひらいた じけんが とける（はたけと おなじ STAMP_MIN）。
// 答えは tools で 総当たりして 1つだけに なることを 確かめてある（じけんを かえたら もういちど 確かめる）。

import type { CharKey } from './chars';
import { answeredByDate, dateKey, STAMP_MIN } from './study';

export type Who = 'narr' | 'anri' | CharKey;
export interface Line { who: Who; text: string }

export interface Evidence {
  id: string;
  x: number; y: number;     // げんばの 絵の なかの 位置（0〜100）
  icon: string;
  name: string;
  text: string;             // しょうこカードに かく こと（算数の じょうけん）
}

export interface Suspect {
  char: CharKey;
  says: string;             // しょうげん
  nervous?: boolean;        // あやしい えんしゅつ（目きょろきょろ・あせ）
}

/** ○×表の パズル。assign/rank は 行ごとに ○が1つ（answer[行]＝○の 列）。league は かち まけ */
export type Puzzle =
  | { kind: 'assign' | 'rank'; title: string; rule: string; clues: string[]; rows: string[]; cols: string[]; answer: number[]; done: string }
  | { kind: 'league'; title: string; rule: string; clues: string[]; teams: string[]; wins: [number, number][]; done: string };

export interface Case {
  no: number;
  open: string;             // ひらく日 YYYY-M-D
  title: string;
  headline: string;         // しんぶんの 見出し
  scene: SceneKey;
  intro: Line[];
  evidence: Evidence[];
  suspects: Suspect[];
  puzzles: Puzzle[];
  deduce: string;           // パズルの 答えから はんにんに つながる 一言
  question: string;
  culprit: CharKey;
  wrong: string;
  confession: Line[];
  hints: string[];
}

export type SceneKey = 'beach' | 'track' | 'field' | 'forest' | 'court' | 'morning' | 'moon';

export const EVENT_START = '2026-9-26';
export const EVENT_END = '2026-10-31';
export const DETECTIVE_TITLE = 'めいたんてい';

const AE = ['A', 'B', 'C', 'D', 'E'];
const N5 = ['1', '2', '3', '4', '5'];

export const CASES: Case[] = [
  {
    no: 1, open: '2026-9-26', title: 'ひらかない たからばこ', headline: 'しまの たからばこが あかない！', scene: 'beach',
    intro: [
      { who: 'narr', text: 'ある あさ。さんばしの そばで、ルナが こまった かおを していた。' },
      { who: 'luna', text: 'たいへん！ みんなで うめた たからばこの あんごうが、かわってるの！' },
      { who: 'luna', text: 'あんごうは 5けた。まわりに メモが おちてるみたい…。めいたんてい、しらべて！' },
    ],
    evidence: [
      { id: 'e1', x: 22, y: 72, icon: '🗒️', name: 'すなの うえの メモ', text: 'A × A ＝ B' },
      { id: 'e2', x: 78, y: 40, icon: '🗒️', name: 'やしの きの メモ', text: 'C × D ＝ C' },
      { id: 'e3', x: 55, y: 62, icon: '🗒️', name: 'はこの うらの メモ', text: 'A ＋ D ＝ C' },
    ],
    suspects: [
      { char: 'tanuki', says: 'ぼくは あさから はたけに いたよ。いえは 1ばん！' },
      { char: 'parrot', says: 'ピコは うたの れんしゅう！ いえは 3ばん！' },
      { char: 'owl', says: 'ほ、ほう…わたしは ずっと ねていましたよ。いえは 5ばんです…', nervous: true },
      { char: 'rabbit', says: 'ミミは がっこうに いたよ。いえは 2ばん。' },
    ],
    puzzles: [{
      kind: 'assign', title: 'あんごうを とけ！', rule: 'A〜E には 1〜5の ちがう かずが 1つずつ はいる',
      clues: ['① A × A ＝ B', '② C × D ＝ C', '③ A ＋ D ＝ C'],
      rows: AE, cols: N5, answer: [1, 3, 2, 0, 4], done: 'あんごうは 2・4・3・1・5！ カチッ…はこが あいた！',
    }],
    deduce: 'はこの なかに メモ…「せいざの ちず、Eばんの いえで かりてるね」。Eは 5！',
    question: 'せいざの ちずを もっていったのは だれ？',
    culprit: 'owl', wrong: 'その子の いえは Eばん じゃないよ。Eは いくつだった？',
    confession: [
      { who: 'owl', text: 'ご、ごめんなさい…。よるに ほしを みたくて、ちずを かりたんです。' },
      { who: 'owl', text: 'あんごうは わすれないように メモに かいて…かえって バレちゃいましたね。' },
      { who: 'luna', text: 'なーんだ！ こんどは みんなで ほしを みようね！' },
    ],
    hints: ['① A×A＝B から かんがえよう。1〜5で、2かい かけても 5いかに なるのは？（1は B も 1に なって ダメ）', '② C×D＝C は、D が いくつなら なりたつ？', '③で C が きまる。のこった かずが E だよ。'],
  },
  {
    no: 2, open: '2026-10-7', title: 'きえた ゴールテープ', headline: 'かけっこたいかいの ゴールテープが きえた！', scene: 'track',
    intro: [
      { who: 'narr', text: 'しまの かけっこたいかいが おわった あと。' },
      { who: 'luna', text: 'ゴールテープが ないの！ いちばんで ゴールした子に まきついたまま、どこかへ いっちゃったのかも。' },
      { who: 'luna', text: 'でも だれが なんいだったか、みんな おぼえてないんだって…。' },
    ],
    evidence: [
      { id: 'e1', x: 30, y: 35, icon: '📷', name: 'ゴールの しゃしん', text: 'ピコは 2いで ゴールした' },
      { id: 'e2', x: 70, y: 70, icon: '📝', name: 'きろくカードの きれはし', text: 'ミミは 1いでも 4いでもない' },
      { id: 'e3', x: 15, y: 78, icon: '👣', name: 'コースの あしあと', text: 'ツキミは 3いでも 4いでもない' },
    ],
    suspects: [
      { char: 'tanuki', says: 'ぼく？ たしか 1いでも 2いでも なかったなあ。' },
      { char: 'parrot', says: 'ピコ、しゃしんに うつってるよ！' },
      { char: 'rabbit', says: 'ミミは さいごじゃ なかったよ！' },
      { char: 'bear', says: 'テ、テープ？ し、しらないよ…', nervous: true },
    ],
    puzzles: [{
      kind: 'rank', title: 'じゅんいを きめろ！', rule: '4ひきの じゅんいは みんな ちがう',
      clues: ['① ピコは 2い', '② ミミは 1いでも 4いでもない', '③ ツキミは 3いでも 4いでもない', '④ ぽんたは 1いでも 2いでもない'],
      rows: ['ぽんた', 'ピコ', 'ミミ', 'ツキミ'], cols: ['1い', '2い', '3い', '4い'], answer: [3, 1, 2, 0],
      done: '1い ツキミ・2い ピコ・3い ミミ・4い ぽんた！',
    }],
    deduce: 'ゴールテープを きったのは 1いの子。つまり…！',
    question: 'ゴールテープを もっていったのは だれ？',
    culprit: 'bear', wrong: 'その子は 1いじゃ なかったよ。表を もういちど みてみよう。',
    confession: [
      { who: 'bear', text: 'ごめーん！ テープが からだに まきついて、そのまま おひるね しちゃったの…。' },
      { who: 'luna', text: 'ゆうしょう おめでとう！ テープは かえしてね。' },
    ],
    hints: ['わかっている ことを ○×の 表に かこう。「〜ではない」は ×だよ。', 'ピコは 2い。2いの れつは ほかの子が ぜんぶ ×。', '×が 3つ ならんだ 行は、のこりの 1マスが ○！'],
  },
  {
    no: 3, open: '2026-10-8', title: 'トロフィー きえた じけん', headline: 'サッカーたいかいの トロフィーが ない！', scene: 'field',
    intro: [
      { who: 'narr', text: '4チームで ぜんぶの チームと 1かいずつ たたかう「リーグせん」の サッカーたいかい。' },
      { who: 'luna', text: 'ひょうしょうしきの まえに、トロフィーが きえちゃった！' },
      { who: 'luna', text: 'しあいの けっかが わかれば、はんにんも わかるかも！' },
    ],
    evidence: [
      { id: 'e1', x: 25, y: 45, icon: '📋', name: 'スコアボードの きれはし', text: 'ミミチームは ツキミチームに かった' },
      { id: 'e2', x: 75, y: 30, icon: '📰', name: 'しまの しんぶん', text: 'ホウチームは 3しょう0はいで ゆうしょう' },
      { id: 'e3', x: 55, y: 78, icon: '📝', name: 'しんぱんの メモ', text: 'のこりの 3チームは みんな 1しょう2はい' },
    ],
    suspects: [
      { char: 'owl', says: 'わたしは ずっと トロフィーを みがいていました。ちょっと めを はなした すきに…。' },
      { char: 'tanuki', says: 'もっていったのは、ツキミチームに かった チームの だれかだよ！ ぼく みてたもん。' },
      { char: 'rabbit', says: 'ミ、ミミは しらないよ〜', nervous: true },
      { char: 'bear', says: 'くまったなあ。わたしじゃ ないよ。' },
    ],
    puzzles: [{
      kind: 'league', title: 'しあいの けっかを かんせいさせろ！', rule: 'かちは ○、まけは ×（○を いれると あいての ところに ×が はいる）',
      clues: ['① ミミは ツキミに かった', '② ホウは 3しょう0はい', '③ のこりの 3チームは 1しょう2はい'],
      teams: ['ぽんた', 'ホウ', 'ミミ', 'ツキミ'], wins: [[1, 0], [1, 2], [1, 3], [2, 3], [3, 0], [0, 2]],
      done: 'ホウ3しょう。ミミ→ツキミ→ぽんた→ミミ と ぐるっと 1しょうずつ！',
    }],
    deduce: 'ツキミチームに かったのは ホウと ミミ。でも ホウは ずっと トロフィーを みがいていた…',
    question: 'トロフィーを もっていったのは だれ？',
    culprit: 'rabbit', wrong: 'その子は ツキミチームに かって いないよ。',
    confession: [
      { who: 'rabbit', text: 'ごめんね…。ミミ、トロフィーを もったこと なかったから、ちょっとだけ しゃしんを とりたかったの。' },
      { who: 'owl', text: 'ほう、それなら いっしょに とりましょう！' },
    ],
    hints: ['ホウは 3しょう。ホウの 行を ぜんぶ ○に しよう（ほかの子の ホウの れつは ×）。', 'ミミ→ツキミは ○。のこりの 3チームは 1しょうずつ だよ。', 'ミミは もう 1しょう。ツキミは どこに かてば 1しょうに なる？'],
  },
  {
    no: 4, open: '2026-10-9', title: 'どんぐり すりかえ じけん', headline: 'リスまるの たからものの どんぐりが すりかえられた！', scene: 'forest',
    intro: [
      { who: 'squirrel', text: 'えーん！ ぼくの たからもの、どんぐり 5こ入りの ふくろが なくなっちゃった！' },
      { who: 'luna', text: 'みんなが もってる ふくろ A〜E には、1〜5こ ずつ ちがう かずの どんぐりが はいってるんだって。' },
      { who: 'luna', text: '5こ入りの ふくろを もってる子が あやしい！' },
    ],
    evidence: [
      { id: 'e1', x: 20, y: 60, icon: '⚖️', name: 'はかりの メモ', text: 'Aと Bの ちがいは 1こ' },
      { id: 'e2', x: 62, y: 30, icon: '🍂', name: 'おちばの したの メモ', text: 'Cは Dより 2こ おおい' },
      { id: 'e3', x: 80, y: 75, icon: '🐾', name: 'あしあとの よこの メモ', text: 'Eは Bより 3こ おおい' },
    ],
    suspects: [
      { char: 'tanuki', says: 'ぼくの ふくろは Aだよ。' },
      { char: 'parrot', says: 'ピコは Bの ふくろ！' },
      { char: 'cow', says: 'モ、モォ…わたしは Cの ふくろ…です…', nervous: true },
      { char: 'bear', says: 'わたしは Dの ふくろを もってるよ。' },
      { char: 'rabbit', says: 'ミミは Eの ふくろ！' },
    ],
    puzzles: [{
      kind: 'assign', title: 'どんぐりの かずを しらべろ！', rule: 'A〜E には 1〜5こ の ちがう かずが 1つずつ',
      clues: ['① Aと Bの ちがいは 1こ', '② Cは Dより 2こ おおい', '③ Eは Bより 3こ おおい'],
      rows: AE, cols: N5, answer: [1, 0, 4, 2, 3], done: 'A2・B1・C5・D3・E4 こ！ 5こ入りは Cの ふくろ！',
    }],
    deduce: '5こ入りの ふくろは C。Cの ふくろを もっているのは…！',
    question: 'リスまるの ふくろを もっていったのは だれ？',
    culprit: 'cow', wrong: 'その子の ふくろは 5こ入りじゃ なかったよ。',
    confession: [
      { who: 'cow', text: 'モォ〜、ごめんね。ぴかぴかの どんぐり、ほしく なっちゃって…。' },
      { who: 'squirrel', text: 'いいよ！ いっこ あげるね！' },
    ],
    hints: ['どっちが おおいか わかっている ②と ③から かんがえよう。', '③から、Eは Bより 3おおい。B＝1なら E＝4、B＝2なら E＝5。', '①から Aも きまる。のこりの 2つで ②に あうのは？'],
  },
  {
    no: 5, open: '2026-10-10', title: 'きえた ボール', headline: 'ドッジボールたいかいの ボールが ない！', scene: 'court',
    intro: [
      { who: 'narr', text: 'きょうは 4チームの リーグせん ドッジボールたいかい。' },
      { who: 'luna', text: 'たいかいの あと、ボールが なくなっちゃった！' },
      { who: 'luna', text: 'くやしくて ボールを もって はしって かえった子が いるって うわさ…。' },
    ],
    evidence: [
      { id: 'e1', x: 18, y: 40, icon: '📋', name: 'けっかひょうの きれはし', text: 'ぽんたチームは 1かいも かてなかった' },
      { id: 'e2', x: 70, y: 28, icon: '🏅', name: 'メダルの うら', text: 'モモチームは 2しょう1はい' },
      { id: 'e3', x: 48, y: 76, icon: '📝', name: 'しんぱんの メモ', text: 'ホウチームは ピコチームに かった・ピコチームは 1しょう2はい' },
    ],
    suspects: [
      { char: 'tanuki', says: 'ぼくは さいごまで かたづけ してたよ。まけちゃったけどね。' },
      { char: 'parrot', says: 'ピ、ピコは…はやく かえっただけ！', nervous: true },
      { char: 'owl', says: 'くやしくて はしって かえったのは、モモチームに まけた チームの 子でしたよ。' },
      { char: 'cow', says: 'モモは ちゃんと ボールを もどしたよ〜。' },
    ],
    puzzles: [{
      kind: 'league', title: 'しあいの けっかを かんせいさせろ！', rule: 'かちは ○、まけは ×',
      clues: ['① ぽんたは 1かいも かてなかった', '② ピコは 1しょう2はい', '③ ホウは ピコに かった', '④ モモは 2しょう1はい'],
      teams: ['ぽんた', 'ピコ', 'ホウ', 'モモ'], wins: [[1, 0], [2, 0], [3, 0], [2, 1], [3, 1], [2, 3]],
      done: 'ホウ3しょう・モモ2しょう・ピコ1しょう・ぽんた0しょう！',
    }],
    deduce: 'モモチームに まけたのは ぽんたと ピコ。でも ぽんたは さいごまで かたづけ してた…',
    question: 'ボールを もって かえったのは だれ？',
    culprit: 'parrot', wrong: 'その子は モモチームに まけて いないか、アリバイが あるよ。',
    confession: [
      { who: 'parrot', text: 'ピコ、くやしくて こっそり れんしゅう してたの！ ボール かえすね！' },
      { who: 'cow', text: 'こんどは いっしょに れんしゅう しよ〜！' },
    ],
    hints: ['ぽんたの 行は ぜんぶ ×。ほかの チームの ぽんたの れつは ○。', 'ホウ→ピコは ○。ピコは ぽんたに かって もう 1しょう。だから ピコは のこりに ぜんぶ まけ。', 'モモは 2しょう。ぽんたと、もう1つ かったのは？ のこりは ホウの かち。'],
  },
  {
    no: 6, open: '2026-10-11', title: 'ねぼうの はんにん', headline: 'あさの たいそうの ラジオが ならなかった！', scene: 'morning',
    intro: [
      { who: 'narr', text: 'まいあさ、いちばん おそく おきた子が ラジオを ならす やくそく。' },
      { who: 'luna', text: 'でも けさは ラジオが ならなかったの！ だれが いちばん おそく おきたのかな？' },
    ],
    evidence: [
      { id: 'e1', x: 25, y: 35, icon: '⏰', name: 'めざましどけいの メモ', text: 'ホウは 1ばんめでも 2ばんめでもない・ミミは 3ばんめ' },
      { id: 'e2', x: 72, y: 45, icon: '🪟', name: 'まどの ひかりの きろく', text: 'ぽんたは ホウより はやく おきた・ぽんたは ツキミより はやく おきた' },
      { id: 'e3', x: 50, y: 78, icon: '🛏️', name: 'ベッドの ぬくもり', text: 'ツキミは ピコより はやく おきた・ピコは 5ばんめではない' },
    ],
    suspects: [
      { char: 'tanuki', says: 'ぼくは はやおきだよ！ いちばん だったかも！' },
      { char: 'parrot', says: 'ピコ、ちょっと ねぼうしたけど さいごじゃ ないよ。' },
      { char: 'owl', says: 'ほ…ほう？ わ、わたしは…ふわぁ…', nervous: true },
      { char: 'rabbit', says: 'ミミは まんなかくらい！' },
      { char: 'bear', says: 'わたしは ぽんたの つぎに おきたよ。' },
    ],
    puzzles: [{
      kind: 'rank', title: 'おきた じゅんばんを きめろ！', rule: '5ひきが おきた じゅんばんは みんな ちがう',
      clues: ['① ホウは 1ばんめでも 2ばんめでもない', '② ミミは 3ばんめ', '③ ぽんたは ホウより はやい', '④ ぽんたは ツキミより はやい', '⑤ ツキミは ピコより はやい', '⑥ ピコは 5ばんめではない'],
      rows: ['ぽんた', 'ピコ', 'ホウ', 'ミミ', 'ツキミ'], cols: ['1', '2', '3', '4', '5'], answer: [0, 3, 4, 2, 1],
      done: 'ぽんた→ツキミ→ミミ→ピコ→ホウ の じゅん！',
    }],
    deduce: 'いちばん おそく おきたのは 5ばんめの子…！',
    question: 'ねぼうして ラジオを ならさなかったのは だれ？',
    culprit: 'owl', wrong: 'その子は 5ばんめじゃ ないよ。',
    confession: [
      { who: 'owl', text: 'ほう…ふくろうは よるが とくいで…あさは にがてなんです…。' },
      { who: 'luna', text: 'こんどから めざましを 3こ おこうね！' },
    ],
    hints: ['きまっている ミミ（3ばんめ）から ○を いれよう。', '「〜より はやい」は、その子より うしろの ばんごうには なれない ということ。', 'ぽんた → ツキミ → ピコ の じゅんに はやい。ホウは 3ばんめより あと。'],
  },
  {
    no: 7, open: '2026-10-12', title: 'きえた おつきみだんご', headline: '大じけん！ おつきみだんごが きえた！', scene: 'moon',
    intro: [
      { who: 'narr', text: 'まんげつの よる。おつきみだいに おだんごを ならべて、みんなを まっていた…。' },
      { who: 'luna', text: 'たいへん！ いちばん たくさん のせた おさらが からっぽ！' },
      { who: 'luna', text: 'おさらは A〜E の 5まい。1〜5こ ずつ ちがう かずを のせてたの。' },
      { who: 'luna', text: 'みんなは きた じゅんに すわった。1ばんめの子が A、2ばんめが B…の まえに すわったよ。' },
    ],
    evidence: [
      { id: 'e1', x: 30, y: 62, icon: '🍡', name: 'おさらの ラベル', text: 'Bの おさらは 2こ・Aと Bを あわせると C' },
      { id: 'e2', x: 75, y: 70, icon: '🌾', name: 'すすきの かげの メモ', text: 'Dは Eより 3こ おおい' },
      { id: 'e3', x: 50, y: 30, icon: '📒', name: 'うけつけ ノート', text: 'モモは 4ばんめ・ぽんたは 1ばんめでも 2ばんめでもない・ミミは 1ばんめではない' },
    ],
    suspects: [
      { char: 'tanuki', says: 'ぽ、ぽん…ぼくは おなか いっぱい…じゃなくて、なにも しらないよ！', nervous: true },
      { char: 'rabbit', says: 'ミミは 1ばんには まにあわなかったよ。' },
      { char: 'bear', says: 'わたしが いちばんのりだったよ！' },
      { char: 'cow', says: 'モモは さいごに きたよ〜。' },
    ],
    puzzles: [
      {
        kind: 'assign', title: 'だい1のなぞ：おさらの かず', rule: 'A〜E には 1〜5こ の ちがう かずが 1つずつ',
        clues: ['① Bは 2こ', '② A ＋ B ＝ C', '③ Dは Eより 3こ おおい'],
        rows: AE, cols: N5, answer: [2, 1, 4, 3, 0], done: 'A3・B2・C5・D4・E1！ からっぽに なったのは Cの おさら！',
      },
      {
        kind: 'rank', title: 'だい2のなぞ：きた じゅんばん', rule: '4ひきが きた じゅんばんは みんな ちがう',
        clues: ['① モモは 4ばんめ', '② ぽんたは 1ばんめでも 2ばんめでもない', '③ ミミは 1ばんめではない'],
        rows: ['ぽんた', 'ミミ', 'ツキミ', 'モモ'], cols: ['1', '2', '3', '4'], answer: [2, 1, 0, 3],
        done: 'ツキミ→ミミ→ぽんた→モモ！ Cの まえに すわったのは 3ばんめの子！',
      },
    ],
    deduce: 'からっぽに なったのは Cの おさら。Cの まえに すわったのは 3ばんめに きた子…！',
    question: 'おつきみだんごを たべちゃったのは だれ？',
    culprit: 'tanuki', wrong: 'その子は Cの おさらの まえに すわって いないよ。',
    confession: [
      { who: 'tanuki', text: 'ぽ、ぽん…。おだんご だいすきで…つい ぜんぶ たべちゃった…。ごめんなさい！' },
      { who: 'luna', text: 'しょうじきに いえて えらい！ みんなで もういちど つくろう！' },
      { who: 'luna', text: 'すべての じけんを かいけつ！ きみは ほんものの めいたんていだね！' },
    ],
    hints: ['まず おさらの かず。Bは 2。③の Dと Eの くみあわせは（1,4）か（2,5）。でも 2は もう つかった！', 'A＋B＝C。のこりの 3と 5で なりたつのは？ いちばん おおい おさらが わかるよ。', 'つぎは きた じゅんばん。きまっている モモ（4ばんめ）から いれよう。'],
  },
];

// ── 日づけ ──
function parse(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** きょう。localhost だけ ?today=YYYY-M-D で かえられる */
export function eventToday(): Date {
  const q = new URLSearchParams(location.search).get('today') || '';
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && /^\d{4}-\d{1,2}-\d{1,2}$/.test(q)) return parse(q);
  return new Date();
}

export function eventActive(now = eventToday()): boolean {
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return t >= parse(EVENT_START).getTime() && t <= parse(EVENT_END).getTime();
}

export function caseOpen(c: Case, now = eventToday()): boolean {
  return eventActive(now) && new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() >= parse(c.open).getTime();
}

/** きょう クイズを 5もん やったか（?today の日で みる） */
export function studiedOn(now = eventToday(), by = answeredByDate()): boolean {
  return (by[dateKey(now)] || 0) >= STAMP_MIN;
}

export function openLabel(c: Case): string {
  const d = parse(c.open);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/** ボードの 答えあわせ。cells[r][c]：0 空・1 ○・2 × */
export function checkPuzzle(p: Puzzle, cells: number[][]): boolean {
  if (p.kind === 'league') {
    return p.wins.every(([w, l]) => cells[w]?.[l] === 1 && cells[l]?.[w] === 2);
  }
  return p.answer.every((col, r) => cells[r]?.[col] === 1 && cells[r].filter((v) => v === 1).length === 1);
}

/** ごほうび（とけた かず → もらえる もの） */
export const DETECTIVE_REWARDS: { solved: number; item: string }[] = [
  { solved: 3, item: 'cs_magnifier' },
  { solved: 5, item: 'fn_detective' },
  { solved: 7, item: 'ht_detective' },
];
