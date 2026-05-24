import type { Intent } from '../types.js';

const ACTION_KEYWORDS: Record<Intent['action'], string[]> = {
  create: ['build', 'create', 'make', 'add', 'implement', 'write', 'generate', 'scaffold', 'set up', 'setup', 'new'],
  fix: ['fix', 'debug', 'resolve', 'repair', 'broken', 'failing', 'crash', 'error', 'bug', 'issue', 'problem'],
  refactor: ['refactor', 'clean', 'improve', 'optimize', 'restructure', 'simplify', 'rewrite', 'reorganize'],
  explain: ['explain', 'describe', 'what', 'how does', 'why', 'show me', 'understand', 'walkthrough'],
  add: ['add', 'integrate', 'install', 'include', 'plug in', 'connect'],
  delete: ['delete', 'remove', 'drop', 'clean up', 'uninstall', 'get rid'],
  unknown: [],
};

const ENTITY_KEYWORDS: Record<Intent['entity'], string[]> = {
  page: ['page', 'route', 'view', 'screen', 'layout'],
  component: ['component', 'widget', 'element', 'button', 'form', 'modal', 'card', 'dialog', 'input', 'dropdown', 'table', 'list', 'nav', 'navbar', 'sidebar', 'header', 'footer', 'menu'],
  api: ['api', 'endpoint', 'route handler', 'server action', 'action', 'mutation', 'query', 'rest', 'graphql'],
  hook: ['hook', 'usecallback', 'useeffect', 'usestate', 'usememo', 'custom hook'],
  util: ['util', 'utility', 'helper', 'function', 'service', 'lib', 'library'],
  config: ['config', 'configuration', 'setting', 'env', 'environment'],
  style: ['style', 'css', 'theme', 'design', 'color', 'spacing', 'typography'],
  unknown: [],
};

const FEATURE_KEYWORDS: Record<string, string[]> = {
  auth: ['auth', 'authentication', 'login', 'logout', 'signup', 'sign up', 'sign in', 'register', 'password', 'session', 'oauth', 'jwt', 'credentials'],
  dashboard: ['dashboard', 'admin', 'panel', 'overview', 'analytics', 'stats', 'metrics'],
  payment: ['payment', 'checkout', 'billing', 'stripe', 'invoice', 'subscription', 'pricing'],
  user: ['user', 'profile', 'account', 'avatar', 'settings', 'preferences'],
  search: ['search', 'filter', 'query', 'find', 'lookup'],
  upload: ['upload', 'file', 'image', 'media', 'attachment', 'storage'],
  notification: ['notification', 'alert', 'email', 'push', 'toast', 'banner'],
  navigation: ['nav', 'navbar', 'navigation', 'menu', 'breadcrumb', 'sidebar', 'header'],
  table: ['table', 'grid', 'list', 'data table', 'datagrid'],
  form: ['form', 'input', 'field', 'validation', 'submit'],
  chart: ['chart', 'graph', 'visualization', 'plot', 'diagram'],
};

export function analyzeIntent(rawPrompt: string): Intent {
  const lower = rawPrompt.toLowerCase();

  // Detect action
  let action: Intent['action'] = 'unknown';
  for (const [act, keywords] of Object.entries(ACTION_KEYWORDS) as [Intent['action'], string[]][]) {
    if (act === 'unknown') continue;
    if (keywords.some(k => lower.includes(k))) {
      action = act;
      break;
    }
  }

  // Detect entity
  let entity: Intent['entity'] = 'unknown';
  for (const [ent, keywords] of Object.entries(ENTITY_KEYWORDS) as [Intent['entity'], string[]][]) {
    if (ent === 'unknown') continue;
    if (keywords.some(k => lower.includes(k))) {
      entity = ent;
      break;
    }
  }

  // Detect feature
  let feature = 'general';
  for (const [feat, keywords] of Object.entries(FEATURE_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) {
      feature = feat;
      break;
    }
  }

  return { action, entity, feature, rawPrompt };
}
