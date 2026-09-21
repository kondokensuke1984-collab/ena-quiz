import { useState } from 'react';
import { Shell, HpBar } from '../components/Shell';
import { CharSVG } from '../components/CharSVG';
import { KidSVG, PALETTES } from '../components/KidSVG';
import { useGame } from '../state/useGame';
import {
  COMMAND_LABEL, ENEMY_MOVE_LABEL, gunOf, shieldOf, startBattle, step,
  type BattleState, type Command,
} from '../lib/battle';
import { canBattle, displayFullness, mood } from '../lib/monster';
import { ITEM_BY_ID } from '../lib/items';

const FULLNESS_COST = 10;

export function BattleScreen() {
  const g = useGame();
  const { save, now } = g;
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [reward, setReward] = useState<{ furniture: string[]; titles: string[] } | null>(null);

  const gun = gunOf(save);
  const shield = shieldOf(save);
  const ready = canBattle(save.monster, now);

  const begin = () => {
    if (!ready) return;
    g.spendFullness(FULLNESS_COST);
    setReward(null);
    setBattle(startBattle(save));
  };

  const act = (cmd: Command) => {
    if (!battle || battle.phase !== 'input') return;
    if (cmd === 'shoot' && !gun) { g.showToast('ショップで じゅうを かおう', 'ng'); return; }

    const next = step(battle, cmd, save);
    setBattle(next);
    if (next.phase === 'win') setReward(g.winBattle());
    else if (next.phase === 'lose') g.loseBattle();
  };

  // ── まだ戦えないとき ──
  if (!battle) {
    return (
      <Shell title="⚔️ ミニバトル" sub="かげモンスターを やっつけよう">
        <div className="panel flex flex-col items-center gap-3 py-6">
          <div className="text-5xl">👾</div>
          <div className="text-center text-[13px] font-black text-ink">かげモンスターが しまの そとに いる</div>

          <div className="w-full rounded-2xl bg-indigo-50 px-4 py-3 text-[11.5px] font-bold leading-relaxed text-indigo-900/75">
            <div>🔫 そうび中の じゅう：{gun ? `${gun.emoji} ${gun.name}（こうげき ${gun.power}）` : 'なし'}</div>
            <div>🛡️ そうび中の たて：{shield ? `${shield.emoji} ${shield.name}` : 'なし'}</div>
            <div className="mt-1 text-indigo-900/50">1かい たたかうと まんぷくが {FULLNESS_COST} へるよ</div>
          </div>

          {!ready && (
            <div className="w-full rounded-2xl bg-rose-50 px-4 py-3 text-center text-[12px] font-extrabold text-rose-600">
              {save.monster.stage === 'egg'
                ? 'たまごが かえってから たたかえるよ'
                : mood(save.monster, now) === 'down'
                ? 'モンスターが ダウン中。ごはんを あげてね'
                : `まんぷくが たりないよ（いま ${displayFullness(save.monster, now)}%・30%いじょう ひつよう）`}
            </div>
          )}

          <button className="btn-main" disabled={!ready} onClick={begin}>
            {ready ? 'たたかう！' : 'いまは たたかえない'}
          </button>

          {(save.battle.wins > 0 || save.battle.losses > 0) && (
            <div className="text-[11px] font-extrabold text-indigo-900/50">
              せんせき {save.battle.wins}しょう {save.battle.losses}はい
            </div>
          )}
        </div>
      </Shell>
    );
  }

  const over = battle.phase !== 'input';

  return (
    <Shell title="⚔️ ミニバトル" sub={`${battle.turn}ターンめ`}>
      {/* 敵 */}
      <div className="panel !py-3">
        <div className="mb-1 flex items-center justify-between text-[12px] font-black text-ink">
          <span>{battle.enemy.name}</span>
          <span className="text-[11px] text-indigo-900/50">{battle.enemy.hp}/{battle.enemy.maxHp}</span>
        </div>
        <HpBar value={battle.enemy.hp} max={battle.enemy.maxHp} />
        <div className="mt-2 flex justify-center">
          <CharSVG charKey={battle.enemy.key} level={4} fillPct={0.7} size={150} silhouette stars={0} label={battle.enemy.name} />
        </div>
        {!over && (
          <div className="rounded-xl bg-rose-50 py-2 text-center text-[12px] font-extrabold text-rose-600">
            {ENEMY_MOVE_LABEL[battle.enemy.next]}
          </div>
        )}
      </div>

      {/* ログ */}
      <div className="panel my-2.5 !py-2.5">
        <div className="flex flex-col gap-0.5">
          {battle.log.map((line, i) => (
            <div key={i} className={`text-[12px] font-bold ${i === battle.log.length - 1 ? 'text-ink' : 'text-indigo-900/40'}`}>
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* 自分 */}
      <div className="panel !py-3">
        <div className="flex items-center gap-3">
          {save.player && <KidSVG who={save.player} size={54} />}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between text-[12px] font-black text-ink">
              <span>{save.player ? PALETTES[save.player].name : 'じぶん'}</span>
              <span className="text-[11px] text-indigo-900/50">{battle.playerHp}/{battle.playerMaxHp}</span>
            </div>
            <HpBar value={battle.playerHp} max={battle.playerMaxHp} />
          </div>
        </div>
      </div>

      {/* コマンド */}
      {!over ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(['shoot', 'guard', 'slash'] as Command[]).map((c) => {
            const disabled = c === 'shoot' && !gun;
            return (
              <button
                key={c}
                disabled={disabled}
                onClick={() => act(c)}
                className={`rounded-2xl py-4 text-[13px] font-black shadow-lg active:scale-95 ${
                  disabled ? 'bg-white/20 text-white/40' : 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white'
                }`}
              >
                {COMMAND_LABEL[c]}
                {disabled && <div className="mt-0.5 text-[9px] font-bold">じゅうが ない</div>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="panel mt-3 flex flex-col items-center gap-2 py-5">
          <div className="text-3xl">{battle.phase === 'win' ? '🎉' : '😢'}</div>
          <div className="text-[15px] font-black text-ink">
            {battle.phase === 'win' ? 'かげモンスターに かった！' : 'まけてしまった…'}
          </div>

          {battle.phase === 'win' && reward && (reward.furniture.length > 0 || reward.titles.length > 0) && (
            <div className="w-full rounded-2xl bg-amber-50 px-4 py-3 text-center">
              <div className="text-[11px] font-extrabold text-amber-700">ごほうびを もらった！</div>
              <div className="mt-1 flex flex-wrap justify-center gap-1.5">
                {reward.furniture.map((id) => (
                  <span key={id} className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-amber-800">
                    {ITEM_BY_ID[id]?.emoji} {ITEM_BY_ID[id]?.name}
                  </span>
                ))}
                {reward.titles.map((t) => (
                  <span key={t} className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-amber-800">🏅 {t}</span>
                ))}
              </div>
              <div className="mt-1.5 text-[10px] font-bold text-amber-700/70">かぐは しまで おけるよ</div>
            </div>
          )}

          <div className="mt-1 flex w-full gap-2">
            <button className="btn !text-center" onClick={() => setBattle(null)}>もどる</button>
            <button className="btn-main" disabled={!canBattle(save.monster, now)} onClick={begin}>もういちど</button>
          </div>
        </div>
      )}
    </Shell>
  );
}
