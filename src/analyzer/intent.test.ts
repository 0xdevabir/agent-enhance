import { describe, it, expect } from 'vitest';
import { analyzeIntent } from './intent.js';

describe('analyzeIntent', () => {
  it('detects create action for build', () => {
    const intent = analyzeIntent('build a login page');
    expect(intent.action).toBe('create');
  });

  it('detects page entity', () => {
    const intent = analyzeIntent('build a login page');
    expect(intent.entity).toBe('page');
  });

  it('detects auth feature from login', () => {
    const intent = analyzeIntent('build a login page');
    expect(intent.feature).toBe('auth');
  });

  it('detects fix action', () => {
    const intent = analyzeIntent('fix the auth bug');
    expect(intent.action).toBe('fix');
  });

  it('detects refactor action', () => {
    const intent = analyzeIntent('refactor the user service');
    expect(intent.action).toBe('refactor');
  });

  it('detects component entity', () => {
    const intent = analyzeIntent('create a dropdown component');
    expect(intent.entity).toBe('component');
  });

  it('detects api entity', () => {
    const intent = analyzeIntent('build a payment api endpoint');
    expect(intent.entity).toBe('api');
    expect(intent.feature).toBe('payment');
  });

  it('detects hook entity', () => {
    const intent = analyzeIntent('create a custom hook for auth');
    expect(intent.entity).toBe('hook');
    expect(intent.feature).toBe('auth');
  });

  it('preserves rawPrompt', () => {
    const raw = 'build login page with oauth';
    const intent = analyzeIntent(raw);
    expect(intent.rawPrompt).toBe(raw);
  });

  it('returns unknown action for unrecognized prompt', () => {
    const intent = analyzeIntent('xyzzy frobulate the blarg');
    expect(intent.action).toBe('unknown');
  });
});
