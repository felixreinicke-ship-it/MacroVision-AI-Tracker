'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { geminiClient } from '@/app/lib/gemini-client';
import { useNutritionStore } from '@/app/store/nutrition-store';
import { Meal } from '@/app/types/nutrition';

export function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { addMeal } = useNutritionStore();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadToast = toast.loading('Bild wird analysiert ...');
    setUploading(true);

    try {
      // Preview anzeigen
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);

      // Datei in Base64 umwandeln
      const base64 = await fileToBase64(file);

      // Bild von Gemini analysieren lassen
      const nutrition = await geminiClient.analyzeMealFromImage(base64);

      if (!nutrition.items || nutrition.items.length === 0) {
        throw new Error('Keine Mahlzeit erkannt');
      }

      const first = nutrition.items[0];

      const meal: Meal = {
        id: crypto.randomUUID(),
        name: first.name,
        estimatedGrams: first.estimatedGrams,
        calories: first.calories,
        protein: first.protein,
        carbs: first.carbs,
        fat: first.fat,
      };

      addMeal(meal);

      toast.success('✅ Mahlzeit aus Bild hinzugefügt!', { id: uploadToast });
    } catch (error) {
      console.error(error);
      toast.error('Bild-Analyse fehlgeschlagen.', { id: uploadToast });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-400 p-4 text-sm text-gray-600 hover:bg-gray-50">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <span>{uploading ? 'Lade hoch & analysiere ...' : 'Bild einer Mahlzeit hochladen'}</span>
        <span className="text-xs text-gray-400">JPG oder PNG, max. ein Bild</span>
      </label>

      {previewUrl && (
        <div className="overflow-hidden rounded-md border border-gray-200">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-48 w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
