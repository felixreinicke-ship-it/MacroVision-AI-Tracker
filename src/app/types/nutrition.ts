// src/app/types/nutrition.ts

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  // wenn du totalCalories usw. verwendest:
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface DailyTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface DailyNutrition {
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  dailyTarget: DailyTarget;
  progress: {
    caloriesProgress: number;
    proteinProgress: number;
    carbsProgress: number;
    fatProgress: number;
  };
}
