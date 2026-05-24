"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Scan, Brain, Sparkles, Terminal, CheckCircle, Copy, Check } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import TypingCode from "@/components/TypingCode";
import { FadeIn, StaggerChildren, StaggerItem, ScaleIn, SlideIn, AnimatedCounter, GlowCard } from "@/components/Animations";

const INSTALL_CMD = "npm install -g @0xdevabir/enhance";
const NPXCMD = "npx @0xdevabir/enhance@latest \"build a login page\"";

const AFTER_LINES = [
  "## ✦ Enhanced Prompt",
  "",
  "**Context:** Next.js App Router · TypeScript · TailwindCSS · shadcn/ui · Prisma",
  "",
  "**Task:** Build a responsive login page at app/(auth)/login/page.tsx",
  "with email/password fields and server-side session handling.",
  "",
  "**Requirements:**",
  "- Server Component by default — 'use client' only when needed",
  "- Use shadcn Form, Input, Button from @/components/ui/",
  "- No `any` types — export all interfaces",
  "- Never store plain-text passwords — use bcrypt or argon2",
  "- httpOnly Secure cookies for session tokens",
  "- Validate all inputs server-side with Zod",
  "- Mobile-first responsive layout with Tailwind",
  "- List every file created/modified at the end",
  "",
  "> Does this look right? Reply yes to execute, no to refine.",
];

const STEPS = [
  {
    icon: Scan,
    step: "01",
    title: "Scans your project",
    desc: "Reads package.json, tsconfig, folder structure. Detects Next.js, Tailwind, Prisma, shadcn/ui — all automatically.",
    color: "from-blue-500/10 to-blue-500/5",
    iconColor: "text-blue-400",
    border: "group-hover:border-blue-500/30",
  },
  {
    icon: Brain,
    step: "02",
    title: "Understands intent",
    desc: "Parses your raw prompt to extract action, entity, and feature domain. No extra instructions needed.",
    color: "from-violet-500/10 to-violet-500/5",
    iconColor: "text-violet-400",
    border: "group-hover:border-violet-500/30",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Rewrites the prompt",
    desc: "Injects stack-specific rules, security practices, conventions, and relevant code context.",
    color: "from-indigo-500/10 to-indigo-500/5",
    iconColor: "text-indigo-400",
    border: "group-hover:border-indigo-500/30",
  },
  {
    icon: Terminal,
    step: "04",
    title: "Executes on approval",
    desc: "Review the enhanced prompt. Say no to refine further, yes to execute. You stay in control.",
    color: "from-purple-500/10 to-purple-500/5",
    iconColor: "text-purple-400",
    border: "group-hover:border-purple-500/30",
  },
];

const FEATURES = [
  "Detects 15+ frameworks automatically",
  "App Router vs Pages Router aware",
  "Auth, payment & upload security rules",
  "TypeScript & Zod enforcement",
  "Finds relevant existing files for context",
  "Refinement loop — say no to improve",
  "Works with Claude Code, OpenCode, Codex",
  "One command installs globally",
];

function InstallBox() {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"install" | "npx">("install");

  const cmd = tab === "install" ? INSTALL_CMD : NPXCMD;

  const copy = async () => {
    await navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Tab switcher */}
      <div className="flex gap-1 mb-2">
        {(["install", "npx"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              tab === t
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "text-[var(--muted-foreground)] hover:text-white border border-transparent"
            }`}
          >
            {t === "install" ? "Global install" : "npx (no install)"}
          </button>
        ))}
      </div>

      <motion.button
        onClick={copy}
        whileHover={{ scale: 1.01, borderColor: "rgba(99,102,241,0.4)" }}
        whileTap={{ scale: 0.99 }}
        className="w-full group flex items-center gap-4 px-6 py-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-indigo-500/30 hover:bg-[var(--card-hover)] transition-colors duration-300 font-mono text-sm cursor-pointer"
      >
        <span className="text-[var(--muted-foreground)] text-base">$</span>
        <span className="text-indigo-300 text-sm truncate">{cmd}</span>
        <span className="ml-auto pl-4 border-l border-[var(--border)] text-[var(--muted-foreground)] group-hover:text-white transition-colors flex-shrink-0">
          {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
        </span>
      </motion.button>

      {tab === "install" && (
        <p className="text-xs text-[var(--muted-foreground)] mt-2">
          Permission error?{" "}
          <button onClick={() => setTab("npx")} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            Use npx instead
          </button>
          {" "}— no install needed.
        </p>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-4">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div className="relative w-full">
      <BackgroundOrbs />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Navbar />

        {/* ── Hero ─────────────────────────────────────── */}
        <section className="flex flex-col items-center justify-center text-center px-5 pt-28 pb-24 relative">
          <FadeIn delay={0}>
            <span className="pill mb-8">
              <Zap size={12} className="text-indigo-400" />
              @0xdevabir/enhance · v0.1.0 on npm
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-8 max-w-[60rem]">
              <span className="text-white">Your AI coding prompt,</span>
              <br />
              <span className="shimmer-text">upgraded automatically</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-10 max-w-[38rem] leading-relaxed">
              Enhance scans your project, detects your stack, and rewrites vague prompts
              into structured AI instructions — before you hit send.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="w-full max-w-[38rem] mx-auto">
            <InstallBox />
          </FadeIn>

          <FadeIn delay={0.4} className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/docs/installation"
              className="btn-primary relative flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get started <ArrowRight size={15} />
              </span>
            </Link>
            <Link
              href="https://github.com/0xdevabir/agent-enhance"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] hover:border-indigo-500/30 text-[var(--muted-foreground)] hover:text-white text-sm font-medium transition-all duration-300"
            >
              View on GitHub
            </Link>
          </FadeIn>

          <FadeIn delay={0.5} className="mt-10">
            <p className="text-sm text-[var(--muted-foreground)]">
              Works with{" "}
              {["Claude Code", "OpenCode", "Codex CLI"].map((t, i) => (
                <span key={t}>
                  <span className="text-white/70 font-medium">{t}</span>
                  {i < 2 && <span className="mx-2 opacity-30">·</span>}
                </span>
              ))}
            </p>
          </FadeIn>
        </section>

        {/* ── Stats row ────────────────────────────────── */}
        <section className="px-5 pb-16">
          <div className="max-w-[72rem] mx-auto">
            <div className="gradient-line mb-14" />
            <StaggerChildren className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center" stagger={0.1}>
              {[
                { value: 15, suffix: "+", label: "Frameworks detected" },
                { value: 30, suffix: "s", label: "Install time" },
                { value: 3, suffix: "", label: "AI tools supported" },
                { value: 100, suffix: "%", label: "Zero config required" },
              ].map(({ value, suffix, label }) => (
                <StaggerItem key={label}>
                  <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50">
                    <div className="text-3xl font-bold gradient-text mb-1.5">
                      <AnimatedCounter target={value} suffix={suffix} duration={1.2} />
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)] leading-snug">{label}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* ── Before / After ───────────────────────────── */}
        <section className="px-5 py-20">
          <div className="max-w-[72rem] mx-auto">
            <div className="section-divider mb-20" />

            <FadeIn className="text-center mb-14">
              <SectionLabel>Live demo</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                See the <span className="gradient-text">difference</span>
              </h2>
              <p className="text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed">5 words in. Fully structured prompt out.</p>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Before */}
              <SlideIn direction="left" delay={0.1} className="min-w-0">
                <div className="gradient-border overflow-hidden h-full">
                  <div className="terminal-header">
                    <div className="terminal-dot bg-red-500/70" />
                    <div className="terminal-dot bg-yellow-500/70" />
                    <div className="terminal-dot bg-green-500/70" />
                    <span className="ml-2 text-sm text-[var(--muted-foreground)] font-mono">You type</span>
                  </div>
                  <div className="p-6 font-mono">
                    <div className="text-indigo-400 text-sm mb-2">/enhance</div>
                    <div className="text-white/90 text-xl font-semibold mb-6">build login page</div>
                    <div className="pt-4 border-t border-[var(--border)] text-sm text-[var(--muted-foreground)] leading-relaxed">
                      5 words · vague · no context · inconsistent results
                    </div>
                  </div>
                </div>
              </SlideIn>

              {/* After */}
              <SlideIn direction="right" delay={0.2} className="min-w-0">
                <div className="gradient-border overflow-hidden">
                  <div className="terminal-header">
                    <div className="terminal-dot bg-red-500/70" />
                    <div className="terminal-dot bg-yellow-500/70" />
                    <div className="terminal-dot bg-green-500/70" />
                    <span className="ml-2 text-sm text-[var(--muted-foreground)] font-mono">AI receives</span>
                    <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-semibold">enhanced</span>
                  </div>
                  <div className="p-6 overflow-x-auto">
                    <TypingCode
                      lines={AFTER_LINES}
                      speed={10}
                      startDelay={600}
                      className="font-mono text-sm text-[var(--muted-foreground)] leading-7"
                    />
                  </div>
                </div>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────── */}
        <section className="px-5 py-20">
          <div className="max-w-[72rem] mx-auto">
            <div className="section-divider mb-20" />

            <FadeIn className="text-center mb-16">
              <SectionLabel>Process</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                How it <span className="gradient-text">works</span>
              </h2>
              <p className="text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed">Four steps. Zero configuration required.</p>
            </FadeIn>

            <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" stagger={0.12}>
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <StaggerItem key={step.title}>
                    <GlowCard className={`p-7 h-full cursor-default ${step.border}`}>
                      <div className="mb-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} border border-white/5 flex items-center justify-center mb-4`}>
                          <Icon size={20} className={step.iconColor} />
                        </div>
                        <div className="text-xs font-mono text-[var(--muted-foreground)] mb-1.5">{step.step}</div>
                        <h3 className="font-semibold text-white text-base leading-snug">{step.title}</h3>
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
                    </GlowCard>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* ── Features + Quick start ────────────────────── */}
        <section className="px-5 py-20">
          <div className="max-w-[72rem] mx-auto">
            <div className="section-divider mb-20" />

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <SlideIn direction="left">
                <div>
                  <SectionLabel>Features</SectionLabel>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-5">
                    Everything <span className="gradient-text">built in</span>
                  </h2>
                  <p className="text-base md:text-lg text-[var(--muted-foreground)] mb-10 leading-relaxed">
                    Years of prompt engineering best practices packed into a single slash command.
                    No setup. No config files.
                  </p>
                  <ul className="space-y-3.5">
                    {FEATURES.map((f, i) => (
                      <motion.li
                        key={f}
                        className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07, duration: 0.5 }}
                      >
                        <CheckCircle size={16} className="text-indigo-400 flex-shrink-0" />
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </SlideIn>

              <SlideIn direction="right" delay={0.1}>
                <div className="space-y-4">
                  <div className="gradient-border overflow-hidden">
                    <div className="terminal-header">
                      <div className="terminal-dot bg-red-500/70" />
                      <div className="terminal-dot bg-yellow-500/70" />
                      <div className="terminal-dot bg-green-500/70" />
                      <span className="ml-2 text-sm text-[var(--muted-foreground)] font-mono">setup.sh</span>
                    </div>
                    <pre className="p-6 font-mono text-sm leading-7 text-[var(--muted-foreground)]">
                      <div><span className="text-[#4b5563]"># Install globally</span></div>
                      <div><span className="text-green-400">npm install -g @0xdevabir/enhance</span></div>
                      <div className="mt-3"><span className="text-[#4b5563]"># Install /enhance into your AI tools</span></div>
                      <div><span className="text-green-400">enhance setup</span></div>
                      <div className="mt-3"><span className="text-[#4b5563]"># Inside Claude Code / OpenCode / Codex:</span></div>
                      <div><span className="text-indigo-300">/enhance build a login page</span></div>
                    </pre>
                  </div>

                  <div className="gradient-border overflow-hidden">
                    <div className="terminal-header">
                      <span className="text-sm text-[var(--muted-foreground)] font-mono">enhance setup output</span>
                    </div>
                    <pre className="p-6 font-mono text-sm leading-7 text-[var(--muted-foreground)]">
                      <div className="text-white font-semibold mb-2">Enhance — Setup</div>
                      <div><span className="text-[#4b5563]">Detected:</span> Claude Code, OpenCode</div>
                      <div className="mt-1.5"><span className="text-green-400">✓</span> Claude Code → ~/.claude/commands/enhance.md</div>
                      <div><span className="text-green-400">✓</span> OpenCode    → ~/.opencode/commands/enhance.md</div>
                      <div className="mt-3 text-white/60">Ready. In any project, type:</div>
                      <div className="mt-1 text-indigo-300">/enhance build a login page</div>
                    </pre>
                  </div>
                </div>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="px-5 py-28">
          <div className="max-w-[72rem] mx-auto">
            <div className="section-divider mb-20" />
          </div>
          <ScaleIn>
            <div className="max-w-[48rem] mx-auto text-center">
              <div className="gradient-border p-12 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-96 h-96 bg-indigo-500/8 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10">
                  <SectionLabel>Get started</SectionLabel>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-3 mb-4">
                    Write better prompts <span className="gradient-text">today</span>
                  </h2>
                  <p className="text-base md:text-lg text-[var(--muted-foreground)] mb-10 leading-relaxed">
                    Install in 30 seconds. Works with the AI tools you already use.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/docs/installation"
                      className="btn-primary relative flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-base"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Get started free <ArrowRight size={15} />
                      </span>
                    </Link>
                    <Link
                      href="https://github.com/0xdevabir/agent-enhance"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-8 py-4 rounded-xl border border-[var(--border)] hover:border-indigo-500/30 text-[var(--muted-foreground)] hover:text-white text-base font-medium transition-all duration-300"
                    >
                      Star on GitHub
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScaleIn>
        </section>

        <Footer />
      </div>
    </div>
  );
}
