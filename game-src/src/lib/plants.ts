// はたけの しょくぶつ（理科「種子のつくりと発芽」「発芽や成長の条件」にそって）。
// 1しゅるい 1データ。季節の たねを 足すときは items.ts の たね（season つき）と ここの両方に 足す。

export type PlantType = 'dicot' | 'monocot' | 'tuber' | 'bulb';
export type Pollen = 'insect' | 'wind' | 'self';

export interface PlantQuiz {
  q: string;
  options: string[];
  answer: number;       // options の なんばんめ（0から）
  why: string;
}

export interface PlantDef {
  seed: string;          // たねの アイテムID
  name: string;          // しょくぶつの なまえ
  emoji: string;
  type: PlantType;
  cotyledons: 0 | 1 | 2; // 子葉の数（いも・球根は 0）
  epigeal: boolean;      // 子葉が 地上に でる
  rootFirst: boolean;    // はつがで さきに 根が でる（イネは 子葉が さき）
  endosperm: boolean | null; // 有胚乳なら true（いも・球根は null）
  temp: [number, number];    // 発芽（めが でる）に ちょうどいい 温度
  lightGerm?: boolean;   // 発芽に 光が いる
  paddy?: boolean;       // 田んぼ（水の中）で そだてる
  nutrient: string;      // おもな ようぶん
  starch: 0 | 1 | 2;     // ヨウ素液の そまりかた（0 ほとんど／1 すこし／2 こい）
  pollen: Pollen;
  flower: string;        // はなの いろ
  crop: string;          // とれる プレゼント
  grows: string;         // ふえかた
  closes?: 'noon' | 'night' | 'cold'; // はなが とじる（傾性）
  facts: string[];       // ずかんの まめちしき
  quiz: PlantQuiz[];
}

export const PLANTS: PlantDef[] = [
  {
    seed: 'sd_ingen', name: 'インゲンマメ', emoji: '🫘', type: 'dicot', cotyledons: 2, epigeal: true, rootFirst: true, endosperm: false,
    temp: [23, 25], nutrient: 'でんぷん', starch: 2, pollen: 'self', flower: '#f0abfc', crop: 'gf_mame', grows: 'たね',
    facts: ['はいにゅうが ない たね。ようぶんは 子葉に ためている', 'さきに 根が でて、2まいの 子葉が 地上に でて ひらく', '子葉は ようぶんを つかうと しぼんで おちる'],
    quiz: [
      { q: 'インゲンマメの ようぶんは どこに ある？', options: ['子葉', 'はいにゅう', 'しゅひ'], answer: 0, why: 'インゲンマメは むはいにゅう しゅし。ようぶんは 子葉に たくわえているよ。' },
      { q: 'インゲンマメが はつがする とき、さきに でるのは？', options: ['根', '本葉', 'はな'], answer: 0, why: 'まず 根が でて 水を すったり からだを ささえたり するよ。' },
    ],
  },
  {
    seed: 'sd_corn', name: 'トウモロコシ', emoji: '🌽', type: 'monocot', cotyledons: 1, epigeal: true, rootFirst: true, endosperm: true,
    temp: [25, 30], nutrient: 'でんぷん', starch: 2, pollen: 'wind', flower: '#fde68a', crop: 'gf_corn', grows: 'たね',
    facts: ['はいにゅうが ある たね。ようぶんは はいにゅうに ある', '子葉は ほそながい 1まい（たんしようるい）', 'はなは めだたない。花粉は かぜで はこばれる（ふうばいか）'],
    quiz: [
      { q: 'トウモロコシの 子葉は なんまい？', options: ['1まい', '2まい', '3まい'], answer: 0, why: 'トウモロコシは たんしようるい。子葉は 1まいで、葉の すじは へいこう だよ。' },
      { q: 'トウモロコシの 花粉を はこぶのは？', options: ['かぜ', 'こんちゅう', 'みず'], answer: 0, why: 'はなびらの ない めだたない はなで、かるい 花粉を かぜが はこぶ（ふうばいか）。' },
    ],
  },
  {
    seed: 'sd_ine', name: 'イネ', emoji: '🌾', type: 'monocot', cotyledons: 1, epigeal: true, rootFirst: false, endosperm: true,
    temp: [30, 35], paddy: true, nutrient: 'でんぷん', starch: 2, pollen: 'self', flower: '#fef9c3', crop: 'gf_onigiri', grows: 'たね',
    facts: ['えい（もみがら）に つつまれた、はいにゅうの ある たね', '水の中の わずかな くうきでも はつがする', '水の中では 根より さきに 子葉が でる'],
    quiz: [
      { q: '水の中で はつがする イネ。さきに でるのは？', options: ['子葉', '根', 'はな'], answer: 0, why: 'イネのように 水中で はつがする しょくぶつは、まず 子葉が でて そのあと 根が でるよ。' },
      { q: 'イネの はつがに ちょうどいい 温度は？', options: ['30〜35℃', '5〜10℃', '18〜25℃'], answer: 0, why: 'イネは あたたかいのが すき。30〜35℃が いちばん よく はつがするよ。' },
    ],
  },
  {
    seed: 'sd_asagao', name: 'アサガオ', emoji: '🌺', type: 'dicot', cotyledons: 2, epigeal: true, rootFirst: true, endosperm: false,
    temp: [20, 25], nutrient: 'でんぷん・たんぱくしつ', starch: 1, pollen: 'self', flower: '#818cf8', crop: 'gf_flower', grows: 'たね', closes: 'noon',
    facts: ['子葉は 2まいで、ふたごのような 形', 'じぶんの おしべの 花粉が めしべに つく（じかじゅふん）', 'あさ ひらいて、ひるすぎには しぼむ'],
    quiz: [
      { q: 'アサガオの 根を ガラスの びんで そだてると、根は 光と どっちに のびる？', options: ['光と はんたい', '光の ほう', 'よこ'], answer: 0, why: '根は 光と はんたいに のびる（ふの ひかりくっせい）。くきは 光の ほうへ のびるよ。' },
      { q: 'アサガオの 子葉は なんまい？', options: ['2まい', '1まい', '3まい'], answer: 0, why: 'アサガオは そうしようるい。子葉は 2まいだよ。' },
    ],
  },
  {
    seed: 'sd_himawari', name: 'ヒマワリ', emoji: '🌻', type: 'dicot', cotyledons: 2, epigeal: true, rootFirst: true, endosperm: false,
    temp: [20, 25], nutrient: 'しぼう', starch: 0, pollen: 'insect', flower: '#facc15', crop: 'gf_sunseed', grows: 'たね',
    facts: ['たねに しぼう（あぶら）が おおい', 'ヨウ素液を つけても あまり 青むらさきに ならない', 'こんちゅうが 花粉を はこぶ（ちゅうばいか）'],
    quiz: [
      { q: 'ヒマワリの たねに おおい ようぶんは？', options: ['しぼう', 'でんぷん', 'みず'], answer: 0, why: 'ヒマワリや ゴマ・ラッカセイの たねは しぼうが おおいよ。' },
      { q: 'ヒマワリの 花粉を はこぶのは？', options: ['こんちゅう', 'かぜ', 'みず'], answer: 0, why: '大きく めだつ はなびらで こんちゅうを よぶ ちゅうばいか だよ。' },
    ],
  },
  {
    seed: 'sd_berry', name: 'イチゴ', emoji: '🍓', type: 'dicot', cotyledons: 2, epigeal: true, rootFirst: true, endosperm: false,
    temp: [15, 25], lightGerm: true, nutrient: 'しぼう・たんぱくしつ', starch: 1, pollen: 'insect', flower: '#ffffff', crop: 'gf_berry', grows: 'たね・ランナー',
    facts: ['はつがに 光が いる たね（レタスも そう）', 'たべる ところは 子房ではなく「かたく」が そだった ぎか', 'つぶつぶの 1つ1つが ほんとうの み'],
    quiz: [
      { q: 'イチゴの たべる ところは、はなの どこが そだった？', options: ['かたく', 'しぼう', 'やく'], answer: 0, why: 'がくの つけねの「かたく」が そだった ぎか。リンゴも ぎか だよ。' },
      { q: 'イチゴや レタスの たねが はつがするのに、とくべつに いるものは？', options: ['光', 'ひりょう', 'くらやみ'], answer: 0, why: 'ふつうは 光は いらないけど、イチゴや レタスは 光が ないと はつがしにくいよ。' },
    ],
  },
  {
    seed: 'sd_potato', name: 'ジャガイモ', emoji: '🥔', type: 'tuber', cotyledons: 0, epigeal: false, rootFirst: false, endosperm: null,
    temp: [15, 25], nutrient: 'でんぷん', starch: 2, pollen: 'insect', flower: '#e9d5ff', crop: 'gf_potato', grows: 'いも（くきが へんか）',
    facts: ['いもは くきが へんかした もの', 'いもの くぼみ（め）から 芽と 根が でる', 'いもを 切って ヨウ素液を つけると こい 青むらさき'],
    quiz: [
      { q: 'ジャガイモの いもは なにが へんかした もの？', options: ['くき', '根', '葉'], answer: 0, why: 'ジャガイモは くき、サツマイモは 根が へんかした いもだよ。' },
    ],
  },
  {
    seed: 'sd_soramame', name: 'ソラマメ', emoji: '🫛', type: 'dicot', cotyledons: 2, epigeal: false, rootFirst: true, endosperm: false,
    temp: [15, 20], nutrient: 'たんぱくしつ・でんぷん', starch: 2, pollen: 'insect', flower: '#f5f5f4', crop: 'gf_soramame', grows: 'たね',
    facts: ['子葉が 地上に でてこない（エンドウ・アズキ・クリも）', '子葉は 土の中で ようぶんを おくる', 'くきは 上へ（ふの じゅうりょくくっせい）、根は 下へ のびる'],
    quiz: [
      { q: 'ソラマメが はつがすると、子葉は どこに ある？', options: ['土の中', '地上', 'はなの 中'], answer: 0, why: 'ソラマメや エンドウは 子葉が 地上に でてこないよ。' },
    ],
  },
  {
    seed: 'sd_imo', name: 'サツマイモ', emoji: '🍠', type: 'tuber', cotyledons: 0, epigeal: false, rootFirst: false, endosperm: null,
    temp: [20, 30], nutrient: 'でんぷん', starch: 2, pollen: 'insect', flower: '#f9a8d4', crop: 'gf_rawimo', grows: 'つる（なえ）',
    facts: ['いもは 根が へんかした もの', '葉と くきの ついた つる（なえ）を うえて ふやす', 'うえた つるの ふしから 新しい 根が でる'],
    quiz: [
      { q: 'サツマイモの いもは なにが へんかした もの？', options: ['根', 'くき', '葉'], answer: 0, why: 'サツマイモは 根、ジャガイモは くきが へんかした いもだよ。' },
    ],
  },
  {
    seed: 'sd_tulip', name: 'チューリップ', emoji: '🌷', type: 'bulb', cotyledons: 0, epigeal: false, rootFirst: true, endosperm: null,
    temp: [5, 15], nutrient: 'でんぷん', starch: 2, pollen: 'insect', flower: '#f43f5e', crop: 'gf_tulip', grows: 'きゅうこん（葉が へんか）', closes: 'cold',
    facts: ['きゅうこんは 葉が へんかした もの（ユリ・スイセンも）', 'あたたかいと ひらき、さむいと とじる（おんどけいせい）', 'さむい きせつに うえると はるに さく'],
    quiz: [
      { q: 'チューリップの はなが ひらいたり とじたり するのは なにに はんのうして？', options: ['温度', '音', 'におい'], answer: 0, why: 'あたたかいと ひらき さむいと とじる「おんどけいせい」だよ。タンポポは 光で ひらく。' },
    ],
  },
];

export const PLANT_BY_SEED: Record<string, PlantDef> = Object.fromEntries(PLANTS.map((p) => [p.seed, p]));

/** その月の だいたいの 気温（東京の ひるまの めやす） */
export const MONTH_TEMP: Record<number, number> = { 1: 10, 2: 11, 3: 14, 4: 19, 5: 23, 6: 26, 7: 30, 8: 31, 9: 27, 10: 22, 11: 17, 12: 12 };

/** ひりょう（3ようそ） */
export type Fert = 'n' | 'p' | 'k';
export const FERT_OF: Record<string, Fert> = { ft_n: 'n', ft_p: 'p', ft_k: 'k' };
export const FERT_INFO: Record<Fert, { name: string; emoji: string; does: string }> = {
  n: { name: 'ちっそ', emoji: '🍃', does: '葉が 大きく こい みどりに' },
  p: { name: 'リンさん', emoji: '🌸', does: 'はなや みが ふえる' },
  k: { name: 'カリウム', emoji: '🥕', does: '根や いもが じょうぶに' },
};

/** ずかんの ごほうび（しゅうかくした しゅるいの数） */
export const PLANT_REWARDS: { kinds: number; item: string }[] = [
  { kinds: 5, item: 'fn_planter' },
  { kinds: 10, item: 'fn_greenhouse' },
];

export const POLLEN_LABEL: Record<Pollen, string> = {
  insect: 'こんちゅうが はこぶ（ちゅうばいか）',
  wind: 'かぜが はこぶ（ふうばいか）',
  self: 'じぶんの 花粉で（じかじゅふん）',
};
