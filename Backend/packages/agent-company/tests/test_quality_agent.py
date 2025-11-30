"""
Tests for Quality Agent
"""

import pytest
import asyncio
from unittest.mock import Mock, patch
from src.quality_agent import QualityAgent


class TestQualityAgentInitialization:
    """Test Quality Agent initialization"""
    
    def test_init_with_default_id(self):
        """Test initialization with default agent ID"""
        agent = QualityAgent()
        assert agent.agent_id == "quality-001"
        assert agent.agent_type == "quality"
        assert agent.verification_threshold == 0.7
    
    def test_init_with_custom_id(self):
        """Test initialization with custom agent ID"""
        agent = QualityAgent(agent_id="quality-custom")
        assert agent.agent_id == "quality-custom"
        assert agent.agent_type == "quality"
    
    def test_get_capabilities(self):
        """Test getting agent capabilities"""
        agent = QualityAgent()
        capabilities = agent.get_capabilities()
        
        assert "maker_voting" in capabilities
        assert "result_verification" in capabilities
        assert "confidence_scoring" in capabilities
        assert "error_detection" in capabilities
    
    def test_get_status(self):
        """Test getting agent status"""
        agent = QualityAgent(agent_id="test-001")
        status = agent.get_status()
        
        assert status["agent_id"] == "test-001"
        assert status["agent_type"] == "quality"
        assert status["status"] == "ready"
        assert status["verification_threshold"] == 0.7


class TestQualityAgentVerification:
    """Test Quality Agent verification functionality"""
    
    @pytest.mark.asyncio
    async def test_verify_simple_result(self):
        """Test verifying a simple result"""
        agent = QualityAgent()
        result = {"data": "test", "value": 42}
        
        verification = await agent.verify(result)
        
        assert "verified" in verification
        assert "quality_score" in verification
        assert "verification_details" in verification
        assert verification["verification_count"] == 3
    
    @pytest.mark.asyncio
    async def test_verify_with_high_consensus(self):
        """Test verification with unanimous agreement"""
        agent = QualityAgent()
        result = {"data": "consistent"}
        
        verification = await agent.verify(result)
        
        # All 3 verifiers should agree (same hash)
        assert verification["verified"] is True
        assert verification["quality_score"] >= 0.7
    
    @pytest.mark.asyncio
    async def test_multi_agent_verification(self):
        """Test multi-agent verification"""
        agent = QualityAgent()
        result = {"test": "data"}
        
        verifications = await agent.multi_agent_verification(result, num_verifiers=5)
        
        assert len(verifications) == 5
        assert all("hash" in v for v in verifications)
        assert all("agent_id" in v for v in verifications)
    
    @pytest.mark.asyncio
    async def test_verify_with_agent(self):
        """Test single agent verification"""
        agent = QualityAgent()
        result = {"value": 123}
        
        verification = await agent.verify_with_agent(result, 0)
        
        assert verification["agent_id"] == "verifier-0"
        assert "hash" in verification
        assert "output" in verification
        assert verification["is_valid"] is True


class TestQualityAgentVoting:
    """Test MAKER voting mechanism"""
    
    @pytest.mark.asyncio
    async def test_apply_voting_unanimous(self):
        """Test voting with unanimous agreement"""
        agent = QualityAgent()
        result = {"data": "test"}
        
        # Create identical verifications
        verifications = [
            {"hash": "abc123", "output": result, "agent_id": "v1"},
            {"hash": "abc123", "output": result, "agent_id": "v2"},
            {"hash": "abc123", "output": result, "agent_id": "v3"}
        ]
        
        voting_result = await agent.apply_voting(result, verifications)
        
        assert voting_result["consensus_strength"] == 1.0
        assert voting_result["all_agree"] is True
        assert voting_result["majority_count"] == 3
    
    @pytest.mark.asyncio
    async def test_apply_voting_majority(self):
        """Test voting with majority but not unanimous"""
        agent = QualityAgent()
        result = {"data": "test"}
        
        # 2 agree, 1 disagrees
        verifications = [
            {"hash": "abc123", "output": result, "agent_id": "v1"},
            {"hash": "abc123", "output": result, "agent_id": "v2"},
            {"hash": "def456", "output": {"different": "result"}, "agent_id": "v3"}
        ]
        
        voting_result = await agent.apply_voting(result, verifications)
        
        assert voting_result["consensus_strength"] == 2/3
        assert voting_result["all_agree"] is False
        assert voting_result["majority_count"] == 2
    
    @pytest.mark.asyncio
    async def test_verify_with_voting(self):
        """Test subtask verification with voting"""
        agent = QualityAgent()
        subtask = {"id": "task-001"}
        results = [
            {"output": "result1"},
            {"output": "result1"},
            {"output": "result1"}
        ]
        
        verification = await agent.verify_with_voting(subtask, results)
        
        assert verification["subtask_id"] == "task-001"
        assert verification["verified"] is True
        assert verification["result_count"] == 3


class TestQualityAgentHashing:
    """Test result hashing"""
    
    def test_hash_result_deterministic(self):
        """Test that hashing is deterministic"""
        agent = QualityAgent()
        result = {"a": 1, "b": 2, "c": 3}
        
        hash1 = agent.hash_result(result)
        hash2 = agent.hash_result(result)
        
        assert hash1 == hash2
    
    def test_hash_result_different_order(self):
        """Test that hash is same regardless of key order"""
        agent = QualityAgent()
        result1 = {"a": 1, "b": 2}
        result2 = {"b": 2, "a": 1}
        
        hash1 = agent.hash_result(result1)
        hash2 = agent.hash_result(result2)
        
        assert hash1 == hash2
    
    def test_hash_result_different_values(self):
        """Test that different values produce different hashes"""
        agent = QualityAgent()
        result1 = {"value": 1}
        result2 = {"value": 2}
        
        hash1 = agent.hash_result(result1)
        hash2 = agent.hash_result(result2)
        
        assert hash1 != hash2


class TestQualityAgentErrorDetection:
    """Test error detection and flagging"""
    
    def test_flag_errors_verification_failed(self):
        """Test flagging when verification fails"""
        agent = QualityAgent()
        result = {"data": "test"}
        verification = {"verified": False, "quality_score": 0.3}
        
        errors = agent.flag_errors(result, verification)
        
        assert len(errors) > 0
        assert any(e["type"] == "verification_failed" for e in errors)
    
    def test_flag_errors_low_consensus(self):
        """Test flagging low consensus"""
        agent = QualityAgent()
        result = {"data": "test"}
        verification = {
            "verified": True,
            "verification_details": {"consensus_strength": 0.4}
        }
        
        errors = agent.flag_errors(result, verification)
        
        assert any(e["type"] == "low_consensus" for e in errors)
    
    def test_flag_errors_empty_result(self):
        """Test flagging empty results"""
        agent = QualityAgent()
        result = {}
        verification = {"verified": True}
        
        errors = agent.flag_errors(result, verification)
        
        assert any(e["type"] == "empty_result" for e in errors)
    
    def test_flag_errors_no_issues(self):
        """Test no errors when everything is good"""
        agent = QualityAgent()
        result = {"data": "test", "value": 42}
        verification = {
            "verified": True,
            "quality_score": 0.95,
            "verification_details": {"consensus_strength": 1.0}
        }
        
        errors = agent.flag_errors(result, verification)
        
        assert len(errors) == 0


class TestQualityAgentTaskExecution:
    """Test Quality Agent task execution"""
    
    @pytest.mark.asyncio
    async def test_execute_task_success(self):
        """Test successful task execution"""
        agent = QualityAgent()
        request = "Verify analysis results"
        context = {"results": {"data": "test"}}
        
        result = await agent.execute_task(request, context)
        
        assert result["agent"] == "quality"
        assert "verified" in result
        assert "quality_score" in result
    
    @pytest.mark.asyncio
    async def test_execute_task_with_no_context(self):
        """Test task execution without context"""
        agent = QualityAgent()
        request = "Verify results"
        
        result = await agent.execute_task(request)
        
        assert result["agent"] == "quality"
        assert "verified" in result
    
    @pytest.mark.asyncio
    async def test_execute_task_error_handling(self):
        """Test error handling during task execution"""
        agent = QualityAgent()
        
        # Mock verify to raise exception
        with patch.object(agent, 'verify', side_effect=Exception("Test error")):
            result = await agent.execute_task("Test request")
            
            assert "error" in result
            assert result["verified"] is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
