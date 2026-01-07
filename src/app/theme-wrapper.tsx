// src/app/theme-wrapper.tsx
'use client';

import { useState, useEffect } from 'react';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const [dark, setDark] = useState(true);

  // Optional: System-Preference einmalig lesen
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersDark = window.matchMedia?.(
      '(prefers-color-scheme: dark)',
    ).matches;
    setDark(prefersDark);
  }, []);

  const toggleTheme = () => {
    setDark((prev) => !prev);
  };

  return (
    <div className={dark ? 'app-dark' : 'app-light'}>
      {/* Theme-Schalter oben rechts */}
      <button
        onClick={toggleTheme}
        className="fixed right-4 top-4 z-20 text-xs px-3 py-1 rounded-full bg-slate-900/80 text-slate-100 border border-slate-700 shadow-md backdrop-blur-sm"
      >
        {dark ? '☀️ Hell' : '🌙 Dunkel'}
      </button>

      {children}
    </div>
  );
}
