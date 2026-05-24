import { describe, it, expect } from 'vitest';
import { getInjections } from './injectors.js';
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
  rawPrompt: 'build a login page',
};

const API_INTENT: Intent = {
  action: 'create',
  entity: 'api',
  feature: 'payment',
  rawPrompt: 'build a payment api',
};

describe('getInjections', () => {
  it('returns TypeScript rules for TS projects', () => {
    const rules = getInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.some(r => r.includes('TypeScript'))).toBe(true);
    expect(rules.some(r => r.includes('any'))).toBe(true);
  });

  it('returns Next.js App Router rules', () => {
    const rules = getInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.some(r => r.includes('Server Component'))).toBe(true);
    expect(rules.some(r => r.includes('next/navigation'))).toBe(true);
  });

  it('returns auth security rules for auth feature', () => {
    const rules = getInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.some(r => r.includes('plain text password') || r.includes('bcrypt'))).toBe(true);
    expect(rules.some(r => r.includes('httpOnly'))).toBe(true);
  });

  it('returns Tailwind rules when tailwind in stack', () => {
    const rules = getInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.some(r => r.includes('Tailwind'))).toBe(true);
  });

  it('returns shadcn rules when shadcn in stack', () => {
    const rules = getInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.some(r => r.includes('shadcn'))).toBe(true);
  });

  it('returns API rules for api entity', () => {
    const rules = getInjections(NEXTJS_STACK, API_INTENT);
    expect(rules.some(r => r.includes('response shape'))).toBe(true);
  });

  it('returns payment rules for payment feature', () => {
    const rules = getInjections(NEXTJS_STACK, API_INTENT);
    expect(rules.some(r => r.includes('card') || r.includes('Stripe') || r.includes('webhook'))).toBe(true);
  });

  it('always includes general quality rules', () => {
    const rules = getInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.some(r => r.includes('List every file'))).toBe(true);
  });

  it('returns at least 5 rules for Next.js + auth', () => {
    const rules = getInjections(NEXTJS_STACK, AUTH_INTENT);
    expect(rules.length).toBeGreaterThanOrEqual(5);
  });
});
