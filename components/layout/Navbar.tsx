"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userUrl: string;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Clear user data from localStorage
      localStorage.removeItem("user");
      setUser(null);
      setOpen(false);

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-[var(--border)] shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-tight text-[var(--txt)] hover:opacity-80 transition-opacity">
          MyOnline<span className="text-[var(--amber)]">Resume</span>.am
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link
                href={`/${user.userUrl}`}
                className="text-sm font-medium text-[var(--txt2)] hover:text-[var(--txt)] transition-colors"
              >
                {user.firstName} {user.lastName}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold uppercase tracking-wider bg-[var(--accent)] text-white px-6 py-2.5 rounded-xl hover:bg-[var(--txt)] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium uppercase tracking-wider text-[var(--txt2)] hover:text-[var(--txt)] px-4 py-2.5 rounded-xl hover:bg-[var(--bg2)] transition-all">
                Sign In
              </Link>
              <Link href="/sign-up" className="text-sm font-semibold uppercase tracking-wider bg-[var(--accent)] text-white px-6 py-2.5 rounded-xl hover:bg-[var(--txt)] transition-all shadow-md hover:shadow-lg">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg hover:bg-[var(--bg2)] transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-white px-6 py-4 flex flex-col gap-3">
          {user ? (
            <>
              <Link
                href={`/${user.userUrl}`}
                className="text-sm font-medium py-2.5 text-[var(--txt2)] hover:text-[var(--txt)] transition-colors"
                onClick={() => setOpen(false)}
              >
                {user.firstName} {user.lastName}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold uppercase tracking-wider bg-[var(--accent)] text-white text-center py-3 rounded-xl hover:bg-[var(--txt)] transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium py-2.5 text-[var(--txt2)] hover:text-[var(--txt)] transition-colors" onClick={() => setOpen(false)}>
                Sign In
              </Link>
              <Link href="/sign-up" className="text-sm font-semibold uppercase tracking-wider bg-[var(--accent)] text-white text-center py-3 rounded-xl hover:bg-[var(--txt)] transition-all" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
