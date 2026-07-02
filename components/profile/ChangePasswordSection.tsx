"use client";

import { useState } from "react";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

interface Props {
  userId: number;
}

export default function ChangePasswordSection({ userId }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValid =
    currentPassword.length >= 1 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, currentPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Failed to change password.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-8">
      <h2 className="font-serif text-2xl mb-2">Change Password</h2>
      <p className="text-sm text-[var(--txt2)] mb-6">Update your account password. You&apos;ll receive a confirmation email.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
          <CheckCircle size={16} />
          Password changed successfully!
        </div>
      )}

      <div className="space-y-4 max-w-md">
        {/* Current password */}
        <div>
          <label className="block text-xs font-medium text-[var(--txt2)] mb-1.5 uppercase tracking-wide">
            Current password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setError(""); setSuccess(false); }}
              placeholder="Your current password"
              className="w-full px-4 py-3 pr-11 border-2 border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--txt3)] hover:text-[var(--txt)]">
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label className="block text-xs font-medium text-[var(--txt2)] mb-1.5 uppercase tracking-wide">
            New password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setError(""); setSuccess(false); }}
              placeholder="Min. 8 characters"
              className="w-full px-4 py-3 pr-11 border-2 border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--txt3)] hover:text-[var(--txt)]">
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm new password */}
        <div>
          <label className="block text-xs font-medium text-[var(--txt2)] mb-1.5 uppercase tracking-wide">
            Confirm new password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(""); setSuccess(false); }}
              placeholder="Repeat new password"
              className={`w-full px-4 py-3 pr-11 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
                confirmPassword && confirmPassword !== newPassword
                  ? "border-red-400 focus:border-red-400"
                  : "border-[var(--border)] focus:border-[var(--accent)]"
              }`}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--txt3)] hover:text-[var(--txt)]">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== newPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || saving}
          className={`px-8 py-3 rounded-xl font-semibold text-white transition-all text-sm ${
            isValid && !saving
              ? "bg-[var(--accent)] hover:opacity-85 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed opacity-60"
          }`}
        >
          {saving ? "Saving..." : "Update password"}
        </button>
      </div>
    </div>
  );
}
