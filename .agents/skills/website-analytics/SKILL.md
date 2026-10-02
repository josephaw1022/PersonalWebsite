---
name: website-analytics
description: Use this skill to understand how website analytics are collected for the PersonalWebsite project via Datadog.
---

## Website Analytics

This repository tracks website analytics using **Datadog RUM (Real User Monitoring)**.

### Implementation

The Datadog RUM browser agent is initialized via the `<DatadogInit />` client component in `src/components/DatadogInit.tsx` (rendered in `src/app/layout.tsx`).

It is configured to run in:
- **Production** (`jwhiteaker22.com`, `env: "production"`)
- **Development** (`jwhiteaker.homelab.kubesoar.com`, `env: "development"`)

It tracks:

- Session sample rate: 100%
- Session replay sample rate: 20%
- User interactions
- Long tasks & resources

The client token and application ID are configured specifically for the `personal-website` service in the `us5.datadoghq.com` Datadog environment.
