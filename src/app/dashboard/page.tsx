// src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/user-store';
import { useNutritionStore } from '@/app/store/nutrition-store';
import { MealForm } from '@/app/components/MealForm';
import ImageUploader from '@/app/components/ImageUploader';
import { NutritionAnalyzer } from '@/app/lib/nutrition-analyzer';
import type { NutritionItem } from '@/app/types/nutrition';
import { NutritionRings } from '../components/NutritionRings';
import { MacroBars } from '../components/MacroBars';
export default function DashboardPage() {
  const router = useRouter();

  const { profile, addMeal } = useUserStore();
  const {
    meals,
    dailyNutrition,
    dailyTarget,
    setDailyNutrition,
    setDailyTarget,
  } = useNutritionStore();

  useEffect(() => {
    if (!profile) {
      router.push('/');
    }
  }, [profile, router]);

  useEffect(() => {
    if (!profile) return;

    const target = NutritionAnalyzer.calculateDailyTarget(
      profile.age,
      profile.heightCm,
      profile.weightKg,
      profile.activityLevel,
      profile.goal,
    );

    setDailyTarget(target);
  }, [profile, setDailyTarget]);

  useEffect(() => {
    if (!dailyTarget) return;

    const dn = NutritionAnalyzer.calculateDailyNutrition(meals, dailyTarget);
    setDailyNutrition(dn);
  }, [meals, dailyTarget, setDailyNutrition]);

  if (!profile) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Top-Bar */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Willkommen zurück</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              MacroVision Dashboard
            </h1>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-4 py-1 text-xs text-slate-200 border border-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Ziele aktiv
          </span>
        </header>

        {/* Grid: Ringe + Eingabe */}
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Progress-Cards */}
          <section className="space-y-4">
            <NutritionRings />
            <MacroBars />
          </section>

          {/* Eingabe-Cards */}
          <section className="space-y-4">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-[0_18px_60px_rgba(0,0,0,0.65)] p-4 sm:p-5">
              <h2 className="text-sm font-medium text-slate-100 mb-1">
                Neue Mahlzeit (Text)
              </h2>
              <p className="text-xs text-slate-400 mb-3">
                Beschreibe dein Essen in einem Satz. Die KI schätzt die
                Nährwerte.
              </p>
              <MealForm />
            </div>

            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-[0_18px_60px_rgba(0,0,0,0.65)] p-4 sm:p-5">
              <h2 className="text-sm font-medium text-slate-100 mb-1">
                Neue Mahlzeit (Foto)
              </h2>
              <p className="text-xs text-slate-400 mb-3">
                Lade ein Foto hoch oder nutze die Kamera, um dein Gericht zu
                scannen.
              </p>
              <ImageUploader
                onMealDetected={(meal: NutritionItem) => {
                  addMeal(meal);
                }}
              />
            </div>
          </section>
        </div>

        {/* Tagesübersicht unten als Card */}
        {dailyNutrition && dailyTarget && (
          <section className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-[0_18px_60px_rgba(0,0,0,0.65)] p-4 sm:p-5">
            <h2 className="text-sm font-medium text-slate-100 mb-3">Heute</h2>
            <DailySummary />
          </section>
        )}
      </div>
    </main>
  );
}

/**
 * Kompakte Tagesübersicht in Apple-Style Cards
 */
function DailySummary() {
  const { dailyNutrition, dailyTarget } = useNutritionStore();
  if (!dailyNutrition || !dailyTarget) return null;

  const rows = [
    {
      label: 'Kalorien',
      value: `${Math.round(dailyNutrition.totalCalories)} kcal`,
      target: `${Math.round(dailyTarget.calories)} kcal`,
    },
    {
      label: 'Protein',
      value: `${Math.round(dailyNutrition.totalProtein)} g`,
      target: `${Math.round(dailyTarget.protein)} g`,
    },
    {
      label: 'Kohlenhydrate',
      value: `${Math.round(dailyNutrition.totalCarbs)} g`,
      target: `${Math.round(dailyTarget.carbs)} g`,
    },
    {
      label: 'Fett',
      value: `${Math.round(dailyNutrition.totalFat)} g`,
      target: `${Math.round(dailyTarget.fat)} g`,
    },
  ];

  return (
    <div className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between rounded-2xl bg-slate-900/80 border border-slate-800 px-3 py-2"
        >
          <span className="text-slate-300">{r.label}</span>
          <span className="text-[13px] text-slate-100">
            {r.value}
            <span className="text-slate-500"> / {r.target}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
