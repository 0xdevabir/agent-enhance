import Anthropic from '@anthropic-ai/sdk';
import { EnhanceError } from '../cli/errors.js';
import type { AIProvider } from '../types.js';
import type { EnhanceConfig } from '../types.js';

export class ClaudeProvider implements AIProvider {
  name = 'Claude';
  private client: Anthropic;
  private model: string;

  constructor(config: EnhanceConfig) {
    if (!config.apiKey) {
      throw new EnhanceError(
        'MISSING_API_KEY',
        'ANTHROPIC_API_KEY environment variable is not set.',
      );
    }
    this.client = new Anthropic({ apiKey: config.apiKey });
    this.model = config.model;
  }

  async send(prompt: string): Promise<void> {
    const stream = await this.client.messages.create({
      model: this.model,
      max_tokens: 8192,
      system: 'You are an expert software engineer. Follow instructions precisely. Write clean, idiomatic, production-ready code.',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        process.stdout.write(event.delta.text);
      }
    }

    process.stdout.write('\n');
  }
}
