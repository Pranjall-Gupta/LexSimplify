import { useState } from "react";
import type { ClauseSample } from "@/lib/sample-data";

export function ClauseCard({ clause, defaultOpen = false }: { clause: ClauseSample; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  const severityClass =
    clause.severity === "HIGH"
      ? "bg-[rgba(255,63,90,0.15)] text-[var(--red)] border border-[rgba(255,63,90,0.25)]"
      : clause.severity === "MEDIUM"
      ? "bg-[rgba(255,179,64,0.12)] text-[var(--amber)] border border-[rgba(255,179,64,0.25)]"
      : "bg-[rgba(77,170,255,0.12)] text-[var(--blue)] border border-[rgba(77,170,255,0.25)]";

  const typeFormatted = clause.type.toLowerCase().replace(/[\s-]/g, "_");

  return (
    <div
      onClick={() => setOpen((o) => !o)}
      className={`cc laser-card bg-[var(--surface)] border border-[var(--border)] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 hover:translate-y-[-6px] hover:shadow-[0_24px_64px_rgba(0,0,0,0.4)] ${open ? "open" : ""}`}
    >
      <div className="cc-top-line"></div>
      <div className="cc-head p-[16px_18px] flex items-center gap-[8px] border-b border-[var(--border)]">
        <span className={`severity text-[9px] font-bold tracking-[0.1em] uppercase px-[9px] py-[3px] rounded-[4px] ${severityClass}`}>
          {clause.severity === "MEDIUM" ? "MED" : clause.severity}
        </span>
        <span className="cc-type font-mono text-[10px] text-[var(--subtle)] tracking-[0.05em]">
          // {typeFormatted}
        </span>
        <span className="cc-chevron ml-auto text-[var(--subtle)] text-[14px] transition-transform duration-300">
          {open ? "⌃" : "⌄"}
        </span>
      </div>
      <div className="cc-body p-[0_18px]">
        <div className="cc-desc text-[13px] leading-[1.65] p-[16px_0] text-[var(--foreground)] font-sans">
          {clause.summary}
        </div>
        {open && (
          <div className="cc-tiers pb-[16px] border-t border-[var(--border)] pt-[16px] space-y-[8px]" onClick={(e) => e.stopPropagation()}>
            <div className="tier tier-a bg-[rgba(200,255,0,0.04)] border border-[rgba(200,255,0,0.1)] rounded-[8px] p-[12px]">
              <div className="tier-label font-mono text-[9px] font-bold tracking-[0.12em] uppercase mb-[6px] text-[var(--primary)]">// legal_position</div>
              <div className="tier-text font-serif text-[12px] font-light italic text-[var(--muted-foreground)] leading-[1.65]">{clause.legal.body}</div>
            </div>
            <div className="tier tier-b bg-[rgba(77,170,255,0.04)] border border-[rgba(77,170,255,0.1)] rounded-[8px] p-[12px]">
              <div className="tier-label font-mono text-[9px] font-bold tracking-[0.12em] uppercase mb-[6px] text-[var(--blue)]">// judicial_interpretation</div>
              <div className="mb-[6px] flex flex-wrap gap-[6px]">
                {clause.judicial.cases.map((c) => (
                  <span key={c.name} className="case-chip inline-flex font-mono text-[9px] px-[8px] py-[2px] border border-[var(--border)] rounded-[4px] text-[var(--subtle)]">
                    {c.name} · {c.court} {c.year}
                  </span>
                ))}
              </div>
              <div className="tier-text font-serif text-[12px] font-light italic text-[var(--muted-foreground)] leading-[1.65]">{clause.judicial.body}</div>
            </div>
            <div className="tier tier-c bg-[rgba(255,179,64,0.04)] border border-[rgba(255,179,64,0.1)] rounded-[8px] p-[12px]">
              <div className="tier-label font-mono text-[9px] font-bold tracking-[0.12em] uppercase mb-[6px] text-[var(--amber)]">// what_this_means_for_you</div>
              <div className="tier-text font-serif text-[12px] font-light italic text-[var(--muted-foreground)] leading-[1.65]">{clause.plain}</div>
            </div>
            <div className="quote-block mt-[12px] pt-[12px] border-t border-[var(--border)]">
              <div className="quote-label font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--subtle)] mb-[6px]">// verbatim_quote</div>
              <div className="quote-text font-mono text-[10px] text-[var(--muted-foreground)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[6px] p-[10px] leading-[1.7]">
                "{clause.quote}"
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
