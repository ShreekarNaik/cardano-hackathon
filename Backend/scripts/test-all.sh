#!/bin/bash
# Test all packages in the monorepo

set -e

echo "🧪 Running DecentralAI Analytics Test Suite"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAILED=0

# Function to run tests for a package
run_package_tests() {
    local package=$1
    local test_cmd=$2
    
    echo ""
    echo -e "${YELLOW}Testing: $package${NC}"
    echo "----------------------------------------"
    
    cd "$package"
    
    if [ -f "package.json" ]; then
        if pnpm test 2>&1; then
            echo -e "${GREEN}✓ $package tests passed${NC}"
        else
            echo -e "${RED}✗ $package tests failed${NC}"
            FAILED=$((FAILED + 1))
        fi
    elif [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
        if pytest 2>&1; then
            echo -e "${GREEN}✓ $package tests passed${NC}"
        else
            echo -e "${RED}✗ $package tests failed${NC}"
            FAILED=$((FAILED + 1))
        fi
    else
        echo -e "${YELLOW}⚠ No tests found for $package${NC}"
    fi
    
    cd - > /dev/null
}

# Test Python packages
echo ""
echo "=== Python Packages ==="
run_package_tests "packages/agent-company" "pytest"

# Test TypeScript/JavaScript packages
echo ""
echo "=== TypeScript Packages ==="
run_package_tests "packages/masumi-integration" "pnpm test"
run_package_tests "packages/maker-orchestration" "pnpm test"
run_package_tests "packages/hydra-layer2" "pnpm test"
run_package_tests "packages/ds-star-analytics" "pnpm test"
run_package_tests "packages/backend-api" "pnpm test"

# Test Aiken contracts
echo ""
echo "=== Aiken Contracts ==="
echo -e "${YELLOW}Testing: Cardano Contracts${NC}"
echo "----------------------------------------"
cd packages/cardano-contracts
if aiken check 2>&1; then
    echo -e "${GREEN}✓ Aiken contracts valid${NC}"
else
    echo -e "${RED}✗ Aiken contracts failed${NC}"
    FAILED=$((FAILED + 1))
fi
cd - > /dev/null

# Summary
echo ""
echo "=========================================="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ $FAILED package(s) failed${NC}"
    exit 1
fi
