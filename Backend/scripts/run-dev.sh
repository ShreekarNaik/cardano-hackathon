#!/bin/bash

#############################################
# DecentralAI Analytics - Development Run Script
# Runs all services in development mode
#############################################

set -e

echo "🚀 DecentralAI Analytics - Development Mode"
echo "==========================================="
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

# Check if .env exists
if [ ! -f .env ]; then
    print_error ".env file not found! Run ./scripts/setup.sh first."
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
    print_error "OPENAI_API_KEY not set in .env file!"
    echo "Please edit .env and add your OpenAI API key."
    exit 1
fi

print_status "Environment variables loaded"

# Create logs directory
mkdir -p logs

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $(jobs -p) 2>/dev/null || true
    wait
    echo "✓ All services stopped"
}

trap cleanup EXIT INT TERM

echo ""
echo "Starting services in development mode..."
echo ""

# Start Backend API
print_status "Starting Backend API on port 3000..."
cd packages/backend-api
pnpm run dev > ../../logs/backend-api.log 2>&1 &
BACKEND_PID=$!
cd ../..

sleep 2

# Start Python Agent Company
print_status "Starting AI Agent Company..."
cd packages/agent-company
source venv/bin/activate
python -m uvicorn main:app --reload --port 8000 > ../../logs/agent-company.log 2>&1 &
AGENT_COMPANY_PID=$!
deactivate
cd ../..

sleep 2

# Health check function
health_check() {
    local service=$1
    local url=$2
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    return 1
}

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."

if health_check "Backend API" "http://localhost:3000/health"; then
    print_status "Backend API is ready"
else
    print_warning "Backend API health check timed out"
fi

if health_check "Agent Company" "http://localhost:8000/health"; then
    print_status "Agent Company is ready"
else
    print_warning "Agent Company health check timed out (may need manual implementation)"
fi

# Display service information
echo ""
echo "================================================"
echo "✅ Services are running in development mode!"
echo "================================================"
echo ""
echo "📊 Service Status:"
echo "  • Backend API:      http://localhost:3000"
echo "  • Agent Company:    http://localhost:8000"
echo "  • API Health:       http://localhost:3000/health"
echo "  • API Metrics:      http://localhost:3000/metrics"
echo ""
echo "📝 Logs:"
echo "  • Backend API:      tail -f logs/backend-api.log"
echo "  • Agent Company:    tail -f logs/agent-company.log"
echo ""
echo "🔧 API Endpoints:"
echo "  POST /api/analysis/start        - Start new analysis"
echo "  GET  /api/analysis/:id          - Get analysis status"
echo "  GET  /api/agents                - List agents"
echo "  POST /api/agent-company/task    - Submit task to CEO"
echo "  GET  /api/metrics               - System metrics"
echo "  POST /api/hydra/head/init       - Initialize Hydra head"
echo ""
echo "📚 Documentation:"
echo "  • API Docs:         docs/FINAL_IMPLEMENTATION_SUMMARY.md"
echo "  • Code Review:      docs/CODE_REVIEW_IMPROVEMENTS.md"
echo ""
echo "💡 Quick Test:"
echo '  curl -X POST http://localhost:3000/api/agent-company/task \'
echo '    -H "Content-Type: application/json" \'
echo '    -d '"'"'{"request": "Analyze top 10 Cardano DeFi protocols"}'"'"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Keep script running
wait
