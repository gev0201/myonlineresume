const features = [
  { icon: "📄", title: "Resume Builder", desc: "Create professional, ATS-friendly resumes with our guided builder. Choose from multiple templates tailored for any industry." },
  { icon: "🌐", title: "Online Portfolio", desc: "Showcase your work with a beautiful public profile at your own URL — myonlineresume.am/your-name." },
  { icon: "🔗", title: "Shareable Profile", desc: "Share a single link with recruiters. Your profile stays live as long as your subscription is active." },
];

export default function Features() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--amber)] mb-4">What we offer</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Everything you need<br />to land the job
          </h2>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-[var(--txt2)] leading-relaxed">
            From crafting your story to sharing it with the world — we&apos;ve got every tool you need.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((f, idx) => (
            <div
              key={f.title}
              className="group bg-white border-2 border-[var(--border)] rounded-3xl p-8 hover:border-[var(--amber)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--amber)] to-[#d4944f] flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-semibold text-xl mb-3 text-[var(--txt)]">{f.title}</h3>
              <p className="text-sm text-[var(--txt2)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
