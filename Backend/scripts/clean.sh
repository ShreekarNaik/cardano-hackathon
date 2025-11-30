#!/bin/bash

#############################################
# DecentralAI Analytics - Clean Script
# Cleans build artifacts and temporary files
#############################################

echo "🧹 DecentralAI Analytics - Clean Script"
echo "======================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Parse arguments
CLEAN_ALL=false
CLEAN_DEPS=false
CLEAN_DOCKER=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --all)
            CLEAN_ALL=true
            shift
            ;;
        --deps)
            CLEAN_DEPS=true
            shift
            ;;
        --docker)
            CLEAN_DOCKER=true
            shift
            ;;
        --help)
            echo "Usage: ./scripts/clean.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --all       Clean everything (build artifacts, dependencies, Docker)"
            echo "  --deps      Also remove node_modules and Python venv"
            echo "  --docker    Also remove Docker volumes and images"
            echo "  --help      Show this help message"
            echo ""
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

if [ "$CLEAN_ALL" = true ]; then
    CLEAN_DEPS=true
    CLEAN_DOCKER=true
fi

# Stop services first
echo "🛑 Stopping services..."
./scripts/stop.sh > /dev/null 2>&1 || true
print_status "Services stopped"

# Clean build artifacts
echo ""
echo "🗑️  Cleaning build artifacts..."

# TypeScript build outputs
find packages -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
find packages -name "build" -type d -exec rm -rf {} + 2>/dev/null || true
find packages -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true
print_status "TypeScript build artifacts removed"

# Python cache
find packages/agent-company -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find packages/agent-company -name "*.pyc" -type f -delete 2>/dev/null || true
find packages/agent-company -name "*.pyo" -type f -delete 2>/dev/null || true
find packages/agent-company -name ".pytest_cache" -type d -exec rm -rf {} + 2>/dev/null || true
print_status "Python cache removed"

# Logs
if [ -d "logs" ]; then
    rm -rf logs/*
    print_status "Log files removed"
fi

# Test coverage
find . -name "coverage" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".nyc_output" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".coverage" -type f -delete 2>/dev/null || true
print_status "Test coverage files removed"

# Clean dependencies if requested
if [ "$CLEAN_DEPS" = true ]; then
    echo ""
    echo "📦 Cleaning dependencies..."
    
    # Node modules
    rm -rf node_modules
    find packages -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
    print_status "Node modules removed"
    
    # Python virtual environment
    if [ -d "packages/agent-company/venv" ]; then
        rm -rf packages/agent-company/venv
        print_status "Python virtual environment removed"
    fi
    
    # Package lock files
    find . -name "package-lock.json" -type f -delete 2>/dev/null || true
    print_status "Lock files removed"
fi

# Clean Docker if requested
if [ "$CLEAN_DOCKER" = true ]; then
    echo ""
    echo "🐳 Cleaning Docker resources..."
    
    if command -v docker &> /dev/null; then
        # Remove containers
        docker compose down -v 2>/dev/null || true
        print_status "Docker containers removed"
        
        # Remove volumes
        docker volume prune -f 2>/dev/null || true
        print_status "Docker volumes cleaned"
        
        # Remove images (optional)
        read -p "Remove Docker images? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker images | grep "decentralai" | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
            print_status "Docker images removed"
        fi
        
        # Clean data directories
        if [ -d "data" ]; then
            rm -rf data/*
            mkdir -p data/postgres data/timescaledb data/hydra data/ogmios
            print_status "Data directories cleaned"
        fi
    else
        print_warning "Docker not found, skipping Docker cleanup"
    fi
fi

# Display summary
echo ""
echo "================================================"
echo "✅ Cleanup completed!"
echo "================================================"
echo ""
echo "🧹 Cleaned:"
echo "  • Build artifacts"
echo "  • Cache files"
echo "  • Log files"
echo "  • Test coverage"

if [ "$CLEAN_DEPS" = true ]; then
    echo "  • Dependencies (node_modules, venv)"
fi

if [ "$CLEAN_DOCKER" = true ]; then
    echo "  • Docker containers and volumes"
fi

echo ""
echo "🔄 To rebuild:"
echo "  1. Run: ./scripts/setup.sh"
echo "  2. Then: ./scripts/run-dev.sh or ./scripts/run-docker.sh"
echo ""
