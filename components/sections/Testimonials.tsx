const testimonials = [
  {
    quote: "I got three interview calls within a week of publishing my profile. The shareable URL made it so easy to send to recruiters.",
    name: "Ani Hakobyan",
    role: "Software Engineer · Yerevan",
    initials: "AH",
  },
  {
    quote: "Finally a platform that understands Armenian professionals. Adding multilingual skills with proficiency levels was a game-changer.",
    name: "Vardan Grigoryan",
    role: "Product Manager · Gyumri",
    initials: "VG",
  },
  {
    quote: "The cover letter builder is brilliant. I customized it for each job and landed my dream position at a top tech company abroad.",
    name: "Nare Mkrtchyan",
    role: "UX Designer · Remote",
    initials: "NM",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[var(--accent)] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--amber)] mb-3">Testimonials</p>
        <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight mb-10">
          What our users say
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white/8 border border-white/15 rounded-2xl p-7"
            >
              <blockquote className="text-white/85 leading-relaxed italic mb-6 text-[0.97rem]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[var(--amber)] flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <strong className="block text-white text-sm">{t.name}</strong>
                  <span className="text-white/50 text-xs">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
