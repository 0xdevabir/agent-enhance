"use client";
import CodeBlock from "@/components/CodeBlock";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/Animations";
import { Download, Settings, Play, CheckCircle2 } from "lucide-react";

const STEPS = [
  { icon: Download, label: "Install globally", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { icon: Settings, label: "Run setup", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { icon: Play, label: "Use it", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
];

export default function InstallationPage() {
  return (
    <div>
      <FadeIn>
        <h1 className="text-white mb-4">
          <span className="gradient-text">Installation</span>
        </h1>
        <p className="text-[var(--muted-foreground)] mb-8 leading-relaxed">
          Install enhance globally, then run{" "}
          <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">enhance setup</code> to
          install the{" "}
          <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">/enhance</code>{" "}
          slash command into every AI coding tool it detects on your machine.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {STEPS.map(({ icon: Icon, label, color, bg, border }, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${border} ${bg}`}>
                <Icon size={13} className={color} />
                <span className={`text-xs font-medium ${color}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-[var(--border)]" />}
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <h2>Prerequisites</h2>
        <div className="callout-info mb-8">
          <ul className="space-y-2">
            {["Node.js 20 or later", "At least one AI coding tool: Claude Code, OpenCode, or Codex CLI"].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="flex items-center gap-3 mb-3">
          <span className="step-circle">1</span>
          <h2 className="!mt-0 !mb-0">Install globally</h2>
        </div>
        <CodeBlock code="npm install -g @0xdevabir/enhance" filename="Terminal" />
        <p className="text-xs text-[var(--muted-foreground)] mt-3 mb-4">
          If you get a permission error, fix npm permissions first:
        </p>
        <CodeBlock
          code={`mkdir -p ~/.npm-global\nnpm config set prefix '~/.npm-global'\necho 'export PATH=$HOME/.npm-global/bin:$PATH' >> ~/.zshrc\nsource ~/.zshrc\nnpm install -g @0xdevabir/enhance`}
          filename="Fix npm permissions (macOS/Linux)"
        />
      </FadeIn>

      <FadeIn delay={0.25}>
        <div className="flex items-center gap-3 mt-8 mb-3">
          <span className="step-circle">2</span>
          <h2 className="!mt-0 !mb-0">Run setup</h2>
        </div>
        <CodeBlock code="enhance setup" filename="Terminal" />
        <p className="text-sm text-[var(--muted-foreground)] mt-3 mb-4 leading-relaxed">
          Detects which AI coding tools you have installed and installs the{" "}
          <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">/enhance</code> slash command for each one.
        </p>
        <CodeBlock
          code={`Enhance — Setup\n\nDetected: Claude Code, OpenCode\nNot found: Codex CLI\n\n✓ Claude Code → ~/.claude/commands/enhance.md\n✓ OpenCode    → ~/.opencode/commands/enhance.md\n\nReady. In any project, type:\n\n  /enhance build a login page\n  /enhance fix the auth bug`}
          filename="Output"
          showCopy={false}
        />
        <h2>Setup options</h2>
        <CodeBlock
          code={`enhance setup --force   # overwrite existing installations\nenhance setup --all     # install for all tools even if not in PATH`}
          filename="Terminal"
        />
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="flex items-center gap-3 mt-8 mb-3">
          <span className="step-circle">3</span>
          <h2 className="!mt-0 !mb-0">Use it</h2>
        </div>
        <p className="text-sm text-[var(--muted-foreground)] mb-3">
          Open Claude Code, OpenCode, or Codex CLI in any project:
        </p>
        <CodeBlock
          code={`/enhance build a login page with email and password`}
          filename="Claude Code / OpenCode / Codex"
        />
        <div className="mt-8 callout-success">
          <p className="text-sm text-emerald-400 font-semibold mb-1">That&apos;s it.</p>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            Enhance scans your project, rewrites the prompt with full context and best practices,
            and shows you the result before executing. Say{" "}
            <strong className="text-white">yes</strong> to proceed or{" "}
            <strong className="text-white">no</strong> to refine.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
