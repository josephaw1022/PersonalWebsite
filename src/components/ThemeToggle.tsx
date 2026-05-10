"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder to avoid layout shift
  }

  const themes = [
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Moon, label: "Dark" },
    { name: "system", icon: Laptop, label: "System" },
  ];

  return (
    <div className="flex items-center gap-1 bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-full border border-zinc-300 dark:border-zinc-700">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.name;
        return (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              isActive
                ? "bg-white dark:bg-zinc-600 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-zinc-500 hover:text-foreground dark:hover:text-white"
            }`}
            title={`Switch to ${t.label} mode`}
            aria-label={`Switch to ${t.label} mode`}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
