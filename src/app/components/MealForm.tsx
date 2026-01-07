'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNutritionStore } from '@/app/store/nutrition-store';
import { useUserStore } from '@/app/store/user-store';
import { geminiClient } from '@/app/lib/gemini-client';
import type { Meal } from '@/app/types/nutrition';

interface MealFormProps {
  onDone?: () => void;
}

export function MealForm({ onDone }: MealFormProps) {
  const [mealDescription, setMealDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const { addMeal } = useNutritionStore();
  const { profile } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mealDescription.trim()) {
      toast.error('Bitte beschreibe deine Mahlzeit.');
      return;
    }

    setLoading(true);
    const t = toast.loading('Mahlzeit wird analysiert ...');

    try {
      // Analyse über Text
      const nutrition = await geminiClient.analyzeMealFromText(mealDescription);

      if (!nutrition.items || nutrition.items.length === 0) {
        throw new Error('Keine Mahlzeit erkannt');
      }

      const first = nutrition.items[0];

      const meal: Meal = {
        id: crypto.randomUUID(),
        name: first.name,
        estimatedGrams: first.estimatedGrams,
        calories: first.calories,
        protein: first.protein,
        carbs: first.carbs,
        fat: first.fat,
      };

      addMeal(meal);
      setMealDescription('');

      toast.success('✅ Mahlzeit hinzugefügt!', { id: t });

      onDone?.();
    } catch (error) {
      console.error(error);
      toast.error('Analyse fehlgeschlagen.', { id: t });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        className="w-full rounded-md border border-gray-300 p-2 text-sm"
        rows={3}
        placeholder="z.B. 1 Teller Spaghetti Bolognese mit Käse"
        value={mealDescription}
        onChange={(e) => setMealDescription(e.target.value)}
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Analysiere ...' : 'Mahlzeit analysieren'}
      </button>
    </form>
  );
}
