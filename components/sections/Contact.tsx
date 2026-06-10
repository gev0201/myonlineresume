export default function Contact() {
  return (
    <section className="py-20 md:py-28 bg-[var(--bg2)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--amber)] mb-4">Get in touch</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4">Contact us</h2>
          <p className="text-[var(--txt2)] text-base md:text-lg max-w-2xl mx-auto">
            Have questions? We&apos;re here to help you succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
          {/* Info */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[var(--border)]">
            <p className="text-base font-semibold text-[var(--txt)] mb-6">We&apos;ll get back to you within 24 hours.</p>
            {[
              { icon: "📞", text: "+374 10 123 456" },
              { icon: "✉️", text: "hello@myonlineresume.am" },
              { icon: "🎫", text: "Open a support ticket" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-4 mb-5 text-sm text-[var(--txt)]">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--amber)] to-[#d4944f] flex items-center justify-center text-xl flex-shrink-0 shadow-md">
                  {item.icon}
                </div>
                {item.text}
              </div>
            ))}
          </div>

          {/* Form */}
          <form className="bg-white rounded-3xl p-8 border-2 border-[var(--border)] shadow-sm space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--txt)] mb-2 uppercase tracking-wide">First name</label>
                <input type="text" placeholder="Armen" className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--amber)] transition-colors bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--txt)] mb-2 uppercase tracking-wide">Last name</label>
                <input type="text" placeholder="Petrosyan" className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--amber)] transition-colors bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--txt)] mb-2 uppercase tracking-wide">Email</label>
              <input type="email" placeholder="armen@example.am" className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--amber)] transition-colors bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--txt)] mb-2 uppercase tracking-wide">I&apos;m interested in</label>
              <select className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--amber)] transition-colors bg-white">
                <option>Resume Builder</option>
                <option>Portfolio</option>
                <option>Cover Letter</option>
                <option>Pricing & Plans</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--txt)] mb-2 uppercase tracking-wide">Message</label>
              <textarea rows={5} placeholder="Tell us how we can help..." className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--amber)] transition-colors resize-none bg-white" />
            </div>
            <button type="submit" className="w-full bg-[var(--accent)] text-white text-sm font-semibold uppercase tracking-wider py-4 rounded-xl hover:bg-[var(--txt)] transition-all shadow-lg hover:shadow-xl">
              Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
