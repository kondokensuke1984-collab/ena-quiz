import { GameProvider } from './state/GameProvider';
import { useGame } from './state/useGame';
import { PickPlayerScreen } from './screens/PickPlayerScreen';
import { IslandScreen } from './screens/IslandScreen';
import { ShopScreen } from './screens/ShopScreen';
import { BattleScreen } from './screens/BattleScreen';

function Router() {
  const { save, screen } = useGame();

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
