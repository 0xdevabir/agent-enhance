import Link from "next/link";
import { ArrowRight, Zap, Scan, Brain, Sparkles } from "lucide-react";

export default function DocsIndex() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">Documentation</h1>
        <p className="text-[var(--muted-foreground)] leading-relaxed">
          Enhance is an AI prompt middleware that rewrites your vague coding prompts into
          structured, project-aware instructions before sending them to Claude Code, OpenCode, or Codex CLI.
        </p>
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">Quick start</h2>
      <div className="code-block p-4 mb-8 font-mono text-sm">
        <div className="text-[var(--muted-foreground)] mb-1"># Install globally</div>
        <div className="text-green-400">npm install -g @0xdevabir/enhance</div>
        <div className="mt-3 text-[var(--muted-foreground)] mb-1"># Install /enhance slash command into your AI tools</div>
        <div className="text-green-400">enhance setup</div>
        <div className="mt-3 text-[var(--muted-foreground)] mb-1"># Use inside Claude Code / OpenCode / Codex CLI</div>
        <div className="text-indigo-300">/enhance build a login page</div>
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">How it works</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {[
          { icon: Scan, title: "Project scanning", desc: "Reads package.json, tsconfig, folder structure to detect your full stack." },
          { icon: Brain, title: "Intent analysis", desc: "Understands action (create/fix/refactor), entity (page/API/component), and feature domain." },
          { icon: Sparkles, title: "Prompt rewriting", desc: "Injects framework rules, security best practices, and existing code patterns." },
          { icon: Zap, title: "Approval loop", desc: "Shows you the enhanced prompt. Refine with 'no', execute with 'yes'." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className="text-indigo-400" />
              <span className="font-medium text-white text-sm">{title}</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">Explore the docs</h2>
      <div className="flex flex-col gap-2">
        {[
          { href: "/docs/installation", label: "Installation", desc: "Install globally and run enhance setup" },
          { href: "/docs/usage", label: "Usage", desc: "Using /enhance and the standalone CLI" },
          { href: "/docs/configuration", label: "Configuration", desc: "Customize with .enhancerc.json" },
          { href: "/docs/providers", label: "Providers", desc: "Claude Code, OpenCode, Codex CLI setup" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] hover:border-indigo-500/30 bg-[var(--card)] transition-colors group"
          >
            <div>
              <div className="text-sm font-medium text-white mb-0.5">{l.label}</div>
              <div className="text-xs text-[var(--muted-foreground)]">{l.desc}</div>
            </div>
            <ArrowRight size={14} className="text-[var(--muted-foreground)] group-hover:text-white transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
