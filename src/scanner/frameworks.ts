import { stat } from 'fs/promises';
import { join } from 'path';
import type { ProjectStack } from '../types.js';

interface PkgJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export async function detectStack(pkg: Record<string, unknown>, root: string): Promise<ProjectStack> {
  const deps = {
    ...(pkg['dependencies'] as Record<string, string> | undefined ?? {}),
    ...(pkg['devDependencies'] as Record<string, string> | undefined ?? {}),
  } as Record<string, string>;

  const has = (name: string) => name in deps;

  const frameworks: string[] = [];

  // Frontend frameworks
  if (has('next')) frameworks.push('nextjs');
  if (has('react') && !frameworks.includes('nextjs')) frameworks.push('react');
  if (has('vue')) frameworks.push('vue');
  if (has('svelte') || has('@sveltejs/kit')) frameworks.push('svelte');
  if (has('nuxt') || has('nuxt3')) frameworks.push('nuxt');
  if (has('@remix-run/node') || has('@remix-run/react')) frameworks.push('remix');
  if (has('astro')) frameworks.push('astro');

  // Backend frameworks
  if (has('express')) frameworks.push('express');
  if (has('fastify')) frameworks.push('fastify');
  if (has('hono')) frameworks.push('hono');
  if (has('@nestjs/core')) frameworks.push('nestjs');

  // Styling
  if (has('tailwindcss')) frameworks.push('tailwind');

  // UI Libraries
  let uiLibrary: string | undefined;
  if (has('@radix-ui/react-dialog') || has('shadcn') || has('@shadcn/ui')) {
    frameworks.push('shadcn');
    uiLibrary = 'shadcn';
  } else if (has('@mui/material')) {
    frameworks.push('mui');
    uiLibrary = 'mui';
  } else if (has('antd')) {
    frameworks.push('antd');
    uiLibrary = 'antd';
  } else if (has('@chakra-ui/react')) {
    frameworks.push('chakra');
    uiLibrary = 'chakra';
  }

  // ORM
  let orm: string | undefined;
  if (has('prisma') || has('@prisma/client')) orm = 'prisma';
  else if (has('drizzle-orm')) orm = 'drizzle';
  else if (has('typeorm')) orm = 'typeorm';
  else if (has('mongoose')) orm = 'mongoose';

  // Testing
  let testing: string | undefined;
  if (has('vitest')) testing = 'vitest';
  else if (has('jest') || has('@jest/core')) testing = 'jest';
  else if (has('@playwright/test')) testing = 'playwright';
  else if (has('cypress')) testing = 'cypress';

  // Language
  const language: 'typescript' | 'javascript' = has('typescript') ? 'typescript' : 'javascript';

  // Package manager (lockfile detection)
  const packageManager = await detectPackageManager(root);

  // Next.js router type
  let nextRouterType: 'app' | 'pages' | undefined;
  if (frameworks.includes('nextjs')) {
    const hasApp = await pathExists(join(root, 'app')) || await pathExists(join(root, 'src', 'app'));
    const hasPages = await pathExists(join(root, 'pages')) || await pathExists(join(root, 'src', 'pages'));
    nextRouterType = hasApp ? 'app' : hasPages ? 'pages' : 'app';
  }

  // Runtime
  let runtime: 'node' | 'browser' | 'edge' | 'unknown' = 'unknown';
  if (frameworks.some(f => ['express', 'fastify', 'hono', 'nestjs'].includes(f))) runtime = 'node';
  else if (frameworks.some(f => ['react', 'vue', 'svelte', 'astro'].includes(f))) runtime = 'browser';
  else if (frameworks.includes('nextjs')) runtime = 'browser';

  return { language, frameworks, runtime, orm, testing, packageManager, nextRouterType, uiLibrary };
}

async function detectPackageManager(root: string): Promise<'npm' | 'yarn' | 'pnpm' | 'bun'> {
  if (await pathExists(join(root, 'bun.lockb'))) return 'bun';
  if (await pathExists(join(root, 'pnpm-lock.yaml'))) return 'pnpm';
  if (await pathExists(join(root, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}
