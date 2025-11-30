"""
CEO Agent - Chief Executive Officer
Primary orchestrator and user interface for the AI Agent Company
"""

import os
import json
import asyncio
from typing import Dict, List, Optional, Any
from openai import AsyncOpenAI
from loguru import logger
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class CEOAgent:
    """
    CEO Agent - Chief Executive Officer
    
    Primary orchestrator that delegates to sub-agents and integrates MAKER when needed
    """
    
    def __init__(self, api_key: Optional[str] = None, model: str = "claude-sonnet-4-20250514"):
        """
        Initialize CEO Agent
        
        Args:
            api_key: Anthropic API key (defaults to ANTHROPIC_API_KEY env var)
            model: Claude model to use
        """
        # Get API key
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY must be provided or set in environment")
        
        self.client = Anthropic(api_key=self.api_key)
        self.model = model
        
        # Initialize sub-agents (lazy loading to avoid circular imports)
        self.sub_agents = {}
        self._agents_initialized = False
        
        # MAKER orchestrator (will be initialized when needed)
        self.maker_orchestrator = None
        
        logger.info(f"CEO Agent initialized with model: {model}")
    
    def _initialize_sub_agents(self):
        """Lazy initialization of sub-agents"""
        if self.sub_agents:
            return
        
        try:
            from .research_agent import ResearchAgent
            from .coder_agent import CoderAgent
            from .analytics_agent import AnalyticsAgent
            from .quality_agent import QualityAgent
            from .operations_agent import OperationsAgent
            
            self.sub_agents = {
                'research': ResearchAgent(),
                'coder': CoderAgent(),
                'analytics': AnalyticsAgent(),
                'quality': QualityAgent(),
                'operations': OperationsAgent()
            }
            logger.info("Sub-agents initialized successfully")
        except ImportError as e:
            logger.warning(f"Some sub-agents not yet implemented: {e}")
            # Initialize with stubs for now
            self.sub_agents = {
                'research': None,
                'coder': None,
                'analytics': None,
                'quality': None,
                'operations': None
            }
    
    async def process_user_request(self, request: str, context: Optional[Dict] = None) -> Dict:
        """
        Main entry point for user requests
        
        Args:
            request: User's analysis request
            context: Optional context information
            
        Returns:
            Dict containing analysis results and metadata
        """
        logger.info(f"CEO processing request: {request[:100]}...")
        
        try:
            # 1. Analyze request
            analysis = await self.analyze_request(request, context)
            logger.info(f"Request analysis: complexity={analysis['complexity']}, "
                       f"steps={analysis.get('steps', 0)}")
            
            # 2. Decide on strategy
            if analysis.get('use_maker', False) and analysis.get('steps', 0) > 100:
                logger.info("High complexity detected - delegating to MAKER")
                return await self.delegate_to_maker(request, analysis)
            else:
                logger.info("Standard complexity - delegating to company agents")
                return await self.delegate_to_agents(request, analysis)
                
        except Exception as e:
            logger.error(f"Error processing request: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'message': 'CEO Agent encountered an error processing your request'
            }
    
    async def analyze_request(self, request: str, context: Optional[Dict] = None) -> Dict:
        """
        CEO analyzes user request using LLM
        
        Args:
            request: User's request
            context: Optional additional context
            
        Returns:
            Dict with analysis results including complexity, required agents, strategy
        """
        prompt = f"""
As CEO of an AI analytics company, analyze this request and provide a strategic plan.

Request: "{request}"

Context: {json.dumps(context or {}, indent=2)}

Provide a JSON response with:
{{
    "complexity": "low|medium|high",
    "steps": <estimated_number_of_steps>,
    "agents_needed": ["research", "coder", "analytics", "quality", "operations"],
    "use_maker": true/false,
    "recommended_subtasks": <number_if_using_maker>,
    "strategy": "brief strategy description",
    "reasoning": "explain your decision"
}}

Criteria:
- complexity="low": < 10 steps, simple queries
- complexity="medium": 10-100 steps, standard analysis
- complexity="high": > 100 steps, requires MAKER decomposition
- use_maker=true: if steps > 100 OR requires extreme reliability
- agents_needed: list only the agents required for this task
"""
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                max_tokens=self.max_tokens,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            
            # Extract JSON from response
            content = response.choices[0].message.content
            
            # Try to parse JSON from markdown code blocks if present
            if "```json" in content:
                json_str = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                json_str = content.split("```")[1].split("```")[0].strip()
            else:
                json_str = content.strip()
            
            analysis = json.loads(json_str)
            return analysis
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse CEO analysis: {e}")
            # Fallback to default analysis
            return {
                "complexity": "medium",
                "steps": 50,
                "agents_needed": ["research", "coder", "analytics", "quality"],
                "use_maker": False,
                "strategy": "Standard multi-agent analysis",
                "reasoning": "Fallback due to parsing error"
            }
        except Exception as e:
            logger.error(f"Error in analyze_request: {e}")
            raise
    
    async def delegate_to_agents(
        self,
        request: str,
        analysis: Dict
    ) -> Dict:
        """
        Delegate to company agents in parallel
        
        Args:
            request: Original user request
            analysis: CEO's analysis of the request
            
        Returns:
            Dict with aggregated results from all agents
        """
        self._initialize_sub_agents()
        
        tasks = []
        agents_used = []
        
        for agent_name in analysis.get('agents_needed', []):
            agent = self.sub_agents.get(agent_name)
            if agent:
                logger.info(f"Delegating to {agent_name} agent")
                tasks.append(agent.execute_task(request, analysis))
                agents_used.append(agent_name)
            else:
                logger.warning(f"{agent_name} agent not available, creating stub result")
                tasks.append(self._create_stub_result(agent_name, request))
        
        # Parallel execution
        logger.info(f"Executing {len(tasks)} agent tasks in parallel")
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle any exceptions
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(f"Agent {agents_used[i]} failed: {result}")
                processed_results.append({
                    'agent': agents_used[i],
                    'status': 'error',
                    'error': str(result)
                })
            else:
                processed_results.append(result)
        
        # Aggregate results
        final_result = await self.aggregate_results(processed_results)
        
        # Quality check (if quality agent is available)
        if 'quality' in agents_used or self.sub_agents.get('quality'):
            logger.info("Running quality verification")
            verified = await self.verify_with_quality_agent(final_result)
            return verified
        else:
            final_result['verified'] = False
            final_result['verification_note'] = 'Quality agent not available'
            return final_result
    
    async def _create_stub_result(self, agent_name: str, request: str) -> Dict:
        """Create a stub result when agent is not available"""
        return {
            'agent': agent_name,
            'status': 'stub',
            'message': f'{agent_name.capitalize()} agent not yet implemented',
            'data': None,
            'confidence': 0.0
        }
    
    async def delegate_to_maker(self, request: str, analysis: Dict) -> Dict:
        """
        Use MAKER framework for complex tasks
        
        Args:
            request: Original user request
            analysis: CEO's analysis indicating high complexity
            
        Returns:
            Dict with MAKER-orchestrated results
        """
        logger.info("Delegating to MAKER orchestrator")
        
        # TODO: Initialize MAKER orchestrator when MAKER package is implemented
        if not self.maker_orchestrator:
            logger.warning("MAKER orchestrator not yet available")
            return {
                'status': 'pending',
                'message': 'MAKER orchestration will be implemented in Phase 4',
                'analysis': analysis,
                'next_steps': [
                    '1. Task will be decomposed into subtasks',
                    '2. Microagents will execute in parallel',
                    '3. Multi-agent voting will verify results',
                    '4. Quality agent will aggregate and validate'
                ]
            }
        
        # MAKER delegation logic (to be implemented)
        decomposed_task = self.maker_orchestrator.decompose(
            request,
            decomposition_level=analysis.get('recommended_subtasks', 100)
        )
        
        maker_result = await self.maker_orchestrator.execute(decomposed_task)
        return maker_result
    
    async def aggregate_results(self, results: List[Dict]) -> Dict:
        """
        Aggregate results from multiple agents using LLM
        
        Args:
            results: List of results from different agents
            
        Returns:
            Dict with aggregated comprehensive analysis
        """
        prompt = f"""
As CEO, aggregate these agent results into a cohesive final analysis:

{json.dumps(results, indent=2)}

Create a comprehensive JSON response with:
{{
    "summary": "executive summary of findings",
    "key_insights": ["insight 1", "insight 2", ...],
    "recommendations": ["recommendation 1", "recommendation 2", ...],
    "agent_contributions": {{
        "agent_name": "what they contributed"
    }},
    "confidence": 0.0-1.0,
    "next_steps": ["step 1", "step 2", ...],
    "data": {{
        "aggregated data from all agents"
    }}
}}
"""
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                max_tokens=self.max_tokens,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            
            # Parse JSON
            if "```json" in content:
                json_str = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                json_str = content.split("```")[1].split("```")[0].strip()
            else:
                json_str = content.strip()
            
            aggregated = json.loads(json_str)
            aggregated['status'] = 'success'
            aggregated['agents_used'] = [r['agent'] for r in results if 'agent' in r]
            
            return aggregated
            
        except Exception as e:
            logger.error(f"Error aggregating results: {e}")
            # Fallback aggregation
            return {
                'status': 'partial_success',
                'summary': 'Results from multiple agents',
                'results': results,
                'error': f'Aggregation failed: {e}'
            }
    
    async def verify_with_quality_agent(self, result: Dict) -> Dict:
        """
        Verify results with Quality Agent
        
        Args:
            result: Results to verify
            
        Returns:
            Dict with verification status added
        """
        quality_agent = self.sub_agents.get('quality')
        if quality_agent:
            try:
                verified = await quality_agent.verify(result)
                return verified
            except Exception as e:
                logger.error(f"Quality verification failed: {e}")
                result['verified'] = False
                result['verification_error'] = str(e)
                return result
        else:
            result['verified'] = False
            result['verification_note'] = 'Quality agent not available'
            return result


# Example usage
if __name__ == "__main__":
    async def main():
        ceo = CEOAgent()
        
        # Test simple request
        result = await ceo.process_user_request(
            "Analyze the top 10 Cardano DeFi protocols by TVL"
        )
        
        print(json.dumps(result, indent=2))
    
    asyncio.run(main())
