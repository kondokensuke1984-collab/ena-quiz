import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { parseNovelText, type Novel, type NovelPiece } from '../lib/novels';
import { NovelArt } from './novel/NovelArt';

// としょかんの よみもの：もくじ → 本文（語を タップで 意味）→ この話の ことば → クイズ → つぎの話。ごほうびは なし。しおりは save.novels。

function Pieces({ list, onWord }: { list: NovelPiece[]; onWord?(w: string): void }) {
  return (
    <>
      {list.map((p, i) => {
        if (p.t === 'text') return <span key={i}>{p.s}</span>;
        if (p.t === 'ruby') return <ruby key={i}>{p.s}<rt className="text-[0.5em] font-bold">{p.r}</rt></ruby>;
        const body = <Pieces list={p.body} />;
        if (!onWord) return <span key={i} className="font-black text-amber-700">{body}</span>;
        return (
          <button key={i} onClick={() => onWord(p.word)} className="mx-[1px] rounded bg-amber-100 px-[2px] font-black text-amber-800 underline decoration-amber-400 decoration-2 underline-offset-4">
            {body}
          </button>
        );
      })}
    </>
  );
}

function T({ s, onWord }: { s: string; onWord?(w: string): void }) {
  return <Pieces list={parseNovelText(s)} onWord={onWord} />;
}

function Quiz({ q, n, onPass }: { q: Novel['episodes'][number]['quiz'][number]; n: number; onPass(): void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const right = picked === q.answer;
  return (
    <div className="mt-3 rounded-2xl bg-sky-50 p-3">
      <div className="text-[12px] font-black text-sky-700">クイズ {n}</div>
      <p className="mt-1 text-[15px] font-bold leading-[2.1] text-ink"><T s={q.q} /></p>
      <div className="mt-2 space-y-2">
        {q.options.map((o, i) => {
          const on = picked === i;
          return (
            <button
              key={i}
              disabled={right}
              onClick={() => { setPicked(i); if (i === q.answer) onPass(); }}
              className={`btn !py-2 text-[14px] leading-[2] ${on ? (right ? '!border-emerald-500 !bg-emerald-50' : '!border-rose-400 !bg-rose-50') : ''}`}
            >
              <T s={o} />
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className={`mt-2 rounded-xl px-3 py-2 text-[13px] font-bold leading-[2] ${right ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
          {right ? <>⭕ せいかい！ <T s={q.why} /></> : '❌ おしい！もういちど えらんでみよう。'}
        </p>
      )}
    </div>
  );
}

export function NovelModal({ novel, onClose }: { novel: Novel; onClose(): void }) {
  const g = useGame();
  const mark = g.save.novels[novel.id] ?? { ep: 0, pos: 0, done: [] };
  const [ep, setEp] = useState<number | null>(null);  // null＝もくじ
  const [word, setWord] = useState<string | null>(null);
  const [passed, setPassed] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const restore = useRef(0);

  // 話を ひらいたら、しおりの いちへ（つぎの話なら 上へ）
  useEffect(() => {
    if (ep !== null && scroller.current) scroller.current.scrollTop = restore.current;
    restore.current = 0;
  }, [ep]);

  // アプリごと とじても のこるように、スクロールが とまったら しおりを はさむ
  const scrollTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(scrollTimer.current), []);
  const onScroll = () => {
    window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => { if (ep !== null) keepPlace(); }, 800);
  };

  const keepPlace = () => {
    if (ep !== null) g.markNovel(novel.id, { ep, pos: Math.round(scroller.current?.scrollTop ?? 0) });
  };
  const close = () => { keepPlace(); onClose(); };
  const openEp = (i: number, place = 0) => { restore.current = place; setPassed(0); setWord(null); setEp(i); g.markNovel(novel.id, { ep: i, pos: place }); };
  const toc = () => { keepPlace(); setWord(null); setEp(null); };

  const cur = ep === null ? null : novel.episodes[ep];
  const quizDone = !!cur && passed >= cur.quiz.length;

  useEffect(() => {
    if (ep !== null && quizDone) g.markNovel(novel.id, { done: ep });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ep, quizDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/70 sm:p-3">
      <div className="flex w-full max-w-[560px] flex-col overflow-hidden bg-[#fffdf5] sm:rounded-2xl">
        <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-3 py-2">
          {ep !== null && <button onClick={toc} className="shrink-0 rounded-lg bg-white px-2 py-1 text-[12px] font-black text-amber-800 shadow">📖 もくじ</button>}
          <div className="min-w-0 flex-1 truncate text-center text-[13px] font-black text-ink"><T s={cur ? cur.title : novel.title} /></div>
          <button onClick={close} className="shrink-0 rounded-lg bg-white px-2 py-1 text-[12px] font-black text-slate-600 shadow">とじる</button>
        </div>

        <div ref={scroller} onScroll={onScroll} className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
          {!cur && (
            <div>
              <NovelArt id={novel.cover} />
              <h2 className="text-center text-[22px] font-black leading-[2.2] text-ink"><T s={novel.title} /></h2>
              <p className="mt-1 text-[14px] font-bold leading-[2.1] text-slate-700"><T s={novel.about} /></p>
              <div className="mt-3 space-y-2">
                {novel.episodes.map((e, i) => (
                  <button key={i} onClick={() => openEp(i, mark.ep === i ? mark.pos : 0)} className="btn flex items-center justify-between !py-2 text-[15px] leading-[2]">
                    <span><T s={e.title} /></span>
                    <span className="ml-2 shrink-0 text-[12px] font-black">
                      {mark.done.includes(i) ? '✅' : mark.ep === i && mark.pos > 0 ? '🔖 つづき' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {cur && ep !== null && (
            <div key={ep}>
              <h2 className="my-2 text-[18px] font-black leading-[2.2] text-ink"><T s={cur.title} /></h2>
              {cur.paras.map((p, i) => (
                p.startsWith('@art:')
                  ? <NovelArt key={i} id={p.slice(5)} />
                  : <p key={i} className="mb-3 text-[16px] font-medium leading-[2.2] text-ink"><T s={p} onWord={setWord} /></p>
              ))}

              <div className="mt-6 rounded-2xl bg-amber-50 p-3">
                <div className="text-[14px] font-black text-amber-800">📝 この話の ことば</div>
                <dl className="mt-1">
                  {cur.words.map((w) => (
                    <div key={w} className="border-b border-amber-200 py-1.5 last:border-0">
                      <dt className="text-[14px] font-black text-amber-800">{w}</dt>
                      <dd className="text-[13px] font-bold leading-[2] text-slate-700"><T s={novel.words[w]} /></dd>
                    </div>
                  ))}
                </dl>
              </div>

              {cur.quiz.slice(0, passed + 1).map((q, i) => (
                <Quiz key={i} q={q} n={i + 1} onPass={() => setPassed((v) => Math.max(v, i + 1))} />
              ))}

              {quizDone && (ep < novel.episodes.length - 1
                ? <button className="btn-main mt-4 w-full" onClick={() => openEp(ep + 1)}>つぎの話へ ▶</button>
                : (
                  <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-center">
                    <div className="text-[15px] font-black text-emerald-800">🎉 さいごまで よんだよ！</div>
                    <button className="btn-main mt-2 w-full" onClick={toc}>もくじへ もどる</button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {word && (
          <div className="border-t-2 border-amber-300 bg-amber-50 px-4 py-3" onClick={() => setWord(null)}>
            <div className="flex items-start justify-between gap-2">
              <div className="text-[16px] font-black text-amber-800">{word}</div>
              <button className="shrink-0 text-[12px] font-black text-slate-500">✕ とじる</button>
            </div>
            <p className="mt-1 text-[14px] font-bold leading-[2] text-ink"><T s={novel.words[word] ?? ''} /></p>
          </div>
        )}
      </div>
    </div>
  );
}
