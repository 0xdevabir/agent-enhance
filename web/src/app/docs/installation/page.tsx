import CodeBlock from "@/components/CodeBlock";

export default function InstallationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Installation</h1>
      <p className="text-[var(--muted-foreground)] mb-8 leading-relaxed">
        Install enhance globally, then run <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">enhance setup</code> to
        install the <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">/enhance</code> slash command
        into every AI coding tool it detects on your machine.
      </p>

      <h2 className="text-lg font-semibold text-white mb-3">Prerequisites</h2>
      <ul className="text-sm text-[var(--muted-foreground)] space-y-1.5 mb-8 list-disc list-inside">
        <li>Node.js 20 or later</li>
        <li>At least one AI coding tool: Claude Code, OpenCode, or Codex CLI</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mb-3">Step 1 — Install globally</h2>
      <CodeBlock code="npm install -g @0xdevabir/enhance" filename="Terminal" />
      <p className="text-xs text-[var(--muted-foreground)] mt-3 mb-8">
        If you get a permission error, fix npm permissions first:
      </p>
      <CodeBlock
        code={`mkdir -p ~/.npm-global\nnpm config set prefix '~/.npm-global'\necho 'export PATH=$HOME/.npm-global/bin:$PATH' >> ~/.zshrc\nsource ~/.zshrc\nnpm install -g @0xdevabir/enhance`}
        filename="Fix npm permissions (macOS/Linux)"
      />

      <h2 className="text-lg font-semibold text-white mt-8 mb-3">Step 2 — Run setup</h2>
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

      <h2 className="text-lg font-semibold text-white mt-8 mb-3">Setup options</h2>
      <CodeBlock
        code={`enhance setup --force   # overwrite existing installations\nenhance setup --all     # install for all tools even if not in PATH`}
        filename="Terminal"
      />

      <h2 className="text-lg font-semibold text-white mt-8 mb-3">Step 3 — Use it</h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-3">
        Open Claude Code, OpenCode, or Codex CLI in any project:
      </p>
      <CodeBlock
        code={`/enhance build a login page with email and password`}
        filename="Claude Code / OpenCode / Codex"
      />

      <div className="mt-8 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
        <p className="text-sm text-indigo-300 font-medium mb-1">That&apos;s it.</p>
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
          Enhance scans your project, rewrites the prompt with full context and best practices,
          and shows you the result before executing. Say <strong className="text-white">yes</strong> to proceed
          or <strong className="text-white">no</strong> to refine.
        </p>
      </div>
    </div>
  );
}
