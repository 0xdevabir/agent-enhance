import { readFile } from 'fs/promises';
import { join } from 'path';
import fg from 'fast-glob';
import type { Intent, FolderStructure } from '../types.js';

const FEATURE_PATTERNS: Record<string, string[]> = {
  auth: ['*auth*', '*login*', '*logout*', '*session*', '*jwt*', '*token*', '*credential*', '*middleware*', '*guard*'],
  dashboard: ['*dashboard*', '*admin*', '*overview*', '*analytics*'],
  payment: ['*payment*', '*checkout*', '*billing*', '*stripe*', '*invoice*'],
  user: ['*user*', '*profile*', '*account*', '*avatar*'],
  upload: ['*upload*', '*file*', '*storage*', '*media*'],
  notification: ['*notification*', '*alert*', '*email*', '*toast*'],
  navigation: ['*nav*', '*navbar*', '*sidebar*', '*header*', '*menu*'],
  table: ['*table*', '*grid*', '*list*'],
  form: ['*form*', '*field*', '*input*'],
  search: ['*search*', '*filter*'],
};

const ALWAYS_INCLUDE_PATTERNS = [
  'app/layout.tsx',
  'app/layout.ts',
  'src/app/layout.tsx',
  'pages/_app.tsx',
  'pages/_app.ts',
  'src/pages/_app.tsx',
];

const MAX_CHARS = 12000;
const MAX_FILE_LINES = 250;

export async function findRelevantFiles(
  root: string,
  intent: Intent,
  structure: FolderStructure,
): Promise<string> {
  const sections: string[] = [];
  let charBudget = MAX_CHARS;

  // Always-include entry points
  for (const pattern of ALWAYS_INCLUDE_PATTERNS) {
    const content = await tryRead(join(root, pattern));
    if (content) {
      const snippet = truncateLines(content, MAX_FILE_LINES);
      const section = `// FILE: ${pattern}\n${snippet}`;
      if (section.length < charBudget) {
        sections.push(section);
        charBudget -= section.length;
      }
    }
  }

  // Feature-specific files
  const featurePatterns = FEATURE_PATTERNS[intent.feature] ?? [];
  if (featurePatterns.length > 0) {
    const searchBase = structure.hasSrcDir ? join(root, 'src') : root;
    const globs = featurePatterns.flatMap(p => [
      `**/${p}.{ts,tsx,js,jsx}`,
      `**/${p}/{*.ts,*.tsx,*.js,*.jsx}`,
    ]);

    let files: string[] = [];
    try {
      files = await fg(globs, {
        cwd: searchBase,
        ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
        absolute: true,
        onlyFiles: true,
      });
    } catch {
      // glob failed — skip
    }

    for (const file of files.slice(0, 5)) {
      if (charBudget <= 0) break;
      const content = await tryRead(file);
      if (!content) continue;
      const relPath = file.replace(root + '/', '');
      const snippet = truncateLines(content, MAX_FILE_LINES);
      const section = `// FILE: ${relPath}\n${snippet}`;
      if (section.length < charBudget) {
        sections.push(section);
        charBudget -= section.length;
      }
    }
  }

  // Sample 1-2 existing components for pattern reference (if entity is component/page)
  if (['component', 'page'].includes(intent.entity) && charBudget > 1000) {
    const componentDir = structure.hasSrcDir
      ? join(root, 'src', 'components')
      : join(root, 'components');
    let sampleFiles: string[] = [];
    try {
      sampleFiles = await fg('**/*.{tsx,jsx}', {
        cwd: componentDir,
        ignore: ['**/node_modules/**'],
        absolute: true,
        onlyFiles: true,
        deep: 2,
      });
    } catch {
      // no components dir
    }

    for (const file of sampleFiles.slice(0, 2)) {
      if (charBudget <= 500) break;
      const content = await tryRead(file);
      if (!content) continue;
      const relPath = file.replace(root + '/', '');
      const snippet = truncateLines(content, 80);
      const section = `// FILE: ${relPath} (pattern reference)\n${snippet}`;
      if (section.length < charBudget) {
        sections.push(section);
        charBudget -= section.length;
      }
    }
  }

  return sections.join('\n\n');
}

async function tryRead(path: string): Promise<string | null> {
  try {
    return await readFile(path, 'utf-8');
  } catch {
    return null;
  }
}

function truncateLines(content: string, maxLines: number): string {
  const lines = content.split('\n');
  if (lines.length <= maxLines) return content;
  return lines.slice(0, maxLines).join('\n') + `\n// ... (truncated at ${maxLines} lines)`;
}
