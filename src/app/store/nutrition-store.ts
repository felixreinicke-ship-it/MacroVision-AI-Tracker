// src/app/store/nutrition-store.ts
'use client';

import { create } from 'zustand';
import type { Meal, DailyNutrition, DailyTarget } from '@/app/types/nutrition';

interface NutritionState {
  meals: Meal[];
  dailyNutrition: DailyNutrition | null;
  dailyTarget: DailyTarget | null;

  addMeal: (meal: Meal) => void;
  setMeals: (meals: Meal[]) => void;

  setDailyNutrition: (daily: DailyNutrition) => void;
  setDailyTarget: (target: DailyTarget) => void;
  resetDay: () => void;
}

export const useNutritionStore = create<NutritionState>()((set) => ({
  meals: [],
  dailyNutrition: null,
  dailyTarget: null,

  addMeal: (meal) =>
    set((state) => ({
      meals: [...state.meals, meal],
    })),

  setMeals: (meals) => set({ meals }),

  setDailyNutrition: (daily) => set({ dailyNutrition: daily }),

  setDailyTarget: (target) => set({ dailyTarget: target }),

  resetDay: () =>
    set({
      meals: [],
      dailyNutrition: null,
    }),
}));
