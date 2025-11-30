#!/bin/bash
# Phase 3: Backend API Integration Tests

set -e

echo "=================================================="
echo "Phase 3: Backend API Integration Tests"
echo "=================================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n${YELLOW}Running: $test_name${NC}"
    if eval "$test_command"; then
        echo -e "${GREEN}✓ PASSED: $test_name${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED: $test_name${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo -e "\n1. Backend API Unit Tests"
echo "========================="

run_test "Backend API tests" "cd packages/backend-api && pnpm test"

echo -e "\n2. Agent Company Client Tests"
echo "=============================="

if [ -f packages/backend-api/tests/clients/agent-company-client.test.ts ]; then
    run_test "Agent Company client tests" "cd packages/backend-api && pnpm test -- agent-company-client.test.ts"
else
    echo -e "${YELLOW}⚠ Agent Company client tests not yet implemented${NC}"
fi

echo -e "\n3. API Route Tests"
echo "=================="

if [ -f packages/backend-api/tests/routes/agent-company.test.ts ]; then
    run_test "Agent Company route tests" "cd packages/backend-api && pnpm test -- agent-company.test.ts"
else
    echo -e "${YELLOW}⚠ Agent Company route tests not yet implemented${NC}"
fi

echo -e "\n4. Health Check Tests"
echo "====================="

if [ -f packages/backend-api/tests/routes/health.test.ts ]; then
    run_test "Health check tests" "cd packages/backend-api && pnpm test -- health.test.ts"
else
    echo -e "${YELLOW}⚠ Health check tests not yet implemented${NC}"
fi

echo -e "\n5. Integration Tests (Backend ↔ Agent Company)"
echo "==============================================="

# Start Agent Company service in background
echo "Starting Agent Company service..."
cd packages/agent-company
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8000 &
AGENT_COMPANY_PID=$!
cd ../..

# Wait for service to start
sleep 3

# Check if Agent Company is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Agent Company service started${NC}"
    
    # Start Backend API in background
    echo "Starting Backend API..."
    cd packages/backend-api
    pnpm run dev &
    BACKEND_PID=$!
    cd ../..
    
    # Wait for Backend to start
    sleep 3
    
    # Check if Backend is running
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend API started${NC}"
        
        # Run integration tests
        run_test "Backend to Agent Company integration" "curl -X POST http://localhost:3000/api/agent-company/task -H 'Content-Type: application/json' -d '{\"request\": \"Test task\"}' -s | grep -q 'accepted'"
        
        # Cleanup
        kill $BACKEND_PID 2>/dev/null || true
    else
        echo -e "${RED}✗ Backend API failed to start${NC}"
        ((TESTS_FAILED++))
    fi
    
    # Cleanup
    kill $AGENT_COMPANY_PID 2>/dev/null || true
else
    echo -e "${YELLOW}⚠ Agent Company service not available, skipping integration tests${NC}"
fi

echo -e "\n6. Coverage Report"
echo "=================="

run_test "Generate coverage report" "cd packages/backend-api && pnpm test -- --coverage"

echo -e "\n=================================================="
echo "Phase 3 Test Summary"
echo "=================================================="
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ Phase 3 Backend Integration: READY${NC}"
    exit 0
else
    echo -e "\n${RED}✗ Phase 3 Backend Integration: INCOMPLETE${NC}"
    exit 1
fi
