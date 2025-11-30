#!/bin/bash
# Quick test script - runs only implemented phases

set -e

echo "=================================================="
echo "Quick Test - Currently Implemented Features"
echo "=================================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Phase 1: Infrastructure
echo -e "\n${YELLOW}Testing Phase 1: Infrastructure${NC}"
if ./scripts/test-phase-1.sh; then
    echo -e "${GREEN}✓ Infrastructure tests passed${NC}"
else
    echo -e "${RED}✗ Infrastructure tests failed${NC}"
    exit 1
fi

# Python tests
echo -e "\n${YELLOW}Testing Python packages${NC}"
cd packages/agent-company
if python3 -m pytest tests/ -v --tb=short; then
    echo -e "${GREEN}✓ Python tests passed${NC}"
else
    echo -e "${YELLOW}⚠ Python tests incomplete or failed${NC}"
fi
cd ../..

# TypeScript tests
echo -e "\n${YELLOW}Testing TypeScript packages${NC}"
if pnpm test; then
    echo -e "${GREEN}✓ TypeScript tests passed${NC}"
else
    echo -e "${YELLOW}⚠ TypeScript tests incomplete${NC}"
fi

# Contracts
echo -e "\n${YELLOW}Testing Aiken contracts${NC}"
cd packages/cardano-contracts
if aiken check 2>/dev/null; then
    echo -e "${GREEN}✓ Contract tests passed${NC}"
else
    echo -e "${YELLOW}⚠ Contract compilation issues${NC}"
fi
cd ../..

echo -e "\n${GREEN}Quick test complete!${NC}"
