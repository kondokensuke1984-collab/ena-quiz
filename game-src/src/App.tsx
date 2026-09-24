import { GameProvider } from './state/GameProvider';
import { useGame } from './state/useGame';
import { PickPlayerScreen } from './screens/PickPlayerScreen';
import { IslandScreen } from './screens/IslandScreen';
import { ShopScreen } from './screens/ShopScreen';
import { BattleScreen } from './screens/BattleScreen';
import { LockScreen } from './screens/LockScreen';
import { useEffect, useState } from 'react';
import { todayUnits } from './lib/study';

function Router() {
  const { save, screen } = useGame();

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

  // 主人公を選ぶまでは、ほかの画面に入れない
  if (!save.player) return <PickPlayerScreen />;

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
