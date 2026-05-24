import { readFile } from 'fs/promises';
import { join } from 'path';

export async function readPackageJson(root: string): Promise<Record<string, unknown> | null> {
  try {
    const content = await readFile(join(root, 'package.json'), 'utf-8');
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    return null;
  }
}
