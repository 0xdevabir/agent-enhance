import type { ProjectStack, FolderStructure, Intent } from '../types.js';

interface TemplateOpts {
  stack: ProjectStack;
  structure: FolderStructure;
  intent: Intent;
  contextFiles: string;
  injections: string[];
}

export function buildEnhancedPrompt(opts: TemplateOpts): string {
  const { stack, structure, intent, contextFiles, injections } = opts;

  const stackLabel = formatStack(stack);
  const structureLabel = formatStructure(structure);
  const taskDescription = buildTaskDescription(intent);
  const requirementsList = injections.map(r => `- ${r}`).join('\n');

  const contextSection = contextFiles
    ? `\n## Existing Code Context\n\n${contextFiles}`
    : '';

  return `You are working inside a ${stackLabel} project.

## Project Stack
${formatStackDetails(stack)}

## Project Structure
${structureLabel}

## Task
${taskDescription}

## Requirements
${requirementsList}
${contextSection}

---
Complete the task above. Follow every requirement. At the end, list every file you created or modified.`;
}

function formatStack(stack: ProjectStack): string {
  const primary = stack.frameworks[0] ?? 'Node.js';
  const lang = stack.language === 'typescript' ? 'TypeScript' : 'JavaScript';
  return `${capitalize(primary)} ${lang}`;
}

function formatStackDetails(stack: ProjectStack): string {
  const lines: string[] = [];
  lines.push(`- **Language**: ${stack.language === 'typescript' ? 'TypeScript' : 'JavaScript'}`);
  if (stack.frameworks.length > 0) {
    lines.push(`- **Frameworks**: ${stack.frameworks.map(capitalize).join(', ')}`);
  }
  if (stack.uiLibrary) {
    lines.push(`- **UI Library**: ${capitalize(stack.uiLibrary)}`);
  }
  if (stack.orm) {
    lines.push(`- **ORM**: ${capitalize(stack.orm)}`);
  }
  if (stack.testing) {
    lines.push(`- **Testing**: ${capitalize(stack.testing)}`);
  }
  if (stack.nextRouterType) {
    lines.push(`- **Next.js Router**: ${stack.nextRouterType === 'app' ? 'App Router' : 'Pages Router'}`);
  }
  lines.push(`- **Package Manager**: ${stack.packageManager}`);
  return lines.join('\n');
}

function formatStructure(structure: FolderStructure): string {
  const lines: string[] = [];
  if (structure.dirs.length > 0) {
    lines.push(`Top-level directories: \`${structure.dirs.join('/'  )}\``);
  }
  if (structure.hasSrcDir && structure.srcDirs.length > 0) {
    lines.push(`Inside src/: \`${structure.srcDirs.join('/')}\``);
  }
  if (structure.hasAppDir) lines.push('Uses Next.js App Router (`app/` directory)');
  if (structure.hasPagesDir) lines.push('Uses Next.js Pages Router (`pages/` directory)');
  return lines.join('\n') || 'Standard project structure';
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
  return `${action}: ${intent.rawPrompt}`;
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
