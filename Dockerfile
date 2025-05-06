FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy env file first
COPY .env .env

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Log environment variables (excluding sensitive values)
RUN echo "Environment variables in .env:" && \
    grep -v "^#" .env | grep -v "SECRET" | grep -v "TOKEN" | grep -v "KEY" | grep -v "PASSWORD" | while read line; do \
    echo "$line" | sed 's/=.*/=***/'; \
    done

# Clean .next cache and build the application
RUN rm -rf .next && pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.env ./.env

USER nextjs

EXPOSE 5070

ENV PORT=5070
ENV HOSTNAME="0.0.0.0"

CMD ["node", "dist/server/index.js"]
