#!/bin/bash

#############################################
# DecentralAI Analytics - Docker Run Script
# Runs all services with Docker Compose
#############################################

set -e

echo "🐳 DecentralAI Analytics - Docker Mode"
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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed!"
    echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
    exit 1
fi

DOCKER_COMPOSE="docker compose"

print_status "Docker and Docker Compose detected"

# Check if .env exists
if [ ! -f .env ]; then
    print_error ".env file not found! Run ./scripts/setup.sh first."
    exit 1
fi

print_status ".env file found"

# Check if docker-compose.yml exists
if [ ! -f docker-compose.yml ]; then
    print_error "docker-compose.yml not found!"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping Docker containers..."
    $DOCKER_COMPOSE down
    echo "✓ Docker containers stopped"
}

trap cleanup EXIT INT TERM

# Create necessary directories
print_status "Creating data directories..."
mkdir -p data/postgres data/timescaledb data/hydra data/ogmios logs

# Pull latest images (optional)
echo ""
read -p "Pull latest Docker images? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Pulling latest images..."
    $DOCKER_COMPOSE pull
fi

# Build custom images
echo ""
print_status "Building Docker images..."
$DOCKER_COMPOSE build

# Start services
echo ""
print_status "Starting Docker containers..."
$DOCKER_COMPOSE up -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Health check function
health_check() {
    local service=$1
    local url=$2
    local max_attempts=60
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 2
    done
    return 1
}

# Check service health
if health_check "Backend API" "http://localhost:3000/health"; then
    print_status "Backend API is ready"
else
    print_warning "Backend API health check timed out"
fi

# Display running containers
echo ""
print_status "Running containers:"
$DOCKER_COMPOSE ps

# Display service information
echo ""
echo "================================================"
echo "✅ Services are running with Docker!"
echo "================================================"
echo ""
echo "📊 Service Endpoints:"
echo "  • Backend API:      http://localhost:3000"
echo "  • PostgreSQL:       localhost:5432"
echo "  • TimescaleDB:      localhost:5433"
echo "  • Ogmios:           localhost:1337"
echo "  • Hydra Node:       localhost:4001"
echo ""
echo "🔍 Health Checks:"
echo "  • API Health:       http://localhost:3000/health"
echo "  • API Metrics:      http://localhost:3000/metrics"
echo ""
echo "📝 Docker Commands:"
echo "  • View logs:        $DOCKER_COMPOSE logs -f [service]"
echo "  • Stop services:    $DOCKER_COMPOSE down"
echo "  • Restart service:  $DOCKER_COMPOSE restart [service]"
echo "  • View status:      $DOCKER_COMPOSE ps"
echo ""
echo "🔧 Available Services:"
$DOCKER_COMPOSE ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "📚 Documentation:"
echo "  • Full docs:        docs/FINAL_IMPLEMENTATION_SUMMARY.md"
echo ""
echo "💡 Quick Test:"
echo '  curl -X POST http://localhost:3000/api/agent-company/task \'
echo '    -H "Content-Type: application/json" \'
echo '    -d '"'"'{"request": "Analyze Cardano blockchain metrics"}'"'"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Follow logs
echo "📋 Following logs (Ctrl+C to exit)..."
$DOCKER_COMPOSE logs -f
