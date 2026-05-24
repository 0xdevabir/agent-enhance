# Enhance

> AI prompt middleware — upgrades vague developer prompts into production-quality instructions before sending to coding agents.

## What it does

Instead of sending `build login page` directly to Claude/Codex/OpenCode:

1. Scans your project (stack, frameworks, folder structure)
2. Analyzes your intent
3. Finds relevant existing files for context
4. Rewrites the prompt with structure, best practices, and project awareness
5. Sends the enhanced prompt to the AI

**Same effort. Dramatically better output.**

---

## Installation

### Prerequisites

- Node.js 20+
- At least one AI coding tool: [Claude Code](https://claude.ai/code), [OpenCode](https://opencode.ai), or [Codex CLI](https://github.com/openai/codex)

### Step 1 — Install globally

```bash
npm install -g @0xdevabir/enhance
```

### Step 2 — Run setup

```bash
enhance setup
```

Detects which AI coding tools you have installed and automatically adds the `/enhance` slash command to each one.

```
Enhance — Setup

Detected: Claude Code, OpenCode
Not found: Codex CLI

✓ Claude Code → ~/.claude/commands/enhance.md
✓ OpenCode    → ~/.opencode/commands/enhance.md

Ready. In any project, type:

  /enhance build a login page
  /enhance fix the auth bug
  /enhance refactor the user service
```

**Options:**
```bash
enhance setup --force   # overwrite existing installations
enhance setup --all     # install for all tools even if not detected
```

### Step 3 — Use it

Open Claude Code, OpenCode, or Codex CLI in any project and type:

```
/enhance build a login page with email and password
```

---

## Usage

### Inside Claude Code / OpenCode / Codex CLI (after `enhance setup`)

```
/enhance build a login page with email and password
/enhance fix the auth bug
/enhance create a payment form with Stripe
/enhance refactor the user service to use dependency injection
/enhance add dark mode support
```

### Standalone CLI (calls AI directly)

Requires API key:
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

```bash
# Basic — scans project, enhances prompt, calls Claude
enhance "build a login page"

# Dry run — see the enhanced prompt without calling AI
enhance "fix the auth bug" --dry-run

# Show enhanced prompt AND call AI
enhance "create dashboard component" --print-prompt

# See detected stack and intent
enhance "refactor user service" --verbose

# Use a different provider
enhance "add payment form" --provider codex
```

---

## Configuration

Create `.enhancerc.json` in your project root to customize behavior per-project:

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
| `maxContextTokens` | `3000` | Max characters of project files to include |
| `customInstructions` | — | Extra instructions always injected into every prompt |

---

## Providers

### Claude (default)

Requires `ANTHROPIC_API_KEY`. Get one at [console.anthropic.com](https://console.anthropic.com/).

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

---

## What Enhance Detects

| Category | Detected |
|---|---|
| Frameworks | Next.js, React, Vue, Svelte, Nuxt, Remix, Astro, Express, Fastify, Hono, NestJS |
| Styling | TailwindCSS, shadcn/ui, Material UI, Chakra UI, Ant Design |
| ORMs | Prisma, Drizzle, TypeORM, Mongoose |
| Testing | Vitest, Jest, Playwright, Cypress |
| Language | TypeScript vs JavaScript |
| Router | Next.js App Router vs Pages Router |
| Package manager | npm, yarn, pnpm, bun |

---

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
- Use httpOnly, secure cookies for session tokens — never localStorage
- Validate and sanitize all auth inputs server-side
- Consider rate limiting on login/signup endpoints
- ...
```

---

## Development

```bash
git clone https://github.com/0xdevabir/agent-enhance.git
cd agent-enhance
npm install

# Run without building
npm run dev -- "build login page" --dry-run

# Run tests
npm test

# Build
npm run build
```

---

## License

MIT
