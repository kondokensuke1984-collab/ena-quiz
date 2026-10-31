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
export const QUESTIONS_PER_STAGE = 5;
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

/** まとめの 解説：公式 → どうして？ → この もんだいは、の 3だん */
const lesson = (formula: string, why: string, calc: string) => `📘 公式\n${formula}\n\n💡 どうして？\n${why}\n\n✏️ この もんだいは\n${calc}`;

const nameOf = (n: number) => ({ 3: '三角形', 4: '四角形', 5: '五角形', 6: '六角形', 7: '七角形', 8: '八角形', 9: '九角形', 10: '十角形', 12: '十二角形' } as Record<number, string>)[n] ?? `${n}角形`;
const seiName = (n: number) => `正${nameOf(n)}`;

// ───────── ステージ1：多角形 ─────────
const POLY_REG = [5, 6, 8, 9, 10, 12];       // 1つの 内角が 整数に なる 正多角形
type PolyKind = 'fan' | 'sum' | 'inner' | 'outer' | 'diag' | 'whichN' | 'missing';

function polyQ(kind: PolyKind, ov?: { n?: number }): Question {
  const ang = (v: number) => `${v}度`;
  switch (kind) {
    case 'fan': {
      const n = ov?.n ?? pick([5, 6, 7, 8, 9]);
      const a = String(n - 2);
      return {
        kind, fig: { t: 'poly', n, regular: true },
        text: `${nameOf(n)}の 1つの 頂点から 対角線を ひくと、三角形は いくつに わかれる？`,
        choices: makeChoices(`${a}こ`, [`${n - 1}こ`, `${n}こ`, `${n - 3}こ`, `${n - 4}こ`], () => `${n + 1 + rnd(3)}こ`),
        answer: `${a}こ`,
        hint: '1つの 頂点から ほかの 頂点へ 線を ひいてみよう。自分と となりの 2つには ひけないよ',
        explain: lesson('1つの 頂点から ひける 対角線 ＝ 角の 数 − 3（本）\n1つの 頂点から わけられる 三角形 ＝ 角の 数 − 2（こ）', '対角線は 頂点と 頂点を むすぶ 線。でも 自分と、となりの 2つの 頂点には 線を ひいても 辺に なっちゃうから ひけないよ（3つ ひけない）。ひいた 線で 多角形が 三角形に わかれて、その 数は 線の 数より 1つ 多くなるよ。', `${n}-3=${n - 3}(本)\n${n}-2=${n - 2}(こ)`),
      };
    }
    case 'sum': {
      const n = ov?.n ?? pick([4, 5, 6, 7, 8, 9, 10]);
      const v = 180 * (n - 2);
      return {
        kind, fig: { t: 'poly', n, regular: false },
        text: `${nameOf(n)}の 内角の 和は 何度？`,
        choices: makeChoices(ang(v), [ang(180 * (n - 1)), ang(180 * n), ang(180 * (n - 3)), ang(360 * (n - 2))], () => ang(180 * (n - 2 + 1 + rnd(3)))),
        answer: ang(v),
        hint: '三角形に わけて かんがえよう。三角形の 内角の 和は 180度',
        explain: lesson('多角形の 内角の 和 ＝ 180° × (角の 数 − 2)', '三角形の 内角の 和は 180度。多角形は 1つの 頂点から 対角線を ひくと、(角の 数 − 2)この 三角形に わかれるよ。だから 180度を その 数だけ たせば いいんだ。', `${nameOf(n)}は ${n}-2=${n - 2}(こ)の 三角形。\n180×${n - 2}=${v}(度)`),
      };
    }
    case 'inner': {
      const n = ov?.n ?? pick(POLY_REG);
      const v = (180 * (n - 2)) / n;
      return {
        kind, fig: { t: 'poly', n, regular: true },
        text: `${seiName(n)}の 1つの 内角は 何度？`,
        choices: makeChoices(ang(v), [ang(360 / n), ang(180 - v / 2), ang(180 * (n - 2)), ang(180 - 360 / n + 10)], () => ang(v + 5 * (1 + rnd(5)) * (rnd(2) ? 1 : -1))),
        answer: ang(v),
        hint: '内角の 和を 角の 数で わろう',
        explain: lesson('正多角形の 1つの 内角 ＝ 180° × (角の 数 − 2) ÷ 角の 数', '正多角形は 角が ぜんぶ 同じ 大きさ。だから 内角の 和を 角の 数で われば、1つぶんが わかるよ。', `内角の 和は 180×(${n}-2)=${180 * (n - 2)}(度)\n${180 * (n - 2)}÷${n}=${v}(度)`),
      };
    }
    case 'outer': {
      const n = ov?.n ?? pick([3, 4, 5, 6, 8, 9, 10, 12]);
      const v = 360 / n;
      return {
        kind, fig: { t: 'poly', n, regular: true },
        text: `${seiName(n)}の 1つの 外角は 何度？（外角の 和は 360度）`,
        choices: makeChoices(ang(v), [ang(180 - v), ang(180 * (n - 2) / n), ang(v * 2), ang(v / 2)], () => ang(v + 5 * (1 + rnd(5)))),
        answer: ang(v),
        hint: '多角形の 外角の 和は いつでも 360度',
        explain: lesson('外角の 和 ＝ 360°（どんな 多角形でも）\n正多角形の 1つの 外角 ＝ 360° ÷ 角の 数', '外角は 辺を のばして できる 角。かどを ぐるっと 1しゅう まわると、からだは 1回転（360度）するよね。だから 外角を ぜんぶ たすと いつでも 360度 になるよ。正多角形は 外角が ぜんぶ 同じだから、角の 数で わると 1つぶん。', `360÷${n}=${v}(度)`),
      };
    }
    case 'diag': {
      const n = ov?.n ?? pick([5, 6, 7, 8, 9, 10]);
      const v = (n * (n - 3)) / 2;
      return {
        kind, fig: { t: 'poly', n, regular: true },
        text: `${nameOf(n)}の 対角線は 全部で 何本？`,
        choices: makeChoices(`${v}本`, [`${n * (n - 3)}本`, `${n * (n - 1) / 2}本`, `${n - 3}本`, `${v + n}本`], () => `${v + 1 + rnd(5)}本`),
        answer: `${v}本`,
        hint: '1つの 頂点から ひける 本数 × 頂点の 数、でも 同じ線を 2回 数えているよ',
        explain: lesson('対角線の 本数 ＝ 角の 数 × (角の 数 − 3) ÷ 2', '1つの 頂点から ひける 対角線は (角の 数 − 3)本。それを ぜんぶの 頂点で 数えると、1本の 線を りょうはしから 2回ずつ 数えちゃうから、さいごに 2で わるよ。', `${n}-3=${n - 3}(本)\n${n}×${n - 3}=${n * (n - 3)}\n${n * (n - 3)}÷2=${v}(本)`),
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
        explain: lesson('角の 数 ＝ 内角の 和 ÷ 180 ＋ 2', '内角の 和 ＝ 180×(角の 数 − 2) の 式を、ぎゃくに たどるよ。まず 180で わると 三角形の 数が わかる。そこに 2を たすと 角の 数。', `${v}÷180=${n - 2}(こ)\n${n - 2}+2=${n} → ${nameOf(n)}`),
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
        explain: lesson('のこりの 角 ＝ 内角の 和 − 分かっている 角の 和\n内角の 和 ＝ 180° × (角の 数 − 2)', '多角形の 内角を ぜんぶ たすと きまった 数に なる。分かっている 角を ひけば、のこりが でるよ。', `内角の 和は 180×(${n}-2)=${total}(度)\n分かっている 角の 和は ${angles.join('+')}=${total - fixedLast}(度)\n${total}-${total - fixedLast}=${fixedLast}(度)`),
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
    explain: lesson('内角 ＋ 外角 ＝ 180°\n角の 数 ＝ 360° ÷ 1つの 外角', '内角の 和から 考えると 大へん。でも 外角を だすと、外角の 和は いつでも 360度だから、360を 外角で わるだけで 角の 数が わかるよ。', `外角は 180-${inner}=${180 - inner}(度)\n360÷${180 - inner}=${n} → ${seiName(n)}`),
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

type SecOv = { r?: number; a?: number };
const sec = (ov: SecOv | undefined, arc: boolean) => (ov?.r && ov?.a ? { r: ov.r, a: ov.a } : pickSector(arc));

function pizzaQ(kind: PizzaKind, ov?: SecOv): Question {
  const U = (s: string, u: string) => `${s}${u}`;
  switch (kind) {
    case 'circ': {
      const r = ov?.r ?? pick([2, 3, 4, 5, 6, 7, 8, 10, 12]);
      const v = 2 * r * 314;
      const ans = U(fromHundredths(v), 'cm');
      return {
        kind, fig: { t: 'circle', r },
        text: `半径 ${r}cmの 円の まわりの 長さ（円周）は？（円周率 3.14）`,
        choices: makeChoices(ans, [U(fromHundredths(r * r * 314), 'cm'), U(fromHundredths(r * 314), 'cm'), U(fromHundredths(4 * r * 314), 'cm')], () => U(fromHundredths(v + 100 * (1 + rnd(9))), 'cm')),
        answer: ans,
        hint: '円周 = 直径 × 3.14。直径は 半径の 2ばい',
        explain: lesson('円周 ＝ 直径 × 3.14（円周率）\n直径 ＝ 半径 × 2', '円の まわりの 長さは、直径の 3.14倍って きまっているよ。この 3.14を 円周率って いうんだ。半径は 直径の 半分だから、半径を 2ばいして 直径に してから かけよう。', `直径は ${r}×2=${2 * r}(cm)\n${2 * r}×3.14=${fromHundredths(v)}(cm)`),
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
        explain: lesson('円の 面積 ＝ 半径 × 半径 × 3.14', '半径を 1辺に した 正方形の 面積が 「半径×半径」。円の 面積は その 正方形の 3.14倍くらい あるよ。直径じゃなくて 半径を 2回 かけるのが ポイント！', `${r}×${r}×3.14=${fromHundredths(v)}(cm²)`),
      };
    }
    case 'arc': {
      const { r, a } = sec(ov, true);
      const v = arcH(r, a);
      const ans = U(fromHundredths(v), 'cm');
      return {
        kind, cut: a, fig: { t: 'sector', r, a },
        text: `半径 ${r}cm、中心角 ${a}度の おうぎ形の 弧の 長さは？（円周率 3.14）`,
        choices: makeChoices(ans, [U(fromHundredths(areaH(r, a)), 'cm'), U(fromHundredths(2 * r * 314), 'cm'), U(fromHundredths(r * 314 * a / 360), 'cm'), U(fromHundredths(v + 200 * r), 'cm')], () => U(fromHundredths(v + 100 * (1 + rnd(9))), 'cm')),
        answer: ans,
        hint: '弧の 長さ = 円周 × (中心角 ÷ 360)',
        explain: lesson('弧の 長さ ＝ 円周 × 中心角 ÷ 360\n（円周 ＝ 半径 × 2 × 3.14）', `おうぎ形は 円を ピザみたいに 切った もの。円を 1しゅうすると 360度。中心角が ${a}度なら、円の ${a}/360 の ぶんだけの 弧に なるよ。だから 円周に その わりあいを かけるんだ。`, `円周は ${r}×2×3.14=${fromHundredths(2 * r * 314)}(cm)\n${fromHundredths(2 * r * 314)}×${a}/360=${fromHundredths(v)}(cm)`),
      };
    }
    case 'area': {
      const { r, a } = sec(ov, false);
      const v = areaH(r, a);
      const ans = U(fromHundredths(v), 'cm²');
      return {
        kind, cut: a, fig: { t: 'sector', r, a },
        text: `半径 ${r}cm、中心角 ${a}度の おうぎ形の 面積は？（円周率 3.14）`,
        choices: makeChoices(ans, [U(fromHundredths(arcH(r, a)), 'cm²'), U(fromHundredths(r * r * 314), 'cm²'), U(fromHundredths(r * r * 314 * a / 180), 'cm²')], () => U(fromHundredths(v + 100 * (1 + rnd(9))), 'cm²')),
        answer: ans,
        hint: 'おうぎ形の 面積 = 円の 面積 × (中心角 ÷ 360)',
        explain: lesson('おうぎ形の 面積 ＝ 半径 × 半径 × 3.14 × 中心角 ÷ 360', `まず 円ぜんぶの 面積を だす。おうぎ形は その 円の ${a}/360 の ぶん（ピザの 1切れ）だから、円の 面積に その わりあいを かけるよ。`, `円の 面積は ${r}×${r}×3.14=${fromHundredths(r * r * 314)}(cm²)\n${fromHundredths(r * r * 314)}×${a}/360=${fromHundredths(v)}(cm²)`),
      };
    }
    case 'perim': {
      const { r, a } = sec(ov, true);
      const v = arcH(r, a) + 200 * r;
      const ans = U(fromHundredths(v), 'cm');
      return {
        kind, cut: a, fig: { t: 'sector', r, a },
        text: `半径 ${r}cm、中心角 ${a}度の おうぎ形の まわりの 長さは？（円周率 3.14）`,
        choices: makeChoices(ans, [U(fromHundredths(arcH(r, a)), 'cm'), U(fromHundredths(arcH(r, a) + 100 * r), 'cm'), U(fromHundredths(areaH(r, a) + 200 * r), 'cm')], () => U(fromHundredths(v + 100 * (1 + rnd(9))), 'cm')),
        answer: ans,
        hint: 'まわりの 長さ = 弧の 長さ + 半径 ×2 本。まっすぐな 2本を わすれずに！',
        explain: lesson('おうぎ形の まわりの 長さ ＝ 弧の 長さ ＋ 半径 × 2', 'おうぎ形の ふちは、曲がった 弧が 1本と、まっすぐな 半径が 2本。ぜんぶ たさないと まわり 1しゅうに ならないよ。半径 2本を わすれやすいから 気をつけて！', `弧の 長さは ${r}×2×3.14×${a}/360=${fromHundredths(arcH(r, a))}(cm)\n半径 2本は ${r}×2=${2 * r}(cm)\n${fromHundredths(arcH(r, a))}+${2 * r}=${fromHundredths(v)}(cm)`),
      };
    }
    case 'findA': {
      const { r, a } = sec(ov, true);
      const L = arcH(r, a);
      const ans = `${a}度`;
      return {
        kind, fig: { t: 'sector', r, a, ask: 'a' },
        text: `半径 ${r}cm、弧の 長さ ${fromHundredths(L)}cmの おうぎ形の 中心角は 何度？（円周率 3.14）`,
        choices: makeChoices(ans, [`${a * 2 > 360 ? a / 2 : a * 2}度`, `${Math.round(a / 2)}度`, `${360 - a}度`, `${a + 30}度`], () => `${pick(SECTOR_A)}度`),
        answer: ans,
        hint: '弧の 長さが 円周の 何分の 1 かを 考えよう',
        explain: lesson('中心角 ＝ 360° × 弧の 長さ ÷ 円周', '弧の 長さが 円周の 何分の 1 かを 出せば、中心角も 360度の 同じ 何分の 1 になるよ。', `円周は ${r}×2×3.14=${fromHundredths(2 * r * 314)}(cm)\n${fromHundredths(L)}÷${fromHundredths(2 * r * 314)} = ${a}/360\n360×${a}/360=${a}(度)`),
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
    explain: lesson('おうぎ形の まわりの 長さ ＝ 弧の 長さ ＋ 半径 × 2\n弧の 長さ ＝ 半径 × 2 × 3.14 × 中心角 ÷ 360', '弧（曲がった ところ）と、まっすぐな 半径 2本を ぜんぶ たそう。半径 2本の たしわすれが いちばん 多い まちがいだよ。', `弧の 長さは ${r}×2×3.14×${a}/360=${fromHundredths(arcH(r, a))}(cm)\n半径 2本は ${2 * r}(cm)\n${fromHundredths(arcH(r, a))}+${2 * r}=${fromHundredths(v)}(cm)`),
  };
}

// ───────── ステージ3：円とおうぎ2（かげの 部分の 面積）─────────
type WheelKind = 'sqQuarter' | 'sqCircle' | 'petal' | 'ring';

type WheelOv = { s?: number; r?: number; R?: number; a?: number };

function wheelQ(kind: WheelKind, ov?: WheelOv): Question {
  const sq = (s: number) => s * s * 100;
  switch (kind) {
    case 'sqQuarter': {
      const s = ov?.s ?? pick([4, 6, 8, 10, 12, 20]);
      const v = sq(s) - (s * s * 314) / 4;
      const ans = `${fromHundredths(v)}cm²`;
      return {
        kind, fig: { t: 'sqQuarter', s },
        text: `1辺 ${s}cmの 正方形の 中に、半径 ${s}cmの 4分の1の 円が あります。かげの 部分の 面積は？（円周率 3.14）`,
        choices: makeChoices(ans, [`${fromHundredths((s * s * 314) / 4)}cm²`, `${fromHundredths(sq(s))}cm²`, `${fromHundredths(sq(s) - (s * s * 314) / 2)}cm²`.replace(/^-.*/, `${fromHundredths(sq(s) + (s * s * 314) / 4)}cm²`)], () => `${fromHundredths(v + 100 * (1 + rnd(9)))}cm²`),
        answer: ans,
        hint: 'かげ = 正方形 − 4分の1の 円',
        explain: lesson('正方形の 面積 ＝ 1辺 × 1辺\n4分の1の 円の 面積 ＝ 半径 × 半径 × 3.14 ÷ 4\nかげ ＝ 正方形 − 4分の1の 円', '「かげ」の 面積は、わかる 形から わかる 形を ひいて だすよ。正方形の かどを 中心に すると、4分の1の 円の 半径は 正方形の 1辺と 同じに なるよ。', `正方形は ${s}×${s}=${s * s}(cm²)\n4分の1の 円は ${s}×${s}×3.14÷4=${fromHundredths((s * s * 314) / 4)}(cm²)\nかげは ${s * s}-${fromHundredths((s * s * 314) / 4)}=${fromHundredths(v)}(cm²)`),
      };
    }
    case 'sqCircle': {
      const s = ov?.s ?? pick([4, 6, 8, 10, 12, 20]);
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
        explain: lesson('円の 半径 ＝ 正方形の 1辺 ÷ 2\n円の 面積 ＝ 半径 × 半径 × 3.14\nかげ ＝ 正方形 − 円', '正方形に ぴったり 入る 円は、直径が 正方形の 1辺と 同じ。だから 半径は 1辺の 半分だよ。半径を まちがえて 1辺を そのまま つかわないように 気をつけよう。', `半径は ${s}÷2=${h}(cm)\n円の 面積は ${h}×${h}×3.14=${fromHundredths(circ)}(cm²)\n${s * s}-${fromHundredths(circ)}=${fromHundredths(v)}(cm²)`),
      };
    }
    case 'petal': {
      const r = ov?.r ?? pick([4, 6, 8, 10, 20]);
      // 4分の1円 2つ − 正方形（花びら）
      const v = (r * r * 314) / 2 - sq(r);
      const ans = `${fromHundredths(v)}cm²`;
      return {
        kind, fig: { t: 'petal', r },
        text: `1辺 ${r}cmの 正方形の 2つの 頂点を 中心に、半径 ${r}cmの 4分の1の 円を かきました。かげの 部分（はなびら）の 面積は？（円周率 3.14）`,
        choices: makeChoices(ans, [`${fromHundredths(sq(r) - (r * r * 314) / 4)}cm²`, `${fromHundredths((r * r * 314) / 2)}cm²`, `${fromHundredths((r * r * 314) / 4)}cm²`], () => `${fromHundredths(v + 100 * (1 + rnd(9)))}cm²`),
        answer: ans,
        hint: '4分の1の 円を 2つ たすと、正方形が 1回 かさなって 数えられるよ。ひいてみよう',
        explain: lesson('はなびら ＝ 4分の1の 円 × 2 − 正方形\n4分の1の 円 ＝ 半径 × 半径 × 3.14 ÷ 4', '4分の1の 円を 2つ かさねると、まん中の はなびらは 2回 ぬられて、正方形の 全体は ちょうど 1回ぶん 多く 数えられるよ。だから 2つ ぶんから 正方形を 1回 ひくと はなびらだけが のこるんだ。', `4分の1の 円 2つで ${r}×${r}×3.14÷4×2=${fromHundredths((r * r * 314) / 2)}(cm²)\n正方形は ${r}×${r}=${r * r}(cm²)\nかげは ${fromHundredths((r * r * 314) / 2)}-${r * r}=${fromHundredths(v)}(cm²)`),
      };
    }
    case 'ring': {
      for (let g = 0; g < 600; g++) {
        const R = ov?.R ?? pick([6, 8, 10, 12, 15, 20]);
        const r = ov?.r ?? pick([2, 3, 4, 5, 6, 8, 10]);
        const a = ov?.a ?? pick([90, 120, 180, 270]);
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
          explain: lesson('かげ ＝ 大きい おうぎ形 − 小さい おうぎ形\nまとめると (R×R − r×r) × 3.14 × 中心角 ÷ 360', '輪の かたちの かげは、大きい おうぎ形から 小さい おうぎ形を くりぬいた もの。どちらも 3.14と 中心角が 同じだから、(R×R − r×r)を さきに ひいてから かけると 計算が ラクだよ。', `大きい おうぎ形: ${R}×${R}×3.14×${a}/360=${fromHundredths((R * R * 314 * a) / 360)}(cm²)\n小さい おうぎ形: ${r}×${r}×3.14×${a}/360=${fromHundredths((r * r * 314 * a) / 360)}(cm²)\nひいて ${fromHundredths(v)}(cm²)`),
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

// ───────── 出題（積み木パズル → 1問）─────────

/** トレイに ならぶ 積み木 */
export interface Block {
  id: string;
  shape: 'tri' | 'sqr' | 'wedge' | 'slice' | 'q' | 'h' | 'c' | 's';
  /** wedge・slice の 角度（度） */
  a?: number;
  label: string;
  /** ぴったり はまる ブロックか */
  good: boolean;
}

export type PuzzleFig =
  | { t: 'tri'; n: number }
  | { t: 'wedge'; n: number }
  | { t: 'slice'; k: number; a: number; r: number }
  | { t: 'sq'; kind: 'sqQuarter' | 'sqCircle' | 'petal'; s: number }
  | { t: 'ring'; R: number; r: number; a: number };

export interface Puzzle {
  fig: PuzzleFig;
  blocks: Block[];
  /** ぴったりの ブロックを いくつ おけば できあがりか */
  need: number;
  say: string;
  hint: string;
}

export interface Play { q: Question; pz?: Puzzle }

let bid = 0;
const blk = (shape: Block['shape'], label: string, good: boolean, a?: number): Block => ({ id: `b${bid++}`, shape, label, good, a });

function triPuzzle(n: number, q: Question): Play {
  const need = n - 2;
  const blocks = shuffle([
    ...Array.from({ length: need }, () => blk('tri', '180°', true)),
    blk('sqr', '360°', false), blk('sqr', '360°', false),
  ]);
  return {
    q: q.fig.t === 'poly' ? { ...q, fig: { ...q.fig, regular: true } } : q,
    pz: {
      fig: { t: 'tri', n }, blocks, need,
      say: `三角形の ブロックを ならべて ${nameOf(n)}を つくろう！`,
      hint: '1つの 頂点から 線を ひくと、三角形に わけられたよ。三角形の ブロックだけが はまるよ',
    },
  };
}

function wedgePuzzle(n: number): Play {
  const ang = 360 / n;
  const bad = [360 / (n - 1), 360 / (n + 1)];
  const blocks = shuffle([
    ...Array.from({ length: n }, () => blk('wedge', `${ang}°`, true, ang)),
    ...bad.map((a) => blk('wedge', `${Math.round(a * 10) / 10}°`, false, a)),
  ]);
  return {
    q: polyQ('outer', { n }),
    pz: {
      fig: { t: 'wedge', n }, blocks, need: n,
      say: '同じ 大きさの くさびを ならべて、ちょうど ぐるっと 1しゅう させよう！ぴったりの くさびを みつけてね',
      hint: '大きさが ちがうと すきまが あいたり はみだしたりするよ。ぐるっと 1しゅうは 360度',
    },
  };
}

function slicePuzzle(kind: PizzaKind): Play {
  let r = 10, a = 90;
  for (let g = 0; g < 400; g++) {
    r = pick([2, 3, 4, 5, 6, 8, 10, 12]);
    a = pick([60, 72, 90, 120, 180]);
    const v = kind === 'carea' || kind === 'area' ? areaH(r, a) : arcH(r, a);
    if (isInt(v)) break;
  }
  const k = 360 / a;
  const q0 = pizzaQ(kind === 'circ' ? 'circ' : kind, { r, a });
  const q: Question = { ...q0, cut: undefined };
  const badA = [a === 90 ? 120 : a + 30, a === 60 ? 45 : a - 20 > 20 ? a - 20 : a + 50];
  const blocks = shuffle([
    ...Array.from({ length: k }, () => blk('slice', `${a}°`, true, a)),
    ...badA.map((b) => blk('slice', `${b}°`, false, b)),
  ]);
  return {
    q,
    pz: {
      fig: { t: 'slice', k, a, r }, blocks, need: k,
      say: `${a}度の ピザを ならべて、まるい ピザを つくろう！`,
      hint: `円は ぐるっと 360度。${a}度の ピザが ぴったり ${k}まいで 1しゅう するよ`,
    },
  };
}

function sqPuzzle(kind: 'sqQuarter' | 'sqCircle' | 'petal'): Play {
  const s = pick([4, 6, 8, 10, 12, 20]);
  const half = s / 2;
  if (kind === 'sqQuarter') {
    return {
      q: wheelQ('sqQuarter', { s }),
      pz: {
        fig: { t: 'sq', kind, s }, need: 1,
        blocks: shuffle([blk('q', `半径 ${s}cm`, true), blk('q', `半径 ${half}cm`, false), blk('h', `半径 ${s}cm`, false), blk('c', `半径 ${s}cm`, false)]),
        say: `1辺 ${s}cmの 正方形に、4分の1の 円の ブロックを ぴったり はめよう！`,
        hint: '4分の1の 円は、正方形の 1つの かどを 中心にして、半径が 1辺と 同じ になるよ',
      },
    };
  }
  if (kind === 'sqCircle') {
    return {
      q: wheelQ('sqCircle', { s }),
      pz: {
        fig: { t: 'sq', kind, s }, need: 1,
        blocks: shuffle([blk('c', `直径 ${s}cm`, true), blk('c', `直径 ${half}cm`, false), blk('c', `半径 ${s}cm`, false), blk('q', `半径 ${s}cm`, false)]),
        say: `1辺 ${s}cmの 正方形に、ぴったり 入る 円の ブロックを はめよう！`,
        hint: '正方形に ぴったり 入る 円は、直径が 1辺と 同じ だよ',
      },
    };
  }
  const r = pick([4, 6, 8, 10, 20]);
  return {
    q: wheelQ('petal', { r }),
    pz: {
      fig: { t: 'sq', kind, s: r }, need: 2,
      blocks: shuffle([blk('q', `半径 ${r}cm`, true), blk('q', `半径 ${r}cm`, true), blk('q', `半径 ${r / 2}cm`, false), blk('h', `半径 ${r}cm`, false)]),
      say: `1辺 ${r}cmの 正方形に、4分の1の 円の ブロックを 2つ はめて はなびらを つくろう！`,
      hint: '向かい合う 2つの かどを 中心に して、半径が 1辺と 同じ 4分の1の 円を 2つ かさねるよ',
    },
  };
}

function ringPuzzle(): Play {
  let R = 10, r = 5, a = 90;
  for (let g = 0; g < 600; g++) {
    R = pick([6, 8, 10, 12, 15, 20]);
    r = pick([2, 3, 4, 5, 6, 8, 10]);
    a = pick([90, 120, 180, 270]);
    if (r < R && isInt(((R * R - r * r) * 314 * a) / 360)) break;
  }
  const otherA = a === 90 ? 180 : 90;
  return {
    q: wheelQ('ring', { R, r, a }),
    pz: {
      fig: { t: 'ring', R, r, a }, need: 1,
      blocks: shuffle([blk('s', `半径 ${r}cm・${a}°`, true), blk('s', `半径 ${R}cm・${a}°`, false), blk('s', `半径 ${r}cm・${otherA}°`, false)]),
      say: `中心角 ${a}度の おうぎ形の 中から、半径 ${r}cmの 小さい おうぎ形を くりぬく ブロックを はめよう！`,
      hint: '同じ 中心で、同じ 中心角の 小さい おうぎ形を はめると、のこりが 輪の かたちに なるよ',
    },
  };
}

/** ステージの 並び（かんたん → ボス）。ボスだけ 積み木なしの 1問 */
export function kindsOf(stage: StageId): string[] {
  if (stage === 'poly') return shuffle(['tri_sum', 'tri_inner', 'tri_diag', 'wedge']).concat('boss');
  if (stage === 'pizza') return shuffle(['slice_circ', 'slice_arc', 'slice_area', 'slice_perim']).concat('boss');
  return shuffle(['sqQuarter', 'sqCircle', 'petal', 'ring']).concat('boss');
}

export function makePlay(stage: StageId, key: string): Play {
  if (key === 'boss') return { q: stage === 'poly' ? polyBoss() : stage === 'pizza' ? pizzaBoss() : wheelBoss() };
  if (stage === 'poly') {
    if (key === 'tri_sum') { const n = pick([5, 6, 7, 8]); return triPuzzle(n, polyQ('sum', { n })); }
    if (key === 'tri_inner') { const n = pick([5, 6, 8]); return triPuzzle(n, polyQ('inner', { n })); }
    if (key === 'tri_diag') { const n = pick([5, 6, 7, 8]); return triPuzzle(n, polyQ('diag', { n })); }
    return wedgePuzzle(pick([4, 5, 6, 8]));
  }
  if (stage === 'pizza') {
    const kind = ({ slice_circ: 'circ', slice_arc: 'arc', slice_area: 'area', slice_perim: 'perim' } as Record<string, PizzaKind>)[key] ?? 'arc';
    return slicePuzzle(kind);
  }
  return key === 'ring' ? ringPuzzle() : sqPuzzle(key as 'sqQuarter' | 'sqCircle' | 'petal');
}

/** 積み木の 後に でる 1問だけ（検算用） */
export function makeQuestion(stage: StageId, key: string): Question {
  return makePlay(stage, key).q;
}
