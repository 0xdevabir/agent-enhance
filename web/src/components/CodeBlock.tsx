"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
}

export default function CodeBlock({ code, language = "bash", filename, showCopy = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block overflow-hidden">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)]">
          <span className="text-xs text-[var(--muted-foreground)] font-mono">{filename}</span>
          {showCopy && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-white transition-colors"
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      )}
      <div className="relative">
        {!filename && showCopy && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 z-10 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-white transition-colors bg-[var(--border)]/40 px-2 py-1 rounded-md"
          >
            {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
        <pre className="px-5 py-4 overflow-x-auto text-sm leading-7">
          <code className={`language-${language} text-[var(--foreground)]`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
