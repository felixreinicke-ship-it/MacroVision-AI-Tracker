'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MealForm } from '@/app/components/MealForm';
import { useNutritionStore } from '@/app/store/nutrition-store';
import { useUserStore } from '@/app/store/user-store';

export default function DashboardPage() {
  const router = useRouter();
  const { profile } = useUserStore();
  const { meals, dailyNutrition, setDailyNutrition } = useNutritionStore();

  useEffect(() => {
    // wenn kein Profil vorhanden ist, zurück zur Startseite
    if (!profile) {
      router.push('/');
    }
  }, [profile, router]);

  useEffect(() => {
    // tägliche Nährwerte aus den Mahlzeiten berechnen
    const totals = meals.reduce(
      (acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fat: acc.fat + (m.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    setDailyNutrition(totals);
  }, [meals, setDailyNutrition]);

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
        <p className="text-sm text-gray-700">
          Kalorien: {dailyNutrition.calories} kcal · Protein: {dailyNutrition.protein} g ·
          Kohlenhydrate: {dailyNutrition.carbs} g · Fett: {dailyNutrition.fat} g
        </p>
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
