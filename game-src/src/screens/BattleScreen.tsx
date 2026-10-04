import { useEffect, useState } from 'react';
import { Shell } from '../components/Shell';
import { readJSON } from '../lib/storage';

// バトルタブ＝その月のクエスト（rpg.html）への入口。
// クエストの月は rpg.html と同じルール：data/quest_months.json にある月のうち、その月の6日から新しい月。
const QUEST_SWITCH_DAY = 6;
function questMonthNow(months: string[]): string | undefined {
  const d = new Date();
  const t = d.getDate() < QUEST_SWITCH_DAY ? new Date(d.getFullYear(), d.getMonth() - 1, 1) : d;
  const target = t.getFullYear() + String(t.getMonth() + 1).padStart(2, '0');
  return months.filter((m) => m <= target).sort().pop();
}

export function BattleScreen() {
  const [label, setLabel] = useState('');
  useEffect(() => {
    let alive = true;
    // 栄光・2年生の子（しゅじんこうで きまる がっこう）は その学校の クエスト（rpg.html も同じ data/quest_schools.json を見る）
    const school = readJSON<{ school?: string } | null>('ena_school_v1', null)?.school;
    if (school === 'eikoh' || school === 'g2') {
      fetch('/data/quest_schools.json', { cache: 'no-cache' })
        .then((r) => r.json())
        .then((qs: Record<string, { label?: string }>) => { if (alive && qs[school]?.label) setLabel(qs[school].label + 'の '); })
        .catch(() => {});
      return () => { alive = false; };
    }
    fetch('/data/quest_months.json', { cache: 'no-cache' })
      .then((r) => r.json())
      .then((man: { months?: { month: string }[] }) => {
        const m = questMonthNow((man.months ?? []).map((x) => x.month));
        if (alive && m) setLabel(Number(m.slice(4, 6)) + '月の ');
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <Shell title="⚔️ バトル" sub="もんだいで かげモンスターを やっつけよう">
      <div className="panel flex flex-col items-center gap-2 py-6">
        <div className="text-5xl">📜</div>
        <div className="text-center text-[14px] font-black text-ink">{label}クエスト</div>
        <div className="text-center text-[11.5px] font-bold leading-relaxed text-indigo-900/60">
          もんだいに こたえて、たんげんごとの かげモンスターを たおそう
        </div>
        <a className="btn-main mt-2 block text-center no-underline" href="/rpg.html">⚔️ クエストへ いく</a>
      </div>
    </Shell>
  );
}
