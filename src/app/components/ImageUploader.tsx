'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNutritionStore } from '@/app/store/nutrition-store';
import { geminiClient } from '@/app/lib/gemini-client';

function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result.split(',')[1] ?? '');
      } else {
        reject(new Error('Fehler beim Lesen der Datei'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImageUploader() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { addMeal } = useNutritionStore();

  const handleImageChange = async (file: File) => {
    if (!file) return;

    setLoading(true);
    const uploadToast = toast.loading('Bild wird analysiert ...');

    try {
      // Preview fürs UI
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      const base64 = await imageToBase64(file);

      const response = await geminiClient.analyzeImage(base64);

      // Erwartet, dass deine analyzeImage-Funktion ein NutritionItem-kompatibles Objekt zurückgibt
      const meal = response.meal; // ggf. an deine Struktur anpassen

      addMeal(meal);

      toast.success('✅ Mahlzeit hinzugefügt!', { id: uploadToast });
    } catch (error: any) {
      console.error(error);
      toast.error('Analyse fehlgeschlagen. Bitte versuch es nochmal.', {
        id: uploadToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 cursor-pointer hover:border-gray-400">
        <span className="mb-2 text-sm text-gray-500">
          {loading ? 'Bild wird hochgeladen ...' : 'Klicke hier, um ein Bild hochzuladen'}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              void handleImageChange(file);
            }
          }}
          disabled={loading}
        />
      </label>

      {preview && (
        <div className="mt-2">
          <p className="mb-1 text-sm text-gray-500">Vorschau:</p>
          <img
            src={preview}
            alt="Meal preview"
            className="max-h-64 w-auto rounded-lg object-cover"
          />
        </div>
      )}
    </div>
  );
}
