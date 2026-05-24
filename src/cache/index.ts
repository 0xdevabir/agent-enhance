import { readFile, writeFile, stat } from 'fs/promises';
import { join } from 'path';
import type { ScanResult } from '../types.js';

const CACHE_FILE = '.enhance-cache.json';

interface CachePayload {
  scannedAt: number;
  result: ScanResult;
}

export async function getCached(root: string): Promise<ScanResult | null> {
  const cachePath = join(root, CACHE_FILE);
  try {
    const raw = await readFile(cachePath, 'utf-8');
    const payload = JSON.parse(raw) as CachePayload;

    // Invalidate if package.json is newer than cache
    const pkgStat = await stat(join(root, 'package.json'));
    if (pkgStat.mtimeMs > payload.scannedAt) return null;

    return payload.result;
  } catch {
    return null;
  }
}

export async function setCached(root: string, result: ScanResult): Promise<void> {
  const cachePath = join(root, CACHE_FILE);
  const payload: CachePayload = { scannedAt: Date.now(), result };
  await writeFile(cachePath, JSON.stringify(payload, null, 2), 'utf-8');
}
