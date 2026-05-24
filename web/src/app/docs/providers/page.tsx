"use client";
import CodeBlock from "@/components/CodeBlock";
import { FadeIn, StaggerChildren, StaggerItem, GlowCard } from "@/components/Animations";
import { CheckCircle, Plug } from "lucide-react";

const PROVIDERS = [
  {
    name: "Claude Code",
    cmd: "claude",
    status: "recommended",
    statusColor: "bg-green-500/10 border-green-500/20 text-green-400",
    install: null,
    setup: "enhance setup",
    apiKey: "ANTHROPIC_API_KEY",
    desc: "Built by Anthropic. The default and most capable provider. Slash command works after enhance setup.",
    docs: "https://claude.ai/code",
    iconColor: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  },
  {
    name: "OpenCode",
    cmd: "opencode",
    status: "supported",
    statusColor: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    install: "npm install -g opencode",
    setup: "enhance setup",
    apiKey: "OPENAI_API_KEY or ANTHROPIC_API_KEY",
    desc: "Open-source AI coding tool. Install it, then run enhance setup to register the /enhance command.",
    docs: "https://opencode.ai",
    iconColor: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  },
  {
    name: "Codex CLI",
    cmd: "codex",
    status: "supported",
    statusColor: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    install: "npm install -g @openai/codex",
    setup: "enhance setup",
    apiKey: "OPENAI_API_KEY",
    desc: "OpenAI's coding agent. Install it, then run enhance setup.",
    docs: "https://github.com/openai/codex",
    iconColor: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  },
];

export default function ProvidersPage() {
  return (
    <div>
      <FadeIn>
        <h1 className="text-white mb-4">
          <span className="gradient-text">Providers</span>
        </h1>
        <p className="text-[var(--muted-foreground)] mb-8 leading-relaxed">
          Enhance works with Claude Code, OpenCode, and Codex CLI. Run{" "}
          <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">enhance setup</code> to
          auto-detect which tools you have installed and configure them all at once.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h2>Auto-detect all providers</h2>
        <CodeBlock
          code={`# Detects installed tools, installs /enhance for each\nenhance setup\n\n# Force install for all tools (even if not in PATH)\nenhance setup --all\n\n# Overwrite existing installations\nenhance setup --force`}
          filename="Terminal"
        />
      </FadeIn>

      <FadeIn delay={0.15}>
        <h2>Supported providers</h2>
      </FadeIn>

      <StaggerChildren className="space-y-5 mb-10" delay={0.2} stagger={0.12}>
        {PROVIDERS.map((p) => (
          <StaggerItem key={p.name}>
            <GlowCard className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${p.iconColor}`}>
                    <Plug size={15} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{p.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${p.statusColor}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed max-w-lg">{p.desc}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-[var(--border)] pt-4">
                {p.install && (
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)] mb-1.5">Install provider</p>
                    <CodeBlock code={p.install} />
                  </div>
                )}
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] mb-1.5">Register /enhance command</p>
                  <CodeBlock code={p.setup} />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] mb-1.5">Required API key</p>
                  <CodeBlock code={`export ${p.apiKey}=your-key-here`} />
                </div>
              </div>

              <a
                href={p.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-xs text-indigo-400 hover:text-indigo-300 transition-colors underline-glow"
              >
                {p.name} documentation →
              </a>
            </GlowCard>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <FadeIn delay={0.4}>
        <h2>Standalone CLI mode</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Use enhance directly from your terminal — no AI coding tool needed. Calls Claude API directly and streams the response.
        </p>
        <CodeBlock
          code={`export ANTHROPIC_API_KEY=sk-ant-...\n\n# Use Claude (default)\nenhance "build a login page"\n\n# Use a specific provider via CLI flag\nenhance "build a login page" --provider codex\nenhance "build a login page" --provider opencode`}
          filename="Terminal"
        />
      </FadeIn>

      <FadeIn delay={0.45}>
        <div className="mt-6 callout-info">
          <p className="text-xs font-semibold text-white mb-3">Slash command vs standalone CLI</p>
          <div className="space-y-2">
            {[
              { label: "Slash command (/enhance)", desc: "Works inside Claude Code, OpenCode, or Codex. AI runs in the tool's session. No API key needed in your env." },
              { label: "Standalone CLI (enhance \"...\")", desc: "Calls AI directly from terminal. Needs ANTHROPIC_API_KEY. Good for scripting or when outside an AI coding session." },
            ].map(({ label, desc }) => (
              <div key={label} className="flex gap-2">
                <CheckCircle size={13} className="text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs text-white font-medium">{label} </span>
                  <span className="text-xs text-[var(--muted-foreground)]">— {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
