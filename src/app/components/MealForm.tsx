'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNutritionStore } from '@/app/store/nutrition-store';
import { userStore } from '@/app/store/user-store';
import { geminiClient } from '@/app/lib/gemini-client';

interface MealFormProps {
  onMealAdded?: (meal: any) => void;
}

export function MealForm({ onMealAdded }: MealFormProps) {
  const [mealDescription, setMealDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { apiKey } = userStore();
  const { addMeal } = useNutritionStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey) {
      toast.error('API-Key nicht konfiguriert!');
      return;
    }

    if (!mealDescription.trim()) {
      toast.error('Bitte beschreibe deine Mahlzeit');
      return;
    }

    setLoading(true);
    try {
      geminiClient.initialize(apiKey);
      toast.loading('🍽️ Analysiere Mahlzeit...');

      const nutrition = await geminiClient.analyzeMealFromText(
        mealDescription,
      );

      const meal = {
        id: `meal-${Date.now()}`,
        name: mealDescription,
        items: nutrition.items,
        totalCalories: nutrition.totalCalories,
        totalProtein: nutrition.totalProtein,
        totalCarbs: nutrition.totalCarbs,
        totalFat: nutrition.totalFat,
        createdAt: new Date().toISOString(),
      };

      addMeal(meal);
      toast.dismiss();
      toast.success('✅ Mahlzeit hinzugefügt!');
      setMealDescription('');
      onMealAdded?.(meal);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Fehler bei der Analyse');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="text-lg font-semibold mb-4">📝 Mahlzeit eingeben</h3>

      <textarea
        value={mealDescription}
        onChange={(e) => setMealDescription(e.target.value)}
        placeholder="z.B. 'Hähnchen mit Reis und Brokkoli' oder '2 Scheiben Toast mit Butter'"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={3}
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading || !mealDescription.trim()}
        className="mt-4 w-full btn-primary disabled:opacity-50"
      >
        {loading ? '⏳ Wird analysiert...' : '➕ Mahlzeit hinzufügen'}
      </button>
    </form>
  );
}
