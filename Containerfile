FROM node:26-alpine AS runner
WORKDIR /opt/app-root/src

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

USER 1001

EXPOSE 3000

CMD ["node", "server.js"]
