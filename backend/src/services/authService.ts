import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { User, UsersData, LoginResponse } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '1h';

// In-memory session store for active tokens
const activeSessions = new Set<string>();

export class AuthService {
  private users: User[] = [];

  async loadUsers(): Promise<void> {
    const usersPath = path.join(process.cwd(), 'mock', 'users.json');
    const data = await fs.readFile(usersPath, 'utf-8');
    const usersData: UsersData = JSON.parse(data);
    this.users = usersData.users;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    activeSessions.add(token);

    return {
      token,
      user: {
        id: user.email,
        email: user.email,
        name: user.name,
      },
    };
  }

  logout(token: string): void {
    activeSessions.delete(token);
  }

  verifyToken(token: string): { email: string; role: string } {
    if (!activeSessions.has(token)) {
      throw new Error('Session expired or invalid');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string; role: string };
      return decoded;
    } catch (error) {
      activeSessions.delete(token);
      throw new Error('Invalid token');
    }
  }

  isSessionActive(token: string): boolean {
    return activeSessions.has(token);
  }
}

export const authService = new AuthService();
