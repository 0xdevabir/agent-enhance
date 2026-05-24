import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Zap size={14} className="text-indigo-400" />
          <span>enhance</span>
          <span>·</span>
          <span>MIT License</span>
          <span>·</span>
          <span>by 0xdevabir</span>
        </div>
        <div className="flex items-center gap-5 text-sm text-[var(--muted-foreground)]">
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <Link
            href="https://github.com/0xdevabir/agent-enhance"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="https://www.npmjs.com/package/@0xdevabir/enhance"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            npm
          </Link>
        </div>
      </div>
    </footer>
  );
}
