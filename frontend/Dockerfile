# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# 1. Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci
# Sharp is great for Next/Image optimization on Linux
RUN npm install --os=linux --cpu=x64 sharp

# 2. Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- DYNAMIC CHANGE ---
# We REMOVED the ARG and ENV for NEXT_PUBLIC_API_URL here.
# This prevents the URL from being hardcoded into the .next folder during build.
# ----------------------

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# 3. Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set up the standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# The server.js will now look for environment variables 
# at RUNTIME thanks to the next-runtime-env library.
CMD ["node", "server.js"]