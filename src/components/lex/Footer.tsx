import { Link } from "@tanstack/react-router";
import { Scale } from "lucide-react";

const cols = [
  { h: "Product", items: ["Analyze Contract", "Sample Analysis", "Pricing"] },
  { h: "Learn", items: ["Know Your Rights", "How It Works", "FAQ"] },
  { h: "Legal", items: ["Privacy Policy", "Terms of Service", "Disclaimer"] },
];

export function Footer() {
  return (
    <footer className="bg-[#0C0C14] border-t border-[var(--border)] p-[60px_20px_36px] md:p-[60px_64px_36px] relative z-[1]">
      <div className="footer-inner max-w-[1180px] mx-auto">
        <div className="footer-top grid grid-cols-1 md:grid-cols-[2fr_repeat(3,1fr)] gap-[48px] mb-[48px]">
          <div className="space-y-3">
            <div className="footer-brand font-mono text-[14px] font-bold text-[var(--primary)] mb-[12px] flex items-center">
              <Scale className="w-3.5 h-3.5 mr-1 text-[var(--primary)] shrink-0" />
              <span>LexSimplify</span>
            </div>
            <p className="footer-brand-sub font-serif text-[13px] font-light italic text-[var(--muted-foreground)] leading-[1.65] max-w-[280px]">
              Plain-English breakdown of every clause in your Indian employment contract. Grounded in Indian law and case precedent.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <h4 className="footer-col-h font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--subtle)] mb-[16px]">
                {c.h}
              </h4>
              <ul className="footer-links flex flex-col gap-[10px]">
                {c.items.map((i) => (
                  <li key={i}>
                    <a
                      className="footer-link text-[13px] text-[var(--muted-foreground)] transition-colors duration-200 hover:text-[var(--foreground)]"
                      href="#"
                    >
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom border-t border-[var(--border)] pt-[24px] font-mono text-[10px] text-[var(--subtle)] tracking-[0.04em] leading-[1.8]">
          © {new Date().getFullYear()} LexSimplify. Grounded answers only. LexSimplify is a legal literacy platform and does not offer formal legal advice or representation.
        </div>
      </div>
    </footer>
  );
}
