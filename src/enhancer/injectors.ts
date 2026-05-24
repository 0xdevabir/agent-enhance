import type { ProjectStack, Intent, EnhanceConfig } from '../types.js';

export function getInjections(stack: ProjectStack, intent: Intent, config?: Partial<EnhanceConfig>): string[] {
  const rules: string[] = [];

  // TypeScript rules
  if (stack.language === 'typescript') {
    rules.push('Use TypeScript throughout — no `any`, prefer `unknown` with type guards');
    rules.push('Export all interfaces and types');
    if (intent.action === 'create' || intent.action === 'add') {
      rules.push('Add Zod validation at all external data boundaries (API input, form submissions)');
    }
  }

  // Next.js rules
  if (stack.frameworks.includes('nextjs')) {
    if (stack.nextRouterType === 'app') {
      rules.push('Use Server Components by default — only add "use client" when you need browser APIs or interactivity');
      rules.push('Follow App Router conventions: page.tsx, layout.tsx, loading.tsx, error.tsx, route.ts');
      rules.push('Use `next/navigation` (not `next/router`) for navigation in App Router');
      rules.push('Prefer server actions for mutations over API route handlers when possible');
    } else if (stack.nextRouterType === 'pages') {
      rules.push('Use `next/router` for navigation');
      rules.push('Keep data fetching in `getServerSideProps` or `getStaticProps`');
    }
    rules.push('Never expose secrets in client-side code — use environment variables with NEXT_PUBLIC_ prefix only for public values');
  }

  // React rules
  if (stack.frameworks.includes('react') || stack.frameworks.includes('nextjs')) {
    rules.push('Keep components small and focused on a single responsibility');
    rules.push('Extract reusable logic into custom hooks');
    rules.push('Use composition over prop drilling for shared state');
    if (intent.entity === 'component') {
      rules.push('Make the component accessible — add aria labels, keyboard navigation, focus management');
    }
  }

  // Tailwind rules
  if (stack.frameworks.includes('tailwind')) {
    rules.push('Use Tailwind classes — no custom CSS unless unavoidable');
    rules.push('Design mobile-first: base styles for mobile, `md:` / `lg:` for larger screens');
  }

  // shadcn/ui rules
  if (stack.frameworks.includes('shadcn')) {
    rules.push('Use shadcn/ui components (Button, Input, Dialog, etc.) over building from scratch');
    rules.push('Follow shadcn component patterns: import from `@/components/ui/`');
  }

  // ORM rules
  if (stack.orm === 'prisma') {
    rules.push('Use Prisma client for all database operations — no raw SQL unless required');
    rules.push('Always wrap multi-step DB operations in a transaction');
  } else if (stack.orm === 'drizzle') {
    rules.push('Use Drizzle schema and query builder — avoid raw SQL');
  }

  // Feature-specific rules
  if (intent.feature === 'auth') {
    rules.push('Never store plain text passwords — use bcrypt or argon2');
    rules.push('Use httpOnly, secure cookies for session tokens — never localStorage');
    rules.push('Validate and sanitize all auth inputs server-side');
    rules.push('Consider rate limiting on login/signup endpoints');
    rules.push('Implement CSRF protection for state-changing auth operations');
  }

  if (intent.feature === 'payment') {
    rules.push('Never log or store raw card data — let Stripe/payment processor handle it');
    rules.push('Always verify webhook signatures server-side');
    rules.push('Use idempotency keys for payment operations');
  }

  if (intent.feature === 'upload') {
    rules.push('Validate file type and size server-side, not just client-side');
    rules.push('Sanitize filenames before storage');
    rules.push('Use presigned URLs for direct-to-storage uploads');
  }

  // API entity rules
  if (intent.entity === 'api') {
    rules.push('Return consistent response shape: `{ data, error, status }`');
    rules.push('Handle errors explicitly — never let unhandled rejections leak to the client');
    rules.push('Validate all input with Zod before processing');
    rules.push('Use appropriate HTTP status codes');
  }

  // General quality rules (always last — these become the "universal" tier in template)
  rules.push('Match the existing code style and file naming conventions');
  rules.push('List every file you create or modify at the end of your response');
  rules.push('Prefer reusing existing utilities over creating new ones');

  // Config: project-specific custom rules (highest priority — injected after stack rules)
  if (config?.customRules?.length) {
    rules.unshift(...config.customRules);
  }

  // Config: feature-specific rules from config
  if (config?.featureRules?.[intent.feature]?.length) {
    rules.unshift(...config.featureRules[intent.feature]!);
  }

  return rules;
}
