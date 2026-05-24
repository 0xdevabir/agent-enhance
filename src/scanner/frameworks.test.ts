import { describe, it, expect } from 'vitest';
import { detectStack } from './frameworks.js';

const NEXT_TS_PKG = {
  dependencies: {
    next: '^14.0.0',
    react: '^18.0.0',
    'react-dom': '^18.0.0',
    tailwindcss: '^3.0.0',
    '@prisma/client': '^5.0.0',
  },
  devDependencies: {
    typescript: '^5.0.0',
    prisma: '^5.0.0',
    vitest: '^1.0.0',
  },
};

const EXPRESS_JS_PKG = {
  dependencies: {
    express: '^4.0.0',
    mongoose: '^7.0.0',
  },
  devDependencies: {
    jest: '^29.0.0',
  },
};

describe('detectStack', () => {
  it('detects Next.js TypeScript project', async () => {
    const stack = await detectStack(NEXT_TS_PKG, '/tmp');
    expect(stack.frameworks).toContain('nextjs');
    expect(stack.frameworks).toContain('tailwind');
    expect(stack.language).toBe('typescript');
    expect(stack.orm).toBe('prisma');
    expect(stack.testing).toBe('vitest');
  });

  it('detects Express.js JavaScript project', async () => {
    const stack = await detectStack(EXPRESS_JS_PKG, '/tmp');
    expect(stack.frameworks).toContain('express');
    expect(stack.language).toBe('javascript');
    expect(stack.orm).toBe('mongoose');
    expect(stack.testing).toBe('jest');
    expect(stack.frameworks).not.toContain('nextjs');
  });

  it('detects package manager from cwd', async () => {
    const stack = await detectStack(NEXT_TS_PKG, process.cwd());
    expect(['npm', 'yarn', 'pnpm', 'bun']).toContain(stack.packageManager);
  });

  it('includes react when nextjs detected', async () => {
    const stack = await detectStack(NEXT_TS_PKG, '/tmp');
    // nextjs implies react — should not double-add
    expect(stack.frameworks.filter(f => f === 'react').length).toBe(0);
    expect(stack.frameworks).toContain('nextjs');
  });

  it('detects shadcn/ui', async () => {
    const pkg = {
      dependencies: {
        next: '^14',
        '@radix-ui/react-dialog': '^1.0.0',
      },
      devDependencies: { typescript: '^5' },
    };
    const stack = await detectStack(pkg, '/tmp');
    expect(stack.frameworks).toContain('shadcn');
    expect(stack.uiLibrary).toBe('shadcn');
  });
});
