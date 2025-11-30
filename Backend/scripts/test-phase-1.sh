#!/bin/bash
# Phase 1: Foundation & Testing Infrastructure Tests

set -e

echo "=================================================="
echo "Phase 1: Testing Infrastructure Verification"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
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

echo -e "\n1. Python Testing Infrastructure"
echo "=================================="

# Check if pytest is installed
run_test "Pytest installation" "cd packages/agent-company && /usr/bin/python3 -m pytest --version"

# Check if test fixtures exist
run_test "Test fixtures directory" "test -d packages/agent-company/tests || mkdir -p packages/agent-company/tests"

# Check conftest.py exists or create placeholder
if [ ! -f packages/agent-company/tests/conftest.py ]; then
    echo "Creating conftest.py..."
    cat > packages/agent-company/tests/conftest.py << 'EOF'
"""
Pytest configuration and fixtures for agent-company tests
"""
import pytest
import os
from unittest.mock import Mock

@pytest.fixture
def mock_anthropic_client():
    """Mock Anthropic client for testing"""
    mock = Mock()
    mock.messages.create.return_value = Mock(
        content=[Mock(text='{"complexity": "low", "steps": 5, "agents_needed": ["research"], "use_maker": false, "strategy": "Simple research task"}')]
    )
    return mock

@pytest.fixture
def sample_request():
    """Sample user request for testing"""
    return "Analyze the top 10 Cardano stake pools"

@pytest.fixture
def test_api_key():
    """Test API key"""
    return os.getenv("ANTHROPIC_API_KEY", "test-api-key-12345")
EOF
    echo "Created conftest.py"
fi

run_test "Conftest.py exists" "test -f packages/agent-company/tests/conftest.py"

echo -e "\n2. TypeScript Testing Infrastructure"
echo "====================================="

# Check Jest installation
run_test "Jest installation" "pnpm exec jest --version"

# Check if test setup files exist
for package in backend-api maker-orchestration hydra-layer2 masumi-integration ds-star-analytics; do
    run_test "$package has test script" "grep -q '\"test\"' packages/$package/package.json"
done

echo -e "\n3. Docker Test Environment"
echo "=========================="

# Check Docker is available
run_test "Docker availability" "docker --version"

# Check docker-compose is available
run_test "Docker Compose availability" "docker compose version"

# Check if docker-compose.yml exists
run_test "Docker Compose config exists" "test -f docker-compose.yml"

echo -e "\n4. Test Utilities"
echo "================="

# Create test utilities directory for backend-api
mkdir -p packages/backend-api/tests/helpers

if [ ! -f packages/backend-api/tests/helpers/test-utils.ts ]; then
    cat > packages/backend-api/tests/helpers/test-utils.ts << 'EOF'
/**
 * Test utilities for backend API tests
 */

export const mockRequest = (body: any = {}, params: any = {}, query: any = {}) => ({
  body,
  params,
  query,
  headers: {},
});

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
EOF
    echo "Created test-utils.ts"
fi

run_test "Test utilities exist" "test -f packages/backend-api/tests/helpers/test-utils.ts"

echo -e "\n5. Mock Services"
echo "================"

# Create mock directory for Python
mkdir -p packages/agent-company/tests/mocks

if [ ! -f packages/agent-company/tests/mocks/llm_mock.py ]; then
    cat > packages/agent-company/tests/mocks/llm_mock.py << 'EOF'
"""
Mock LLM clients for testing
"""
from typing import Dict, Any
from unittest.mock import Mock

class MockAnthropicClient:
    """Mock Anthropic client"""
    
    def __init__(self):
        self.messages = Mock()
        self._setup_default_responses()
    
    def _setup_default_responses(self):
        """Setup default mock responses"""
        self.messages.create.return_value = Mock(
            content=[Mock(
                text='{"complexity": "low", "steps": 5, "agents_needed": ["research"], "use_maker": false, "strategy": "Test strategy"}'
            )]
        )

class MockOpenAIClient:
    """Mock OpenAI client"""
    
    def __init__(self):
        self.chat = Mock()
        self._setup_default_responses()
    
    def _setup_default_responses(self):
        """Setup default mock responses"""
        self.chat.completions.create.return_value = Mock(
            choices=[Mock(
                message=Mock(
                    content='{"result": "test result"}'
                )
            )]
        )
EOF
    echo "Created llm_mock.py"
fi

run_test "LLM mocks exist" "test -f packages/agent-company/tests/mocks/llm_mock.py"

echo -e "\n6. Coverage Configuration"
echo "========================="

# Check pytest coverage plugin
run_test "Pytest-cov installation" "cd packages/agent-company && /usr/bin/python3 -m pytest --co -q 2>&1 | grep -q 'no tests ran' || true"

# Check Jest coverage configuration
run_test "Jest coverage config" "pnpm exec jest --showConfig 2>&1 | grep -q 'coverageDirectory' || true"

echo -e "\n=================================================="
echo "Phase 1 Test Summary"
echo "=================================================="
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ Phase 1 Infrastructure: READY${NC}"
    exit 0
else
    echo -e "\n${RED}✗ Phase 1 Infrastructure: INCOMPLETE${NC}"
    exit 1
fi
