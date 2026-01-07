import { create } from 'zustand';
import { Meal, DailyNutrition } from '@/app/types/nutrition';
import { NutritionAnalyzer } from '@/app/lib/nutrition-analyzer';

interface NutritionState {
  meals: Meal[];
  currentDate: string;
  dailyNutrition: DailyNutrition | null;
  addMeal: (meal: Meal) => void;
  removeMeal: (mealId: string) => void;
  updateMeal: (meal: Meal) => void;
  setDailyNutrition: (nutrition: DailyNutrition) => void;
  getMealsByDate: (date: string) => Meal[];
  clear: () => void;
}

export const useNutritionStore = create<NutritionState>((set, get) => {
  const savedMeals =
    typeof window !== 'undefined'
      ? localStorage.getItem('nutrition_meals')
      : null;
  const initialMeals: Meal[] = savedMeals ? JSON.parse(savedMeals) : [];

  return {
    meals: initialMeals,
    currentDate: new Date().toISOString().split('T')[0],
    dailyNutrition: null,

    addMeal: (meal) => {
      set((state) => {
        const newMeals = [...state.meals, meal];
        if (typeof window !== 'undefined') {
          localStorage.setItem('nutrition_meals', JSON.stringify(newMeals));
        }
        return { meals: newMeals };
      });
    },

    removeMeal: (mealId) => {
      set((state) => {
        const newMeals = state.meals.filter((m) => m.id !== mealId);
        if (typeof window !== 'undefined') {
          localStorage.setItem('nutrition_meals', JSON.stringify(newMeals));
        }
        return { meals: newMeals };
      });
    },

    updateMeal: (meal) => {
      set((state) => {
        const newMeals = state.meals.map((m) => (m.id === meal.id ? meal : m));
        if (typeof window !== 'undefined') {
          localStorage.setItem('nutrition_meals', JSON.stringify(newMeals));
        }
        return { meals: newMeals };
      });
    },

    setDailyNutrition: (nutrition) => {
      set({ dailyNutrition: nutrition });
    },

    getMealsByDate: (date) => {
      return get().meals.filter((meal) => meal.createdAt.startsWith(date));
    },

    clear: () => {
      set({ meals: [], dailyNutrition: null });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nutrition_meals');
      }
    },
  };
});
