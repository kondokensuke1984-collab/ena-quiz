// 11月の理科「種子のつくりと発芽1」（tane1）の れんしゅうゲーム（たねの けんきゅうじょ）。
// 問題の中身は tane1.html／data/questions_202611.json（ta1_*）の範囲。ならびや えらぶものは まいかい ランダム。
// ごほうびは ステージごとの 家具。メダルは つかわない・ふやさない。

export type StageId = 'cut' | 'iodine' | 'cond' | 'grow';

export type SeedKind = 'bean' | 'corn';
/** たねの 部分（bean＝インゲンマメ、corn＝トウモロコシ） */
export type Part = 'youga' | 'hanjiku' | 'yokon' | 'shiyo' | 'shuhi' | 'hainyu' | 'hai';

export const PART_NAME: Record<Part, string> = {
  youga: '幼芽', hanjiku: '胚じく', yokon: '幼根', shiyo: '子葉', shuhi: '種皮', hainyu: '胚乳', hai: '胚',
};

/** 発芽の じっけんの コップ */
export interface Cup { label: string; water: boolean; air: boolean; warm: boolean; light: boolean }

/** 図の きじゅつ（TaneModal が SVG に描く） */
export type Fig =
  | { t: 'seed'; seed: SeedKind; mark?: Part; stain?: Part[] }
  | { t: 'cups'; cups: Cup[] }
  | { t: 'steps'; items: { e: string; s: string }[] };

export interface Question {
  kind: string;
  text: string;
  fig: Fig;
  choices: string[];
  answer: string;
  hint: string;
  explain: string;
  boss?: boolean;
}

export interface Stage {
  id: StageId;
  title: string;
  game: string;
  emoji: string;
  reward: string;
  intro: string;
}

export const STAGES: Stage[] = [
  { id: 'cut', title: '種子のつくり', game: 'たねの きりくち', emoji: '🔍', reward: 'fn_tn_bean', intro: 'たねを 切って なかを のぞいてみよう！ 胚・胚乳・子葉・種皮… どこが なにに なるのかな？' },
  { id: 'iodine', title: 'ヨウ素液', game: 'ヨウ素液 たんてい', emoji: '🧪', reward: 'fn_tn_iodine', intro: 'ヨウ素液を かけると でんぷんが 青むらさき色に なるよ。養分は どこに あるのかな？' },
  { id: 'cond', title: '発芽の3条件', game: 'はっがの じっけん', emoji: '🥛', reward: 'fn_tn_cup', intro: 'コップで じっけんだ！ 調べたい条件だけが ちがう コップを くらべるのが コツ！' },
  { id: 'grow', title: '発芽のようす', game: 'めばえ はかせ', emoji: '🌱', reward: 'fn_tn_sprout', intro: 'インゲンマメ・トウモロコシ・イネ… めが 出る ようすは それぞれ ちがうよ。くらべて おぼえよう！' },
];
export const STAGE_BY_ID: Record<StageId, Stage> = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<StageId, Stage>;

/** 1ステージの 問題数（さいごの 1問は ボス） */
export const QUESTIONS_PER_STAGE = 6;
export const HEARTS = 3;

const KINDS: Record<StageId, string[]> = {
  cut: ['bean-part', 'bean-part', 'corn-part', 'role', 'type', 'boss'],
  iodine: ['i-bean', 'i-corn', 'i-which', 'i-before', 'i-after', 'boss'],
  cond: ['compare', 'which', 'compare', 'unneeded', 'which', 'boss'],
  grow: ['g-first', 'g-cotyl', 'g-temp', 'g-ine', 'g-light', 'boss'],
};
export const kindsOf = (stage: StageId): string[] => KINDS[stage];

const rnd = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(a: T[]): T => a[rnd(a.length)];
const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = rnd(i + 1); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
};
/** こたえ ＋ ほかの こたえ（さいだい3つ）を まぜる */
const mix = (answer: string, wrongs: string[], n = 3): string[] => shuffle([answer, ...shuffle(wrongs.filter((w) => w !== answer)).slice(0, n)]);

const BEAN_PARTS: Part[] = ['youga', 'hanjiku', 'yokon', 'shiyo', 'shuhi'];
const CORN_PARTS: Part[] = ['hainyu', 'hai', 'shuhi'];

const PART_ROLE: Record<Part, string> = {
  youga: '幼芽は 発芽して 葉や くきに なる',
  hanjiku: '胚じくは 発芽して くきに なる',
  yokon: '幼根は 発芽して 根に なる',
  shiyo: '子葉には 発芽に つかう 養分(でんぷん)が たくわえられている',
  shuhi: '種皮は 中の 胚や 胚乳を まもっている',
  hainyu: '胚乳には 発芽に つかう 養分(でんぷん)が たくわえられている',
  hai: '胚は これから 育って 植物の からだに なる ところ（トウモロコシでは 胚乳の すみに ある 小さな ところ）',
};

// ───────── 発芽の じっけん ─────────
const COND_NAME = { water: '水', air: '空気', temp: '温度', light: '日光' } as const;
type Factor = keyof typeof COND_NAME;
const baseCup = (label: string, light = true): Cup => ({ label, water: true, air: true, warm: true, light });
const changeCup = (c: Cup, f: Factor): Cup => ({ ...c, water: f === 'water' ? false : c.water, air: f === 'air' ? false : c.air, warm: f === 'temp' ? false : c.warm, light: f === 'light' ? false : c.light });

function compareQ(): Question {
  const f = pick(['water', 'air', 'temp', 'light'] as Factor[]);
  const a = baseCup('A');
  const b = changeCup(baseCup('B'), f);
  const swap = Math.random() < 0.5;
  const cups = swap ? [{ ...b, label: 'A' }, { ...a, label: 'B' }] : [a, b];
  const bad = swap ? 'A' : 'B';
  const good = swap ? 'B' : 'A';
  const result: Record<Factor, string> = {
    water: `${bad}は 水が ないので 発芽しない。${good}は 発芽する。ちがうのは 水だけだから「発芽に 水が いる」と わかる。`,
    air: `${bad}は 水に しずめて 空気が ふれないので 発芽しない。${good}は 発芽する。ちがうのは 空気だけだから「発芽に 空気が いる」と わかる。`,
    temp: `${bad}は 冷蔵庫の 中で 温度が 低すぎて 発芽しない。${good}は 発芽する。ちがうのは 温度だけだから「発芽に 適当な 温度が いる」と わかる。`,
    light: `${bad}も ${good}も どちらも 発芽する。ちがうのは 日光だけで 発芽できたから「発芽に 日光は いらない」と わかる。`,
  };
  return {
    kind: 'compare',
    text: `AとBを くらべました。この じっけんで 調べられる 条件は どれ？`,
    fig: { t: 'cups', cups },
    choices: mix(COND_NAME[f], Object.values(COND_NAME), 3),
    answer: COND_NAME[f],
    hint: 'AとBで ちがっている ところは どこかな？ 1つだけ ちがうはず！',
    explain: `${result[f]}\n【コツ】調べたい条件だけを ちがえて くらべる。`,
  };
}

function whichQ(forceDark: boolean): Question {
  const order: Factor[] = shuffle(['water', 'air', 'temp'] as Factor[]);
  const labels = ['A', 'B', 'C', 'D'];
  const kinds: (Factor | null)[] = shuffle([null, ...order] as (Factor | null)[]);
  const cups: Cup[] = kinds.map((k, i) => {
    const light = forceDark ? k !== null : Math.random() < 0.5;   // forceDark：そろっている コップだけ くらい
    return k === null ? baseCup(labels[i], light) : changeCup(baseCup(labels[i], light), k);
  });
  const goodIdx = kinds.indexOf(null);
  const good = labels[goodIdx];
  const why = cups
    .map((c, i) => (i === goodIdx ? '' : `${c.label}：${!c.water ? '水が ない' : !c.air ? '空気が ふれない' : '温度が 低すぎる'}`))
    .filter(Boolean)
    .join('　');
  return {
    kind: 'which',
    text: 'インゲンマメの たねを 4つの コップに おきました。発芽するのは どれ？',
    fig: { t: 'cups', cups },
    choices: labels,
    answer: good,
    hint: '発芽の 3条件は「水・空気・適当な温度」。日光は いるのかな？',
    explain: `${good}だけが 水・空気・適当な温度が そろっている。${why}。\n日光は 発芽に いらないので、${cups[goodIdx].light ? '明るくても' : 'くらくても'} ${good}は 発芽するよ。`,
    boss: forceDark,
  };
}

function unneededQ(): Question {
  const ans = pick(['日光', '肥料']);
  return {
    kind: 'unneeded',
    text: 'ふつうの 種子が 発芽するのに、いらない ものは どれ？',
    fig: { t: 'steps', items: [{ e: '💧', s: '水' }, { e: '🌬️', s: '空気' }, { e: '🌡️', s: '温度' }, { e: '☀️', s: '日光?' }, { e: '🧴', s: '肥料?' }] },
    choices: mix(ans, ['水', '空気', '適当な温度'], 3),
    answer: ans,
    hint: '種子の 中には、発芽に つかう 養分が たくわえられているよ。',
    explain: '発芽の 3条件は「水・空気・適当な温度」。日光や 肥料は ふつう いらない。種子の 子葉や 胚乳に 養分が たくわえられているから。（れいがい：レタスは 発芽に 光が いる）',
  };
}

// ───────── 問題づくり ─────────
function partQ(seed: SeedKind): Question {
  const parts = seed === 'bean' ? BEAN_PARTS : CORN_PARTS;
  const mark = pick(parts);
  const pool = seed === 'bean' ? BEAN_PARTS : [...CORN_PARTS, 'shiyo' as Part];
  return {
    kind: seed === 'bean' ? 'bean-part' : 'corn-part',
    text: `${seed === 'bean' ? 'インゲンマメ' : 'トウモロコシ'}の たねを 切った ところ。「？」の 部分の 名前は どれ？`,
    fig: { t: 'seed', seed, mark },
    choices: mix(PART_NAME[mark], pool.map((p) => PART_NAME[p]), 3),
    answer: PART_NAME[mark],
    hint: seed === 'bean' ? '胚は「幼芽・胚じく・幼根」の 3つ。大きな ふくらみは 子葉だよ。' : 'トウモロコシは 養分を 胚乳に ためている「有胚乳種子」。小さな 胚は すみに あるよ。',
    explain: `${PART_NAME[mark]}。${PART_ROLE[mark]}。`,
  };
}

const ROLES: { text: string; ans: Part; hint: string }[] = [
  { text: '発芽して 根に なる ところは どれ？', ans: 'yokon', hint: '根の 赤ちゃん＝「幼」い「根」。' },
  { text: '発芽して 葉に なる ところは どれ？', ans: 'youga', hint: '芽の 赤ちゃん＝「幼」い「芽」。' },
  { text: 'インゲンマメで、発芽に つかう 養分を たくわえている ところは どれ？', ans: 'shiyo', hint: 'インゲンマメは 胚乳の ない「無胚乳種子」。' },
];
function roleQ(): Question {
  const r = pick(ROLES);
  return {
    kind: 'role',
    text: r.text,
    fig: { t: 'seed', seed: 'bean' },
    choices: mix(PART_NAME[r.ans], ['youga', 'hanjiku', 'yokon', 'shiyo'].map((p) => PART_NAME[p as Part]), 3),
    answer: PART_NAME[r.ans],
    hint: r.hint,
    explain: `${PART_NAME[r.ans]}。${PART_ROLE[r.ans]}。\n胚は「幼芽・胚じく・幼根」の 3つで できているよ。`,
  };
}

function typeQ(): Question {
  const ans = pick(['インゲンマメ', 'アサガオ']);
  return {
    kind: 'type',
    text: '養分を 子葉に たくわえる「無胚乳種子」は どれ？',
    fig: { t: 'steps', items: [{ e: '🫘', s: 'インゲンマメ' }, { e: '🌽', s: 'トウモロコシ' }, { e: '🌾', s: 'イネ' }, { e: '🟠', s: 'カキ' }, { e: '🌺', s: 'アサガオ' }] },
    choices: mix(ans, ['トウモロコシ', 'イネ', 'カキ'], 3),
    answer: ans,
    hint: 'トウモロコシ・イネ・カキは 胚乳に 養分を ためる「有胚乳種子」。',
    explain: '無胚乳種子は インゲンマメ・アサガオ。有胚乳種子は トウモロコシ・イネ・カキ。',
  };
}

function bossCut(): Question {
  return {
    kind: 'boss',
    text: '双子葉類なのに「有胚乳種子」という れいがいの 植物は どれ？',
    fig: { t: 'steps', items: [{ e: '🫘', s: 'インゲンマメ' }, { e: '🌽', s: 'トウモロコシ' }, { e: '🌾', s: 'イネ' }, { e: '🟠', s: 'カキ' }] },
    choices: shuffle(['カキ', 'インゲンマメ', 'トウモロコシ', 'イネ']),
    answer: 'カキ',
    hint: 'トウモロコシ・イネは 単子葉類。インゲンマメは 双子葉類だけど 無胚乳。',
    explain: '単子葉類は 葉脈が 平行で、ふつう 有胚乳種子。双子葉類は 葉脈が 枝分かれして、ふつう 無胚乳種子。れいがいは カキ（と オシロイバナ）で、双子葉類なのに 有胚乳種子。',
    boss: true,
  };
}

// ヨウ素液
const IODINE_WHY = 'ヨウ素液を かけると、でんぷんが 青むらさき色に なる。';
function iBeanQ(): Question {
  return {
    kind: 'i-bean',
    text: 'インゲンマメの たねを 切って ヨウ素液を かけました。青むらさき色に なる ところは どこ？',
    fig: { t: 'seed', seed: 'bean', stain: ['shiyo'] },
    choices: mix('子葉', ['種皮', '幼根', '幼芽'], 3),
    answer: '子葉',
    hint: 'インゲンマメが 養分(でんぷん)を ためている ところは？',
    explain: `${IODINE_WHY}インゲンマメは 子葉に でんぷんが たくさん あるので、子葉が 青むらさき色に なる。`,
  };
}
function iCornQ(): Question {
  return {
    kind: 'i-corn',
    text: 'トウモロコシの たねを 切って ヨウ素液を かけました。青むらさき色に なる ところは どこ？',
    fig: { t: 'seed', seed: 'corn', stain: ['hainyu'] },
    choices: mix('胚乳', ['種皮', '胚', '子葉'], 3),
    answer: '胚乳',
    hint: 'トウモロコシは 有胚乳種子。養分は どこに あるのかな？',
    explain: `${IODINE_WHY}トウモロコシは 胚乳に でんぷんが たくさん あるので、胚乳が 青むらさき色に なる。`,
  };
}
function iWhichQ(): Question {
  return {
    kind: 'i-which',
    text: 'ヨウ素液は、なにが あると 青むらさき色に かわる？',
    fig: { t: 'steps', items: [{ e: '🧪', s: 'ヨウ素液' }, { e: '➡️', s: '' }, { e: '🟣', s: '青むらさき' }] },
    choices: mix('でんぷん', ['水', '酸素', '日光'], 3),
    answer: 'でんぷん',
    hint: '種子が 発芽に つかう 養分の ことだよ。',
    explain: 'ヨウ素液は でんぷんに 反応して 青むらさき色に なる。種子の 子葉や 胚乳の でんぷんを 調べるのに つかう。',
  };
}
function iBeforeQ(): Question {
  return {
    kind: 'i-before',
    text: '水に ひたした 発芽前の インゲンマメを 切って ヨウ素液を かけると、どうなる？',
    fig: { t: 'seed', seed: 'bean', stain: ['shiyo'] },
    choices: mix('青むらさき色に なる', ['ほとんど かわらない', '赤く なる', '緑色に なる'], 3),
    answer: '青むらさき色に なる',
    hint: '発芽前の 子葉には でんぷんが たっぷり！',
    explain: '発芽前の 種子には でんぷんが ふくまれているので、青むらさき色に なる。',
  };
}
function iAfterQ(): Question {
  return {
    kind: 'i-after',
    text: '発芽して 大きく なった あとの インゲンマメの 子葉に ヨウ素液を かけると、どうなる？',
    fig: { t: 'steps', items: [{ e: '🫘', s: '発芽前' }, { e: '➡️', s: '' }, { e: '🌱', s: '発芽後' }] },
    choices: mix('ほとんど かわらない', ['こい 青むらさき色に なる', '赤く なる', '緑色に なる'], 3),
    answer: 'ほとんど かわらない',
    hint: '発芽や 成長の ために、でんぷんは どうなったかな？',
    explain: '発芽の ために でんぷんが つかわれて なくなっているので、ヨウ素液を かけても 色は かわらない。（発芽前は 青むらさき色）',
  };
}
function bossIodine(): Question {
  return {
    kind: 'boss',
    text: '種子の 発芽に 日光や 肥料が いらないのは、なぜ？',
    fig: { t: 'seed', seed: 'bean', stain: ['shiyo'] },
    choices: shuffle([
      '子葉や 胚乳に、発芽に ひつような 養分が たくわえられているから',
      '種皮が 日光や 肥料を すいとるから',
      '発芽したら すぐに 根から 肥料を すいはじめるから',
      '胚は 水と 空気だけで 育つ 特別な つくりだから',
    ]),
    answer: '子葉や 胚乳に、発芽に ひつような 養分が たくわえられているから',
    hint: 'ヨウ素液で 青むらさき色に なった ところが 答えの ヒント！',
    explain: '子葉や 胚乳に でんぷんなどの 養分が たくわえられていて、発芽と そのあとの 成長に つかわれるから、日光や 肥料は ふつう いらない。',
    boss: true,
  };
}

// 発芽のようす
function gFirstQ(): Question {
  const plant = pick(['インゲンマメ', 'トウモロコシ']);
  return {
    kind: 'g-first',
    text: `${plant}が 発芽する とき、はじめに 土の 中へ のびていく ところは どれ？`,
    fig: { t: 'steps', items: [{ e: plant === 'インゲンマメ' ? '🫘' : '🌽', s: 'たね' }, { e: '💧', s: '水を すう' }, { e: '❓', s: 'はじめに？' }, { e: '🌱', s: 'めが のびる' }] },
    choices: mix('根', ['くき', '子葉', '本葉'], 3),
    answer: '根',
    hint: 'インゲンマメも トウモロコシも、まず 土に しっかり ささえを つくるよ。',
    explain: 'インゲンマメも トウモロコシも、まず 根が 出て、そのあと 芽(くき)が のびる。',
  };
}
function gCotylQ(): Question {
  const [plant, n] = pick([['インゲンマメ', '2枚'], ['トウモロコシ', '1枚']]);
  return {
    kind: 'g-cotyl',
    text: `${plant}の 子葉は 何枚？`,
    fig: { t: 'steps', items: [{ e: '🫘', s: 'インゲンマメ 双子葉類' }, { e: '🌽', s: 'トウモロコシ 単子葉類' }] },
    choices: ['1枚', '2枚', '3枚', '4枚'],
    answer: n,
    hint: '単子葉類は 1枚、双子葉類は 2枚。',
    explain: `${plant}は ${plant === 'インゲンマメ' ? '双子葉類' : '単子葉類'}なので 子葉は ${n}。インゲンマメは 子葉が 地上に 出て 2つに 割れる。`,
  };
}
function gTempQ(): Question {
  const v = rnd(3);
  if (v === 0) {
    return {
      kind: 'g-temp',
      text: '発芽に いちばん 高い 温度が ひつような 種子は どれ？',
      fig: { t: 'steps', items: [{ e: '🫘', s: '23〜25℃' }, { e: '🌽', s: '25〜30℃' }, { e: '🌾', s: '30〜35℃' }, { e: '🥬', s: '18〜25℃' }] },
      choices: ['インゲンマメ', 'トウモロコシ', 'イネ', 'レタス'],
      answer: 'イネ',
      hint: 'イネは あたたかい 田んぼで 育つね。',
      explain: '発芽に ちょうどいい 温度は インゲンマメ 23〜25℃、トウモロコシ 25〜30℃、イネ 30〜35℃、レタス 18〜25℃。いちばん 高いのは イネ。',
    };
  }
  const [name, ans] = v === 1 ? ['インゲンマメ', '23〜25℃'] : ['トウモロコシ', '25〜30℃'];
  return {
    kind: 'g-temp',
    text: `${name}が 発芽するのに ちょうどいい 温度は どれ？`,
    fig: { t: 'steps', items: [{ e: '🫘', s: 'インゲンマメ' }, { e: '🌽', s: 'トウモロコシ' }, { e: '🌾', s: 'イネ' }, { e: '🥬', s: 'レタス' }] },
    choices: mix(ans, ['23〜25℃', '25〜30℃', '30〜35℃', '18〜25℃'], 3),
    answer: ans,
    hint: 'イネ 30〜35℃ ＞ トウモロコシ 25〜30℃ ＞ インゲンマメ 23〜25℃ の じゅん。',
    explain: `${name}の 発芽に ちょうどいい 温度は ${ans}。`,
  };
}
function gIneQ(): Question {
  return {
    kind: 'g-ine',
    text: 'イネの 発芽の ようすで、根より 先に 出てくる ものは どれ？',
    fig: { t: 'steps', items: [{ e: '🌾', s: 'イネ(えいに つつまれる)' }, { e: '❓', s: '先に？' }] },
    choices: mix('子葉', ['根', '本葉', 'くき'], 3),
    answer: '子葉',
    hint: 'イネは インゲンマメ・トウモロコシと ちがって、根が 先では ないよ。',
    explain: 'イネは 根より 先に 子葉が 出てくる。種子は「えい」(もみがら)に つつまれていて、水の 中の わずかな 空気でも 発芽できる。',
  };
}
function gLightQ(): Question {
  return {
    kind: 'g-light',
    text: 'れいがいとして、発芽に 光が ひつような 種子は どれ？',
    fig: { t: 'steps', items: [{ e: '🫘', s: 'インゲンマメ' }, { e: '🌾', s: 'イネ' }, { e: '🥬', s: 'レタス' }, { e: '🌽', s: 'トウモロコシ' }] },
    choices: shuffle(['インゲンマメ', 'イネ', 'レタス', 'トウモロコシ']),
    answer: 'レタス',
    hint: 'ふつうの 種子は 日光が いらないけれど…サラダに 使う 野菜が れいがい！',
    explain: 'レタスは れいがい的に 発芽に 光を ひつようとする（光発芽種子）。ほかに オオバコ・イチゴなども 光が いる。',
  };
}
function bossGrow(): Question {
  const ans = 'イネは 根より 先に 子葉が 出てくる';
  return {
    kind: 'boss',
    text: 'イネの 種子の 発芽について、正しい せつめいは どれ？',
    fig: { t: 'steps', items: [{ e: '🌾', s: 'イネ' }, { e: '🌡️', s: '30〜35℃' }, { e: '💧', s: '水の中でも？' }] },
    choices: shuffle([
      ans,
      '水に 完全に しずめると、空気が ないので 発芽しない',
      '発芽には 20℃前後が いちばん よい',
      '水が なくても 発芽できる',
    ]),
    answer: ans,
    hint: 'イネは 田んぼで 育つね。水の 中でも 発芽できて、あたたかい 温度が すき。',
    explain: 'イネは 根より 先に 子葉が 出てくる。水の 中の わずかな 空気でも 発芽できる（水に しずめても 発芽する）。ちょうどいい 温度は 30〜35℃。水は どの 種子にも ひつよう。',
    boss: true,
  };
}

export function makeQuestion(stage: StageId, kind: string): Question {
  switch (kind) {
    case 'bean-part': return partQ('bean');
    case 'corn-part': return partQ('corn');
    case 'role': return roleQ();
    case 'type': return typeQ();
    case 'i-bean': return iBeanQ();
    case 'i-corn': return iCornQ();
    case 'i-which': return iWhichQ();
    case 'i-before': return iBeforeQ();
    case 'i-after': return iAfterQ();
    case 'compare': return compareQ();
    case 'which': return whichQ(false);
    case 'unneeded': return unneededQ();
    case 'g-first': return gFirstQ();
    case 'g-cotyl': return gCotylQ();
    case 'g-temp': return gTempQ();
    case 'g-ine': return gIneQ();
    case 'g-light': return gLightQ();
    case 'boss':
      return stage === 'cut' ? bossCut() : stage === 'iodine' ? bossIodine() : stage === 'cond' ? whichQ(true) : bossGrow();
    default: return gLightQ();
  }
}
