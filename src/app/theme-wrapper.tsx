'use client';

import React, { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('mv_theme') as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('mv_theme', theme);
  }, [theme]);

  return (
  <div className={theme === 'light' ? 'app-light min-h-screen' : 'app-dark min-h-screen'}>
    <div className="min-h-screen flex flex-col mx-auto px-4 pb-6 max-w-md sm:max-w-lg md:max-w-2xl">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/80 app-dark:bg-slate-900/80 border-b border-slate-100 app-dark:border-slate-800 -mx-4 px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">🍎 MacroVision</span>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="text-xs px-3 py-1 rounded-full border bg-white app-dark:bg-slate-800 border-slate-300 app-dark:border-slate-600 shadow-sm"
        >
          {theme === 'light' ? '🌙 Dunkel' : '☀️ Hell'}
        </button>
      </header>
      <main className="flex-1 pt-4 space-y-4">{children}</main>
    </div>
  </div>
);


}
