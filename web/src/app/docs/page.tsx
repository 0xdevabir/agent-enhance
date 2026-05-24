"use client";
import Link from "next/link";
import { ArrowRight, Zap, Scan, Brain, Sparkles, BookOpen } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, GlowCard } from "@/components/Animations";

const HOW_IT_WORKS = [
  { icon: Scan, title: "Project scanning", desc: "Reads package.json, tsconfig, folder structure to detect your full stack.", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Brain, title: "Intent analysis", desc: "Understands action (create/fix/refactor), entity (page/API/component), and feature domain.", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Sparkles, title: "Prompt rewriting", desc: "Injects framework rules, security best practices, and existing code patterns.", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { icon: Zap, title: "Approval loop", desc: "Shows you the enhanced prompt. Refine with 'no', execute with 'yes'.", color: "text-pink-400", bg: "bg-pink-500/10" },
];

const NAV_LINKS = [
  { href: "/docs/installation", label: "Installation", desc: "Install globally and run enhance setup", emoji: "📦" },
  { href: "/docs/usage", label: "Usage", desc: "Using /enhance and the standalone CLI", emoji: "⚡" },
  { href: "/docs/configuration", label: "Configuration", desc: "Customize with .enhancerc.json", emoji: "⚙️" },
  { href: "/docs/providers", label: "Providers", desc: "Claude Code, OpenCode, Codex CLI setup", emoji: "🔌" },
];

export default function DocsIndex() {
  return (
    <div>
      {/* Header */}
      <FadeIn>
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <BookOpen size={15} className="text-indigo-400" />
            </div>
            <span className="text-label text-indigo-400">Documentation</span>
          </div>
          <h1 className="text-white mb-4">
            Everything you need to{" "}
            <span className="gradient-text">enhance your AI</span>
          </h1>
          <p className="text-[var(--muted-foreground)] leading-relaxed max-w-xl">
            Enhance is an AI prompt middleware that rewrites your vague coding prompts into
            structured, project-aware instructions before sending them to Claude Code, OpenCode, or Codex CLI.
          </p>
        </div>
      </FadeIn>

      {/* Quick start */}
      <FadeIn delay={0.1}>
        <h2>Quick start</h2>
        <div className="code-block p-5 mb-10 font-mono text-sm relative overflow-hidden">
          <div className="scan-line" />
          <div className="terminal-header -mx-5 -mt-5 mb-4">
            <div className="terminal-dot bg-red-400/70" />
            <div className="terminal-dot bg-yellow-400/70" />
            <div className="terminal-dot bg-green-400/70" />
            <span className="ml-2 text-xs text-[var(--muted-foreground)]">Terminal</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-[var(--muted-foreground)] text-xs mb-1"># Install globally</div>
              <div className="text-green-400">npm install -g @0xdevabir/enhance</div>
            </div>
            <div>
              <div className="text-[var(--muted-foreground)] text-xs mb-1"># Install /enhance slash command into your AI tools</div>
              <div className="text-green-400">enhance setup</div>
            </div>
            <div>
              <div className="text-[var(--muted-foreground)] text-xs mb-1"># Use inside Claude Code / OpenCode / Codex CLI</div>
              <div className="text-indigo-300">/enhance build a login page</div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* How it works */}
      <FadeIn delay={0.15}>
        <h2>How it works</h2>
      </FadeIn>
      <StaggerChildren className="grid sm:grid-cols-2 gap-3 mb-10" delay={0.2} stagger={0.08}>
        {HOW_IT_WORKS.map(({ icon: Icon, title, desc, color, bg }) => (
          <StaggerItem key={title}>
            <GlowCard className="p-5">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon size={15} className={color} />
              </div>
              <div className="font-semibold text-white text-sm mb-1.5">{title}</div>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
            </GlowCard>
          </StaggerItem>
        ))}
      </StaggerChildren>

      {/* Explore */}
      <FadeIn delay={0.25}>
        <h2>Explore the docs</h2>
      </FadeIn>
      <StaggerChildren className="flex flex-col gap-2" delay={0.3} stagger={0.07}>
        {NAV_LINKS.map((l) => (
          <StaggerItem key={l.href}>
            <Link
              href={l.href}
              className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] hover:border-indigo-500/30 bg-[var(--card)] transition-all duration-300 group hover:bg-[var(--card-hover)]"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{l.emoji}</span>
                <div>
                  <div className="text-sm font-semibold text-white mb-0.5">{l.label}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{l.desc}</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-[var(--muted-foreground)] group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200" />
            </Link>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </div>
  );
}
