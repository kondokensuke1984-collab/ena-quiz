import { useCallback, useEffect, useRef } from 'react';

export type Axis = { x: number; y: number };

const KEYS: Record<string, [number, number]> = {
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
  W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0],
};

const DIRS: { key: string; dx: number; dy: number; label: string; cls: string }[] = [
  { key: 'up',    dx: 0,  dy: -1, label: '▲', cls: 'col-start-2 row-start-1' },
  { key: 'left',  dx: -1, dy: 0,  label: '◀', cls: 'col-start-1 row-start-2' },
  { key: 'right', dx: 1,  dy: 0,  label: '▶', cls: 'col-start-3 row-start-2' },
  { key: 'down',  dx: 0,  dy: 1,  label: '▼', cls: 'col-start-2 row-start-3' },
];

/**
 * 十字キー。押している間だけ axisRef を書きかえる。
 * React の state を使わないのは、毎フレーム再レンダーさせないため。
 */
export function DPad({ axisRef, onInput }: { axisRef: React.MutableRefObject<Axis>; onInput?: () => void }) {
  const held = useRef(new Set<string>());

  const recompute = useCallback(() => {
    let x = 0;
    let y = 0;
    for (const k of held.current) {
      const d = DIRS.find((v) => v.key === k);
      if (d) { x += d.dx; y += d.dy; }
    }
    axisRef.current = { x, y };
    if (x || y) onInput?.();
  }, [axisRef, onInput]);

  const press = (key: string) => { held.current.add(key); recompute(); };
  const release = (key: string) => { held.current.delete(key); recompute(); };

  // キーボードでも歩けるようにする（PCで動作確認するときに楽）
  useEffect(() => {
    const dirOf = (e: KeyboardEvent) => {
      const v = KEYS[e.key];
      if (!v) return null;
      return DIRS.find((d) => d.dx === v[0] && d.dy === v[1])?.key ?? null;
    };
    const down = (e: KeyboardEvent) => { const k = dirOf(e); if (k) { e.preventDefault(); press(k); } };
    const up = (e: KeyboardEvent) => { const k = dirOf(e); if (k) release(k); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recompute]);

  // 指が離れたのを取りこぼさないよう、ウィンドウ全体の pointerup も見る
  useEffect(() => {
    const clear = () => { held.current.clear(); recompute(); };
    window.addEventListener('pointerup', clear);
    window.addEventListener('pointercancel', clear);
    return () => {
      window.removeEventListener('pointerup', clear);
      window.removeEventListener('pointercancel', clear);
    };
  }, [recompute]);

  return (
    <div className="grid h-[132px] w-[132px] grid-cols-3 grid-rows-3 gap-1 select-none">
      {DIRS.map((d) => (
        <button
          key={d.key}
          className={`${d.cls} flex items-center justify-center rounded-2xl border-2 border-white/25 bg-white/15 text-lg font-black text-white backdrop-blur active:bg-white/35`}
          onPointerDown={(e) => { e.preventDefault(); press(d.key); }}
          onPointerUp={() => release(d.key)}
          onPointerLeave={() => release(d.key)}
          aria-label={d.key}
        >
          {d.label}
        </button>
      ))}
      <div className="col-start-2 row-start-2 flex items-center justify-center rounded-xl bg-white/10 text-[10px] font-extrabold text-white/50">
        あるく
      </div>
    </div>
  );
}
