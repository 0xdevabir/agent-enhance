import type { ProjectStack, FolderStructure, Intent } from '../types.js';
import type { Angle } from './angles.js';
import { ANGLE_LABELS } from './angles.js';

interface TemplateOpts {
  stack: ProjectStack;
  structure: FolderStructure;
  intent: Intent;
  contextFiles: string;
  injections: string[];
  projectInstructions?: string;
  gitContext?: string;
  angle?: Angle;
  assumptions?: string[];
  gotchas?: string[];
  iteration?: number;
}

export function buildEnhancedPrompt(opts: TemplateOpts): string {
  const { intent } = opts;
  switch (intent.complexity) {
    case 'simple':  return buildSimplePrompt(opts);
    case 'system':  return buildSystemPrompt(opts);
    default:        return buildFeaturePrompt(opts);
  }
}

function buildVersionHeader(opts: TemplateOpts): string | null {
  const { angle, iteration } = opts;
  if (angle === undefined) return null;
  const v = (iteration ?? 0) + 1;
  const label = ANGLE_LABELS[angle];
  return `📍 v${v} — ${label} angle`;
}

function buildAssumptionsSection(assumptions: string[]): string | null {
  if (!assumptions.length) return null;
  return `## Assumptions\n\n${assumptions.map(a => `- ${a}`).join('\n')}`;
}

function buildGotchasSection(gotchas: string[]): string | null {
  if (!gotchas.length) return null;
  return `## Watch out for\n\n${gotchas.map(g => `- ${g}`).join('\n')}`;
}


// simple: bug fixes, single-file changes, explanations — minimal overhead
function buildSimplePrompt(opts: TemplateOpts): string {
  const { stack, intent, contextFiles, gitContext, injections, projectInstructions, assumptions = [], gotchas = [] } = opts;
  const sections: string[] = [];

  const versionHeader = buildVersionHeader(opts);
  if (versionHeader) sections.push(versionHeader);

  if (projectInstructions) {
    sections.push(`## Project Instructions\n\n${projectInstructions}`);
  }

  sections.push(`## Context\n**Stack**: ${formatStack(stack)}\n${formatStackDetails(stack)}`);
  sections.push(`## Task\n\n${buildTaskDescription(intent)}`);

  const rules = [...injections.slice(0, 3), ...injections.slice(-3)];
  sections.push(`## Requirements\n\n${rules.map(r => `- ${r}`).join('\n')}`);

  const assumptionsSection = buildAssumptionsSection(assumptions);
  if (assumptionsSection) sections.push(assumptionsSection);

  const gotchasSection = buildGotchasSection(gotchas);
  if (gotchasSection) sections.push(gotchasSection);

  if (gitContext) {
    sections.push(`## Recent Changes\n\n${gitContext}`);
  }

  if (contextFiles) {
    sections.push(`## Code\n\n${contextFiles}`);
  }

  sections.push(`## Expected Output\n\n${buildOutputFormat(intent)}`);
  return sections.join('\n\n---\n\n');
}

// feature: new pages/components/APIs — full spec with requirements
function buildFeaturePrompt(opts: TemplateOpts): string {
  const { stack, structure, intent, contextFiles, gitContext, injections, projectInstructions, assumptions = [], gotchas = [] } = opts;
  const sections: string[] = [];

  const versionHeader = buildVersionHeader(opts);
  if (versionHeader) sections.push(versionHeader);

  if (projectInstructions) {
    sections.push(`## Project Instructions\n\n${projectInstructions}`);
  }

  sections.push(`## Project Context

**Stack**: ${formatStack(stack)}
${formatStackDetails(stack)}

**Structure**: ${formatStructure(structure)}`);

  sections.push(`## Task\n\n${buildTaskDescription(intent)}`);

  const specific = injections.slice(0, -3);
  const universal = injections.slice(-3);
  const requirementLines = [
    ...specific.map(r => `- ${r}`),
    ...(specific.length > 0 ? ['', '**Always:**'] : ['**Always:**']),
    ...universal.map(r => `- ${r}`),
  ].join('\n');
  sections.push(`## Requirements\n\n${requirementLines}`);

  const assumptionsSection = buildAssumptionsSection(assumptions);
  if (assumptionsSection) sections.push(assumptionsSection);

  const gotchasSection = buildGotchasSection(gotchas);
  if (gotchasSection) sections.push(gotchasSection);

  if (gitContext) {
    sections.push(`## Recent Changes\n\n${gitContext}`);
  }

  if (contextFiles) {
    sections.push(`## Relevant Code\n\n${contextFiles}`);
  }

  sections.push(`## Expected Output\n\n${buildOutputFormat(intent)}`);
  return sections.join('\n\n---\n\n');
}

// system: architectural changes, full rewrites — step-by-step breakdown first
function buildSystemPrompt(opts: TemplateOpts): string {
  const { stack, structure, intent, contextFiles, gitContext, injections, projectInstructions } = opts;
  const sections: string[] = [];

  if (projectInstructions) {
    sections.push(`## Project Instructions\n\n${projectInstructions}`);
  }

  sections.push(`## Project Context

**Stack**: ${formatStack(stack)}
${formatStackDetails(stack)}

**Structure**: ${formatStructure(structure)}`);

  sections.push(`## Task\n\n${buildTaskDescription(intent)}

> This is a system-level change. Before writing any code:
> 1. Analyze the current state and identify all affected areas
> 2. Define your implementation plan step by step
> 3. Highlight any breaking changes or migration steps
> 4. Then implement each step`);

  const requirementLines = injections.map(r => `- ${r}`).join('\n');
  sections.push(`## Requirements\n\n${requirementLines}`);

  if (gitContext) {
    sections.push(`## Recent Changes\n\n${gitContext}`);
  }

  if (contextFiles) {
    sections.push(`## Relevant Code\n\n${contextFiles}`);
  }

  sections.push(`## Expected Output\n\nStart with a numbered implementation plan. Then implement each step. Mark breaking changes with ⚠️. List every file created or modified at the end.`);
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
