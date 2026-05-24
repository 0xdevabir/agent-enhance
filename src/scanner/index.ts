import { readPackageJson } from './package.js';
import { detectStack } from './frameworks.js';
import { scanFolderStructure } from './structure.js';
import { readTsConfig } from './tsconfig.js';
import type { ScanResult } from '../types.js';

export async function scanProject(root: string): Promise<ScanResult> {
  const [pkg, structure] = await Promise.all([
    readPackageJson(root),
    scanFolderStructure(root),
  ]);

  const safePkg = pkg ?? {};
  const [stack] = await Promise.all([
    detectStack(safePkg, root),
    readTsConfig(root),
  ]);

  return {
    stack,
    structure,
    projectRoot: root,
    scannedAt: Date.now(),
  };
}
