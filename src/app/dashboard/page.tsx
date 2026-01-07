// src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MealForm } from '@/app/components/MealForm';
import { useNutritionStore } from '@/app/store/nutrition-store';
import { useUserStore } from '@/app/store/user-store';
import { NutritionAnalyzer } from '@/app/lib/nutrition-analyzer';

export default function DashboardPage() {
  const router = useRouter();
  const { profile } = useUserStore();
  const { meals, dailyNutrition, dailyTarget, setDailyNutrition, setDailyTarget } =
    useNutritionStore();

  // Wenn kein Profil vorhanden ist → zurück zur Startseite
  useEffect(() => {
    if (!profile) {
      router.push('/');
    }
  }, [profile, router]);

  // Daily Target aus Profil berechnen
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

  // tägliche Nährwerte aus den Mahlzeiten berechnen
  useEffect(() => {
    if (!dailyTarget) return;

    const totals = NutritionAnalyzer.calculateDailyNutrition(meals, dailyTarget);
    setDailyNutrition(totals);
  }, [meals, dailyTarget, setDailyNutrition]);

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-4">
      <section>
        <h1 className="mb-2 text-xl font-semibold">Dein Dashboard</h1>
        <p className="text-sm text-gray-600">
          Erfasse deine Mahlzeiten per Text oder Bild und sieh deine Tageswerte.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Neue Mahlzeit</h2>
        <MealForm />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Heute</h2>
        {dailyNutrition ? (
          <p className="text-sm text-gray-700">
            Kalorien: {dailyNutrition.totalCalories} kcal · Protein:{' '}
            {dailyNutrition.totalProtein} g · Kohlenhydrate:{' '}
            {dailyNutrition.totalCarbs} g · Fett: {dailyNutrition.totalFat} g
          </p>
        ) : (
          <p className="text-sm text-gray-400">
            Noch keine Tageswerte berechnet.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Mahlzeiten</h2>
        <ul className="space-y-2 text-sm">
          {meals.map((m) => (
            <li
              key={m.id}
              className="rounded-md border border-gray-200 p-2"
            >
              <div className="font-medium">{m.name}</div>
              <div className="text-gray-600">
                {m.calories} kcal · P {m.protein} g · C {m.carbs} g · F {m.fat} g
              </div>
            </li>
          ))}
          {meals.length === 0 && (
            <li className="text-gray-400">Noch keine Mahlzeiten erfasst.</li>
          )}
        </ul>
      </section>
    </main>
  );
}
