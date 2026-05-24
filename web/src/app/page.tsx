"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Scan, Brain, Sparkles, Terminal, CheckCircle, Copy, Check } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import TypingCode from "@/components/TypingCode";
import { FadeIn, StaggerChildren, StaggerItem, ScaleIn } from "@/components/Animations";

const INSTALL_CMD = "npm install -g @0xdevabir/enhance";

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

  const copy = async () => {
    await navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="group flex items-center gap-4 px-5 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-indigo-500/30 hover:bg-[var(--card-hover)] transition-all duration-300 font-mono text-sm cursor-pointer"
    >
      <span className="text-[var(--muted-foreground)]">$</span>
      <span className="text-indigo-300">{INSTALL_CMD}</span>
      <span className="ml-auto pl-4 border-l border-[var(--border)] text-[var(--muted-foreground)] group-hover:text-white transition-colors">
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </span>
    </button>
  );
}

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <BackgroundOrbs />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* ── Hero ─────────────────────────────────────── */}
        <section className="flex flex-col items-center justify-center text-center px-5 pt-24 pb-20 relative">
          <FadeIn delay={0}>
            <span className="pill mb-6">
              <Zap size={11} className="text-indigo-400" />
              @0xdevabir/enhance · v0.1.0 on npm
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6 max-w-4xl">
              <span className="text-white">Your AI coding prompt,</span>
              <br />
              <span className="shimmer-text">upgraded automatically</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-10 max-w-xl leading-relaxed">
              Enhance scans your project, detects your stack, and rewrites vague prompts
              into structured AI instructions — before you hit send.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="w-full max-w-xl">
            <InstallBox />
          </FadeIn>

          <FadeIn delay={0.4} className="mt-5 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/docs/installation"
              className="btn-primary relative flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get started <ArrowRight size={14} />
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

          <FadeIn delay={0.5} className="mt-8">
            <p className="text-xs text-[var(--muted-foreground)]">
              Works with{" "}
              {["Claude Code", "OpenCode", "Codex CLI"].map((t, i) => (
                <span key={t}>
                  <span className="text-white/60">{t}</span>
                  {i < 2 && <span className="mx-2 opacity-30">·</span>}
                </span>
              ))}
            </p>
          </FadeIn>
        </section>

        {/* ── Before / After ───────────────────────────── */}
        <section className="px-5 py-16 max-w-6xl mx-auto w-full">
          <div className="section-divider mb-16" />

          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">See the difference</h2>
            <p className="text-[var(--muted-foreground)]">5 words in. Fully structured prompt out.</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-4 items-start">
            {/* Before */}
            <ScaleIn delay={0.1}>
              <div className="gradient-border overflow-hidden">
                <div className="terminal-header">
                  <div className="terminal-dot bg-red-500/70" />
                  <div className="terminal-dot bg-yellow-500/70" />
                  <div className="terminal-dot bg-green-500/70" />
                  <span className="ml-2 text-xs text-[var(--muted-foreground)] font-mono">You type</span>
                </div>
                <div className="p-5 font-mono text-sm">
                  <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-1 text-xs">
                    <span className="text-indigo-400">/enhance</span>
                  </div>
                  <div className="text-white/90 text-base">build login page</div>
                  <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                    5 words · vague · no context · inconsistent results
                  </div>
                </div>
              </div>
            </ScaleIn>

            {/* After */}
            <ScaleIn delay={0.2}>
              <div className="gradient-border overflow-hidden">
                <div className="terminal-header">
                  <div className="terminal-dot bg-red-500/70" />
                  <div className="terminal-dot bg-yellow-500/70" />
                  <div className="terminal-dot bg-green-500/70" />
                  <span className="ml-2 text-xs text-[var(--muted-foreground)] font-mono">AI receives</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">enhanced</span>
                </div>
                <div className="p-5">
                  <TypingCode
                    lines={AFTER_LINES}
                    speed={12}
                    startDelay={800}
                    className="font-mono text-xs text-[var(--muted-foreground)] leading-7"
                  />
                </div>
              </div>
            </ScaleIn>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────── */}
        <section className="px-5 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="section-divider mb-16" />

            <FadeIn className="text-center mb-14">
              <h2 className="text-3xl font-bold text-white mb-3">How it works</h2>
              <p className="text-[var(--muted-foreground)]">Four steps. Zero configuration required.</p>
            </FadeIn>

            <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <StaggerItem key={step.title}>
                    <div className={`feature-card group p-6 h-full cursor-default ${step.border}`}>
                      <div className="mb-5">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} border border-white/5 flex items-center justify-center mb-3`}>
                          <Icon size={16} className={step.iconColor} />
                        </div>
                        <div className="text-xs font-mono text-[var(--muted-foreground)] mb-1">{step.step}</div>
                        <h3 className="font-semibold text-white text-sm leading-snug">{step.title}</h3>
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* ── Features + Quick start ────────────────────── */}
        <section className="px-5 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="section-divider mb-16" />

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <FadeIn direction="right">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Everything built in</h2>
                  <p className="text-[var(--muted-foreground)] mb-8 leading-relaxed">
                    Years of prompt engineering best practices packed into a single slash command.
                    No setup. No config files.
                  </p>
                  <ul className="space-y-2.5">
                    {FEATURES.map((f, i) => (
                      <motion.li
                        key={f}
                        className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]"
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, duration: 0.4 }}
                      >
                        <CheckCircle size={13} className="text-indigo-400 flex-shrink-0" />
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              <FadeIn direction="left" delay={0.1}>
                <div className="space-y-3">
                  <div className="gradient-border overflow-hidden">
                    <div className="terminal-header">
                      <div className="terminal-dot bg-red-500/70" />
                      <div className="terminal-dot bg-yellow-500/70" />
                      <div className="terminal-dot bg-green-500/70" />
                      <span className="ml-2 text-xs text-[var(--muted-foreground)] font-mono">setup.sh</span>
                    </div>
                    <pre className="p-5 font-mono text-xs leading-7 text-[var(--muted-foreground)]">
                      <div><span className="text-[#4b5563]"># Install globally</span></div>
                      <div><span className="text-green-400">npm install -g @0xdevabir/enhance</span></div>
                      <div className="mt-2"><span className="text-[#4b5563]"># Install /enhance into your AI tools</span></div>
                      <div><span className="text-green-400">enhance setup</span></div>
                      <div className="mt-2"><span className="text-[#4b5563]"># Inside Claude Code / OpenCode / Codex:</span></div>
                      <div><span className="text-indigo-300">/enhance build a login page</span></div>
                    </pre>
                  </div>

                  <div className="gradient-border overflow-hidden">
                    <div className="terminal-header">
                      <span className="text-xs text-[var(--muted-foreground)] font-mono">enhance setup output</span>
                    </div>
                    <pre className="p-5 font-mono text-xs leading-7 text-[var(--muted-foreground)]">
                      <div className="text-white font-semibold mb-1">Enhance — Setup</div>
                      <div><span className="text-[#4b5563]">Detected:</span> Claude Code, OpenCode</div>
                      <div className="mt-1"><span className="text-green-400">✓</span> Claude Code → ~/.claude/commands/enhance.md</div>
                      <div><span className="text-green-400">✓</span> OpenCode    → ~/.opencode/commands/enhance.md</div>
                      <div className="mt-2 text-white/60">Ready. In any project, type:</div>
                      <div className="mt-1 text-indigo-300">/enhance build a login page</div>
                    </pre>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="px-5 py-24">
          <div className="section-divider mb-16" />
          <FadeIn className="max-w-2xl mx-auto text-center">
            <div className="gradient-border p-10 rounded-2xl relative overflow-hidden">
              {/* Inner glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 bg-indigo-500/5 rounded-full blur-[60px]" />
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-3">Write better prompts today</h2>
                <p className="text-[var(--muted-foreground)] mb-8 leading-relaxed">
                  Install in 30 seconds. Works with the AI tools you already use.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/docs/installation"
                    className="btn-primary relative flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get started free <ArrowRight size={14} />
                    </span>
                  </Link>
                  <Link
                    href="https://github.com/0xdevabir/agent-enhance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] hover:border-indigo-500/30 text-[var(--muted-foreground)] hover:text-white text-sm font-medium transition-all duration-300"
                  >
                    Star on GitHub
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        <Footer />
      </div>
    </div>
  );
}
