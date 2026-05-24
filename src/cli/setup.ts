import { access, mkdir, writeFile, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { homedir } from 'os';
import { execSync } from 'child_process';
import chalk from 'chalk';

interface Tool {
  name: string;
  cliCommand: string;
  commandsDir: string;
  commandFile: string;
}

const TOOLS: Tool[] = [
  {
    name: 'Claude Code',
    cliCommand: 'claude',
    commandsDir: join(homedir(), '.claude', 'commands'),
    commandFile: 'enhance.md',
  },
  {
    name: 'OpenCode',
    cliCommand: 'opencode',
    commandsDir: join(homedir(), '.opencode', 'commands'),
    commandFile: 'enhance.md',
  },
  {
    name: 'Codex CLI',
    cliCommand: 'codex',
    commandsDir: join(homedir(), '.codex', 'commands'),
    commandFile: 'enhance.md',
  },
];

const ENHANCE_COMMAND_TEMPLATE = `Before executing the task below, perform the following project analysis steps silently (do not narrate them — just do them):

1. Read \`package.json\` to detect: frameworks (next, react, vue, svelte, express, fastify, hono), styling (tailwindcss, shadcn), ORM (prisma, drizzle, mongoose, typeorm), testing (vitest, jest), language (typescript or javascript)
2. Check for \`tsconfig.json\` — note path aliases if present
3. Scan top-level folders and \`src/\` (if present) — note structure, whether \`app/\` or \`pages/\` dir exists (Next.js router type), common dirs like \`components/\`, \`lib/\`, \`hooks/\`, \`utils/\`
4. Based on the detected stack, identify 1-3 existing files most relevant to the task and read them for pattern/convention reference

Then, using everything you discovered, execute this task:

---

**Task:** $ARGUMENTS

---

Apply these rules based on what you detected:

**Always:**
- Match the existing code style, naming conventions, and folder structure you observed
- List every file you create or modify at the end of your response
- Prefer reusing existing utilities over creating new ones
- No unnecessary dependencies

**If TypeScript detected:**
- No \`any\` — use \`unknown\` + type guards if needed
- Export all types and interfaces
- Use Zod for validation at external boundaries (API input, form submissions)

**If Next.js App Router detected:**
- Server Components by default — \`"use client"\` only when browser APIs or interactivity needed
- Use \`next/navigation\` (not \`next/router\`)
- Follow file conventions: \`page.tsx\`, \`layout.tsx\`, \`loading.tsx\`, \`error.tsx\`, \`route.ts\`
- Prefer server actions for mutations

**If Next.js Pages Router detected:**
- Use \`next/router\` for navigation
- Data fetching in \`getServerSideProps\` or \`getStaticProps\`

**If React / Next.js detected:**
- Small, focused components
- Extract reusable logic into custom hooks
- Composition over prop drilling
- Accessible: aria labels, keyboard navigation, semantic HTML

**If TailwindCSS detected:**
- Tailwind classes only — no custom CSS unless unavoidable
- Mobile-first: base = mobile, \`md:\` / \`lg:\` for larger

**If shadcn/ui detected:**
- Use shadcn components (Button, Input, Dialog, Form, etc.) — import from \`@/components/ui/\`

**If Prisma detected:**
- Use Prisma client for all DB operations
- Wrap multi-step operations in a transaction

**If the task involves authentication:**
- Never plain-text passwords — use bcrypt or argon2
- httpOnly, Secure cookies for session tokens — never localStorage
- Server-side validation on all inputs
- Note: consider rate limiting on auth endpoints
- CSRF protection on state-changing operations

**If the task involves file upload:**
- Validate file type and size server-side (not just client-side)
- Sanitize filenames before storage
- Prefer presigned URLs for direct-to-storage uploads

**If the task involves an API endpoint:**
- Consistent response shape: \`{ data, error }\`
- Explicit error handling — no unhandled rejections leaking to client
- Validate all input with Zod before processing
- Correct HTTP status codes

**If the task involves payments:**
- Never log or store raw card data
- Verify webhook signatures server-side
- Use idempotency keys for payment operations
`;

function isInstalled(cmd: string): boolean {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function installForTool(tool: Tool): Promise<'installed' | 'skipped' | 'error'> {
  try {
    await mkdir(tool.commandsDir, { recursive: true });
    const dest = join(tool.commandsDir, tool.commandFile);
    await writeFile(dest, ENHANCE_COMMAND_TEMPLATE, 'utf-8');
    return 'installed';
  } catch {
    return 'error';
  }
}

export async function runSetup(opts: { force: boolean; all: boolean }): Promise<void> {
  console.log(chalk.bold('\nEnhance — Setup\n'));

  const detected: Tool[] = [];
  const notFound: Tool[] = [];

  for (const tool of TOOLS) {
    if (opts.all || isInstalled(tool.cliCommand)) {
      detected.push(tool);
    } else {
      notFound.push(tool);
    }
  }

  if (detected.length === 0) {
    console.log(chalk.yellow('No supported AI coding tools detected in PATH.\n'));
    console.log('Supported tools:', TOOLS.map(t => t.cliCommand).join(', '));
    console.log('\nTo install for all tools anyway:');
    console.log(chalk.gray('  enhance setup --all\n'));
    return;
  }

  console.log(chalk.gray('Detected:'), detected.map(t => t.name).join(', '));
  if (notFound.length > 0) {
    console.log(chalk.gray('Not found:'), notFound.map(t => t.name).join(', '));
  }
  console.log();

  let anyInstalled = false;

  for (const tool of detected) {
    const dest = join(tool.commandsDir, tool.commandFile);
    const exists = await fileExists(dest);

    if (exists && !opts.force) {
      console.log(chalk.yellow(`⚠ ${tool.name}`), chalk.gray(`already installed — use --force to overwrite`));
      continue;
    }

    const result = await installForTool(tool);

    if (result === 'installed') {
      console.log(chalk.green(`✓ ${tool.name}`), chalk.gray(`→ ${dest}`));
      anyInstalled = true;
    } else {
      console.log(chalk.red(`✗ ${tool.name}`), chalk.gray(`failed to write to ${dest}`));
    }
  }

  if (anyInstalled || detected.every(t => fileExists(join(t.commandsDir, t.commandFile)))) {
    console.log(chalk.bold('\nReady. In any project, type:\n'));
    console.log(chalk.cyan('  /enhance build a login page'));
    console.log(chalk.cyan('  /enhance fix the auth bug'));
    console.log(chalk.cyan('  /enhance refactor the user service\n'));
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
