"use client";

import React, { useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";

interface MermaidProps {
  chart: string;
  className?: string;
}

export default function Mermaid({ chart, className = "" }: MermaidProps) {
  const uniqueId = useId().replace(/:/g, "_");
  const { resolvedTheme } = useTheme();
  const [svgContent, setSvgContent] = useState<string>("");
  const [isRendered, setIsRendered] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // Skip dynamic rendering in Node/Jest test environment
    if (typeof window === "undefined" || process.env.NODE_ENV === "test") {
      return;
    }

    const renderChart = async () => {
      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;
        const isDark = resolvedTheme === "dark";

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "neutral",
          securityLevel: "loose",
          fontFamily: "ui-monospace, monospace",
          themeVariables: isDark
            ? {
                primaryColor: "#064e3b",
                primaryTextColor: "#ecfdf5",
                primaryBorderColor: "#059669",
                lineColor: "#10b981",
                secondaryColor: "#18181b",
                tertiaryColor: "#27272a",
                background: "#09090b",
                mainBkg: "#18181b",
                nodeBorder: "#059669",
                clusterBkg: "#18181b",
                clusterBorder: "#27272a",
                textColor: "#e4e4e7",
                edgeLabelBackground: "#18181b",
              }
            : {
                primaryColor: "#d1fae5",
                primaryTextColor: "#064e3b",
                primaryBorderColor: "#10b981",
                lineColor: "#059669",
                secondaryColor: "#f4f4f5",
                tertiaryColor: "#e4e4e7",
                background: "#ffffff",
                mainBkg: "#f4f4f5",
                nodeBorder: "#10b981",
                clusterBkg: "#fafafa",
                clusterBorder: "#e4e4e7",
                textColor: "#18181b",
                edgeLabelBackground: "#ffffff",
              },
        });

        const id = `mermaid_${uniqueId}_${Math.floor(Math.random() * 10000)}`;
        const { svg } = await mermaid.render(id, chart);
        if (isMounted) {
          setSvgContent(svg);
          setIsRendered(true);
        }
      } catch (error) {
        console.error("Failed to render mermaid chart:", error);
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, resolvedTheme, uniqueId]);

  return (
    <div
      className={`overflow-x-auto p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex justify-center items-center ${className}`}
    >
      {isRendered ? (
        <div
          className="w-full flex justify-center [&_svg]:max-w-full [&_svg]:h-auto font-mono"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <pre className="text-xs font-mono text-zinc-600 dark:text-zinc-400 whitespace-pre overflow-x-auto p-4">
          {chart}
        </pre>
      )}
    </div>
  );
}
