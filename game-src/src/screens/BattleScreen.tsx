import { Shell } from '../components/Shell';

// バトルタブ＝9月のクエスト（rpg.html）への入口。
// もとの「ミニバトル」（じゅう・たてで かげモンスターと たたかう）は取りやめた。lib/battle.ts はもう使っていない。
export function BattleScreen() {
  return (
    <Shell title="⚔️ バトル" sub="もんだいで かげモンスターを やっつけよう">
      <div className="panel flex flex-col items-center gap-2 py-6">
        <div className="text-5xl">📜</div>
        <div className="text-center text-[14px] font-black text-ink">9月の クエスト</div>
        <div className="text-center text-[11.5px] font-bold leading-relaxed text-indigo-900/60">
          もんだいに こたえて、たんげんごとの かげモンスターを たおそう
        </div>
        <a className="btn-main mt-2 block text-center no-underline" href="/rpg.html">⚔️ クエストへ いく</a>
      </div>
    </Shell>
  );
}
