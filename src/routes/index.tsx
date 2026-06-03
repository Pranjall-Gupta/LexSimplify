import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cpu, Shield, Scale, Lock, Sparkles, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/lib/theme";
import { Nav } from "@/components/lex/Nav";
import { Footer } from "@/components/lex/Footer";
import { ClauseCard } from "@/components/lex/ClauseCard";
import { sampleClauses, lawArticles } from "@/lib/sample-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LexSimplify — Know What You're Signing" },
      {
        name: "description",
        content:
          "Upload your offer letter, bond, or NDA. Get a plain-English breakdown of every clause grounded in Indian employment law.",
      },
    ],
  }),
  component: Landing,
});

// Helper for scroll reveal
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".sr, .sr-left, .sr-right, .split-text");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

// Custom Cursor component
function CustomCursor() {
  const [active, setActive] = useState(false);
  const { theme } = useTheme();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    if (!media.matches) return;

    setActive(true);
    document.body.classList.add("custom-cursor-active");

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
    };

    const updateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }
      requestAnimationFrame(updateRing);
    };

    const isLight = theme === "light";
    const ringColor = isLight ? "#1C1C32" : "var(--primary)";

    // Set initial color on mount
    if (ringRef.current) {
      ringRef.current.style.borderColor = ringColor;
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("qchip") ||
        target.classList.contains("cc") ||
        target.classList.contains("law-tile");

      if (isInteractive) {
        if (dotRef.current && ringRef.current) {
          dotRef.current.style.width = "10px";
          dotRef.current.style.height = "10px";
          ringRef.current.style.borderColor = ringColor;
          ringRef.current.style.opacity = "0.75";
          ringRef.current.style.width = "56px";
          ringRef.current.style.height = "56px";
        }
      } else {
        if (dotRef.current && ringRef.current) {
          dotRef.current.style.width = "6px";
          dotRef.current.style.height = "6px";
          ringRef.current.style.borderColor = ringColor;
          ringRef.current.style.opacity = "0.4";
          ringRef.current.style.width = "32px";
          ringRef.current.style.height = "32px";
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    const animId = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animId);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [theme]);

  if (!active) return null;

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}

// Background Canvas constellation effect
function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particleCount = 50;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2.0 + 0.8,
      });
    }

    const isLight = theme === "light";
    const particleColor = isLight ? "rgba(155, 93, 229, 0.95)" : "rgba(200, 255, 0, 0.45)";
    const lineColor = isLight ? "40, 40, 45" : "200, 255, 0";
    const lineAlphaMultiplier = isLight ? 0.35 : 0.28;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * lineAlphaMultiplier;
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
}

// Split text element
function SplitText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={`split-text ${className || ""}`}>
      {words.map((w, idx) => {
        const isEm = w.includes("<em>") || w.includes("</em>");
        const cleanWord = w.replace("<em>", "").replace("</em>", "");
        return (
          <span
            key={idx}
            className="word"
            style={{ transitionDelay: `${idx * 0.04}s`, marginRight: "0.28em" }}
          >
            {isEm ? (
              <em className="font-serif italic font-light text-[var(--primary)]">{cleanWord}</em>
            ) : (
              cleanWord
            )}
          </span>
        );
      })}
    </span>
  );
}

// Seamless marquee loop
function Marquee({ reverse = false, items }: { reverse?: boolean; items: string[] }) {
  const listItems = [...items, ...items];
  return (
    <div className="marquee-divider">
      <div
        className="marquee-track"
        style={{
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {listItems.map((item, idx) => (
          <span key={idx} className="marquee-item">
            <span className="marquee-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// Animated counter based on viewport observer
function Counter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered) {
          setTriggered(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const end = target;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(Math.min(start, end));
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration, triggered]);

  return <span ref={elementRef}>{count}</span>;
}

function Landing() {
  const [progress, setProgress] = useState(0);
  useScrollReveal();

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressVal = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setProgress(progressVal);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative font-sans">
      {/* Scroll Progress Bar */}
      <div
        id="pbar"
        className="fixed top-0 left-0 h-[1.5px] z-[9997] bg-gradient-to-r from-[var(--primary)] to-[var(--primary-soft)] origin-left transition-transform duration-75"
        style={{ transform: `scaleX(${progress})`, width: "100%", boxShadow: "0 0 8px var(--primary)" }}
      />

      <CustomCursor />
      <BackgroundCanvas />

      <Nav />
      <Hero />

      {/* Marquee 1 */}
      <Marquee
        items={[
          "Training Bond Analysis",
          "Non-Compete Enforceability",
          "Section 27 ICA",
          "IP Assignment Clauses",
          "Notice Period Rights",
          "Hallucination Validated",
          "Grounded in Indian Case Law",
          "GPT-4o Powered RAG Pipeline",
        ]}
      />

      <Problem />

      {/* Marquee 2 */}
      <Marquee
        reverse
        items={[
          "Superintendence Co v Krishnamurthy · SC 1981",
          "Niranjan Shankar Golikari v Century Spinning · SC 1967",
          "Sicpa India v Manas Pratim Dey · HC 2009",
          "Payment of Gratuity Act 1972",
          "Code on Wages 2019",
          "Article 19(1)(g) · Constitution of India",
        ]}
      />

      <HowItWorks />
      <Showroom />
      <IndianLaw />
      <LegalLiteracy />
      <Trust />
      <CtaBanner />
      <Footer />
    </div>
  );
}

function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const getWordStyle = (idx: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "none" : "translateY(110%) rotateX(-40deg)",
    transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s`,
  });

  const tagStyle = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "none" : "translateY(12px)",
    transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const bottomStyle = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "none" : "translateY(24px)",
    transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center px-[20px] md:px-[64px] relative z-[1] pt-[60px]">
      <div className="hero-inner max-w-[1180px] mx-auto w-full">
        <div
          id="hero-tag"
          className="hero-tag inline-flex items-center gap-[10px] font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--primary)] mb-[32px]"
          style={tagStyle}
        >
          <span className="hero-tag-dash w-[24px] h-[1px] bg-[var(--primary)]" />
          Indian Employment Law Intelligence
        </div>

        <h1 className="hero-h1 font-serif text-[clamp(32px,6.2vw,80px)] font-light leading-[1.18] tracking-[-0.04em] mb-[40px] max-w-[900px]">
          <span className="line block overflow-hidden">
            <span style={getWordStyle(0)} className="word inline-block">Know</span>{" "}
            <span style={getWordStyle(1)} className="word inline-block">what</span>{" "}
            <span style={getWordStyle(2)} className="word inline-block">you're</span>
          </span>
          <span className="line block overflow-hidden">
            <span style={getWordStyle(3)} className="word inline-block">signing</span>
            <span style={getWordStyle(4)} className="word inline-block">.</span>{" "}
            <span style={getWordStyle(5)} className="word inline-block text-[var(--primary)] text-[0.8em] md:text-[0.85em] align-baseline">Before</span>
          </span>
          <span className="line block overflow-hidden">
            <span style={getWordStyle(6)} className="word inline-block text-[0.8em] md:text-[0.85em] align-baseline">
              <em className="font-serif italic font-light text-[var(--primary)]">you sign it.</em>
            </span>
          </span>
        </h1>

        <div
          id="hero-bottom"
          className="hero-bottom grid grid-cols-1 md:grid-cols-2 gap-[32px] md:gap-[60px] items-end mt-[8px]"
          style={bottomStyle}
        >
          <p className="hero-sub font-serif text-[clamp(16px,1.8vw,20px)] text-[var(--muted-foreground)] leading-[1.65] font-light italic max-w-[440px]">
            Upload your offer letter, bond, or NDA. Get a plain-English breakdown of every clause — what it means under Indian law, whether it's enforceable, and what to push back on.
          </p>
          <div className="hero-actions flex flex-col items-start md:items-end gap-[16px]">
            <Link
              to="/analyze"
              className="btn-primary inline-flex items-center gap-[10px] bg-[var(--primary)] text-[#000] text-[13px] md:text-[14px] font-bold tracking-[0.05em] uppercase p-[16px_32px] md:p-[18px_36px] rounded-[100px] border-none transition-all duration-300 hover:translate-y-[-3px] hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(200,255,0,0.35)] hover:bg-[var(--primary-soft)] select-none whitespace-nowrap"
            >
              Analyze My Contract <span className="arrow transition-transform duration-[0.25s] group-hover:translate-x-[4px]">→</span>
            </Link>
            <div className="hero-scroll-hint font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--subtle)] flex items-center gap-[10px]">
              <div className="scroll-line w-[40px] h-[1px] bg-[var(--subtle)] relative overflow-hidden">
                <div className="absolute top-0 left-[-100%] w-full h-full bg-[var(--primary)] animate-[scroll-sweep_2s_ease-in-out_infinite_2s]" />
              </div>
              Scroll to explore
            </div>
          </div>
        </div>
      </div>
      <div className="hero-bg-text font-serif select-none pointer-events-none absolute bottom-[-20px] left-[20px] md:left-[64px] text-[60px] md:text-[140px] font-black text-[var(--foreground)] opacity-[0.02] tracking-[-0.08em] leading-none whitespace-nowrap animate-[bg-float_10s_ease-in-out_infinite]" aria-hidden="true">
        LEX
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section id="problem" className="section">
      <div className="section-inner">
        <div className="section-label sr">
          <span className="section-num">01 //</span> The Problem
        </div>
        <div className="problem-grid">
          <div className="problem-left">
            <h2 className="problem-h2">
              <SplitText text="Every year, millions of freshers sign contracts they <em>don't understand.</em>" />
            </h2>
            <p className="problem-body sr d2">
              The consequences are real. People get trapped in bonds they didn't know were unenforceable. They avoid switching jobs because of non-compete clauses that Indian courts would throw out. Legal literacy is a privilege — if you can afford a lawyer, you understand what you're signing.
            </p>
          </div>
          <div className="problem-stats sr-right">
            <div className="stat-row sr d1">
              <div className="stat-num">
                <Counter target={12} />
              </div>
              <div className="stat-content">
                <div className="stat-title">Binding clauses per offer letter</div>
                <div className="stat-text">A standard IT offer letter contains 8–12 legally binding clauses beyond salary and designation. Most employees have never read them.</div>
              </div>
            </div>
            <div className="stat-row sr d2">
              <div className="stat-num">
                <Counter target={60} />%
              </div>
              <div className="stat-content">
                <div className="stat-title">IT contracts with non-competes</div>
                <div className="stat-text">Most are void under Section 27 ICA — but employees comply because they don't know that.</div>
              </div>
            </div>
            <div className="stat-row sr d3">
              <div className="stat-num">
                <Counter target={50} />+
              </div>
              <div className="stat-content">
                <div className="stat-title">Court judgments in our database</div>
                <div className="stat-text">Landmark SC and HC rulings on bonds, non-competes, IP, and notice periods — powering every analysis.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Upload Your Contract",
      badge: "PDF · DOCX · Max 20MB",
      text: "Drag and drop your offer letter, employment bond, or NDA. Your document is stored in an isolated Azure container tied to your account — nobody else can access it. Processing begins the moment the file lands.",
    },
    {
      n: "02",
      title: "The Pipeline Runs",
      badge: "RAG · GPT-4o · Hallucination Guard",
      text: "Your contract is chunked with overlapping windows, then cross-referenced against our curated database of Indian employment statutes and 50+ landmark court judgments. Every flagged clause must quote the source verbatim — if the AI can't find it character-for-character, it doesn't report it.",
    },
    {
      n: "03",
      title: "Three-Tier Results",
      badge: "Law · Case Law · Plain English",
      text: "Every clause explained three ways: the statute, what courts have actually done with it, and what it means for you personally. Ask follow-up questions in natural language — answered only from your document, never from general AI knowledge. Translate to any Indian language.",
    },
  ];

  return (
    <section id="how" className="section">
      <div className="section-inner">
        <div className="section-label sr">
          <span className="section-num">02 //</span> How It Works
        </div>
        <div className="steps">
          {steps.map((s, idx) => (
            <div key={s.n} className={`step sr d${idx + 1}`}>
              <div className="step-n">{s.n}</div>
              <div className="step-body">
                <div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-badge">{s.badge}</div>
                </div>
                <div className="step-text">{s.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showroom() {
  return (
    <section id="samples" className="section">
      <div className="section-inner">
        <div className="section-label sr">
          <span className="section-num">03 //</span> Sample Analysis — Click to expand
        </div>
        <div className="cards-grid">
          {sampleClauses.map((c, idx) => (
            <div key={c.id} className={`sr d${idx + 1}`}>
              <ClauseCard clause={c} defaultOpen={idx === 0} />
            </div>
          ))}
        </div>

        {/* Chat preview panel */}
        <ChatDemo />
      </div>
    </section>
  );
}

function ChatDemo() {
  const [chatQuery, setChatQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string; citation?: string }>>([
    {
      sender: "user",
      text: "What happens if I break the training bond before 24 months?",
    },
    {
      sender: "ai",
      text: "Based on Section 4.2 of your contract, the company claims 18 months' gross salary. However, under S.74 of the Indian Contract Act, this is only enforceable to the extent of actual loss they can prove. Courts require documented training costs — not a blanket multiplier. The clause as written would likely be significantly reduced if challenged.",
      citation: "// source: Section 4.2 · S.74 ICA · Sicpa India HC 2009",
    },
  ]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatQuery("");

    setTimeout(() => {
      let aiReply =
        "Our database does not contain a specific overrides for that query. Generally, Indian courts disallow punitive clauses and enforce actual costs or pre-estimates of damages under Section 74 ICA.";
      let citation = undefined;

      const norm = text.toLowerCase();
      if (norm.includes("notice")) {
        aiReply =
          "Under Section 14 of the Specific Relief Act, your employer cannot compel physical work. However, they can deduct salary-in-lieu or withhold relieving documents if you break notice terms.";
        citation = "// source: Clause 7.1 · S.14 Specific Relief Act";
      } else if (norm.includes("compete")) {
        aiReply =
          "Post-employment non-compete clauses are completely void in India under Section 27 of the Contract Act. Courts consistently strike them down.";
        citation = "// source: Clause 8.2 · Section 27 ICA · Superintendence Co (SC 1981)";
      } else if (norm.includes("bond")) {
        aiReply =
          "Yes, they can sue, but courts will reduce the ₹ amount to actual documented training expenses only. A flat penalty bond is treated as void under Section 74 ICA.";
        citation = "// source: Clause 9.1 · Section 74 ICA · Sicpa India v Manas Pratim Deb (HC 2011)";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: aiReply, citation }]);
    }, 800);
  };

  return (
    <div className="chat-preview sr d4 max-w-[840px] mx-auto">
      <div className="chat-header">
        <div className="online-dot" />
        Ask about your contract — grounded answers only
      </div>

      <div className="space-y-[12px] max-h-[320px] overflow-y-auto pr-1">
        {messages.map((m, idx) => (
          <div key={idx} className={`msg ${m.sender === "user" ? "u" : "a"}`}>
            <div className={`bubble ${m.sender === "user" ? "bubble-u" : "bubble-a"}`}>
              {m.text}
            </div>
            {m.citation && (
              <span className="cite">
                <Scale size={11} className="text-[var(--primary)] shrink-0" />
                <span>{m.citation.replace(/^\/\/\s*source:\s*/i, "Source: ")}</span>
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="quick-chips">
        {["Is my non-compete enforceable?", "What is my actual notice period?", "Can I join a competitor?"].map((q) => (
          <div
            key={q}
            onClick={() => handleSend(q)}
            className="qchip"
          >
            {q}
          </div>
        ))}
      </div>

      <div className="flex gap-[8px] mt-4 pt-3 border-t border-[var(--border)]">
        <input
          type="text"
          value={chatQuery}
          onChange={(e) => setChatQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(chatQuery)}
          placeholder="Ask a custom question..."
          className="flex-1 bg-[var(--surface)] border border-[var(--border)] text-[12px] text-[var(--foreground)] rounded-[8px] px-3 outline-none focus:border-[var(--primary)] font-serif"
          style={{ height: "38px" }}
        />
        <button
          onClick={() => handleSend(chatQuery)}
          className="bg-[var(--primary)] text-[#000] text-[11px] font-bold uppercase tracking-[0.05em] px-4 py-2 rounded-[8px] transition-colors hover:bg-[var(--primary-soft)]"
          style={{ height: "38px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function IndianLaw() {
  return (
    <section id="diff" className="section">
      <div className="section-inner">
        <div className="section-label sr">
          <span className="section-num">04 //</span> The Indian Law Difference
        </div>
        <h2 className="problem-h2 sr d1">
          Generic AI <em>describes</em> clauses. We tell you if they're <em>enforceable.</em>
        </h2>

        <div className="diff-layout">
          <div className="diff-col diff-col-a">
            <div>
              <div className="diff-col-label diff-col-label-a">Generic AI</div>
              <div className="diff-clause">
                "For a period of 12 months post-termination, Employee shall not engage with any competing business…"
              </div>
              <div className="diff-result-bad">
                ⚠️ This clause restricts your ability to work for competitors.
              </div>
            </div>
          </div>

          <div className="diff-col diff-col-b">
            <div>
              <div className="diff-col-label diff-col-label-b">LexSimplify</div>
              <div className="diff-clause">
                "For a period of 12 months post-termination, Employee shall not engage with any competing business…"
              </div>

              <div>
                <div className="diff-mini diff-mini-a">
                  <div className="diff-mini-label">// legal_position</div>
                  <div className="diff-mini-text">
                    S.27, Indian Contract Act 1872 — every agreement in restraint of trade is void. Post-employment non-competes are explicitly covered.
                  </div>
                </div>

                <div className="diff-mini diff-mini-b">
                  <div className="diff-mini-label">// judicial_interpretation</div>
                  <div className="diff-mini-text">
                    Superintendence Co v Krishnamurthy (SC 1981) — The Supreme Court settled this. Post-employment non-competes are void.
                  </div>
                </div>

                <div className="diff-mini diff-mini-c">
                  <div className="diff-mini-label">// what_this_means_for_you</div>
                  <div className="diff-mini-text">
                    This clause cannot legally stop you from joining a competitor. Companies include it as a scare tactic.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LegalLiteracy() {
  return (
    <section id="literacy" className="section">
      <div className="section-inner">
        <div className="section-label sr">
          <span className="section-num">05 //</span> Know Your Rights
        </div>
        <h2 className="problem-h2 sr d1">
          You have more legal protection <em>than you think.</em>
        </h2>

        <div className="laws-grid">
          {lawArticles.slice(0, 3).map((l, idx) => (
            <Link
              key={l.id}
              to="/rights"
              className="law-tile group"
            >
              <div className="law-n">0{idx + 1}</div>
              <div className="law-title">{l.question}</div>
              <div className="law-text">{l.teaser}</div>
              <div className="law-arr">Explore guides →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const items = [
    {
      icon: "🔒",
      title: "Your contract never trains our model.",
      text: "Documents are processed and discarded. We do not store your legal documents longer than your session.",
    },
    {
      icon: "⚠️",
      title: "This is a legal literacy tool — not legal advice.",
      text: "LexSimplify helps you understand your contract. For disputes or negotiations involving significant money, consult a qualified lawyer.",
    },
    {
      icon: "📋",
      title: "Every flagged clause includes the exact quote.",
      text: "If we can't find a clause verbatim in your document, we don't report it. No invented findings.",
    },
  ];

  return (
    <section id="trust" className="section">
      <div className="section-inner">
        <div className="section-label sr">
          <span className="section-num">06 //</span> Trust & Verification
        </div>

        <div className="trust-row">
          {items.map((i, idx) => (
            <div
              key={idx}
              className="trust-card"
              data-num={`0${idx + 1}`}
            >
              <div className="trust-icon">{i.icon}</div>
              <div className="trust-title">{i.title}</div>
              <div className="trust-text">{i.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section id="cta" className="section text-center py-[80px] md:py-[140px] relative z-[1]">
      <div className="cta-inner max-w-[900px] mx-auto space-y-6">
        <div className="cta-eyebrow font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--subtle)] mb-[24px]">
          Ready to verify?
        </div>
        <h2 className="cta-h2 font-serif text-[clamp(40px,6vw,80px)] font-light leading-[1.12] tracking-[-0.04em] mb-[24px]">
          Know what you're signing. <br />
          <em className="font-serif italic font-light text-[var(--primary)]">Before you sign it.</em>
        </h2>
        <p className="cta-sub font-serif text-[17px] font-light italic text-[var(--muted-foreground)] leading-[1.6] max-w-[480px] mx-auto mb-[40px]">
          Upload your contract now and get a plain-English breakdown of every clause in 60 seconds.
        </p>

        <div className="cta-btns flex gap-[12px] justify-center flex-wrap">
          <Link
            to="/analyze"
            className="btn-primary inline-flex items-center gap-[10px] bg-[var(--primary)] text-[#000] text-[13px] font-bold tracking-[0.05em] uppercase p-[16px_32px] rounded-[100px] border-none transition-all duration-300 hover:translate-y-[-3px] hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(200,255,0,0.35)] hover:bg-[var(--primary-soft)] select-none"
          >
            Analyze My Contract <span className="arrow">→</span>
          </Link>
          <Link
            to="/rights"
            className="btn-outline inline-flex items-center gap-[8px] border border-[var(--border)] text-[var(--muted-foreground)] text-[13px] font-semibold tracking-[0.04em] uppercase p-[14px_28px] rounded-[100px] bg-transparent transition-all duration-[0.25s] hover:border-[var(--foreground)] hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.04)]"
          >
            Read Guides
          </Link>
        </div>
        <div className="cta-disclaimer mt-[24px] font-mono text-[10px] text-[var(--subtle)] tracking-[0.05em]">
          Free analysis · No credit card required · Isolated Azure Containers
        </div>
      </div>
    </section>
  );
}
