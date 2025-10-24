import { Router, Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { LoginRequest } from '../types/index.js';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      res.status(400).json({ 
        error: { message: 'Email and password are required' } 
      });
      return;
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ 
      error: { message: 'Invalid credentials' } 
    });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      authService.logout(token);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ 
      error: { message: 'Logout failed' } 
    });
  }
});

export default router;
