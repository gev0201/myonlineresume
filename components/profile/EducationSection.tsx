"use client";

import { Plus, Trash2 } from "lucide-react";

interface Education {
  From: string;
  Till: string;
  Place: string;
  Occupation: string;
  EducInstitution: string;
}

interface Props {
  education: Education[];
  setEducation: (edu: Education[]) => void;
}

export default function EducationSection({ education, setEducation }: Props) {
  const addEducation = () => {
    const newEdu: Education = {
      From: "",
      Till: "",
      Place: "",
      Occupation: "",
      EducInstitution: "",
    };
    setEducation([...education, newEdu]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    // Convert "MM.YYYY" to "YYYY-MM"
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
  const maxDate = `${currentYear + 10}-12`;

  return (
    <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Education</h2>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-xl hover:opacity-85 transition-all text-sm font-semibold"
        >
          <Plus size={18} />
          Add Education
        </button>
      </div>

      <div className="space-y-6">
        {education.length === 0 ? (
          <p className="text-[var(--txt2)] text-center py-8">
            No education added yet. Click "Add Education" to get started.
          </p>
        ) : (
          education.map((edu, index) => (
            <div
              key={index}
              className="border-2 border-[var(--border)] rounded-2xl p-6 relative"
            >
              <button
                onClick={() => removeEducation(index)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove education"
              >
                <Trash2 size={18} />
              </button>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={edu.EducInstitution}
                    onChange={(e) =>
                      updateEducation(index, "EducInstitution", e.target.value)
                    }
                    placeholder="e.g., State Engineering University of Armenia"
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Degree / Occupation
                  </label>
                  <input
                    type="text"
                    value={edu.Occupation}
                    onChange={(e) => updateEducation(index, "Occupation", e.target.value)}
                    placeholder="e.g., IT Network Administration"
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={edu.Place}
                    onChange={(e) => updateEducation(index, "Place", e.target.value)}
                    placeholder="e.g., Armenia, Yerevan"
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Start Date (MM.YYYY)
                  </label>
                  <input
                    type="text"
                    value={edu.From}
                    onChange={(e) => updateEducation(index, "From", e.target.value)}
                    placeholder="MM.YYYY (e.g., 09.2000)"
                    pattern="\d{2}\.\d{4}"
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                  <p className="text-xs text-[var(--txt3)] mt-1">Format: MM.YYYY</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    End Date (MM.YYYY)
                  </label>
                  <input
                    type="text"
                    value={edu.Till}
                    onChange={(e) => updateEducation(index, "Till", e.target.value)}
                    placeholder="MM.YYYY (e.g., 06.2005)"
                    pattern="\d{2}\.\d{4}"
                    className="w-full px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                  <p className="text-xs text-[var(--txt3)] mt-1">Format: MM.YYYY</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
