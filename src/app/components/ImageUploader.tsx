'use client';

import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNutritionStore } from '@/app/store/nutrition-store';
import { userStore } from '@/app/store/user-store';
import { geminiClient } from '@/app/lib/gemini-client';

function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface ImageUploaderProps {
  onMealDetected?: (meal: any) => void;
}

export function ImageUploader({ onMealDetected }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { apiKey } = userStore();
  const { addMeal } = useNutritionStore();

  const handleImageChange = async (file: File) => {
    if (!apiKey) {
      toast.error('API-Key nicht konfiguriert!');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const base64 = await imageToBase64(file);

      geminiClient.initialize(apiKey);

      toast.loading('🍴 Analysiere Bild...');
      const nutrition = await geminiClient.analyzeMealFromImage(base64);

      const meal = {
        id: `meal-${Date.now()}`,
        name: 'Mahlzeit vom Foto',
        items: nutrition.items,
        totalCalories: nutrition.totalCalories,
        totalProtein: nutrition.totalProtein,
        totalCarbs: nutrition.totalCarbs,
        totalFat: nutrition.totalFat,
        imageUrl: preview || undefined,
        createdAt: new Date().toISOString(),
      };

      addMeal(meal);
      toast.dismiss();
      toast.success(`✅ ${nutrition.items.length} Lebensmittel erkannt!`);

      onMealDetected?.(meal);

      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Fehler beim Analysieren des Bildes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-2 border-dashed border-blue-300">
      <h3 className="text-lg font-semibold mb-4">📸 Foto-Tracking</h3>

      {preview && (
        <div className="mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 rounded-lg mx-auto"
          />
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="flex-1 btn-primary disabled:opacity-50"
        >
          📁 Datei auswählen
        </button>
        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={loading}
          className="flex-1 btn-primary disabled:opacity-50"
        >
          📷 Kamera
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleImageChange(e.target.files[0]);
          }
        }}
        hidden
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleImageChange(e.target.files[0]);
          }
        }}
        hidden
      />

      {loading && (
        <p className="mt-4 text-center text-sm text-gray-500">
          ⏳ Wird verarbeitet...
        </p>
      )}
    </div>
  );
}
