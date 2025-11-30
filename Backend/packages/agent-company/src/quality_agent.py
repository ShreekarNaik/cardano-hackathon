"""
Quality Agent - Handles result verification and quality assurance

This agent is responsible for:
- MAKER-style multi-agent voting
- Result verification and validation
- Confidence scoring
- Error detection and flagging
"""

import asyncio
import hashlib
import json
import time
from typing import Dict, List, Optional
from loguru import logger
from datetime import datetime


class QualityAgent:
    """
    Quality Agent - Chief Quality Officer
    
    Handles verification using MAKER voting mechanism and quality assurance
    """
    
    def __init__(self, agent_id: str = "quality-001"):
        """
        Initialize Quality Agent
        
        Args:
            agent_id: Unique identifier for this agent instance
        """
        self.agent_id = agent_id
        self.agent_type = "quality"
        self.verification_threshold = 0.7  # Minimum confidence for acceptance
        logger.info(f"Quality Agent {agent_id} initialized")
    
    async def execute_task(self, request: str, context: Optional[Dict] = None) -> Dict:
        """
        Execute quality assurance task
        
        Args:
            request: Quality check request
            context: Additional context including results to verify
            
        Returns:
            Dict containing verification results and quality metrics
        """
        logger.info(f"Quality Agent executing task: {request}")
        
        try:
            # Extract results to verify from context
            results_to_verify = context.get("results", {}) if context else {}
            
            # Perform verification
            verification_result = await self.verify(results_to_verify)
            
            # Add metadata
            verification_result.update({
                "agent": self.agent_type,
                "agent_id": self.agent_id,
                "timestamp": datetime.utcnow().isoformat(),
                "request": request
            })
            
            logger.info(f"Quality Agent completed verification with score: {verification_result.get('quality_score', 0)}")
            return verification_result
            
        except Exception as e:
            logger.error(f"Quality Agent error: {e}")
            return {
                "agent": self.agent_type,
                "agent_id": self.agent_id,
                "error": str(e),
                "verified": False,
                "quality_score": 0.0
            }
    
    async def verify(self, result: Dict) -> Dict:
        """
        Verify results using MAKER-style voting
        
        Args:
            result: Result to verify
            
        Returns:
            Verification result with confidence score
        """
        logger.info("Performing MAKER-style verification")
        
        # Get multiple independent verifications
        verification_results = await self.multi_agent_verification(result)
        
        # Apply voting mechanism
        verified_result = await self.apply_voting(result, verification_results)
        
        # Calculate quality score
        quality_score = self._calculate_quality_score(verified_result)
        
        return {
            "verified": quality_score >= self.verification_threshold,
            "quality_score": quality_score,
            "verification_details": verified_result,
            "verification_count": len(verification_results),
            "confidence": quality_score
        }
    
    async def multi_agent_verification(self, result: Dict, num_verifiers: int = 3) -> List[Dict]:
        """
        Get independent verifications from multiple agents
        
        Args:
            result: Result to verify
            num_verifiers: Number of independent verifiers
            
        Returns:
            List of verification results
        """
        logger.info(f"Running {num_verifiers} independent verifications")
        
        # Create verification tasks
        verification_tasks = [
            self.verify_with_agent(result, agent_id)
            for agent_id in range(num_verifiers)
        ]
        
        # Execute verifications in parallel
        verification_results = await asyncio.gather(*verification_tasks)
        
        return verification_results
    
    async def verify_with_agent(self, result: Dict, agent_id: int) -> Dict:
        """
        Single agent verification
        
        Args:
            result: Result to verify
            agent_id: Verifier agent ID
            
        Returns:
            Verification result from single agent
        """
        # Simulate async verification
        await asyncio.sleep(0.05)
        
        # Hash the result for deterministic verification
        result_hash = self.hash_result(result)
        
        # Simulate verification logic
        # In real implementation, this would re-execute the task or validate the output
        is_valid = len(result_hash) > 0  # Simplified validation
        
        return {
            "agent_id": f"verifier-{agent_id}",
            "hash": result_hash,
            "output": result,
            "timestamp": time.time(),
            "is_valid": is_valid,
            "confidence": 0.9 if is_valid else 0.1
        }
    
    def hash_result(self, result: Dict) -> str:
        """
        Generate deterministic hash of result
        
        Args:
            result: Result to hash
            
        Returns:
            SHA256 hash string
        """
        # Convert result to sorted JSON string for deterministic hashing
        result_str = json.dumps(result, sort_keys=True)
        return hashlib.sha256(result_str.encode()).hexdigest()
    
    async def apply_voting(self, original_result: Dict, verification_results: List[Dict]) -> Dict:
        """
        Apply MAKER voting mechanism
        
        Args:
            original_result: Original result being verified
            verification_results: List of verification results
            
        Returns:
            Voting result with consensus
        """
        logger.info("Applying voting mechanism")
        
        # Group by hash (majority voting)
        hash_groups = {}
        for verification in verification_results:
            result_hash = verification["hash"]
            if result_hash not in hash_groups:
                hash_groups[result_hash] = []
            hash_groups[result_hash].append(verification)
        
        # Find majority
        majority_hash = max(hash_groups.keys(), key=lambda h: len(hash_groups[h]))
        majority_count = len(hash_groups[majority_hash])
        total_count = len(verification_results)
        
        # Calculate consensus strength
        consensus_strength = majority_count / total_count
        
        return {
            "majority_hash": majority_hash,
            "majority_count": majority_count,
            "total_verifiers": total_count,
            "consensus_strength": consensus_strength,
            "hash_groups": {h: len(group) for h, group in hash_groups.items()},
            "all_agree": len(hash_groups) == 1
        }
    
    def _calculate_quality_score(self, verified_result: Dict) -> float:
        """
        Calculate overall quality score
        
        Args:
            verified_result: Verification result from voting
            
        Returns:
            Quality score between 0 and 1
        """
        # Base score on consensus strength
        consensus_strength = verified_result.get("consensus_strength", 0)
        
        # Bonus for unanimous agreement
        all_agree = verified_result.get("all_agree", False)
        bonus = 0.1 if all_agree else 0
        
        # Calculate final score
        quality_score = min(1.0, consensus_strength + bonus)
        
        return quality_score
    
    async def verify_with_voting(self, subtask: Dict, results: List[Dict]) -> Dict:
        """
        Verify subtask results using voting (MAKER-style)
        
        Args:
            subtask: Subtask being verified
            results: List of results from different agents
            
        Returns:
            Verification result with consensus
        """
        logger.info(f"Verifying subtask {subtask.get('id', 'unknown')} with {len(results)} results")
        
        # Hash all results
        hashed_results = []
        for idx, result in enumerate(results):
            result_hash = self.hash_result(result)
            hashed_results.append({
                "agent_id": f"agent-{idx}",
                "hash": result_hash,
                "output": result
            })
        
        # Apply voting
        voting_result = await self.apply_voting(results[0] if results else {}, hashed_results)
        
        # Calculate confidence
        confidence = voting_result["consensus_strength"]
        
        return {
            "subtask_id": subtask.get("id"),
            "verified": confidence >= self.verification_threshold,
            "confidence": confidence,
            "voting_result": voting_result,
            "result_count": len(results)
        }
    
    def flag_errors(self, result: Dict, verification: Dict) -> List[Dict]:
        """
        Flag potential errors in results
        
        Args:
            result: Original result
            verification: Verification details
            
        Returns:
            List of error flags
        """
        errors = []
        
        # Check if verification failed
        if not verification.get("verified", False):
            errors.append({
                "type": "verification_failed",
                "severity": "high",
                "message": "Result failed verification",
                "quality_score": verification.get("quality_score", 0)
            })
        
        # Check for low consensus
        if verification.get("verification_details", {}).get("consensus_strength", 1) < 0.5:
            errors.append({
                "type": "low_consensus",
                "severity": "medium",
                "message": "Low consensus among verifiers",
                "consensus": verification["verification_details"]["consensus_strength"]
            })
        
        # Check for missing data
        if not result or len(result) == 0:
            errors.append({
                "type": "empty_result",
                "severity": "high",
                "message": "Result is empty or missing"
            })
        
        return errors
    
    def get_capabilities(self) -> List[str]:
        """
        Get list of agent capabilities
        
        Returns:
            List of capability strings
        """
        return [
            "maker_voting",
            "result_verification",
            "confidence_scoring",
            "error_detection",
            "quality_assurance"
        ]
    
    def get_status(self) -> Dict:
        """
        Get agent status
        
        Returns:
            Status dictionary
        """
        return {
            "agent_id": self.agent_id,
            "agent_type": self.agent_type,
            "status": "ready",
            "verification_threshold": self.verification_threshold,
            "capabilities": self.get_capabilities()
        }
