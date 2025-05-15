# Base stage - Build dependencies
FROM node:lts AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build stage - Build the application
FROM node:lts AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV ESLINT_NO_DEV_ERRORS=true
ENV NODE_ENV=production

# Construir la aplicación con output standalone
RUN npm run build

# Production stage - Run the application
FROM node:lts-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Add a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar el directorio standalone y otros archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set the correct permission for the application
RUN chown -R nextjs:nodejs /app

# Switch to the non-root user
USER nextjs

# Start the application
CMD ["node", "server.js"]