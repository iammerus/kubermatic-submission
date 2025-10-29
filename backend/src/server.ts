import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import clustersRoutes from './routes/clusters.js';
import referenceRoutes from './routes/reference.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authService } from './services/authService.js';
import { dataService } from './services/dataService.js';
import { websocketService } from './services/websocketService.js';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'K8s Cluster Manager API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api', clustersRoutes);
app.use('/api', referenceRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Initialize and start server
async function startServer() {
  try {
    await authService.loadUsers();
    await dataService.loadData();
    
    websocketService.initialize(httpServer);
    
    // Watch for external file changes and broadcast via WebSocket
    dataService.onDataChange((previousClusters, newClusters) => {
      websocketService.handleExternalDataChange(previousClusters, newClusters);
    });
    dataService.startWatching();
    
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`WebSocket available at ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
