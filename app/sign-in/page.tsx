import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SignInForm from "@/components/forms/SignInForm";

export const metadata: Metadata = {
  title: "Sign In — MyOnlineResume.am",
};

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-73px)] bg-[var(--bg2)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white border border-[var(--border)] rounded-3xl p-8 shadow-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/" className="font-serif text-2xl text-[var(--txt)] inline-block mb-6">
                MyOnline<span className="text-[var(--amber)]">Resume</span>.am
              </Link>
              <h1 className="font-serif text-3xl tracking-tight mb-1.5">Welcome back</h1>
              <p className="text-sm text-[var(--txt2)]">Sign in to your account to continue</p>
            </div>

            <SignInForm />

            {/* Footer */}
            <p className="text-center text-sm text-[var(--txt2)] mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-semibold text-[var(--txt)] hover:text-[var(--amber)] transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
