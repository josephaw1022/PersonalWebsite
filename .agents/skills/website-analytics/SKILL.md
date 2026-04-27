---
name: website-analytics
description: Use this skill to understand how website analytics are collected for the PersonalWebsite project via Datadog.
---

## Website Analytics

This repository tracks website analytics using **Datadog RUM (Real User Monitoring)**.

### Implementation

The Datadog RUM browser agent is injected directly into the HTML. You can find the script in the `<head>` section of `site/pages/index.html`.

It tracks:
- Session sample rate: 100%
- Session replay sample rate: 20%
- User interactions
- bfcache views

The client token and application ID are configured specifically for the `personal-website` service in the `us5.datadoghq.com` Datadog environment.
