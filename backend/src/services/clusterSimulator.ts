import { websocketService } from './websocketService.js';
import { dataService } from './dataService.js';
import { Cluster } from '../types/index.js';

class ClusterSimulator {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  simulateClusterProvisioning(clusterId: string) {
    if (this.intervals.has(clusterId)) {
      return;
    }

    const interval = setInterval(async () => {
      const cluster = dataService.getClusterById(clusterId);
      
      if (!cluster) {
        this.stopSimulation(clusterId);
        return;
      }

      if (cluster.status === 'pending') {
        const updatedCluster = await dataService.updateCluster(clusterId, {
          status: 'running' as const,
        });
        websocketService.broadcastClusterStatusChange(clusterId, 'running');
        this.stopSimulation(clusterId);
      }
    }, 5000);

    this.intervals.set(clusterId, interval);
  }

  stopSimulation(clusterId: string) {
    const interval = this.intervals.get(clusterId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(clusterId);
    }
  }

  stopAllSimulations() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
  }
}

export const clusterSimulator = new ClusterSimulator();
