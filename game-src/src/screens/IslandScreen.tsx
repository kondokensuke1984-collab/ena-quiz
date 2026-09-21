import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Shell, HpBar } from '../components/Shell';
import { DPad, type Axis } from '../components/DPad';
import { IslandGround } from '../components/IslandStage';
import { KidSVG, PALETTES } from '../components/KidSVG';
import { CharSVG } from '../components/CharSVG';
import { EggSVG } from '../components/EggSVG';
import { FurnitureSVG } from '../components/FurnitureSVG';
import { useGame } from '../state/useGame';
import { CHAR_NAMES } from '../lib/chars';
import { ITEM_BY_ID, ITEMS } from '../lib/items';
import {
  BOUNDS, ISLAND_H, ISLAND_W, MONSTER_SPEED, PLAYER_SPEED,
  clampToIsland, dist, isNear, stepByAxis, stepToward, wanderTarget,
} from '../lib/island';
import { displayFullness, levelOf, mood, moodLine } from '../lib/monster';
import type { Pos } from '../types';

const SAVE_DEBOUNCE = 600;
const MAX_DT = 0.05; // タブ復帰で瞬間移動しないように、1フレームの進みを上限で止める

type Mode = { kind: 'walk' } | { kind: 'place'; itemId: string } | { kind: 'move'; uid: string };

export function IslandScreen() {
  const g = useGame();
  const { save, now } = g;
  const monster = save.monster;

  const stageRef = useRef<SVGSVGElement | null>(null);
  const playerNodeRef = useRef<SVGGElement | null>(null);
  const monsterNodeRef = useRef<SVGGElement | null>(null);

  const playerPos = useRef<Pos>(save.pos);
  const monsterPos = useRef<Pos>(monster.pos);
  const monsterTarget = useRef<Pos>(monster.wander);
  const axis = useRef<Axis>({ x: 0, y: 0 });
  const tapTarget = useRef<Pos | null>(null);
  const flip = useRef(false);
  const walkPhase = useRef(0);
  const dirtyAt = useRef(0);

  const [mode, setMode] = useState<Mode>({ kind: 'walk' });
  const [feedOpen, setFeedOpen] = useState(false);
  const [order, setOrder] = useState('');
  const [walking, setWalking] = useState(false);

  const fullness = displayFullness(monster, now);
  const mo = mood(monster, now);
  const level = levelOf(monster.exp);
  const monsterName = monster.charKey ? CHAR_NAMES[monster.charKey] : 'たまご';
  const playerName = save.player ? PALETTES[save.player].name : '';

  const foods = useMemo(
    () => ITEMS.filter((i) => (i.kind === 'food' || i.kind === 'snack') && (save.inventory[i.id] ?? 0) > 0),
    [save.inventory],
  );
  const unplaced = useMemo(
    () => save.owned.filter((id) => ITEM_BY_ID[id]?.kind === 'furniture' && !save.placed.some((p) => p.id === id)),
    [save.owned, save.placed],
  );

  // ★ループから参照するものは ref に逃がす。
  //   これらを useEffect の依存に入れると、保存→再レンダー→ループ再起動→保存… の無限ループになる。
  const gRef = useRef(g);
  gRef.current = g;
  const stageRefState = useRef({ eggStage: monster.stage === 'egg', placed: save.placed });
  stageRefState.current = { eggStage: monster.stage === 'egg', placed: save.placed };
  const committed = useRef<{ p: Pos; m: Pos } | null>(null);

  // セーブ中の位置が外から変わった場合（他タブ・リセット）だけ追従する。
  // 自分で保存した値なら何もしない（ループと取り合いにならないように）
  useEffect(() => {
    if (committed.current && committed.current.p === save.pos) return;
    playerPos.current = clampToIsland(save.pos);
  }, [save.pos]);
  useEffect(() => {
    if (committed.current && committed.current.m === monster.pos) return;
    monsterPos.current = clampToIsland(monster.pos);
    monsterTarget.current = clampToIsland(monster.wander);
  }, [monster.pos, monster.wander]);

  const commit = useCallback(() => {
    const p = playerPos.current;
    const m = monsterPos.current;
    committed.current = { p, m };
    gRef.current.setPos(p);
    gRef.current.setMonsterPos(m, monsterTarget.current);
  }, []);

  // ── メインループ。座標は ref のまま DOM に直接書くので、毎フレームの再レンダーはしない ──
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastOrder = '';

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, MAX_DT);
      last = t;

      // 主人公
      const a = axis.current;
      let moved = false;
      if (a.x || a.y) {
        tapTarget.current = null;
        const next = stepByAxis(playerPos.current, a.x, a.y, PLAYER_SPEED, dt);
        moved = next.x !== playerPos.current.x || next.y !== playerPos.current.y;
        if (a.x !== 0) flip.current = a.x < 0;
        playerPos.current = next;
      } else if (tapTarget.current) {
        const before = playerPos.current;
        const { pos, arrived } = stepToward(before, tapTarget.current, PLAYER_SPEED, dt);
        if (pos.x !== before.x) flip.current = pos.x < before.x;
        moved = pos.x !== before.x || pos.y !== before.y;
        playerPos.current = pos;
        if (arrived) tapTarget.current = null;
      }

      // モンスターは数秒おきに近くをうろうろする
      if (!stageRefState.current.eggStage) {
        const { pos, arrived } = stepToward(monsterPos.current, monsterTarget.current, MONSTER_SPEED, dt);
        monsterPos.current = pos;
        if (arrived && Math.random() < 0.012) monsterTarget.current = wanderTarget(pos);
      }

      // 安全網。なにがあっても島の外には出さない
      playerPos.current = clampToIsland(playerPos.current);
      monsterPos.current = clampToIsland(monsterPos.current);

      if (moved) {
        walkPhase.current += dt * 11;
        dirtyAt.current = t;
      }

      // DOM に反映
      const bob = moved ? Math.abs(Math.sin(walkPhase.current)) * 7 : 0;
      if (playerNodeRef.current) {
        playerNodeRef.current.setAttribute(
          'transform',
          `translate(${playerPos.current.x * ISLAND_W} ${playerPos.current.y * ISLAND_H - bob}) scale(${flip.current ? -1 : 1} 1)`,
        );
      }
      if (monsterNodeRef.current) {
        monsterNodeRef.current.setAttribute(
          'transform',
          `translate(${monsterPos.current.x * ISLAND_W} ${monsterPos.current.y * ISLAND_H})`,
        );
      }

      // 前後関係（Yソート）は、並び順が変わったときだけ React に作り直させる
      const key = [
        ...stageRefState.current.placed.map((p) => [p.y, p.uid] as const),
        [monsterPos.current.y, '@monster'] as const,
        [playerPos.current.y, '@player'] as const,
      ].sort((x, y) => x[0] - y[0]).map(([, id]) => id).join(',');
      if (key !== lastOrder) { lastOrder = key; setOrder(key); }

      setWalking((w) => (w === moved ? w : moved));

      // 止まってしばらくしたら、まとめて保存する
      if (dirtyAt.current && t - dirtyAt.current > SAVE_DEBOUNCE) {
        dirtyAt.current = 0;
        commit();
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      commit();
    };
    // ★依存は空。中で使う可変な値はすべて ref から読む
  }, [commit]);

  // 島のタップ。歩く／置く／動かす のモードで意味が変わる
  const onStagePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = stageRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const p = clampToIsland({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });

    if (mode.kind === 'place') {
      g.placeFurniture(mode.itemId, p.x, p.y);
      setMode({ kind: 'walk' });
      g.showToast(`${ITEM_BY_ID[mode.itemId]?.emoji ?? ''} おいたよ！`);
      return;
    }
    if (mode.kind === 'move') {
      g.moveFurniture(mode.uid, p.x, p.y);
      setMode({ kind: 'walk' });
      g.showToast('うごかしたよ！');
      return;
    }
    tapTarget.current = p;
  };

  const nearMonster = isNear(playerPos.current, monsterPos.current);
  const nearFurniture = save.placed.find((p) => dist(playerPos.current, { x: p.x, y: p.y }) <= 0.1);

  const entities = useMemo(() => {
    const list: { id: string; y: number; node: React.ReactNode }[] = save.placed.map((p) => ({
      id: p.uid,
      y: p.y,
      node: (
        <g key={p.uid} transform={`translate(${p.x * ISLAND_W} ${p.y * ISLAND_H})`}>
          <FurnitureSVG id={p.id} scale={1.9} />
        </g>
      ),
    }));

    list.push({
      id: '@monster',
      y: monsterPos.current.y,
      node: (
        <g key="@monster" ref={monsterNodeRef} transform={`translate(${monsterPos.current.x * ISLAND_W} ${monsterPos.current.y * ISLAND_H})`}>
          <foreignObject x={-64} y={-128} width={128} height={150} style={{ overflow: 'visible', pointerEvents: 'none' }}>
            <div className="flex h-full w-full items-end justify-center">
              {monster.charKey ? (
                <CharSVG
                  charKey={monster.charKey}
                  level={level}
                  fillPct={fullness / 100}
                  size={112}
                  silhouette={mo === 'down'}
                  stars={save.titles.length}
                  label={monsterName}
                />
              ) : (
                <EggSVG size={96} />
              )}
            </div>
          </foreignObject>
          {(mo === 'hungry' || mo === 'down') && (
            <text x="34" y="-104" fontSize="34" textAnchor="middle">{mo === 'down' ? '💤' : '💭'}</text>
          )}
        </g>
      ),
    });

    list.push({
      id: '@player',
      y: playerPos.current.y,
      node: (
        <g key="@player" ref={playerNodeRef} transform={`translate(${playerPos.current.x * ISLAND_W} ${playerPos.current.y * ISLAND_H})`}>
          <foreignObject x={-60} y={-132} width={120} height={144} style={{ overflow: 'visible', pointerEvents: 'none' }}>
            <div className="flex h-full w-full items-end justify-center">
              {save.player && (
                <KidSVG
                  who={save.player}
                  size={104}
                  walking={walking}
                  hat={save.equipped.hat === 'ht_crown' ? 'crown' : save.equipped.hat === 'ht_cap' ? 'cap' : null}
                  ribbon={save.equipped.costume === 'cs_ribbon'}
                />
              )}
            </div>
          </foreignObject>
        </g>
      ),
    });

    return list.sort((a, b) => a.y - b.y).map((e) => e.node);
    // order が変わったときに並べ直す
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, save.placed, save.player, save.equipped, save.titles.length, monster.charKey, level, fullness, mo, monsterName, walking]);

  return (
    <Shell title={`🏝 アンリノ島`} sub={playerName ? `${playerName}の しま` : undefined}>
      {/* ── ステータス ── */}
      <div className="panel mb-2.5 !py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-black text-ink">
              {monster.stage === 'egg' ? '🥚 たまご' : `${monsterName}　Lv.${level}`}
            </div>
            <div className="truncate text-[11px] font-bold text-indigo-900/60">{moodLine(monster, monsterName, now)}</div>
          </div>
          <div className="w-28 shrink-0">
            <div className="mb-1 text-right text-[10px] font-extrabold text-amber-600">まんぷく {fullness}%</div>
            <HpBar value={fullness} max={100} tone="food" />
          </div>
        </div>
      </div>

      {/* ── 島 ── */}
      <div className="relative overflow-hidden rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,.3)]">
        <svg
          ref={stageRef}
          className="island-stage block w-full"
          viewBox={`0 0 ${ISLAND_W} ${ISLAND_H}`}
          onPointerDown={onStagePointerDown}
        >
          <IslandGround />
          {mode.kind !== 'walk' && (
            <rect
              x={BOUNDS.minX * ISLAND_W}
              y={BOUNDS.minY * ISLAND_H}
              width={(BOUNDS.maxX - BOUNDS.minX) * ISLAND_W}
              height={(BOUNDS.maxY - BOUNDS.minY) * ISLAND_H}
              fill="rgba(255,255,255,0.22)"
              stroke="#fff"
              strokeDasharray="12 10"
              strokeWidth="4"
              rx="40"
            />
          )}
          {entities}
        </svg>

        {mode.kind !== 'walk' && (
          <div className="pointer-events-none absolute inset-x-0 top-2 text-center text-[12px] font-black text-white drop-shadow">
            {mode.kind === 'place' ? 'おきたい ばしょを タップ' : 'うごかす さきを タップ'}
          </div>
        )}
      </div>

      {/* ── そうさ ── */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <DPad axisRef={axis} onInput={() => { tapTarget.current = null; }} />

        <div className="flex min-w-0 flex-1 flex-col items-end gap-2">
          {mode.kind !== 'walk' ? (
            <button className="btn !w-auto !py-2 text-[12px]" onClick={() => setMode({ kind: 'walk' })}>
              ✕ やめる
            </button>
          ) : nearMonster ? (
            <button
              className="flex h-[84px] w-[84px] flex-col items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[12px] font-black text-white shadow-xl active:scale-95"
              onClick={() => (monster.stage === 'egg' || foods.length ? setFeedOpen(true) : g.showToast('ごはんが ないよ。ショップで かおう', 'ng'))}
            >
              <span className="text-2xl">🍚</span>
              ごはん
            </button>
          ) : nearFurniture ? (
            <div className="flex gap-2">
              <button className="btn !w-auto !py-2 text-[12px]" onClick={() => setMode({ kind: 'move', uid: nearFurniture.uid })}>
                ↔️ うごかす
              </button>
              <button className="btn !w-auto !py-2 text-[12px]" onClick={() => { g.storeFurniture(nearFurniture.uid); g.showToast('しまったよ'); }}>
                📦 しまう
              </button>
            </div>
          ) : (
            <div className="max-w-[190px] rounded-2xl bg-white/10 px-3 py-2 text-right text-[11px] font-bold leading-snug text-indigo-100/70">
              {monster.stage === 'egg'
                ? 'たまごに ちかづいて ごはんを あげよう'
                : `${monsterName}に ちかづくと なにかできるよ`}
            </div>
          )}
        </div>
      </div>

      {/* ── 置ける家具のトレイ ── */}
      {unplaced.length > 0 && (
        <div className="panel mt-3 !py-3">
          <div className="mb-2 text-[12px] font-black text-ink">🌴 しまに おける かぐ</div>
          <div className="flex flex-wrap gap-2">
            {unplaced.map((id) => {
              const it = ITEM_BY_ID[id];
              return (
                <button
                  key={id}
                  onClick={() => setMode({ kind: 'place', itemId: id })}
                  className="flex items-center gap-1.5 rounded-xl border-2 border-line px-3 py-2 text-[12px] font-extrabold text-ink active:scale-95"
                >
                  <span>{it.emoji}</span>
                  {it.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {save.titles.length > 0 && (
        <div className="panel mt-3 !py-3">
          <div className="mb-1.5 text-[12px] font-black text-ink">🏅 しょうごう</div>
          <div className="flex flex-wrap gap-1.5">
            {save.titles.map((t) => (
              <span key={t} className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-extrabold text-amber-800">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── ごはんを えらぶ ── */}
      {feedOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={() => setFeedOpen(false)}>
          <div className="panel w-full max-w-[440px]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 text-[14px] font-black text-ink">🍚 なにを あげる？</div>
            {foods.length === 0 ? (
              <p className="py-3 text-center text-[12px] font-bold text-indigo-900/60">
                ごはんが ないよ。ショップで かってきてね
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {foods.map((it) => (
                  <button
                    key={it.id}
                    className="btn flex items-center gap-2"
                    onClick={() => { g.feedMonster(it.id); setFeedOpen(false); }}
                  >
                    <span className="text-xl">{it.emoji}</span>
                    <span className="flex-1 text-left">
                      {it.name}
                      <span className="ml-1 text-[11px] font-bold text-indigo-900/50">{it.desc}</span>
                    </span>
                    <span className="text-[12px] font-black text-indigo-500">×{save.inventory[it.id]}</span>
                  </button>
                ))}
              </div>
            )}
            <button className="btn-main mt-3" onClick={() => setFeedOpen(false)}>とじる</button>
          </div>
        </div>
      )}
    </Shell>
  );
}
