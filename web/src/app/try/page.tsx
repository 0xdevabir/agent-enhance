"use client";

import { useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import { Zap, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

type Complexity = "simple" | "feature" | "system";

interface IntentData {
  action: string;
  entity: string;
  feature: string;
  scope: string;
  complexity: Complexity;
  confidence: number;
}

const COMPLEXITY_COLORS: Record<Complexity, string> = {
  simple:  "text-green-400 bg-green-400/10 border-green-400/20",
  feature: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  system:  "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export default function TryPage() {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [output, setOutput] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [intent, setIntent] = useState<IntentData | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const handleEnhance = useCallback(async () => {
    if (!prompt.trim() || streaming) return;

    setStreaming(true);
    setOutput("");
    setEnhancedPrompt("");
    setIntent(null);
    setError("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), projectContext: context }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json() as { error: string };
        setError(err.error ?? "Request failed");
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6)) as {
              type: string;
              content?: string;
              outputTokens?: number;
            };

            if (event.type === "enhanced_prompt" && event.content) {
              setEnhancedPrompt(event.content);
              // Quick client-side intent detection from prompt text
              setIntent(detectIntent(prompt));
            }
            if (event.type === "text" && event.content) {
              setOutput(prev => prev + event.content);
            }
          } catch {
            // skip
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError("Stream failed: " + (e as Error).message);
      }
    } finally {
      setStreaming(false);
    }
  }, [prompt, context, streaming]);

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStop = () => {
    abortRef.current?.abort();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <BackgroundOrbs />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-20 pt-32">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Try Enhance
          </h1>
          <p className="text-zinc-400 text-lg">
            Paste a vague prompt. Get a production-quality AI instruction.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="build a login page with email and password..."
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-zinc-500 font-mono text-sm"
            />
          </div>

          <button
            onClick={() => setShowContext(v => !v)}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {showContext ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showContext ? "Hide" : "Add"} project context (optional)
          </button>

          {showContext && (
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="Paste relevant code, file contents, or describe your stack..."
              rows={6}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-300 placeholder-zinc-500 resize-none focus:outline-none focus:border-zinc-500 font-mono text-sm"
            />
          )}

          <div className="flex gap-3">
            <button
              onClick={handleEnhance}
              disabled={!prompt.trim() || streaming}
              className="flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Zap size={16} />
              {streaming ? "Enhancing..." : "Enhance Prompt"}
            </button>

            {streaming && (
              <button
                onClick={handleStop}
                className="px-5 py-2.5 border border-zinc-600 rounded-lg text-zinc-300 hover:border-zinc-400 transition-all text-sm"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-900/20 border border-red-700/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Intent card */}
        {intent && (
          <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3 font-medium">Detected Intent</p>
            <div className="flex flex-wrap gap-2">
              <Badge label="Action" value={intent.action} color="text-yellow-400" />
              <Badge label="Entity" value={intent.entity} color="text-blue-400" />
              <Badge label="Feature" value={intent.feature} color="text-cyan-400" />
              <Badge label="Scope" value={intent.scope} color="text-green-400" />
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${COMPLEXITY_COLORS[intent.complexity]}`}>
                {intent.complexity}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-400">
                {Math.round(intent.confidence * 100)}% confidence
              </span>
            </div>
          </div>
        )}

        {/* Enhanced prompt + output */}
        {(enhancedPrompt || output || streaming) && (
          <div className="space-y-4">
            {enhancedPrompt && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Enhanced Prompt</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="p-4 text-xs text-zinc-300 font-mono overflow-auto max-h-48 whitespace-pre-wrap">
                  {enhancedPrompt}
                </pre>
              </div>
            )}

            {(output || streaming) && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">AI Response</span>
                  {streaming && (
                    <span className="flex items-center gap-1 text-xs text-blue-400">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                      streaming
                    </span>
                  )}
                </div>
                <pre className="p-4 text-sm text-zinc-200 font-mono overflow-auto max-h-[600px] whitespace-pre-wrap">
                  {output}
                  {streaming && <span className="animate-pulse text-blue-400">▊</span>}
                </pre>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Badge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-400">
      <span className="text-zinc-600">{label}: </span>
      <span className={color}>{value}</span>
    </span>
  );
}

function detectIntent(prompt: string): IntentData {
  const lower = prompt.toLowerCase();

  const action = lower.match(/\b(fix|debug|repair|broken)\b/) ? "fix"
    : lower.match(/\b(create|build|make|generate|scaffold)\b/) ? "create"
    : lower.match(/\b(add|implement|integrate)\b/) ? "add"
    : lower.match(/\b(refactor|restructure|cleanup)\b/) ? "refactor"
    : lower.match(/\b(explain|describe|how)\b/) ? "explain"
    : "unknown";

  const entity = lower.match(/\b(page|route|view)\b/) ? "page"
    : lower.match(/\b(component|widget|card|modal)\b/) ? "component"
    : lower.match(/\b(api|endpoint|route handler|action)\b/) ? "api"
    : lower.match(/\b(hook|use[A-Z])\b/) ? "hook"
    : "unknown";

  const feature = lower.match(/\b(auth|login|logout|session|jwt|password)\b/) ? "auth"
    : lower.match(/\b(payment|stripe|billing|checkout)\b/) ? "payment"
    : lower.match(/\b(upload|file|storage|media)\b/) ? "upload"
    : lower.match(/\b(user|profile|account)\b/) ? "user"
    : lower.match(/\b(dashboard|admin|analytics)\b/) ? "dashboard"
    : "general";

  const isSystem = /\b(entire|whole|all|system|everywhere|global|full)\b/.test(lower);
  const isSimple = /\b(fix|small|quick|minor|typo|bug)\b/.test(lower) && lower.split(" ").length < 10;

  const scope: "file" | "feature" | "system" = isSystem ? "system" : isSimple ? "file" : "feature";
  const complexity: Complexity = isSystem ? "system" : isSimple ? "simple" : "feature";

  const matchCount = [action !== "unknown", entity !== "unknown", feature !== "general"].filter(Boolean).length;
  const confidence = Math.min(1, matchCount / 3 + 0.2);

  return { action, entity, feature, scope, complexity, confidence };
}
