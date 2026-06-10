import { notFound } from 'next/navigation';
import pool from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

interface UserProfileData {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Address: string | null;
  IsActive: boolean;
  UserUrl: string;
  Summary: string | null;
  Experience: any;
  Education: any;
  Skills: any;
  Certificates: string | null;
  Hobbies: string | null;
}

async function getUserProfile(userUrl: string): Promise<UserProfileData | null> {
  try {
    const result = await pool.query(
      `SELECT u."Id", u."FirstName", u."LastName", u."Email", u."Phone", u."Address", u."IsActive", 
              p."UserUrl", p."Summary", p."Experience", p."Education", p."Skills", p."Certificates", p."Hobbies"
       FROM "Profiles" p
       JOIN "Users" u ON p."UserId" = u."Id"
       WHERE p."UserUrl" = $1 AND u."IsActive" = true`,
      [userUrl]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userUrl: string }>;
}) {
  const { userUrl } = await params;
  const userProfile = await getUserProfile(userUrl);

  if (!userProfile) {
    notFound();
  }

  // Parse JSON fields
  const experience = userProfile.Experience ? JSON.parse(JSON.stringify(userProfile.Experience)) : [];
  const education = userProfile.Education ? JSON.parse(JSON.stringify(userProfile.Education)) : [];
  const skills = userProfile.Skills ? JSON.parse(JSON.stringify(userProfile.Skills)) : [];
  const certificates = userProfile.Certificates ? userProfile.Certificates.split('\n').filter((c: string) => c.trim()) : [];

  // Sort experience by Number (1 = most recent)
  const sortedExperience = [...experience].sort((a: any, b: any) => a.Number - b.Number);

  // Fetch skill levels
  async function getSkillLevels() {
    try {
      const result = await pool.query(
        'SELECT "Id", "Level" FROM "SkillsLevelDict" ORDER BY "Id" ASC'
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching skill levels:', error);
      return [];
    }
  }

  // Fetch languages (we'll do this server-side)
  async function getUserLanguages(userId: number) {
    try {
      const result = await pool.query(
        `SELECT pl."LanguageId", pl."LevelId", ld."Language", ll."Level"
         FROM "ProfileLanguages" pl
         JOIN "LanguageDicts" ld ON pl."LanguageId" = ld."Id"
         JOIN "LanguageLevelDict" ll ON pl."LevelId" = ll."Id"
         WHERE pl."UserId" = $1
         ORDER BY pl."Id" ASC`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  }

  const skillLevels = await getSkillLevels();
  const skillLevelsMap = skillLevels.reduce((acc: any, level: any) => {
    acc[level.Id] = level.Level;
    return acc;
  }, {});

  const languages = await getUserLanguages(userProfile.Id);

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-73px)] bg-[var(--bg2)] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8 md:p-12 shadow-sm mb-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--amber)] to-[#d4944f] flex items-center justify-center text-white text-3xl font-serif mx-auto mb-4">
                {userProfile.FirstName.charAt(0)}
                {userProfile.LastName.charAt(0)}
              </div>
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-2">
                {userProfile.FirstName} {userProfile.LastName}
              </h1>
              {userProfile.Address && (
                <p className="text-[var(--txt2)] text-lg mb-2">📍 {userProfile.Address}</p>
              )}
              <div className="flex flex-wrap justify-center gap-4 text-sm text-[var(--txt2)] mb-4">
                <span>✉️ {userProfile.Email}</span>
                <span>📞 {userProfile.Phone}</span>
              </div>
              <Link
                href="/profile/edit"
                className="inline-block bg-[var(--accent)] text-white px-6 py-2.5 rounded-xl hover:opacity-85 transition-all text-sm font-semibold"
              >
                ✏️ Edit Profile
              </Link>
            </div>
          </div>

          {/* Professional Summary */}
          {userProfile.Summary && (
            <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8 shadow-sm mb-6">
              <h2 className="font-serif text-2xl mb-4">Professional Summary</h2>
              <p className="text-[var(--txt2)] leading-relaxed whitespace-pre-wrap">
                {userProfile.Summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {sortedExperience.length > 0 && (
            <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8 shadow-sm mb-6">
              <h2 className="font-serif text-2xl mb-6">Work Experience</h2>
              <div className="space-y-6">
                {sortedExperience.map((exp: any, index: number) => (
                  <div key={index} className="border-l-4 border-[var(--amber)] pl-6 pb-6 last:pb-0">
                    <h3 className="text-xl font-semibold text-[var(--txt)] mb-1">
                      {exp.Role}
                    </h3>
                    <p className="text-[var(--accent)] font-medium mb-2">{exp.Company}</p>
                    <p className="text-sm text-[var(--txt2)] mb-3">
                      {exp.StartFrom} - {exp.Till || 'Present'}
                    </p>
                    {exp.Responsibilities && exp.Responsibilities.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-[var(--txt2)]">
                        {exp.Responsibilities.map((resp: string, i: number) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8 shadow-sm mb-6">
              <h2 className="font-serif text-2xl mb-6">Education</h2>
              <div className="space-y-6">
                {education.map((edu: any, index: number) => (
                  <div key={index} className="border-l-4 border-[var(--amber)] pl-6">
                    <h3 className="text-xl font-semibold text-[var(--txt)] mb-1">
                      {edu.Occupation}
                    </h3>
                    <p className="text-[var(--accent)] font-medium mb-2">
                      {edu.EducInstitution}
                    </p>
                    <p className="text-sm text-[var(--txt2)]">
                      📍 {edu.Place} • {edu.From} - {edu.Till}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8 shadow-sm mb-6">
              <h2 className="font-serif text-2xl mb-6">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill: any, index: number) => {
                  const skillName = Object.keys(skill)[0];
                  const levelId = skill[skillName];
                  const levelName = skillLevelsMap[levelId] || `Level ${levelId}`;
                  return (
                    <div
                      key={index}
                      className="bg-[var(--bg2)] px-4 py-2 rounded-xl border-2 border-[var(--border)]"
                    >
                      <span className="font-medium">{skillName}</span>
                      <span className="text-[var(--txt2)] text-sm ml-2">
                        ({levelName})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8 shadow-sm mb-6">
              <h2 className="font-serif text-2xl mb-6">Certificates & Certifications</h2>
              <ul className="space-y-2">
                {certificates.map((cert: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[var(--amber)] mt-1">🏆</span>
                    <span className="text-[var(--txt2)]">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8 shadow-sm mb-6">
              <h2 className="font-serif text-2xl mb-6">Languages</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {languages.map((lang: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-[var(--bg2)] px-4 py-3 rounded-xl border-2 border-[var(--border)]"
                  >
                    <span className="font-medium text-[var(--txt)]">{lang.Language}</span>
                    <span className="text-sm text-[var(--txt2)] bg-white px-3 py-1 rounded-lg">
                      {lang.Level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {userProfile.Hobbies && (
            <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8 shadow-sm mb-6">
              <h2 className="font-serif text-2xl mb-4">Hobbies & Interests</h2>
              <p className="text-[var(--txt2)] leading-relaxed whitespace-pre-wrap">
                {userProfile.Hobbies}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userUrl: string }>;
}) {
  const { userUrl } = await params;
  const userProfile = await getUserProfile(userUrl);

  if (!userProfile) {
    return {
      title: 'Profile Not Found — MyOnlineResume.am',
    };
  }

  return {
    title: `${userProfile.FirstName} ${userProfile.LastName} — MyOnlineResume.am`,
    description: `View the professional profile of ${userProfile.FirstName} ${userProfile.LastName} on MyOnlineResume.am`,
  };
}
