#!/bin/bash
# Deploy DecentralAI Analytics locally with Docker Compose

set -e

echo "🚀 Deploying DecentralAI Analytics (Local)"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites met${NC}"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${YELLOW}⚠ Please update .env with your API keys${NC}"
fi

# Build packages
echo ""
echo -e "${BLUE}Building packages...${NC}"
pnpm run build || echo "Build step skipped"

# Start Docker services
echo ""
echo -e "${BLUE}Starting Docker services...${NC}"
docker-compose up -d

# Wait for services
echo ""
echo -e "${BLUE}Waiting for services to be healthy...${NC}"
sleep 10

# Check service health
echo ""
echo -e "${BLUE}Checking service health...${NC}"

check_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://localhost:$port" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ $service is healthy${NC}"
            return 0
        fi
        echo "Waiting for $service... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${YELLOW}⚠ $service may not be ready${NC}"
    return 1
}

check_service "Backend API" 3000
check_service "PostgreSQL" 5432
# Add more service checks as needed

# Display status
echo ""
echo "=========================================="
echo -e "${GREEN}✓ DecentralAI Analytics is running!${NC}"
echo ""
echo "Services:"
echo "  Backend API:    http://localhost:3000"
echo "  Health Check:   http://localhost:3000/health"
echo "  PostgreSQL:     localhost:5432"
echo "  Grafana:        http://localhost:3001"
echo "  Ogmios:         ws://localhost:1337"
echo "  Hydra Node:     ws://localhost:4001"
echo ""
echo "Logs:"
echo "  docker-compose logs -f"
echo ""
echo "Stop:"
echo "  docker-compose down"
echo "=========================================="
