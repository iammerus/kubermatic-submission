import { Router, Response } from 'express';
import { dataService } from '../services/dataService.js';
import { validationService } from '../services/validationService.js';
import { websocketService } from '../services/websocketService.js';
import { clusterSimulator } from '../services/clusterSimulator.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { Cluster } from '../types/index.js';

const router = Router();

// Get clusters for a project
router.get('/projects/:projectId/clusters', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const clusters = dataService.getClusters(projectId);
    res.json(clusters);
  } catch (error) {
    res.status(500).json({
      error: { message: 'Failed to fetch clusters' }
    });
  }
});

// Create a new cluster
router.post('/projects/:projectId/clusters', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const clusterData = req.body;

    // Validate project exists
    const project = dataService.getProjectById(projectId);
    if (!project) {
      res.status(404).json({
        error: { message: 'Project not found' }
      });
      return;
    }

    // Validate cluster data
    const errors = validationService.validateCluster(clusterData, projectId, false);
    if (errors.length > 0) {
      res.status(400).json({
        error: {
          message: 'Validation failed',
          errors
        }
      });
      return;
    }

    // Create cluster
    const newCluster = await dataService.createCluster({
      ...clusterData,
      projectId,
      status: 'pending' as const,
    });

    websocketService.broadcastClusterCreated(newCluster);
    clusterSimulator.simulateClusterProvisioning(newCluster.id);
    res.status(201).json(newCluster);
  } catch (error) {
    res.status(500).json({
      error: { message: 'Failed to create cluster' }
    });
  }
});

// Update a cluster
router.put('/clusters/:clusterId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { clusterId } = req.params;
    const updates = req.body;

    // Check if cluster exists
    const existingCluster = dataService.getClusterById(clusterId);
    if (!existingCluster) {
      res.status(404).json({
        error: { message: 'Cluster not found' }
      });
      return;
    }

    // Validate updates
    const errors = validationService.validateCluster(
      { ...updates, id: clusterId },
      existingCluster.projectId,
      true
    );
    if (errors.length > 0) {
      res.status(400).json({
        error: {
          message: 'Validation failed',
          errors
        }
      });
      return;
    }

    // Update cluster
    const updatedCluster = await dataService.updateCluster(clusterId, updates);
    websocketService.broadcastClusterUpdate(updatedCluster);
    res.json(updatedCluster);
  } catch (error) {
    res.status(500).json({
      error: { message: 'Failed to update cluster' }
    });
  }
});

// Delete a cluster
router.delete('/clusters/:clusterId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { clusterId } = req.params;

    // Check if cluster exists
    const existingCluster = dataService.getClusterById(clusterId);
    if (!existingCluster) {
      res.status(404).json({
        error: { message: 'Cluster not found' }
      });
      return;
    }

    await dataService.deleteCluster(clusterId);
    websocketService.broadcastClusterDeleted(clusterId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: { message: 'Failed to delete cluster' }
    });
  }
});

export default router;
