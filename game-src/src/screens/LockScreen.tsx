import { UNLOCK_CATS } from '../lib/study';

// 島の入口。その日に UNLOCK_CATS 教科で 単元を1つずつ 最後まで といたら ひらく
const CAT_LABEL: Record<string, string> = {
  shakai: '🗾 しゃかい', rika: '🔬 りか', kokugo: '✍️ こくご', sansu: '🔢 さんすう', eigo: '🔤 えいご',
};

export function LockScreen({ cats }: { cats: string[] }) {
  const left = Math.max(0, UNLOCK_CATS - cats.length);
  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center px-5 py-10 text-center">
      <div className="text-[64px] leading-none">🏝️</div>
      <div className="mt-3 text-[20px] font-black text-white">アンリノ島は まだ しまっているよ</div>
      <div className="panel mt-5 w-full !py-4">
        <div className="text-[14px] font-black leading-relaxed text-ink">
          きょう {UNLOCK_CATS}つの きょうかで、<br />たんげんを 1つずつ さいごまで といて<br /><span className="text-rose-500">8わり いじょう せいかい</span> すると<br />しまに いけるよ！
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: UNLOCK_CATS }, (_, i) => (
            <div
              key={i}
              className={`flex h-20 flex-1 flex-col items-center justify-center rounded-2xl text-[13px] font-black ${
                cats[i] ? 'bg-emerald-100 text-emerald-700' : 'border-2 border-dashed border-indigo-200 text-indigo-300'
              }`}
            >
              <span className="text-2xl">{cats[i] ? '✅' : '❔'}</span>
              {cats[i] ? CAT_LABEL[cats[i]] ?? cats[i] : 'まだ'}
            </div>
          ))}
        </div>
        <div className="mt-3 text-[13px] font-black text-amber-600">
          {left > 0 ? `あと ${left}きょうか！` : ''}
        </div>
        <div className="mt-1 text-[11px] font-bold leading-snug text-indigo-900/55">
          ⭐かんぺきの たんげんも もういちど とけるよ。<br />にがて ふくしゅう・ぜんもんだい・もしは かぞえないよ。
        </div>
      </div>
      <a className="btn-main mt-5 block w-full text-center no-underline" href="/">📚 クイズへ いく</a>
    </div>
  );
}
