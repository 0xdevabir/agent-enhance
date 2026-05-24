import Anthropic from '@anthropic-ai/sdk';
import type { Intent, ProjectStack } from '../types.js';
import type { Angle } from './angles.js';
import { getAngleFocus } from './angles.js';

export interface DomainEnhancements {
  requirements: string[];
  assumptions: string[];
  gotchas: string[];
}

export async function generateDomainEnhancements(
  rawPrompt: string,
  intent: Intent,
  stack: ProjectStack,
  angle: Angle,
  apiKey: string,
): Promise<DomainEnhancements> {
  const client = new Anthropic({ apiKey });

  const stackSummary = [
    stack.language === 'typescript' ? 'TypeScript' : 'JavaScript',
    ...stack.frameworks,
    stack.orm    ? `ORM:${stack.orm}`       : null,
    stack.uiLibrary ? `UI:${stack.uiLibrary}` : null,
  ].filter(Boolean).join(', ');

  const system = `You are a senior software engineer specializing in ${intent.feature} systems.
Generate implementation requirements, assumptions, and gotchas for a specific task.

CRITICAL RULES for requirements:
1. Every requirement must be SPECIFIC to this exact task — not generic boilerplate
2. Ask: "Would this sentence appear in a prompt about a completely different feature?" If yes → discard
3. Angle focus: ${getAngleFocus(angle)}

REJECTED examples (too generic — never include):
- "Use TypeScript throughout — no any"
- "Handle errors explicitly"
- "Keep components small and focused"
- "Follow best practices"

GOOD examples (specific, expert-level):
- "Stripe webhooks fire multiple times — use idempotency keys keyed on event.id to prevent double-processing"
- "Store payment_intent_id not charge_id — charge IDs change on retries"
- "JWT refresh tokens must be rotated on every use to prevent token theft via stolen refresh token reuse"

Return ONLY valid JSON — no markdown, no prose:
{
  "requirements": ["...", "..."],  // 10-13 specific items
  "assumptions": ["Assumed ...", "Assumed ..."],  // 3-5 items starting with "Assumed"
  "gotchas": ["gotcha description", "..."]  // 2-3 non-obvious things that WILL bite
}`;

  const user = `Task: "${rawPrompt}"
Domain: ${intent.feature}
Stack: ${stackSummary}
Action: ${intent.action} | Entity: ${intent.entity}

Generate requirements, assumptions, and gotchas. JSON only.`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1536,
    system,
    messages: [{ role: 'user', content: user }],
  });

  const text = response.content[0]?.type === 'text' ? response.content[0].text : '{}';

  try {
    const parsed = JSON.parse(text) as DomainEnhancements;
    if (Array.isArray(parsed.requirements) && parsed.requirements.length > 0) {
      return {
        requirements: parsed.requirements,
        assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions : [],
        gotchas: Array.isArray(parsed.gotchas) ? parsed.gotchas : [],
      };
    }
    throw new Error('empty requirements');
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as DomainEnhancements;
      return {
        requirements: Array.isArray(parsed.requirements) ? parsed.requirements : [],
        assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions : [],
        gotchas: Array.isArray(parsed.gotchas) ? parsed.gotchas : [],
      };
    }
    throw new Error('Failed to parse domain enhancements from AI response');
  }
}
