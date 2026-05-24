import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateDomainEnhancements } from './domain-requirements.js';
import type { Intent, ProjectStack } from '../types.js';

vi.mock('@anthropic-ai/sdk', () => {
  const mockCreate = vi.fn();
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: { create: mockCreate },
    })),
    __mockCreate: mockCreate,
  };
});

async function getMockCreate() {
  const mod = await import('@anthropic-ai/sdk');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (mod as any).__mockCreate as ReturnType<typeof vi.fn>;
}

const PAYMENT_INTENT: Intent = {
  action: 'add',
  entity: 'api',
  feature: 'payment',
  scope: 'feature',
  complexity: 'feature',
  confidence: 0.9,
  rawPrompt: 'add payment retry logic for failed subscriptions',
};

const TS_STACK: ProjectStack = {
  language: 'typescript',
  frameworks: ['nextjs'],
  runtime: 'node',
  orm: 'prisma',
  packageManager: 'npm',
  nextRouterType: 'app',
};

describe('generateDomainEnhancements', () => {
  beforeEach(async () => {
    const mockCreate = await getMockCreate();
    mockCreate.mockReset();
  });

  it('parses valid JSON response into requirements/assumptions/gotchas', async () => {
    const mockCreate = await getMockCreate();
    mockCreate.mockResolvedValue({
      content: [{
        type: 'text',
        text: JSON.stringify({
          requirements: [
            'Use exponential backoff with jitter for retry intervals',
            'Store payment_intent_id not charge_id — charge IDs change on retries',
            'Idempotency keys must be keyed on event.id to prevent double-processing',
          ],
          assumptions: [
            'Assumed using Stripe as payment processor',
            'Assumed single-tenant architecture',
          ],
          gotchas: [
            'Stripe webhooks fire multiple times — idempotency is non-negotiable',
            'Retry without backoff will get your Stripe account rate-limited',
          ],
        }),
      }],
    });

    const result = await generateDomainEnhancements(
      PAYMENT_INTENT.rawPrompt,
      PAYMENT_INTENT,
      TS_STACK,
      'completeness',
      'test-key',
    );

    expect(result.requirements).toHaveLength(3);
    expect(result.requirements[0]).toContain('exponential backoff');
    expect(result.assumptions).toHaveLength(2);
    expect(result.assumptions[0]).toMatch(/^Assumed/);
    expect(result.gotchas).toHaveLength(2);
    expect(result.gotchas[0]).toContain('Stripe');
  });

  it('falls back to JSON extraction when response has extra prose', async () => {
    const mockCreate = await getMockCreate();
    const payload = {
      requirements: ['Use idempotency keys keyed on event.id'],
      assumptions: ['Assumed Stripe'],
      gotchas: ['Webhooks fire multiple times'],
    };
    mockCreate.mockResolvedValue({
      content: [{
        type: 'text',
        text: `Here are the requirements:\n\`\`\`json\n${JSON.stringify(payload)}\n\`\`\``,
      }],
    });

    const result = await generateDomainEnhancements(
      PAYMENT_INTENT.rawPrompt,
      PAYMENT_INTENT,
      TS_STACK,
      'production',
      'test-key',
    );

    expect(result.requirements).toHaveLength(1);
    expect(result.gotchas).toHaveLength(1);
  });

  it('throws when response contains no valid JSON', async () => {
    const mockCreate = await getMockCreate();
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'I cannot help with that.' }],
    });

    await expect(
      generateDomainEnhancements(PAYMENT_INTENT.rawPrompt, PAYMENT_INTENT, TS_STACK, 'dx', 'test-key'),
    ).rejects.toThrow();
  });

  it('uses angle-specific focus in system prompt', async () => {
    const mockCreate = await getMockCreate();
    mockCreate.mockResolvedValue({
      content: [{
        type: 'text',
        text: JSON.stringify({
          requirements: ['test requirement'],
          assumptions: [],
          gotchas: [],
        }),
      }],
    });

    await generateDomainEnhancements(PAYMENT_INTENT.rawPrompt, PAYMENT_INTENT, TS_STACK, 'production', 'test-key');

    const call = mockCreate.mock.calls[0][0];
    expect(call.system).toContain('3am');
  });
});
