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

    const dn = NutritionAnalyzer.calculateDailyNutrition(meals, dailyTarget);
    setDailyNutrition(dn);
  }, [meals, dailyTarget, setDailyNutrition]);

  if (!profile) {
    // kurz nichts rendern, bis redirect passiert
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold">Dein Dashboard</h1>
          <p className="text-sm text-gray-600">
            Erfasse deine Mahlzeiten per Text oder Bild und sieh deine Tageswerte.
          </p>
        </header>

        {/* Text-Mahlzeit */}
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">Neue Mahlzeit (Text)</h2>
          <MealForm />
        </section>

        {/* Bild-Mahlzeit */}
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">Neue Mahlzeit (Foto)</h2>
          <ImageUploader
            onMealDetected={(meal: NutritionItem) => {
              // meal aus dem Bild-Analyzer ins User-Store übernehmen
              addMeal(meal);
            }}
          />
        </section>

        {/* Tagesübersicht */}
        {dailyNutrition && dailyTarget && (
          <section className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-2">Heute</h2>
            <p>
              Kalorien: {dailyNutrition.totalCalories} / {dailyTarget.calories} kcal
            </p>
            <p>
              Protein: {dailyNutrition.totalProtein} g / {dailyTarget.protein} g
            </p>
            <p>
              Kohlenhydrate: {dailyNutrition.totalCarbs} g / {dailyTarget.carbs} g
            </p>
            <p>
              Fett: {dailyNutrition.totalFat} g / {dailyTarget.fat} g
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
