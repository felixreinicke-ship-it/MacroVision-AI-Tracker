// src/app/components/ImageUploader.tsx
'use client';

import { useState } from 'react';
import { geminiClient } from '@/app/lib/gemini-client';
import type { NutritionItem, NutritionData } from '@/app/types/nutrition';

interface ImageUploaderProps {
  onMealDetected: (meal: NutritionItem) => void;
}

export default function ImageUploader({ onMealDetected }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // File -> Base64-String
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Liefert NutritionData (gesamt), nicht nur ein Item
      const result = (await geminiClient.analyzeMealFromImage(
        base64,
      )) as NutritionData;

      // Nimm das erste Item als Mahlzeit
      const meal = result.items[0] as NutritionItem;

      if (!meal) {
        throw new Error('Keine Mahlzeit im Analyse-Ergebnis gefunden.');
      }

      onMealDetected(meal);
    } catch (error: any) {
      console.error(error);
      alert('Analyse des Bildes ist fehlgeschlagen: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700"
      />
      {loading && (
        <p className="text-sm text-gray-500">Analysiere Bild ...</p>
      )}
      <p className="text-xs text-gray-400">
        Tipp: Mach ein klares Foto von deinem Teller.
      </p>
    </div>
  );
}
