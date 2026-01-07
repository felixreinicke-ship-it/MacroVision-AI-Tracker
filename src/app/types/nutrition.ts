export interface FoodItem {
  id: string;
  name: string;
  estimatedGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  saturatedFat?: number;
  sodium?: number;
}

export interface Meal {
  id: string;
  name: string;
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  imageUrl?: string;
  createdAt: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DailyTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
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
