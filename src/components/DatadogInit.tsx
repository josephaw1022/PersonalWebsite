"use client";

import { useEffect } from "react";
import { datadogRum } from "@datadog/browser-rum";

export const PROD_HOSTNAMES = ["jwhiteaker22.com"];

export function isProductionEnvironment(currentHostname?: string): boolean {
  if (typeof window === "undefined" && !currentHostname) {
    return false;
  }

  // Explicit override via environment variable if provided
  if (process.env.NEXT_PUBLIC_DATADOG_ENABLED === "false") {
    return false;
  }
  if (process.env.NEXT_PUBLIC_DATADOG_ENABLED === "true") {
    return true;
  }

  if (process.env.NEXT_PUBLIC_APP_ENV) {
    return process.env.NEXT_PUBLIC_APP_ENV === "production";
  }

  const hostname =
    currentHostname ??
    (typeof window !== "undefined" ? window.location.hostname : "");

  if (!hostname) {
    return false;
  }

  return PROD_HOSTNAMES.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );
}

export default function DatadogInit({ hostname }: { hostname?: string } = {}) {
  useEffect(() => {
    if (!isProductionEnvironment(hostname)) {
      return;
    }

    if (!datadogRum.getInitConfiguration()) {
      datadogRum.init({
        applicationId: "598f7204-f0eb-4d7c-b368-f4667519c778",
        clientToken: "pub65b5dd43ebefdb14d6de68b1d72d6869",
        site: "us5.datadoghq.com",
        service: "personal-website",
        env: "production",
        version: "1.0.0",
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: "mask-user-input",
      });
      datadogRum.startSessionReplayRecording();
    }
  }, [hostname]);

  return null;
}
