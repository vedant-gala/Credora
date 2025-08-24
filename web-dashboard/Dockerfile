# ------------------------------------------------------------------------------------------------  
# This Dockerfile is designed to create a production-ready container image for the Credora web dashboard.
# It uses a lightweight Alpine Linux base image and Node.js runtime.
# ------------------------------------------------------------------------------------------------  
FROM node:18-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# =============================================================================
# DEVELOPMENT STAGE - Development server with hot reloading
# =============================================================================
FROM base AS development

# Health check for development
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start development server
CMD ["npm", "run", "dev"]