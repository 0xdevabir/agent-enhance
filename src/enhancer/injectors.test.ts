import { describe, it, expect } from 'vitest';
import { getFallbackInjections } from './injectors.js';
import type { ProjectStack, Intent } from '../types.js';

const NEXTJS_STACK: ProjectStack = {
  language: 'typescript',
  frameworks: ['nextjs', 'react', 'tailwind', 'shadcn'],
  runtime: 'browser',
  orm: 'prisma',
  testing: 'vitest',
  packageManager: 'npm',
  nextRouterType: 'app',
  uiLibrary: 'shadcn',
};

const AUTH_INTENT: Intent = {
  action: 'create',
  entity: 'page',
  feature: 'auth',
  scope: 'feature',
  complexity: 'feature',
  confidence: 0.8,
  rawPrompt: 'build a login page',
};

const API_INTENT: Intent = {
  action: 'create',
  entity: 'api',
  feature: 'payment',
  scope: 'feature',
  complexity: 'feature',
  confidence: 0.8,
  rawPrompt: 'build a payment api',
};

describe('getFallbackInjections', () => {
  it('returns TypeScript rules for TS projects', () => {
    const rules = getFallbackInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.some((r: string) => r.includes('TypeScript'))).toBe(true);
    expect(rules.some((r: string) => r.includes('any'))).toBe(true);
  });

  it('returns Next.js App Router rules', () => {
    const rules = getFallbackInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.some((r: string) => r.includes('Server Component'))).toBe(true);
    expect(rules.some((r: string) => r.includes('next/navigation'))).toBe(true);
  });

  it('returns auth security rules for auth feature', () => {
    const rules = getFallbackInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.some((r: string) => r.includes('plain text password') || r.includes('bcrypt'))).toBe(true);
    expect(rules.some((r: string) => r.includes('httpOnly'))).toBe(true);
  });

  it('returns Tailwind rules when tailwind in stack', () => {
    const rules = getFallbackInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.some((r: string) => r.includes('Tailwind'))).toBe(true);
  });

  it('returns shadcn rules when shadcn in stack', () => {
    const rules = getFallbackInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.some((r: string) => r.includes('shadcn'))).toBe(true);
  });

  it('returns API rules for api entity', () => {
    const rules = getFallbackInjections(NEXTJS_STACK, API_INTENT);
    expect(rules.some((r: string) => r.includes('response shape'))).toBe(true);
  });

  it('returns payment rules for payment feature', () => {
    const rules = getFallbackInjections(NEXTJS_STACK, API_INTENT);
    expect(rules.some((r: string) => r.includes('card') || r.includes('Stripe') || r.includes('webhook'))).toBe(true);
  });

  it('always includes general quality rules', () => {
    const rules = getFallbackInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.some((r: string) => r.includes('List every file'))).toBe(true);
  });

  it('returns at least 5 rules for Next.js + auth', () => {
    const rules = getFallbackInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.length).toBeGreaterThanOrEqual(5);
  });
});
