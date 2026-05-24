import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import type { FolderStructure } from '../types.js';

const EXCLUDE_DIRS = new Set([
  'node_modules', '.git', '.next', '.nuxt', 'dist', 'build',
  '.cache', 'coverage', '.turbo', 'out', '.output',
]);

export async function scanFolderStructure(root: string): Promise<FolderStructure> {
  const entries = await readdir(root, { withFileTypes: true });
  const dirs = entries
    .filter(e => e.isDirectory() && !EXCLUDE_DIRS.has(e.name))
    .map(e => e.name);

  const hasSrcDir = dirs.includes('src');
  const hasAppDir = dirs.includes('app') || await dirExists(join(root, 'src', 'app'));
  const hasPagesDir = dirs.includes('pages') || await dirExists(join(root, 'src', 'pages'));

  let srcDirs: string[] = [];
  if (hasSrcDir) {
    try {
      const srcEntries = await readdir(join(root, 'src'), { withFileTypes: true });
      srcDirs = srcEntries
        .filter(e => e.isDirectory() && !EXCLUDE_DIRS.has(e.name))
        .map(e => e.name);
    } catch {
      // src dir not accessible
    }
  }

  return { root, dirs, srcDirs, hasAppDir, hasPagesDir, hasSrcDir };
}

async function dirExists(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    return s.isDirectory();
  } catch {
    return false;
  }
}
