"use client";
import CodeBlock from "@/components/CodeBlock";
import { FadeIn, StaggerChildren, StaggerItem, GlowCard } from "@/components/Animations";

const DETECTED = [
  { category: "Frameworks", items: "Next.js, React, Vue, Svelte, Nuxt, Remix, Astro, Express, Fastify, Hono, NestJS" },
  { category: "Styling", items: "TailwindCSS, shadcn/ui, Material UI, Chakra UI, Ant Design" },
  { category: "ORMs", items: "Prisma, Drizzle, TypeORM, Mongoose" },
  { category: "Router type", items: "Next.js App Router vs Pages Router (auto-detected)" },
  { category: "Language", items: "TypeScript vs JavaScript" },
  { category: "Package manager", items: "npm, yarn, pnpm, bun" },
];

const LOOP_STEPS = [
  { step: "1", label: "You type a vague prompt", code: "/enhance make dashboard" },
  {
    step: "2",
    label: "Enhance scans + rewrites — shows you the result",
    code: `## ✦ Enhanced Prompt\n\nContext: Next.js App Router, TypeScript, TailwindCSS, shadcn/ui\n\nTask: Build a responsive dashboard page at app/dashboard/page.tsx...\n\nRequirements:\n- Server Component by default\n- Use shadcn Card, Table components\n- No \`any\` types\n...\n\n> Does this look right? Reply yes to execute, no to refine.`,
  },
  { step: "3a", label: "Say yes → executes the task", code: "yes" },
  {
    step: "3b",
    label: "Say no → Enhance asks what to fix",
    code: `no\n\n# Claude asks: What's missing or wrong?\n\nadd dark mode and use recharts for the charts\n\n# Enhance revises and shows the updated prompt again.`,
  },
];

export default function UsagePage() {
  return (
    <div>
      <FadeIn>
        <h1 className="text-white mb-4">
          <span className="gradient-text">Usage</span>
        </h1>
        <p className="text-[var(--muted-foreground)] mb-8 leading-relaxed">
          Enhance has two modes: the slash command inside your AI coding tool, and a standalone CLI that calls the AI directly.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h2>Slash command (recommended)</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          After running{" "}
          <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">enhance setup</code>, open
          Claude Code, OpenCode, or Codex CLI in any project and type:
        </p>
        <CodeBlock
          code={`/enhance build a login page with email and password\n/enhance fix the auth bug\n/enhance refactor the user service\n/enhance create a payment form with Stripe`}
          filename="Your AI coding tool"
        />
      </FadeIn>

      <FadeIn delay={0.15}>
        <h2>The enhancement loop</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-5 leading-relaxed">
          Enhance never executes immediately. It shows you the enhanced prompt first and asks for approval.
        </p>
      </FadeIn>

      <StaggerChildren className="space-y-4 mb-10" delay={0.2} stagger={0.1}>
        {LOOP_STEPS.map(({ step, label, code }) => (
          <StaggerItem key={step}>
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="step-circle text-xs">{step}</span>
                <div className="step-line mt-1" />
              </div>
              <div className="flex-1 pb-4">
                <p className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">{label}</p>
                <CodeBlock code={code} />
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <FadeIn delay={0.35}>
        <h2>Standalone CLI</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Call the AI directly from your terminal. Requires an API key.
        </p>
        <CodeBlock
          code={`export ANTHROPIC_API_KEY=sk-ant-...\n\n# Enhance + call Claude\nenhance "build a login page"\n\n# Dry run — print enhanced prompt only\nenhance "fix the auth bug" --dry-run\n\n# Show enhanced prompt then call AI\nenhance "create dashboard" --print-prompt\n\n# See detected stack and intent\nenhance "refactor user service" --verbose\n\n# Use a different provider\nenhance "add payment form" --provider codex`}
          filename="Terminal"
        />
      </FadeIn>

      <FadeIn delay={0.4}>
        <h2>What gets detected</h2>
      </FadeIn>
      <StaggerChildren className="grid sm:grid-cols-2 gap-3" delay={0.45} stagger={0.07}>
        {DETECTED.map(({ category, items }) => (
          <StaggerItem key={category}>
            <GlowCard className="p-4">
              <div className="text-xs font-semibold text-white mb-1.5">{category}</div>
              <div className="text-xs text-[var(--muted-foreground)] leading-relaxed">{items}</div>
            </GlowCard>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </div>
  );
}
