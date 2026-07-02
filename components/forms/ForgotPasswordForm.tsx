"use client";

import { useState, FormEvent } from "react";
import { Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setSent(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h3 className="font-semibold text-lg text-[var(--txt)] mb-2">Check your inbox</h3>
        <p className="text-sm text-[var(--txt2)] leading-relaxed">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a temporary password. Check your email and follow the instructions.
        </p>
        <p className="text-xs text-[var(--txt3)] mt-4">
          Don&apos;t forget to check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-[var(--txt2)] mb-1.5 uppercase tracking-wide">
          Email address
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--txt3)]" />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="armen@example.am"
            className="w-full pl-11 pr-4 py-3 border-2 border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !email.trim()}
        className={`w-full text-white text-sm font-semibold uppercase tracking-wider py-3.5 rounded-xl transition-all ${
          isSubmitting || !email.trim()
            ? "bg-gray-400 cursor-not-allowed opacity-60"
            : "bg-[var(--accent)] hover:opacity-85 cursor-pointer"
        }`}
      >
        {isSubmitting ? "Sending..." : "Reset password"}
      </button>
    </form>
  );
}
