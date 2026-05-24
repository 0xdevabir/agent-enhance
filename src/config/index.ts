import { cosmiconfig } from 'cosmiconfig';
import type { EnhanceConfig } from '../types.js';

const DEFAULT_CONFIG: EnhanceConfig = {
  provider: 'claude',
  model: 'claude-sonnet-4-6',
  maxContextTokens: 3000,
};

export async function loadConfig(root: string): Promise<EnhanceConfig> {
  const explorer = cosmiconfig('enhance', {
    searchPlaces: [
      '.enhancerc',
      '.enhancerc.json',
      '.enhancerc.yaml',
      'enhance.config.js',
      'enhance.config.ts',
      'package.json',
    ],
  });

  let userConfig: Partial<EnhanceConfig> = {};
  try {
    const result = await explorer.search(root);
    if (result?.config) {
      userConfig = result.config as Partial<EnhanceConfig>;
    }
  } catch {
    // no config found — use defaults
  }

  const merged: EnhanceConfig = { ...DEFAULT_CONFIG, ...userConfig };

  // Resolve API key from env if not in config (validation happens in provider)
  if (!merged.apiKey) {
    merged.apiKey = process.env['ANTHROPIC_API_KEY'] ?? process.env['OPENAI_API_KEY'];
  }

  return merged;
}
