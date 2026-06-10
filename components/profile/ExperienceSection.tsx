"use client";

import { Plus, Trash2, X, ChevronUp, ChevronDown } from "lucide-react";

interface Experience {
  Role: string;
  StartFrom: string;
  Till: string | null;
  Company: string;
  Number: number;
  Responsibilities: string[];
}

interface Props {
  experience: Experience[];
  setExperience: (exp: Experience[]) => void;
}

export default function ExperienceSection({ experience, setExperience }: Props) {
  const addExperience = () => {
    const newExp: Experience = {
      Role: "",
      StartFrom: "",
      Till: null,
      Company: "",
      Number: experience.length + 1,
      Responsibilities: [""],
    };
    setExperience([...experience, newExp]);
  };

  const removeExperience = (index: number) => {
    const updated = experience.filter((_, i) => i !== index);
    // Renumber experiences
    const renumbered = updated.map((exp, i) => ({ ...exp, Number: i + 1 }));
    setExperience(renumbered);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const addResponsibility = (expIndex: number) => {
    const updated = [...experience];
    updated[expIndex].Responsibilities.push("");
    setExperience(updated);
  };

  const removeResponsibility = (expIndex: number, respIndex: number) => {
    const updated = [...experience];
    updated[expIndex].Responsibilities = updated[expIndex].Responsibilities.filter(
      (_, i) => i !== respIndex
    );
    setExperience(updated);
  };

  const updateResponsibility = (expIndex: number, respIndex: number, value: string) => {
    const updated = [...experience];
    updated[expIndex].Responsibilities[respIndex] = value;
    setExperience(updated);
  };

  const moveExperienceUp = (index: number) => {
    if (index === 0) return;
    const updated = [...experience];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    // Renumber
    const renumbered = updated.map((exp, i) => ({ ...exp, Number: i + 1 }));
    setExperience(renumbered);
  };

  const moveExperienceDown = (index: number) => {
    if (index === experience.length - 1) return;
    const updated = [...experience];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    // Renumber
    const renumbered = updated.map((exp, i) => ({ ...exp, Number: i + 1 }));
    setExperience(renumbered);
  };

  const formatDateForInput = (dateStr: string | null) => {
    if (!dateStr) return "";
    // Convert "MM.YYYY" to "YYYY-MM" for input type="month"
    const [month, year] = dateStr.split(".");
    return `${year}-${month}`;
  };

  const formatDateForStorage = (dateStr: string) => {
    if (!dateStr) return "";
    // Convert "YYYY-MM" to "MM.YYYY"
    const [year, month] = dateStr.split("-");
    return `${month}.${year}`;
  };

  // Calculate min and max dates (last 90 years)
  const currentYear = new Date().getFullYear();
  const minDate = `${currentYear - 90}-01`;
  const maxDate = `${currentYear + 1}-12`;

  return (
    <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Work Experience</h2>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-xl hover:opacity-85 transition-all text-sm font-semibold"
        >
          <Plus size={18} />
          Add Experience
        </button>
      </div>

      <div className="space-y-6">
        {experience.length === 0 ? (
          <p className="text-[var(--txt2)] text-center py-8">
            No experience added yet. Click "Add Experience" to get started.
          </p>
        ) : (
          experience.map((exp, expIndex) => (
            <div
              key={expIndex}
              className="border-2 border-[var(--border)] rounded-2xl p-6 relative pt-16"
            >
              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                {/* Sort buttons */}
                <button
                  onClick={() => moveExperienceUp(expIndex)}
                  disabled={expIndex === 0}
                  className={`p-2 rounded-lg transition-colors ${
                    expIndex === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-[var(--accent)] hover:bg-[var(--bg2)]"
                  }`}
                  title="Move up (more recent)"
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  onClick={() => moveExperienceDown(expIndex)}
                  disabled={expIndex === experience.length - 1}
                  className={`p-2 rounded-lg transition-colors ${
                    expIndex === experience.length - 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-[var(--accent)] hover:bg-[var(--bg2)]"
                  }`}
                  title="Move down (older)"
                >
                  <ChevronDown size={18} />
                </button>
                {/* Remove button */}
                <button
                  onClick={() => removeExperience(expIndex)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove experience"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    value={exp.Role}
                    onChange={(e) => updateExperience(expIndex, "Role", e.target.value)}
                    placeholder="e.g., QA Lead"
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={exp.Company}
                    onChange={(e) => updateExperience(expIndex, "Company", e.target.value)}
                    placeholder="e.g., Armanis LLC"
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Start Date (MM.YYYY)
                  </label>
                  <input
                    type="text"
                    value={exp.StartFrom}
                    onChange={(e) => updateExperience(expIndex, "StartFrom", e.target.value)}
                    placeholder="MM.YYYY (e.g., 05.2020)"
                    pattern="\d{2}\.\d{4}"
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                  <p className="text-xs text-[var(--txt3)] mt-1">Format: MM.YYYY</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    End Date (leave empty if current)
                  </label>
                  <input
                    type="text"
                    value={exp.Till || ""}
                    onChange={(e) =>
                      updateExperience(expIndex, "Till", e.target.value || null)
                    }
                    placeholder="MM.YYYY (e.g., 11.2025)"
                    pattern="\d{2}\.\d{4}"
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                  <p className="text-xs text-[var(--txt3)] mt-1">Format: MM.YYYY or leave empty</p>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-[var(--txt2)]">
                    Responsibilities
                  </label>
                  <button
                    onClick={() => addResponsibility(expIndex)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-[var(--accent)] hover:bg-[var(--bg2)] rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {exp.Responsibilities.map((resp, respIndex) => (
                    <div key={respIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) =>
                          updateResponsibility(expIndex, respIndex, e.target.value)
                        }
                        placeholder="Describe your responsibility..."
                        className="flex-1 px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                      />
                      {exp.Responsibilities.length > 1 && (
                        <button
                          onClick={() => removeResponsibility(expIndex, respIndex)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Position number indicator */}
              <div className="mt-4 text-xs text-[var(--txt3)]">
                Position #{exp.Number} (1 = most recent)
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
