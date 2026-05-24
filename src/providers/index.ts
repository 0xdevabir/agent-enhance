import { ClaudeProvider } from './claude.js';
import { CodexProvider, OpenCodeProvider } from './codex.js';
import { EnhanceError } from '../cli/errors.js';
import type { AIProvider, EnhanceConfig } from '../types.js';

export function getProvider(config: EnhanceConfig): AIProvider {
  switch (config.provider) {
    case 'claude':
      return new ClaudeProvider(config);
    case 'codex':
      return new CodexProvider();
    case 'opencode':
      return new OpenCodeProvider();
    default:
      throw new EnhanceError(
        'UNKNOWN_PROVIDER',
        `Unknown provider "${config.provider}". Use: claude, codex, opencode`,
      );
  }
}
