"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface SkillLevel {
  Id: number;
  Level: string;
}

interface Skill {
  [key: string]: number; // skill name: level id
}

interface Props {
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
}

export default function SkillsSection({ skills, setSkills }: Props) {
  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillLevels();
  }, []);

  const fetchSkillLevels = async () => {
    try {
      const response = await fetch("/api/skills-levels");
      const data = await response.json();
      if (data.success) {
        setSkillLevels(data.levels);
      }
    } catch (error) {
      console.error("Error fetching skill levels:", error);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    setSkills([...skills, { "": 1 }]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkillName = (index: number, oldName: string, newName: string) => {
    const updated = [...skills];
    const levelId = updated[index][oldName];
    delete updated[index][oldName];
    updated[index][newName] = levelId;
    setSkills(updated);
  };

  const updateSkillLevel = (index: number, skillName: string, levelId: number) => {
    const updated = [...skills];
    updated[index][skillName] = levelId;
    setSkills(updated);
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8">
        <h2 className="font-serif text-2xl mb-6">Skills</h2>
        <p className="text-[var(--txt2)] text-center py-8">Loading skill levels...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Skills</h2>
        <button
          onClick={addSkill}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-xl hover:opacity-85 transition-all text-sm font-semibold"
        >
          <Plus size={18} />
          Add Skill
        </button>
      </div>

      <div className="space-y-4">
        {skills.length === 0 ? (
          <p className="text-[var(--txt2)] text-center py-8">
            No skills added yet. Click "Add Skill" to get started.
          </p>
        ) : (
          skills.map((skill, index) => {
            const skillName = Object.keys(skill)[0];
            const levelId = skill[skillName];

            return (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => updateSkillName(index, skillName, e.target.value)}
                    placeholder="e.g., Selenium, JUnit, Postman"
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="w-48">
                  <select
                    value={levelId}
                    onChange={(e) =>
                      updateSkillLevel(index, skillName, parseInt(e.target.value))
                    }
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] bg-white"
                  >
                    {skillLevels.map((level) => (
                      <option key={level.Id} value={level.Id}>
                        {level.Level}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => removeSkill(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove skill"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
