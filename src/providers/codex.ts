import { spawn } from 'child_process';
import { EnhanceError } from '../cli/errors.js';
import type { AIProvider } from '../types.js';

export class CodexProvider implements AIProvider {
  name = 'Codex';

  async send(prompt: string): Promise<void> {
    await runSubprocess('codex', [prompt]);
  }
}

export class OpenCodeProvider implements AIProvider {
  name = 'OpenCode';

  async send(prompt: string): Promise<void> {
    await runSubprocess('opencode', ['run', prompt]);
  }
}

function runSubprocess(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit' });

    child.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'ENOENT') {
        reject(new EnhanceError(
          'PROVIDER_NOT_FOUND',
          `Provider "${cmd}" is not installed or not in PATH. Install it first.`,
        ));
      } else {
        reject(err);
      }
    });

    child.on('close', (code) => {
      if (code === 0 || code === null) resolve();
      else reject(new EnhanceError('PROVIDER_ERROR', `${cmd} exited with code ${code}`));
    });
  });
}
