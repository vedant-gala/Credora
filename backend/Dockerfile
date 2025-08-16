# ------------------------------------------------------------------------------------------------  
# This Dockerfile is designed to create a production-ready container image for the Credora backend.
# It uses a lightweight Alpine Linux base image and Node.js runtime.
# The build process includes :
# - Installing production dependencies only
# - Copying the application code into the container
# - Building the application using npm
# - Setting the default command to start the application

# This file contains instructions for building a Docker image.
# It's essentially a recipe that tells Docker how to create a containerized environment for the Backend service of Credora
# It automates the process of creating a consistent, reproducible container image that includes : 
    # App code
    # All necessary dependencies
    # Runtime environment
    # Configuration settings

# Base image : 
# - node:18-alpine : 
#   - node : Node.js runtime
#   - 18 : Node.js version
#   - alpine : Lightweight Linux distribution
#   - This image is small and fast, ideal for production environments
# ------------------------------------------------------------------------------------------------  

# FROM instruction : 
# - Specifies the base image to use for the container
# - This is the starting point for the build process
FROM node:18-alpine

# WORKDIR instruction : 
# - Sets the working directory inside the container
# - All subsequent commands will run in this directory
# - Helps keep the container organized and reduces the need for absolute paths
WORKDIR /app

# COPY instruction : 
# - Copies files from the host machine into the container
# - First argument is the source path (relative to the current directory)
# - Second argument is the destination path (inside the container)
# - Can copy multiple files/directories at once
COPY package*.json ./

# RUN instruction : 
# - Executes a command inside the container
# - Used to install dependencies, build the app, etc.
# - Can be used multiple times to perform different tasks
# - The '--omit=dev' flag tells npm to skip installing devDependencies, ensuring only production dependencies are installed.
# - The '--only=production' flag is an older way to achieve the same effect, but '--omit=dev' is now preferred and more explicit.
#   Both switches result in a smaller, more secure image by excluding development-only packages.
RUN npm ci --omit=dev

# Copy the rest of the app code
COPY . .

# Build the app - TODO @vedant-gala
RUN npm run build

# CMD instruction : 
# - Specifies the default command to run when the container starts
# - This is the main process that will run in the container
# - Can be overridden when running the container - TODO @vedant-gala
CMD ["npm", "start"]