import type { ProjectStack, FolderStructure, Intent } from '../types.js';

interface TemplateOpts {
  stack: ProjectStack;
  structure: FolderStructure;
  intent: Intent;
  contextFiles: string;
  injections: string[];
  projectInstructions?: string;
}

export function buildEnhancedPrompt(opts: TemplateOpts): string {
  const { stack, structure, intent, contextFiles, injections, projectInstructions } = opts;
  const sections: string[] = [];

  // 1. Project instructions (CLAUDE.md / AGENTS.md) — highest priority
  if (projectInstructions) {
    sections.push(`## Project Instructions\n\n${projectInstructions}`);
  }

  // 2. Project context
  sections.push(`## Project Context

**Stack**: ${formatStack(stack)}
${formatStackDetails(stack)}

**Structure**: ${formatStructure(structure)}`);

  // 3. Task
  sections.push(`## Task\n\n${buildTaskDescription(intent)}`);

  // 4. Requirements (last 3 are universal "always" rules)
  const specific = injections.slice(0, -3);
  const universal = injections.slice(-3);
  const requirementLines = [
    ...specific.map(r => `- ${r}`),
    ...(specific.length > 0 ? ['', '**Always:**'] : ['**Always:**']),
    ...universal.map(r => `- ${r}`),
  ].join('\n');
  sections.push(`## Requirements\n\n${requirementLines}`);

  // 5. Relevant code
  if (contextFiles) {
    sections.push(`## Relevant Code\n\n${contextFiles}`);
  }

  // 6. Expected output format (intent-specific)
  sections.push(`## Expected Output\n\n${buildOutputFormat(intent)}`);

  return sections.join('\n\n---\n\n');
}

function buildOutputFormat(intent: Intent): string {
  switch (intent.action) {
    case 'fix':
      return 'Show exactly what changed. Explain in one sentence why it was broken. Provide the corrected code. List every file modified at the end.';
    case 'create':
    case 'add':
      return 'First list every file you will create or modify and why. Then implement each file completely. End with a summary list of all created/modified files.';
    case 'refactor':
      return 'For each change, show before and after. Explain the improvement in one line. Do not change behavior — only structure. List every file modified at the end.';
    case 'explain':
      return 'Walk through step by step. Reference specific function names, line numbers, or variable names from the existing code. Use concrete examples.';
    case 'delete':
      return 'List exactly what you will remove and why. Show the cleaned-up result. Confirm nothing else depends on the removed code.';
    default:
      return 'Be thorough and precise. Show all changes. List every file created or modified at the end of your response.';
  }
}

function buildTaskDescription(intent: Intent): string {
  const actionMap: Record<string, string> = {
    create: 'Create',
    fix: 'Fix',
    refactor: 'Refactor',
    explain: 'Explain',
    add: 'Add',
    delete: 'Remove',
    unknown: 'Handle',
  };
  const action = actionMap[intent.action] ?? 'Handle';
  return `**${action}**: ${intent.rawPrompt}`;
}

function formatStack(stack: ProjectStack): string {
  const primary = stack.frameworks[0] ?? 'Node.js';
  const lang = stack.language === 'typescript' ? 'TypeScript' : 'JavaScript';
  return `${capitalize(primary)} / ${lang}`;
}

function formatStackDetails(stack: ProjectStack): string {
  const lines: string[] = [];
  if (stack.frameworks.length > 0) {
    lines.push(`- **Frameworks**: ${stack.frameworks.map(capitalize).join(', ')}`);
  }
  if (stack.uiLibrary) lines.push(`- **UI**: ${capitalize(stack.uiLibrary)}`);
  if (stack.orm) lines.push(`- **ORM**: ${capitalize(stack.orm)}`);
  if (stack.testing) lines.push(`- **Testing**: ${capitalize(stack.testing)}`);
  if (stack.nextRouterType) {
    lines.push(`- **Router**: ${stack.nextRouterType === 'app' ? 'App Router' : 'Pages Router'}`);
  }
  lines.push(`- **Package Manager**: ${stack.packageManager}`);
  return lines.join('\n');
}

function formatStructure(structure: FolderStructure): string {
  const parts: string[] = [];
  if (structure.dirs.length > 0) parts.push(`dirs: \`${structure.dirs.join(', ')}\``);
  if (structure.hasSrcDir && structure.srcDirs.length > 0) {
    parts.push(`src/: \`${structure.srcDirs.join(', ')}\``);
  }
  if (structure.hasAppDir) parts.push('App Router (`app/`)');
  if (structure.hasPagesDir) parts.push('Pages Router (`pages/`)');
  return parts.join(' | ') || 'Standard layout';
}

function capitalize(s: string): string {
  if (!s) return s;
  const map: Record<string, string> = {
    nextjs: 'Next.js',
    tailwind: 'TailwindCSS',
    shadcn: 'shadcn/ui',
    prisma: 'Prisma',
    drizzle: 'Drizzle ORM',
    nestjs: 'NestJS',
    typescript: 'TypeScript',
    javascript: 'JavaScript',
    vitest: 'Vitest',
    mui: 'Material UI',
    chakra: 'Chakra UI',
  };
  return map[s] ?? (s.charAt(0).toUpperCase() + s.slice(1));
}
