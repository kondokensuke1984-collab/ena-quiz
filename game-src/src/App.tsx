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
import { todayUnits } from './lib/study';

function Router() {
  const { save, screen, markOpeningSeen } = useGame();
  // 確認用：localhost だけ ?opening=1 で 毎回 オープニングを 出す
  const [devOpening, setDevOpening] = useState(
    () => /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).get('opening') === '1',
  );

  // ずんだもんの あんきクイズ：ページを ひらくたび（＝島に 入るたび）1回
  const [drillDone, setDrillDone] = useState(false);

  // 島の入口：今日 2教科で 単元を1つずつ といたら ひらく。クイズから もどったときに 読みなおす
  const [gate, setGate] = useState(() => todayUnits());
  useEffect(() => {
    const re = () => { if (!document.hidden) setGate(todayUnits()); };
    window.addEventListener('focus', re);
    window.addEventListener('storage', re);
    document.addEventListener('visibilitychange', re);
    return () => {
      window.removeEventListener('focus', re);
      window.removeEventListener('storage', re);
      document.removeEventListener('visibilitychange', re);
    };
  }, []);
  if (!gate.unlocked) return <LockScreen cats={gate.cats} />;

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
