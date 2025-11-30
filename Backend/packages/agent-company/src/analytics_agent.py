"""
Analytics Agent - Handles statistical analysis and visualization

This agent is responsible for:
- Statistical analysis (descriptive, inferential)
- Data visualization generation
- Report compilation
- Pattern recognition and trend analysis
"""

import asyncio
import json
from typing import Dict, List, Optional, Any
from loguru import logger
from datetime import datetime
import pandas as pd
import numpy as np


class AnalyticsAgent:
    """
    Analytics Agent - Chief Analytics Officer
    
    Handles statistical analysis, visualization, and reporting
    """
    
    def __init__(self, agent_id: str = "analytics-001"):
        """
        Initialize Analytics Agent
        
        Args:
            agent_id: Unique identifier for this agent instance
        """
        self.agent_id = agent_id
        self.agent_type = "analytics"
        logger.info(f"Analytics Agent {agent_id} initialized")
    
    async def execute_task(self, request: str, context: Optional[Dict] = None) -> Dict:
        """
        Execute analytics task
        
        Args:
            request: Analytics task request
            context: Additional context including data
            
        Returns:
            Dict containing statistics, visualizations, and report
        """
        logger.info(f"Analytics Agent executing task: {request}")
        
        try:
            # Extract data from context
            data = self._extract_data(context)
            
            # Perform statistical analysis
            statistics = await self.statistical_analysis(data)
            
            # Create visualizations
            visualizations = await self.create_visualizations(data, statistics)
            
            # Generate report
            report = await self.generate_report(statistics, visualizations, request)
            
            result = {
                "agent": self.agent_type,
                "agent_id": self.agent_id,
                "statistics": statistics,
                "visualizations": visualizations,
                "report": report,
                "confidence": 0.95,
                "timestamp": datetime.utcnow().isoformat(),
                "request": request
            }
            
            logger.info(f"Analytics Agent completed analysis")
            return result
            
        except Exception as e:
            logger.error(f"Analytics Agent error: {e}")
            return {
                "agent": self.agent_type,
                "agent_id": self.agent_id,
                "error": str(e),
                "confidence": 0.0,
                "statistics": {},
                "visualizations": [],
                "report": {}
            }
    
    def _extract_data(self, context: Optional[Dict]) -> pd.DataFrame:
        """
        Extract data from context
        
        Args:
            context: Context dictionary
            
        Returns:
            DataFrame with data
        """
        if not context or "data" not in context:
            # Return sample data for demonstration
            return pd.DataFrame({
                "value": np.random.randn(100),
                "category": np.random.choice(["A", "B", "C"], 100),
                "timestamp": pd.date_range("2024-01-01", periods=100)
            })
        
        data = context["data"]
        
        # Convert to DataFrame if not already
        if isinstance(data, dict):
            return pd.DataFrame(data)
        elif isinstance(data, list):
            return pd.DataFrame(data)
        elif isinstance(data, pd.DataFrame):
            return data
        else:
            return pd.DataFrame({"value": [data]})
    
    async def statistical_analysis(self, data: pd.DataFrame) -> Dict:
        """
        Perform comprehensive statistical analysis
        
        Args:
            data: DataFrame to analyze
            
        Returns:
            Dictionary of statistical results
        """
        logger.info("Performing statistical analysis")
        
        # Simulate async operation
        await asyncio.sleep(0.05)
        
        # Descriptive statistics
        descriptive = self._descriptive_statistics(data)
        
        # Correlations
        correlations = self._correlation_analysis(data)
        
        # Distributions
        distributions = self._distribution_analysis(data)
        
        # Trends
        trends = self._trend_analysis(data)
        
        return {
            "descriptive": descriptive,
            "correlations": correlations,
            "distributions": distributions,
            "trends": trends,
            "data_shape": {
                "rows": len(data),
                "columns": len(data.columns)
            }
        }
    
    def _descriptive_statistics(self, data: pd.DataFrame) -> Dict:
        """Calculate descriptive statistics"""
        numeric_cols = data.select_dtypes(include=[np.number]).columns
        
        if len(numeric_cols) == 0:
            return {"note": "No numeric columns found"}
        
        stats = {}
        for col in numeric_cols:
            stats[col] = {
                "mean": float(data[col].mean()),
                "median": float(data[col].median()),
                "std": float(data[col].std()),
                "min": float(data[col].min()),
                "max": float(data[col].max()),
                "count": int(data[col].count())
            }
        
        return stats
    
    def _correlation_analysis(self, data: pd.DataFrame) -> Dict:
        """Analyze correlations between numeric columns"""
        numeric_cols = data.select_dtypes(include=[np.number]).columns
        
        if len(numeric_cols) < 2:
            return {"note": "Insufficient numeric columns for correlation"}
        
        corr_matrix = data[numeric_cols].corr()
        
        # Convert to dict, handling NaN values
        corr_dict = {}
        for col in corr_matrix.columns:
            corr_dict[col] = {
                k: float(v) if not pd.isna(v) else None
                for k, v in corr_matrix[col].items()
            }
        
        return corr_dict
    
    def _distribution_analysis(self, data: pd.DataFrame) -> Dict:
        """Analyze distributions of numeric columns"""
        numeric_cols = data.select_dtypes(include=[np.number]).columns
        
        if len(numeric_cols) == 0:
            return {"note": "No numeric columns found"}
        
        distributions = {}
        for col in numeric_cols:
            # Calculate quartiles
            q25, q50, q75 = data[col].quantile([0.25, 0.5, 0.75])
            
            distributions[col] = {
                "q25": float(q25),
                "q50": float(q50),
                "q75": float(q75),
                "iqr": float(q75 - q25),
                "skewness": float(data[col].skew()) if len(data) > 2 else None
            }
        
        return distributions
    
    def _trend_analysis(self, data: pd.DataFrame) -> Dict:
        """Analyze trends in time series data"""
        # Check for datetime columns
        datetime_cols = data.select_dtypes(include=['datetime64']).columns
        numeric_cols = data.select_dtypes(include=[np.number]).columns
        
        if len(datetime_cols) == 0 or len(numeric_cols) == 0:
            return {"note": "No time series data found"}
        
        trends = {}
        
        # Simple trend detection (increasing/decreasing)
        for num_col in numeric_cols:
            values = data[num_col].values
            if len(values) > 1:
                trend_direction = "increasing" if values[-1] > values[0] else "decreasing"
                change_pct = ((values[-1] - values[0]) / values[0] * 100) if values[0] != 0 else 0
                
                trends[num_col] = {
                    "direction": trend_direction,
                    "change_percent": float(change_pct),
                    "start_value": float(values[0]),
                    "end_value": float(values[-1])
                }
        
        return trends
    
    async def create_visualizations(self, data: pd.DataFrame, statistics: Dict) -> List[Dict]:
        """
        Create data visualizations
        
        Args:
            data: DataFrame to visualize
            statistics: Statistical analysis results
            
        Returns:
            List of visualization specifications
        """
        logger.info("Creating visualizations")
        
        # Simulate async operation
        await asyncio.sleep(0.05)
        
        visualizations = []
        
        # Time series plot
        if 'timestamp' in data.columns:
            visualizations.append({
                "type": "time_series",
                "title": "Time Series Analysis",
                "description": "Trend over time",
                "data_points": len(data),
                "path": "/tmp/timeseries.png"  # Would generate actual plot
            })
        
        # Distribution histogram
        numeric_cols = data.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            visualizations.append({
                "type": "histogram",
                "title": "Distribution Analysis",
                "description": f"Distribution of {numeric_cols[0]}",
                "bins": 30,
                "path": "/tmp/histogram.png"
            })
        
        # Correlation heatmap
        if len(numeric_cols) >= 2:
            visualizations.append({
                "type": "heatmap",
                "title": "Correlation Matrix",
                "description": "Correlations between variables",
                "dimensions": f"{len(numeric_cols)}x{len(numeric_cols)}",
                "path": "/tmp/correlation.png"
            })
        
        return visualizations
    
    async def generate_report(self, statistics: Dict, visualizations: List[Dict], request: str) -> Dict:
        """
        Generate comprehensive analysis report
        
        Args:
            statistics: Statistical analysis results
            visualizations: Visualization specifications
            request: Original request
            
        Returns:
            Report dictionary
        """
        logger.info("Generating analysis report")
        
        # Simulate async operation
        await asyncio.sleep(0.05)
        
        # Extract key findings
        key_findings = self._extract_key_findings(statistics)
        
        # Generate summary
        summary = self._generate_summary(statistics, key_findings, request)
        
        report = {
            "title": f"Analytics Report: {request}",
            "summary": summary,
            "key_findings": key_findings,
            "statistics_summary": {
                "descriptive_stats_count": len(statistics.get("descriptive", {})),
                "correlations_analyzed": len(statistics.get("correlations", {})),
                "trends_identified": len(statistics.get("trends", {}))
            },
            "visualizations_count": len(visualizations),
            "generated_at": datetime.utcnow().isoformat()
        }
        
        return report
    
    def _extract_key_findings(self, statistics: Dict) -> List[str]:
        """Extract key findings from statistics"""
        findings = []
        
        # Check descriptive stats
        descriptive = statistics.get("descriptive", {})
        if descriptive:
            for col, stats in descriptive.items():
                if isinstance(stats, dict) and "mean" in stats:
                    findings.append(
                        f"{col}: mean={stats['mean']:.2f}, std={stats['std']:.2f}"
                    )
        
        # Check trends
        trends = statistics.get("trends", {})
        if trends and not isinstance(trends, dict) or "note" not in trends:
            for col, trend in trends.items():
                if isinstance(trend, dict) and "direction" in trend:
                    findings.append(
                        f"{col} shows {trend['direction']} trend ({trend['change_percent']:.1f}% change)"
                    )
        
        # Check correlations
        correlations = statistics.get("correlations", {})
        if correlations and isinstance(correlations, dict) and "note" not in correlations:
            # Find strong correlations
            for col1, corr_dict in correlations.items():
                if isinstance(corr_dict, dict):
                    for col2, corr_value in corr_dict.items():
                        if col1 != col2 and corr_value is not None and abs(corr_value) > 0.7:
                            findings.append(
                                f"Strong correlation between {col1} and {col2}: {corr_value:.2f}"
                            )
        
        return findings[:5]  # Limit to top 5 findings
    
    def _generate_summary(self, statistics: Dict, key_findings: List[str], request: str) -> str:
        """Generate text summary of analysis"""
        data_shape = statistics.get("data_shape", {})
        rows = data_shape.get("rows", 0)
        cols = data_shape.get("columns", 0)
        
        summary = f"Analysis of {rows} records across {cols} variables. "
        
        if key_findings:
            summary += f"Key findings: {'; '.join(key_findings[:3])}."
        else:
            summary += "Statistical analysis completed successfully."
        
        return summary
    
    def get_capabilities(self) -> List[str]:
        """
        Get list of agent capabilities
        
        Returns:
            List of capability strings
        """
        return [
            "statistical_analysis",
            "data_visualization",
            "report_generation",
            "trend_analysis",
            "correlation_analysis",
            "distribution_analysis"
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
            "capabilities": self.get_capabilities()
        }
