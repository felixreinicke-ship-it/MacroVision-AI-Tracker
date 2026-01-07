export interface NutritionItem {
  id?: string; // optional, wird später erzeugt
  name: string;
  estimatedGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionData {
  items: NutritionItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}
