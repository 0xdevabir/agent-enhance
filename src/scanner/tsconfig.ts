import { readFile } from 'fs/promises';
import { join } from 'path';

interface TsConfigResult {
  paths?: Record<string, string[]>;
  baseUrl?: string;
}

export async function readTsConfig(root: string): Promise<TsConfigResult | null> {
  try {
    const content = await readFile(join(root, 'tsconfig.json'), 'utf-8');
    const parsed = JSON.parse(content) as { compilerOptions?: { paths?: Record<string, string[]>; baseUrl?: string } };
    return {
      paths: parsed.compilerOptions?.paths,
      baseUrl: parsed.compilerOptions?.baseUrl,
    };
  } catch {
    return null;
  }
}
