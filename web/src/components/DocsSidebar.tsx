"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const SIDEBAR = [
  {
    group: "Getting Started",
    links: [
      { href: "/docs", label: "Overview" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/usage", label: "Usage" },
    ],
  },
  {
    group: "Reference",
    links: [
      { href: "/docs/configuration", label: "Configuration" },
      { href: "/docs/providers", label: "Providers" },
    ],
  },
];

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-52 flex-shrink-0">
      <div className="sticky top-20">
        {SIDEBAR.map((group) => (
          <div key={group.group} className="mb-6">
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-2 px-2">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.links.map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-colors ${
                        active
                          ? "text-white bg-white/5"
                          : "text-[var(--muted-foreground)] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <ChevronRight
                        size={12}
                        className={active ? "text-indigo-400 opacity-100" : "opacity-40"}
                      />
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
