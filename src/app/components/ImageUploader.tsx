'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNutritionStore } from '@/app/store/nutrition-store';

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
    const uploadToast = toast.loading('Bild wird verarbeitet ...');

    try {
      // Preview im UI anzeigen
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Bild in base64 umwandeln
      const base64 = await imageToBase64(file);

      // TODO: Hier später deine echte Analyse-Funktion aufrufen
      // z.B.: const meal = await analyzeImageWithGemini(base64);

      // Temporärer Dummy-Eintrag, damit der Typ passt
      const meal = {
        name: 'Foto-Mahlzeit',
        estimatedGrams: 100,
        calories: 250,
        protein: 10,
        carbs: 30,
        fat: 8,
      };

      addMeal(meal);

      toast.success('✅ Mahlzeit aus Bild hinzugefügt!', { id: uploadToast });
    } catch (error) {
      console.error(error);
      toast.error('Verarbeitung fehlgeschlagen.', { id: uploadToast });
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
