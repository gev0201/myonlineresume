const projects = [
  { emoji: "👩‍💻", title: "QA Lead — Tech Industry", desc: "A clean, structured resume showcasing 5 years of QA leadership with detailed skills and certifications." },
  { emoji: "🎨", title: "UX Designer — Agency", desc: "Portfolio-forward profile linking to design work, with a bilingual resume in Armenian and English." },
  { emoji: "📊", title: "Product Manager — Startup", desc: "Concise resume with quantified achievements, multilingual skills, and a compelling cover letter." },
  { emoji: "⚙️", title: "Backend Developer — Remote", desc: "Technical profile with GitHub links, skills matrix, and a timeline of experience across 4 companies." },
];

export default function Projects() {
  return (
    <section className="bg-[var(--bg2)] border-y border-[var(--border)] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--amber)] mb-3">Success stories</p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight">
            Profiles that<br />got people hired
          </h2>
          <button className="border-2 border-[var(--accent)] text-[var(--txt)] text-sm font-semibold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-[var(--accent)] hover:text-white transition-all">
            Browse all →
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {projects.map((p) => (
            <div
              key={p.title}
              className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-[#bbb] transition-all cursor-pointer"
            >
              <div className="h-40 flex items-center justify-center text-5xl bg-gradient-to-br from-[var(--bg3)] to-[var(--accent2)]">
                {p.emoji}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-sm mb-2">{p.title}</h3>
                <p className="text-xs text-[var(--txt2)] leading-relaxed mb-3">{p.desc}</p>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--txt)] hover:gap-2 flex items-center gap-1">
                  View profile →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
