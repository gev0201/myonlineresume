import { notFound } from 'next/navigation';
import pool from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface UserProfileData {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Address: string | null;
  IsActive: boolean;
  UserUrl: string;
}

async function getUserProfile(userUrl: string): Promise<UserProfileData | null> {
  try {
    const result = await pool.query(
      `SELECT u."Id", u."FirstName", u."LastName", u."Email", u."Phone", u."Address", u."IsActive", p."UserUrl"
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

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-73px)] bg-[var(--bg2)] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8 md:p-12 shadow-sm">
            {/* Header */}
            <div className="text-center mb-10 pb-8 border-b-2 border-[var(--border)]">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--amber)] to-[#d4944f] flex items-center justify-center text-white text-3xl font-serif mx-auto mb-4">
                {userProfile.FirstName.charAt(0)}
                {userProfile.LastName.charAt(0)}
              </div>
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-2">
                {userProfile.FirstName} {userProfile.LastName}
              </h1>
              <p className="text-[var(--txt2)] text-lg">
                myonlineresume.am/{userProfile.UserUrl}
              </p>
            </div>

            {/* User Information */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl tracking-tight mb-6 text-[var(--txt)]">
                Profile Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="bg-[var(--bg2)] rounded-2xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--txt2)] mb-2">
                    First Name
                  </p>
                  <p className="text-lg font-medium text-[var(--txt)]">
                    {userProfile.FirstName}
                  </p>
                </div>

                {/* Last Name */}
                <div className="bg-[var(--bg2)] rounded-2xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--txt2)] mb-2">
                    Last Name
                  </p>
                  <p className="text-lg font-medium text-[var(--txt)]">
                    {userProfile.LastName}
                  </p>
                </div>

                {/* Email */}
                <div className="bg-[var(--bg2)] rounded-2xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--txt2)] mb-2">
                    Email Address
                  </p>
                  <p className="text-lg font-medium text-[var(--txt)] break-all">
                    {userProfile.Email}
                  </p>
                </div>

                {/* Phone */}
                <div className="bg-[var(--bg2)] rounded-2xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--txt2)] mb-2">
                    Phone Number
                  </p>
                  <p className="text-lg font-medium text-[var(--txt)]">
                    {userProfile.Phone}
                  </p>
                </div>

                {/* User ID */}
                <div className="bg-[var(--bg2)] rounded-2xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--txt2)] mb-2">
                    User ID
                  </p>
                  <p className="text-lg font-medium text-[var(--txt)]">
                    #{userProfile.Id}
                  </p>
                </div>

                {/* Account Status */}
                <div className="bg-[var(--bg2)] rounded-2xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--txt2)] mb-2">
                    Account Status
                  </p>
                  <p className="text-lg font-medium">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-green-600 font-semibold">Active</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Address (if available) */}
              {userProfile.Address && (
                <div className="bg-[var(--bg2)] rounded-2xl p-5 mt-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--txt2)] mb-2">
                    Address
                  </p>
                  <p className="text-lg font-medium text-[var(--txt)]">
                    {userProfile.Address}
                  </p>
                </div>
              )}

              {/* Profile URL */}
              <div className="bg-gradient-to-br from-[var(--accent)] to-[#2a2a2a] rounded-2xl p-6 mt-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-2">
                  Your Profile URL
                </p>
                <p className="text-xl font-medium break-all">
                  https://myonlineresume.am/{userProfile.UserUrl}
                </p>
              </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="mt-10 pt-8 border-t-2 border-[var(--border)] text-center">
              <p className="text-sm text-[var(--txt2)]">
                🚧 Profile editing and resume builder features coming soon!
              </p>
            </div>
          </div>
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
