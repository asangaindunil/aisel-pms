# Use official Node.js LTS Alpine as base image for build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files and build
COPY . .
RUN npm run build

# ----------------------------------------------
# Production image with minimal footprint
# ----------------------------------------------
FROM node:20-alpine AS production

# Create a non-root user and group and set permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files, public assets, config, and node_modules
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js next.config.js
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port 3000
EXPOSE 3000

# Add a healthcheck to verify the app is running
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
# Start Next.js app
CMD ["npm", "run", "start"]
