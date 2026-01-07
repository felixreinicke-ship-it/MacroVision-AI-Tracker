import { create } from 'zustand';
import { UserProfile, UserPreferences } from '@/app/types/user';
import { DailyTarget } from '@/app/types/nutrition';
import { NutritionAnalyzer } from '@/app/lib/nutrition-analyzer';

interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences;
  apiKey: string | null;
  dailyTargets: DailyTarget | null;
  setProfile: (profile: UserProfile) => void;
  setApiKey: (key: string) => void;
}

export const userStore = create<UserState>((set) => ({
  profile: null,
  preferences: {
    theme: 'auto',
    notifications: true,
    dailyReminder: '08:00',
    mealsPerDay: 3,
  },
  apiKey: null,
  dailyTargets: null,

  setProfile: (profile) => {
    const targets = NutritionAnalyzer.calculateDailyTarget(
      profile.age,
      profile.heightCm,
      profile.weightKg,
      profile.activityLevel,
      profile.goal,
    );

    set({
      profile,
      dailyTargets: targets,
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('user_profile', JSON.stringify(profile));
    }
  },

  setApiKey: (key) => {
    set({ apiKey: key });
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', key);
    }
  },
}));
