import CodeBlock from "@/components/CodeBlock";

const CONFIG_EXAMPLE = `{
  "provider": "claude",
  "model": "claude-sonnet-4-6",
  "maxContextTokens": 3000,
  "customInstructions": "Always use React Query for data fetching. Prefer named exports."
}`;

const SCHEMA = [
  { key: "provider", type: "string", default: "claude", desc: "AI provider: claude | codex | opencode" },
  { key: "model", type: "string", default: "claude-sonnet-4-6", desc: "Model ID to use" },
  { key: "maxContextTokens", type: "number", default: "3000", desc: "Max characters of project files to include as context" },
  { key: "customInstructions", type: "string", default: "—", desc: "Extra instructions injected into every enhanced prompt" },
];

export default function ConfigurationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-3">Configuration</h1>
      <p className="text-[var(--muted-foreground)] mb-8 leading-relaxed">
        Enhance works with zero config. But you can customize it per-project with a config file.
      </p>

      <h2 className="text-lg font-semibold text-white mb-3">Config file</h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-4">
        Create a <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">.enhancerc.json</code> file
        in your project root:
      </p>
      <CodeBlock code={CONFIG_EXAMPLE} filename=".enhancerc.json" />

      <p className="text-xs text-[var(--muted-foreground)] mt-3 mb-8">
        Also supported: <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">.enhancerc</code>,{" "}
        <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">.enhancerc.yaml</code>,{" "}
        <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">enhance.config.js</code>, or a{" "}
        <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">&quot;enhance&quot;</code> key in package.json.
      </p>

      <h2 className="text-lg font-semibold text-white mb-3">Options</h2>
      <div className="border border-[var(--border)] rounded-xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--card)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">Key</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">Default</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">Description</th>
            </tr>
          </thead>
          <tbody>
            {SCHEMA.map((row, i) => (
              <tr key={row.key} className={i < SCHEMA.length - 1 ? "border-b border-[var(--border)]" : ""}>
                <td className="px-4 py-3 font-mono text-xs text-indigo-300">{row.key}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{row.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">{row.default}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-semibold text-white mb-3">API key</h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-4">
        Set via environment variable. Never hardcode in the config file.
      </p>
      <CodeBlock
        code={`# Add to ~/.zshrc or ~/.bashrc to make permanent\nexport ANTHROPIC_API_KEY=sk-ant-...\n\n# Reload shell\nsource ~/.zshrc`}
        filename="Terminal"
      />

      <div className="mt-6 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
        <p className="text-xs text-yellow-400 font-medium mb-1">Security note</p>
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
          Never commit API keys to git. The config file is for provider/model preferences only.
          Keys always come from environment variables.
        </p>
      </div>
    </div>
  );
}
