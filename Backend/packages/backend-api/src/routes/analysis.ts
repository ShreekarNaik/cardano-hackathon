import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// In-memory storage (replace with database in production)
const analyses = new Map<string, any>();

/**
 * POST /api/analysis/start
 * Start a new analysis task
 */
router.post(
  '/start',
  [
    body('description').isString().notEmpty().withMessage('Description is required'),
    body('totalSteps').optional().isInt({ min: 1 }).withMessage('Total steps must be positive'),
    body('useMaker').optional().isBoolean(),
    body('useHydra').optional().isBoolean()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      description,
      totalSteps = 1000,
      useMaker = true,
      useHydra = true
    } = req.body;

    const analysisId = uuidv4();

    const analysis = {
      id: analysisId,
      description,
      totalSteps,
      useMaker,
      useHydra,
      status: 'initializing',
      createdAt: new Date().toISOString(),
      progress: 0,
      result: null
    };

    analyses.set(analysisId, analysis);

    // Simulate async processing
    setTimeout(() => {
      const currentAnalysis = analyses.get(analysisId);
      if (currentAnalysis) {
        currentAnalysis.status = 'running';
        currentAnalysis.progress = 25;
      }
    }, 1000);

    res.status(202).json({
      analysisId,
      status: 'accepted',
      message: 'Analysis task created successfully',
      estimatedDuration: Math.ceil(totalSteps / 100) * 1000 // rough estimate in ms
    });
  }
);

/**
 * GET /api/analysis/:id/status
 * Get status of an analysis task
 */
router.get(
  '/:id/status',
  [param('id').isUUID().withMessage('Invalid analysis ID')],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const analysis = analyses.get(id);

    if (!analysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analysis not found'
      });
    }

    res.json({
      analysisId: analysis.id,
      status: analysis.status,
      progress: analysis.progress,
      createdAt: analysis.createdAt,
      completedAt: analysis.completedAt,
      error: analysis.error
    });
  }
);

/**
 * GET /api/analysis/:id/results
 * Get results of a completed analysis
 */
router.get(
  '/:id/results',
  [param('id').isUUID().withMessage('Invalid analysis ID')],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const analysis = analyses.get(id);

    if (!analysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analysis not found'
      });
    }

    if (analysis.status !== 'completed') {
      return res.status(400).json({
        error: 'Analysis Not Complete',
        message: `Analysis is currently ${analysis.status}`
      });
    }

    res.json({
      analysisId: analysis.id,
      result: analysis.result,
      metadata: {
        description: analysis.description,
        totalSteps: analysis.totalSteps,
        usedMaker: analysis.useMaker,
        usedHydra: analysis.useHydra,
        createdAt: analysis.createdAt,
        completedAt: analysis.completedAt
      }
    });
  }
);

/**
 * GET /api/analysis/list
 * List all analyses
 */
router.get('/list', (req: Request, res: Response) => {
  const { status, limit = 50, offset = 0 } = req.query;

  let analysesList = Array.from(analyses.values());

  // Filter by status if provided
  if (status) {
    analysesList = analysesList.filter(a => a.status === status);
  }

  // Sort by creation date (newest first)
  analysesList.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Pagination
  const paginatedList = analysesList.slice(
    Number(offset),
    Number(offset) + Number(limit)
  );

  res.json({
    analyses: paginatedList.map(a => ({
      id: a.id,
      description: a.description,
      status: a.status,
      progress: a.progress,
      createdAt: a.createdAt
    })),
    total: analysesList.length,
    limit: Number(limit),
    offset: Number(offset)
  });
});

/**
 * DELETE /api/analysis/:id
 * Cancel/delete an analysis
 */
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid analysis ID')],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const analysis = analyses.get(id);

    if (!analysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analysis not found'
      });
    }

    analyses.delete(id);

    res.json({
      message: 'Analysis deleted successfully',
      analysisId: id
    });
  }
);

export default router;
