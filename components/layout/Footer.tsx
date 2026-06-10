import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg2)]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="font-serif text-2xl text-[var(--txt)] hover:opacity-80 transition-opacity">
          MyOnline<span className="text-[var(--amber)]">Resume</span>.am
        </Link>
        <p className="text-sm text-[var(--txt3)]">© 2026 MyOnlineResume.am — All rights reserved</p>
      </div>
    </footer>
  );
}
