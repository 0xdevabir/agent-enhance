import { analyzeIntent } from '../analyzer/intent.js';
import { getInjections } from './injectors.js';
import { buildEnhancedPrompt } from './template.js';
import type { ScanResult, EnhancedPrompt, Intent, EnhanceConfig } from '../types.js';

export function enhance(
  rawPrompt: string,
  scan: ScanResult,
  contextFiles: string,
  projectInstructions: string = '',
  gitContext: string = '',
  intentOverride?: Intent,
  config?: Partial<EnhanceConfig>,
): EnhancedPrompt {
  const intent = intentOverride ?? analyzeIntent(rawPrompt);
  const injections = getInjections(scan.stack, intent, config);
  const enhanced = buildEnhancedPrompt({
    stack: scan.stack,
    structure: scan.structure,
    intent,
    contextFiles,
    injections,
    projectInstructions,
    gitContext,
  });

  return { original: rawPrompt, enhanced, intent, stack: scan.stack };
}
