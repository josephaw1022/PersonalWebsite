"use client";

import { useEffect } from "react";
import { datadogRum } from "@datadog/browser-rum";

export default function DatadogInit() {
  useEffect(() => {
    if (typeof window !== "undefined") {
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
  }, []);

  return null;
}
