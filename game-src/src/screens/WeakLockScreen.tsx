import { TransferLink } from '../components/TransferModal';
import { WEAK_PCT } from '../lib/study';

// あんりの 島の入口（くわえる条件）。にがて・超にがてが あるなら、ぜんぶ ふくしゅうして 8わり いじょう（lib/study.ts weakGate）
export function WeakLockScreen({ weak }: { weak: number }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center px-5 py-10 text-center">
      <div className="text-[64px] leading-none">⚠️</div>
      <div className="mt-3 text-[20px] font-black text-white">にがてを やっつけてから<br />しまに いこう！</div>
      <div className="panel mt-5 w-full !py-4">
        <div className="text-[14px] font-black leading-relaxed text-ink">
          クイズの「にがて もんだいを ふくしゅう」を<br /><span className="text-rose-500">ぜんぶ</span> やって、<br /><span className="text-rose-500">{WEAK_PCT / 10}わり いじょう せいかい</span> すると<br />しまに いけるよ！
        </div>
        <div className="mt-3 text-[13px] font-bold text-indigo-900/70">
          いまの にがて・超にがて：<span className="text-[18px] font-black text-indigo-700">{weak}もん</span>
        </div>
        <div className="mt-2 text-[11px] font-bold leading-snug text-indigo-900/55">
          きょう できたら、あとは いつもどおり。<br />にがてが 0もんなら この ルールは なしだよ。
        </div>
      </div>
      <a className="btn-main mt-5 block w-full text-center no-underline" href="/">⚠️ にがてを ふくしゅうする</a>
      <TransferLink />
    </div>
  );
}
