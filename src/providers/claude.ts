import Anthropic from '@anthropic-ai/sdk';
import { EnhanceError } from '../cli/errors.js';
import type { AIProvider, EnhanceConfig } from '../types.js';

const MODEL_BY_COMPLEXITY: Record<string, string> = {
  simple:  'claude-haiku-4-5-20251001',
  feature: 'claude-sonnet-4-6',
  system:  'claude-opus-4-7',
};

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

  async send(prompt: string, options?: Record<string, unknown>): Promise<void> {
    const complexity = options?.['complexity'] as string | undefined;
    // Auto-route model by complexity unless user set an explicit model in config
    if (complexity && MODEL_BY_COMPLEXITY[complexity] && this.model === 'claude-sonnet-4-6') {
      this.model = MODEL_BY_COMPLEXITY[complexity]!;
    }

    console.log(`  Model: ${this.model}\n`);

    const stream = await this.client.messages.create({
      model: this.model,
      max_tokens: 8192,
      system: 'You are an expert software engineer. Follow instructions precisely. Write clean, idiomatic, production-ready code.',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    let inputTokens = 0;
    let outputTokens = 0;

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        process.stdout.write(event.delta.text);
      }
      if (event.type === 'message_start' && event.message.usage) {
        inputTokens = event.message.usage.input_tokens;
      }
      if (event.type === 'message_delta' && event.usage) {
        outputTokens = event.usage.output_tokens;
      }
    }

    process.stdout.write('\n');

    const onUsage = options?.['onUsage'] as ((u: { inputTokens: number; outputTokens: number; model: string }) => void) | undefined;
    onUsage?.({ inputTokens, outputTokens, model: this.model });
  }
}
