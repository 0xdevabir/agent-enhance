import { analyzeIntent } from '../analyzer/intent.js';
import { getInjections } from './injectors.js';
import { buildEnhancedPrompt } from './template.js';
import type { ScanResult, EnhancedPrompt } from '../types.js';

export function enhance(rawPrompt: string, scan: ScanResult, contextFiles: string): EnhancedPrompt {
  const intent = analyzeIntent(rawPrompt);
  const injections = getInjections(scan.stack, intent);
  const enhanced = buildEnhancedPrompt({
    stack: scan.stack,
    structure: scan.structure,
    intent,
    contextFiles,
    injections,
  });

  return { original: rawPrompt, enhanced, intent, stack: scan.stack };
}
