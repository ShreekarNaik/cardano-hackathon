# DecentralAI Analytics - Scripts Guide

Complete guide to all available shell scripts for setup, development, deployment, and maintenance.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Setup Scripts](#setup-scripts)
3. [Development Scripts](#development-scripts)
4. [Deployment Scripts](#deployment-scripts)
5. [Maintenance Scripts](#maintenance-scripts)
6. [Testing Scripts](#testing-scripts)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# 1. Initial setup
./scripts/setup.sh

# 2. Configure environment
nano .env  # Add your API keys

# 3. Run development mode
./scripts/run-dev.sh

# OR run with Docker
./scripts/run-docker.sh
```

---

## Setup Scripts

### 📦 `setup.sh` - Initial Project Setup

**Purpose:** Installs all dependencies and prepares the project for first use.

**Usage:**
```bash
./scripts/setup.sh
```

**What it does:**
- ✅ Checks prerequisites (Node.js 18+, Python 3.9+, Docker)
- ✅ Creates `.env` file from template
- ✅ Installs root dependencies
- ✅ Sets up Python virtual environment
- ✅ Installs all package dependencies
- ✅ Validates Cardano contracts (if Aiken installed)
- ✅ Creates necessary directories
- ✅ Makes all scripts executable
- ✅ Builds TypeScript packages

**Prerequisites:**
- Node.js 18 or higher
- Python 3.9 or higher
- Docker (optional, for full deployment)
- Aiken (optional, for Cardano contracts)

**Example Output:**
```
🚀 DecentralAI Analytics - Setup Script
========================================

📋 Checking prerequisites...
✓ Node.js v20.10.0 detected
✓ Python 3.11.5 detected
✓ Docker 24.0.6 detected

📦 Installing dependencies...
✓ Installing root package dependencies...
✓ Setting up AI Agent Company (Python)...
✓ Installing TypeScript package dependencies...

================================================
✅ Setup completed successfully!
================================================
```

---

## Development Scripts

### 🔧 `run-dev.sh` - Development Mode

**Purpose:** Runs all services locally in development mode with hot-reload.

**Usage:**
```bash
./scripts/run-dev.sh
```

**What it does:**
- ✅ Loads environment variables from `.env`
- ✅ Validates OpenAI API key
- ✅ Starts Backend API on port 3000
- ✅ Starts Agent Company on port 8000
- ✅ Performs health checks
- ✅ Displays service information

**Services Started:**
- **Backend API:** `http://localhost:3000`
- **Agent Company:** `http://localhost:8000`

**Logs:**
```bash
# View logs in real-time
tail -f logs/backend-api.log
tail -f logs/agent-company.log
```

**Stop:**
Press `Ctrl+C` or run `./scripts/stop.sh`

---

### 🐳 `run-docker.sh` - Docker Mode

**Purpose:** Runs all services using Docker Compose.

**Usage:**
```bash
./scripts/run-docker.sh
```

**What it does:**
- ✅ Checks Docker and Docker Compose installation
- ✅ Creates data directories
- ✅ Builds Docker images
- ✅ Starts all containers
- ✅ Performs health checks
- ✅ Shows running containers

**Services Started:**
- Backend API: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- TimescaleDB: `localhost:5433`
- Ogmios: `localhost:1337`
- Hydra Node: `localhost:4001`

**Docker Commands:**
```bash
# View logs
docker compose logs -f [service]

# Restart service
docker compose restart [service]

# View status
docker compose ps

# Stop all
docker compose down
```

**Stop:**
Press `Ctrl+C` or run `./scripts/stop.sh`

---

## Deployment Scripts

### 🚀 `deploy-local.sh` - Local Deployment

**Purpose:** Deploys the platform locally with Docker for testing production-like setup.

**Usage:**
```bash
./scripts/deploy-local.sh
```

**What it does:**
- ✅ Runs pre-deployment checks
- ✅ Executes all tests
- ✅ Builds Docker images
- ✅ Starts services with Docker Compose
- ✅ Waits for services to be ready
- ✅ Runs smoke tests
- ✅ Creates deployment log

**Post-Deployment:**
```bash
# Check service health
curl http://localhost:3000/health

# View metrics
curl http://localhost:3000/metrics

# View logs
docker-compose logs -f
```

---

### 🌐 `deploy-production.sh` - Production Deployment

**Purpose:** Deploys to production environment (Kubernetes).

**Usage:**
```bash
./scripts/deploy-production.sh
```

**What it does:**
- ⚠️ Safety confirmation prompt
- ✅ Pre-deployment checks (Git status, tests)
- ✅ Builds production Docker images
- ✅ Pushes to Docker registry
- ✅ Deploys to Kubernetes cluster
- ✅ Waits for rollout completion
- ✅ Runs smoke tests
- ✅ Creates deployment record

**Environment Variables:**
```bash
export DEPLOY_ENV="production"
export DOCKER_REGISTRY="registry.decentralai.io"
export IMAGE_TAG="v1.0.0"
```

**Prerequisites:**
- Docker installed
- kubectl configured
- Git repository clean
- All tests passing
- Kubernetes cluster access

**Rollback:**
```bash
kubectl rollout undo deployment/backend-api -n decentralai
kubectl rollout undo deployment/agent-company -n decentralai
```

---

## Maintenance Scripts

### 🛑 `stop.sh` - Stop All Services

**Purpose:** Stops all running services gracefully.

**Usage:**
```bash
./scripts/stop.sh
```

**What it does:**
- ✅ Stops Docker Compose services
- ✅ Kills Node.js processes
- ✅ Kills Python processes
- ✅ Cleans up port processes (3000, 8000, 5432, etc.)

**Ports Cleaned:**
- 3000 - Backend API
- 8000 - Agent Company
- 5432 - PostgreSQL
- 5433 - TimescaleDB
- 1337 - Ogmios
- 4001 - Hydra Node

---

### 🧹 `clean.sh` - Clean Build Artifacts

**Purpose:** Removes build artifacts, cache, and temporary files.

**Usage:**
```bash
# Basic clean (build artifacts and cache)
./scripts/clean.sh

# Clean with dependencies
./scripts/clean.sh --deps

# Clean with Docker volumes
./scripts/clean.sh --docker

# Clean everything
./scripts/clean.sh --all
```

**Options:**
- `--all` - Clean everything (artifacts, deps, Docker)
- `--deps` - Also remove node_modules and Python venv
- `--docker` - Also remove Docker volumes and images
- `--help` - Show help message

**What it cleans:**
- TypeScript build outputs (`dist`, `build`)
- Python cache (`__pycache__`, `*.pyc`)
- Log files
- Test coverage files
- Node modules (with `--deps`)
- Python venv (with `--deps`)
- Docker containers/volumes (with `--docker`)

---

## Testing Scripts

### 🧪 `test-all.sh` - Run All Tests

**Purpose:** Executes comprehensive test suite across all packages.

**Usage:**
```bash
./scripts/test-all.sh
```

**What it tests:**
- ✅ Python tests (pytest)
- ✅ TypeScript tests (npm test)
- ✅ Aiken contracts (aiken check)

**Test Suites:**
1. **Python Tests:** `packages/agent-company/`
2. **TypeScript Tests:** All packages with test scripts
3. **Cardano Contracts:** `packages/cardano-contracts/`

**Exit Codes:**
- `0` - All tests passed
- `1` - Tests failed

---

## Script Reference Table

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `setup.sh` | Initial setup | First time, after clean |
| `run-dev.sh` | Development mode | Daily development |
| `run-docker.sh` | Docker mode | Testing with services |
| `deploy-local.sh` | Local deployment | Pre-production testing |
| `deploy-production.sh` | Production deployment | Production release |
| `stop.sh` | Stop services | End of work session |
| `clean.sh` | Clean artifacts | Fresh start, disk space |
| `test-all.sh` | Run tests | Before commits, CI/CD |

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `Address already in use`

**Solution:**
```bash
# Stop all services
./scripts/stop.sh

# Or kill specific port
lsof -ti:3000 | xargs kill -9
```

#### 2. Permission Denied

**Error:** `Permission denied`

**Solution:**
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

#### 3. Docker Not Running

**Error:** `Cannot connect to Docker daemon`

**Solution:**
```bash
# Start Docker
sudo systemctl start docker

# Or on macOS
open -a Docker
```

#### 4. Missing Environment Variables

**Error:** `OPENAI_API_KEY not set`

**Solution:**
```bash
# Edit .env file
nano .env

# Add your API key
OPENAI_API_KEY=sk-...
```

#### 5. Node Modules Missing

**Error:** `Cannot find module`

**Solution:**
```bash
# Reinstall dependencies
./scripts/clean.sh --deps
./scripts/setup.sh
```

#### 6. Python Virtual Environment Issues

**Error:** `No module named 'openai'`

**Solution:**
```bash
cd packages/agent-company
source venv/bin/activate
pip install -r requirements.txt
```

---

## Advanced Usage

### Custom Configuration

**Override environment:**
```bash
export NODE_ENV=staging
export PORT=8080
./scripts/run-dev.sh
```

**Use different Docker Compose file:**
```bash
docker-compose -f docker-compose.prod.yml up
```

### Continuous Integration

**GitHub Actions example:**
```yaml
- name: Setup
  run: ./scripts/setup.sh

- name: Test
  run: ./scripts/test-all.sh

- name: Deploy
  run: ./scripts/deploy-production.sh
  if: github.ref == 'refs/heads/main'
```

### Monitoring

**View all logs:**
```bash
# Development mode
tail -f logs/*.log

# Docker mode
docker-compose logs -f

# Kubernetes
kubectl logs -f deployment/backend-api -n decentralai
```

---

## Best Practices

1. **Always run setup first:** `./scripts/setup.sh`
2. **Check .env before running:** Ensure API keys are set
3. **Run tests before deployment:** `./scripts/test-all.sh`
4. **Use Docker for consistency:** `./scripts/run-docker.sh`
5. **Clean regularly:** `./scripts/clean.sh`
6. **Stop services when done:** `./scripts/stop.sh`
7. **Monitor logs:** Keep an eye on `logs/` directory
8. **Backup data:** Before running with `--docker` flag

---

## Quick Reference

```bash
# Setup and run (first time)
./scripts/setup.sh
./scripts/run-dev.sh

# Daily workflow
./scripts/stop.sh          # Stop previous session
./scripts/run-dev.sh       # Start development
# ... do your work ...
./scripts/test-all.sh      # Test before commit
./scripts/stop.sh          # Stop at end of day

# Deployment workflow
./scripts/test-all.sh           # Run tests
./scripts/deploy-local.sh       # Test locally
./scripts/deploy-production.sh # Deploy to prod

# Maintenance
./scripts/clean.sh              # Regular cleanup
./scripts/clean.sh --all        # Deep clean
./scripts/setup.sh              # Rebuild
```

---

## Support

For issues or questions:
1. Check this guide
2. Review logs in `logs/` directory
3. Check `docs/FINAL_IMPLEMENTATION_SUMMARY.md`
4. Review `docs/CODE_REVIEW_IMPROVEMENTS.md`

---

**Last Updated:** 30/11/2025  
**Version:** 1.0.0  
**Platform:** DecentralAI Analytics
