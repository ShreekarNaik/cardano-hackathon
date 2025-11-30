/**
 * Agent Company Client
 * 
 * HTTP client to communicate with Python Agent Company service
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

export interface TaskRequest {
    request: string;
    context?: Record<string, any>;
}

export interface TaskResult {
    taskId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: any;
    error?: string;
    timestamp: string;
}

export interface TaskStatus {
    taskId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    result?: any;
    error?: string;
}

export class AgentCompanyClient {
    private client: AxiosInstance;
    private baseURL: string;

    constructor(baseURL: string = process.env.AGENT_COMPANY_URL || 'http://localhost:8000') {
        this.baseURL = baseURL;
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 30000, // 30 second timeout
            headers: {
                'Content-Type': 'application/json',
            },
        });

        logger.info(`Agent Company Client initialized: ${this.baseURL}`);
    }

    /**
     * Submit a task to the Agent Company
     */
    async submitTask(taskRequest: TaskRequest): Promise<TaskResult> {
        try {
            logger.info(`Submitting task to Agent Company: ${taskRequest.request.substring(0, 100)}...`);

            const response = await this.client.post('/api/task', {
                request: taskRequest.request,
                context: taskRequest.context || {},
            });

            logger.info(`Task submitted successfully: ${response.data.taskId}`);
            return response.data;

        } catch (error: any) {
            logger.error(`Failed to submit task: ${error.message}`);
            throw new Error(`Agent Company submission failed: ${error.message}`);
        }
    }

    /**
     * Get task status
     */
    async getTaskStatus(taskId: string): Promise<TaskStatus> {
        try {
            const response = await this.client.get(`/api/task/${taskId}`);
            return response.data;

        } catch (error: any) {
            logger.error(`Failed to get task status: ${error.message}`);
            throw new Error(`Failed to get task status: ${error.message}`);
        }
    }

    /**
     * Cancel a task
     */
    async cancelTask(taskId: string): Promise<void> {
        try {
            await this.client.delete(`/api/task/${taskId}`);
            logger.info(`Task cancelled: ${taskId}`);

        } catch (error: any) {
            logger.error(`Failed to cancel task: ${error.message}`);
            throw new Error(`Failed to cancel task: ${error.message}`);
        }
    }

    /**
     * Check if Agent Company service is healthy
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.client.get('/health');
            return response.data.status === 'healthy';

        } catch (error) {
            logger.warn('Agent Company health check failed');
            return false;
        }
    }

    /**
     * Get Agent Company status
     */
    async getStatus(): Promise<any> {
        try {
            const response = await this.client.get('/api/status');
            return response.data;

        } catch (error: any) {
            logger.error(`Failed to get Agent Company status: ${error.message}`);
            throw new Error(`Failed to get status: ${error.message}`);
        }
    }
}

// Singleton instance
let agentCompanyClient: AgentCompanyClient | null = null;

export function getAgentCompanyClient(): AgentCompanyClient {
    if (!agentCompanyClient) {
        agentCompanyClient = new AgentCompanyClient();
    }
    return agentCompanyClient;
}
