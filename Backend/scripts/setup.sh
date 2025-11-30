#!/bin/bash

#############################################
# DecentralAI Analytics - Setup Script
# Initializes the entire platform
#############################################

set -e  # Exit on error

echo "🚀 DecentralAI Analytics - Setup Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi
print_status "Node.js $(node -v) detected"

# Check Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1-2)
print_status "Python $(python3 --version | cut -d' ' -f2) detected"

# Check Docker
if ! command -v docker &> /dev/null; then
    print_warning "Docker is not installed. Docker is required for full deployment."
    DOCKER_AVAILABLE=false
else
    print_status "Docker $(docker --version | cut -d' ' -f3 | tr -d ',') detected"
    DOCKER_AVAILABLE=true
fi

# Check Docker Compose
if ! docker compose version &> /dev/null; then
    print_warning "Docker Compose is not installed. Required for full deployment."
    COMPOSE_AVAILABLE=false
else
    print_status "Docker Compose detected"
    COMPOSE_AVAILABLE=true
fi

echo ""
echo "📦 Installing dependencies..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file from template..."
    cp .env.example .env
    print_warning "Please edit .env file and add your API keys before running!"
else
    print_status ".env file already exists"
fi

# Install root dependencies
print_status "Installing root package dependencies..."
pnpm install

# Install Python dependencies for agent-company
echo ""
print_status "Setting up AI Agent Company (Python)..."
cd packages/agent-company

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
print_status "Installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate

cd ../..

# Install TypeScript package dependencies
echo ""
print_status "Installing TypeScript package dependencies..."

packages=(
    "masumi-integration"
    "maker-orchestration"
    "hydra-layer2"
    "ds-star-analytics"
    "backend-api"
    "onchain-analysis"
)

for package in "${packages[@]}"; do
    if [ -d "packages/$package" ]; then
        print_status "Installing dependencies for $package..."
        cd "packages/$package"
        pnpm install
        cd ../..
    fi
done

# Check Aiken installation for Cardano contracts
echo ""
if ! command -v aiken &> /dev/null; then
    print_warning "Aiken is not installed. Cardano contracts won't be compilable."
    print_warning "Install from: https://aiken-lang.org/installation-instructions"
else
    print_status "Aiken $(aiken --version) detected"
    print_status "Building Cardano contracts..."
    cd packages/cardano-contracts
    if aiken check; then
        print_status "Cardano contracts validated successfully"
    else
        print_warning "Cardano contracts validation failed"
    fi
    cd ../..
fi

# Create necessary directories
echo ""
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p data/postgres
mkdir -p data/timescaledb
mkdir -p data/hydra
mkdir -p data/ogmios

# Make scripts executable
echo ""
print_status "Making scripts executable..."
chmod +x scripts/*.sh

# Build TypeScript packages
echo ""
print_status "Building TypeScript packages..."
for package in "${packages[@]}"; do
    if [ -d "packages/$package" ] && [ -f "packages/$package/package.json" ]; then
        cd "packages/$package"
        if grep -q '"build"' package.json; then
            print_status "Building $package..."
            pnpm run build 2>/dev/null || print_warning "$package build failed (may not have build script)"
        fi
        cd ../..
    fi
done

# Summary
echo ""
echo "================================================"
echo "✅ Setup completed successfully!"
echo "================================================"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Edit .env file and add your API keys:"
echo "   - OPENAI_API_KEY (required for AI agents)"
echo "   - Other service credentials as needed"
echo ""
echo "2. Start the services:"
if [ "$DOCKER_AVAILABLE" = true ] && [ "$COMPOSE_AVAILABLE" = true ]; then
    echo "   ./scripts/run-docker.sh        # Run with Docker (recommended)"
fi
echo "   ./scripts/run-dev.sh           # Run in development mode"
echo ""
echo "3. Run tests:"
echo "   ./scripts/test-all.sh          # Run all tests"
echo ""
echo "4. Deploy (after testing):"
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "   ./scripts/deploy-local.sh      # Deploy locally"
    echo "   ./scripts/deploy-production.sh # Deploy to production"
fi
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - docs/FINAL_IMPLEMENTATION_SUMMARY.md - Complete implementation guide"
echo "   - docs/CODE_REVIEW_IMPROVEMENTS.md - Code quality and improvements"
echo ""
echo "🌐 Endpoints (after starting):"
echo "   - API: http://localhost:3000"
echo "   - Health: http://localhost:3000/health"
echo "   - Metrics: http://localhost:3000/metrics"
echo ""

if [ -f .env ]; then
    if grep -q "your_openai_api_key_here" .env || grep -q "your_" .env; then
        print_warning "Remember to update .env with real credentials!"
    fi
fi

echo "Happy coding! 🎉"
echo ""
