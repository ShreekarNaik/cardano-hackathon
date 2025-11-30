#!/bin/bash

#############################################
# DecentralAI Analytics - Stop Script
# Stops all running services
#############################################

echo "🛑 DecentralAI Analytics - Stop Script"
echo "======================================"
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

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Stop Docker Compose services
if [ -f docker-compose.yml ]; then
    echo "🐳 Stopping Docker Compose services..."
    
    if docker compose version &> /dev/null; then
        docker compose down
    else
        print_warning "Docker Compose not found, skipping..."
    fi
    
    print_status "Docker services stopped"
fi

# Kill Node.js processes
echo ""
echo "🔴 Stopping Node.js processes..."
pkill -f "node.*backend-api" 2>/dev/null && print_status "Backend API stopped" || print_warning "Backend API not running"
pkill -f "pnpm run dev" 2>/dev/null && print_status "Dev processes stopped" || true

# Kill Python processes
echo ""
echo "🐍 Stopping Python processes..."
pkill -f "uvicorn main:app" 2>/dev/null && print_status "Agent Company stopped" || print_warning "Agent Company not running"
pkill -f "python.*agent" 2>/dev/null && print_status "Python agents stopped" || true

# Clean up processes listening on specific ports
echo ""
echo "🔌 Cleaning up port processes..."

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        kill -9 $pid 2>/dev/null
        print_status "Process on port $port stopped"
    fi
}

kill_port 3000  # Backend API
kill_port 8000  # Agent Company
kill_port 5432  # PostgreSQL
kill_port 5433  # TimescaleDB
kill_port 1337  # Ogmios
kill_port 4001  # Hydra Node

# Display summary
echo ""
echo "================================================"
echo "✅ All services stopped"
echo "================================================"
echo ""
echo "📊 Status:"
echo "  • Docker containers:  Stopped"
echo "  • Backend API:        Stopped"
echo "  • Agent Company:      Stopped"
echo "  • Database services:  Stopped"
echo ""
echo "🔄 To restart services:"
echo "  • Development:  ./scripts/run-dev.sh"
echo "  • Docker:       ./scripts/run-docker.sh"
echo ""
