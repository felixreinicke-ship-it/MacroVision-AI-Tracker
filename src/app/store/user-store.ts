// src/app/store/user-store.ts
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { NutritionItem, NutritionData } from '../types/nutrition';

export interface UserProfile {
  age: number;
  weightKg: number;
  heightCm: number;
  gender: 'male' | 'female';
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'low' | 'medium' | 'high';
}

interface UserState {
  profile: UserProfile | null;
  meals: NutritionItem[];
  aggregated: NutritionData;
  apiKey: string | null;

  setProfile: (profile: UserProfile) => void;
  setApiKey: (key: string) => void;
  addMeal: (item: NutritionItem) => void;
  resetMeals: () => void;
}

const emptyAggregated: NutritionData = {
  items: [],
  totalCalories: 0,
  totalProtein: 0,
  totalCarbs: 0,
  totalFat: 0,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      meals: [],
      aggregated: emptyAggregated,
      apiKey: null,

      setProfile(profile) {
        set({ profile });
      },

      setApiKey(key) {
        set({ apiKey: key });
      },

      addMeal(item) {
        const meal: NutritionItem = { ...item };

        const meals = [...get().meals, meal];

        const aggregated: NutritionData = {
          items: meals,
          totalCalories: meals.reduce((s, m) => s + (m.calories || 0), 0),
          totalProtein: meals.reduce((s, m) => s + (m.protein || 0), 0),
          totalCarbs: meals.reduce((s, m) => s + (m.carbs || 0), 0),
          totalFat: meals.reduce((s, m) => s + (m.fat || 0), 0),
        };

        set({ meals, aggregated });
      },

      resetMeals() {
        set({ meals: [], aggregated: emptyAggregated });
      },
    }),
    {
      name: 'macro-vision-user',
      storage: createJSONStorage(() => localStorage),
      // Wenn du nur Profil + Key speichern willst:
      // partialize: (state) => ({
      //   profile: state.profile,
      //   apiKey: state.apiKey,
      // }),
    },
  ),
);
