"use client";
import { useEffect, useState, useRef } from "react";

interface TypingCodeProps {
  lines: string[];
  speed?: number;
  className?: string;
  startDelay?: number;
}

export default function TypingCode({ lines, speed = 18, className, startDelay = 0 }: TypingCodeProps) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (currentLine >= lines.length) return;

    const line = lines[currentLine];

    if (currentChar < line.length) {
      const t = setTimeout(() => {
        setDisplayed((prev) => {
          const next = [...prev];
          next[currentLine] = (next[currentLine] ?? "") + line[currentChar];
          return next;
        });
        setCurrentChar((c) => c + 1);
      }, speed + Math.random() * 10);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 60);
      return () => clearTimeout(t);
    }
  }, [started, currentLine, currentChar, lines, speed]);

  const done = currentLine >= lines.length;

  return (
    <pre className={className}>
      {lines.map((_, i) => (
        <div key={i} className="min-h-[1.75em]">
          <span>{displayed[i] ?? ""}</span>
          {!done && i === currentLine && (
            <span className="cursor text-indigo-400 font-light">|</span>
          )}
        </div>
      ))}
    </pre>
  );
}
