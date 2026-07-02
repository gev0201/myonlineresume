"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setServerError("");
  };

  const isFormValid = (): boolean => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.password.length >= 8 &&
      formData.confirmPassword.length >= 8 &&
      formData.password === formData.confirmPassword
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Registration successful - redirect to sign-in or dashboard
        router.push("/sign-in?registered=true");
      } else {
        // Handle validation errors
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(data.message || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[var(--txt2)] mb-1.5 uppercase tracking-wide">
            First name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Armen"
            className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
              errors.firstName
                ? "border-red-500 focus:border-red-500"
                : "border-[var(--border)] focus:border-[var(--accent)]"
            }`}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--txt2)] mb-1.5 uppercase tracking-wide">
            Last name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Petrosyan"
            className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
              errors.lastName
                ? "border-red-500 focus:border-red-500"
                : "border-[var(--border)] focus:border-[var(--accent)]"
            }`}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--txt2)] mb-1.5 uppercase tracking-wide">
          Email address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="armen@example.am"
          className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
            errors.email
              ? "border-red-500 focus:border-red-500"
              : "border-[var(--border)] focus:border-[var(--accent)]"
          }`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--txt2)] mb-1.5 uppercase tracking-wide">
          Phone number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+374 55 123 456"
          className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
            errors.phone
              ? "border-red-500 focus:border-red-500"
              : "border-[var(--border)] focus:border-[var(--accent)]"
          }`}
        />
        {errors.phone && (
          <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--txt2)] mb-1.5 uppercase tracking-wide">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min. 8 characters"
          className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
            errors.password
              ? "border-red-500 focus:border-red-500"
              : "border-[var(--border)] focus:border-[var(--accent)]"
          }`}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--txt2)] mb-1.5 uppercase tracking-wide">
          Confirm password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your password"
          className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
            errors.confirmPassword
              ? "border-red-500 focus:border-red-500"
              : "border-[var(--border)] focus:border-[var(--accent)]"
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {/* TODO: Re-enable when Terms of Service and Privacy Policy pages are ready
      <div className="flex items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          id="terms"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          className="mt-0.5 rounded flex-shrink-0"
        />
        <label htmlFor="terms" className="text-xs text-[var(--txt2)] leading-relaxed">
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-[var(--txt)] underline underline-offset-2 hover:text-[var(--amber)]"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-[var(--txt)] underline underline-offset-2 hover:text-[var(--amber)]"
          >
            Privacy Policy
          </Link>
        </label>
      </div>
      */}

      <button
        type="submit"
        disabled={!isFormValid() || isSubmitting}
        className={`w-full text-white text-sm font-semibold uppercase tracking-wider py-3.5 rounded-xl transition-all ${
          isFormValid() && !isSubmitting
            ? "bg-[var(--accent)] hover:opacity-85 cursor-pointer"
            : "bg-gray-400 cursor-not-allowed opacity-60"
        }`}
      >
        {isSubmitting ? "Creating account..." : "Create free account"}
      </button>
    </form>
  );
}
