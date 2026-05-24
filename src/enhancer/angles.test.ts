import { describe, it, expect } from 'vitest';
import { getAngle, getAngleFocus, ANGLE_LABELS } from './angles.js';

describe('getAngle', () => {
  it('returns completeness for iteration 0', () => {
    expect(getAngle(0)).toBe('completeness');
  });

  it('returns production for iteration 1', () => {
    expect(getAngle(1)).toBe('production');
  });

  it('returns dx for iteration 2', () => {
    expect(getAngle(2)).toBe('dx');
  });

  it('returns alternative for iteration 3', () => {
    expect(getAngle(3)).toBe('alternative');
  });

  it('clamps to alternative for iteration > 3', () => {
    expect(getAngle(10)).toBe('alternative');
    expect(getAngle(99)).toBe('alternative');
  });
});

describe('getAngleFocus', () => {
  it('completeness focus mentions edge cases', () => {
    expect(getAngleFocus('completeness').toLowerCase()).toContain('edge case');
  });

  it('production focus mentions 3am', () => {
    expect(getAngleFocus('production')).toContain('3am');
  });

  it('dx focus mentions junior developers', () => {
    expect(getAngleFocus('dx').toLowerCase()).toContain('junior');
  });

  it('alternative focus mentions different architecture', () => {
    expect(getAngleFocus('alternative').toLowerCase()).toContain('architecture');
  });
});

describe('ANGLE_LABELS', () => {
  it('has label for all four angles', () => {
    expect(ANGLE_LABELS.completeness).toBeTruthy();
    expect(ANGLE_LABELS.production).toBeTruthy();
    expect(ANGLE_LABELS.dx).toBeTruthy();
    expect(ANGLE_LABELS.alternative).toBeTruthy();
  });
});
