# Enhance

> AI prompt middleware — upgrades vague developer prompts into production-quality instructions before sending to coding agents.

## What it does

Instead of sending `build login page` directly to Claude/Codex:

1. Scans your project (stack, frameworks, folder structure)
2. Analyzes your intent
3. Finds relevant existing files for context
4. Rewrites the prompt with structure, best practices, and project awareness
5. Sends the enhanced prompt to the AI

**Same effort. Dramatically better output.**

## Installation

```bash
npm install -g enhance
export ANTHROPIC_API_KEY=sk-ant-...
```

## Quick Start

```bash
# Basic — scans project, enhances prompt, calls Claude
enhance "build a login page with email and password"

# Dry run — see the enhanced prompt without calling AI
enhance "fix the auth bug" --dry-run

# Show enhanced prompt AND call AI
enhance "create dashboard component" --print-prompt

# See what was detected (stack, intent)
enhance "refactor user service" --verbose

# Use a different provider
enhance "add payment form" --provider codex
```

## Configuration

Create `.enhancerc.json` in your project root:

```json
{
  "provider": "claude",
  "model": "claude-sonnet-4-6",
  "maxContextTokens": 3000,
  "customInstructions": "Always use React Query. Prefer named exports."
}
```

| Key | Default | Description |
|---|---|---|
| `provider` | `claude` | AI provider: `claude`, `codex`, `opencode` |
| `model` | `claude-sonnet-4-6` | Model ID |
| `maxContextTokens` | `3000` | Context file budget |
| `customInstructions` | — | Extra instructions always injected |

## Providers

### Claude (default)
```bash
export ANTHROPIC_API_KEY=sk-ant-...
enhance "build login page"
```

### Codex CLI
```bash
npm install -g @openai/codex
enhance "build login page" --provider codex
```

### OpenCode
```bash
npm install -g opencode
enhance "build login page" --provider opencode
```

## What Enhance Detects

**Frameworks:** Next.js, React, Vue, Svelte, Nuxt, Remix, Astro, Express, Fastify, Hono, NestJS

**Styling:** TailwindCSS, shadcn/ui, Material UI, Chakra UI, Ant Design

**ORMs:** Prisma, Drizzle, TypeORM, Mongoose

**Testing:** Vitest, Jest, Playwright, Cypress

**Router type:** Next.js App Router vs Pages Router

## Example Enhancement

**Input:**
```
enhance "build login page"
```

**Enhanced prompt sent to AI:**
```
You are working inside a Next.js TypeScript project.

## Project Stack
- Language: TypeScript
- Frameworks: Next.js, React, TailwindCSS, shadcn/ui
- UI Library: shadcn/ui
- ORM: Prisma
- Next.js Router: App Router

## Project Structure
Top-level directories: app/src/public
Inside src/: components/lib/hooks
Uses Next.js App Router (app/ directory)

## Task
Create: build login page

## Requirements
- Use TypeScript throughout — no `any`, prefer `unknown` with type guards
- Use Server Components by default — only add "use client" when needed
- Follow App Router conventions: page.tsx, layout.tsx, route.ts
- Use `next/navigation` for navigation
- Use Tailwind classes — no custom CSS unless unavoidable
- Use shadcn/ui components over building from scratch
- Never store plain text passwords — use bcrypt or argon2
- Use httpOnly, secure cookies for session tokens
- ...
```

## Development

```bash
git clone https://github.com/0xdevabir/agent-enhance
cd agent-enhance
npm install
npm run dev -- "build login page" --dry-run
npm test
npm run build
```

## License

MIT
