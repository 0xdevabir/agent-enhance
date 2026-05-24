import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enhance — AI Prompt Middleware for Developers",
  description:
    "Enhance rewrites your vague prompts into structured, project-aware AI instructions before sending them to Claude Code, OpenCode, or Codex CLI.",
  keywords: ["AI", "prompt engineering", "Claude Code", "developer tools", "coding agent"],
  openGraph: {
    title: "Enhance — AI Prompt Middleware",
    description: "Upgrade your AI coding prompts automatically. One command installs /enhance into your AI coding tool.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen w-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
