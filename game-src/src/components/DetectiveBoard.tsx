import { useState } from 'react';
import { checkPuzzle, type Puzzle } from '../lib/detective';
import { sfx } from '../lib/sound';

// すいりボード：テキストと おなじ ○×表。タップで 空 → ○ → × → 空。
// assign / rank：○を いれた 行と 列の ほかの マスに、うすい × を ほじょで 見せる（こたえには かぞえない）。
// league：○を いれると あいての マスに ×（反対も おなじ）。ななめの マスは つかわない。

const MARK = ['', '○', '×'];

export function DetectiveBoard({ puzzle, onSolved }: { puzzle: Puzzle; onSolved(): void }) {
  const n = puzzle.kind === 'league' ? puzzle.teams.length : puzzle.rows.length;
  const m = puzzle.kind === 'league' ? puzzle.teams.length : puzzle.cols.length;
  const [cells, setCells] = useState<number[][]>(() => Array.from({ length: n }, () => Array(m).fill(0)));
  const [shake, setShake] = useState(0);
  const [msg, setMsg] = useState('');

  const rowLabels = puzzle.kind === 'league' ? puzzle.teams : puzzle.rows;
  const colLabels = puzzle.kind === 'league' ? puzzle.teams : puzzle.cols;

  const tap = (r: number, c: number) => {
    if (puzzle.kind === 'league' && r === c) return;
    setMsg('');
    setCells((prev) => {
      const next = prev.map((row) => [...row]);
      const v = (next[r][c] + 1) % 3;
      next[r][c] = v;
      if (puzzle.kind === 'league') next[c][r] = v === 1 ? 2 : v === 2 ? 1 : 0;
      return next;
    });
  };

  // ○の ある 行・列（ほじょの ×）
  const rowHasO = cells.map((row) => row.includes(1));
  const colHasO = Array.from({ length: m }, (_, c) => cells.some((row) => row[c] === 1));

  const check = () => {
    if (checkPuzzle(puzzle, cells)) {
      onSolved();
    } else {
      sfx('ng');
      setShake((k) => k + 1);
      setMsg(puzzle.kind === 'league' ? 'どこかが ちがうみたい…。ぜんぶの しあいに ○か ×が はいってる？' : 'どこかが ちがうみたい…。1つの 行に ○は 1つだけ だよ。');
    }
  };

  const wins = puzzle.kind === 'league' ? cells.map((row) => row.filter((v) => v === 1).length) : [];
  const losses = puzzle.kind === 'league' ? cells.map((row) => row.filter((v) => v === 2).length) : [];

  return (
    <div>
      <div className="mb-1 text-[14px] font-black text-amber-200">🧩 {puzzle.title}</div>
      <div className="mb-2 rounded-xl bg-white/10 px-3 py-2 text-[12px] font-bold leading-relaxed text-white">
        <div className="text-[11px] text-indigo-200">{puzzle.rule}</div>
        {puzzle.clues.map((c) => <div key={c}>{c}</div>)}
      </div>
      <div key={shake} className={`overflow-x-auto ${shake ? 'dt-shake' : ''}`}>
        <table className="mx-auto border-collapse text-center">
          <thead>
            <tr>
              <th className="p-1" />
              {colLabels.map((c) => (
                <th key={c} className="min-w-[44px] px-1 py-1 text-[12px] font-black text-amber-100">{c}</th>
              ))}
              {puzzle.kind === 'league' && <th className="px-1 text-[11px] font-black text-amber-100">かち</th>}
            </tr>
          </thead>
          <tbody>
            {rowLabels.map((rl, r) => (
              <tr key={rl}>
                <th className="whitespace-nowrap px-1.5 text-right text-[12px] font-black text-amber-100">{rl}</th>
                {colLabels.map((_, c) => {
                  const v = cells[r][c];
                  const diag = puzzle.kind === 'league' && r === c;
                  const ghost = !diag && v === 0 && puzzle.kind !== 'league' && (rowHasO[r] || colHasO[c]);
                  return (
                    <td key={c} className="p-0.5">
                      <button
                        disabled={diag}
                        onClick={() => tap(r, c)}
                        className={`h-11 w-11 rounded-lg border-2 text-[22px] font-black leading-none active:scale-90 ${
                          diag ? 'border-white/10 bg-[linear-gradient(135deg,transparent_48%,rgba(255,255,255,0.35)_50%,transparent_52%)]'
                          : v === 1 ? 'border-rose-300 bg-rose-50 text-rose-500'
                          : v === 2 ? 'border-sky-300 bg-sky-50 text-sky-600'
                          : 'border-white/40 bg-white/90 text-slate-300'
                        }`}
                      >
                        {diag ? '' : v ? MARK[v] : ghost ? <span className="text-[16px] opacity-40">×</span> : ''}
                      </button>
                    </td>
                  );
                })}
                {puzzle.kind === 'league' && (
                  <td className="px-1 text-[11px] font-black text-amber-100">{wins[r]}しょう{losses[r]}はい</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-1 text-center text-[10.5px] font-bold text-indigo-200/80">
        マスを タップ：○ → × → けす{puzzle.kind === 'league' ? '（あいての マスは じどうで かわるよ）' : '（うすい ×は ほじょ）'}
      </div>
      {msg && <div className="mt-2 rounded-xl bg-rose-500/20 px-3 py-2 text-center text-[12px] font-black text-rose-100">{msg}</div>}
      <button className="btn-main mt-3" onClick={check}>🔍 かいけつ！</button>
    </div>
  );
}
