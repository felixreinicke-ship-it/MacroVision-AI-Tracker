'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/app/components/ImageUploader';
import { MealForm } from '@/app/components/MealForm';
import { useNutritionStore } from '@/app/store/nutrition-store';
import { useUserStore } from '@/app/store/user-store';
import { NutritionAnalyzer } from '@/app/lib/nutrition-analyzer';

export default function DashboardPage() {
  const router = useRouter();
  const { profile, apiKey } = userStore();
  const { meals, dailyNutrition, setDailyNutrition } = useNutritionStore();

  useEffect(() => {
    if (!profile || !apiKey) {
      router.push('/');
    }
  }, [profile, apiKey, router]);

  useEffect(() => {
    if (!profile) return;
    const targets = NutritionAnalyzer.calculateDailyTarget(
      profile.age,
      profile.heightCm,
      profile.weightKg,
      profile.activityLevel,
      profile.goal,
    );
    const todayMeals = meals.filter((m) =>
      m.createdAt.startsWith(new Date().toISOString().split('T')[0]),
    );
    const dn = NutritionAnalyzer.calculateDailyNutrition(todayMeals, targets);
    setDailyNutrition(dn);
  }, [meals, profile, setDailyNutrition]);

  if (!profile) return null;

  return (
    <div className="space-y-4">
      {/* Header-Card */}
      <section className="card p-4">
        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">
          Heute
        </p>
        <h1 className="text-xl font-semibold mb-1 tracking-tight">
          MacroVision
        </h1>
        <p className="text-xs text-slate-500">
          {profile.age} Jahre ·{' '}
          {profile.goal === 'gain'
            ? 'Muskelaufbau'
            : profile.goal === 'lose'
            ? 'Cut'
            : 'Maintain'}
        </p>
      </section>

      {/* Eingabe-Bereich: Bild + Text */}
      <section className="grid gap-3 md:grid-cols-2">
        <ImageUploader />
        <MealForm />
      </section>

      {/* Stats-Karten */}
      {dailyNutrition && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Kalorien"
            value={`${dailyNutrition.totalCalories} / ${dailyNutrition.dailyTarget.calories} kcal`}
            progress={dailyNutrition.progress.caloriesProgress}
          />
          <StatCard
            label="Protein"
            value={`${dailyNutrition.totalProtein} / ${dailyNutrition.dailyTarget.protein} g`}
            progress={dailyNutrition.progress.proteinProgress}
          />
          <StatCard
            label="Carbs"
            value={`${dailyNutrition.totalCarbs} / ${dailyNutrition.dailyTarget.carbs} g`}
            progress={dailyNutrition.progress.carbsProgress}
          />
          <StatCard
            label="Fett"
            value={`${dailyNutrition.totalFat} / ${dailyNutrition.dailyTarget.fat} g`}
            progress={dailyNutrition.progress.fatProgress}
          />
        </section>
      )}

      {/* Mahlzeiten-Liste */}
      <section className="card p-4">
        <h2 className="text-base font-semibold mb-2">Heutige Mahlzeiten</h2>
        {meals.length === 0 && (
          <p className="text-sm text-slate-500">
            Noch keine Mahlzeiten eingetragen. Starte mit einem Foto oder einer
            Beschreibung.
          </p>
        )}
        <div className="space-y-2 mt-1">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between rounded-xl px-3 py-2"
              style={{
                backgroundColor: 'rgba(148, 163, 184, 0.1)', // slate-400/10
              }}
            >
              <div>
                <p className="text-sm font-medium">{meal.name}</p>
                <p className="text-xs text-slate-500">
                  P {Math.round(meal.totalProtein)} g · C{' '}
                  {Math.round(meal.totalCarbs)} g · F{' '}
                  {Math.round(meal.totalFat)} g
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                {Math.round(meal.totalCalories)} kcal
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress: number;
}) {
  return (
    <div className="card p-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-semibold mb-2">{value}</p>
      <div className="w-full bg-slate-200 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full bg-blue-500"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  );
}
