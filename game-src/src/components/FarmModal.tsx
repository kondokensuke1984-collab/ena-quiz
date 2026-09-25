import { useState } from 'react';
import { useGame } from '../state/useGame';
import { ITEMS, ITEM_BY_ID } from '../lib/items';
import {
  CROP_COUNT, GROW_DAYS, healthOf, isRipe, PLANT_DAYS, PLANT_STAGE_NAME, plantOf, ripeStage, STAGE_NAME, stageTip, tempOk,
} from '../lib/farm';
import { FERT_INFO, FERT_OF, MONTH_TEMP, PLANT_BY_SEED, PLANT_REWARDS, PLANTS, POLLEN_LABEL, type PlantDef, type PlantQuiz } from '../lib/plants';
import { dateKey } from '../lib/study';
import { FlowerParts, SeedCut } from './PlantLab';

// はたけ：うね3つ（うえる／みずやり／ひりょう／はこ／しらべる／しゅうかく）と しょくぶつ ずかん
type View =
  | { kind: 'seed' | 'flower'; plot: number; p: PlantDef }
  | { kind: 'quiz'; plot: number; p: PlantDef; quiz: PlantQuiz; order: number[]; picked?: number; text?: string };

function Chip({ ok, children }: { ok: boolean | 'slow'; children: React.ReactNode }) {
  const cls = ok === true ? 'bg-emerald-100 text-emerald-800' : ok === 'slow' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700';
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${cls}`}>{children}</span>;
}

export function FarmModal({ stages, studied, onClose }: { stages: number[]; studied: boolean; onClose(): void }) {
  const g = useGame();
  const [tab, setTab] = useState<'plots' | 'dex'>('plots');
  const [view, setView] = useState<View | null>(null);
  const seeds = ITEMS.filter((i) => i.kind === 'seed' && (g.save.inventory[i.id] ?? 0) > 0);
  const ferts = ITEMS.filter((i) => i.kind === 'fert' && (g.save.inventory[i.id] ?? 0) > 0);
  const today = dateKey();
  const month = new Date().getMonth() + 1;

  const doHarvest = (i: number, ok?: boolean): string => {
    const r = g.harvest(i, ok);
    if (!r) return '';
    const it = ITEM_BY_ID[r.crop];
    let msg = `🧺 ${it.emoji} ${it.name} が ${r.count}つ とれた！`;
    if (r.seedBack) msg += ` 🌰 たねも 1つ できたよ（つぎの せだいへ）`;
    if (r.reward) msg += ` 🎉 ずかんの ごほうび：${ITEM_BY_ID[r.reward].emoji} ${ITEM_BY_ID[r.reward].name}（「かぐ」から おけるよ）`;
    g.showToast(msg);
    return msg;
  };
  const startHarvest = (i: number, p: PlantDef | undefined) => {
    if (!p || !p.quiz.length) { doHarvest(i); return; }
    const quiz = p.quiz[Math.floor(Math.random() * p.quiz.length)];
    const order = quiz.options.map((_, k) => k).sort(() => Math.random() - 0.5);   // こたえが いつも 同じ ばしょに ならないように
    setView({ kind: 'quiz', plot: i, p, quiz, order });
  };
  const water = (i: number) => {
    if (g.waterPlot(i)) g.showToast(studied ? '💧 みずを あげたよ。きょうも そだつよ！' : '💧 みずを あげたよ。クイズを 5もん やると そだつよ');
  };
  const fert = (i: number, id: string) => {
    const r = g.fertilize(i, id);
    const f = FERT_INFO[FERT_OF[id]];
    if (r === 'early') g.showToast('🌱 はつがに ひりょうは いらないよ。めが でてから あげよう', 'ng');
    else if (r === 'same') g.showToast(`${f.emoji} ${f.name}は もう あげたよ`, 'ng');
    else if (r === 'ok') g.showToast(`${f.emoji} ${f.name}を あげた！ ${f.does}`);
  };

  // ── しらべる・まめクイズ（うねの 上に かさねて 出す）──
  if (view) {
    const p = view.p;
    return (
      <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setView(null)}>
        <div className="panel max-h-[88vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="mb-2 text-[14px] font-black text-ink">
            {view.kind === 'seed' ? `✂️ ${p.name}の たねを きって みる` : view.kind === 'flower' ? `🔍 ${p.name}の はなを しらべる` : `❓ ${p.name}の まめクイズ`}
          </div>
          {view.kind === 'seed' && <SeedCut p={p} />}
          {view.kind === 'flower' && <FlowerParts p={p} done={g.save.farm.flowers.includes(p.seed)} onDone={() => { g.markFlower(p.seed); }} />}
          {view.kind === 'quiz' && (
            <div>
              <div className="mb-2 text-[13px] font-black leading-snug text-ink">{view.quiz.q}</div>
              <div className="flex flex-col gap-1.5">
                {view.order.map((k) => {
                  const o = view.quiz.options[k];
                  const done = view.picked !== undefined;
                  const cls = !done ? 'bg-white' : k === view.quiz.answer ? 'bg-emerald-200' : k === view.picked ? 'bg-rose-200' : 'bg-white opacity-60';
                  return (
                    <button key={k} disabled={done} className={`rounded-xl px-3 py-2 text-left text-[13px] font-black text-ink shadow active:scale-95 ${cls}`}
                      onClick={() => {
                        const ok = k === view.quiz.answer;
                        const text = doHarvest(view.plot, ok);
                        setView({ ...view, picked: k, text });
                      }}>
                      {o}
                    </button>
                  );
                })}
              </div>
              {view.picked !== undefined && (
                <div className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-bold leading-snug text-ink">
                  {view.picked === view.quiz.answer ? '⭕ せいかい！ おまけで 1つ ふえたよ。' : '❌ ざんねん。でも しゅうかくは できたよ。'}
                  <div className="mt-1 text-indigo-900/70">{view.quiz.why}</div>
                  {view.text && <div className="mt-1 text-emerald-800">{view.text}</div>}
                </div>
              )}
            </div>
          )}
          <button className="btn mt-3" onClick={() => setView(null)}>{view.kind === 'quiz' && view.picked === undefined ? 'やめる' : 'もどる'}</button>
        </div>
      </div>
    );
  }

  const dexN = g.save.farm.dex.length;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[88vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex-1 text-[14px] font-black text-ink">🌱 はたけ</div>
          <button className={`rounded-full px-3 py-1 text-[11px] font-black ${tab === 'plots' ? 'bg-emerald-500 text-white' : 'bg-white text-ink shadow'}`} onClick={() => setTab('plots')}>うね</button>
          <button className={`rounded-full px-3 py-1 text-[11px] font-black ${tab === 'dex' ? 'bg-emerald-500 text-white' : 'bg-white text-ink shadow'}`} onClick={() => setTab('dex')}>📖 ずかん {dexN}/{PLANTS.length}</button>
        </div>

        {tab === 'dex' ? (
          <div>
            <div className="mb-2 text-[11px] font-bold text-indigo-900/60">
              しゅうかくした しょくぶつが のるよ。{PLANT_REWARDS.map((r) => `${r.kinds}しゅるいで ${ITEM_BY_ID[r.item].emoji}`).join('・')}
            </div>
            <div className="flex flex-col gap-2">
              {PLANTS.map((p) => {
                const known = g.save.farm.dex.includes(p.seed);
                if (!known) {
                  return (
                    <div key={p.seed} className="rounded-2xl bg-gray-100 px-3 py-2 text-[12px] font-black text-gray-400">
                      ❓ ？？？{ITEM_BY_ID[p.seed]?.season ? `（${ITEM_BY_ID[p.seed].season}月の たね）` : ''}
                    </div>
                  );
                }
                return (
                  <div key={p.seed} className="rounded-2xl bg-emerald-50 px-3 py-2">
                    <div className="text-[13px] font-black text-ink">
                      {p.emoji} {p.name} {g.save.farm.flowers.includes(p.seed) && <span className="text-[10px] text-emerald-700">🔍はな かんさつずみ</span>}
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10.5px] font-bold text-indigo-900/80">
                      <div>🌰 {p.endosperm === null ? 'たねで なく ' + p.grows : p.endosperm ? 'はいにゅう あり' : 'はいにゅう なし'}</div>
                      <div>🌱 子葉 {p.cotyledons ? `${p.cotyledons}まい${p.epigeal ? '' : '（地上に でない）'}` : '—'}</div>
                      <div>🌡️ はつが {p.temp[0]}〜{p.temp[1]}℃{p.lightGerm ? '・光が いる' : ''}</div>
                      <div>🍚 ようぶん：{p.nutrient}</div>
                      <div className="col-span-2">🌼 花粉：{POLLEN_LABEL[p.pollen]}</div>
                    </div>
                    <ul className="mt-1 text-[10.5px] font-bold leading-snug text-emerald-900">
                      {p.facts.map((f) => <li key={f}>・{f}</li>)}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-2 text-[11px] font-bold leading-snug text-indigo-900/60">
              たねを うえて 💧みずを あげよう。クイズを 5もん やった日に そだつよ（はつが → ほんば → はな → しゅうかく）。
              {studied ? ' きょうは もう そだったよ！' : ' きょうは まだ クイズを していないよ。'}
              <span className="ml-1">🌡️ いまの きおん やく{MONTH_TEMP[month]}℃</span>
            </div>
            <div className="flex flex-col gap-2">
              {g.save.farm.plots.map((plot, i) => {
                const p = plantOf(plot);
                const st = plot ? stages[i] : 0;
                const ripe = isRipe(plot, st);
                const last = plot ? ripeStage(plot) : GROW_DAYS;
                const h = plot && st >= 1 ? healthOf(plot) : null;
                const needWater = plot?.fert?.includes('k') ? 1 : 2;
                return (
                  <div key={i} className="rounded-2xl bg-amber-50 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{!plot ? '🟫' : ripe || st === 0 ? ITEM_BY_ID[plot.seed]?.emoji : st === 3 && p ? '🌼' : '🌱'}</div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-black text-ink">
                          {plot
                            ? `${p ? p.name : ITEM_BY_ID[plot.seed]?.name ?? ''}：${p ? PLANT_STAGE_NAME[Math.min(st, PLANT_DAYS)] : STAGE_NAME[Math.min(st, GROW_DAYS)]}${plot.box ? '（📦はこの中）' : ''}`
                            : `うね ${i + 1}（あいてるよ）`}
                        </div>
                        {plot && !ripe && (
                          <div className="mt-1 flex gap-1">
                            {Array.from({ length: last }, (_, k) => (
                              <span key={k} className={`h-2 flex-1 rounded-full ${k < st ? 'bg-emerald-400' : 'bg-amber-200'}`} />
                            ))}
                          </div>
                        )}
                      </div>
                      {plot && (ripe ? (
                        <button className="shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 px-3 py-2 text-[12px] font-black text-white shadow active:scale-95" onClick={() => startHarvest(i, p)}>🧺 しゅうかく</button>
                      ) : p?.paddy ? (
                        <span className="shrink-0 rounded-xl bg-sky-100 px-2 py-1.5 text-[11px] font-black text-sky-700">🌊 たんぼ</span>
                      ) : (
                        <button
                          className={`shrink-0 rounded-xl px-3 py-2 text-[12px] font-black active:scale-95 ${plot.watered === today ? 'bg-gray-100 text-gray-400' : 'bg-sky-500 text-white shadow'}`}
                          disabled={plot.watered === today}
                          onClick={() => water(i)}
                        >
                          {plot.watered === today ? '💧 あげたよ' : '💧 みずやり'}
                        </button>
                      ))}
                    </div>

                    {plot && p && (
                      <>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {st === 0 ? (
                            <>
                              <Chip ok={!!plot.wetAt}>💧 みず</Chip>
                              <Chip ok>🌬️ くうき</Chip>
                              <Chip ok={tempOk(p) ? true : 'slow'}>🌡️ おんど{tempOk(p) ? '' : '（ゆっくり）'}</Chip>
                            </>
                          ) : h && (
                            <>
                              <Chip ok={h.water}>💧 みず {p.paddy ? 'たんぼ' : `${Math.min(plot.wetDays ?? 0, needWater)}/${needWater}日`}</Chip>
                              <Chip ok>🌬️ くうき</Chip>
                              <Chip ok>🌡️ おんど</Chip>
                              <Chip ok={h.sun}>☀️ 日光{h.sun ? '' : '（はこ）'}</Chip>
                              <Chip ok={h.fert}>🧪 ひりょう{(plot.fert ?? []).map((f) => FERT_INFO[f].emoji).join('')}</Chip>
                            </>
                          )}
                        </div>
                        <div className="mt-1 text-[11px] font-bold leading-snug text-indigo-900/70">{stageTip(p, st, plot)}</div>
                        {h && !ripe && (!h.sun || !h.fert || !h.water) && (
                          <div className="mt-0.5 text-[10.5px] font-bold text-rose-700">
                            {!h.sun && '日光が ないと 葉が 黄いろく、くきが ひょろひょろ のびるよ。'}
                            {!h.fert && 'ひりょうが ないと 葉が 小さく すくないよ。'}
                            {!h.water && 'みずが たりなくて しおれ ぎみ。'}
                          </div>
                        )}
                        {!ripe && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {st === 0 && (
                              <button className="rounded-xl bg-white px-2.5 py-1.5 text-[11px] font-black text-ink shadow active:scale-95" onClick={() => setView({ kind: 'seed', plot: i, p })}>
                                {p.type === 'tuber' || p.type === 'bulb' ? '✂️ きって みる' : '✂️ たねを きって みる'}
                              </button>
                            )}
                            {st === 3 && (
                              <button className="rounded-xl bg-white px-2.5 py-1.5 text-[11px] font-black text-ink shadow active:scale-95" onClick={() => setView({ kind: 'flower', plot: i, p })}>
                                🔍 はなを しらべる{g.save.farm.flowers.includes(p.seed) ? ' ✓' : ''}
                              </button>
                            )}
                            {ferts.map((f) => (
                              <button key={f.id} className="rounded-xl bg-lime-100 px-2.5 py-1.5 text-[11px] font-black text-lime-900 shadow active:scale-95" onClick={() => fert(i, f.id)}>
                                {f.emoji} {FERT_INFO[FERT_OF[f.id]].name} ×{g.save.inventory[f.id]}
                              </button>
                            ))}
                            {st >= 1 && (
                              <button className="rounded-xl bg-white px-2.5 py-1.5 text-[11px] font-black text-ink shadow active:scale-95" onClick={() => g.toggleBox(i)}>
                                {plot.box ? '📦 はこを はずす' : '📦 はこを かぶせる（じっけん）'}
                              </button>
                            )}
                            {!ferts.length && st >= 1 && (
                              <button className="text-[11px] font-black text-amber-700 underline" onClick={() => { onClose(); g.go('shop'); }}>🛒 ひりょうを かう</button>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {!plot && (
                      seeds.length ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {seeds.map((s) => (
                            <button key={s.id} className="rounded-xl bg-white px-2.5 py-1.5 text-[12px] font-black text-ink shadow active:scale-95" onClick={() => { g.plantSeed(i, s.id); g.showToast(`🌱 ${s.name}を うえたよ！${PLANT_BY_SEED[s.id] && !PLANT_BY_SEED[s.id].paddy ? ' みずを あげてね' : ''}`); }}>
                              {s.emoji} {s.name} ×{g.save.inventory[s.id]}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <button className="mt-2 text-[11px] font-black text-amber-700 underline" onClick={() => { onClose(); g.go('shop'); }}>
                          🛒 ショップの「🌱 たね」で かおう
                        </button>
                      )
                    )}
                    {plot && !p && ripe && <div className="mt-1 text-[11px] font-bold text-indigo-900/60">{CROP_COUNT}つ とれるよ</div>}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {!studied && tab === 'plots' && <a className="btn-main mt-3 block text-center no-underline" href="/">📚 クイズを して そだてる</a>}
        <button className="btn mt-2" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
