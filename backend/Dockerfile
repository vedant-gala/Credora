# ------------------------------------------------------------------------------------------------  
# This Dockerfile is designed to create a production-ready container image for the Credora backend.
# It uses a lightweight Alpine Linux base image and Node.js runtime.
# --------------------------------------------------------------------------------  

# =============================================================================
# BASE STAGE - Common dependencies and setup
# =============================================================================
FROM node:18-alpine AS base
WORKDIR /app
COPY package.json ./

# =============================================================================
# DEVELOPMENT STAGE - Full development environment
# =============================================================================
FROM base AS development
# This project is a monorepo, so we need to copy the package-lock.json from the root directory
COPY ../package-lock.json ./
# Install ALL dependencies including devDependencies (TypeScript, nodemon, etc.)
RUN npm ci
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]

# =============================================================================
# BUILD STAGE - Compile TypeScript for production
# =============================================================================
FROM base AS builder
# Install ALL dependencies including devDependencies needed for building
RUN npm ci
COPY . .
# Build the app - compiles TypeScript to JavaScript
RUN npm run build

# =============================================================================
# PRODUCTION STAGE - Minimal runtime environment
# =============================================================================
FROM node:18-alpine AS production
WORKDIR /app
# Copy package files for production dependency installation
COPY package*.json ./
# Install ONLY production dependencies (no TypeScript, nodemon, etc.)
RUN npm ci --omit=dev
# Copy the compiled application from the build stage
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["npm", "start"]

# =============================================================================
# HEALTHCHECK - Only for production
# =============================================================================
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"