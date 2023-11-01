FROM node:18-slim AS base

RUN apt-get update -y && apt-get install -y openssl ca-certificates && apt-get clean

FROM base AS builder
WORKDIR /app

RUN apt-get update -y && apt-get install -y bash && apt-get clean

# Install corepack pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

COPY turbo.json ./
COPY .npmrc ./
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY app/package.json ./app/
COPY packages/api/package.json ./packages/api/

RUN --mount=type=cache,target=/pnpm/store pnpm install --frozen-lockfile --filter @pedaki/community

COPY app ./app
COPY packages/api ./packages/api

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
ENV SKIP_ENV_VALIDATION 1

RUN pnpm build --filter @pedaki/community

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/app/public ./public

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
ENV SKIP_SERVER_ENV_CHECK=true

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/app/.next/standalone/app ./
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/static ./.next/static
COPY --from=builder /app/app/.next/standalone/node_modules ./node_modules

COPY app/entrypoint.sh .
COPY app/.env.production .
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

USER nextjs

ENV PORT=80
EXPOSE $PORT

CMD ["node", "server.js"]
