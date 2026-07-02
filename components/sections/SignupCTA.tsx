import Link from "next/link";

export default function SignupCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--accent)] to-[#2a2a2a] border-y border-[var(--accent)] py-20 md:py-24">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--amber)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-6 flex flex-col items-center">
        <h2 className="font-serif text-4xl md:text-5xl mb-5 tracking-tight text-white text-center w-full">
          Ready to build your resume?
        </h2>
        <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed text-center w-full">
          Build your professional online presence and get noticed by recruiters with MyOnlineResume.am
        </p>
        <Link
          href="/sign-up"
          className="inline-block bg-white text-[var(--accent)] text-sm font-semibold uppercase tracking-wider px-10 py-4 rounded-xl hover:bg-[var(--bg2)] transition-all shadow-2xl hover:scale-105"
        >
          Sign Up — It&apos;s Free
        </Link>
      </div>
    </section>
  );
}
