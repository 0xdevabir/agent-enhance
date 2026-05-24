import { analyzeIntent } from '../analyzer/intent.js';
import { getFallbackInjections } from './injectors.js';
import { buildEnhancedPrompt } from './template.js';
import { getAngle, ANGLE_LABELS } from './angles.js';
import { generateDomainEnhancements } from './domain-requirements.js';
import type { ScanResult, EnhancedPrompt, Intent, EnhanceConfig } from '../types.js';

export async function enhance(
  rawPrompt: string,
  scan: ScanResult,
  contextFiles: string,
  projectInstructions: string = '',
  gitContext: string = '',
  intentOverride?: Intent,
  config?: Partial<EnhanceConfig>,
  iteration: number = 0,
  _previousPrompt?: string,
): Promise<EnhancedPrompt> {
  const intent = intentOverride ?? analyzeIntent(rawPrompt);
  const angle = getAngle(iteration);

  let injections: string[];
  let assumptions: string[] = [];
  let gotchas: string[] = [];

  if (config?.apiKey) {
    try {
      const domain = await generateDomainEnhancements(rawPrompt, intent, scan.stack, angle, config.apiKey);
      injections = domain.requirements;
      assumptions = domain.assumptions;
      gotchas = domain.gotchas;
    } catch {
      injections = getFallbackInjections(scan.stack, intent, config);
    }
  } else {
    injections = getFallbackInjections(scan.stack, intent, config);
  }

  const enhanced = buildEnhancedPrompt({
    stack: scan.stack,
    structure: scan.structure,
    intent,
    contextFiles,
    injections,
    projectInstructions,
    gitContext,
    angle,
    assumptions,
    gotchas,
    iteration,
  });

  return { original: rawPrompt, enhanced, intent, stack: scan.stack, iteration, angle: ANGLE_LABELS[angle] };
}

