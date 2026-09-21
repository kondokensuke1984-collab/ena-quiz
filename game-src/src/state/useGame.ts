import { useContext } from 'react';
import { GameContext, type GameApi } from './GameProvider';

export function useGame(): GameApi {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame は GameProvider の中でしか使えません');
  return ctx;
}
