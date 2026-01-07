'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/user-store';
import toast from 'react-hot-toast';
import { geminiClient } from '@/app/lib/gemini-client';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, setProfile, setApiKey } = useUserStore();
  const [step, setStep] = useState<'profile' | 'api'>('profile');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile && useUserStore.getState().apiKey) {
      router.push('/dashboard');
    }
  }, [profile, router]);

  const [profileData, setProfileData] = useState({
    age: '',
    gender: 'male' as const,
    heightCm: '',
    weightKg: '',
    activityLevel: 'medium' as const,
    goal: 'maintain' as const,
  });

  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData.age || !profileData.heightCm || !profileData.weightKg) {
      toast.error('Bitte fülle alle Felder aus');
      return;
    }

    setProfile({
      age: parseInt(profileData.age),
      gender: profileData.gender,
      heightCm: parseInt(profileData.heightCm),
      weightKg: parseFloat(profileData.weightKg),
      activityLevel: profileData.activityLevel,
      goal: profileData.goal,
    });

    toast.success('✅ Profil erstellt!');
    setStep('api');
  };

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKeyInput.trim()) {
      toast.error('Bitte gib einen API-Key ein');
      return;
    }

    setLoading(true);
    try {
      geminiClient.initialize(apiKeyInput);
      setApiKey(apiKeyInput);
      toast.success('✅ API-Key gespeichert!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error('❌ API-Key ungültig: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2">🍎</h1>
        <h2 className="text-3xl font-bold text-center mb-1 text-gray-900">
          MacroVision
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Dein KI-Kalorientracker
        </p>

        {step === 'profile' ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="label">Alter</label>
              <input
                type="number"
                value={profileData.age}
                onChange={(e) =>
                  setProfileData({ ...profileData, age: e.target.value })
                }
                className="input-field"
                placeholder="z.B. 16"
                required
              />
            </div>

            <div>
              <label className="label">Geschlecht</label>
              <select
                value={profileData.gender}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    gender: e.target.value as any,
                  })
                }
                className="input-field"
              >
                <option value="male">Männlich</option>
                <option value="female">Weiblich</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>

            <div>
              <label className="label">Größe (cm)</label>
              <input
                type="number"
                value={profileData.heightCm}
                onChange={(e) =>
                  setProfileData({ ...profileData, heightCm: e.target.value })
                }
                className="input-field"
                placeholder="z.B. 180"
                required
              />
            </div>

            <div>
              <label className="label">Gewicht (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profileData.weightKg}
                onChange={(e) =>
                  setProfileData({ ...profileData, weightKg: e.target.value })
                }
                className="input-field"
                placeholder="z.B. 70"
                required
              />
            </div>

            <div>
              <label className="label">Aktivitätslevel</label>
              <select
                value={profileData.activityLevel}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    activityLevel: e.target.value as any,
                  })
                }
                className="input-field"
              >
                <option value="low">Niedrig (Schule, wenig Sport)</option>
                <option value="medium">Mittel (3x Sport/Woche)</option>
                <option value="high">Hoch (5x+ Sport/Woche)</option>
              </select>
            </div>

            <div>
              <label className="label">Ziel</label>
              <select
                value={profileData.goal}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    goal: e.target.value as any,
                  })
                }
                className="input-field"
              >
                <option value="lose">Gewicht verlieren</option>
                <option value="maintain">Gewicht halten</option>
                <option value="gain">Muskelaufbau</option>
              </select>
            </div>

            <button type="submit" className="w-full btn-primary">
              Weiter zum API-Key →
            </button>
          </form>
        ) : (
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                🔑 <strong>Kostenlos!</strong> Hole dir einen API-Key:
              </p>
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm font-semibold"
              >
                → aistudio.google.com
              </a>
            </div>

            <div>
              <label className="label">Gemini API-Key</label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="input-field"
                placeholder="Paste dein API-Key"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                🔒 Wird lokal im Browser gespeichert. Niemals an einen Server
                gesendet.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('profile')}
                className="flex-1 btn-secondary"
              >
                ← Zurück
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? '⏳ Wird geprüft...' : '✅ Los geht&apos;s!'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
