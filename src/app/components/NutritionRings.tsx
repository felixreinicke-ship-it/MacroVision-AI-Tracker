// src/app/components/NutritionRings.tsx
'use client';

import { useNutritionStore } from '@/app/store/nutrition-store';

export function NutritionRings() {
  const { dailyNutrition, dailyTarget } = useNutritionStore();
  if (!dailyNutrition || !dailyTarget) return null;

  const metrics = [
    {
      key: 'calories',
      label: 'Kalorien',
      value: dailyNutrition.totalCalories,
      target: dailyTarget.calories,
    },
    {
      key: 'protein',
      label: 'Protein',
      value: dailyNutrition.totalProtein,
      target: dailyTarget.protein,
    },
    {
      key: 'carbs',
      label: 'Carbs',
      value: dailyNutrition.totalCarbs,
      target: dailyTarget.carbs,
    },
  ];

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 flex gap-4 justify-between">
      {metrics.map((m) => {
        const ratio = Math.min(m.value / m.target, 1);
        const dash = 100 - ratio * 100;

        return (
          <div key={m.key} className="flex flex-col items-center gap-1">
            <div className="relative h-20 w-20">
              <svg viewBox="0 0 36 36" className="-rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  className="fill-none stroke-slate-700"
                  strokeWidth="3"
                />
                <defs>
                  <linearGradient
                    id={`ring-${m.key}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  stroke={`url(#ring-${m.key})`}
                  strokeWidth="3.2"
                  strokeDasharray={`${100 - dash} ${dash}`}
                  strokeLinecap="round"
                  className="fill-none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-slate-50">
                  {Math.round(ratio * 100)}%
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-300">{m.label}</p>
            <p className="text-[10px] text-slate-500">
              {Math.round(m.value)} / {Math.round(m.target)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
