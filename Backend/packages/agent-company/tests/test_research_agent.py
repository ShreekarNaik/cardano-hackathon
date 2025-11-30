"""
Tests for Research Agent
"""

import pytest
import asyncio
from unittest.mock import Mock, patch, AsyncMock
from src.research_agent import ResearchAgent


class TestResearchAgentInitialization:
    """Test Research Agent initialization"""
    
    def test_init_with_default_id(self):
        """Test initialization with default agent ID"""
        agent = ResearchAgent()
        assert agent.agent_id == "research-001"
        assert agent.agent_type == "research"
    
    def test_init_with_custom_id(self):
        """Test initialization with custom agent ID"""
        agent = ResearchAgent(agent_id="research-custom")
        assert agent.agent_id == "research-custom"
        assert agent.agent_type == "research"
    
    def test_get_capabilities(self):
        """Test getting agent capabilities"""
        agent = ResearchAgent()
        capabilities = agent.get_capabilities()
        
        assert "web_search" in capabilities
        assert "blockchain_data_fetch" in capabilities
        assert "data_summarization" in capabilities
        assert "source_citation" in capabilities
        assert "cardano_research" in capabilities
    
    def test_get_status(self):
        """Test getting agent status"""
        agent = ResearchAgent(agent_id="test-001")
        status = agent.get_status()
        
        assert status["agent_id"] == "test-001"
        assert status["agent_type"] == "research"
        assert status["status"] == "ready"
        assert "capabilities" in status


class TestResearchAgentTaskExecution:
    """Test Research Agent task execution"""
    
    @pytest.mark.asyncio
    async def test_execute_blockchain_research(self):
        """Test executing blockchain research task"""
        agent = ResearchAgent()
        request = "Research top 10 Cardano stake pools"
        
        result = await agent.execute_task(request)
        
        assert result["agent"] == "research"
        assert "findings" in result
        assert "sources" in result
        assert "confidence" in result
        assert result["confidence"] > 0
    
    @pytest.mark.asyncio
    async def test_execute_web_research(self):
        """Test executing web research task"""
        agent = ResearchAgent()
        request = "Search for Python best practices"
        
        result = await agent.execute_task(request)
        
        assert result["agent"] == "research"
        assert "findings" in result
        assert result["findings"]["data_type"] == "web_research"

    
    @pytest.mark.asyncio
    async def test_execute_general_research(self):
        """Test executing general research task"""
        agent = ResearchAgent()
        request = "General information about analytics"
        
        result = await agent.execute_task(request)
        
        assert result["agent"] == "research"
        assert "findings" in result
        assert result["confidence"] > 0
    
    @pytest.mark.asyncio
    async def test_execute_with_context(self):
        """Test executing task with additional context"""
        agent = ResearchAgent()
        request = "Research Cardano transactions"
        context = {"limit": 50, "network": "preprod"}
        
        result = await agent.execute_task(request, context)
        
        assert result["agent"] == "research"
        assert "findings" in result
    
    @pytest.mark.asyncio
    async def test_execute_handles_errors(self):
        """Test error handling during task execution"""
        agent = ResearchAgent()
        
        # Mock a method to raise an exception
        with patch.object(agent, '_determine_research_type', side_effect=Exception("Test error")):
            result = await agent.execute_task("Test request")
            
            assert "error" in result
            assert result["confidence"] == 0.0


class TestResearchAgentResearchTypes:
    """Test research type determination"""
    
    def test_determine_blockchain_research(self):
        """Test identifying blockchain research requests"""
        agent = ResearchAgent()
        
        blockchain_requests = [
            "Analyze Cardano stake pools",
            "Get ADA transactions",
            "Research smart contracts on Cardano",
            "Find DeFi protocols",
            "Analyze NFT collections"
        ]
        
        for request in blockchain_requests:
            research_type = agent._determine_research_type(request)
            assert research_type == "blockchain", f"Failed for: {request}"
    
    def test_determine_web_research(self):
        """Test identifying web research requests"""
        agent = ResearchAgent()
        
        web_requests = [
            "Search for information about analytics",
            "Find documentation on Python",
            "Lookup best practices",
            "Research machine learning algorithms"
        ]
        
        for request in web_requests:
            research_type = agent._determine_research_type(request)
            assert research_type == "web", f"Failed for: {request}"
    
    def test_determine_general_research(self):
        """Test identifying general research requests"""
        agent = ResearchAgent()
        
        request = "Tell me about data analysis"
        research_type = agent._determine_research_type(request)
        
        assert research_type == "general"


class TestResearchAgentBlockchainData:
    """Test blockchain data research"""
    
    @pytest.mark.asyncio
    async def test_research_blockchain_data(self):
        """Test blockchain data research"""
        agent = ResearchAgent()
        request = "Get top 100 Cardano transactions"
        
        result = await agent._research_blockchain_data(request, None)
        
        assert result["findings"]["data_type"] == "cardano_blockchain"
        assert "summary" in result["findings"]
        assert "raw_data" in result["findings"]
        assert len(result["sources"]) > 0
        assert result["confidence"] > 0.9
    
    def test_extract_blockchain_params(self):
        """Test extracting blockchain parameters from request"""
        agent = ResearchAgent()
        
        # Test with limit
        request = "Get 50 transactions"
        params = agent._extract_blockchain_params(request)
        assert params["limit"] == 50
        
        # Test with testnet
        request = "Get testnet data"
        params = agent._extract_blockchain_params(request)
        assert params["network"] == "preprod"
        
        # Test default
        request = "Get transactions"
        params = agent._extract_blockchain_params(request)
        assert params["limit"] == 100
        assert params["network"] == "mainnet"
    
    @pytest.mark.asyncio
    async def test_fetch_blockchain_data(self):
        """Test fetching blockchain data"""
        agent = ResearchAgent()
        params = {"network": "mainnet", "limit": 10}
        
        data = await agent._fetch_blockchain_data(params)
        
        assert data["network"] == "mainnet"
        assert data["data_count"] == 10
        assert "sample_data" in data
        assert "metadata" in data
    
    def test_summarize_blockchain_data(self):
        """Test summarizing blockchain data"""
        agent = ResearchAgent()
        data = {
            "network": "mainnet",
            "data_count": 50
        }
        
        summary = agent._summarize_blockchain_data(data)
        
        assert "50" in summary
        assert "mainnet" in summary


class TestResearchAgentWebResearch:
    """Test web research functionality"""
    
    @pytest.mark.asyncio
    async def test_research_web(self):
        """Test web research"""
        agent = ResearchAgent()
        request = "Search for Cardano documentation"
        
        result = await agent._research_web(request, None)
        
        assert result["findings"]["data_type"] == "web_research"
        assert "search_query" in result["findings"]
        assert "summary" in result["findings"]
        assert result["confidence"] > 0.8
    
    def test_build_search_query(self):
        """Test building search queries"""
        agent = ResearchAgent()
        
        # Test Cardano-specific query
        request = "Find Cardano stake pools"
        query = agent._build_search_query(request)
        assert "site:cardano.org" in query or "site:iohk.io" in query
        
        # Test general query
        request = "Find Python documentation"
        query = agent._build_search_query(request)
        assert query == request
    
    @pytest.mark.asyncio
    async def test_web_search(self):
        """Test web search execution"""
        agent = ResearchAgent()
        query = "test query"
        
        results = await agent._web_search(query)
        
        assert isinstance(results, list)
        assert len(results) > 0
        assert "title" in results[0]
        assert "url" in results[0]
    
    @pytest.mark.asyncio
    async def test_gather_detailed_info(self):
        """Test gathering detailed information"""
        agent = ResearchAgent()
        search_results = [
            {"url": "https://example.com/1", "title": "Result 1", "snippet": "Snippet 1"},
            {"url": "https://example.com/2", "title": "Result 2", "snippet": "Snippet 2"}
        ]
        
        detailed_data = await agent._gather_detailed_info(search_results)
        
        assert isinstance(detailed_data, list)
        assert len(detailed_data) <= 5  # Should limit to top 5
    
    def test_summarize_web_findings(self):
        """Test summarizing web findings"""
        agent = ResearchAgent()
        
        # Test with data
        detailed_data = [
            {"source": "url1", "content": "content1"},
            {"source": "url2", "content": "content2"}
        ]
        summary = agent._summarize_web_findings(detailed_data)
        assert "2" in summary
        
        # Test with no data
        summary = agent._summarize_web_findings([])
        assert "No relevant" in summary


class TestResearchAgentGeneralResearch:
    """Test general research functionality"""
    
    @pytest.mark.asyncio
    async def test_research_general(self):
        """Test general research"""
        agent = ResearchAgent()
        request = "General information request"
        
        result = await agent._research_general(request, None)
        
        assert result["findings"]["data_type"] == "general"
        assert "summary" in result["findings"]
        assert result["confidence"] > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
