import { create } from 'zustand';
import type { NutritionItem, NutritionData } from '../types/nutrition';

export interface UserProfile {
  age: number;
  weightKg: number;
  heightCm: number;
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'low' | 'medium' | 'high';
}

interface UserState {
  profile: UserProfile | null;
  meals: NutritionItem[];
  aggregated: NutritionData;
  addMeal: (item: NutritionItem) => void;
  resetMeals: () => void;
  setProfile: (profile: UserProfile) => void;
}

const emptyAggregated: NutritionData = {
  items: [],
  totalCalories: 0,
  totalProtein: 0,
  totalCarbs: 0,
  totalFat: 0,
};

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  meals: [],
  aggregated: emptyAggregated,

  setProfile(profile) {
    set({ profile });
  },

  addMeal(item) {
    const id =
      item.id ??
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`);

    const meal: NutritionItem = { ...item, id };

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
}));
