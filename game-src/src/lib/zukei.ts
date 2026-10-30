// 11月の算数「多角形」「円とおうぎ1」「円とおうぎ2」の れんしゅうゲーム（ずけいこうぼう）。
// 数は まいかい ランダムに つくり、こたえは 公式から じどうで だす。円周率は 3.14。
// ごほうびは ステージごとの 家具。メダルは つかわない・ふやさない。

export type StageId = 'poly' | 'pizza' | 'wheel';

/** 図の きじゅつ（ZukeiModal が SVG に描く） */
export type Fig =
  | { t: 'poly'; n: number; regular: boolean; angles?: number[]; ask?: boolean }
  | { t: 'sector'; r: number; a: number; ask?: 'a' }
  | { t: 'circle'; r: number }
  | { t: 'sqQuarter'; s: number }
  | { t: 'sqCircle'; s: number }
  | { t: 'petal'; r: number }
  | { t: 'ring'; R: number; r: number; a: number };

export interface Question {
  kind: string;
  text: string;
  fig: Fig;
  /** おうぎ形を 角度スライダーで 切ってから こたえる */
  cut?: number;
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
  unit: string;
  reward: string;
  intro: string;
}

export const STAGES: Stage[] = [
  { id: 'poly', title: '多角形', game: 'かくどパズル', emoji: '🔶', unit: 'tkk11', reward: 'fn_zk_hive', intro: 'ハニーの はちのすを つくろう！ 多角形の 角度を といていくよ。対角線で 三角形に わけるのが コツ！' },
  { id: 'pizza', title: '円とおうぎ1', game: 'ピザやさん', emoji: '🍕', unit: 'en11a', reward: 'fn_zk_pizza', intro: 'ピザやさんに ちゅうもんが きたよ！ ちゅうもんどおりの 角度で ピザを 切って、長さや 面積を こたえよう（円周率は 3.14）' },
  { id: 'wheel', title: '円とおうぎ2', game: 'ドーナツこうぼう', emoji: '🍩', unit: 'en11b', reward: 'fn_zk_donut', intro: 'かげの 部分の 面積を もとめよう！ 大きな 図形から 小さな 図形を ひいたり、くっつけたりして かんがえるよ（円周率は 3.14）' },
];
export const STAGE_BY_ID: Record<StageId, Stage> = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<StageId, Stage>;

/** 1ステージの 問題数（さいごの 1問は ボス） */
export const QUESTIONS_PER_STAGE = 6;
export const HEARTS = 3;

const rnd = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(a: T[]): T => a[rnd(a.length)];
const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = rnd(i + 1); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
};

/** 100倍した 整数を 小数の ことばに（末尾の 0 は けす） */
function fromHundredths(v: number): string {
  const r = Math.round(v);
  const neg = r < 0 ? '-' : '';
  const a = Math.abs(r);
  const i = Math.floor(a / 100);
  const f = a % 100;
  if (f === 0) return `${neg}${i}`;
  return `${neg}${i}.${String(f).padStart(2, '0').replace(/0$/, '')}`;
}
const isInt = (x: number) => Math.abs(x - Math.round(x)) < 1e-9;

/** まちがえやすい ほかの こたえ（単位つき文字列）から、ただしい こたえを まぜた 4つを つくる */
function makeChoices(answer: string, wrongs: string[], fallback: () => string): string[] {
  const set: string[] = [];
  for (const w of wrongs) if (w !== answer && !set.includes(w) && !w.startsWith('-') && !w.startsWith('0 ') && w !== 'NaN') set.push(w);
  let guard = 0;
  while (set.length < 3 && guard++ < 50) { const f = fallback(); if (f !== answer && !set.includes(f)) set.push(f); }
  return shuffle([answer, ...shuffle(set).slice(0, 3)]);
}

const nameOf = (n: number) => ({ 3: '三角形', 4: '四角形', 5: '五角形', 6: '六角形', 7: '七角形', 8: '八角形', 9: '九角形', 10: '十角形', 12: '十二角形' } as Record<number, string>)[n] ?? `${n}角形`;
const seiName = (n: number) => `正${nameOf(n)}`;

// ───────── ステージ1：多角形 ─────────
const POLY_REG = [5, 6, 8, 9, 10, 12];       // 1つの 内角が 整数に なる 正多角形
type PolyKind = 'fan' | 'sum' | 'inner' | 'outer' | 'diag' | 'whichN' | 'missing';

function polyQ(kind: PolyKind): Question {
  const ang = (v: number) => `${v}度`;
  switch (kind) {
    case 'fan': {
      const n = pick([5, 6, 7, 8, 9]);
      const a = String(n - 2);
      return {
        kind, fig: { t: 'poly', n, regular: true },
        text: `${nameOf(n)}の 1つの 頂点から 対角線を ひくと、三角形は いくつに わかれる？`,
        choices: makeChoices(`${a}こ`, [`${n - 1}こ`, `${n}こ`, `${n - 3}こ`, `${n - 4}こ`], () => `${n + 1 + rnd(3)}こ`),
        answer: `${a}こ`,
        hint: '1つの 頂点から ほかの 頂点へ 線を ひいてみよう。自分と となりの 2つには ひけないよ',
        explain: `1つの 頂点から ひける 対角線は、自分と となり合う 2つを のぞくから ${n}-3=${n - 3}(本)。\n三角形は それより 1つ 多くて ${n}-2=${n - 2}(こ)。`,
      };
    }
    case 'sum': {
      const n = pick([4, 5, 6, 7, 8, 9, 10]);
      const v = 180 * (n - 2);
      return {
        kind, fig: { t: 'poly', n, regular: false },
        text: `${nameOf(n)}の 内角の 和は 何度？`,
        choices: makeChoices(ang(v), [ang(180 * (n - 1)), ang(180 * n), ang(180 * (n - 3)), ang(360 * (n - 2))], () => ang(180 * (n - 2 + 1 + rnd(3)))),
        answer: ang(v),
        hint: '三角形に わけて かんがえよう。三角形の 内角の 和は 180度',
        explain: `${nameOf(n)}は ${n}-2=${n - 2}(こ)の 三角形に わけられる。\n180×${n - 2}=${v}(度)`,
      };
    }
    case 'inner': {
      const n = pick(POLY_REG);
      const v = (180 * (n - 2)) / n;
      return {
        kind, fig: { t: 'poly', n, regular: true },
        text: `${seiName(n)}の 1つの 内角は 何度？`,
        choices: makeChoices(ang(v), [ang(360 / n), ang(180 - v / 2), ang(180 * (n - 2)), ang(180 - 360 / n + 10)], () => ang(v + 5 * (1 + rnd(5)) * (rnd(2) ? 1 : -1))),
        answer: ang(v),
        hint: '内角の 和を 角の 数で わろう',
        explain: `${nameOf(n)}の 内角の 和は 180×(${n}-2)=${180 * (n - 2)}(度)。\n正多角形は 角が ぜんぶ 同じだから ${180 * (n - 2)}÷${n}=${v}(度)`,
      };
    }
    case 'outer': {
      const n = pick([3, 4, 5, 6, 8, 9, 10, 12]);
      const v = 360 / n;
      return {
        kind, fig: { t: 'poly', n, regular: true },
        text: `${seiName(n)}の 1つの 外角は 何度？（外角の 和は 360度）`,
        choices: makeChoices(ang(v), [ang(180 - v), ang(180 * (n - 2) / n), ang(v * 2), ang(v / 2)], () => ang(v + 5 * (1 + rnd(5)))),
        answer: ang(v),
        hint: '多角形の 外角の 和は いつでも 360度',
        explain: `外角の 和は 360度。正${nameOf(n)}は ${n}こ ぜんぶ 同じだから 360÷${n}=${v}(度)`,
      };
    }
    case 'diag': {
      const n = pick([5, 6, 7, 8, 9, 10]);
      const v = (n * (n - 3)) / 2;
      return {
        kind, fig: { t: 'poly', n, regular: true },
        text: `${nameOf(n)}の 対角線は 全部で 何本？`,
        choices: makeChoices(`${v}本`, [`${n * (n - 3)}本`, `${n * (n - 1) / 2}本`, `${n - 3}本`, `${v + n}本`], () => `${v + 1 + rnd(5)}本`),
        answer: `${v}本`,
        hint: '1つの 頂点から ひける 本数 × 頂点の 数、でも 同じ線を 2回 数えているよ',
        explain: `1つの 頂点から ひける 対角線は ${n}-3=${n - 3}(本)。\n${n}つの 頂点で ${n}×${n - 3}=${n * (n - 3)}(本) だけど、1本を 2回ずつ 数えているから 2で わって ${v}(本)`,
      };
    }
    case 'whichN': {
      const n = pick([5, 6, 7, 8, 9, 10, 12]);
      const v = 180 * (n - 2);
      return {
        kind, fig: { t: 'poly', n, regular: false, ask: true },
        text: `内角の 和が ${v}度に なる 多角形は 何角形？`,
        choices: makeChoices(nameOf(n), [nameOf(n + 1), nameOf(n - 1), nameOf(n + 2), nameOf(v / 180)].filter((s) => !s.endsWith('角形') || true), () => nameOf(3 + rnd(10))),
        answer: nameOf(n),
        hint: '内角の 和 = 180 × (角の 数 − 2)。180で わってから 2を たそう',
        explain: `${v}÷180=${n - 2}。三角形が ${n - 2}こ とれるから、角の 数は ${n - 2}+2=${n} で ${nameOf(n)}`,
      };
    }
    case 'missing': {
      const n = pick([4, 5, 6]);
      const total = 180 * (n - 2);
      const last = 40 + 5 * rnd(25);                       // 40〜160
      let rest = total - last;
      // のこりの n-1 この 角を 40〜170度の あいだで わりふる
      const angles: number[] = [];
      for (let i = 0; i < n - 1; i++) {
        const left = n - 1 - i;
        if (left === 1) { angles.push(rest); break; }
        const lo = Math.max(40, rest - 170 * (left - 1));
        const hi = Math.min(170, rest - 40 * (left - 1));
        const v = lo + 5 * rnd(Math.floor((hi - lo) / 5) + 1);
        angles.push(v); rest -= v;
      }
      const fixedLast = total - angles.reduce((x, y) => x + y, 0);
      return {
        kind, fig: { t: 'poly', n, regular: false, angles: [...angles, -1], ask: true },
        text: `${nameOf(n)}の 内角が ${angles.map((v) => `${v}度`).join('、')} のとき、のこりの 角（？）は 何度？`,
        choices: makeChoices(ang(fixedLast), [ang(360 - angles.reduce((x, y) => x + y, 0)), ang(180 - angles.reduce((x, y) => x + y, 0) + 360), ang(fixedLast + 180), ang(fixedLast - 20)], () => ang(fixedLast + 5 * (1 + rnd(6)) * (rnd(2) ? 1 : -1))),
        answer: ang(fixedLast),
        hint: `${nameOf(n)}の 内角の 和は 180×(${n}-2) 度。そこから 分かっている 角を ひこう`,
        explain: `${nameOf(n)}の 内角の 和は 180×(${n}-2)=${total}(度)。\n分かっている 角の 和は ${angles.join('+')}=${total - fixedLast}(度)。\nのこりは ${total}-${total - fixedLast}=${fixedLast}(度)`,
      };
    }
  }
}

/** ボス：正多角形の 1つの 内角から 何角形かを あてる（外角に 気づくと すぐ とける） */
function polyBoss(): Question {
  const n = pick([5, 6, 8, 9, 10, 12]);
  const inner = (180 * (n - 2)) / n;
  return {
    kind: 'boss', boss: true, fig: { t: 'poly', n, regular: true, ask: true },
    text: `1つの 内角が ${inner}度の 正多角形は 正何角形？`,
    choices: makeChoices(seiName(n), [seiName(n + 1), seiName(n - 1), seiName(n + 2), seiName(inner / 20 | 0)], () => seiName(3 + rnd(10))),
    answer: seiName(n),
    hint: '1つの 外角は 180−内角。外角の 和は 360度 だから、360÷外角 が 角の 数',
    explain: `1つの 外角は 180-${inner}=${180 - inner}(度)。\n外角の 和は 360度 だから 360÷${180 - inner}=${n}。答えは ${seiName(n)}`,
  };
}

// ───────── ステージ2：円とおうぎ1 ─────────
const SECTOR_A = [45, 60, 72, 90, 120, 135, 150, 180, 270];

/** 100倍した 長さ・面積が 整数に なる (r, a) を えらぶ */
function pickSector(arc: boolean): { r: number; a: number } {
  for (let g = 0; g < 400; g++) {
    const r = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]);
    const a = pick(SECTOR_A);
    const v = arc ? 2 * r * 314 * a / 360 : r * r * 314 * a / 360;
    if (isInt(v)) return { r, a };
  }
  return { r: 10, a: 90 };
}
const arcH = (r: number, a: number) => 2 * r * 314 * a / 360;       // 弧の長さ ×100
const areaH = (r: number, a: number) => r * r * 314 * a / 360;      // 面積 ×100

type PizzaKind = 'circ' | 'carea' | 'arc' | 'area' | 'perim' | 'findA';

function pizzaQ(kind: PizzaKind): Question {
  const U = (s: string, u: string) => `${s}${u}`;
  switch (kind) {
    case 'circ': {
      const r = pick([2, 3, 4, 5, 6, 7, 8, 10, 12]);
      const v = 2 * r * 314;
      const ans = U(fromHundredths(v), 'cm');
      return {
        kind, fig: { t: 'circle', r },
        text: `半径 ${r}cmの 円の まわりの 長さ（円周）は？（円周率 3.14）`,
        choices: makeChoices(ans, [U(fromHundredths(r * r * 314), 'cm'), U(fromHundredths(r * 314), 'cm'), U(fromHundredths(4 * r * 314), 'cm')], () => U(fromHundredths(v + 100 * (1 + rnd(9))), 'cm')),
        answer: ans,
        hint: '円周 = 直径 × 3.14。直径は 半径の 2ばい',
        explain: `直径は ${r}×2=${2 * r}(cm)。円周は ${2 * r}×3.14=${fromHundredths(v)}(cm)`,
      };
    }
    case 'carea': {
      const r = pick([2, 3, 4, 5, 6, 7, 8, 10]);
      const v = r * r * 314;
      const ans = U(fromHundredths(v), 'cm²');
      return {
        kind, fig: { t: 'circle', r },
        text: `半径 ${r}cmの 円の 面積は？（円周率 3.14）`,
        choices: makeChoices(ans, [U(fromHundredths(2 * r * 314), 'cm²'), U(fromHundredths(4 * r * r * 314), 'cm²'), U(fromHundredths(r * 314), 'cm²')], () => U(fromHundredths(v + 100 * (1 + rnd(9))), 'cm²')),
        answer: ans,
        hint: '円の 面積 = 半径 × 半径 × 3.14',
        explain: `${r}×${r}×3.14=${fromHundredths(v)}(cm²)`,
      };
    }
    case 'arc': {
      const { r, a } = pickSector(true);
      const v = arcH(r, a);
      const ans = U(fromHundredths(v), 'cm');
      return {
        kind, cut: a, fig: { t: 'sector', r, a },
        text: `半径 ${r}cm、中心角 ${a}度の おうぎ形の 弧の 長さは？（円周率 3.14）`,
        choices: makeChoices(ans, [U(fromHundredths(areaH(r, a)), 'cm'), U(fromHundredths(2 * r * 314), 'cm'), U(fromHundredths(r * 314 * a / 360), 'cm'), U(fromHundredths(v + 200 * r), 'cm')], () => U(fromHundredths(v + 100 * (1 + rnd(9))), 'cm')),
        answer: ans,
        hint: '弧の 長さ = 円周 × (中心角 ÷ 360)',
        explain: `円周は ${r}×2×3.14=${fromHundredths(2 * r * 314)}(cm)。\n${a}÷360=${a / 360 === 0.5 ? '1/2' : `${a}/360`} を かけて ${fromHundredths(v)}(cm)`,
      };
    }
    case 'area': {
      const { r, a } = pickSector(false);
      const v = areaH(r, a);
      const ans = U(fromHundredths(v), 'cm²');
      return {
        kind, cut: a, fig: { t: 'sector', r, a },
        text: `半径 ${r}cm、中心角 ${a}度の おうぎ形の 面積は？（円周率 3.14）`,
        choices: makeChoices(ans, [U(fromHundredths(arcH(r, a)), 'cm²'), U(fromHundredths(r * r * 314), 'cm²'), U(fromHundredths(r * r * 314 * a / 180), 'cm²')], () => U(fromHundredths(v + 100 * (1 + rnd(9))), 'cm²')),
        answer: ans,
        hint: 'おうぎ形の 面積 = 円の 面積 × (中心角 ÷ 360)',
        explain: `円の 面積は ${r}×${r}×3.14=${fromHundredths(r * r * 314)}(cm²)。\n${a}÷360 を かけて ${fromHundredths(v)}(cm²)`,
      };
    }
    case 'perim': {
      const { r, a } = pickSector(true);
      const v = arcH(r, a) + 200 * r;
      const ans = U(fromHundredths(v), 'cm');
      return {
        kind, cut: a, fig: { t: 'sector', r, a },
        text: `半径 ${r}cm、中心角 ${a}度の おうぎ形の まわりの 長さは？（円周率 3.14）`,
        choices: makeChoices(ans, [U(fromHundredths(arcH(r, a)), 'cm'), U(fromHundredths(arcH(r, a) + 100 * r), 'cm'), U(fromHundredths(areaH(r, a) + 200 * r), 'cm')], () => U(fromHundredths(v + 100 * (1 + rnd(9))), 'cm')),
        answer: ans,
        hint: 'まわりの 長さ = 弧の 長さ + 半径 ×2 本。まっすぐな 2本を わすれずに！',
        explain: `弧の 長さは ${r}×2×3.14×${a}/360=${fromHundredths(arcH(r, a))}(cm)。\n半径が 2本で ${r}×2=${2 * r}(cm)。\nあわせて ${fromHundredths(v)}(cm)`,
      };
    }
    case 'findA': {
      const { r, a } = pickSector(true);
      const L = arcH(r, a);
      const ans = `${a}度`;
      return {
        kind, fig: { t: 'sector', r, a, ask: 'a' },
        text: `半径 ${r}cm、弧の 長さ ${fromHundredths(L)}cmの おうぎ形の 中心角は 何度？（円周率 3.14）`,
        choices: makeChoices(ans, [`${a * 2 > 360 ? a / 2 : a * 2}度`, `${Math.round(a / 2)}度`, `${360 - a}度`, `${a + 30}度`], () => `${pick(SECTOR_A)}度`),
        answer: ans,
        hint: '弧の 長さが 円周の 何分の 1 かを 考えよう',
        explain: `円周は ${r}×2×3.14=${fromHundredths(2 * r * 314)}(cm)。\n弧は ${fromHundredths(L)}÷${fromHundredths(2 * r * 314)} = ${a}/360 だから、中心角は ${a}度`,
      };
    }
  }
}

function pizzaBoss(): Question {
  // 中心角が 90〜180度の おうぎ形の まわりの 長さ
  let r = 10, a = 90;
  for (let g = 0; g < 400; g++) {
    r = pick([6, 8, 10, 12, 15, 20]);
    a = pick([90, 120, 150, 180]);
    if (isInt(arcH(r, a))) break;
  }
  const v = arcH(r, a) + 200 * r;
  const ans = `${fromHundredths(v)}cm`;
  return {
    kind: 'boss', boss: true, cut: a, fig: { t: 'sector', r, a },
    text: `【ボス】半径 ${r}cm、中心角 ${a}度の おうぎ形の まわりの 長さは？（円周率 3.14）`,
    choices: makeChoices(ans, [`${fromHundredths(arcH(r, a))}cm`, `${fromHundredths(arcH(r, a) + 100 * r)}cm`, `${fromHundredths(areaH(r, a) + 200 * r)}cm`], () => `${fromHundredths(v + 100 * (1 + rnd(9)))}cm`),
    answer: ans,
    hint: '弧の 長さ + 半径 2本',
    explain: `弧の 長さは ${r}×2×3.14×${a}/360=${fromHundredths(arcH(r, a))}(cm)。\n半径 2本は ${2 * r}(cm)。\nあわせて ${fromHundredths(v)}(cm)`,
  };
}

// ───────── ステージ3：円とおうぎ2（かげの 部分の 面積）─────────
type WheelKind = 'sqQuarter' | 'sqCircle' | 'petal' | 'ring';

function wheelQ(kind: WheelKind): Question {
  const sq = (s: number) => s * s * 100;
  switch (kind) {
    case 'sqQuarter': {
      const s = pick([4, 6, 8, 10, 12, 20]);
      const v = sq(s) - (s * s * 314) / 4;
      const ans = `${fromHundredths(v)}cm²`;
      return {
        kind, fig: { t: 'sqQuarter', s },
        text: `1辺 ${s}cmの 正方形の 中に、半径 ${s}cmの 4分の1の 円が あります。かげの 部分の 面積は？（円周率 3.14）`,
        choices: makeChoices(ans, [`${fromHundredths((s * s * 314) / 4)}cm²`, `${fromHundredths(sq(s))}cm²`, `${fromHundredths(sq(s) - (s * s * 314) / 2)}cm²`.replace(/^-.*/, `${fromHundredths(sq(s) + (s * s * 314) / 4)}cm²`)], () => `${fromHundredths(v + 100 * (1 + rnd(9)))}cm²`),
        answer: ans,
        hint: 'かげ = 正方形 − 4分の1の 円',
        explain: `正方形は ${s}×${s}=${s * s}(cm²)。\n4分の1の 円は ${s}×${s}×3.14÷4=${fromHundredths((s * s * 314) / 4)}(cm²)。\nかげは ${s * s}-${fromHundredths((s * s * 314) / 4)}=${fromHundredths(v)}(cm²)`,
      };
    }
    case 'sqCircle': {
      const s = pick([4, 6, 8, 10, 12, 20]);
      const h = s / 2;
      const circ = h * h * 314;
      const v = sq(s) - circ;
      const ans = `${fromHundredths(v)}cm²`;
      return {
        kind, fig: { t: 'sqCircle', s },
        text: `1辺 ${s}cmの 正方形の 中に、ぴったり 入る 円が あります。円の 外がわ（かげの 部分）の 面積は？（円周率 3.14）`,
        choices: makeChoices(ans, [`${fromHundredths(circ)}cm²`, `${fromHundredths(sq(s) - s * s * 314)}cm²`.replace(/^-.*/, `${fromHundredths(sq(s) + circ)}cm²`), `${fromHundredths(sq(s))}cm²`], () => `${fromHundredths(v + 100 * (1 + rnd(9)))}cm²`),
        answer: ans,
        hint: '円の 半径は 正方形の 1辺の 半分。かげ = 正方形 − 円',
        explain: `円の 半径は ${s}÷2=${h}(cm)。円の 面積は ${h}×${h}×3.14=${fromHundredths(circ)}(cm²)。\n正方形は ${s * s}(cm²) だから ${s * s}-${fromHundredths(circ)}=${fromHundredths(v)}(cm²)`,
      };
    }
    case 'petal': {
      const r = pick([4, 6, 8, 10, 20]);
      // 4分の1円 2つ − 正方形（花びら）
      const v = (r * r * 314) / 2 - sq(r);
      const ans = `${fromHundredths(v)}cm²`;
      return {
        kind, fig: { t: 'petal', r },
        text: `1辺 ${r}cmの 正方形の 2つの 頂点を 中心に、半径 ${r}cmの 4分の1の 円を かきました。かげの 部分（はなびら）の 面積は？（円周率 3.14）`,
        choices: makeChoices(ans, [`${fromHundredths(sq(r) - (r * r * 314) / 4)}cm²`, `${fromHundredths((r * r * 314) / 2)}cm²`, `${fromHundredths((r * r * 314) / 4)}cm²`], () => `${fromHundredths(v + 100 * (1 + rnd(9)))}cm²`),
        answer: ans,
        hint: '4分の1の 円を 2つ たすと、正方形が 1回 かさなって 数えられるよ。ひいてみよう',
        explain: `4分の1の 円 2つで ${r}×${r}×3.14÷4×2=${fromHundredths((r * r * 314) / 2)}(cm²)。\nこれは 正方形 ${r * r}(cm²) を 1回 ぶん 多く ふくむ。\nかげは ${fromHundredths((r * r * 314) / 2)}-${r * r}=${fromHundredths(v)}(cm²)`,
      };
    }
    case 'ring': {
      for (let g = 0; g < 600; g++) {
        const R = pick([6, 8, 10, 12, 15, 20]);
        const r = pick([2, 3, 4, 5, 6, 8, 10]);
        const a = pick([90, 120, 180, 270]);
        if (r >= R) continue;
        const v = ((R * R - r * r) * 314 * a) / 360;
        if (!isInt(v)) continue;
        const ans = `${fromHundredths(v)}cm²`;
        return {
          kind, fig: { t: 'ring', R, r, a },
          text: `中心角 ${a}度の おうぎ形で、大きい 半径が ${R}cm、小さい 半径が ${r}cmです。かげの 部分の 面積は？（円周率 3.14）`,
          choices: makeChoices(ans, [`${fromHundredths(((R - r) * (R - r) * 314 * a) / 360)}cm²`, `${fromHundredths((R * R * 314 * a) / 360)}cm²`, `${fromHundredths((R * R * 314 * a) / 360 + (r * r * 314 * a) / 360)}cm²`], () => `${fromHundredths(v + 100 * (1 + rnd(9)))}cm²`),
          answer: ans,
          hint: 'かげ = 大きい おうぎ形 − 小さい おうぎ形。まとめて (R×R − r×r)×3.14×角度/360',
          explain: `大きい おうぎ形: ${R}×${R}×3.14×${a}/360=${fromHundredths((R * R * 314 * a) / 360)}(cm²)\n小さい おうぎ形: ${r}×${r}×3.14×${a}/360=${fromHundredths((r * r * 314 * a) / 360)}(cm²)\nかげは ひいて ${fromHundredths(v)}(cm²)`,
        };
      }
      return wheelQ('sqQuarter');
    }
  }
}

function wheelBoss(): Question {
  const q = wheelQ('ring');
  return { ...q, boss: true, text: `【ボス】${q.text}` };
}

// ───────── 出題 ─────────
const POLY_KINDS: PolyKind[] = ['fan', 'sum', 'inner', 'outer', 'diag', 'whichN', 'missing'];
const PIZZA_KINDS: PizzaKind[] = ['circ', 'carea', 'arc', 'area', 'perim', 'findA'];
const WHEEL_KINDS: WheelKind[] = ['sqQuarter', 'sqCircle', 'petal', 'ring'];

/** ステージの 問題の 並び（かんたん → ボス）。おなじ しゅるいが つづかないように えらぶ */
export function kindsOf(stage: StageId): string[] {
  const pool = stage === 'poly' ? POLY_KINDS : stage === 'pizza' ? PIZZA_KINDS : WHEEL_KINDS;
  const first = stage === 'poly' ? ['fan', 'sum'] : stage === 'pizza' ? ['circ', 'carea'] : ['sqQuarter', 'sqCircle'];
  const rest = shuffle(pool.filter((k) => !first.includes(k)));
  const mids = stage === 'wheel' ? [...rest, pick(pool)] : rest;
  return [...first, ...mids.slice(0, QUESTIONS_PER_STAGE - 3), 'boss'];
}

export function makeQuestion(stage: StageId, kind: string): Question {
  if (stage === 'poly') return kind === 'boss' ? polyBoss() : polyQ(kind as PolyKind);
  if (stage === 'pizza') return kind === 'boss' ? pizzaBoss() : pizzaQ(kind as PizzaKind);
  return kind === 'boss' ? wheelBoss() : wheelQ(kind as WheelKind);
}
