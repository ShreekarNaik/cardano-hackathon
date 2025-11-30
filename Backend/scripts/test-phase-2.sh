#!/bin/bash
# Phase 2: Agent Company Core Implementation Tests

set -e

echo "=================================================="
echo "Phase 2: Agent Company Core Tests"
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

echo -e "\n1. CEO Agent Tests"
echo "=================="

run_test "CEO Agent unit tests" "cd packages/agent-company && python3 -m pytest tests/test_ceo_agent.py -v"

echo -e "\n2. Research Agent Tests"
echo "======================="

if [ -f packages/agent-company/tests/test_research_agent.py ]; then
    run_test "Research Agent tests" "cd packages/agent-company && python3 -m pytest tests/test_research_agent.py -v"
else
    echo -e "${YELLOW}⚠ Research Agent tests not yet implemented${NC}"
fi

echo -e "\n3. Coder Agent Tests"
echo "===================="

if [ -f packages/agent-company/tests/test_coder_agent.py ]; then
    run_test "Coder Agent tests" "cd packages/agent-company && python3 -m pytest tests/test_coder_agent.py -v"
else
    echo -e "${YELLOW}⚠ Coder Agent tests not yet implemented${NC}"
fi

echo -e "\n4. Analytics Agent Tests"
echo "========================"

if [ -f packages/agent-company/tests/test_analytics_agent.py ]; then
    run_test "Analytics Agent tests" "cd packages/agent-company && python3 -m pytest tests/test_analytics_agent.py -v"
else
    echo -e "${YELLOW}⚠ Analytics Agent tests not yet implemented${NC}"
fi

echo -e "\n5. Quality Agent Tests"
echo "======================"

if [ -f packages/agent-company/tests/test_quality_agent.py ]; then
    run_test "Quality Agent tests" "cd packages/agent-company && python3 -m pytest tests/test_quality_agent.py -v"
else
    echo -e "${YELLOW}⚠ Quality Agent tests not yet implemented${NC}"
fi

echo -e "\n6. Operations Agent Tests"
echo "========================="

if [ -f packages/agent-company/tests/test_operations_agent.py ]; then
    run_test "Operations Agent tests" "cd packages/agent-company && python3 -m pytest tests/test_operations_agent.py -v"
else
    echo -e "${YELLOW}⚠ Operations Agent tests not yet implemented${NC}"
fi

echo -e "\n7. Integration Tests"
echo "===================="

if [ -d packages/agent-company/tests/integration ]; then
    run_test "Agent Company integration tests" "cd packages/agent-company && python3 -m pytest tests/integration/ -v"
else
    echo -e "${YELLOW}⚠ Integration tests not yet implemented${NC}"
fi

echo -e "\n8. Coverage Report"
echo "=================="

run_test "Generate coverage report" "cd packages/agent-company && python3 -m pytest tests/ --cov=src --cov-report=term-missing --cov-report=html"

if [ -f packages/agent-company/htmlcov/index.html ]; then
    echo -e "${GREEN}Coverage report generated: packages/agent-company/htmlcov/index.html${NC}"
fi

echo -e "\n=================================================="
echo "Phase 2 Test Summary"
echo "=================================================="
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"

# Check coverage threshold
COVERAGE=$(cd packages/agent-company && python3 -m pytest tests/ --cov=src --cov-report=term 2>&1 | grep "TOTAL" | awk '{print $4}' | sed 's/%//')

if [ ! -z "$COVERAGE" ]; then
    echo -e "\nCode Coverage: ${COVERAGE}%"
    if (( $(echo "$COVERAGE >= 80" | bc -l) )); then
        echo -e "${GREEN}✓ Coverage target met (≥80%)${NC}"
    else
        echo -e "${YELLOW}⚠ Coverage below target (${COVERAGE}% < 80%)${NC}"
    fi
fi

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ Phase 2 Agent Company: READY${NC}"
    exit 0
else
    echo -e "\n${RED}✗ Phase 2 Agent Company: INCOMPLETE${NC}"
    exit 1
fi
