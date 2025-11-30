import { Router, Request, Response } from 'express';

const router = Router();

router.get('/list', (req: Request, res: Response) => {
  res.json({ agents: [], message: 'Agents list endpoint' });
});

router.get('/:id', (req: Request, res: Response) => {
  res.json({ agent: null, message: 'Agent details endpoint' });
});

export default router;
