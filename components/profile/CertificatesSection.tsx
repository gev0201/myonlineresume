"use client";

import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  certificates: string;
  setCertificates: (certs: string) => void;
}

export default function CertificatesSection({ certificates, setCertificates }: Props) {
  const [certList, setCertList] = useState<string[]>([]);

  useEffect(() => {
    // Parse certificates string into array
    if (certificates) {
      const parsed = certificates.split("\n").filter((c) => c.trim() !== "");
      setCertList(parsed.length > 0 ? parsed : [""]);
    } else {
      setCertList([""]);
    }
  }, [certificates]);

  const updateCertificates = (list: string[]) => {
    setCertList(list);
    // Join array back to string
    setCertificates(list.filter((c) => c.trim() !== "").join("\n"));
  };

  const addCertificate = () => {
    updateCertificates([...certList, ""]);
  };

  const removeCertificate = (index: number) => {
    updateCertificates(certList.filter((_, i) => i !== index));
  };

  const updateCertificate = (index: number, value: string) => {
    const updated = [...certList];
    updated[index] = value;
    updateCertificates(updated);
  };

  return (
    <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Certificates & Certifications</h2>
        <button
          onClick={addCertificate}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-xl hover:opacity-85 transition-all text-sm font-semibold"
        >
          <Plus size={18} />
          Add Certificate
        </button>
      </div>

      <div className="space-y-3">
        {certList.map((cert, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={cert}
              onChange={(e) => updateCertificate(index, e.target.value)}
              placeholder="e.g., AWS Certified Solutions Architect"
              className="flex-1 px-4 py-2 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
            />
            {certList.length > 1 && (
              <button
                onClick={() => removeCertificate(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove certificate"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
