FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Build the application
RUN pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 5070

ENV PORT=5070
ENV HOSTNAME="0.0.0.0"

CMD ["node", "dist/server/index.js"]
