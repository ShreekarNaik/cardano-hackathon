/**
 * Agent Company Routes
 * Handles task submission and management for the AI Agent Company
 */

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAgentCompanyClient } from '../clients/agent-company-client';
import { logger } from '../utils/logger';

const router = Router();

// In-memory task storage (in production, use Redis or database)
const tasks = new Map<string, any>();

/**
 * POST /api/agent-company/task
 * Submit a new task to the Agent Company
 */
router.post('/task', async (req: Request, res: Response) => {
    try {
        const { request, context } = req.body;

        // Validate input
        if (!request || typeof request !== 'string') {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Request must be a non-empty string',
            });
        }

        // Generate task ID
        const taskId = uuidv4();

        // Get Agent Company client
        const agentClient = getAgentCompanyClient();

        // Store task with pending status
        tasks.set(taskId, {
            taskId,
            request,
            context,
            status: 'processing',
            submittedAt: new Date().toISOString(),
        });

        logger.info(`Submitting task ${taskId} to Agent Company`);

        // Submit to Agent Company (async, don't wait)
        agentClient.submitTask({ request, context })
            .then((result) => {
                // Update task with result
                tasks.set(taskId, {
                    ...tasks.get(taskId),
                    status: 'completed',
                    result: result,
                    completedAt: new Date().toISOString(),
                });
                logger.info(`Task ${taskId} completed successfully`);
            })
            .catch((error) => {
                // Update task with error
                tasks.set(taskId, {
                    ...tasks.get(taskId),
                    status: 'failed',
                    error: error.message,
                    failedAt: new Date().toISOString(),
                });
                logger.error(`Task ${taskId} failed: ${error.message}`);
            });

        // Return task ID immediately
        res.json({
            taskId,
            status: 'accepted',
            message: 'Task submitted to Agent Company',
            request,
        });

    } catch (error: any) {
        logger.error(`Error submitting task: ${error.message}`);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
});

/**
 * GET /api/agent-company/task/:taskId
 * Get task status and results
 */
router.get('/task/:taskId', (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;

        const task = tasks.get(taskId);

        if (!task) {
            return res.status(404).json({
                error: 'Task not found',
                message: `No task found with ID: ${taskId}`,
            });
        }

        res.json(task);

    } catch (error: any) {
        logger.error(`Error getting task status: ${error.message}`);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
});

/**
 * DELETE /api/agent-company/task/:taskId
 * Cancel a task
 */
router.delete('/task/:taskId', async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;

        const task = tasks.get(taskId);

        if (!task) {
            return res.status(404).json({
                error: 'Task not found',
                message: `No task found with ID: ${taskId}`,
            });
        }

        if (task.status === 'completed' || task.status === 'failed') {
            return res.status(400).json({
                error: 'Cannot cancel task',
                message: `Task is already ${task.status}`,
            });
        }

        // Update task status
        tasks.set(taskId, {
            ...task,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
        });

        res.json({
            message: 'Task cancelled successfully',
            taskId,
        });

    } catch (error: any) {
        logger.error(`Error cancelling task: ${error.message}`);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
});

/**
 * GET /api/agent-company/status
 * Get Agent Company service status
 */
router.get('/status', async (req: Request, res: Response) => {
    try {
        const agentClient = getAgentCompanyClient();
        const isHealthy = await agentClient.healthCheck();

        res.json({
            service: 'Agent Company',
            healthy: isHealthy,
            activeTasks: tasks.size,
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        logger.error(`Error getting Agent Company status: ${error.message}`);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
});

/**
 * POST /api/agent-company/chat
 * Legacy chat endpoint (converts to task format)
 */
router.post('/chat', async (req: Request, res: Response) => {
    res.json({
        message: 'Please use /api/agent-company/task endpoint',
        redirectTo: '/api/agent-company/task'
    });
});


/**
 * GET /api/agent-company/metrics
 * Get Agent Company metrics
 */
router.get('/metrics', (req: Request, res: Response) => {
    const completedTasks = Array.from(tasks.values()).filter(t => t.status === 'completed').length;
    const failedTasks = Array.from(tasks.values()).filter(t => t.status === 'failed').length;
    const processingTasks = Array.from(tasks.values()).filter(t => t.status === 'processing').length;

    res.json({
        totalTasks: tasks.size,
        completedTasks,
        failedTasks,
        processingTasks,
        timestamp: new Date().toISOString(),
    });
});

export default router;
