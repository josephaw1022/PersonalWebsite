FROM registry.access.redhat.com/ubi9/nodejs-22-minimal:latest AS runner
WORKDIR /opt/app-root/src

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --chown=1001:0 .next/standalone ./
COPY --chown=1001:0 .next/static ./.next/static
COPY --chown=1001:0 public ./public

USER 1001

EXPOSE 3000

CMD ["node", "server.js"]
