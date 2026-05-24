import type { Intent } from '../types.js';

const ACTION_KEYWORDS: Record<Intent['action'], string[]> = {
  fix: ['fix', 'debug', 'resolve', 'repair', 'broken', 'failing', 'crash', 'error', 'bug', 'issue', 'problem'],
  create: ['create', 'build', 'make', 'generate', 'scaffold', 'new', 'write'],
  add: ['add', 'implement', 'integrate', 'include', 'append', 'enable'],
  refactor: ['refactor', 'restructure', 'reorganize', 'clean up', 'cleanup', 'simplify', 'rewrite', 'move', 'extract'],
  explain: ['explain', 'describe', 'how does', 'what is', 'why does', 'understand', 'document', 'walkthrough'],
  delete: ['delete', 'remove', 'drop', 'destroy', 'uninstall', 'clean'],
  unknown: [],
};

const ENTITY_KEYWORDS: Record<Intent['entity'], string[]> = {
  page: ['page', 'route', 'view', 'screen', 'layout'],
  component: ['component', 'widget', 'card', 'modal', 'dialog', 'dropdown', 'button', 'input', 'form'],
  api: ['api', 'endpoint', 'route handler', 'server action', 'action', 'mutation', 'query', 'rest', 'graphql'],
  hook: ['hook', 'use', 'custom hook'],
  util: ['util', 'helper', 'function', 'service', 'lib', 'library', 'module'],
  config: ['config', 'configuration', 'settings', 'env', 'environment'],
  style: ['style', 'css', 'theme', 'color', 'design', 'ui', 'ux', 'animation'],
  unknown: [],
};

const FEATURE_KEYWORDS: Record<string, string[]> = {
  auth: ['auth', 'login', 'logout', 'signup', 'register', 'session', 'jwt', 'token', 'oauth', 'credential', 'password', 'permission', 'role'],
  dashboard: ['dashboard', 'admin', 'overview', 'analytics', 'metrics', 'stats'],
  payment: ['payment', 'checkout', 'billing', 'stripe', 'invoice', 'subscription', 'pricing'],
  user: ['user', 'profile', 'account', 'avatar', 'member'],
  upload: ['upload', 'file', 'image', 'storage', 'media', 's3', 'cdn'],
  notification: ['notification', 'alert', 'email', 'toast', 'push', 'sms'],
  navigation: ['nav', 'navbar', 'sidebar', 'header', 'menu', 'breadcrumb'],
  table: ['table', 'grid', 'list', 'pagination', 'sort', 'filter'],
  form: ['form', 'field', 'input', 'validation', 'submit'],
  search: ['search', 'filter', 'query', 'autocomplete'],
};

// Signals that the task is system-wide in scope
const SYSTEM_SCOPE_SIGNALS = [
  'entire', 'whole', 'all', 'system', 'everywhere', 'global', 'across', 'throughout',
  'full', 'complete', 'migrate', 'overhaul',
];

// Signals that the task is simple / single-file
const SIMPLE_SCOPE_SIGNALS = [
  'this file', 'this component', 'this function', 'line', 'typo', 'typos',
  'small', 'quick', 'minor', 'just change', 'rename',
];

export function analyzeIntent(rawPrompt: string): Intent {
  const lower = rawPrompt.toLowerCase();
  const words = lower.split(/\s+/);

  // Detect action
  let action: Intent['action'] = 'unknown';
  let actionMatchCount = 0;
  for (const [act, keywords] of Object.entries(ACTION_KEYWORDS) as [Intent['action'], string[]][]) {
    if (act === 'unknown') continue;
    const matches = keywords.filter(k => lower.includes(k)).length;
    if (matches > actionMatchCount) {
      action = act;
      actionMatchCount = matches;
    }
  }

  // Detect entity
  let entity: Intent['entity'] = 'unknown';
  let entityMatchCount = 0;
  for (const [ent, keywords] of Object.entries(ENTITY_KEYWORDS) as [Intent['entity'], string[]][]) {
    if (ent === 'unknown') continue;
    const matches = keywords.filter(k => lower.includes(k)).length;
    if (matches > entityMatchCount) {
      entity = ent;
      entityMatchCount = matches;
    }
  }

  // Detect feature
  let feature = 'general';
  let featureMatchCount = 0;
  for (const [feat, keywords] of Object.entries(FEATURE_KEYWORDS)) {
    const matches = keywords.filter(k => lower.includes(k)).length;
    if (matches > featureMatchCount) {
      feature = feat;
      featureMatchCount = matches;
    }
  }

  // Derive scope
  let scope: Intent['scope'] = 'feature';
  if (SYSTEM_SCOPE_SIGNALS.some(s => lower.includes(s))) {
    scope = 'system';
  } else if (SIMPLE_SCOPE_SIGNALS.some(s => lower.includes(s))) {
    scope = 'file';
  } else if (action === 'fix' && words.length <= 8) {
    scope = 'file';
  }

  // Derive complexity from scope + action
  let complexity: Intent['complexity'] = 'feature';
  if (scope === 'system' || (action === 'refactor' && scope !== 'file')) {
    complexity = 'system';
  } else if (scope === 'file' || action === 'fix' || action === 'explain') {
    complexity = 'simple';
  }

  // Confidence: ratio of matched signals to prompt length (0–1, capped)
  const totalMatches = actionMatchCount + entityMatchCount + featureMatchCount;
  const confidence = Math.min(1, totalMatches / Math.max(words.length * 0.3, 1));

  return { action, entity, feature, scope, complexity, confidence, rawPrompt };
}
