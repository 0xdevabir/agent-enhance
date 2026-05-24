import CodeBlock from "@/components/CodeBlock";
import { CheckCircle, XCircle } from "lucide-react";

const PROVIDERS = [
  {
    name: "Claude Code",
    cmd: "claude",
    status: "recommended",
    install: null,
    setup: "enhance setup",
    apiKey: "ANTHROPIC_API_KEY",
    desc: "Built by Anthropic. The default and most capable provider. Slash command works after enhance setup.",
    docs: "https://claude.ai/code",
  },
  {
    name: "OpenCode",
    cmd: "opencode",
    status: "supported",
    install: "npm install -g opencode",
    setup: "enhance setup",
    apiKey: "OPENAI_API_KEY or ANTHROPIC_API_KEY",
    desc: "Open-source AI coding tool. Install it, then run enhance setup to register the /enhance command.",
    docs: "https://opencode.ai",
  },
  {
    name: "Codex CLI",
    cmd: "codex",
    status: "supported",
    install: "npm install -g @openai/codex",
    setup: "enhance setup",
    apiKey: "OPENAI_API_KEY",
    desc: "OpenAI's coding agent. Install it, then run enhance setup.",
    docs: "https://github.com/openai/codex",
  },
];

export default function ProvidersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Providers</h1>
      <p className="text-[var(--muted-foreground)] mb-8 leading-relaxed">
        Enhance works with Claude Code, OpenCode, and Codex CLI. Run{" "}
        <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">enhance setup</code> to
        auto-detect which tools you have installed and configure them all at once.
      </p>

      <h2 className="text-lg font-semibold text-white mb-4">Auto-detect all providers</h2>
      <CodeBlock
        code={`# Detects installed tools, installs /enhance for each\nenhance setup\n\n# Force install for all tools (even if not in PATH)\nenhance setup --all\n\n# Overwrite existing installations\nenhance setup --force`}
        filename="Terminal"
      />

      <h2 className="text-lg font-semibold text-white mt-10 mb-4">Supported providers</h2>

      <div className="space-y-5">
        {PROVIDERS.map((p) => (
          <div key={p.name} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{p.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                    p.status === "recommended"
                      ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed max-w-lg">{p.desc}</p>
              </div>
            </div>

            <div className="space-y-2">
              {p.install && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] mb-1">Install provider</p>
                  <CodeBlock code={p.install} />
                </div>
              )}
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Register /enhance command</p>
                <CodeBlock code={p.setup} />
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Required API key</p>
                <CodeBlock code={`export ${p.apiKey}=your-key-here`} />
              </div>
            </div>

            <a
              href={p.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {p.name} documentation →
            </a>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-white mt-10 mb-4">Standalone CLI mode</h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-4">
        Use enhance directly from your terminal — no AI coding tool needed. Calls Claude API directly and streams the response.
      </p>
      <CodeBlock
        code={`export ANTHROPIC_API_KEY=sk-ant-...\n\n# Use Claude (default)\nenhance "build a login page"\n\n# Use a specific provider via CLI flag\nenhance "build a login page" --provider codex\nenhance "build a login page" --provider opencode`}
        filename="Terminal"
      />

      <div className="mt-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <p className="text-xs font-medium text-white mb-2">Slash command vs standalone CLI</p>
        <div className="space-y-1.5">
          {[
            { label: "Slash command (/enhance)", desc: "Works inside Claude Code, OpenCode, or Codex. AI runs in the tool's session. No API key needed in your env." },
            { label: "Standalone CLI (enhance \"...\")", desc: "Calls AI directly from terminal. Needs ANTHROPIC_API_KEY. Good for scripting or when outside an AI coding session." },
          ].map(({ label, desc }) => (
            <div key={label} className="flex gap-2">
              <CheckCircle size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-white font-medium">{label} </span>
                <span className="text-xs text-[var(--muted-foreground)]">— {desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
