import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Upload, FileText, RefreshCw, Send, Info } from "lucide-react";
import { Nav } from "@/components/lex/Nav";
import { Footer } from "@/components/lex/Footer";
import { ClauseCard } from "@/components/lex/ClauseCard";
import { sampleClauses, sampleSummary, sampleQuestions } from "@/lib/sample-data";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze your contract · LexSimplify" },
      { name: "description", content: "Upload your Indian employment contract and get clause-by-clause analysis in plain English." },
    ],
  }),
  component: AnalyzePage,
});

type Phase = "idle" | "uploading" | "processing" | "analyzing" | "done";

function AnalyzePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [lang, setLang] = useState("English");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile({ name: f.name, size: f.size });
    setPhase("uploading");
    setTimeout(() => setPhase("processing"), 900);
    setTimeout(() => setPhase("analyzing"), 1800);
    setTimeout(() => setPhase("done"), 3600);
  };

  const reset = () => {
    setPhase("idle");
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-[1400px] px-6 pt-28 pb-20 lg:px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Analyze your contract</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload an employment contract, offer letter, bond, or NDA. We'll return a clause-by-clause
            breakdown in plain English.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Left */}
          <aside className="space-y-5">
            {phase === "idle" ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                }}
                onClick={() => inputRef.current?.click()}
                className="group relative flex h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface/60 px-6 text-center transition-colors hover:border-primary/60 hover:bg-surface"
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <Upload className="h-8 w-8 text-primary" />
                <p className="mt-4 text-base font-semibold">Drop your contract here</p>
                <p className="mt-1 text-xs text-muted-foreground">PDF or DOCX · Max 20MB</p>
                <span className="mt-4 rounded-lg border border-border-subtle bg-surface px-3 py-1.5 text-xs font-medium text-foreground/90">
                  or click to browse
                </span>
              </div>
            ) : (
              <ProcessingCard phase={phase} file={file!} />
            )}

            <div className="rounded-2xl border border-border bg-surface p-5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Translate results to
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              >
                {["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati"].map(
                  (l) => (
                    <option key={l}>{l}</option>
                  )
                )}
              </select>
              <div className="mt-3 flex items-start gap-2 text-[11px] text-subtle">
                <Info className="mt-0.5 h-3 w-3 shrink-0" />
                Your document is always analyzed in English first. Translation runs after analysis to
                preserve accuracy.
              </div>
            </div>

            {phase === "done" && file && (
              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-4 w-4 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} KB · ~6 pages · just now
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <RefreshCw className="h-3 w-3" />
                  Analyze a different contract
                </button>
              </div>
            )}
          </aside>

          {/* Right */}
          <section className="space-y-6">
            {phase === "idle" && <EmptyResults />}
            {(phase === "uploading" || phase === "processing" || phase === "analyzing") && <LoadingResults />}
            {phase === "done" && <Results />}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProcessingCard({ phase, file }: { phase: Phase; file: { name: string; size: number } }) {
  const labels: Record<Exclude<Phase, "idle" | "done">, string> = {
    uploading: "Uploading to secure storage",
    processing: "Extracting text from document",
    analyzing: "Running legal analysis — this takes 45–90 seconds",
  };
  const label = labels[phase as Exclude<Phase, "idle" | "done">];

  return (
    <div className="relative h-[260px] overflow-hidden rounded-2xl border border-primary/40 bg-surface p-6">
      <div
        className="absolute left-0 right-0 h-[2px] bg-primary animate-laser"
        style={{ top: 0, boxShadow: "0 0 24px var(--primary)" }}
      />
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">Processing</p>
      <p className="mt-3 truncate text-sm font-medium">{file.name}</p>
      <p className="mt-6 text-sm text-foreground/90">{label}…</p>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full w-1/3 animate-[laser_1.6s_linear_infinite] bg-primary" />
      </div>
      <p className="absolute bottom-5 left-6 right-6 text-[11px] text-subtle">
        We don't show a percentage — processing time varies and an inaccurate number is worse than none.
      </p>
    </div>
  );
}

function EmptyResults() {
  return (
    <div className="flex h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle bg-surface/30 text-center">
      <div className="space-y-2 opacity-30">
        <div className="h-3 w-48 rounded bg-foreground" />
        <div className="h-3 w-32 rounded bg-foreground" />
        <div className="h-3 w-40 rounded bg-foreground" />
      </div>
      <p className="mt-8 text-sm text-muted-foreground">Your analysis will appear here.</p>
    </div>
  );
}

function LoadingResults() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-[140px] animate-pulse rounded-2xl border border-border-subtle bg-surface/60"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}

function Results() {
  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Contract Summary</h2>
          <span className="rounded-md border border-border-subtle bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Employment Agreement
          </span>
        </div>
        <p className="mt-4 text-[15px] leading-[1.7] text-foreground/90">{sampleSummary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Metric label="12 clauses analyzed" />
          <Metric label="3 high-risk clauses" tone="sev-high" />
          <Metric label="48 chunks re-verified" tone="primary" />
        </div>
      </div>

      {/* Clauses */}
      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Flagged Clauses</h2>
          <span className="text-xs text-muted-foreground">Sorted by severity</span>
        </div>
        <div className="space-y-4">
          {sampleClauses.map((c, i) => (
            <div key={c.id} style={{ animationDelay: `${i * 50}ms` }}>
              <ClauseCard clause={c} defaultOpen={i === 0} />
            </div>
          ))}
        </div>
      </div>

      <ChatPanel />
    </div>
  );
}

function Metric({ label, tone }: { label: string; tone?: "sev-high" | "primary" }) {
  const styles =
    tone === "sev-high"
      ? { color: "var(--sev-high)", background: "var(--sev-high-bg)" }
      : tone === "primary"
      ? { color: "var(--primary)", background: "color-mix(in oklab, var(--primary) 12%, transparent)" }
      : { color: "var(--muted-foreground)", background: "var(--surface-2)" };
  return (
    <span
      className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium"
      style={styles}
    >
      {label}
    </span>
  );
}

function ChatPanel() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string; cite?: string }[]>([
    {
      role: "ai",
      text: "I've finished reading your contract. Ask me anything about it — I'll only answer based on what's actually in your document.",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    const match = sampleQuestions.find((s) => s.q === q);
    setMessages((m) => [
      ...m,
      { role: "user", text: q },
      {
        role: "ai",
        text: match?.a ?? "Based on your contract, I'd need to re-check that clause. Try one of the suggested questions below.",
        cite: match ? "Sections 4.2, 7.1, 9.3" : undefined,
      },
    ]);
    setInput("");
  };

  return (
    <div className="rounded-2xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border-subtle p-5">
        <h2 className="text-lg font-semibold">Ask about your contract</h2>
        <span className="rounded-md border border-border-subtle bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Uses only your document
        </span>
      </div>
      <div className="max-h-[400px] space-y-4 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary/15 text-foreground"
                  : "bg-surface-2 text-foreground/90"
              }`}
            >
              <p>{m.text}</p>
              {m.cite && (
                <span className="mt-2 inline-block rounded border border-border-subtle bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  Based on {m.cite}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="border-t border-border-subtle p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your contract…"
            className="flex-1 rounded-lg border border-border-subtle bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-soft"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {sampleQuestions.map((s) => (
            <button
              key={s.q}
              onClick={() => ask(s.q)}
              className="rounded-full border border-border-subtle bg-surface-2 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s.q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
