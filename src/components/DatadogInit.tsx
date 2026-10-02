"use client";

import { useEffect } from "react";
import { datadogRum } from "@datadog/browser-rum";

export const PROD_HOSTNAMES = ["jwhiteaker22.com"];
export const DEV_HOSTNAMES = [
  "jwhiteaker.homelab.kubesoar.com",
  "homelab.kubesoar.com",
];

export function getDatadogEnvironment(currentHostname?: string): string | null {
  if (process.env.NEXT_PUBLIC_DATADOG_ENABLED === "false") {
    return null;
  }

  if (process.env.NEXT_PUBLIC_APP_ENV) {
    const appEnv = process.env.NEXT_PUBLIC_APP_ENV.toLowerCase();
    if (appEnv === "production" || appEnv === "prod") {
      return "production";
    }
    if (appEnv === "development" || appEnv === "dev") {
      return "development";
    }
    if (process.env.NEXT_PUBLIC_DATADOG_ENABLED !== "true") {
      return null;
    }
  }

  const hostname =
    currentHostname ??
    (typeof window !== "undefined" ? window.location.hostname : "");

  if (hostname) {
    const isProd = PROD_HOSTNAMES.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
    if (isProd) {
      return "production";
    }

    const isDev = DEV_HOSTNAMES.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
    if (isDev) {
      return "development";
    }
  }

  if (process.env.NEXT_PUBLIC_DATADOG_ENABLED === "true") {
    return process.env.NEXT_PUBLIC_APP_ENV || "development";
  }

  return null;
}

export function isProductionEnvironment(currentHostname?: string): boolean {
  return getDatadogEnvironment(currentHostname) === "production";
}

export function isDatadogEnabled(currentHostname?: string): boolean {
  return getDatadogEnvironment(currentHostname) !== null;
}

export default function DatadogInit({ hostname }: { hostname?: string } = {}) {
  useEffect(() => {
    const env = getDatadogEnvironment(hostname);
    if (!env) {
      return;
    }

    if (!datadogRum.getInitConfiguration()) {
      datadogRum.init({
        applicationId: "598f7204-f0eb-4d7c-b368-f4667519c778",
        clientToken: "pub65b5dd43ebefdb14d6de68b1d72d6869",
        site: "us5.datadoghq.com",
        service: "personal-website",
        env,
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
