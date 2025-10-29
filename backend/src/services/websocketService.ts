import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Cluster } from '../types/index.js';

class WebSocketService {
  private io: SocketIOServer | null = null;

  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
      },
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  handleExternalDataChange(previousClusters: Cluster[], newClusters: Cluster[]) {
    const previousMap = new Map(previousClusters.map(c => [c.id, c]));
    const newMap = new Map(newClusters.map(c => [c.id, c]));

    // Detect created clusters
    newClusters.forEach(cluster => {
      if (!previousMap.has(cluster.id)) {
        this.broadcastClusterCreated(cluster);
      }
    });

    // Detect updated clusters
    newClusters.forEach(cluster => {
      const previous = previousMap.get(cluster.id);
      if (previous && JSON.stringify(previous) !== JSON.stringify(cluster)) {
        this.broadcastClusterUpdate(cluster);
        
        if (previous.status !== cluster.status) {
          this.broadcastClusterStatusChange(cluster.id, cluster.status);
        }
      }
    });

    // Detect deleted clusters
    previousClusters.forEach(cluster => {
      if (!newMap.has(cluster.id)) {
        this.broadcastClusterDeleted(cluster.id);
      }
    });
  }

  broadcastClusterUpdate(cluster: Cluster) {
    if (this.io) {
      this.io.emit('cluster:updated', cluster);
    }
  }

  broadcastClusterCreated(cluster: Cluster) {
    if (this.io) {
      this.io.emit('cluster:created', cluster);
    }
  }

  broadcastClusterDeleted(clusterId: string) {
    if (this.io) {
      this.io.emit('cluster:deleted', clusterId);
    }
  }

  broadcastClusterStatusChange(clusterId: string, status: Cluster['status']) {
    if (this.io) {
      this.io.emit('cluster:status', { clusterId, status });
    }
  }
}

export const websocketService = new WebSocketService();
