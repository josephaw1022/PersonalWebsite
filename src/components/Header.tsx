"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Overview", href: "/" },
    { name: "About", href: "/about" },
    { name: "Skills", href: "/skills" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 border-b border-zinc-200 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-mono font-semibold tracking-tight text-zinc-900 group-hover:text-emerald-600 transition-colors">
            joseph.whiteaker
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/josephaw1022/PersonalWebsite"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-mono text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <span>[src]</span>
          </a>
        </div>
      </div>
    </header>
  );
}
