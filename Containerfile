FROM registry.access.redhat.com/hi/nodejs:26.11 AS runner
WORKDIR /opt/app-root/src

ARG DD_GIT_REPOSITORY_URL="https://github.com/josephaw1022/personalwebsite"
ARG DD_GIT_COMMIT_SHA=""

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DD_LOGS_INJECTION=true
ENV DD_RUNTIME_METRICS_ENABLED=true
ENV DD_GIT_REPOSITORY_URL=${DD_GIT_REPOSITORY_URL}
ENV DD_GIT_COMMIT_SHA=${DD_GIT_COMMIT_SHA}

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

USER 1001

EXPOSE 3000

CMD ["node", "--require", "dd-trace/init", "server.js"]
