export type ActivityLevel = 'low' | 'medium' | 'high';
export type Goal = 'lose' | 'maintain' | 'gain';
export type Gender = 'male' | 'female' | 'other';

export interface UserProfile {
  id: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  createdAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  dailyReminder: string; // "08:00"
  mealsPerDay: number;
}
