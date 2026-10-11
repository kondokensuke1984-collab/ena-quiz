// 📦 ひきつぎ：この端末の きろくを コードにして、べつの iPad で よみこむ（lib/transfer.ts）

import { useState } from 'react';
import { applyDump, exportCode, parseCode, summarize, transferSupported, type TransferSummary } from '../lib/transfer';
import { PALETTES } from './KidSVG';
import { sfx } from '../lib/sound';
import { useGame } from '../state/useGame';
import type { PlayerKey } from '../types';

type Step = 'menu' | 'out' | 'in' | 'confirm';

function fileName(): string {
  const d = new Date();
  return `anrino-hikitsugi-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.txt`;
}

function dateText(at: number): string {
  const d = new Date(at);
  return `${d.getMonth() + 1}がつ${d.getDate()}にち ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function TransferModal({ onClose, start = 'menu' }: { onClose: () => void; start?: 'menu' | 'in' }) {
  const g = useGame();
  const [step, setStep] = useState<Step>(start);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [sum, setSum] = useState<TransferSummary | null>(null);
  const [pending, setPending] = useState<Awaited<ReturnType<typeof parseCode>>>(null);

  const btn = 'w-full rounded-2xl px-3 py-3 text-[14px] font-black shadow active:scale-95 disabled:opacity-50';

  const make = async () => {
    setBusy(true); setErr('');
    try { setCode(await exportCode()); setStep('out'); }
    catch { setErr('コードを つくれなかった…'); }
    setBusy(false);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(code); sfx('coin'); g.showToast('📋 コピーしたよ'); }
    catch { setErr('コピーできなかった。したの もじを ながおしして コピーしてね'); }
  };

  const save = async () => {
    const file = new File([code], fileName(), { type: 'text/plain' });
    // iPad は「共有」から AirDrop・メッセージ・ファイルに おくれる
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'ANRINO ひきつぎコード' }); return; }
      catch (e) { if ((e as Error)?.name === 'AbortError') return; }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const readFile = async (f: File | undefined) => {
    if (!f) return;
    setCode(await f.text());
  };

  const check = async () => {
    setBusy(true); setErr('');
    const d = await parseCode(code);
    setBusy(false);
    if (!d) { sfx('ng'); setErr('ひきつぎコードでは ないみたい。さいごまで ぜんぶ はりつけたか たしかめてね'); return; }
    setPending(d); setSum(summarize(d)); setStep('confirm');
  };

  const apply = () => {
    if (!pending) return;
    if (!applyDump(pending)) { setErr('入りきらなかったので もとの きろくに もどしたよ（ようりょうが いっぱい かも）'); return; }
    location.reload();
  };

  const who = (p: string | null) => (p && PALETTES[p as PlayerKey]?.name) || 'だれか';

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[88vh] w-full max-w-[480px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 text-[16px] font-black text-ink">📦 ひきつぎ（べつの iPad へ うつす）</div>

        {!transferSupported() ? (
          <p className="text-[13px] font-bold text-ink">この ブラウザでは つかえないよ。iPad を さいしんに してね。</p>
        ) : step === 'menu' ? (
          <div className="space-y-2">
            <p className="mb-2 text-[12px] font-bold leading-relaxed text-ink/70">
              しま・クイズ・メダル・サッカーの きろくを ぜんぶ 1つの コードに するよ。あたらしい iPad で よみこむと つづきから あそべるよ。
            </p>
            <button className={`${btn} bg-amber-300 text-ink`} disabled={busy} onClick={make}>📤 コードを つくる（この iPad から）</button>
            <button className={`${btn} bg-sky-200 text-ink`} onClick={() => { setCode(''); setStep('in'); }}>📥 コードを よみこむ（この iPad へ）</button>
          </div>
        ) : step === 'out' ? (
          <div className="space-y-2">
            <p className="text-[12px] font-bold leading-relaxed text-ink/70">「ほぞん・おくる」で AirDrop や メッセージで あたらしい iPad に おくってね。</p>
            <button className={`${btn} bg-amber-300 text-ink`} onClick={save}>📨 ほぞん・おくる</button>
            <button className={`${btn} bg-white text-ink`} onClick={copy}>📋 コピー</button>
            <textarea readOnly value={code} className="h-24 w-full rounded-xl bg-indigo-50 p-2 font-mono text-[10px] text-ink" onFocus={(e) => e.currentTarget.select()} />
            <div className="text-right text-[11px] text-ink/50">{Math.ceil(code.length / 1000)}せん もじ</div>
          </div>
        ) : step === 'in' ? (
          <div className="space-y-2">
            <p className="text-[12px] font-bold leading-relaxed text-ink/70">おくってもらった ファイルを えらぶか、コードを はりつけてね。</p>
            <label className={`${btn} block cursor-pointer bg-sky-200 text-center text-ink`}>
              📄 ファイルを えらぶ
              <input type="file" accept=".txt,text/plain" className="hidden" onChange={(e) => readFile(e.target.files?.[0])} />
            </label>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="ANRINO1:… を ここに はりつけ"
              className="h-24 w-full rounded-xl bg-indigo-50 p-2 font-mono text-[10px] text-ink" />
            <button className={`${btn} bg-amber-300 text-ink`} disabled={busy || !code.trim()} onClick={check}>🔍 たしかめる</button>
          </div>
        ) : (
          sum && (
            <div className="space-y-2">
              <div className="rounded-2xl bg-indigo-50 p-3 text-[13px] font-bold leading-relaxed text-ink">
                <div>👤 {who(sum.player)} の きろく</div>
                <div>🕒 {dateText(sum.at)} に つくった コード</div>
                <div>🪙 メダル {sum.medals}まい ・ 🏠 たてもの {sum.buildings}こ</div>
              </div>
              <p className="rounded-2xl bg-rose-100 p-3 text-[13px] font-black leading-relaxed text-rose-700">
                {g.save.player
                  ? `⚠️ この iPad の いまの きろく（${who(g.save.player)}）は、この コードの きろくに いれかわるよ。いい？`
                  : '⚠️ この iPad の クイズや しまの きろくは、この コードの きろくに いれかわるよ。いい？'}
              </p>
              <button className={`${btn} bg-rose-500 text-white`} onClick={apply}>はい、いれかえる</button>
              <button className={`${btn} bg-white text-ink`} onClick={() => setStep('in')}>やめる</button>
            </div>
          )
        )}

        {err && <p className="mt-2 text-[12px] font-black text-rose-600">{err}</p>}
        <button className="mt-3 w-full rounded-2xl bg-white/70 py-2 text-[13px] font-black text-ink/60" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}

/** あたらしい iPad（まだ しゅじんこうを えらんでいない）だけに 出す「ひきつぐ」リンク。島に 入るまえの 画面に おく */
export function TransferLink() {
  const g = useGame();
  const [open, setOpen] = useState(false);
  if (g.save.player) return null;
  return (
    <>
      <button className="mt-4 w-full rounded-2xl bg-white/15 py-2.5 text-[13px] font-black text-white active:scale-95" onClick={() => setOpen(true)}>
        📥 まえの iPad の きろくを ひきつぐ
      </button>
      {open && <TransferModal start="in" onClose={() => setOpen(false)} />}
    </>
  );
}
