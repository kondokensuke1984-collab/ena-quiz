import { TEST_LOCK, type TestLock } from '../lib/testlock';

// テストまえの とくべつルール（lib/testlock.ts）。毎日の入口（LockScreen）は もう とおっている
export function TestLockScreen({ lock }: { lock: TestLock }) {
  const [, m, d] = TEST_LOCK.until.split('-').map(Number);
  if (lock.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[14px] font-black text-white/80">よみこみ ちゅう…</div>
    );
  }
  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center px-5 py-10 text-center">
      <div className="text-[64px] leading-none">📝</div>
      <div className="mt-3 text-[20px] font-black text-white">{m}/{d} の テストまでは<br />とくべつ ルール</div>
      <div className="mt-2 text-[13px] font-bold leading-relaxed text-indigo-100/80">
        どちらか 1つ できたら しまに いけるよ！
      </div>

      <div className="panel mt-5 w-full !py-4 text-left">
        <div className="text-[15px] font-black text-ink">① もしの しまで <span className="text-rose-500">{TEST_LOCK.pct}てん いじょう</span></div>
        <div className="mt-1 text-[13px] font-bold text-indigo-900/70">
          いまの さいこう：<span className="text-[16px] font-black text-indigo-700">{lock.best}てん</span>
        </div>
        {lock.pending && (
          <div className="mt-1 text-[12px] font-black text-amber-600">✉️ まるつけ まちが あるよ。おうちの ひとに まるつけ してもらってね</div>
        )}
        <a className="btn-main mt-3 block w-full text-center no-underline" href="/rpg.html#moshi">📝 もしを うける</a>
      </div>

      <div className="mt-2 text-[13px] font-black text-white/70">または</div>

      <div className="panel mt-2 w-full !py-4 text-left">
        <div className="text-[15px] font-black text-ink">② テストの はんいの <span className="text-rose-500">にがてを 0もん</span> に する</div>
        <div className="mt-1 text-[13px] font-bold text-indigo-900/70">
          のこり：<span className="text-[16px] font-black text-indigo-700">{lock.weak ?? '？'}もん</span>
        </div>
        {lock.byUnit.length > 0 && (
          <ul className="mt-1.5 space-y-0.5 text-[12px] font-bold text-indigo-900/65">
            {lock.byUnit.map((u) => (
              <li key={u.label}>⚠️ {u.label}：{u.n}もん</li>
            ))}
          </ul>
        )}
        <a className="btn-main mt-3 block w-full text-center no-underline" href="/">⚠️ にがてを ふくしゅうする</a>
      </div>
    </div>
  );
}
