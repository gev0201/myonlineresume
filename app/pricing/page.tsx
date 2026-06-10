import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Pricing — MyOnlineResume.am",
  description: "Choose the plan that fits your career goals.",
};

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    desc: "Perfect for getting started and exploring the platform.",
    cta: "Get started",
    ctaHref: "/sign-up",
    featured: false,
    features: [
      { label: "1 Resume", included: true },
      { label: "1 Cover Letter", included: true },
      { label: "Public profile URL", included: true },
      { label: "PDF export", included: true },
      { label: "Multi-language skills", included: false },
      { label: "Custom URL slug", included: false },
      { label: "Portfolio section", included: false },
      { label: "Priority support", included: false },
    ],
  },
  {
    name: "Pro",
    price: "4,900",
    period: "/ month (AMD)",
    desc: "Everything you need to land the job you deserve.",
    cta: "Start Pro",
    ctaHref: "/sign-up?plan=pro",
    featured: true,
    badge: "Most popular",
    features: [
      { label: "Unlimited Resumes", included: true },
      { label: "Unlimited Cover Letters", included: true },
      { label: "Public profile URL", included: true },
      { label: "PDF export", included: true },
      { label: "Multi-language skills", included: true },
      { label: "Custom URL slug", included: true },
      { label: "Portfolio section", included: true },
      { label: "Priority support", included: false },
    ],
  },
  {
    name: "Premium",
    price: "9,900",
    period: "/ month (AMD)",
    desc: "For power users who want the full suite with top-tier support.",
    cta: "Go Premium",
    ctaHref: "/sign-up?plan=premium",
    featured: false,
    features: [
      { label: "Unlimited Resumes", included: true },
      { label: "Unlimited Cover Letters", included: true },
      { label: "Public profile URL", included: true },
      { label: "PDF export", included: true },
      { label: "Multi-language skills", included: true },
      { label: "Custom URL slug", included: true },
      { label: "Portfolio section", included: true },
      { label: "Priority support", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel your subscription at any time — no penalties. Your profile stays active until the end of the billing period.",
  },
  {
    q: "What happens when I deactivate my profile?",
    a: "Your public profile URL becomes unavailable. Your data is saved and will be restored when you reactivate or renew.",
  },
  {
    q: "Is there a student discount?",
    a: "Yes — students with a valid .am university email get 50% off the Pro plan. Contact support to apply.",
  },
  {
    q: "Can I switch plans later?",
    a: "Absolutely. Upgrade or downgrade at any time and we&apos;ll prorate the difference.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="py-16 md:py-20 text-center border-b border-[var(--border)]">
          <div className="max-w-2xl mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--amber)] mb-4">Pricing</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4">
              Simple, honest pricing
            </h1>
            <p className="text-[var(--txt2)] text-base md:text-lg leading-relaxed">
              Start for free. Upgrade when you&apos;re ready. No hidden fees.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="py-16 bg-[var(--bg2)]">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-7 relative ${
                  plan.featured
                    ? "border-2 border-[var(--accent)] shadow-lg"
                    : "border border-[var(--border)]"
                }`}
              >
                {plan.featured && plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="font-semibold text-lg mb-1">{plan.name}</h2>
                  <p className="text-xs text-[var(--txt2)] mb-4 leading-relaxed">{plan.desc}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-4xl tracking-tight">
                      {plan.price === "0" ? "Free" : `֏${plan.price}`}
                    </span>
                    {plan.price !== "0" && (
                      <span className="text-xs text-[var(--txt3)]">{plan.period}</span>
                    )}
                  </div>
                </div>

                <Link
                  href={plan.ctaHref}
                  className={`block text-center text-sm font-semibold uppercase tracking-wider py-3 rounded-xl mb-6 transition-all ${
                    plan.featured
                      ? "bg-[var(--accent)] text-white hover:opacity-85"
                      : "border-2 border-[var(--accent)] text-[var(--txt)] hover:bg-[var(--accent)] hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5 text-sm">
                      {f.included ? (
                        <Check size={15} className="text-green-600 flex-shrink-0" />
                      ) : (
                        <X size={15} className="text-[var(--txt3)] flex-shrink-0" />
                      )}
                      <span className={f.included ? "text-[var(--txt)]" : "text-[var(--txt3)]"}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20">
          <div className="max-w-2xl mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--amber)] mb-4 text-center">FAQ</p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-center mb-10">
              Frequently asked questions
            </h2>
            <div className="space-y-5">
              {faqs.map((faq) => (
                <div key={faq.q} className="border border-[var(--border)] rounded-2xl p-6">
                  <h3 className="font-semibold text-base mb-2">{faq.q}</h3>
                  <p className="text-sm text-[var(--txt2)] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[var(--accent)] py-16 md:py-20 text-center">
          <div className="max-w-xl mx-auto px-6">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Start for free today</h2>
            <p className="text-white/70 text-sm md:text-base mb-8">No credit card required. Upgrade anytime.</p>
            <Link
              href="/sign-up"
              className="inline-block bg-white text-[var(--accent)] text-sm font-semibold uppercase tracking-wider px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              Create your free account
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
