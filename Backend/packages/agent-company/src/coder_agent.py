"""
Coder Agent - Handles autonomous coding and execution

This agent is responsible for:
- DS-STAR integration (Plan → Code → Verify)
- Dockerized code execution environment
- Tool installation and management
- Code generation and execution
- Result extraction and validation
"""

import asyncio
import json
from typing import Dict, List, Optional, Any
from loguru import logger
from datetime import datetime
import docker
from docker.errors import DockerException


class CoderAgent:
    """
    Coder Agent - Chief Technology Officer
    
    Handles autonomous coding with DS-STAR in Dockerized environment
    """
    
    def __init__(self, agent_id: str = "coder-001"):
        """
        Initialize Coder Agent
        
        Args:
            agent_id: Unique identifier for this agent instance
        """
        self.agent_id = agent_id
        self.agent_type = "coder"
        self.container = None
        self.docker_client = None
        
        # Initialize Docker client
        try:
            self.docker_client = docker.from_env()
            logger.info(f"Coder Agent {agent_id} initialized with Docker")
        except DockerException as e:
            logger.warning(f"Docker not available: {e}. Running in mock mode.")
            self.docker_client = None
    
    async def execute_task(self, request: str, context: Optional[Dict] = None) -> Dict:
        """
        Execute coding task
        
        Args:
            request: Coding task request
            context: Additional context including data
            
        Returns:
            Dict containing code, execution results, and confidence
        """
        logger.info(f"Coder Agent executing task: {request}")
        
        try:
            # Setup Docker environment
            await self.setup_docker_environment()
            
            # Use DS-STAR workflow: Plan → Code → Verify
            ds_star_result = await self.ds_star_workflow(request, context)
            
            # Execute code in Docker
            execution_result = await self.execute_in_docker(
                ds_star_result['code'],
                context.get('data') if context else None
            )
            
            # Verify results
            verification = await self.verify_execution(
                ds_star_result,
                execution_result
            )
            
            # Cleanup
            await self.cleanup_docker()
            
            result = {
                "agent": self.agent_type,
                "agent_id": self.agent_id,
                "code": ds_star_result['code'],
                "plan": ds_star_result['plan'],
                "execution_result": execution_result,
                "verification": verification,
                "confidence": verification.get('confidence', 0.8),
                "timestamp": datetime.utcnow().isoformat(),
                "request": request
            }
            
            logger.info(f"Coder Agent completed with confidence: {result['confidence']}")
            return result
            
        except Exception as e:
            logger.error(f"Coder Agent error: {e}")
            await self.cleanup_docker()
            return {
                "agent": self.agent_type,
                "agent_id": self.agent_id,
                "error": str(e),
                "confidence": 0.0,
                "code": None,
                "execution_result": None
            }
    
    async def ds_star_workflow(self, request: str, context: Optional[Dict]) -> Dict:
        """
        Execute DS-STAR workflow: Plan → Code → Verify
        
        Args:
            request: Task description
            context: Additional context
            
        Returns:
            Dict with plan, code, and initial verification
        """
        logger.info("Executing DS-STAR workflow")
        
        # Phase 1: Plan
        plan = await self.plan_task(request, context)
        
        # Phase 2: Code
        code = await self.generate_code(plan, context)
        
        # Phase 3: Verify (initial)
        initial_verification = await self.verify_code(code, plan)
        
        return {
            "plan": plan,
            "code": code,
            "initial_verification": initial_verification,
            "ds_star_version": "1.0"
        }
    
    async def plan_task(self, request: str, context: Optional[Dict]) -> Dict:
        """
        DS-STAR Phase 1: Plan the task
        
        Args:
            request: Task description
            context: Additional context
            
        Returns:
            Execution plan
        """
        logger.info("Planning task")
        
        # Simulate async planning
        await asyncio.sleep(0.05)
        
        # In real implementation, this would use LLM to create detailed plan
        plan = {
            "objective": request,
            "steps": [
                "Import required libraries",
                "Load and process data",
                "Perform analysis",
                "Return results"
            ],
            "required_libraries": ["pandas", "numpy"],
            "estimated_complexity": "medium"
        }
        
        return plan
    
    async def generate_code(self, plan: Dict, context: Optional[Dict]) -> str:
        """
        DS-STAR Phase 2: Generate code from plan
        
        Args:
            plan: Execution plan
            context: Additional context
            
        Returns:
            Generated Python code
        """
        logger.info("Generating code from plan")
        
        # Simulate async code generation
        await asyncio.sleep(0.05)
        
        # In real implementation, this would use LLM to generate code
        # For now, return template code
        code = """
import pandas as pd
import numpy as np

def analyze_data(data):
    \"\"\"Analyze the provided data\"\"\"
    if data is None:
        return {"result": "No data provided"}
    
    # Perform analysis
    result = {
        "status": "success",
        "analysis": "Data analyzed successfully"
    }
    
    return result

# Execute analysis
result = analyze_data(None)
print(result)
"""
        
        return code.strip()
    
    async def verify_code(self, code: str, plan: Dict) -> Dict:
        """
        DS-STAR Phase 3: Verify code matches plan
        
        Args:
            code: Generated code
            plan: Original plan
            
        Returns:
            Verification result
        """
        logger.info("Verifying code")
        
        # Simulate async verification
        await asyncio.sleep(0.05)
        
        # Basic verification checks
        checks = {
            "has_imports": "import" in code,
            "has_function": "def " in code,
            "has_execution": "result" in code,
            "syntax_valid": True  # Would use ast.parse in real implementation
        }
        
        is_valid = all(checks.values())
        
        return {
            "is_valid": is_valid,
            "checks": checks,
            "confidence": 0.9 if is_valid else 0.3
        }
    
    async def setup_docker_environment(self):
        """
        Create isolated Docker container for code execution
        """
        if not self.docker_client:
            logger.warning("Docker not available, using mock environment")
            return
        
        try:
            logger.info("Setting up Docker environment")
            
            # Check if container already exists
            if self.container:
                return
            
            # Create container
            self.container = self.docker_client.containers.run(
                image="python:3.11-slim",
                command="tail -f /dev/null",  # Keep alive
                detach=True,
                remove=True,
                mem_limit="512m",
                network_mode="bridge"
            )
            
            # Install common tools
            await self.install_base_packages()
            
            logger.info(f"Docker container created: {self.container.id[:12]}")
            
        except DockerException as e:
            logger.error(f"Failed to setup Docker: {e}")
            self.container = None
    
    async def install_base_packages(self):
        """Install base Python packages in container"""
        if not self.container:
            return
        
        packages = ["pandas", "numpy", "scipy", "matplotlib"]
        
        try:
            logger.info(f"Installing packages: {packages}")
            install_cmd = f"pip install --quiet {' '.join(packages)}"
            
            # Execute in container
            exec_result = self.container.exec_run(
                f"bash -c '{install_cmd}'",
                demux=True
            )
            
            if exec_result.exit_code == 0:
                logger.info("Base packages installed successfully")
            else:
                logger.warning(f"Package installation warning: {exec_result.output}")
                
        except Exception as e:
            logger.warning(f"Failed to install packages: {e}")
    
    async def execute_in_docker(self, code: str, data: Any = None) -> Dict:
        """
        Execute code in isolated Docker environment
        
        Args:
            code: Python code to execute
            data: Optional data to pass to code
            
        Returns:
            Execution result
        """
        if not self.container:
            logger.info("Executing in mock mode (no Docker)")
            return await self.execute_mock(code, data)
        
        try:
            logger.info("Executing code in Docker container")
            
            # Write code to container
            code_with_wrapper = f"""
import sys
import json

try:
{self._indent_code(code, 4)}
except Exception as e:
    print(json.dumps({{"error": str(e), "status": "failed"}}))
    sys.exit(1)
"""
            
            # Execute code
            exec_result = self.container.exec_run(
                f"python -c {repr(code_with_wrapper)}",
                demux=True
            )
            
            stdout = exec_result.output[0].decode('utf-8') if exec_result.output[0] else ""
            stderr = exec_result.output[1].decode('utf-8') if exec_result.output[1] else ""
            
            return {
                "status": "success" if exec_result.exit_code == 0 else "failed",
                "exit_code": exec_result.exit_code,
                "stdout": stdout,
                "stderr": stderr,
                "output": stdout
            }
            
        except Exception as e:
            logger.error(f"Execution error: {e}")
            return {
                "status": "failed",
                "error": str(e),
                "output": None
            }
    
    async def execute_mock(self, code: str, data: Any = None) -> Dict:
        """
        Mock execution when Docker is not available
        
        Args:
            code: Code to execute
            data: Optional data
            
        Returns:
            Mock execution result
        """
        await asyncio.sleep(0.1)
        
        return {
            "status": "success",
            "exit_code": 0,
            "stdout": "{'result': 'No data provided', 'status': 'success', 'analysis': 'Data analyzed successfully'}",
            "stderr": "",
            "output": "Mock execution completed",
            "mock": True
        }
    
    def _indent_code(self, code: str, spaces: int) -> str:
        """Indent code by specified number of spaces"""
        indent = " " * spaces
        return "\n".join(indent + line for line in code.split("\n"))
    
    async def verify_execution(self, ds_star_result: Dict, execution_result: Dict) -> Dict:
        """
        Verify execution results
        
        Args:
            ds_star_result: DS-STAR workflow result
            execution_result: Execution result
            
        Returns:
            Verification result
        """
        logger.info("Verifying execution results")
        
        # Check execution status
        execution_success = execution_result.get("status") == "success"
        
        # Check if output exists
        has_output = bool(execution_result.get("output"))
        
        # Calculate confidence
        confidence = 0.0
        if execution_success:
            confidence += 0.5
        if has_output:
            confidence += 0.3
        if ds_star_result.get("initial_verification", {}).get("is_valid"):
            confidence += 0.2
        
        return {
            "execution_success": execution_success,
            "has_output": has_output,
            "code_valid": ds_star_result.get("initial_verification", {}).get("is_valid", False),
            "confidence": min(1.0, confidence),
            "verified": confidence >= 0.7
        }
    
    async def install_tool(self, tool_name: str) -> bool:
        """
        Install additional tool in Docker environment
        
        Args:
            tool_name: Name of tool/package to install
            
        Returns:
            Success status
        """
        if not self.container:
            logger.warning("Cannot install tool: Docker not available")
            return False
        
        try:
            logger.info(f"Installing tool: {tool_name}")
            
            exec_result = self.container.exec_run(
                f"pip install --quiet {tool_name}"
            )
            
            success = exec_result.exit_code == 0
            if success:
                logger.info(f"Tool {tool_name} installed successfully")
            else:
                logger.warning(f"Failed to install {tool_name}")
            
            return success
            
        except Exception as e:
            logger.error(f"Error installing tool: {e}")
            return False
    
    async def execute_bash_command(self, command: str) -> Dict:
        """
        Execute bash command in Docker environment
        
        Args:
            command: Bash command to execute
            
        Returns:
            Command execution result
        """
        if not self.container:
            logger.warning("Cannot execute command: Docker not available")
            return {"status": "failed", "error": "Docker not available"}
        
        try:
            logger.info(f"Executing bash command: {command}")
            
            exec_result = self.container.exec_run(
                f"bash -c '{command}'",
                demux=True
            )
            
            stdout = exec_result.output[0].decode('utf-8') if exec_result.output[0] else ""
            stderr = exec_result.output[1].decode('utf-8') if exec_result.output[1] else ""
            
            return {
                "status": "success" if exec_result.exit_code == 0 else "failed",
                "exit_code": exec_result.exit_code,
                "stdout": stdout,
                "stderr": stderr
            }
            
        except Exception as e:
            logger.error(f"Command execution error: {e}")
            return {
                "status": "failed",
                "error": str(e)
            }
    
    async def cleanup_docker(self):
        """Cleanup Docker container"""
        if self.container:
            try:
                logger.info("Cleaning up Docker container")
                self.container.stop()
                self.container = None
            except Exception as e:
                logger.warning(f"Cleanup warning: {e}")
    
    def get_capabilities(self) -> List[str]:
        """
        Get list of agent capabilities
        
        Returns:
            List of capability strings
        """
        return [
            "ds_star_workflow",
            "code_generation",
            "docker_execution",
            "tool_installation",
            "bash_commands",
            "code_verification"
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
            "docker_available": self.docker_client is not None,
            "container_active": self.container is not None,
            "capabilities": self.get_capabilities()
        }
    
    def __del__(self):
        """Cleanup on deletion"""
        if self.container:
            try:
                self.container.stop()
            except:
                pass
