import { Router, Response } from 'express';
import { dataService } from '../services/dataService.js';

const router = Router();

router.get('/regions', (req, res: Response) => {
  try {
    const regions = dataService.getRegions();
    res.json(regions);
  } catch (error) {
    res.status(500).json({ 
      error: { message: 'Failed to fetch regions' } 
    });
  }
});

router.get('/versions', (req, res: Response) => {
  try {
    const versions = dataService.getVersions();
    res.json(versions);
  } catch (error) {
    res.status(500).json({ 
      error: { message: 'Failed to fetch versions' } 
    });
  }
});

export default router;
