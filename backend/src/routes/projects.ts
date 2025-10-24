import { Router, Response } from 'express';
import { dataService } from '../services/dataService.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const projects = dataService.getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ 
      error: { message: 'Failed to fetch projects' } 
    });
  }
});

export default router;
