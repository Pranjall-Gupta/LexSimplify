import type { Severity } from "@/lib/sample-data";

const map: Record<Severity, { color: string; bg: string }> = {
  HIGH: { color: "var(--sev-high)", bg: "var(--sev-high-bg)" },
  MEDIUM: { color: "var(--sev-medium)", bg: "var(--sev-medium-bg)" },
  LOW: { color: "var(--sev-low)", bg: "var(--sev-low-bg)" },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const s = map[severity];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
      {severity}
    </span>
  );
}
