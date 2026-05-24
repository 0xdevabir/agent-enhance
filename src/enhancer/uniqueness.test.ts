import { describe, it, expect } from 'vitest';
import { overlapScore } from './uniqueness.js';

describe('overlapScore', () => {
  it('returns 0 for two empty strings', () => {
    expect(overlapScore('', '')).toBe(0);
  });

  it('returns 1 for identical strings', () => {
    expect(overlapScore('hello world foo', 'hello world foo')).toBe(1);
  });

  it('returns 0 for completely different strings', () => {
    expect(overlapScore('cat dog bird', 'house car tree')).toBe(0);
  });

  it('returns value between 0 and 1 for partial overlap', () => {
    const score = overlapScore('use stripe payment retry', 'stripe webhook idempotency');
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });

  it('ignores short words under 3 chars', () => {
    const withShort = overlapScore('add a payment', 'use payment');
    const withLong = overlapScore('add payment', 'use payment');
    expect(withShort).toBe(withLong);
  });

  it('is case-insensitive', () => {
    const lower = overlapScore('stripe payment', 'stripe payment');
    const mixed = overlapScore('Stripe Payment', 'stripe payment');
    expect(lower).toBe(mixed);
  });

  it('highly similar prompts score > 0.5', () => {
    const a = 'use idempotency keys for stripe webhooks to prevent double processing';
    const b = 'use idempotency keys on stripe webhooks to avoid double processing';
    expect(overlapScore(a, b)).toBeGreaterThan(0.5);
  });

  it('different angle prompts score < 0.4', () => {
    const completeness = 'cover all stripe webhook events subscription cancel update failed invoice';
    const production = 'monitor dead letter queue alert oncall failed webhook retries timeout circuit breaker';
    expect(overlapScore(completeness, production)).toBeLessThan(0.4);
  });
});
