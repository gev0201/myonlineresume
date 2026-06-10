"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ExperienceSection from "@/components/profile/ExperienceSection";
import EducationSection from "@/components/profile/EducationSection";
import SkillsSection from "@/components/profile/SkillsSection";
import CertificatesSection from "@/components/profile/CertificatesSection";
import LanguagesSection from "@/components/profile/LanguagesSection";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userUrl: string;
}

interface ProfileData {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Address: string | null;
  Summary: string | null;
  Experience: any[] | null;
  Education: any[] | null;
  Skills: any[] | null;
  Certificates: string | null;
  Hobbies: string | null;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [summary, setSummary] = useState("");
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certificates, setCertificates] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [languages, setLanguages] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/sign-in");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch profile data
    fetchProfileData(parsedUser.id);
  }, [router]);

  const fetchProfileData = async (userId: number) => {
    try {
      const response = await fetch(`/api/profile/${userId}`);
      const data = await response.json();

      if (data.success) {
        const profile: ProfileData = data.profile;
        setFirstName(profile.FirstName || "");
        setLastName(profile.LastName || "");
        setEmail(profile.Email || "");
        setPhone(profile.Phone || "");
        setAddress(profile.Address || "");
        setSummary(profile.Summary || "");
        setExperience(profile.Experience || []);
        setEducation(profile.Education || []);
        setSkills(profile.Skills || []);
        setCertificates(profile.Certificates || "");
        setHobbies(profile.Hobbies || "");
      }

      // Fetch languages separately
      const langResponse = await fetch(`/api/profile-languages/${userId}`);
      const langData = await langResponse.json();
      if (langData.success) {
        setLanguages(langData.languages || []);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          address,
          summary,
          experience: JSON.stringify(experience),
          education: JSON.stringify(education),
          skills: JSON.stringify(skills),
          certificates,
          hobbies,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save languages separately
        const langResponse = await fetch(`/api/profile-languages/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ languages }),
        });
        const langData = await langResponse.json();
        if (!langData.success) {
          throw new Error("Failed to save languages");
        }

        setSuccess("Profile updated successfully!");
        // Update localStorage
        const updatedUser = { ...user, firstName, lastName, email, phone };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setTimeout(() => {
          router.push(`/${user.userUrl}`);
        }, 1500);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-73px)] bg-[var(--bg2)] flex items-center justify-center">
          <p className="text-lg text-[var(--txt2)]">Loading profile...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-73px)] bg-[var(--bg2)] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl tracking-tight mb-2">Edit Profile</h1>
            <p className="text-[var(--txt2)]">Update your professional information</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">
              {success}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8">
              <h2 className="font-serif text-2xl mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--txt2)] mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="City, Country"
                    maxLength={300}
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8">
              <h2 className="font-serif text-2xl mb-6">Professional Summary</h2>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write a brief summary about yourself..."
                rows={6}
                className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] resize-none"
              />
            </div>

            {/* Experience */}
            <ExperienceSection experience={experience} setExperience={setExperience} />

            {/* Education */}
            <EducationSection education={education} setEducation={setEducation} />

            {/* Skills */}
            <SkillsSection skills={skills} setSkills={setSkills} />

            {/* Certificates */}
            <CertificatesSection certificates={certificates} setCertificates={setCertificates} />

            {/* Languages */}
            <LanguagesSection languages={languages} setLanguages={setLanguages} />

            {/* Hobbies */}
            <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8">
              <h2 className="font-serif text-2xl mb-6">Hobbies & Interests</h2>
              <textarea
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                placeholder="Your hobbies and interests..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => router.back()}
                className="px-8 py-3 border-2 border-[var(--border)] rounded-xl font-semibold hover:bg-[var(--bg2)] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-8 py-3 rounded-xl font-semibold text-white transition-all ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--accent)] hover:opacity-85"
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
