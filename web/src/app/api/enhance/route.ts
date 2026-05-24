import type { NextRequest } from 'next/server';

export const runtime = 'edge';

interface EnhanceRequest {
  prompt: string;
  projectContext?: string;
}

const SYSTEM_PROMPT = 'You are an expert software engineer. Follow instructions precisely. Write clean, idiomatic, production-ready code.';

function buildSimplePrompt(prompt: string, projectContext: string): string {
  const sections: string[] = [];

  sections.push(`## Task\n\n**Handle**: ${prompt}`);

  sections.push(`## Requirements\n\n- Write clean, production-ready code\n- Follow existing conventions\n- List every file you create or modify at the end`);

  if (projectContext.trim()) {
    sections.push(`## Context\n\n${projectContext}`);
  }

  sections.push(`## Expected Output\n\nBe thorough and precise. Show all changes. List every file created or modified at the end.`);

  return sections.join('\n\n---\n\n');
}

export async function POST(request: NextRequest) {
  const apiKey = process.env['ANTHROPIC_API_KEY'];
  if (!apiKey) {
    return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  let body: EnhanceRequest;
  try {
    body = await request.json() as EnhanceRequest;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { prompt, projectContext = '' } = body;
  if (!prompt?.trim()) {
    return Response.json({ error: 'prompt is required' }, { status: 400 });
  }

  const enhancedPrompt = buildSimplePrompt(prompt.trim(), projectContext);

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: enhancedPrompt }],
    }),
  });

  if (!upstream.ok) {
    const errText = await upstream.text();
    return Response.json({ error: errText }, { status: upstream.status });
  }

  // Forward the SSE stream from Anthropic directly to the client
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();

      // First emit the enhanced prompt so UI can display it
      const metaChunk = `data: ${JSON.stringify({ type: 'enhanced_prompt', content: enhancedPrompt })}\n\n`;
      controller.enqueue(new TextEncoder().encode(metaChunk));

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const event = JSON.parse(data) as { type: string; delta?: { type: string; text?: string }; usage?: { output_tokens: number } };
              if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
                const chunk = `data: ${JSON.stringify({ type: 'text', content: event.delta.text ?? '' })}\n\n`;
                controller.enqueue(new TextEncoder().encode(chunk));
              }
              if (event.type === 'message_delta' && event.usage) {
                const chunk = `data: ${JSON.stringify({ type: 'usage', outputTokens: event.usage.output_tokens })}\n\n`;
                controller.enqueue(new TextEncoder().encode(chunk));
              }
            } catch {
              // skip malformed events
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
