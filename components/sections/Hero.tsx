import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-white to-[var(--bg2)] border-b border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[var(--border)] shadow-sm rounded-full px-5 py-2 text-xs font-medium text-[var(--txt2)] mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--amber)] animate-pulse"></span>
            Free to get started
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-6 text-center w-full">
            Build your resume<br />
            <span className="text-[var(--amber)]">that gets you hired</span>
          </h1>
          
          <p className="text-[var(--txt2)] text-lg md:text-xl leading-relaxed text-center max-w-3xl mb-10">
            Create a stunning professional resume, portfolio, and cover letter online. Share your unique profile URL and stand out from the crowd.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4 flex-wrap mb-10">
          <Link
            href="/sign-up"
            className="inline-block bg-[var(--accent)] text-white text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-[var(--txt)] transition-all shadow-lg hover:shadow-xl border-2 border-[var(--accent)] hover:border-[var(--txt)]"
          >
            Get Started Free
          </Link>
          <Link
            href="/pricing"
            className="inline-block text-sm font-medium text-[var(--txt)] hover:text-[var(--amber)] transition-all px-8 py-4 rounded-xl hover:bg-white border-2 border-transparent hover:border-[var(--border)]"
          >
            See pricing <span className="text-lg ml-1">→</span>
          </Link>
        </div>
        
        <div className="flex items-center justify-center gap-6 md:gap-8 text-sm text-[var(--txt3)] flex-wrap">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            Free plan available
          </span>
        </div>
      </div>
    </section>
  );
}
