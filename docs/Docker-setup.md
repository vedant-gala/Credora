# Docker Setup Guide for Credora

This document provides comprehensive information about the Docker setup for the Credora project, including the three Docker Compose files, Docker commands, and usage guides for development and production environments.

## Table of Contents

- [Overview](#overview)
- [Docker Compose Files](#docker-compose-files)
- [Docker Commands Reference](#docker-commands-reference)
- [Development Environment](#development-environment)
- [Production Environment](#production-environment)
- [Troubleshooting](#troubleshooting)

## Overview

Credora uses Docker and Docker Compose to manage multiple services in a containerized environment. The setup includes:

- **Backend API** - Node.js/TypeScript backend service
- **Web Dashboard** - React/TypeScript frontend application
- **Shared** - Common utilities and types shared between services

## Docker Compose Files

The project uses three Docker Compose files to manage different environments:

### 1. `docker-compose.yml` (Base Configuration)

This is the main configuration file that defines the core services and their basic setup:

```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
  
  web-dashboard:
    build:
      context: ./web-dashboard
      dockerfile: Dockerfile
```

**Purpose**: Defines the basic service structure without environment-specific configurations.

### 2. `docker-compose.override.yml` (Development Override)

This file automatically overrides the base configuration for development purposes:

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
      target: development
    command: npm run dev:backend
    ports:
      - "3000:3000"
  
  web-dashboard:
    build:
      context: .
      dockerfile: web-dashboard/Dockerfile
      target: development
    command: npm run dev:web
    ports:
      - "3001:3001"
```

**Purpose**: 
- Enables hot reloading for development
- Exposes ports for local development
- Uses development-stage Docker images
- Runs development commands with file watching

**Note**: This file is automatically loaded when running `docker-compose up` in development.

### 3. `docker-compose.prod.yml` (Production Configuration)

This file contains production-specific configurations:

```yaml
services:
  web-dashboard:
    depends_on:
      backend:
        condition: service_healthy
```

**Purpose**: 
- Defines production-specific service dependencies
- Ensures proper startup order
- Can include production environment variables, volumes, and networking

## Individual Dockerfiles

Each service has its own Dockerfile that defines how the container image is built:

### Backend Dockerfile (`backend/Dockerfile`)

The backend Dockerfile uses a multi-stage build approach:

- **Base Stage**: Common Node.js 18 Alpine setup with shared dependencies
- **Development Stage**: Full development environment with TypeScript, nodemon, and hot reloading
- **Builder Stage**: Compiles TypeScript to JavaScript for production
- **Production Stage**: Minimal runtime with only production dependencies and compiled code
- **Health Check**: HTTP health check endpoint for production monitoring

**Key Features**:
- Multi-stage builds for optimized production images
- Development mode with full tooling
- Production mode with minimal footprint
- Built-in health checks

### Web Dashboard Dockerfile (`web-dashboard/Dockerfile`)

The web dashboard Dockerfile provides:

- **Base Stage**: Node.js 18 Alpine with all dependencies
- **Development Stage**: Development server with hot reloading and health checks

**Key Features**:
- Development server with file watching
- Health check monitoring
- Optimized for frontend development workflow

## Docker Commands Reference

### Basic Commands

```bash
# Build and start all services
docker-compose up

# Build and start services in detached mode
docker-compose up -d

# Build and start with production configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View running services
docker-compose ps

# View service logs
docker-compose logs [service-name]

# Follow logs in real-time
docker-compose logs -f [service-name]
```

### Build Commands

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build [service-name]

# Build without cache
docker-compose build --no-cache

# Build and start
docker-compose up --build
```

### Service Management

```bash
# Start specific service
docker-compose up [service-name]

# Restart specific service
docker-compose restart [service-name]

# Stop specific service
docker-compose stop [service-name]

# Execute command in running container
docker-compose exec [service-name] [command]

# Access shell in container
docker-compose exec [service-name] sh
```

### Cleanup Commands

```bash
# Remove stopped containers
docker-compose rm

# Remove all containers, networks, and images
docker-compose down --rmi all --volumes --remove-orphans

# Clean up unused Docker resources
docker system prune -a
```

## Development Environment

### Prerequisites

- Docker Desktop installed and running
- Node.js 18+ and npm 9+ (for local development)
- Git

### Quick Start

1. **Clone and setup the project**:
   ```bash
   git clone <repository-url>
   cd Credora
   npm install
   ```

2. **Start development environment**:
   ```bash
   # Start all services with development configuration
   docker-compose up
   
   # Or start in detached mode
   docker-compose up -d
   ```

3. **Access services**:
   - Backend API: http://localhost:3000
   - Web Dashboard: http://localhost:3001

### Development Workflow

1. **Start services**: `docker-compose up`
2. **Make code changes** - Hot reloading will automatically restart services
3. **View logs**: `docker-compose logs -f [service-name]`
4. **Stop services**: `docker-compose down`

### Available Scripts

```bash
# Development commands
npm run dev:backend    # Start backend in development mode
npm run dev:web        # Start web dashboard in development mode

# Build commands
npm run build:backend  # Build backend
npm run build:web      # Build web dashboard
npm run build:all      # Build all services

# Testing
npm run test:all       # Run tests for all services
```

## Production Environment

### Prerequisites

- Docker and Docker Compose installed on production server
- Proper environment variables configured
- SSL certificates (if using HTTPS)
- Reverse proxy (nginx) configured

### Deployment

1. **Build production images**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
   ```

2. **Start production services**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Verify deployment**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs
   ```

### Production Configuration

- Services run in production mode (no hot reloading)
- Optimized Docker images (production stage)
- Health checks enabled
- Proper logging configuration
- Environment-specific variables

### Scaling

```bash
# Scale specific service
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale [service-name]=3

# Update running services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps [service-name]
```

## Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   
   # Stop conflicting services
   docker-compose down
   ```

2. **Build failures**:
   ```bash
   # Clean build
   docker-compose build --no-cache
   
   # Check Dockerfile syntax
   docker-compose config
   ```

3. **Service won't start**:
   ```bash
   # Check logs
   docker-compose logs [service-name]
   
   # Check service status
   docker-compose ps
   ```

4. **Permission issues**:
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Debugging

```bash
# Access container shell
docker-compose exec [service-name] sh

# Inspect container
docker-compose exec [service-name] env

# Check container resources
docker stats
```

### Logs and Monitoring

```bash
# View all logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f backend

# View logs with timestamps
docker-compose logs -t

# Export logs to file
docker-compose logs > logs.txt
```

## Best Practices

1. **Always use specific file combinations**:
   - Development: `docker-compose up` (automatically includes override)
   - Production: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up`

2. **Use environment variables** for configuration
3. **Implement health checks** for production services
4. **Regular cleanup** of unused Docker resources
5. **Monitor resource usage** in production
6. **Use .dockerignore** files to optimize builds
7. **Tag images** with version numbers for production

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage Docker Builds](https://docs.docker.com/develop/dev-best-practices/multistage-build/)
