import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';

export interface AuthRequest extends Request {
  user?: {
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: { message: 'No token provided' } });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
};
