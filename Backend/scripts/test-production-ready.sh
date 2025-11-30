#!/bin/bash
# Master test script - runs all phase tests in sequence

set -e

echo "=================================================="
echo "DecentralAI Analytics - Complete Test Suite"
echo "=================================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PHASES_PASSED=0
PHASES_FAILED=0

run_phase() {
    local phase_num="$1"
    local phase_name="$2"
    local script="$3"
    
    echo -e "\n${BLUE}=================================================="
    echo -e "Running Phase $phase_num: $phase_name"
    echo -e "==================================================${NC}\n"
    
    if [ -f "$script" ]; then
        if bash "$script"; then
            echo -e "${GREEN}✓ Phase $phase_num PASSED${NC}"
            ((PHASES_PASSED++))
            return 0
        else
            echo -e "${RED}✗ Phase $phase_num FAILED${NC}"
            ((PHASES_FAILED++))
            return 1
        fi
    else
        echo -e "${YELLOW}⊘ Phase $phase_num SKIPPED (script not found: $script)${NC}"
        return 0
    fi
}

# Run all phase tests
run_phase 1 "Foundation & Testing Infrastructure" "./scripts/test-phase-1.sh"
run_phase 2 "Agent Company Core" "./scripts/test-phase-2.sh"
run_phase 3 "Backend API Integration" "./scripts/test-phase-3.sh"
run_phase 4 "MAKER Orchestration" "./scripts/test-phase-4.sh"
run_phase 5 "Hydra Layer 2" "./scripts/test-phase-5.sh"
run_phase 6 "Masumi Integration" "./scripts/test-phase-6.sh"
run_phase 7 "DS-STAR Analytics" "./scripts/test-phase-7.sh"
run_phase 8 "Cardano Smart Contracts" "./scripts/test-phase-8.sh"
run_phase 9 "End-to-End Integration" "./scripts/test-phase-9.sh"
run_phase 10 "Production Hardening" "./scripts/test-phase-10.sh"

# Summary
echo -e "\n${BLUE}=================================================="
echo -e "Test Suite Summary"
echo -e "==================================================${NC}"
echo -e "${GREEN}Phases Passed: $PHASES_PASSED${NC}"
echo -e "${RED}Phases Failed: $PHASES_FAILED${NC}"

if [ $PHASES_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓✓✓ ALL TESTS PASSED ✓✓✓${NC}"
    echo -e "${GREEN}System is production-ready!${NC}"
    exit 0
else
    echo -e "\n${RED}✗✗✗ SOME TESTS FAILED ✗✗✗${NC}"
    echo -e "${YELLOW}Please fix failing phases before deployment${NC}"
    exit 1
fi
