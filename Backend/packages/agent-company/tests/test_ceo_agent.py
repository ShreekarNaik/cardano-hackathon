"""
Tests for CEO Agent
Validates Phase 0: AI Agent Company Setup
"""

import pytest
import asyncio
import json
from unittest.mock import Mock, patch, AsyncMock
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from ceo_agent import CEOAgent


class TestCEOAgentInitialization:
    """Test CEO Agent initialization"""
    
    def test_init_without_api_key_raises_error(self):
        """CEO Agent should raise error if no API key provided"""
        with patch.dict(os.environ, {}, clear=True):
            with pytest.raises(ValueError, match="OPENAI_API_KEY"):
                CEOAgent()
    
    def test_init_with_api_key_succeeds(self):
        """CEO Agent should initialize successfully with API key"""
        ceo = CEOAgent(api_key="test-key")
        assert ceo.api_key == "test-key"
        assert ceo.model == "gpt-4-turbo-preview"
        assert ceo.max_tokens == 2000
        assert ceo.sub_agents == {}
        assert ceo.maker_orchestrator is None
    
    def test_init_with_custom_model(self):
        """CEO Agent should accept custom model"""
        ceo = CEOAgent(api_key="test-key", model="gpt-4", max_tokens=4000)
        assert ceo.model == "gpt-4"
        assert ceo.max_tokens == 4000


class TestCEOAgentRequestAnalysis:
    """Test CEO Agent request analysis"""
    
    @pytest.fixture
    def ceo(self):
        """Create CEO agent for testing"""
        return CEOAgent(api_key="test-key")
    
    @pytest.mark.asyncio
    async def test_analyze_request_low_complexity(self, ceo):
        """Test analysis of simple request"""
        mock_response = Mock()
        mock_choice = Mock()
        mock_message = Mock()
        mock_message.content = json.dumps({
            "complexity": "low",
            "steps": 5,
            "agents_needed": ["research"],
            "use_maker": False,
            "strategy": "Simple query",
            "reasoning": "Few steps required"
        })
        mock_choice.message = mock_message
        mock_response.choices = [mock_choice]
        
        with patch.object(ceo.client.chat.completions, 'create', return_value=mock_response):
            result = await ceo.analyze_request("What is Cardano?")
            
            assert result['complexity'] == 'low'
            assert result['steps'] == 5
            assert 'research' in result['agents_needed']
            assert result['use_maker'] is False
    
    @pytest.mark.asyncio
    async def test_analyze_request_high_complexity(self, ceo):
        """Test analysis of complex request requiring MAKER"""
        mock_response = Mock()
        mock_choice = Mock()
        mock_message = Mock()
        mock_message.content = json.dumps({
            "complexity": "high",
            "steps": 150,
            "agents_needed": ["research", "coder", "analytics", "quality"],
            "use_maker": True,
            "recommended_subtasks": 150,
            "strategy": "MAKER decomposition needed",
            "reasoning": "Over 100 steps required"
        })
        mock_choice.message = mock_message
        mock_response.choices = [mock_choice]
        
        with patch.object(ceo.client.chat.completions, 'create', return_value=mock_response):
            result = await ceo.analyze_request(
                "Analyze all DeFi protocols on Cardano and predict trends"
            )
            
            assert result['complexity'] == 'high'
            assert result['steps'] > 100
            assert result['use_maker'] is True
            assert result['recommended_subtasks'] == 150
    
    @pytest.mark.asyncio
    async def test_analyze_request_json_parsing_fallback(self, ceo):
        """Test fallback when JSON parsing fails"""
        mock_response = Mock()
        mock_choice = Mock()
        mock_message = Mock()
        mock_message.content = "Invalid JSON response"
        mock_choice.message = mock_message
        mock_response.choices = [mock_choice]
        
        with patch.object(ceo.client.chat.completions, 'create', return_value=mock_response):
            result = await ceo.analyze_request("Test request")
            
            # Should return fallback analysis
            assert result['complexity'] == 'medium'
            assert result['steps'] == 50
            assert result['use_maker'] is False
            assert 'Fallback' in result['reasoning']


class TestCEOAgentDelegation:
    """Test CEO Agent delegation to sub-agents"""
    
    @pytest.fixture
    def ceo(self):
        """Create CEO agent for testing"""
        return CEOAgent(api_key="test-key")
    
    @pytest.mark.asyncio
    async def test_create_stub_result(self, ceo):
        """Test stub result creation for unavailable agents"""
        result = await ceo._create_stub_result('research', 'test request')
        
        assert result['agent'] == 'research'
        assert result['status'] == 'stub'
        assert 'not yet implemented' in result['message']
        assert result['confidence'] == 0.0
    
    @pytest.mark.asyncio
    async def test_delegate_to_agents_with_stubs(self, ceo):
        """Test delegation when agents not yet implemented"""
        analysis = {
            'agents_needed': ['research', 'analytics'],
            'complexity': 'medium'
        }
        
        # Mock aggregation
        mock_agg_response = Mock()
        mock_choice = Mock()
        mock_message = Mock()
        mock_message.content = json.dumps({
            "summary": "Analysis complete",
            "key_insights": ["insight 1"],
            "recommendations": ["rec 1"],
            "confidence": 0.8,
            "data": {}
        })
        mock_choice.message = mock_message
        mock_agg_response.choices = [mock_choice]
        
        with patch.object(ceo.client.chat.completions, 'create', return_value=mock_agg_response):
            result = await ceo.delegate_to_agents('test request', analysis)
            
            assert result['status'] == 'success'
            assert 'agents_used' in result
            assert result['verified'] is False
    
    @pytest.mark.asyncio
    async def test_delegate_to_maker_returns_pending(self, ceo):
        """Test delegation to MAKER when not yet implemented"""
        analysis = {
            'complexity': 'high',
            'steps': 150,
            'use_maker': True,
            'recommended_subtasks': 150
        }
        
        result = await ceo.delegate_to_maker('complex request', analysis)
        
        assert result['status'] == 'pending'
        assert 'MAKER' in result['message']
        assert 'next_steps' in result
        assert len(result['next_steps']) > 0


class TestCEOAgentProcessRequest:
    """Test complete CEO Agent request processing flow"""
    
    @pytest.fixture
    def ceo(self):
        """Create CEO agent for testing"""
        return CEOAgent(api_key="test-key")
    
    @pytest.mark.asyncio
    async def test_process_simple_request_flow(self, ceo):
        """Test complete flow for simple request"""
        # Mock analyze_request
        mock_analysis = {
            'complexity': 'low',
            'steps': 5,
            'agents_needed': ['research'],
            'use_maker': False,
            'strategy': 'Simple query'
        }
        
        # Mock aggregation
        mock_result = {
            'status': 'success',
            'summary': 'Analysis complete',
            'key_insights': ['insight 1'],
            'confidence': 0.9
        }
        
        with patch.object(ceo, 'analyze_request', return_value=mock_analysis):
            with patch.object(ceo, 'delegate_to_agents', return_value=mock_result):
                result = await ceo.process_user_request("Simple query")
                
                assert result['status'] == 'success'
                assert 'summary' in result
    
    @pytest.mark.asyncio
    async def test_process_complex_request_uses_maker(self, ceo):
        """Test that complex requests trigger MAKER"""
        # Mock analyze_request
        mock_analysis = {
            'complexity': 'high',
            'steps': 150,
            'agents_needed': ['research', 'coder', 'analytics'],
            'use_maker': True,
            'recommended_subtasks': 150
        }
        
        mock_maker_result = {
            'status': 'pending',
            'message': 'MAKER orchestration',
            'next_steps': ['step1', 'step2']
        }
        
        with patch.object(ceo, 'analyze_request', return_value=mock_analysis):
            with patch.object(ceo, 'delegate_to_maker', return_value=mock_maker_result):
                result = await ceo.process_user_request("Complex analysis")
                
                assert result['status'] == 'pending'
                assert 'MAKER' in result['message']
    
    @pytest.mark.asyncio
    async def test_process_request_error_handling(self, ceo):
        """Test error handling in request processing"""
        with patch.object(ceo, 'analyze_request', side_effect=Exception("Test error")):
            result = await ceo.process_user_request("Test request")
            
            assert result['status'] == 'error'
            assert 'error' in result
            assert 'Test error' in result['error']


class TestCEOAgentAggregation:
    """Test CEO Agent result aggregation"""
    
    @pytest.fixture
    def ceo(self):
        """Create CEO agent for testing"""
        return CEOAgent(api_key="test-key")
    
    @pytest.mark.asyncio
    async def test_aggregate_results_success(self, ceo):
        """Test successful result aggregation"""
        agent_results = [
            {
                'agent': 'research',
                'status': 'success',
                'data': {'finding': 'result1'}
            },
            {
                'agent': 'analytics',
                'status': 'success',
                'data': {'metric': 'value1'}
            }
        ]
        
        mock_response = Mock()
        mock_choice = Mock()
        mock_message = Mock()
        mock_message.content = json.dumps({
            "summary": "Combined analysis",
            "key_insights": ["insight1", "insight2"],
            "recommendations": ["rec1"],
            "confidence": 0.85,
            "data": {"combined": "data"}
        })
        mock_choice.message = mock_message
        mock_response.choices = [mock_choice]
        
        with patch.object(ceo.client.chat.completions, 'create', return_value=mock_response):
            result = await ceo.aggregate_results(agent_results)
            
            assert result['status'] == 'success'
            assert 'summary' in result
            assert len(result['key_insights']) == 2
            assert 'agents_used' in result
            assert 'research' in result['agents_used']
    
    @pytest.mark.asyncio
    async def test_aggregate_results_error_fallback(self, ceo):
        """Test fallback aggregation on error"""
        agent_results = [{'agent': 'test', 'status': 'success'}]
        
        with patch.object(ceo.client.chat.completions, 'create', side_effect=Exception("API Error")):
            result = await ceo.aggregate_results(agent_results)
            
            assert result['status'] == 'partial_success'
            assert 'results' in result
            assert 'error' in result


# Integration test
class TestCEOAgentIntegration:
    """Integration tests for CEO Agent"""
    
    @pytest.mark.asyncio
    @pytest.mark.integration
    async def test_ceo_with_mock_openai_api(self):
        """Test CEO with mocked OpenAI API"""
        ceo = CEOAgent(api_key="test-key")
        
        # Mock the entire flow
        mock_analysis_response = Mock()
        mock_analysis_choice = Mock()
        mock_analysis_message = Mock()
        mock_analysis_message.content = json.dumps({
            "complexity": "medium",
            "steps": 20,
            "agents_needed": ["research", "analytics"],
            "use_maker": False,
            "strategy": "Multi-agent analysis"
        })
        mock_analysis_choice.message = mock_analysis_message
        mock_analysis_response.choices = [mock_analysis_choice]
        
        mock_agg_response = Mock()
        mock_agg_choice = Mock()
        mock_agg_message = Mock()
        mock_agg_message.content = json.dumps({
            "summary": "Complete analysis of Cardano DeFi ecosystem",
            "key_insights": [
                "TVL growing steadily",
                "Top protocols identified"
            ],
            "recommendations": ["Continue monitoring"],
            "confidence": 0.85,
            "data": {"protocols": ["Minswap", "SundaeSwap"]}
        })
        mock_agg_choice.message = mock_agg_message
        mock_agg_response.choices = [mock_agg_choice]
        
        with patch.object(ceo.client.chat.completions, 'create') as mock_create:
            mock_create.side_effect = [mock_analysis_response, mock_agg_response]
            
            result = await ceo.process_user_request(
                "Analyze top Cardano DeFi protocols"
            )
            
            assert result['status'] == 'success'
            assert 'summary' in result
            assert len(result['key_insights']) > 0
            assert result['confidence'] > 0


# Pytest configuration
def pytest_configure(config):
    """Configure pytest markers"""
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
