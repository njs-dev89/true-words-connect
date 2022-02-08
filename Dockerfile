# FROM node:14-alpine AS dependencies
FROM timbru31/node-alpine-git:14 AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
# COPY package.json package-lock.json ./
RUN npm i
RUN npm i sharp
# RUN npm ci --only=production

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

RUN mkdir -p /app/.next/cache/images && chown nextjs:nodejs /app/.next/cache/images
VOLUME /app/.next/cache/images

COPY --from=builder /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs -R /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000

CMD ["next", "start"]