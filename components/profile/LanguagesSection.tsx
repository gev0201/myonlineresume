"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Language {
  LanguageId: number;
  LevelId: number;
}

interface LanguageDict {
  Id: number;
  Language: string;
}

interface LanguageLevel {
  Id: number;
  Level: string;
}

interface LanguagesSectionProps {
  languages: Language[];
  setLanguages: (languages: Language[]) => void;
}

export default function LanguagesSection({
  languages,
  setLanguages,
}: LanguagesSectionProps) {
  const [availableLanguages, setAvailableLanguages] = useState<LanguageDict[]>([]);
  const [availableLevels, setAvailableLevels] = useState<LanguageLevel[]>([]);

  useEffect(() => {
    // Fetch available languages
    fetch("/api/languages")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAvailableLanguages(data.languages);
        }
      })
      .catch((error) => console.error("Error fetching languages:", error));

    // Fetch available levels
    fetch("/api/language-levels")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAvailableLevels(data.levels);
        }
      })
      .catch((error) => console.error("Error fetching language levels:", error));
  }, []);

  const addLanguage = () => {
    if (languages.length >= 6) {
      alert("Maximum 6 languages allowed");
      return;
    }
    setLanguages([
      ...languages,
      {
        LanguageId: availableLanguages[0]?.Id || 1,
        LevelId: availableLevels[0]?.Id || 1,
      },
    ]);
  };

  const removeLanguage = (index: number) => {
    const updated = languages.filter((_, i) => i !== index);
    setLanguages(updated);
  };

  const updateLanguage = (index: number, field: keyof Language, value: number) => {
    const updated = [...languages];
    updated[index][field] = value;
    setLanguages(updated);
  };

  return (
    <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Languages</h2>
        <button
          onClick={addLanguage}
          disabled={languages.length >= 6}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-semibold ${
            languages.length >= 6
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[var(--accent)] text-white hover:opacity-85"
          }`}
        >
          <Plus size={18} />
          Add Language {languages.length > 0 && `(${languages.length}/6)`}
        </button>
      </div>

      <div className="space-y-4">
        {languages.length === 0 ? (
          <p className="text-[var(--txt2)] text-center py-8">
            No languages added yet. Click "Add Language" to get started.
          </p>
        ) : (
          languages.map((lang, index) => (
            <div
              key={index}
              className="border-2 border-[var(--border)] rounded-2xl p-6 relative"
            >
              {/* Remove button */}
              <button
                onClick={() => removeLanguage(index)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove language"
              >
                <Trash2 size={18} />
              </button>

              <div className="grid md:grid-cols-2 gap-4 pr-12">
                {/* Language Select */}
                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Language
                  </label>
                  <select
                    value={lang.LanguageId}
                    onChange={(e) =>
                      updateLanguage(index, "LanguageId", parseInt(e.target.value))
                    }
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  >
                    {availableLanguages.map((language) => (
                      <option key={language.Id} value={language.Id}>
                        {language.Language}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Select */}
                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Proficiency Level
                  </label>
                  <select
                    value={lang.LevelId}
                    onChange={(e) =>
                      updateLanguage(index, "LevelId", parseInt(e.target.value))
                    }
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  >
                    {availableLevels.map((level) => (
                      <option key={level.Id} value={level.Id}>
                        {level.Level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {languages.length >= 6 && (
        <p className="text-sm text-[var(--txt2)] mt-4 text-center">
          Maximum of 6 languages reached
        </p>
      )}
    </div>
  );
}
