# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat python3 make g++ openssl

# Copy dependency manifests first for better layer caching
COPY backend/package.json backend/package-lock.json* ./

# Install all dependencies (including dev deps for build)
RUN npm install

# Copy TypeScript source and config
COPY backend/tsconfig.json backend/.env.example ./
COPY backend/src ./src
COPY backend/prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runtime

WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache openssl libc6-compat

# Copy built artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Add health check script
COPY docker/healthcheck.sh ./healthcheck.sh
RUN chmod +x ./healthcheck.sh

# Expose the API port
EXPOSE 3000

# Run the compiled application
CMD ["node", "dist/index.js"]
