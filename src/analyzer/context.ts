import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import fg from 'fast-glob';
import type { Intent, FolderStructure } from '../types.js';

const execAsync = promisify(exec);

const PROJECT_INSTRUCTION_FILES = [
  '.claude/CLAUDE.md',
  'CLAUDE.md',
  'AGENTS.md',
  '.cursorrules',
];

export async function findProjectInstructions(root: string): Promise<string> {
  const parts: string[] = [];

  // Check current root and one level up (monorepo support)
  const searchRoots = [root, dirname(root)];

  for (const searchRoot of searchRoots) {
    for (const fileName of PROJECT_INSTRUCTION_FILES) {
      const content = await tryRead(join(searchRoot, fileName));
      if (content) {
        const relPath = fileName;
        parts.push(`<!-- Source: ${relPath} -->\n${truncateLines(content, 300)}`);
        break; // only one file per search root
      }
    }
  }

  return parts.join('\n\n');
}

export async function findGitContext(root: string, charBudget: number): Promise<{ content: string; charsUsed: number }> {
  const parts: string[] = [];
  let used = 0;

  try {
    // Uncommitted diff (highest signal — what the user is actively working on)
    const { stdout: diffOutput } = await execAsync('git diff HEAD', { cwd: root, timeout: 5000 });
    if (diffOutput.trim()) {
      const truncated = diffOutput.slice(0, Math.min(3000, charBudget * 0.4));
      const section = `// GIT: uncommitted changes\n${truncated}${diffOutput.length > truncated.length ? '\n// ... (diff truncated)' : ''}`;
      parts.push(section);
      used += section.length;
    }

    // Recently changed files (last 3 commits)
    if (used < charBudget * 0.6) {
      const { stdout: logOutput } = await execAsync(
        'git diff HEAD~3..HEAD --name-only 2>/dev/null || git diff HEAD~1..HEAD --name-only',
        { cwd: root, timeout: 5000 },
      );
      const changedFiles = logOutput.trim().split('\n').filter(Boolean).slice(0, 8);
      for (const relPath of changedFiles) {
        if (used >= charBudget * 0.7) break;
        const content = await tryRead(join(root, relPath));
        if (!content) continue;
        const snippet = truncateLines(content, 100);
        const section = `// FILE (recently changed): ${relPath}\n${snippet}`;
        if (used + section.length < charBudget * 0.7) {
          parts.push(section);
          used += section.length;
        }
      }
    }
  } catch {
    // not a git repo or git not available
  }

  return { content: parts.join('\n\n'), charsUsed: used };
}

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

// Token budget: ~4 chars per token, default 8000 tokens
const DEFAULT_TOKEN_BUDGET = 8000;
const CHARS_PER_TOKEN = 4;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

// Smart truncation: keep imports/types at top + first N lines of body
function smartTruncate(content: string, maxTokens: number): string {
  const maxChars = maxTokens * CHARS_PER_TOKEN;
  if (content.length <= maxChars) return content;

  const lines = content.split('\n');
  // Keep top (imports + type declarations) and as much body as fits
  const result: string[] = [];
  let chars = 0;
  for (const line of lines) {
    if (chars + line.length + 1 > maxChars) {
      result.push(`// ... (truncated, ${lines.length - result.length} lines omitted)`);
      break;
    }
    result.push(line);
    chars += line.length + 1;
  }
  return result.join('\n');
}

export async function findRelevantFiles(
  root: string,
  intent: Intent,
  structure: FolderStructure,
  maxTokens: number = DEFAULT_TOKEN_BUDGET,
  alwaysInclude: string[] = [],
): Promise<{ contextFiles: string; gitContext: string }> {
  const sections: string[] = [];
  let tokenBudget = maxTokens;

  // Git context (recent changes + uncommitted diff)
  const { content: gitContent, charsUsed: gitUsed } = await findGitContext(root, Math.floor(tokenBudget * 0.35) * CHARS_PER_TOKEN);
  tokenBudget -= Math.ceil(gitUsed / CHARS_PER_TOKEN);

  // Config: user-specified alwaysInclude files (highest file priority)
  for (const relPath of alwaysInclude) {
    if (tokenBudget <= 100) break;
    const content = await tryRead(join(root, relPath));
    if (!content) continue;
    const allowedTokens = Math.min(estimateTokens(content), Math.floor(tokenBudget * 0.2));
    const snippet = smartTruncate(content, allowedTokens);
    const section = `// FILE: ${relPath} (pinned)\n${snippet}`;
    sections.push(section);
    tokenBudget -= estimateTokens(section);
  }

  // Priority 2: always-include entry points (layout, _app)
  for (const pattern of ALWAYS_INCLUDE_PATTERNS) {
    if (tokenBudget <= 100) break;
    const content = await tryRead(join(root, pattern));
    if (!content) continue;
    const fileTokens = estimateTokens(content);
    const allowedTokens = Math.min(fileTokens, Math.floor(tokenBudget * 0.25));
    const snippet = smartTruncate(content, allowedTokens);
    const section = `// FILE: ${pattern}\n${snippet}`;
    sections.push(section);
    tokenBudget -= estimateTokens(section);
  }

  // Priority 3: feature-specific files
  const featurePatterns = FEATURE_PATTERNS[intent.feature] ?? [];
  if (featurePatterns.length > 0 && tokenBudget > 200) {
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

    const foundFeatureFiles: string[] = [];
    for (const file of files.slice(0, 6)) {
      if (tokenBudget <= 100) break;
      const content = await tryRead(file);
      if (!content) continue;
      const relPath = file.replace(root + '/', '');
      const allowedTokens = Math.min(estimateTokens(content), Math.floor(tokenBudget * 0.4));
      const snippet = smartTruncate(content, allowedTokens);
      const section = `// FILE: ${relPath}\n${snippet}`;
      sections.push(section);
      tokenBudget -= estimateTokens(section);
      foundFeatureFiles.push(file);
    }

    // Priority 3.5: import-graph — pull direct dependencies of feature files
    if (foundFeatureFiles.length > 0 && tokenBudget > 200) {
      const importedFiles = await crawlImports(foundFeatureFiles, root);
      // Exclude files already included
      const alreadyIncluded = new Set(foundFeatureFiles.map(f => f));
      for (const file of importedFiles.filter(f => !alreadyIncluded.has(f)).slice(0, 4)) {
        if (tokenBudget <= 150) break;
        const content = await tryRead(file);
        if (!content) continue;
        const relPath = file.replace(root + '/', '');
        const allowedTokens = Math.min(estimateTokens(content), Math.floor(tokenBudget * 0.2));
        const snippet = smartTruncate(content, allowedTokens);
        const section = `// FILE: ${relPath} (imported)\n${snippet}`;
        sections.push(section);
        tokenBudget -= estimateTokens(section);
      }
    }
  }

  // Priority 4: pattern reference components (lowest priority)
  if (['component', 'page'].includes(intent.entity) && tokenBudget > 300) {
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
      if (tokenBudget <= 150) break;
      const content = await tryRead(file);
      if (!content) continue;
      const relPath = file.replace(root + '/', '');
      const snippet = smartTruncate(content, Math.min(200, tokenBudget - 50));
      const section = `// FILE: ${relPath} (pattern reference)\n${snippet}`;
      sections.push(section);
      tokenBudget -= estimateTokens(section);
    }
  }

  return { contextFiles: sections.join('\n\n'), gitContext: gitContent };
}

// Crawl 1-level-deep imports from a set of source files, return unique resolved paths
export async function crawlImports(filePaths: string[], root: string): Promise<string[]> {
  const IMPORT_RE = /(?:import|from)\s+['"](\.[^'"]+)['"]/g;
  const TS_EXTS = ['.ts', '.tsx', '.js', '.jsx'];
  const found = new Set<string>();

  for (const filePath of filePaths) {
    const content = await tryRead(filePath);
    if (!content) continue;

    const dir = filePath.replace(/\/[^/]+$/, '');
    let match: RegExpExecArray | null;
    IMPORT_RE.lastIndex = 0;

    while ((match = IMPORT_RE.exec(content)) !== null) {
      const importPath = match[1];
      if (!importPath) continue;

      const base = join(dir, importPath);

      // Try each extension
      for (const ext of TS_EXTS) {
        const candidate = base.endsWith(ext) ? base : `${base}${ext}`;
        if (candidate.includes('node_modules') || candidate.includes('.next')) continue;
        if (candidate.startsWith(root)) {
          found.add(candidate);
          break;
        }
      }
    }
  }

  return [...found];
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
