export type Angle = 'completeness' | 'production' | 'dx' | 'alternative';

export const ANGLE_LABELS: Record<Angle, string> = {
  completeness: 'Completeness',
  production:   'Production Safety',
  dx:           'Developer Experience',
  alternative:  'Alternative Approach',
};

const ANGLE_ORDER: Angle[] = ['completeness', 'production', 'dx', 'alternative'];

export function getAngle(iteration: number): Angle {
  const idx = Math.min(iteration, ANGLE_ORDER.length - 1);
  return ANGLE_ORDER[idx]!;
}

export function getAngleFocus(angle: Angle): string {
  switch (angle) {
    case 'completeness':
      return 'Cover every feature, sub-case, and edge case. Assume the reviewer will ask "what about X?" for every possible X. Nothing should be missing.';
    case 'production':
      return 'Focus on what breaks at 3am: failure modes, error handling, observability, security vulnerabilities, race conditions, data consistency, and retry semantics.';
    case 'dx':
      return 'Focus on implementation guidance: the correct step-by-step order, what confuses junior developers, integration pitfalls, what to verify first, and common mistakes.';
    case 'alternative':
      return 'Propose a meaningfully different architecture or pattern than the obvious approach. Explain the trade-off. Challenge the default solution.';
  }
}
