import { Meal, DailyNutrition, DailyTarget } from '@/types/nutrition';

export class NutritionAnalyzer {
  static calculateDailyTarget(
    age: number,
    heightCm: number,
    weightKg: number,
    activityLevel: 'low' | 'medium' | 'high',
    goal: 'lose' | 'maintain' | 'gain',
  ): DailyTarget {
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;

    const activityMultiplier = {
      low: 1.375,
      medium: 1.55,
      high: 1.725,
    }[activityLevel];

    const tdee = bmr * activityMultiplier;

    let adjustedCalories = tdee;
    if (goal === 'lose') adjustedCalories = tdee - 500;
    if (goal === 'gain') adjustedCalories = tdee + 300;

    const proteinGrams = weightKg * 1.6;
    const proteinCalories = proteinGrams * 4;
    const fatCalories = adjustedCalories * 0.3;
    const fatGrams = fatCalories / 9;
    const carbCalories = adjustedCalories - proteinCalories - fatCalories;
    const carbGrams = carbCalories / 4;

    return {
      calories: Math.round(adjustedCalories),
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fat: Math.round(fatGrams),
      fiber: 30,
    };
  }

  static aggregateMeals(meals: Meal[]) {
    return meals.reduce(
      (acc, meal) => ({
        totalCalories: acc.totalCalories + meal.totalCalories,
        totalProtein: acc.totalProtein + meal.totalProtein,
        totalCarbs: acc.totalCarbs + meal.totalCarbs,
        totalFat: acc.totalFat + meal.totalFat,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
    );
  }

  static calculateDailyNutrition(
    meals: Meal[],
    dailyTarget: DailyTarget,
  ): DailyNutrition {
    const aggregated = this.aggregateMeals(meals);

    return {
      date: new Date().toISOString().split('T')[0],
      meals,
      ...aggregated,
      dailyTarget,
      progress: {
        caloriesProgress: Math.min(
          100,
          Math.round((aggregated.totalCalories / dailyTarget.calories) * 100),
        ),
        proteinProgress: Math.min(
          100,
          Math.round((aggregated.totalProtein / dailyTarget.protein) * 100),
        ),
        carbsProgress: Math.min(
          100,
          Math.round((aggregated.totalCarbs / dailyTarget.carbs) * 100),
        ),
        fatProgress: Math.min(
          100,
          Math.round((aggregated.totalFat / dailyTarget.fat) * 100),
        ),
      },
    };
  }
}
