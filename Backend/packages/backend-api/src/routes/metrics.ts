import { Router, Request, Response } from 'express';

const router = Router();

router.get('/dashboard', (req: Request, res: Response) => {
  res.json({ metrics: { analyses: 0, agents: 0 }, message: 'Dashboard metrics' });
});

export default router;
