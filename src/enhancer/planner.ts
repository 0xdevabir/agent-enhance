import Anthropic from '@anthropic-ai/sdk';
import type { Intent, ProjectStack } from '../types.js';

interface PlanStep {
  step: number;
  title: string;
  prompt: string;
  dependsOn: number[];
}

interface PlanResult {
  steps: PlanStep[];
}

export async function decomposeToPlan(
  rawPrompt: string,
  intent: Intent,
  stack: ProjectStack,
  apiKey: string,
): Promise<PlanResult> {
  const client = new Anthropic({ apiKey });

  const stackSummary = `${stack.frameworks.join(', ')} / ${stack.language}`;

  const systemPrompt = `You are a software architect. Break complex development tasks into sequential, focused implementation steps.
Each step should be small enough to implement in a single AI session.
Return valid JSON only — no prose, no markdown fences.`;

  const userPrompt = `Task: "${rawPrompt}"
Stack: ${stackSummary}

Break this into ordered implementation steps. Each step must be self-contained and reference the previous step's outputs when needed.

Return JSON with this exact shape:
{
  "steps": [
    {
      "step": 1,
      "title": "short title",
      "prompt": "the full focused prompt for this step, including what was done in previous steps",
      "dependsOn": []
    }
  ]
}

Rules:
- 2–6 steps maximum
- Each prompt should be specific and actionable
- Later steps must mention what the earlier steps created
- Do not include setup/install steps unless strictly necessary`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = response.content[0]?.type === 'text' ? response.content[0].text : '{}';

  try {
    const parsed = JSON.parse(text) as PlanResult;
    return parsed;
  } catch {
    // Fallback: extract JSON from response if wrapped in text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as PlanResult;
    }
    throw new Error('Failed to parse plan JSON from AI response');
  }
}
