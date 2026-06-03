import { Link } from "@tanstack/react-router";
import { Moon, Sun, Scale } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";

export function Nav() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      id="nav"
      className={`fixed top-0 left-0 right-0 z-[500] h-[60px] flex items-center justify-between px-[20px] md:px-[64px] transition-all duration-400 border-b ${
        scrolled
          ? "scrolled bg-[rgba(5,5,10,0.85)] backdrop-blur-[20px] saturate-[1.4] border-[var(--border)]"
          : "border-transparent bg-transparent"
      }`}
    >
      <Link to="/" className="logo font-mono text-[15px] font-bold tracking-[-0.01em] flex items-center">
        <Scale className="w-4 h-4 text-[var(--primary)] mr-1.5 shrink-0" />
        <span className="logo-lex text-[var(--primary)]">Lex</span>
        <span className="logo-rest text-[var(--foreground)]">Simplify</span>
      </Link>

      <div className="nav-links flex items-center gap-[4px]">
        <a className="nav-a neon-underline text-[12px] font-semibold tracking-[0.04em] uppercase text-[var(--muted-foreground)] p-[6px_14px] rounded-[100px] transition-all duration-200 hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.05)]" href="#how">
          How it works
        </a>
        <Link className="nav-a neon-underline text-[12px] font-semibold tracking-[0.04em] uppercase text-[var(--muted-foreground)] p-[6px_14px] rounded-[100px] transition-all duration-200 hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.05)]" to="/rights">
          Know Your Rights
        </Link>
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="rounded-full p-2 text-[var(--muted-foreground)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--foreground)] transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <Link className="nav-a neon-underline text-[12px] font-semibold tracking-[0.04em] uppercase text-[var(--muted-foreground)] p-[6px_14px] rounded-[100px] transition-all duration-200 hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.05)]" to="/analyze">
          Sign In
        </Link>
      </div>

      <Link
        to="/analyze"
        className="nav-cta hidden md:inline-flex items-center gap-[7px] bg-[var(--primary)] text-white dark:text-black text-[12px] font-bold tracking-[0.04em] uppercase p-[8px_20px] rounded-[100px] border-none transition-all duration-200 hover:bg-[var(--primary-soft)] hover:translate-y-[-1px] hover:shadow-[0_8px_28px_rgba(200,255,0,0.3)] relative overflow-hidden"
      >
        Get Started Free <span className="arrow">→</span>
      </Link>
    </nav>
  );
}
