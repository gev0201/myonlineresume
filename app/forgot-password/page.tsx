import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password — MyOnlineResume.am",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-73px)] bg-[var(--bg2)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white border border-[var(--border)] rounded-3xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <Link href="/" className="font-serif text-2xl text-[var(--txt)] inline-block mb-6">
                MyOnline<span className="text-[var(--amber)]">Resume</span>.am
              </Link>
              <h1 className="font-serif text-3xl tracking-tight mb-3">Forgot your password?</h1>
              <p className="text-sm text-[var(--txt2)] leading-relaxed">
                Enter your email address and we&apos;ll send you a temporary password to get back into your account.
              </p>
            </div>

            <ForgotPasswordForm />

            <p className="text-center text-sm text-[var(--txt2)] mt-6">
              Remembered your password?{" "}
              <Link href="/sign-in" className="font-semibold text-[var(--txt)] hover:text-[var(--amber)] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
