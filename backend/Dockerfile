# ------------------------------------------------------------------------------------------------  
# This Dockerfile is designed to create a production-ready container image for the Credora backend.
# It uses a lightweight Alpine Linux base image and Node.js runtime.
# The build process includes :
# - Installing all dependencies (including devDependencies) in build stage
# - Building the application using npm and TypeScript
# - Creating a production stage with only production dependencies
# - Setting the default command to start the application

# This file contains instructions for building a Docker image.
# It's essentially a recipe that tells Docker how to create a containerized environment for the Backend service of Credora
# It automates the process of creating a consistent, reproducible container image that includes : 
    # App code
    # All necessary dependencies
    # Runtime environment
    # Configuration settings

# Multi-stage build approach:
# - Build stage: Installs all dependencies and compiles TypeScript to JavaScript
# - Production stage: Only contains production dependencies and compiled code
# - Result: Smaller, more secure production image

# ------------------------------------------------------------------------------------------------  

# Build stage - installs all dependencies and compiles the application
FROM node:18-alpine AS builder

# WORKDIR instruction : 
# - Sets the working directory inside the container
# - All subsequent commands will run in this directory
# - Helps keep the container organized and reduces the need for absolute paths
WORKDIR /app

# COPY instruction : 
# - Copies package files from the host machine into the container
# - First argument is the source path (relative to the current directory)
# - Second argument is the destination path (inside the container)
COPY package*.json ./

# RUN instruction : 
# - Installs ALL dependencies including devDependencies needed for building
# - This includes TypeScript, @types/* packages, and build tools
RUN npm ci

# Copy the rest of the app code
COPY . .

# Build the app - compiles TypeScript to JavaScript
# This step requires TypeScript and other devDependencies to be available
RUN npm run build

# Production stage - only contains production dependencies and compiled code
FROM node:18-alpine

# WORKDIR instruction : 
# - Sets the working directory inside the container
WORKDIR /app

# COPY instruction : 
# - Copies package files for production dependency installation
COPY package*.json ./

# RUN instruction : 
# - Installs ONLY production dependencies
# - Excludes TypeScript, @types/*, and other development tools
# - Results in a smaller, more secure production image
RUN npm ci --omit=dev

# Copy the compiled application from the build stage
# This contains only the JavaScript output, no TypeScript source or devDependencies
COPY --from=builder /app/dist ./dist

# CMD instruction : 
# - Specifies the default command to run when the container starts
# - This is the main process that will run in the container
# - Can be overridden when running the container
CMD ["npm", "start"]