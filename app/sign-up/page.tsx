import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import SignUpForm from "@/components/forms/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up — MyOnlineResume.am",
};

const perks = [
  "Free resume builder — no credit card needed",
  "Public profile URL at myonlineresume.am/you",
  "PDF export included on all plans",
  "Upgrade or cancel anytime",
];

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-73px)] bg-[var(--bg2)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl grid md:grid-cols-[1fr_1.1fr] gap-6 items-center">

          {/* Left — value prop */}
          <div className="hidden md:block px-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--amber)] mb-4">
              Join for free
            </p>
            <h2 className="font-serif text-4xl tracking-tight leading-tight mb-5">
              Your career starts<br />with a great profile
            </h2>
            <p className="text-[var(--txt2)] leading-relaxed mb-8 text-sm">
              Thousands of Armenian professionals have already built their online presence with MyOnlineResume.am. It takes less than 5 minutes.
            </p>
            <ul className="space-y-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-[var(--accent2)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form card */}
          <div className="bg-white border border-[var(--border)] rounded-3xl p-8 shadow-sm">
            <div className="text-center mb-7">
              <Link href="/" className="font-serif text-2xl text-[var(--txt)] inline-block mb-5">
                MyOnline<span className="text-[var(--amber)]">Resume</span>.am
              </Link>
              <h1 className="font-serif text-3xl tracking-tight mb-1">Create your account</h1>
              <p className="text-sm text-[var(--txt2)]">Free forever. Upgrade when you&apos;re ready.</p>
            </div>

            <SignUpForm />

            <p className="text-center text-sm text-[var(--txt2)] mt-6">
              Already have an account?{" "}
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
