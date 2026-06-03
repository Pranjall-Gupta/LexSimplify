import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ArrowRight, X } from "lucide-react";
import { Nav } from "@/components/lex/Nav";
import { Footer } from "@/components/lex/Footer";
import { lawArticles, lawCategories, featuredLaws, type LawArticle } from "@/lib/sample-data";

export const Route = createFileRoute("/rights")({
  head: () => ({
    meta: [
      { title: "Know Your Rights · LexSimplify" },
      { name: "description", content: "Plain-English guides to the Indian employment laws that protect you — with real case citations." },
    ],
  }),
  component: RightsPage,
});

function RightsPage() {
  const [cat, setCat] = useState<(typeof lawCategories)[number]>("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<LawArticle | null>(null);

  const filtered = useMemo(() => {
    return lawArticles.filter((a) => {
      const inCat = cat === "All" || a.category === cat;
      const inQ =
        !q ||
        [a.question, a.teaser, a.shortAnswer, a.whatLawSays, a.section]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase());
      return inCat && inQ;
    });
  }, [cat, q]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <header className="border-b border-border-subtle bg-surface/30 pt-28 pb-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Legal Literacy
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Know your rights as an employee in India.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            The laws that protect you — explained in plain English, with examples from real cases.
          </p>
          <p className="mt-3 max-w-2xl text-xs text-subtle">
            This guide explains Indian employment law as it has been interpreted by courts. It is
            educational, not legal advice. For specific disputes, consult a qualified advocate.
          </p>

          <div className="mt-8 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search laws, rights, and common questions…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-subtle"
            />
          </div>
        </div>
      </header>

      <section className="border-b border-border-subtle py-12">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            The 10 laws every fresher should know
          </p>
          <div className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-3">
            {featuredLaws.map((l) => (
              <div
                key={l.n}
                className="min-w-[220px] rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
              >
                <span className="text-2xl font-bold text-primary">{l.n}</span>
                <h3 className="mt-2 text-sm font-semibold leading-snug">{l.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="mb-8 flex flex-wrap gap-2">
            {lawCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  cat === c
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border-subtle bg-surface text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((a) => (
              <article
                key={a.id}
                className="flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/40"
              >
                <span className="inline-block w-fit rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">
                  {a.category}
                </span>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {a.section}
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-snug">{a.question}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.teaser}</p>
                <button
                  onClick={() => setOpen(a)}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  Read full guide
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="rounded-xl border border-border-subtle bg-surface p-8 text-center text-sm text-muted-foreground">
              No articles match your search.
            </p>
          )}
        </div>
      </section>

      {open && <ArticleModal article={open} onClose={() => setOpen(null)} />}

      <Footer />
    </div>
  );
}

function ArticleModal({ article, onClose }: { article: LawArticle; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-12 w-full max-w-3xl rounded-2xl border border-border bg-surface p-8 animate-fade-up md:p-10"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">
              {article.category}
            </span>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {article.section}
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight">
              {article.question}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 space-y-8">
          <Block label="The short answer">
            <p className="text-base font-semibold leading-relaxed">{article.shortAnswer}</p>
          </Block>

          <Block label="What the law says">
            <p className="leading-relaxed text-foreground/90">{article.whatLawSays}</p>
          </Block>

          <Block label="What courts have said">
            <div className="space-y-4">
              {article.cases.map((c) => (
                <div key={c.name} className="rounded-xl border border-border-subtle bg-surface-2/60 p-5">
                  <h4 className="font-semibold">{c.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {c.year} · {c.court}
                  </p>
                  <p className="mt-3 text-sm text-foreground/85">
                    <span className="font-medium text-foreground">Facts:</span> {c.facts}
                  </p>
                  <p className="mt-1 text-sm text-foreground/85">
                    <span className="font-medium text-foreground">Held:</span> {c.held}
                  </p>
                  <p className="mt-1 text-sm text-foreground/85">
                    <span className="font-medium text-primary">Why it matters:</span> {c.matters}
                  </p>
                </div>
              ))}
            </div>
          </Block>

          <Block label="In practice — what this means for you">
            <p className="leading-relaxed text-foreground/90">{article.inPractice}</p>
          </Block>

          <Block label="What to do if this applies to you">
            <ul className="space-y-2">
              {article.actions.map((a) => (
                <li key={a} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {a}
                </li>
              ))}
            </ul>
          </Block>
        </div>
      </div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
        {label}
      </h3>
      <div className="text-sm">{children}</div>
    </section>
  );
}
