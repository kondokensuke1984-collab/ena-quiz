import { GameProvider } from './state/GameProvider';
import { useGame } from './state/useGame';
import { PickPlayerScreen } from './screens/PickPlayerScreen';
import { IslandScreen } from './screens/IslandScreen';
import { ShopScreen } from './screens/ShopScreen';
import { BattleScreen } from './screens/BattleScreen';
import { LockScreen } from './screens/LockScreen';
import { OpeningScreen } from './screens/OpeningScreen';
import { DrillScreen } from './screens/DrillScreen';
import { useEffect, useState } from 'react';
import { todayUnits, weakGate } from './lib/study';
import { useTestLock } from './lib/testlock';
import { TestLockScreen } from './screens/TestLockScreen';
import { WeakLockScreen } from './screens/WeakLockScreen';

function Router() {
  const { save, screen, markOpeningSeen } = useGame();
  // 確認用：localhost だけ ?opening=1 で 毎回 オープニングを 出す
  const [devOpening, setDevOpening] = useState(
    () => /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).get('opening') === '1',
  );

  // ずんだもんの あんきクイズ：ページを ひらくたび（＝島に 入るたび）1回
  const [drillDone, setDrillDone] = useState(false);

  // 島の入口：今日 2教科で 単元を1つずつ といたら ひらく。クイズから もどったときに 読みなおす
  const [gate, setGate] = useState(() => todayUnits(new Date(), null, save.player));
  useEffect(() => {
    const re = () => { if (!document.hidden) setGate(todayUnits(new Date(), null, save.player)); };
    window.addEventListener('focus', re);
    window.addEventListener('storage', re);
    document.addEventListener('visibilitychange', re);
    re();
    return () => {
      window.removeEventListener('focus', re);
      window.removeEventListener('storage', re);
      document.removeEventListener('visibilitychange', re);
    };
  }, [save.player]);
  // テストまえの とくべつルール（アンリの あいだ・lib/testlock.ts）
  const testLock = useTestLock(save.player);
  // けんすけ・みつきの 端末は いつでも 島に はいれる（そらとびの SORA_FREE と おなじ きまり）
  if (!gate.unlocked && save.player !== 'kensuke' && save.player !== 'mitsuki') return <LockScreen cats={gate.cats} />;
  if (testLock.locked) return <TestLockScreen lock={testLock} />;
  // あんり：にがて・超にがてが あるなら ふくしゅう 8わり いじょう（lib/study.ts weakGate）
  const weak = weakGate(save.player);
  if (weak.locked) return <WeakLockScreen weak={weak.weak} />;

  // はじまりの ものがたり（はじめて 島を ひらいたとき 1回）
  if (!save.openingSeen || devOpening) {
    return <OpeningScreen onDone={() => { setDevOpening(false); markOpeningSeen(); }} />;
  }

  // 主人公を選ぶまでは、ほかの画面に入れない
  if (!save.player) return <PickPlayerScreen />;

  if (!drillDone) return <DrillScreen onDone={() => setDrillDone(true)} />;

  if (screen === 'shop') return <ShopScreen />;
  if (screen === 'battle') return <BattleScreen />;
  return <IslandScreen />;
}

export default function App() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}
