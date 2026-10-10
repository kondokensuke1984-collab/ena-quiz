// 💌 てがみばこ（一覧と よむ画面）

import { useState } from 'react';
import { CharSVG } from '../../components/CharSVG';
import { addressToNow } from '../../lib/letters';
import type { Friend } from '../../lib/friends';
import { useGame } from '../../state/useGame';
import type { Letter } from '../../types';

export function MailModal({ friends, onClose }: { friends: Friend[]; onClose: () => void }) {
  const g = useGame();
  const { save } = g;
  const [reading, setReading] = useState<Letter | null>(null);
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3" onClick={onClose}>
      <div className="panel max-h-[85vh] w-full max-w-[440px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {reading ? (
          <div>
            <div className="mb-2 flex items-center gap-2">
              {(() => {
                // なかまの てがみは、いまの せいちょうの すがたで 出す（そだちきった かおを 見せない＝ネタバレ しない）。ルナなど なかま以外は そのまま
                const fr = friends.find((f) => f.char === reading.from);
                return fr
                  ? <CharSVG charKey={fr.char} level={fr.level} fillPct={fr.fill} size={56} stars={fr.stars} label={fr.name} />
                  : <CharSVG charKey={reading.from as never} level={6} fillPct={1} size={56} label={reading.fromName} />;
              })()}
              <div className="text-[14px] font-black text-ink">{reading.title}</div>
            </div>
            <div className="whitespace-pre-line rounded-2xl bg-amber-50 px-4 py-3 text-[13px] font-bold leading-relaxed text-ink">{addressToNow(reading.body, save.player)}</div>
            <button className="btn mt-3" onClick={() => setReading(null)}>← てがみばこに もどる</button>
          </div>
        ) : (
          <div>
            <div className="mb-2 text-[14px] font-black text-ink">💌 てがみばこ</div>
            {save.letters.length === 0 ? (
              <p className="py-3 text-center text-[12px] font-bold text-indigo-900/60">まだ てがみは ないよ</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {save.letters.map((l) => (
                  <button
                    key={l.id}
                    className={`btn flex items-center gap-2 text-left ${l.read ? 'opacity-70' : ''}`}
                    onClick={() => { setReading(l); if (!l.read) g.readLetter(l.id); }}
                  >
                    <span className="text-lg">{l.read ? '📭' : '💌'}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-black">{l.title}</span>
                      <span className="block text-[10.5px] font-bold text-indigo-900/50">{l.fromName}より・{new Date(l.at).getMonth() + 1}/{new Date(l.at).getDate()}</span>
                    </span>
                    {!l.read && <span className="rounded-full bg-rose-500 px-2 text-[10px] font-black text-white">NEW</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button className="btn-main mt-3" onClick={onClose}>とじる</button>
      </div>
    </div>
  );
}
