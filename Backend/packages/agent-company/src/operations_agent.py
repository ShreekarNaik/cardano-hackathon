"""
Operations Agent - Handles infrastructure and deployment management

This agent is responsible for:
- Infrastructure monitoring
- Hydra head lifecycle management
- Resource optimization
- Deployment coordination
- System health checks
"""

import asyncio
import json
from typing import Dict, List, Optional
from loguru import logger
from datetime import datetime


class OperationsAgent:
    """
    Operations Agent - Chief Operations Officer
    
    Handles infrastructure management, monitoring, and deployment
    """
    
    def __init__(self, agent_id: str = "operations-001"):
        """
        Initialize Operations Agent
        
        Args:
            agent_id: Unique identifier for this agent instance
        """
        self.agent_id = agent_id
        self.agent_type = "operations"
        self.hydra_heads = {}  # Track active Hydra heads
        self.metrics = {
            "cpu_usage": 0.0,
            "memory_usage": 0.0,
            "active_heads": 0
        }
        logger.info(f"Operations Agent {agent_id} initialized")
    
    async def execute_task(self, request: str, context: Optional[Dict] = None) -> Dict:
        """
        Execute operations task
        
        Args:
            request: Operations task request
            context: Additional context
            
        Returns:
            Dict containing operation results
        """
        logger.info(f"Operations Agent executing task: {request}")
        
        try:
            # Determine operation type
            operation_type = self._determine_operation_type(request)
            
            if operation_type == "deploy":
                result = await self.deploy_infrastructure(context or {})
            elif operation_type == "monitor":
                result = await self.check_system_health()
            elif operation_type == "optimize":
                result = await self.optimize_resources()
            elif operation_type == "hydra":
                result = await self.manage_hydra_heads(context or {})
            else:
                result = await self.get_status_report()
            
            # Add metadata
            result.update({
                "agent": self.agent_type,
                "agent_id": self.agent_id,
                "timestamp": datetime.utcnow().isoformat(),
                "request": request
            })
            
            logger.info(f"Operations Agent completed task")
            return result
            
        except Exception as e:
            logger.error(f"Operations Agent error: {e}")
            return {
                "agent": self.agent_type,
                "agent_id": self.agent_id,
                "error": str(e),
                "status": "failed"
            }
    
    def _determine_operation_type(self, request: str) -> str:
        """
        Determine type of operation from request
        
        Args:
            request: Operation request
            
        Returns:
            Operation type
        """
        request_lower = request.lower()
        
        if any(word in request_lower for word in ["deploy", "setup", "create"]):
            return "deploy"
        elif any(word in request_lower for word in ["monitor", "health", "check"]):
            return "monitor"
        elif any(word in request_lower for word in ["optimize", "improve", "tune"]):
            return "optimize"
        elif any(word in request_lower for word in ["hydra", "head", "channel"]):
            return "hydra"
        else:
            return "status"
    
    async def deploy_infrastructure(self, context: Dict) -> Dict:
        """
        Deploy necessary infrastructure
        
        Args:
            context: Deployment context
            
        Returns:
            Deployment result
        """
        logger.info("Deploying infrastructure")
        
        # Simulate async deployment
        await asyncio.sleep(0.1)
        
        num_heads = context.get("num_heads", 5)
        
        # Deploy Hydra Heads
        deployed_heads = await self._deploy_hydra_heads(num_heads)
        
        return {
            "deployed": True,
            "hydra_heads": len(deployed_heads),
            "head_ids": deployed_heads,
            "status": "operational",
            "deployment_time": "0.1s"
        }
    
    async def _deploy_hydra_heads(self, num_heads: int) -> List[str]:
        """
        Deploy Hydra heads
        
        Args:
            num_heads: Number of heads to deploy
            
        Returns:
            List of deployed head IDs
        """
        logger.info(f"Deploying {num_heads} Hydra heads")
        
        deployed = []
        
        for i in range(num_heads):
            head_id = f"hydra-head-{i+1:03d}"
            
            # Simulate head deployment
            self.hydra_heads[head_id] = {
                "status": "active",
                "created_at": datetime.utcnow().isoformat(),
                "transactions": 0,
                "participants": []
            }
            
            deployed.append(head_id)
        
        self.metrics["active_heads"] = len(self.hydra_heads)
        
        return deployed
    
    async def check_system_health(self) -> Dict:
        """
        Monitor system health
        
        Returns:
            System health metrics
        """
        logger.info("Checking system health")
        
        # Simulate async health check
        await asyncio.sleep(0.05)
        
        # Collect metrics
        metrics = await self._collect_metrics()
        
        # Determine health status
        health_status = self._determine_health_status(metrics)
        
        return {
            "health": health_status,
            "metrics": metrics,
            "active_heads": len(self.hydra_heads),
            "alerts": self._check_alerts(metrics)
        }
    
    async def _collect_metrics(self) -> Dict:
        """Collect system metrics"""
        # Simulate metric collection
        import random
        
        self.metrics.update({
            "cpu_usage": random.uniform(20, 80),
            "memory_usage": random.uniform(30, 70),
            "disk_usage": random.uniform(40, 60),
            "network_throughput": random.uniform(100, 500),
            "active_heads": len(self.hydra_heads)
        })
        
        return self.metrics.copy()
    
    def _determine_health_status(self, metrics: Dict) -> str:
        """Determine overall health status"""
        cpu = metrics.get("cpu_usage", 0)
        memory = metrics.get("memory_usage", 0)
        
        if cpu > 90 or memory > 90:
            return "critical"
        elif cpu > 75 or memory > 75:
            return "degraded"
        else:
            return "healthy"
    
    def _check_alerts(self, metrics: Dict) -> List[Dict]:
        """Check for alerts based on metrics"""
        alerts = []
        
        if metrics.get("cpu_usage", 0) > 80:
            alerts.append({
                "severity": "warning",
                "type": "high_cpu",
                "message": f"CPU usage high: {metrics['cpu_usage']:.1f}%"
            })
        
        if metrics.get("memory_usage", 0) > 80:
            alerts.append({
                "severity": "warning",
                "type": "high_memory",
                "message": f"Memory usage high: {metrics['memory_usage']:.1f}%"
            })
        
        if len(self.hydra_heads) == 0:
            alerts.append({
                "severity": "info",
                "type": "no_heads",
                "message": "No Hydra heads deployed"
            })
        
        return alerts
    
    async def optimize_resources(self) -> Dict:
        """
        Optimize resource usage
        
        Returns:
            Optimization result
        """
        logger.info("Optimizing resources")
        
        # Simulate async optimization
        await asyncio.sleep(0.05)
        
        optimizations = []
        
        # Check for idle Hydra heads
        idle_heads = [
            head_id for head_id, head_data in self.hydra_heads.items()
            if head_data.get("transactions", 0) == 0
        ]
        
        if idle_heads:
            optimizations.append({
                "type": "idle_heads",
                "action": "Consider closing idle heads",
                "count": len(idle_heads)
            })
        
        # Check resource usage
        if self.metrics.get("memory_usage", 0) > 70:
            optimizations.append({
                "type": "memory",
                "action": "Increase memory allocation",
                "current": f"{self.metrics['memory_usage']:.1f}%"
            })
        
        return {
            "optimizations": optimizations,
            "recommendations_count": len(optimizations),
            "status": "completed"
        }
    
    async def manage_hydra_heads(self, context: Dict) -> Dict:
        """
        Manage Hydra head lifecycle
        
        Args:
            context: Management context
            
        Returns:
            Management result
        """
        logger.info("Managing Hydra heads")
        
        action = context.get("action", "list")
        
        if action == "create":
            head_id = await self._create_hydra_head(context)
            return {
                "action": "created",
                "head_id": head_id,
                "status": "active"
            }
        elif action == "close":
            head_id = context.get("head_id")
            await self._close_hydra_head(head_id)
            return {
                "action": "closed",
                "head_id": head_id,
                "status": "closed"
            }
        else:  # list
            return {
                "action": "list",
                "heads": list(self.hydra_heads.keys()),
                "count": len(self.hydra_heads)
            }
    
    async def _create_hydra_head(self, context: Dict) -> str:
        """Create a new Hydra head"""
        head_id = f"hydra-head-{len(self.hydra_heads)+1:03d}"
        
        self.hydra_heads[head_id] = {
            "status": "active",
            "created_at": datetime.utcnow().isoformat(),
            "transactions": 0,
            "participants": context.get("participants", [])
        }
        
        self.metrics["active_heads"] = len(self.hydra_heads)
        logger.info(f"Created Hydra head: {head_id}")
        
        return head_id
    
    async def _close_hydra_head(self, head_id: str):
        """Close a Hydra head"""
        if head_id in self.hydra_heads:
            del self.hydra_heads[head_id]
            self.metrics["active_heads"] = len(self.hydra_heads)
            logger.info(f"Closed Hydra head: {head_id}")
    
    async def get_status_report(self) -> Dict:
        """
        Get comprehensive status report
        
        Returns:
            Status report
        """
        logger.info("Generating status report")
        
        return {
            "infrastructure": {
                "hydra_heads": len(self.hydra_heads),
                "active_heads": list(self.hydra_heads.keys())
            },
            "metrics": self.metrics,
            "health": self._determine_health_status(self.metrics),
            "uptime": "operational"
        }
    
    def get_capabilities(self) -> List[str]:
        """
        Get list of agent capabilities
        
        Returns:
            List of capability strings
        """
        return [
            "infrastructure_deployment",
            "system_monitoring",
            "resource_optimization",
            "hydra_head_management",
            "health_checks",
            "metrics_collection"
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
            "active_heads": len(self.hydra_heads),
            "capabilities": self.get_capabilities()
        }
