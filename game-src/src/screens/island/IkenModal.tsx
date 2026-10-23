// 🗳️ いけんばこ（かく・みんなの いけんを よむ・おうちの人が けす）

import { useEffect, useState } from 'react';
import { KidSVG, PALETTES } from '../../components/KidSVG';
import { IKEN_MAX, deleteIken, ikenDate, loadIken, postIken, type Iken } from '../../lib/iken';
import { sfx } from '../../lib/sound';
import { useGame } from '../../state/useGame';

export function IkenModal({ onClose }: { onClose: () => void }) {
  const g = useGame();
  const me = g.save.player;
  const [items, setItems] = useState<Iken[] | null>(null);
  const [loadErr, setLoadErr] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');
  const [parent, setParent] = useState(false);   // おうちの人の「けす」ボタンを出す

  useEffect(() => {
    let alive = true;
    loadIken().then((x) => alive && setItems(x)).catch(() => alive && setLoadErr(true));
    return () => { alive = false; };
  }, []);

  const len = [...text.trim()].length;

  async function send() {
    if (sending || !len) return;
    setSending(true); setErr('');
    try {
      const item = await postIken(me, text);
      setItems((xs) => [item, ...(xs ?? [])]);
      setText('');
      sfx('letter');
      g.showToast('🗳️ いけんを いれたよ！ みんなが よめるよ');
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  async function remove(it: Iken) {
    if (!confirm(`この いけんを けしますか？\n\n「${it.text}」`)) return;
    if (await deleteIken(it.id)) setItems((xs) => (xs ?? []).filter((x) => x.id !== it.id));
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[85vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="text-[14px] font-black text-ink">🗳️ いけんばこ</div>
        <p className="mt-0.5 text-[11px] font-bold leading-snug text-indigo-900/60">
          しまや クイズへの「こうしてほしい」「これ たのしい！」を かいてね。いれると みんなが よめるよ。
          なまえや がっこう、すんでいる ところは かかないでね。
        </p>

        <textarea
          className="mt-2 w-full resize-none rounded-2xl border-2 border-indigo-200 bg-white px-3 py-2 text-[13px] font-bold text-ink outline-none focus:border-amber-400"
          rows={3}
          maxLength={IKEN_MAX + 20}
          placeholder="れい：つりの さかなを もっと ふやして！"
          value={text}
          onChange={(e) => { setText(e.target.value); setErr(''); }}
        />
        <div className="flex items-center gap-2">
          <span className={`text-[10.5px] font-bold ${len > IKEN_MAX ? 'text-rose-500' : 'text-indigo-900/50'}`}>{len}/{IKEN_MAX}</span>
          {err && <span className="text-[11px] font-black text-rose-500">{err}</span>}
          <button
            className="btn-main ml-auto !w-auto px-5 disabled:opacity-40"
            disabled={sending || !len || len > IKEN_MAX}
            onClick={send}
          >
            {sending ? 'いれているよ…' : '🗳️ いれる'}
          </button>
        </div>

        <div className="mt-3 text-[12px] font-black text-ink">📋 みんなの いけん</div>
        {loadErr ? (
          <p className="py-3 text-center text-[12px] font-bold text-indigo-900/60">いまは よめないみたい。あとで また ひらいてね</p>
        ) : !items ? (
          <p className="py-3 text-center text-[12px] font-bold text-indigo-900/60">よみこみ ちゅう…</p>
        ) : items.length === 0 ? (
          <p className="py-3 text-center text-[12px] font-bold text-indigo-900/60">まだ ないよ。さいしょの いけんを かいてみよう！</p>
        ) : (
          <div className="mt-1 flex flex-col gap-1.5">
            {items.map((it) => (
              <div key={it.id} className="flex items-start gap-2 rounded-2xl bg-amber-50 px-2.5 py-2">
                <div className="shrink-0">
                  {it.who ? <KidSVG who={it.who} size={34} /> : <span className="inline-block w-[34px] text-center text-xl">🙂</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10.5px] font-bold text-indigo-900/50">
                    {it.who ? PALETTES[it.who].name : 'だれか'}・{ikenDate(it.t)}
                  </div>
                  <div className="whitespace-pre-line break-words text-[12.5px] font-bold leading-snug text-ink">{it.text}</div>
                </div>
                {parent && (
                  <button className="shrink-0 rounded-full bg-rose-500 px-2 py-1 text-[11px] font-black text-white active:scale-95" onClick={() => remove(it)}>
                    けす
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <button className="btn-main mt-3" onClick={onClose}>とじる</button>
        <button className="mt-2 block w-full text-center text-[10.5px] font-bold text-indigo-900/40 underline" onClick={() => setParent((v) => !v)}>
          {parent ? 'おうちの人の そうさを おわる' : '👪 おうちの人：いけんを けす'}
        </button>
      </div>
    </div>
  );
}
