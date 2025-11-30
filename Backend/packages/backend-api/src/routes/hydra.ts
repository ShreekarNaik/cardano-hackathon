import { Router, Request, Response } from 'express';

const router = Router();

router.get('/heads', (req: Request, res: Response) => {
  res.json({ heads: [], message: 'Hydra heads list' });
});

router.get('/heads/:id', (req: Request, res: Response) => {
  res.json({ head: null, message: 'Hydra head details' });
});

export default router;
