export interface ProjectStack {
  language: 'typescript' | 'javascript';
  frameworks: string[];
  runtime: 'node' | 'browser' | 'edge' | 'unknown';
  orm?: string;
  testing?: string;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  nextRouterType?: 'app' | 'pages';
  uiLibrary?: string;
}

export interface FolderStructure {
  root: string;
  dirs: string[];
  srcDirs: string[];
  hasAppDir: boolean;
  hasPagesDir: boolean;
  hasSrcDir: boolean;
}

export interface Intent {
  action: 'create' | 'fix' | 'refactor' | 'explain' | 'add' | 'delete' | 'unknown';
  entity: 'page' | 'component' | 'api' | 'hook' | 'util' | 'config' | 'style' | 'unknown';
  feature: string;
  scope: 'file' | 'feature' | 'system';
  complexity: 'simple' | 'feature' | 'system';
  confidence: number;
  target?: string;
  rawPrompt: string;
}

export interface ScanResult {
  stack: ProjectStack;
  structure: FolderStructure;
  projectRoot: string;
  scannedAt: number;
}

export interface EnhanceConfig {
  provider: 'claude' | 'codex' | 'opencode';
  model: string;
  maxContextTokens: number;
  customInstructions?: string;
  apiKey?: string;
  customRules?: string[];
  featureRules?: Record<string, string[]>;
  alwaysInclude?: string[];
}

export interface EnhancedPrompt {
  original: string;
  enhanced: string;
  intent: Intent;
  stack: ProjectStack;
}

export interface AIProvider {
  name: string;
  send(prompt: string, options?: Record<string, unknown>): Promise<void>;
}
