// src/app/components/MacroBars.tsx
'use client';

import { useNutritionStore } from '@/app/store/nutrition-store';

export function MacroBars() {
  const { dailyNutrition, dailyTarget } = useNutritionStore();
  if (!dailyNutrition || !dailyTarget) return null;

  const macros = [
    {
      key: 'protein',
      label: 'Protein',
      unit: 'g',
      value: dailyNutrition.totalProtein,
      target: dailyTarget.protein,
      color: 'bg-emerald-400',
    },
    {
      key: 'carbs',
      label: 'Kohlenhydrate',
      unit: 'g',
      value: dailyNutrition.totalCarbs,
      target: dailyTarget.carbs,
      color: 'bg-sky-400',
    },
    {
      key: 'fat',
      label: 'Fett',
      unit: 'g',
      value: dailyNutrition.totalFat,
      target: dailyTarget.fat,
      color: 'bg-amber-400',
    },
  ];

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 space-y-3">
      {macros.map((m) => {
        const ratio = Math.min(m.value / m.target, 1);

        return (
          <div key={m.key} className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>{m.label}</span>
              <span>
                {Math.round(m.value)} / {Math.round(m.target)} {m.unit}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`${m.color} h-full rounded-full transition-all`}
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
