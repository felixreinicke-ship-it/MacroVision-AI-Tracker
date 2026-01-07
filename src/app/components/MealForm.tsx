'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNutritionStore } from '@/app/store/nutrition-store';
import { useUserStore } from '@/app/store/user-store';

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
      // TODO: hier deine echte Analyse-Funktion aufrufen
      // z.B.: const meal = await analyzeTextMeal(mealDescription, profile);

      const meal = {
        name: mealDescription,
        estimatedGrams: 100,
        calories: 250,
        protein: 10,
        carbs: 30,
        fat: 8,
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
