import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Nav } from "@/components/lex/Nav";
import { Footer } from "@/components/lex/Footer";
import { ClauseCard } from "@/components/lex/ClauseCard";
import { sampleClauses, sampleSummary } from "@/lib/sample-data";

export const Route = createFileRoute("/shared/$id")({
  head: () => ({
    meta: [
      { title: "Shared analysis · LexSimplify" },
      { name: "description", content: "Read-only shared contract analysis." },
    ],
  }),
  component: SharedView,
});

function SharedView() {
  const { id } = Route.useParams();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-[900px] px-6 pt-28 pb-20 lg:px-10">
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/[0.06] px-4 py-3">
          <Clock className="h-4 w-4 text-primary" />
          <p className="text-sm">
            <span className="font-semibold">Shared analysis — read only.</span>{" "}
            <span className="text-muted-foreground">This link expires in 7 days.</span>
          </p>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Contract Analysis</h1>
        <p className="mt-1 text-xs text-subtle">Share ID: {id}</p>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Contract Summary</h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-foreground/90">{sampleSummary}</p>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Flagged Clauses</h2>
          <div className="space-y-4">
            {sampleClauses.map((c, i) => (
              <ClauseCard key={c.id} clause={c} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
