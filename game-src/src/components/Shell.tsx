import type { ReactNode } from 'react';
import { useGame } from '../state/useGame';
import type { Screen } from '../types';

const TABS: { key: Screen; label: string }[] = [
  { key: 'island', label: '🏝 しま' },
  { key: 'shop', label: '🛒 ショップ' },
  { key: 'battle', label: '⚔️ バトル' },
];

export function MedalBadge() {
  const { balance } = useGame();
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 px-3.5 py-1.5 shadow-lg">
      <span className="text-lg leading-none">🪙</span>
      <span className="text-lg font-black leading-none text-amber-50">{balance}</span>
      <span className="text-[10px] font-extrabold leading-none text-amber-100">枚</span>
    </div>
  );
}

export function TabBar() {
  const { screen, go } = useGame();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-[480px] lg:landscape:max-w-[1200px] gap-1.5 border-t border-white/10 bg-indigo-950/90 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => go(t.key)}
          className={`flex-1 rounded-xl py-2.5 text-[13px] font-extrabold transition ${
            screen === t.key
              ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg'
              : 'text-indigo-200/70 active:bg-white/5'
          }`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}

function Toast() {
  const { toast } = useGame();
  if (!toast) return null;
  return (
    <div
      key={toast.id}
      className={`toast-in fixed bottom-24 left-1/2 z-40 max-w-[88%] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-extrabold shadow-xl ${
        toast.tone === 'ng' ? 'bg-rose-500 text-white' : 'bg-white text-ink'
      }`}
    >
      {toast.text}
    </div>
  );
}

/** extra＝メダルの となりに 出す ボタン（島の「📜 はじまり」など） */
export function Shell({ title, sub, extra, children }: { title: string; sub?: string; extra?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto min-h-full max-w-[480px] px-3 pb-24 pt-3 lg:landscape:max-w-[1200px] lg:landscape:px-5">
      <header className="mb-3 flex items-center gap-2">
        <a
          href="/"
          className="shrink-0 rounded-xl border-2 border-indigo-300/40 px-2.5 py-1.5 text-[11px] font-extrabold text-indigo-100 active:scale-95"
        >
          ◀ アプリ
        </a>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-black text-white">{title}</div>
          {sub && <div className="truncate text-[11px] font-bold text-indigo-200/70">{sub}</div>}
        </div>
        {extra}
        <MedalBadge />
      </header>
      <div className="fade-in">{children}</div>
      <Toast />
      <TabBar />
    </div>
  );
}

export function HpBar({ value, max, tone = 'hp' }: { value: number; max: number; tone?: 'hp' | 'exp' | 'food' }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const fill =
    tone === 'hp'
      ? pct > 50 ? 'linear-gradient(90deg,#4ade80,#22c55e)' : pct > 25 ? 'linear-gradient(90deg,#fbbf24,#f59e0b)' : 'linear-gradient(90deg,#f87171,#ef4444)'
      : tone === 'food'
      ? 'linear-gradient(90deg,#fbbf24,#fb923c)'
      : 'linear-gradient(90deg,#c4b5fd,#8b5cf6)';
  return (
    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: fill }} />
    </div>
  );
}
